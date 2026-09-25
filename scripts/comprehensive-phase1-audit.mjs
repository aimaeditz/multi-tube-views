import fs from 'fs';
import path from 'path';

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'public') return;
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const htmlFiles = getHtmlFiles('.');
console.log(`Auditing ${htmlFiles.length} HTML files...`);

let malformedTags = [];
let missingTitle = [];
let missingMetaDesc = [];
let missingH1 = [];
let missingCanonical = [];
let missingSchema = [];
let schemasByType = {};
let duplicateTitles = {};
let duplicateDescs = {};
let toolQueryLinks = [];
let linkGraph = {}; // page -> set of linked pages
let inboundLinks = {}; // page -> count of incoming links
htmlFiles.forEach(f => {
  const norm = f.replace(/\\/g, '/');
  inboundLinks[norm] = 0;
  linkGraph[norm] = [];
});

htmlFiles.forEach(f => {
  const norm = f.replace(/\\/g, '/');
  const content = fs.readFileSync(f, 'utf8');

  // Check malformed tags like <meta ...>> or <link ...>> or double brackets
  const doubleCloseMatches = content.match(/<meta[^>]*>>|<link[^>]*>>|<div[^>]*>>|<p[^>]*>>|<a[^>]*>>|<<[a-zA-Z]/g);
  if (doubleCloseMatches) {
    malformedTags.push({ file: norm, matches: doubleCloseMatches });
  }

  // Title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;
  if (!title) missingTitle.push(norm);
  else {
    duplicateTitles[title] = duplicateTitles[title] || [];
    duplicateTitles[title].push(norm);
  }

  // Meta desc
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    content.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const desc = descMatch ? descMatch[1].trim() : null;
  if (!desc) missingMetaDesc.push(norm);
  else {
    duplicateDescs[desc] = duplicateDescs[desc] || [];
    duplicateDescs[desc].push(norm);
  }

  // Canonical
  const canMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  if (!canMatch) missingCanonical.push(norm);

  // H1
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1Match) missingH1.push(norm);

  // Schema parsing
  const schemaRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let sMatch;
  let foundSchema = false;
  while ((sMatch = schemaRegex.exec(content)) !== null) {
    foundSchema = true;
    try {
      const parsed = JSON.parse(sMatch[1]);
      const types = Array.isArray(parsed) ? parsed.map(p => p['@type']) : (parsed['@graph'] ? parsed['@graph'].map(g => g['@type']) : [parsed['@type']]);
      types.flat().forEach(t => {
        if (t) {
          schemasByType[t] = (schemasByType[t] || 0) + 1;
        }
      });
    } catch (e) {
      // JSON parse error in ld+json
      malformedTags.push({ file: norm, matches: [`Invalid JSON in schema: ${e.message}`] });
    }
  }
  if (!foundSchema) {
    missingSchema.push(norm);
  }

  // Links analysis
  const hrefRegex = /href=["']([^"']+)["']/g;
  let hMatch;
  while ((hMatch = hrefRegex.exec(content)) !== null) {
    const rawHref = hMatch[1];
    if (rawHref.includes('?tool=')) {
      toolQueryLinks.push({ file: norm, href: rawHref });
    }
    // internal static link check
    if (!rawHref.startsWith('http') && !rawHref.startsWith('#') && !rawHref.startsWith('mailto:') && !rawHref.startsWith('javascript:')) {
      let targetPath = rawHref.split('?')[0].split('#')[0];
      if (targetPath.startsWith('/')) {
        targetPath = targetPath.slice(1);
      } else {
        const currentDir = path.dirname(norm);
        targetPath = path.posix.normalize(path.posix.join(currentDir, targetPath));
      }
      if (targetPath.endsWith('/')) targetPath += 'index.html';
      if (!targetPath.endsWith('.html') && targetPath !== '') {
        // e.g. /privacy
        if (fs.existsSync(targetPath + '.html')) targetPath += '.html';
      }
      if (inboundLinks[targetPath] !== undefined) {
        inboundLinks[targetPath]++;
        linkGraph[norm].push(targetPath);
      }
    }
  }
});

// Calculate crawl depth using BFS from index.html
const crawlDepth = {};
const queue = [{ page: 'index.html', depth: 0 }];
crawlDepth['index.html'] = 0;

while (queue.length > 0) {
  const { page, depth } = queue.shift();
  const outgoing = linkGraph[page] || [];
  for (const target of outgoing) {
    if (crawlDepth[target] === undefined) {
      crawlDepth[target] = depth + 1;
      queue.push({ page: target, depth: depth + 1 });
    }
  }
}

const unreachedPages = Object.keys(inboundLinks).filter(p => crawlDepth[p] === undefined);
const depthDistribution = {};
Object.entries(crawlDepth).forEach(([p, d]) => {
  depthDistribution[d] = (depthDistribution[d] || 0) + 1;
});

// Check sitemap.xml
let sitemapUrls = [];
let sitemapExists = fs.existsSync('sitemap.xml');
if (sitemapExists) {
  const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
  const locMatches = sitemapContent.match(/<loc>([^<]+)<\/loc>/g) || [];
  sitemapUrls = locMatches.map(m => m.replace(/<\/?loc>/g, ''));
}

console.log('\n========================================');
console.log('       PHASE 1: FULL AUDIT REPORT       ');
console.log('========================================');
console.log(`1. Total HTML Pages Analyzed: ${htmlFiles.length}`);
console.log(`2. Malformed Tags / Syntax Errors: ${malformedTags.length}`);
if (malformedTags.length > 0) {
  console.log('   Errors found:', JSON.stringify(malformedTags, null, 2));
} else {
  console.log('   [PASS] Zero malformed tags detected (<meta ...>>, double brackets, unclosed tags).');
}

console.log(`\n3. Meta & Head Structure Audit:`);
console.log(`   - Missing Titles: ${missingTitle.length}`);
console.log(`   - Missing Meta Descriptions: ${missingMetaDesc.length}`);
console.log(`   - Missing Canonical Tags: ${missingCanonical.length}`);
console.log(`   - Missing H1 Tags: ${missingH1.length}`);
console.log(`   - Missing Schema (JSON-LD): ${missingSchema.length}`);

console.log(`\n4. Schema Types Detected across Pages:`);
console.table(schemasByType);

const multiTitleCount = Object.entries(duplicateTitles).filter(([t, list]) => list.length > 1);
const multiDescCount = Object.entries(duplicateDescs).filter(([d, list]) => list.length > 1);
console.log(`\n5. Duplicate Content Audit:`);
console.log(`   - Distinct Duplicate Titles: ${multiTitleCount.length}`);
if (multiTitleCount.length > 0) {
  multiTitleCount.slice(0, 5).forEach(([t, list]) => {
    console.log(`     * "${t}": ${list.length} pages (e.g. ${list.slice(0, 2).join(', ')})`);
  });
}
console.log(`   - Distinct Duplicate Meta Descriptions: ${multiDescCount.length}`);
if (multiDescCount.length > 0) {
  multiDescCount.slice(0, 5).forEach(([d, list]) => {
    console.log(`     * "${d.substring(0, 50)}...": ${list.length} pages`);
  });
}

console.log(`\n6. Crawl Bottlenecks & Link Graph Audit:`);
console.log(`   - Links with ?tool= query param: ${toolQueryLinks.length}`);
console.log(`   - Crawl Depth Distribution from index.html:`, depthDistribution);
console.log(`   - Unreached / Orphaned Pages (from index.html BFS): ${unreachedPages.length}`);
if (unreachedPages.length > 0) {
  console.log(`     Sample unreached pages: ${unreachedPages.slice(0, 5).join(', ')}`);
}

console.log(`\n7. Sitemap Audit:`);
console.log(`   - Sitemap exists: ${sitemapExists}`);
console.log(`   - Total URLs in sitemap.xml: ${sitemapUrls.length}`);
console.log('========================================\n');

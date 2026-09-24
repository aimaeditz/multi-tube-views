import fs from 'fs';
import path from 'path';

function getFiles(dir, ext = '.html') {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (f === 'node_modules' || f === 'dist' || f === '.git' || f === 'public') continue;
    const s = fs.statSync(p);
    if (s.isDirectory()) res.push(...getFiles(p, ext));
    else if (f.endsWith(ext)) res.push(p);
  }
  return res;
}

const htmlFiles = getFiles('.');
let titlesUnder50 = 0, titlesOver60 = 0, titlesOptimal = 0;
let metaUnder135 = 0, metaOver155 = 0, metaOptimal = 0;
let schemaCounts = { WebApplication: 0, SoftwareApplication: 0, BreadcrumbList: 0, FAQPage: 0, HowTo: 0 };
let hasFaqHtml = 0;

htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  
  // Title
  const tm = content.match(/<title>([^<]+)<\/title>/i);
  if (tm) {
    const l = tm[1].trim().length;
    if (l < 50) titlesUnder50++;
    else if (l > 60) titlesOver60++;
    else titlesOptimal++;
  }

  // Meta
  const dm = content.match(/<meta\s+(?:name=["']description["']\s+content=["']([^"']+)["']|content=["']([^"']+)["']\s+name=["']description["'])/i);
  const desc = dm ? (dm[1] || dm[2]).trim() : '';
  if (desc) {
    const l = desc.length;
    if (l < 135) metaUnder135++;
    else if (l > 155) metaOver155++;
    else metaOptimal++;
  }

  // Schemas
  const sm = content.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  if (sm) {
    const sc = sm[1];
    if (sc.includes('"WebApplication"')) schemaCounts.WebApplication++;
    if (sc.includes('"SoftwareApplication"')) schemaCounts.SoftwareApplication++;
    if (sc.includes('"BreadcrumbList"')) schemaCounts.BreadcrumbList++;
    if (sc.includes('"FAQPage"')) schemaCounts.FAQPage++;
    if (sc.includes('"HowTo"')) schemaCounts.HowTo++;
  }

  if (content.includes('faq-section') || content.includes('Frequently Asked Questions')) {
    hasFaqHtml++;
  }
});

console.log('=== SEO METRICS POST PHASE 3/4 ===');
console.log('Total HTML pages:', htmlFiles.length);
console.log('Titles: Optimal (50-60 chars):', titlesOptimal, '| Under 50:', titlesUnder50, '| Over 60:', titlesOver60);
console.log('Meta Desc: Optimal (135-155 chars):', metaOptimal, '| Under 135:', metaUnder135, '| Over 155:', metaOver155);
console.log('Schema Distribution:', schemaCounts);
console.log('Pages with FAQ Section in HTML:', hasFaqHtml);

// Link graph
const linkGraph = {};
htmlFiles.forEach(f => linkGraph[f] = new Set());
htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const dir = path.dirname(f);
  const hrefMatches = content.matchAll(/href=["']([^"'#?]+)["']/gi);
  for (const match of hrefMatches) {
    let target = match[1].trim();
    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('//') || target.startsWith('mailto:') || target.startsWith('tel:') || target.startsWith('javascript:')) continue;
    let resolved = path.normalize(path.join(dir, target)).replace(/\\/g, '/');
    if (resolved.startsWith('./')) resolved = resolved.slice(2);
    if (htmlFiles.includes(resolved)) {
      linkGraph[f].add(resolved);
    }
  }
});

const depth = { 'index.html': 0 };
const queue = ['index.html'];
while (queue.length > 0) {
  const curr = queue.shift();
  const d = depth[curr];
  for (const next of linkGraph[curr]) {
    if (depth[next] === undefined) {
      depth[next] = d + 1;
      queue.push(next);
    }
  }
}

let depthDist = {};
let unreached = [];
htmlFiles.forEach(f => {
  const d = depth[f];
  if (d === undefined) unreached.push(f);
  else depthDist[d] = (depthDist[d] || 0) + 1;
});

console.log('\nCrawl Depth from index.html:');
console.log(depthDist);
console.log('Unreached from index.html:', unreached.length, unreached);

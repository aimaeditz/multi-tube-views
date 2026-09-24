import fs from 'fs';
import path from 'path';
import {
  getOptimalTitle,
  getOptimalMeta,
  getFaqs,
  getHowToSteps,
  getCrossCategoryLinks,
  renderFaqHtml
} from './upgrade-all-pages-seo.mjs';

const ROOT = path.resolve('.');

function processHtmlFile(filePath, section) {
  let content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, '.html');

  // Extract current title
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch) return { skipped: true, reason: 'no title' };
  const currentTitle = titleMatch[1].trim();

  // Extract clean tool name from title or H1
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  let toolName = fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  if (h1Match) {
    const rawH1 = h1Match[1].replace(/<[^>]+>/g, '').trim();
    if (rawH1 && rawH1.length < 50) {
      toolName = rawH1;
    }
  }

  // Extract description
  const descMatch = content.match(/<meta\s+(?:name=["']description["']\s+content=["']([^"']+)["']|content=["']([^"']+)["']\s+name=["']description["'])/i);
  let currentDesc = descMatch ? (descMatch[1] || descMatch[2]).trim() : '';

  // Clean description to remove any previous MTV branding suffixes
  let baseDesc = currentDesc
    .replace(/^Use the free\s+/i, '')
    .replace(/^Use free\s+/i, '')
    .replace(/^Boost your video reach with the free\s+/i, '')
    .replace(/^Calculate your exact\s+/i, 'Calculates exact ')
    .replace(/\s*100%\s*(?:free|private).*$/i, '')
    .replace(/\s*Powered by Multi Tube Views.*$/i, '')
    .replace(/\s*Fast,\s*100%.*$/i, '')
    .replace(/\s*Zero server uploads.*$/i, '')
    .replace(/\s*by Multi Tube Views.*$/i, '')
    .trim();

  if (!baseDesc || baseDesc.length < 15) {
    baseDesc = `${toolName} for media processing and optimization`;
  }

  // Compute Optimal Title (50-60 chars)
  const typeMap = {
    media: 'Converter',
    creator: 'Creator Tool',
    ai: 'AI Generator',
    bu: 'Utility',
    platform: 'Player Grid'
  };
  const optimalTitle = getOptimalTitle(toolName, typeMap[section] || 'Tool');

  // Compute Optimal Meta (135-155 chars)
  const optimalMeta = getOptimalMeta(toolName, baseDesc, (typeMap[section] || 'tool').toLowerCase());

  // Replace Title
  content = content.replace(/<title>[^<]+<\/title>/i, `<title>${optimalTitle}</title>`);

  // Replace Meta Description
  if (descMatch) {
    content = content.replace(
      /<meta\s+(?:name=["']description["']\s+content=["'][^"']+["']|content=["'][^"']+["']\s+name=["']description["'])/i,
      `<meta name="description" content="${optimalMeta}">`
    );
  }

  // Replace OG / Twitter titles & descriptions
  content = content.replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']+["']/i, `<meta property="og:title" content="${optimalTitle}">`);
  content = content.replace(/<meta\s+property=["']og:description["']\s+content=["'][^"']+["']/i, `<meta property="og:description" content="${optimalMeta}">`);
  content = content.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][^"']+["']/i, `<meta name="twitter:title" content="${optimalTitle}">`);
  content = content.replace(/<meta\s+name=["']twitter:description["']\s+content=["'][^"']+["']/i, `<meta name="twitter:description" content="${optimalMeta}">`);

  // Canonical tag check
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  let canonical = canonicalMatch ? canonicalMatch[1] : '';
  if (!canonical) {
    const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
    canonical = `https://multitubeviews.com/${rel}`;
    content = content.replace(/<\/head>/i, `  <link rel="canonical" href="${canonical}">\n</head>`);
  }

  // Generate FAQs and HowTo steps
  const faqs = getFaqs(toolName, section);
  const howToSteps = getHowToSteps(toolName, section);

  // Check and Inject FAQ Section into HTML body if missing
  if (!content.includes('faq-section') && !content.includes('Frequently Asked Questions')) {
    const faqHtml = renderFaqHtml(faqs);
    // Insert before related tools or before </main>
    if (content.includes('related-tools-section')) {
      content = content.replace(/(<section[^>]*class=["'][^"']*related-tools-section)/i, `${faqHtml}\n      $1`);
    } else if (content.includes('Related Tools')) {
      content = content.replace(/(<section[^>]*>[\s\S]*?Related Tools)/i, `${faqHtml}\n      $1`);
    } else if (content.includes('</main>')) {
      content = content.replace('</main>', `${faqHtml}\n  </main>`);
    }
  }

  // Check and Inject Cross-Category Links into HTML body if missing
  if (!content.includes('cross-category-section') && !content.includes('Explore More Multi Tube Views Workspaces')) {
    const crossCatHtml = getCrossCategoryLinks(section, fileName);
    if (content.includes('</main>')) {
      content = content.replace('</main>', `${crossCatHtml}\n  </main>`);
    }
  }

  // Enrich Schema.org JSON-LD
  const jsonLdMatch = content.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  if (jsonLdMatch) {
    try {
      let jsonLd = JSON.parse(jsonLdMatch[1]);
      let graph = [];
      if (Array.isArray(jsonLd['@graph'])) {
        graph = jsonLd['@graph'];
      } else if (typeof jsonLd === 'object' && jsonLd !== null) {
        graph = [jsonLd];
      }

      // 1. Upgrade WebApplication / SoftwareApplication
      let appSchema = graph.find(item => item['@type'] === 'WebApplication' ||
        item['@type'] === 'SoftwareApplication' ||
        (Array.isArray(item['@type']) && (item['@type'].includes('WebApplication') || item['@type'].includes('SoftwareApplication'))));

      if (appSchema) {
        appSchema['@type'] = ['SoftwareApplication', 'WebApplication'];
        appSchema['isAccessibleForFree'] = true;
        appSchema['name'] = toolName;
        appSchema['description'] = optimalMeta;
      }

      // 2. Ensure BreadcrumbList exists
      let bcSchema = graph.find(item => item['@type'] === 'BreadcrumbList');
      if (!bcSchema) {
        const secName = section === 'media' ? 'Media Converters' :
                        section === 'creator' ? 'Creator Tools' :
                        section === 'ai' ? 'AI Tools' :
                        section === 'platform' ? 'Platforms' : 'Browser Utilities';
        const secUrl = section === 'media' ? 'https://multitubeviews.com/media-converter-tools.html' :
                       section === 'creator' ? 'https://multitubeviews.com/creator-tools.html' :
                       section === 'ai' ? 'https://multitubeviews.com/ai-tools.html' :
                       section === 'platform' ? 'https://multitubeviews.com/platforms.html' : 'https://multitubeviews.com/browser-utilities.html';

        graph.push({
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumb`,
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://multitubeviews.com/index.html" },
            { "@type": "ListItem", "position": 2, "name": secName, "item": secUrl },
            { "@type": "ListItem", "position": 3, "name": toolName, "item": canonical }
          ]
        });
      }

      // 3. Add HowTo Schema
      let howToSchema = graph.find(item => item['@type'] === 'HowTo');
      if (!howToSchema) {
        graph.push({
          "@type": "HowTo",
          "@id": `${canonical}#howto`,
          "name": `How to use ${toolName}`,
          "description": `Step-by-step guide to using ${toolName} online for free.`,
          "step": howToSteps.map(s => ({
            "@type": "HowToStep",
            "position": s.position,
            "name": s.name,
            "text": s.text
          }))
        });
      }

      // 4. Add FAQPage Schema
      let faqSchema = graph.find(item => item['@type'] === 'FAQPage');
      if (!faqSchema) {
        graph.push({
          "@type": "FAQPage",
          "@id": `${canonical}#faq`,
          "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.a
            }
          }))
        });
      }

      // Replace script tag
      const newJsonLdStr = `<script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2)}\n  </script>`;
      content = content.replace(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i, newJsonLdStr);

    } catch (e) {
      console.error(`Error parsing JSON-LD in ${filePath}:`, e.message);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return {
    filePath,
    title: optimalTitle,
    titleLen: optimalTitle.length,
    meta: optimalMeta,
    metaLen: optimalMeta.length
  };
}

console.log('Beginning programmatic SEO upgrade across all 505 tools...');

const sections = [
  { dir: path.join(ROOT, 'media-converter-tools'), sec: 'media' },
  { dir: path.join(ROOT, 'creator-tools'), sec: 'creator' },
  { dir: path.join(ROOT, 'ai-tools'), sec: 'ai' },
  { dir: path.join(ROOT, 'browser-utilities'), sec: 'bu' },
  { dir: path.join(ROOT, 'platforms'), sec: 'platform' }
];

let totalProcessed = 0;
let titleLenIssues = 0;
let metaLenIssues = 0;

for (const { dir, sec } of sections) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');
  console.log(`Processing ${files.length} pages in ${sec}...`);

  for (const f of files) {
    const fullPath = path.join(dir, f);
    const res = processHtmlFile(fullPath, sec);
    if (!res.skipped) {
      totalProcessed++;
      if (res.titleLen < 50 || res.titleLen > 60) titleLenIssues++;
      if (res.metaLen < 135 || res.metaLen > 155) metaLenIssues++;
    }
  }
}

console.log(`\n✓ Programmatic SEO Upgrade complete!`);
console.log(`Total tool pages processed: ${totalProcessed}`);
console.log(`Title length accuracy (50-60 chars): ${totalProcessed - titleLenIssues} / ${totalProcessed}`);
console.log(`Meta description accuracy (135-155 chars): ${totalProcessed - metaLenIssues} / ${totalProcessed}`);

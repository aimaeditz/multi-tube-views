import fs from 'fs';
import path from 'path';

// Import source of truth data files
import { AI_TOOLS_DATA, AI_CATEGORIES } from '../assets/data/ai-tools-data.js';
import { CREATOR_TOOLS_DATA, CREATOR_CATEGORIES } from '../assets/data/creator-tools-data.js';
import { ALL_TOOL_CONFIGS } from '../assets/js/media-tools-data.js';
import { BU_CATEGORIES, BU_ALL_TOOLS_LIST } from '../assets/data/browser-utilities-data.js';

/**
 * Returns dynamic, computed tool counts directly from data source files.
 * Never hardcoded.
 */
export function getCounts() {
  const aiCount = Object.keys(AI_TOOLS_DATA || {}).length;
  const creatorCount = Object.keys(CREATOR_TOOLS_DATA || {}).length;
  const mediaCount = Object.keys(ALL_TOOL_CONFIGS || {}).length;

  let buCount = 0;
  if (BU_ALL_TOOLS_LIST && Array.isArray(BU_ALL_TOOLS_LIST) && BU_ALL_TOOLS_LIST.length > 0) {
    buCount = BU_ALL_TOOLS_LIST.length;
  } else if (BU_CATEGORIES && Array.isArray(BU_CATEGORIES)) {
    const allTools = new Set();
    BU_CATEGORIES.forEach(cat => (cat.tools || []).forEach(t => allTools.add(t)));
    buCount = allTools.size;
  }

  const platformsDir = path.resolve('platforms');
  const platformFiles = fs.existsSync(platformsDir)
    ? fs.readdirSync(platformsDir).filter(f => f.endsWith('.html') && f !== 'index.html')
    : [];
  const platformCount = platformFiles.length;

  const totalTools = aiCount + creatorCount + mediaCount + buCount;
  const grandTotal = totalTools + platformCount;

  // Compute category breakdowns
  const aiCategoryCounts = {};
  for (const tool of Object.values(AI_TOOLS_DATA || {})) {
    const cat = tool.category || 'video';
    aiCategoryCounts[cat] = (aiCategoryCounts[cat] || 0) + 1;
  }

  const creatorCategoryCounts = {};
  for (const tool of Object.values(CREATOR_TOOLS_DATA || {})) {
    const cat = tool.category || 'strategy';
    creatorCategoryCounts[cat] = (creatorCategoryCounts[cat] || 0) + 1;
  }

  const mediaCategoryCounts = {};
  for (const tool of Object.values(ALL_TOOL_CONFIGS || {})) {
    const cat = tool.category || 'video';
    mediaCategoryCounts[cat] = (mediaCategoryCounts[cat] || 0) + 1;
  }

  return {
    aiCount,
    creatorCount,
    mediaCount,
    buCount,
    platformCount,
    totalTools,
    grandTotal,
    aiCategoryCounts,
    creatorCategoryCounts,
    mediaCategoryCounts
  };
}

function updateFile(filePath, updateFn) {
  if (!fs.existsSync(filePath)) return false;
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = updateFn(original);
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    return true;
  }
  return false;
}

/**
 * Synchronizes all counts, badges, placeholders, and descriptions across the codebase.
 */
export function syncAllCounts() {
  const counts = getCounts();
  const {
    aiCount,
    creatorCount,
    mediaCount,
    buCount,
    platformCount,
    totalTools,
    grandTotal,
    aiCategoryCounts,
    creatorCategoryCounts,
    mediaCategoryCounts
  } = counts;

  console.log(`[sync-counts] 🔄 Syncing counts from source files:`);
  console.log(`  • AI Tools: ${aiCount}`);
  console.log(`  • Creator Tools: ${creatorCount}`);
  console.log(`  • Media Tools: ${mediaCount}`);
  console.log(`  • Browser Utilities: ${buCount}`);
  console.log(`  • Platforms: ${platformCount}`);
  console.log(`  • Total Suite Tools: ${totalTools}`);
  console.log(`  • Grand Total (Tools + Platforms): ${grandTotal}`);

  let updatedFilesCount = 0;

  // 1. Sync metadata.json
  const metadataUpdated = updateFile('metadata.json', content => {
    try {
      const json = JSON.parse(content);
      const desc = `Free public workspace platform with ${totalTools}+ tools across AI, video SEO, media conversion, and browser utilities, plus multi-platform stream viewing.`;
      if (json.description !== desc) {
        json.description = desc;
        return JSON.stringify(json, null, 2) + '\n';
      }
    } catch (e) {
      console.error('[sync-counts] Error updating metadata.json:', e);
    }
    return content;
  });
  if (metadataUpdated) updatedFilesCount++;

  // 2. Sync assets/data/ai-tools-data.js (categories and comments)
  const aiDataUpdated = updateFile('assets/data/ai-tools-data.js', content => {
    let res = content;
    // Header comment
    res = res.replace(/(\*\s*Multi Tube Views \(MTV\) —\s*)\d+(\s*AI Tools Data Directory)/, `$1${aiCount}$2`);
    res = res.replace(/(Structured metadata for\s*)\d+(\s*dedicated AI generative tools)/, `$1${aiCount}$2`);

    // AI_CATEGORIES 'all' count
    res = res.replace(/("id":\s*"all",\s*"name":\s*"All Tools",\s*"count":\s*)\d+/, `$1${aiCount}`);

    // Update individual categories if needed
    for (const [catId, catCount] of Object.entries(aiCategoryCounts)) {
      const catRegex = new RegExp(`("id":\\s*"${catId}",\\s*"name":\\s*"[^"]*",\\s*"count":\\s*)\\d+`);
      res = res.replace(catRegex, `$1${catCount}`);
    }
    return res;
  });
  if (aiDataUpdated) updatedFilesCount++;

  // 3. Sync assets/data/creator-tools-data.js (categories and comments)
  const creatorDataUpdated = updateFile('assets/data/creator-tools-data.js', content => {
    let res = content;
    // Header comment
    res = res.replace(/(\*\s*)\d+(\s*High-Performance AI-Powered Creator Tools\.)/, `$1${creatorCount}$2`);

    // CREATOR_CATEGORIES 'all' count
    res = res.replace(/(\{\s*id:\s*['"]all['"],\s*name:\s*['"]All Tools['"],\s*count:\s*)\d+/, `$1${creatorCount}`);

    // Update individual categories if needed
    for (const [catId, catCount] of Object.entries(creatorCategoryCounts)) {
      const catRegex = new RegExp(`(\\{\\s*id:\\s*['"]${catId}['"],\\s*name:\\s*['"][^'"]*['"],\\s*count:\\s*)\\d+`);
      res = res.replace(catRegex, `$1${catCount}`);
    }
    return res;
  });
  if (creatorDataUpdated) updatedFilesCount++;

  // 4. Sync assets/js/media-tools-data.js comments
  const mediaDataUpdated = updateFile('assets/js/media-tools-data.js', content => {
    let res = content;
    res = res.replace(/(\*\s*)\d+(\s*In-Browser Client-Side Media Tools across)/, `$1${mediaCount}$2`);
    if (mediaCategoryCounts.image) {
      res = res.replace(/(\*\s*-\s*Image Tools \()\d+(\s*tools\))/, `$1${mediaCategoryCounts.image}$2`);
    }
    if (mediaCategoryCounts.video) {
      res = res.replace(/(\*\s*-\s*Video Tools \()\d+(\s*tools\))/, `$1${mediaCategoryCounts.video}$2`);
    }
    if (mediaCategoryCounts.audio) {
      res = res.replace(/(\*\s*-\s*Audio Tools \()\d+(\s*tools\))/, `$1${mediaCategoryCounts.audio}$2`);
    }
    if (mediaCategoryCounts['pdf-document']) {
      res = res.replace(/(\*\s*-\s*PDF & Document Tools \()\d+(\s*tools\))/, `$1${mediaCategoryCounts['pdf-document']}$2`);
    }
    return res;
  });
  if (mediaDataUpdated) updatedFilesCount++;

  // 5. Sync assets/data/browser-utilities-data.js comments
  const buDataUpdated = updateFile('assets/data/browser-utilities-data.js', content => {
    let res = content;
    res = res.replace(/(\*\s*)\d+(\s*In-Browser Client-Side Tools across)/, `$1${buCount}$2`);
    return res;
  });
  if (buDataUpdated) updatedFilesCount++;

  // 6. Sync assets/js/site-search.js comments
  const searchJsUpdated = updateFile('assets/js/site-search.js', content => {
    let res = content;
    res = res.replace(/(\*\s*100% Client-Side Fuzzy Search across\s*)\d+\+(\s*Tools, Converters & Platforms\.)/, `$1${grandTotal}+$2`);
    res = res.replace(/(\/\/\s*1\.\s*Creator Tools \()\d+(\s*tools\))/, `$1${creatorCount}$2`);
    res = res.replace(/(\/\/\s*2\.\s*AI Tools \()\d+(\s*tools\))/, `$1${aiCount}$2`);
    res = res.replace(/(\/\/\s*3\.\s*Media Converter Tools \()\d+(\s*tools\))/, `$1${mediaCount}$2`);
    return res;
  });
  if (searchJsUpdated) updatedFilesCount++;

  // 7. Sync index.html
  const indexUpdated = updateFile('index.html', content => {
    let res = content;

    // Hero stat cards
    res = res.replace(/(<div class="hero-stat-number" id="hero-stat-ai">)\d+(<\/div>)/, `$1${aiCount}$2`);
    res = res.replace(/(<div class="hero-stat-number" id="hero-stat-creator">)\d+(<\/div>)/, `$1${creatorCount}$2`);
    res = res.replace(/(<div class="hero-stat-number" id="hero-stat-media">)\d+(<\/div>)/, `$1${mediaCount}$2`);
    res = res.replace(/(<div class="hero-stat-number" id="hero-stat-bu">)\d+(<\/div>)/, `$1${buCount}$2`);
    res = res.replace(/(<div class="hero-stat-number" id="hero-stat-platforms">)\d+\+?(<\/div>)/, `$1${platformCount}+$2`);

    // Hero pill
    res = res.replace(/(<span class="hero-badge-dot"><\/span>\s*)\d+\s+Instant Tools Across\s+\d+\+?\s+Media Platforms/, `$1${totalTools} Instant Tools Across ${platformCount}+ Media Platforms`);

    // Search placeholders
    res = res.replace(/Search \d+\+ tools, media converters, utilities &amp; platforms\.\.\./g, `Search ${grandTotal}+ tools, media converters, utilities &amp; platforms...`);
    res = res.replace(/placeholder="Search \d+\+ tools, converters, utilities &amp; platforms\.\.\."/g, `placeholder="Search ${grandTotal}+ tools, converters, utilities &amp; platforms..."`);
    res = res.replace(/\d+\+ Tools &amp; Platforms Indexed/g, `${grandTotal}+ Tools &amp; Platforms Indexed`);

    // Ticker banner (both desktop and mobile)
    const tickerPattern = /⚡\s*\d+\s+Instant Tools\s*•\s*\d+\+?\s+Media Platforms\s*•\s*\d+\s+AI Tools\s*•\s*\d+\s+Creator Tools\s*•\s*\d+\s+Media Converters\s*•\s*\d+\s+Browser Utilities\s*•\s*100% Free &amp; Private/g;
    const tickerReplacement = `⚡ ${totalTools} Instant Tools • ${platformCount}+ Media Platforms • ${aiCount} AI Tools • ${creatorCount} Creator Tools • ${mediaCount} Media Converters • ${buCount} Browser Utilities • 100% Free &amp; Private`;
    res = res.replace(tickerPattern, tickerReplacement);

    // Hub section counts
    res = res.replace(/(<a href="platforms\.html" class="hub-item"[\s\S]*?<span class="hub-title">)\d+\+? Platforms(<\/span>)/, `$1${platformCount}+ Platforms$2`);
    res = res.replace(/(<a href="ai-tools\.html" class="hub-item"[\s\S]*?<span class="hub-count"[^>]*>)\d+\+? Tools(<\/span>)/, `$1${aiCount} Tools$2`);
    res = res.replace(/(<a href="creator-tools\.html" class="hub-item"[\s\S]*?<span class="hub-count"[^>]*>)\d+\+? Tools(<\/span>)/, `$1${creatorCount} Tools$2`);
    res = res.replace(/(<a href="media-converter-tools\.html" class="hub-item"[\s\S]*?<span class="hub-count"[^>]*>)\d+\+? Tools(<\/span>)/, `$1${mediaCount} Tools$2`);
    res = res.replace(/(<a href="browser-utilities\.html" class="hub-item"[\s\S]*?<span class="hub-count"[^>]*>)\d+\+? Tools(<\/span>)/, `$1${buCount} Tools$2`);
    res = res.replace(/Access all \d+\+? free client-side tools and \d+\+? media platforms in one unified, searchable hub\./g, `Access all ${totalTools}+ free client-side tools and ${platformCount}+ media platforms in one unified, searchable hub.`);

    // Feature showcase cards
    res = res.replace(/(<a href="platforms\.html" class="glass-card feature-showcase-card" id="card-showcase-platforms">[\s\S]*?<h3 class="feature-showcase-title">)\d+\+? Platforms(<\/h3>)/, `$1${platformCount}+ Platforms$2`);
    res = res.replace(/(<a href="media-converter-tools\.html" class="glass-card feature-showcase-card" id="card-showcase-converters">[\s\S]*?<h3 class="feature-showcase-title">)\d+\+? Converter Tools(<\/h3>)/, `$1${mediaCount} Converter Tools$2`);
    res = res.replace(/(<a href="creator-tools\.html" class="glass-card feature-showcase-card" id="card-showcase-creator">[\s\S]*?<h3 class="feature-showcase-title">)\d+\+? Creator Tools(<\/h3>)/, `$1${creatorCount} Creator Tools$2`);

    // Live Stats Counter section
    res = res.replace(/(<div class="glass-card live-stat-card" id="stat-platforms">[\s\S]*?<div class="live-stat-number" data-target=")\d+(")/, `$1${platformCount}$2`);
    res = res.replace(/(<div class="glass-card live-stat-card" id="stat-ai-tools">[\s\S]*?<div class="live-stat-number" data-target=")\d+(")/, `$1${aiCount}$2`);
    res = res.replace(/(<div class="glass-card live-stat-card" id="stat-creator-tools">[\s\S]*?<div class="live-stat-number" data-target=")\d+(")/, `$1${creatorCount}$2`);
    res = res.replace(/(<div class="glass-card live-stat-card" id="stat-converter-tools">[\s\S]*?<div class="live-stat-number" data-target=")\d+(")/, `$1${mediaCount}$2`);
    res = res.replace(/(<div class="glass-card live-stat-card" id="stat-browser-utilities">[\s\S]*?<div class="live-stat-number" data-target=")\d+(")/, `$1${buCount}$2`);

    // How It Works section
    res = res.replace(/Browse \d+\+ dedicated platform workspaces/g, `Browse ${platformCount}+ dedicated platform workspaces`);

    return res;
  });
  if (indexUpdated) updatedFilesCount++;

  // 8. Sync explore-hub.html
  const exploreUpdated = updateFile('explore-hub.html', content => {
    let res = content;

    // Badge and subtitle
    res = res.replace(/Unified Master Directory • \d+\+ Free Client-Side Tools/g, `Unified Master Directory • ${totalTools}+ Free Client-Side Tools`);
    res = res.replace(/Access all \d+\+ free client-side tools and \d+\+ media platforms in one unified, searchable master directory\./g, `Access all ${totalTools}+ free client-side tools and ${platformCount}+ media platforms in one unified, searchable master directory.`);

    // Hub cards badges and titles
    res = res.replace(/(<div class="hub-card-header">\s*<span class="hub-badge"[^>]*>)\d+ Platforms(<\/span>[\s\S]*?<h2 class="hub-card-title">)\d+\+ Platforms(<\/h2>)/, `$1${platformCount} Platforms$2${platformCount}+ Platforms$3`);
    res = res.replace(/(<div class="hub-card-header">\s*<span class="hub-badge"[^>]*>)\d+ Tools(<\/span>[\s\S]*?<h2 class="hub-card-title">)\d+ AI Tools(<\/h2>)/, `$1${aiCount} Tools$2${aiCount} AI Tools$3`);
    res = res.replace(/(<div class="hub-card-header">\s*<span class="hub-badge"[^>]*>)\d+ Tools(<\/span>[\s\S]*?<h2 class="hub-card-title">)\d+ Creator Tools(<\/h2>)/, `$1${creatorCount} Tools$2${creatorCount} Creator Tools$3`);
    res = res.replace(/(<div class="hub-card-header">\s*<span class="hub-badge"[^>]*>)\d+ Tools(<\/span>[\s\S]*?<h2 class="hub-card-title">)\d+ Converter Tools(<\/h2>)/, `$1${mediaCount} Tools$2${mediaCount} Converter Tools$3`);
    res = res.replace(/(<div class="hub-card-header">\s*<span class="hub-badge"[^>]*>)\d+ Tools(<\/span>[\s\S]*?<h2 class="hub-card-title">)\d+ Browser Utilities(<\/h2>)/, `$1${buCount} Tools$2${buCount} Browser Utilities$3`);

    // Search placeholder
    res = res.replace(/placeholder="Search all \d+\+ tools and \d+\+ platforms/g, `placeholder="Search all ${totalTools}+ tools and ${platformCount}+ platforms`);

    // Quick filter chips
    res = res.replace(/All Tools \(\d+\)/g, `All Tools (${totalTools})`);
    res = res.replace(/Platforms \(\d+\)/g, `Platforms (${platformCount})`);
    res = res.replace(/AI Tools \(\d+\)/g, `AI Tools (${aiCount})`);
    res = res.replace(/Creator \(\d+\)/g, `Creator (${creatorCount})`);
    res = res.replace(/Media \(\d+\)/g, `Media (${mediaCount})`);
    res = res.replace(/Utilities \(\d+\)/g, `Utilities (${buCount})`);

    // Overlay search placeholder & index brand
    res = res.replace(/placeholder="Search \d+\+ tools, converters, utilities &amp; platforms\.\.\."/g, `placeholder="Search ${grandTotal}+ tools, converters, utilities &amp; platforms..."`);
    res = res.replace(/\d+\+ Tools &amp; Platforms Indexed/g, `${grandTotal}+ Tools &amp; Platforms Indexed`);

    return res;
  });
  if (exploreUpdated) updatedFilesCount++;

  // 9. Sync about.html
  const aboutUpdated = updateFile('about.html', content => {
    let res = content;
    res = res.replace(/exploring \d+ AI tools, or optimizing content with our suite of \d+ creator tools/g, `exploring ${aiCount} AI tools, or optimizing content with our suite of ${creatorCount} creator tools`);
    res = res.replace(/directory of \d+ dedicated platform tools/g, `directory of ${platformCount} dedicated platform tools`);
    res = res.replace(/suite of \d+ dedicated AI Tools for content generation, image workflows, code assistance, and marketing automation, \d+ Creator Tools to generate optimized video titles, SEO keywords, hashtags, metadata descriptions, video hooks, script outlines, and thumbnail concepts, paired with \d+ client-side Media Converter Tools \(video-to-audio converter, video trimmer, audio trimmer, audio slow\+reverb, speed controls, PDF tools, image editors, etc\.\) and \d+ client-side Browser Utilities/g,
      `suite of ${aiCount} dedicated AI Tools for content generation, image workflows, code assistance, and marketing automation, ${creatorCount} Creator Tools to generate optimized video titles, SEO keywords, hashtags, metadata descriptions, video hooks, script outlines, and thumbnail concepts, paired with ${mediaCount} client-side Media Converter Tools (video-to-audio converter, video trimmer, audio trimmer, audio slow+reverb, speed controls, PDF tools, image editors, etc.) and ${buCount} client-side Browser Utilities`);
    res = res.replace(/<li><a href="platforms\.html">All \d+ Platforms<\/a><\/li>/g, `<li><a href="platforms.html">All ${platformCount} Platforms</a></li>`);
    return res;
  });
  if (aboutUpdated) updatedFilesCount++;

  // 10. Sync ai-tools.html
  const aiToolsUpdated = updateFile('ai-tools.html', content => {
    let res = content;
    res = res.replace(/AI Tools Suite — \d+ Free Generative AI Writing Tools \| MTV/g, `AI Tools Suite — ${aiCount} Free Generative AI Writing Tools | MTV`);
    res = res.replace(/with \d+ free AI tools for video scripts/g, `with ${aiCount} free AI tools for video scripts`);
    res = res.replace(/directory of \d+ free AI generative tools/g, `directory of ${aiCount} free AI generative tools`);
    res = res.replace(/\d+ Dedicated Generative AI Tools/g, `${aiCount} Dedicated Generative AI Tools`);
    res = res.replace(/(>\s*)\d+(\s*<span class="stat-plus">)/, `$1${aiCount}$2`);
    res = res.replace(/(<span>All Tools<\/span><span class="filter-count">)\d+(<\/span>)/, `$1${aiCount}$2`);
    res = res.replace(/placeholder="Search all \d+ AI tools\.\.\."/g, `placeholder="Search all ${aiCount} AI tools..."`);
    return res;
  });
  if (aiToolsUpdated) updatedFilesCount++;

  // 11. Sync creator-tools.html
  const creatorToolsUpdated = updateFile('creator-tools.html', content => {
    let res = content;
    res = res.replace(/Optimize video SEO with \d+ free creator tools/g, `Optimize video SEO with ${creatorCount} free creator tools`);
    res = res.replace(/Comprehensive \d+-tool video SEO suite/g, `Comprehensive ${creatorCount}-tool video SEO suite`);
    res = res.replace(/\d+ Specialized Video SEO Tools/g, `${creatorCount} Specialized Video SEO Tools`);
    res = res.replace(/placeholder="Search all \d+ creator tools\.\.\."/g, `placeholder="Search all ${creatorCount} creator tools..."`);
    return res;
  });
  if (creatorToolsUpdated) updatedFilesCount++;

  // 12. Sync media-converter-tools.html
  const mediaToolsUpdated = updateFile('media-converter-tools.html', content => {
    let res = content;
    res = res.replace(/Suite of \d+ high-performance client-side media converters/g, `Suite of ${mediaCount} high-performance client-side media converters`);
    res = res.replace(/\d+ In-Browser Client-Side Media Tools/g, `${mediaCount} In-Browser Client-Side Media Tools`);
    res = res.replace(/placeholder="Search all \d+ media converters\.\.\."/g, `placeholder="Search all ${mediaCount} media converters..."`);
    return res;
  });
  if (mediaToolsUpdated) updatedFilesCount++;

  // 13. Sync browser-utilities.html
  const buUpdated = updateFile('browser-utilities.html', content => {
    let res = content;
    res = res.replace(/Browser Utilities — \d+ Free Client-Side Web Tools \| MTV/g, `Browser Utilities — ${buCount} Free Client-Side Web Tools | MTV`);
    res = res.replace(/Suite of \d+ fast, 100% private in-browser utilities/g, `Suite of ${buCount} fast, 100% private in-browser utilities`);
    res = res.replace(/⚡\s*\d+\s*CLIENT-SIDE UTILITIES • 100% PRIVATE • ZERO UPLOADS/g, `⚡ ${buCount} CLIENT-SIDE UTILITIES • 100% PRIVATE • ZERO UPLOADS`);
    res = res.replace(/placeholder="Search \d+ utilities \(e\.g\. JSON, Regex, Password, Slug, Base64\)\.\.\."/g, `placeholder="Search ${buCount} utilities (e.g. JSON, Regex, Password, Slug, Base64)..."`);
    res = res.replace(/(<span id="bu-search-count"[^>]*>)\d+ Tools(<\/span>)/, `$1${buCount} Tools$2`);
    return res;
  });
  if (buUpdated) updatedFilesCount++;

  // 14. Sync platforms.html
  const platformsUpdated = updateFile('platforms.html', content => {
    let res = content;
    res = res.replace(/Directory \(\d+\+ Sites\)/g, `Directory (${platformCount}+ Sites)`);
    res = res.replace(/Explore \d+\+ supported video/g, `Explore ${platformCount}+ supported video`);
    res = res.replace(/\d+ Verified Media Platforms/g, `${platformCount} Verified Media Platforms`);
    res = res.replace(/Directory of \d+ video, audio/g, `Directory of ${platformCount} video, audio`);
    res = res.replace(/Multi Tube Views supports \d+ video, audio/g, `Multi Tube Views supports ${platformCount} video, audio`);
    return res;
  });
  if (platformsUpdated) updatedFilesCount++;

  // 15. Global Footer Walk across all HTML files in project
  // This updates every page's footer description and footer links
  const footerDescriptionRegex = /<p>A clean, responsive, multi-platform public media workspace featuring \d+\+ platform adapters, \d+ AI tools, \d+ creator optimization tools, \d+ browser media converters, \d+ client-side browser utilities, and an AI prompts directory\.<\/p>/g;
  const targetFooterDescription = `<p>A clean, responsive, multi-platform public media workspace featuring ${platformCount}+ platform adapters, ${aiCount} AI tools, ${creatorCount} creator optimization tools, ${mediaCount} browser media converters, ${buCount} client-side browser utilities, and an AI prompts directory.</p>`;

  function walkAndSyncHtml(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkAndSyncHtml(fullPath);
      } else if (entry.name.endsWith('.html')) {
        const changed = updateFile(fullPath, content => {
          let res = content;
          // Global footer brand description
          res = res.replace(footerDescriptionRegex, targetFooterDescription);

          // Subpage footer tool link counters
          res = res.replace(/>\d+ AI Writing Tools</g, `>${aiCount} AI Writing Tools<`);
          res = res.replace(/>\d+ Creator SEO Tools</g, `>${creatorCount} Creator SEO Tools<`);
          res = res.replace(/>\d+ In-Browser Media Converters</g, `>${mediaCount} In-Browser Media Converters<`);
          res = res.replace(/>\d+ Browser Utilities</g, `>${buCount} Browser Utilities<`);
          res = res.replace(/>\d+\+ Supported Platforms</g, `>${platformCount}+ Supported Platforms<`);

          // "Browse All X Tools" buttons in tool pages
          res = res.replace(/Browse All \d+ AI Tools →/g, `Browse All ${aiCount} AI Tools →`);
          res = res.replace(/Browse All \d+ Creator Tools →/g, `Browse All ${creatorCount} Creator Tools →`);
          res = res.replace(/Browse All \d+ Converters →/g, `Browse All ${mediaCount} Converters →`);

          // Footer link to all platforms
          res = res.replace(/<li><a href="([^"]*)platforms\.html">All \d+ Platforms<\/a><\/li>/g, `<li><a href="$1platforms.html">All ${platformCount} Platforms</a></li>`);

          return res;
        });
        if (changed) updatedFilesCount++;
      }
    }
  }

  walkAndSyncHtml('.');

  // 16. Update scripts/generate-all-pages.mjs template footer & browser utilities counts
  const genPagesUpdated = updateFile('scripts/generate-all-pages.mjs', content => {
    let res = content;
    // renderFooter brand description
    res = res.replace(footerDescriptionRegex, targetFooterDescription);
    // Browser utilities template numbers
    res = res.replace(/const title = "Browser Utilities — \d+ Free Client-Side Web Tools \| MTV";/, `const title = "Browser Utilities — ${buCount} Free Client-Side Web Tools | MTV";`);
    res = res.replace(/const description = "Suite of \d+ fast, 100% private in-browser utilities/, `const description = "Suite of ${buCount} fast, 100% private in-browser utilities`);
    res = res.replace(/"\d+ In-Browser Utilities by AiMAEditz"/, `"${buCount} In-Browser Utilities by AiMAEditz"`);
    res = res.replace(/"\d+ high-speed client-side tools across/, `"${buCount} high-speed client-side tools across`);
    res = res.replace(/No\. All \d+ browser utilities run entirely client-side/, `No. All ${buCount} browser utilities run entirely client-side`);
    res = res.replace(/⚡\s*\d+\s*CLIENT-SIDE UTILITIES • 100% PRIVATE • ZERO UPLOADS/, `⚡ ${buCount} CLIENT-SIDE UTILITIES • 100% PRIVATE • ZERO UPLOADS`);
    res = res.replace(/placeholder="Search \d+ utilities \(e\.g\. JSON, Regex, Password, Slug, Base64\)\.\.\."/, `placeholder="Search ${buCount} utilities (e.g. JSON, Regex, Password, Slug, Base64)..."`);
    res = res.replace(/>\d+ Tools<\/span>/, `>${buCount} Tools</span>`);
    res = res.replace(/countEl\.textContent = '\d+ Tools';/, `countEl.textContent = '${buCount} Tools';`);
    return res;
  });
  if (genPagesUpdated) updatedFilesCount++;

  // 17. Update scripts/generate-all-tool-pages.mjs footer links & counts
  const genToolPagesUpdated = updateFile('scripts/generate-all-tool-pages.mjs', content => {
    let res = content;
    res = res.replace(/>\d+ AI Writing Tools</g, `>${aiCount} AI Writing Tools<`);
    res = res.replace(/>\d+ Creator SEO Tools</g, `>${creatorCount} Creator SEO Tools<`);
    res = res.replace(/>\d+ In-Browser Media Converters</g, `>${mediaCount} In-Browser Media Converters<`);
    res = res.replace(/>\d+ Browser Utilities</g, `>${buCount} Browser Utilities<`);
    res = res.replace(/>\d+\+ Supported Platforms</g, `>${platformCount}+ Supported Platforms<`);
    res = res.replace(/Browse All \d+ AI Tools →/g, `Browse All ${aiCount} AI Tools →`);
    res = res.replace(/Browse All \d+ Creator Tools →/g, `Browse All ${creatorCount} Creator Tools →`);
    res = res.replace(/Browse All \d+ Converters →/g, `Browse All ${mediaCount} Converters →`);
    return res;
  });
  if (genToolPagesUpdated) updatedFilesCount++;

  // 18. Update seo-manager.cjs if it contains hardcoded counts
  const seoManagerUpdated = updateFile('seo-manager.cjs', content => {
    let res = content;
    res = res.replace(/AI Tools Suite — \d+ Free Generative AI Writing Tools \| MTV/g, `AI Tools Suite — ${aiCount} Free Generative AI Writing Tools | MTV`);
    res = res.replace(/with \d+ free AI tools for video scripts/g, `with ${aiCount} free AI tools for video scripts`);
    res = res.replace(/directory of \d+ free AI generative tools/g, `directory of ${aiCount} free AI generative tools`);
    res = res.replace(/\d+ dedicated generative AI tools/g, `${aiCount} dedicated generative AI tools`);
    res = res.replace(/Optimize video SEO with \d+ free creator tools/g, `Optimize video SEO with ${creatorCount} free creator tools`);
    res = res.replace(/Comprehensive \d+-tool video SEO suite/g, `Comprehensive ${creatorCount}-tool video SEO suite`);
    res = res.replace(/\d+ specialized video SEO/g, `${creatorCount} specialized video SEO`);
    res = res.replace(/suite of \d+ high-performance client-side media converters/g, `suite of ${mediaCount} high-performance client-side media converters`);
    res = res.replace(/\d+ fast in-browser media converters/g, `${mediaCount} fast in-browser media converters`);
    res = res.replace(/Browser Utilities — \d+ Free Client-Side Web Tools \| MTV/g, `Browser Utilities — ${buCount} Free Client-Side Web Tools | MTV`);
    res = res.replace(/Suite of \d+ fast, 100% private in-browser utilities/g, `Suite of ${buCount} fast, 100% private in-browser utilities`);
    res = res.replace(/Directory \(\d+\+ Sites\)/g, `Directory (${platformCount}+ Sites)`);
    res = res.replace(/Explore \d+\+ supported video/g, `Explore ${platformCount}+ supported video`);
    return res;
  });
  if (seoManagerUpdated) updatedFilesCount++;

  console.log(`[sync-counts] ✅ Completed! ${updatedFilesCount} file(s) updated.\n`);
  return { counts, updatedFilesCount };
}

// Execute directly when run as CLI script
if (process.argv[1] && process.argv[1].endsWith('sync-counts.mjs')) {
  syncAllCounts();
}

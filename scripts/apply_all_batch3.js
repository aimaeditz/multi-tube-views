import fs from 'fs';
import { BATCH_3_FULL_DATA } from './batch3_full_data.js';

console.log('Starting Batch 3 Application...');

// 1. Update assets/data/ai-tools-data.js & public/assets/data/ai-tools-data.js
function updateAiToolsData(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Update header comment
  content = content.replace(
    /Multi Tube Views \(MTV\) — \d+ AI Tools Data Directory/g,
    'Multi Tube Views (MTV) — 210 AI Tools Data Directory'
  );
  content = content.replace(
    /Structured metadata for \d+ dedicated AI generative tools/g,
    'Structured metadata for 210 dedicated AI generative tools'
  );

  // Update category counts
  content = content.replace(
    /"id": "all",\s*"name": "All Tools",\s*"count": \d+/g,
    '"id": "all",\n    "name": "All Tools",\n    "count": 210'
  );
  content = content.replace(
    /"id": "video",\s*"name": "Video & Scripting",\s*"count": \d+/g,
    '"id": "video",\n    "name": "Video & Scripting",\n    "count": 33'
  );
  content = content.replace(
    /"id": "social",\s*"name": "Social & Growth",\s*"count": \d+/g,
    '"id": "social",\n    "name": "Social & Growth",\n    "count": 35'
  );
  content = content.replace(
    /"id": "copywriting",\s*"name": "Copywriting & Sales",\s*"count": \d+/g,
    '"id": "copywriting",\n    "name": "Copywriting & Sales",\n    "count": 37'
  );
  content = content.replace(
    /"id": "creative",\s*"name": "Creative & Narrative",\s*"count": \d+/g,
    '"id": "creative",\n    "name": "Creative & Narrative",\n    "count": 35'
  );
  content = content.replace(
    /"id": "seo",\s*"name": "SEO & Discovery",\s*"count": \d+/g,
    '"id": "seo",\n    "name": "SEO & Discovery",\n    "count": 35'
  );
  content = content.replace(
    /"id": "technical",\s*"name": "Technical & Code",\s*"count": \d+/g,
    '"id": "technical",\n    "name": "Technical & Code",\n    "count": 35'
  );

  // Append new tools before the closing '};'
  const newToolsEntries = [];
  for (const [id, tool] of Object.entries(BATCH_3_FULL_DATA)) {
    newToolsEntries.push(`  '${id}': {
    "title": ${JSON.stringify(tool.title)},
    "desc": ${JSON.stringify(tool.desc)},
    "icon": ${JSON.stringify(tool.icon)},
    "category": ${JSON.stringify(tool.category)},
    "placeholder": ${JSON.stringify(tool.placeholder)},
    "label": ${JSON.stringify(tool.label)},
    "promptTemplate": ${JSON.stringify(tool.promptTemplate)},
    "dateAdded": "2026-09-18"
  }`);
  }

  const closingIndex = content.lastIndexOf('};');
  if (closingIndex === -1) {
    throw new Error('Could not find closing }; in ' + filePath);
  }

  const prefix = content.slice(0, closingIndex).trimEnd();
  // Ensure trailing comma after the last tool before adding new ones
  const prefixWithComma = prefix.endsWith(',') ? prefix : prefix + ',';
  const newContent = `${prefixWithComma}

  // ==========================================
  // 50 NEW TOOLS (Batch 3 of 3 - Final)
  // ==========================================
${newToolsEntries.join(',\n')}
};
`;

  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Updated ${filePath}`);
}

updateAiToolsData('assets/data/ai-tools-data.js');
updateAiToolsData('public/assets/data/ai-tools-data.js');

// 2. Update ai-tools.html
function updateAiToolsHtml() {
  let html = fs.readFileSync('ai-tools.html', 'utf8');

  // Update titles & meta
  html = html.replace(/160 Free Generative AI Writing Tools/g, '210 Free Generative AI Writing Tools');
  html = html.replace(/160 free AI tools/g, '210 free AI tools');
  html = html.replace(/160 dedicated generative AI tools/g, '210 dedicated generative AI tools');
  html = html.replace(/160 Free AI Generative Tools/g, '210 Free AI Generative Tools');
  html = html.replace(/160 dedicated AI generative tools/g, '210 dedicated AI generative tools');
  html = html.replace(/Search all 1210 AI tools/g, 'Search all 210 AI tools');
  html = html.replace(/160 specialized generative AI tools/g, '210 specialized generative AI tools');
  html = html.replace(/← Back to All 160 Tools/g, '← Back to All 210 Tools');
  html = html.replace(/1210 AI tools,/g, '210 AI tools,');
  html = html.replace(/AI Tools Suite \(160\)/g, 'AI Tools Suite');

  // Update Category Filter counts
  html = html.replace(
    /<button type="button" class="filter-chip active" data-category="all"><span>All Tools<\/span><span class="filter-count">\d+<\/span><\/button>/,
    '<button type="button" class="filter-chip active" data-category="all"><span>All Tools</span><span class="filter-count">210</span></button>'
  );
  html = html.replace(
    /<button type="button" class="filter-chip " data-category="video"><span>Video & Scripting<\/span><span class="filter-count">\d+<\/span><\/button>/,
    '<button type="button" class="filter-chip " data-category="video"><span>Video & Scripting</span><span class="filter-count">33</span></button>'
  );
  html = html.replace(
    /<button type="button" class="filter-chip " data-category="social"><span>Social & Growth<\/span><span class="filter-count">\d+<\/span><\/button>/,
    '<button type="button" class="filter-chip " data-category="social"><span>Social & Growth</span><span class="filter-count">35</span></button>'
  );
  html = html.replace(
    /<button type="button" class="filter-chip " data-category="copywriting"><span>Copywriting & Sales<\/span><span class="filter-count">\d+<\/span><\/button>/,
    '<button type="button" class="filter-chip " data-category="copywriting"><span>Copywriting & Sales</span><span class="filter-count">37</span></button>'
  );
  html = html.replace(
    /<button type="button" class="filter-chip " data-category="creative"><span>Creative & Narrative<\/span><span class="filter-count">\d+<\/span><\/button>/,
    '<button type="button" class="filter-chip " data-category="creative"><span>Creative & Narrative</span><span class="filter-count">35</span></button>'
  );
  html = html.replace(
    /<button type="button" class="filter-chip " data-category="seo"><span>SEO & Discovery<\/span><span class="filter-count">\d+<\/span><\/button>/,
    '<button type="button" class="filter-chip " data-category="seo"><span>SEO & Discovery</span><span class="filter-count">35</span></button>'
  );
  html = html.replace(
    /<button type="button" class="filter-chip " data-category="technical"><span>Technical & Code<\/span><span class="filter-count">\d+<\/span><\/button>/,
    '<button type="button" class="filter-chip " data-category="technical"><span>Technical & Code</span><span class="filter-count">35</span></button>'
  );

  // Generate 50 HTML tool cards
  const newCards = [];
  for (const [id, tool] of Object.entries(BATCH_3_FULL_DATA)) {
    newCards.push(`          <div class="creator-tool-card tilt-card" data-tool-id="${id}" data-category="${tool.category}" id="card-${id}" style="cursor: pointer;">
            <div>
              <div class="creator-tool-header">
                <span class="creator-tool-icon" aria-hidden="true">${tool.icon}</span>
                <h3 class="creator-tool-title">${tool.title}</h3>
              </div>
              <p class="creator-tool-desc">${tool.desc}</p>
            </div>
            <div class="creator-tool-actions" style="margin-top: auto; padding-top: 1rem;">
              <a href="?tool=${id}" class="btn btn-primary btn-open-tool" style="width: 100%; text-align: center; justify-content: center; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;">
                <span>Open Tool</span>
                <svg class="arrow-nudge" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </a>
            </div>
          </div>`);
  }

  // Insert cards before </section> of #ai-tools-grid
  const gridStartTag = '<section class="creator-tools-grid" id="ai-tools-grid"';
  const gridStartIndex = html.indexOf(gridStartTag);
  if (gridStartIndex === -1) {
    throw new Error('Could not find #ai-tools-grid in ai-tools.html');
  }
  const gridEndTag = '</section>';
  const gridEndIndex = html.indexOf(gridEndTag, gridStartIndex);
  if (gridEndIndex === -1) {
    throw new Error('Could not find </section> for #ai-tools-grid in ai-tools.html');
  }

  // Only insert if not already present
  if (!html.includes('data-tool-id="vlog-script"')) {
    html = html.slice(0, gridEndIndex) + newCards.join('\n') + '\n' + html.slice(gridEndIndex);
    fs.writeFileSync('ai-tools.html', html, 'utf8');
    console.log('Updated ai-tools.html');
  } else {
    console.log('Cards already present in ai-tools.html');
  }
}

updateAiToolsHtml();

// 3. Update server.ts toolAliasMap
function updateServerTs() {
  let content = fs.readFileSync('server.ts', 'utf8');

  const aliasEntries = [];
  for (const [id, tool] of Object.entries(BATCH_3_FULL_DATA)) {
    aliasEntries.push(`    '${id}': '${tool.alias}',`);
  }

  const targetLine = "    'performance-review-comment-generator': 'plain-english'";
  if (!content.includes(targetLine)) {
    throw new Error('Could not find target line in server.ts');
  }

  const replacement = `${targetLine},

    // 50 NEW TOOLS (Batch 3 of 3 - Final) aliases
${aliasEntries.join('\n')}`;

  content = content.replace(targetLine, replacement);
  fs.writeFileSync('server.ts', content, 'utf8');
  console.log('Updated server.ts');
}

updateServerTs();

// 4. Update api/ai-proxy.js systemInstructions
function updateAiProxy() {
  let content = fs.readFileSync('api/ai-proxy.js', 'utf8');

  const instructionEntries = [];
  for (const [id, tool] of Object.entries(BATCH_3_FULL_DATA)) {
    instructionEntries.push(`      '${id}': robustRule + ${JSON.stringify(tool.systemInstruction)},`);
  }

  const targetLine = "'performance-review-comment-generator': robustRule + \"You are an executive coach and HR communications specialist. Write professional, balanced, constructive performance review comments highlighting concrete accomplishments, development opportunities, and measurable impact.\",";
  if (!content.includes(targetLine)) {
    throw new Error('Could not find target line in api/ai-proxy.js');
  }

  const replacement = `${targetLine}

      // 50 NEW TOOLS (Batch 3 of 3 - Final) system instructions
${instructionEntries.join('\n')}`;

  content = content.replace(targetLine, replacement);
  fs.writeFileSync('api/ai-proxy.js', content, 'utf8');
  console.log('Updated api/ai-proxy.js');
}

updateAiProxy();

// 5. Update metadata.json
function updateMetadata() {
  let content = fs.readFileSync('metadata.json', 'utf8');
  content = content.replace('1210 AI tools suite', '210 AI tools suite');
  fs.writeFileSync('metadata.json', content, 'utf8');
  console.log('Updated metadata.json');
}

updateMetadata();

// 6. Update site-search.js & public/assets/js/site-search.js
function updateSiteSearch(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/AI Tools \(160 tools\)/g, 'AI Tools (210 tools)');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

updateSiteSearch('assets/js/site-search.js');
updateSiteSearch('public/assets/js/site-search.js');

// 7. Update sitewide HTML pages
function updateSitewideHtml() {
  const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
  for (const file of htmlFiles) {
    if (file === 'ai-tools.html') continue; // already updated
    let html = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Marquee & badges
    if (html.includes('1210 AI Tools')) {
      html = html.replace(/1210 AI Tools/g, '210 AI Tools');
      changed = true;
    }
    if (html.includes('1210 AI tools')) {
      html = html.replace(/1210 AI tools/g, '210 AI tools');
      changed = true;
    }
    if (html.includes('AI Tools Suite')) {
      html = html.replace(/AI Tools Suite \(160\)/g, 'AI Tools Suite');
      changed = true;
    }
    if (html.includes('210 AI Generative Tools')) {
      html = html.replace(/160 AI Generative Tools/g, '210 AI Generative Tools');
      changed = true;
    }
    if (html.includes('data-count="160"')) {
      html = html.replace(/data-count="160"/g, 'data-count="210"');
      html = html.replace(/>160<span class="stat-plus">/g, '>210<span class="stat-plus">');
      changed = true;
    }
    if (html.includes('data-target="160"')) {
      html = html.replace(/data-target="160"/g, 'data-target="210"');
      changed = true;
    }
    if (html.includes('Explore All 1210 AI Tools')) {
      html = html.replace(/Explore All 1210 AI Tools/g, 'Explore All 210 AI Tools');
      changed = true;
    }
    if (html.includes('View All 1210 AI Tools →')) {
      html = html.replace(/View All 1210 AI Tools →/g, 'View All 210 AI Tools →');
      changed = true;
    }
    if (html.includes('1210 AI Tools Cloud')) {
      html = html.replace(/1210 AI Tools Cloud/g, '210 AI Tools Cloud');
      changed = true;
    }
    if (html.includes('1210 AI Tools.')) {
      html = html.replace(/1210 AI Tools\./g, '210 AI Tools.');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(file, html, 'utf8');
      console.log(`Updated sitewide counts in ${file}`);
    }
  }
}

updateSitewideHtml();

console.log('Batch 3 Application Completed Successfully!');

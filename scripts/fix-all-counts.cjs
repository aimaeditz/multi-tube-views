const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  replacements.forEach(({ search, replace }) => {
    if (typeof search === 'string') {
      content = content.split(search).join(replace);
    } else if (search instanceof RegExp) {
      content = content.replace(search, replace);
    }
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkAndReplace(dir, replacements) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file.endsWith('.min.js') || file.endsWith('.min.mjs')) return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      walkAndReplace(fullPath, replacements);
    } else if (/\.(html|js|json|md|mjs|cjs|ts|tsx)$/i.test(file)) {
      replaceInFile(fullPath, replacements);
    }
  });
}

console.log('=== FIXING ALL COUNTS (211 -> 210, 430 -> 429) ===');

// 1. Specific file updates & global replacements
const countReplacements = [
  // 210 AI tools replacements
  { search: '210 AI Tools Data Directory', replace: '210 AI Tools Data Directory' },
  { search: 'for 210 dedicated AI generative tools', replace: 'for 210 dedicated AI generative tools' },
  { search: '"id": "all",\n    "name": "All Tools",\n    "count": 211', replace: '"id": "all",\n    "name": "All Tools",\n    "count": 210' },
  { search: '"id": "all", "name": "All Tools", "count": 210', replace: '"id": "all", "name": "All Tools", "count": 210' },
  { search: '210 AI Generative Tools Engine', replace: '210 AI Generative Tools Engine' },
  { search: '210 Free Generative AI Writing Tools', replace: '210 Free Generative AI Writing Tools' },
  { search: '210 Free Generative AI Tools', replace: '210 Free Generative AI Tools' },
  { search: '210 dedicated AI generative tools', replace: '210 dedicated AI generative tools' },
  { search: '210 dedicated generative AI tools', replace: '210 dedicated generative AI tools' },
  { search: '210 Free AI Generative Tools', replace: '210 Free AI Generative Tools' },
  { search: '210 specialized generative AI tools', replace: '210 specialized generative AI tools' },
  { search: '210 free AI tools', replace: '210 free AI tools' },
  { search: 'AI Tools Suite (210)', replace: 'AI Tools Suite (210)' },
  { search: 'AI Tools (210 tools)', replace: 'AI Tools (210 tools)' },
  { search: '210 AI tools', replace: '210 AI tools' },
  { search: '210 AI Tools', replace: '210 AI Tools' },
  { search: '210 AI Generative Tools', replace: '210 AI Generative Tools' },
  { search: 'data-count="210"', replace: 'data-count="210"' },
  { search: 'data-target="210"', replace: 'data-target="210"' },
  { search: '>210<span class="stat-plus">', replace: '>210<span class="stat-plus">' },
  { search: 'data-count="210"', replace: 'data-count="210"' },
  { search: 'Search all 210 AI tools', replace: 'Search all 210 AI tools' },
  { search: 'Explore All 210 AI Tools', replace: 'Explore All 210 AI Tools' },
  { search: 'View All 210 AI Tools', replace: 'View All 210 AI Tools' },
  { search: '210 AI Tools Cloud', replace: '210 AI Tools Cloud' },
  { search: '<span>All Tools</span><span class="filter-count">210</span>', replace: '<span>All Tools</span><span class="filter-count">210</span>' },
  { search: '// 1. AI Tools (210)', replace: '// 1. AI Tools (210)' },
  { search: '// 2. AI Tools (210 tools)', replace: '// 2. AI Tools (210 tools)' },
  { search: ': 210)', replace: ': 210)' },
  { search: 'aiTools: 210', replace: 'aiTools: 210' },

  // Total tools replacements (430 -> 429)
  { search: '429 Instant Tools', replace: '429 Instant Tools' },
  { search: 'Search 429+ tools', replace: 'Search 429+ tools' },
  { search: '429+ tools, media converters', replace: '429+ tools, media converters' },
  { search: '429+ tools, converters', replace: '429+ tools, converters' },
  { search: 'totalTools: 429', replace: 'totalTools: 429' },
  { search: '210 + 60 + 89 + 70', replace: '210 + 60 + 89 + 70' }
];

walkAndReplace('.', countReplacements);

console.log('Done replacement pass!');

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

console.log('=== FIXING ALL COUNTS (AI: 211, Creator: 70, Media: 73, Browser Utilities: 111, Total: 465) ===');

// 1. Specific file updates & global replacements
const countReplacements = [
  // 1. AI Tools (210 -> 211)
  { search: '211 AI Tools Data Directory', replace: '211 AI Tools Data Directory' },
  { search: 'structured metadata for 211 dedicated', replace: 'structured metadata for 211 dedicated' },
  { search: 'for 211 dedicated AI', replace: 'for 211 dedicated AI' },
  { search: 'for 211 dedicated generative AI', replace: 'for 211 dedicated generative AI' },
  { search: '211 AI Generative Tools Engine', replace: '211 AI Generative Tools Engine' },
  { search: '211 Free Generative AI Writing Tools', replace: '211 Free Generative AI Writing Tools' },
  { search: '211 Free Generative AI Tools', replace: '211 Free Generative AI Tools' },
  { search: '211 dedicated AI generative tools', replace: '211 dedicated AI generative tools' },
  { search: '211 dedicated generative AI tools', replace: '211 dedicated generative AI tools' },
  { search: '211 Free AI Generative Tools', replace: '211 Free AI Generative Tools' },
  { search: '211 specialized generative AI tools', replace: '211 specialized generative AI tools' },
  { search: '211 free AI tools', replace: '211 free AI tools' },
  { search: '211 AI tools', replace: '211 AI tools' },
  { search: '211 AI Tools', replace: '211 AI Tools' },
  { search: '211 AI Generative Tools', replace: '211 AI Generative Tools' },
  { search: '211 AI Writing Tools', replace: '211 AI Writing Tools' },
  { search: 'Search all 211 AI tools', replace: 'Search all 211 AI tools' },
  { search: 'Explore All 211 AI Tools', replace: 'Explore All 211 AI Tools' },
  { search: 'View All 211 AI Tools', replace: 'View All 211 AI Tools' },
  { search: 'Browse All 211 AI Tools', replace: 'Browse All 211 AI Tools' },
  { search: '211 AI Tools Cloud', replace: '211 AI Tools Cloud' },
  { search: 'All 211 AI Tools', replace: 'All 211 AI Tools' },
  { search: 'over 211 free AI tools', replace: 'over 211 free AI tools' },
  { search: 'aiTools: 211', replace: 'aiTools: 211' },
  { search: 'data-count="211"', replace: 'data-count="211"' },
  { search: 'data-target="211"', replace: 'data-target="211"' },
  { search: '>211<span class="stat-plus">', replace: '>211<span class="stat-plus">' },
  { search: '<span>All Tools</span><span class="filter-count">211</span>', replace: '<span>All Tools</span><span class="filter-count">211</span>' },
  { search: '// 1. AI Tools (211)', replace: '// 1. AI Tools (211)' },
  { search: '// 2. AI Tools (211 tools)', replace: '// 2. AI Tools (211 tools)' },
  { search: ': 211)', replace: ': 211)' },

  // 2. Browser Utilities (89 -> 111)
  { search: '111 client-side browser utilities', replace: '111 client-side browser utilities' },
  { search: '111 Browser Utilities', replace: '111 Browser Utilities' },
  { search: '111 browser utilities', replace: '111 browser utilities' },
  { search: '111 free browser utilities', replace: '111 free browser utilities' },
  { search: '111 Free Browser Utilities', replace: '111 Free Browser Utilities' },
  { search: '111 tools & utilities', replace: '111 tools & utilities' },
  { search: '111 specialized', replace: '111 specialized' },
  { search: '111 in-browser', replace: '111 in-browser' },
  { search: '111 Client-Side', replace: '111 Client-Side' },
  { search: '111 client-side', replace: '111 client-side' },
  { search: 'data-count="111"', replace: 'data-count="111"' },
  { search: 'data-target="111"', replace: 'data-target="111"' },
  { search: '>111<span class="stat-plus">', replace: '>111<span class="stat-plus">' },
  { search: 'Search all 111 browser utilities', replace: 'Search all 111 browser utilities' },

  // 3. Media Converter Tools (60/70 -> 73)
  { search: '73 client-side browser-based media converters', replace: '73 client-side browser-based media converters' },
  { search: '73 browser-based media converters', replace: '73 browser-based media converters' },
  { search: '73 free media converters', replace: '73 free media converters' },
  { search: '73 Media Converters', replace: '73 Media Converters' },
  { search: '73 media converters', replace: '73 media converters' },
  { search: '73 in-browser media converters', replace: '73 in-browser media converters' },
  { search: '73 Media Converters', replace: '73 Media Converters' },
  { search: '73 media converters', replace: '73 media converters' },
  { search: '73 In-Browser Media Converters', replace: '73 In-Browser Media Converters' },
  { search: '73 In-Browser Client-Side Media Tools', replace: '73 In-Browser Client-Side Media Tools' },
  { search: '73 free media converters', replace: '73 free media converters' },
  { search: 'data-count="73"', replace: 'data-count="73"' },
  { search: 'data-count="73"', replace: 'data-count="73"' },
  { search: 'data-target="73"', replace: 'data-target="73"' },
  { search: 'data-target="73"', replace: 'data-target="73"' },

  // 4. Total Tools (430/429/464 -> 465)
  { search: '465 Instant Tools', replace: '465 Instant Tools' },
  { search: 'Search 465+ tools', replace: 'Search 465+ tools' },
  { search: '465+ tools, media converters', replace: '465+ tools, media converters' },
  { search: '465+ tools, converters', replace: '465+ tools, converters' },
  { search: 'totalTools: 465', replace: 'totalTools: 465' },
  { search: '465 Instant Tools', replace: '465 Instant Tools' },
  { search: 'Search 465+ tools', replace: 'Search 465+ tools' },
  { search: '465+ tools, media converters', replace: '465+ tools, media converters' },
  { search: '465+ tools, converters', replace: '465+ tools, converters' },
  { search: 'totalTools: 465', replace: 'totalTools: 465' },
  { search: '465 Instant Tools', replace: '465 Instant Tools' },
  { search: 'Search 465+ tools', replace: 'Search 465+ tools' },
  { search: '465+ tools', replace: '465+ tools' },
  { search: '465+ client-side', replace: '465+ client-side' },
  { search: '465+ free in-browser', replace: '465+ free in-browser' },
  { search: 'Discover all 465+ free', replace: 'Discover all 465+ free' },
  { search: 'Discover all 465+ client-side', replace: 'Discover all 465+ client-side' },
  { search: 'all 465+ free', replace: 'all 465+ free' },
  { search: 'all 465+ client-side', replace: 'all 465+ client-side' },
  { search: 'totalTools: 465', replace: 'totalTools: 465' },
  { search: 'id="stat-total-tools">465+</div>', replace: 'id="stat-total-tools">465+</div>' },
  { search: '211 + 73 + 111 + 70', replace: '211 + 73 + 111 + 70' }
];

walkAndReplace('.', countReplacements);

console.log('Done replacement pass!');

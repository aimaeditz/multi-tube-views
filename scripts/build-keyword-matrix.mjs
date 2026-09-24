import fs from 'fs';
import path from 'path';

// Import tool definitions
import { AI_TOOLS_DATA } from '../assets/data/ai-tools-data.js';
import { CREATOR_TOOLS_DATA } from '../assets/data/creator-tools-data.js';
import { ALL_TOOL_CONFIGS } from '../assets/js/media-tools-data.js';
import { BU_CATEGORIES, BU_ALL_TOOLS_LIST } from '../assets/data/browser-utilities-data.js';

const ROOT = path.resolve('.');

// Helper to derive keywords
function generateToolKeywords(toolId, title, desc, category, section) {
  const normTitle = title.toLowerCase().trim();
  const cleanId = toolId.toLowerCase().replace(/-/g, ' ');
  const words = normTitle.split(/\s+/);
  const baseKeyword = normTitle;

  // Primary
  const primary = [
    baseKeyword,
    `free ${baseKeyword}`,
    `${baseKeyword} online`,
    `${baseKeyword} tool`,
    `in browser ${baseKeyword}`
  ];

  // Secondary
  const secondary = [
    `${cleanId} generator`,
    `${cleanId} maker`,
    `${cleanId} utility`,
    `best ${baseKeyword} 2026`,
    `fast ${baseKeyword}`
  ];

  // Format-specific variations
  let formats = [];
  if (section === 'Media Converters' || toolId.includes('convert') || toolId.includes('pdf') || toolId.includes('image') || toolId.includes('video') || toolId.includes('audio')) {
    formats = [
      `${baseKeyword} mp4 to mp3`,
      `${baseKeyword} mov to wav`,
      `${baseKeyword} webp to png`,
      `${baseKeyword} heic to jpg`,
      `${baseKeyword} pdf to text`,
      `${baseKeyword} markdown to pdf`,
      `${baseKeyword} csv to json`,
      `${baseKeyword} high quality 320kbps`
    ];
  } else if (section === 'Browser Utilities') {
    formats = [
      `${baseKeyword} json format`,
      `${baseKeyword} hex rgb hsl`,
      `${baseKeyword} utf 8 unicode`,
      `${baseKeyword} base64 string`,
      `${baseKeyword} raw text`
    ];
  } else {
    formats = [
      `${baseKeyword} markdown format`,
      `${baseKeyword} plain text output`,
      `${baseKeyword} copy to clipboard`,
      `${baseKeyword} bullet points`
    ];
  }

  // Long-tail
  const longTail = [
    `free ${baseKeyword} without software download`,
    `how to use ${baseKeyword} in browser`,
    `best free ${baseKeyword} no subscription`,
    `safe and private ${baseKeyword} tool`,
    `instant ${baseKeyword} with export option`,
    `100 percent client side ${baseKeyword}`
  ];

  // Problem-based
  const problemBased = [
    `how to ${cleanId} online`,
    `easiest way to ${cleanId} on desktop`,
    `how to ${cleanId} on mobile phone`,
    `fix ${cleanId} issues quickly`,
    `${cleanId} without installing apps`,
    `quick solution for ${cleanId}`
  ];

  // Platform-specific
  const platformSpecific = [
    `${baseKeyword} for youtube`,
    `${baseKeyword} for instagram reels`,
    `${baseKeyword} for tiktok clips`,
    `${baseKeyword} for linkedin posts`,
    `${baseKeyword} for twitter threads`,
    `${baseKeyword} for podcasts`
  ];

  // Device-specific
  const deviceSpecific = [
    `${baseKeyword} for iphone`,
    `${baseKeyword} for android`,
    `${baseKeyword} for macbook chrome`,
    `${baseKeyword} for windows 11`,
    `${baseKeyword} for ipad safari`
  ];

  // Commercial / Value-based
  const commercial = [
    `free ${baseKeyword} no watermark`,
    `${baseKeyword} no signup`,
    `${baseKeyword} no login required`,
    `unlimited ${baseKeyword} free forever`,
    `${baseKeyword} zero server upload`,
    `privacy friendly ${baseKeyword}`
  ];

  // Use-case
  const useCase = [
    `${baseKeyword} for content creators`,
    `${baseKeyword} for digital marketers`,
    `${baseKeyword} for software developers`,
    `${baseKeyword} for students and teachers`,
    `${baseKeyword} for video editors`
  ];

  const allList = Array.from(new Set([
    ...primary,
    ...secondary,
    ...formats,
    ...longTail,
    ...problemBased,
    ...platformSpecific,
    ...deviceSpecific,
    ...commercial,
    ...useCase
  ]));

  return {
    toolId,
    title,
    section,
    category,
    totalCount: allList.length,
    clusters: {
      primary,
      secondary,
      formatSpecific: formats,
      longTail,
      problemBased,
      platformSpecific,
      deviceSpecific,
      commercial,
      useCase
    },
    allKeywords: allList
  };
}

console.log('Generating Programmatic Keyword Matrix for all 505 tools across 5 sections...');

const matrix = {
  metadata: {
    generatedDate: '2026-09-24',
    site: 'https://multitubeviews.com',
    totalTools: 505,
    sections: {
      platforms: 40,
      creatorTools: 70,
      aiTools: 211,
      mediaConverters: 73,
      browserUtilities: 111
    }
  },
  sections: {
    platforms: {},
    creatorTools: {},
    aiTools: {},
    mediaConverters: {},
    browserUtilities: {}
  }
};

// 1. Platforms (40)
const platformFiles = fs.readdirSync(path.join(ROOT, 'platforms'))
  .filter(f => f.endsWith('.html') && f !== 'index.html');

platformFiles.forEach(file => {
  const pId = file.replace('.html', '');
  const pTitle = pId.charAt(0).toUpperCase() + pId.slice(1);
  matrix.sections.platforms[pId] = generateToolKeywords(
    pId,
    `${pTitle} Multi Stream Player & Viewer`,
    `Watch multiple ${pTitle} streams and videos side-by-side`,
    'Platforms',
    'Platform Workspaces'
  );
});

// 2. Creator Tools (70)
Object.entries(CREATOR_TOOLS_DATA).forEach(([id, cfg]) => {
  matrix.sections.creatorTools[id] = generateToolKeywords(
    id,
    cfg.title,
    cfg.desc,
    cfg.category || 'Creator',
    'Creator Tools'
  );
});

// 3. AI Tools (211)
Object.entries(AI_TOOLS_DATA).forEach(([id, cfg]) => {
  matrix.sections.aiTools[id] = generateToolKeywords(
    id,
    cfg.title,
    cfg.desc,
    cfg.category || 'AI Tools',
    'AI Tools'
  );
});

// 4. Media Converters (73)
Object.entries(ALL_TOOL_CONFIGS).forEach(([id, cfg]) => {
  matrix.sections.mediaConverters[id] = generateToolKeywords(
    id,
    cfg.title,
    cfg.desc,
    cfg.category || 'Media',
    'Media Converters'
  );
});

// 5. Browser Utilities (111)
let buIds = [];
if (Array.isArray(BU_ALL_TOOLS_LIST)) {
  buIds = BU_ALL_TOOLS_LIST.map(t => typeof t === 'string' ? t : t.id);
} else {
  BU_CATEGORIES.forEach(c => {
    (c.tools || []).forEach(t => buIds.push(t));
  });
}
buIds = Array.from(new Set(buIds));

buIds.forEach(id => {
  let title = id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  // Find category
  let catName = 'Utilities';
  for (const c of BU_CATEGORIES) {
    if (c.tools && c.tools.includes(id)) {
      catName = c.name;
      break;
    }
  }
  matrix.sections.browserUtilities[id] = generateToolKeywords(
    id,
    title,
    `Client-side ${title} browser utility`,
    catName,
    'Browser Utilities'
  );
});

// Save to JSON
const outputPath = path.join(ROOT, 'assets/data/keyword-matrix.json');
const publicOutputPath = path.join(ROOT, 'public/assets/data/keyword-matrix.json');

const matrixJson = JSON.stringify(matrix, null, 2);
fs.writeFileSync(outputPath, matrixJson, 'utf8');
if (fs.existsSync(path.dirname(publicOutputPath))) {
  fs.writeFileSync(publicOutputPath, matrixJson, 'utf8');
}

console.log(`Keyword matrix generated successfully! Saved to:`);
console.log(`- ${outputPath}`);
console.log(`- ${publicOutputPath}`);
console.log(`Total tools cataloged: ${
  Object.keys(matrix.sections.platforms).length +
  Object.keys(matrix.sections.creatorTools).length +
  Object.keys(matrix.sections.aiTools).length +
  Object.keys(matrix.sections.mediaConverters).length +
  Object.keys(matrix.sections.browserUtilities).length
}`);

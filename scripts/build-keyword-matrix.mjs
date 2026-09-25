import fs from 'fs';
import path from 'path';

// Import tool definitions
import { AI_TOOLS_DATA } from '../assets/data/ai-tools-data.js';
import { CREATOR_TOOLS_DATA } from '../assets/data/creator-tools-data.js';
import { ALL_TOOL_CONFIGS } from '../assets/js/media-tools-data.js';
import { BU_CATEGORIES, BU_ALL_TOOLS_LIST } from '../assets/data/browser-utilities-data.js';

const ROOT = path.resolve('.');

// Comprehensive keyword generator for 50-100 keyword variations
function generateToolKeywords(toolId, title, desc, category, section) {
  const normTitle = title.toLowerCase().trim();
  const cleanId = toolId.toLowerCase().replace(/-/g, ' ');
  const words = normTitle.split(/\s+/).filter(w => w.length > 2);
  const baseKeyword = normTitle;

  // 1. Primary (exact tool name & variations)
  const primary = [
    baseKeyword,
    `${baseKeyword} tool`,
    `${baseKeyword} online`,
    `free ${baseKeyword}`,
    `${baseKeyword} free online`,
    `best ${baseKeyword}`,
    `in browser ${baseKeyword}`,
    `${cleanId} web tool`,
    `open source ${cleanId}`,
    `free online ${cleanId}`
  ];

  // 2. Secondary (synonyms, close variants)
  const secondary = [
    `${cleanId} generator`,
    `${cleanId} creator`,
    `${cleanId} maker`,
    `${cleanId} utility`,
    `${cleanId} software`,
    `${cleanId} app`,
    `${cleanId} builder`,
    `fast ${cleanId}`,
    `simple ${cleanId}`,
    `automated ${cleanId}`,
    `${baseKeyword} pro`,
    `smart ${cleanId}`
  ];

  // 3. Format-specific
  let formats = [];
  if (section === 'Media Converters' || toolId.includes('convert') || toolId.includes('pdf') || toolId.includes('image') || toolId.includes('video') || toolId.includes('audio')) {
    formats = [
      `${cleanId} mp4`,
      `${cleanId} mp3`,
      `${cleanId} mov to wav`,
      `${cleanId} webp to png`,
      `${cleanId} heic to jpg`,
      `${cleanId} png to jpg`,
      `${cleanId} pdf text`,
      `${cleanId} high bitrate 320kbps`,
      `${cleanId} lossless quality`,
      `${cleanId} 4k 1080p hd`
    ];
  } else if (section === 'Browser Utilities') {
    formats = [
      `${cleanId} json format`,
      `${cleanId} csv format`,
      `${cleanId} xml format`,
      `${cleanId} yaml format`,
      `${cleanId} base64 string`,
      `${cleanId} hex rgb hsl`,
      `${cleanId} utf 8 text`,
      `${cleanId} raw markdown`,
      `${cleanId} clipboard string`,
      `${cleanId} instant export`
    ];
  } else {
    formats = [
      `${cleanId} markdown format`,
      `${cleanId} plain text copy`,
      `${cleanId} rich text format`,
      `${cleanId} bullet list output`,
      `${cleanId} structured prompt`,
      `${cleanId} social card snippet`,
      `${cleanId} table format`
    ];
  }

  // 4. Long-tail (4-6 word phrases)
  const longTail = [
    `free online ${cleanId} without software download`,
    `how to use ${cleanId} in your browser`,
    `best free ${cleanId} tool no subscription`,
    `safe and private ${cleanId} web utility`,
    `instant ${cleanId} with instant copy export`,
    `100 percent client side ${cleanId} tool`,
    `high quality ${cleanId} for daily workflow`,
    `fastest browser based ${cleanId} online`,
    `unlimited usage ${cleanId} with zero lag`
  ];

  // 5. Problem-based ("how to...", "fix...", "without...")
  const problemBased = [
    `how to ${cleanId} online for free`,
    `easiest way to ${cleanId} on desktop`,
    `how to ${cleanId} on mobile phone without app`,
    `fix ${cleanId} formatting issues instantly`,
    `${cleanId} without installing external software`,
    `quick solution for ${cleanId} in browser`,
    `how to automate ${cleanId} tasks`,
    `troubleshoot ${cleanId} errors quickly`,
    `how to optimize ${cleanId} efficiency`
  ];

  // 6. Platform-specific (youtube, instagram, tiktok, etc.)
  const platformSpecific = [
    `${cleanId} for youtube videos`,
    `${cleanId} for instagram reels and posts`,
    `${cleanId} for tiktok creators and viral clips`,
    `${cleanId} for linkedin articles and carousels`,
    `${cleanId} for twitter threads and x posts`,
    `${cleanId} for podcast episodes and audiobooks`,
    `${cleanId} for twitch streamers and bilibili`,
    `${cleanId} for pinterest pins and facebook`
  ];

  // 7. Device-specific (iphone, android, mac, windows)
  const deviceSpecific = [
    `${cleanId} for iphone safari`,
    `${cleanId} for android chrome`,
    `${cleanId} for macbook air and pro`,
    `${cleanId} for windows 11 and 10`,
    `${cleanId} for ipad and tablet`,
    `${cleanId} for linux chromium browsers`,
    `${cleanId} for mobile browsers responsive`
  ];

  // 8. Commercial-intent (free, no signup, no watermark, unlimited)
  const commercial = [
    `free ${cleanId} no watermark`,
    `${cleanId} no signup required`,
    `${cleanId} no login no registration`,
    `unlimited ${cleanId} free forever`,
    `${cleanId} zero server upload private`,
    `secure client side ${cleanId}`,
    `ad free experience ${cleanId}`,
    `completely free ${cleanId} online tool`
  ];

  // 9. Use-case (podcast, reels, gaming, education, business)
  const useCase = [
    `${cleanId} for content creators and youtubers`,
    `${cleanId} for digital marketers and agencies`,
    `${cleanId} for software engineers and web developers`,
    `${cleanId} for students teachers and researchers`,
    `${cleanId} for video editors and podcasters`,
    `${cleanId} for small business owners and freelancers`,
    `${cleanId} for ecommerce product managers`,
    `${cleanId} for social media managers`
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

console.log('Generating Comprehensive Programmatic Keyword Matrix for 505 tools...');

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
    `Watch multiple ${pTitle} streams and videos side-by-side in real-time.`,
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

// Write to assets/data/keyword-matrix.json and public/assets/data/keyword-matrix.json
const outputPath = path.join(ROOT, 'assets/data/keyword-matrix.json');
const publicOutputPath = path.join(ROOT, 'public/assets/data/keyword-matrix.json');

const matrixJson = JSON.stringify(matrix, null, 2);
fs.writeFileSync(outputPath, matrixJson, 'utf8');
if (fs.existsSync(path.dirname(publicOutputPath))) {
  fs.writeFileSync(publicOutputPath, matrixJson, 'utf8');
}

let totalKeywords = 0;
['platforms', 'creatorTools', 'aiTools', 'mediaConverters', 'browserUtilities'].forEach(sec => {
  const tools = matrix.sections[sec];
  const count = Object.keys(tools).length;
  let secKw = 0;
  Object.values(tools).forEach(t => {
    secKw += t.totalCount;
  });
  totalKeywords += secKw;
  console.log(`- Section "${sec}": ${count} tools -> ${secKw} keywords (avg ${(secKw/count).toFixed(1)}/tool)`);
});

console.log(`\nTOTAL KEYWORDS GENERATED: ${totalKeywords} keywords across 505 tools.`);

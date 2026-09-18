import { AI_TOOLS_DATA } from '../assets/data/ai-tools-data.js';
import { BU_CATEGORIES, BU_ALL_TOOLS_LIST } from '../assets/data/browser-utilities-data.js';
import { CREATOR_TOOLS_DATA } from '../assets/data/creator-tools-data.js';
import { ALL_TOOL_CONFIGS } from '../assets/js/media-tools-data.js';
import fs from 'fs';

console.log('=== EXACT TOOL COUNTS AUDIT ===');

const aiToolsCount = Object.keys(AI_TOOLS_DATA).length;
console.log(`1. AI Tools count in JS data: ${aiToolsCount}`);

const creatorToolsCount = Object.keys(CREATOR_TOOLS_DATA).length;
console.log(`2. Creator Tools count in JS data: ${creatorToolsCount}`);

const mediaToolsCount = Object.keys(ALL_TOOL_CONFIGS).length;
console.log(`3. Media Converter Tools count in JS data: ${mediaToolsCount}`);

let buCount = 0;
if (Array.isArray(BU_ALL_TOOLS_LIST)) {
  buCount = BU_ALL_TOOLS_LIST.length;
} else if (Array.isArray(BU_CATEGORIES)) {
  buCount = BU_CATEGORIES.reduce((acc, cat) => acc + (cat.tools ? cat.tools.length : (cat.toolCount || 0)), 0);
}
console.log(`4. Browser Utilities count in JS data: ${buCount}`);

// Check html files for Browser Utilities
const buSubpages = fs.readdirSync('browser-utilities').filter(f => f.endsWith('.html') && f !== 'index.html');
console.log(`   (Browser Utilities html subpage files count: ${buSubpages.length})`);

// Check Platforms
const platformSubpages = fs.readdirSync('platforms').filter(f => f.endsWith('.html') && f !== 'index.html');
const platformHtml = fs.readFileSync('platforms.html', 'utf8');
const platformEngineJs = fs.readFileSync('assets/js/platform-engine.js', 'utf8');
const platformEngineMatches = (platformEngineJs.match(/id:\s*['"][a-z0-9_-]+['"]/gi) || []).length;
console.log(`5. Platforms HTML subpages count: ${platformSubpages.length}`);

console.log('--------------------------------------------------');
console.log(`TOTAL TOOLS (AI + Media + Browser Utilities + Creator): ${aiToolsCount + mediaToolsCount + buCount + creatorToolsCount}`);
console.log(`PLATFORMS COUNT: ${platformSubpages.length}`);

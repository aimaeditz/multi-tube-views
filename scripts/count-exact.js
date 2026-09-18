import fs from 'fs';
import path from 'path';

// Import data files
import { AI_TOOLS_DATA, AI_CATEGORIES } from '../assets/data/ai-tools-data.js';
import { CREATOR_TOOLS_DATA, CREATOR_CATEGORIES } from '../assets/data/creator-tools-data.js';
import { BU_CATEGORIES, BU_ALL_TOOLS_LIST } from '../assets/data/browser-utilities-data.js';
import { ALL_TOOL_CONFIGS } from '../assets/js/media-tools-data.js';

console.log("=== EXACT DATA COUNTS ===");
console.log("1. AI Tools (AI_TOOLS_DATA):", Object.keys(AI_TOOLS_DATA).length);
console.log("   AI_CATEGORIES 'all' count:", AI_CATEGORIES.find(c => c.id === 'all')?.count);

console.log("2. Creator Tools (CREATOR_TOOLS_DATA):", Object.keys(CREATOR_TOOLS_DATA).length);
console.log("   CREATOR_CATEGORIES 'all' count:", CREATOR_CATEGORIES.find(c => c.id === 'all')?.count);

let buCount = 0;
if (BU_ALL_TOOLS_LIST && Array.isArray(BU_ALL_TOOLS_LIST)) {
  buCount = BU_ALL_TOOLS_LIST.length;
} else if (BU_CATEGORIES) {
  const allTools = new Set();
  BU_CATEGORIES.forEach(cat => (cat.tools || []).forEach(t => allTools.add(t)));
  buCount = allTools.size;
}
console.log("3. Browser Utilities count:", buCount);

console.log("4. Media Tools (ALL_TOOL_CONFIGS):", Object.keys(ALL_TOOL_CONFIGS).length);

const platformFiles = fs.readdirSync('platforms').filter(f => f.endsWith('.html') && f !== 'index.html');
console.log("5. Platforms count:", platformFiles.length);

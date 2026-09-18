import fs from 'fs';
import { AI_TOOLS_DATA } from '../assets/data/ai-tools-data.js';

console.log("Keys in AI_TOOLS_DATA:", Object.keys(AI_TOOLS_DATA).length);
const keys = Object.keys(AI_TOOLS_DATA);
console.log("Keys list:", keys);

// Check if public/assets/data/ai-tools-data.js is identical or different
const rootFile = fs.readFileSync('assets/data/ai-tools-data.js', 'utf8');
const publicFile = fs.existsSync('public/assets/data/ai-tools-data.js') ? fs.readFileSync('public/assets/data/ai-tools-data.js', 'utf8') : '';

console.log("rootFile length:", rootFile.length, "publicFile length:", publicFile.length);

// Let's check if any key in AI_TOOLS_DATA is duplicate or non-tool or if there's any invalid key
const countsByCategory = {};
for (const [k, v] of Object.entries(AI_TOOLS_DATA)) {
  const cat = v.category || 'uncategorized';
  countsByCategory[cat] = (countsByCategory[cat] || 0) + 1;
}
console.log("Counts by category:", countsByCategory);

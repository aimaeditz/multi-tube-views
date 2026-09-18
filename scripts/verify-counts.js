const fs = require("fs");
const path = require("path");

console.log("=== VERIFYING TOOL COUNTS ===");

// 1. AI Tools
if (fs.existsSync("assets/data/ai-tools-data.js")) {
  const content = fs.readFileSync("assets/data/ai-tools-data.js", "utf8");
  // Evaluate or extract array length safely
  const toolIds = [...content.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  // filter out category/non-tool IDs if any, or unique IDs
  const uniqueIds = new Set(toolIds);
  console.log(`AI Tools: total id matches = ${toolIds.length}, unique = ${uniqueIds.size}`);
}

// 2. Creator Tools
if (fs.existsSync("assets/data/creator-tools-data.js")) {
  const content = fs.readFileSync("assets/data/creator-tools-data.js", "utf8");
  const toolIds = [...content.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const uniqueIds = new Set(toolIds);
  console.log(`Creator Tools: total id matches = ${toolIds.length}, unique = ${uniqueIds.size}`);
}

// 3. Browser Utilities
if (fs.existsSync("assets/data/browser-utilities-data.js")) {
  const content = fs.readFileSync("assets/data/browser-utilities-data.js", "utf8");
  const toolIds = [...content.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const uniqueIds = new Set(toolIds);
  console.log(`Browser Utilities: total id matches = ${toolIds.length}, unique = ${uniqueIds.size}`);
}

// 4. Media Tools
if (fs.existsSync("assets/js/media-tools-data.js")) {
  const content = fs.readFileSync("assets/js/media-tools-data.js", "utf8");
  const toolIds = [...content.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const uniqueIds = new Set(toolIds);
  console.log(`Media Tools: total id matches = ${toolIds.length}, unique = ${uniqueIds.size}`);
}

// 5. Platforms
if (fs.existsSync("platforms")) {
  const files = fs.readdirSync("platforms").filter(f => f.endsWith(".html") && f !== "index.html");
  console.log(`Platforms count (.html files in platforms/): ${files.length}`);
}

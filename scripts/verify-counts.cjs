const fs = require("fs");
const path = require("path");

console.log("=== VERIFYING TOOL COUNTS ===");

// Let's inspect tools-registry if it exists
if (fs.existsSync("assets/data/tools-registry.js")) {
  console.log("Found assets/data/tools-registry.js");
}

function countToolsInFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf8");
  // Try to parse array or match tool objects
  const toolIds = [...content.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const uniqueIds = new Set(toolIds);
  return { total: toolIds.length, unique: uniqueIds.size, ids: Array.from(uniqueIds) };
}

const ai = countToolsInFile("assets/data/ai-tools-data.js");
console.log("AI Tools (assets/data/ai-tools-data.js):", ai ? ai.unique : "not found");

const cr = countToolsInFile("assets/data/creator-tools-data.js");
console.log("Creator Tools (assets/data/creator-tools-data.js):", cr ? cr.unique : "not found");

const bu = countToolsInFile("assets/data/browser-utilities-data.js");
console.log("Browser Utilities (assets/data/browser-utilities-data.js):", bu ? bu.unique : "not found");

const media = countToolsInFile("assets/js/media-tools-data.js");
console.log("Media Tools (assets/js/media-tools-data.js):", media ? media.unique : "not found");

if (fs.existsSync("platforms")) {
  const platformFiles = fs.readdirSync("platforms").filter(f => f.endsWith(".html") && f !== "index.html");
  console.log("Platforms count (platforms/*.html):", platformFiles.length);
}

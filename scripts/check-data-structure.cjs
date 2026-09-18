const fs = require("fs");

console.log("=== CHECKING DATA FILES STRUCTURE ===");

function checkFileExports(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`${filePath} DOES NOT EXIST`);
    return;
  }
  const content = fs.readFileSync(filePath, "utf8");
  console.log(`\n--- ${filePath} (length: ${content.length}) ---`);
  // Print first few lines
  const lines = content.split("\n").slice(0, 25);
  console.log(lines.join("\n"));
}

checkFileExports("assets/data/ai-tools-data.js");
checkFileExports("assets/data/creator-tools-data.js");
checkFileExports("assets/data/browser-utilities-data.js");
checkFileExports("assets/data/tools-registry.js");
checkFileExports("assets/js/media-tools-data.js");

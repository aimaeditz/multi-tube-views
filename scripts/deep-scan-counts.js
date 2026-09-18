import fs from 'fs';
import path from 'path';

const VERIFIED_COUNTS = {
  platforms: 40,
  aiTools: 211,
  creatorTools: 70,
  mediaTools: 60,
  browserUtilities: 89,
  totalTools: 430 // 211 + 60 + 89 + 70
};

console.log('Verified Counts to enforce across entire site:', VERIFIED_COUNTS);

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', 'dist'].includes(file)) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (/\.(html|js|mjs|cjs|ts|json|md)$/.test(file)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles('.');
console.log(`Scanning ${allFiles.length} files for outdated numbers...`);

const findings = [];

allFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Check for "70 Creator" or "70 creator" or "70-tool creator" or "20 tools"
    if (/\b20\s*(-|\s)?\s*(creator|optimization)/i.test(line)) {
      findings.push({ file: filePath, lineNo: idx + 1, type: 'Creator Tools = 20 (Should be 70)', text: line.trim() });
    }
    // Check for total instant tools if outdated
    if (/\b(400|380|360|420)\s*(instant\s*)?tools\b/i.test(line)) {
      findings.push({ file: filePath, lineNo: idx + 1, type: 'Outdated Total Tools Count', text: line.trim() });
    }
  });
});

console.log(`Found ${findings.length} matches! Listing top findings...`);
findings.forEach(f => console.log(`[${f.file}:${f.lineNo}] (${f.type}): ${f.text.substring(0, 120)}`));

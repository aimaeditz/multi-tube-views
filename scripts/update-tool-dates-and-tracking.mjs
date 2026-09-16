import fs from 'fs';
import path from 'path';

// Helper to assign dates across a list of tool IDs
function assignDates(tools, startDateStr, endDateStr) {
  const dates = [];
  const start = new Date(startDateStr).getTime();
  const end = new Date(endDateStr).getTime();
  const step = (end - start) / Math.max(1, tools.length - 1);
  
  tools.forEach((t, idx) => {
    const d = new Date(start + idx * step);
    const dateStr = d.toISOString().slice(0, 10);
    dates.push(dateStr);
  });
  return dates;
}

// 1. Update AI Tools Data
function updateAiToolsData(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Specific recent dates for featured/latest tools
  const specialDates = {
    'youtube-script-writer': '2026-09-08',
    'viral-hooks-generator': '2026-09-07',
    'podcast-episode-planner': '2026-08-28',
    'voiceover-script-generator': '2026-08-25',
    'video-title-brainstormer': '2026-08-20',
  };

  // We add dateAdded field before the closing brace of each tool object if not present
  const updated = content.replace(/'([a-z0-9-]+)':\s*\{([\s\S]*?)\n  \}/g, (match, toolId, body) => {
    if (body.includes('dateAdded')) return match;
    const dateVal = specialDates[toolId] || '2026-05-10';
    return `'${toolId}': {${body},\n    dateAdded: '${dateVal}'\n  }`;
  });

  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`Updated AI tools dateAdded in ${filePath}`);
}

// 2. Update Creator Tools Data
function updateCreatorToolsData(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  const specialDates = {
    'ai-auto': '2026-09-14',
    'seo-title': '2026-09-06',
    'ab-title-test': '2026-09-02',
    'keywords': '2026-08-30'
  };

  const updated = content.replace(/'([a-z0-9-]+)':\s*\{([\s\S]*?)\n  \}/g, (match, toolId, body) => {
    if (body.includes('dateAdded')) return match;
    const dateVal = specialDates[toolId] || '2026-06-01';
    return `'${toolId}': {${body},\n    dateAdded: '${dateVal}'\n  }`;
  });

  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`Updated Creator tools dateAdded in ${filePath}`);
}

// 3. Update Media Converter Tools Data
function updateMediaToolsData(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  const specialDates = {
    'video-to-audio': '2026-09-05',
    'video-trimmer': '2026-08-29',
    'slow-reverb': '2026-08-22',
    'image-converter': '2026-09-04'
  };

  const updated = content.replace(/'([a-z0-9-]+)':\s*\{([\s\S]*?)\n    \}/g, (match, toolId, body) => {
    if (body.includes('dateAdded')) return match;
    const dateVal = specialDates[toolId] || '2026-06-15';
    return `'${toolId}': {${body},\n      dateAdded: '${dateVal}'\n    }`;
  });

  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`Updated Media tools dateAdded in ${filePath}`);
}

// 4. Update Browser Utilities Catalog Data
function updateBrowserUtilitiesData(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  const specialDates = {
    'border-radius-generator': '2026-09-16',
    'base64-encoder-decoder': '2026-09-15',
    'pomodoro-timer': '2026-09-14',
    'markdown-to-html': '2026-09-13',
    'password-strength-checker': '2026-09-12',
    'typing-speed-test': '2026-09-11',
    'timestamp-converter': '2026-09-10',
    'csv-to-json-converter': '2026-09-09',
    'word-counter': '2026-09-06',
    'json-formatter': '2026-09-03',
    'color-palette-generator': '2026-09-01',
    'find-replace': '2026-08-10',
    'lorem-ipsum-generator': '2026-08-05'
  };

  // BU_TOOLS_CATALOG is array of JSON objects
  const updated = content.replace(/\{\s*"id":\s*"([a-z0-9-]+)"([\s\S]*?)\}/g, (match, toolId, body) => {
    if (body.includes('"dateAdded"')) return match;
    const dateVal = specialDates[toolId] || '2026-07-01';
    return `{\n    "id": "${toolId}"${body},\n    "dateAdded": "${dateVal}"\n  }`;
  });

  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`Updated Browser Utilities dateAdded in ${filePath}`);
}

// Execute updates on both assets/ and public/assets/
updateAiToolsData('assets/data/ai-tools-data.js');
updateAiToolsData('public/assets/data/ai-tools-data.js');

updateCreatorToolsData('assets/data/creator-tools-data.js');
updateCreatorToolsData('public/assets/data/creator-tools-data.js');

updateMediaToolsData('assets/js/media-tools-data.js');
updateMediaToolsData('public/assets/js/media-tools-data.js');

updateBrowserUtilitiesData('assets/data/browser-utilities-data.js');
updateBrowserUtilitiesData('public/assets/data/browser-utilities-data.js');

console.log('Finished updating tool dates across all files.');

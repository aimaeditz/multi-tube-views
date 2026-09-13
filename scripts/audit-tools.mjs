import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('--- AUDITING 60 MEDIA CONVERTER TOOLS & 89 BROWSER UTILITIES ---');

// 1. Check Media Converter Tools
const mediaDataContent = fs.readFileSync(path.join(ROOT, 'assets/js/media-tools-data.js'), 'utf8');
const mediaHandlersContent = fs.readFileSync(path.join(ROOT, 'assets/js/media-tools-handlers.js'), 'utf8');
const mediaUiContent = fs.readFileSync(path.join(ROOT, 'assets/js/media-tools-ui.js'), 'utf8');
const mediaConverterContent = fs.readFileSync(path.join(ROOT, 'assets/js/media-converter.js'), 'utf8');
const mediaHtmlContent = fs.readFileSync(path.join(ROOT, 'media-converter-tools.html'), 'utf8');

// Extract all tools from ALL_TOOL_CONFIGS
const toolKeysMatch = mediaDataContent.match(/'([a-z0-9-]+)'\s*:\s*\{/g);
const mediaToolIds = toolKeysMatch ? toolKeysMatch.map(k => k.replace(/[':\s{]/g, '')) : [];

console.log(`Found ${mediaToolIds.length} Media Converter tool definitions in media-tools-data.js`);

// 2. Check 89 Browser Utilities
import { ALL_TOOLS } from './generate-all-pages.mjs';
console.log(`Found ${ALL_TOOLS.length} Browser Utilities defined in scripts`);

const buJsContent = fs.readFileSync(path.join(ROOT, 'assets/js/browser-utilities.js'), 'utf8');

console.log('\n--- VERIFYING BROWSER UTILITIES FILES ---');
let missingBuHtml = 0;
ALL_TOOLS.forEach(tool => {
  const pagePath = path.join(ROOT, 'browser-utilities', `${tool.slug}.html`);
  if (!fs.existsSync(pagePath)) {
    console.error(`MISSING HTML: browser-utilities/${tool.slug}.html`);
    missingBuHtml++;
  }
});
if (missingBuHtml === 0) {
  console.log(`All ${ALL_TOOLS.length} browser utility HTML files exist.`);
}

console.log('\n--- VERIFYING MEDIA CONVERTER TOOLS IN HTML & HANDLERS ---');
mediaToolIds.forEach(toolId => {
  // Check if tool has card or representation in media-converter-tools.html or media-tools-data
  const inHtml = mediaHtmlContent.includes(`data-tool="${toolId}"`) || mediaHtmlContent.includes(`id="panel-${toolId}"`);
  
  // Check if tool handled in media-converter.js or media-tools-ui.js
  const inConverterSwitch = mediaConverterContent.includes(`case '${toolId}':`);
  const inUiKnown = mediaUiContent.includes(`'${toolId}'`);
  const inHandlers = mediaHandlersContent.includes(toolId);

  const isHandled = inConverterSwitch || inUiKnown || inHandlers;
  if (!isHandled) {
    console.warn(`WARNING: Media tool ${toolId} has no direct handler found!`);
  }
});

console.log('Media tools audit scan complete.');

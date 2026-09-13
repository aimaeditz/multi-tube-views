import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('MTV ULTIMATE 149 TOOLS DEEP AUDIT & VERIFICATION');
console.log('====================================================');

// --- PART 1: MEDIA CONVERTER TOOLS (60 TOOLS) ---
const mediaDataContent = fs.readFileSync(path.join(ROOT, 'assets/js/media-tools-data.js'), 'utf8');
const mediaHtmlContent = fs.readFileSync(path.join(ROOT, 'media-converter-tools.html'), 'utf8');
const mediaHandlersContent = fs.readFileSync(path.join(ROOT, 'assets/js/media-tools-handlers.js'), 'utf8');
const mediaUiContent = fs.readFileSync(path.join(ROOT, 'assets/js/media-tools-ui.js'), 'utf8');
const mediaConverterContent = fs.readFileSync(path.join(ROOT, 'assets/js/media-converter.js'), 'utf8');

// Parse tool IDs from media-tools-data.js
const toolConfigMatches = [...mediaDataContent.matchAll(/'([a-z0-9-]+)'\s*:\s*\{([^}]+category:\s*'([a-z-]+)')?/g)];
const mediaTools = [];
const seenIds = new Set();

// Let's get the exact keys from ALL_TOOL_CONFIGS
const keyRegex = /'([a-z0-9-]+)'\s*:\s*\{/g;
let m;
while ((m = keyRegex.exec(mediaDataContent)) !== null) {
  const id = m[1];
  if (!seenIds.has(id)) {
    seenIds.add(id);
    // Find category
    const startIdx = m.index;
    const chunk = mediaDataContent.slice(startIdx, startIdx + 400);
    const catMatch = chunk.match(/category:\s*'([a-z-]+)'/);
    const cat = catMatch ? catMatch[1] : 'unknown';
    mediaTools.push({ id, category: cat });
  }
}

console.log(`\nFound ${mediaTools.length} Media Converter Tools in media-tools-data.js.`);

// Check categories distribution
const catCounts = {};
mediaTools.forEach(t => {
  catCounts[t.category] = (catCounts[t.category] || 0) + 1;
});
console.log('Categories distribution:', catCounts);

let mediaErrors = 0;

mediaTools.forEach((tool, index) => {
  const id = tool.id;
  // 1. Is card in media-converter-tools.html?
  const hasCard = mediaHtmlContent.includes(`data-tool-id="${id}"`);
  // 2. Is handler registered?
  const inConverter = mediaConverterContent.includes(`case '${id}':`) || 
                      (id === 'voice-to-text' && mediaConverterContent.includes('initVoiceToText')) ||
                      (id === 'text-to-speech' && mediaConverterContent.includes('initTextToSpeech')) ||
                      (id === 'qr-generator' && mediaConverterContent.includes('initQrGenerator')) ||
                      (id === 'pdf-image-converter' && mediaConverterContent.includes('initPdfImageConverter'));
  
  const inUiKnown = mediaUiContent.includes(`'${id}'`);
  const inHandlers = mediaHandlersContent.includes(`case '${id}':`) || 
                     mediaHandlersContent.includes(`${id.replace(/-/g, '_')}:`) ||
                     mediaHandlersContent.includes(`'${id}'`);

  if (!hasCard) {
    console.error(`[MEDIA ERROR] Tool ${id} has NO card in media-converter-tools.html`);
    mediaErrors++;
  }
  if (!inConverter && !inUiKnown && !inHandlers) {
    console.error(`[MEDIA ERROR] Tool ${id} has NO handler in media-converter.js or media-tools-ui/handlers.js`);
    mediaErrors++;
  }
});

console.log(`Media tools check completed with ${mediaErrors} structural errors.`);

// --- PART 2: BROWSER UTILITIES (89 TOOLS) ---
const buDir = path.join(ROOT, 'browser-utilities');
const buFiles = fs.readdirSync(buDir).filter(f => f.endsWith('.html'));

// Filter out category hub pages if any (let's see what HTML files exist in browser-utilities)
console.log(`\nFound ${buFiles.length} HTML files in browser-utilities/ directory.`);

// Let's load browser-utilities.js and inspect all functions on window.MTV_BU
const buJsContent = fs.readFileSync(path.join(ROOT, 'assets/js/browser-utilities.js'), 'utf8');

// Extract all method names on MTV_BU
const buMethods = new Set();
const methodRegex = /([a-zA-Z0-9_]+)\s*:\s*(?:function|async function|\()/g;
let methMatch;
while ((methMatch = methodRegex.exec(buJsContent)) !== null) {
  buMethods.add(methMatch[1]);
}
console.log(`Detected ${buMethods.size} methods in MTV_BU.`);

let buDomErrors = 0;
let buMissingMethodErrors = 0;
let auditedToolsCount = 0;

buFiles.forEach(file => {
  const filePath = path.join(buDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Skip category list pages like text-utilities.html if they are just hubs
  if (content.includes('class="bu-tool-page"') || content.includes('<script>') || content.includes('addEventListener')) {
    auditedToolsCount++;

    // Find all calls to window.MTV_BU.<method> or MTV_BU.<method>
    const buCalls = [...content.matchAll(/(?:window\.)?MTV_BU\.([a-zA-Z0-9_]+)/g)].map(m => m[1]);
    buCalls.forEach(method => {
      if (!buMethods.has(method)) {
        console.error(`[BU METHOD ERROR in ${file}] Called MTV_BU.${method} which is NOT defined in browser-utilities.js!`);
        buMissingMethodErrors++;
      }
    });

    // Find all document.getElementById('...') in script tags
    const scriptBlocks = [...content.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
    scriptBlocks.forEach(code => {
      const idMatches = [...code.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
      idMatches.forEach(elemId => {
        // Check if element with this ID exists in HTML
        const hasId = content.includes(`id="${elemId}"`) || content.includes(`id='${elemId}'`);
        if (!hasId) {
          console.error(`[BU DOM ID MISMATCH in ${file}] Script looks for element id="${elemId}", but it does NOT exist in HTML!`);
          buDomErrors++;
        }
      });
    });
  }
});

console.log(`\nAudited ${auditedToolsCount} Browser Utility pages.`);
console.log(`BU Missing Method Errors: ${buMissingMethodErrors}`);
console.log(`BU DOM ID Mismatch Errors: ${buDomErrors}`);
console.log('\nAudit complete.');

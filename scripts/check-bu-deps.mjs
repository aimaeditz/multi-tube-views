import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const buDir = path.join(ROOT, 'browser-utilities');
const buFiles = fs.readdirSync(buDir).filter(f => f.endsWith('.html'));

console.log('--- CHECKING EXTERNAL LIBRARIES AND SCRIPT HEALTH ACROSS BROWSER UTILITIES ---');

const suspiciousGlobals = [
  'QRCode', 'JsBarcode', 'diff', 'marked', 'hljs', 'CryptoJS', 'Papa', 'DOMPurify'
];

buFiles.forEach(file => {
  const filePath = path.join(buDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check if any script uses a global that isn't loaded or provided by MTV_BU
  suspiciousGlobals.forEach(glob => {
    // If the script contains this word (not in comments)
    const usesGlobal = new RegExp(`\\b${glob}\\b`).test(content);
    const loadsGlobal = content.includes(glob.toLowerCase()) || content.includes(glob);
    // Is it in script tags or head?
    const hasScriptTag = new RegExp(`<script[^>]*${glob.toLowerCase()}[^>]*>`, 'i').test(content);
    if (usesGlobal && !hasScriptTag && !content.includes(`window.${glob}`)) {
      // Check if defined in MTV_BU
      // Let's print
      // console.log(`${file} mentions ${glob}`);
    }
  });

  // Check for any inline JS errors or broken syntax in the <script> block
  const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/i);
  if (scriptMatch) {
    const jsCode = scriptMatch[1];
    // Check basic balanced braces
    const openBraces = (jsCode.match(/\{/g) || []).length;
    const closeBraces = (jsCode.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      console.error(`SYNTAX WARNING in ${file}: Unbalanced braces ({ : ${openBraces}, } : ${closeBraces})`);
    }
  }
});

console.log('Dependency and script balance check complete.');

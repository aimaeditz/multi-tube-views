import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const INSTANT_THEME_SCRIPT = `  <script>
    (function(){
      try {
        var t = localStorage.getItem('mtv_theme');
        var eff = (t === 'dark') ? 'dark' : (t === 'light' ? 'light' : ((t === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'));
        var bg = eff === 'dark' ? '#0A0A0C' : '#FDFDFD';
        var color = eff === 'dark' ? '#F5F5F7' : '#1D1D1F';
        var doc = document.documentElement;
        doc.setAttribute('data-theme', eff);
        doc.style.colorScheme = eff;
        doc.style.backgroundColor = bg;
        document.write('<style id="mtv-instant-bg">html,html body{background-color:' + bg + ' !important;background:' + bg + ' !important;color:' + color + ' !important;}</style>');
      } catch(e){}
    })();
  </script>`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Ensure <html ...> has data-theme="light" and style attributes if minimal
  if (content.includes('<html lang="en">')) {
    content = content.replace('<html lang="en">', '<html lang="en" data-theme="light" style="background-color: #FDFDFD; color-scheme: light;">');
  } else if (content.includes('<html lang="en" class="desktop-ref-body">')) {
    content = content.replace('<html lang="en" class="desktop-ref-body">', '<html lang="en" class="desktop-ref-body" data-theme="light" style="background-color: #FDFDFD; color-scheme: light;">');
  }

  // 2. Remove all existing inline theme scripts to prevent duplicates or delayed execution
  content = content.replace(/<!-- Instant Theme Boot Script to prevent flash or lag -->\s*<script>[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<!-- Instant Theme Script to avoid flash -->\s*<script type="module" src="[^"]*storage\.js"><\/script>\s*<script type="module" src="[^"]*theme\.js"><\/script>\s*<!-- Instant Theme Boot Script to prevent flash or lag -->\s*<script>[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<script>\s*\(function\(\)\{\s*try\s*\{\s*var t = localStorage\.getItem\('mtv_theme'\);[\s\S]*?<\/script>/gi, '');

  // 3. Inject new high-priority Instant Theme Script immediately after <head>
  if (content.includes('<head>')) {
    content = content.replace('<head>', `<head>\n${INSTANT_THEME_SCRIPT}`);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.aistudio', 'public'].includes(entry.name)) {
        continue;
      }
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      processFile(fullPath);
    }
  }
}

console.log('Injecting instant flicker-proof theme script across all HTML pages...');
processDirectory(ROOT);
console.log('Successfully updated all HTML files with top-level Instant Theme Script!');

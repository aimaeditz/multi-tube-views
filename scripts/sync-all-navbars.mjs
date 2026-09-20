import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function getNavHtml(relPath) {
  const depth = relPath.includes('/') ? relPath.split('/').length - 1 : 0;
  const p = depth === 0 ? '' : '../'.repeat(depth);
  const cleanPath = relPath.replace(/\\/g, '/');

  let activeKey = '';
  if (cleanPath === 'index.html' || cleanPath === '' || cleanPath.endsWith('/index.html')) {
    activeKey = 'home';
  } else if (cleanPath.startsWith('explore-hub')) {
    activeKey = 'explore-hub';
  } else if (cleanPath.startsWith('ai-tools')) {
    activeKey = 'ai-tools';
  } else if (cleanPath.startsWith('ai-prompt') || cleanPath.startsWith('ai-auto')) {
    activeKey = 'ai-prompt';
  } else if (cleanPath.startsWith('creator-tools')) {
    activeKey = 'creator-tools';
  } else if (cleanPath.startsWith('media-converter-tools')) {
    activeKey = 'media-converter-tools';
  } else if (cleanPath.startsWith('browser-utilities')) {
    activeKey = 'browser-utilities';
  } else if (cleanPath.startsWith('platforms')) {
    activeKey = 'platforms';
  } else if (cleanPath.startsWith('about')) {
    activeKey = 'about';
  } else if (cleanPath.startsWith('settings')) {
    activeKey = 'settings';
  } else if (cleanPath.startsWith('privacy')) {
    activeKey = 'privacy';
  } else if (cleanPath.startsWith('disclaimer')) {
    activeKey = 'disclaimer';
  } else if (cleanPath.startsWith('terms')) {
    activeKey = 'terms';
  } else if (cleanPath.startsWith('contact')) {
    activeKey = 'contact';
  }

  const isHomeActive = activeKey === 'home' ? 'active' : '';
  const isExploreActive = activeKey === 'explore-hub' ? 'active' : '';
  const isAiPromptActive = activeKey === 'ai-prompt' ? 'active' : '';
  const isAiToolsActive = activeKey === 'ai-tools' ? 'active' : '';
  const isCreatorActive = activeKey === 'creator-tools' ? 'active' : '';
  const isConverterActive = activeKey === 'media-converter-tools' ? 'active' : '';
  const isBUActive = activeKey === 'browser-utilities' ? 'active' : '';
  const isPlatformsActive = activeKey === 'platforms' ? 'active' : '';
  const isInfoActive = ['about', 'contact', 'settings'].includes(activeKey) ? 'active' : '';
  const isContactActive = activeKey === 'contact' ? 'active' : '';
  const isAboutActive = activeKey === 'about' ? 'active' : '';
  const isSettingsActive = activeKey === 'settings' ? 'active' : '';

  return `<nav class="nav-desktop" aria-label="Main Navigation">
        <a href="${p}index.html" class="nav-link nav-link-home ${isHomeActive}">Home</a>
        <a href="${p}explore-hub.html" class="nav-link ${isExploreActive}">Explore</a>
        <a href="${p}ai-prompt.html" class="nav-link ${isAiPromptActive}">Prompt</a>
        <a href="${p}ai-tools.html" class="nav-link ${isAiToolsActive}">Tools</a>
        <a href="${p}creator-tools.html" class="nav-link ${isCreatorActive}">Creator</a>
        <a href="${p}media-converter-tools.html" class="nav-link ${isConverterActive}">Converter</a>
        <a href="${p}browser-utilities.html" class="nav-link ${isBUActive}">Browser</a>
        <a href="${p}platforms.html" class="nav-link ${isPlatformsActive}">Platforms</a>
        <div class="nav-dropdown" id="nav-info-dropdown">
          <button type="button" class="nav-link nav-dropdown-btn ${isInfoActive}" id="nav-info-btn" aria-haspopup="true" aria-expanded="false" aria-controls="nav-info-menu">
            <span>Info</span>
            <svg class="dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="nav-dropdown-menu" id="nav-info-menu" role="menu" aria-label="Info Menu">
            <a href="${p}contact.html" class="nav-dropdown-item ${isContactActive}" role="menuitem" style="--item-index: 0;">
              <svg class="nav-dropdown-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>Contact</span>
            </a>
            <a href="${p}about.html" class="nav-dropdown-item ${isAboutActive}" role="menuitem" style="--item-index: 1;">
              <svg class="nav-dropdown-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>About</span>
            </a>
            <a href="${p}settings.html" class="nav-dropdown-item ${isSettingsActive}" role="menuitem" style="--item-index: 2;">
              <svg class="nav-dropdown-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>Settings</span>
            </a>
          </div>
        </div>
      </nav>`;
}

function processDirectory(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(base, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git' || entry.name === '.aistudio' || entry.name === 'public') {
        continue;
      }
      processDirectory(fullPath, relPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('<nav class="nav-desktop"')) {
        const navRegex = /<nav class="nav-desktop"[^>]*>[\s\S]*?<\/nav>/;
        const newNav = getNavHtml(relPath);
        content = content.replace(navRegex, newNav);
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

console.log('Syncing desktop navbar across all HTML pages...');
processDirectory(ROOT);
console.log('Successfully synced all desktop navbars with Info dropdown!');

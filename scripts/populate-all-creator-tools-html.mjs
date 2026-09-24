import fs from 'fs';
import path from 'path';
import { CREATOR_TOOLS_DATA } from '../assets/data/creator-tools-data.js';

const ROOT = path.resolve('.');
const htmlPath = path.join(ROOT, 'creator-tools.html');
let content = fs.readFileSync(htmlPath, 'utf8');

// Find existing tool cards in HTML
const existingIds = new Set();
const idMatches = content.matchAll(/data-tool-id="([^"]+)"/g);
for (const m of idMatches) {
  existingIds.add(m[1]);
}

console.log(`Found ${existingIds.size} existing cards in creator-tools.html. Adding remaining ${70 - existingIds.size} cards...`);

let newCardsHtml = '';
for (const [id, tool] of Object.entries(CREATOR_TOOLS_DATA)) {
  if (!existingIds.has(id)) {
    newCardsHtml += `
          <!-- Tool: ${tool.title} -->
          <div class="creator-tool-card" data-tool-id="${id}" data-category="${tool.category || 'seo'}">
            <div>
              <div class="creator-tool-header">
                <span class="creator-tool-icon" aria-hidden="true">${tool.icon || '⚡'}</span>
                <h3 class="creator-tool-title">${tool.title}</h3>
              </div>
              <p class="creator-tool-desc">${tool.desc}</p>
            </div>
            <div class="creator-tool-actions" style="margin-top: auto; padding-top: 1rem;">
              <a href="creator-tools/${id}.html" class="btn btn-primary btn-open-tool" style="width: 100%; text-align: center; justify-content: center; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;">
                <span>Open Tool</span>
                <svg class="arrow-nudge" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </a>
            </div>
          </div>
    `;
  }
}

content = content.replace('</section>\n\n        <!-- About/Transparency Note Card -->', `${newCardsHtml}\n        </section>\n\n        <!-- About/Transparency Note Card -->`);

fs.writeFileSync(htmlPath, content, 'utf8');
const publicPath = path.join(ROOT, 'public/creator-tools.html');
if (fs.existsSync(publicPath)) {
  fs.copyFileSync(htmlPath, publicPath);
}

console.log('✓ Successfully populated all 70 tool cards into creator-tools.html');

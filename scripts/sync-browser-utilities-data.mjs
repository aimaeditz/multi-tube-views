import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BU_CATEGORIES } from './build-categories-data.mjs';
import { ALL_TOOLS } from './generate-all-pages.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const catMap = new Map(BU_CATEGORIES.map(c => [c.id, c.name]));

const catalog = ALL_TOOLS.map(t => ({
  id: t.id,
  name: t.name,
  icon: t.icon,
  categoryId: t.categoryId,
  categoryName: catMap.get(t.categoryId) || t.categoryId,
  description: t.description,
  keywords: t.keywords || '',
  dateAdded: '2026-09-18'
}));

const fileContent = `/**
 * Multi Tube Views (MTV) — Browser Utilities Categories & Tools Registry
 * ${ALL_TOOLS.length} In-Browser Client-Side Tools across ${BU_CATEGORIES.length} Specialized Categories.
 */

export const BU_CATEGORIES = ${JSON.stringify(BU_CATEGORIES, null, 2)};

export const BU_ALL_TOOLS_LIST = BU_CATEGORIES.flatMap(cat => cat.tools);

if (typeof window !== 'undefined') {
  window.MTV_BU_CATEGORIES = BU_CATEGORIES;
  window.MTV_BU_ALL_TOOLS_LIST = BU_ALL_TOOLS_LIST;
}

export const BU_TOOLS_CATALOG = ${JSON.stringify(catalog, null, 2)};

if (typeof window !== "undefined") {
  window.MTV_BU_TOOLS_CATALOG = BU_TOOLS_CATALOG;
}
`;

fs.writeFileSync(path.join(ROOT, 'assets', 'data', 'browser-utilities-data.js'), fileContent, 'utf8');
console.log(`✓ Synchronized assets/data/browser-utilities-data.js with ${ALL_TOOLS.length} tools across ${BU_CATEGORIES.length} categories.`);

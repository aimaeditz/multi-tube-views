import fs from 'fs';
import path from 'path';

const matrix = JSON.parse(fs.readFileSync('assets/data/keyword-matrix.json', 'utf8'));

let md = `# Multi Tube Views (MTV) — Universal Programmatic Keyword Matrix
**Total Tools Analyzed:** 505  
**Total Keyword Variations:** 25,000+  
**Target Domain:** https://multitubeviews.com  
**Sections:**
1. Platform Workspaces (40)
2. Creator Tools (70)
3. AI Tools (211)
4. Media Converters (73)
5. Browser Utilities (111)

---

`;

const sectionTitles = {
  platforms: 'Section 1: Platform Workspaces (40 Platforms)',
  creatorTools: 'Section 2: Creator Tools (70 Tools)',
  aiTools: 'Section 3: AI Tools (211 Tools)',
  mediaConverters: 'Section 4: Media Converters (73 Tools)',
  browserUtilities: 'Section 5: Browser Utilities (111 Tools)'
};

for (const [secKey, secTitle] of Object.entries(sectionTitles)) {
  const secData = matrix.sections[secKey];
  md += `## ${secTitle}\n\n`;
  md += `| Tool / Platform | Primary Keyword | High-Intent Long-Tail Queries | Problem / Solution Queries | Formats & Platform Modifiers |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- |\n`;

  for (const [id, tool] of Object.entries(secData)) {
    const primary = tool.clusters.primary.slice(0, 2).join('<br>');
    const longTail = tool.clusters.longTail.slice(0, 2).join('<br>');
    const problem = tool.clusters.problemBased.slice(0, 2).join('<br>');
    const format = [...tool.clusters.formatSpecific.slice(0, 1), ...tool.clusters.platformSpecific.slice(0, 1)].join('<br>');

    md += `| **${tool.title}** (\`${id}\`) | ${primary} | ${longTail} | ${problem} | ${format} |\n`;
  }

  md += `\n---\n\n`;
}

fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/programmatic-keyword-matrix.md', md, 'utf8');
console.log('Saved docs/programmatic-keyword-matrix.md');

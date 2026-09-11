import fs from 'fs';
import path from 'path';

// Helper for HTML escaping
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const CATEGORIES = [
  {
    id: 'text-utilities',
    name: 'Text Utilities',
    icon: '✍️',
    toolCount: 6,
    desc: 'Clean, format, sort, analyze, and convert text case, lines, and characters directly in your browser.',
    filename: 'text-utilities.html',
    tools: [
      'text-case-converter',
      'word-counter',
      'character-counter',
      'duplicate-line-remover',
      'text-sorter',
      'text-cleaner'
    ]
  },
  {
    id: 'image-utilities',
    name: 'Image & Graphics Utilities',
    icon: '🎨',
    toolCount: 6,
    desc: 'Pick and inspect colors, generate palettes, convert HEX/RGB/HSL, extract dominant colors, and sanitize SVG graphics.',
    filename: 'image-utilities.html',
    tools: [
      'color-picker',
      'color-palette-generator',
      'hex-rgb-hsl-converter',
      'image-color-extractor',
      'svg-viewer',
      'image-metadata-viewer'
    ]
  },
  {
    id: 'web-seo-utilities',
    name: 'Web & SEO Utilities',
    icon: '🌐',
    toolCount: 6,
    desc: 'Generate HTML meta tags, inspect Open Graph social cards, parse URLs, build UTM links, and create robots & sitemaps.',
    filename: 'web-seo-utilities.html',
    tools: [
      'meta-tag-generator',
      'open-graph-preview',
      'url-parser',
      'utm-builder',
      'robots-txt-generator',
      'sitemap-xml-generator'
    ]
  },
  {
    id: 'file-data-utilities',
    name: 'File & Data Utilities',
    icon: '📁',
    toolCount: 6,
    desc: 'View CSV data, convert between CSV and JSON, inspect file headers, calculate cryptographic hashes, and merge text files.',
    filename: 'file-data-utilities.html',
    tools: [
      'csv-viewer',
      'csv-to-json-converter',
      'json-to-csv-converter',
      'file-information-viewer',
      'file-hash-generator',
      'text-file-merger'
    ]
  },
  {
    id: 'everyday-utilities',
    name: 'Everyday Utilities',
    icon: '⏱️',
    toolCount: 6,
    desc: 'Audit password strength locally, convert Unix timestamps, compute date differences, calculate percentages, and convert bases.',
    filename: 'everyday-utilities.html',
    tools: [
      'password-strength-checker',
      'timestamp-converter',
      'date-difference-calculator',
      'percentage-calculator',
      'number-base-converter',
      'random-data-generator'
    ]
  },
  {
    id: 'developer-utilities',
    name: 'Developer Utilities',
    icon: '⚡',
    toolCount: 6,
    desc: 'Format and validate JSON, test regex patterns, encode/decode Base64 and URLs, and generate v4 UUIDs.',
    filename: 'developer-utilities.html',
    tools: [
      'json-formatter',
      'json-validator',
      'base64-encoder-decoder',
      'url-encoder-decoder',
      'regex-tester',
      'uuid-generator'
    ]
  }
];

export const BU_CATEGORIES = CATEGORIES.map(c => ({
  ...c,
  description: c.desc
}));

export { CATEGORIES };

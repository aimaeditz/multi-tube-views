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
  // 9 New Categories FIRST
  {
    id: 'text-writing-extras',
    name: 'Text & Writing Extras',
    icon: '📝',
    toolCount: 8,
    desc: 'Find and replace text, generate lorem ipsum, inspect diffs, create slugs, reverse strings, generate unicode fonts, and convert binary/ASCII.',
    filename: 'text-writing-extras.html',
    tools: [
      'find-replace',
      'lorem-ipsum-generator',
      'text-diff-checker',
      'slug-url-generator',
      'text-reverser',
      'fancy-text-generator',
      'reading-time-calculator',
      'text-binary-ascii-converter'
    ]
  },
  {
    id: 'unit-format-converters',
    name: 'Unit & Format Converters',
    icon: '🔄',
    toolCount: 16,
    desc: 'Convert measurement units across length, weight, area, volume, speed, pressure, energy, power, angle, fuel economy, digital storage, data transfer rate, currencies, time zones, Markdown, and dates.',
    filename: 'unit-format-converters.html',
    tools: [
      'unit-converter',
      'currency-formatter',
      'time-zone-converter',
      'markdown-to-html',
      'date-format-converter',
      'age-calculator',
      'area-unit-converter',
      'volume-unit-converter',
      'speed-unit-converter',
      'pressure-unit-converter',
      'energy-unit-converter',
      'power-unit-converter',
      'angle-unit-converter',
      'fuel-economy-converter',
      'digital-storage-converter',
      'data-transfer-rate-converter'
    ]
  },
  {
    id: 'generators-creators',
    name: 'Generators & Creators',
    icon: '✨',
    toolCount: 9,
    desc: 'Generate barcodes, high-entropy passwords, usernames, business names, dice/random numbers, fake test data, digital signatures, WiFi QR codes, and countdown timers.',
    filename: 'generators-creators.html',
    tools: [
      'barcode-generator',
      'strong-password-generator',
      'random-name-username-generator',
      'business-name-generator',
      'random-number-dice-generator',
      'fake-data-generator',
      'signature-generator',
      'wifi-qr-code-generator',
      'countdown-timer-creator'
    ]
  },
  {
    id: 'color-design-extras',
    name: 'Color & Design Extras',
    icon: '🎨',
    toolCount: 6,
    desc: 'Create multi-stop CSS gradients, verify WCAG color contrast ratios, build box-shadow layers, design organic border radii, preview app icon mockups, and convert HEX/RGB/HSL/HSV/CMYK codes.',
    filename: 'color-design-extras.html',
    tools: [
      'gradient-generator',
      'color-contrast-checker',
      'css-box-shadow-generator',
      'border-radius-generator',
      'favicon-app-icon-mockup',
      'hex-rgb-hsl-color-converter'
    ]
  },
  {
    id: 'developer-web-extras',
    name: 'Developer/Web Extras',
    icon: '💻',
    toolCount: 4,
    desc: 'Encode HTML entities, minify CSS and JavaScript code, inspect display resolutions, and run complete client-side browser diagnostics.',
    filename: 'developer-web-extras.html',
    tools: [
      'html-entity-encoder',
      'code-minifier',
      'screen-resolution-checker',
      'browser-info-checker'
    ]
  },
  {
    id: 'calculators-productivity',
    name: 'Calculators & Productivity',
    icon: '🧮',
    toolCount: 8,
    desc: 'Calculate loan EMI payments, compute BMI, split tips, calculate GST/sales tax, simulate compound interest, run Pomodoro focus cycles, manage to-dos, and organize sticky notes.',
    filename: 'calculators-productivity.html',
    tools: [
      'emi-loan-calculator',
      'bmi-calculator',
      'tip-calculator',
      'gst-tax-calculator',
      'interest-calculator',
      'pomodoro-timer',
      'todo-list-local',
      'sticky-notes-board'
    ]
  },
  {
    id: 'social-media-utilities',
    name: 'Social Media Utilities',
    icon: '📱',
    toolCount: 5,
    desc: 'Count hashtag limits, format Instagram bios with line breaks, preview social image crops and safe zones, calculate aspect ratios, and generate creator handles.',
    filename: 'social-media-utilities.html',
    tools: [
      'hashtag-character-counter',
      'instagram-bio-formatter',
      'post-size-preview',
      'aspect-ratio-calculator',
      'username-idea-generator'
    ]
  },
  {
    id: 'privacy-security-extras',
    name: 'Privacy & Security Extras',
    icon: '🛡️',
    toolCount: 2,
    desc: 'Create client-side encrypted self-destructing notes and generate disposable dummy profiles for test signups.',
    filename: 'privacy-security-extras.html',
    tools: [
      'temporary-self-destruct-note',
      'fake-info-generator'
    ]
  },
  {
    id: 'fun-miscellaneous',
    name: 'Fun & Miscellaneous',
    icon: '🎲',
    toolCount: 6,
    desc: 'Discover inspiring quotes, pick aesthetic emoji combinations, spin the decision wheel, test name compatibility, take a 60s typing speed test, and look up zodiac traits.',
    filename: 'fun-miscellaneous.html',
    tools: [
      'random-quote-generator',
      'emoji-combo-picker',
      'spin-the-wheel',
      'name-compatibility-test',
      'typing-speed-test',
      'zodiac-sign-finder'
    ]
  },

  // Existing 6 Categories BELOW
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
    toolCount: 8,
    desc: 'View CSV data, convert between CSV and JSON, inspect file headers, calculate cryptographic hashes, merge text files, and decode Base64 to Image or PDF.',
    filename: 'file-data-utilities.html',
    tools: [
      'csv-viewer',
      'csv-to-json-converter',
      'json-to-csv-converter',
      'file-information-viewer',
      'file-hash-generator',
      'text-file-merger',
      'base64-to-image-converter',
      'base64-to-pdf-converter'
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
    toolCount: 15,
    desc: 'Format and validate JSON, test regex patterns, encode/decode Base64 and URLs, generate v4 UUIDs, convert JSON/CSV/YAML/XML, convert Hex/Text, and decode JWT tokens.',
    filename: 'developer-utilities.html',
    tools: [
      'json-formatter',
      'json-validator',
      'base64-encoder-decoder',
      'url-encoder-decoder',
      'regex-tester',
      'uuid-generator',
      'csv-json-converter',
      'json-csv-converter',
      'json-to-yaml-converter',
      'yaml-to-json-converter',
      'json-to-xml-converter',
      'xml-to-json-converter',
      'hex-to-text-converter',
      'text-to-hex-converter',
      'jwt-decoder'
    ]
  }
];

export const BU_CATEGORIES = CATEGORIES.map(c => ({
  ...c,
  description: c.desc
}));

export { CATEGORIES };

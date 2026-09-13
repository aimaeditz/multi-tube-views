import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('----------------------------------------------------');
console.log('RUNNING FUNCTIONAL TESTS ON TOOL ALGORITHMS & LOGIC');
console.log('----------------------------------------------------');

const buJs = fs.readFileSync(path.join(ROOT, 'assets/js/browser-utilities.js'), 'utf8');

const mockWindow = {
  btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
  atob: (b64) => Buffer.from(b64, 'base64').toString('binary'),
  crypto: {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
      return arr;
    }
  }
};
const mockDoc = {
  createElement: () => ({ style: {}, appendChild: () => {}, remove: () => {} }),
  body: { appendChild: () => {}, removeChild: () => {} }
};

const fn = new Function('window', 'document', buJs + '\nreturn window.MTV_BU;');
const BU = fn(mockWindow, mockDoc);

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`[FAIL] ${message}`);
  }
}

// 1. Text transformations
assert(BU.convertCase('hello world', 'uppercase') === 'HELLO WORLD', 'uppercase conversion');
assert(BU.convertCase('HELLO WORLD', 'lowercase') === 'hello world', 'lowercase conversion');
assert(BU.convertCase('hello world', 'title') === 'Hello World', 'title conversion');
assert(BU.convertCase('hello world', 'sentence') === 'Hello world', 'sentence conversion');
assert(BU.convertCase('hello world', 'camel') === 'helloWorld', 'camel conversion');
assert(BU.convertCase('hello world', 'snake') === 'hello_world', 'snake conversion');
assert(BU.convertCase('hello world', 'kebab') === 'hello-world', 'kebab conversion');
assert(BU.convertCase('hello world', 'constant') === 'HELLO_WORLD', 'constant conversion');
assert(BU.convertCase('hello world', 'dot') === 'hello.world', 'dot conversion');

// Word & character counter
const stats = BU.analyzeWords('The quick brown fox jumps over the lazy dog.');
assert(stats.words === 9, 'word count');
assert(stats.chars === 44, 'char count');

const charStats = BU.analyzeCharacters('Test 123!');
assert(charStats.chars === 9 && charStats.letters === 4 && charStats.digits === 3, 'character analyzer');

// Remove duplicate lines
const dupRes = BU.removeDuplicateLines('apple\nbanana\napple\norange\nbanana');
assert(dupRes.cleanedText === 'apple\nbanana\norange', 'duplicate lines removal');

// Sort lines
const sorted = BU.sortLines('cherry\napple\nbanana', 'az');
assert(sorted === 'apple\nbanana\ncherry', 'sort lines ascending');

// Base64
assert(String(BU.base64Encode('MultiTubeViews')) === Buffer.from('MultiTubeViews').toString('base64'), 'base64 encode');
assert(String(BU.base64Decode(Buffer.from('MultiTubeViews').toString('base64'))) === 'MultiTubeViews', 'base64 decode');

// URL Encode / Decode
assert(BU.encodeUrl('https://example.com/search?q=hello world') === encodeURIComponent('https://example.com/search?q=hello world'), 'URL encode');
assert(BU.decodeUrl(encodeURIComponent('test space & symbols')) === 'test space & symbols', 'URL decode');

// HTML Entities
assert(BU.escapeHtml('<script>alert("xss")</script>') === '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;', 'HTML escape');

// JSON Validator & Formatter
const jsonRes = BU.formatJson('{"name":"mtv","tools":149}', 2);
assert(jsonRes.valid === true, 'JSON formatter valid flag');
assert(jsonRes.result.includes('\n'), 'JSON formatted multiline');

// CSV to JSON and JSON to CSV
const csv = 'name,age\nAlice,30\nBob,25';
const parsedJson = BU.csvToJson(csv);
assert(parsedJson.length === 2 && parsedJson[0].name === 'Alice', 'CSV to JSON');
const backToCsv = BU.jsonToCsv(parsedJson);
assert(backToCsv.includes('Alice') && backToCsv.includes('Bob'), 'JSON to CSV');

// Regex tester (pattern, flags, testString)
const rx = BU.testRegex('\\d+', 'g', 'hello 123 world 456');
assert(rx.matches && rx.matches.length === 2, 'Regex tester');

// Color conversions
const rgb = BU.hexToRgb('#6366f1');
assert(rgb.r === 99 && rgb.g === 102 && rgb.b === 241, 'HEX to RGB');
const hex = BU.rgbToHex(99, 102, 241);
assert(hex.toLowerCase() === '#6366f1', 'RGB to HEX');

// Color luminance and contrast
const whiteRgb = BU.hexToRgb('#ffffff');
const blackRgb = BU.hexToRgb('#000000');
const contrast = BU.getContrastRatio(whiteRgb, blackRgb);
assert(Number(contrast) >= 20.9, 'Contrast ratio black and white is ~21');

// UUID v4 generator
const uuid = BU.generateUuid();
assert(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid), 'UUID v4 format valid');

// Base conversion (val, fromBase)
const baseRes = BU.convertBase('255', 10);
assert(baseRes.hex === 'FF', 'Dec 255 to Hex FF');
assert(baseRes.bin === '11111111', 'Dec 255 to Bin 11111111');
assert(baseRes.oct === '377', 'Dec 255 to Oct 377');

// Percentage calculator
const pct = BU.calculatePercentage('percentOf', 20, 200);
assert(pct.result === 40, '20% of 200 is 40');

// Date difference
const dateDiff = BU.calculateDateDiff('2026-01-01', '2026-01-11');
assert(dateDiff.totalDays === 10 || dateDiff.days === 10, 'Date difference 10 days');

// Password strength
const pwdStrength = BU.checkPasswordStrength('P@ssw0rd2026!UltraSecure');
assert(pwdStrength.score >= 4, 'Strong password detected');

// UTM Builder
const utmUrl = BU.buildUtmUrl('https://example.com', { source: 'google', medium: 'cpc', campaign: 'spring' });
assert(utmUrl.includes('utm_source=google') && utmUrl.includes('utm_medium=cpc'), 'UTM URL builder');

// Meta tags generator
const meta = BU.generateMetaTags({ title: 'My Title', description: 'My Desc', url: 'https://example.com' });
assert(String(meta).includes('<title>My Title</title>'), 'Meta tag generator');

// Robots.txt generator
const robots = BU.generateRobotsTxt({ defaultRule: 'allow', sitemapUrl: 'https://example.com/sitemap.xml' });
assert(robots.includes('User-agent: *') && robots.includes('Sitemap:'), 'Robots.txt generator');

// Random test data generator
const testData = BU.generateRandomData('name', 5);
assert(testData.items && testData.items.length === 5, 'Random names generator');

console.log(`\nResults: ${passed} assertions passed, ${failed} failed.`);
if (failed === 0) {
  console.log('ALL core functional algorithms passed verification with zero errors!');
}

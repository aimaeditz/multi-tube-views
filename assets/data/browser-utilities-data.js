/**
 * Multi Tube Views (MTV) — Browser Utilities Categories & Tools Registry
 * 89 In-Browser Client-Side Tools across 15 Specialized Categories.
 */

export const BU_CATEGORIES = [
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
    toolCount: 6,
    desc: 'Convert measurement units, format multi-country currencies, compare global time zones, convert Markdown to HTML, transform date formats, and calculate exact age.',
    filename: 'unit-format-converters.html',
    tools: [
      'unit-converter',
      'currency-formatter',
      'time-zone-converter',
      'markdown-to-html',
      'date-format-converter',
      'age-calculator'
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
    toolCount: 5,
    desc: 'Create multi-stop CSS gradients, verify WCAG color contrast ratios, build box-shadow layers, design organic border radii, and preview app icon mockups.',
    filename: 'color-design-extras.html',
    tools: [
      'gradient-generator',
      'color-contrast-checker',
      'css-box-shadow-generator',
      'border-radius-generator',
      'favicon-app-icon-mockup'
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

export const BU_ALL_TOOLS_LIST = BU_CATEGORIES.flatMap(cat => cat.tools);

if (typeof window !== 'undefined') {
  window.MTV_BU_CATEGORIES = BU_CATEGORIES;
  window.MTV_BU_ALL_TOOLS_LIST = BU_ALL_TOOLS_LIST;
}


export const BU_TOOLS_CATALOG = [
  {
    "id": "find-replace",
    "name": "Find & Replace Tool",
    "icon": "🔍",
    "categoryId": "text-writing-extras",
    "categoryName": "Text & Writing Extras",
    "description": "Quickly find and replace strings or regular expression patterns across text passages with live match counters and highlighted previews. 100% in-browser.",
    "keywords": "find and replace text, replace string online, regex replace tool, batch text replacer, text search and replace"
  ,
    "dateAdded": "2026-08-10"
  },
  {
    "id": "lorem-ipsum-generator",
    "name": "Lorem Ipsum Generator",
    "icon": "📜",
    "categoryId": "text-writing-extras",
    "categoryName": "Text & Writing Extras",
    "description": "Generate customizable, authentic Latin dummy placeholder text for website mockups, graphic designs, and editorial layouts. 100% client-side.",
    "keywords": "lorem ipsum generator, dummy text generator, placeholder text, fake latin text online, lorem ipsum paragraphs"
  ,
    "dateAdded": "2026-08-05"
  },
  {
    "id": "text-diff-checker",
    "name": "Text Diff Checker",
    "icon": "⚖️",
    "categoryId": "text-writing-extras",
    "categoryName": "Text & Writing Extras",
    "description": "Compare two text snippets side-by-side or inline to highlight additions, deletions, and modifications line-by-line in real time.",
    "keywords": "text diff checker, compare text online, string difference finder, file diff tool, online diff viewer"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "slug-url-generator",
    "name": "Slug/URL Generator",
    "icon": "🔗",
    "categoryId": "text-writing-extras",
    "categoryName": "Text & Writing Extras",
    "description": "Convert article headlines, video titles, and product names into clean, URL-safe, SEO-optimized slugs with customizable separators.",
    "keywords": "slug generator, url slug maker, seo friendly url generator, convert title to slug, string to slug"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "text-reverser",
    "name": "Text Reverser",
    "icon": "🔁",
    "categoryId": "text-writing-extras",
    "categoryName": "Text & Writing Extras",
    "description": "Reverse text characters, flip word order, invert capitalization, and create upside-down mirrored typography for puzzles, cryptography, or fun social posts.",
    "keywords": "text reverser, reverse string online, backward text generator, flip words order, upside down text"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "fancy-text-generator",
    "name": "Fancy Text/Font Generator",
    "icon": "✨",
    "categoryId": "text-writing-extras",
    "categoryName": "Text & Writing Extras",
    "description": "Transform regular text into fancy cursive, gothic, bold, circled, bubble, medieval, aesthetic vaporwave, and decorated unicode typography styles for Instagram bios, TikTok, Discord, and gaming nicknames.",
    "keywords": "fancy text generator, aesthetic fonts, cursive text generator, unicode text converter, instagram bio fonts, copy paste fonts"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "reading-time-calculator",
    "name": "Reading Time Calculator",
    "icon": "⏱️",
    "categoryId": "text-writing-extras",
    "categoryName": "Text & Writing Extras",
    "description": "Calculate silent reading duration, public speaking speech time, word counts, and estimated grade-level readability scores for articles, scripts, and presentations.",
    "keywords": "reading time calculator, speech duration calculator, words to minutes, reading speed estimator, flesch kincaid readability"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "text-binary-ascii-converter",
    "name": "Text to Binary/ASCII Converter",
    "icon": "01",
    "categoryId": "text-writing-extras",
    "categoryName": "Text & Writing Extras",
    "description": "Convert plain text into binary machine code (0s and 1s), hexadecimal, decimal ASCII codes, or octal representations and decode them back to text.",
    "keywords": "text to binary, binary to text converter, ascii converter, text to hex online, binary code decoder"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "unit-converter",
    "name": "Length, Weight & Temp Converter",
    "icon": "📐",
    "categoryId": "unit-format-converters",
    "categoryName": "Unit & Format Converters",
    "description": "Convert between metric and imperial units for length (meters, feet, inches), mass (kg, pounds, ounces), temperature (°C, °F, Kelvin), speed, and area with instant calculation.",
    "keywords": "unit converter online, length converter, weight converter kg to lbs, temperature converter celsius to fahrenheit, metric imperial converter"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "currency-formatter",
    "name": "Currency Format Formatter",
    "icon": "💵",
    "categoryId": "unit-format-converters",
    "categoryName": "Unit & Format Converters",
    "description": "Format financial numbers into global international currency styles (USD, EUR, GBP, JPY, INR Lakhs/Crores) and generate formal written number words.",
    "keywords": "currency formatter online, format money javascript, number to currency, inr lakhs crores format, number to words money"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "time-zone-converter",
    "name": "Time Zone Converter",
    "icon": "🌍",
    "categoryId": "unit-format-converters",
    "categoryName": "Unit & Format Converters",
    "description": "Convert dates and times across international time zones (UTC, New York EST, London GMT, Tokyo JST, Mumbai IST, San Francisco PST) with daylight saving accuracy.",
    "keywords": "time zone converter, world clock comparison, meeting time planner, pst to est, utc time converter"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "markdown-to-html",
    "name": "Markdown to HTML Converter",
    "icon": "Ⓜ️",
    "categoryId": "unit-format-converters",
    "categoryName": "Unit & Format Converters",
    "description": "Convert Markdown formatted documents into clean HTML code with live split-pane visual rendering. Supports headers, tables, code blocks, task lists, and quotes.",
    "keywords": "markdown to html converter, md to html online, markdown live editor, convert markdown text, html preview"
  ,
    "dateAdded": "2026-09-13"
  },
  {
    "id": "date-format-converter",
    "name": "Date Format Converter",
    "icon": "📅",
    "categoryId": "unit-format-converters",
    "categoryName": "Unit & Format Converters",
    "description": "Convert dates and timestamps across 15+ standard formats including ISO 8601, Unix Milliseconds, RFC 2822, SQL DATETIME, and custom localized layouts.",
    "keywords": "date format converter, iso 8601 converter, convert date string online, epoch timestamp to date, sql datetime formatter"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "age-calculator",
    "name": "Age Calculator",
    "icon": "🎂",
    "categoryId": "unit-format-converters",
    "categoryName": "Unit & Format Converters",
    "description": "Calculate your exact age in years, months, days, total hours, minutes, seconds, next birthday countdown, and birth day of the week.",
    "keywords": "age calculator, calculate exact age online, age in days hours seconds, birthday countdown, how old am i"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "barcode-generator",
    "name": "Barcode Generator",
    "icon": "📊",
    "categoryId": "generators-creators",
    "categoryName": "Generators & Creators",
    "description": "Generate customizable, high-resolution 1D linear barcodes (Code 128, Code 39, EAN-13) with custom dimensions, text labels, and instant PNG download.",
    "keywords": "barcode generator, code 128 generator, online barcode maker, create barcode png, ean 13 generator"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "strong-password-generator",
    "name": "Strong Password Generator",
    "icon": "🔑",
    "categoryId": "generators-creators",
    "categoryName": "Generators & Creators",
    "description": "Generate cryptographically strong random passwords and passphrases using hardware-backed Web Crypto API with custom character sets and entropy scoring.",
    "keywords": "password generator, strong random password generator, secure password maker, web crypto password, generate password online"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "random-name-username-generator",
    "name": "Random Name & Username Generator",
    "icon": "👤",
    "categoryId": "generators-creators",
    "categoryName": "Generators & Creators",
    "description": "Generate realistic personal full names, modern gamer handles, aesthetic creator usernames, and role-playing nicknames with one click.",
    "keywords": "random name generator, username generator, gamertag generator, cool usernames, random character names"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "business-name-generator",
    "name": "Business Name Generator",
    "icon": "🏢",
    "categoryId": "generators-creators",
    "categoryName": "Generators & Creators",
    "description": "Brainstorm creative, modern brand names and startup company ideas based on your core industry keywords, niche sector, and naming styles with instant 1-click clipboard copy.",
    "keywords": "business name generator, startup name generator, brand name maker, company name ideas, saas name creator"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "random-number-dice-generator",
    "name": "Random Number & Dice Generator",
    "icon": "🎲",
    "categoryId": "generators-creators",
    "categoryName": "Generators & Creators",
    "description": "Roll tabletop RPG dice (d4, d6, d8, d10, d12, d20, d100), generate non-repeating random number ranges, and flip virtual coins with Web Crypto precision.",
    "keywords": "random number generator, dice roller online, d20 dice roller, coin flipper, rng picker"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "fake-data-generator",
    "name": "Fake Data Generator",
    "icon": "🎭",
    "categoryId": "generators-creators",
    "categoryName": "Generators & Creators",
    "description": "Generate realistic developer mockup test datasets containing names, emails, phone numbers, addresses, UUIDs, and job titles in JSON, CSV, or Table formats.",
    "keywords": "fake data generator, mock data generator, test data online, dummy json data, mock user profiles"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "signature-generator",
    "name": "Signature Generator",
    "icon": "✍️",
    "categoryId": "generators-creators",
    "categoryName": "Generators & Creators",
    "description": "Create elegant digital handwritten signatures by typing your name with calligraphic typography styles or drawing smoothly on the interactive touch canvas. Download transparent high-res PNGs.",
    "keywords": "signature generator, digital signature online, draw signature png, handwritten signature maker, signature creator"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "wifi-qr-code-generator",
    "name": "WiFi QR Code Generator",
    "icon": "📶",
    "categoryId": "generators-creators",
    "categoryName": "Generators & Creators",
    "description": "Generate high-resolution printable WiFi QR codes for instant smartphone network connection with WPA/WPA2/WPA3 security and printable guest cards.",
    "keywords": "wifi qr code generator, qr code for wifi password, connect to wifi with qr, guest wifi qr code, printable wifi sign"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "countdown-timer-creator",
    "name": "Countdown Timer Creator",
    "icon": "⏳",
    "categoryId": "generators-creators",
    "categoryName": "Generators & Creators",
    "description": "Create customizable live ticking countdown timers for product launches, livestreams, holidays, and milestones with fullscreen presentation and confetti triggers.",
    "keywords": "countdown timer creator, event countdown clock, launch countdown online, days until timer, animated countdown"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "gradient-generator",
    "name": "CSS Gradient Generator",
    "icon": "🌈",
    "categoryId": "color-design-extras",
    "categoryName": "Color & Design Extras",
    "description": "Design beautiful multi-stop linear and radial CSS gradients with live angle controls, curated presets, and 1-click ready-to-paste CSS code generation.",
    "keywords": "gradient generator, css gradient maker, linear gradient online, radial gradient css, web design color gradient"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "color-contrast-checker",
    "name": "Color Contrast Checker",
    "icon": "⚖️",
    "categoryId": "color-design-extras",
    "categoryName": "Color & Design Extras",
    "description": "Verify color contrast ratios between text and backgrounds against official WCAG 2.1 AA and AAA accessibility compliance standards in real time.",
    "keywords": "color contrast checker, wcag accessibility contrast, text background contrast ratio, aa aaa compliance, contrast calculator"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "css-box-shadow-generator",
    "name": "CSS Box-Shadow Generator",
    "icon": "📦",
    "categoryId": "color-design-extras",
    "categoryName": "Color & Design Extras",
    "description": "Create modern smooth CSS box-shadows with live controls for X/Y offsets, blur radius, spread, opacity, and inset shadow styling with instant CSS code.",
    "keywords": "css box shadow generator, box shadow maker, smooth shadow generator, css depth tool, drop shadow generator"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "border-radius-generator",
    "name": "Border-Radius & Shape Generator",
    "icon": "🔲",
    "categoryId": "color-design-extras",
    "categoryName": "Color & Design Extras",
    "description": "Design custom organic organic blob shapes and rounded corner configurations with full 8-value CSS border-radius slider controls and instant snippet generation.",
    "keywords": "border radius generator, 8 point border radius, css blob generator, organic shape maker css, rounded corners tool"
  ,
    "dateAdded": "2026-09-16"
  },
  {
    "id": "favicon-app-icon-mockup",
    "name": "Favicon & App Icon Mockup Generator",
    "icon": "📱",
    "categoryId": "color-design-extras",
    "categoryName": "Color & Design Extras",
    "description": "Preview how your brand icon, logo, or favicon will look in real browser tabs, iOS squircle home screens, macOS dock, and Google mobile search results.",
    "keywords": "favicon mockup generator, app icon preview, ios home screen mockup, browser tab favicon preview, icon generator"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "html-entity-encoder",
    "name": "HTML Entity Encoder",
    "icon": "🔣",
    "categoryId": "developer-web-extras",
    "categoryName": "Developer/Web Extras",
    "description": "Encode special characters, quotes, ampersands, and HTML tags into safe named HTML entities (&amp;, &lt;, &gt;) or decode HTML entities back to characters.",
    "keywords": "html entity encoder, decode html entities online, escape html tags, html character codes, named entities encoder"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "code-minifier",
    "name": "CSS & JavaScript Minifier",
    "icon": "⚡",
    "categoryId": "developer-web-extras",
    "categoryName": "Developer/Web Extras",
    "description": "Compress and minify CSS stylesheets and JavaScript scripts by stripping comments, spaces, newlines, and unnecessary tokens with live file size savings analytics.",
    "keywords": "code minifier, css minifier online, javascript minifier, js compressor, reduce code size"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "screen-resolution-checker",
    "name": "Screen Resolution Checker",
    "icon": "🖥️",
    "categoryId": "developer-web-extras",
    "categoryName": "Developer/Web Extras",
    "description": "Inspect live display resolution (Width x Height), available desktop screen workspace, browser viewport dimensions, Device Pixel Ratio (DPR), and orientation.",
    "keywords": "screen resolution checker, my screen resolution, display viewport size, retina display dpr, screen aspect ratio checker"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "browser-info-checker",
    "name": "Browser Info & Diagnostics Checker",
    "icon": "🌐",
    "categoryId": "developer-web-extras",
    "categoryName": "Developer/Web Extras",
    "description": "Inspect complete client-side browser diagnostics including User-Agent parsing, browser engine, operating system, WebGL GPU rendering info, and storage support.",
    "keywords": "browser info checker, my user agent, browser diagnostics online, detect os browser javascript, client capabilities checker"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "emi-loan-calculator",
    "name": "EMI & Loan Calculator",
    "icon": "💰",
    "categoryId": "calculators-productivity",
    "categoryName": "Calculators & Productivity",
    "description": "Calculate monthly loan EMI payments, total interest payable, overall repayment breakdown, and visual principal-to-interest ratios for home, car, and personal loans.",
    "keywords": "emi calculator, loan calculator online, home loan emi, monthly installment calculator, loan interest schedule"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "bmi-calculator",
    "name": "BMI Calculator",
    "icon": "⚖️",
    "categoryId": "calculators-productivity",
    "categoryName": "Calculators & Productivity",
    "description": "Calculate Body Mass Index (BMI), identify weight classification categories (Underweight, Normal, Overweight, Obese), and view healthy target weight ranges.",
    "keywords": "bmi calculator, body mass index online, ideal weight calculator, metric imperial bmi, calculate bmi score"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "tip-calculator",
    "name": "Tip & Bill Splitter Calculator",
    "icon": "🧾",
    "categoryId": "calculators-productivity",
    "categoryName": "Calculators & Productivity",
    "description": "Calculate restaurant gratuity tips, total bill with tip, and split payments evenly across any number of friends or dining parties with 1-click percentage presets.",
    "keywords": "tip calculator, bill split calculator, restaurant gratuity calculator, split bill online, tip percentage calculator"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "gst-tax-calculator",
    "name": "GST & Sales Tax Calculator",
    "icon": "🏷️",
    "categoryId": "calculators-productivity",
    "categoryName": "Calculators & Productivity",
    "description": "Calculate Goods & Services Tax (GST), VAT, and sales tax. Add tax to net amounts or extract pre-tax base prices from gross totals.",
    "keywords": "gst calculator, sales tax calculator, vat calculator online, add tax remove tax, gst inclusive exclusive"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "interest-calculator",
    "name": "Compound & Simple Interest Calculator",
    "icon": "📈",
    "categoryId": "calculators-productivity",
    "categoryName": "Calculators & Productivity",
    "description": "Simulate financial investments and savings growth with compounding frequencies (Daily, Monthly, Quarterly, Annually) and detailed year-by-year projections.",
    "keywords": "compound interest calculator, simple interest calculator, investment growth simulator, savings calculator online, compound future value"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "pomodoro-timer",
    "name": "Pomodoro Focus Timer",
    "icon": "🍅",
    "categoryId": "calculators-productivity",
    "categoryName": "Calculators & Productivity",
    "description": "Boost work focus and study sessions with customizable 25-minute Pomodoro focus intervals, short/long breaks, visual countdown rings, and audio chimes.",
    "keywords": "pomodoro timer, focus timer online, 25 minute study timer, pomodoro technique app, productivity timer"
  ,
    "dateAdded": "2026-09-14"
  },
  {
    "id": "todo-list-local",
    "name": "To-Do List (Local Persistence)",
    "icon": "✅",
    "categoryId": "calculators-productivity",
    "categoryName": "Calculators & Productivity",
    "description": "Organize tasks, set priority flags (High, Medium, Low), check off completed goals, and filter tasks with instant, private browser storage persistence.",
    "keywords": "todo list local storage, offline task manager, browser todo list, daily checklist online, private to do list"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "sticky-notes-board",
    "name": "Sticky Notes Board (Local Save)",
    "icon": "📌",
    "categoryId": "calculators-productivity",
    "categoryName": "Calculators & Productivity",
    "description": "Pin colorful quick digital sticky notes to a visual pinboard with customized pastel card hues (Yellow, Green, Blue, Pink) and automatic localStorage saving.",
    "keywords": "sticky notes online, virtual pinboard, quick notes scratchpad, digital memo board, sticky note board"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "hashtag-generator",
    "name": "Hashtag Generator & Tag Builder",
    "icon": "#️⃣",
    "categoryId": "social-media-utilities",
    "categoryName": "Social Media Utilities",
    "description": "Convert topic keywords, titles, or sentences into optimized hashtag clusters (#tag1 #tag2 #tag3) with spacing, punctuation cleaning, and 1-click clipboard copying.",
    "keywords": "hashtag generator, instagram hashtag maker, youtube tags generator, tiktok hashtags, social media hashtag tool"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "bio-link-page-builder",
    "name": "Bio Link Page Builder (Link in Bio)",
    "icon": "🔗",
    "categoryId": "social-media-utilities",
    "categoryName": "Social Media Utilities",
    "description": "Design and export standalone, single-file HTML/CSS link-in-bio hub pages for Instagram, TikTok, and Twitter with social links, custom themes, and zero external hosting dependencies.",
    "keywords": "bio link builder, link in bio html generator, instagram link tree maker, mobile bio page, linktree alternative html"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "social-character-counter",
    "name": "Social Media Character Counter",
    "icon": "📊",
    "categoryId": "social-media-utilities",
    "categoryName": "Social Media Utilities",
    "description": "Track post lengths against official character limit constraints across Twitter/X (280), Instagram Captions (2,200), LinkedIn Posts (3,000), TikTok (2,200), and YouTube Titles (100).",
    "keywords": "social media character counter, twitter character limit, instagram caption length, linkedin character counter, social media post length"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "tweet-thread-formatter",
    "name": "Tweet Thread Formatter",
    "icon": "🧵",
    "categoryId": "social-media-utilities",
    "categoryName": "Social Media Utilities",
    "description": "Split long-form articles, essays, and announcements into numbered 280-character Twitter/X thread posts (1/n, 2/n) with smart word boundary splitting.",
    "keywords": "tweet thread maker, split text for twitter, thread formatter 280 chars, x thread creator, twitter thread generator"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "youtube-timestamp-link-generator",
    "name": "YouTube Timestamp Link Generator",
    "icon": "⏱️",
    "categoryId": "social-media-utilities",
    "categoryName": "Social Media Utilities",
    "description": "Create deep-linking timestamped YouTube video URLs (e.g. ?t=2m45s or ?t=165) and clean chapter timestamps for video descriptions and show notes.",
    "keywords": "youtube timestamp link generator, youtube deep link maker, timestamp youtube video, youtube chapter generator, start youtube video at time"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "metadata-exif-stripper",
    "name": "Image Metadata & EXIF Stripper",
    "icon": "🛡️",
    "categoryId": "privacy-security-extras",
    "categoryName": "Privacy & Security Extras",
    "description": "Protect your digital privacy by stripping hidden GPS geolocation coordinates, camera model tags, shutter details, and timestamp metadata from JPEG, PNG, and WebP images before sharing.",
    "keywords": "exif stripper, remove image metadata online, clean photo gps data, privacy image scrubber, strip photo camera details"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "local-file-encryptor",
    "name": "Local File Encryptor & Decryptor (AES-GCM)",
    "icon": "🔒",
    "categoryId": "privacy-security-extras",
    "categoryName": "Privacy & Security Extras",
    "description": "Encrypt any sensitive file or text using military-grade AES-256-GCM encryption with password-derived PBKDF2 keys directly in your browser without uploading to any server.",
    "keywords": "file encryptor online, aes 256 gcm file encryptor, client side encryption, encrypt decrypt files browser, web crypto encryptor"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "coin-flipper",
    "name": "3D Coin Flipper & Heads/Tails Simulator",
    "icon": "🪙",
    "categoryId": "fun-miscellaneous",
    "categoryName": "Fun & Miscellaneous",
    "description": "Flip a digital 3D coin with realistic CSS flip animations, cryptographic Web Crypto randomness, flip streak counters, and multiple coin batch flips.",
    "keywords": "coin flipper, heads or tails online, flip a coin 3d, random coin toss, decision maker coin"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "dice-roller",
    "name": "Multi-Dice Roller (D4 to D100)",
    "icon": "🎲",
    "categoryId": "fun-miscellaneous",
    "categoryName": "Fun & Miscellaneous",
    "description": "Roll tabletop roleplaying game dice (D4, D6, D8, D10, D12, D20, D100) with dice quantity multipliers, modifier bonuses (+/-), roll histories, and total sums.",
    "keywords": "dice roller online, d20 dice roller, rpg tabletop dice, dnd dice simulator, roll multiple dice"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "spin-the-wheel",
    "name": "Spin the Wheel & Decision Picker",
    "icon": "🎡",
    "categoryId": "fun-miscellaneous",
    "categoryName": "Fun & Miscellaneous",
    "description": "Create custom spinning decision wheels with custom segment names, vibrant colors, realistic deceleration physics, and cryptographic slice winner selection.",
    "keywords": "spin the wheel, random name picker, decision wheel online, wheel of fortune spinner, random choice picker"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "typing-speed-test",
    "name": "Typing Speed Test (WPM & Accuracy)",
    "icon": "⌨️",
    "categoryId": "fun-miscellaneous",
    "categoryName": "Fun & Miscellaneous",
    "description": "Test your keyboard typing speed (WPM), Characters Per Minute (CPM), and typing accuracy percentage with live character highlighting, preset durations (15s, 30s, 60s, 120s), and difficulty categories.",
    "keywords": "typing speed test, wpm test online, words per minute typing test, keyboard accuracy test, typing test 60 seconds"
  ,
    "dateAdded": "2026-09-11"
  },
  {
    "id": "sound-effects-generator",
    "name": "Sound Effects & Chime Synthesizer",
    "icon": "🔊",
    "categoryId": "fun-miscellaneous",
    "categoryName": "Fun & Miscellaneous",
    "description": "Synthesize custom 8-bit retro gaming sound effects, notification chimes, sci-fi laser zaps, powerups, and UI clicks with live Web Audio oscillators and client-side .WAV audio export.",
    "keywords": "sound effects generator, web audio synthesizer, 8 bit sound maker, bleeps and chimes generator, download sound effects wav"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "ascii-art-generator",
    "name": "ASCII Art & Text Banner Generator",
    "icon": "👾",
    "categoryId": "fun-miscellaneous",
    "categoryName": "Fun & Miscellaneous",
    "description": "Transform regular text words and titles into large ASCII art typography banners and code comments for developer READMEs, CLI terminals, and Discord messages.",
    "keywords": "ascii art generator, ascii text banner maker, terminal banner generator, figlet online, code comment banner"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "text-case-converter",
    "name": "Text Case Converter",
    "icon": "🔤",
    "categoryId": "text-utilities",
    "categoryName": "Text Utilities",
    "description": "Transform text case online: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, CONSTANT_CASE, and dot.case.",
    "keywords": "text case converter, uppercase converter, lowercase converter, title case generator, camelcase online, snake case converter, kebab case converter"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "word-counter",
    "name": "Word Counter",
    "icon": "📊",
    "categoryId": "text-utilities",
    "categoryName": "Text Utilities",
    "description": "Accurately count words, characters, sentences, paragraphs, and calculate estimated reading and speaking times instantly in your browser.",
    "keywords": "word counter, character counter, text statistics, word count tool, reading time calculator, speaking time estimator"
  ,
    "dateAdded": "2026-09-06"
  },
  {
    "id": "character-counter",
    "name": "Character Counter",
    "icon": "🔢",
    "categoryId": "text-utilities",
    "categoryName": "Text Utilities",
    "description": "Count characters, letters, digits, and whitespace with pre-set limit indicators for Twitter, Meta Title, Description, and SMS.",
    "keywords": "character counter, letter counter, tweet length checker, meta description length checker, sms character counter"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "duplicate-line-remover",
    "name": "Duplicate Line Remover",
    "icon": "🧹",
    "categoryId": "text-utilities",
    "categoryName": "Text Utilities",
    "description": "Remove repeated lines, email lists, keywords, and URLs with configurable case sensitivity, whitespace trimming, and duplicate counters.",
    "keywords": "duplicate line remover, deduplicate list, remove repeated lines, clean duplicate words, list deduplicator"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "text-sorter",
    "name": "Text Sorter",
    "icon": "🔀",
    "categoryId": "text-utilities",
    "categoryName": "Text Utilities",
    "description": "Sort lines of text alphabetically (A-Z, Z-A), numerically, by line length, reverse, or randomize order completely in your browser.",
    "keywords": "text sorter, alphabetical sorter, sort lines online, sort text a-z, sort numbers online, random list shuffle"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "text-cleaner",
    "name": "Text Cleaner",
    "icon": "✨",
    "categoryId": "text-utilities",
    "categoryName": "Text Utilities",
    "description": "Clean up dirty text: remove excess spaces, strip HTML tags, remove blank lines, convert tabs to spaces, and normalize line endings.",
    "keywords": "text cleaner, strip html, remove blank lines, remove extra spaces, text sanitizer, normalize line endings"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "json-formatter",
    "name": "JSON Formatter",
    "icon": "📋",
    "categoryId": "developer-utilities",
    "categoryName": "Developer Utilities",
    "description": "Format, pretty-print, validate, and minify JSON strings with instant syntax error detection, line indicators, and custom indentation.",
    "keywords": "json formatter, pretty print json, format json online, minify json, json beautifier, json validator"
  ,
    "dateAdded": "2026-09-03"
  },
  {
    "id": "json-validator",
    "name": "JSON Validator",
    "icon": "✅",
    "categoryId": "developer-utilities",
    "categoryName": "Developer Utilities",
    "description": "Validate JSON strings with detailed line and column error indicators, key counters, data type inspection, and payload sizing.",
    "keywords": "json validator, test json valid, json linter, json syntax error checker, validate json string"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "base64-encoder-decoder",
    "name": "Base64 Encoder / Decoder",
    "icon": "🔐",
    "categoryId": "developer-utilities",
    "categoryName": "Developer Utilities",
    "description": "Encode and decode Base64 strings with full Unicode (UTF-8) character and emoji support, plus optional URL-safe Base64 formatting.",
    "keywords": "base64 encoder, base64 decoder, text to base64, base64 to text, utf8 base64 converter, url safe base64"
  ,
    "dateAdded": "2026-09-15"
  },
  {
    "id": "url-encoder-decoder",
    "name": "URL Encoder / Decoder",
    "icon": "🔗",
    "categoryId": "developer-utilities",
    "categoryName": "Developer Utilities",
    "description": "Safely encode text and query parameters into standard percent-encoded URI strings or decode encoded URLs into human-readable text.",
    "keywords": "url encoder, url decoder, percent encoding, uri component encoder, url escape, url unescape"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "regex-tester",
    "name": "Regex Tester",
    "icon": "🔍",
    "categoryId": "developer-utilities",
    "categoryName": "Developer Utilities",
    "description": "Test JavaScript regular expressions with real-time match highlighting, group capturing, error debugging, and common preset patterns.",
    "keywords": "regex tester, test regular expression, regex debugger, regex match highlighter, regex tester online javascript"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "uuid-generator",
    "name": "UUID Generator",
    "icon": "🆔",
    "categoryId": "developer-utilities",
    "categoryName": "Developer Utilities",
    "description": "Generate cryptographically secure Version-4 UUIDs in bulk using the native Web Crypto API with custom casing, hyphens, and wrapper quotes.",
    "keywords": "uuid generator, guid generator, uuid v4 generator, bulk uuid generator, cryptographically secure uuid, online uuid tool"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "meta-tag-generator",
    "name": "Meta Tag Generator",
    "icon": "🏷️",
    "categoryId": "web-seo-utilities",
    "categoryName": "Web & SEO Utilities",
    "description": "Generate complete, search-engine-friendly HTML meta tags, Open Graph tags, and Twitter card tags with live character counters.",
    "keywords": "meta tag generator, html meta tags, seo meta generator, open graph generator, twitter cards generator, html head tags"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "open-graph-preview",
    "name": "Open Graph Preview",
    "icon": "📱",
    "categoryId": "web-seo-utilities",
    "categoryName": "Web & SEO Utilities",
    "description": "Preview how your web page and social metadata look when shared on Facebook, Twitter/X, and Google search results.",
    "keywords": "open graph preview, social card debugger, twitter card preview, facebook link preview, google serp snippet preview"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "url-parser",
    "name": "URL Parser",
    "icon": "🌐",
    "categoryId": "web-seo-utilities",
    "categoryName": "Web & SEO Utilities",
    "description": "Decompose any web URL into its standard protocol, hostname, port, pathname, hash, and structured query parameter key-value pairs.",
    "keywords": "url parser, parse url online, query string inspector, url query parameters, breakdown url, query param extractor"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "utm-builder",
    "name": "UTM Campaign Builder",
    "icon": "🎯",
    "categoryId": "web-seo-utilities",
    "categoryName": "Web & SEO Utilities",
    "description": "Create Google Analytics tracking URLs with standard utm_source, utm_medium, utm_campaign, utm_term, and utm_content parameters.",
    "keywords": "utm builder, utm link generator, google analytics campaign url, campaign tracking link, marketing url builder"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "robots-txt-generator",
    "name": "Robots.txt Generator",
    "icon": "🤖",
    "categoryId": "web-seo-utilities",
    "categoryName": "Web & SEO Utilities",
    "description": "Generate search-engine-compliant robots.txt files with custom user-agents, allow/disallow paths, crawl delays, and XML sitemaps.",
    "keywords": "robots.txt generator, create robots.txt, robots txt builder, crawler directives, googlebot allow disallow, sitemap robots.txt"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "sitemap-xml-generator",
    "name": "Sitemap XML Generator",
    "icon": "🗺️",
    "categoryId": "web-seo-utilities",
    "categoryName": "Web & SEO Utilities",
    "description": "Create valid XML sitemaps for search engines from a list of URLs with configurable priority, change frequency, and last-modified timestamps.",
    "keywords": "sitemap xml generator, create sitemap online, xml sitemap maker, google sitemap builder, generate sitemap.xml"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "color-picker",
    "name": "Color Picker & Contrast Checker",
    "icon": "🎨",
    "categoryId": "image-utilities",
    "categoryName": "Image & Graphics Utilities",
    "description": "Pick colors visually, inspect HEX, RGB, and HSL values, and check WCAG AA/AAA contrast ratios against light and dark backgrounds.",
    "keywords": "color picker, online color picker, hex to rgb, wcag contrast checker, color contrast ratio, hex color code"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "color-palette-generator",
    "name": "Color Palette Generator",
    "icon": "🌈",
    "categoryId": "image-utilities",
    "categoryName": "Image & Graphics Utilities",
    "description": "Generate beautiful harmonious color palettes, tints, shades, and complementary schemes from any base color with one-click hex copying.",
    "keywords": "color palette generator, color scheme maker, complementary colors, analogous colors, triadic color palette, monochromatic palette"
  ,
    "dateAdded": "2026-09-01"
  },
  {
    "id": "hex-rgb-hsl-converter",
    "name": "HEX / RGB / HSL Converter",
    "icon": "🔄",
    "categoryId": "image-utilities",
    "categoryName": "Image & Graphics Utilities",
    "description": "Bidirectional, synchronized three-way color converter for web designers with live visual feedback and ready-to-use CSS snippets.",
    "keywords": "hex to rgb converter, rgb to hex, hex to hsl, hsl to rgb, color format converter, css color converter"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "image-color-extractor",
    "name": "Image Color Palette Extractor",
    "icon": "🖼️",
    "categoryId": "image-utilities",
    "categoryName": "Image & Graphics Utilities",
    "description": "Extract dominant color palettes and prominent hues from local images using HTML5 Canvas pixel quantization with zero uploads.",
    "keywords": "image color extractor, extract palette from image, dominant image color, picture color picker, canvas color extractor"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "svg-viewer",
    "name": "SVG Viewer & Sanitizer",
    "icon": "📐",
    "categoryId": "image-utilities",
    "categoryName": "Image & Graphics Utilities",
    "description": "Render, inspect, scale, and sanitize SVG markup in-browser with automatic stripping of dangerous script tags and event handlers.",
    "keywords": "svg viewer, svg sanitizer, clean svg online, render svg code, safe svg viewer, inspect svg dimensions"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "image-metadata-viewer",
    "name": "Image Metadata Viewer",
    "icon": "📸",
    "categoryId": "image-utilities",
    "categoryName": "Image & Graphics Utilities",
    "description": "Inspect natural pixel dimensions, aspect ratio, file size, MIME type, and local image attributes completely offline with zero server transmission.",
    "keywords": "image metadata viewer, image dimensions checker, photo aspect ratio calculator, inspect image resolution, client side image inspector"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "csv-viewer",
    "name": "CSV Viewer & Filter",
    "icon": "📊",
    "categoryId": "file-data-utilities",
    "categoryName": "File & Data Utilities",
    "description": "Upload or paste CSV spreadsheet data to view, search, and inspect records in a clean, responsive data table with zero server uploads.",
    "keywords": "csv viewer online, inspect csv file, open csv in browser, search csv table, csv table preview, client side csv viewer"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "csv-to-json-converter",
    "name": "CSV to JSON Converter",
    "icon": "🔁",
    "categoryId": "file-data-utilities",
    "categoryName": "File & Data Utilities",
    "description": "Convert CSV spreadsheet tables into structured JSON arrays of objects with automatic header mapping and data type detection.",
    "keywords": "csv to json converter, convert csv to json, csv to json online, csv parser json, excel to json converter"
  ,
    "dateAdded": "2026-09-09"
  },
  {
    "id": "json-to-csv-converter",
    "name": "JSON to CSV Converter",
    "icon": "📑",
    "categoryId": "file-data-utilities",
    "categoryName": "File & Data Utilities",
    "description": "Convert JSON arrays of objects into RFC 4180 compliant CSV files with automatic key union and quotation escaping in your browser.",
    "keywords": "json to csv converter, convert json to csv, json to excel, json to spreadsheet, online json to csv"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "file-information-viewer",
    "name": "File Information & Size Inspector",
    "icon": "ℹ️",
    "categoryId": "file-data-utilities",
    "categoryName": "File & Data Utilities",
    "description": "Analyze any local file byte size, MIME type, extension, and calculate estimated transfer speeds on 4G, 5G, and broadband networks.",
    "keywords": "file info viewer, inspect file size bytes, check file mime type, file download time calculator, local file inspector"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "file-hash-generator",
    "name": "File Hash Generator",
    "icon": "🔒",
    "categoryId": "file-data-utilities",
    "categoryName": "File & Data Utilities",
    "description": "Calculate cryptographic SHA hashes for any local file using the native Web Crypto API with zero file uploads and complete verification integrity.",
    "keywords": "file hash generator, calculate sha256 online, sha1 file checksum, sha512 generator, verify file integrity, checksum calculator"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "text-file-merger",
    "name": "Text File Merger",
    "icon": "📑",
    "categoryId": "file-data-utilities",
    "categoryName": "File & Data Utilities",
    "description": "Merge multiple text, markdown, CSV, or code files into a single consolidated document with customizable separators and file headers.",
    "keywords": "text file merger, merge text files online, combine files, join text files, merge txt files, combine logs online"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "password-strength-checker",
    "name": "Password Strength Checker",
    "icon": "🛡️",
    "categoryId": "everyday-utilities",
    "categoryName": "Everyday Utilities",
    "description": "Test password strength, cryptographic entropy bits, and estimated brute-force crack times locally in your browser. Zero data leaves your device.",
    "keywords": "password strength checker, test password strength, password entropy calculator, check password online secure, offline password audit"
  ,
    "dateAdded": "2026-09-12"
  },
  {
    "id": "timestamp-converter",
    "name": "Timestamp Converter",
    "icon": "⏳",
    "categoryId": "everyday-utilities",
    "categoryName": "Everyday Utilities",
    "description": "Convert Unix epoch timestamps (seconds and milliseconds) to human-readable dates, and convert calendar dates back to Unix timestamps.",
    "keywords": "unix timestamp converter, epoch converter, timestamp to date, date to timestamp, epoch time calculator, unix time now"
  ,
    "dateAdded": "2026-09-10"
  },
  {
    "id": "date-difference-calculator",
    "name": "Date Difference Calculator",
    "icon": "📅",
    "categoryId": "everyday-utilities",
    "categoryName": "Everyday Utilities",
    "description": "Calculate the exact duration between two dates in years, months, days, total hours, minutes, seconds, and working business days.",
    "keywords": "date difference calculator, days between dates, calculate days, business days calculator, date duration calculator, working days between dates"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "percentage-calculator",
    "name": "Percentage Calculator",
    "icon": "➗",
    "categoryId": "everyday-utilities",
    "categoryName": "Everyday Utilities",
    "description": "Solve percentage questions: What is X% of Y, X is what % of Y, percentage increase/decrease, and add/subtract percentages with step-by-step math.",
    "keywords": "percentage calculator, calculate percentage, percent increase calculator, percentage change, percent of number, online percentage tool"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "number-base-converter",
    "name": "Number Base Converter",
    "icon": "🔢",
    "categoryId": "everyday-utilities",
    "categoryName": "Everyday Utilities",
    "description": "Synchronized bidirectional base converter for decimal (base 10), binary (base 2), hex (base 16), and octal (base 8) numbers.",
    "keywords": "number base converter, decimal to binary, binary to hex, hex to decimal, octal converter, base 2 base 10 base 16"
  ,
    "dateAdded": "2026-07-01"
  },
  {
    "id": "random-data-generator",
    "name": "Random Test Data Generator",
    "icon": "🎲",
    "categoryId": "everyday-utilities",
    "categoryName": "Everyday Utilities",
    "description": "Generate mock numbers, alphanumeric strings, test names, sample emails, and IP addresses for testing, QA, and UI prototyping.",
    "keywords": "random data generator, mock data generator, test names generator, random string generator, mock emails, fake test data online"
  ,
    "dateAdded": "2026-07-01"
  }
];

if (typeof window !== "undefined") {
  window.MTV_BU_TOOLS_CATALOG = BU_TOOLS_CATALOG;
}

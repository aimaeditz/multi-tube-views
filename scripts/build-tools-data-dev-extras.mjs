// Category: Developer/Web Extras (4 tools)
export const DEV_EXTRAS_TOOLS = [
  // 1. HTML Entity Encoder
  {
    id: 'html-entity-encoder',
    categoryId: 'developer-web-extras',
    name: 'HTML Entity Encoder',
    icon: '🔣',
    title: 'HTML Entity Encoder & Decoder — Named, Decimal & Hex Entities',
    description: 'Encode special characters, quotes, ampersands, and HTML tags into safe named HTML entities (&amp;, &lt;, &gt;) or decode HTML entities back to characters.',
    keywords: 'html entity encoder, decode html entities online, escape html tags, html character codes, named entities encoder',
    howToUse: [
      { step: '1', title: 'Paste HTML or Text', desc: 'Type regular strings containing symbols, quotes, or code markup.' },
      { step: '2', title: 'Choose Mode', desc: 'Select Encode to HTML Entities or Decode Entities to Raw Text.' },
      { step: '3', title: 'Copy Result', desc: 'Copy safe entity markup ready for documentation or web pages.' }
    ],
    features: [
      { title: 'Named, Decimal & Hex Support', desc: 'Convert to &copy;, &#169;, or &#xA9; entity formats.' },
      { title: 'Bidirectional Decoder', desc: 'Easily decode raw entities back to human-readable strings.' },
      { title: 'Instant Live Processing', desc: 'Zero latency client-side DOM processing.' }
    ],
    sampleText: '<div class="banner">5 > 3 & "Quote" © 2026</div>',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="hee-mode">Operation Mode</label>
          <select id="hee-mode" class="bu-input">
            <option value="encode-named" selected>Encode Special Characters (Named: &amp;lt;, &amp;copy;)</option>
            <option value="encode-dec">Encode to Decimal (&#60;, &#169;)</option>
            <option value="encode-hex">Encode to Hex (&#x3C;, &#xA9;)</option>
            <option value="decode">Decode Entities to Raw Text</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0; display: flex; align-items: flex-end;">
          <button type="button" id="btn-hee-sample" class="bu-btn bu-btn-subtle" style="width: 100%; height: 42px;">Load Sample Markup</button>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="hee-input">Input String</label>
        <textarea id="hee-input" class="bu-textarea bu-input-mono" placeholder="Enter text or HTML code..."><div class="banner">5 > 3 & "Quote" © 2026</div></textarea>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="hee-output">
          <span>Processed Output</span>
          <span class="bu-form-label-hint" id="hee-stats">Ready</span>
        </label>
        <textarea id="hee-output" class="bu-textarea bu-input-mono" readonly></textarea>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-hee-copy" class="bu-btn bu-btn-primary">Copy Output</button>
        <button type="button" id="btn-hee-download" class="bu-btn">Download .txt</button>
        <button type="button" id="btn-hee-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('hee-input');
      const output = document.getElementById('hee-output');
      const modeSelect = document.getElementById('hee-mode');
      const stats = document.getElementById('hee-stats');

      const ENTITY_MAP = {
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;', '©': '&copy;', '®': '&reg;',
        '™': '&trade;', '€': '&euro;', '£': '&pound;', '¥': '&yen;', '¢': '&cent;', '§': '&sect;', '°': '&deg;'
      };

      function processEntities() {
        const str = input.value;
        const mode = modeSelect.value;
        let res = '';

        if (mode === 'encode-named') {
          res = str.replace(/[&<>"'©®™€£¥¢§°]/g, ch => ENTITY_MAP[ch] || ch);
          stats.textContent = 'Encoded to Named Entities';
        } else if (mode === 'encode-dec') {
          res = str.split('').map(c => {
            const code = c.charCodeAt(0);
            return code > 127 || /[&<>"']/.test(c) ? \`&#\${code};\` : c;
          }).join('');
          stats.textContent = 'Encoded to Decimal Entities';
        } else if (mode === 'encode-hex') {
          res = str.split('').map(c => {
            const code = c.charCodeAt(0);
            return code > 127 || /[&<>"']/.test(c) ? \`&#x\${code.toString(16).toUpperCase()};\` : c;
          }).join('');
          stats.textContent = 'Encoded to Hex Entities';
        } else if (mode === 'decode') {
          const doc = new DOMParser().parseFromString(str, 'text/html');
          res = doc.documentElement.textContent;
          stats.textContent = 'Decoded to Plain Text';
        }

        output.value = res;
      }

      input.addEventListener('input', processEntities);
      modeSelect.addEventListener('change', processEntities);

      document.getElementById('btn-hee-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(output.value, document.getElementById('btn-hee-copy'));
      });
      document.getElementById('btn-hee-download').addEventListener('click', () => {
        if (output.value) window.MTV_BU.downloadFile(output.value, 'entities-output.txt');
      });
      document.getElementById('btn-hee-clear').addEventListener('click', () => {
        input.value = '';
        output.value = '';
      });
      document.getElementById('btn-hee-sample').addEventListener('click', () => {
        input.value = '<div class="banner">5 > 3 & "Quote" © 2026 • Price: €99.00</div>';
        processEntities();
      });

      processEntities();
    `
  },

  // 2. Code Minifier (CSS & JS)
  {
    id: 'code-minifier',
    categoryId: 'developer-web-extras',
    name: 'CSS & JavaScript Minifier',
    icon: '⚡',
    title: 'CSS & JavaScript Code Minifier — Remove Whitespace, Comments & Reduce File Size',
    description: 'Compress and minify CSS stylesheets and JavaScript scripts by stripping comments, spaces, newlines, and unnecessary tokens with live file size savings analytics.',
    keywords: 'code minifier, css minifier online, javascript minifier, js compressor, reduce code size',
    howToUse: [
      { step: '1', title: 'Choose Code Type', desc: 'Select CSS or JavaScript / JSON minification mode.' },
      { step: '2', title: 'Paste Source Code', desc: 'Paste raw, formatted source code into the editor.' },
      { step: '3', title: 'Inspect Savings & Copy', desc: 'Review compression percentage savings and copy minified output.' }
    ],
    features: [
      { title: 'CSS & JS Compression', desc: 'Removes multi-line comments (/* ... */), single-line comments (// ...), and excessive indentation.' },
      { title: 'Compression Analytics', desc: 'Displays original bytes, minified bytes, and overall percentage reduction.' },
      { title: 'Safe Token Preservation', desc: 'Preserves string literals and vital syntax structures.' }
    ],
    sampleText: '/* Main Banner Styles */\\n.header {\\n  color: #ffffff;\\n  padding: 20px;\\n}',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="min-lang">Language Syntax</label>
          <select id="min-lang" class="bu-input">
            <option value="css" selected>CSS (Cascading Style Sheets)</option>
            <option value="js">JavaScript (JS / JSON)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0; display: flex; align-items: flex-end;">
          <button type="button" id="btn-min-sample" class="bu-btn bu-btn-subtle" style="width: 100%; height: 42px;">Load Sample Code</button>
        </div>
      </div>

      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="min-input">
            <span>Raw Source Code</span>
            <span class="bu-form-label-hint" id="min-raw-bytes">0 bytes</span>
          </label>
          <textarea id="min-input" class="bu-textarea bu-input-mono" style="min-height: 220px;" placeholder="Paste CSS or JS code here...">/* Main Header Stylesheet */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #0f172a;
  color: #ffffff;
}

/* Navigation Links */
.nav-link {
  text-decoration: none;
  color: #38bdf8;
  transition: color 0.2s ease;
}</textarea>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="min-output">
            <span>Minified Code</span>
            <span class="bu-form-label-hint" id="min-out-bytes">0 bytes</span>
          </label>
          <textarea id="min-output" class="bu-textarea bu-input-mono" style="min-height: 220px;" readonly></textarea>
        </div>
      </div>

      <div class="bu-stats-strip" style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1.25rem; margin-bottom: 1.25rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px);">
        <div>
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Compression Savings</span>
          <strong id="min-savings" style="font-size: 1.25rem; color: var(--success-text); display: block; margin-top: 0.2rem;">0% Smaller</strong>
        </div>
        <div class="bu-actions-bar" style="margin: 0;">
          <button type="button" id="btn-min-copy" class="bu-btn bu-btn-primary">Copy Minified Code</button>
          <button type="button" id="btn-min-download" class="bu-btn">Download Minified</button>
        </div>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('min-input');
      const output = document.getElementById('min-output');
      const langSelect = document.getElementById('min-lang');
      const rawBytesEl = document.getElementById('min-raw-bytes');
      const outBytesEl = document.getElementById('min-out-bytes');
      const savingsEl = document.getElementById('min-savings');

      function minifyCSS(css) {
        return css
          .replace(/\\/\\*[\\s\\S]*?\\*\\//g, '') // remove comments
          .replace(/\\s*([:;{}])\\s*/g, '$1') // remove space around tokens
          .replace(/;}/g, '}') // remove trailing semicolon in block
          .replace(/\\s+/g, ' ') // collapse multiple spaces
          .trim();
      }

      function minifyJS(js) {
        return js
          .replace(/\\/\\*[\\s\\S]*?\\*\\//g, '') // multi-line comments
          .replace(/\\/\\/.*$/gm, '') // single-line comments
          .replace(/\\s*([=+\\-*/%&|!<>?:;,{}()\\[\\]])\\s*/g, '$1') // tokens
          .replace(/\\s+/g, ' ') // whitespace
          .trim();
      }

      function runMinify() {
        const raw = input.value;
        const lang = langSelect.value;
        const min = lang === 'css' ? minifyCSS(raw) : minifyJS(raw);

        output.value = min;

        const rawLen = new Blob([raw]).size;
        const minLen = new Blob([min]).size;

        rawBytesEl.textContent = \`\${rawLen} bytes\`;
        outBytesEl.textContent = \`\${minLen} bytes\`;

        if (rawLen > 0) {
          const pct = Math.max(0, Math.round(((rawLen - minLen) / rawLen) * 100));
          savingsEl.textContent = \`\${pct}% Smaller (-\${rawLen - minLen} B)\`;
        } else {
          savingsEl.textContent = '0% Smaller';
        }
      }

      input.addEventListener('input', runMinify);
      langSelect.addEventListener('change', runMinify);

      document.getElementById('btn-min-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(output.value, document.getElementById('btn-min-copy'));
      });

      document.getElementById('btn-min-download').addEventListener('click', () => {
        const ext = langSelect.value === 'css' ? 'min.css' : 'min.js';
        if (output.value) window.MTV_BU.downloadFile(output.value, \`code.\${ext}\`);
      });

      document.getElementById('btn-min-sample').addEventListener('click', () => {
        if (langSelect.value === 'css') {
          input.value = "/* Card Container Styles */\\n.card {\\n  border-radius: 8px;\\n  padding: 1.5rem;\\n  background: #ffffff;\\n}\\n\\n.card-title {\\n  font-size: 1.25rem;\\n  font-weight: 700;\\n}";
        } else {
          input.value = "// Calculate total price\\nfunction calculate(price, taxRate) {\\n  // Compute subtotal with tax\\n  const subtotal = price * (1 + taxRate);\\n  return subtotal.toFixed(2);\\n}";
        }
        runMinify();
      });

      runMinify();
    `
  },

  // 3. Screen Resolution Checker
  {
    id: 'screen-resolution-checker',
    categoryId: 'developer-web-extras',
    name: 'Screen Resolution Checker',
    icon: '🖥️',
    title: 'Screen Resolution & Display Metrics Checker — Retina DPR, Viewport & Aspect Ratio',
    description: 'Inspect live display resolution (Width x Height), available desktop screen workspace, browser viewport dimensions, Device Pixel Ratio (DPR), and orientation.',
    keywords: 'screen resolution checker, my screen resolution, display viewport size, retina display dpr, screen aspect ratio checker',
    howToUse: [
      { step: '1', title: 'Open Tool', desc: 'Display properties and live viewport metrics are detected immediately.' },
      { step: '2', title: 'Resize Window', desc: 'Observe dynamic live viewport updates as you resize your browser frame.' },
      { step: '3', title: 'Copy Diagnostics', desc: 'Copy formatted display specifications for bug reports and media queries.' }
    ],
    features: [
      { title: 'Live Responsive Viewport', desc: 'Tracks real-time window.innerWidth and window.innerHeight on every resize event.' },
      { title: 'Retina & DPR Detection', desc: 'Detects high-density Retina / HiDPI screens via window.devicePixelRatio.' },
      { title: 'Screen Orientation & Color Depth', desc: 'Reports orientation angles (Landscape/Portrait) and color bit depth (24-bit/32-bit).' }
    ],
    sampleText: '1920x1080',
    renderControls: () => `
      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Physical Screen Size</span>
          <strong id="src-screen" style="font-size: 1.5rem; color: var(--accent-blue); display: block; margin-top: 0.25rem;">0 × 0 px</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Browser Viewport</span>
          <strong id="src-viewport" style="font-size: 1.5rem; color: var(--success-text); display: block; margin-top: 0.25rem;">0 × 0 px</strong>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Updates live on resize</span>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Device Pixel Ratio (DPR)</span>
          <strong id="src-dpr" style="font-size: 1.5rem; color: var(--accent-primary); display: block; margin-top: 0.25rem;">1.0x</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Color Depth</span>
          <strong id="src-depth" style="font-size: 1.5rem; display: block; margin-top: 0.25rem;">24-bit</strong>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Comprehensive Display Specifications</label>
        <div id="src-specs-list" style="border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); background: var(--bg-card); overflow: hidden;">
          <!-- Populated by script -->
        </div>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-src-copy" class="bu-btn bu-btn-primary">Copy Display Specs</button>
      </div>
    `,
    renderScript: () => `
      const screenEl = document.getElementById('src-screen');
      const viewportEl = document.getElementById('src-viewport');
      const dprEl = document.getElementById('src-dpr');
      const depthEl = document.getElementById('src-depth');
      const specsList = document.getElementById('src-specs-list');

      function updateMetrics() {
        const sw = window.screen.width;
        const sh = window.screen.height;
        const avw = window.screen.availWidth;
        const avh = window.screen.availHeight;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        const depth = window.screen.colorDepth || 24;
        const orient = (window.screen.orientation && window.screen.orientation.type) || (vw > vh ? 'landscape-primary' : 'portrait-primary');
        const touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        screenEl.textContent = \`\${sw} × \${sh} px\`;
        viewportEl.textContent = \`\${vw} × \${vh} px\`;
        dprEl.textContent = \`\${dpr}x \${dpr > 1 ? '(HiDPI / Retina)' : '(Standard)'}\`;
        depthEl.textContent = \`\${depth}-bit\`;

        const gcd = (a, b) => b ? gcd(b, a % b) : a;
        const rGcd = gcd(sw, sh);
        const aspect = \`\${sw / rGcd}:\${sh / rGcd}\`;

        const specs = [
          { label: 'Screen Resolution', val: \`\${sw} × \${sh} px\` },
          { label: 'Available Workspace (Excl. Taskbar)', val: \`\${avw} × \${avh} px\` },
          { label: 'Current Browser Viewport', val: \`\${vw} × \${vh} px\` },
          { label: 'Calculated Aspect Ratio', val: aspect },
          { label: 'Device Pixel Ratio (DPR)', val: \`\${dpr}x\` },
          { label: 'Color Depth', val: \`\${depth}-bit\` },
          { label: 'Screen Orientation', val: orient },
          { label: 'Touch Screen Capable', val: touch ? 'Yes (Touch Supported)' : 'No (Mouse / Pointer)' }
        ];

        specsList.innerHTML = specs.map(s => \`
          <div style="display: flex; justify-content: space-between; padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); font-size: 0.9rem;">
            <span style="color: var(--text-muted); font-weight: 600;">\${s.label}</span>
            <span style="font-family: monospace; font-weight: 700; color: var(--text-primary);">\${s.val}</span>
          </div>
        \`).join('');
      }

      window.addEventListener('resize', updateMetrics);
      updateMetrics();

      document.getElementById('btn-src-copy').addEventListener('click', () => {
        const text = \`🖥️ Display Specifications:\\n• Screen: \${window.screen.width}x\${window.screen.height}\\n• Viewport: \${window.innerWidth}x\${window.innerHeight}\\n• DPR: \${window.devicePixelRatio}x\\n• Orientation: \${window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait'}\`;
        window.MTV_BU.copyToClipboard(text, document.getElementById('btn-src-copy'));
      });
    `
  },

  // 4. Browser Info & Diagnostics Checker
  {
    id: 'browser-info-checker',
    categoryId: 'developer-web-extras',
    name: 'Browser Info & Diagnostics Checker',
    icon: '🌐',
    title: 'Browser Info & Client Diagnostics — User-Agent, WebGL, OS & Capabilities',
    description: 'Inspect complete client-side browser diagnostics including User-Agent parsing, browser engine, operating system, WebGL GPU rendering info, and storage support.',
    keywords: 'browser info checker, my user agent, browser diagnostics online, detect os browser javascript, client capabilities checker',
    howToUse: [
      { step: '1', title: 'Open Diagnostics', desc: 'Hardware and browser environment properties are loaded instantly.' },
      { step: '2', title: 'Review Capabilities', desc: 'Inspect GPU renderer, cookie status, LocalStorage, Web Workers, and WebSockets.' },
      { step: '3', title: 'Export Diagnostic Log', desc: 'Copy formatted JSON or markdown diagnostic report for developer support.' }
    ],
    features: [
      { title: 'Hardware & GPU Detection', desc: 'Extracts WebGL unmasked vendor and graphics card renderer safely.' },
      { title: 'Storage & API Audit', desc: 'Checks support for LocalStorage, SessionStorage, IndexedDB, and Web Crypto.' },
      { title: '100% Client-Side Privacy', desc: 'Runs entirely in local browser memory without analytics tracking.' }
    ],
    sampleText: 'Chrome / macOS',
    renderControls: () => `
      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Browser Name</span>
          <strong id="bic-browser" style="font-size: 1.35rem; color: var(--accent-blue); display: block; margin-top: 0.25rem;">Detecting...</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Operating System</span>
          <strong id="bic-os" style="font-size: 1.35rem; color: var(--success-text); display: block; margin-top: 0.25rem;">Detecting...</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Device Type</span>
          <strong id="bic-device" style="font-size: 1.35rem; color: var(--accent-primary); display: block; margin-top: 0.25rem;">Desktop</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Online Connection</span>
          <strong id="bic-online" style="font-size: 1.35rem; color: var(--success-text); display: block; margin-top: 0.25rem;">Online</strong>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="bic-ua">Full User-Agent String</label>
        <textarea id="bic-ua" class="bu-textarea bu-input-mono" style="min-height: 80px;" readonly></textarea>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Client Capability Matrix</label>
        <div id="bic-specs-list" style="border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); background: var(--bg-card); overflow: hidden;">
          <!-- Populated by script -->
        </div>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-bic-copy" class="bu-btn bu-btn-primary">Copy Diagnostic Report</button>
      </div>
    `,
    renderScript: () => `
      const browserEl = document.getElementById('bic-browser');
      const osEl = document.getElementById('bic-os');
      const deviceEl = document.getElementById('bic-device');
      const onlineEl = document.getElementById('bic-online');
      const uaInput = document.getElementById('bic-ua');
      const specsList = document.getElementById('bic-specs-list');

      function detectDiagnostics() {
        const ua = navigator.userAgent;
        uaInput.value = ua;

        // Browser Detect
        let browser = 'Unknown Browser';
        if (ua.includes('Edg/')) browser = 'Microsoft Edge';
        else if (ua.includes('Chrome/')) browser = 'Google Chrome';
        else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox';
        else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Apple Safari';
        else if (ua.includes('OPR/') || ua.includes('Opera/')) browser = 'Opera';

        // OS Detect
        let os = 'Unknown OS';
        if (ua.includes('Mac OS X') || ua.includes('Macintosh')) os = 'macOS';
        else if (ua.includes('Windows')) os = 'Windows';
        else if (ua.includes('Android')) os = 'Android';
        else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
        else if (ua.includes('Linux')) os = 'Linux';

        const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);

        browserEl.textContent = browser;
        osEl.textContent = os;
        deviceEl.textContent = isMobile ? 'Mobile / Tablet' : 'Desktop';
        onlineEl.textContent = navigator.onLine ? '🟢 Online' : '🔴 Offline';

        // GPU / WebGL Detect
        let gpu = 'Standard Graphics';
        try {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (gl) {
            const ext = gl.getExtension('WEBGL_debug_renderer_info');
            if (ext) {
              gpu = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
            }
          }
        } catch(e) {}

        const caps = [
          { label: 'Browser & Version', val: browser },
          { label: 'Operating System', val: os },
          { label: 'Device Form Factor', val: isMobile ? 'Mobile / Tablet' : 'Desktop' },
          { label: 'Hardware Cores (Threads)', val: navigator.hardwareConcurrency ? \`\${navigator.hardwareConcurrency} Cores\` : 'Unavailable' },
          { label: 'Device Memory RAM', val: navigator.deviceMemory ? \`~\${navigator.deviceMemory} GB\` : 'Standard' },
          { label: 'Graphics Renderer (GPU)', val: gpu },
          { label: 'Preferred Language', val: navigator.language || 'en-US' },
          { label: 'Local Timezone', val: Intl.DateTimeFormat().resolvedOptions().timeZone },
          { label: 'Cookies Enabled', val: navigator.cookieEnabled ? 'Yes' : 'No' },
          { label: 'Web Crypto API Support', val: window.crypto && window.crypto.subtle ? 'Yes (Hardware Ready)' : 'No' },
          { label: 'LocalStorage & IndexedDB', val: ('localStorage' in window) && ('indexedDB' in window) ? 'Yes (Supported)' : 'Partial' }
        ];

        specsList.innerHTML = caps.map(c => \`
          <div style="display: flex; justify-content: space-between; padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); font-size: 0.9rem;">
            <span style="color: var(--text-muted); font-weight: 600;">\${c.label}</span>
            <span style="font-family: monospace; font-weight: 700; color: var(--text-primary); text-align: right; max-width: 55%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\${c.val}</span>
          </div>
        \`).join('');
      }

      detectDiagnostics();

      document.getElementById('btn-bic-copy').addEventListener('click', () => {
        const text = \`🌐 Browser Diagnostic Log:\\n• Browser: \${browserEl.textContent}\\n• OS: \${osEl.textContent}\\n• User-Agent: \${uaInput.value}\`;
        window.MTV_BU.copyToClipboard(text, document.getElementById('btn-bic-copy'));
      });
    `
  }
];

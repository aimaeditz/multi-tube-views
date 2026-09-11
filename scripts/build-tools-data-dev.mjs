// Developer Utilities (Tools 7-12)
export const DEV_TOOLS = [
  // 7. JSON Formatter
  {
    id: 'json-formatter',
    categoryId: 'developer-utilities',
    name: 'JSON Formatter',
    icon: '📋',
    title: 'JSON Formatter & Minifier — Pretty Print & Indent JSON Online',
    description: 'Format, pretty-print, validate, and minify JSON strings with instant syntax error detection, line indicators, and custom indentation.',
    keywords: 'json formatter, pretty print json, format json online, minify json, json beautifier, json validator',
    howToUse: [
      { step: '1', title: 'Paste JSON Data', desc: 'Paste raw, minified, or unformatted JSON code into the editor.' },
      { step: '2', title: 'Select Indentation', desc: 'Choose 2 spaces, 4 spaces, tabs, or compact minification.' },
      { step: '3', title: 'Format or Export', desc: 'Click Format JSON, copy the structured hierarchy, or download as a .json file.' }
    ],
    features: [
      { title: 'Custom Spacing', desc: 'Format with 2 spaces, 4 spaces, tabs, or 0-space minification.' },
      { title: 'Syntax Error Pinpointing', desc: 'Shows exact line, column, and token message when JSON is invalid.' },
      { title: 'Client-Side Privacy', desc: 'Sensitive API payloads and database dumps never leave your device.' }
    ],
    sampleText: '{"appName":"Multi Tube Views","version":2.5,"features":["40+ Platforms","20 Creator Tools","15 Converters","36 Utilities"],"author":{"name":"AiMAEditz","active":true}}',
    renderControls: () => `
      <div class="bu-form-group">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <label class="bu-form-label" style="margin:0;" for="jf-input">Input JSON</label>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 0.78rem; color: var(--text-muted);">Indent:</span>
            <select id="jf-indent" class="bu-select" style="width: auto; padding: 0.35rem 0.65rem; font-size: 0.78rem;">
              <option value="2" selected>2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="tab">Tab Character</option>
              <option value="0">Minified (0 Spaces)</option>
            </select>
          </div>
        </div>
        <textarea id="jf-input" class="bu-textarea bu-textarea-mono" style="min-height: 200px;" placeholder="Paste raw JSON here..."></textarea>
      </div>
      <div class="bu-actions-bar" style="gap: 0.5rem;">
        <button type="button" id="btn-jf-format" class="bu-btn bu-btn-primary">Format JSON</button>
        <button type="button" id="btn-jf-minify" class="bu-btn">Minify JSON</button>
        <button type="button" id="btn-jf-copy" class="bu-btn">Copy Output</button>
        <button type="button" id="btn-jf-download" class="bu-btn">Download .json</button>
        <button type="button" id="btn-jf-sample" class="bu-btn bu-btn-subtle">Load Sample</button>
        <button type="button" id="btn-jf-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
      <div id="jf-status" class="bu-status-banner" style="display: none; margin-top: 1rem;"></div>
      <div class="bu-form-group" style="margin-top: 1.25rem;">
        <label class="bu-form-label" for="jf-output">Formatted Output</label>
        <textarea id="jf-output" class="bu-textarea bu-textarea-mono" readonly style="min-height: 240px;" placeholder="Formatted JSON output will appear here..."></textarea>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('jf-input');
      const output = document.getElementById('jf-output');
      const indentSelect = document.getElementById('jf-indent');
      const formatBtn = document.getElementById('btn-jf-format');
      const minifyBtn = document.getElementById('btn-jf-minify');
      const copyBtn = document.getElementById('btn-jf-copy');
      const dlBtn = document.getElementById('btn-jf-download');
      const sampleBtn = document.getElementById('btn-jf-sample');
      const clearBtn = document.getElementById('btn-jf-clear');
      const statusBanner = document.getElementById('jf-status');

      function formatJSON(minify = false) {
        if (!input.value.trim()) {
          output.value = '';
          statusBanner.style.display = 'none';
          return;
        }
        const indentVal = minify ? 0 : indentSelect.value;
        const res = window.MTV_BU.formatJSON(input.value, indentVal);
        if (res.valid) {
          output.value = res.result;
          statusBanner.className = 'bu-status-banner bu-status-success';
          statusBanner.textContent = '✓ Valid JSON formatted successfully.';
          statusBanner.style.display = 'block';
        } else {
          output.value = '';
          statusBanner.className = 'bu-status-banner bu-status-error';
          statusBanner.textContent = '✗ ' + res.error;
          statusBanner.style.display = 'block';
        }
      }

      formatBtn.addEventListener('click', () => formatJSON(false));
      minifyBtn.addEventListener('click', () => formatJSON(true));
      indentSelect.addEventListener('change', () => formatJSON(false));

      copyBtn.addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(output.value, copyBtn);
      });

      dlBtn.addEventListener('click', () => {
        if (!output.value) return;
        window.MTV_BU.downloadFile(output.value, 'formatted.json', 'application/json');
      });

      sampleBtn.addEventListener('click', () => {
        input.value = '{"appName":"Multi Tube Views","version":2.5,"features":["40+ Platforms","20 Creator Tools","15 Converters","36 Utilities"],"author":{"name":"AiMAEditz","active":true}}';
        formatJSON(false);
      });

      clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        statusBanner.style.display = 'none';
        input.focus();
      });
    `
  },

  // 8. JSON Validator
  {
    id: 'json-validator',
    categoryId: 'developer-utilities',
    name: 'JSON Validator',
    icon: '✅',
    title: 'JSON Validator & Schema Inspector — Detect Syntax Errors Online',
    description: 'Validate JSON strings with detailed line and column error indicators, key counters, data type inspection, and payload sizing.',
    keywords: 'json validator, test json valid, json linter, json syntax error checker, validate json string',
    howToUse: [
      { step: '1', title: 'Paste JSON Text', desc: 'Enter JSON payload or response from an API into the editor.' },
      { step: '2', title: 'Validate Hierarchy', desc: 'Click Validate JSON to run complete structural syntax parsing.' },
      { step: '3', title: 'Inspect Schema', desc: 'Examine root type, total key counts, payload byte size, or fix errors.' }
    ],
    features: [
      { title: 'Pinpoint Location', desc: 'Provides precise line numbers and character positions for malformed tokens.' },
      { title: 'Type Inspection', desc: 'Reports whether root node is an Object, Array, Primitive, or Null.' },
      { title: 'Payload Sizing', desc: 'Calculates exact byte footprint for network optimization.' }
    ],
    sampleText: '{"status": 200, "message": "Success", "data": [{"id": 1, "title": "MTV"}, {"id": 2, "title": "Tools"}]}',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="jv-input">JSON Payload to Validate</label>
        <textarea id="jv-input" class="bu-textarea bu-textarea-mono" style="min-height: 220px;" placeholder="Paste JSON here to check validity..."></textarea>
      </div>
      <div class="bu-actions-bar">
        <button type="button" id="btn-jv-validate" class="bu-btn bu-btn-primary">Validate JSON</button>
        <button type="button" id="btn-jv-sample" class="bu-btn">Load Valid Sample</button>
        <button type="button" id="btn-jv-malformed" class="bu-btn">Load Malformed Sample</button>
        <button type="button" id="btn-jv-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
      <div id="jv-result-box" style="display: none; margin-top: 1.25rem;">
        <div id="jv-banner" class="bu-status-banner"></div>
        <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-top: 1rem;">
          <div class="bu-stat-item">Root Type: <strong id="jv-type">-</strong></div>
          <div class="bu-stat-item">Keys / Items: <strong id="jv-keys">-</strong></div>
          <div class="bu-stat-item">Size: <strong id="jv-size">-</strong></div>
          <div class="bu-stat-item">Status: <strong id="jv-status-badge">-</strong></div>
        </div>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('jv-input');
      const validateBtn = document.getElementById('btn-jv-validate');
      const sampleBtn = document.getElementById('btn-jv-sample');
      const malformedBtn = document.getElementById('btn-jv-malformed');
      const clearBtn = document.getElementById('btn-jv-clear');
      const resultBox = document.getElementById('jv-result-box');
      const banner = document.getElementById('jv-banner');
      const typeEl = document.getElementById('jv-type');
      const keysEl = document.getElementById('jv-keys');
      const sizeEl = document.getElementById('jv-size');
      const badgeEl = document.getElementById('jv-status-badge');

      function validate() {
        const val = input.value.trim();
        if (!val) {
          resultBox.style.display = 'none';
          return;
        }
        resultBox.style.display = 'block';
        const res = window.MTV_BU.validateJSON(val);
        if (res.valid) {
          banner.className = 'bu-status-banner bu-status-success';
          banner.textContent = '✓ JSON is 100% valid syntactically.';
          typeEl.textContent = res.type;
          keysEl.textContent = res.keyCount;
          sizeEl.textContent = res.sizeFormatted;
          badgeEl.textContent = 'VALID';
          badgeEl.style.color = 'var(--success-text)';
        } else {
          banner.className = 'bu-status-banner bu-status-error';
          banner.textContent = '✗ ' + res.error;
          typeEl.textContent = 'Invalid';
          keysEl.textContent = '0';
          sizeEl.textContent = val.length + ' B';
          badgeEl.textContent = 'SYNTAX ERROR';
          badgeEl.style.color = 'var(--danger-text)';
        }
      }

      validateBtn.addEventListener('click', validate);
      input.addEventListener('input', validate);

      sampleBtn.addEventListener('click', () => {
        input.value = '{"status": 200, "message": "Success", "data": [{"id": 1, "title": "MTV"}, {"id": 2, "title": "Tools"}]}';
        validate();
      });

      malformedBtn.addEventListener('click', () => {
        input.value = '{\\n  "name": "MTV",\\n  "version": 2.5,\\n  "missingTrailingQuote: true\\n}';
        validate();
      });

      clearBtn.addEventListener('click', () => {
        input.value = '';
        resultBox.style.display = 'none';
        input.focus();
      });
    `
  },

  // 9. Base64 Encoder & Decoder
  {
    id: 'base64-encoder-decoder',
    categoryId: 'developer-utilities',
    name: 'Base64 Encoder / Decoder',
    icon: '🔐',
    title: 'Base64 Encoder & Decoder — Safe UTF-8 Text Conversion',
    description: 'Encode and decode Base64 strings with full Unicode (UTF-8) character and emoji support, plus optional URL-safe Base64 formatting.',
    keywords: 'base64 encoder, base64 decoder, text to base64, base64 to text, utf8 base64 converter, url safe base64',
    howToUse: [
      { step: '1', title: 'Choose Conversion Mode', desc: 'Select Encode (Text → Base64) or Decode (Base64 → Text).' },
      { step: '2', title: 'Enter Text', desc: 'Type or paste your string into the primary input area.' },
      { step: '3', title: 'Copy or Download', desc: 'Copy the encoded/decoded string or export as a file.' }
    ],
    features: [
      { title: 'Full UTF-8 Support', desc: 'Handles foreign languages, accents, symbols, and emojis without encoding corruption.' },
      { title: 'URL-Safe Mode', desc: 'Optionally swaps + and / for - and _ to embed Base64 safely in query strings.' },
      { title: 'Bidirectional Swap', desc: 'Swap input and output with one click for rapid verification.' }
    ],
    sampleText: 'Hello World! 🌍 Multi Tube Views PRO 2026 — 100% In-Browser Privacy.',
    renderControls: () => `
      <div class="bu-actions-bar" style="justify-content: flex-start; gap: 0.5rem; margin-bottom: 1.25rem;">
        <button type="button" id="btn-mode-encode" class="bu-btn bu-btn-primary">Encode (Text → Base64)</button>
        <button type="button" id="btn-mode-decode" class="bu-btn">Decode (Base64 → Text)</button>
        <label class="bu-checkbox-label" style="margin-left: auto;">
          <input type="checkbox" id="b64-urlsafe"> URL-safe Base64 (- and _)
        </label>
      </div>
      <div class="bu-grid-2col">
        <div class="bu-form-group">
          <label class="bu-form-label" id="b64-in-label" for="b64-input">Plain Text Input</label>
          <textarea id="b64-input" class="bu-textarea bu-textarea-mono" style="min-height: 200px;" placeholder="Type text to encode..."></textarea>
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" id="b64-out-label" for="b64-output">Base64 Output</label>
          <textarea id="b64-output" class="bu-textarea bu-textarea-mono" readonly style="min-height: 200px;" placeholder="Base64 result will appear here..."></textarea>
        </div>
      </div>
      <div class="bu-actions-bar">
        <button type="button" id="btn-b64-copy" class="bu-btn bu-btn-primary">Copy Result</button>
        <button type="button" id="btn-b64-swap" class="bu-btn">Swap Input / Output</button>
        <button type="button" id="btn-b64-download" class="bu-btn">Download .txt</button>
        <button type="button" id="btn-b64-sample" class="bu-btn">Load Sample</button>
        <button type="button" id="btn-b64-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
      <div id="b64-error" class="bu-status-banner bu-status-error" style="display: none; margin-top: 1rem;"></div>
    `,
    renderScript: () => `
      let mode = 'encode';
      const inEl = document.getElementById('b64-input');
      const outEl = document.getElementById('b64-output');
      const inLabel = document.getElementById('b64-in-label');
      const outLabel = document.getElementById('b64-out-label');
      const btnEncode = document.getElementById('btn-mode-encode');
      const btnDecode = document.getElementById('btn-mode-decode');
      const urlSafeCheck = document.getElementById('b64-urlsafe');
      const copyBtn = document.getElementById('btn-b64-copy');
      const swapBtn = document.getElementById('btn-b64-swap');
      const dlBtn = document.getElementById('btn-b64-download');
      const sampleBtn = document.getElementById('btn-b64-sample');
      const clearBtn = document.getElementById('btn-b64-clear');
      const errorEl = document.getElementById('b64-error');

      function setMode(m) {
        mode = m;
        if (mode === 'encode') {
          btnEncode.className = 'bu-btn bu-btn-primary';
          btnDecode.className = 'bu-btn';
          inLabel.textContent = 'Plain Text Input';
          outLabel.textContent = 'Base64 Output';
          inEl.placeholder = 'Type text to encode...';
        } else {
          btnDecode.className = 'bu-btn bu-btn-primary';
          btnEncode.className = 'bu-btn';
          inLabel.textContent = 'Base64 Input';
          outLabel.textContent = 'Decoded Plain Text';
          inEl.placeholder = 'Paste Base64 string to decode...';
        }
        convert();
      }

      function convert() {
        errorEl.style.display = 'none';
        const val = inEl.value;
        if (!val) {
          outEl.value = '';
          return;
        }
        if (mode === 'encode') {
          outEl.value = window.MTV_BU.encodeBase64(val, urlSafeCheck.checked);
        } else {
          const res = window.MTV_BU.decodeBase64(val);
          if (res.valid) {
            outEl.value = res.result;
          } else {
            outEl.value = '';
            errorEl.textContent = '✗ ' + res.error;
            errorEl.style.display = 'block';
          }
        }
      }

      btnEncode.addEventListener('click', () => setMode('encode'));
      btnDecode.addEventListener('click', () => setMode('decode'));
      inEl.addEventListener('input', convert);
      urlSafeCheck.addEventListener('change', convert);

      copyBtn.addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(outEl.value, copyBtn);
      });

      swapBtn.addEventListener('click', () => {
        if (!outEl.value) return;
        inEl.value = outEl.value;
        setMode(mode === 'encode' ? 'decode' : 'encode');
      });

      dlBtn.addEventListener('click', () => {
        if (!outEl.value) return;
        window.MTV_BU.downloadFile(outEl.value, mode === 'encode' ? 'encoded.b64' : 'decoded.txt');
      });

      sampleBtn.addEventListener('click', () => {
        inEl.value = "Hello World! 🌍 Multi Tube Views PRO 2026 — 100% In-Browser Privacy.";
        setMode('encode');
      });

      clearBtn.addEventListener('click', () => {
        inEl.value = '';
        outEl.value = '';
        errorEl.style.display = 'none';
        inEl.focus();
      });
    `
  },

  // 10. URL Encoder & Decoder
  {
    id: 'url-encoder-decoder',
    categoryId: 'developer-utilities',
    name: 'URL Encoder / Decoder',
    icon: '🔗',
    title: 'URL Encoder & Decoder — Encode & Decode URI Components Online',
    description: 'Safely encode text and query parameters into standard percent-encoded URI strings or decode encoded URLs into human-readable text.',
    keywords: 'url encoder, url decoder, percent encoding, uri component encoder, url escape, url unescape',
    howToUse: [
      { step: '1', title: 'Pick Encoding Mode', desc: 'Choose Encode URL or Decode URL.' },
      { step: '2', title: 'Set Scope', desc: 'Select Component mode (for query values) or Full URI mode.' },
      { step: '3', title: 'Execute & Copy', desc: 'Input text, view percent-encoded strings, and copy with one click.' }
    ],
    features: [
      { title: 'Component vs Full URI', desc: 'Supports both encodeURIComponent and encodeURI for flexible escaping.' },
      { title: 'Character Preservation', desc: 'Accurately parses spaces (+ or %20), ampersands, slashes, and UTF-8 characters.' },
      { title: 'Zero Data Transmission', desc: 'Operates completely within browser memory.' }
    ],
    sampleText: 'https://multitubeviews.com/platforms/youtube.html?q=AI video tools & category=tech+creators#overview',
    renderControls: () => `
      <div class="bu-actions-bar" style="justify-content: flex-start; gap: 0.5rem; margin-bottom: 1.25rem;">
        <button type="button" id="btn-url-encode" class="bu-btn bu-btn-primary">Encode URL</button>
        <button type="button" id="btn-url-decode" class="bu-btn">Decode URL</button>
        <label class="bu-checkbox-label" style="margin-left: auto;">
          <input type="checkbox" id="url-component" checked> Component Mode (encodeURIComponent)
        </label>
      </div>
      <div class="bu-grid-2col">
        <div class="bu-form-group">
          <label class="bu-form-label" id="url-in-label" for="url-input">Input String</label>
          <textarea id="url-input" class="bu-textarea bu-textarea-mono" style="min-height: 200px;" placeholder="Type or paste URL / text here..."></textarea>
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" id="url-out-label" for="url-output">Processed Result</label>
          <textarea id="url-output" class="bu-textarea bu-textarea-mono" readonly style="min-height: 200px;" placeholder="Result will appear here..."></textarea>
        </div>
      </div>
      <div class="bu-actions-bar">
        <button type="button" id="btn-url-copy" class="bu-btn bu-btn-primary">Copy Result</button>
        <button type="button" id="btn-url-swap" class="bu-btn">Swap Input / Output</button>
        <button type="button" id="btn-url-sample" class="bu-btn">Load Sample</button>
        <button type="button" id="btn-url-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      let mode = 'encode';
      const inEl = document.getElementById('url-input');
      const outEl = document.getElementById('url-output');
      const btnEncode = document.getElementById('btn-url-encode');
      const btnDecode = document.getElementById('btn-url-decode');
      const compCheck = document.getElementById('url-component');
      const copyBtn = document.getElementById('btn-url-copy');
      const swapBtn = document.getElementById('btn-url-swap');
      const sampleBtn = document.getElementById('btn-url-sample');
      const clearBtn = document.getElementById('btn-url-clear');

      function setMode(m) {
        mode = m;
        if (mode === 'encode') {
          btnEncode.className = 'bu-btn bu-btn-primary';
          btnDecode.className = 'bu-btn';
        } else {
          btnDecode.className = 'bu-btn bu-btn-primary';
          btnEncode.className = 'bu-btn';
        }
        convert();
      }

      function convert() {
        const val = inEl.value;
        if (!val) {
          outEl.value = '';
          return;
        }
        if (mode === 'encode') {
          outEl.value = window.MTV_BU.encodeURL(val, compCheck.checked);
        } else {
          outEl.value = window.MTV_BU.decodeURL(val);
        }
      }

      btnEncode.addEventListener('click', () => setMode('encode'));
      btnDecode.addEventListener('click', () => setMode('decode'));
      inEl.addEventListener('input', convert);
      compCheck.addEventListener('change', convert);

      copyBtn.addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(outEl.value, copyBtn);
      });

      swapBtn.addEventListener('click', () => {
        if (!outEl.value) return;
        inEl.value = outEl.value;
        setMode(mode === 'encode' ? 'decode' : 'encode');
      });

      sampleBtn.addEventListener('click', () => {
        inEl.value = 'https://multitubeviews.com/platforms/youtube.html?q=AI video tools & category=tech+creators#overview';
        setMode('encode');
      });

      clearBtn.addEventListener('click', () => {
        inEl.value = '';
        outEl.value = '';
        inEl.focus();
      });
    `
  },

  // 11. Regex Tester
  {
    id: 'regex-tester',
    categoryId: 'developer-utilities',
    name: 'Regex Tester',
    icon: '🔍',
    title: 'Regex Tester & Debugger — Interactive Regular Expression Matching',
    description: 'Test JavaScript regular expressions with real-time match highlighting, group capturing, error debugging, and common preset patterns.',
    keywords: 'regex tester, test regular expression, regex debugger, regex match highlighter, regex tester online javascript',
    howToUse: [
      { step: '1', title: 'Enter Pattern & Flags', desc: 'Type your regular expression pattern and toggle flags (g, i, m, s).' },
      { step: '2', title: 'Paste Test Content', desc: 'Enter the candidate text strings you want to match against.' },
      { step: '3', title: 'Inspect Highlighted Matches', desc: 'Review matching segments, match counts, and captured sub-groups.' }
    ],
    features: [
      { title: 'Visual Match Highlighting', desc: 'Live yellow highlights show exactly where expressions trigger on test text.' },
      { title: 'Pattern Presets', desc: 'One-click presets for emails, URLs, dates, phone numbers, and IPv4 addresses.' },
      { title: 'Capture Groups Inspector', desc: 'Displays captured parenthetical sub-groups and their indices.' }
    ],
    sampleText: 'Contact our support team at info@multitubeviews.com or admin@aimaeditz.com. For urgent inquiries call +1-800-555-0199 or test test@example.org.',
    renderControls: () => `
      <div class="bu-form-group">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <label class="bu-form-label" style="margin: 0;" for="rx-pattern">Regular Expression</label>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 0.78rem; color: var(--text-muted);">Preset:</span>
            <select id="rx-preset" class="bu-select" style="width: auto; padding: 0.35rem 0.65rem; font-size: 0.78rem;">
              <option value="">Choose a preset...</option>
              <option value="email">Email Address</option>
              <option value="url">Web URL (HTTP/HTTPS)</option>
              <option value="ipv4">IPv4 Address</option>
              <option value="date">Date (YYYY-MM-DD)</option>
              <option value="hex">HEX Color Code</option>
              <option value="phone">US Phone Number</option>
            </select>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-family: monospace; font-size: 1.2rem; color: var(--text-muted);">/</span>
          <input type="text" id="rx-pattern" class="bu-input bu-input-mono" value="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" placeholder="Enter regex pattern here...">
          <span style="font-family: monospace; font-size: 1.2rem; color: var(--text-muted);">/</span>
          <input type="text" id="rx-flags" class="bu-input bu-input-mono" value="gi" style="width: 70px;" placeholder="flags">
        </div>
      </div>
      <div class="bu-options-wrap">
        <label class="bu-checkbox-label"><input type="checkbox" id="rx-flag-g" checked> Global (g)</label>
        <label class="bu-checkbox-label"><input type="checkbox" id="rx-flag-i" checked> Case-insensitive (i)</label>
        <label class="bu-checkbox-label"><input type="checkbox" id="rx-flag-m"> Multiline (m)</label>
        <label class="bu-checkbox-label"><input type="checkbox" id="rx-flag-s"> DotAll (s)</label>
      </div>
      <div class="bu-form-group">
        <label class="bu-form-label" for="rx-test">Test String</label>
        <textarea id="rx-test" class="bu-textarea bu-textarea-mono" style="min-height: 140px;" placeholder="Enter text to match against..."></textarea>
      </div>
      <div id="rx-error" class="bu-status-banner bu-status-error" style="display: none; margin-bottom: 1rem;"></div>
      <div class="bu-form-group">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <label class="bu-form-label" style="margin: 0;">Highlighted Matches</label>
          <span class="bu-badge" id="rx-match-badge">0 matches found</span>
        </div>
        <div id="rx-highlighted" class="bu-output-box" style="min-height: 120px; white-space: pre-wrap; font-family: monospace;"></div>
      </div>
      <div class="bu-actions-bar">
        <button type="button" id="btn-rx-sample" class="bu-btn bu-btn-primary">Load Sample</button>
        <button type="button" id="btn-rx-copy-matches" class="bu-btn">Copy Matched Texts</button>
        <button type="button" id="btn-rx-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const patternInput = document.getElementById('rx-pattern');
      const flagsInput = document.getElementById('rx-flags');
      const testInput = document.getElementById('rx-test');
      const presetSelect = document.getElementById('rx-preset');
      const flagG = document.getElementById('rx-flag-g');
      const flagI = document.getElementById('rx-flag-i');
      const flagM = document.getElementById('rx-flag-m');
      const flagS = document.getElementById('rx-flag-s');
      const errorEl = document.getElementById('rx-error');
      const badgeEl = document.getElementById('rx-match-badge');
      const highlightEl = document.getElementById('rx-highlighted');
      const sampleBtn = document.getElementById('btn-rx-sample');
      const copyBtn = document.getElementById('btn-rx-copy-matches');
      const clearBtn = document.getElementById('btn-rx-clear');

      const PRESETS = {
        email: { pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}', flags: 'gi' },
        url: { pattern: 'https?:\\\\/\\\\/[\\\\w\\\\-]+(\\\\.[\\\\w\\\\-]+)+[/#?]?.*', flags: 'gi' },
        ipv4: { pattern: '\\\\b(?:[0-9]{1,3}\\\\.){3}[0-9]{1,3}\\\\b', flags: 'g' },
        date: { pattern: '\\\\b\\\\d{4}-\\\\d{2}-\\\\d{2}\\\\b', flags: 'g' },
        hex: { pattern: '#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\\\b', flags: 'gi' },
        phone: { pattern: '\\\\+?[0-9]{1,3}?[-.\\\\s]?\\\\(?[0-9]{3}\\\\)?[-.\\\\s]?[0-9]{3}[-.\\\\s]?[0-9]{4}', flags: 'g' }
      };

      function syncFlags() {
        let f = '';
        if (flagG.checked) f += 'g';
        if (flagI.checked) f += 'i';
        if (flagM.checked) f += 'm';
        if (flagS.checked) f += 's';
        flagsInput.value = f;
      }

      function updateFlagsFromInput() {
        const f = flagsInput.value;
        flagG.checked = f.includes('g');
        flagI.checked = f.includes('i');
        flagM.checked = f.includes('m');
        flagS.checked = f.includes('s');
      }

      let lastMatches = [];

      function runRegex() {
        errorEl.style.display = 'none';
        const pat = patternInput.value;
        const fl = flagsInput.value;
        const text = testInput.value;

        if (!pat || !text) {
          highlightEl.textContent = text || 'Matches will be highlighted here...';
          badgeEl.textContent = '0 matches found';
          lastMatches = [];
          return;
        }

        const res = window.MTV_BU.testRegex(pat, fl, text);
        if (!res.valid) {
          errorEl.textContent = '✗ ' + res.error;
          errorEl.style.display = 'block';
          highlightEl.textContent = text;
          badgeEl.textContent = 'Regex Error';
          lastMatches = [];
          return;
        }

        lastMatches = res.matches.map(m => m.match);
        badgeEl.textContent = \`\${res.matchCount} match\${res.matchCount === 1 ? '' : 'es'} found\`;
        highlightEl.innerHTML = res.highlightedHTML;
      }

      [patternInput, flagsInput, testInput].forEach(el => el.addEventListener('input', runRegex));
      flagsInput.addEventListener('input', updateFlagsFromInput);

      [flagG, flagI, flagM, flagS].forEach(cb => {
        cb.addEventListener('change', () => {
          syncFlags();
          runRegex();
        });
      });

      presetSelect.addEventListener('change', () => {
        const p = PRESETS[presetSelect.value];
        if (p) {
          patternInput.value = p.pattern;
          flagsInput.value = p.flags;
          updateFlagsFromInput();
          runRegex();
        }
      });

      sampleBtn.addEventListener('click', () => {
        patternInput.value = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}';
        flagsInput.value = 'gi';
        updateFlagsFromInput();
        testInput.value = 'Contact our support team at info@multitubeviews.com or admin@aimaeditz.com. For urgent inquiries call +1-800-555-0199 or test test@example.org.';
        runRegex();
      });

      copyBtn.addEventListener('click', () => {
        if (!lastMatches.length) return;
        window.MTV_BU.copyToClipboard(lastMatches.join('\\n'), copyBtn);
      });

      clearBtn.addEventListener('click', () => {
        testInput.value = '';
        runRegex();
        testInput.focus();
      });

      syncFlags();
      runRegex();
    `
  },

  // 12. UUID Generator
  {
    id: 'uuid-generator',
    categoryId: 'developer-utilities',
    name: 'UUID Generator',
    icon: '🆔',
    title: 'UUID v4 Generator — Bulk Unique Identifier Generator Online',
    description: 'Generate cryptographically secure Version-4 UUIDs in bulk using the native Web Crypto API with custom casing, hyphens, and wrapper quotes.',
    keywords: 'uuid generator, guid generator, uuid v4 generator, bulk uuid generator, cryptographically secure uuid, online uuid tool',
    howToUse: [
      { step: '1', title: 'Choose Quantity', desc: 'Select how many UUIDs to produce at once (from 1 to 100).' },
      { step: '2', title: 'Select Formatting', desc: 'Toggle uppercase/lowercase, hyphens, and quote wrapping.' },
      { step: '3', title: 'Generate & Copy', desc: 'Click Generate to produce fresh cryptographically random IDs.' }
    ],
    features: [
      { title: 'Web Crypto API Powered', desc: 'Uses crypto.getRandomValues() for RFC 4122 cryptographic compliance.' },
      { title: 'Bulk Batch Generation', desc: 'Quickly create up to 100 distinct identifiers in a single click.' },
      { title: 'Multiple Formatting Modes', desc: 'Optionally wrap in double quotes, curly braces, or remove hyphens.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-options-wrap" style="align-items: center;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label for="uuid-count" style="font-size: 0.85rem; font-weight: 600;">Quantity:</label>
          <input type="number" id="uuid-count" class="bu-input" value="5" min="1" max="100" style="width: 80px;">
        </div>
        <label class="bu-checkbox-label"><input type="checkbox" id="uuid-hyphens" checked> Include hyphens</label>
        <label class="bu-checkbox-label"><input type="checkbox" id="uuid-upper"> Uppercase</label>
        <label class="bu-checkbox-label"><input type="checkbox" id="uuid-quotes"> Wrap in quotes (" ")</label>
        <label class="bu-checkbox-label"><input type="checkbox" id="uuid-braces"> Wrap in braces ({ })</label>
      </div>
      <div class="bu-actions-bar" style="margin-bottom: 1.25rem;">
        <button type="button" id="btn-uuid-generate" class="bu-btn bu-btn-primary">Generate UUIDs</button>
        <button type="button" id="btn-uuid-copy" class="bu-btn">Copy All</button>
        <button type="button" id="btn-uuid-download" class="bu-btn">Download .txt</button>
      </div>
      <div class="bu-form-group">
        <label class="bu-form-label" for="uuid-output">Generated Identifiers</label>
        <textarea id="uuid-output" class="bu-textarea bu-textarea-mono" readonly style="min-height: 240px; font-size: 0.95rem;"></textarea>
      </div>
    `,
    renderScript: () => `
      const countInput = document.getElementById('uuid-count');
      const hyphensCheck = document.getElementById('uuid-hyphens');
      const upperCheck = document.getElementById('uuid-upper');
      const quotesCheck = document.getElementById('uuid-quotes');
      const bracesCheck = document.getElementById('uuid-braces');
      const genBtn = document.getElementById('btn-uuid-generate');
      const copyBtn = document.getElementById('btn-uuid-copy');
      const dlBtn = document.getElementById('btn-uuid-download');
      const output = document.getElementById('uuid-output');

      function generate() {
        const count = parseInt(countInput.value, 10) || 5;
        const list = window.MTV_BU.generateUUIDs(count, {
          uppercase: upperCheck.checked,
          hyphens: hyphensCheck.checked,
          quotes: quotesCheck.checked,
          braces: bracesCheck.checked
        });
        output.value = list.join('\\n');
      }

      genBtn.addEventListener('click', generate);
      [hyphensCheck, upperCheck, quotesCheck, bracesCheck].forEach(el => el.addEventListener('change', generate));

      copyBtn.addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(output.value, copyBtn);
      });

      dlBtn.addEventListener('click', () => {
        if (!output.value) return;
        window.MTV_BU.downloadFile(output.value, 'uuids.txt');
      });

      generate();
    `
  }
];

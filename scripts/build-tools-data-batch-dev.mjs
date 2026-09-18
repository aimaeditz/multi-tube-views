// 9 Developer & Data Format Converters for Browser Utilities
export const BATCH_DEV_TOOLS = [
  // 1. CSV to JSON Converter
  {
    id: 'csv-json-converter',
    categoryId: 'developer-utilities',
    name: 'CSV to JSON Converter',
    icon: '📊',
    title: 'CSV to JSON Converter — Convert CSV & TSV to Structured JSON Objects',
    description: 'Convert CSV (comma-separated), TSV (tab-separated), or custom delimited spreadsheet data into structured JSON objects or 2D arrays with automatic number/boolean type parsing, custom delimiters, and minify options.',
    keywords: 'csv to json converter, convert csv to json online, tsv to json, spreadsheet to json, csv parser, csv to json array',
    howToUse: [
      { step: '1', title: 'Paste or Upload CSV', desc: 'Paste your CSV/TSV table or click Load Sample.' },
      { step: '2', title: 'Select Options', desc: 'Choose delimiter (comma, tab, semicolon), header row toggle, and value parsing.' },
      { step: '3', title: 'Copy or Download JSON', desc: 'Copy the formatted JSON or download as a .json file.' }
    ],
    features: [
      { title: 'Multiple Delimiters', desc: 'Supports Comma (,), Tab (TSV), Semicolon (;), and Pipe (|).' },
      { title: 'Smart Type Casting', desc: 'Automatically parses numbers, booleans (true/false), and null values.' },
      { title: 'Array of Objects or Arrays', desc: 'Choose key-value records or flat tabular 2D arrays.' }
    ],
    sampleText: `id,name,role,active,salary\n1,Alex Rivera,Full Stack Engineer,true,120000\n2,Sam Chen,Product Designer,true,110000\n3,Taylor Swift,Audio Specialist,false,145000`,
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1.5rem; margin-bottom: 1.25rem;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="c2j-input" style="margin: 0;">CSV / TSV Input</label>
            <span id="c2j-input-stats" style="font-size: 0.8rem; color: var(--text-muted);">0 lines</span>
          </div>
          <textarea id="c2j-input" class="bu-textarea" style="height: 280px; font-family: monospace; font-size: 0.85rem;" placeholder="Paste CSV text here (e.g. id,name,role)..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="btn-c2j-sample" class="bu-btn bu-btn-subtle">Load Sample</button>
            <button type="button" id="btn-c2j-clear" class="bu-btn bu-btn-subtle">Clear</button>
            <label class="bu-btn bu-btn-subtle" style="cursor: pointer; margin: 0;">
              Upload CSV
              <input type="file" id="c2j-file" accept=".csv,.tsv,.txt" style="display: none;">
            </label>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="c2j-output" style="margin: 0;">JSON Output</label>
            <span id="c2j-output-stats" style="font-size: 0.8rem; color: var(--text-muted);">0 records</span>
          </div>
          <textarea id="c2j-output" class="bu-textarea" style="height: 280px; font-family: monospace; font-size: 0.85rem;" readonly placeholder="JSON output will appear here..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="btn-c2j-copy" class="bu-btn bu-btn-primary">📋 Copy JSON</button>
            <button type="button" id="btn-c2j-download" class="bu-btn bu-btn-subtle">⬇️ Download .json</button>
          </div>
        </div>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">Conversion Options</h3>
        <div class="bu-grid-3col" style="gap: 1rem;">
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="c2j-delimiter">Delimiter</label>
            <select id="c2j-delimiter" class="bu-input">
              <option value="auto" selected>Auto-detect</option>
              <option value=",">Comma (,)</option>
              <option value="&#9;">Tab (TSV)</option>
              <option value=";">Semicolon (;)</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="c2j-format">Output Structure</label>
            <select id="c2j-format" class="bu-input">
              <option value="objects" selected>Array of Objects [{}, {}]</option>
              <option value="arrays">2D Array of Rows [[], []]</option>
            </select>
          </div>
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="c2j-indent">Indentation</label>
            <select id="c2j-indent" class="bu-input">
              <option value="2" selected>2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="0">Minified (Compact)</option>
            </select>
          </div>
        </div>
        <div style="display: flex; gap: 1.5rem; margin-top: 1rem; flex-wrap: wrap;">
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; cursor: pointer;">
            <input type="checkbox" id="c2j-parse-types" checked> Parse Numbers &amp; Booleans
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; cursor: pointer;">
            <input type="checkbox" id="c2j-headers" checked> First Row Contains Column Headers
          </label>
        </div>
      </div>
    `,
    renderScript: () => `
      const inputEl = document.getElementById('c2j-input');
      const outputEl = document.getElementById('c2j-output');
      const inputStats = document.getElementById('c2j-input-stats');
      const outputStats = document.getElementById('c2j-output-stats');
      const delimSel = document.getElementById('c2j-delimiter');
      const formatSel = document.getElementById('c2j-format');
      const indentSel = document.getElementById('c2j-indent');
      const parseTypesCb = document.getElementById('c2j-parse-types');
      const headersCb = document.getElementById('c2j-headers');
      const sampleBtn = document.getElementById('btn-c2j-sample');
      const clearBtn = document.getElementById('btn-c2j-clear');
      const copyBtn = document.getElementById('btn-c2j-copy');
      const downloadBtn = document.getElementById('btn-c2j-download');
      const fileInput = document.getElementById('c2j-file');

      function parseCSVLine(line, delimiter) {
        const result = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"' || char === "'") {
            if (inQuotes && line[i + 1] === char) {
              cur += char;
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === delimiter && !inQuotes) {
            result.push(cur.trim());
            cur = '';
          } else {
            cur += char;
          }
        }
        result.push(cur.trim());
        return result;
      }

      function detectDelimiter(text) {
        const firstLine = text.split(/\\r?\\n/)[0] || '';
        const counts = {
          ',': (firstLine.match(/,/g) || []).length,
          '\\t': (firstLine.match(/\\t/g) || []).length,
          ';': (firstLine.match(/;/g) || []).length,
          '|': (firstLine.match(/\\|/g) || []).length
        };
        let best = ',';
        let max = -1;
        for (const [k, v] of Object.entries(counts)) {
          if (v > max) { max = v; best = k; }
        }
        return best;
      }

      function castValue(v, parseTypes) {
        if (!parseTypes) return v;
        if (v === '' || v === undefined) return null;
        if (v.toLowerCase() === 'true') return true;
        if (v.toLowerCase() === 'false') return false;
        if (v.toLowerCase() === 'null') return null;
        if (!isNaN(v) && v.trim() !== '') return Number(v);
        return v;
      }

      function convert() {
        const text = inputEl.value.trim();
        if (!text) {
          outputEl.value = '';
          inputStats.textContent = '0 lines';
          outputStats.textContent = '0 records';
          return;
        }

        const lines = text.split(/\\r?\\n/).filter(l => l.trim().length > 0);
        inputStats.textContent = \`\${lines.length} lines\`;

        let delimiter = delimSel.value;
        if (delimiter === 'auto') {
          delimiter = detectDelimiter(text);
        }

        const parseTypes = parseTypesCb.checked;
        const hasHeaders = headersCb.checked;
        const structure = formatSel.value;
        const indent = parseInt(indentSel.value, 10);

        try {
          const rows = lines.map(line => parseCSVLine(line, delimiter));
          let result;

          if (structure === 'arrays' || !hasHeaders) {
            result = rows.map(r => r.map(c => castValue(c, parseTypes)));
            outputStats.textContent = \`\${result.length} rows\`;
          } else {
            const headers = rows[0];
            result = rows.slice(1).map(r => {
              const obj = {};
              headers.forEach((h, idx) => {
                const key = h || \`col_\${idx + 1}\`;
                obj[key] = castValue(r[idx], parseTypes);
              });
              return obj;
            });
            outputStats.textContent = \`\${result.length} objects\`;
          }

          outputEl.value = indent === 0 ? JSON.stringify(result) : JSON.stringify(result, null, indent);
        } catch (err) {
          outputEl.value = \`Error converting CSV: \${err.message}\`;
        }
      }

      inputEl.addEventListener('input', convert);
      delimSel.addEventListener('change', convert);
      formatSel.addEventListener('change', convert);
      indentSel.addEventListener('change', convert);
      parseTypesCb.addEventListener('change', convert);
      headersCb.addEventListener('change', convert);

      sampleBtn.addEventListener('click', () => {
        inputEl.value = \`id,name,role,active,salary\\n1,Alex Rivera,Full Stack Engineer,true,120000\\n2,Sam Chen,Product Designer,true,110000\\n3,Taylor Swift,Audio Specialist,false,145000\\n4,Jordan Lee,DevOps Architect,true,135000\`;
        convert();
      });

      clearBtn.addEventListener('click', () => {
        inputEl.value = '';
        outputEl.value = '';
        convert();
      });

      copyBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        navigator.clipboard.writeText(outputEl.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy JSON', 2000);
      });

      downloadBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        const blob = new Blob([outputEl.value], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.json';
        a.click();
        URL.revokeObjectURL(url);
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          inputEl.value = evt.target.result;
          convert();
        };
        reader.readAsText(file);
      });

      sampleBtn.click();
    `
  },

  // 2. JSON to CSV Converter
  {
    id: 'json-csv-converter',
    categoryId: 'developer-utilities',
    name: 'JSON to CSV Converter',
    icon: '📑',
    title: 'JSON to CSV Converter — Transform JSON Arrays into Clean CSV/TSV Tables',
    description: 'Transform structured JSON objects or nested arrays into standard CSV or TSV spreadsheet format with custom delimiters, automatic quote escaping, and nested key flattening.',
    keywords: 'json to csv converter, json to excel, convert json to tsv, json to spreadsheet, json flatten to csv, export json to csv',
    howToUse: [
      { step: '1', title: 'Paste JSON Data', desc: 'Paste a JSON array of objects or single JSON structure.' },
      { step: '2', title: 'Configure Options', desc: 'Choose delimiter (comma, semicolon, tab), quote wrapping, and nested object flattening.' },
      { step: '3', title: 'Copy or Download CSV', desc: 'Copy output directly to clipboard or download as .csv for Excel and Google Sheets.' }
    ],
    features: [
      { title: 'Nested Object Flattening', desc: 'Automatically flattens deep nested keys (e.g. user.address.city) into dot notation headers.' },
      { title: 'Custom Delimiters', desc: 'Supports Comma (CSV), Tab (TSV), Semicolon (;), and Pipe (|).' },
      { title: 'Spreadsheet Ready', desc: 'Handles multi-line values, escaped quotes, and special characters.' }
    ],
    sampleText: `[\n  { "id": 1, "name": "Alex Rivera", "role": "Engineer", "skills": "React, Node", "salary": 120000 },\n  { "id": 2, "name": "Sam Chen", "role": "Designer", "skills": "Figma, UI", "salary": 110000 }\n]`,
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1.5rem; margin-bottom: 1.25rem;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="j2c-input" style="margin: 0;">JSON Input</label>
            <span id="j2c-input-stats" style="font-size: 0.8rem; color: var(--text-muted);">0 records</span>
          </div>
          <textarea id="j2c-input" class="bu-textarea" style="height: 280px; font-family: monospace; font-size: 0.85rem;" placeholder="Paste JSON array here..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="btn-j2c-sample" class="bu-btn bu-btn-subtle">Load Sample</button>
            <button type="button" id="btn-j2c-clear" class="bu-btn bu-btn-subtle">Clear</button>
            <label class="bu-btn bu-btn-subtle" style="cursor: pointer; margin: 0;">
              Upload JSON
              <input type="file" id="j2c-file" accept=".json,.txt" style="display: none;">
            </label>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="j2c-output" style="margin: 0;">CSV Output</label>
            <span id="j2c-output-stats" style="font-size: 0.8rem; color: var(--text-muted);">0 lines</span>
          </div>
          <textarea id="j2c-output" class="bu-textarea" style="height: 280px; font-family: monospace; font-size: 0.85rem;" readonly placeholder="CSV output will appear here..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="btn-j2c-copy" class="bu-btn bu-btn-primary">📋 Copy CSV</button>
            <button type="button" id="btn-j2c-download" class="bu-btn bu-btn-subtle">⬇️ Download .csv</button>
          </div>
        </div>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">Export Options</h3>
        <div class="bu-grid-3col" style="gap: 1rem;">
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="j2c-delimiter">Delimiter</label>
            <select id="j2c-delimiter" class="bu-input">
              <option value="," selected>Comma (,)</option>
              <option value="&#9;">Tab (TSV)</option>
              <option value=";">Semicolon (;)</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="j2c-quotes">Quote Wrapping</label>
            <select id="j2c-quotes" class="bu-input">
              <option value="needed" selected>Quotes only when needed</option>
              <option value="all">Quote all fields</option>
            </select>
          </div>
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin-top: 1.75rem;">
              <input type="checkbox" id="j2c-flatten" checked> Flatten Nested Objects
            </label>
          </div>
        </div>
      </div>
    `,
    renderScript: () => `
      const inputEl = document.getElementById('j2c-input');
      const outputEl = document.getElementById('j2c-output');
      const inputStats = document.getElementById('j2c-input-stats');
      const outputStats = document.getElementById('j2c-output-stats');
      const delimSel = document.getElementById('j2c-delimiter');
      const quotesSel = document.getElementById('j2c-quotes');
      const flattenCb = document.getElementById('j2c-flatten');
      const sampleBtn = document.getElementById('btn-j2c-sample');
      const clearBtn = document.getElementById('btn-j2c-clear');
      const copyBtn = document.getElementById('btn-j2c-copy');
      const downloadBtn = document.getElementById('btn-j2c-download');
      const fileInput = document.getElementById('j2c-file');

      function flattenObject(obj, prefix = '') {
        const res = {};
        for (const key in obj) {
          if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
          const pre = prefix.length ? prefix + '.' : '';
          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(res, flattenObject(obj[key], pre + key));
          } else {
            res[pre + key] = Array.isArray(obj[key]) ? JSON.stringify(obj[key]) : obj[key];
          }
        }
        return res;
      }

      function escapeCSV(val, delimiter, quoteAll) {
        if (val === null || val === undefined) return '';
        const str = String(val);
        const needsQuote = quoteAll || str.includes(delimiter) || str.includes('"') || str.includes('\\n') || str.includes('\\r');
        if (needsQuote) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      }

      function convert() {
        const text = inputEl.value.trim();
        if (!text) {
          outputEl.value = '';
          inputStats.textContent = '0 records';
          outputStats.textContent = '0 lines';
          return;
        }

        try {
          let data = JSON.parse(text);
          if (!Array.isArray(data)) {
            data = [data];
          }

          inputStats.textContent = \`\${data.length} records\`;

          const shouldFlatten = flattenCb.checked;
          const processed = shouldFlatten ? data.map(item => flattenObject(item)) : data;

          // Collect all unique headers
          const headers = [];
          processed.forEach(item => {
            if (typeof item === 'object' && item !== null) {
              Object.keys(item).forEach(k => {
                if (!headers.includes(k)) headers.push(k);
              });
            }
          });

          const delimiter = delimSel.value;
          const quoteAll = quotesSel.value === 'all';

          const csvRows = [];
          // Header row
          csvRows.push(headers.map(h => escapeCSV(h, delimiter, quoteAll)).join(delimiter));

          // Data rows
          processed.forEach(item => {
            const row = headers.map(h => escapeCSV(item[h], delimiter, quoteAll));
            csvRows.push(row.join(delimiter));
          });

          const finalCSV = csvRows.join('\\n');
          outputEl.value = finalCSV;
          outputStats.textContent = \`\${csvRows.length} lines\`;
        } catch (err) {
          outputEl.value = \`Error parsing JSON: \${err.message}\`;
        }
      }

      inputEl.addEventListener('input', convert);
      delimSel.addEventListener('change', convert);
      quotesSel.addEventListener('change', convert);
      flattenCb.addEventListener('change', convert);

      sampleBtn.addEventListener('click', () => {
        inputEl.value = JSON.stringify([
          { id: 1, name: 'Alex Rivera', role: 'Full Stack Engineer', active: true, salary: 120000, location: { city: 'San Francisco', remote: true } },
          { id: 2, name: 'Sam Chen', role: 'Product Designer', active: true, salary: 110000, location: { city: 'New York', remote: false } },
          { id: 3, name: 'Taylor Swift', role: 'Audio Specialist', active: false, salary: 145000, location: { city: 'Nashville', remote: true } }
        ], null, 2);
        convert();
      });

      clearBtn.addEventListener('click', () => {
        inputEl.value = '';
        outputEl.value = '';
        convert();
      });

      copyBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        navigator.clipboard.writeText(outputEl.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy CSV', 2000);
      });

      downloadBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        const blob = new Blob([outputEl.value], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.csv';
        a.click();
        URL.revokeObjectURL(url);
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          inputEl.value = evt.target.result;
          convert();
        };
        reader.readAsText(file);
      });

      sampleBtn.click();
    `
  },

  // 3. JSON to YAML Converter
  {
    id: 'json-to-yaml-converter',
    categoryId: 'developer-utilities',
    name: 'JSON to YAML Converter',
    icon: '📜',
    title: 'JSON to YAML Converter — Convert JSON Configurations to Clean YAML',
    description: 'Convert JSON configurations, Swagger API specs, and package manifests into clean, human-readable YAML with proper indentation, arrays, nested maps, and scalar type formatting.',
    keywords: 'json to yaml converter, convert json to yaml online, json to yml, yaml formatter, swagger json to yaml, docker compose converter',
    howToUse: [
      { step: '1', title: 'Paste JSON Input', desc: 'Paste your JSON data into the editor or click Load Sample.' },
      { step: '2', title: 'Configure Indentation', desc: 'Choose 2 or 4 spaces indentation.' },
      { step: '3', title: 'Copy or Download YAML', desc: 'Copy YAML directly or download as a .yaml file.' }
    ],
    features: [
      { title: 'Clean YAML Syntax', desc: 'Handles nested objects, arrays, strings, booleans, and null values without extraneous quotes.' },
      { title: 'Instant Live Conversion', desc: 'Real-time conversion on every keystroke with syntax error reporting.' },
      { title: 'Offline Client-side', desc: 'Your configuration data never leaves your browser.' }
    ],
    sampleText: `{\n  "version": "3.8",\n  "services": {\n    "web": {\n      "image": "nginx:alpine",\n      "ports": ["80:80", "443:443"],\n      "environment": {\n        "NODE_ENV": "production"\n      }\n    }\n  }\n}`,
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1.5rem; margin-bottom: 1.25rem;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="j2y-input" style="margin: 0;">JSON Input</label>
            <span id="j2y-input-stats" style="font-size: 0.8rem; color: var(--text-muted);">Valid JSON</span>
          </div>
          <textarea id="j2y-input" class="bu-textarea" style="height: 300px; font-family: monospace; font-size: 0.85rem;" placeholder="Paste JSON here..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="btn-j2y-sample" class="bu-btn bu-btn-subtle">Load Docker Sample</button>
            <button type="button" id="btn-j2y-clear" class="bu-btn bu-btn-subtle">Clear</button>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="j2y-output" style="margin: 0;">YAML Output</label>
            <span id="j2y-output-stats" style="font-size: 0.8rem; color: var(--text-muted);">YAML format</span>
          </div>
          <textarea id="j2y-output" class="bu-textarea" style="height: 300px; font-family: monospace; font-size: 0.85rem;" readonly placeholder="YAML output will appear here..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="btn-j2y-copy" class="bu-btn bu-btn-primary">📋 Copy YAML</button>
            <button type="button" id="btn-j2y-download" class="bu-btn bu-btn-subtle">⬇️ Download .yaml</button>
          </div>
        </div>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">YAML Formatting Settings</h3>
        <div class="bu-grid-2col" style="gap: 1rem;">
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="j2y-indent">Indentation Level</label>
            <select id="j2y-indent" class="bu-input">
              <option value="2" selected>2 Spaces (Standard YAML)</option>
              <option value="4">4 Spaces</option>
            </select>
          </div>
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin-top: 1.75rem;">
              <input type="checkbox" id="j2y-sort" checked> Sort Object Keys Alphabetically
            </label>
          </div>
        </div>
      </div>
    `,
    renderScript: () => `
      const inputEl = document.getElementById('j2y-input');
      const outputEl = document.getElementById('j2y-output');
      const inputStats = document.getElementById('j2y-input-stats');
      const indentSel = document.getElementById('j2y-indent');
      const sortCb = document.getElementById('j2y-sort');
      const sampleBtn = document.getElementById('btn-j2y-sample');
      const clearBtn = document.getElementById('btn-j2y-clear');
      const copyBtn = document.getElementById('btn-j2y-copy');
      const downloadBtn = document.getElementById('btn-j2y-download');

      function jsonToYaml(obj, indent = 2, level = 0, sortKeys = false) {
        const spaces = ' '.repeat(level * indent);
        if (obj === null || obj === undefined) return 'null';
        if (typeof obj === 'boolean' || typeof obj === 'number') return String(obj);
        if (typeof obj === 'string') {
          if (obj.includes('\\n')) {
            const lines = obj.split('\\n').map(l => spaces + ' '.repeat(indent) + l).join('\\n');
            return '|\\n' + lines;
          }
          const specialChars = [':', '#', '{', '}', '[', ']', ',', '&', '*', '?', '|', '<', '>', '=', '!', '%', '@', String.fromCharCode(96)];
          if (specialChars.some(c => obj.includes(c)) || obj.trim() !== obj || (!isNaN(Number(obj)) && obj.trim() !== '') || obj === 'true' || obj === 'false' || obj === 'null') {
            return JSON.stringify(obj);
          }
          return obj;
        }

        if (Array.isArray(obj)) {
          if (obj.length === 0) return '[]';
          return obj.map(item => {
            if (typeof item === 'object' && item !== null) {
              const subYaml = jsonToYaml(item, indent, level + 1, sortKeys);
              const trimmed = subYaml.trimStart();
              return \`\${spaces}- \${trimmed}\`;
            }
            return \`\${spaces}- \${jsonToYaml(item, indent, level + 1, sortKeys)}\`;
          }).join('\\n');
        }

        if (typeof obj === 'object') {
          let keys = Object.keys(obj);
          if (keys.length === 0) return '{}';
          if (sortKeys) keys.sort();
          return keys.map(key => {
            const val = obj[key];
            if (typeof val === 'object' && val !== null && (Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0)) {
              return \`\${spaces}\${key}:\\n\${jsonToYaml(val, indent, level + 1, sortKeys)}\`;
            }
            return \`\${spaces}\${key}: \${jsonToYaml(val, indent, level + 1, sortKeys)}\`;
          }).join('\\n');
        }

        return String(obj);
      }

      function convert() {
        const text = inputEl.value.trim();
        if (!text) {
          outputEl.value = '';
          inputStats.textContent = 'Empty';
          return;
        }

        try {
          const parsed = JSON.parse(text);
          inputStats.textContent = '✅ Valid JSON';
          inputStats.style.color = 'var(--text-success, #10b981)';

          const indent = parseInt(indentSel.value, 10) || 2;
          const sortKeys = sortCb.checked;
          outputEl.value = jsonToYaml(parsed, indent, 0, sortKeys);
        } catch (err) {
          inputStats.textContent = '❌ Invalid JSON';
          inputStats.style.color = '#ef4444';
          outputEl.value = \`Error parsing JSON: \${err.message}\`;
        }
      }

      inputEl.addEventListener('input', convert);
      indentSel.addEventListener('change', convert);
      sortCb.addEventListener('change', convert);

      sampleBtn.addEventListener('click', () => {
        inputEl.value = JSON.stringify({
          version: '3.8',
          services: {
            app: {
              image: 'node:18-alpine',
              restart: 'always',
              ports: ['3000:3000'],
              environment: {
                NODE_ENV: 'production',
                PORT: 3000
              },
              volumes: ['./data:/app/data']
            },
            database: {
              image: 'postgres:15',
              environment: {
                POSTGRES_DB: 'app_db',
                POSTGRES_PASSWORD: 'secretpassword'
              }
            }
          }
        }, null, 2);
        convert();
      });

      clearBtn.addEventListener('click', () => {
        inputEl.value = '';
        outputEl.value = '';
        convert();
      });

      copyBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        navigator.clipboard.writeText(outputEl.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy YAML', 2000);
      });

      downloadBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        const blob = new Blob([outputEl.value], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.yaml';
        a.click();
        URL.revokeObjectURL(url);
      });

      sampleBtn.click();
    `
  },

  // 4. YAML to JSON Converter
  {
    id: 'yaml-to-json-converter',
    categoryId: 'developer-utilities',
    name: 'YAML to JSON Converter',
    icon: '⚙️',
    title: 'YAML to JSON Converter — Parse YAML Manifests into Clean Formatted JSON',
    description: 'Parse YAML specifications, Kubernetes manifests, GitHub Actions workflows, and CI/CD configs into clean, valid, formatted JSON with customizable indentation and minification.',
    keywords: 'yaml to json converter, convert yaml to json online, yml to json, parse kubernetes yaml to json, yaml parser online',
    howToUse: [
      { step: '1', title: 'Paste YAML Manifest', desc: 'Paste your YAML text into the left input or click Load Sample.' },
      { step: '2', title: 'Choose JSON Format', desc: 'Select 2 spaces, 4 spaces, or minified JSON output.' },
      { step: '3', title: 'Copy or Download JSON', desc: 'Copy formatted JSON or download directly as a .json file.' }
    ],
    features: [
      { title: 'Full Scalar Parsing', desc: 'Supports strings, numbers, booleans, arrays (- item), and nested key-value objects.' },
      { title: 'Comment Stripping', desc: 'Automatically cleans out YAML comments (#) during parsing.' },
      { title: 'Strict Validation', desc: 'Validates YAML syntax and highlights indentation issues.' }
    ],
    sampleText: `apiVersion: v1\nkind: Pod\nmetadata:\n  name: nginx-pod\n  labels:\n    app: web\nspec:\n  containers:\n  - name: nginx\n    image: nginx:latest\n    ports:\n    - containerPort: 80`,
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1.5rem; margin-bottom: 1.25rem;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="y2j-input" style="margin: 0;">YAML Input</label>
            <span id="y2j-input-stats" style="font-size: 0.8rem; color: var(--text-muted);">YAML text</span>
          </div>
          <textarea id="y2j-input" class="bu-textarea" style="height: 300px; font-family: monospace; font-size: 0.85rem;" placeholder="Paste YAML here..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="btn-y2j-sample" class="bu-btn bu-btn-subtle">Load K8s Sample</button>
            <button type="button" id="btn-y2j-clear" class="bu-btn bu-btn-subtle">Clear</button>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="y2j-output" style="margin: 0;">JSON Output</label>
            <span id="y2j-output-stats" style="font-size: 0.8rem; color: var(--text-muted);">JSON format</span>
          </div>
          <textarea id="y2j-output" class="bu-textarea" style="height: 300px; font-family: monospace; font-size: 0.85rem;" readonly placeholder="JSON output will appear here..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="btn-y2j-copy" class="bu-btn bu-btn-primary">📋 Copy JSON</button>
            <button type="button" id="btn-y2j-download" class="bu-btn bu-btn-subtle">⬇️ Download .json</button>
          </div>
        </div>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">JSON Output Settings</h3>
        <div class="bu-grid-2col" style="gap: 1rem;">
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="y2j-indent">Indentation</label>
            <select id="y2j-indent" class="bu-input">
              <option value="2" selected>2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="0">Minified (Compact single line)</option>
            </select>
          </div>
        </div>
      </div>
    `,
    renderScript: () => `
      const inputEl = document.getElementById('y2j-input');
      const outputEl = document.getElementById('y2j-output');
      const inputStats = document.getElementById('y2j-input-stats');
      const indentSel = document.getElementById('y2j-indent');
      const sampleBtn = document.getElementById('btn-y2j-sample');
      const clearBtn = document.getElementById('btn-y2j-clear');
      const copyBtn = document.getElementById('btn-y2j-copy');
      const downloadBtn = document.getElementById('btn-y2j-download');

      function parseScalar(val) {
        val = val.trim();
        if (val === '' || val === '~' || val === 'null') return null;
        if (val === 'true' || val === 'True' || val === 'TRUE') return true;
        if (val === 'false' || val === 'False' || val === 'FALSE') return false;
        if (!isNaN(val) && !val.startsWith('0x') && val !== '') return Number(val);
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          return val.slice(1, -1);
        }
        if (val.startsWith('[') && val.endsWith(']')) {
          try { return JSON.parse(val); } catch(e) {}
        }
        return val;
      }

      function parseYaml(yamlText) {
        const lines = yamlText.split(/\\r?\\n/).filter(l => {
          const t = l.trim();
          return t.length > 0 && !t.startsWith('#');
        });

        if (lines.length === 0) return {};

        function parseBlock(startIdx, minIndent) {
          const rootObj = {};
          let rootArr = null;
          let i = startIdx;

          while (i < lines.length) {
            const rawLine = lines[i];
            const indentMatch = rawLine.match(/^\\s*/);
            const indent = indentMatch ? indentMatch[0].length : 0;
            if (indent < minIndent) break;

            const line = rawLine.trim();

            if (line.startsWith('- ')) {
              if (!rootArr) rootArr = [];
              const itemContent = line.slice(2).trim();
              if (itemContent.includes(': ') && !itemContent.startsWith('{')) {
                // Nested object in array
                const colonIdx = itemContent.indexOf(': ');
                const k = itemContent.slice(0, colonIdx).trim();
                const vStr = itemContent.slice(colonIdx + 2).trim();
                const itemObj = {};
                if (vStr === '') {
                  const [child, nextI] = parseBlock(i + 1, indent + 2);
                  itemObj[k] = child;
                  i = nextI;
                } else {
                  itemObj[k] = parseScalar(vStr);
                  i++;
                }
                rootArr.push(itemObj);
              } else if (itemContent === '') {
                const [child, nextI] = parseBlock(i + 1, indent + 2);
                rootArr.push(child);
                i = nextI;
              } else {
                rootArr.push(parseScalar(itemContent));
                i++;
              }
            } else if (line.includes(':')) {
              const colonIdx = line.indexOf(':');
              const key = line.slice(0, colonIdx).trim();
              const valStr = line.slice(colonIdx + 1).trim();

              if (valStr === '') {
                const [child, nextI] = parseBlock(i + 1, indent + 1);
                rootObj[key] = child;
                i = nextI;
              } else {
                rootObj[key] = parseScalar(valStr);
                i++;
              }
            } else {
              i++;
            }
          }

          return [rootArr !== null ? rootArr : rootObj, i];
        }

        const [result] = parseBlock(0, 0);
        return result;
      }

      function convert() {
        const text = inputEl.value.trim();
        if (!text) {
          outputEl.value = '';
          inputStats.textContent = 'Empty';
          return;
        }

        try {
          const parsed = parseYaml(text);
          inputStats.textContent = '✅ Parsed YAML';
          inputStats.style.color = 'var(--text-success, #10b981)';

          const indent = parseInt(indentSel.value, 10);
          outputEl.value = indent === 0 ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent);
        } catch (err) {
          inputStats.textContent = '❌ YAML Error';
          inputStats.style.color = '#ef4444';
          outputEl.value = \`Error parsing YAML: \${err.message}\`;
        }
      }

      inputEl.addEventListener('input', convert);
      indentSel.addEventListener('change', convert);

      sampleBtn.addEventListener('click', () => {
        inputEl.value = 'apiVersion: apps/v1\\nkind: Deployment\\nmetadata:\\n  name: web-app\\n  labels:\\n    tier: frontend\\nspec:\\n  replicas: 3\\n  selector:\\n    matchLabels:\\n      app: nginx\\n  template:\\n    metadata:\\n      labels:\\n        app: nginx\\n    spec:\\n      containers:\\n      - name: nginx\\n        image: nginx:1.21\\n        ports:\\n        - containerPort: 80';
        convert();
      });

      clearBtn.addEventListener('click', () => {
        inputEl.value = '';
        outputEl.value = '';
        convert();
      });

      copyBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        navigator.clipboard.writeText(outputEl.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy JSON', 2000);
      });

      downloadBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        const blob = new Blob([outputEl.value], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.json';
        a.click();
        URL.revokeObjectURL(url);
      });

      sampleBtn.click();
    `
  },

  // 5. JSON to XML Converter
  {
    id: 'json-to-xml-converter',
    categoryId: 'developer-utilities',
    name: 'JSON to XML Converter',
    icon: '🌐',
    title: 'JSON to XML Converter — Transform JSON into Clean, Formatted XML',
    description: 'Convert JSON documents, API payloads, and objects into valid, well-formed XML with customizable root tags, array item tags, XML declarations, and indentation formatting.',
    keywords: 'json to xml converter, convert json to xml online, json to xml tree, json2xml, rest to soap converter, format xml',
    howToUse: [
      { step: '1', title: 'Paste JSON Document', desc: 'Paste your JSON object or array.' },
      { step: '2', title: 'Configure Tags', desc: 'Set your preferred root wrapper tag and item tag for arrays.' },
      { step: '3', title: 'Copy or Download XML', desc: 'Copy clean XML or download as an .xml file.' }
    ],
    features: [
      { title: 'Customizable Root & Item Tags', desc: 'Specify custom tags (e.g. <root>, <item>, <user>, <product>).' },
      { title: 'XML Declaration Support', desc: 'Includes <?xml version="1.0" encoding="UTF-8"?> header.' },
      { title: 'Special Character Escaping', desc: 'Safely escapes &, <, >, ", and apostrophes into XML entities.' }
    ],
    sampleText: `{\n  "company": "Acme Corp",\n  "employees": [\n    { "id": 1, "name": "Alice", "role": "Dev" },\n    { "id": 2, "name": "Bob", "role": "Design" }\n  ]\n}`,
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1.5rem; margin-bottom: 1.25rem;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="j2x-input" style="margin: 0;">JSON Input</label>
            <span id="j2x-input-stats" style="font-size: 0.8rem; color: var(--text-muted);">JSON Data</span>
          </div>
          <textarea id="j2x-input" class="bu-textarea" style="height: 280px; font-family: monospace; font-size: 0.85rem;" placeholder="Paste JSON here..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="btn-j2x-sample" class="bu-btn bu-btn-subtle">Load Sample</button>
            <button type="button" id="btn-j2x-clear" class="bu-btn bu-btn-subtle">Clear</button>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="j2x-output" style="margin: 0;">XML Output</label>
            <span id="j2x-output-stats" style="font-size: 0.8rem; color: var(--text-muted);">XML Format</span>
          </div>
          <textarea id="j2x-output" class="bu-textarea" style="height: 280px; font-family: monospace; font-size: 0.85rem;" readonly placeholder="XML will appear here..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="btn-j2x-copy" class="bu-btn bu-btn-primary">📋 Copy XML</button>
            <button type="button" id="btn-j2x-download" class="bu-btn bu-btn-subtle">⬇️ Download .xml</button>
          </div>
        </div>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">XML Structure Configuration</h3>
        <div class="bu-grid-3col" style="gap: 1rem;">
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="j2x-root">Root Tag Name</label>
            <input type="text" id="j2x-root" class="bu-input" value="root">
          </div>
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="j2x-item">Array Item Tag</label>
            <input type="text" id="j2x-item" class="bu-input" value="item">
          </div>
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="j2x-indent">Indentation</label>
            <select id="j2x-indent" class="bu-input">
              <option value="2" selected>2 Spaces</option>
              <option value="4">4 Spaces</option>
            </select>
          </div>
        </div>
        <div style="margin-top: 1rem;">
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; cursor: pointer;">
            <input type="checkbox" id="j2x-decl" checked> Include &lt;?xml version="1.0" encoding="UTF-8"?&gt; Declaration
          </label>
        </div>
      </div>
    `,
    renderScript: () => `
      const inputEl = document.getElementById('j2x-input');
      const outputEl = document.getElementById('j2x-output');
      const rootTagInput = document.getElementById('j2x-root');
      const itemTagInput = document.getElementById('j2x-item');
      const indentSel = document.getElementById('j2x-indent');
      const declCb = document.getElementById('j2x-decl');
      const sampleBtn = document.getElementById('btn-j2x-sample');
      const clearBtn = document.getElementById('btn-j2x-clear');
      const copyBtn = document.getElementById('btn-j2x-copy');
      const downloadBtn = document.getElementById('btn-j2x-download');

      function escapeXml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      }

      function sanitizeTag(tag) {
        return tag.replace(/[^a-zA-Z0-9_-]/g, '_') || 'item';
      }

      function toXml(obj, tag, indentSpaces, level, itemTag) {
        const spaces = ' '.repeat(level * indentSpaces);
        tag = sanitizeTag(tag);

        if (obj === null || obj === undefined) {
          return \`\${spaces}<\${tag}/>\`;
        }

        if (typeof obj === 'boolean' || typeof obj === 'number' || typeof obj === 'string') {
          return \`\${spaces}<\${tag}>\${escapeXml(obj)}</\${tag}>\`;
        }

        if (Array.isArray(obj)) {
          return obj.map(item => toXml(item, tag, indentSpaces, level, itemTag)).join('\\n');
        }

        if (typeof obj === 'object') {
          const keys = Object.keys(obj);
          if (keys.length === 0) return \`\${spaces}<\${tag}/>\`;

          const inner = keys.map(k => {
            const val = obj[k];
            if (Array.isArray(val)) {
              return val.map(it => toXml(it, k, indentSpaces, level + 1, itemTag)).join('\\n');
            }
            return toXml(val, k, indentSpaces, level + 1, itemTag);
          }).join('\\n');

          return \`\${spaces}<\${tag}>\\n\${inner}\\n\${spaces}</\${tag}>\`;
        }

        return \`\${spaces}<\${tag}>\${escapeXml(String(obj))}</\${tag}>\`;
      }

      function convert() {
        const text = inputEl.value.trim();
        if (!text) {
          outputEl.value = '';
          return;
        }

        try {
          const parsed = JSON.parse(text);
          const rootTag = rootTagInput.value.trim() || 'root';
          const itemTag = itemTagInput.value.trim() || 'item';
          const indent = parseInt(indentSel.value, 10) || 2;
          const incDecl = declCb.checked;

          let xml = '';
          if (incDecl) xml += '<?xml version="1.0" encoding="UTF-8"?>\\n';

          if (Array.isArray(parsed)) {
            const inner = parsed.map(item => toXml(item, itemTag, indent, 1, itemTag)).join('\\n');
            xml += \`<\${rootTag}>\\n\${inner}\\n</\${rootTag}>\`;
          } else {
            xml += toXml(parsed, rootTag, indent, 0, itemTag);
          }

          outputEl.value = xml;
        } catch (err) {
          outputEl.value = \`Error converting JSON to XML: \${err.message}\`;
        }
      }

      inputEl.addEventListener('input', convert);
      rootTagInput.addEventListener('input', convert);
      itemTagInput.addEventListener('input', convert);
      indentSel.addEventListener('change', convert);
      declCb.addEventListener('change', convert);

      sampleBtn.addEventListener('click', () => {
        inputEl.value = JSON.stringify({
          catalog: {
            title: 'Developer Bookstore',
            books: [
              { id: 101, title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', price: 44.99 },
              { id: 102, title: 'Clean Architecture', author: 'Robert C. Martin', price: 37.50 }
            ]
          }
        }, null, 2);
        convert();
      });

      clearBtn.addEventListener('click', () => {
        inputEl.value = '';
        outputEl.value = '';
        convert();
      });

      copyBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        navigator.clipboard.writeText(outputEl.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy XML', 2000);
      });

      downloadBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        const blob = new Blob([outputEl.value], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.xml';
        a.click();
        URL.revokeObjectURL(url);
      });

      sampleBtn.click();
    `
  },

  // 6. XML to JSON Converter
  {
    id: 'xml-to-json-converter',
    categoryId: 'developer-utilities',
    name: 'XML to JSON Converter',
    icon: '📦',
    title: 'XML to JSON Converter — Parse XML, RSS & SOAP into Clean JSON',
    description: 'Parse XML documents, RSS news feeds, SVG structures, and SOAP payloads into clean JSON objects with automatic type conversion and attribute preservation.',
    keywords: 'xml to json converter, convert xml to json online, xml parser to json, parse rss to json, soap to json, xml2json',
    howToUse: [
      { step: '1', title: 'Paste XML Code', desc: 'Paste your XML document into the left textarea or click Load Sample.' },
      { step: '2', title: 'Select Formatting', desc: 'Pick 2 spaces or 4 spaces indentation.' },
      { step: '3', title: 'Copy or Download JSON', desc: 'Copy clean JSON objects directly.' }
    ],
    features: [
      { title: 'DOMParser Engine', desc: 'Uses standard native browser XML parser for 100% compliant XML/XHTML interpretation.' },
      { title: 'Auto Array Normalization', desc: 'Groups sibling elements with identical tag names into structured JSON arrays.' },
      { title: 'Attribute Support', desc: 'Preserves XML attributes prefixed with @ or merged directly.' }
    ],
    sampleText: `<catalog>\n  <book id="101">\n    <title>Designing Data-Intensive Applications</title>\n    <author>Martin Kleppmann</author>\n    <price>44.99</price>\n  </book>\n</catalog>`,
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1.5rem; margin-bottom: 1.25rem;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="x2j-input" style="margin: 0;">XML Input</label>
            <span id="x2j-input-stats" style="font-size: 0.8rem; color: var(--text-muted);">XML Document</span>
          </div>
          <textarea id="x2j-input" class="bu-textarea" style="height: 280px; font-family: monospace; font-size: 0.85rem;" placeholder="Paste XML document here..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="btn-x2j-sample" class="bu-btn bu-btn-subtle">Load RSS Sample</button>
            <button type="button" id="btn-x2j-clear" class="bu-btn bu-btn-subtle">Clear</button>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="x2j-output" style="margin: 0;">JSON Output</label>
            <span id="x2j-output-stats" style="font-size: 0.8rem; color: var(--text-muted);">JSON Format</span>
          </div>
          <textarea id="x2j-output" class="bu-textarea" style="height: 280px; font-family: monospace; font-size: 0.85rem;" readonly placeholder="JSON will appear here..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="btn-x2j-copy" class="bu-btn bu-btn-primary">📋 Copy JSON</button>
            <button type="button" id="btn-x2j-download" class="bu-btn bu-btn-subtle">⬇️ Download .json</button>
          </div>
        </div>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">Parser Options</h3>
        <div class="bu-grid-2col" style="gap: 1rem;">
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="x2j-indent">Indentation</label>
            <select id="x2j-indent" class="bu-input">
              <option value="2" selected>2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="0">Minified</option>
            </select>
          </div>
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin-top: 1.75rem;">
              <input type="checkbox" id="x2j-cast" checked> Auto-cast Numbers &amp; Booleans
            </label>
          </div>
        </div>
      </div>
    `,
    renderScript: () => `
      const inputEl = document.getElementById('x2j-input');
      const outputEl = document.getElementById('x2j-output');
      const inputStats = document.getElementById('x2j-input-stats');
      const indentSel = document.getElementById('x2j-indent');
      const castCb = document.getElementById('x2j-cast');
      const sampleBtn = document.getElementById('btn-x2j-sample');
      const clearBtn = document.getElementById('btn-x2j-clear');
      const copyBtn = document.getElementById('btn-x2j-copy');
      const downloadBtn = document.getElementById('btn-x2j-download');

      function castVal(str, shouldCast) {
        if (!shouldCast) return str;
        if (str === 'true') return true;
        if (str === 'false') return false;
        if (!isNaN(str) && str.trim() !== '') return Number(str);
        return str;
      }

      function xmlNodeToObj(node, shouldCast) {
        if (node.nodeType === 3) {
          const t = node.nodeValue.trim();
          return t ? castVal(t, shouldCast) : null;
        }

        const obj = {};

        // Attributes
        if (node.attributes && node.attributes.length > 0) {
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            obj['@' + attr.name] = castVal(attr.value, shouldCast);
          }
        }

        // Child elements
        if (node.childNodes && node.childNodes.length > 0) {
          const childElements = Array.from(node.childNodes).filter(n => n.nodeType === 1);
          const textNodes = Array.from(node.childNodes).filter(n => n.nodeType === 3 && n.nodeValue.trim());

          if (childElements.length === 0 && textNodes.length > 0) {
            const textContent = textNodes.map(n => n.nodeValue.trim()).join(' ');
            if (Object.keys(obj).length === 0) {
              return castVal(textContent, shouldCast);
            } else {
              obj['#text'] = castVal(textContent, shouldCast);
              return obj;
            }
          }

          childElements.forEach(child => {
            const key = child.nodeName;
            const childObj = xmlNodeToObj(child, shouldCast);
            if (obj[key]) {
              if (!Array.isArray(obj[key])) {
                obj[key] = [obj[key]];
              }
              obj[key].push(childObj);
            } else {
              obj[key] = childObj;
            }
          });
        }

        return obj;
      }

      function convert() {
        const text = inputEl.value.trim();
        if (!text) {
          outputEl.value = '';
          inputStats.textContent = 'Empty';
          return;
        }

        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, 'text/xml');
          const parseError = xmlDoc.querySelector('parsererror');

          if (parseError) {
            inputStats.textContent = '❌ Invalid XML';
            inputStats.style.color = '#ef4444';
            outputEl.value = \`XML Parsing Error: \${parseError.textContent}\`;
            return;
          }

          inputStats.textContent = '✅ Valid XML';
          inputStats.style.color = 'var(--text-success, #10b981)';

          const shouldCast = castCb.checked;
          const rootNode = xmlDoc.documentElement;
          const rootObj = {};
          rootObj[rootNode.nodeName] = xmlNodeToObj(rootNode, shouldCast);

          const indent = parseInt(indentSel.value, 10);
          outputEl.value = indent === 0 ? JSON.stringify(rootObj) : JSON.stringify(rootObj, null, indent);
        } catch (err) {
          outputEl.value = \`Error: \${err.message}\`;
        }
      }

      inputEl.addEventListener('input', convert);
      indentSel.addEventListener('change', convert);
      castCb.addEventListener('change', convert);

      sampleBtn.addEventListener('click', () => {
        inputEl.value = '<?xml version="1.0" encoding="UTF-8"?>\\n<rss version="2.0">\\n  <channel>\\n    <title>Tech News Feed</title>\\n    <link>https://example.com</link>\\n    <description>Latest technology headlines</description>\\n    <item>\\n      <title>Next-Gen Web Standards Released</title>\\n      <pubDate>Fri, 18 Sep 2026 09:00:00 GMT</pubDate>\\n      <views>15420</views>\\n    </item>\\n    <item>\\n      <title>TypeScript 6.0 Features Announced</title>\\n      <pubDate>Thu, 17 Sep 2026 14:30:00 GMT</pubDate>\\n      <views>28900</views>\\n    </item>\\n  </channel>\\n</rss>';
        convert();
      });

      clearBtn.addEventListener('click', () => {
        inputEl.value = '';
        outputEl.value = '';
        convert();
      });

      copyBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        navigator.clipboard.writeText(outputEl.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy JSON', 2000);
      });

      downloadBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        const blob = new Blob([outputEl.value], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.json';
        a.click();
        URL.revokeObjectURL(url);
      });

      sampleBtn.click();
    `
  },

  // 7. Hex to Text Converter
  {
    id: 'hex-to-text-converter',
    categoryId: 'developer-utilities',
    name: 'Hex to Text Converter',
    icon: '🔤',
    title: 'Hex to Text Converter — Decode Hexadecimal Strings to Plain Text',
    description: 'Decode hexadecimal byte strings into readable UTF-8, ASCII, or Unicode plain text with automatic delimiter detection (spaces, colons, 0x prefixes, and \\x escape codes).',
    keywords: 'hex to text converter, decode hex to string, hexadecimal to ascii, hex decoder online, 0x to text, hex string translator',
    howToUse: [
      { step: '1', title: 'Paste Hex Code', desc: 'Paste your hex string (e.g. 48 65 6c 6c 6f or 0x480x65).' },
      { step: '2', title: 'Auto Decoding', desc: 'The tool automatically detects delimiters and decodes to UTF-8 text.' },
      { step: '3', title: 'Copy or Download', desc: 'Copy the decoded text with a single click.' }
    ],
    features: [
      { title: 'Flexible Hex Formats', desc: 'Supports space-separated, 0x prefix, \\x escape, colon (48:65), and continuous (48656c...) hex.' },
      { title: 'Full UTF-8 & Emoji Support', desc: 'Properly decodes multi-byte Unicode characters, non-Latin alphabets, and emojis.' },
      { title: 'Character & Byte Stats', desc: 'Displays decoded character count and raw byte length.' }
    ],
    sampleText: '48 65 6c 6c 6f 2c 20 57 6f 72 6c 64 21 20 f0 9f 9a 80',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1.5rem; margin-bottom: 1.25rem;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="h2t-input" style="margin: 0;">Hex Input</label>
            <span id="h2t-hex-stats" style="font-size: 0.8rem; color: var(--text-muted);">0 bytes</span>
          </div>
          <textarea id="h2t-input" class="bu-textarea" style="height: 250px; font-family: monospace; font-size: 0.9rem;" placeholder="Paste hex bytes (e.g. 48 65 6c 6c 6f)..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
            <button type="button" id="btn-h2t-sample" class="bu-btn bu-btn-subtle">Load Sample</button>
            <button type="button" id="btn-h2t-clear" class="bu-btn bu-btn-subtle">Clear</button>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="h2t-output" style="margin: 0;">Decoded Text Output</label>
            <span id="h2t-text-stats" style="font-size: 0.8rem; color: var(--text-muted);">0 characters</span>
          </div>
          <textarea id="h2t-output" class="bu-textarea" style="height: 250px; font-family: monospace; font-size: 0.9rem;" readonly placeholder="Decoded text will appear here..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
            <button type="button" id="btn-h2t-copy" class="bu-btn bu-btn-primary">📋 Copy Text</button>
            <button type="button" id="btn-h2t-download" class="bu-btn bu-btn-subtle">⬇️ Download .txt</button>
          </div>
        </div>
      </div>
    `,
    renderScript: () => `
      const inputEl = document.getElementById('h2t-input');
      const outputEl = document.getElementById('h2t-output');
      const hexStats = document.getElementById('h2t-hex-stats');
      const textStats = document.getElementById('h2t-text-stats');
      const sampleBtn = document.getElementById('btn-h2t-sample');
      const clearBtn = document.getElementById('btn-h2t-clear');
      const copyBtn = document.getElementById('btn-h2t-copy');
      const downloadBtn = document.getElementById('btn-h2t-download');

      function hexToBytes(hexStr) {
        const clean = hexStr.replace(/0x|\\\\x|\\s+|\\:|\\,/gi, '');
        if (clean.length % 2 !== 0) {
          throw new Error('Hex string must have an even number of digits');
        }
        const bytes = new Uint8Array(clean.length / 2);
        for (let i = 0; i < clean.length; i += 2) {
          const byte = parseInt(clean.substr(i, 2), 16);
          if (isNaN(byte)) throw new Error('Invalid hex character encountered');
          bytes[i / 2] = byte;
        }
        return bytes;
      }

      function convert() {
        const text = inputEl.value.trim();
        if (!text) {
          outputEl.value = '';
          hexStats.textContent = '0 bytes';
          textStats.textContent = '0 characters';
          return;
        }

        try {
          const bytes = hexToBytes(text);
          hexStats.textContent = \`\${bytes.length} bytes\`;

          const decoder = new TextDecoder('utf-8', { fatal: false });
          const decoded = decoder.decode(bytes);
          outputEl.value = decoded;
          textStats.textContent = \`\${decoded.length} characters\`;
        } catch (err) {
          outputEl.value = \`Error decoding hex: \${err.message}\`;
        }
      }

      inputEl.addEventListener('input', convert);
      sampleBtn.addEventListener('click', () => {
        inputEl.value = '48 65 6c 6c 6f 2c 20 42 72 6f 77 73 65 72 20 55 74 69 6c 69 74 69 65 73 21 20 f0 9f 9a 80';
        convert();
      });

      clearBtn.addEventListener('click', () => {
        inputEl.value = '';
        outputEl.value = '';
        convert();
      });

      copyBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        navigator.clipboard.writeText(outputEl.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy Text', 2000);
      });

      downloadBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        const blob = new Blob([outputEl.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'decoded.txt';
        a.click();
        URL.revokeObjectURL(url);
      });

      sampleBtn.click();
    `
  },

  // 8. Text to Hex Converter
  {
    id: 'text-to-hex-converter',
    categoryId: 'developer-utilities',
    name: 'Text to Hex Converter',
    icon: '🔢',
    title: 'Text to Hex Converter — Encode Plain Text into Formatted Hex Bytes',
    description: 'Encode plain text, strings, symbols, and emojis into hexadecimal byte sequences with customizable delimiters (space, comma, 0x prefix, \\x escape, or continuous hex).',
    keywords: 'text to hex converter, string to hex, ascii to hexadecimal, encode text to hex, hex generator online, text to 0x',
    howToUse: [
      { step: '1', title: 'Enter Plain Text', desc: 'Type or paste any text or symbols.' },
      { step: '2', title: 'Select Hex Delimiter', desc: 'Choose spaces (48 65), 0x prefix (0x48 0x65), \\x escape, or continuous string.' },
      { step: '3', title: 'Copy Formatted Hex', desc: 'Copy the encoded hexadecimal bytes.' }
    ],
    features: [
      { title: 'Custom Delimiters', desc: 'Spaces, Comma, 0x Prefix, Colon, \\x Escapes, or Continuous hex.' },
      { title: 'Uppercase / Lowercase Toggle', desc: 'Format hex in clean uppercase (48 65 6C) or lowercase (48 65 6c).' },
      { title: 'Full UTF-8 Encoding', desc: 'Accurately computes multi-byte UTF-8 byte arrays for Unicode and emojis.' }
    ],
    sampleText: 'Hello, World! 🚀',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1.5rem; margin-bottom: 1.25rem;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="t2h-input" style="margin: 0;">Plain Text Input</label>
            <span id="t2h-text-stats" style="font-size: 0.8rem; color: var(--text-muted);">0 chars</span>
          </div>
          <textarea id="t2h-input" class="bu-textarea" style="height: 250px; font-family: monospace; font-size: 0.9rem;" placeholder="Type or paste plain text here..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
            <button type="button" id="btn-t2h-sample" class="bu-btn bu-btn-subtle">Load Sample</button>
            <button type="button" id="btn-t2h-clear" class="bu-btn bu-btn-subtle">Clear</button>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="t2h-output" style="margin: 0;">Hex Output</label>
            <span id="t2h-hex-stats" style="font-size: 0.8rem; color: var(--text-muted);">0 bytes</span>
          </div>
          <textarea id="t2h-output" class="bu-textarea" style="height: 250px; font-family: monospace; font-size: 0.9rem;" readonly placeholder="Hex bytes will appear here..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
            <button type="button" id="btn-t2h-copy" class="bu-btn bu-btn-primary">📋 Copy Hex</button>
            <button type="button" id="btn-t2h-download" class="bu-btn bu-btn-subtle">⬇️ Download .txt</button>
          </div>
        </div>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">Hex Formatting Options</h3>
        <div class="bu-grid-2col" style="gap: 1rem;">
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="t2h-delim">Byte Delimiter</label>
            <select id="t2h-delim" class="bu-input">
              <option value="space" selected>Space (48 65 6c)</option>
              <option value="0x">0x Prefix (0x48 0x65 0x6c)</option>
              <option value="escape">\\x Escape (\\x48\\x65\\x6c)</option>
              <option value="comma">Comma (48, 65, 6c)</option>
              <option value="colon">Colon (48:65:6c)</option>
              <option value="none">None / Continuous (48656c)</option>
            </select>
          </div>
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="t2h-case">Hex Case</label>
            <select id="t2h-case" class="bu-input">
              <option value="lower" selected>Lowercase (48 65 6c)</option>
              <option value="upper">Uppercase (48 65 6C)</option>
            </select>
          </div>
        </div>
      </div>
    `,
    renderScript: () => `
      const inputEl = document.getElementById('t2h-input');
      const outputEl = document.getElementById('t2h-output');
      const textStats = document.getElementById('t2h-text-stats');
      const hexStats = document.getElementById('t2h-hex-stats');
      const delimSel = document.getElementById('t2h-delim');
      const caseSel = document.getElementById('t2h-case');
      const sampleBtn = document.getElementById('btn-t2h-sample');
      const clearBtn = document.getElementById('btn-t2h-clear');
      const copyBtn = document.getElementById('btn-t2h-copy');
      const downloadBtn = document.getElementById('btn-t2h-download');

      function convert() {
        const text = inputEl.value;
        if (!text) {
          outputEl.value = '';
          textStats.textContent = '0 chars';
          hexStats.textContent = '0 bytes';
          return;
        }

        textStats.textContent = \`\${text.length} chars\`;

        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        hexStats.textContent = \`\${bytes.length} bytes\`;

        const isUpper = caseSel.value === 'upper';
        const delim = delimSel.value;

        const hexArr = Array.from(bytes).map(b => {
          let h = b.toString(16).padStart(2, '0');
          return isUpper ? h.toUpperCase() : h.toLowerCase();
        });

        let formatted = '';
        if (delim === 'space') formatted = hexArr.join(' ');
        else if (delim === '0x') formatted = hexArr.map(h => '0x' + h).join(' ');
        else if (delim === 'escape') formatted = hexArr.map(h => '\\\\x' + h).join('');
        else if (delim === 'comma') formatted = hexArr.join(', ');
        else if (delim === 'colon') formatted = hexArr.join(':');
        else if (delim === 'none') formatted = hexArr.join('');

        outputEl.value = formatted;
      }

      inputEl.addEventListener('input', convert);
      delimSel.addEventListener('change', convert);
      caseSel.addEventListener('change', convert);

      sampleBtn.addEventListener('click', () => {
        inputEl.value = 'Hello, Browser Utilities! 🚀';
        convert();
      });

      clearBtn.addEventListener('click', () => {
        inputEl.value = '';
        outputEl.value = '';
        convert();
      });

      copyBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        navigator.clipboard.writeText(outputEl.value);
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy Hex', 2000);
      });

      downloadBtn.addEventListener('click', () => {
        if (!outputEl.value) return;
        const blob = new Blob([outputEl.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hex.txt';
        a.click();
        URL.revokeObjectURL(url);
      });

      sampleBtn.click();
    `
  },

  // 9. JWT Decoder
  {
    id: 'jwt-decoder',
    categoryId: 'developer-utilities',
    name: 'JWT Decoder',
    icon: '🔑',
    title: 'JWT Decoder — Decode & Inspect JSON Web Tokens Safely in Browser',
    description: 'Decode and inspect JSON Web Tokens (JWT) safely in your browser. View header algorithms, payload claims, expiration timestamps, issued-at dates, and signature components with zero server transmission.',
    keywords: 'jwt decoder, jwt io decoder online, decode json web token, jwt inspector, jwt token parser, decode jwt client side',
    howToUse: [
      { step: '1', title: 'Paste JWT Token', desc: 'Paste your encoded JSON Web Token (e.g. eyJhbGciOi...)' },
      { step: '2', title: 'Inspect Claims', desc: 'Review the formatted Header and Payload JSON with decoded human timestamps.' },
      { step: '3', title: 'Check Expiration', desc: 'Verify if the token is active or expired, with exact time calculations.' }
    ],
    features: [
      { title: '100% Client-Side Privacy', desc: 'Tokens are never transmitted over the network or logged anywhere.' },
      { title: 'Human Timestamp Conversion', desc: 'Converts Unix epoch claims (exp, iat, nbf, auth_time) into readable local dates.' },
      { title: 'Visual Token Parts Breakdown', desc: 'Color-coded Header (Red), Payload (Purple), and Signature (Cyan).' }
    ],
    sampleText: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggUml2ZXJhIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MDk3OTY0MDAsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    renderControls: () => `
      <div style="margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <label class="bu-form-label" for="jwt-input" style="margin: 0;">Encoded JWT String</label>
          <span id="jwt-status-badge" style="font-size: 0.8rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 9999px; background: rgba(59, 130, 246, 0.1); color: var(--accent-primary);">Token Ready</span>
        </div>
        <textarea id="jwt-input" class="bu-textarea" style="height: 120px; font-family: monospace; font-size: 0.85rem;" placeholder="Paste encoded JWT token (header.payload.signature)..."></textarea>
        <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
          <button type="button" id="btn-jwt-sample" class="bu-btn bu-btn-subtle">Load Sample Token</button>
          <button type="button" id="btn-jwt-clear" class="bu-btn bu-btn-subtle">Clear</button>
        </div>
      </div>
      <!-- Visual breakdown banner -->
      <div id="jwt-visual-bar" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 0.75rem 1rem; margin-bottom: 1.25rem; font-family: monospace; font-size: 0.85rem; word-break: break-all;">
        <span id="jwt-vis-header" style="color: #ef4444; font-weight: 700;">HEADER</span>.<span id="jwt-vis-payload" style="color: #8b5cf6; font-weight: 700;">PAYLOAD</span>.<span id="jwt-vis-sig" style="color: #06b6d4; font-weight: 700;">SIGNATURE</span>
      </div>
      <div class="bu-grid-2col" style="gap: 1.5rem; margin-bottom: 1.25rem;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" style="margin: 0; color: #ef4444;">Header: Algorithm &amp; Token Type</label>
            <button type="button" id="btn-jwt-copy-header" class="bu-btn bu-btn-subtle" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">Copy</button>
          </div>
          <textarea id="jwt-header-out" class="bu-textarea" style="height: 180px; font-family: monospace; font-size: 0.85rem; border-color: rgba(239, 68, 68, 0.4);" readonly></textarea>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" style="margin: 0; color: #8b5cf6;">Payload: Claims &amp; Data</label>
            <button type="button" id="btn-jwt-copy-payload" class="bu-btn bu-btn-subtle" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">Copy</button>
          </div>
          <textarea id="jwt-payload-out" class="bu-textarea" style="height: 180px; font-family: monospace; font-size: 0.85rem; border-color: rgba(139, 92, 246, 0.4);" readonly></textarea>
        </div>
      </div>
      <!-- Token Claims Inspector Table -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">Decoded Standard Claims</h3>
        <div class="bu-table-wrap">
          <table class="bu-table" id="jwt-claims-table">
            <thead>
              <tr><th>Claim Key</th><th>Standard Meaning</th><th>Raw Value</th><th>Interpreted Value</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `,
    renderScript: () => `
      const inputEl = document.getElementById('jwt-input');
      const statusBadge = document.getElementById('jwt-status-badge');
      const visHeader = document.getElementById('jwt-vis-header');
      const visPayload = document.getElementById('jwt-vis-payload');
      const visSig = document.getElementById('jwt-vis-sig');
      const headerOut = document.getElementById('jwt-header-out');
      const payloadOut = document.getElementById('jwt-payload-out');
      const claimsTbody = document.querySelector('#jwt-claims-table tbody');
      const sampleBtn = document.getElementById('btn-jwt-sample');
      const clearBtn = document.getElementById('btn-jwt-clear');
      const copyHeaderBtn = document.getElementById('btn-jwt-copy-header');
      const copyPayloadBtn = document.getElementById('btn-jwt-copy-payload');

      function b64DecodeUnicode(str) {
        // Base64url to Base64
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        const decodedStr = atob(base64);
        return decodeURIComponent(decodedStr.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      }

      const claimDict = {
        iss: 'Issuer',
        sub: 'Subject (User ID)',
        aud: 'Audience',
        exp: 'Expiration Time',
        nbf: 'Not Before Time',
        iat: 'Issued At Time',
        jti: 'JWT ID',
        name: 'Full Name',
        email: 'Email Address',
        role: 'User Role'
      };

      function update() {
        const token = inputEl.value.trim();
        if (!token) {
          headerOut.value = '';
          payloadOut.value = '';
          claimsTbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Paste a JWT to inspect claims</td></tr>';
          visHeader.textContent = 'HEADER';
          visPayload.textContent = 'PAYLOAD';
          visSig.textContent = 'SIGNATURE';
          statusBadge.textContent = 'No Token';
          statusBadge.style.background = 'rgba(100, 116, 139, 0.1)';
          statusBadge.style.color = 'var(--text-muted)';
          return;
        }

        const parts = token.split('.');
        if (parts.length < 2) {
          headerOut.value = 'Invalid JWT format (expected 3 parts separated by dots)';
          payloadOut.value = '';
          statusBadge.textContent = 'Invalid Format';
          statusBadge.style.background = 'rgba(239, 68, 68, 0.1)';
          statusBadge.style.color = '#ef4444';
          return;
        }

        visHeader.textContent = parts[0] || '';
        visPayload.textContent = parts[1] || '';
        visSig.textContent = parts[2] || '';

        try {
          const headerJson = JSON.parse(b64DecodeUnicode(parts[0]));
          headerOut.value = JSON.stringify(headerJson, null, 2);

          const payloadJson = JSON.parse(b64DecodeUnicode(parts[1]));
          payloadOut.value = JSON.stringify(payloadJson, null, 2);

          // Check expiration
          let expStatus = 'Active';
          let expColor = '#10b981';
          if (payloadJson.exp) {
            const expDate = new Date(payloadJson.exp * 1000);
            const now = new Date();
            if (now > expDate) {
              const diffMins = Math.round((now - expDate) / 60000);
              expStatus = \`Expired (\${diffMins}m ago)\`;
              expColor = '#ef4444';
            } else {
              const diffDays = Math.round((expDate - now) / 86400000);
              expStatus = \`Valid (expires in \${diffDays}d)\`;
              expColor = '#10b981';
            }
          }
          statusBadge.textContent = expStatus;
          statusBadge.style.background = \`\${expColor}22\`;
          statusBadge.style.color = expColor;

          // Claims table
          let rows = '';
          for (const [k, v] of Object.entries(payloadJson)) {
            const mean = claimDict[k] || 'Custom Claim';
            let formatted = String(v);
            if ((k === 'exp' || k === 'iat' || k === 'nbf' || k === 'auth_time') && typeof v === 'number') {
              formatted = new Date(v * 1000).toLocaleString() + \` (\${v})\`;
            }
            rows += \`<tr><td><code>\${k}</code></td><td>\${mean}</td><td><code>\${typeof v === 'object' ? JSON.stringify(v) : v}</code></td><td>\${formatted}</td></tr>\`;
          }
          claimsTbody.innerHTML = rows;
        } catch (err) {
          headerOut.value = \`Error decoding: \${err.message}\`;
          payloadOut.value = '';
          statusBadge.textContent = 'Decode Error';
          statusBadge.style.color = '#ef4444';
        }
      }

      inputEl.addEventListener('input', update);

      sampleBtn.addEventListener('click', () => {
        // Sample valid JWT
        inputEl.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMzQ1Njc4OTAiLCJuYW1lIjoiQWxleCBSaXZlcmEiLCJlbWFpbCI6ImFsZXhAZXhhbXBsZS5jb20iLCJyb2xlIjoiU3VwZXIgQWRtaW4iLCJpYXQiOjE3MTAwMDAwMDAsImV4cCI6MTk5OTk5OTk5OX0.4x3gS_example_signature_hash_browser_utilities';
        update();
      });

      clearBtn.addEventListener('click', () => {
        inputEl.value = '';
        update();
      });

      copyHeaderBtn.addEventListener('click', () => {
        if (!headerOut.value) return;
        navigator.clipboard.writeText(headerOut.value);
        copyHeaderBtn.textContent = 'Copied!';
        setTimeout(() => copyHeaderBtn.textContent = 'Copy', 2000);
      });

      copyPayloadBtn.addEventListener('click', () => {
        if (!payloadOut.value) return;
        navigator.clipboard.writeText(payloadOut.value);
        copyPayloadBtn.textContent = 'Copied!';
        setTimeout(() => copyPayloadBtn.textContent = 'Copy', 2000);
      });

      sampleBtn.click();
    `
  }
];

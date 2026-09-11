// File & Data Utilities (Tools 25-30)
export const FILE_TOOLS = [
  // 25. CSV Viewer
  {
    id: 'csv-viewer',
    categoryId: 'file-data-utilities',
    name: 'CSV Viewer & Filter',
    icon: '📊',
    title: 'CSV Viewer & Table Filter — Search, Sort & Paginate CSV Files',
    description: 'Upload or paste CSV spreadsheet data to view, search, and inspect records in a clean, responsive data table with zero server uploads.',
    keywords: 'csv viewer online, inspect csv file, open csv in browser, search csv table, csv table preview, client side csv viewer',
    howToUse: [
      { step: '1', title: 'Upload or Paste CSV', desc: 'Choose a .csv file or paste raw comma-separated text into the editor.' },
      { step: '2', title: 'Filter & Search', desc: 'Type in the search filter to narrow down rows instantly in real time.' },
      { step: '3', title: 'Export Filtered Data', desc: 'Download or copy the inspected records as clean CSV.' }
    ],
    features: [
      { title: 'Responsive Table Grid', desc: 'Auto-detects column headers and displays data in an organized table.' },
      { title: 'Live Search Filter', desc: 'Instant filtering across all columns as you type without reloading.' },
      { title: 'Total Data Privacy', desc: 'Financial records and private customer lists are processed exclusively in RAM.' }
    ],
    sampleText: `id,name,platform,followers,status\n1,AiMAEditz,YouTube,150000,Active\n2,MultiTubeViews,Web,85000,Active\n3,CreatorPro,Twitch,42000,Pending\n4,MediaStudio,Vimeo,12000,Active\n5,SoundWave,Spotify,98000,Active`,
    renderControls: () => `
      <div class="bu-grid-2col">
        <div class="bu-dropzone" id="csv-dropzone" style="padding: 1.5rem;">
          <div style="font-size: 1.8rem; margin-bottom: 0.25rem;">📄</div>
          <strong style="display: block; font-size: 0.95rem;">Upload .csv file</strong>
          <span style="font-size: 0.78rem; color: var(--text-muted);">or drag & drop</span>
          <input type="file" id="csv-file" accept=".csv,text/csv" style="display: none;">
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" for="csv-raw">Or Paste Raw CSV Data</label>
          <textarea id="csv-raw" class="bu-textarea bu-textarea-mono" style="min-height: 110px;" placeholder="Paste CSV text here..."></textarea>
        </div>
      </div>
      <div class="bu-options-wrap" style="align-items: center; justify-content: space-between; margin-top: 1rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; flex: 1; max-width: 400px;">
          <input type="text" id="csv-search" class="bu-input" placeholder="Search / filter rows...">
        </div>
        <div class="bu-actions-bar" style="margin: 0;">
          <button type="button" id="btn-csv-sample" class="bu-btn">Load Sample</button>
          <button type="button" id="btn-csv-clear" class="bu-btn bu-btn-subtle">Clear</button>
        </div>
      </div>
      <div class="bu-stats-strip" id="csv-stats" style="margin-top: 1rem;">
        <div class="bu-stat-item">Rows: <strong id="csv-rows-cnt">0</strong></div>
        <div class="bu-stat-item">Columns: <strong id="csv-cols-cnt">0</strong></div>
        <div class="bu-stat-item">Filtered Matches: <strong id="csv-filter-cnt">0</strong></div>
      </div>
      <div class="bu-table-wrap" style="margin-top: 1rem; max-height: 380px; overflow-y: auto;">
        <table class="bu-table" id="csv-table">
          <thead id="csv-thead"></thead>
          <tbody id="csv-tbody"></tbody>
        </table>
      </div>
    `,
    renderScript: () => `
      const dropzone = document.getElementById('csv-dropzone');
      const fileIn = document.getElementById('csv-file');
      const rawIn = document.getElementById('csv-raw');
      const searchIn = document.getElementById('csv-search');
      const thead = document.getElementById('csv-thead');
      const tbody = document.getElementById('csv-tbody');
      const rowsCnt = document.getElementById('csv-rows-cnt');
      const colsCnt = document.getElementById('csv-cols-cnt');
      const filterCnt = document.getElementById('csv-filter-cnt');
      const sampleBtn = document.getElementById('btn-csv-sample');
      const clearBtn = document.getElementById('btn-csv-clear');

      let parsedData = [];

      dropzone.addEventListener('click', () => fileIn.click());
      fileIn.addEventListener('change', () => {
        if (fileIn.files && fileIn.files[0]) {
          const reader = new FileReader();
          reader.onload = (e) => {
            rawIn.value = e.target.result;
            renderTable();
          };
          reader.readAsText(fileIn.files[0]);
        }
      });

      function renderTable() {
        const text = rawIn.value.trim();
        if (!text) {
          thead.innerHTML = '';
          tbody.innerHTML = '';
          rowsCnt.textContent = '0';
          colsCnt.textContent = '0';
          filterCnt.textContent = '0';
          return;
        }

        parsedData = window.MTV_BU.parseCSV(text);
        if (!parsedData.length) return;

        const headers = parsedData[0];
        const rows = parsedData.slice(1);
        const query = searchIn.value.toLowerCase().trim();

        thead.innerHTML = '<tr>' + headers.map(h => \`<th>\${h}</th>\`).join('') + '</tr>';
        colsCnt.textContent = headers.length;
        rowsCnt.textContent = rows.length;

        let matchCount = 0;
        const bodyHtml = rows.map(r => {
          const matches = !query || r.some(cell => String(cell).toLowerCase().includes(query));
          if (matches) {
            matchCount++;
            return '<tr>' + r.map(cell => \`<td>\${cell}</td>\`).join('') + '</tr>';
          }
          return '';
        }).join('');

        tbody.innerHTML = bodyHtml;
        filterCnt.textContent = matchCount;
      }

      rawIn.addEventListener('input', renderTable);
      searchIn.addEventListener('input', renderTable);

      sampleBtn.addEventListener('click', () => {
        rawIn.value = 'id,name,platform,followers,status\\n1,AiMAEditz,YouTube,150000,Active\\n2,MultiTubeViews,Web,85000,Active\\n3,CreatorPro,Twitch,42000,Pending\\n4,MediaStudio,Vimeo,12000,Active\\n5,SoundWave,Spotify,98000,Active';
        renderTable();
      });

      clearBtn.addEventListener('click', () => {
        rawIn.value = '';
        searchIn.value = '';
        renderTable();
        rawIn.focus();
      });

      renderTable();
    `
  },

  // 26. CSV to JSON Converter
  {
    id: 'csv-to-json-converter',
    categoryId: 'file-data-utilities',
    name: 'CSV to JSON Converter',
    icon: '🔁',
    title: 'CSV to JSON Converter — Transform Tabular Data to JSON Objects',
    description: 'Convert CSV spreadsheet tables into structured JSON arrays of objects with automatic header mapping and data type detection.',
    keywords: 'csv to json converter, convert csv to json, csv to json online, csv parser json, excel to json converter',
    howToUse: [
      { step: '1', title: 'Paste CSV Data', desc: 'Enter comma-delimited text where the first row contains column headers.' },
      { step: '2', title: 'Choose Formatting', desc: 'Select 2-space pretty printing or compact minified JSON.' },
      { step: '3', title: 'Copy or Download', desc: 'Copy the resulting JSON array or download as a .json file.' }
    ],
    features: [
      { title: 'Automatic Type Parsing', desc: 'Detects numbers and booleans to generate native JSON types instead of strings.' },
      { title: 'Header-to-Key Mapping', desc: 'Transforms column headers into clean object keys.' },
      { title: 'Complete Privacy', desc: 'No sensitive spreadsheet data leaves your device.' }
    ],
    sampleText: `name,role,experience_years,active\nAbid,Lead Architect,8,true\nSarah,Senior Designer,5,true\nAlex,DevOps Engineer,6,false`,
    renderControls: () => `
      <div class="bu-grid-2col">
        <div class="bu-form-group">
          <label class="bu-form-label" for="c2j-csv">CSV Input (First row as headers)</label>
          <textarea id="c2j-csv" class="bu-textarea bu-textarea-mono" style="min-height: 220px;" placeholder="Paste CSV text here..."></textarea>
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" for="c2j-json">JSON Output</label>
          <textarea id="c2j-json" class="bu-textarea bu-textarea-mono" readonly style="min-height: 220px;" placeholder="JSON array will appear here..."></textarea>
        </div>
      </div>
      <div class="bu-options-wrap">
        <label class="bu-checkbox-label"><input type="checkbox" id="c2j-types" checked> Auto-parse numbers and booleans</label>
        <label class="bu-checkbox-label"><input type="checkbox" id="c2j-minify"> Minify JSON (no whitespace)</label>
      </div>
      <div class="bu-actions-bar">
        <button type="button" id="btn-c2j-convert" class="bu-btn bu-btn-primary">Convert to JSON</button>
        <button type="button" id="btn-c2j-copy" class="bu-btn">Copy JSON</button>
        <button type="button" id="btn-c2j-download" class="bu-btn">Download .json</button>
        <button type="button" id="btn-c2j-sample" class="bu-btn">Load Sample</button>
        <button type="button" id="btn-c2j-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const csvIn = document.getElementById('c2j-csv');
      const jsonOut = document.getElementById('c2j-json');
      const typesCheck = document.getElementById('c2j-types');
      const minifyCheck = document.getElementById('c2j-minify');
      const convertBtn = document.getElementById('btn-c2j-convert');
      const copyBtn = document.getElementById('btn-c2j-copy');
      const dlBtn = document.getElementById('btn-c2j-download');
      const sampleBtn = document.getElementById('btn-c2j-sample');
      const clearBtn = document.getElementById('btn-c2j-clear');

      function convert() {
        const text = csvIn.value.trim();
        if (!text) {
          jsonOut.value = '';
          return;
        }
        const json = window.MTV_BU.csvToJson(text, {
          parseNumbers: typesCheck.checked,
          minify: minifyCheck.checked
        });
        jsonOut.value = json;
      }

      convertBtn.addEventListener('click', convert);
      csvIn.addEventListener('input', convert);
      typesCheck.addEventListener('change', convert);
      minifyCheck.addEventListener('change', convert);

      copyBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(jsonOut.value, copyBtn));
      dlBtn.addEventListener('click', () => {
        if (!jsonOut.value) return;
        window.MTV_BU.downloadFile(jsonOut.value, 'data.json', 'application/json');
      });

      sampleBtn.addEventListener('click', () => {
        csvIn.value = 'name,role,experience_years,active\\nAbid,Lead Architect,8,true\\nSarah,Senior Designer,5,true\\nAlex,DevOps Engineer,6,false';
        convert();
      });

      clearBtn.addEventListener('click', () => {
        csvIn.value = '';
        jsonOut.value = '';
        csvIn.focus();
      });
    `
  },

  // 27. JSON to CSV Converter
  {
    id: 'json-to-csv-converter',
    categoryId: 'file-data-utilities',
    name: 'JSON to CSV Converter',
    icon: '📑',
    title: 'JSON to CSV Converter — Transform JSON Arrays to CSV Spreadsheets',
    description: 'Convert JSON arrays of objects into RFC 4180 compliant CSV files with automatic key union and quotation escaping in your browser.',
    keywords: 'json to csv converter, convert json to csv, json to excel, json to spreadsheet, online json to csv',
    howToUse: [
      { step: '1', title: 'Paste JSON Array', desc: 'Enter valid JSON containing an array of objects [ { ... }, { ... } ].' },
      { step: '2', title: 'Extract Headers & Rows', desc: 'Click Convert to CSV to union all object keys and format rows.' },
      { step: '3', title: 'Export CSV File', desc: 'Copy the CSV or download as a .csv file ready for Excel or Google Sheets.' }
    ],
    features: [
      { title: 'Automatic Key Union', desc: 'Detects all distinct keys across objects, even if some items have missing fields.' },
      { title: 'RFC 4180 Compliant', desc: 'Properly encloses strings containing commas, quotes, or line breaks in double quotes.' },
      { title: 'Instant Processing', desc: 'Transforms large datasets in milliseconds with zero network delay.' }
    ],
    sampleText: `[
  {"id": 1, "title": "YouTube Workspace", "views": 15000, "featured": true},
  {"id": 2, "title": "Twitch Multi-Stream", "views": 24000, "featured": true},
  {"id": 3, "title": "Creator Audio Extractor", "views": 8500, "featured": false}
]`,
    renderControls: () => `
      <div class="bu-grid-2col">
        <div class="bu-form-group">
          <label class="bu-form-label" for="j2c-json">JSON Array Input</label>
          <textarea id="j2c-json" class="bu-textarea bu-textarea-mono" style="min-height: 220px;" placeholder="Paste JSON array here..."></textarea>
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" for="j2c-csv">CSV Output</label>
          <textarea id="j2c-csv" class="bu-textarea bu-textarea-mono" readonly style="min-height: 220px;" placeholder="CSV output will appear here..."></textarea>
        </div>
      </div>
      <div id="j2c-error" class="bu-status-banner bu-status-error" style="display: none; margin-bottom: 1rem;"></div>
      <div class="bu-actions-bar">
        <button type="button" id="btn-j2c-convert" class="bu-btn bu-btn-primary">Convert to CSV</button>
        <button type="button" id="btn-j2c-copy" class="bu-btn">Copy CSV</button>
        <button type="button" id="btn-j2c-download" class="bu-btn">Download .csv</button>
        <button type="button" id="btn-j2c-sample" class="bu-btn">Load Sample</button>
        <button type="button" id="btn-j2c-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const jsonIn = document.getElementById('j2c-json');
      const csvOut = document.getElementById('j2c-csv');
      const errorEl = document.getElementById('j2c-error');
      const convertBtn = document.getElementById('btn-j2c-convert');
      const copyBtn = document.getElementById('btn-j2c-copy');
      const dlBtn = document.getElementById('btn-j2c-download');
      const sampleBtn = document.getElementById('btn-j2c-sample');
      const clearBtn = document.getElementById('btn-j2c-clear');

      function convert() {
        errorEl.style.display = 'none';
        const text = jsonIn.value.trim();
        if (!text) {
          csvOut.value = '';
          return;
        }
        const res = window.MTV_BU.jsonToCsv(text);
        if (res.valid) {
          csvOut.value = res.result;
        } else {
          csvOut.value = '';
          errorEl.textContent = '✗ ' + res.error;
          errorEl.style.display = 'block';
        }
      }

      convertBtn.addEventListener('click', convert);
      jsonIn.addEventListener('input', convert);

      copyBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(csvOut.value, copyBtn));
      dlBtn.addEventListener('click', () => {
        if (!csvOut.value) return;
        window.MTV_BU.downloadFile(csvOut.value, 'data.csv', 'text/csv');
      });

      sampleBtn.addEventListener('click', () => {
        jsonIn.value = '[\\n  {"id": 1, "title": "YouTube Workspace", "views": 15000, "featured": true},\\n  {"id": 2, "title": "Twitch Multi-Stream", "views": 24000, "featured": true},\\n  {"id": 3, "title": "Creator Audio Extractor", "views": 8500, "featured": false}\\n]';
        convert();
      });

      clearBtn.addEventListener('click', () => {
        jsonIn.value = '';
        csvOut.value = '';
        errorEl.style.display = 'none';
        jsonIn.focus();
      });
    `
  },

  // 28. File Information Viewer
  {
    id: 'file-information-viewer',
    categoryId: 'file-data-utilities',
    name: 'File Information & Size Inspector',
    icon: 'ℹ️',
    title: 'File Information & Size Inspector — Detailed Local File Analysis',
    description: 'Analyze any local file byte size, MIME type, extension, and calculate estimated transfer speeds on 4G, 5G, and broadband networks.',
    keywords: 'file info viewer, inspect file size bytes, check file mime type, file download time calculator, local file inspector',
    howToUse: [
      { step: '1', title: 'Select Local File', desc: 'Drag and drop any file (video, audio, PDF, archive, document).' },
      { step: '2', title: 'Inspect Technical Specs', desc: 'View byte count, formatted size, MIME type, and last modified date.' },
      { step: '3', title: 'Review Transfer Speeds', desc: 'Check estimated upload/download duration on 4G LTE, 5G, and gigabit fiber.' }
    ],
    features: [
      { title: 'Network Transfer Estimates', desc: 'Calculates expected download speeds across varying mobile and home connections.' },
      { title: 'Precise Byte Breakdown', desc: 'Reports exact bytes, Kilobytes (KB), and Megabytes (MB).' },
      { title: 'Zero File Reading', desc: 'Reads only header descriptors in RAM without transferring file contents.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-dropzone" id="fiv-dropzone">
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">📂</div>
        <strong style="display: block; font-size: 1rem; color: var(--text-primary); margin-bottom: 0.25rem;">Drop any file here or click to inspect</strong>
        <span style="font-size: 0.82rem; color: var(--text-muted);">Videos, audio, documents, archives — processed 100% locally</span>
        <input type="file" id="fiv-file" style="display: none;">
      </div>
      <div id="fiv-results" style="display: none; margin-top: 1.5rem;">
        <div class="bu-table-wrap">
          <table class="bu-table">
            <thead><tr><th>File Property</th><th>Details</th></tr></thead>
            <tbody>
              <tr><td>File Name</td><td id="fiv-name" style="font-weight: 600;">-</td></tr>
              <tr><td>Size</td><td id="fiv-size" style="font-weight: 600; color: var(--accent-blue);">-</td></tr>
              <tr><td>Exact Bytes</td><td id="fiv-bytes" style="font-family: monospace;">-</td></tr>
              <tr><td>MIME Type</td><td id="fiv-mime">-</td></tr>
              <tr><td>Last Modified</td><td id="fiv-date">-</td></tr>
            </tbody>
          </table>
        </div>
        <div class="bu-form-group" style="margin-top: 1.5rem;">
          <label class="bu-form-label">Estimated Transfer Duration</label>
          <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
            <div class="bu-stat-item">4G Mobile (~25 Mbps): <strong id="fiv-t-4g">-</strong></div>
            <div class="bu-stat-item">5G Ultra (~150 Mbps): <strong id="fiv-t-5g">-</strong></div>
            <div class="bu-stat-item">Broadband (~500 Mbps): <strong id="fiv-t-bb">-</strong></div>
          </div>
        </div>
        <div class="bu-actions-bar" style="margin-top: 1.25rem;">
          <button type="button" id="btn-fiv-copy" class="bu-btn bu-btn-primary">Copy File Information</button>
          <button type="button" id="btn-fiv-clear" class="bu-btn bu-btn-subtle">Clear</button>
        </div>
      </div>
    `,
    renderScript: () => `
      const dropzone = document.getElementById('fiv-dropzone');
      const fileIn = document.getElementById('fiv-file');
      const results = document.getElementById('fiv-results');
      const nameEl = document.getElementById('fiv-name');
      const sizeEl = document.getElementById('fiv-size');
      const bytesEl = document.getElementById('fiv-bytes');
      const mimeEl = document.getElementById('fiv-mime');
      const dateEl = document.getElementById('fiv-date');
      const t4g = document.getElementById('fiv-t-4g');
      const t5g = document.getElementById('fiv-t-5g');
      const tBb = document.getElementById('fiv-t-bb');
      const copyBtn = document.getElementById('btn-fiv-copy');
      const clearBtn = document.getElementById('btn-fiv-clear');

      let fileReport = '';

      dropzone.addEventListener('click', () => fileIn.click());
      dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag-over'); });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) inspect(e.dataTransfer.files[0]);
      });
      fileIn.addEventListener('change', () => {
        if (fileIn.files && fileIn.files[0]) inspect(fileIn.files[0]);
      });

      function formatTime(sec) {
        if (sec < 1) return '< 1 sec';
        if (sec < 60) return sec.toFixed(1) + ' sec';
        return (sec / 60).toFixed(1) + ' min';
      }

      function inspect(file) {
        const bytes = file.size;
        const sizeStr = bytes > 1048576 ? (bytes / 1048576).toFixed(2) + ' MB' : (bytes / 1024).toFixed(1) + ' KB';
        const bits = bytes * 8;

        nameEl.textContent = file.name;
        sizeEl.textContent = sizeStr;
        bytesEl.textContent = bytes.toLocaleString() + ' bytes';
        mimeEl.textContent = file.type || '(unknown / binary)';
        dateEl.textContent = new Date(file.lastModified).toLocaleString();

        t4g.textContent = formatTime(bits / 25000000);
        t5g.textContent = formatTime(bits / 150000000);
        tBb.textContent = formatTime(bits / 500000000);

        fileReport = \`File: \${file.name}\\nSize: \${sizeStr} (\${bytes} bytes)\\nMIME: \${file.type}\\nModified: \${new Date(file.lastModified).toLocaleString()}\`;
        results.style.display = 'block';
      }

      copyBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(fileReport, copyBtn));
      clearBtn.addEventListener('click', () => {
        results.style.display = 'none';
        fileIn.value = '';
      });
    `
  },

  // 29. File Hash Generator
  {
    id: 'file-hash-generator',
    categoryId: 'file-data-utilities',
    name: 'File Hash Generator',
    icon: '🔒',
    title: 'File Hash Generator — SHA-256, SHA-1, SHA-384 & SHA-512 in Browser',
    description: 'Calculate cryptographic SHA hashes for any local file using the native Web Crypto API with zero file uploads and complete verification integrity.',
    keywords: 'file hash generator, calculate sha256 online, sha1 file checksum, sha512 generator, verify file integrity, checksum calculator',
    howToUse: [
      { step: '1', title: 'Choose File & Algorithm', desc: 'Select your local file and pick SHA-256, SHA-1, SHA-384, or SHA-512.' },
      { step: '2', title: 'Hash Computation', desc: 'The browser Web Crypto API streams bytes into crypto.subtle.digest().' },
      { step: '3', title: 'Verify Checksum', desc: 'Paste an expected hash string to automatically confirm checksum match.' }
    ],
    features: [
      { title: 'Web Crypto API', desc: 'Hardware-accelerated cryptographic computation directly in your browser.' },
      { title: 'Four SHA Standards', desc: 'Supports SHA-1, SHA-256, SHA-384, and SHA-512 algorithms.' },
      { title: 'Instant Hash Verification', desc: 'Live comparison against author or vendor checksums with green match alert.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-dropzone" id="fhg-dropzone">
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🛡️</div>
        <strong style="display: block; font-size: 1rem; color: var(--text-primary); margin-bottom: 0.25rem;">Drop a file to compute cryptographic hash</strong>
        <span style="font-size: 0.82rem; color: var(--text-muted);">Zero uploads — verified locally using crypto.subtle</span>
        <input type="file" id="fhg-file" style="display: none;">
      </div>
      <div class="bu-options-wrap" style="align-items: center; margin-top: 1rem;">
        <label for="fhg-algo" style="font-size: 0.85rem; font-weight: 600;">Algorithm:</label>
        <select id="fhg-algo" class="bu-select" style="width: auto;">
          <option value="SHA-256" selected>SHA-256 (Standard)</option>
          <option value="SHA-512">SHA-512 (High Security)</option>
          <option value="SHA-384">SHA-384</option>
          <option value="SHA-1">SHA-1 (Legacy)</option>
        </select>
      </div>
      <div id="fhg-results" style="display: none; margin-top: 1.25rem;">
        <div class="bu-form-group">
          <label class="bu-form-label" id="fhg-hash-label">Calculated SHA-256 Hash</label>
          <textarea id="fhg-hash-val" class="bu-textarea bu-textarea-mono" readonly style="min-height: 80px; font-size: 0.95rem;"></textarea>
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" for="fhg-verify">Verify Against Expected Checksum</label>
          <input type="text" id="fhg-verify" class="bu-input bu-input-mono" placeholder="Paste expected hash to compare...">
        </div>
        <div id="fhg-match-badge" class="bu-status-banner" style="display: none; margin-bottom: 1rem;"></div>
        <div class="bu-actions-bar">
          <button type="button" id="btn-fhg-copy" class="bu-btn bu-btn-primary">Copy Hash</button>
          <button type="button" id="btn-fhg-clear" class="bu-btn bu-btn-subtle">Clear</button>
        </div>
      </div>
    `,
    renderScript: () => `
      const dropzone = document.getElementById('fhg-dropzone');
      const fileIn = document.getElementById('fhg-file');
      const algoSelect = document.getElementById('fhg-algo');
      const results = document.getElementById('fhg-results');
      const hashLabel = document.getElementById('fhg-hash-label');
      const hashVal = document.getElementById('fhg-hash-val');
      const verifyIn = document.getElementById('fhg-verify');
      const matchBadge = document.getElementById('fhg-match-badge');
      const copyBtn = document.getElementById('btn-fhg-copy');
      const clearBtn = document.getElementById('btn-fhg-clear');

      let currentFile = null;

      dropzone.addEventListener('click', () => fileIn.click());
      dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag-over'); });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) compute(e.dataTransfer.files[0]);
      });
      fileIn.addEventListener('change', () => {
        if (fileIn.files && fileIn.files[0]) compute(fileIn.files[0]);
      });
      algoSelect.addEventListener('change', () => {
        if (currentFile) compute(currentFile);
      });

      async function compute(file) {
        currentFile = file;
        const algo = algoSelect.value;
        hashLabel.textContent = \`Calculated \${algo} Hash (\${file.name})\`;
        hashVal.value = 'Computing hash in browser...';
        results.style.display = 'block';

        const buffer = await file.arrayBuffer();
        const hash = await window.MTV_BU.hashBuffer(buffer, algo);
        hashVal.value = hash;
        checkMatch();
      }

      function checkMatch() {
        const expected = verifyIn.value.trim().toLowerCase();
        const actual = hashVal.value.trim().toLowerCase();
        if (!expected || actual === 'computing hash in browser...') {
          matchBadge.style.display = 'none';
          return;
        }
        matchBadge.style.display = 'block';
        if (expected === actual) {
          matchBadge.className = 'bu-status-banner bu-status-success';
          matchBadge.textContent = '✓ Checksum Verified! The file is authentic and unaltered.';
        } else {
          matchBadge.className = 'bu-status-banner bu-status-error';
          matchBadge.textContent = '✗ Checksum Mismatch! The hashes do not match.';
        }
      }

      verifyIn.addEventListener('input', checkMatch);
      copyBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(hashVal.value, copyBtn));
      clearBtn.addEventListener('click', () => {
        results.style.display = 'none';
        currentFile = null;
        fileIn.value = '';
        verifyIn.value = '';
      });
    `
  },

  // 30. Text File Merger
  {
    id: 'text-file-merger',
    categoryId: 'file-data-utilities',
    name: 'Text File Merger',
    icon: '📑',
    title: 'Text File Merger — Combine Multiple Text, Code & Log Files Online',
    description: 'Merge multiple text, markdown, CSV, or code files into a single consolidated document with customizable separators and file headers.',
    keywords: 'text file merger, merge text files online, combine files, join text files, merge txt files, combine logs online',
    howToUse: [
      { step: '1', title: 'Upload Files', desc: 'Select or drop multiple text files (Markdown, CSV, TXT, code).' },
      { step: '2', title: 'Set Separator', desc: 'Choose double newlines, markdown horizontal rules, or file name headers.' },
      { step: '3', title: 'Download Merged File', desc: 'Export the combined master document in a single click.' }
    ],
    features: [
      { title: 'Multi-File Dropzone', desc: 'Accepts dozens of files simultaneously and organizes them in an editable list.' },
      { title: 'Header Tags', desc: 'Optionally prefixes each merged section with === File: filename === for clarity.' },
      { title: 'Zero Server Storage', desc: 'Confidential source code and server logs are combined purely in browser memory.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-dropzone" id="tfm-dropzone">
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">📚</div>
        <strong style="display: block; font-size: 1rem; color: var(--text-primary); margin-bottom: 0.25rem;">Drop multiple text or code files here</strong>
        <span style="font-size: 0.82rem; color: var(--text-muted);">.txt, .md, .csv, .json, .js, .log — select multiple files</span>
        <input type="file" id="tfm-file" multiple style="display: none;">
      </div>
      <div id="tfm-list" style="margin-top: 1rem; display: none;">
        <label class="bu-form-label">Loaded Files (<span id="tfm-count">0</span>)</label>
        <div id="tfm-items" style="display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem;"></div>
      </div>
      <div class="bu-options-wrap" style="align-items: center;">
        <label for="tfm-sep" style="font-size: 0.85rem; font-weight: 600;">Separator Between Files:</label>
        <select id="tfm-sep" class="bu-select" style="width: auto;">
          <option value="newline" selected>Double Newline</option>
          <option value="header">File Name Header (=== File: name ===)</option>
          <option value="divider">Markdown Divider (---)</option>
        </select>
      </div>
      <div class="bu-form-group" style="margin-top: 1.25rem;">
        <label class="bu-form-label" for="tfm-output">Merged Document Preview</label>
        <textarea id="tfm-output" class="bu-textarea bu-textarea-mono" readonly style="min-height: 240px;" placeholder="Merged document preview will appear here..."></textarea>
      </div>
      <div class="bu-actions-bar">
        <button type="button" id="btn-tfm-merge" class="bu-btn bu-btn-primary">Merge Files</button>
        <button type="button" id="btn-tfm-copy" class="bu-btn">Copy Merged Text</button>
        <button type="button" id="btn-tfm-download" class="bu-btn">Download Combined File</button>
        <button type="button" id="btn-tfm-clear" class="bu-btn bu-btn-subtle">Clear All</button>
      </div>
    `,
    renderScript: () => `
      const dropzone = document.getElementById('tfm-dropzone');
      const fileIn = document.getElementById('tfm-file');
      const listWrap = document.getElementById('tfm-list');
      const countEl = document.getElementById('tfm-count');
      const itemsWrap = document.getElementById('tfm-items');
      const sepSelect = document.getElementById('tfm-sep');
      const output = document.getElementById('tfm-output');
      const mergeBtn = document.getElementById('btn-tfm-merge');
      const copyBtn = document.getElementById('btn-tfm-copy');
      const dlBtn = document.getElementById('btn-tfm-download');
      const clearBtn = document.getElementById('btn-tfm-clear');

      let loadedFiles = [];

      dropzone.addEventListener('click', () => fileIn.click());
      dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag-over'); });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
      });
      fileIn.addEventListener('change', () => {
        if (fileIn.files) handleFiles(fileIn.files);
      });

      async function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const text = await file.text();
          loadedFiles.push({ name: file.name, text: text, size: file.size });
        }
        renderFileList();
        merge();
      }

      function renderFileList() {
        if (!loadedFiles.length) {
          listWrap.style.display = 'none';
          return;
        }
        listWrap.style.display = 'block';
        countEl.textContent = loadedFiles.length;
        itemsWrap.innerHTML = loadedFiles.map((f, idx) => \`
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; font-size: 0.85rem;">
            <span>\${idx + 1}. <strong>\${f.name}</strong> (\${(f.size / 1024).toFixed(1)} KB)</span>
            <button type="button" class="bu-btn bu-btn-subtle" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="removeFile(\${idx})">Remove</button>
          </div>
        \`).join('');
      }

      window.removeFile = function(idx) {
        loadedFiles.splice(idx, 1);
        renderFileList();
        merge();
      };

      function merge() {
        if (!loadedFiles.length) {
          output.value = '';
          return;
        }
        const sep = sepSelect.value;
        const parts = loadedFiles.map(f => {
          if (sep === 'header') return \`=== File: \${f.name} ===\\n\${f.text}\`;
          if (sep === 'divider') return \`---\\n# \${f.name}\\n\${f.text}\`;
          return f.text;
        });
        output.value = parts.join('\\n\\n');
      }

      mergeBtn.addEventListener('click', merge);
      sepSelect.addEventListener('change', merge);
      copyBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(output.value, copyBtn));
      dlBtn.addEventListener('click', () => {
        if (!output.value) return;
        window.MTV_BU.downloadFile(output.value, 'merged-document.txt');
      });

      clearBtn.addEventListener('click', () => {
        loadedFiles = [];
        output.value = '';
        renderFileList();
        fileIn.value = '';
      });
    `
  }
];

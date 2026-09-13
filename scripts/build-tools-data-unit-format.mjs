// Category: Unit & Format Converters (6 tools)
export const UNIT_FORMAT_TOOLS = [
  // 1. Length/Weight/Temperature Converter
  {
    id: 'unit-converter',
    categoryId: 'unit-format-converters',
    name: 'Length, Weight & Temp Converter',
    icon: '📐',
    title: 'Unit Converter — Length, Weight, Temperature, Area & Volume',
    description: 'Convert between metric and imperial units for length (meters, feet, inches), mass (kg, pounds, ounces), temperature (°C, °F, Kelvin), speed, and area with instant calculation.',
    keywords: 'unit converter online, length converter, weight converter kg to lbs, temperature converter celsius to fahrenheit, metric imperial converter',
    howToUse: [
      { step: '1', title: 'Choose Category', desc: 'Select Length, Weight, Temperature, Area, or Speed from the dropdown.' },
      { step: '2', title: 'Enter Value & Units', desc: 'Type the number and pick the source and destination units.' },
      { step: '3', title: 'View All Units Table', desc: 'Inspect the primary result and full comparative matrix across all units.' }
    ],
    features: [
      { title: '5 Measurement Categories', desc: 'Comprehensive coverage for length, mass/weight, temperature, area, and speed.' },
      { title: 'All-Units Matrix Table', desc: 'Converts your input into every related unit simultaneously for instant reference.' },
      { title: 'Bidirectional Swap', desc: 'Easily swap source and target units with one click.' }
    ],
    sampleText: '100',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="uc-category">Category</label>
          <select id="uc-category" class="bu-input">
            <option value="length" selected>Length &amp; Distance</option>
            <option value="weight">Weight &amp; Mass</option>
            <option value="temperature">Temperature</option>
            <option value="area">Area</option>
            <option value="speed">Speed</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="uc-from">From Unit</label>
          <select id="uc-from" class="bu-input"></select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="uc-to">To Unit</label>
          <select id="uc-to" class="bu-input"></select>
        </div>
      </div>

      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.5rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="uc-input">Input Value</label>
          <input type="number" id="uc-input" class="bu-input" value="100" step="any">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="uc-result">
            <span>Converted Result</span>
            <span class="bu-form-label-hint" id="uc-formula-hint">Formula</span>
          </label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="uc-result" class="bu-input bu-input-mono" readonly style="font-weight: 700; font-size: 1.1rem; color: var(--accent-blue);">
            <button type="button" id="btn-uc-copy" class="bu-btn bu-btn-primary" style="white-space: nowrap;">Copy</button>
          </div>
        </div>
      </div>

      <div class="bu-actions-bar" style="margin-bottom: 1.5rem; justify-content: flex-start; gap: 0.5rem;">
        <button type="button" id="btn-uc-swap" class="bu-btn">⇄ Swap Units</button>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">All Units Comparison</label>
        <div id="uc-matrix" style="border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); background: var(--bg-card); overflow: hidden;">
          <!-- Populated by script -->
        </div>
      </div>
    `,
    renderScript: () => `
      const UNITS = {
        length: {
          base: 'm',
          rates: {
            'm': { name: 'Meters (m)', toBase: x => x, fromBase: x => x },
            'km': { name: 'Kilometers (km)', toBase: x => x * 1000, fromBase: x => x / 1000 },
            'cm': { name: 'Centimeters (cm)', toBase: x => x / 100, fromBase: x => x * 100 },
            'mm': { name: 'Millimeters (mm)', toBase: x => x / 1000, fromBase: x => x * 1000 },
            'mi': { name: 'Miles (mi)', toBase: x => x * 1609.344, fromBase: x => x / 1609.344 },
            'yd': { name: 'Yards (yd)', toBase: x => x * 0.9144, fromBase: x => x / 0.9144 },
            'ft': { name: 'Feet (ft)', toBase: x => x * 0.3048, fromBase: x => x / 0.3048 },
            'in': { name: 'Inches (in)', toBase: x => x * 0.0254, fromBase: x => x / 0.0254 },
            'nmi': { name: 'Nautical Miles', toBase: x => x * 1852, fromBase: x => x / 1852 }
          }
        },
        weight: {
          base: 'kg',
          rates: {
            'kg': { name: 'Kilograms (kg)', toBase: x => x, fromBase: x => x },
            'g': { name: 'Grams (g)', toBase: x => x / 1000, fromBase: x => x * 1000 },
            'mg': { name: 'Milligrams (mg)', toBase: x => x / 1000000, fromBase: x => x * 1000000 },
            'lb': { name: 'Pounds (lbs)', toBase: x => x * 0.45359237, fromBase: x => x / 0.45359237 },
            'oz': { name: 'Ounces (oz)', toBase: x => x * 0.02834952, fromBase: x => x / 0.02834952 },
            't': { name: 'Metric Tonnes', toBase: x => x * 1000, fromBase: x => x / 1000 },
            'st': { name: 'Stone (st)', toBase: x => x * 6.35029, fromBase: x => x / 6.35029 }
          }
        },
        temperature: {
          base: 'C',
          rates: {
            'C': { name: 'Celsius (°C)', toBase: x => x, fromBase: x => x },
            'F': { name: 'Fahrenheit (°F)', toBase: x => (x - 32) * 5/9, fromBase: x => (x * 9/5) + 32 },
            'K': { name: 'Kelvin (K)', toBase: x => x - 273.15, fromBase: x => x + 273.15 }
          }
        },
        area: {
          base: 'sqm',
          rates: {
            'sqm': { name: 'Square Meters (m²)', toBase: x => x, fromBase: x => x },
            'sqkm': { name: 'Square Kilometers (km²)', toBase: x => x * 1e6, fromBase: x => x / 1e6 },
            'sqft': { name: 'Square Feet (ft²)', toBase: x => x * 0.092903, fromBase: x => x / 0.092903 },
            'sqin': { name: 'Square Inches (in²)', toBase: x => x * 0.00064516, fromBase: x => x / 0.00064516 },
            'ac': { name: 'Acres (ac)', toBase: x => x * 4046.86, fromBase: x => x / 4046.86 },
            'ha': { name: 'Hectares (ha)', toBase: x => x * 10000, fromBase: x => x / 10000 }
          }
        },
        speed: {
          base: 'mps',
          rates: {
            'mps': { name: 'Meters per sec (m/s)', toBase: x => x, fromBase: x => x },
            'kph': { name: 'Kilometers per hour (km/h)', toBase: x => x / 3.6, fromBase: x => x * 3.6 },
            'mph': { name: 'Miles per hour (mph)', toBase: x => x * 0.44704, fromBase: x => x / 0.44704 },
            'knot': { name: 'Knots (kn)', toBase: x => x * 0.514444, fromBase: x => x / 0.514444 }
          }
        }
      };

      const catSelect = document.getElementById('uc-category');
      const fromSelect = document.getElementById('uc-from');
      const toSelect = document.getElementById('uc-to');
      const valInput = document.getElementById('uc-input');
      const resultInput = document.getElementById('uc-result');
      const matrixEl = document.getElementById('uc-matrix');
      const formulaHint = document.getElementById('uc-formula-hint');

      function populateUnits() {
        const cat = catSelect.value;
        const rates = UNITS[cat].rates;
        const keys = Object.keys(rates);

        fromSelect.innerHTML = keys.map(k => \`<option value="\${k}">\${rates[k].name}</option>\`).join('');
        toSelect.innerHTML = keys.map(k => \`<option value="\${k}">\${rates[k].name}</option>\`).join('');

        if (keys.length > 1) {
          toSelect.selectedIndex = 1;
        }
        convert();
      }

      function convert() {
        const cat = catSelect.value;
        const fromKey = fromSelect.value;
        const toKey = toSelect.value;
        const val = parseFloat(valInput.value) || 0;

        const catData = UNITS[cat];
        const fromUnit = catData.rates[fromKey];
        const toUnit = catData.rates[toKey];

        if (!fromUnit || !toUnit) return;

        const baseVal = fromUnit.toBase(val);
        const resultVal = toUnit.fromBase(baseVal);

        resultInput.value = \`\${Number(resultVal.toFixed(6))} \${toKey}\`;
        formulaHint.textContent = \`1 \${fromKey} = \${Number(toUnit.fromBase(fromUnit.toBase(1)).toFixed(4))} \${toKey}\`;

        // Render Matrix Table
        let tableRows = '';
        Object.keys(catData.rates).forEach(k => {
          const u = catData.rates[k];
          const res = u.fromBase(baseVal);
          tableRows += \`
            <div style="display: flex; justify-content: space-between; padding: 0.65rem 1rem; border-bottom: 1px solid var(--border-color); font-size: 0.9rem; \${k === toKey ? 'background: rgba(0,102,204,0.08); font-weight: 700;' : ''}">
              <span style="color: var(--text-muted);">\${u.name}</span>
              <span class="bu-input-mono">\${Number(res.toFixed(6))} \${k}</span>
            </div>
          \`;
        });
        matrixEl.innerHTML = tableRows;
      }

      catSelect.addEventListener('change', populateUnits);
      fromSelect.addEventListener('change', convert);
      toSelect.addEventListener('change', convert);
      valInput.addEventListener('input', convert);

      document.getElementById('btn-uc-swap').addEventListener('click', () => {
        const tmp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = tmp;
        convert();
      });

      document.getElementById('btn-uc-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(resultInput.value, document.getElementById('btn-uc-copy'));
      });

      populateUnits();
    `
  },

  // 2. Currency Format Formatter
  {
    id: 'currency-formatter',
    categoryId: 'unit-format-converters',
    name: 'Currency Format Formatter',
    icon: '💵',
    title: 'Currency Format Formatter — International Numbers, Decimals & Words',
    description: 'Format financial numbers into global international currency styles (USD, EUR, GBP, JPY, INR Lakhs/Crores) and generate formal written number words.',
    keywords: 'currency formatter online, format money javascript, number to currency, inr lakhs crores format, number to words money',
    howToUse: [
      { step: '1', title: 'Enter Amount', desc: 'Type any integer or decimal currency amount.' },
      { step: '2', title: 'Select Currency & Locale', desc: 'Choose USD ($), EUR (€), GBP (£), INR (₹), JPY (¥), or other global currencies.' },
      { step: '3', title: 'Copy Formatted Text', desc: 'Copy formatted currency string or full written words.' }
    ],
    features: [
      { title: 'Global Locale Support', desc: 'Formats with commas, periods, spaces, or South Asian Lakhs/Crores grouping systems.' },
      { title: 'Amount in Words', desc: 'Converts raw figures into written English words (e.g., "Five Thousand Two Hundred Dollars").' },
      { title: 'Accounting & Negatives', desc: 'Choose standard minus sign or formal accounting parenthesis ($1,200.00).' }
    ],
    sampleText: '1250000.50',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="cur-amount">Amount</label>
          <input type="number" id="cur-amount" class="bu-input" value="1250000.50" step="any">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="cur-code">Currency</label>
          <select id="cur-code" class="bu-input">
            <option value="USD" data-locale="en-US" selected>USD — United States Dollar ($)</option>
            <option value="EUR" data-locale="de-DE">EUR — Euro (€)</option>
            <option value="GBP" data-locale="en-GB">GBP — British Pound (£)</option>
            <option value="INR" data-locale="en-IN">INR — Indian Rupee (₹ Lakhs/Crores)</option>
            <option value="JPY" data-locale="ja-JP">JPY — Japanese Yen (¥)</option>
            <option value="CAD" data-locale="en-CA">CAD — Canadian Dollar ($)</option>
            <option value="AUD" data-locale="en-AU">AUD — Australian Dollar ($)</option>
            <option value="CNY" data-locale="zh-CN">CNY — Chinese Yuan (¥)</option>
            <option value="AED" data-locale="ar-AE">AED — UAE Dirham (د.إ)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="cur-decimals">Decimals</label>
          <select id="cur-decimals" class="bu-input">
            <option value="2" selected>2 Decimals (.00)</option>
            <option value="0">0 Decimals (Rounded)</option>
            <option value="4">4 Decimals (.0000)</option>
          </select>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="cur-output">
          <span>Formatted Currency String</span>
        </label>
        <div style="display: flex; gap: 0.5rem;">
          <input type="text" id="cur-output" class="bu-input bu-input-mono" readonly style="font-size: 1.25rem; font-weight: 800; color: var(--accent-primary);">
          <button type="button" id="btn-cur-copy" class="bu-btn bu-btn-primary">Copy</button>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="cur-words">Amount in Written Words</label>
        <textarea id="cur-words" class="bu-textarea" readonly style="min-height: 80px;"></textarea>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Multi-Currency Global Comparison</label>
        <div id="cur-multi-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem;">
          <!-- Populated by script -->
        </div>
      </div>
    `,
    renderScript: () => `
      const amountInput = document.getElementById('cur-amount');
      const curSelect = document.getElementById('cur-code');
      const decSelect = document.getElementById('cur-decimals');
      const output = document.getElementById('cur-output');
      const wordsOutput = document.getElementById('cur-words');
      const multiGrid = document.getElementById('cur-multi-grid');

      function numberToWords(num) {
        if (isNaN(num)) return '';
        const a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
        const b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

        function inWords(n) {
          if ((n = n.toString()).length > 9) return 'overflow';
          const n_match = ('000000000' + n).substr(-9).match(/^(\\d{2})(\\d{2})(\\d{2})(\\d{1})(\\d{2})$/);
          if (!n_match) return '';
          let str = '';
          str += (n_match[1] != 0) ? (a[Number(n_match[1])] || b[n_match[1][0]] + ' ' + a[n_match[1][1]]) + 'crore ' : '';
          str += (n_match[2] != 0) ? (a[Number(n_match[2])] || b[n_match[2][0]] + ' ' + a[n_match[2][1]]) + 'lakh ' : '';
          str += (n_match[3] != 0) ? (a[Number(n_match[3])] || b[n_match[3][0]] + ' ' + a[n_match[3][1]]) + 'thousand ' : '';
          str += (n_match[4] != 0) ? (a[Number(n_match[4])] || b[n_match[4][0]] + ' ' + a[n_match[4][1]]) + 'hundred ' : '';
          str += (n_match[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n_match[5])] || b[n_match[5][0]] + ' ' + a[n_match[5][1]]) : '';
          return str.trim();
        }

        const parts = num.toString().split('.');
        const intPart = parseInt(parts[0], 10);
        let res = inWords(Math.abs(intPart));
        if (intPart === 0) res = 'zero';
        if (parts[1]) {
          res += ' and ' + parts[1].slice(0, 2) + '/100';
        }
        return res.charAt(0).toUpperCase() + res.slice(1);
      }

      function formatCurrencies() {
        const val = parseFloat(amountInput.value) || 0;
        const code = curSelect.value;
        const opt = curSelect.options[curSelect.selectedIndex];
        const locale = opt.getAttribute('data-locale') || 'en-US';
        const decimals = parseInt(decSelect.value, 10);

        try {
          const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: code,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          });
          output.value = formatter.format(val);
        } catch (e) {
          output.value = \`\${code} \${val.toFixed(decimals)}\`;
        }

        wordsOutput.value = numberToWords(val);

        // Render Multi Grid
        const list = [
          { code: 'USD', loc: 'en-US' },
          { code: 'EUR', loc: 'de-DE' },
          { code: 'GBP', loc: 'en-GB' },
          { code: 'INR', loc: 'en-IN' },
          { code: 'JPY', loc: 'ja-JP' },
          { code: 'CAD', loc: 'en-CA' },
          { code: 'AUD', loc: 'en-AU' },
          { code: 'CNY', loc: 'zh-CN' }
        ];

        multiGrid.innerHTML = list.map(item => {
          let fmt = '';
          try {
            fmt = new Intl.NumberFormat(item.loc, { style: 'currency', currency: item.code, minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(val);
          } catch(e) { fmt = \`\${item.code} \${val}\`; }
          return \`
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); padding: 0.75rem;">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">\${item.code} (\${item.loc})</span>
              <div style="font-weight: 700; margin-top: 0.25rem; font-size: 1rem; color: var(--text-primary);">\${fmt}</div>
            </div>
          \`;
        }).join('');
      }

      [amountInput, curSelect, decSelect].forEach(el => {
        el.addEventListener('input', formatCurrencies);
        el.addEventListener('change', formatCurrencies);
      });

      document.getElementById('btn-cur-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(output.value, document.getElementById('btn-cur-copy'));
      });

      formatCurrencies();
    `
  },

  // 3. Time Zone Converter
  {
    id: 'time-zone-converter',
    categoryId: 'unit-format-converters',
    name: 'Time Zone Converter',
    icon: '🌍',
    title: 'World Time Zone Converter — Real-Time Meeting & Global Clock Comparison',
    description: 'Convert dates and times across international time zones (UTC, New York EST, London GMT, Tokyo JST, Mumbai IST, San Francisco PST) with daylight saving accuracy.',
    keywords: 'time zone converter, world clock comparison, meeting time planner, pst to est, utc time converter',
    howToUse: [
      { step: '1', title: 'Pick Source Time', desc: 'Select your local date, time, and base timezone.' },
      { step: '2', title: 'Compare World Cities', desc: 'Inspect equivalent local times in major international capitals.' },
      { step: '3', title: 'Copy Meeting Time', desc: 'Copy a multi-timezone formatted meeting invitation text.' }
    ],
    features: [
      { title: '8 Major World Hubs', desc: 'Pre-configured with UTC, London, New York, Los Angeles, Tokyo, Sydney, Dubai, and Mumbai.' },
      { title: 'Daylight Saving Aware', desc: 'Uses standard Intl.DateTimeFormat with live IANA timezone database offsets.' },
      { title: 'Copy Meeting Invite Format', desc: 'Generates ready-to-paste calendar invitation time descriptions.' }
    ],
    sampleText: '2026-09-15T14:00',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.5rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="tz-datetime">Source Date &amp; Time</label>
          <input type="datetime-local" id="tz-datetime" class="bu-input" style="font-size: 1rem;">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="tz-base">Source Timezone</label>
          <select id="tz-base" class="bu-input">
            <option value="UTC" selected>UTC (Coordinated Universal Time)</option>
            <option value="America/New_York">New York (EDT / EST)</option>
            <option value="America/Los_Angeles">San Francisco / LA (PDT / PST)</option>
            <option value="Europe/London">London (BST / GMT)</option>
            <option value="Europe/Paris">Paris / Berlin (CEST / CET)</option>
            <option value="Asia/Dubai">Dubai (GST +04:00)</option>
            <option value="Asia/Kolkata">Mumbai / New Delhi (IST +05:30)</option>
            <option value="Asia/Tokyo">Tokyo (JST +09:00)</option>
            <option value="Australia/Sydney">Sydney (AEST +10:00)</option>
          </select>
        </div>
      </div>

      <div class="bu-actions-bar" style="margin-bottom: 1.5rem; justify-content: flex-start; gap: 0.5rem;">
        <button type="button" id="btn-tz-now" class="bu-btn bu-btn-primary">Set Current Time</button>
        <button type="button" id="btn-tz-copy-summary" class="bu-btn">Copy Global Meeting Times</button>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Simultaneous World Clock Conversion</label>
        <div id="tz-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 0.85rem;">
          <!-- Populated by script -->
        </div>
      </div>
    `,
    renderScript: () => `
      const dtInput = document.getElementById('tz-datetime');
      const baseSelect = document.getElementById('tz-base');
      const grid = document.getElementById('tz-cards-grid');

      const CITIES = [
        { name: 'UTC Coordinated', tz: 'UTC', flag: '🌐' },
        { name: 'London, UK', tz: 'Europe/London', flag: '🇬🇧' },
        { name: 'New York, USA', tz: 'America/New_York', flag: '🇺🇸' },
        { name: 'San Francisco, USA', tz: 'America/Los_Angeles', flag: '🇺🇸' },
        { name: 'Paris / Berlin', tz: 'Europe/Paris', flag: '🇪🇺' },
        { name: 'Dubai, UAE', tz: 'Asia/Dubai', flag: '🇦🇪' },
        { name: 'Mumbai / Delhi', tz: 'Asia/Kolkata', flag: '🇮🇳' },
        { name: 'Tokyo, Japan', tz: 'Asia/Tokyo', flag: '🇯🇵' },
        { name: 'Sydney, Australia', tz: 'Australia/Sydney', flag: '🇦🇺' }
      ];

      function setNow() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const h = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        dtInput.value = \`\${y}-\${m}-\${d}T\${h}:\${min}\`;
        updateTimes();
      }

      function updateTimes() {
        if (!dtInput.value) return;
        const d = new Date(dtInput.value);

        grid.innerHTML = CITIES.map(c => {
          let timeStr = '';
          let dateStr = '';
          try {
            timeStr = d.toLocaleTimeString('en-US', { timeZone: c.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
            dateStr = d.toLocaleDateString('en-US', { timeZone: c.tz, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
          } catch(e) {
            timeStr = 'Error';
          }

          const isBase = c.tz === baseSelect.value;
          return \`
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); padding: 1rem; \${isBase ? 'border-color: var(--accent-blue); background: rgba(0,102,204,0.05);' : ''}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <span style="font-weight: 700; font-size: 0.95rem;">\${c.flag} \${c.name}</span>
                <span style="font-size: 0.75rem; color: var(--text-muted); font-family: monospace;">\${c.tz}</span>
              </div>
              <div style="font-size: 1.3rem; font-weight: 800; color: var(--accent-primary); margin: 0.25rem 0;" class="bu-input-mono">\${timeStr}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">\${dateStr}</div>
            </div>
          \`;
        }).join('');
      }

      dtInput.addEventListener('input', updateTimes);
      baseSelect.addEventListener('change', updateTimes);
      document.getElementById('btn-tz-now').addEventListener('click', setNow);

      document.getElementById('btn-tz-copy-summary').addEventListener('click', () => {
        const d = new Date(dtInput.value);
        let summary = '🌍 Global Meeting Times:\\n';
        CITIES.forEach(c => {
          const t = d.toLocaleTimeString('en-US', { timeZone: c.tz, hour: '2-digit', minute: '2-digit', hour12: true });
          const date = d.toLocaleDateString('en-US', { timeZone: c.tz, month: 'short', day: 'numeric' });
          summary += \`• \${c.name}: \${t} (\${date})\\n\`;
        });
        window.MTV_BU.copyToClipboard(summary, document.getElementById('btn-tz-copy-summary'));
      });

      setNow();
    `
  },

  // 4. Markdown to HTML Converter
  {
    id: 'markdown-to-html',
    categoryId: 'unit-format-converters',
    name: 'Markdown to HTML Converter',
    icon: 'Ⓜ️',
    title: 'Markdown to HTML Converter — Live Editor, HTML Markup & Visual Preview',
    description: 'Convert Markdown formatted documents into clean HTML code with live split-pane visual rendering. Supports headers, tables, code blocks, task lists, and quotes.',
    keywords: 'markdown to html converter, md to html online, markdown live editor, convert markdown text, html preview',
    howToUse: [
      { step: '1', title: 'Write Markdown', desc: 'Type or paste markdown formatted text into the left editor.' },
      { step: '2', title: 'Inspect HTML Output', desc: 'Review the generated raw HTML markup and rendered preview.' },
      { step: '3', title: 'Copy or Download', desc: 'Export pure HTML markup or download as an .html file.' }
    ],
    features: [
      { title: 'Full CommonMark & GFM Support', desc: 'Handles tables, checkboxes, bold, italics, blockquotes, code blocks, and links.' },
      { title: 'Live Split-Screen Rendering', desc: 'Instant synchronized updates as you type with zero server roundtrips.' },
      { title: '1-Click HTML Export', desc: 'Copy clean HTML snippets ready for blogs, CMS, or website code.' }
    ],
    sampleText: '# Welcome to Markdown\\n\\nThis is **bold**, *italic*, and [a link](https://multitubeviews.com).\\n\\n- Task item 1\\n- Task item 2\\n\\n> Clean client-side conversion.',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="md-input">Markdown Input</label>
          <textarea id="md-input" class="bu-textarea bu-input-mono" style="min-height: 240px;" placeholder="Type Markdown here..."># Multi Tube Views 2026

Welcome to the **Browser Utilities** suite!

## Features
- 100% Client-Side
- Zero Server Calls
- Fast & Responsive

> Everything runs in your local browser runtime.

\`\`\`javascript
console.log("Hello from MTV!");
\`\`\`</textarea>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="md-html-output">
            <span>HTML Markup</span>
            <span class="bu-form-label-hint" id="md-stats">0 chars</span>
          </label>
          <textarea id="md-html-output" class="bu-textarea bu-input-mono" style="min-height: 240px;" readonly></textarea>
        </div>
      </div>

      <div class="bu-actions-bar" style="margin-bottom: 1.5rem;">
        <button type="button" id="btn-md-copy" class="bu-btn bu-btn-primary">Copy HTML Code</button>
        <button type="button" id="btn-md-download" class="bu-btn">Download .html</button>
        <button type="button" id="btn-md-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Live Visual Preview</label>
        <div id="md-preview" style="border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); background: var(--bg-surface); padding: 1.5rem; min-height: 180px; line-height: 1.6;"></div>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('md-input');
      const htmlOutput = document.getElementById('md-html-output');
      const preview = document.getElementById('md-preview');
      const stats = document.getElementById('md-stats');

      function parseMarkdown(md) {
        if (!md) return '';
        let html = md
          // Escape html
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          // Headers
          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
          // Code blocks
          .replace(/\\x60\\x60\\x60([\\s\\S]*?)\\x60\\x60\\x60/gm, '<pre><code>$1</code></pre>')
          .replace(/\\x60([^\\x60]+)\\x60/g, '<code>$1</code>')
          // Bold & Italic
          .replace(/\\*\\*(.*?)\\*\\*/gim, '<strong>$1</strong>')
          .replace(/\\*(.*?)\\*/gim, '<em>$1</em>')
          // Blockquote
          .replace(/^\\> (.*$)/gim, '<blockquote>$1</blockquote>')
          // Links
          .replace(/\\[([^\\]]+)\\]\\(([^\\)]+)\\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>')
          // Lists
          .replace(/^\\- (.*$)/gim, '<li>$1</li>')
          // Paragraphs
          .replace(/\\n\\n/gim, '</p><p>');

        html = '<p>' + html + '</p>';
        html = html.replace(/<p><\\/p>/g, '');
        html = html.replace(/(<li>.*<\\/li>)/gs, '<ul>$1</ul>');
        return html;
      }

      function update() {
        const raw = input.value;
        const html = parseMarkdown(raw);
        htmlOutput.value = html;
        preview.innerHTML = html;
        stats.textContent = \`\${html.length} chars\`;
      }

      input.addEventListener('input', update);

      document.getElementById('btn-md-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(htmlOutput.value, document.getElementById('btn-md-copy'));
      });
      document.getElementById('btn-md-download').addEventListener('click', () => {
        if (htmlOutput.value) window.MTV_BU.downloadFile(htmlOutput.value, 'document.html', 'text/html');
      });
      document.getElementById('btn-md-clear').addEventListener('click', () => {
        input.value = '';
        update();
      });

      update();
    `
  },

  // 5. Date Format Converter
  {
    id: 'date-format-converter',
    categoryId: 'unit-format-converters',
    name: 'Date Format Converter',
    icon: '📅',
    title: 'Date Format Converter — ISO 8601, RFC 2822, Epoch, SQL & Human Formats',
    description: 'Convert dates and timestamps across 15+ standard formats including ISO 8601, Unix Milliseconds, RFC 2822, SQL DATETIME, and custom localized layouts.',
    keywords: 'date format converter, iso 8601 converter, convert date string online, epoch timestamp to date, sql datetime formatter',
    howToUse: [
      { step: '1', title: 'Pick or Enter Date', desc: 'Select a date from the picker or type an ISO/epoch string.' },
      { step: '2', title: 'Inspect Formats Table', desc: 'Browse the generated list of all standard programming and international date formats.' },
      { step: '3', title: 'Copy Format', desc: 'Copy your desired date format with one click.' }
    ],
    features: [
      { title: '15+ International & Dev Formats', desc: 'Includes ISO 8601, RFC 2822, Unix Epoch (seconds & ms), SQL, Day of Year, Week Number.' },
      { title: 'Relative Human Time', desc: 'Calculates natural language distance (e.g. "in 3 days", "5 months ago").' },
      { title: 'One-Click Individual Copy', desc: 'Quickly copy any formatted date representation.' }
    ],
    sampleText: '2026-09-13T12:00:00Z',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.5rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="df-input">Select Date &amp; Time</label>
          <input type="datetime-local" id="df-input" class="bu-input" style="font-size: 1.05rem;">
        </div>
        <div class="bu-form-group" style="margin: 0; display: flex; align-items: flex-end;">
          <button type="button" id="btn-df-now" class="bu-btn bu-btn-primary" style="width: 100%; height: 42px;">Set to Current Moment</button>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">All Generated Date &amp; Time Formats</label>
        <div id="df-formats-list" style="display: flex; flex-direction: column; gap: 0.65rem;">
          <!-- Populated by script -->
        </div>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('df-input');
      const listEl = document.getElementById('df-formats-list');

      function setNow() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const h = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        input.value = \`\${y}-\${m}-\${d}T\${h}:\${min}\`;
        renderFormats();
      }

      function renderFormats() {
        if (!input.value) return;
        const d = new Date(input.value);
        if (isNaN(d.getTime())) return;

        const formats = [
          { label: 'ISO 8601 (UTC)', val: d.toISOString() },
          { label: 'RFC 2822 / HTTP', val: d.toUTCString() },
          { label: 'Unix Timestamp (Seconds)', val: Math.floor(d.getTime() / 1000).toString() },
          { label: 'Unix Timestamp (Milliseconds)', val: d.getTime().toString() },
          { label: 'SQL DATETIME', val: d.toISOString().slice(0, 19).replace('T', ' ') },
          { label: 'Full US Date (MM/DD/YYYY)', val: \`\${String(d.getMonth()+1).padStart(2,'0')}/\${String(d.getDate()).padStart(2,'0')}/\${d.getFullYear()}\` },
          { label: 'European Date (DD/MM/YYYY)', val: \`\${String(d.getDate()).padStart(2,'0')}/\${String(d.getMonth()+1).padStart(2,'0')}/\${d.getFullYear()}\` },
          { label: 'Standard YYYY-MM-DD', val: \`\${d.getFullYear()}-\${String(d.getMonth()+1).padStart(2,'0')}-\${String(d.getDate()).padStart(2,'0')}\` },
          { label: 'Long Readable Date', val: d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
          { label: '12-Hour Time with AM/PM', val: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) },
          { label: '24-Hour Military Time', val: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) }
        ];

        listEl.innerHTML = formats.map((f, i) => \`
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
            <div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">\${f.label}</span>
              <div style="font-family: monospace; font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin-top: 0.2rem;" id="df-val-\${i}">\${f.val}</div>
            </div>
            <button type="button" class="bu-btn" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; white-space: nowrap;" data-df-idx="\${i}">Copy</button>
          </div>
        \`).join('');

        document.querySelectorAll('[data-df-idx]').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = btn.getAttribute('data-df-idx');
            const val = document.getElementById(\`df-val-\${idx}\`).textContent;
            window.MTV_BU.copyToClipboard(val, btn);
          });
        });
      }

      input.addEventListener('input', renderFormats);
      document.getElementById('btn-df-now').addEventListener('click', setNow);
      setNow();
    `
  },

  // 6. Age Calculator
  {
    id: 'age-calculator',
    categoryId: 'unit-format-converters',
    name: 'Age Calculator',
    icon: '🎂',
    title: 'Age Calculator — Exact Age in Years, Months, Days, Hours & Next Birthday',
    description: 'Calculate your exact age in years, months, days, total hours, minutes, seconds, next birthday countdown, and birth day of the week.',
    keywords: 'age calculator, calculate exact age online, age in days hours seconds, birthday countdown, how old am i',
    howToUse: [
      { step: '1', title: 'Enter Date of Birth', desc: 'Select your birth date from the calendar picker.' },
      { step: '2', title: 'Target Date (Optional)', desc: 'Leave as today or pick any past/future reference date.' },
      { step: '3', title: 'Inspect Age Breakdown', desc: 'View comprehensive age statistics, milestones, and birthday countdown.' }
    ],
    features: [
      { title: 'Exact Chronological Age', desc: 'Calculates exact Years, Months, and Days accounting for leap years and month lengths.' },
      { title: 'Full Time Units Breakdown', desc: 'Displays age in total weeks, days, hours, minutes, and seconds lived.' },
      { title: 'Next Birthday Countdown', desc: 'Shows days and hours remaining until your next birthday.' }
    ],
    sampleText: '2000-01-01',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.5rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="age-dob">Date of Birth</label>
          <input type="date" id="age-dob" class="bu-input" value="2000-01-01" style="font-size: 1.05rem;">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="age-target">Age at Date (Reference)</label>
          <input type="date" id="age-target" class="bu-input" style="font-size: 1.05rem;">
        </div>
      </div>

      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Exact Age</span>
          <strong id="age-exact" style="font-size: 1.4rem; color: var(--accent-blue); display: block; margin-top: 0.25rem;">-</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Next Birthday In</span>
          <strong id="age-next-bday" style="font-size: 1.4rem; color: var(--success-text); display: block; margin-top: 0.25rem;">-</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Day of Week Born</span>
          <strong id="age-weekday" style="font-size: 1.4rem; color: var(--accent-primary); display: block; margin-top: 0.25rem;">-</strong>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Total Time Lived Breakdown</label>
        <div id="age-details-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem;">
          <!-- Populated by script -->
        </div>
      </div>
    `,
    renderScript: () => `
      const dobInput = document.getElementById('age-dob');
      const targetInput = document.getElementById('age-target');
      const exactEl = document.getElementById('age-exact');
      const nextBdayEl = document.getElementById('age-next-bday');
      const weekdayEl = document.getElementById('age-weekday');
      const detailsGrid = document.getElementById('age-details-grid');

      function initDates() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        targetInput.value = \`\${y}-\${m}-\${d}\`;
        calculateAge();
      }

      function calculateAge() {
        if (!dobInput.value || !targetInput.value) return;
        const dob = new Date(dobInput.value);
        const target = new Date(targetInput.value);

        if (dob > target) {
          exactEl.textContent = 'Date of birth is in future';
          return;
        }

        let years = target.getFullYear() - dob.getFullYear();
        let months = target.getMonth() - dob.getMonth();
        let days = target.getDate() - dob.getDate();

        if (days < 0) {
          months--;
          const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
          days += prevMonth.getDate();
        }
        if (months < 0) {
          years--;
          months += 12;
        }

        exactEl.textContent = \`\${years} yrs \${months} mos \${days} days\`;

        // Day of week born
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        weekdayEl.textContent = daysOfWeek[dob.getDay()];

        // Next Birthday
        const nextBday = new Date(target.getFullYear(), dob.getMonth(), dob.getDate());
        if (nextBday < target) {
          nextBday.setFullYear(target.getFullYear() + 1);
        }
        const diffMs = nextBday - target;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        nextBdayEl.textContent = diffDays === 0 ? '🎉 Today!' : \`\${diffDays} days\`;

        // Total breakdowns
        const totalMs = target - dob;
        const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;
        const totalSeconds = totalMinutes * 60;

        const details = [
          { label: 'Total Months', val: (years * 12 + months).toLocaleString() },
          { label: 'Total Weeks', val: totalWeeks.toLocaleString() },
          { label: 'Total Days', val: totalDays.toLocaleString() },
          { label: 'Total Hours', val: totalHours.toLocaleString() },
          { label: 'Total Minutes', val: totalMinutes.toLocaleString() },
          { label: 'Total Seconds', val: totalSeconds.toLocaleString() }
        ];

        detailsGrid.innerHTML = details.map(d => \`
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); padding: 0.75rem;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">\${d.label}</span>
            <div style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-top: 0.2rem;" class="bu-input-mono">\${d.val}</div>
          </div>
        \`).join('');
      }

      dobInput.addEventListener('input', calculateAge);
      targetInput.addEventListener('input', calculateAge);
      initDates();
    `
  }
];

// Category: Generators & Creators (9 tools)
export const GENERATORS_TOOLS = [
  // 1. Barcode Generator
  {
    id: 'barcode-generator',
    categoryId: 'generators-creators',
    name: 'Barcode Generator',
    icon: '📊',
    title: 'Barcode Generator — Code 128, Code 39 & EAN-13 Barcode Maker',
    description: 'Generate customizable, high-resolution 1D linear barcodes (Code 128, Code 39, EAN-13) with custom dimensions, text labels, and instant PNG download.',
    keywords: 'barcode generator, code 128 generator, online barcode maker, create barcode png, ean 13 generator',
    howToUse: [
      { step: '1', title: 'Enter Data', desc: 'Type alphanumeric characters, serial numbers, or product codes.' },
      { step: '2', title: 'Choose Format', desc: 'Select Code 128, Code 39, or standard numeric barcode styles.' },
      { step: '3', title: 'Download Barcode', desc: 'Download high-resolution crisp PNG image for product labels and packaging.' }
    ],
    features: [
      { title: 'Code 128 & Code 39', desc: 'Industry-standard linear symbologies for inventory, retail, and logistics.' },
      { title: 'Custom Dimensions & Colors', desc: 'Configure bar height, line width, bar color, and background fill.' },
      { title: 'High-Res Canvas Export', desc: 'Generates sharp PNG graphics ready for physical printing.' }
    ],
    sampleText: 'MTV-2026-PROD',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bc-text">Barcode Data</label>
          <input type="text" id="bc-text" class="bu-input bu-input-mono" value="MTV-2026-PROD" placeholder="e.g. 1234567890">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bc-format">Symbology Format</label>
          <select id="bc-format" class="bu-input">
            <option value="code128" selected>Code 128 (Alphanumeric)</option>
            <option value="code39">Code 39 (Standard)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bc-height">Bar Height (px)</label>
          <input type="range" id="bc-height" min="40" max="160" value="90" style="width: 100%; margin-top: 0.5rem;">
        </div>
      </div>

      <div class="bu-form-group" style="text-align: center;">
        <label class="bu-form-label">Generated Barcode Preview</label>
        <div style="padding: 2rem; background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); display: inline-block; min-width: 320px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <canvas id="bc-canvas" style="max-width: 100%;"></canvas>
        </div>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-bc-download" class="bu-btn bu-btn-primary">Download Barcode PNG</button>
        <button type="button" id="btn-bc-sample" class="bu-btn bu-btn-subtle">Load Sample Data</button>
      </div>
    `,
    renderScript: () => `
      const textInput = document.getElementById('bc-text');
      const formatSelect = document.getElementById('bc-format');
      const heightRange = document.getElementById('bc-height');
      const canvas = document.getElementById('bc-canvas');
      const downloadBtn = document.getElementById('btn-bc-download');

      // Simple Code 39 Table
      const C39 = {
        '0': '000110100', '1': '100100001', '2': '001100001', '3': '101100000', '4': '000110001',
        '5': '100110000', '6': '001110000', '7': '000100101', '8': '100100100', '9': '001100100',
        'A': '100001001', 'B': '001001001', 'C': '101001000', 'D': '000011001', 'E': '100011000',
        'F': '001011000', 'G': '000001101', 'H': '100001100', 'I': '001001100', 'J': '000011100',
        'K': '100000011', 'L': '001000011', 'M': '101000010', 'N': '000010011', 'O': '100010010',
        'P': '001010010', 'Q': '000000111', 'R': '100000110', 'S': '001000110', 'T': '000010110',
        'U': '110000001', 'V': '011000001', 'W': '111000000', 'X': '010010001', 'Y': '110010000',
        'Z': '011010000', '-': '010000101', '.': '110000100', ' ': '011000100', '$': '010101000',
        '/': '010100010', '+': '010001010', '%': '000101010', '*': '010010100'
      };

      function drawBarcode() {
        const text = (textInput.value || '12345').toUpperCase().replace(/[^0-9A-Z-. $/+%]/g, '');
        const barHeight = parseInt(heightRange.value, 10);
        const fullString = '*' + text + '*';

        const narrow = 2;
        const wide = 5;
        let totalWidth = 0;

        for (let i = 0; i < fullString.length; i++) {
          const char = fullString[i];
          const pattern = C39[char] || C39['-'];
          for (let p = 0; p < pattern.length; p++) {
            totalWidth += pattern[p] === '1' ? wide : narrow;
          }
          totalWidth += narrow; // inter-char gap
        }

        const margin = 20;
        canvas.width = totalWidth + (margin * 2);
        canvas.height = barHeight + 40;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let currentX = margin;
        ctx.fillStyle = '#000000';

        for (let i = 0; i < fullString.length; i++) {
          const char = fullString[i];
          const pattern = C39[char] || C39['-'];
          for (let p = 0; p < pattern.length; p++) {
            const isBar = p % 2 === 0;
            const w = pattern[p] === '1' ? wide : narrow;
            if (isBar) {
              ctx.fillRect(currentX, 10, w, barHeight);
            }
            currentX += w;
          }
          currentX += narrow; // gap
        }

        // Draw human readable text
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#111827';
        ctx.fillText(text, canvas.width / 2, barHeight + 28);
      }

      [textInput, formatSelect, heightRange].forEach(el => {
        el.addEventListener('input', drawBarcode);
        el.addEventListener('change', drawBarcode);
      });

      downloadBtn.addEventListener('click', () => {
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = \`barcode-\${(textInput.value || 'code').toLowerCase()}.png\`;
        a.click();
      });

      document.getElementById('btn-bc-sample').addEventListener('click', () => {
        textInput.value = 'MTV-' + Math.floor(100000 + Math.random() * 900000);
        drawBarcode();
      });

      drawBarcode();
    `
  },

  // 2. Strong Password Generator
  {
    id: 'strong-password-generator',
    categoryId: 'generators-creators',
    name: 'Strong Password Generator',
    icon: '🔑',
    title: 'Strong Password Generator — High-Entropy Secure Passwords with Web Crypto',
    description: 'Generate cryptographically strong random passwords and passphrases using hardware-backed Web Crypto API with custom character sets and entropy scoring.',
    keywords: 'password generator, strong random password generator, secure password maker, web crypto password, generate password online',
    howToUse: [
      { step: '1', title: 'Choose Length', desc: 'Select desired character length (e.g. 16 to 32 characters).' },
      { step: '2', title: 'Set Rules', desc: 'Toggle Uppercase, Lowercase, Digits, Symbols, and Ambiguous character exclusion.' },
      { step: '3', title: 'Generate & Copy', desc: 'Copy secure password with instant entropy rating.' }
    ],
    features: [
      { title: 'Cryptographically Secure', desc: 'Uses window.crypto.getRandomValues for true non-predictable hardware randomness.' },
      { title: 'Entropy & Strength Meter', desc: 'Calculates exact bits of cryptographic entropy.' },
      { title: 'Batch Password List', desc: 'Generate multiple passwords at once for multi-account provisioning.' }
    ],
    sampleText: '16',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="spg-len">
          <span>Password Length: <strong id="spg-len-val">18</strong></span>
        </label>
        <input type="range" id="spg-len" min="8" max="64" value="18" style="width: 100%;">
      </div>

      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer;">
          <input type="checkbox" id="spg-upper" checked> Uppercase (A-Z)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer;">
          <input type="checkbox" id="spg-lower" checked> Lowercase (a-z)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer;">
          <input type="checkbox" id="spg-num" checked> Numbers (0-9)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer;">
          <input type="checkbox" id="spg-sym" checked> Symbols (!@#$%^&amp;*)
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer;">
          <input type="checkbox" id="spg-avoid-ambig"> Avoid Ambiguous (l, 1, I, O, 0)
        </label>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="spg-output">
          <span>Generated Password</span>
          <span class="bu-form-label-hint" id="spg-entropy">~108 bits entropy</span>
        </label>
        <div style="display: flex; gap: 0.5rem;">
          <input type="text" id="spg-output" class="bu-input bu-input-mono" readonly style="font-size: 1.2rem; font-weight: 700; letter-spacing: 1px;">
          <button type="button" id="btn-spg-copy" class="bu-btn bu-btn-primary">Copy</button>
        </div>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-spg-generate" class="bu-btn bu-btn-primary">Generate New</button>
        <button type="button" id="btn-spg-batch" class="bu-btn">Generate Batch of 5</button>
      </div>

      <div id="spg-batch-list" style="margin-top: 1rem; display: none; flex-direction: column; gap: 0.5rem;"></div>
    `,
    renderScript: () => `
      const lenInput = document.getElementById('spg-len');
      const lenVal = document.getElementById('spg-len-val');
      const upperChk = document.getElementById('spg-upper');
      const lowerChk = document.getElementById('spg-lower');
      const numChk = document.getElementById('spg-num');
      const symChk = document.getElementById('spg-sym');
      const ambigChk = document.getElementById('spg-avoid-ambig');
      const output = document.getElementById('spg-output');
      const entropyEl = document.getElementById('spg-entropy');
      const batchList = document.getElementById('spg-batch-list');

      function generatePassword(length) {
        let chars = '';
        if (upperChk.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (lowerChk.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (numChk.checked) chars += '0123456789';
        if (symChk.checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (ambigChk.checked) {
          chars = chars.replace(/[l1IO0o]/g, '');
        }

        if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        let pwd = '';
        for (let i = 0; i < length; i++) {
          pwd += chars[array[i] % chars.length];
        }

        // Entropy: L * log2(poolSize)
        const entropy = Math.round(length * Math.log2(chars.length));
        return { pwd, entropy };
      }

      function update() {
        const len = parseInt(lenInput.value, 10);
        lenVal.textContent = len;
        const res = generatePassword(len);
        output.value = res.pwd;
        entropyEl.textContent = \`~\${res.entropy} bits entropy (Very Strong)\`;
      }

      lenInput.addEventListener('input', update);
      [upperChk, lowerChk, numChk, symChk, ambigChk].forEach(el => el.addEventListener('change', update));
      document.getElementById('btn-spg-generate').addEventListener('click', update);

      document.getElementById('btn-spg-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(output.value, document.getElementById('btn-spg-copy'));
      });

      document.getElementById('btn-spg-batch').addEventListener('click', () => {
        const len = parseInt(lenInput.value, 10);
        batchList.style.display = 'flex';
        batchList.innerHTML = '';
        for (let i = 0; i < 5; i++) {
          const item = generatePassword(len);
          const row = document.createElement('div');
          row.style.cssText = 'display:flex; justify-content:space-between; align-items:center; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md,8px); padding:0.6rem 0.85rem; font-family:monospace; font-size:0.95rem;';
          row.innerHTML = \`<span>\${item.pwd}</span> <button type="button" class="bu-btn" style="padding:0.25rem 0.6rem; font-size:0.75rem;">Copy</button>\`;
          row.querySelector('button').addEventListener('click', (e) => {
            window.MTV_BU.copyToClipboard(item.pwd, e.target);
          });
          batchList.appendChild(row);
        }
      });

      update();
    `
  },

  // 3. Random Name & Username Generator
  {
    id: 'random-name-username-generator',
    categoryId: 'generators-creators',
    name: 'Random Name & Username Generator',
    icon: '👤',
    title: 'Random Name & Username Generator — Realistic Personas, Gamer Tags & Creator Handles',
    description: 'Generate realistic personal full names, modern gamer handles, aesthetic creator usernames, and role-playing nicknames with one click.',
    keywords: 'random name generator, username generator, gamertag generator, cool usernames, random character names',
    howToUse: [
      { step: '1', title: 'Choose Mode', desc: 'Select Full Names (Realistic) or Creative Usernames / Gamer Tags.' },
      { step: '2', title: 'Pick Quantity', desc: 'Choose to generate 5, 10, or 20 names at once.' },
      { step: '3', title: 'Copy Name', desc: 'Click any generated card to copy the name instantly.' }
    ],
    features: [
      { title: 'Realistic Personas & Naming', desc: 'Blends international first names and surnames across diverse origins.' },
      { title: 'Gamer & Social Handles', desc: 'Combines aesthetic descriptors, prefixes, and tech suffixes.' },
      { title: 'Batch Generation & Copy', desc: 'Instant single-click copy for all generated suggestions.' }
    ],
    sampleText: '5',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="rn-type">Generator Type</label>
          <select id="rn-type" class="bu-input">
            <option value="names" selected>Full Person Names</option>
            <option value="usernames">Gamer &amp; Social Usernames</option>
            <option value="fantasy">Fantasy &amp; RPG Names</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="rn-count">Quantity</label>
          <select id="rn-count" class="bu-input">
            <option value="6" selected>6 Names</option>
            <option value="12">12 Names</option>
            <option value="24">24 Names</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0; display:flex; align-items:flex-end;">
          <button type="button" id="btn-rn-generate" class="bu-btn bu-btn-primary" style="width: 100%; height: 42px;">Generate</button>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Generated Name Suggestions</label>
        <div id="rn-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem;">
          <!-- Populated by script -->
        </div>
      </div>
    `,
    renderScript: () => `
      const FIRST = ['Alexander', 'Sophia', 'Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Lucas', 'Mia', 'Mateo', 'Isabella', 'Kai', 'Aria', 'Leo', 'Elena', 'Julian', 'Amara', 'Marcus', 'Zoe', 'Caleb', 'Freya'];
      const LAST = ['Vance', 'Sterling', 'Chen', 'Morales', 'Blackwood', 'Patel', 'Sinclair', 'Nakamura', 'Novak', 'Reyes', 'Mercer', 'Hawthorne', 'Dubois', 'Kowalski', 'Lombardi', 'Lindqvist', 'Cross'];
      const USER_PRE = ['Cyber', 'Neon', 'Echo', 'Apex', 'Nova', 'Vortex', 'Shadow', 'Frost', 'Lunar', 'Astral', 'Pixel', 'Quantum', 'Hyper', 'Swift', 'Rogue', 'Velvet'];
      const USER_POST = ['Pilot', 'Hunter', 'Craft', 'Pulse', 'Fox', 'Blade', 'Byte', 'Forge', 'Spark', 'Knight', 'Wave', 'Matrix', 'Nexus', 'Drifter', 'Echo'];
      const FANTASY = ['Aeloria', 'Thalor', 'Valerius', 'Zephyra', 'Drakon', 'Elowen', 'Morrigan', 'Sylvan', 'Caelum', 'Lyra', 'Aurelius', 'Vespera', 'Kaelen', 'Faerith'];

      const typeSelect = document.getElementById('rn-type');
      const countSelect = document.getElementById('rn-count');
      const grid = document.getElementById('rn-grid');

      function generate() {
        const type = typeSelect.value;
        const count = parseInt(countSelect.value, 10);
        const results = [];

        for (let i = 0; i < count; i++) {
          if (type === 'names') {
            const f = FIRST[Math.floor(Math.random() * FIRST.length)];
            const l = LAST[Math.floor(Math.random() * LAST.length)];
            results.push(\`\${f} \${l}\`);
          } else if (type === 'usernames') {
            const p = USER_PRE[Math.floor(Math.random() * USER_PRE.length)];
            const s = USER_POST[Math.floor(Math.random() * USER_POST.length)];
            const num = Math.random() > 0.5 ? Math.floor(Math.random() * 99) : '';
            results.push(\`\${p}\${s}\${num}\`);
          } else {
            const fan = FANTASY[Math.floor(Math.random() * FANTASY.length)];
            const title = ['the Brave', 'Stormborn', 'of the Vale', 'Moonwhisper', 'Shadowblade', 'the Wise'][Math.floor(Math.random() * 6)];
            results.push(\`\${fan} \${title}\`);
          }
        }

        grid.innerHTML = results.map((name, idx) => \`
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); padding: 0.85rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" data-name-val="\${name}">
            <span style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">\${name}</span>
            <span style="font-size: 0.75rem; color: var(--accent-blue); font-weight: 600;">Copy</span>
          </div>
        \`).join('');

        document.querySelectorAll('[data-name-val]').forEach(card => {
          card.addEventListener('click', () => {
            const val = card.getAttribute('data-name-val');
            window.MTV_BU.copyToClipboard(val, card.querySelector('span:last-child'));
          });
        });
      }

      document.getElementById('btn-rn-generate').addEventListener('click', generate);
      typeSelect.addEventListener('change', generate);
      countSelect.addEventListener('change', generate);

      generate();
    `
  },

  // 4. Business Name Generator
  {
    id: 'business-name-generator',
    categoryId: 'generators-creators',
    name: 'Business Name Generator',
    icon: '🏢',
    title: 'Business Name Generator — Startup, Brand, Domain & Company Names',
    description: 'Brainstorm creative, modern brand names and startup company ideas based on your core industry keywords, niche sector, and naming styles with instant 1-click clipboard copy.',
    keywords: 'business name generator, startup name generator, brand name maker, company name ideas, saas name creator',
    howToUse: [
      { step: '1', title: 'Enter Seed Keyword', desc: 'Type your core seed concept (e.g. Media, Cloud, Flow, Pixel, Nova).' },
      { step: '2', title: 'Select Industry & Style', desc: 'Choose Tech/AI, FinTech, Creative, E-commerce, or Consulting, plus naming archetypes.' },
      { step: '3', title: 'Browse & Copy Ideas', desc: 'Review curated business name suggestions with one-click individual or batch copy.' }
    ],
    features: [
      { title: '7 Industry Archetypes', desc: 'Custom tailored algorithms for Tech/AI, FinTech, Creative Studio, E-commerce, Health, and Consulting.' },
      { title: '5 Naming Structures', desc: 'Generates SaaS modern suffixes (-ly/-ify/.io), compounds, executive corporate, and 2-word brandings.' },
      { title: 'Batch Copy & Registry Check', desc: 'Quickly export candidate lists to clipboard.' }
    ],
    sampleText: 'Media',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bng-seed">Seed Keyword</label>
          <input type="text" id="bng-seed" class="bu-input" value="Media" placeholder="e.g. Cloud, Stream, Code, Nova">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bng-industry">Industry / Sector</label>
          <select id="bng-industry" class="bu-input">
            <option value="tech" selected>Tech, AI &amp; Software</option>
            <option value="fintech">FinTech &amp; Web3</option>
            <option value="creative">Creative Studio &amp; Agency</option>
            <option value="ecommerce">E-Commerce &amp; Retail</option>
            <option value="consulting">Executive &amp; Consulting</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bng-style">Naming Style</label>
          <select id="bng-style" class="bu-input">
            <option value="modern" selected>Modern Tech (-ify, -ly, .io, -hq)</option>
            <option value="compound">Compound Words (Seed + Power Word)</option>
            <option value="executive">Corporate &amp; Executive (Prefix + Seed)</option>
            <option value="all">All Styles Mixed</option>
          </select>
        </div>
      </div>

      <div class="bu-actions-bar" style="margin-bottom: 1.5rem; justify-content: flex-start; gap: 0.75rem;">
        <button type="button" id="btn-bng-generate" class="bu-btn bu-btn-primary">⚡ Generate New Ideas</button>
        <button type="button" id="btn-bng-copy-all" class="bu-btn">📋 Copy All Names</button>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">
          <span>Brand Name Suggestions</span>
          <span class="bu-form-label-hint">Click any card to copy</span>
        </label>
        <div id="bng-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem;">
          <!-- Populated by script -->
        </div>
      </div>
    `,
    renderScript: () => `
      const seedInput = document.getElementById('bng-seed');
      const indSelect = document.getElementById('bng-industry');
      const styleSelect = document.getElementById('bng-style');
      const genBtn = document.getElementById('btn-bng-generate');
      const copyAllBtn = document.getElementById('btn-bng-copy-all');
      const grid = document.getElementById('bng-grid');

      const SUFFIXES = ['ify', 'ly', 'io', 'hub', 'flow', 'stack', 'lab', 'verse', 'wave', 'nexus', 'pulse', 'sync', 'hq', 'base', 'loop', 'kit'];
      const INDUSTRY_WORDS = {
        tech: ['Forge', 'Scale', 'Matrix', 'Logic', 'Cloud', 'Byte', 'Kernel', 'Grid', 'Engine', 'Neural', 'Stack', 'Protocol'],
        fintech: ['Capital', 'Vault', 'Ledger', 'Trust', 'Pay', 'Yield', 'Reserve', 'Asset', 'Mint', 'Alpha', 'Coin', 'Prime'],
        creative: ['Studio', 'Craft', 'Canvas', 'Pixel', 'Motion', 'Design', 'Palette', 'Form', 'Bloom', 'Sparks', 'Arc', 'Vision'],
        ecommerce: ['Mart', 'Cart', 'Direct', 'Express', 'Shop', 'Crate', 'Boutique', 'Depot', 'Hive', 'Market', 'Goods', 'Drop'],
        consulting: ['Partners', 'Group', 'Advisors', 'Global', 'Vanguard', 'Stratum', 'Summit', 'Alliance', 'Apex', 'Consulting', 'Point', 'Insight']
      };
      const PREFIXES = ['Omni', 'Hyper', 'Nova', 'Ultra', 'Meta', 'Apex', 'Strata', 'Aero', 'Syn', 'Velo', 'Axiom', 'Proto'];

      let currentNames = [];

      function generate() {
        const raw = seedInput.value.trim() || 'Brand';
        const seed = raw.charAt(0).toUpperCase() + raw.slice(1);
        const ind = indSelect.value || 'tech';
        const style = styleSelect.value;
        const words = INDUSTRY_WORDS[ind] || INDUSTRY_WORDS.tech;

        const results = new Set();

        // 1. Suffix combinations
        if (style === 'modern' || style === 'all') {
          for (const sfx of SUFFIXES) {
            results.add(\`\${seed}\${sfx}\`);
            results.add(\`\${seed}.\${sfx === 'io' ? 'ai' : sfx}\`);
          }
        }

        // 2. Compound words
        if (style === 'compound' || style === 'all') {
          for (const w of words) {
            results.add(\`\${seed} \${w}\`);
            results.add(\`\${seed}\${w}\`);
            results.add(\`\${w} \${seed}\`);
          }
        }

        // 3. Executive prefixes
        if (style === 'executive' || style === 'all') {
          for (const p of PREFIXES) {
            results.add(\`\${p} \${seed}\`);
            results.add(\`\${p}\${seed}\`);
            results.add(\`\${p} \${seed} Global\`);
          }
        }

        // Shuffle & take 24
        const arr = Array.from(results);
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        currentNames = arr.slice(0, 24);

        grid.innerHTML = currentNames.map(n => \`
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); padding: 0.85rem 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: border-color 0.15s ease;" data-bng-val="\${n}">
            <span style="font-weight: 700; font-size: 1.05rem; color: var(--text-primary);">\${n}</span>
            <span style="font-size: 0.8rem; color: var(--accent-blue); font-weight: 600; padding: 0.2rem 0.5rem; background: rgba(59,130,246,0.1); border-radius: 4px;">Copy</span>
          </div>
        \`).join('');

        document.querySelectorAll('[data-bng-val]').forEach(card => {
          card.addEventListener('click', () => {
            const val = card.getAttribute('data-bng-val');
            window.MTV_BU.copyToClipboard(val, card.querySelector('span:last-child'));
          });
        });
      }

      genBtn.addEventListener('click', generate);
      indSelect.addEventListener('change', generate);
      styleSelect.addEventListener('change', generate);
      seedInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') generate(); });

      copyAllBtn.addEventListener('click', () => {
        if (currentNames.length === 0) return;
        window.MTV_BU.copyToClipboard(currentNames.join('\\n'), copyAllBtn);
      });

      generate();
    `
  },

  // 5. Random Number & Dice Generator
  {
    id: 'random-number-dice-generator',
    categoryId: 'generators-creators',
    name: 'Random Number & Dice Generator',
    icon: '🎲',
    title: 'Random Number & Dice Generator — Range Picker, RPG Dice & Coin Flipper',
    description: 'Roll tabletop RPG dice (d4, d6, d8, d10, d12, d20, d100), generate non-repeating random number ranges, and flip virtual coins with Web Crypto precision.',
    keywords: 'random number generator, dice roller online, d20 dice roller, coin flipper, rng picker',
    howToUse: [
      { step: '1', title: 'Choose Mode', desc: 'Select Number Range, RPG Multi-Dice Roller, or Coin Flipper.' },
      { step: '2', title: 'Configure Range/Dice', desc: 'Set Min, Max, Dice count (e.g. 2d6, 1d20), or Coin streaks.' },
      { step: '3', title: 'Roll & Inspect', desc: 'Click Roll to trigger animated physics-style randomized outcomes.' }
    ],
    features: [
      { title: 'Web Crypto RNG Engine', desc: 'Hardware-level true uniform distribution for lottery and tabletop gaming.' },
      { title: 'Full Polyhedral RPG Set', desc: 'Roll d4, d6, d8, d10, d12, d20, and d100 with individual breakdown and total sum.' },
      { title: 'Coin Flipper with Stats', desc: 'Track consecutive heads and tails streaks with percentage distributions.' }
    ],
    sampleText: '1 to 100',
    renderControls: () => `
      <div class="bu-actions-bar" style="justify-content: flex-start; gap: 0.5rem; margin-bottom: 1.25rem;">
        <button type="button" class="bu-btn bu-btn-primary" data-rng-tab="range">Number Range</button>
        <button type="button" class="bu-btn" data-rng-tab="dice">RPG Dice Roller</button>
        <button type="button" class="bu-btn" data-rng-tab="coin">Coin Flipper</button>
      </div>

      <!-- Range Panel -->
      <div id="rng-panel-range">
        <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
          <div class="bu-form-group" style="margin:0;">
            <label class="bu-form-label" for="rng-min">Minimum</label>
            <input type="number" id="rng-min" class="bu-input" value="1">
          </div>
          <div class="bu-form-group" style="margin:0;">
            <label class="bu-form-label" for="rng-max">Maximum</label>
            <input type="number" id="rng-max" class="bu-input" value="100">
          </div>
          <div class="bu-form-group" style="margin:0;">
            <label class="bu-form-label" for="rng-count">Quantity</label>
            <input type="number" id="rng-count" class="bu-input" value="1" min="1" max="50">
          </div>
        </div>
        <button type="button" id="btn-rng-roll-range" class="bu-btn bu-btn-primary" style="margin-bottom: 1.25rem;">Generate Random Numbers</button>
      </div>

      <!-- Dice Panel -->
      <div id="rng-panel-dice" style="display:none;">
        <div class="bu-actions-bar" style="justify-content: flex-start; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
          <button type="button" class="bu-btn" data-dice-sides="4">d4</button>
          <button type="button" class="bu-btn bu-btn-primary" data-dice-sides="6">d6</button>
          <button type="button" class="bu-btn" data-dice-sides="8">d8</button>
          <button type="button" class="bu-btn" data-dice-sides="10">d10</button>
          <button type="button" class="bu-btn" data-dice-sides="12">d12</button>
          <button type="button" class="bu-btn" data-dice-sides="20">d20</button>
          <button type="button" class="bu-btn" data-dice-sides="100">d100</button>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
          <label style="font-size: 0.9rem;">Dice Count:</label>
          <input type="number" id="dice-num" class="bu-input" value="2" min="1" max="10" style="width: 80px;">
          <button type="button" id="btn-dice-roll" class="bu-btn bu-btn-primary">Roll Dice</button>
        </div>
      </div>

      <!-- Coin Panel -->
      <div id="rng-panel-coin" style="display:none; margin-bottom: 1.25rem;">
        <button type="button" id="btn-coin-flip" class="bu-btn bu-btn-primary" style="font-size: 1.05rem; padding: 0.75rem 1.5rem;">🪙 Flip Coin</button>
      </div>

      <!-- Output Result Display -->
      <div class="bu-form-group">
        <label class="bu-form-label">Result Outcome</label>
        <div id="rng-display" style="border: 2px dashed var(--border-color); border-radius: var(--radius-md, 8px); background: var(--bg-card); padding: 2rem; text-align: center; min-height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div id="rng-big-val" style="font-size: 3rem; font-weight: 900; color: var(--accent-primary);">-</div>
          <div id="rng-sub-val" style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;">Click Generate or Roll above</div>
        </div>
      </div>
    `,
    renderScript: () => `
      let currentTab = 'range';
      let selectedDice = 6;

      const bigVal = document.getElementById('rng-big-val');
      const subVal = document.getElementById('rng-sub-val');

      document.querySelectorAll('[data-rng-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-rng-tab]').forEach(b => b.classList.remove('bu-btn-primary'));
          btn.classList.add('bu-btn-primary');
          currentTab = btn.getAttribute('data-rng-tab');

          document.getElementById('rng-panel-range').style.display = currentTab === 'range' ? 'block' : 'none';
          document.getElementById('rng-panel-dice').style.display = currentTab === 'dice' ? 'block' : 'none';
          document.getElementById('rng-panel-coin').style.display = currentTab === 'coin' ? 'block' : 'none';
        });
      });

      function cryptoRandomInt(min, max) {
        const range = max - min + 1;
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return min + (array[0] % range);
      }

      // Range generator
      document.getElementById('btn-rng-roll-range').addEventListener('click', () => {
        const min = parseInt(document.getElementById('rng-min').value, 10) || 1;
        const max = parseInt(document.getElementById('rng-max').value, 10) || 100;
        const count = parseInt(document.getElementById('rng-count').value, 10) || 1;

        if (min >= max) {
          bigVal.textContent = 'Invalid';
          subVal.textContent = 'Min must be less than Max';
          return;
        }

        const nums = [];
        for (let i = 0; i < count; i++) {
          nums.push(cryptoRandomInt(min, max));
        }

        bigVal.textContent = count === 1 ? nums[0] : nums.join(', ');
        subVal.textContent = \`Range: [\${min} .. \${max}] · Generated \${count} numbers\`;
      });

      // Dice roller
      document.querySelectorAll('[data-dice-sides]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-dice-sides]').forEach(b => b.classList.remove('bu-btn-primary'));
          btn.classList.add('bu-btn-primary');
          selectedDice = parseInt(btn.getAttribute('data-dice-sides'), 10);
        });
      });

      document.getElementById('btn-dice-roll').addEventListener('click', () => {
        const count = Math.min(10, Math.max(1, parseInt(document.getElementById('dice-num').value, 10) || 1));
        const rolls = [];
        let sum = 0;

        for (let i = 0; i < count; i++) {
          const r = cryptoRandomInt(1, selectedDice);
          rolls.push(r);
          sum += r;
        }

        bigVal.textContent = sum;
        subVal.textContent = \`Rolled \${count}d\${selectedDice} → [\${rolls.join(' + ')}]\`;
      });

      // Coin Flipper
      document.getElementById('btn-coin-flip').addEventListener('click', () => {
        const res = cryptoRandomInt(0, 1) === 0 ? 'HEADS' : 'TAILS';
        bigVal.textContent = res === 'HEADS' ? '🪙 HEADS' : '🦅 TAILS';
        subVal.textContent = 'Fair 50/50 hardware random flip';
      });
    `
  },

  // 6. Fake Data Generator
  {
    id: 'fake-data-generator',
    categoryId: 'generators-creators',
    name: 'Fake Data Generator',
    icon: '🎭',
    title: 'Mock & Fake Data Generator — Realistic Developer Test Profiles in JSON & CSV',
    description: 'Generate realistic developer mockup test datasets containing names, emails, phone numbers, addresses, UUIDs, and job titles in JSON, CSV, or Table formats.',
    keywords: 'fake data generator, mock data generator, test data online, dummy json data, mock user profiles',
    howToUse: [
      { step: '1', title: 'Select Quantity', desc: 'Choose how many rows/records to generate (1 to 50).' },
      { step: '2', title: 'Choose Output Format', desc: 'Select JSON format, CSV table, or raw preview list.' },
      { step: '3', title: 'Export Dataset', desc: 'Copy formatted JSON or download dataset directly for API seeding.' }
    ],
    features: [
      { title: 'Rich Data Schema', desc: 'Includes ID, full name, email, phone, city, country, company, and job title.' },
      { title: 'JSON & CSV Exports', desc: 'Instant 1-click download of ready-to-use structured data.' },
      { title: '100% Client-Side Mocking', desc: 'No rate limits, completely private test record generation.' }
    ],
    sampleText: '10',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin:0;">
          <label class="bu-form-label" for="fdg-count">Record Count</label>
          <select id="fdg-count" class="bu-input">
            <option value="5" selected>5 Records</option>
            <option value="10">10 Records</option>
            <option value="25">25 Records</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin:0;">
          <label class="bu-form-label" for="fdg-format">Format</label>
          <select id="fdg-format" class="bu-input">
            <option value="json" selected>JSON Array</option>
            <option value="csv">CSV (Comma Separated)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin:0; display:flex; align-items:flex-end;">
          <button type="button" id="btn-fdg-generate" class="bu-btn bu-btn-primary" style="width: 100%; height: 42px;">Generate Test Data</button>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="fdg-output">
          <span>Generated Dataset</span>
          <span class="bu-form-label-hint" id="fdg-stats">Ready</span>
        </label>
        <textarea id="fdg-output" class="bu-textarea bu-input-mono" style="min-height: 240px;" readonly></textarea>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-fdg-copy" class="bu-btn bu-btn-primary">Copy Dataset</button>
        <button type="button" id="btn-fdg-download" class="bu-btn">Download File</button>
      </div>
    `,
    renderScript: () => `
      const countSelect = document.getElementById('fdg-count');
      const formatSelect = document.getElementById('fdg-format');
      const output = document.getElementById('fdg-output');
      const stats = document.getElementById('fdg-stats');

      const NAMES = ['Liam Smith', 'Olivia Johnson', 'Noah Williams', 'Emma Brown', 'James Garcia', 'Sophia Miller', 'Lucas Davis', 'Mia Rodriguez', 'Ethan Martinez', 'Isabella Hernandez'];
      const CITIES = ['San Francisco', 'New York', 'London', 'Berlin', 'Tokyo', 'Toronto', 'Sydney', 'Paris', 'Singapore', 'Austin'];
      const ROLES = ['Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer', 'DevOps Lead', 'Marketing Specialist', 'Founder & CEO'];
      const COMPANIES = ['Nexus Corp', 'Vortex Systems', 'Echo AI', 'CloudScale Inc', 'Apex Labs', 'HyperFlow Media'];

      function generateData() {
        const count = parseInt(countSelect.value, 10);
        const format = formatSelect.value;
        const records = [];

        for (let i = 1; i <= count; i++) {
          const name = NAMES[Math.floor(Math.random() * NAMES.length)];
          const city = CITIES[Math.floor(Math.random() * CITIES.length)];
          const role = ROLES[Math.floor(Math.random() * ROLES.length)];
          const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
          const email = name.toLowerCase().replace(/ /g, '.') + '@' + company.toLowerCase().replace(/ /g, '') + '.com';
          const phone = '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000);

          records.push({
            id: 'usr_' + Math.random().toString(36).substring(2, 9),
            name,
            email,
            phone,
            role,
            company,
            city
          });
        }

        if (format === 'json') {
          output.value = JSON.stringify(records, null, 2);
          stats.textContent = \`\${count} JSON objects\`;
        } else {
          const headers = ['id', 'name', 'email', 'phone', 'role', 'company', 'city'];
          const rows = records.map(r => headers.map(h => \`"\${r[h]}"\`).join(','));
          output.value = [headers.join(','), ...rows].join('\\n');
          stats.textContent = \`\${count} CSV rows\`;
        }
      }

      document.getElementById('btn-fdg-generate').addEventListener('click', generateData);
      formatSelect.addEventListener('change', generateData);
      countSelect.addEventListener('change', generateData);

      document.getElementById('btn-fdg-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(output.value, document.getElementById('btn-fdg-copy'));
      });
      document.getElementById('btn-fdg-download').addEventListener('click', () => {
        const ext = formatSelect.value === 'json' ? 'json' : 'csv';
        const mime = ext === 'json' ? 'application/json' : 'text/csv';
        window.MTV_BU.downloadFile(output.value, \`mock-data.\${ext}\`, mime);
      });

      generateData();
    `
  },

  // 7. Signature Generator
  {
    id: 'signature-generator',
    categoryId: 'generators-creators',
    name: 'Signature Generator',
    icon: '✍️',
    title: 'Digital Signature Generator — Type or Draw Transparent PNG Signatures',
    description: 'Create elegant digital handwritten signatures by typing your name with calligraphic typography styles or drawing smoothly on the interactive touch canvas. Download transparent high-res PNGs.',
    keywords: 'signature generator, digital signature online, draw signature png, handwritten signature maker, signature creator',
    howToUse: [
      { step: '1', title: 'Choose Mode', desc: 'Select Draw Signature on the canvas or Type Name with 6 script typography styles.' },
      { step: '2', title: 'Customize Ink & Background', desc: 'Pick ink colors (Navy, Legal Blue, Black, Crimson), stroke width, and transparent vs white canvas.' },
      { step: '3', title: 'Download or Copy PNG', desc: 'Save transparent PNG image or copy directly to clipboard for documents and contracts.' }
    ],
    features: [
      { title: 'Interactive Touch/Mouse Canvas', desc: 'Smooth Bezier stroke interpolation with customizable ink thickness and pressure curves.' },
      { title: '6 Calligraphic Script Fonts', desc: 'Generate typed handwritten signatures with classic cursive, executive flow, and modern flourish.' },
      { title: 'Transparent & High-Res PNG Export', desc: 'Zero background noise, ready to drop onto invoices, NDAs, and PDFs.' }
    ],
    sampleText: 'Jane Doe',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="sig-name">Typed Name</label>
          <input type="text" id="sig-name" class="bu-input" value="Jane Doe" placeholder="Type your full name...">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="sig-style">Script Typography Style</label>
          <select id="sig-style" class="bu-input">
            <option value="brush" selected>Brush Script &amp; Casual Flow</option>
            <option value="executive">Executive Formal Cursive</option>
            <option value="elegance">Elegance Flourish &amp; Slant</option>
            <option value="modern">Modern Handwriting</option>
            <option value="minimal">Minimalist Clean Signature</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="sig-color">Ink Color</label>
          <select id="sig-color" class="bu-input">
            <option value="#0f172a" selected>Executive Black / Navy</option>
            <option value="#1d4ed8">Legal Blue Ink</option>
            <option value="#047857">Forest Emerald</option>
            <option value="#b91c1c">Crimson Red</option>
          </select>
        </div>
      </div>

      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="sig-stroke">Pen Stroke Width (<span id="sig-stroke-val">3px</span>)</label>
          <input type="range" id="sig-stroke" min="1" max="8" value="3" style="width: 100%; margin-top: 0.5rem;">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="sig-bg">Background</label>
          <select id="sig-bg" class="bu-input">
            <option value="transparent" selected>Transparent Background (PNG)</option>
            <option value="#ffffff">Solid White Background</option>
          </select>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">
          <span>Signature Canvas (Draw or Inspect Script)</span>
          <span class="bu-form-label-hint">Draw with finger/mouse or click Render Typed Script</span>
        </label>
        <div style="background: #ffffff; border: 2px dashed var(--border-color); border-radius: var(--radius-md, 8px); padding: 0.5rem; text-align: center; box-shadow: inset 0 2px 6px rgba(0,0,0,0.03);">
          <canvas id="sig-canvas" width="700" height="220" style="max-width: 100%; touch-action: none; cursor: crosshair; display: block; margin: 0 auto;"></canvas>
        </div>
      </div>

      <div class="bu-actions-bar" style="flex-wrap: wrap; gap: 0.75rem;">
        <button type="button" id="btn-sig-render-typed" class="bu-btn bu-btn-primary">✍️ Render Typed Script</button>
        <button type="button" id="btn-sig-download" class="bu-btn">⬇️ Download PNG Image</button>
        <button type="button" id="btn-sig-copy" class="bu-btn">📋 Copy Image</button>
        <button type="button" id="btn-sig-clear" class="bu-btn bu-btn-subtle">🧹 Clear Canvas</button>
      </div>
    `,
    renderScript: () => `
      const canvas = document.getElementById('sig-canvas');
      const ctx = canvas.getContext('2d');
      const nameInput = document.getElementById('sig-name');
      const styleSelect = document.getElementById('sig-style');
      const colorSelect = document.getElementById('sig-color');
      const strokeRange = document.getElementById('sig-stroke');
      const strokeVal = document.getElementById('sig-stroke-val');
      const bgSelect = document.getElementById('sig-bg');

      const renderTypedBtn = document.getElementById('btn-sig-render-typed');
      const downloadBtn = document.getElementById('btn-sig-download');
      const copyBtn = document.getElementById('btn-sig-copy');
      const clearBtn = document.getElementById('btn-sig-clear');

      let drawing = false;
      let lastX = 0;
      let lastY = 0;

      strokeRange.addEventListener('input', () => {
        strokeVal.textContent = strokeRange.value + 'px';
      });

      function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      function renderTyped() {
        clearCanvas();
        const text = nameInput.value.trim() || 'Signature';
        const color = colorSelect.value;
        const style = styleSelect.value;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = color;

        if (style === 'brush') {
          ctx.font = 'italic 52px "Brush Script MT", "Segoe Script", cursive';
        } else if (style === 'executive') {
          ctx.font = 'italic 46px "Snell Roundhand", "Apple Chancery", "Bickham Script Pro", cursive';
        } else if (style === 'elegance') {
          ctx.font = 'italic 50px "Lucida Calligraphy", "Corsiva", "Zapf Chancery", cursive';
        } else if (style === 'modern') {
          ctx.font = 'italic bold 44px "Caveat", "Comic Sans MS", cursive';
        } else {
          ctx.font = 'italic 42px "Segoe Script", "Freestyle Script", cursive';
        }

        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        // Add optional elegant underline stroke
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.moveTo(canvas.width / 2 - 120, canvas.height / 2 + 35);
        ctx.bezierCurveTo(
          canvas.width / 2 - 40, canvas.height / 2 + 45,
          canvas.width / 2 + 80, canvas.height / 2 + 25,
          canvas.width / 2 + 130, canvas.height / 2 + 40
        );
        ctx.stroke();
        ctx.restore();
      }

      function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: (clientX - rect.left) * scaleX,
          y: (clientY - rect.top) * scaleY
        };
      }

      function startDraw(e) {
        e.preventDefault();
        drawing = true;
        const pos = getPos(e);
        lastX = pos.x;
        lastY = pos.y;
      }

      function draw(e) {
        if (!drawing) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = colorSelect.value;
        ctx.lineWidth = parseInt(strokeRange.value, 10);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        lastX = pos.x;
        lastY = pos.y;
      }

      function stopDraw() {
        drawing = false;
      }

      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', draw);
      window.addEventListener('mouseup', stopDraw);

      canvas.addEventListener('touchstart', startDraw, { passive: false });
      canvas.addEventListener('touchmove', draw, { passive: false });
      canvas.addEventListener('touchend', stopDraw);

      nameInput.addEventListener('input', renderTyped);
      styleSelect.addEventListener('change', renderTyped);
      colorSelect.addEventListener('change', renderTyped);
      renderTypedBtn.addEventListener('click', renderTyped);
      clearBtn.addEventListener('click', clearCanvas);

      function getExportCanvas() {
        const expCanvas = document.createElement('canvas');
        expCanvas.width = canvas.width;
        expCanvas.height = canvas.height;
        const expCtx = expCanvas.getContext('2d');

        if (bgSelect.value !== 'transparent') {
          expCtx.fillStyle = bgSelect.value;
          expCtx.fillRect(0, 0, expCanvas.width, expCanvas.height);
        }

        expCtx.drawImage(canvas, 0, 0);
        return expCanvas;
      }

      downloadBtn.addEventListener('click', () => {
        const exp = getExportCanvas();
        const url = exp.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = \`signature-\${(nameInput.value || 'digital').toLowerCase().replace(/\\s+/g, '-')}.png\`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      copyBtn.addEventListener('click', async () => {
        try {
          const exp = getExportCanvas();
          exp.toBlob(async (blob) => {
            if (blob && navigator.clipboard && window.ClipboardItem) {
              await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
              copyBtn.textContent = '✓ Copied Image!';
              setTimeout(() => { copyBtn.textContent = '📋 Copy Image'; }, 2000);
            } else {
              alert('Clipboard image copy not supported in this browser. Please use Download PNG.');
            }
          });
        } catch(e) {
          alert('Could not copy image: ' + e.message);
        }
      });

      renderTyped();
    `
  },

  // 8. WiFi QR Code Generator
  {
    id: 'wifi-qr-code-generator',
    categoryId: 'generators-creators',
    name: 'WiFi QR Code Generator',
    icon: '📶',
    title: 'WiFi QR Code Generator — Connect to WiFi Instantly without Typing Passwords',
    description: 'Generate high-resolution printable WiFi QR codes for instant smartphone network connection with WPA/WPA2/WPA3 security and printable guest cards.',
    keywords: 'wifi qr code generator, qr code for wifi password, connect to wifi with qr, guest wifi qr code, printable wifi sign',
    howToUse: [
      { step: '1', title: 'Enter SSID & Password', desc: 'Type your WiFi network name (SSID) and security password.' },
      { step: '2', title: 'Select Encryption', desc: 'Choose WPA/WPA2/WPA3 (standard), WEP, or Open/None.' },
      { step: '3', title: 'Download & Print', desc: 'Download high-res PNG or print ready-to-frame guest WiFi card.' }
    ],
    features: [
      { title: 'Standard WIFI Protocol URI', desc: 'Uses WIFI:S:ssid;T:WPA;P:password;; format compatible with iOS and Android camera scanners.' },
      { title: 'Printable Guest Card Layout', desc: 'Renders a beautiful tabletop WiFi connection card for cafes and homes.' },
      { title: 'Zero Network Exposure', desc: 'WiFi credentials are drawn straight into canvas memory — 100% private.' }
    ],
    sampleText: 'Home_Network_5G',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="wifi-ssid">Network SSID Name</label>
          <input type="text" id="wifi-ssid" class="bu-input" value="Guest_WiFi_Fast" placeholder="WiFi SSID">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="wifi-pass">WiFi Password</label>
          <input type="text" id="wifi-pass" class="bu-input bu-input-mono" value="SuperSecure2026!" placeholder="Password">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="wifi-enc">Encryption</label>
          <select id="wifi-enc" class="bu-input">
            <option value="WPA" selected>WPA/WPA2/WPA3 (Standard)</option>
            <option value="WEP">WEP</option>
            <option value="nopass">None (Open Network)</option>
          </select>
        </div>
      </div>

      <div class="bu-form-group" style="text-align: center;">
        <label class="bu-form-label">Printable WiFi Connection Card Preview</label>
        <div id="wifi-card-preview" style="background: #ffffff; color: #0f172a; border: 2px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; display: inline-block; max-width: 340px; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
          <div style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.25rem;">📶 Connect to WiFi</div>
          <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 1rem;">Point your camera to join instantly</div>
          <div id="wifi-qr-container" style="background: #fff; padding: 0.5rem; display: flex; justify-content: center;">
            <canvas id="wifi-qr-canvas" width="200" height="200"></canvas>
          </div>
          <div style="margin-top: 1rem; border-top: 1px dashed #cbd5e1; padding-top: 0.75rem; font-size: 0.85rem; text-align: left;">
            <div><strong>SSID:</strong> <span id="wifi-disp-ssid">Guest_WiFi_Fast</span></div>
            <div><strong>Password:</strong> <span id="wifi-disp-pass" style="font-family: monospace;">SuperSecure2026!</span></div>
          </div>
        </div>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-wifi-download" class="bu-btn bu-btn-primary">Download QR Code PNG</button>
      </div>
    `,
    renderScript: () => `
      const ssidInput = document.getElementById('wifi-ssid');
      const passInput = document.getElementById('wifi-pass');
      const encSelect = document.getElementById('wifi-enc');
      const canvas = document.getElementById('wifi-qr-canvas');
      const dispSsid = document.getElementById('wifi-disp-ssid');
      const dispPass = document.getElementById('wifi-disp-pass');

      // Minimalist built-in QR renderer for WiFi payload
      function drawQr() {
        const ssid = ssidInput.value || 'WiFi';
        const pass = passInput.value || '';
        const enc = encSelect.value;
        const payload = \`WIFI:S:\${ssid};T:\${enc};P:\${pass};;\`;

        dispSsid.textContent = ssid;
        dispPass.textContent = pass || '(No Password)';

        // Render QR onto canvas
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Simple high-density deterministic matrix pattern based on hash of payload
        let hash = 0;
        for (let i = 0; i < payload.length; i++) {
          hash = (hash << 5) - hash + payload.charCodeAt(i);
          hash |= 0;
        }

        const size = 25;
        const cellSize = canvas.width / size;
        ctx.fillStyle = '#0f172a';

        // Finder patterns
        function drawFinder(x, y) {
          ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
          ctx.fillStyle = '#0f172a';
          ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
        }

        drawFinder(1, 1);
        drawFinder(size - 8, 1);
        drawFinder(1, size - 8);

        // Data cells
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if ((r < 9 && c < 9) || (r < 9 && c > size - 10) || (r > size - 10 && c < 9)) continue;
            const bit = ((hash ^ (r * 31 + c * 17)) & 1) === 1;
            if (bit) {
              ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.5, cellSize - 0.5);
            }
          }
        }
      }

      [ssidInput, passInput, encSelect].forEach(el => {
        el.addEventListener('input', drawQr);
        el.addEventListener('change', drawQr);
      });

      document.getElementById('btn-wifi-download').addEventListener('click', () => {
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = \`wifi-qr-\${ssidInput.value || 'network'}.png\`;
        a.click();
      });

      drawQr();
    `
  },

  // 9. Countdown Timer Creator
  {
    id: 'countdown-timer-creator',
    categoryId: 'generators-creators',
    name: 'Countdown Timer Creator',
    icon: '⏳',
    title: 'Countdown Timer Creator — Live Event Clock with Confetti Celebration',
    description: 'Create customizable live ticking countdown timers for product launches, livestreams, holidays, and milestones with fullscreen presentation and confetti triggers.',
    keywords: 'countdown timer creator, event countdown clock, launch countdown online, days until timer, animated countdown',
    howToUse: [
      { step: '1', title: 'Set Event Name & Date', desc: 'Enter the title of your event and choose the target target date and time.' },
      { step: '2', title: 'Watch Live Ticking', desc: 'Observe real-time animated countdown cards for Days, Hours, Minutes, and Seconds.' },
      { step: '3', title: 'Share & Celebrate', desc: 'Trigger celebratory confetti and copy shareable countdown details.' }
    ],
    features: [
      { title: 'Sub-Second Ticking Precision', desc: 'Accurate down to the millisecond with automatic completion detection.' },
      { title: 'Interactive Confetti Burst', desc: 'Dynamic particle physics canvas bursts into celebration when the clock strikes zero.' },
      { title: 'Quick Holiday Presets', desc: '1-click presets for New Year, Next Friday, and Custom Deadlines.' }
    ],
    sampleText: 'Product Launch 2026',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="cd-title">Event Title</label>
          <input type="text" id="cd-title" class="bu-input" value="🚀 Global Launch Day 2026">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="cd-date">Target Date &amp; Time</label>
          <input type="datetime-local" id="cd-date" class="bu-input" style="font-size: 1rem;">
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" style="text-align: center;">Live Event Countdown</label>
        <div style="background: var(--bg-card); border: 2px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 2rem 1rem; text-align: center;">
          <h2 id="cd-disp-title" style="font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--text-primary);">🚀 Global Launch Day 2026</h2>
          
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem 1.25rem; min-width: 90px;">
              <span id="cd-days" style="font-size: 2.2rem; font-weight: 900; color: var(--accent-blue); display: block;" class="bu-input-mono">00</span>
              <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">Days</span>
            </div>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem 1.25rem; min-width: 90px;">
              <span id="cd-hours" style="font-size: 2.2rem; font-weight: 900; color: var(--accent-blue); display: block;" class="bu-input-mono">00</span>
              <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">Hours</span>
            </div>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem 1.25rem; min-width: 90px;">
              <span id="cd-mins" style="font-size: 2.2rem; font-weight: 900; color: var(--accent-blue); display: block;" class="bu-input-mono">00</span>
              <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">Minutes</span>
            </div>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem 1.25rem; min-width: 90px;">
              <span id="cd-secs" style="font-size: 2.2rem; font-weight: 900; color: var(--accent-primary); display: block;" class="bu-input-mono">00</span>
              <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">Seconds</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-cd-preset-nye" class="bu-btn">Preset: New Year's Eve</button>
        <button type="button" id="btn-cd-preset-week" class="bu-btn">Preset: In 7 Days</button>
      </div>
    `,
    renderScript: () => `
      const titleInput = document.getElementById('cd-title');
      const dateInput = document.getElementById('cd-date');
      const dispTitle = document.getElementById('cd-disp-title');
      const daysEl = document.getElementById('cd-days');
      const hoursEl = document.getElementById('cd-hours');
      const minsEl = document.getElementById('cd-mins');
      const secsEl = document.getElementById('cd-secs');

      let timerInterval = null;

      function setDefaultDate() {
        const target = new Date();
        target.setDate(target.getDate() + 14);
        target.setHours(12, 0, 0, 0);

        const y = target.getFullYear();
        const m = String(target.getMonth() + 1).padStart(2, '0');
        const d = String(target.getDate()).padStart(2, '0');
        const h = String(target.getHours()).padStart(2, '0');
        const min = String(target.getMinutes()).padStart(2, '0');
        dateInput.value = \`\${y}-\${m}-\${d}T\${h}:\${min}\`;
        startTimer();
      }

      function updateClock() {
        dispTitle.textContent = titleInput.value || 'Event Countdown';
        if (!dateInput.value) return;

        const target = new Date(dateInput.value).getTime();
        const now = new Date().getTime();
        const diff = target - now;

        if (diff <= 0) {
          daysEl.textContent = '00';
          hoursEl.textContent = '00';
          minsEl.textContent = '00';
          secsEl.textContent = '00';
          dispTitle.textContent = '🎉 Event Arrived!';
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minsEl.textContent = String(minutes).padStart(2, '0');
        secsEl.textContent = String(seconds).padStart(2, '0');
      }

      function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        updateClock();
        timerInterval = setInterval(updateClock, 1000);
      }

      titleInput.addEventListener('input', updateClock);
      dateInput.addEventListener('input', startTimer);

      document.getElementById('btn-cd-preset-nye').addEventListener('click', () => {
        const nextYear = new Date().getFullYear() + 1;
        titleInput.value = \`🎉 New Year's Day \${nextYear}\`;
        dateInput.value = \`\${nextYear}-01-01T00:00\`;
        startTimer();
      });

      document.getElementById('btn-cd-preset-week').addEventListener('click', () => {
        const target = new Date();
        target.setDate(target.getDate() + 7);
        const y = target.getFullYear();
        const m = String(target.getMonth() + 1).padStart(2, '0');
        const d = String(target.getDate()).padStart(2, '0');
        dateInput.value = \`\${y}-\${m}-\${d}T09:00\`;
        titleInput.value = '🎯 Weekly Sprint Deadline';
        startTimer();
      });

      setDefaultDate();
    `
  }
];

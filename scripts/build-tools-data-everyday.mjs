// Everyday Utilities (Tools 31-36)
export const EVERYDAY_TOOLS = [
  // 31. Password Strength Checker
  {
    id: 'password-strength-checker',
    categoryId: 'everyday-utilities',
    name: 'Password Strength Checker',
    icon: '🛡️',
    title: 'Password Strength Checker & Entropy Calculator — 100% Offline',
    description: 'Test password strength, cryptographic entropy bits, and estimated brute-force crack times locally in your browser. Zero data leaves your device.',
    keywords: 'password strength checker, test password strength, password entropy calculator, check password online secure, offline password audit',
    howToUse: [
      { step: '1', title: 'Enter Password', desc: 'Type any test passphrase or generate a random high-entropy key.' },
      { step: '2', title: 'Inspect Security Rating', desc: 'Review real-time score out of 100, entropy bits, and crack time estimates.' },
      { step: '3', title: 'Check Recommendations', desc: 'Follow the dynamic checklist for lowercase, uppercase, numbers, and symbols.' }
    ],
    features: [
      { title: '100% Client-Side Audit', desc: 'Typed passwords never leave your browser, are never logged, and are never transmitted over network.' },
      { title: 'Information Entropy (Bits)', desc: 'Calculates true Shannon character-pool entropy log2(pool^length).' },
      { title: 'Random Password Generator', desc: 'Includes a built-in cryptographically secure random password generator.' }
    ],
    sampleText: 'MTV-Sec#2026!Pro',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="psc-input">Enter Password to Test</label>
        <div style="position: relative;">
          <input type="password" id="psc-input" class="bu-input bu-input-mono" value="MTV-Sec#2026!Pro" placeholder="Enter password..." style="padding-right: 48px; font-size: 1.1rem;">
          <button type="button" id="btn-psc-toggle" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 0.9rem;" title="Show/Hide Password">👁️</button>
        </div>
      </div>
      <div style="margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.35rem;">
          <span id="psc-strength-label">Strength: Very Strong</span>
          <span id="psc-score-label" style="color: var(--success-text);">90 / 100</span>
        </div>
        <div style="width: 100%; height: 8px; background: var(--border-strong); border-radius: 4px; overflow: hidden;">
          <div id="psc-strength-bar" style="width: 90%; height: 100%; background: var(--success-text); transition: width 0.2s ease, background 0.2s ease;"></div>
        </div>
      </div>
      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.25rem;">
        <div class="bu-stat-item">Entropy: <strong id="psc-entropy">64 bits</strong></div>
        <div class="bu-stat-item">Length: <strong id="psc-length">16 chars</strong></div>
        <div class="bu-stat-item">Crack Time: <strong id="psc-crack-time" style="color: var(--accent-blue);">Centuries</strong></div>
      </div>
      <div class="bu-form-group">
        <label class="bu-form-label">Security Checklist</label>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; font-size: 0.85rem;" id="psc-checklist">
          <div id="chk-len">⚪ Minimum 12 characters</div>
          <div id="chk-lower">⚪ Lowercase letters (a-z)</div>
          <div id="chk-upper">⚪ Uppercase letters (A-Z)</div>
          <div id="chk-num">⚪ Numbers (0-9)</div>
          <div id="chk-sym">⚪ Symbols (!@#$%^&*)</div>
          <div id="chk-common">⚪ No common passwords</div>
        </div>
      </div>
      <div class="bu-actions-bar" style="margin-top: 1.5rem;">
        <button type="button" id="btn-psc-generate" class="bu-btn bu-btn-primary">Generate Strong Password</button>
        <button type="button" id="btn-psc-copy" class="bu-btn">Copy Password</button>
        <button type="button" id="btn-psc-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('psc-input');
      const toggleBtn = document.getElementById('btn-psc-toggle');
      const strLabel = document.getElementById('psc-strength-label');
      const scoreLabel = document.getElementById('psc-score-label');
      const strBar = document.getElementById('psc-strength-bar');
      const entropyEl = document.getElementById('psc-entropy');
      const lenEl = document.getElementById('psc-length');
      const crackEl = document.getElementById('psc-crack-time');
      const genBtn = document.getElementById('btn-psc-generate');
      const copyBtn = document.getElementById('btn-psc-copy');
      const clearBtn = document.getElementById('btn-psc-clear');

      const chkLen = document.getElementById('chk-len');
      const chkLower = document.getElementById('chk-lower');
      const chkUpper = document.getElementById('chk-upper');
      const chkNum = document.getElementById('chk-num');
      const chkSym = document.getElementById('chk-sym');
      const chkCommon = document.getElementById('chk-common');

      function audit() {
        const pass = input.value;
        const res = window.MTV_BU.checkPasswordStrength(pass);

        strLabel.textContent = 'Strength: ' + res.label;
        scoreLabel.textContent = res.score + ' / 100';
        strBar.style.width = res.score + '%';

        if (res.score < 40) strBar.style.backgroundColor = 'var(--danger-text)';
        else if (res.score < 70) strBar.style.backgroundColor = 'var(--warning-text)';
        else strBar.style.backgroundColor = 'var(--success-text)';

        entropyEl.textContent = res.entropy + ' bits';
        lenEl.textContent = pass.length + ' chars';
        crackEl.textContent = res.crackTime;

        function setCheck(el, ok, text) {
          el.innerHTML = ok ? \`<span style="color:var(--success-text);">✓</span> \${text}\` : \`<span style="color:var(--text-muted);">⚪</span> \${text}\`;
        }

        setCheck(chkLen, pass.length >= 12, 'Minimum 12 characters');
        setCheck(chkLower, /[a-z]/.test(pass), 'Lowercase letters (a-z)');
        setCheck(chkUpper, /[A-Z]/.test(pass), 'Uppercase letters (A-Z)');
        setCheck(chkNum, /[0-9]/.test(pass), 'Numbers (0-9)');
        setCheck(chkSym, /[^a-zA-Z0-9]/.test(pass), 'Symbols (!@#$%^&*)');
        setCheck(chkCommon, !res.isCommon && pass.length > 0, 'No common passwords');
      }

      input.addEventListener('input', audit);

      toggleBtn.addEventListener('click', () => {
        input.type = input.type === 'password' ? 'text' : 'password';
      });

      genBtn.addEventListener('click', () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);
        let pass = '';
        for (let i = 0; i < 16; i++) pass += chars[bytes[i] % chars.length];
        input.value = pass;
        input.type = 'text';
        audit();
      });

      copyBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(input.value, copyBtn));
      clearBtn.addEventListener('click', () => {
        input.value = '';
        audit();
        input.focus();
      });

      audit();
    `
  },

  // 32. Timestamp Converter
  {
    id: 'timestamp-converter',
    categoryId: 'everyday-utilities',
    name: 'Timestamp Converter',
    icon: '⏳',
    title: 'Unix Timestamp Converter — Epoch to Human Date & Time',
    description: 'Convert Unix epoch timestamps (seconds and milliseconds) to human-readable dates, and convert calendar dates back to Unix timestamps.',
    keywords: 'unix timestamp converter, epoch converter, timestamp to date, date to timestamp, epoch time calculator, unix time now',
    howToUse: [
      { step: '1', title: 'Enter Epoch or Date', desc: 'Type a Unix timestamp in seconds/ms or choose a date from the calendar picker.' },
      { step: '2', title: 'Inspect Time Formats', desc: 'Review ISO 8601, UTC string, Local system time, and relative duration.' },
      { step: '3', title: 'Quick Time Adjustment', desc: 'Use +1 Hour, +1 Day, or Now buttons to manipulate timestamps instantly.' }
    ],
    features: [
      { title: 'Live Epoch Ticker', desc: 'Displays current live Unix epoch seconds ticking continuously in real time.' },
      { title: 'Seconds & Milliseconds', desc: 'Supports both standard 10-digit (seconds) and 13-digit (ms) timestamps.' },
      { title: 'Timezone Handling', desc: 'Shows both UTC universal time and user local system timezone.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-stats-strip" style="margin-bottom: 1.5rem; justify-content: space-between;">
        <div>Current Unix Epoch Time: <strong id="tc-current-epoch" style="color: var(--accent-blue); font-size: 1.2rem; font-family: monospace;">0</strong></div>
        <button type="button" id="btn-tc-copy-now" class="bu-btn" style="padding: 0.3rem 0.65rem; font-size: 0.78rem;">Copy Now</button>
      </div>
      <div class="bu-grid-2col">
        <div>
          <label class="bu-form-label" for="tc-epoch-in">Unix Timestamp (Seconds or Milliseconds)</label>
          <input type="text" id="tc-epoch-in" class="bu-input bu-input-mono" placeholder="e.g. 1773177600">
          <div class="bu-actions-bar" style="margin-top: 0.5rem; gap: 0.4rem;">
            <button type="button" id="btn-tc-now" class="bu-btn bu-btn-primary" style="padding: 0.35rem 0.65rem; font-size: 0.78rem;">Now</button>
            <button type="button" id="btn-tc-plus-hr" class="bu-btn" style="padding: 0.35rem 0.65rem; font-size: 0.78rem;">+1 Hour</button>
            <button type="button" id="btn-tc-plus-day" class="bu-btn" style="padding: 0.35rem 0.65rem; font-size: 0.78rem;">+1 Day</button>
            <button type="button" id="btn-tc-plus-wk" class="bu-btn" style="padding: 0.35rem 0.65rem; font-size: 0.78rem;">+1 Week</button>
          </div>
        </div>
        <div>
          <label class="bu-form-label" for="tc-date-in">Human Date Picker</label>
          <input type="datetime-local" id="tc-date-in" class="bu-input">
        </div>
      </div>
      <div class="bu-table-wrap" style="margin-top: 1.5rem;">
        <table class="bu-table">
          <thead><tr><th>Format</th><th>Converted Date String</th></tr></thead>
          <tbody>
            <tr><td>ISO 8601</td><td id="tc-fmt-iso" style="font-family: monospace;">-</td></tr>
            <tr><td>UTC Time</td><td id="tc-fmt-utc" style="font-family: monospace; font-weight: 600;">-</td></tr>
            <tr><td>Local Time</td><td id="tc-fmt-local" style="font-family: monospace; font-weight: 600; color: var(--accent-blue);">-</td></tr>
            <tr><td>Relative Time</td><td id="tc-fmt-rel">-</td></tr>
          </tbody>
        </table>
      </div>
    `,
    renderScript: () => `
      const curEpochEl = document.getElementById('tc-current-epoch');
      const copyNowBtn = document.getElementById('btn-tc-copy-now');
      const epochIn = document.getElementById('tc-epoch-in');
      const dateIn = document.getElementById('tc-date-in');
      const nowBtn = document.getElementById('btn-tc-now');
      const plusHrBtn = document.getElementById('btn-tc-plus-hr');
      const plusDayBtn = document.getElementById('btn-tc-plus-day');
      const plusWkBtn = document.getElementById('btn-tc-plus-wk');

      const fmtIso = document.getElementById('tc-fmt-iso');
      const fmtUtc = document.getElementById('tc-fmt-utc');
      const fmtLocal = document.getElementById('tc-fmt-local');
      const fmtRel = document.getElementById('tc-fmt-rel');

      function updateTicker() {
        curEpochEl.textContent = Math.floor(Date.now() / 1000);
      }
      setInterval(updateTicker, 1000);
      updateTicker();

      copyNowBtn.addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(Math.floor(Date.now() / 1000).toString(), copyNowBtn);
      });

      function convertFromTimestamp(ts) {
        if (!ts) return;
        let num = parseInt(ts, 10);
        if (isNaN(num)) return;
        if (num < 10000000000) num *= 1000; // convert s to ms
        const d = new Date(num);
        if (isNaN(d.getTime())) return;

        fmtIso.textContent = d.toISOString();
        fmtUtc.textContent = d.toUTCString();
        fmtLocal.textContent = d.toLocaleString();

        const diffSec = Math.round((d.getTime() - Date.now()) / 1000);
        if (Math.abs(diffSec) < 60) fmtRel.textContent = 'just now';
        else if (diffSec > 0) fmtRel.textContent = \`in \${Math.round(diffSec / 3600)} hours\`;
        else fmtRel.textContent = \`\${Math.abs(Math.round(diffSec / 3600))} hours ago\`;

        // sync datetime-local picker
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
        dateIn.value = localISOTime;
      }

      epochIn.addEventListener('input', () => convertFromTimestamp(epochIn.value));
      dateIn.addEventListener('input', () => {
        const d = new Date(dateIn.value);
        if (!isNaN(d.getTime())) {
          epochIn.value = Math.floor(d.getTime() / 1000);
          convertFromTimestamp(epochIn.value);
        }
      });

      nowBtn.addEventListener('click', () => {
        epochIn.value = Math.floor(Date.now() / 1000);
        convertFromTimestamp(epochIn.value);
      });

      plusHrBtn.addEventListener('click', () => {
        const cur = parseInt(epochIn.value, 10) || Math.floor(Date.now() / 1000);
        epochIn.value = cur + 3600;
        convertFromTimestamp(epochIn.value);
      });

      plusDayBtn.addEventListener('click', () => {
        const cur = parseInt(epochIn.value, 10) || Math.floor(Date.now() / 1000);
        epochIn.value = cur + 86400;
        convertFromTimestamp(epochIn.value);
      });

      plusWkBtn.addEventListener('click', () => {
        const cur = parseInt(epochIn.value, 10) || Math.floor(Date.now() / 1000);
        epochIn.value = cur + 604800;
        convertFromTimestamp(epochIn.value);
      });

      nowBtn.click();
    `
  },

  // 33. Date Difference Calculator
  {
    id: 'date-difference-calculator',
    categoryId: 'everyday-utilities',
    name: 'Date Difference Calculator',
    icon: '📅',
    title: 'Date Difference Calculator — Days, Weeks, Months & Working Days',
    description: 'Calculate the exact duration between two dates in years, months, days, total hours, minutes, seconds, and working business days.',
    keywords: 'date difference calculator, days between dates, calculate days, business days calculator, date duration calculator, working days between dates',
    howToUse: [
      { step: '1', title: 'Pick Start Date', desc: 'Select your starting calendar date or use Today button.' },
      { step: '2', title: 'Pick End Date', desc: 'Choose target deadline, milestone, or event date.' },
      { step: '3', title: 'Inspect Duration', desc: 'View comprehensive breakdowns including working days (excluding weekends).' }
    ],
    features: [
      { title: 'Working Days Calculation', desc: 'Automatically skips Saturdays and Sundays to report true business days.' },
      { title: 'Detailed Granularity', desc: 'Outputs total days, total hours, minutes, and exact calendar years/months/days.' },
      { title: 'Swap Dates Instantly', desc: 'Reverse start and end date positions with one click.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-grid-2col">
        <div class="bu-form-group">
          <label class="bu-form-label" for="dd-start">Start Date</label>
          <input type="date" id="dd-start" class="bu-input">
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" for="dd-end">End Date</label>
          <input type="date" id="dd-end" class="bu-input">
        </div>
      </div>
      <div class="bu-actions-bar" style="margin-bottom: 1.5rem;">
        <button type="button" id="btn-dd-swap" class="bu-btn">Swap Dates</button>
        <button type="button" id="btn-dd-today" class="bu-btn">Set Start to Today</button>
        <button type="button" id="btn-dd-plus30" class="bu-btn">+30 Days</button>
      </div>
      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1rem;">
        <div class="bu-stat-item">Total Days: <strong id="dd-stat-days" style="color: var(--accent-blue); font-size: 1.4rem;">0</strong></div>
        <div class="bu-stat-item">Working Days: <strong id="dd-stat-work" style="color: var(--success-text); font-size: 1.4rem;">0</strong></div>
        <div class="bu-stat-item">Total Weeks: <strong id="dd-stat-weeks" style="font-size: 1.4rem;">0</strong></div>
      </div>
      <div class="bu-table-wrap">
        <table class="bu-table">
          <thead><tr><th>Unit</th><th>Duration Breakdown</th></tr></thead>
          <tbody>
            <tr><td>Calendar Format</td><td id="dd-cal-fmt" style="font-weight: 600;">-</td></tr>
            <tr><td>Total Hours</td><td id="dd-tot-hrs">-</td></tr>
            <tr><td>Total Minutes</td><td id="dd-tot-min">-</td></tr>
            <tr><td>Total Seconds</td><td id="dd-tot-sec">-</td></tr>
          </tbody>
        </table>
      </div>
    `,
    renderScript: () => `
      const startIn = document.getElementById('dd-start');
      const endIn = document.getElementById('dd-end');
      const swapBtn = document.getElementById('btn-dd-swap');
      const todayBtn = document.getElementById('btn-dd-today');
      const plus30Btn = document.getElementById('btn-dd-plus30');

      const daysEl = document.getElementById('dd-stat-days');
      const workEl = document.getElementById('dd-stat-work');
      const weeksEl = document.getElementById('dd-stat-weeks');
      const calFmt = document.getElementById('dd-cal-fmt');
      const totHrs = document.getElementById('dd-tot-hrs');
      const totMin = document.getElementById('dd-tot-min');
      const totSec = document.getElementById('dd-tot-sec');

      function calculate() {
        if (!startIn.value || !endIn.value) return;
        const res = window.MTV_BU.calculateDateDifference(startIn.value, endIn.value);
        daysEl.textContent = res.totalDays.toLocaleString();
        workEl.textContent = res.workingDays.toLocaleString();
        weeksEl.textContent = res.weeks + ' wks ' + (res.totalDays % 7) + ' days';
        calFmt.textContent = \`\${res.years} year\${res.years === 1 ? '' : 's'}, \${res.months} month\${res.months === 1 ? '' : 's'}, \${res.days} day\${res.days === 1 ? '' : 's'}\`;
        totHrs.textContent = res.hours.toLocaleString() + ' hours';
        totMin.textContent = res.minutes.toLocaleString() + ' minutes';
        totSec.textContent = res.seconds.toLocaleString() + ' seconds';
      }

      startIn.addEventListener('change', calculate);
      endIn.addEventListener('change', calculate);

      swapBtn.addEventListener('click', () => {
        const tmp = startIn.value;
        startIn.value = endIn.value;
        endIn.value = tmp;
        calculate();
      });

      todayBtn.addEventListener('click', () => {
        startIn.value = new Date().toISOString().slice(0, 10);
        calculate();
      });

      plus30Btn.addEventListener('click', () => {
        const d = new Date(startIn.value || Date.now());
        d.setDate(d.getDate() + 30);
        endIn.value = d.toISOString().slice(0, 10);
        calculate();
      });

      const today = new Date();
      startIn.value = today.toISOString().slice(0, 10);
      const nextMonth = new Date(today.getTime() + 30 * 86400000);
      endIn.value = nextMonth.toISOString().slice(0, 10);
      calculate();
    `
  },

  // 34. Percentage Calculator
  {
    id: 'percentage-calculator',
    categoryId: 'everyday-utilities',
    name: 'Percentage Calculator',
    icon: '➗',
    title: 'Percentage Calculator — 4-in-1 Online Percentage Computations',
    description: 'Solve percentage questions: What is X% of Y, X is what % of Y, percentage increase/decrease, and add/subtract percentages with step-by-step math.',
    keywords: 'percentage calculator, calculate percentage, percent increase calculator, percentage change, percent of number, online percentage tool',
    howToUse: [
      { step: '1', title: 'Choose Equation Mode', desc: 'Select from What is X% of Y, Percent Difference, or Add/Subtract %.' },
      { step: '2', title: 'Enter Numbers', desc: 'Input your values and observe instantaneous results as you type.' },
      { step: '3', title: 'Copy Result', desc: 'Grab calculated solutions directly into your clipboard.' }
    ],
    features: [
      { title: '4 Common Percentage Tasks', desc: 'Covers discounts, markups, percent changes, and fraction ratios in one screen.' },
      { title: 'Step-by-Step Formula', desc: 'Shows the algebraic formula used to compute the answer.' },
      { title: 'Zero Latency', desc: 'Computes in real-time on every keystroke.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Calc 1 -->
        <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem; background: var(--bg-card);">
          <strong style="display: block; font-size: 0.95rem; margin-bottom: 0.75rem;">1. What is X% of Y?</strong>
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span>What is</span>
            <input type="number" id="p1-x" class="bu-input" value="15" style="width: 90px;">
            <span>% of</span>
            <input type="number" id="p1-y" class="bu-input" value="80" style="width: 100px;">
            <span>=</span>
            <strong id="p1-res" style="font-size: 1.3rem; color: var(--accent-blue);">12</strong>
          </div>
        </div>

        <!-- Calc 2 -->
        <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem; background: var(--bg-card);">
          <strong style="display: block; font-size: 0.95rem; margin-bottom: 0.75rem;">2. X is what percent of Y?</strong>
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <input type="number" id="p2-x" class="bu-input" value="25" style="width: 90px;">
            <span>is what % of</span>
            <input type="number" id="p2-y" class="bu-input" value="100" style="width: 100px;">
            <span>=</span>
            <strong id="p2-res" style="font-size: 1.3rem; color: var(--success-text);">25%</strong>
          </div>
        </div>

        <!-- Calc 3 -->
        <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem; background: var(--bg-card);">
          <strong style="display: block; font-size: 0.95rem; margin-bottom: 0.75rem;">3. Percentage Increase / Decrease from X to Y</strong>
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span>From</span>
            <input type="number" id="p3-x" class="bu-input" value="50" style="width: 90px;">
            <span>to</span>
            <input type="number" id="p3-y" class="bu-input" value="75" style="width: 100px;">
            <span>=</span>
            <strong id="p3-res" style="font-size: 1.3rem; color: var(--accent-blue);">+50.00% (Increase)</strong>
          </div>
        </div>

        <!-- Calc 4 -->
        <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem; background: var(--bg-card);">
          <strong style="display: block; font-size: 0.95rem; margin-bottom: 0.75rem;">4. Add or Subtract X% to/from Y</strong>
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <input type="number" id="p4-y" class="bu-input" value="120" style="width: 100px;" placeholder="Base">
            <select id="p4-op" class="bu-select" style="width: auto;">
              <option value="add">+ Add</option>
              <option value="sub">- Subtract</option>
            </select>
            <input type="number" id="p4-x" class="bu-input" value="10" style="width: 90px;" placeholder="%">
            <span>% =</span>
            <strong id="p4-res" style="font-size: 1.3rem; color: var(--accent-blue);">132.00</strong>
          </div>
        </div>
      </div>
    `,
    renderScript: () => `
      const p1x = document.getElementById('p1-x'), p1y = document.getElementById('p1-y'), p1res = document.getElementById('p1-res');
      const p2x = document.getElementById('p2-x'), p2y = document.getElementById('p2-y'), p2res = document.getElementById('p2-res');
      const p3x = document.getElementById('p3-x'), p3y = document.getElementById('p3-y'), p3res = document.getElementById('p3-res');
      const p4y = document.getElementById('p4-y'), p4op = document.getElementById('p4-op'), p4x = document.getElementById('p4-x'), p4res = document.getElementById('p4-res');

      function update() {
        // 1
        const x1 = parseFloat(p1x.value) || 0, y1 = parseFloat(p1y.value) || 0;
        p1res.textContent = ((x1 / 100) * y1).toLocaleString();

        // 2
        const x2 = parseFloat(p2x.value) || 0, y2 = parseFloat(p2y.value) || 1;
        p2res.textContent = ((x2 / y2) * 100).toFixed(2) + '%';

        // 3
        const x3 = parseFloat(p3x.value) || 0, y3 = parseFloat(p3y.value) || 0;
        if (x3 === 0) p3res.textContent = '0%';
        else {
          const diff = ((y3 - x3) / x3) * 100;
          p3res.textContent = (diff >= 0 ? '+' : '') + diff.toFixed(2) + '% (' + (diff >= 0 ? 'Increase' : 'Decrease') + ')';
        }

        // 4
        const y4 = parseFloat(p4y.value) || 0, x4 = parseFloat(p4x.value) || 0;
        const delta = (x4 / 100) * y4;
        p4res.textContent = (p4op.value === 'add' ? y4 + delta : y4 - delta).toFixed(2);
      }

      [p1x, p1y, p2x, p2y, p3x, p3y, p4y, p4op, p4x].forEach(el => el.addEventListener('input', update));
      p4op.addEventListener('change', update);
      update();
    `
  },

  // 35. Number Base Converter
  {
    id: 'number-base-converter',
    categoryId: 'everyday-utilities',
    name: 'Number Base Converter',
    icon: '🔢',
    title: 'Number Base Converter — Binary, Decimal, Hexadecimal & Octal',
    description: 'Synchronized bidirectional base converter for decimal (base 10), binary (base 2), hex (base 16), and octal (base 8) numbers.',
    keywords: 'number base converter, decimal to binary, binary to hex, hex to decimal, octal converter, base 2 base 10 base 16',
    howToUse: [
      { step: '1', title: 'Type in Any Base', desc: 'Enter a value into Decimal, Binary, Hexadecimal, or Octal input fields.' },
      { step: '2', title: 'Live Bidirectional Sync', desc: 'Typing in any box instantly translates and updates all other bases.' },
      { step: '3', title: 'Copy Values', desc: 'Click any Copy button to copy that specific base representation.' }
    ],
    features: [
      { title: 'Bidirectional Live Sync', desc: 'Edits in binary, decimal, hex, or octal instantly propagate to all four fields.' },
      { title: 'Validation Safeguards', desc: 'Detects illegal digits (such as 2 in binary or G in hex) gracefully.' },
      { title: 'Large Integer Support', desc: 'Handles big integers accurately up to JavaScript safe integer limits.' }
    ],
    sampleText: '255',
    renderControls: () => `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div class="bu-form-group">
          <label class="bu-form-label" for="nb-dec">Decimal (Base 10)</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="nb-dec" class="bu-input bu-input-mono" value="255" placeholder="0-9">
            <button type="button" id="btn-nb-copy-dec" class="bu-btn">Copy</button>
          </div>
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" for="nb-bin">Binary (Base 2)</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="nb-bin" class="bu-input bu-input-mono" value="11111111" placeholder="0-1">
            <button type="button" id="btn-nb-copy-bin" class="bu-btn">Copy</button>
          </div>
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" for="nb-hex">Hexadecimal (Base 16)</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="nb-hex" class="bu-input bu-input-mono" value="FF" placeholder="0-9, A-F">
            <button type="button" id="btn-nb-copy-hex" class="bu-btn">Copy</button>
          </div>
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" for="nb-oct">Octal (Base 8)</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="nb-oct" class="bu-input bu-input-mono" value="377" placeholder="0-7">
            <button type="button" id="btn-nb-copy-oct" class="bu-btn">Copy</button>
          </div>
        </div>
      </div>
      <div class="bu-actions-bar" style="margin-top: 1.5rem;">
        <button type="button" id="btn-nb-sample" class="bu-btn bu-btn-primary">Sample: 1024</button>
        <button type="button" id="btn-nb-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const decIn = document.getElementById('nb-dec');
      const binIn = document.getElementById('nb-bin');
      const hexIn = document.getElementById('nb-hex');
      const octIn = document.getElementById('nb-oct');

      const copyDec = document.getElementById('btn-nb-copy-dec');
      const copyBin = document.getElementById('btn-nb-copy-bin');
      const copyHex = document.getElementById('btn-nb-copy-hex');
      const copyOct = document.getElementById('btn-nb-copy-oct');
      const sampleBtn = document.getElementById('btn-nb-sample');
      const clearBtn = document.getElementById('btn-nb-clear');

      let updating = false;

      function updateAll(val, base) {
        if (updating) return;
        updating = true;
        try {
          if (!val) {
            decIn.value = '';
            binIn.value = '';
            hexIn.value = '';
            octIn.value = '';
            updating = false;
            return;
          }
          const num = parseInt(val, base);
          if (isNaN(num)) {
            updating = false;
            return;
          }
          if (base !== 10) decIn.value = num.toString(10);
          if (base !== 2) binIn.value = num.toString(2);
          if (base !== 16) hexIn.value = num.toString(16).toUpperCase();
          if (base !== 8) octIn.value = num.toString(8);
        } finally {
          updating = false;
        }
      }

      decIn.addEventListener('input', () => updateAll(decIn.value.trim(), 10));
      binIn.addEventListener('input', () => updateAll(binIn.value.trim(), 2));
      hexIn.addEventListener('input', () => updateAll(hexIn.value.trim(), 16));
      octIn.addEventListener('input', () => updateAll(octIn.value.trim(), 8));

      copyDec.addEventListener('click', () => window.MTV_BU.copyToClipboard(decIn.value, copyDec));
      copyBin.addEventListener('click', () => window.MTV_BU.copyToClipboard(binIn.value, copyBin));
      copyHex.addEventListener('click', () => window.MTV_BU.copyToClipboard(hexIn.value, copyHex));
      copyOct.addEventListener('click', () => window.MTV_BU.copyToClipboard(octIn.value, copyOct));

      sampleBtn.addEventListener('click', () => {
        decIn.value = '1024';
        updateAll('1024', 10);
      });

      clearBtn.addEventListener('click', () => {
        decIn.value = '';
        binIn.value = '';
        hexIn.value = '';
        octIn.value = '';
        decIn.focus();
      });
    `
  },

  // 36. Random Data Generator
  {
    id: 'random-data-generator',
    categoryId: 'everyday-utilities',
    name: 'Random Test Data Generator',
    icon: '🎲',
    title: 'Random Test Data Generator — Numbers, Strings, Names & Mock Data',
    description: 'Generate mock numbers, alphanumeric strings, test names, sample emails, and IP addresses for testing, QA, and UI prototyping.',
    keywords: 'random data generator, mock data generator, test names generator, random string generator, mock emails, fake test data online',
    howToUse: [
      { step: '1', title: 'Select Data Type', desc: 'Choose names, emails, random numbers, alphanumeric strings, or IPs.' },
      { step: '2', title: 'Set Quantity', desc: 'Select how many records to generate (1 to 50 items).' },
      { step: '3', title: 'Export Data', desc: 'Copy results line-by-line or download as a text file.' }
    ],
    features: [
      { title: 'Multiple Test Formats', desc: 'Full names, emails, IPv4 addresses, random ranges, and secure strings.' },
      { title: 'Format Modes', desc: 'Outputs as a line-by-line list, JSON array, or comma-separated string.' },
      { title: 'Instant In-Memory Generation', desc: 'Rapid generation without rate limits or external API quotas.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-options-wrap" style="align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <label for="rdg-type" style="font-size: 0.85rem; font-weight: 600;">Data Type:</label>
          <select id="rdg-type" class="bu-select" style="width: auto;">
            <option value="names" selected>Full Names</option>
            <option value="emails">Email Addresses</option>
            <option value="strings">Alphanumeric Strings</option>
            <option value="numbers">Random Integers (1-10,000)</option>
            <option value="ips">IPv4 Addresses</option>
          </select>
          <label for="rdg-count" style="font-size: 0.85rem; font-weight: 600;">Count:</label>
          <input type="number" id="rdg-count" class="bu-input" value="10" min="1" max="50" style="width: 75px;">
        </div>
        <div class="bu-actions-bar" style="margin: 0;">
          <button type="button" id="btn-rdg-gen" class="bu-btn bu-btn-primary">Generate Data</button>
          <button type="button" id="btn-rdg-copy" class="bu-btn">Copy Output</button>
          <button type="button" id="btn-rdg-download" class="bu-btn">Download .txt</button>
        </div>
      </div>
      <div class="bu-form-group" style="margin-top: 1.25rem;">
        <label class="bu-form-label" for="rdg-output">Generated Mock Data</label>
        <textarea id="rdg-output" class="bu-textarea bu-textarea-mono" readonly style="min-height: 240px; font-size: 0.95rem;"></textarea>
      </div>
    `,
    renderScript: () => `
      const typeSelect = document.getElementById('rdg-type');
      const countIn = document.getElementById('rdg-count');
      const genBtn = document.getElementById('btn-rdg-gen');
      const copyBtn = document.getElementById('btn-rdg-copy');
      const dlBtn = document.getElementById('btn-rdg-download');
      const output = document.getElementById('rdg-output');

      function generate() {
        const type = typeSelect.value;
        const count = parseInt(countIn.value, 10) || 10;
        const list = window.MTV_BU.generateRandomData(type, count);
        output.value = list.join('\\n');
      }

      genBtn.addEventListener('click', generate);
      typeSelect.addEventListener('change', generate);
      countIn.addEventListener('input', generate);

      copyBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(output.value, copyBtn));
      dlBtn.addEventListener('click', () => {
        if (!output.value) return;
        window.MTV_BU.downloadFile(output.value, 'test-data.txt');
      });

      generate();
    `
  }
];

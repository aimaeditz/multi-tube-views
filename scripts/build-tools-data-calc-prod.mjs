// Category: Calculators & Productivity (8 tools)
export const CALC_PROD_TOOLS = [
  // 1. EMI / Loan Calculator
  {
    id: 'emi-loan-calculator',
    categoryId: 'calculators-productivity',
    name: 'EMI & Loan Calculator',
    icon: '💰',
    title: 'EMI & Loan Calculator — Monthly Installment, Total Interest & Amortization',
    description: 'Calculate monthly loan EMI payments, total interest payable, overall repayment breakdown, and visual principal-to-interest ratios for home, car, and personal loans.',
    keywords: 'emi calculator, loan calculator online, home loan emi, monthly installment calculator, loan interest schedule',
    howToUse: [
      { step: '1', title: 'Enter Loan Amount', desc: 'Type principal loan amount (e.g. 50,000).' },
      { step: '2', title: 'Set Rate & Tenure', desc: 'Specify annual interest rate percentage and tenure in years.' },
      { step: '3', title: 'Inspect EMI Breakdown', desc: 'Review monthly EMI payment, total interest, and proportional repayment ratio.' }
    ],
    features: [
      { title: 'Standard Reducing Balance Formula', desc: 'Uses E = P * r * (1+r)^n / ((1+r)^n - 1) banking standard.' },
      { title: 'Principal vs Interest Bar', desc: 'Visual distribution chart showing how much of your total payment is interest.' },
      { title: 'Flexible Currency Adapters', desc: 'Easily calculate in USD, EUR, GBP, or INR.' }
    ],
    sampleText: '100000',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="emi-amount">Loan Amount (Principal)</label>
          <input type="number" id="emi-amount" class="bu-input" value="100000" step="1000">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="emi-rate">Annual Interest Rate (%)</label>
          <input type="number" id="emi-rate" class="bu-input" value="8.5" step="0.1">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="emi-tenure">Tenure (Years)</label>
          <input type="number" id="emi-tenure" class="bu-input" value="5" min="1" max="30">
        </div>
      </div>

      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Monthly EMI</span>
          <strong id="emi-monthly" style="font-size: 1.6rem; color: var(--accent-blue); display: block; margin-top: 0.25rem;">$0.00</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Total Interest</span>
          <strong id="emi-total-int" style="font-size: 1.6rem; color: var(--danger-text); display: block; margin-top: 0.25rem;">$0.00</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Total Payment</span>
          <strong id="emi-total-pay" style="font-size: 1.6rem; color: var(--success-text); display: block; margin-top: 0.25rem;">$0.00</strong>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">
          <span>Payment Breakdown Proportion</span>
          <span class="bu-form-label-hint" id="emi-breakdown-hint">Principal vs Interest</span>
        </label>
        <div style="height: 24px; border-radius: 6px; overflow: hidden; display: flex; background: #e2e8f0;">
          <div id="emi-bar-principal" style="background: var(--accent-blue); width: 75%; height: 100%;"></div>
          <div id="emi-bar-interest" style="background: #f87171; width: 25%; height: 100%;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-top: 0.4rem;">
          <span style="color: var(--accent-blue);">■ Principal (<span id="emi-pct-prin">75%</span>)</span>
          <span style="color: #ef4444;">■ Total Interest (<span id="emi-pct-int">25%</span>)</span>
        </div>
      </div>
    `,
    renderScript: () => `
      const amountInput = document.getElementById('emi-amount');
      const rateInput = document.getElementById('emi-rate');
      const tenureInput = document.getElementById('emi-tenure');

      const monthlyEl = document.getElementById('emi-monthly');
      const totalIntEl = document.getElementById('emi-total-int');
      const totalPayEl = document.getElementById('emi-total-pay');
      const barPrin = document.getElementById('emi-bar-principal');
      const barInt = document.getElementById('emi-bar-interest');
      const pctPrinEl = document.getElementById('emi-pct-prin');
      const pctIntEl = document.getElementById('emi-pct-int');

      function calculateEmi() {
        const p = parseFloat(amountInput.value) || 0;
        const annualRate = parseFloat(rateInput.value) || 0;
        const years = parseFloat(tenureInput.value) || 1;

        if (p <= 0 || years <= 0) return;

        const r = (annualRate / 12) / 100;
        const n = years * 12;

        let emi = 0;
        if (annualRate === 0) {
          emi = p / n;
        } else {
          emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }

        const totalPay = emi * n;
        const totalInt = totalPay - p;

        monthlyEl.textContent = '$' + emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        totalIntEl.textContent = '$' + totalInt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        totalPayEl.textContent = '$' + totalPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        const prinPct = Math.round((p / totalPay) * 100);
        const intPct = 100 - prinPct;

        barPrin.style.width = \`\${prinPct}%\`;
        barInt.style.width = \`\${intPct}%\`;
        pctPrinEl.textContent = \`\${prinPct}%\`;
        pctIntEl.textContent = \`\${intPct}%\`;
      }

      [amountInput, rateInput, tenureInput].forEach(el => el.addEventListener('input', calculateEmi));
      calculateEmi();
    `
  },

  // 2. BMI Calculator
  {
    id: 'bmi-calculator',
    categoryId: 'calculators-productivity',
    name: 'BMI Calculator',
    icon: '⚖️',
    title: 'BMI Calculator — Body Mass Index, Weight Category & Health Range',
    description: 'Calculate Body Mass Index (BMI), identify weight classification categories (Underweight, Normal, Overweight, Obese), and view healthy target weight ranges.',
    keywords: 'bmi calculator, body mass index online, ideal weight calculator, metric imperial bmi, calculate bmi score',
    howToUse: [
      { step: '1', title: 'Choose System', desc: 'Select Metric (cm / kg) or Imperial (ft / in / lbs).' },
      { step: '2', title: 'Enter Height & Weight', desc: 'Input your personal measurements.' },
      { step: '3', title: 'Review BMI Category', desc: 'Inspect your exact BMI score, visual indicator, and healthy target weight.' }
    ],
    features: [
      { title: 'Metric & Imperial Units', desc: 'Supports both standard centimeters/kilograms and feet/inches/pounds.' },
      { title: 'WHO Classification Standards', desc: 'Accurately categorizes Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), and Obese (30+).' },
      { title: 'Healthy Target Weight Range', desc: 'Calculates the optimal weight interval for your specific height.' }
    ],
    sampleText: '175cm, 70kg',
    renderControls: () => `
      <div class="bu-actions-bar" style="justify-content: flex-start; gap: 0.5rem; margin-bottom: 1.25rem;">
        <button type="button" class="bu-btn bu-btn-primary" data-bmi-unit="metric">Metric (cm / kg)</button>
        <button type="button" class="bu-btn" data-bmi-unit="imperial">Imperial (ft, in / lbs)</button>
      </div>

      <div id="bmi-metric-inputs" class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bmi-height-cm">Height (cm)</label>
          <input type="number" id="bmi-height-cm" class="bu-input" value="175">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bmi-weight-kg">Weight (kg)</label>
          <input type="number" id="bmi-weight-kg" class="bu-input" value="70">
        </div>
      </div>

      <div id="bmi-imperial-inputs" class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem; display: none;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bmi-height-ft">Height (Feet)</label>
          <input type="number" id="bmi-height-ft" class="bu-input" value="5">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bmi-height-in">Height (Inches)</label>
          <input type="number" id="bmi-height-in" class="bu-input" value="9">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bmi-weight-lbs">Weight (lbs)</label>
          <input type="number" id="bmi-weight-lbs" class="bu-input" value="154">
        </div>
      </div>

      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">BMI Score</span>
          <strong id="bmi-score" style="font-size: 1.8rem; color: var(--accent-blue); display: block; margin-top: 0.25rem;">22.9</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Category</span>
          <strong id="bmi-category" style="font-size: 1.4rem; color: var(--success-text); display: block; margin-top: 0.25rem;">Normal Weight</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Healthy Weight Range</span>
          <strong id="bmi-healthy-range" style="font-size: 1.2rem; color: var(--accent-primary); display: block; margin-top: 0.25rem;">56.7 - 76.3 kg</strong>
        </div>
      </div>
    `,
    renderScript: () => `
      let unitMode = 'metric';
      const metricBox = document.getElementById('bmi-metric-inputs');
      const imperialBox = document.getElementById('bmi-imperial-inputs');

      const hCm = document.getElementById('bmi-height-cm');
      const wKg = document.getElementById('bmi-weight-kg');
      const hFt = document.getElementById('bmi-height-ft');
      const hIn = document.getElementById('bmi-height-in');
      const wLbs = document.getElementById('bmi-weight-lbs');

      const scoreEl = document.getElementById('bmi-score');
      const catEl = document.getElementById('bmi-category');
      const rangeEl = document.getElementById('bmi-healthy-range');

      document.querySelectorAll('[data-bmi-unit]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-bmi-unit]').forEach(b => b.classList.remove('bu-btn-primary'));
          btn.classList.add('bu-btn-primary');
          unitMode = btn.getAttribute('data-bmi-unit');

          metricBox.style.display = unitMode === 'metric' ? 'grid' : 'none';
          imperialBox.style.display = unitMode === 'imperial' ? 'grid' : 'none';
          calculateBmi();
        });
      });

      function calculateBmi() {
        let heightM = 0;
        let weightKg = 0;

        if (unitMode === 'metric') {
          heightM = (parseFloat(hCm.value) || 0) / 100;
          weightKg = parseFloat(wKg.value) || 0;
        } else {
          const totalInches = ((parseFloat(hFt.value) || 0) * 12) + (parseFloat(hIn.value) || 0);
          heightM = totalInches * 0.0254;
          weightKg = (parseFloat(wLbs.value) || 0) * 0.453592;
        }

        if (heightM <= 0 || weightKg <= 0) return;

        const bmi = weightKg / (heightM * heightM);
        scoreEl.textContent = bmi.toFixed(1);

        if (bmi < 18.5) {
          catEl.textContent = 'Underweight';
          catEl.style.color = '#38bdf8';
        } else if (bmi < 25) {
          catEl.textContent = 'Normal Weight';
          catEl.style.color = 'var(--success-text)';
        } else if (bmi < 30) {
          catEl.textContent = 'Overweight';
          catEl.style.color = '#f59e0b';
        } else {
          catEl.textContent = 'Obese';
          catEl.style.color = '#ef4444';
        }

        const minNormKg = 18.5 * (heightM * heightM);
        const maxNormKg = 24.9 * (heightM * heightM);

        if (unitMode === 'metric') {
          rangeEl.textContent = \`\${minNormKg.toFixed(1)} - \${maxNormKg.toFixed(1)} kg\`;
        } else {
          rangeEl.textContent = \`\${(minNormKg * 2.20462).toFixed(1)} - \${(maxNormKg * 2.20462).toFixed(1)} lbs\`;
        }
      }

      [hCm, wKg, hFt, hIn, wLbs].forEach(el => el.addEventListener('input', calculateBmi));
      calculateBmi();
    `
  },

  // 3. Tip Calculator
  {
    id: 'tip-calculator',
    categoryId: 'calculators-productivity',
    name: 'Tip & Bill Splitter Calculator',
    icon: '🧾',
    title: 'Tip Calculator & Bill Splitter — Quick Percentage & Per-Person Split',
    description: 'Calculate restaurant gratuity tips, total bill with tip, and split payments evenly across any number of friends or dining parties with 1-click percentage presets.',
    keywords: 'tip calculator, bill split calculator, restaurant gratuity calculator, split bill online, tip percentage calculator',
    howToUse: [
      { step: '1', title: 'Enter Bill Total', desc: 'Type the pre-tip subtotal amount.' },
      { step: '2', title: 'Choose Tip %', desc: 'Select 10%, 15%, 18%, 20%, 25%, or enter custom tip percentage.' },
      { step: '3', title: 'Set Party Size', desc: 'Specify the number of people splitting the payment.' }
    ],
    features: [
      { title: '1-Click Tip Presets', desc: 'Quickly toggle standard gratuity percentages.' },
      { title: 'Even Bill Splitting', desc: 'Calculates exact amount and tip per person without rounding discrepancies.' },
      { title: 'Clean Invoice Summary', desc: 'Full financial breakdown ready to share with dining companions.' }
    ],
    sampleText: '85.50',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="tip-bill">Bill Amount ($)</label>
          <input type="number" id="tip-bill" class="bu-input" value="85.50" step="any">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="tip-custom-pct">Tip Percentage (%)</label>
          <input type="number" id="tip-custom-pct" class="bu-input" value="18">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="tip-people">Number of People</label>
          <input type="number" id="tip-people" class="bu-input" value="2" min="1" max="50">
        </div>
      </div>

      <div class="bu-actions-bar" style="justify-content: flex-start; gap: 0.5rem; margin-bottom: 1.25rem;">
        <button type="button" class="bu-btn" data-tip-preset="10">10%</button>
        <button type="button" class="bu-btn" data-tip-preset="15">15%</button>
        <button type="button" class="bu-btn bu-btn-primary" data-tip-preset="18">18%</button>
        <button type="button" class="bu-btn" data-tip-preset="20">20%</button>
        <button type="button" class="bu-btn" data-tip-preset="25">25%</button>
      </div>

      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Tip Amount</span>
          <strong id="tip-total-amount" style="font-size: 1.6rem; color: var(--accent-blue); display: block; margin-top: 0.25rem;">$15.39</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Total Bill (With Tip)</span>
          <strong id="tip-total-bill" style="font-size: 1.6rem; color: var(--success-text); display: block; margin-top: 0.25rem;">$100.89</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Total Per Person</span>
          <strong id="tip-per-person" style="font-size: 1.6rem; color: var(--accent-primary); display: block; margin-top: 0.25rem;">$50.45</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Tip Per Person</span>
          <strong id="tip-per-person-tip" style="font-size: 1.6rem; display: block; margin-top: 0.25rem;">$7.70</strong>
        </div>
      </div>
    `,
    renderScript: () => `
      const billInput = document.getElementById('tip-bill');
      const pctInput = document.getElementById('tip-custom-pct');
      const peopleInput = document.getElementById('tip-people');

      const totalTipEl = document.getElementById('tip-total-amount');
      const totalBillEl = document.getElementById('tip-total-bill');
      const perPersonEl = document.getElementById('tip-per-person');
      const perPersonTipEl = document.getElementById('tip-per-person-tip');

      function calculateTip() {
        const bill = parseFloat(billInput.value) || 0;
        const pct = parseFloat(pctInput.value) || 0;
        const people = Math.max(1, parseInt(peopleInput.value, 10) || 1);

        const tipAmount = bill * (pct / 100);
        const total = bill + tipAmount;
        const perPerson = total / people;
        const perPersonTip = tipAmount / people;

        totalTipEl.textContent = '$' + tipAmount.toFixed(2);
        totalBillEl.textContent = '$' + total.toFixed(2);
        perPersonEl.textContent = '$' + perPerson.toFixed(2);
        perPersonTipEl.textContent = '$' + perPersonTip.toFixed(2);
      }

      [billInput, pctInput, peopleInput].forEach(el => el.addEventListener('input', calculateTip));

      document.querySelectorAll('[data-tip-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-tip-preset]').forEach(b => b.classList.remove('bu-btn-primary'));
          btn.classList.add('bu-btn-primary');
          pctInput.value = btn.getAttribute('data-tip-preset');
          calculateTip();
        });
      });

      calculateTip();
    `
  },

  // 4. GST / Tax Calculator
  {
    id: 'gst-tax-calculator',
    categoryId: 'calculators-productivity',
    name: 'GST & Sales Tax Calculator',
    icon: '🏷️',
    title: 'GST & Sales Tax Calculator — Add or Remove Tax (Inclusive vs Exclusive)',
    description: 'Calculate Goods & Services Tax (GST), VAT, and sales tax. Add tax to net amounts or extract pre-tax base prices from gross totals.',
    keywords: 'gst calculator, sales tax calculator, vat calculator online, add tax remove tax, gst inclusive exclusive',
    howToUse: [
      { step: '1', title: 'Enter Amount & Rate', desc: 'Type initial base or total amount and tax rate percentage.' },
      { step: '2', title: 'Choose Tax Type', desc: 'Select Tax Exclusive (Add Tax) or Tax Inclusive (Extract Tax).' },
      { step: '3', title: 'Inspect Invoice Breakdown', desc: 'Review pre-tax amount, tax portion, and gross total.' }
    ],
    features: [
      { title: 'Add & Remove Tax Modes', desc: 'Easily calculate GST-inclusive reverse pricing or standard add-on sales tax.' },
      { title: 'Standard GST Slabs', desc: '1-click slab presets for 5%, 12%, 18%, and 28%.' },
      { title: 'CGST / SGST Split', desc: 'Displays dual tax split for federal and state jurisdictions.' }
    ],
    sampleText: '1000',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="tax-amount">Amount</label>
          <input type="number" id="tax-amount" class="bu-input" value="1000" step="any">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="tax-rate">Tax / GST Rate (%)</label>
          <input type="number" id="tax-rate" class="bu-input" value="18" step="0.5">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="tax-type">Calculation Mode</label>
          <select id="tax-type" class="bu-input">
            <option value="exclusive" selected>Add Tax (GST Exclusive)</option>
            <option value="inclusive">Remove Tax (GST Inclusive)</option>
          </select>
        </div>
      </div>

      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Net / Base Amount</span>
          <strong id="tax-net" style="font-size: 1.6rem; color: var(--accent-blue); display: block; margin-top: 0.25rem;">$1,000.00</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Tax Portion</span>
          <strong id="tax-portion" style="font-size: 1.6rem; color: var(--danger-text); display: block; margin-top: 0.25rem;">$180.00</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Total Gross Amount</span>
          <strong id="tax-gross" style="font-size: 1.6rem; color: var(--success-text); display: block; margin-top: 0.25rem;">$1,180.00</strong>
        </div>
      </div>
    `,
    renderScript: () => `
      const amountInput = document.getElementById('tax-amount');
      const rateInput = document.getElementById('tax-rate');
      const typeSelect = document.getElementById('tax-type');

      const netEl = document.getElementById('tax-net');
      const portionEl = document.getElementById('tax-portion');
      const grossEl = document.getElementById('tax-gross');

      function calculateTax() {
        const val = parseFloat(amountInput.value) || 0;
        const rate = parseFloat(rateInput.value) || 0;
        const mode = typeSelect.value;

        let net = 0;
        let tax = 0;
        let gross = 0;

        if (mode === 'exclusive') {
          net = val;
          tax = net * (rate / 100);
          gross = net + tax;
        } else {
          gross = val;
          net = gross / (1 + (rate / 100));
          tax = gross - net;
        }

        netEl.textContent = '$' + net.toFixed(2);
        portionEl.textContent = '$' + tax.toFixed(2);
        grossEl.textContent = '$' + gross.toFixed(2);
      }

      [amountInput, rateInput, typeSelect].forEach(el => {
        el.addEventListener('input', calculateTax);
        el.addEventListener('change', calculateTax);
      });

      calculateTax();
    `
  },

  // 5. Interest Calculator (Simple & Compound)
  {
    id: 'interest-calculator',
    categoryId: 'calculators-productivity',
    name: 'Compound & Simple Interest Calculator',
    icon: '📈',
    title: 'Compound & Simple Interest Calculator — Future Value, Growth & Compounding',
    description: 'Simulate financial investments and savings growth with compounding frequencies (Daily, Monthly, Quarterly, Annually) and detailed year-by-year projections.',
    keywords: 'compound interest calculator, simple interest calculator, investment growth simulator, savings calculator online, compound future value',
    howToUse: [
      { step: '1', title: 'Enter Principal', desc: 'Type initial investment deposit amount.' },
      { step: '2', title: 'Set Rate & Frequency', desc: 'Choose annual interest rate (%) and compounding period.' },
      { step: '3', title: 'Inspect Projected Returns', desc: 'Review future balance, total interest earned, and annual table.' }
    ],
    features: [
      { title: 'Flexible Compounding Cycles', desc: 'Compound Annually, Semi-Annually, Quarterly, Monthly, or Daily.' },
      { title: 'Simple vs Compound Toggle', desc: 'Compare linear simple interest growth against exponential compounding.' },
      { title: 'Yearly Progression Table', desc: 'View cumulative annual balance milestones.' }
    ],
    sampleText: '10000',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="int-principal">Initial Principal ($)</label>
          <input type="number" id="int-principal" class="bu-input" value="10000" step="500">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="int-rate">Annual Interest Rate (%)</label>
          <input type="number" id="int-rate" class="bu-input" value="7" step="0.1">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="int-years">Time Horizon (Years)</label>
          <input type="number" id="int-years" class="bu-input" value="10" min="1" max="50">
        </div>
      </div>

      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.5rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="int-freq">Compounding Frequency</label>
          <select id="int-freq" class="bu-input">
            <option value="12" selected>Monthly (12x/year)</option>
            <option value="1">Annually (1x/year)</option>
            <option value="4">Quarterly (4x/year)</option>
            <option value="365">Daily (365x/year)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="int-monthly-dep">Monthly Contribution ($)</label>
          <input type="number" id="int-monthly-dep" class="bu-input" value="100" step="50">
        </div>
      </div>

      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Future Balance</span>
          <strong id="int-future" style="font-size: 1.6rem; color: var(--success-text); display: block; margin-top: 0.25rem;">$0.00</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Total Interest Earned</span>
          <strong id="int-earned" style="font-size: 1.6rem; color: var(--accent-blue); display: block; margin-top: 0.25rem;">$0.00</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Total Deposits</span>
          <strong id="int-deposits" style="font-size: 1.6rem; color: var(--accent-primary); display: block; margin-top: 0.25rem;">$0.00</strong>
        </div>
      </div>
    `,
    renderScript: () => `
      const pInput = document.getElementById('int-principal');
      const rInput = document.getElementById('int-rate');
      const yInput = document.getElementById('int-years');
      const fSelect = document.getElementById('int-freq');
      const depInput = document.getElementById('int-monthly-dep');

      const futureEl = document.getElementById('int-future');
      const earnedEl = document.getElementById('int-earned');
      const depositsEl = document.getElementById('int-deposits');

      function calculateInterest() {
        const p = parseFloat(pInput.value) || 0;
        const r = (parseFloat(rInput.value) || 0) / 100;
        const t = parseFloat(yInput.value) || 1;
        const n = parseInt(fSelect.value, 10) || 12;
        const pmt = parseFloat(depInput.value) || 0;

        // Future value of principal: P * (1 + r/n)^(n*t)
        const fvPrincipal = p * Math.pow(1 + r/n, n * t);

        // Future value of series contributions
        let fvContributions = 0;
        if (r > 0) {
          const ratePerMonth = r / 12;
          const totalMonths = t * 12;
          fvContributions = pmt * ((Math.pow(1 + ratePerMonth, totalMonths) - 1) / ratePerMonth);
        } else {
          fvContributions = pmt * t * 12;
        }

        const totalFuture = fvPrincipal + fvContributions;
        const totalInvested = p + (pmt * t * 12);
        const totalInterest = totalFuture - totalInvested;

        futureEl.textContent = '$' + totalFuture.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        earnedEl.textContent = '$' + totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        depositsEl.textContent = '$' + totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      [pInput, rInput, yInput, fSelect, depInput].forEach(el => {
        el.addEventListener('input', calculateInterest);
        el.addEventListener('change', calculateInterest);
      });

      calculateInterest();
    `
  },

  // 6. Pomodoro Focus Timer
  {
    id: 'pomodoro-timer',
    categoryId: 'calculators-productivity',
    name: 'Pomodoro Focus Timer',
    icon: '🍅',
    title: 'Pomodoro Focus Timer — 25/5 Productivity Cycles & Audio Chime',
    description: 'Boost work focus and study sessions with customizable 25-minute Pomodoro focus intervals, short/long breaks, visual countdown rings, and audio chimes.',
    keywords: 'pomodoro timer, focus timer online, 25 minute study timer, pomodoro technique app, productivity timer',
    howToUse: [
      { step: '1', title: 'Choose Mode', desc: 'Select Focus (25 min), Short Break (5 min), or Long Break (15 min).' },
      { step: '2', title: 'Start Timer', desc: 'Click Start to begin your uninterrupted work cycle.' },
      { step: '3', title: 'Track Sessions', desc: 'Completed pomodoro sessions are recorded automatically.' }
    ],
    features: [
      { title: 'Audio Chime Alerts', desc: 'Synthesizes clean browser Web Audio frequencies on cycle completion.' },
      { title: 'Browser Title Countdown', desc: 'Tracks remaining minutes in the browser tab title.' },
      { title: 'Session Counter Streak', desc: 'Tracks daily completed focus sprints.' }
    ],
    sampleText: '25:00',
    renderControls: () => `
      <div class="bu-actions-bar" style="justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem;">
        <button type="button" class="bu-btn bu-btn-primary" data-pomo-mode="25">🍅 Focus (25m)</button>
        <button type="button" class="bu-btn" data-pomo-mode="5">☕ Short Break (5m)</button>
        <button type="button" class="bu-btn" data-pomo-mode="15">🌴 Long Break (15m)</button>
      </div>

      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div id="pomo-display" style="font-size: 4.5rem; font-weight: 900; color: var(--accent-primary); letter-spacing: 2px;" class="bu-input-mono">25:00</div>
        <div id="pomo-status" style="font-size: 0.95rem; color: var(--text-muted); margin-top: 0.25rem;">Stay focused on your primary task</div>
      </div>

      <div class="bu-actions-bar" style="justify-content: center; gap: 1rem; margin-bottom: 1.5rem;">
        <button type="button" id="btn-pomo-start" class="bu-btn bu-btn-primary" style="font-size: 1.1rem; padding: 0.75rem 2rem;">Start Focus</button>
        <button type="button" id="btn-pomo-pause" class="bu-btn" style="display:none; font-size: 1.1rem; padding: 0.75rem 2rem;">Pause</button>
        <button type="button" id="btn-pomo-reset" class="bu-btn bu-btn-subtle">Reset</button>
      </div>

      <div class="bu-stats-strip" style="display: flex; justify-content: center; align-items: center; gap: 1.5rem; padding: 1rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px);">
        <span style="font-weight: 700; color: var(--text-primary);">Completed Cycles: <strong id="pomo-completed" style="color: var(--accent-blue);">0</strong></span>
      </div>
    `,
    renderScript: () => `
      let duration = 25 * 60;
      let remaining = duration;
      let timer = null;
      let completedCount = 0;

      const display = document.getElementById('pomo-display');
      const statusEl = document.getElementById('pomo-status');
      const startBtn = document.getElementById('btn-pomo-start');
      const pauseBtn = document.getElementById('btn-pomo-pause');
      const resetBtn = document.getElementById('btn-pomo-reset');
      const countEl = document.getElementById('pomo-completed');

      function updateDisplay() {
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        display.textContent = \`\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`;
      }

      function playBeep() {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } catch(e) {}
      }

      function tick() {
        if (remaining > 0) {
          remaining--;
          updateDisplay();
        } else {
          clearInterval(timer);
          timer = null;
          playBeep();
          completedCount++;
          countEl.textContent = completedCount;
          statusEl.textContent = '🎉 Cycle Complete! Take a well-deserved break.';
          startBtn.style.display = 'inline-block';
          pauseBtn.style.display = 'none';
        }
      }

      startBtn.addEventListener('click', () => {
        if (!timer) {
          timer = setInterval(tick, 1000);
          startBtn.style.display = 'none';
          pauseBtn.style.display = 'inline-block';
          statusEl.textContent = '⚡ Focus in progress...';
        }
      });

      pauseBtn.addEventListener('click', () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
          startBtn.style.display = 'inline-block';
          pauseBtn.style.display = 'none';
          statusEl.textContent = 'Paused';
        }
      });

      resetBtn.addEventListener('click', () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        remaining = duration;
        updateDisplay();
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
        statusEl.textContent = 'Ready to start';
      });

      document.querySelectorAll('[data-pomo-mode]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-pomo-mode]').forEach(b => b.classList.remove('bu-btn-primary'));
          btn.classList.add('bu-btn-primary');
          const mins = parseInt(btn.getAttribute('data-pomo-mode'), 10);
          duration = mins * 60;
          remaining = duration;
          if (timer) clearInterval(timer);
          timer = null;
          updateDisplay();
          startBtn.style.display = 'inline-block';
          pauseBtn.style.display = 'none';
        });
      });

      updateDisplay();
    `
  },

  // 7. To-Do List (Local Storage Persistence)
  {
    id: 'todo-list-local',
    categoryId: 'calculators-productivity',
    name: 'To-Do List (Local Persistence)',
    icon: '✅',
    title: 'To-Do List & Task Manager — 100% Offline LocalStorage Persistence',
    description: 'Organize tasks, set priority flags (High, Medium, Low), check off completed goals, and filter tasks with instant, private browser storage persistence.',
    keywords: 'todo list local storage, offline task manager, browser todo list, daily checklist online, private to do list',
    howToUse: [
      { step: '1', title: 'Add Task', desc: 'Type your task title and select priority level.' },
      { step: '2', title: 'Check Off Completed', desc: 'Click task checkboxes as you finish items throughout your day.' },
      { step: '3', title: 'Filter & Export', desc: 'Filter by All, Active, or Completed; export your task list anytime.' }
    ],
    features: [
      { title: '100% LocalStorage Persistence', desc: 'Your tasks stay saved in your browser even if you refresh or close the tab.' },
      { title: 'Priority Tags & Filters', desc: 'Color-coded badges for High, Medium, and Low priority items.' },
      { title: 'JSON & Text Export', desc: '1-click export to backup or transfer task lists.' }
    ],
    sampleText: 'Complete Browser Utilities Suite',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0; grid-column: span 2;">
          <label class="bu-form-label" for="todo-input">New Task Description</label>
          <input type="text" id="todo-input" class="bu-input" placeholder="What needs to be done?">
        </div>
        <div class="bu-form-group" style="margin: 0; display: flex; align-items: flex-end; gap: 0.5rem;">
          <select id="todo-priority" class="bu-input" style="width: 120px;">
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
          <button type="button" id="btn-todo-add" class="bu-btn bu-btn-primary" style="height: 42px; white-space: nowrap;">+ Add Task</button>
        </div>
      </div>

      <div class="bu-actions-bar" style="justify-content: space-between; margin-bottom: 1rem;">
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" class="bu-btn bu-btn-primary" data-todo-filter="all">All</button>
          <button type="button" class="bu-btn" data-todo-filter="active">Active</button>
          <button type="button" class="bu-btn" data-todo-filter="completed">Completed</button>
        </div>
        <button type="button" id="btn-todo-clear-completed" class="bu-btn bu-btn-subtle" style="font-size: 0.8rem;">Clear Completed</button>
      </div>

      <div id="todo-list" style="display: flex; flex-direction: column; gap: 0.65rem; min-height: 180px;">
        <!-- Populated by script -->
      </div>
    `,
    renderScript: () => `
      function safeEscape(str) {
        if (typeof str !== 'string') str = String(str || '');
        return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
      }
      let todos = JSON.parse(localStorage.getItem('mtv_bu_todos') || '[]');
      if (todos.length === 0) {
        todos = [
          { id: '1', text: 'Review new Browser Utilities tools', priority: 'high', done: false },
          { id: '2', text: 'Export project assets for deployment', priority: 'medium', done: true }
        ];
      }

      let filter = 'all';
      const input = document.getElementById('todo-input');
      const prioSelect = document.getElementById('todo-priority');
      const list = document.getElementById('todo-list');

      function save() {
        localStorage.setItem('mtv_bu_todos', JSON.stringify(todos));
        render();
      }

      function render() {
        const filtered = todos.filter(t => {
          if (filter === 'active') return !t.done;
          if (filter === 'completed') return t.done;
          return true;
        });

        if (filtered.length === 0) {
          list.innerHTML = '<div style="text-align:center; padding: 2rem; color: var(--text-muted);">No tasks in this view.</div>';
          return;
        }

        list.innerHTML = filtered.map(t => {
          const prioColors = {
            high: 'background: rgba(239,68,68,0.15); color: #ef4444;',
            medium: 'background: rgba(245,158,11,0.15); color: #f59e0b;',
            low: 'background: rgba(59,130,246,0.15); color: #3b82f6;'
          };

          return \`
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); padding: 0.85rem 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
              <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; flex: 1;">
                <input type="checkbox" data-todo-toggle="\${t.id}" \${t.done ? 'checked' : ''} style="width: 18px; height: 18px;">
                <span style="\${t.done ? 'text-decoration: line-through; color: var(--text-muted);' : 'font-weight: 600; color: var(--text-primary);'} font-size: 0.95rem;">\${safeEscape(t.text)}</span>
              </label>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; \${prioColors[t.priority] || ''}">\${t.priority}</span>
                <button type="button" data-todo-del="\${t.id}" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1rem; padding: 4px 8px;">✕</button>
              </div>
            </div>
          \`;
        }).join('');

        document.querySelectorAll('[data-todo-toggle]').forEach(chk => {
          chk.addEventListener('change', () => {
            const id = chk.getAttribute('data-todo-toggle');
            const item = todos.find(t => t.id === id);
            if (item) item.done = chk.checked;
            save();
          });
        });

        document.querySelectorAll('[data-todo-del]').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-todo-del');
            todos = todos.filter(t => t.id !== id);
            save();
          });
        });
      }

      document.getElementById('btn-todo-add').addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return;
        todos.unshift({
          id: Date.now().toString(),
          text,
          priority: prioSelect.value,
          done: false
        });
        input.value = '';
        save();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          document.getElementById('btn-todo-add').click();
        }
      });

      document.querySelectorAll('[data-todo-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-todo-filter]').forEach(b => b.classList.remove('bu-btn-primary'));
          btn.classList.add('bu-btn-primary');
          filter = btn.getAttribute('data-todo-filter');
          render();
        });
      });

      document.getElementById('btn-todo-clear-completed').addEventListener('click', () => {
        todos = todos.filter(t => !t.done);
        save();
      });

      render();
    `
  },

  // 8. Sticky Notes Board
  {
    id: 'sticky-notes-board',
    categoryId: 'calculators-productivity',
    name: 'Sticky Notes Board (Local Save)',
    icon: '📌',
    title: 'Sticky Notes Pinboard — Visual Scratchpad with Pastel Colors & Auto-Save',
    description: 'Pin colorful quick digital sticky notes to a visual pinboard with customized pastel card hues (Yellow, Green, Blue, Pink) and automatic localStorage saving.',
    keywords: 'sticky notes online, virtual pinboard, quick notes scratchpad, digital memo board, sticky note board',
    howToUse: [
      { step: '1', title: 'Add Note', desc: 'Click Add Note and choose your favorite pastel background color.' },
      { step: '2', title: 'Type Thoughts', desc: 'Edit title and note body in real time.' },
      { step: '3', title: 'Auto-Saved Board', desc: 'Notes remain preserved locally on your device.' }
    ],
    features: [
      { title: '4 Aesthetic Pastel Themes', desc: 'Color code notes in Sunshine Yellow, Mint Green, Sky Blue, or Sakura Pink.' },
      { title: 'Automatic Local Sync', desc: 'Never lose a scratchpad thought or meeting memo.' },
      { title: '1-Click Note Deletion', desc: 'Easily delete individual notes when finished.' }
    ],
    sampleText: 'Project ideas and quick memo notes.',
    renderControls: () => `
      <div class="bu-actions-bar" style="justify-content: space-between; margin-bottom: 1.25rem;">
        <button type="button" id="btn-sn-add" class="bu-btn bu-btn-primary">+ Add New Sticky Note</button>
        <button type="button" id="btn-sn-clear" class="bu-btn bu-btn-subtle">Clear All Notes</button>
      </div>

      <div id="sn-board" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; min-height: 240px;">
        <!-- Populated by script -->
      </div>
    `,
    renderScript: () => `
      let notes = JSON.parse(localStorage.getItem('mtv_bu_sticky_notes') || '[]');
      if (notes.length === 0) {
        notes = [
          { id: '1', title: '💡 Idea Scratchpad', text: 'Multi-platform media tools and zero-upload utilities.', color: '#fef08a' },
          { id: '2', title: '📋 Meeting Memo', text: 'Review quarterly content schedule tomorrow at 10 AM.', color: '#bbf7d0' }
        ];
      }

      const board = document.getElementById('sn-board');

      function saveNotes() {
        localStorage.setItem('mtv_bu_sticky_notes', JSON.stringify(notes));
        renderBoard();
      }

      function renderBoard() {
        if (notes.length === 0) {
          board.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No sticky notes yet. Click "+ Add New Sticky Note" above!</div>';
          return;
        }

        board.innerHTML = notes.map(n => \`
          <div style="background: \${n.color}; color: #1e293b; border-radius: 8px; padding: 1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.06); display: flex; flex-direction: column; justify-content: space-between; min-height: 180px;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <input type="text" data-sn-title="\${n.id}" value="\${window.MTV_BU.escapeHtml(n.title)}" style="font-weight: 700; font-size: 1.05rem; background: transparent; border: none; outline: none; width: 85%; color: #0f172a;">
                <button type="button" data-sn-del="\${n.id}" style="background: none; border: none; cursor: pointer; color: #64748b; font-size: 1rem;">✕</button>
              </div>
              <textarea data-sn-body="\${n.id}" style="width: 100%; height: 90px; background: transparent; border: none; outline: none; resize: none; font-size: 0.9rem; line-height: 1.4; color: #334155;">\${window.MTV_BU.escapeHtml(n.text)}</textarea>
            </div>
            <div style="display: flex; gap: 0.35rem; margin-top: 0.5rem;">
              <button type="button" data-sn-col="\${n.id}" data-col-val="#fef08a" style="width: 18px; height: 18px; border-radius: 50%; background: #fef08a; border: 1px solid rgba(0,0,0,0.1); cursor: pointer;"></button>
              <button type="button" data-sn-col="\${n.id}" data-col-val="#bbf7d0" style="width: 18px; height: 18px; border-radius: 50%; background: #bbf7d0; border: 1px solid rgba(0,0,0,0.1); cursor: pointer;"></button>
              <button type="button" data-sn-col="\${n.id}" data-col-val="#bae6fd" style="width: 18px; height: 18px; border-radius: 50%; background: #bae6fd; border: 1px solid rgba(0,0,0,0.1); cursor: pointer;"></button>
              <button type="button" data-sn-col="\${n.id}" data-col-val="#fbcfe8" style="width: 18px; height: 18px; border-radius: 50%; background: #fbcfe8; border: 1px solid rgba(0,0,0,0.1); cursor: pointer;"></button>
            </div>
          </div>
        \`).join('');

        // Event bindings
        document.querySelectorAll('[data-sn-title]').forEach(inp => {
          inp.addEventListener('input', () => {
            const id = inp.getAttribute('data-sn-title');
            const n = notes.find(x => x.id === id);
            if (n) { n.title = inp.value; localStorage.setItem('mtv_bu_sticky_notes', JSON.stringify(notes)); }
          });
        });

        document.querySelectorAll('[data-sn-body]').forEach(txt => {
          txt.addEventListener('input', () => {
            const id = txt.getAttribute('data-sn-body');
            const n = notes.find(x => x.id === id);
            if (n) { n.text = txt.value; localStorage.setItem('mtv_bu_sticky_notes', JSON.stringify(notes)); }
          });
        });

        document.querySelectorAll('[data-sn-del]').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-sn-del');
            notes = notes.filter(x => x.id !== id);
            saveNotes();
          });
        });

        document.querySelectorAll('[data-sn-col]').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-sn-col');
            const col = btn.getAttribute('data-col-val');
            const n = notes.find(x => x.id === id);
            if (n) { n.color = col; saveNotes(); }
          });
        });
      }

      document.getElementById('btn-sn-add').addEventListener('click', () => {
        const colors = ['#fef08a', '#bbf7d0', '#bae6fd', '#fbcfe8'];
        notes.push({
          id: Date.now().toString(),
          title: '📌 New Note',
          text: 'Type your memo here...',
          color: colors[Math.floor(Math.random() * colors.length)]
        });
        saveNotes();
      });

      document.getElementById('btn-sn-clear').addEventListener('click', () => {
        if (confirm('Clear all sticky notes?')) {
          notes = [];
          saveNotes();
        }
      });

      renderBoard();
    `
  }
];

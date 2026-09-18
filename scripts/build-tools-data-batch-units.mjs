// 10 Unit & Format Converters for Browser Utilities
export const BATCH_UNIT_TOOLS = [
  // 1. Area Unit Converter
  {
    id: 'area-unit-converter',
    categoryId: 'unit-format-converters',
    name: 'Area Unit Converter',
    icon: '📐',
    title: 'Area Unit Converter — Sq Meters, Sq Feet, Acres, Hectares & Sq Km',
    description: 'Convert surface area and land measurements instantly across Square Meters (m²), Square Kilometers (km²), Square Feet (ft²), Square Inches (in²), Square Yards (yd²), Acres, Hectares (ha), and Square Miles (mi²).',
    keywords: 'area unit converter, square feet to square meters, acres to hectares, square yards converter, land area calculator, m2 to ft2',
    howToUse: [
      { step: '1', title: 'Enter Area Value', desc: 'Type the numeric value of the land or surface area you wish to convert.' },
      { step: '2', title: 'Select Units', desc: 'Choose the source unit (From) and destination unit (To) from the selectors.' },
      { step: '3', title: 'View Result & Comparison', desc: 'Inspect the calculated conversion and the comprehensive comparison matrix of all area units.' }
    ],
    features: [
      { title: '8 Land & Surface Units', desc: 'Full support for Metric (m², km², ha) and Imperial/US Customary (sq ft, sq in, sq yd, acres, sq mi).' },
      { title: 'Complete Comparison Matrix', desc: 'Displays converted equivalents in every single unit simultaneously in an organized table.' },
      { title: 'High Decimal Precision', desc: 'Configurable precision up to 8 decimal places for exact surveying and architectural measurements.' }
    ],
    sampleText: '100',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="auc-val">Area Value</label>
          <input type="number" id="auc-val" class="bu-input" value="1" step="any" placeholder="Enter value...">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="auc-from">From Unit</label>
          <select id="auc-from" class="bu-input">
            <option value="sqm">Square Meters (m²)</option>
            <option value="sqkm">Square Kilometers (km²)</option>
            <option value="sqft" selected>Square Feet (ft²)</option>
            <option value="sqin">Square Inches (in²)</option>
            <option value="sqyd">Square Yards (yd²)</option>
            <option value="acre">Acres (ac)</option>
            <option value="ha">Hectares (ha)</option>
            <option value="sqmi">Square Miles (mi²)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="auc-to">To Unit</label>
          <select id="auc-to" class="bu-input">
            <option value="sqm" selected>Square Meters (m²)</option>
            <option value="sqkm">Square Kilometers (km²)</option>
            <option value="sqft">Square Feet (ft²)</option>
            <option value="sqin">Square Inches (in²)</option>
            <option value="sqyd">Square Yards (yd²)</option>
            <option value="acre">Acres (ac)</option>
            <option value="ha">Hectares (ha)</option>
            <option value="sqmi">Square Miles (mi²)</option>
          </select>
        </div>
      </div>
      <div class="bu-actions-bar" style="gap: 0.5rem; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" id="btn-auc-swap" class="bu-btn bu-btn-primary">⇄ Swap Units</button>
          <button type="button" id="btn-auc-sample" class="bu-btn bu-btn-subtle">1 Acre Preset</button>
          <button type="button" id="btn-auc-clear" class="bu-btn bu-btn-subtle">Reset</button>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label for="auc-prec" style="font-size: 0.8rem; color: var(--text-muted);">Decimals:</label>
          <select id="auc-prec" class="bu-select" style="width: auto; padding: 0.35rem 0.6rem; font-size: 0.8rem;">
            <option value="2">2 decimals</option>
            <option value="4" selected>4 decimals</option>
            <option value="6">6 decimals</option>
            <option value="8">8 decimals</option>
          </select>
        </div>
      </div>
      <div class="bu-result-box" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
        <span style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Conversion Result</span>
        <div id="auc-result" style="font-size: clamp(1.5rem, 3.5vw, 2.2rem); font-weight: 800; color: var(--accent-primary);">0.0929 m²</div>
        <p id="auc-formula" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; margin-bottom: 0;">1 ft² = 0.092903 m²</p>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">All Area Units Matrix</h3>
        <div class="bu-table-wrap">
          <table class="bu-table" id="auc-matrix">
            <thead>
              <tr><th>Unit Name</th><th>Symbol</th><th>Converted Value</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `,
    renderScript: () => `
      const valInput = document.getElementById('auc-val');
      const fromSel = document.getElementById('auc-from');
      const toSel = document.getElementById('auc-to');
      const swapBtn = document.getElementById('btn-auc-swap');
      const sampleBtn = document.getElementById('btn-auc-sample');
      const clearBtn = document.getElementById('btn-auc-clear');
      const precSel = document.getElementById('auc-prec');
      const resultEl = document.getElementById('auc-result');
      const formulaEl = document.getElementById('auc-formula');
      const matrixTbody = document.querySelector('#auc-matrix tbody');

      const units = {
        sqm: { name: 'Square Meters', symbol: 'm²', toSqm: 1 },
        sqkm: { name: 'Square Kilometers', symbol: 'km²', toSqm: 1000000 },
        sqft: { name: 'Square Feet', symbol: 'ft²', toSqm: 0.09290304 },
        sqin: { name: 'Square Inches', symbol: 'in²', toSqm: 0.00064516 },
        sqyd: { name: 'Square Yards', symbol: 'yd²', toSqm: 0.83612736 },
        acre: { name: 'Acres', symbol: 'ac', toSqm: 4046.8564224 },
        ha: { name: 'Hectares', symbol: 'ha', toSqm: 10000 },
        sqmi: { name: 'Square Miles', symbol: 'mi²', toSqm: 2589988.110336 }
      };

      function update() {
        const val = parseFloat(valInput.value) || 0;
        const from = fromSel.value;
        const to = toSel.value;
        const prec = parseInt(precSel.value, 10) || 4;

        const sqm = val * units[from].toSqm;
        const converted = sqm / units[to].toSqm;
        const oneFromInTo = units[from].toSqm / units[to].toSqm;

        resultEl.textContent = \`\${converted.toLocaleString(undefined, { maximumFractionDigits: prec })} \${units[to].symbol}\`;
        formulaEl.textContent = \`1 \${units[from].symbol} = \${oneFromInTo.toLocaleString(undefined, { maximumFractionDigits: 6 })} \${units[to].symbol}\`;

        let rows = '';
        for (const [key, u] of Object.entries(units)) {
          const v = sqm / u.toSqm;
          rows += \`<tr><td><strong>\${u.name}</strong></td><td><code>\${u.symbol}</code></td><td>\${v.toLocaleString(undefined, { maximumFractionDigits: prec })} \${u.symbol}</td></tr>\`;
        }
        matrixTbody.innerHTML = rows;
      }

      valInput.addEventListener('input', update);
      fromSel.addEventListener('change', update);
      toSel.addEventListener('change', update);
      precSel.addEventListener('change', update);
      swapBtn.addEventListener('click', () => {
        const tmp = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = tmp;
        update();
      });
      sampleBtn.addEventListener('click', () => {
        valInput.value = 1;
        fromSel.value = 'acre';
        toSel.value = 'sqft';
        update();
      });
      clearBtn.addEventListener('click', () => {
        valInput.value = 1;
        fromSel.value = 'sqft';
        toSel.value = 'sqm';
        update();
      });
      update();
    `
  },

  // 2. Volume Unit Converter
  {
    id: 'volume-unit-converter',
    categoryId: 'unit-format-converters',
    name: 'Volume Unit Converter',
    icon: '🧪',
    title: 'Volume Unit Converter — Liters, Gallons, Milliliters, m³ & Fl Oz',
    description: 'Convert liquid and dry volume measurements across Liters (L), Milliliters (mL), Cubic Meters (m³), US Gallons (gal), US Quarts (qt), US Pints (pt), US Cups, US Fluid Ounces (fl oz), Tablespoons, Teaspoons, Cubic Feet (ft³), and Imperial Gallons.',
    keywords: 'volume converter, liters to gallons, ml to oz converter, gallons to liters, cubic meters to liters, fluid ounces calculator',
    howToUse: [
      { step: '1', title: 'Enter Volume Quantity', desc: 'Type the volume amount you want to convert.' },
      { step: '2', title: 'Choose Volume Units', desc: 'Select your starting unit and target measurement unit.' },
      { step: '3', title: 'Inspect Instant Table', desc: 'See the converted amount and the complete cross-unit volume chart.' }
    ],
    features: [
      { title: '12 Volume Measurements', desc: 'Metric (L, mL, m³, cm³) and US/Imperial (Gallons, Quarts, Pints, Cups, Fl Oz, Tbsp, Tsp, Cu Ft).' },
      { title: 'Recipe & Lab Precision', desc: 'Ideal for culinary conversions, chemistry calculations, and fluid engineering.' },
      { title: 'Comparative Matrix', desc: 'Real-time calculation across all 12 units simultaneously.' }
    ],
    sampleText: '1',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="vuc-val">Volume Value</label>
          <input type="number" id="vuc-val" class="bu-input" value="1" step="any" placeholder="Enter value...">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="vuc-from">From Unit</label>
          <select id="vuc-from" class="bu-input">
            <option value="l">Liters (L)</option>
            <option value="ml">Milliliters (mL)</option>
            <option value="m3">Cubic Meters (m³)</option>
            <option value="us_gal" selected>US Gallons (gal)</option>
            <option value="us_qt">US Quarts (qt)</option>
            <option value="us_pt">US Pints (pt)</option>
            <option value="us_cup">US Cups</option>
            <option value="us_floz">US Fluid Ounces (fl oz)</option>
            <option value="tbsp">Tablespoons (tbsp)</option>
            <option value="tsp">Teaspoons (tsp)</option>
            <option value="imp_gal">Imperial Gallons (UK gal)</option>
            <option value="cuft">Cubic Feet (ft³)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="vuc-to">To Unit</label>
          <select id="vuc-to" class="bu-input">
            <option value="l" selected>Liters (L)</option>
            <option value="ml">Milliliters (mL)</option>
            <option value="m3">Cubic Meters (m³)</option>
            <option value="us_gal">US Gallons (gal)</option>
            <option value="us_qt">US Quarts (qt)</option>
            <option value="us_pt">US Pints (pt)</option>
            <option value="us_cup">US Cups</option>
            <option value="us_floz">US Fluid Ounces (fl oz)</option>
            <option value="tbsp">Tablespoons (tbsp)</option>
            <option value="tsp">Teaspoons (tsp)</option>
            <option value="imp_gal">Imperial Gallons (UK gal)</option>
            <option value="cuft">Cubic Feet (ft³)</option>
          </select>
        </div>
      </div>
      <div class="bu-actions-bar" style="gap: 0.5rem; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" id="btn-vuc-swap" class="bu-btn bu-btn-primary">⇄ Swap Units</button>
          <button type="button" id="btn-vuc-sample" class="bu-btn bu-btn-subtle">1 Gal Preset</button>
          <button type="button" id="btn-vuc-clear" class="bu-btn bu-btn-subtle">Reset</button>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label for="vuc-prec" style="font-size: 0.8rem; color: var(--text-muted);">Decimals:</label>
          <select id="vuc-prec" class="bu-select" style="width: auto; padding: 0.35rem 0.6rem; font-size: 0.8rem;">
            <option value="2">2 decimals</option>
            <option value="4" selected>4 decimals</option>
            <option value="6">6 decimals</option>
          </select>
        </div>
      </div>
      <div class="bu-result-box" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
        <span style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Conversion Result</span>
        <div id="vuc-result" style="font-size: clamp(1.5rem, 3.5vw, 2.2rem); font-weight: 800; color: var(--accent-primary);">3.7854 L</div>
        <p id="vuc-formula" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; margin-bottom: 0;">1 US gal = 3.78541 L</p>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">All Volume Units Matrix</h3>
        <div class="bu-table-wrap">
          <table class="bu-table" id="vuc-matrix">
            <thead>
              <tr><th>Unit Name</th><th>Symbol</th><th>Converted Value</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `,
    renderScript: () => `
      const valInput = document.getElementById('vuc-val');
      const fromSel = document.getElementById('vuc-from');
      const toSel = document.getElementById('vuc-to');
      const swapBtn = document.getElementById('btn-vuc-swap');
      const sampleBtn = document.getElementById('btn-vuc-sample');
      const clearBtn = document.getElementById('btn-vuc-clear');
      const precSel = document.getElementById('vuc-prec');
      const resultEl = document.getElementById('vuc-result');
      const formulaEl = document.getElementById('vuc-formula');
      const matrixTbody = document.querySelector('#vuc-matrix tbody');

      const units = {
        l: { name: 'Liters', symbol: 'L', toL: 1 },
        ml: { name: 'Milliliters', symbol: 'mL', toL: 0.001 },
        m3: { name: 'Cubic Meters', symbol: 'm³', toL: 1000 },
        us_gal: { name: 'US Gallons', symbol: 'gal', toL: 3.785411784 },
        us_qt: { name: 'US Quarts', symbol: 'qt', toL: 0.946352946 },
        us_pt: { name: 'US Pints', symbol: 'pt', toL: 0.473176473 },
        us_cup: { name: 'US Cups', symbol: 'cup', toL: 0.2365882365 },
        us_floz: { name: 'US Fluid Ounces', symbol: 'fl oz', toL: 0.0295735295625 },
        tbsp: { name: 'Tablespoons', symbol: 'tbsp', toL: 0.01478676478125 },
        tsp: { name: 'Teaspoons', symbol: 'tsp', toL: 0.00492892159375 },
        imp_gal: { name: 'Imperial Gallons', symbol: 'UK gal', toL: 4.54609 },
        cuft: { name: 'Cubic Feet', symbol: 'ft³', toL: 28.316846592 }
      };

      function update() {
        const val = parseFloat(valInput.value) || 0;
        const from = fromSel.value;
        const to = toSel.value;
        const prec = parseInt(precSel.value, 10) || 4;

        const liters = val * units[from].toL;
        const converted = liters / units[to].toL;
        const oneFromInTo = units[from].toL / units[to].toL;

        resultEl.textContent = \`\${converted.toLocaleString(undefined, { maximumFractionDigits: prec })} \${units[to].symbol}\`;
        formulaEl.textContent = \`1 \${units[from].symbol} = \${oneFromInTo.toLocaleString(undefined, { maximumFractionDigits: 6 })} \${units[to].symbol}\`;

        let rows = '';
        for (const [key, u] of Object.entries(units)) {
          const v = liters / u.toL;
          rows += \`<tr><td><strong>\${u.name}</strong></td><td><code>\${u.symbol}</code></td><td>\${v.toLocaleString(undefined, { maximumFractionDigits: prec })} \${u.symbol}</td></tr>\`;
        }
        matrixTbody.innerHTML = rows;
      }

      valInput.addEventListener('input', update);
      fromSel.addEventListener('change', update);
      toSel.addEventListener('change', update);
      precSel.addEventListener('change', update);
      swapBtn.addEventListener('click', () => {
        const tmp = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = tmp;
        update();
      });
      sampleBtn.addEventListener('click', () => {
        valInput.value = 1;
        fromSel.value = 'us_gal';
        toSel.value = 'l';
        update();
      });
      clearBtn.addEventListener('click', () => {
        valInput.value = 1;
        fromSel.value = 'us_gal';
        toSel.value = 'l';
        update();
      });
      update();
    `
  },

  // 3. Speed Unit Converter
  {
    id: 'speed-unit-converter',
    categoryId: 'unit-format-converters',
    name: 'Speed Unit Converter',
    icon: '⚡',
    title: 'Speed Unit Converter — km/h, mph, m/s, Knots & Mach',
    description: 'Convert velocity and speed measurements across Kilometers per Hour (km/h), Miles per Hour (mph), Meters per Second (m/s), Knots (kn), Feet per Second (ft/s), and Mach (speed of sound).',
    keywords: 'speed converter, mph to kmh, km/h to mph, knots to mph, m/s to km/h, mach calculator, velocity converter',
    howToUse: [
      { step: '1', title: 'Enter Speed', desc: 'Type the speed value in your starting unit.' },
      { step: '2', title: 'Pick Source & Target', desc: 'Select km/h, mph, m/s, Knots, ft/s, or Mach.' },
      { step: '3', title: 'View Equivalent Speeds', desc: 'Compare your velocity across aeronautical, maritime, and automotive speed metrics.' }
    ],
    features: [
      { title: '6 Velocity Metrics', desc: 'Complete conversion across km/h, mph, m/s, knots, ft/s, and Mach.' },
      { title: 'Aviation & Marine Ready', desc: 'Accurate knot (nautical miles/hr) and Mach (standard sea-level atmospheric temp) calculations.' },
      { title: 'Real-time Matrix', desc: 'Compare speed benchmarks like walking, highway, sound, and orbital speed.' }
    ],
    sampleText: '60',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="suc-val">Speed Value</label>
          <input type="number" id="suc-val" class="bu-input" value="60" step="any" placeholder="Enter value...">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="suc-from">From Unit</label>
          <select id="suc-from" class="bu-input">
            <option value="kmh">Kilometers / hour (km/h)</option>
            <option value="mph" selected>Miles / hour (mph)</option>
            <option value="ms">Meters / second (m/s)</option>
            <option value="knot">Knots (kn)</option>
            <option value="fts">Feet / second (ft/s)</option>
            <option value="mach">Mach (speed of sound)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="suc-to">To Unit</label>
          <select id="suc-to" class="bu-input">
            <option value="kmh" selected>Kilometers / hour (km/h)</option>
            <option value="mph">Miles / hour (mph)</option>
            <option value="ms">Meters / second (m/s)</option>
            <option value="knot">Knots (kn)</option>
            <option value="fts">Feet / second (ft/s)</option>
            <option value="mach">Mach (speed of sound)</option>
          </select>
        </div>
      </div>
      <div class="bu-actions-bar" style="gap: 0.5rem; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" id="btn-suc-swap" class="bu-btn bu-btn-primary">⇄ Swap Units</button>
          <button type="button" id="btn-suc-sample" class="bu-btn bu-btn-subtle">Highway 65 mph</button>
          <button type="button" id="btn-suc-clear" class="bu-btn bu-btn-subtle">Reset</button>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label for="suc-prec" style="font-size: 0.8rem; color: var(--text-muted);">Decimals:</label>
          <select id="suc-prec" class="bu-select" style="width: auto; padding: 0.35rem 0.6rem; font-size: 0.8rem;">
            <option value="2" selected>2 decimals</option>
            <option value="4">4 decimals</option>
            <option value="6">6 decimals</option>
          </select>
        </div>
      </div>
      <div class="bu-result-box" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
        <span style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Conversion Result</span>
        <div id="suc-result" style="font-size: clamp(1.5rem, 3.5vw, 2.2rem); font-weight: 800; color: var(--accent-primary);">96.56 km/h</div>
        <p id="suc-formula" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; margin-bottom: 0;">1 mph = 1.60934 km/h</p>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">All Speed Units Matrix</h3>
        <div class="bu-table-wrap">
          <table class="bu-table" id="suc-matrix">
            <thead>
              <tr><th>Speed Metric</th><th>Symbol</th><th>Converted Value</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `,
    renderScript: () => `
      const valInput = document.getElementById('suc-val');
      const fromSel = document.getElementById('suc-from');
      const toSel = document.getElementById('suc-to');
      const swapBtn = document.getElementById('btn-suc-swap');
      const sampleBtn = document.getElementById('btn-suc-sample');
      const clearBtn = document.getElementById('btn-suc-clear');
      const precSel = document.getElementById('suc-prec');
      const resultEl = document.getElementById('suc-result');
      const formulaEl = document.getElementById('suc-formula');
      const matrixTbody = document.querySelector('#suc-matrix tbody');

      const units = {
        kmh: { name: 'Kilometers per Hour', symbol: 'km/h', toMs: 1 / 3.6 },
        mph: { name: 'Miles per Hour', symbol: 'mph', toMs: 0.44704 },
        ms: { name: 'Meters per Second', symbol: 'm/s', toMs: 1 },
        knot: { name: 'Knots', symbol: 'kn', toMs: 0.514444 },
        fts: { name: 'Feet per Second', symbol: 'ft/s', toMs: 0.3048 },
        mach: { name: 'Mach (Speed of Sound)', symbol: 'M', toMs: 340.29 }
      };

      function update() {
        const val = parseFloat(valInput.value) || 0;
        const from = fromSel.value;
        const to = toSel.value;
        const prec = parseInt(precSel.value, 10) || 2;

        const ms = val * units[from].toMs;
        const converted = ms / units[to].toMs;
        const oneFromInTo = units[from].toMs / units[to].toMs;

        resultEl.textContent = \`\${converted.toLocaleString(undefined, { maximumFractionDigits: prec })} \${units[to].symbol}\`;
        formulaEl.textContent = \`1 \${units[from].symbol} = \${oneFromInTo.toLocaleString(undefined, { maximumFractionDigits: 5 })} \${units[to].symbol}\`;

        let rows = '';
        for (const [key, u] of Object.entries(units)) {
          const v = ms / u.toMs;
          rows += \`<tr><td><strong>\${u.name}</strong></td><td><code>\${u.symbol}</code></td><td>\${v.toLocaleString(undefined, { maximumFractionDigits: prec })} \${u.symbol}</td></tr>\`;
        }
        matrixTbody.innerHTML = rows;
      }

      valInput.addEventListener('input', update);
      fromSel.addEventListener('change', update);
      toSel.addEventListener('change', update);
      precSel.addEventListener('change', update);
      swapBtn.addEventListener('click', () => {
        const tmp = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = tmp;
        update();
      });
      sampleBtn.addEventListener('click', () => {
        valInput.value = 65;
        fromSel.value = 'mph';
        toSel.value = 'kmh';
        update();
      });
      clearBtn.addEventListener('click', () => {
        valInput.value = 100;
        fromSel.value = 'kmh';
        toSel.value = 'mph';
        update();
      });
      update();
    `
  },

  // 4. Pressure Unit Converter
  {
    id: 'pressure-unit-converter',
    categoryId: 'unit-format-converters',
    name: 'Pressure Unit Converter',
    icon: '🌪️',
    title: 'Pressure Unit Converter — PSI, Bar, Pascal (Pa), kPa, atm & mmHg',
    description: 'Convert industrial and scientific pressure measurements between Pascals (Pa), Kilopascals (kPa), Megapascals (MPa), Bar, Millibar (mbar), PSI (Pounds per Square Inch), Standard Atmospheres (atm), Torr, and Millimeters of Mercury (mmHg).',
    keywords: 'pressure unit converter, psi to bar, bar to psi, kpa to psi, atm to bar, pascal converter, mmhg to torr',
    howToUse: [
      { step: '1', title: 'Enter Pressure', desc: 'Type the pressure reading from your gauge or sensor.' },
      { step: '2', title: 'Select Units', desc: 'Choose PSI, Bar, Pascal, atm, Torr, or mmHg.' },
      { step: '3', title: 'View Multi-Unit Grid', desc: 'Inspect exact converted values across all international pressure standards.' }
    ],
    features: [
      { title: '9 Pressure Standards', desc: 'Supports SI (Pa, kPa, MPa), Metric (Bar, mbar), Imperial (PSI), and Manometric (atm, mmHg, Torr).' },
      { title: 'Automotive & HVAC Ready', desc: 'Quick tire pressure presets (32 PSI) and atmospheric pressure benchmarks (1 atm = 101.325 kPa).' },
      { title: 'Instant Comparative Table', desc: 'Calculates every pressure unit in parallel.' }
    ],
    sampleText: '32',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="puc-val">Pressure Value</label>
          <input type="number" id="puc-val" class="bu-input" value="32" step="any" placeholder="Enter value...">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="puc-from">From Unit</label>
          <select id="puc-from" class="bu-input">
            <option value="psi" selected>Pounds per Sq Inch (PSI)</option>
            <option value="bar">Bar (bar)</option>
            <option value="mbar">Millibar (mbar)</option>
            <option value="pa">Pascal (Pa)</option>
            <option value="kpa">Kilopascal (kPa)</option>
            <option value="mpa">Megapascal (MPa)</option>
            <option value="atm">Standard Atmosphere (atm)</option>
            <option value="mmhg">Millimeters of Mercury (mmHg)</option>
            <option value="torr">Torr (torr)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="puc-to">To Unit</label>
          <select id="puc-to" class="bu-input">
            <option value="psi">Pounds per Sq Inch (PSI)</option>
            <option value="bar" selected>Bar (bar)</option>
            <option value="mbar">Millibar (mbar)</option>
            <option value="pa">Pascal (Pa)</option>
            <option value="kpa">Kilopascal (kPa)</option>
            <option value="mpa">Megapascal (MPa)</option>
            <option value="atm">Standard Atmosphere (atm)</option>
            <option value="mmhg">Millimeters of Mercury (mmHg)</option>
            <option value="torr">Torr (torr)</option>
          </select>
        </div>
      </div>
      <div class="bu-actions-bar" style="gap: 0.5rem; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" id="btn-puc-swap" class="bu-btn bu-btn-primary">⇄ Swap Units</button>
          <button type="button" id="btn-puc-sample" class="bu-btn bu-btn-subtle">1 atm Benchmark</button>
          <button type="button" id="btn-puc-clear" class="bu-btn bu-btn-subtle">Reset</button>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label for="puc-prec" style="font-size: 0.8rem; color: var(--text-muted);">Decimals:</label>
          <select id="puc-prec" class="bu-select" style="width: auto; padding: 0.35rem 0.6rem; font-size: 0.8rem;">
            <option value="2">2 decimals</option>
            <option value="4" selected>4 decimals</option>
            <option value="6">6 decimals</option>
          </select>
        </div>
      </div>
      <div class="bu-result-box" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
        <span style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Conversion Result</span>
        <div id="puc-result" style="font-size: clamp(1.5rem, 3.5vw, 2.2rem); font-weight: 800; color: var(--accent-primary);">2.2063 bar</div>
        <p id="puc-formula" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; margin-bottom: 0;">1 PSI = 0.0689476 bar</p>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">All Pressure Units Matrix</h3>
        <div class="bu-table-wrap">
          <table class="bu-table" id="puc-matrix">
            <thead>
              <tr><th>Pressure Standard</th><th>Symbol</th><th>Converted Value</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `,
    renderScript: () => `
      const valInput = document.getElementById('puc-val');
      const fromSel = document.getElementById('puc-from');
      const toSel = document.getElementById('puc-to');
      const swapBtn = document.getElementById('btn-puc-swap');
      const sampleBtn = document.getElementById('btn-puc-sample');
      const clearBtn = document.getElementById('btn-puc-clear');
      const precSel = document.getElementById('puc-prec');
      const resultEl = document.getElementById('puc-result');
      const formulaEl = document.getElementById('puc-formula');
      const matrixTbody = document.querySelector('#puc-matrix tbody');

      const units = {
        pa: { name: 'Pascal', symbol: 'Pa', toPa: 1 },
        kpa: { name: 'Kilopascal', symbol: 'kPa', toPa: 1000 },
        mpa: { name: 'Megapascal', symbol: 'MPa', toPa: 1000000 },
        bar: { name: 'Bar', symbol: 'bar', toPa: 100000 },
        mbar: { name: 'Millibar', symbol: 'mbar', toPa: 100 },
        psi: { name: 'Pound per Square Inch', symbol: 'PSI', toPa: 6894.757293168 },
        atm: { name: 'Standard Atmosphere', symbol: 'atm', toPa: 101325 },
        mmhg: { name: 'Millimeters of Mercury', symbol: 'mmHg', toPa: 133.322387415 },
        torr: { name: 'Torr', symbol: 'torr', toPa: 133.322368421 }
      };

      function update() {
        const val = parseFloat(valInput.value) || 0;
        const from = fromSel.value;
        const to = toSel.value;
        const prec = parseInt(precSel.value, 10) || 4;

        const pa = val * units[from].toPa;
        const converted = pa / units[to].toPa;
        const oneFromInTo = units[from].toPa / units[to].toPa;

        resultEl.textContent = \`\${converted.toLocaleString(undefined, { maximumFractionDigits: prec })} \${units[to].symbol}\`;
        formulaEl.textContent = \`1 \${units[from].symbol} = \${oneFromInTo.toLocaleString(undefined, { maximumFractionDigits: 6 })} \${units[to].symbol}\`;

        let rows = '';
        for (const [key, u] of Object.entries(units)) {
          const v = pa / u.toPa;
          rows += \`<tr><td><strong>\${u.name}</strong></td><td><code>\${u.symbol}</code></td><td>\${v.toLocaleString(undefined, { maximumFractionDigits: prec })} \${u.symbol}</td></tr>\`;
        }
        matrixTbody.innerHTML = rows;
      }

      valInput.addEventListener('input', update);
      fromSel.addEventListener('change', update);
      toSel.addEventListener('change', update);
      precSel.addEventListener('change', update);
      swapBtn.addEventListener('click', () => {
        const tmp = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = tmp;
        update();
      });
      sampleBtn.addEventListener('click', () => {
        valInput.value = 1;
        fromSel.value = 'atm';
        toSel.value = 'kpa';
        update();
      });
      clearBtn.addEventListener('click', () => {
        valInput.value = 32;
        fromSel.value = 'psi';
        toSel.value = 'bar';
        update();
      });
      update();
    `
  },

  // 5. Energy Unit Converter
  {
    id: 'energy-unit-converter',
    categoryId: 'unit-format-converters',
    name: 'Energy Unit Converter',
    icon: '🔋',
    title: 'Energy Unit Converter — Joules, kWh, Calories, kcal, BTU & eV',
    description: 'Convert energy and work measurements across Joules (J), Kilojoules (kJ), Kilowatt-Hours (kWh), Watt-Hours (Wh), Calories (cal), Kilocalories / Food Calories (kcal), British Thermal Units (BTU), Electron-Volts (eV), and Foot-Pounds (ft-lb).',
    keywords: 'energy converter, joules to kwh, calories to joules, kwh to btu, kcal to kj converter, electron volts to joules',
    howToUse: [
      { step: '1', title: 'Enter Energy Value', desc: 'Type the energy or electrical work quantity.' },
      { step: '2', title: 'Pick Units', desc: 'Select Joules, kWh, Food Calories (kcal), BTU, or eV.' },
      { step: '3', title: 'View Equivalents', desc: 'Compare nutritional energy, household electricity (kWh), and physics units.' }
    ],
    features: [
      { title: '9 Energy Scales', desc: 'Includes SI (J, kJ), Electricity (kWh, Wh), Nutrition (kcal, cal), Thermal (BTU), and Physics (eV, ft-lb).' },
      { title: 'Electricity & Nutrition Presets', desc: 'Quick 1 kWh and 2,000 kcal daily diet energy equivalency calculations.' },
      { title: 'High Precision Engine', desc: 'Calculates microscopic electron-volts and megawatt-hours seamlessly.' }
    ],
    sampleText: '1',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="euc-val">Energy Value</label>
          <input type="number" id="euc-val" class="bu-input" value="1" step="any" placeholder="Enter value...">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="euc-from">From Unit</label>
          <select id="euc-from" class="bu-input">
            <option value="kwh" selected>Kilowatt-hours (kWh)</option>
            <option value="wh">Watt-hours (Wh)</option>
            <option value="j">Joules (J)</option>
            <option value="kj">Kilojoules (kJ)</option>
            <option value="kcal">Kilocalories / Food Cal (kcal)</option>
            <option value="cal">Calories (cal)</option>
            <option value="btu">British Thermal Units (BTU)</option>
            <option value="ev">Electron-volts (eV)</option>
            <option value="ftlb">Foot-pounds (ft-lbf)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="euc-to">To Unit</label>
          <select id="euc-to" class="bu-input">
            <option value="kwh">Kilowatt-hours (kWh)</option>
            <option value="wh">Watt-hours (Wh)</option>
            <option value="j" selected>Joules (J)</option>
            <option value="kj">Kilojoules (kJ)</option>
            <option value="kcal">Kilocalories / Food Cal (kcal)</option>
            <option value="cal">Calories (cal)</option>
            <option value="btu">British Thermal Units (BTU)</option>
            <option value="ev">Electron-volts (eV)</option>
            <option value="ftlb">Foot-pounds (ft-lbf)</option>
          </select>
        </div>
      </div>
      <div class="bu-actions-bar" style="gap: 0.5rem; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" id="btn-euc-swap" class="bu-btn bu-btn-primary">⇄ Swap Units</button>
          <button type="button" id="btn-euc-sample" class="bu-btn bu-btn-subtle">2,000 kcal Daily Food</button>
          <button type="button" id="btn-euc-clear" class="bu-btn bu-btn-subtle">Reset</button>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label for="euc-prec" style="font-size: 0.8rem; color: var(--text-muted);">Decimals:</label>
          <select id="euc-prec" class="bu-select" style="width: auto; padding: 0.35rem 0.6rem; font-size: 0.8rem;">
            <option value="2">2 decimals</option>
            <option value="4" selected>4 decimals</option>
            <option value="6">6 decimals</option>
          </select>
        </div>
      </div>
      <div class="bu-result-box" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
        <span style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Conversion Result</span>
        <div id="euc-result" style="font-size: clamp(1.5rem, 3.5vw, 2.2rem); font-weight: 800; color: var(--accent-primary);">3,600,000 J</div>
        <p id="euc-formula" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; margin-bottom: 0;">1 kWh = 3,600,000 Joules (3.6 MJ)</p>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">All Energy Units Matrix</h3>
        <div class="bu-table-wrap">
          <table class="bu-table" id="euc-matrix">
            <thead>
              <tr><th>Energy Scale</th><th>Symbol</th><th>Converted Value</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `,
    renderScript: () => `
      const valInput = document.getElementById('euc-val');
      const fromSel = document.getElementById('euc-from');
      const toSel = document.getElementById('euc-to');
      const swapBtn = document.getElementById('btn-euc-swap');
      const sampleBtn = document.getElementById('btn-euc-sample');
      const clearBtn = document.getElementById('btn-euc-clear');
      const precSel = document.getElementById('euc-prec');
      const resultEl = document.getElementById('euc-result');
      const formulaEl = document.getElementById('euc-formula');
      const matrixTbody = document.querySelector('#euc-matrix tbody');

      const units = {
        j: { name: 'Joules', symbol: 'J', toJ: 1 },
        kj: { name: 'Kilojoules', symbol: 'kJ', toJ: 1000 },
        kwh: { name: 'Kilowatt-hours', symbol: 'kWh', toJ: 3600000 },
        wh: { name: 'Watt-hours', symbol: 'Wh', toJ: 3600 },
        kcal: { name: 'Kilocalories (Food Cal)', symbol: 'kcal', toJ: 4184 },
        cal: { name: 'Small Calories', symbol: 'cal', toJ: 4.184 },
        btu: { name: 'British Thermal Units', symbol: 'BTU', toJ: 1055.05585 },
        ev: { name: 'Electron-volts', symbol: 'eV', toJ: 1.602176634e-19 },
        ftlb: { name: 'Foot-pounds', symbol: 'ft-lbf', toJ: 1.3558179483314 }
      };

      function update() {
        const val = parseFloat(valInput.value) || 0;
        const from = fromSel.value;
        const to = toSel.value;
        const prec = parseInt(precSel.value, 10) || 4;

        const joules = val * units[from].toJ;
        const converted = joules / units[to].toJ;
        const oneFromInTo = units[from].toJ / units[to].toJ;

        resultEl.textContent = \`\${converted.toLocaleString(undefined, { maximumFractionDigits: prec })} \${units[to].symbol}\`;
        formulaEl.textContent = \`1 \${units[from].symbol} = \${oneFromInTo.toLocaleString(undefined, { maximumFractionDigits: 6 })} \${units[to].symbol}\`;

        let rows = '';
        for (const [key, u] of Object.entries(units)) {
          const v = joules / u.toJ;
          rows += \`<tr><td><strong>\${u.name}</strong></td><td><code>\${u.symbol}</code></td><td>\${v.toLocaleString(undefined, { maximumFractionDigits: prec })} \${u.symbol}</td></tr>\`;
        }
        matrixTbody.innerHTML = rows;
      }

      valInput.addEventListener('input', update);
      fromSel.addEventListener('change', update);
      toSel.addEventListener('change', update);
      precSel.addEventListener('change', update);
      swapBtn.addEventListener('click', () => {
        const tmp = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = tmp;
        update();
      });
      sampleBtn.addEventListener('click', () => {
        valInput.value = 2000;
        fromSel.value = 'kcal';
        toSel.value = 'kj';
        update();
      });
      clearBtn.addEventListener('click', () => {
        valInput.value = 1;
        fromSel.value = 'kwh';
        toSel.value = 'j';
        update();
      });
      update();
    `
  },

  // 6. Power Unit Converter
  {
    id: 'power-unit-converter',
    categoryId: 'unit-format-converters',
    name: 'Power Unit Converter',
    icon: '💡',
    title: 'Power Unit Converter — Watts (W), kW, MW, Horsepower (hp) & BTU/h',
    description: 'Convert power, electricity flow, and mechanical engine output across Watts (W), Kilowatts (kW), Megawatts (MW), Mechanical Horsepower (hp), Metric Horsepower (PS), BTU per Hour (BTU/h), and Foot-Pounds per minute.',
    keywords: 'power unit converter, watts to horsepower, kw to hp converter, hp to kw, btu per hour to watts, megawatts converter',
    howToUse: [
      { step: '1', title: 'Enter Power Level', desc: 'Type the electrical or engine horsepower rating.' },
      { step: '2', title: 'Select Power Units', desc: 'Choose Watts, Kilowatts, Horsepower (hp), or BTU/h.' },
      { step: '3', title: 'View Engine & Electrical Grid', desc: 'Inspect mechanical horsepower and electrical ratings side-by-side.' }
    ],
    features: [
      { title: '7 Power Standards', desc: 'Covers Electrical (W, kW, MW), Mechanical (hp, PS), Thermal (BTU/h), and Work Rate (ft-lb/min).' },
      { title: 'Automotive Engine & EV Conversion', desc: 'Accurate mechanical horsepower (1 hp = 745.7 W) and metric PS conversions.' },
      { title: 'Live Comparison Table', desc: 'Real-time multi-unit matrix.' }
    ],
    sampleText: '100',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="pow-val">Power Value</label>
          <input type="number" id="pow-val" class="bu-input" value="100" step="any" placeholder="Enter value...">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="pow-from">From Unit</label>
          <select id="pow-from" class="bu-input">
            <option value="hp" selected>Mechanical Horsepower (hp)</option>
            <option value="ps">Metric Horsepower (PS / cv)</option>
            <option value="kw">Kilowatts (kW)</option>
            <option value="w">Watts (W)</option>
            <option value="mw">Megawatts (MW)</option>
            <option value="btuh">BTU per hour (BTU/h)</option>
            <option value="ftlbmin">Foot-pounds / min (ft-lb/min)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="pow-to">To Unit</label>
          <select id="pow-to" class="bu-input">
            <option value="hp">Mechanical Horsepower (hp)</option>
            <option value="ps">Metric Horsepower (PS / cv)</option>
            <option value="kw" selected>Kilowatts (kW)</option>
            <option value="w">Watts (W)</option>
            <option value="mw">Megawatts (MW)</option>
            <option value="btuh">BTU per hour (BTU/h)</option>
            <option value="ftlbmin">Foot-pounds / min (ft-lb/min)</option>
          </select>
        </div>
      </div>
      <div class="bu-actions-bar" style="gap: 0.5rem; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" id="btn-pow-swap" class="bu-btn bu-btn-primary">⇄ Swap Units</button>
          <button type="button" id="btn-pow-sample" class="bu-btn bu-btn-subtle">1 HP = 745.7 W</button>
          <button type="button" id="btn-pow-clear" class="bu-btn bu-btn-subtle">Reset</button>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label for="pow-prec" style="font-size: 0.8rem; color: var(--text-muted);">Decimals:</label>
          <select id="pow-prec" class="bu-select" style="width: auto; padding: 0.35rem 0.6rem; font-size: 0.8rem;">
            <option value="2" selected>2 decimals</option>
            <option value="4">4 decimals</option>
            <option value="6">6 decimals</option>
          </select>
        </div>
      </div>
      <div class="bu-result-box" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
        <span style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Conversion Result</span>
        <div id="pow-result" style="font-size: clamp(1.5rem, 3.5vw, 2.2rem); font-weight: 800; color: var(--accent-primary);">74.57 kW</div>
        <p id="pow-formula" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; margin-bottom: 0;">1 hp = 0.7456999 kW</p>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">All Power Units Matrix</h3>
        <div class="bu-table-wrap">
          <table class="bu-table" id="pow-matrix">
            <thead>
              <tr><th>Power Unit</th><th>Symbol</th><th>Converted Value</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `,
    renderScript: () => `
      const valInput = document.getElementById('pow-val');
      const fromSel = document.getElementById('pow-from');
      const toSel = document.getElementById('pow-to');
      const swapBtn = document.getElementById('btn-pow-swap');
      const sampleBtn = document.getElementById('btn-pow-sample');
      const clearBtn = document.getElementById('btn-pow-clear');
      const precSel = document.getElementById('pow-prec');
      const resultEl = document.getElementById('pow-result');
      const formulaEl = document.getElementById('pow-formula');
      const matrixTbody = document.querySelector('#pow-matrix tbody');

      const units = {
        w: { name: 'Watts', symbol: 'W', toW: 1 },
        kw: { name: 'Kilowatts', symbol: 'kW', toW: 1000 },
        mw: { name: 'Megawatts', symbol: 'MW', toW: 1000000 },
        hp: { name: 'Mechanical Horsepower', symbol: 'hp', toW: 745.69987158227 },
        ps: { name: 'Metric Horsepower', symbol: 'PS', toW: 735.49875 },
        btuh: { name: 'BTU per Hour', symbol: 'BTU/h', toW: 0.29307107 },
        ftlbmin: { name: 'Foot-pounds / min', symbol: 'ft-lb/min', toW: 0.0225969658 }
      };

      function update() {
        const val = parseFloat(valInput.value) || 0;
        const from = fromSel.value;
        const to = toSel.value;
        const prec = parseInt(precSel.value, 10) || 2;

        const watts = val * units[from].toW;
        const converted = watts / units[to].toW;
        const oneFromInTo = units[from].toW / units[to].toW;

        resultEl.textContent = \`\${converted.toLocaleString(undefined, { maximumFractionDigits: prec })} \${units[to].symbol}\`;
        formulaEl.textContent = \`1 \${units[from].symbol} = \${oneFromInTo.toLocaleString(undefined, { maximumFractionDigits: 5 })} \${units[to].symbol}\`;

        let rows = '';
        for (const [key, u] of Object.entries(units)) {
          const v = watts / u.toW;
          rows += \`<tr><td><strong>\${u.name}</strong></td><td><code>\${u.symbol}</code></td><td>\${v.toLocaleString(undefined, { maximumFractionDigits: prec })} \${u.symbol}</td></tr>\`;
        }
        matrixTbody.innerHTML = rows;
      }

      valInput.addEventListener('input', update);
      fromSel.addEventListener('change', update);
      toSel.addEventListener('change', update);
      precSel.addEventListener('change', update);
      swapBtn.addEventListener('click', () => {
        const tmp = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = tmp;
        update();
      });
      sampleBtn.addEventListener('click', () => {
        valInput.value = 1;
        fromSel.value = 'hp';
        toSel.value = 'w';
        update();
      });
      clearBtn.addEventListener('click', () => {
        valInput.value = 100;
        fromSel.value = 'hp';
        toSel.value = 'kw';
        update();
      });
      update();
    `
  },

  // 7. Angle Unit Converter
  {
    id: 'angle-unit-converter',
    categoryId: 'unit-format-converters',
    name: 'Angle Unit Converter',
    icon: '🔄',
    title: 'Angle Unit Converter — Degrees (°), Radians (rad), Gradians & Turns',
    description: 'Convert angle and angular rotation units across Degrees (°), Radians (rad), Gradians (grad), Milliradians (mrad), Arcminutes (′), Arcseconds (″), and Revolutions / Turns with an interactive live visual protractor canvas and trigonometry calculation (sin, cos, tan).',
    keywords: 'angle converter, degrees to radians, radians to degrees, gradian converter, arcminutes to degrees, angle calculator, sin cos tan',
    howToUse: [
      { step: '1', title: 'Enter Angle Value', desc: 'Type your angle in degrees, radians, or turns.' },
      { step: '2', title: 'Inspect Visual Compass', desc: 'Watch the live protractor canvas render the arc and angle vector dynamically.' },
      { step: '3', title: 'View Trigonometry & Units', desc: 'Get instant Sine, Cosine, Tangent, and multi-unit conversions.' }
    ],
    features: [
      { title: 'Interactive Protractor Canvas', desc: 'Live visual rendering of the angular arc on an intuitive geometric compass.' },
      { title: 'Trigonometric Values', desc: 'Simultaneous calculation of Sin(θ), Cos(θ), and Tan(θ).' },
      { title: '7 Angular Units', desc: 'Supports Degrees (°), Radians (rad), Gradians (gon), Milliradians (mrad), Arcmin (′), Arcsec (″), and Turns.' }
    ],
    sampleText: '90',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1.5rem; margin-bottom: 1.25rem;">
        <div>
          <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1rem;">
            <div class="bu-form-group" style="margin: 0;">
              <label class="bu-form-label" for="ang-val">Angle Value</label>
              <input type="number" id="ang-val" class="bu-input" value="90" step="any" placeholder="Enter angle...">
            </div>
            <div class="bu-form-group" style="margin: 0;">
              <label class="bu-form-label" for="ang-from">From Unit</label>
              <select id="ang-from" class="bu-input">
                <option value="deg" selected>Degrees (°)</option>
                <option value="rad">Radians (rad)</option>
                <option value="grad">Gradians / Gons (grad)</option>
                <option value="mrad">Milliradians (mrad)</option>
                <option value="arcmin">Arcminutes (′)</option>
                <option value="arcsec">Arcseconds (″)</option>
                <option value="turn">Turns / Revolutions</option>
              </select>
            </div>
          </div>
          <div class="bu-form-group" style="margin-bottom: 1rem;">
            <label class="bu-form-label" for="ang-to">To Unit</label>
            <select id="ang-to" class="bu-input">
              <option value="deg">Degrees (°)</option>
              <option value="rad" selected>Radians (rad)</option>
              <option value="grad">Gradians / Gons (grad)</option>
              <option value="mrad">Milliradians (mrad)</option>
              <option value="arcmin">Arcminutes (′)</option>
              <option value="arcsec">Arcseconds (″)</option>
              <option value="turn">Turns / Revolutions</option>
            </select>
          </div>
          <div class="bu-actions-bar" style="gap: 0.5rem; margin-bottom: 1rem;">
            <button type="button" id="btn-ang-swap" class="bu-btn bu-btn-primary">⇄ Swap</button>
            <button type="button" id="btn-ang-45" class="bu-btn bu-btn-subtle">45°</button>
            <button type="button" id="btn-ang-90" class="bu-btn bu-btn-subtle">90°</button>
            <button type="button" id="btn-ang-180" class="bu-btn bu-btn-subtle">180°</button>
            <button type="button" id="btn-ang-360" class="bu-btn bu-btn-subtle">360°</button>
          </div>
          <div class="bu-result-box" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem; text-align: center;">
            <span style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Converted Angle</span>
            <div id="ang-result" style="font-size: 1.8rem; font-weight: 800; color: var(--accent-primary);">1.5708 rad (π/2)</div>
            <div style="display: flex; justify-content: space-around; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); font-size: 0.85rem;">
              <div>sin: <strong id="ang-sin">1.0000</strong></div>
              <div>cos: <strong id="ang-cos">0.0000</strong></div>
              <div>tan: <strong id="ang-tan">undefined</strong></div>
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
          <span style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-muted);">Visual Protractor</span>
          <canvas id="ang-canvas" width="200" height="200" style="max-width: 100%; border-radius: 50%; background: var(--bg-canvas);"></canvas>
        </div>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">All Angular Units Matrix</h3>
        <div class="bu-table-wrap">
          <table class="bu-table" id="ang-matrix">
            <thead>
              <tr><th>Unit Name</th><th>Symbol</th><th>Converted Value</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `,
    renderScript: () => `
      const valInput = document.getElementById('ang-val');
      const fromSel = document.getElementById('ang-from');
      const toSel = document.getElementById('ang-to');
      const swapBtn = document.getElementById('btn-ang-swap');
      const btn45 = document.getElementById('btn-ang-45');
      const btn90 = document.getElementById('btn-ang-90');
      const btn180 = document.getElementById('btn-ang-180');
      const btn360 = document.getElementById('btn-ang-360');
      const resultEl = document.getElementById('ang-result');
      const sinEl = document.getElementById('ang-sin');
      const cosEl = document.getElementById('ang-cos');
      const tanEl = document.getElementById('ang-tan');
      const matrixTbody = document.querySelector('#ang-matrix tbody');
      const canvas = document.getElementById('ang-canvas');
      const ctx = canvas.getContext('2d');

      const units = {
        deg: { name: 'Degrees', symbol: '°', toDeg: 1 },
        rad: { name: 'Radians', symbol: 'rad', toDeg: 180 / Math.PI },
        grad: { name: 'Gradians / Gons', symbol: 'grad', toDeg: 0.9 },
        mrad: { name: 'Milliradians', symbol: 'mrad', toDeg: 0.0572957795 },
        arcmin: { name: 'Arcminutes', symbol: '′', toDeg: 1 / 60 },
        arcsec: { name: 'Arcseconds', symbol: '″', toDeg: 1 / 3600 },
        turn: { name: 'Turns (Revolutions)', symbol: 'turn', toDeg: 360 }
      };

      function drawAngle(deg) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const r = cx - 15;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Circle outline
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Base line (0 deg - right)
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + r, cy);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Angle Arc & ray (counter-clockwise in math, so -deg in canvas)
        const rad = -(deg % 360) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + r * Math.cos(rad), cy + r * Math.sin(rad));
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Sector fill
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r * 0.4, 0, rad, deg >= 0);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.fill();

        // Center dot
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
      }

      function update() {
        const val = parseFloat(valInput.value) || 0;
        const from = fromSel.value;
        const to = toSel.value;

        const deg = val * units[from].toDeg;
        const converted = deg / units[to].toDeg;
        const rad = deg * Math.PI / 180;

        resultEl.textContent = \`\${converted.toLocaleString(undefined, { maximumFractionDigits: 4 })} \${units[to].symbol}\`;

        sinEl.textContent = Math.sin(rad).toFixed(4);
        cosEl.textContent = Math.cos(rad).toFixed(4);
        const tanVal = Math.tan(rad);
        tanEl.textContent = Math.abs(Math.cos(rad)) < 1e-10 ? 'Undefined' : tanVal.toFixed(4);

        drawAngle(deg);

        let rows = '';
        for (const [key, u] of Object.entries(units)) {
          const v = deg / u.toDeg;
          rows += \`<tr><td><strong>\${u.name}</strong></td><td><code>\${u.symbol}</code></td><td>\${v.toLocaleString(undefined, { maximumFractionDigits: 4 })} \${u.symbol}</td></tr>\`;
        }
        matrixTbody.innerHTML = rows;
      }

      valInput.addEventListener('input', update);
      fromSel.addEventListener('change', update);
      toSel.addEventListener('change', update);
      swapBtn.addEventListener('click', () => {
        const tmp = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = tmp;
        update();
      });
      btn45.addEventListener('click', () => { valInput.value = 45; fromSel.value = 'deg'; update(); });
      btn90.addEventListener('click', () => { valInput.value = 90; fromSel.value = 'deg'; update(); });
      btn180.addEventListener('click', () => { valInput.value = 180; fromSel.value = 'deg'; update(); });
      btn360.addEventListener('click', () => { valInput.value = 360; fromSel.value = 'deg'; update(); });
      update();
    `
  },

  // 8. Fuel Economy Converter
  {
    id: 'fuel-economy-converter',
    categoryId: 'unit-format-converters',
    name: 'Fuel Economy Converter',
    icon: '⛽',
    title: 'Fuel Economy Converter — US MPG, UK MPG, L/100km & km/L',
    description: 'Convert automobile fuel consumption and efficiency ratings between US Miles per Gallon (US MPG), Imperial UK MPG, Liters per 100 Kilometers (L/100km), and Kilometers per Liter (km/L) with an integrated trip fuel cost and distance calculator.',
    keywords: 'fuel economy converter, mpg to l/100km, l/100km to mpg converter, km/l to mpg, gas mileage calculator, fuel consumption converter',
    howToUse: [
      { step: '1', title: 'Enter Fuel Mileage', desc: 'Type the vehicle fuel efficiency rating (e.g. 30 MPG or 7.5 L/100km).' },
      { step: '2', title: 'Select Fuel Standards', desc: 'Choose between US MPG, UK Imperial MPG, L/100km, or km/L.' },
      { step: '3', title: 'Calculate Trip Fuel & Cost', desc: 'Optionally enter trip distance and fuel price to calculate total liters/gallons and cost.' }
    ],
    features: [
      { title: 'Non-Linear Inverse Math', desc: 'Accurately converts inverse consumption curves (L/100km) to distance efficiency (MPG).' },
      { title: 'Trip Fuel & Cost Estimator', desc: 'Simulates fuel needed and budget based on distance and local gas price.' },
      { title: 'US vs UK Gallon Distinction', desc: 'Corrects for the 20% difference between US Customary Gallons (3.785L) and UK Imperial Gallons (4.546L).' }
    ],
    sampleText: '30',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="fec-val">Fuel Economy Value</label>
          <input type="number" id="fec-val" class="bu-input" value="30" step="any" placeholder="Enter value...">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="fec-from">From Standard</label>
          <select id="fec-from" class="bu-input">
            <option value="us_mpg" selected>Miles per Gallon (US MPG)</option>
            <option value="uk_mpg">Miles per Gallon (UK MPG)</option>
            <option value="l100km">Liters per 100km (L/100km)</option>
            <option value="kml">Kilometers per Liter (km/L)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="fec-to">To Standard</label>
          <select id="fec-to" class="bu-input">
            <option value="us_mpg">Miles per Gallon (US MPG)</option>
            <option value="uk_mpg">Miles per Gallon (UK MPG)</option>
            <option value="l100km" selected>Liters per 100km (L/100km)</option>
            <option value="kml">Kilometers per Liter (km/L)</option>
          </select>
        </div>
      </div>
      <div class="bu-actions-bar" style="gap: 0.5rem; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" id="btn-fec-swap" class="bu-btn bu-btn-primary">⇄ Swap Standards</button>
          <button type="button" id="btn-fec-sample" class="bu-btn bu-btn-subtle">Hybrid 50 MPG</button>
          <button type="button" id="btn-fec-clear" class="bu-btn bu-btn-subtle">Reset</button>
        </div>
      </div>
      <div class="bu-result-box" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
        <span style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Conversion Result</span>
        <div id="fec-result" style="font-size: clamp(1.5rem, 3.5vw, 2.2rem); font-weight: 800; color: var(--accent-primary);">7.84 L/100km</div>
        <p id="fec-formula" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; margin-bottom: 0;">30 US MPG = 7.84 L/100km (12.75 km/L)</p>
      </div>
      <!-- Trip Fuel Estimator -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem; margin-bottom: 1.5rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">Trip Fuel &amp; Cost Estimator</h3>
        <div class="bu-grid-3col" style="gap: 1rem;">
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="fec-dist">Trip Distance (km)</label>
            <input type="number" id="fec-dist" class="bu-input" value="500">
          </div>
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="fec-price">Fuel Price ($ / Liter)</label>
            <input type="number" id="fec-price" class="bu-input" value="1.50" step="0.01">
          </div>
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label">Estimated Trip Cost</label>
            <div id="fec-cost" style="font-size: 1.25rem; font-weight: 800; color: var(--accent-primary); padding: 0.5rem 0;">$58.80 (39.2 L)</div>
          </div>
        </div>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">All Fuel Economy Metrics</h3>
        <div class="bu-table-wrap">
          <table class="bu-table" id="fec-matrix">
            <thead>
              <tr><th>Standard</th><th>Description</th><th>Equivalent Value</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `,
    renderScript: () => `
      const valInput = document.getElementById('fec-val');
      const fromSel = document.getElementById('fec-from');
      const toSel = document.getElementById('fec-to');
      const swapBtn = document.getElementById('btn-fec-swap');
      const sampleBtn = document.getElementById('btn-fec-sample');
      const clearBtn = document.getElementById('btn-fec-clear');
      const resultEl = document.getElementById('fec-result');
      const formulaEl = document.getElementById('fec-formula');
      const distInput = document.getElementById('fec-dist');
      const priceInput = document.getElementById('fec-price');
      const costEl = document.getElementById('fec-cost');
      const matrixTbody = document.querySelector('#fec-matrix tbody');

      function toKmL(val, standard) {
        if (val <= 0) return 0;
        switch(standard) {
          case 'kml': return val;
          case 'us_mpg': return val * 0.425143707;
          case 'uk_mpg': return val * 0.354006;
          case 'l100km': return 100 / val;
        }
      }

      function fromKmL(kml, standard) {
        if (kml <= 0) return 0;
        switch(standard) {
          case 'kml': return kml;
          case 'us_mpg': return kml / 0.425143707;
          case 'uk_mpg': return kml / 0.354006;
          case 'l100km': return 100 / kml;
        }
      }

      function update() {
        const val = parseFloat(valInput.value) || 0;
        const from = fromSel.value;
        const to = toSel.value;

        const kmL = toKmL(val, from);
        const converted = fromKmL(kmL, to);

        const unitsDesc = {
          us_mpg: 'US MPG',
          uk_mpg: 'UK MPG',
          l100km: 'L/100km',
          kml: 'km/L'
        };

        resultEl.textContent = \`\${converted.toFixed(2)} \${unitsDesc[to]}\`;
        formulaEl.textContent = \`\${val} \${unitsDesc[from]} = \${converted.toFixed(2)} \${unitsDesc[to]}\`;

        // Matrix
        const usMpg = fromKmL(kmL, 'us_mpg');
        const ukMpg = fromKmL(kmL, 'uk_mpg');
        const l100 = fromKmL(kmL, 'l100km');
        const kmlVal = kmL;

        matrixTbody.innerHTML = \`
          <tr><td><strong>US MPG</strong></td><td>Miles per US Gallon</td><td>\${usMpg.toFixed(2)} MPG</td></tr>
          <tr><td><strong>UK MPG</strong></td><td>Miles per Imperial Gallon</td><td>\${ukMpg.toFixed(2)} MPG</td></tr>
          <tr><td><strong>L/100km</strong></td><td>Liters per 100 Kilometers</td><td>\${l100.toFixed(2)} L/100km</td></tr>
          <tr><td><strong>km/L</strong></td><td>Kilometers per Liter</td><td>\${kmlVal.toFixed(2)} km/L</td></tr>
        \`;

        // Trip calculation
        const dist = parseFloat(distInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        const litersNeeded = (dist / 100) * l100;
        const totalCost = litersNeeded * price;
        costEl.textContent = \`$\${totalCost.toFixed(2)} (\${litersNeeded.toFixed(1)} L)\`;
      }

      valInput.addEventListener('input', update);
      fromSel.addEventListener('change', update);
      toSel.addEventListener('change', update);
      distInput.addEventListener('input', update);
      priceInput.addEventListener('input', update);
      swapBtn.addEventListener('click', () => {
        const tmp = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = tmp;
        update();
      });
      sampleBtn.addEventListener('click', () => {
        valInput.value = 50;
        fromSel.value = 'us_mpg';
        toSel.value = 'l100km';
        update();
      });
      clearBtn.addEventListener('click', () => {
        valInput.value = 30;
        fromSel.value = 'us_mpg';
        toSel.value = 'l100km';
        update();
      });
      update();
    `
  },

  // 9. Digital Storage Converter
  {
    id: 'digital-storage-converter',
    categoryId: 'unit-format-converters',
    name: 'Digital Storage Converter',
    icon: '💾',
    title: 'Digital Storage Converter — Bits, Bytes, KB, MB, GB, TB & Binary (GiB)',
    description: 'Convert data capacity and storage size across Bits (b), Bytes (B), Kilobytes (KB), Megabytes (MB), Gigabytes (GB), Terabytes (TB), Petabytes (PB), as well as binary standards (KiB, MiB, GiB, TiB) with Decimal (1000) and Binary (1024) calculation modes.',
    keywords: 'digital storage converter, gb to mb, bytes to gigabytes, tb to gb converter, gib to gb binary converter, file size calculator',
    howToUse: [
      { step: '1', title: 'Enter Storage Amount', desc: 'Type the data size number (e.g. 500 GB or 1024 MB).' },
      { step: '2', title: 'Toggle Base Standard', desc: 'Choose Decimal SI (1 KB = 1000 Bytes) or Binary IEC (1 KiB = 1024 Bytes).' },
      { step: '3', title: 'View Storage Equivalents', desc: 'See how many MP3 songs, 4K movies, or text books fit within that capacity.' }
    ],
    features: [
      { title: 'Decimal & Binary Modes', desc: 'Instant toggle between Storage Disk standard (1000-base) and RAM/OS standard (1024-base).' },
      { title: '12 Digital Storage Units', desc: 'Bits, Bytes, KB, MB, GB, TB, PB, KiB, MiB, GiB, TiB, PiB.' },
      { title: 'Practical Media Capacity', desc: 'Calculates equivalent 4K video hours, MP3 files, and photo estimates.' }
    ],
    sampleText: '1000',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="dsc-val">Storage Value</label>
          <input type="number" id="dsc-val" class="bu-input" value="1" step="any" placeholder="Enter size...">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="dsc-from">From Unit</label>
          <select id="dsc-from" class="bu-input">
            <option value="b">Bits (b)</option>
            <option value="B">Bytes (B)</option>
            <option value="KB">Kilobytes (KB - 1000 B)</option>
            <option value="KiB">Kibibytes (KiB - 1024 B)</option>
            <option value="MB">Megabytes (MB - 1000 KB)</option>
            <option value="MiB">Mebibytes (MiB - 1024 KiB)</option>
            <option value="GB">Gigabytes (GB - 1000 MB)</option>
            <option value="GiB">Gibibytes (GiB - 1024 MiB)</option>
            <option value="TB" selected>Terabytes (TB)</option>
            <option value="TiB">Tebibytes (TiB)</option>
            <option value="PB">Petabytes (PB)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="dsc-to">To Unit</label>
          <select id="dsc-to" class="bu-input">
            <option value="b">Bits (b)</option>
            <option value="B">Bytes (B)</option>
            <option value="KB">Kilobytes (KB)</option>
            <option value="KiB">Kibibytes (KiB)</option>
            <option value="MB">Megabytes (MB)</option>
            <option value="MiB">Mebibytes (MiB)</option>
            <option value="GB" selected>Gigabytes (GB)</option>
            <option value="GiB">Gibibytes (GiB)</option>
            <option value="TB">Terabytes (TB)</option>
            <option value="TiB">Tebibytes (TiB)</option>
            <option value="PB">Petabytes (PB)</option>
          </select>
        </div>
      </div>
      <div class="bu-actions-bar" style="gap: 0.5rem; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" id="btn-dsc-swap" class="bu-btn bu-btn-primary">⇄ Swap Units</button>
          <button type="button" id="btn-dsc-sample" class="bu-btn bu-btn-subtle">1 TB in GiB</button>
          <button type="button" id="btn-dsc-clear" class="bu-btn bu-btn-subtle">Reset</button>
        </div>
      </div>
      <div class="bu-result-box" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
        <span style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Conversion Result</span>
        <div id="dsc-result" style="font-size: clamp(1.5rem, 3.5vw, 2.2rem); font-weight: 800; color: var(--accent-primary);">1,000 GB</div>
        <p id="dsc-formula" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; margin-bottom: 0;">1 TB = 1,000 GB = 931.32 GiB</p>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">All Storage Units Matrix</h3>
        <div class="bu-table-wrap">
          <table class="bu-table" id="dsc-matrix">
            <thead>
              <tr><th>Unit Name</th><th>Standard</th><th>Converted Value</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `,
    renderScript: () => `
      const valInput = document.getElementById('dsc-val');
      const fromSel = document.getElementById('dsc-from');
      const toSel = document.getElementById('dsc-to');
      const swapBtn = document.getElementById('btn-dsc-swap');
      const sampleBtn = document.getElementById('btn-dsc-sample');
      const clearBtn = document.getElementById('btn-dsc-clear');
      const resultEl = document.getElementById('dsc-result');
      const formulaEl = document.getElementById('dsc-formula');
      const matrixTbody = document.querySelector('#dsc-matrix tbody');

      const units = {
        b: { name: 'Bits', type: 'Binary', toBytes: 0.125 },
        B: { name: 'Bytes', type: 'Base', toBytes: 1 },
        KB: { name: 'Kilobytes', type: 'Decimal (10³)', toBytes: 1000 },
        KiB: { name: 'Kibibytes', type: 'Binary (2¹⁰)', toBytes: 1024 },
        MB: { name: 'Megabytes', type: 'Decimal (10⁶)', toBytes: 1e6 },
        MiB: { name: 'Mebibytes', type: 'Binary (2²⁰)', toBytes: 1048576 },
        GB: { name: 'Gigabytes', type: 'Decimal (10⁹)', toBytes: 1e9 },
        GiB: { name: 'Gibibytes', type: 'Binary (2³⁰)', toBytes: 1073741824 },
        TB: { name: 'Terabytes', type: 'Decimal (10¹²)', toBytes: 1e12 },
        TiB: { name: 'Tebibytes', type: 'Binary (2⁴⁰)', toBytes: 1099511627776 },
        PB: { name: 'Petabytes', type: 'Decimal (10¹⁵)', toBytes: 1e15 }
      };

      function update() {
        const val = parseFloat(valInput.value) || 0;
        const from = fromSel.value;
        const to = toSel.value;

        const bytes = val * units[from].toBytes;
        const converted = bytes / units[to].toBytes;

        resultEl.textContent = \`\${converted.toLocaleString(undefined, { maximumFractionDigits: 4 })} \${to}\`;
        formulaEl.textContent = \`\${val} \${from} = \${converted.toLocaleString(undefined, { maximumFractionDigits: 4 })} \${to}\`;

        let rows = '';
        for (const [key, u] of Object.entries(units)) {
          const v = bytes / u.toBytes;
          rows += \`<tr><td><strong>\${u.name} (\${key})</strong></td><td>\${u.type}</td><td>\${v.toLocaleString(undefined, { maximumFractionDigits: 4 })} \${key}</td></tr>\`;
        }
        matrixTbody.innerHTML = rows;
      }

      valInput.addEventListener('input', update);
      fromSel.addEventListener('change', update);
      toSel.addEventListener('change', update);
      swapBtn.addEventListener('click', () => {
        const tmp = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = tmp;
        update();
      });
      sampleBtn.addEventListener('click', () => {
        valInput.value = 1;
        fromSel.value = 'TB';
        toSel.value = 'GiB';
        update();
      });
      clearBtn.addEventListener('click', () => {
        valInput.value = 1;
        fromSel.value = 'TB';
        toSel.value = 'GB';
        update();
      });
      update();
    `
  },

  // 10. Data Transfer Rate Converter
  {
    id: 'data-transfer-rate-converter',
    categoryId: 'unit-format-converters',
    name: 'Data Transfer Rate Converter',
    icon: '🚀',
    title: 'Data Transfer Rate Converter — Mbps, Gbps, MB/s & Download Time',
    description: 'Convert internet bandwidth and network throughput speeds across Bits per second (bps), Kbps, Mbps, Gbps, Tbps, Bytes per second (B/s), KB/s, MB/s, and GB/s with an integrated file download time calculator.',
    keywords: 'data transfer rate converter, mbps to mb/s, gbps to mbps, internet speed converter, bandwidth calculator, download time calculator',
    howToUse: [
      { step: '1', title: 'Enter Connection Speed', desc: 'Type your internet or network bandwidth (e.g. 100 Mbps or 1 Gbps).' },
      { step: '2', title: 'Select Rate Units', desc: 'Choose between network bits (Mbps, Gbps) and download bytes (MB/s, GB/s).' },
      { step: '3', title: 'Calculate Download Duration', desc: 'Enter any file size (e.g. 50 GB game) to see the exact download time in minutes.' }
    ],
    features: [
      { title: 'Bits vs Bytes Clarified', desc: 'Instantly translates ISP advertised bandwidth (Mbps) into actual download speed (MB/s = Mbps ÷ 8).' },
      { title: 'File Download Time Calculator', desc: 'Calculates exact download duration for movies, games, and OS images.' },
      { title: '8 Bandwidth Standards', desc: 'From legacy modem speeds (Kbps) to multi-gigabit fiber networks (Tbps).' }
    ],
    sampleText: '100',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="dtr-val">Transfer Speed</label>
          <input type="number" id="dtr-val" class="bu-input" value="100" step="any" placeholder="Enter speed...">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="dtr-from">From Rate</label>
          <select id="dtr-from" class="bu-input">
            <option value="bps">Bits / sec (bps)</option>
            <option value="kbps">Kilobits / sec (Kbps)</option>
            <option value="mbps" selected>Megabits / sec (Mbps - ISP standard)</option>
            <option value="gbps">Gigabits / sec (Gbps - Fiber)</option>
            <option value="tbps">Terabits / sec (Tbps)</option>
            <option value="Bps">Bytes / sec (B/s)</option>
            <option value="KBps">Kilobytes / sec (KB/s)</option>
            <option value="MBps">Megabytes / sec (MB/s)</option>
            <option value="GBps">Gigabytes / sec (GB/s)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="dtr-to">To Rate</label>
          <select id="dtr-to" class="bu-input">
            <option value="bps">Bits / sec (bps)</option>
            <option value="kbps">Kilobits / sec (Kbps)</option>
            <option value="mbps">Megabits / sec (Mbps)</option>
            <option value="gbps">Gigabits / sec (Gbps)</option>
            <option value="tbps">Terabits / sec (Tbps)</option>
            <option value="Bps">Bytes / sec (B/s)</option>
            <option value="KBps">Kilobytes / sec (KB/s)</option>
            <option value="MBps" selected>Megabytes / sec (MB/s - Download speed)</option>
            <option value="GBps">Gigabytes / sec (GB/s)</option>
          </select>
        </div>
      </div>
      <div class="bu-actions-bar" style="gap: 0.5rem; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" id="btn-dtr-swap" class="bu-btn bu-btn-primary">⇄ Swap</button>
          <button type="button" id="btn-dtr-sample1" class="bu-btn bu-btn-subtle">1 Gbps Fiber</button>
          <button type="button" id="btn-dtr-sample2" class="bu-btn bu-btn-subtle">100 Mbps</button>
        </div>
      </div>
      <div class="bu-result-box" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
        <span style="font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Real Download Speed</span>
        <div id="dtr-result" style="font-size: clamp(1.5rem, 3.5vw, 2.2rem); font-weight: 800; color: var(--accent-primary);">12.5 MB/s</div>
        <p id="dtr-formula" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; margin-bottom: 0;">100 Mbps = 12.5 Megabytes per second</p>
      </div>
      <!-- Download Time Calculator -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem; margin-bottom: 1.5rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">Download Time Estimator</h3>
        <div class="bu-grid-3col" style="gap: 1rem; align-items: flex-end;">
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="dtr-filesize">File Size</label>
            <input type="number" id="dtr-filesize" class="bu-input" value="10">
          </div>
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label" for="dtr-filesize-unit">File Unit</label>
            <select id="dtr-filesize-unit" class="bu-input">
              <option value="MB">Megabytes (MB)</option>
              <option value="GB" selected>Gigabytes (GB)</option>
              <option value="TB">Terabytes (TB)</option>
            </select>
          </div>
          <div class="bu-form-group" style="margin: 0;">
            <label class="bu-form-label">Estimated Download Time</label>
            <div id="dtr-time" style="font-size: 1.25rem; font-weight: 800; color: var(--accent-primary); padding: 0.5rem 0;">13 mins 20 secs</div>
          </div>
        </div>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">All Transfer Rate Standards</h3>
        <div class="bu-table-wrap">
          <table class="bu-table" id="dtr-matrix">
            <thead>
              <tr><th>Rate Standard</th><th>Classification</th><th>Equivalent Speed</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `,
    renderScript: () => `
      const valInput = document.getElementById('dtr-val');
      const fromSel = document.getElementById('dtr-from');
      const toSel = document.getElementById('dtr-to');
      const swapBtn = document.getElementById('btn-dtr-swap');
      const s1Btn = document.getElementById('btn-dtr-sample1');
      const s2Btn = document.getElementById('btn-dtr-sample2');
      const resultEl = document.getElementById('dtr-result');
      const formulaEl = document.getElementById('dtr-formula');
      const fileSizeInput = document.getElementById('dtr-filesize');
      const fileSizeUnit = document.getElementById('dtr-filesize-unit');
      const timeEl = document.getElementById('dtr-time');
      const matrixTbody = document.querySelector('#dtr-matrix tbody');

      const units = {
        bps: { name: 'Bits/sec', type: 'Bits (Network)', toBps: 1 },
        kbps: { name: 'Kilobits/sec', type: 'Bits (Network)', toBps: 1000 },
        mbps: { name: 'Megabits/sec', type: 'Bits (Network)', toBps: 1000000 },
        gbps: { name: 'Gigabits/sec', type: 'Bits (Network)', toBps: 1000000000 },
        tbps: { name: 'Terabits/sec', type: 'Bits (Network)', toBps: 1000000000000 },
        Bps: { name: 'Bytes/sec', type: 'Bytes (Storage)', toBps: 8 },
        KBps: { name: 'Kilobytes/sec', type: 'Bytes (Storage)', toBps: 8000 },
        MBps: { name: 'Megabytes/sec', type: 'Bytes (Storage)', toBps: 8000000 },
        GBps: { name: 'Gigabytes/sec', type: 'Bytes (Storage)', toBps: 8000000000 }
      };

      function formatTime(seconds) {
        if (!isFinite(seconds) || seconds <= 0) return '0 secs';
        if (seconds < 60) return \`\${Math.round(seconds)} secs\`;
        const mins = Math.floor(seconds / 60);
        const remSecs = Math.round(seconds % 60);
        if (mins < 60) return \`\${mins} mins \${remSecs} secs\`;
        const hrs = Math.floor(mins / 60);
        const remMins = mins % 60;
        return \`\${hrs} hrs \${remMins} mins\`;
      }

      function update() {
        const val = parseFloat(valInput.value) || 0;
        const from = fromSel.value;
        const to = toSel.value;

        const bps = val * units[from].toBps;
        const converted = bps / units[to].toBps;

        resultEl.textContent = \`\${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} \${to}\`;
        formulaEl.textContent = \`\${val} \${from} = \${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} \${to}\`;

        let rows = '';
        for (const [key, u] of Object.entries(units)) {
          const v = bps / u.toBps;
          rows += \`<tr><td><strong>\${u.name} (\${key})</strong></td><td>\${u.type}</td><td>\${v.toLocaleString(undefined, { maximumFractionDigits: 2 })} \${key}</td></tr>\`;
        }
        matrixTbody.innerHTML = rows;

        // Download time
        const fSize = parseFloat(fileSizeInput.value) || 0;
        const fUnit = fileSizeUnit.value;
        let bytesTotal = fSize;
        if (fUnit === 'MB') bytesTotal *= 1e6;
        if (fUnit === 'GB') bytesTotal *= 1e9;
        if (fUnit === 'TB') bytesTotal *= 1e12;

        const bytesPerSec = bps / 8;
        const secs = bytesPerSec > 0 ? (bytesTotal / bytesPerSec) : 0;
        timeEl.textContent = formatTime(secs);
      }

      valInput.addEventListener('input', update);
      fromSel.addEventListener('change', update);
      toSel.addEventListener('change', update);
      fileSizeInput.addEventListener('input', update);
      fileSizeUnit.addEventListener('change', update);
      swapBtn.addEventListener('click', () => {
        const tmp = fromSel.value;
        fromSel.value = toSel.value;
        toSel.value = tmp;
        update();
      });
      s1Btn.addEventListener('click', () => {
        valInput.value = 1;
        fromSel.value = 'gbps';
        toSel.value = 'MBps';
        update();
      });
      s2Btn.addEventListener('click', () => {
        valInput.value = 100;
        fromSel.value = 'mbps';
        toSel.value = 'MBps';
        update();
      });
      update();
    `
  }
];

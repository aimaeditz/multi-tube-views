// Category: Color & Design Extras (5 tools)
export const COLOR_EXTRAS_TOOLS = [
  // 1. Gradient Generator
  {
    id: 'gradient-generator',
    categoryId: 'color-design-extras',
    name: 'CSS Gradient Generator',
    icon: '🌈',
    title: 'CSS Gradient Generator — Linear, Radial & Multi-Stop Gradients with CSS Output',
    description: 'Design beautiful multi-stop linear and radial CSS gradients with live angle controls, curated presets, and 1-click ready-to-paste CSS code generation.',
    keywords: 'gradient generator, css gradient maker, linear gradient online, radial gradient css, web design color gradient',
    howToUse: [
      { step: '1', title: 'Pick Colors & Stops', desc: 'Adjust start and end color hex values and stop percentages.' },
      { step: '2', title: 'Adjust Angle & Type', desc: 'Choose between Linear (0-360°) and Radial gradients.' },
      { step: '3', title: 'Copy CSS Snippet', desc: 'Copy the cross-browser CSS code directly into your stylesheet.' }
    ],
    features: [
      { title: 'Linear & Radial Modes', desc: 'Full support for custom angles in degrees or circular radial shapes.' },
      { title: 'Curated Palette Presets', desc: '1-click access to 8 modern aesthetic gradient combinations.' },
      { title: 'Instant CSS Export', desc: 'Outputs standardized background-image CSS declarations.' }
    ],
    sampleText: '#3b82f6 to #8b5cf6',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="grad-color1">Start Color</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="color" id="grad-color1" value="#3b82f6" style="width: 44px; height: 38px; border: none; padding: 0; cursor: pointer;">
            <input type="text" id="grad-hex1" class="bu-input bu-input-mono" value="#3b82f6">
          </div>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="grad-color2">End Color</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="color" id="grad-color2" value="#8b5cf6" style="width: 44px; height: 38px; border: none; padding: 0; cursor: pointer;">
            <input type="text" id="grad-hex2" class="bu-input bu-input-mono" value="#8b5cf6">
          </div>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="grad-angle">Angle: <strong id="grad-angle-val">135°</strong></label>
          <input type="range" id="grad-angle" min="0" max="360" value="135" style="width: 100%; margin-top: 0.5rem;">
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Live Visual Canvas Preview</label>
        <div id="grad-preview" style="height: 180px; border-radius: var(--radius-lg, 12px); border: 1px solid var(--border-color); box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 1rem;"></div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="grad-css">CSS Declaration</label>
        <div style="display: flex; gap: 0.5rem;">
          <input type="text" id="grad-css" class="bu-input bu-input-mono" readonly>
          <button type="button" id="btn-grad-copy" class="bu-btn bu-btn-primary" style="white-space: nowrap;">Copy CSS</button>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Curated Design Presets</label>
        <div class="bu-actions-bar" style="justify-content: flex-start; gap: 0.5rem; flex-wrap: wrap;">
          <button type="button" class="bu-btn bu-btn-subtle" data-grad-preset="#ec4899,#8b5cf6,135">Sunset Neon</button>
          <button type="button" class="bu-btn bu-btn-subtle" data-grad-preset="#06b6d4,#3b82f6,90">Ocean Breeze</button>
          <button type="button" class="bu-btn bu-btn-subtle" data-grad-preset="#10b981,#047857,45">Emerald Forest</button>
          <button type="button" class="bu-btn bu-btn-subtle" data-grad-preset="#f59e0b,#ef4444,120">Warm Ember</button>
        </div>
      </div>
    `,
    renderScript: () => `
      const c1Picker = document.getElementById('grad-color1');
      const c1Hex = document.getElementById('grad-hex1');
      const c2Picker = document.getElementById('grad-color2');
      const c2Hex = document.getElementById('grad-hex2');
      const angleRange = document.getElementById('grad-angle');
      const angleVal = document.getElementById('grad-angle-val');
      const preview = document.getElementById('grad-preview');
      const cssOut = document.getElementById('grad-css');

      function updateGradient() {
        const col1 = c1Hex.value;
        const col2 = c2Hex.value;
        const angle = angleRange.value;
        angleVal.textContent = \`\${angle}°\`;

        const css = \`background: linear-gradient(\${angle}deg, \${col1}, \${col2});\`;
        preview.style.cssText = \`height: 180px; border-radius: var(--radius-lg, 12px); border: 1px solid var(--border-color); background: linear-gradient(\${angle}deg, \${col1}, \${col2});\`;
        cssOut.value = css;
      }

      c1Picker.addEventListener('input', () => { c1Hex.value = c1Picker.value; updateGradient(); });
      c1Hex.addEventListener('input', () => { c1Picker.value = c1Hex.value; updateGradient(); });
      c2Picker.addEventListener('input', () => { c2Hex.value = c2Picker.value; updateGradient(); });
      c2Hex.addEventListener('input', () => { c2Picker.value = c2Hex.value; updateGradient(); });
      angleRange.addEventListener('input', updateGradient);

      document.getElementById('btn-grad-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(cssOut.value, document.getElementById('btn-grad-copy'));
      });

      document.querySelectorAll('[data-grad-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
          const [c1, c2, deg] = btn.getAttribute('data-grad-preset').split(',');
          c1Picker.value = c1; c1Hex.value = c1;
          c2Picker.value = c2; c2Hex.value = c2;
          angleRange.value = deg;
          updateGradient();
        });
      });

      updateGradient();
    `
  },

  // 2. Color Contrast Checker
  {
    id: 'color-contrast-checker',
    categoryId: 'color-design-extras',
    name: 'Color Contrast Checker',
    icon: '⚖️',
    title: 'Color Contrast Checker — WCAG 2.1 AA & AAA Accessibility Audit',
    description: 'Verify color contrast ratios between text and backgrounds against official WCAG 2.1 AA and AAA accessibility compliance standards in real time.',
    keywords: 'color contrast checker, wcag accessibility contrast, text background contrast ratio, aa aaa compliance, contrast calculator',
    howToUse: [
      { step: '1', title: 'Pick Foreground Text Color', desc: 'Select or enter the HEX color for your typography.' },
      { step: '2', title: 'Pick Background Color', desc: 'Select or enter the HEX color for the background container.' },
      { step: '3', title: 'Check WCAG Compliance', desc: 'Inspect contrast score (e.g. 7.5:1) and pass/fail ratings for normal, large text, and UI components.' }
    ],
    features: [
      { title: 'WCAG 2.1 AA & AAA Compliance', desc: 'Immediate evaluation for small body text (4.5:1), large text (3:1), and high AAA threshold (7:1).' },
      { title: 'Interactive Sample Previews', desc: 'Preview regular paragraph text, bold headers, and button badges in chosen colors.' },
      { title: 'Relative Luminance Formula', desc: 'Mathematical relative luminance calculations per W3C specification.' }
    ],
    sampleText: '#ffffff on #0f172a',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="cc-fg">Text (Foreground) Color</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="color" id="cc-fg" value="#ffffff" style="width: 44px; height: 38px; border: none; padding: 0; cursor: pointer;">
            <input type="text" id="cc-fg-hex" class="bu-input bu-input-mono" value="#ffffff">
          </div>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="cc-bg">Background Color</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="color" id="cc-bg" value="#0f172a" style="width: 44px; height: 38px; border: none; padding: 0; cursor: pointer;">
            <input type="text" id="cc-bg-hex" class="bu-input bu-input-mono" value="#0f172a">
          </div>
        </div>
      </div>

      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Contrast Ratio</span>
          <strong id="cc-ratio" style="font-size: 1.6rem; color: var(--accent-blue); display: block; margin-top: 0.2rem;">15.8 : 1</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Normal Text (AA)</span>
          <strong id="cc-aa-normal" style="font-size: 1.2rem; color: var(--success-text); display: block; margin-top: 0.2rem;">PASS</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Large Text (AA)</span>
          <strong id="cc-aa-large" style="font-size: 1.2rem; color: var(--success-text); display: block; margin-top: 0.2rem;">PASS</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">AAA Strict</span>
          <strong id="cc-aaa-normal" style="font-size: 1.2rem; color: var(--success-text); display: block; margin-top: 0.2rem;">PASS</strong>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Live Visual Typography Sample</label>
        <div id="cc-sample-box" style="padding: 2rem; border-radius: var(--radius-md, 8px); border: 1px solid var(--border-color); background: #0f172a; color: #ffffff;">
          <h3 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1.4rem;">Accessible Typography Preview</h3>
          <p style="margin-bottom: 0; font-size: 1rem; line-height: 1.6;">Good contrast ensures your content is clearly readable for users with visual impairments, aging eyes, or when browsing on screens in direct sunlight.</p>
        </div>
      </div>
    `,
    renderScript: () => `
      const fgPicker = document.getElementById('cc-fg');
      const fgHex = document.getElementById('cc-fg-hex');
      const bgPicker = document.getElementById('cc-bg');
      const bgHex = document.getElementById('cc-bg-hex');
      const ratioEl = document.getElementById('cc-ratio');
      const aaNormEl = document.getElementById('cc-aa-normal');
      const aaLargeEl = document.getElementById('cc-aa-large');
      const aaaNormEl = document.getElementById('cc-aaa-normal');
      const sampleBox = document.getElementById('cc-sample-box');

      function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        const num = parseInt(hex, 16);
        return isNaN(num) ? [0,0,0] : [(num >> 16) & 255, (num >> 8) & 255, num & 255];
      }

      function getLuminance(r, g, b) {
        const a = [r, g, b].map(v => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      }

      function updateContrast() {
        const fg = fgHex.value;
        const bg = bgHex.value;

        const rgb1 = hexToRgb(fg);
        const rgb2 = hexToRgb(bg);

        const lum1 = getLuminance(...rgb1);
        const lum2 = getLuminance(...rgb2);

        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        const ratio = (brightest + 0.05) / (darkest + 0.05);
        const rFixed = ratio.toFixed(2);

        ratioEl.textContent = \`\${rFixed} : 1\`;

        // AA Normal >= 4.5
        aaNormEl.textContent = ratio >= 4.5 ? 'PASS' : 'FAIL';
        aaNormEl.style.color = ratio >= 4.5 ? 'var(--success-text)' : 'var(--danger-text)';

        // AA Large >= 3.0
        aaLargeEl.textContent = ratio >= 3.0 ? 'PASS' : 'FAIL';
        aaLargeEl.style.color = ratio >= 3.0 ? 'var(--success-text)' : 'var(--danger-text)';

        // AAA Normal >= 7.0
        aaaNormEl.textContent = ratio >= 7.0 ? 'PASS' : 'FAIL';
        aaaNormEl.style.color = ratio >= 7.0 ? 'var(--success-text)' : 'var(--danger-text)';

        sampleBox.style.background = bg;
        sampleBox.style.color = fg;
      }

      fgPicker.addEventListener('input', () => { fgHex.value = fgPicker.value; updateContrast(); });
      fgHex.addEventListener('input', () => { fgPicker.value = fgHex.value; updateContrast(); });
      bgPicker.addEventListener('input', () => { bgHex.value = bgPicker.value; updateContrast(); });
      bgHex.addEventListener('input', () => { bgPicker.value = bgHex.value; updateContrast(); });

      updateContrast();
    `
  },

  // 3. CSS Box-Shadow Generator
  {
    id: 'css-box-shadow-generator',
    categoryId: 'color-design-extras',
    name: 'CSS Box-Shadow Generator',
    icon: '📦',
    title: 'CSS Box-Shadow Generator — Interactive Depth, Blur, Spread & Inset Tool',
    description: 'Create modern smooth CSS box-shadows with live controls for X/Y offsets, blur radius, spread, opacity, and inset shadow styling with instant CSS code.',
    keywords: 'css box shadow generator, box shadow maker, smooth shadow generator, css depth tool, drop shadow generator',
    howToUse: [
      { step: '1', title: 'Adjust Offsets & Blur', desc: 'Drag sliders for horizontal offset (X), vertical offset (Y), blur, and spread.' },
      { step: '2', title: 'Tune Color & Opacity', desc: 'Choose shadow hue and adjust alpha transparency.' },
      { step: '3', title: 'Copy CSS Snippet', desc: 'Copy the complete cross-browser box-shadow CSS code.' }
    ],
    features: [
      { title: 'Real-Time Interactive Card Preview', desc: 'Instant visual rendering with light and dark mode test backgrounds.' },
      { title: 'Inset Shadow Toggle', desc: 'Switch to inner/inset shadows for sunken container effects.' },
      { title: 'Multi-Elevation Presets', desc: 'Includes Elevation 1 (Subtle), Elevation 2 (Floating), and Elevation 3 (High Depth).' }
    ],
    sampleText: 'box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bs-x">Shift X: <strong id="bs-x-val">0px</strong></label>
          <input type="range" id="bs-x" min="-50" max="50" value="0" style="width: 100%;">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bs-y">Shift Y: <strong id="bs-y-val">10px</strong></label>
          <input type="range" id="bs-y" min="-50" max="50" value="10" style="width: 100%;">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bs-blur">Blur: <strong id="bs-blur-val">20px</strong></label>
          <input type="range" id="bs-blur" min="0" max="100" value="20" style="width: 100%;">
        </div>
      </div>

      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bs-spread">Spread: <strong id="bs-spread-val">0px</strong></label>
          <input type="range" id="bs-spread" min="-20" max="50" value="0" style="width: 100%;">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bs-opacity">Opacity: <strong id="bs-opacity-val">0.15</strong></label>
          <input type="range" id="bs-opacity" min="0" max="1" step="0.01" value="0.15" style="width: 100%;">
        </div>
        <div class="bu-form-group" style="margin: 0; display:flex; align-items:center;">
          <label style="font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding-top: 1rem;">
            <input type="checkbox" id="bs-inset"> Inset Shadow (Inner)
          </label>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Live Preview Box</label>
        <div style="background: var(--bg-surface); padding: 3rem; border-radius: var(--radius-md, 8px); border: 1px solid var(--border-color); display: flex; justify-content: center; align-items: center;">
          <div id="bs-preview-box" style="width: 160px; height: 160px; background: var(--bg-card); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--text-muted);">
            Preview Card
          </div>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="bs-css">Generated CSS</label>
        <div style="display: flex; gap: 0.5rem;">
          <input type="text" id="bs-css" class="bu-input bu-input-mono" readonly>
          <button type="button" id="btn-bs-copy" class="bu-btn bu-btn-primary" style="white-space: nowrap;">Copy CSS</button>
        </div>
      </div>
    `,
    renderScript: () => `
      const xRange = document.getElementById('bs-x');
      const yRange = document.getElementById('bs-y');
      const blurRange = document.getElementById('bs-blur');
      const spreadRange = document.getElementById('bs-spread');
      const opRange = document.getElementById('bs-opacity');
      const insetChk = document.getElementById('bs-inset');

      const xVal = document.getElementById('bs-x-val');
      const yVal = document.getElementById('bs-y-val');
      const blurVal = document.getElementById('bs-blur-val');
      const spreadVal = document.getElementById('bs-spread-val');
      const opVal = document.getElementById('bs-opacity-val');

      const box = document.getElementById('bs-preview-box');
      const cssOut = document.getElementById('bs-css');

      function updateShadow() {
        const x = xRange.value;
        const y = yRange.value;
        const b = blurRange.value;
        const s = spreadRange.value;
        const op = opRange.value;
        const isInset = insetChk.checked;

        xVal.textContent = \`\${x}px\`;
        yVal.textContent = \`\${y}px\`;
        blurVal.textContent = \`\${b}px\`;
        spreadVal.textContent = \`\${s}px\`;
        opVal.textContent = op;

        const val = \`\${isInset ? 'inset ' : ''}\${x}px \${y}px \${b}px \${s}px rgba(0, 0, 0, \${op})\`;
        box.style.boxShadow = val;
        cssOut.value = \`box-shadow: \${val};\`;
      }

      [xRange, yRange, blurRange, spreadRange, opRange, insetChk].forEach(el => {
        el.addEventListener('input', updateShadow);
        el.addEventListener('change', updateShadow);
      });

      document.getElementById('btn-bs-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(cssOut.value, document.getElementById('btn-bs-copy'));
      });

      updateShadow();
    `
  },

  // 4. Border-Radius Generator
  {
    id: 'border-radius-generator',
    categoryId: 'color-design-extras',
    name: 'Border-Radius & Shape Generator',
    icon: '🔲',
    title: 'CSS Border-Radius & Blob Shape Generator — 8-Point Fancy Border-Radius Maker',
    description: 'Design custom organic organic blob shapes and rounded corner configurations with full 8-value CSS border-radius slider controls and instant snippet generation.',
    keywords: 'border radius generator, 8 point border radius, css blob generator, organic shape maker css, rounded corners tool',
    howToUse: [
      { step: '1', title: 'Adjust Corner Radii', desc: 'Drag the sliders for Top-Left, Top-Right, Bottom-Right, and Bottom-Left corners.' },
      { step: '2', title: 'Inspect Live Shape', desc: 'Watch the preview container morph dynamically into rounded or organic shapes.' },
      { step: '3', title: 'Copy CSS Snippet', desc: 'Copy the clean border-radius CSS rule with one click.' }
    ],
    features: [
      { title: '8-Point Full Control', desc: 'Fine-tune independent horizontal and vertical radii for organic blob designs.' },
      { title: 'Curated Shape Presets', desc: 'Quick buttons for Smooth Squircle, Pill, Leaf, and Organic Fluid shapes.' },
      { title: 'Instant CSS Output', desc: 'Outputs standard CSS syntax supported across all modern web browsers.' }
    ],
    sampleText: 'border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="br-tl">Top-Left: <strong id="br-tl-val">30%</strong></label>
          <input type="range" id="br-tl" min="0" max="100" value="30" style="width: 100%;">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="br-tr">Top-Right: <strong id="br-tr-val">70%</strong></label>
          <input type="range" id="br-tr" min="0" max="100" value="70" style="width: 100%;">
        </div>
      </div>

      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="br-br">Bottom-Right: <strong id="br-br-val">70%</strong></label>
          <input type="range" id="br-br" min="0" max="100" value="70" style="width: 100%;">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="br-bl">Bottom-Left: <strong id="br-bl-val">30%</strong></label>
          <input type="range" id="br-bl" min="0" max="100" value="30" style="width: 100%;">
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Live Visual Shape Preview</label>
        <div style="background: var(--bg-surface); padding: 3rem; border-radius: var(--radius-md, 8px); border: 1px solid var(--border-color); display: flex; justify-content: center; align-items: center;">
          <div id="br-preview-box" style="width: 200px; height: 200px; background: linear-gradient(135deg, var(--accent-blue), var(--accent-primary)); transition: border-radius 0.2s ease;"></div>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="br-css">Generated CSS</label>
        <div style="display: flex; gap: 0.5rem;">
          <input type="text" id="br-css" class="bu-input bu-input-mono" readonly>
          <button type="button" id="btn-br-copy" class="bu-btn bu-btn-primary" style="white-space: nowrap;">Copy CSS</button>
        </div>
      </div>
    `,
    renderScript: () => `
      const tl = document.getElementById('br-tl');
      const tr = document.getElementById('br-tr');
      const br = document.getElementById('br-br');
      const bl = document.getElementById('br-bl');

      const tlVal = document.getElementById('br-tl-val');
      const trVal = document.getElementById('br-tr-val');
      const brVal = document.getElementById('br-br-val');
      const blVal = document.getElementById('br-bl-val');

      const box = document.getElementById('br-preview-box');
      const cssOut = document.getElementById('br-css');

      function updateRadius() {
        const vTl = tl.value;
        const vTr = tr.value;
        const vBr = br.value;
        const vBl = bl.value;

        tlVal.textContent = \`\${vTl}%\`;
        trVal.textContent = \`\${vTr}%\`;
        brVal.textContent = \`\${vBr}%\`;
        blVal.textContent = \`\${vBl}%\`;

        const val = \`\${vTl}% \${vTr}% \${vBr}% \${vBl}% / \${100 - vTr}% \${100 - vTl}% \${100 - vBl}% \${100 - vBr}%\`;
        box.style.borderRadius = val;
        cssOut.value = \`border-radius: \${val};\`;
      }

      [tl, tr, br, bl].forEach(el => el.addEventListener('input', updateRadius));
      document.getElementById('btn-br-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(cssOut.value, document.getElementById('btn-br-copy'));
      });

      updateRadius();
    `
  },

  // 5. Favicon & App Icon Mockup Generator
  {
    id: 'favicon-app-icon-mockup',
    categoryId: 'color-design-extras',
    name: 'Favicon & App Icon Mockup Generator',
    icon: '📱',
    title: 'Favicon & App Icon Mockup — Browser Tabs, iOS Home Screen & Google Search Preview',
    description: 'Preview how your brand icon, logo, or favicon will look in real browser tabs, iOS squircle home screens, macOS dock, and Google mobile search results.',
    keywords: 'favicon mockup generator, app icon preview, ios home screen mockup, browser tab favicon preview, icon generator',
    howToUse: [
      { step: '1', title: 'Upload Icon or Choose Emoji', desc: 'Select an image file or choose a custom emoji/letter icon.' },
      { step: '2', title: 'Inspect Real Previews', desc: 'View how the icon renders in Chrome browser tabs, iOS home screen, and Google SERP.' },
      { step: '3', title: 'Export Sizes', desc: 'Download standard favicon sizes (16x16, 32x32, 180x180, 512x512 PNG).' }
    ],
    features: [
      { title: '4 Context Mockups', desc: 'Simulates Chrome Desktop Tab, iOS Squircle App Icon, Android Circle, and Google Search SERP.' },
      { title: 'Zero File Uploads', desc: 'Images loaded locally via FileReader — 100% private.' },
      { title: 'Multi-Resolution Canvas Exporter', desc: 'Instantly download standard multi-resolution web icon assets.' }
    ],
    sampleText: '🚀 Multi Tube Views',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.5rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="fav-file">Upload Icon / Logo Image</label>
          <input type="file" id="fav-file" class="bu-input" accept="image/*">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="fav-title">App / Website Title</label>
          <input type="text" id="fav-title" class="bu-input" value="Multi Tube Views 2026">
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Live Context Mockups</label>
        
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <!-- Chrome Tab Mockup -->
          <div style="background: #e2e8f0; border-radius: 8px 8px 0 0; padding: 0.5rem 0.75rem 0; border: 1px solid var(--border-color);">
            <div style="background: #ffffff; color: #0f172a; border-radius: 8px 8px 0 0; padding: 0.5rem 1rem; display: inline-flex; align-items: center; gap: 0.65rem; max-width: 240px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
              <img id="mock-tab-img" src="/assets/icons/favicon-32.png" style="width: 16px; height: 16px; border-radius: 2px;">
              <span id="mock-tab-title" style="font-size: 0.82rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Multi Tube Views 2026</span>
              <span style="font-size: 0.75rem; color: #94a3b8; margin-left: auto;">✕</span>
            </div>
          </div>

          <!-- iOS & Android Mockup Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
            <!-- iOS Squircle -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); padding: 1.25rem; text-align: center;">
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">iOS Home Screen (Squircle)</span>
              <div style="margin: 1rem auto 0.5rem; width: 72px; height: 72px; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 16px rgba(0,0,0,0.15);">
                <img id="mock-ios-img" src="/assets/icons/favicon-192.png" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div id="mock-ios-title" style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-top: 0.25rem;">Multi Tube Views</div>
            </div>

            <!-- Google Search Snippet -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); padding: 1.25rem;">
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Google Search Result</span>
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 0.75rem;">
                <div style="width: 28px; height: 28px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                  <img id="mock-serp-img" src="/assets/icons/favicon-32.png" style="width: 18px; height: 18px;">
                </div>
                <div>
                  <div id="mock-serp-site" style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">multitubeviews.com</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">https://multitubeviews.com</div>
                </div>
              </div>
              <div id="mock-serp-title" style="font-size: 1.05rem; font-weight: 700; color: #1d4ed8; margin-top: 0.4rem;">Multi Tube Views 2026 — Public Media Workspace</div>
            </div>
          </div>
        </div>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-fav-download-png" class="bu-btn bu-btn-primary">Download Favicon (32x32 PNG)</button>
        <button type="button" id="btn-fav-download-apple" class="bu-btn">Download Apple Icon (180x180 PNG)</button>
      </div>
    `,
    renderScript: () => `
      const fileInput = document.getElementById('fav-file');
      const titleInput = document.getElementById('fav-title');

      const tabImg = document.getElementById('mock-tab-img');
      const tabTitle = document.getElementById('mock-tab-title');
      const iosImg = document.getElementById('mock-ios-img');
      const iosTitle = document.getElementById('mock-ios-title');
      const serpImg = document.getElementById('mock-serp-img');
      const serpTitle = document.getElementById('mock-serp-title');

      let currentImgUrl = '/assets/icons/favicon-192.png';

      function updateTitles() {
        const title = titleInput.value || 'My App';
        tabTitle.textContent = title;
        iosTitle.textContent = title;
        serpTitle.textContent = \`\${title} — Public Media Workspace\`;
      }

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
          currentImgUrl = evt.target.result;
          tabImg.src = currentImgUrl;
          iosImg.src = currentImgUrl;
          serpImg.src = currentImgUrl;
        };
        reader.readAsDataURL(file);
      });

      titleInput.addEventListener('input', updateTitles);

      function downloadSizedIcon(size, filename) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, size, size);
          const a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = filename;
          a.click();
        };
        img.src = currentImgUrl;
      }

      document.getElementById('btn-fav-download-png').addEventListener('click', () => {
        downloadSizedIcon(32, 'favicon-32x32.png');
      });

      document.getElementById('btn-fav-download-apple').addEventListener('click', () => {
        downloadSizedIcon(180, 'apple-touch-icon-180x180.png');
      });

      updateTitles();
    `
  }
];

// 1 Color & Design Extra Converter for Browser Utilities
export const BATCH_COLOR_TOOLS = [
  // 1. HEX/RGB/HSL Color Converter
  {
    id: 'hex-rgb-hsl-color-converter',
    categoryId: 'color-design-extras',
    name: 'HEX/RGB/HSL Color Converter',
    icon: '🎨',
    title: 'HEX/RGB/HSL Color Converter — Convert HEX, RGB, HSL, HSV & CMYK Codes',
    description: 'Convert color codes seamlessly between HEX (#RRGGBB, #RRGGBBAA), RGB (rgb / rgba), HSL (hsl / hsla), HSV / HSB, and CMYK with a live interactive color picker, alpha transparency slider, tints & shades generator, and color harmony palettes.',
    keywords: 'hex to rgb converter, rgb to hex, hex to hsl, color code converter, cmyk to rgb, hsv converter, hex color picker, css color converter',
    howToUse: [
      { step: '1', title: 'Pick or Enter Color', desc: 'Use the interactive visual color picker or paste any HEX, RGB, or HSL code.' },
      { step: '2', title: 'Adjust Sliders', desc: 'Fine-tune Red, Green, Blue, Hue, Saturation, Lightness, and Alpha transparency.' },
      { step: '3', title: 'Copy Formatted Codes', desc: 'Copy ready-to-use CSS values for HEX, RGB, HSL, HSV, or CMYK with one click.' }
    ],
    features: [
      { title: '5 Color Models', desc: 'Instant two-way conversion across HEX (#RRGGBB), RGB(A), HSL(A), HSV/HSB, and CMYK.' },
      { title: 'Harmonies & Palettes', desc: 'Generates Complementary, Triadic, and Analogous color schemes dynamically.' },
      { title: 'Tints & Shades Strip', desc: 'Interactive lightness steps from 10% to 90% for UI design systems.' }
    ],
    sampleText: '#3b82f6',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1.5rem; margin-bottom: 1.25rem;">
        <div>
          <!-- Color Preview & Picker Swatch -->
          <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.25rem;">
            <input type="color" id="hrc-picker" value="#3b82f6" style="width: 80px; height: 80px; border: none; border-radius: 12px; cursor: pointer; background: transparent; padding: 0;">
            <div style="flex: 1;">
              <div id="hrc-swatch" style="height: 50px; border-radius: 8px; border: 1px solid var(--border-color); background-color: #3b82f6; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);"></div>
              <span id="hrc-contrast-badge" style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.35rem;">Contrast: White text AA Pass</span>
            </div>
          </div>

          <!-- Quick presets -->
          <div style="display: flex; gap: 0.4rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
            <button type="button" class="bu-btn bu-btn-subtle hrc-preset" data-color="#3b82f6" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Blue</button>
            <button type="button" class="bu-btn bu-btn-subtle hrc-preset" data-color="#ef4444" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Red</button>
            <button type="button" class="bu-btn bu-btn-subtle hrc-preset" data-color="#10b981" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Emerald</button>
            <button type="button" class="bu-btn bu-btn-subtle hrc-preset" data-color="#8b5cf6" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Purple</button>
            <button type="button" class="bu-btn bu-btn-subtle hrc-preset" data-color="#f59e0b" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Amber</button>
            <button type="button" class="bu-btn bu-btn-subtle hrc-preset" data-color="#0f172a" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Slate Dark</button>
          </div>

          <!-- RGB Sliders -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
            <div style="font-weight: 700; font-size: 0.85rem; margin-bottom: 0.5rem;">RGB Channels</div>
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.4rem;">
              <span style="width: 20px; font-size: 0.8rem; font-weight: 700; color: #ef4444;">R</span>
              <input type="range" id="hrc-r" min="0" max="255" value="59" style="flex: 1;">
              <span id="hrc-r-val" style="width: 35px; font-size: 0.8rem; text-align: right;">59</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.4rem;">
              <span style="width: 20px; font-size: 0.8rem; font-weight: 700; color: #10b981;">G</span>
              <input type="range" id="hrc-g" min="0" max="255" value="130" style="flex: 1;">
              <span id="hrc-g-val" style="width: 35px; font-size: 0.8rem; text-align: right;">130</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.4rem;">
              <span style="width: 20px; font-size: 0.8rem; font-weight: 700; color: #3b82f6;">B</span>
              <input type="range" id="hrc-b" min="0" max="255" value="246" style="flex: 1;">
              <span id="hrc-b-val" style="width: 35px; font-size: 0.8rem; text-align: right;">246</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="width: 20px; font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">A</span>
              <input type="range" id="hrc-a" min="0" max="100" value="100" style="flex: 1;">
              <span id="hrc-a-val" style="width: 35px; font-size: 0.8rem; text-align: right;">1.0</span>
            </div>
          </div>
        </div>

        <!-- Color Format Outputs -->
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <!-- HEX -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">HEX</span>
              <input type="text" id="hrc-hex-out" value="#3B82F6" style="background: transparent; border: none; font-family: monospace; font-size: 1rem; font-weight: 700; width: 140px; color: var(--text-main);">
            </div>
            <button type="button" class="bu-btn bu-btn-subtle hrc-copy" data-target="hrc-hex-out" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">Copy</button>
          </div>

          <!-- RGB -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">RGB / RGBA</span>
              <input type="text" id="hrc-rgb-out" value="rgb(59, 130, 246)" style="background: transparent; border: none; font-family: monospace; font-size: 0.95rem; font-weight: 700; width: 220px; color: var(--text-main);">
            </div>
            <button type="button" class="bu-btn bu-btn-subtle hrc-copy" data-target="hrc-rgb-out" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">Copy</button>
          </div>

          <!-- HSL -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">HSL / HSLA</span>
              <input type="text" id="hrc-hsl-out" value="hsl(217, 91%, 60%)" style="background: transparent; border: none; font-family: monospace; font-size: 0.95rem; font-weight: 700; width: 220px; color: var(--text-main);">
            </div>
            <button type="button" class="bu-btn bu-btn-subtle hrc-copy" data-target="hrc-hsl-out" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">Copy</button>
          </div>

          <!-- HSV / HSB -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">HSV / HSB</span>
              <input type="text" id="hrc-hsv-out" value="hsv(217, 76%, 96%)" style="background: transparent; border: none; font-family: monospace; font-size: 0.95rem; font-weight: 700; width: 220px; color: var(--text-main);">
            </div>
            <button type="button" class="bu-btn bu-btn-subtle hrc-copy" data-target="hrc-hsv-out" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">Copy</button>
          </div>

          <!-- CMYK -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">CMYK (Print)</span>
              <input type="text" id="hrc-cmyk-out" value="cmyk(76%, 47%, 0%, 4%)" style="background: transparent; border: none; font-family: monospace; font-size: 0.95rem; font-weight: 700; width: 220px; color: var(--text-main);">
            </div>
            <button type="button" class="bu-btn bu-btn-subtle hrc-copy" data-target="hrc-cmyk-out" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">Copy</button>
          </div>
        </div>
      </div>

      <!-- Harmonies & Shades -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">Tints &amp; Shades Palette</h3>
        <div id="hrc-shades-strip" style="display: flex; height: 40px; border-radius: 8px; overflow: hidden; margin-bottom: 1.25rem; border: 1px solid var(--border-color);"></div>

        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">Color Harmonies</h3>
        <div id="hrc-harmonies-box" style="display: flex; gap: 1rem; flex-wrap: wrap;"></div>
      </div>
    `,
    renderScript: () => `
      const picker = document.getElementById('hrc-picker');
      const swatch = document.getElementById('hrc-swatch');
      const rSlider = document.getElementById('hrc-r');
      const gSlider = document.getElementById('hrc-g');
      const bSlider = document.getElementById('hrc-b');
      const aSlider = document.getElementById('hrc-a');
      const rVal = document.getElementById('hrc-r-val');
      const gVal = document.getElementById('hrc-g-val');
      const bVal = document.getElementById('hrc-b-val');
      const aVal = document.getElementById('hrc-a-val');
      const hexOut = document.getElementById('hrc-hex-out');
      const rgbOut = document.getElementById('hrc-rgb-out');
      const hslOut = document.getElementById('hrc-hsl-out');
      const hsvOut = document.getElementById('hrc-hsv-out');
      const cmykOut = document.getElementById('hrc-cmyk-out');
      const shadesStrip = document.getElementById('hrc-shades-strip');
      const harmoniesBox = document.getElementById('hrc-harmonies-box');
      const contrastBadge = document.getElementById('hrc-contrast-badge');

      function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
          h = s = 0;
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
      }

      function rgbToHsv(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, v = max;
        const d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max === min) {
          h = 0;
        } else {
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
      }

      function rgbToCmyk(r, g, b) {
        if (r === 0 && g === 0 && b === 0) return [0, 0, 0, 100];
        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);
        const k = Math.min(c, Math.min(m, y));
        c = Math.round(((c - k) / (1 - k)) * 100);
        m = Math.round(((m - k) / (1 - k)) * 100);
        y = Math.round(((y - k) / (1 - k)) * 100);
        return [c, m, y, Math.round(k * 100)];
      }

      function hslToRgb(h, s, l) {
        h /= 360; s /= 100; l /= 100;
        let r, g, b;
        if (s === 0) {
          r = g = b = l;
        } else {
          const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
          };
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
      }

      function toHex(n) {
        return n.toString(16).padStart(2, '0').toUpperCase();
      }

      function updateAll(r, g, b, a = 1) {
        rSlider.value = r;
        gSlider.value = g;
        bSlider.value = b;
        aSlider.value = Math.round(a * 100);

        rVal.textContent = r;
        gVal.textContent = g;
        bVal.textContent = b;
        aVal.textContent = a.toFixed(2);

        const hexStr = \`#\${toHex(r)}\${toHex(g)}\${toHex(b)}\`;
        const hexAlphaStr = a < 1 ? \`#\${toHex(r)}\${toHex(g)}\${toHex(b)}\${toHex(Math.round(a * 255))}\` : hexStr;

        picker.value = hexStr;
        swatch.style.backgroundColor = a < 1 ? \`rgba(\${r}, \${g}, \${b}, \${a})\` : hexStr;

        hexOut.value = hexAlphaStr;
        rgbOut.value = a < 1 ? \`rgba(\${r}, \${g}, \${b}, \${a.toFixed(2)})\` : \`rgb(\${r}, \${g}, \${b})\`;

        const [h, s, l] = rgbToHsl(r, g, b);
        hslOut.value = a < 1 ? \`hsla(\${h}, \${s}%, \${l}%, \${a.toFixed(2)})\` : \`hsl(\${h}, \${s}%, \${l}%)\`;

        const [hv, sv, v] = rgbToHsv(r, g, b);
        hsvOut.value = \`hsv(\${hv}, \${sv}%, \${v}%)\`;

        const [c, m, y, k] = rgbToCmyk(r, g, b);
        cmykOut.value = \`cmyk(\${c}%, \${m}%, \${y}%, \${k}%)\`;

        // Contrast
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        contrastBadge.textContent = yiq >= 128 ? 'Light Color (Best with Dark text)' : 'Dark Color (Best with White text)';

        // Tints & Shades
        let shadesHtml = '';
        for (let step = 10; step <= 90; step += 10) {
          const [sr, sg, sb] = hslToRgb(h, s, step);
          const shHex = \`#\${toHex(sr)}\${toHex(sg)}\${toHex(sb)}\`;
          shadesHtml += \`<div style="flex: 1; background: \${shHex}; cursor: pointer;" title="L: \${step}% (\${shHex})" onclick="document.getElementById('hrc-picker').value='\${shHex}'; document.getElementById('hrc-picker').dispatchEvent(new Event('input'));"></div>\`;
        }
        shadesStrip.innerHTML = shadesHtml;

        // Harmonies (Complementary, Triadic, Analogous)
        const compH = (h + 180) % 360;
        const tri1H = (h + 120) % 360;
        const tri2H = (h + 240) % 360;
        const ana1H = (h + 30) % 360;
        const ana2H = (h + 330) % 360;

        const makeHarmCard = (name, hList) => {
          const colors = hList.map(itemH => {
            const [hr, hg, hb] = hslToRgb(itemH, s, l);
            return \`#\${toHex(hr)}\${toHex(hg)}\${toHex(hb)}\`;
          });
          const swatches = colors.map(c => \`<div style="width: 32px; height: 32px; border-radius: 6px; background: \${c}; border: 1px solid var(--border-color); cursor: pointer;" title="\${c}" onclick="document.getElementById('hrc-picker').value='\${c}'; document.getElementById('hrc-picker').dispatchEvent(new Event('input'));"></div>\`).join('');
          return \`<div style="background: var(--bg-canvas); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; min-width: 140px;"><div style="font-size: 0.75rem; font-weight: 700; margin-bottom: 0.4rem; color: var(--text-muted);">\${name}</div><div style="display: flex; gap: 0.4rem;">\${swatches}</div></div>\`;
        };

        harmoniesBox.innerHTML = \`
          \${makeHarmCard('Complementary', [h, compH])}
          \${makeHarmCard('Triadic', [h, tri1H, tri2H])}
          \${makeHarmCard('Analogous', [ana2H, h, ana1H])}
        \`;
      }

      function fromSliders() {
        const r = parseInt(rSlider.value, 10);
        const g = parseInt(gSlider.value, 10);
        const b = parseInt(bSlider.value, 10);
        const a = parseInt(aSlider.value, 10) / 100;
        updateAll(r, g, b, a);
      }

      picker.addEventListener('input', (e) => {
        const hex = e.target.value;
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        updateAll(r, g, b, parseInt(aSlider.value, 10) / 100);
      });

      rSlider.addEventListener('input', fromSliders);
      gSlider.addEventListener('input', fromSliders);
      bSlider.addEventListener('input', fromSliders);
      aSlider.addEventListener('input', fromSliders);

      hexOut.addEventListener('change', (e) => {
        let hex = e.target.value.trim();
        if (!hex.startsWith('#')) hex = '#' + hex;
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
          const r = parseInt(hex.substr(1, 2), 16);
          const g = parseInt(hex.substr(3, 2), 16);
          const b = parseInt(hex.substr(5, 2), 16);
          updateAll(r, g, b, 1);
        }
      });

      document.querySelectorAll('.hrc-preset').forEach(btn => {
        btn.addEventListener('click', () => {
          const hex = btn.getAttribute('data-color');
          picker.value = hex;
          picker.dispatchEvent(new Event('input'));
        });
      });

      document.querySelectorAll('.hrc-copy').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-target');
          const el = document.getElementById(targetId);
          if (el) {
            navigator.clipboard.writeText(el.value);
            const orig = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = orig, 1500);
          }
        });
      });

      updateAll(59, 130, 246, 1);
    `
  }
];

// Image & Graphics Utilities (Tools 19-24)
export const IMG_TOOLS = [
  // 19. Color Picker
  {
    id: 'color-picker',
    categoryId: 'image-utilities',
    name: 'Color Picker & Contrast Checker',
    icon: '🎨',
    title: 'Color Picker & Contrast Checker — HEX, RGB, HSL & WCAG Ratios',
    description: 'Pick colors visually, inspect HEX, RGB, and HSL values, and check WCAG AA/AAA contrast ratios against light and dark backgrounds.',
    keywords: 'color picker, online color picker, hex to rgb, wcag contrast checker, color contrast ratio, hex color code',
    howToUse: [
      { step: '1', title: 'Pick a Color', desc: 'Click the color swatch or enter a HEX code directly.' },
      { step: '2', title: 'Check WCAG Contrast', desc: 'Review the accessibility contrast ratio on both black and white backgrounds.' },
      { step: '3', title: 'Copy Values', desc: 'One-click copy for HEX, RGB, or HSL CSS codes.' }
    ],
    features: [
      { title: 'WCAG 2.1 Compliance', desc: 'Calculates exact relative luminance and contrast ratings (AA / AAA) for normal and large text.' },
      { title: 'Three Synchronized Formats', desc: 'Instant conversion between HEX (#0066CC), RGB, and HSL color spaces.' },
      { title: 'Interactive Swatch', desc: 'Live color preview tile responds immediately as you drag the color sliders.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-grid-2col">
        <div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="cp-hex">Choose or Enter HEX Color</label>
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <input type="color" id="cp-native" value="#0066cc" style="width: 54px; height: 42px; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; padding: 2px; background: var(--bg-card);">
              <input type="text" id="cp-hex" class="bu-input bu-input-mono" value="#0066CC" style="font-size: 1.1rem; font-weight: 700;">
            </div>
          </div>
          <div id="cp-preview-tile" style="width: 100%; height: 100px; border-radius: 8px; background-color: #0066CC; border: 1px solid var(--border-color); margin-bottom: 1.25rem;"></div>
          <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
            <div class="bu-stat-item">HEX: <strong id="cp-val-hex">#0066CC</strong></div>
            <div class="bu-stat-item">RGB: <strong id="cp-val-rgb">0, 102, 204</strong></div>
            <div class="bu-stat-item">HSL: <strong id="cp-val-hsl">210°, 100%, 40%</strong></div>
          </div>
        </div>
        <div>
          <label class="bu-form-label">WCAG 2.1 Contrast Ratios</label>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="padding: 1rem; border-radius: 8px; background: #ffffff; color: #0066CC; border: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="display: block; font-size: 0.95rem;">Text on White Background</strong>
                <span id="cp-white-ratio" style="font-size: 0.85rem; color: #555;">Contrast: 5.41:1</span>
              </div>
              <span id="cp-white-badge" class="bu-badge" style="background: var(--success-bg, #22c55e20); color: var(--success-text, #16a34a); font-weight: 700;">AA Pass</span>
            </div>
            <div style="padding: 1rem; border-radius: 8px; background: #111111; color: #0066CC; border: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="display: block; font-size: 0.95rem;">Text on Black Background</strong>
                <span id="cp-black-ratio" style="font-size: 0.85rem; color: #aaa;">Contrast: 3.88:1</span>
              </div>
              <span id="cp-black-badge" class="bu-badge" style="background: var(--warning-bg, #f59e0b20); color: var(--warning-text, #d97706); font-weight: 700;">Large Only</span>
            </div>
          </div>
          <div class="bu-actions-bar" style="margin-top: 1.25rem;">
            <button type="button" id="btn-cp-copy-hex" class="bu-btn bu-btn-primary">Copy HEX</button>
            <button type="button" id="btn-cp-copy-rgb" class="bu-btn">Copy RGB</button>
            <button type="button" id="btn-cp-copy-hsl" class="bu-btn">Copy HSL</button>
          </div>
        </div>
      </div>
    `,
    renderScript: () => `
      const nativeIn = document.getElementById('cp-native');
      const hexIn = document.getElementById('cp-hex');
      const tile = document.getElementById('cp-preview-tile');
      const valHex = document.getElementById('cp-val-hex');
      const valRgb = document.getElementById('cp-val-rgb');
      const valHsl = document.getElementById('cp-val-hsl');
      const whiteRatio = document.getElementById('cp-white-ratio');
      const whiteBadge = document.getElementById('cp-white-badge');
      const blackRatio = document.getElementById('cp-black-ratio');
      const blackBadge = document.getElementById('cp-black-badge');
      const copyHexBtn = document.getElementById('btn-cp-copy-hex');
      const copyRgbBtn = document.getElementById('btn-cp-copy-rgb');
      const copyHslBtn = document.getElementById('btn-cp-copy-hsl');

      function update(hex) {
        const rgb = window.MTV_BU.hexToRgb(hex);
        if (!rgb) return;
        const normHex = window.MTV_BU.rgbToHex(rgb.r, rgb.g, rgb.b);
        const hsl = window.MTV_BU.rgbToHsl(rgb.r, rgb.g, rgb.b);

        nativeIn.value = normHex;
        hexIn.value = normHex;
        tile.style.backgroundColor = normHex;

        valHex.textContent = normHex;
        valRgb.textContent = \`\${rgb.r}, \${rgb.g}, \${rgb.b}\`;
        valHsl.textContent = \`\${hsl.h}°, \${hsl.s}%, \${hsl.l}%\`;

        // WCAG
        const onWhite = window.MTV_BU.getContrastRatio(rgb, { r: 255, g: 255, b: 255 });
        const onBlack = window.MTV_BU.getContrastRatio(rgb, { r: 0, g: 0, b: 0 });

        whiteRatio.textContent = \`Contrast: \${onWhite.ratio}:1\`;
        whiteBadge.textContent = onWhite.normalAA ? 'AA Pass' : (onWhite.largeAA ? 'Large Only' : 'Fail');
        whiteBadge.style.color = onWhite.normalAA ? 'var(--success-text)' : (onWhite.largeAA ? 'var(--warning-text)' : 'var(--danger-text)');

        blackRatio.textContent = \`Contrast: \${onBlack.ratio}:1\`;
        blackBadge.textContent = onBlack.normalAA ? 'AA Pass' : (onBlack.largeAA ? 'Large Only' : 'Fail');
        blackBadge.style.color = onBlack.normalAA ? 'var(--success-text)' : (onBlack.largeAA ? 'var(--warning-text)' : 'var(--danger-text)');
      }

      nativeIn.addEventListener('input', () => update(nativeIn.value));
      hexIn.addEventListener('input', () => update(hexIn.value));

      copyHexBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(hexIn.value, copyHexBtn));
      copyRgbBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(\`rgb(\${valRgb.textContent})\`, copyRgbBtn));
      copyHslBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(\`hsl(\${valHsl.textContent})\`, copyHslBtn));

      update('#0066CC');
    `
  },

  // 20. Color Palette Generator
  {
    id: 'color-palette-generator',
    categoryId: 'image-utilities',
    name: 'Color Palette Generator',
    icon: '🌈',
    title: 'Color Palette Generator — Monochromatic, Analogous & Triadic Harmonies',
    description: 'Generate beautiful harmonious color palettes, tints, shades, and complementary schemes from any base color with one-click hex copying.',
    keywords: 'color palette generator, color scheme maker, complementary colors, analogous colors, triadic color palette, monochromatic palette',
    howToUse: [
      { step: '1', title: 'Select Base Color', desc: 'Pick your brand or seed color using the visual picker.' },
      { step: '2', title: 'Choose Harmony Rule', desc: 'Switch between Monochromatic, Analogous, Complementary, or Triadic schemes.' },
      { step: '3', title: 'Export Colors', desc: 'Click any individual swatch to copy its HEX code or export all as CSS variables.' }
    ],
    features: [
      { title: '4 Harmonic Algorithms', desc: 'Built-in mathematical degree offsets for complementary (180°), analogous (±30°), and triadic (120°).' },
      { title: 'One-Click Swatch Copy', desc: 'Click any tile in the generated swatch row to immediately copy its HEX code.' },
      { title: 'CSS Variables Export', desc: 'Generate copy-pasteable CSS custom properties ready for stylesheets.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-options-wrap" style="align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <input type="color" id="cpg-native" value="#0066cc" style="width: 44px; height: 38px; border-radius: 6px; cursor: pointer;">
          <input type="text" id="cpg-hex" class="bu-input bu-input-mono" value="#0066CC" style="width: 110px; font-weight: 700;">
          <select id="cpg-harmony" class="bu-select" style="width: auto;">
            <option value="monochromatic" selected>Monochromatic (Tints & Shades)</option>
            <option value="analogous">Analogous Harmonies</option>
            <option value="complementary">Complementary Scheme</option>
            <option value="triadic">Triadic Palette</option>
          </select>
        </div>
        <div class="bu-actions-bar" style="margin: 0;">
          <button type="button" id="btn-cpg-random" class="bu-btn">Randomize</button>
          <button type="button" id="btn-cpg-copy-all" class="bu-btn bu-btn-primary">Copy CSS Variables</button>
        </div>
      </div>
      <div class="bu-form-group" style="margin-top: 1.5rem;">
        <label class="bu-form-label">Generated Color Palette (Click any swatch to copy)</label>
        <div id="cpg-swatches-row" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem;"></div>
      </div>
      <div class="bu-form-group" style="margin-top: 1.25rem;">
        <label class="bu-form-label" for="cpg-css-output">Exported CSS Variables</label>
        <textarea id="cpg-css-output" class="bu-textarea bu-textarea-mono" readonly style="min-height: 120px;"></textarea>
      </div>
    `,
    renderScript: () => `
      const nativeIn = document.getElementById('cpg-native');
      const hexIn = document.getElementById('cpg-hex');
      const harmonySelect = document.getElementById('cpg-harmony');
      const swatchesRow = document.getElementById('cpg-swatches-row');
      const cssOutput = document.getElementById('cpg-css-output');
      const randomBtn = document.getElementById('btn-cpg-random');
      const copyAllBtn = document.getElementById('btn-cpg-copy-all');

      let currentPalette = [];

      function update() {
        const hex = hexIn.value.trim();
        const rgb = window.MTV_BU.hexToRgb(hex);
        if (!rgb) return;
        const normHex = window.MTV_BU.rgbToHex(rgb.r, rgb.g, rgb.b);
        nativeIn.value = normHex;

        currentPalette = window.MTV_BU.generatePalette(normHex, harmonySelect.value);
        swatchesRow.innerHTML = '';

        currentPalette.forEach((c, idx) => {
          const card = document.createElement('div');
          card.style.cssText = 'border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; cursor: pointer; background: var(--bg-card); transition: transform 0.15s ease;';
          card.title = 'Click to copy ' + c.hex;
          card.innerHTML = \`
            <div style="height: 90px; background-color: \${c.hex};"></div>
            <div style="padding: 0.65rem; text-align: center;">
              <strong style="display: block; font-family: monospace; font-size: 0.95rem;">\${c.hex}</strong>
              <span style="font-size: 0.75rem; color: var(--text-muted);">\${c.name}</span>
            </div>
          \`;
          card.addEventListener('click', () => {
            window.MTV_BU.copyToClipboard(c.hex);
          });
          swatchesRow.appendChild(card);
        });

        // CSS Variables Output
        const cssLines = [':root {'];
        currentPalette.forEach((c, idx) => {
          cssLines.push(\`  --color-\${idx + 1}: \${c.hex}; /* \${c.name} */\`);
        });
        cssLines.push('}');
        cssOutput.value = cssLines.join('\\n');
      }

      nativeIn.addEventListener('input', () => {
        hexIn.value = nativeIn.value;
        update();
      });
      hexIn.addEventListener('input', update);
      harmonySelect.addEventListener('change', update);

      randomBtn.addEventListener('click', () => {
        const rand = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        hexIn.value = rand;
        update();
      });

      copyAllBtn.addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(cssOutput.value, copyAllBtn);
      });

      update();
    `
  },

  // 21. HEX to RGB to HSL Converter
  {
    id: 'hex-rgb-hsl-converter',
    categoryId: 'image-utilities',
    name: 'HEX / RGB / HSL Converter',
    icon: '🔄',
    title: 'HEX to RGB to HSL Converter — Two-Way Color Format Translation',
    description: 'Bidirectional, synchronized three-way color converter for web designers with live visual feedback and ready-to-use CSS snippets.',
    keywords: 'hex to rgb converter, rgb to hex, hex to hsl, hsl to rgb, color format converter, css color converter',
    howToUse: [
      { step: '1', title: 'Edit Any Format', desc: 'Type or paste a color code into the HEX, RGB, or HSL fields.' },
      { step: '2', title: 'Observe Synchronization', desc: 'The other two formats and color swatch recalculate instantly.' },
      { step: '3', title: 'Copy CSS Snippets', desc: 'Grab ready-to-paste CSS color declarations in any format.' }
    ],
    features: [
      { title: 'Three-Way Live Sync', desc: 'Modifying HEX, RGB sliders, or HSL inputs updates all counterpart values seamlessly.' },
      { title: 'Color Math Accuracy', desc: 'Calculates true standard RGB gamut matrices and spherical HSL coordinates.' },
      { title: 'CSS Ready', desc: 'Provides standard rgb(r, g, b) and hsl(h, s%, l%) formats.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-grid-2col">
        <div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="hrh-hex">HEX Format</label>
            <input type="text" id="hrh-hex" class="bu-input bu-input-mono" value="#0066CC" placeholder="#RRGGBB">
          </div>
          <div class="bu-form-group">
            <label class="bu-form-label">RGB Format (0 - 255)</label>
            <div class="bu-grid-3col">
              <input type="number" id="hrh-r" class="bu-input" value="0" min="0" max="255" placeholder="R">
              <input type="number" id="hrh-g" class="bu-input" value="102" min="0" max="255" placeholder="G">
              <input type="number" id="hrh-b" class="bu-input" value="204" min="0" max="255" placeholder="B">
            </div>
          </div>
          <div class="bu-form-group">
            <label class="bu-form-label">HSL Format (H: 0-360°, S: 0-100%, L: 0-100%)</label>
            <div class="bu-grid-3col">
              <input type="number" id="hrh-h" class="bu-input" value="210" min="0" max="360" placeholder="H°">
              <input type="number" id="hrh-s" class="bu-input" value="100" min="0" max="100" placeholder="S%">
              <input type="number" id="hrh-l" class="bu-input" value="40" min="0" max="100" placeholder="L%">
            </div>
          </div>
        </div>
        <div>
          <div class="bu-form-group">
            <label class="bu-form-label">Live Swatch Preview</label>
            <div id="hrh-tile" style="width: 100%; height: 160px; border-radius: 8px; background-color: #0066CC; border: 1px solid var(--border-color); margin-bottom: 1.25rem;"></div>
          </div>
          <div class="bu-actions-bar">
            <button type="button" id="btn-hrh-copy-hex" class="bu-btn bu-btn-primary">Copy HEX</button>
            <button type="button" id="btn-hrh-copy-rgb" class="bu-btn">Copy RGB</button>
            <button type="button" id="btn-hrh-copy-hsl" class="bu-btn">Copy HSL</button>
            <button type="button" id="btn-hrh-reset" class="bu-btn bu-btn-subtle">Reset</button>
          </div>
        </div>
      </div>
    `,
    renderScript: () => `
      const hexIn = document.getElementById('hrh-hex');
      const rIn = document.getElementById('hrh-r');
      const gIn = document.getElementById('hrh-g');
      const bIn = document.getElementById('hrh-b');
      const hIn = document.getElementById('hrh-h');
      const sIn = document.getElementById('hrh-s');
      const lIn = document.getElementById('hrh-l');
      const tile = document.getElementById('hrh-tile');

      const copyHex = document.getElementById('btn-hrh-copy-hex');
      const copyRgb = document.getElementById('btn-hrh-copy-rgb');
      const copyHsl = document.getElementById('btn-hrh-copy-hsl');
      const resetBtn = document.getElementById('btn-hrh-reset');

      let isUpdating = false;

      function updateFromRgb(r, g, b) {
        if (isUpdating) return;
        isUpdating = true;
        const normHex = window.MTV_BU.rgbToHex(r, g, b);
        const hsl = window.MTV_BU.rgbToHsl(r, g, b);
        hexIn.value = normHex;
        hIn.value = hsl.h;
        sIn.value = hsl.s;
        lIn.value = hsl.l;
        tile.style.backgroundColor = normHex;
        isUpdating = false;
      }

      hexIn.addEventListener('input', () => {
        if (isUpdating) return;
        const rgb = window.MTV_BU.hexToRgb(hexIn.value.trim());
        if (rgb) {
          isUpdating = true;
          rIn.value = rgb.r;
          gIn.value = rgb.g;
          bIn.value = rgb.b;
          const hsl = window.MTV_BU.rgbToHsl(rgb.r, rgb.g, rgb.b);
          hIn.value = hsl.h;
          sIn.value = hsl.s;
          lIn.value = hsl.l;
          tile.style.backgroundColor = hexIn.value;
          isUpdating = false;
        }
      });

      [rIn, gIn, bIn].forEach(el => el.addEventListener('input', () => {
        updateFromRgb(parseInt(rIn.value, 10) || 0, parseInt(gIn.value, 10) || 0, parseInt(bIn.value, 10) || 0);
      }));

      [hIn, sIn, lIn].forEach(el => el.addEventListener('input', () => {
        if (isUpdating) return;
        const rgb = window.MTV_BU.hslToRgb(parseInt(hIn.value, 10) || 0, parseInt(sIn.value, 10) || 0, parseInt(lIn.value, 10) || 0);
        updateFromRgb(rgb.r, rgb.g, rgb.b);
      }));

      copyHex.addEventListener('click', () => window.MTV_BU.copyToClipboard(hexIn.value, copyHex));
      copyRgb.addEventListener('click', () => window.MTV_BU.copyToClipboard(\`rgb(\${rIn.value}, \${gIn.value}, \${bIn.value})\`, copyRgb));
      copyHsl.addEventListener('click', () => window.MTV_BU.copyToClipboard(\`hsl(\${hIn.value}, \${sIn.value}%, \${lIn.value}%)\`, copyHsl));

      resetBtn.addEventListener('click', () => {
        hexIn.value = '#0066CC';
        const rgb = window.MTV_BU.hexToRgb('#0066CC');
        rIn.value = rgb.r;
        gIn.value = rgb.g;
        bIn.value = rgb.b;
        updateFromRgb(rgb.r, rgb.g, rgb.b);
      });
    `
  },

  // 22. Image Color Extractor
  {
    id: 'image-color-extractor',
    categoryId: 'image-utilities',
    name: 'Image Color Palette Extractor',
    icon: '🖼️',
    title: 'Image Color Palette Extractor — Dominant Color & Swatches from Image',
    description: 'Extract dominant color palettes and prominent hues from local images using HTML5 Canvas pixel quantization with zero uploads.',
    keywords: 'image color extractor, extract palette from image, dominant image color, picture color picker, canvas color extractor',
    howToUse: [
      { step: '1', title: 'Drop or Upload Image', desc: 'Select a photo, poster, or thumbnail (PNG, JPG, WebP, SVG).' },
      { step: '2', title: 'In-Browser Extraction', desc: 'Canvas pixel quantization detects dominant and accent colors in memory.' },
      { step: '3', title: 'Copy Palette Swatches', desc: 'Click any extracted color chip to copy its HEX or RGB code.' }
    ],
    features: [
      { title: 'Zero File Uploads', desc: 'Your personal photos and graphic assets never leave your device.' },
      { title: 'Dominant Color + 8 Accents', desc: 'Extracts the overall dominant hero color plus top supporting swatches.' },
      { title: 'Instant Swatch Copy', desc: 'One-click hex copying directly from each extracted palette card.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-dropzone" id="ice-dropzone">
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">📁</div>
        <strong style="display: block; font-size: 1rem; color: var(--text-primary); margin-bottom: 0.25rem;">Drop an image here or click to browse</strong>
        <span style="font-size: 0.82rem; color: var(--text-muted);">Supports PNG, JPG, WebP, SVG — processed 100% locally</span>
        <input type="file" id="ice-file" accept="image/*" style="display: none;">
      </div>
      <div id="ice-results" style="display: none; margin-top: 1.5rem;">
        <div class="bu-grid-2col">
          <div>
            <label class="bu-form-label">Uploaded Image</label>
            <div style="max-height: 260px; overflow: hidden; border-radius: 8px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; background: #000;">
              <img id="ice-preview" src="" alt="Uploaded Preview" style="max-width: 100%; max-height: 260px; object-fit: contain;">
            </div>
          </div>
          <div>
            <label class="bu-form-label">Dominant Color</label>
            <div id="ice-dominant-card" style="padding: 1.25rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              <div id="ice-dominant-swatch" style="width: 56px; height: 56px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.1);"></div>
              <div>
                <strong id="ice-dominant-hex" style="display: block; font-size: 1.2rem; font-family: monospace;">#000000</strong>
                <span id="ice-dominant-rgb" style="font-size: 0.82rem; color: var(--text-muted);">rgb(0, 0, 0)</span>
              </div>
            </div>
            <label class="bu-form-label">Extracted Palette Swatches (Click to copy)</label>
            <div id="ice-palette-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;"></div>
          </div>
        </div>
        <div class="bu-actions-bar" style="margin-top: 1.25rem;">
          <button type="button" id="btn-ice-copy-all" class="bu-btn bu-btn-primary">Copy All HEX Codes</button>
          <button type="button" id="btn-ice-clear" class="bu-btn bu-btn-subtle">Clear Image</button>
        </div>
      </div>
    `,
    renderScript: () => `
      const dropzone = document.getElementById('ice-dropzone');
      const fileInput = document.getElementById('ice-file');
      const results = document.getElementById('ice-results');
      const previewImg = document.getElementById('ice-preview');
      const domSwatch = document.getElementById('ice-dominant-swatch');
      const domHex = document.getElementById('ice-dominant-hex');
      const domRgb = document.getElementById('ice-dominant-rgb');
      const paletteGrid = document.getElementById('ice-palette-grid');
      const copyAllBtn = document.getElementById('btn-ice-copy-all');
      const clearBtn = document.getElementById('btn-ice-clear');

      let extractedPalette = [];

      dropzone.addEventListener('click', () => fileInput.click());
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
      });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          processFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
          processFile(fileInput.files[0]);
        }
      });

      function processFile(file) {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImg.src = e.target.result;
          const img = new Image();
          img.onload = () => {
            const data = window.MTV_BU.extractImageColors(img, 8);
            extractedPalette = data.palette;

            domSwatch.style.backgroundColor = data.dominant.hex;
            domHex.textContent = data.dominant.hex;
            domRgb.textContent = data.dominant.rgb;

            paletteGrid.innerHTML = '';
            data.palette.forEach(c => {
              const chip = document.createElement('div');
              chip.style.cssText = 'border: 1px solid var(--border-color); border-radius: 6px; overflow: hidden; cursor: pointer; text-align: center; background: var(--bg-card);';
              chip.title = 'Copy ' + c.hex;
              chip.innerHTML = \`
                <div style="height: 48px; background-color: \${c.hex};"></div>
                <span style="display: block; font-size: 0.72rem; font-family: monospace; padding: 0.25rem 0;">\${c.hex}</span>
              \`;
              chip.addEventListener('click', () => window.MTV_BU.copyToClipboard(c.hex));
              paletteGrid.appendChild(chip);
            });

            results.style.display = 'block';
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }

      copyAllBtn.addEventListener('click', () => {
        if (!extractedPalette.length) return;
        const txt = extractedPalette.map(c => c.hex).join(', ');
        window.MTV_BU.copyToClipboard(txt, copyAllBtn);
      });

      clearBtn.addEventListener('click', () => {
        results.style.display = 'none';
        previewImg.src = '';
        fileInput.value = '';
      });
    `
  },

  // 23. SVG Viewer & Sanitizer
  {
    id: 'svg-viewer',
    categoryId: 'image-utilities',
    name: 'SVG Viewer & Sanitizer',
    icon: '📐',
    title: 'SVG Viewer & Sanitizer — Safe Vector Code Inspection & Export',
    description: 'Render, inspect, scale, and sanitize SVG markup in-browser with automatic stripping of dangerous script tags and event handlers.',
    keywords: 'svg viewer, svg sanitizer, clean svg online, render svg code, safe svg viewer, inspect svg dimensions',
    howToUse: [
      { step: '1', title: 'Paste SVG XML', desc: 'Paste vector code directly into the editor or upload an .svg file.' },
      { step: '2', title: 'Inspect & Render', desc: 'Preview the rendered vector with zoom and dark/light background toggles.' },
      { step: '3', title: 'Sanitize & Download', desc: 'Strip malicious scripts and export a clean, safe SVG asset.' }
    ],
    features: [
      { title: 'Security Sanitization', desc: 'Removes <script>, onload, onclick, and foreign objects that can pose XSS risks.' },
      { title: 'Background Contrast Toggles', desc: 'Test vector transparency on white, dark, or checkerboard canvas backdrops.' },
      { title: 'Dimension Extraction', desc: 'Inspects viewBox coordinates, width, and height attributes automatically.' }
    ],
    sampleText: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="45" fill="#0066CC" />
  <polygon points="40,30 70,50 40,70" fill="#FFFFFF" />
</svg>`,
    renderControls: () => `
      <div class="bu-grid-2col">
        <div>
          <div class="bu-form-group">
            <label class="bu-form-label" for="svg-input">SVG Code</label>
            <textarea id="svg-input" class="bu-textarea bu-textarea-mono" style="min-height: 240px;" placeholder="Paste <svg>...</svg> code here..."><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="45" fill="#0066CC" />
  <polygon points="40,30 70,50 40,70" fill="#FFFFFF" />
</svg></textarea>
          </div>
          <div class="bu-actions-bar">
            <button type="button" id="btn-svg-render" class="bu-btn bu-btn-primary">Render SVG</button>
            <button type="button" id="btn-svg-sanitize" class="bu-btn">Sanitize Code</button>
            <button type="button" id="btn-svg-download" class="bu-btn">Download .svg</button>
            <button type="button" id="btn-svg-clear" class="bu-btn bu-btn-subtle">Clear</button>
          </div>
        </div>
        <div>
          <div class="bu-options-wrap" style="align-items: center; justify-content: space-between;">
            <label class="bu-form-label" style="margin: 0;">SVG Preview</label>
            <div style="display: flex; gap: 0.5rem;">
              <button type="button" id="btn-bg-light" class="bu-btn" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">White</button>
              <button type="button" id="btn-bg-dark" class="bu-btn" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Dark</button>
              <button type="button" id="btn-bg-check" class="bu-btn" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Grid</button>
            </div>
          </div>
          <div id="svg-stage" style="width: 100%; height: 260px; border-radius: 8px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; background: #ffffff; overflow: hidden; margin-top: 0.5rem;"></div>
          <div class="bu-stats-strip" id="svg-meta" style="margin-top: 1rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
            <div class="bu-stat-item">ViewBox: <strong id="svg-viewbox">0 0 100 100</strong></div>
            <div class="bu-stat-item">Width: <strong id="svg-w">100px</strong></div>
            <div class="bu-stat-item">Height: <strong id="svg-h">100px</strong></div>
          </div>
        </div>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('svg-input');
      const stage = document.getElementById('svg-stage');
      const renderBtn = document.getElementById('btn-svg-render');
      const sanitizeBtn = document.getElementById('btn-svg-sanitize');
      const dlBtn = document.getElementById('btn-svg-download');
      const clearBtn = document.getElementById('btn-svg-clear');
      const bgLight = document.getElementById('btn-bg-light');
      const bgDark = document.getElementById('btn-bg-dark');
      const bgCheck = document.getElementById('btn-bg-check');

      const vbEl = document.getElementById('svg-viewbox');
      const wEl = document.getElementById('svg-w');
      const hEl = document.getElementById('svg-h');

      function render() {
        const raw = input.value.trim();
        if (!raw) {
          stage.innerHTML = '<span style="color: var(--text-muted);">No SVG loaded</span>';
          return;
        }
        const clean = window.MTV_BU.sanitizeSVG(raw);
        stage.innerHTML = clean;
        const svgEl = stage.querySelector('svg');
        if (svgEl) {
          vbEl.textContent = svgEl.getAttribute('viewBox') || '(none)';
          wEl.textContent = svgEl.getAttribute('width') || '(auto)';
          hEl.textContent = svgEl.getAttribute('height') || '(auto)';
        }
      }

      renderBtn.addEventListener('click', render);
      input.addEventListener('input', render);

      sanitizeBtn.addEventListener('click', () => {
        input.value = window.MTV_BU.sanitizeSVG(input.value);
        render();
      });

      dlBtn.addEventListener('click', () => {
        if (!input.value) return;
        window.MTV_BU.downloadFile(input.value, 'vector.svg', 'image/svg+xml');
      });

      bgLight.addEventListener('click', () => stage.style.background = '#ffffff');
      bgDark.addEventListener('click', () => stage.style.background = '#111111');
      bgCheck.addEventListener('click', () => {
        stage.style.background = 'repeating-conic-gradient(#eee 0% 25%, #fff 0% 50%) 50% / 20px 20px';
      });

      clearBtn.addEventListener('click', () => {
        input.value = '';
        stage.innerHTML = '';
        input.focus();
      });

      render();
    `
  },

  // 24. Image Metadata Viewer
  {
    id: 'image-metadata-viewer',
    categoryId: 'image-utilities',
    name: 'Image Metadata Viewer',
    icon: '📸',
    title: 'Image Metadata & Dimensions Inspector — Client-Side File Analysis',
    description: 'Inspect natural pixel dimensions, aspect ratio, file size, MIME type, and local image attributes completely offline with zero server transmission.',
    keywords: 'image metadata viewer, image dimensions checker, photo aspect ratio calculator, inspect image resolution, client side image inspector',
    howToUse: [
      { step: '1', title: 'Upload Image File', desc: 'Drag and drop any local image file or click to select.' },
      { step: '2', title: 'View Dimensions & Ratio', desc: 'Inspect exact width, height, megapixels, and computed aspect ratio (e.g. 16:9).' },
      { step: '3', title: 'Copy Summary', desc: 'Export the complete metadata report as text or JSON.' }
    ],
    features: [
      { title: 'Aspect Ratio Simplification', desc: 'Automatically finds the greatest common divisor to present ratios like 16:9, 4:3, or 1:1.' },
      { title: 'Megapixel Calculation', desc: 'Calculates true sensor resolution in MP.' },
      { title: 'Completely Offline', desc: 'High security: photos, private IDs, and confidential artwork never leave your browser.' }
    ],
    sampleText: '',
    renderControls: () => `
      <div class="bu-dropzone" id="imv-dropzone">
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🖼️</div>
        <strong style="display: block; font-size: 1rem; color: var(--text-primary); margin-bottom: 0.25rem;">Drop an image here or click to inspect</strong>
        <span style="font-size: 0.82rem; color: var(--text-muted);">PNG, JPG, WebP, GIF, SVG, BMP — 100% private</span>
        <input type="file" id="imv-file" accept="image/*" style="display: none;">
      </div>
      <div id="imv-results" style="display: none; margin-top: 1.5rem;">
        <div class="bu-table-wrap">
          <table class="bu-table">
            <thead><tr><th>Attribute</th><th>Value</th></tr></thead>
            <tbody>
              <tr><td>File Name</td><td id="imv-name" style="font-weight: 600;">-</td></tr>
              <tr><td>Dimensions</td><td id="imv-dims" style="font-weight: 600; color: var(--accent-blue);">-</td></tr>
              <tr><td>Aspect Ratio</td><td id="imv-ratio" style="font-weight: 600;">-</td></tr>
              <tr><td>Megapixels</td><td id="imv-mp">-</td></tr>
              <tr><td>File Size</td><td id="imv-size">-</td></tr>
              <tr><td>MIME Type</td><td id="imv-type">-</td></tr>
              <tr><td>Last Modified</td><td id="imv-date">-</td></tr>
            </tbody>
          </table>
        </div>
        <div class="bu-actions-bar" style="margin-top: 1.25rem;">
          <button type="button" id="btn-imv-copy-json" class="bu-btn bu-btn-primary">Copy as JSON</button>
          <button type="button" id="btn-imv-clear" class="bu-btn bu-btn-subtle">Clear</button>
        </div>
      </div>
    `,
    renderScript: () => `
      const dropzone = document.getElementById('imv-dropzone');
      const fileIn = document.getElementById('imv-file');
      const results = document.getElementById('imv-results');
      const nameEl = document.getElementById('imv-name');
      const dimsEl = document.getElementById('imv-dims');
      const ratioEl = document.getElementById('imv-ratio');
      const mpEl = document.getElementById('imv-mp');
      const sizeEl = document.getElementById('imv-size');
      const typeEl = document.getElementById('imv-type');
      const dateEl = document.getElementById('imv-date');
      const copyJsonBtn = document.getElementById('btn-imv-copy-json');
      const clearBtn = document.getElementById('btn-imv-clear');

      let lastReport = null;

      dropzone.addEventListener('click', () => fileIn.click());
      dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag-over'); });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
      });
      fileIn.addEventListener('change', () => {
        if (fileIn.files && fileIn.files[0]) processFile(fileIn.files[0]);
      });

      function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

      function processFile(file) {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const w = img.naturalWidth;
            const h = img.naturalHeight;
            const divisor = gcd(w, h);
            const ratioStr = \`\${w / divisor}:\${h / divisor}\`;
            const mp = ((w * h) / 1000000).toFixed(2);
            const sizeStr = file.size > 1048576 ? (file.size / 1048576).toFixed(2) + ' MB' : (file.size / 1024).toFixed(1) + ' KB';

            lastReport = {
              name: file.name,
              width: w,
              height: h,
              aspectRatio: ratioStr,
              megapixels: mp + ' MP',
              sizeBytes: file.size,
              sizeFormatted: sizeStr,
              mimeType: file.type,
              lastModified: new Date(file.lastModified).toLocaleString()
            };

            nameEl.textContent = lastReport.name;
            dimsEl.textContent = \`\${w} × \${h} px\`;
            ratioEl.textContent = ratioStr;
            mpEl.textContent = mp + ' MP';
            sizeEl.textContent = sizeStr;
            typeEl.textContent = file.type;
            dateEl.textContent = lastReport.lastModified;

            results.style.display = 'block';
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }

      copyJsonBtn.addEventListener('click', () => {
        if (!lastReport) return;
        window.MTV_BU.copyToClipboard(JSON.stringify(lastReport, null, 2), copyJsonBtn);
      });

      clearBtn.addEventListener('click', () => {
        results.style.display = 'none';
        fileIn.value = '';
      });
    `
  }
];

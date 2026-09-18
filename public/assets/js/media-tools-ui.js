/**
 * Multi Tube Views (MTV) — Media Tools UI & Dispatcher
 * Manages options panels and execution for the 45 new media tools
 * 100% Client-Side — Fully private in-browser processing
 */

(function() {
  'use strict';

  const handlers = window.MTVMediaHandlers || {};

  const MTVMediaUI = {
    // Check if tool has a dedicated handler in the expanded tools
    hasHandler(toolId) {
      const known = [
        'image-compressor', 'image-resizer', 'image-watermark', 'color-inverter',
        'image-filters', 'png-to-svg', 'favicon-generator', 'meme-generator',
        'base64-image', 'image-blur', 'image-border', 'image-splitter',
        'color-palette-image', 'pixelate-image', 'image-rotate-flip',
        'heic-to-jpg', 'heic-to-png', 'webp-to-jpg', 'webp-to-png',
        'avif-to-jpg', 'avif-to-png', 'svg-to-png',
        'video-compressor', 'video-reverse', 'video-watermark', 'video-mute',
        'video-rotate', 'video-loop', 'video-framerate', 'video-snapshot',
        'video-aspect-ratio', 'video-color-filter',
        'audio-compressor', 'audio-joiner', 'audio-normalizer', 'audio-reverse',
        'audio-pitch', 'audio-bass-boost', 'audio-bpm', 'audio-stereo-panner',
        'audio-noise-generator', 'audio-cutter-ringtone',
        'pdf-merger', 'pdf-splitter', 'pdf-page-rotator', 'pdf-watermark',
        'pdf-page-numberer', 'pdf-compressor', 'text-to-pdf', 'pdf-protect',
        'pdf-page-delete', 'markdown-to-pdf',
        'pdf-password-protect', 'pdf-password-remover', 'pdf-image-extractor',
        'pdf-page-reorganizer', 'pdf-to-text', 'images-to-pdf'
      ];
      return known.includes(toolId);
    },

    // Ensure options panel exists for tool, creating it dynamically if absent
    ensurePanel(toolId, engine) {
      let panel = document.getElementById(`panel-${toolId}`);
      if (panel) return panel;

      const container = document.getElementById('media-options-container');
      if (!container) return null;

      panel = document.createElement('div');
      panel.className = 'media-options-panel';
      panel.id = `panel-${toolId}`;
      panel.style.display = 'none';

      const html = this.getPanelHtml(toolId);
      panel.innerHTML = html;
      container.appendChild(panel);

      this.bindPanelEvents(toolId, panel, engine);
      return panel;
    },

    getPanelHtml(toolId) {
      switch (toolId) {
        // ========== IMAGE TOOLS ==========
        case 'image-compressor':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-comp-quality">Compression Quality: <span id="val-comp-quality" style="color: var(--accent-primary); font-weight: bold;">80%</span></label>
                <input type="range" id="opt-comp-quality" min="10" max="100" value="80" style="width: 100%; accent-color: var(--accent-primary);" />
                <span class="media-option-hint">Lower quality yields smaller file size. 75-85% is ideal for web graphics.</span>
              </div>
              <div class="media-option-group">
                <label for="opt-comp-format">Output Format</label>
                <select id="opt-comp-format">
                  <option value="webp" selected>WebP (Smallest file size & high quality)</option>
                  <option value="jpeg">JPEG (Standard web compatibility)</option>
                  <option value="png">PNG (Lossless compression)</option>
                </select>
              </div>
              <div class="media-option-group">
                <label for="opt-comp-maxdim">Max Width/Height Constraint</label>
                <select id="opt-comp-maxdim">
                  <option value="0" selected>Original Dimensions (No downscaling)</option>
                  <option value="1920">Max 1920px (Full HD)</option>
                  <option value="1280">Max 1280px (HD web)</option>
                  <option value="800">Max 800px (Mobile optimized)</option>
                </select>
              </div>
            </div>
          `;

        case 'image-resizer':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-resize-preset">Size Preset</label>
                <select id="opt-resize-preset">
                  <option value="custom" selected>Custom Dimensions</option>
                  <option value="yt-thumb">YouTube Thumbnail (1280 × 720)</option>
                  <option value="ig-square">Instagram Square (1080 × 1080)</option>
                  <option value="ig-story">Instagram Story / TikTok (1080 × 1920)</option>
                  <option value="twitter">X / Twitter Post (1200 × 675)</option>
                  <option value="fb-banner">Facebook Banner (1200 × 630)</option>
                  <option value="half">50% Half Size</option>
                  <option value="double">200% Double Size</option>
                </select>
              </div>
              <div class="media-option-group">
                <label for="opt-resize-width">Width (pixels)</label>
                <input type="number" id="opt-resize-width" value="1280" min="10" max="10000" />
              </div>
              <div class="media-option-group">
                <label for="opt-resize-height">Height (pixels)</label>
                <input type="number" id="opt-resize-height" value="720" min="10" max="10000" />
              </div>
              <div class="media-option-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">
                <input type="checkbox" id="opt-resize-aspect" checked style="width: 18px; height: 18px; accent-color: var(--accent-primary);" />
                <label for="opt-resize-aspect" style="margin: 0; cursor: pointer;">Maintain Aspect Ratio</label>
              </div>
            </div>
          `;

        case 'image-watermark':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-wm-text">Watermark Text</label>
                <input type="text" id="opt-wm-text" value="© Multi Tube Views" placeholder="Enter watermark text..." />
              </div>
              <div class="media-option-group">
                <label for="opt-wm-pos">Placement Position</label>
                <select id="opt-wm-pos">
                  <option value="bottom-right" selected>Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                  <option value="center">Center</option>
                </select>
              </div>
              <div class="media-option-group">
                <label for="opt-wm-opacity">Opacity: <span id="val-wm-opacity" style="color: var(--accent-primary); font-weight: bold;">50%</span></label>
                <input type="range" id="opt-wm-opacity" min="10" max="100" value="50" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>
              <div class="media-option-group">
                <label for="opt-wm-size">Font Size: <span id="val-wm-size" style="color: var(--accent-primary); font-weight: bold;">32px</span></label>
                <input type="range" id="opt-wm-size" min="14" max="96" value="32" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>
              <div class="media-option-group">
                <label for="opt-wm-color">Text Color</label>
                <select id="opt-wm-color">
                  <option value="#ffffff" selected>White (with subtle shadow)</option>
                  <option value="#000000">Black</option>
                  <option value="#e11d48">Vibrant Red</option>
                  <option value="#eab308">Gold Yellow</option>
                  <option value="#3b82f6">Bright Blue</option>
                </select>
              </div>
            </div>
          `;

        case 'color-inverter':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-invert-mode">Inversion Mode</label>
                <select id="opt-invert-mode">
                  <option value="full" selected>Complete RGB Invert (Negative photo)</option>
                  <option value="lightness">Luminance Invert (Preserve color hues)</option>
                  <option value="bw">Inverted Monochrome (Dark mode B&W)</option>
                </select>
                <span class="media-option-hint">Flips color channels client-side with pixel-accurate Canvas ImageData.</span>
              </div>
            </div>
          `;

        case 'image-filters':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-filter-bright">Brightness: <span id="val-filter-bright" style="color: var(--accent-primary); font-weight: bold;">100%</span></label>
                <input type="range" id="opt-filter-bright" min="20" max="200" value="100" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>
              <div class="media-option-group">
                <label for="opt-filter-contrast">Contrast: <span id="val-filter-contrast" style="color: var(--accent-primary); font-weight: bold;">100%</span></label>
                <input type="range" id="opt-filter-contrast" min="20" max="200" value="100" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>
              <div class="media-option-group">
                <label for="opt-filter-sat">Saturation: <span id="val-filter-sat" style="color: var(--accent-primary); font-weight: bold;">100%</span></label>
                <input type="range" id="opt-filter-sat" min="0" max="250" value="100" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>
              <div class="media-option-group">
                <label for="opt-filter-sepia">Sepia Tone: <span id="val-filter-sepia" style="color: var(--accent-primary); font-weight: bold;">0%</span></label>
                <input type="range" id="opt-filter-sepia" min="0" max="100" value="0" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>
              <div class="media-option-group">
                <label for="opt-filter-gray">Grayscale: <span id="val-filter-gray" style="color: var(--accent-primary); font-weight: bold;">0%</span></label>
                <input type="range" id="opt-filter-gray" min="0" max="100" value="0" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>
              <div class="media-option-group">
                <label for="opt-filter-hue">Hue Rotation: <span id="val-filter-hue" style="color: var(--accent-primary); font-weight: bold;">0°</span></label>
                <input type="range" id="opt-filter-hue" min="0" max="360" value="0" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>
            </div>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-filter-preset-reset">Reset</button>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-filter-preset-vintage">Vintage Sepia</button>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-filter-preset-bw">High Contrast B&W</button>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-filter-preset-warm">Warm Sunset</button>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-filter-preset-vibrant">Super Vibrant</button>
            </div>
          `;

        case 'png-to-svg':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-svg-detail">Vector Tracing Detail</label>
                <select id="opt-svg-detail">
                  <option value="medium" selected>Balanced (Clean contours)</option>
                  <option value="high">High Detail (Fine line accuracy)</option>
                  <option value="low">Geometric / Posterized</option>
                </select>
                <span class="media-option-hint">Traces bitmap pixels into scalable resolution-independent SVG paths.</span>
              </div>
            </div>
          `;

        case 'favicon-generator':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label>Generated Favicon Resolutions</label>
                <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; padding: 0.75rem; background: var(--bg-subtle); border-radius: var(--radius-md);">
                  ✓ 16×16 px (Browser tab standard)<br/>
                  ✓ 32×32 px (Retina tab icon)<br/>
                  ✓ 48×48 px (Desktop shortcut)<br/>
                  ✓ 180×180 px (Apple Touch Icon iOS)<br/>
                  ✓ 192×192 px (Android PWA Icon)<br/>
                  ✓ 512×512 px (PWA Splash Icon)
                </div>
              </div>
              <div class="media-option-group">
                <label for="opt-fav-export">Export Package</label>
                <select id="opt-fav-export">
                  <option value="zip" selected>Download All as ZIP Archive</option>
                  <option value="32">Single 32×32 PNG Favicon</option>
                  <option value="180">Single 180×180 Apple Touch Icon</option>
                </select>
              </div>
            </div>
          `;

        case 'meme-generator':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-meme-top">Top Caption</label>
                <input type="text" id="opt-meme-top" value="WHEN YOU FIND A FREE TOOL" placeholder="Top text..." />
              </div>
              <div class="media-option-group">
                <label for="opt-meme-bottom">Bottom Caption</label>
                <input type="text" id="opt-meme-bottom" value="AND IT RUNS 100% IN BROWSER" placeholder="Bottom text..." />
              </div>
              <div class="media-option-group">
                <label for="opt-meme-size">Font Size: <span id="val-meme-size" style="color: var(--accent-primary); font-weight: bold;">42px</span></label>
                <input type="range" id="opt-meme-size" min="20" max="72" value="42" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>
            </div>
          `;

        case 'base64-image':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-b64-format">Encoding Output Format</label>
                <select id="opt-b64-format">
                  <option value="data-uri" selected>Full Data URI (data:image/...;base64,...)</option>
                  <option value="html-img">&lt;img src="..." /&gt; HTML Tag</option>
                  <option value="css-bg">background-image: url("...") CSS</option>
                  <option value="raw">Raw Base64 string only</option>
                </select>
              </div>
            </div>
            <div style="margin-top: 1.25rem;">
              <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.4rem; display: block;">Generated Base64 String Preview</label>
              <textarea id="opt-b64-output" readonly rows="5" style="width: 100%; font-family: monospace; font-size: 0.8rem; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-subtle); color: var(--text-primary);" placeholder="Select an image file to view Base64 output..."></textarea>
              <div style="margin-top: 0.5rem;">
                <button type="button" class="btn btn-secondary btn-sm" id="btn-copy-b64">Copy Base64 to Clipboard</button>
              </div>
            </div>
          `;

        case 'image-blur':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-blur-radius">Blur Intensity: <span id="val-blur-radius" style="color: var(--accent-primary); font-weight: bold;">12px</span></label>
                <input type="range" id="opt-blur-radius" min="2" max="50" value="12" style="width: 100%; accent-color: var(--accent-primary);" />
                <span class="media-option-hint">Smooth Gaussian blur for privacy redaction and background aesthetics.</span>
              </div>
            </div>
          `;

        case 'image-border':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-border-width">Border Width: <span id="val-border-width" style="color: var(--accent-primary); font-weight: bold;">24px</span></label>
                <input type="range" id="opt-border-width" min="4" max="100" value="24" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>
              <div class="media-option-group">
                <label for="opt-border-color">Frame Color</label>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <input type="color" id="opt-border-color" value="#1e293b" style="height: 38px; width: 60px; padding: 2px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); cursor: pointer;" />
                  <input type="text" id="opt-border-hex" value="#1e293b" style="width: 100px; font-family: monospace;" />
                </div>
              </div>
              <div class="media-option-group">
                <label for="opt-border-radius">Corner Radius: <span id="val-border-radius" style="color: var(--accent-primary); font-weight: bold;">16px</span></label>
                <input type="range" id="opt-border-radius" min="0" max="60" value="16" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>
            </div>
          `;

        case 'image-splitter':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-split-grid">Grid Layout</label>
                <select id="opt-split-grid">
                  <option value="3x1" selected>3×1 Swipeable Carousel (3 columns, 1 row)</option>
                  <option value="3x3">3×3 Instagram Grid (9 tiles)</option>
                  <option value="2x2">2×2 Square Grid (4 tiles)</option>
                  <option value="2x1">2×1 Side-by-Side (2 tiles)</option>
                </select>
                <span class="media-option-hint">All split tiles are packaged into an instant ZIP download.</span>
              </div>
            </div>
          `;

        case 'color-palette-image':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-palette-count">Number of Swatches</label>
                <select id="opt-palette-count">
                  <option value="4">4 Main Colors</option>
                  <option value="6" selected>6 Dominant Colors</option>
                  <option value="8">8 Extended Colors</option>
                </select>
              </div>
            </div>
            <div id="palette-swatches-container" style="margin-top: 1.5rem; display: flex; gap: 0.75rem; flex-wrap: wrap;"></div>
          `;

        case 'pixelate-image':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-pixel-size">Pixel Block Size: <span id="val-pixel-size" style="color: var(--accent-primary); font-weight: bold;">16px</span></label>
                <input type="range" id="opt-pixel-size" min="4" max="64" value="16" style="width: 100%; accent-color: var(--accent-primary);" />
                <span class="media-option-hint">Higher values create chunky retro 8-bit aesthetic or heavy mosaic redaction.</span>
              </div>
            </div>
          `;

        case 'image-rotate-flip':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-rot-deg">Rotation Angle</label>
                <select id="opt-rot-deg">
                  <option value="0" selected>0° (No rotation)</option>
                  <option value="90">90° Clockwise</option>
                  <option value="180">180° Upside Down</option>
                  <option value="270">270° (90° Counter-Clockwise)</option>
                </select>
              </div>
              <div class="media-option-group" style="display: flex; gap: 1.5rem; align-items: center; margin-top: 1.5rem;">
                <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                  <input type="checkbox" id="opt-flip-h" style="accent-color: var(--accent-primary);" /> Flip Horizontal
                </label>
                <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                  <input type="checkbox" id="opt-flip-v" style="accent-color: var(--accent-primary);" /> Flip Vertical
                </label>
              </div>
            </div>
          `;

        // ========== VIDEO TOOLS ==========
        case 'video-compressor':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-vcomp-res">Target Downscale Resolution</label>
                <select id="opt-vcomp-res">
                  <option value="original" selected>Keep Original Aspect / Scale 80%</option>
                  <option value="720p">720p HD (Great for web & social)</option>
                  <option value="480p">480p SD (High compression / email)</option>
                  <option value="360p">360p Mobile (Ultra compact)</option>
                </select>
                <span class="media-option-hint">Re-encodes video frames client-side to reduce megabytes.</span>
              </div>
            </div>
          `;

        case 'video-reverse':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label>Reverse Playback Engine</label>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0;">Renders video frames in reverse order client-side. Best for clips under 45 seconds.</p>
              </div>
            </div>
          `;

        case 'video-watermark':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-vwm-text">Watermark Text</label>
                <input type="text" id="opt-vwm-text" value="MTV Creator" placeholder="Channel / watermark text..." />
              </div>
              <div class="media-option-group">
                <label for="opt-vwm-pos">Corner Position</label>
                <select id="opt-vwm-pos">
                  <option value="bottom-right" selected>Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>
            </div>
          `;

        case 'video-mute':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label>Audio Removal</label>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0;">Removes audio stream completely, outputting a lightweight silent video clip.</p>
              </div>
            </div>
          `;

        case 'video-rotate':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-vrot-deg">Rotation Direction</label>
                <select id="opt-vrot-deg">
                  <option value="90" selected>90° Clockwise (Turn vertical to landscape)</option>
                  <option value="180">180° Inverted (Fix upside-down)</option>
                  <option value="270">270° Clockwise (90° CCW)</option>
                </select>
              </div>
            </div>
          `;

        case 'video-loop':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-vloop-count">Loop Repetitions</label>
                <select id="opt-vloop-count">
                  <option value="2" selected>2 Times (Double length)</option>
                  <option value="3">3 Times</option>
                  <option value="4">4 Times</option>
                </select>
              </div>
              <div class="media-option-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">
                <input type="checkbox" id="opt-vloop-boomerang" style="accent-color: var(--accent-primary);" />
                <label for="opt-vloop-boomerang" style="margin: 0; cursor: pointer;">Boomerang Effect (Play forward then reverse)</label>
              </div>
            </div>
          `;

        case 'video-framerate':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-vfps-target">Target Frame Rate</label>
                <select id="opt-vfps-target">
                  <option value="24" selected>24 FPS (Cinematic 24p aesthetic)</option>
                  <option value="30">30 FPS (Standard broadcast/web)</option>
                  <option value="15">15 FPS (Retro / low-bandwidth compact)</option>
                </select>
              </div>
            </div>
          `;

        case 'video-snapshot':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-vsnap-time">Snapshot Timestamp: <span id="val-vsnap-time" style="color: var(--accent-primary); font-weight: bold;">1.0s</span></label>
                <input type="range" id="opt-vsnap-time" min="0" max="60" step="0.5" value="1.0" style="width: 100%; accent-color: var(--accent-primary);" />
                <span class="media-option-hint">Lossless full-resolution PNG capture from video at exact second.</span>
              </div>
            </div>
          `;

        case 'video-aspect-ratio':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-vaspect-target">Target Aspect Ratio</label>
                <select id="opt-vaspect-target">
                  <option value="9:16" selected>9:16 Vertical (TikTok, YouTube Shorts, Reels)</option>
                  <option value="1:1">1:1 Square (Instagram Feed)</option>
                  <option value="16:9">16:9 Widescreen (YouTube Desktop)</option>
                  <option value="4:5">4:5 Social Portrait (Instagram Post)</option>
                </select>
                <span class="media-option-hint">Pads or fits video with clean letterbox/pillarbox bars.</span>
              </div>
            </div>
          `;

        case 'video-color-filter':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-vfilter-preset">Video Color Grading</label>
                <select id="opt-vfilter-preset">
                  <option value="vintage" selected>Vintage Warm Film</option>
                  <option value="bw">Moody Black & White</option>
                  <option value="sunset">Warm Sunset Glow</option>
                  <option value="cyberpunk">High-Contrast Vibrant</option>
                  <option value="sepia">Antique Sepia</option>
                </select>
              </div>
            </div>
          `;

        // ========== AUDIO TOOLS ==========
        case 'audio-compressor':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-acomp-bitrate">Target Audio Bitrate</label>
                <select id="opt-acomp-bitrate">
                  <option value="64">64 kbps (Speech, podcasts & audiobooks)</option>
                  <option value="96">96 kbps (Compact web audio)</option>
                  <option value="128" selected>128 kbps (Standard music quality)</option>
                  <option value="192">192 kbps (High fidelity)</option>
                </select>
              </div>
            </div>
          `;

        case 'audio-joiner':
          return `
            <div class="card" style="padding: 1.5rem; margin-top: 1rem;">
              <div class="media-option-group">
                <label for="opt-ajoin-files">Select 2 or more Audio Tracks to Merge</label>
                <input type="file" id="opt-ajoin-files" multiple accept="audio/*" style="display: block; margin-top: 0.5rem;" />
                <div id="ajoin-file-list" style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--text-muted);">Choose 2 or more audio files above to combine sequentially in the exact selected order.</div>
              </div>
              <div style="margin-top: 1.25rem;">
                <button type="button" class="btn btn-primary" id="btn-do-audio-join" style="width: 100%; justify-content: center;">Merge & Download Combined Audio Track</button>
              </div>
            </div>
          `;

        case 'audio-normalizer':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-anorm-gain">Volume Equalization Gain</label>
                <select id="opt-anorm-gain">
                  <option value="1.2">Subtle Leveling (+1.2x)</option>
                  <option value="1.5" selected>Standard Normalization (+1.5x)</option>
                  <option value="2.0">Aggressive Boost (+2.0x)</option>
                </select>
              </div>
            </div>
          `;

        case 'audio-reverse':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label>Reverse Audio Track</label>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0;">Reverses PCM audio waveform samples client-side for eerie backward playback effects.</p>
              </div>
            </div>
          `;

        case 'audio-pitch':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-apitch-shift">Semitone Shift: <span id="val-apitch-shift" style="color: var(--accent-primary); font-weight: bold;">+2 Semitones</span></label>
                <input type="range" id="opt-apitch-shift" min="-6" max="6" value="2" style="width: 100%; accent-color: var(--accent-primary);" />
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
                  <span>-6 Deep Demon</span>
                  <span>0 Original</span>
                  <span>+6 Nightcore</span>
                </div>
              </div>
            </div>
          `;

        case 'audio-bass-boost':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-aeq-bass">Bass Boost: <span id="val-aeq-bass" style="color: var(--accent-primary); font-weight: bold;">+8 dB</span></label>
                <input type="range" id="opt-aeq-bass" min="0" max="18" value="8" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>
              <div class="media-option-group">
                <label for="opt-aeq-mid">Midrange: <span id="val-aeq-mid" style="color: var(--accent-primary); font-weight: bold;">0 dB</span></label>
                <input type="range" id="opt-aeq-mid" min="-8" max="8" value="0" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>
              <div class="media-option-group">
                <label for="opt-aeq-treble">Treble: <span id="val-aeq-treble" style="color: var(--accent-primary); font-weight: bold;">+2 dB</span></label>
                <input type="range" id="opt-aeq-treble" min="-8" max="8" value="2" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>
            </div>
          `;

        case 'audio-bpm':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label>Audio BPM Detection</label>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0;">Analyzes waveform energy peaks client-side to calculate estimated BPM tempo.</p>
              </div>
              <div class="media-option-group">
                <label>Interactive Tap Tempo Pad</label>
                <button type="button" class="btn btn-secondary" id="btn-tap-tempo" style="width: 100%; padding: 0.8rem; font-weight: bold;">TAP HERE TO BEAT (<span id="val-tap-bpm">-- BPM</span>)</button>
              </div>
            </div>
          `;

        case 'audio-stereo-panner':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-a8d-speed">8D Binaural Rotation Speed</label>
                <select id="opt-a8d-speed">
                  <option value="0.15">Slow Orbit (~6.5s per revolution)</option>
                  <option value="0.25" selected>Standard 8D Immersion (~4s per revolution)</option>
                  <option value="0.40">Fast Orbit (~2.5s per revolution)</option>
                </select>
                <span class="media-option-hint">Wear headphones to experience rotating spatial sound immersion.</span>
              </div>
            </div>
          `;

        case 'audio-noise-generator':
          return `
            <div class="card" style="padding: 1.5rem; margin-top: 1rem;">
              <div class="media-options-grid">
                <div class="media-option-group">
                  <label for="opt-noise-type">Sound Color Frequency</label>
                  <select id="opt-noise-type">
                    <option value="white" selected>White Noise (Crisp, static rain sound)</option>
                    <option value="pink">Pink Noise (Balanced, waterfall sound)</option>
                    <option value="brown">Brown / Red Noise (Deep, thunderous rumble)</option>
                  </select>
                </div>
                <div class="media-option-group">
                  <label for="opt-noise-dur">Download Track Duration</label>
                  <select id="opt-noise-dur">
                    <option value="30" selected>30 Seconds</option>
                    <option value="60">1 Minute</option>
                    <option value="180">3 Minutes</option>
                  </select>
                </div>
              </div>
              <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button type="button" class="btn btn-primary" id="btn-play-noise">▶ Play Live Noise</button>
                <button type="button" class="btn btn-secondary" id="btn-stop-noise" style="display: none;">⏹ Stop Noise</button>
                <button type="button" class="btn btn-primary" id="btn-export-noise">Download Noise WAV</button>
              </div>
            </div>
          `;

        case 'audio-cutter-ringtone':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-ring-start">Start Timestamp: <span id="val-ring-start" style="color: var(--accent-primary); font-weight: bold;">0s</span></label>
                <input type="range" id="opt-ring-start" min="0" max="180" value="0" style="width: 100%; accent-color: var(--accent-primary);" />
              </div>
              <div class="media-option-group">
                <label for="opt-ring-dur">Ringtone Length</label>
                <select id="opt-ring-dur">
                  <option value="15">15 Seconds (Short chime)</option>
                  <option value="25">25 Seconds</option>
                  <option value="30" selected>30 Seconds (Standard phone ringtone)</option>
                </select>
                <span class="media-option-hint">Includes automatic 0.8s smooth fade-in and 1.5s fade-out.</span>
              </div>
            </div>
          `;

        // ========== PDF & DOCUMENT TOOLS ==========
        case 'pdf-merger':
          return `
            <div class="card" style="padding: 1.5rem; margin-top: 1rem;">
              <div class="media-option-group">
                <label for="opt-pdf-merge-files">Choose 2 or more PDF Documents to Combine</label>
                <input type="file" id="opt-pdf-merge-files" multiple accept=".pdf,application/pdf" style="display: block; margin-top: 0.5rem;" />
                <div id="pdf-merge-file-list" style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--text-muted);">Select PDF files above. They will be merged in the exact order selected.</div>
              </div>
              <div style="margin-top: 1.25rem;">
                <button type="button" class="btn btn-primary" id="btn-do-pdf-merge" style="width: 100%; justify-content: center;">Merge & Download Combined PDF</button>
              </div>
            </div>
          `;

        case 'pdf-splitter':
          return `
            <div class="card" style="padding: 1.5rem; margin-top: 1rem;">
              <div class="media-option-group">
                <label for="opt-pdf-split-file">Upload PDF to Split</label>
                <input type="file" id="opt-pdf-split-file" accept=".pdf,application/pdf" style="display: block; margin-top: 0.5rem;" />
              </div>
              <div class="media-option-group" style="margin-top: 1rem;">
                <label for="opt-pdf-split-ranges">Page Ranges to Extract</label>
                <input type="text" id="opt-pdf-split-ranges" value="1-3" placeholder="e.g. 1-3, 5, 8-10" />
                <span class="media-option-hint">Specify pages and ranges separated by commas.</span>
              </div>
              <div style="margin-top: 1.25rem;">
                <button type="button" class="btn btn-primary" id="btn-do-pdf-split" style="width: 100%; justify-content: center;">Extract Pages & Download PDF</button>
              </div>
            </div>
          `;

        case 'pdf-page-rotator':
          return `
            <div class="card" style="padding: 1.5rem; margin-top: 1rem;">
              <div class="media-option-group">
                <label for="opt-pdf-rot-file">Upload PDF Document</label>
                <input type="file" id="opt-pdf-rot-file" accept=".pdf,application/pdf" style="display: block; margin-top: 0.5rem;" />
              </div>
              <div class="media-option-group" style="margin-top: 1rem;">
                <label for="opt-pdf-rot-deg">Rotation</label>
                <select id="opt-pdf-rot-deg">
                  <option value="90" selected>90° Clockwise</option>
                  <option value="180">180° Invert</option>
                  <option value="270">270° Clockwise</option>
                </select>
              </div>
              <div style="margin-top: 1.25rem;">
                <button type="button" class="btn btn-primary" id="btn-do-pdf-rotate" style="width: 100%; justify-content: center;">Rotate Pages & Download PDF</button>
              </div>
            </div>
          `;

        case 'pdf-watermark':
          return `
            <div class="card" style="padding: 1.5rem; margin-top: 1rem;">
              <div class="media-option-group">
                <label for="opt-pdf-wm-file">Upload PDF Document</label>
                <input type="file" id="opt-pdf-wm-file" accept=".pdf,application/pdf" style="display: block; margin-top: 0.5rem;" />
              </div>
              <div class="media-options-grid" style="margin-top: 1rem;">
                <div class="media-option-group">
                  <label for="opt-pdf-wm-text">Watermark Stamp Text</label>
                  <input type="text" id="opt-pdf-wm-text" value="CONFIDENTIAL" />
                </div>
                <div class="media-option-group">
                  <label for="opt-pdf-wm-opacity">Watermark Transparency</label>
                  <select id="opt-pdf-wm-opacity">
                    <option value="0.2">Light (20%)</option>
                    <option value="0.35" selected>Standard (35%)</option>
                    <option value="0.6">Prominent (60%)</option>
                  </select>
                </div>
              </div>
              <div style="margin-top: 1.25rem;">
                <button type="button" class="btn btn-primary" id="btn-do-pdf-wm" style="width: 100%; justify-content: center;">Stamp Watermark & Download PDF</button>
              </div>
            </div>
          `;

        case 'pdf-page-numberer':
          return `
            <div class="card" style="padding: 1.5rem; margin-top: 1rem;">
              <div class="media-option-group">
                <label for="opt-pdf-num-file">Upload PDF Document</label>
                <input type="file" id="opt-pdf-num-file" accept=".pdf,application/pdf" style="display: block; margin-top: 0.5rem;" />
              </div>
              <div class="media-options-grid" style="margin-top: 1rem;">
                <div class="media-option-group">
                  <label for="opt-pdf-num-fmt">Number Format</label>
                  <select id="opt-pdf-num-fmt">
                    <option value="Page {n} of {total}" selected>Page 1 of N</option>
                    <option value="{n} / {total}">1 / N</option>
                    <option value="{n}">1, 2, 3...</option>
                  </select>
                </div>
                <div class="media-option-group">
                  <label for="opt-pdf-num-pos">Position</label>
                  <select id="opt-pdf-num-pos">
                    <option value="bottom-center" selected>Bottom Center</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="top-right">Top Right</option>
                  </select>
                </div>
              </div>
              <div style="margin-top: 1.25rem;">
                <button type="button" class="btn btn-primary" id="btn-do-pdf-num" style="width: 100%; justify-content: center;">Add Page Numbers & Download PDF</button>
              </div>
            </div>
          `;

        case 'pdf-compressor':
          return `
            <div class="card" style="padding: 1.5rem; margin-top: 1rem;">
              <div class="media-option-group">
                <label for="opt-pdf-comp-file">Upload PDF to Compress</label>
                <input type="file" id="opt-pdf-comp-file" accept=".pdf,application/pdf" style="display: block; margin-top: 0.5rem;" />
              </div>
              <div class="media-option-group" style="margin-top: 1rem;">
                <label for="opt-pdf-comp-level">Compression Quality</label>
                <select id="opt-pdf-comp-level">
                  <option value="75" selected>Standard (75% quality - recommended)</option>
                  <option value="50">Strong Compression (50% quality - smallest)</option>
                  <option value="90">Mild Compression (90% quality - crisp)</option>
                </select>
              </div>
              <div style="margin-top: 1.25rem;">
                <button type="button" class="btn btn-primary" id="btn-do-pdf-comp" style="width: 100%; justify-content: center;">Optimize & Download PDF</button>
              </div>
            </div>
          `;

        case 'text-to-pdf':
          return `
            <div class="card" style="padding: 1.5rem; margin-top: 1rem;">
              <div class="media-option-group">
                <label for="opt-t2p-title">Document Title</label>
                <input type="text" id="opt-t2p-title" value="My Project Notes" placeholder="Document Title..." />
              </div>
              <div class="media-option-group" style="margin-top: 1rem;">
                <label for="opt-t2p-text">Document Content (Text or Markdown)</label>
                <textarea id="opt-t2p-text" rows="8" placeholder="Type or paste your document notes here..." style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-surface); color: var(--text-primary); font-family: inherit; line-height: 1.5;"># Project Meeting Notes

## Overview
This document was generated 100% client-side inside the browser using Multi Tube Views PDF Tools.

### Key Deliverables:
- Zero data leaves your computer.
- Fast, instant local generation.
- Full offline capability.</textarea>
              </div>
              <div style="margin-top: 1.25rem;">
                <button type="button" class="btn btn-primary" id="btn-do-text-to-pdf" style="width: 100%; justify-content: center;">Generate & Download PDF</button>
              </div>
            </div>
          `;

        case 'pdf-protect':
          return `
            <div class="card" style="padding: 1.5rem; margin-top: 1rem;">
              <div class="media-option-group">
                <label for="opt-pdf-sec-file">Upload PDF Document to Inspect</label>
                <input type="file" id="opt-pdf-sec-file" accept=".pdf,application/pdf" style="display: block; margin-top: 0.5rem;" />
              </div>
              <div id="pdf-security-report" style="margin-top: 1.25rem; display: none; padding: 1rem; background: var(--bg-subtle); border-radius: var(--radius-md); font-size: 0.9rem; line-height: 1.6;"></div>
            </div>
          `;

        case 'pdf-page-delete':
          return `
            <div class="card" style="padding: 1.5rem; margin-top: 1rem;">
              <div class="media-option-group">
                <label for="opt-pdf-del-file">Upload PDF Document</label>
                <input type="file" id="opt-pdf-del-file" accept=".pdf,application/pdf" style="display: block; margin-top: 0.5rem;" />
              </div>
              <div class="media-option-group" style="margin-top: 1rem;">
                <label for="opt-pdf-del-pages">Page Numbers to Remove (1-based index)</label>
                <input type="text" id="opt-pdf-del-pages" value="1" placeholder="e.g. 1, 4, 7" />
                <span class="media-option-hint">Removes unwanted blank sheets or cover pages from the document.</span>
              </div>
              <div style="margin-top: 1.25rem;">
                <button type="button" class="btn btn-primary" id="btn-do-pdf-delete" style="width: 100%; justify-content: center;">Remove Pages & Download Clean PDF</button>
              </div>
            </div>
          `;

        case 'markdown-to-pdf':
          return `
            <div class="card" style="padding: 1.5rem; margin-top: 1rem;">
              <div class="media-option-group">
                <label for="opt-md-content">Markdown Source Code</label>
                <textarea id="opt-md-content" rows="10" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-surface); color: var(--text-primary); font-family: monospace; line-height: 1.5;"># Comprehensive Report

## Executive Summary
This document demonstrates client-side Markdown rendering to high-resolution PDF.

### Features
- Complete data privacy: no servers, zero tracking.
- Formatted headings, bullet points, and paragraphs.
- Instant client-side download.

*Generated via Multi Tube Views (MTV).*</textarea>
              </div>
              <div style="margin-top: 1.25rem;">
                <button type="button" class="btn btn-primary" id="btn-do-md-to-pdf" style="width: 100%; justify-content: center;">Render & Download PDF Document</button>
              </div>
            </div>
          `;

        // ========== 13 NEW CONVERTER TOOLS PANELS ==========

        case 'heic-to-jpg':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-heic-jpg-quality">JPEG Output Quality: <span id="val-heic-jpg-quality" class="slider-value-badge">92%</span></label>
                <input type="range" id="opt-heic-jpg-quality" min="40" max="100" value="92" class="media-range" />
                <span class="media-option-hint">High quality preserves crisp detail while optimizing file size.</span>
              </div>
              <div class="media-option-group">
                <label for="opt-heic-jpg-bg">Background Fill (for transparent areas)</label>
                <select id="opt-heic-jpg-bg" class="media-select">
                  <option value="#FFFFFF" selected>White (Standard)</option>
                  <option value="#000000">Black</option>
                  <option value="#F3F4F6">Light Gray</option>
                </select>
                <span class="media-option-hint">JPEGs do not support transparency; transparent pixels fill with this color.</span>
              </div>
            </div>
          `;

        case 'heic-to-png':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-heic-png-scale">Resolution Scale</label>
                <select id="opt-heic-png-scale" class="media-select">
                  <option value="1.0" selected>100% (Original Full Resolution)</option>
                  <option value="0.75">75% Scaled</option>
                  <option value="0.5">50% Half Resolution</option>
                </select>
                <span class="media-option-hint">Converts to lossless 24-bit PNG with maximum photographic fidelity.</span>
              </div>
            </div>
          `;

        case 'webp-to-jpg':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-webp-jpg-quality">JPEG Quality: <span id="val-webp-jpg-quality" class="slider-value-badge">90%</span></label>
                <input type="range" id="opt-webp-jpg-quality" min="40" max="100" value="90" class="media-range" />
                <span class="media-option-hint">Adjust JPG compression balance between clarity and file size.</span>
              </div>
              <div class="media-option-group">
                <label for="opt-webp-jpg-bg">Background Fill Color</label>
                <select id="opt-webp-jpg-bg" class="media-select">
                  <option value="#FFFFFF" selected>White (Standard)</option>
                  <option value="#000000">Black</option>
                  <option value="#F3F4F6">Light Gray</option>
                </select>
                <span class="media-option-hint">Fills transparent regions of the WebP image.</span>
              </div>
            </div>
          `;

        case 'webp-to-png':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label>Alpha Transparency Preservation</label>
                <p class="media-option-hint" style="margin-top: 0.5rem; color: var(--text-primary); font-weight: 500;">
                  ✓ Full alpha transparency channel will be preserved with pixel-perfect accuracy.
                </p>
              </div>
            </div>
          `;

        case 'avif-to-jpg':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-avif-jpg-quality">Output JPEG Quality: <span id="val-avif-jpg-quality" class="slider-value-badge">90%</span></label>
                <input type="range" id="opt-avif-jpg-quality" min="40" max="100" value="90" class="media-range" />
                <span class="media-option-hint">Controls the output compression for the standard JPG file.</span>
              </div>
              <div class="media-option-group">
                <label for="opt-avif-jpg-bg">Background Fill</label>
                <select id="opt-avif-jpg-bg" class="media-select">
                  <option value="#FFFFFF" selected>White (Default)</option>
                  <option value="#000000">Black</option>
                  <option value="#E5E7EB">Gray</option>
                </select>
                <span class="media-option-hint">Used for transparent regions in the AVIF file.</span>
              </div>
            </div>
          `;

        case 'avif-to-png':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label>Lossless PNG Output</label>
                <p class="media-option-hint" style="margin-top: 0.5rem; color: var(--text-primary); font-weight: 500;">
                  ✓ Preserves full color spectrum and transparent background.
                </p>
              </div>
            </div>
          `;

        case 'svg-to-png':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-svg-scale">Resolution Multiplier (Sharpness)</label>
                <select id="opt-svg-scale" class="media-select">
                  <option value="1">1x Standard Screen Resolution</option>
                  <option value="2" selected>2x High-DPI (Retina / 2K)</option>
                  <option value="4">4x Ultra HD 4K (Design & Print)</option>
                  <option value="8">8x Maximum 8K (Large Print / Vector Fidelity)</option>
                </select>
                <span class="media-option-hint">Scales the vector artwork before rasterizing to prevent pixelation.</span>
              </div>
              <div class="media-option-group">
                <label for="opt-svg-bg">Background Canvas</label>
                <select id="opt-svg-bg" class="media-select">
                  <option value="transparent" selected>Transparent (Default)</option>
                  <option value="#FFFFFF">Solid White</option>
                  <option value="#000000">Solid Black</option>
                </select>
                <span class="media-option-hint">Choose transparent or a solid background fill.</span>
              </div>
            </div>
          `;

        case 'pdf-password-protect':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-pdf-user-pass">User Password (Required to open & view PDF)</label>
                <div style="position: relative;">
                  <input type="password" id="opt-pdf-user-pass" class="media-input" placeholder="Enter viewing password..." style="width: 100%; padding-right: 2.5rem;" />
                  <button type="button" class="btn-toggle-pass" data-target="opt-pdf-user-pass" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 1rem;">👁️</button>
                </div>
                <span class="media-option-hint">Recipients must enter this password to view the document.</span>
              </div>
              <div class="media-option-group">
                <label for="opt-pdf-owner-pass">Owner / Master Password (Optional)</label>
                <div style="position: relative;">
                  <input type="password" id="opt-pdf-owner-pass" class="media-input" placeholder="Enter owner password (optional)..." style="width: 100%; padding-right: 2.5rem;" />
                  <button type="button" class="btn-toggle-pass" data-target="opt-pdf-owner-pass" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 1rem;">👁️</button>
                </div>
                <span class="media-option-hint">Required to change permissions or security settings.</span>
              </div>
              <div class="media-option-group">
                <label for="opt-pdf-enc-algo">Encryption Algorithm</label>
                <select id="opt-pdf-enc-algo" class="media-select">
                  <option value="AES-256" selected>AES-256 (Highest Security - Recommended)</option>
                  <option value="RC4-128">RC4-128 (Legacy Compatibility)</option>
                </select>
              </div>
              <div class="media-option-group">
                <label>Document Permissions Restrictions</label>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.35rem;">
                  <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: normal; font-size: 0.9rem; cursor: pointer;">
                    <input type="checkbox" id="opt-pdf-perm-print" checked /> Allow Printing
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: normal; font-size: 0.9rem; cursor: pointer;">
                    <input type="checkbox" id="opt-pdf-perm-copy" checked /> Allow Copying Text and Content
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: normal; font-size: 0.9rem; cursor: pointer;">
                    <input type="checkbox" id="opt-pdf-perm-mod" /> Allow Modifying Document
                  </label>
                </div>
              </div>
            </div>
          `;

        case 'pdf-password-remover':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-pdf-unlock-pass">Enter Document Password</label>
                <div style="position: relative;">
                  <input type="password" id="opt-pdf-unlock-pass" class="media-input" placeholder="Enter the current password..." style="width: 100%; padding-right: 2.5rem;" />
                  <button type="button" class="btn-toggle-pass" data-target="opt-pdf-unlock-pass" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 1rem;">👁️</button>
                </div>
                <span class="media-option-hint">Enter the password used to open this PDF. The password lock will be permanently removed.</span>
              </div>
            </div>
          `;

        case 'pdf-image-extractor':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label>Extraction Engine</label>
                <p class="media-option-hint" style="margin-top: 0.5rem; color: var(--text-primary); font-weight: 500;">
                  ✓ Scans all embedded photos, diagrams, and figures across every page and packages them into a single ZIP archive.
                </p>
              </div>
            </div>
          `;

        case 'pdf-page-reorganizer':
          return `
            <div class="media-options-grid" style="grid-template-columns: 1fr;">
              <div class="media-option-group">
                <label>Reorder PDF Pages</label>
                <span class="media-option-hint">Enter the new page sequence as comma-separated page numbers, or click reverse to invert.</span>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                  <input type="text" id="opt-reorg-sequence" class="media-input" placeholder="e.g. 3, 1, 2, 4..." style="flex: 1; min-width: 200px;" />
                  <button type="button" class="btn btn-secondary" id="btn-reorg-reverse">Reverse Order</button>
                  <button type="button" class="btn btn-secondary" id="btn-reorg-reset">Reset Order</button>
                </div>
              </div>
            </div>
          `;

        case 'pdf-to-text':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input type="checkbox" id="opt-p2t-dividers" checked /> Include Page Markers (--- Page X of Y ---)
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin-top: 0.5rem;">
                  <input type="checkbox" id="opt-p2t-normalize" checked /> Clean and normalize whitespace
                </label>
              </div>
            </div>
          `;

        case 'images-to-pdf':
          return `
            <div class="media-options-grid">
              <div class="media-option-group">
                <label for="opt-img2pdf-pagesize">Page Dimensions</label>
                <select id="opt-img2pdf-pagesize" class="media-select">
                  <option value="fit" selected>Fit to Image Size (Full Bleed)</option>
                  <option value="a4">A4 (Standard Document)</option>
                  <option value="letter">US Letter (8.5 x 11 in)</option>
                </select>
                <span class="media-option-hint">Match image aspect ratio or use standard printable paper sizes.</span>
              </div>
              <div class="media-option-group">
                <label for="opt-img2pdf-orientation">Page Orientation</label>
                <select id="opt-img2pdf-orientation" class="media-select">
                  <option value="auto" selected>Automatic (Match Image)</option>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
              <div class="media-option-group">
                <label for="opt-img2pdf-margin">Page Margins</label>
                <select id="opt-img2pdf-margin" class="media-select">
                  <option value="0" selected>0px (Full Bleed)</option>
                  <option value="15">15px Margin</option>
                  <option value="30">30px Standard Margin</option>
                </select>
              </div>
              <div class="media-option-group">
                <label for="opt-img2pdf-files">Add Multiple Images (Optional)</label>
                <input type="file" id="opt-img2pdf-files" multiple accept="image/*" class="media-input" style="padding: 0.5rem;" />
                <span class="media-option-hint">Select multiple images to bundle them into a single multi-page PDF.</span>
              </div>
            </div>
          `;

        default:
          return ``;
      }
    },

    bindPanelEvents(toolId, panel, engine) {
      // Sliders label updates
      panel.querySelectorAll('input[type="range"]').forEach(range => {
        const valSpan = panel.querySelector(`#val-${range.id.replace('opt-', '')}`);
        if (valSpan) {
          range.addEventListener('input', () => {
            const suffix = range.id.includes('quality') || range.id.includes('opacity') || range.id.includes('bright') || range.id.includes('contrast') || range.id.includes('sat') || range.id.includes('sepia') || range.id.includes('gray') ? '%' :
                           range.id.includes('radius') || range.id.includes('size') || range.id.includes('width') ? 'px' :
                           range.id.includes('time') ? 's' :
                           range.id.includes('shift') ? (range.value > 0 ? `+${range.value} Semitones` : `${range.value} Semitones`) : '';
            valSpan.textContent = `${range.value}${suffix}`;
          });
        }
      });

      // Filter presets buttons
      if (toolId === 'image-filters') {
        const b = panel.querySelector('#opt-filter-bright');
        const c = panel.querySelector('#opt-filter-contrast');
        const s = panel.querySelector('#opt-filter-sat');
        const sep = panel.querySelector('#opt-filter-sepia');
        const g = panel.querySelector('#opt-filter-gray');
        const h = panel.querySelector('#opt-filter-hue');

        const updateAll = () => {
          [b, c, s, sep, g, h].forEach(inp => {
            if (inp) inp.dispatchEvent(new Event('input'));
          });
        };

        panel.querySelector('#btn-filter-preset-reset')?.addEventListener('click', () => {
          if (b) b.value = 100; if (c) c.value = 100; if (s) s.value = 100;
          if (sep) sep.value = 0; if (g) g.value = 0; if (h) h.value = 0;
          updateAll();
        });
        panel.querySelector('#btn-filter-preset-vintage')?.addEventListener('click', () => {
          if (b) b.value = 105; if (c) c.value = 90; if (s) s.value = 85;
          if (sep) sep.value = 65; if (g) g.value = 0; if (h) h.value = 0;
          updateAll();
        });
        panel.querySelector('#btn-filter-preset-bw')?.addEventListener('click', () => {
          if (b) b.value = 110; if (c) c.value = 140; if (s) s.value = 0;
          if (sep) sep.value = 0; if (g) g.value = 100; if (h) h.value = 0;
          updateAll();
        });
        panel.querySelector('#btn-filter-preset-warm')?.addEventListener('click', () => {
          if (b) b.value = 110; if (c) c.value = 110; if (s) s.value = 130;
          if (sep) sep.value = 30; if (g) g.value = 0; if (h) h.value = 15;
          updateAll();
        });
        panel.querySelector('#btn-filter-preset-vibrant')?.addEventListener('click', () => {
          if (b) b.value = 105; if (c) c.value = 125; if (s) s.value = 180;
          if (sep) sep.value = 0; if (g) g.value = 0; if (h) h.value = 0;
          updateAll();
        });
      }

      // Border color sync
      if (toolId === 'image-border') {
        const colorPicker = panel.querySelector('#opt-border-color');
        const hexInput = panel.querySelector('#opt-border-hex');
        if (colorPicker && hexInput) {
          colorPicker.addEventListener('input', () => hexInput.value = colorPicker.value);
          hexInput.addEventListener('input', () => colorPicker.value = hexInput.value);
        }
      }

      // Base64 copy button
      if (toolId === 'base64-image') {
        const copyBtn = panel.querySelector('#btn-copy-b64');
        const txt = panel.querySelector('#opt-b64-output');
        copyBtn?.addEventListener('click', () => {
          if (txt && txt.value) {
            navigator.clipboard.writeText(txt.value).then(() => {
              engine.showToast('✓ Base64 string copied to clipboard!');
            });
          }
        });
      }

      // Audio Joiner Multi-File Handlers
      if (toolId === 'audio-joiner') {
        const fileInput = panel.querySelector('#opt-ajoin-files');
        const listDiv = panel.querySelector('#ajoin-file-list');
        fileInput?.addEventListener('change', () => {
          if (fileInput.files && fileInput.files.length > 0) {
            const names = Array.from(fileInput.files).map((f, i) => `${i + 1}. ${f.name} (${(f.size / (1024 * 1024)).toFixed(2)} MB)`).join('<br/>');
            if (listDiv) listDiv.innerHTML = `<strong>Selected ${fileInput.files.length} tracks:</strong><br/>${names}`;
          }
        });

        panel.querySelector('#btn-do-audio-join')?.addEventListener('click', async () => {
          const input = panel.querySelector('#opt-ajoin-files');
          if (!input || !input.files || input.files.length < 2) {
            engine.showToast('Please select at least 2 audio tracks to merge', 'warning');
            return;
          }
          try {
            engine.setProcessingUi(true, 'Merging audio tracks client-side...');
            engine.updateProgress(30, `Combining ${input.files.length} audio files...`);
            const blob = await window.MTVMediaHandlers.joinAudioFiles(Array.from(input.files));
            engine.renderOutputResult(blob, 'wav', 'audio/wav', `Joined Audio (${input.files.length} Tracks)`);
            engine.showToast('✓ Audio tracks joined successfully!');
          } catch (e) {
            engine.showToast(`Merge failed: ${e.message}`, 'error');
          } finally {
            engine.setProcessingUi(false);
          }
        });
      }

      // Tap tempo button
      if (toolId === 'audio-bpm') {
        let tapTimes = [];
        const tapBtn = panel.querySelector('#btn-tap-tempo');
        const bpmVal = panel.querySelector('#val-tap-bpm');
        tapBtn?.addEventListener('click', () => {
          const now = performance.now();
          tapTimes.push(now);
          if (tapTimes.length > 8) tapTimes.shift();
          if (tapTimes.length >= 2) {
            const diffs = [];
            for (let i = 1; i < tapTimes.length; i++) {
              diffs.push(tapTimes[i] - tapTimes[i - 1]);
            }
            const avgMs = diffs.reduce((a, b) => a + b, 0) / diffs.length;
            const bpm = Math.round(60000 / avgMs);
            if (bpmVal) bpmVal.textContent = `${bpm} BPM`;
          }
        });
      }

      // Ambient Noise Generator Live Play
      if (toolId === 'audio-noise-generator') {
        let liveAudioCtx = null;
        let noiseSource = null;
        const playBtn = panel.querySelector('#btn-play-noise');
        const stopBtn = panel.querySelector('#btn-stop-noise');
        const exportBtn = panel.querySelector('#btn-export-noise');

        playBtn?.addEventListener('click', () => {
          const noiseType = panel.querySelector('#opt-noise-type')?.value || 'white';
          try {
            if (liveAudioCtx) liveAudioCtx.close();
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            liveAudioCtx = new AudioCtx();
            const bufferSize = liveAudioCtx.sampleRate * 2;
            const noiseBuffer = liveAudioCtx.createBuffer(1, bufferSize, liveAudioCtx.sampleRate);
            const output = noiseBuffer.getChannelData(0);

            if (noiseType === 'white') {
              for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
            } else if (noiseType === 'pink') {
              let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
              for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
                b6 = white * 0.115926;
              }
            } else {
              let lastOut = 0.0;
              for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;
              }
            }

            noiseSource = liveAudioCtx.createBufferSource();
            noiseSource.buffer = noiseBuffer;
            noiseSource.loop = true;
            noiseSource.connect(liveAudioCtx.destination);
            noiseSource.start();

            playBtn.style.display = 'none';
            if (stopBtn) stopBtn.style.display = 'inline-flex';
            engine.showToast(`▶ Playing continuous ${noiseType} noise`);
          } catch (e) {
            engine.showToast(`Audio playback error: ${e.message}`, 'error');
          }
        });

        stopBtn?.addEventListener('click', () => {
          if (liveAudioCtx) {
            liveAudioCtx.close();
            liveAudioCtx = null;
          }
          if (stopBtn) stopBtn.style.display = 'none';
          if (playBtn) playBtn.style.display = 'inline-flex';
          engine.showToast('⏹ Noise playback stopped');
        });

        exportBtn?.addEventListener('click', () => {
          const type = panel.querySelector('#opt-noise-type')?.value || 'white';
          const dur = parseInt(panel.querySelector('#opt-noise-dur')?.value || '30', 10);
          engine.updateProgress(30, `Synthesizing ${dur}s of pure ${type} noise...`);
          try {
            const blob = window.MTVMediaHandlers.generateAmbientNoise(type, dur);
            engine.renderOutputResult(blob, 'wav', 'audio/wav', `Ambient ${type.toUpperCase()} Noise (${dur}s)`);
            engine.showToast('✓ Generated noise track successfully!');
          } catch (err) {
            engine.showToast(`Error: ${err.message}`, 'error');
          }
        });
      }

      // Standalone PDF tool actions
      if (toolId === 'text-to-pdf') {
        panel.querySelector('#btn-do-text-to-pdf')?.addEventListener('click', () => {
          const title = panel.querySelector('#opt-t2p-title')?.value || 'Document';
          const text = panel.querySelector('#opt-t2p-text')?.value || '';
          try {
            engine.updateProgress(40, 'Rendering text to PDF pages...');
            const blob = window.MTVMediaHandlers.generateTextToPdf(text, title);
            engine.renderOutputResult(blob, 'pdf', 'application/pdf', `Generated PDF Document (${title})`);
            engine.showToast('✓ PDF generated successfully!');
          } catch (e) {
            engine.showToast(`PDF Error: ${e.message}`, 'error');
          }
        });
      }

      if (toolId === 'markdown-to-pdf') {
        panel.querySelector('#btn-do-md-to-pdf')?.addEventListener('click', () => {
          const md = panel.querySelector('#opt-md-content')?.value || '';
          try {
            engine.updateProgress(40, 'Parsing Markdown syntax & compiling PDF...');
            const blob = window.MTVMediaHandlers.generateMarkdownToPdf(md);
            engine.renderOutputResult(blob, 'pdf', 'application/pdf', 'Markdown Compiled PDF Document');
            engine.showToast('✓ Markdown PDF exported successfully!');
          } catch (e) {
            engine.showToast(`PDF Error: ${e.message}`, 'error');
          }
        });
      }

      if (toolId === 'pdf-merger') {
        panel.querySelector('#btn-do-pdf-merge')?.addEventListener('click', async () => {
          const input = panel.querySelector('#opt-pdf-merge-files');
          if (!input || !input.files || input.files.length < 2) {
            engine.showToast('Please select at least 2 PDF files to merge', 'warning');
            return;
          }
          try {
            engine.setProcessingUi(true, 'Merging PDF documents client-side...');
            engine.updateProgress(30, `Combining ${input.files.length} PDF documents...`);
            const blob = await window.MTVMediaHandlers.mergePdfFiles(input.files);
            engine.renderOutputResult(blob, 'pdf', 'application/pdf', `Combined PDF (${input.files.length} Documents)`);
            engine.showToast('✓ All PDF files merged successfully!');
          } catch (e) {
            engine.showToast(`Merge failed: ${e.message}`, 'error');
          } finally {
            engine.setProcessingUi(false);
          }
        });
      }

      if (toolId === 'pdf-splitter') {
        panel.querySelector('#btn-do-pdf-split')?.addEventListener('click', async () => {
          const fileInput = panel.querySelector('#opt-pdf-split-file');
          const file = fileInput?.files?.[0];
          if (!file) {
            engine.showToast('Please select a PDF document first', 'warning');
            return;
          }
          const ranges = panel.querySelector('#opt-pdf-split-ranges')?.value || '1';
          try {
            engine.setProcessingUi(true, 'Extracting selected PDF pages...');
            const blob = await window.MTVMediaHandlers.splitPdfPages(file, ranges);
            engine.renderOutputResult(blob, 'pdf', 'application/pdf', `Extracted Pages (${ranges})`);
            engine.showToast('✓ Pages extracted successfully!');
          } catch (e) {
            engine.showToast(`Split error: ${e.message}`, 'error');
          } finally {
            engine.setProcessingUi(false);
          }
        });
      }

      if (toolId === 'pdf-page-rotator') {
        panel.querySelector('#btn-do-pdf-rotate')?.addEventListener('click', async () => {
          const fileInput = panel.querySelector('#opt-pdf-rot-file');
          const file = fileInput?.files?.[0];
          if (!file) {
            engine.showToast('Please select a PDF document first', 'warning');
            return;
          }
          const deg = parseInt(panel.querySelector('#opt-pdf-rot-deg')?.value || '90', 10);
          try {
            engine.setProcessingUi(true, 'Rotating PDF pages...');
            const blob = await window.MTVMediaHandlers.rotatePdfPages(file, deg);
            engine.renderOutputResult(blob, 'pdf', 'application/pdf', `Rotated PDF (${deg}°)`);
            engine.showToast('✓ PDF pages rotated successfully!');
          } catch (e) {
            engine.showToast(`Rotate error: ${e.message}`, 'error');
          } finally {
            engine.setProcessingUi(false);
          }
        });
      }

      if (toolId === 'pdf-watermark') {
        panel.querySelector('#btn-do-pdf-wm')?.addEventListener('click', async () => {
          const fileInput = panel.querySelector('#opt-pdf-wm-file');
          const file = fileInput?.files?.[0];
          if (!file) {
            engine.showToast('Please select a PDF document first', 'warning');
            return;
          }
          const text = panel.querySelector('#opt-pdf-wm-text')?.value || 'CONFIDENTIAL';
          const opacity = parseFloat(panel.querySelector('#opt-pdf-wm-opacity')?.value || '0.35');
          try {
            engine.setProcessingUi(true, 'Stamping text watermark on PDF pages...');
            const blob = await window.MTVMediaHandlers.addPdfWatermark(file, text, opacity);
            engine.renderOutputResult(blob, 'pdf', 'application/pdf', `Watermarked PDF ("${text}")`);
            engine.showToast('✓ Watermark added to PDF successfully!');
          } catch (e) {
            engine.showToast(`Watermark error: ${e.message}`, 'error');
          } finally {
            engine.setProcessingUi(false);
          }
        });
      }

      if (toolId === 'pdf-page-numberer') {
        panel.querySelector('#btn-do-pdf-num')?.addEventListener('click', async () => {
          const fileInput = panel.querySelector('#opt-pdf-num-file');
          const file = fileInput?.files?.[0];
          if (!file) {
            engine.showToast('Please select a PDF document first', 'warning');
            return;
          }
          const fmt = panel.querySelector('#opt-pdf-num-fmt')?.value || 'Page {n} of {total}';
          const pos = panel.querySelector('#opt-pdf-num-pos')?.value || 'bottom-center';
          try {
            engine.setProcessingUi(true, 'Numbering PDF pages...');
            const blob = await window.MTVMediaHandlers.numberPdfPages(file, fmt, pos);
            engine.renderOutputResult(blob, 'pdf', 'application/pdf', 'Numbered PDF Document');
            engine.showToast('✓ Page numbers stamped successfully!');
          } catch (e) {
            engine.showToast(`Numbering error: ${e.message}`, 'error');
          } finally {
            engine.setProcessingUi(false);
          }
        });
      }

      if (toolId === 'pdf-compressor') {
        panel.querySelector('#btn-do-pdf-comp')?.addEventListener('click', async () => {
          const fileInput = panel.querySelector('#opt-pdf-comp-file');
          const file = fileInput?.files?.[0];
          if (!file) {
            engine.showToast('Please select a PDF document first', 'warning');
            return;
          }
          const quality = parseInt(panel.querySelector('#opt-pdf-comp-level')?.value || '75', 10);
          try {
            engine.setProcessingUi(true, 'Compressing & re-rasterizing PDF pages...');
            const blob = await window.MTVMediaHandlers.compressPdf(file, quality);
            const origKB = (file.size / 1024).toFixed(1);
            const newKB = (blob.size / 1024).toFixed(1);
            engine.renderOutputResult(blob, 'pdf', 'application/pdf', `Compressed PDF • ${origKB} KB → ${newKB} KB`);
            engine.showToast('✓ PDF compressed successfully!');
          } catch (e) {
            engine.showToast(`Compression error: ${e.message}`, 'error');
          } finally {
            engine.setProcessingUi(false);
          }
        });
      }

      if (toolId === 'pdf-protect') {
        const secInput = panel.querySelector('#opt-pdf-sec-file');
        secInput?.addEventListener('change', async () => {
          const file = secInput.files?.[0];
          if (!file) return;
          const reportBox = panel.querySelector('#pdf-security-report');
          if (reportBox) {
            reportBox.style.display = 'block';
            reportBox.innerHTML = `<em>Analyzing ${file.name} metadata and security structure...</em>`;
          }
          try {
            const report = await window.MTVMediaHandlers.inspectPdfSecurity(file);
            if (reportBox) {
              reportBox.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 0.5rem; color: var(--accent-primary);">PDF Security & Metadata Audit</div>
                <div><strong>File Name:</strong> ${report.fileName}</div>
                <div><strong>File Size:</strong> ${(report.fileSizeBytes / 1024).toFixed(1)} KB</div>
                <div><strong>Page Count:</strong> ${report.pageCount}</div>
                <div><strong>Title:</strong> ${report.metadata?.title || 'None / Cleared'}</div>
                <div><strong>Author:</strong> ${report.metadata?.author || 'None / Anonymous'}</div>
                <div><strong>Creator/Producer:</strong> ${report.metadata?.producer || 'Unknown'}</div>
                <div><strong>Encrypted:</strong> ${report.isEncrypted ? '🔒 Yes' : '🔓 No (Unprotected)'}</div>
                <div><strong>Client Privacy:</strong> 100% Safe (Inspected locally in your browser memory)</div>
              `;
            }
            engine.showToast('✓ PDF security inspected');
          } catch (e) {
            if (reportBox) reportBox.innerHTML = `<span style="color: #ef4444;">Audit error: ${e.message}</span>`;
          }
        });
      }

      if (toolId === 'pdf-page-delete') {
        panel.querySelector('#btn-do-pdf-delete')?.addEventListener('click', async () => {
          const fileInput = panel.querySelector('#opt-pdf-del-file');
          const file = fileInput?.files?.[0];
          if (!file) {
            engine.showToast('Please select a PDF document first', 'warning');
            return;
          }
          const raw = panel.querySelector('#opt-pdf-del-pages')?.value || '1';
          const toDelete = raw.split(',').map(s => parseInt(s.trim(), 10) - 1).filter(n => !isNaN(n));
          try {
            engine.setProcessingUi(true, 'Removing specified PDF pages...');
            const blob = await window.MTVMediaHandlers.deletePdfPages(file, toDelete);
            engine.renderOutputResult(blob, 'pdf', 'application/pdf', `Cleaned PDF (Removed pages: ${raw})`);
            engine.showToast('✓ Pages deleted successfully!');
          } catch (e) {
            engine.showToast(`Delete error: ${e.message}`, 'error');
          } finally {
            engine.setProcessingUi(false);
          }
        });
      }

      // Password visibility togglers
      panel.querySelectorAll('.btn-toggle-pass').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-target');
          const input = panel.querySelector(`#${targetId}`);
          if (input) {
            if (input.type === 'password') {
              input.type = 'text';
              btn.textContent = '🙈';
            } else {
              input.type = 'password';
              btn.textContent = '👁️';
            }
          }
        });
      });

      // PDF Page Reorganizer quick buttons
      if (toolId === 'pdf-page-reorganizer') {
        const seqInput = panel.querySelector('#opt-reorg-sequence');
        panel.querySelector('#btn-reorg-reverse')?.addEventListener('click', () => {
          if (!seqInput) return;
          const parts = seqInput.value.split(',').map(s => s.trim()).filter(Boolean);
          if (parts.length > 0) {
            seqInput.value = parts.reverse().join(', ');
          }
        });
        panel.querySelector('#btn-reorg-reset')?.addEventListener('click', () => {
          if (!seqInput) return;
          const parts = seqInput.value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
          if (parts.length > 0) {
            seqInput.value = parts.sort((a, b) => a - b).join(', ');
          }
        });
      }
    },

    // Main execution router for the 60 tools
    async execute(toolId, file, engine) {
      const panel = document.getElementById(`panel-${toolId}`);
      const handlers = window.MTVMediaHandlers || {};

      switch (toolId) {
        // IMAGE TOOLS
        case 'image-compressor': {
          const quality = parseInt(panel?.querySelector('#opt-comp-quality')?.value || '80', 10);
          const format = panel?.querySelector('#opt-comp-format')?.value || 'webp';
          const maxDim = parseInt(panel?.querySelector('#opt-comp-maxdim')?.value || '0', 10);
          engine.updateProgress(35, `Re-encoding image to ${format.toUpperCase()} (${quality}% quality)...`);
          const blob = await handlers.compressImage(file, quality, maxDim, format);
          const origSize = (file.size / 1024).toFixed(1);
          const newSize = (blob.size / 1024).toFixed(1);
          const savings = Math.round((1 - blob.size / file.size) * 100);
          return {
            blob,
            extension: format === 'jpeg' ? 'jpg' : format,
            mimeType: blob.type,
            meta: `Compressed ${format.toUpperCase()} • ${origSize} KB → ${newSize} KB (${savings >= 0 ? savings + '% smaller' : '+' + Math.abs(savings) + '%'})`
          };
        }

        case 'image-resizer': {
          const preset = panel?.querySelector('#opt-resize-preset')?.value || 'custom';
          const w = parseInt(panel?.querySelector('#opt-resize-width')?.value || '1280', 10);
          const h = parseInt(panel?.querySelector('#opt-resize-height')?.value || '720', 10);
          const aspect = panel?.querySelector('#opt-resize-aspect')?.checked ?? true;
          engine.updateProgress(35, 'Interpolating and resizing image pixels...');
          const blob = await handlers.resizeImage(file, w, h, aspect, preset);
          return {
            blob,
            extension: 'png',
            mimeType: 'image/png',
            meta: `Resized Image • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'image-watermark': {
          const text = panel?.querySelector('#opt-wm-text')?.value || '© MTV';
          const pos = panel?.querySelector('#opt-wm-pos')?.value || 'bottom-right';
          const opacity = parseInt(panel?.querySelector('#opt-wm-opacity')?.value || '50', 10) / 100;
          const size = parseInt(panel?.querySelector('#opt-wm-size')?.value || '32', 10);
          const color = panel?.querySelector('#opt-wm-color')?.value || '#ffffff';
          engine.updateProgress(40, 'Rendering typography watermark overlay...');
          const blob = await handlers.addImageWatermark(file, text, pos, opacity, size, color);
          return {
            blob,
            extension: 'png',
            mimeType: 'image/png',
            meta: `Watermarked Image ("${text}") • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'color-inverter': {
          const mode = panel?.querySelector('#opt-invert-mode')?.value || 'full';
          engine.updateProgress(40, 'Inverting RGB pixel channels...');
          const blob = await handlers.invertImageColors(file, mode);
          return {
            blob,
            extension: 'png',
            mimeType: 'image/png',
            meta: `Color Inverted Image (${mode.toUpperCase()}) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'image-filters': {
          const b = parseInt(panel?.querySelector('#opt-filter-bright')?.value || '100', 10);
          const c = parseInt(panel?.querySelector('#opt-filter-contrast')?.value || '100', 10);
          const s = parseInt(panel?.querySelector('#opt-filter-sat')?.value || '100', 10);
          const sep = parseInt(panel?.querySelector('#opt-filter-sepia')?.value || '0', 10);
          const g = parseInt(panel?.querySelector('#opt-filter-gray')?.value || '0', 10);
          const h = parseInt(panel?.querySelector('#opt-filter-hue')?.value || '0', 10);
          engine.updateProgress(40, 'Applying color grading and photographic filters...');
          const blob = await handlers.applyImageFilters(file, b, c, s, sep, g, h);
          return {
            blob,
            extension: 'png',
            mimeType: 'image/png',
            meta: `Color Graded Photo • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'png-to-svg': {
          engine.updateProgress(40, 'Tracing pixel contours into vector SVG paths...');
          const blob = await handlers.rasterToSvg(file);
          return {
            blob,
            extension: 'svg',
            mimeType: 'image/svg+xml',
            meta: `Scalable Vector SVG • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'favicon-generator': {
          engine.updateProgress(40, 'Generating multi-resolution favicon suite...');
          const blob = await handlers.generateFaviconSuite(file);
          return {
            blob,
            extension: 'zip',
            mimeType: 'application/zip',
            meta: `Complete Favicon Suite (16, 32, 48, 180, 192, 512px) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'meme-generator': {
          const top = panel?.querySelector('#opt-meme-top')?.value || '';
          const bottom = panel?.querySelector('#opt-meme-bottom')?.value || '';
          const size = parseInt(panel?.querySelector('#opt-meme-size')?.value || '42', 10);
          engine.updateProgress(40, 'Composing meme text overlays...');
          const blob = await handlers.generateMeme(file, top, bottom, size);
          return {
            blob,
            extension: 'png',
            mimeType: 'image/png',
            meta: `Meme Graphic • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'base64-image': {
          engine.updateProgress(40, 'Encoding binary image to Base64...');
          const result = await handlers.imageToBase64(file);
          const fmt = panel?.querySelector('#opt-b64-format')?.value || 'data-uri';
          let outputText = result.dataUri;
          if (fmt === 'html-img') outputText = `<img src="${result.dataUri}" alt="Embedded Image" />`;
          else if (fmt === 'css-bg') outputText = `background-image: url("${result.dataUri}");`;
          else if (fmt === 'raw') outputText = result.base64;

          const outArea = panel?.querySelector('#opt-b64-output');
          if (outArea) outArea.value = outputText;

          const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
          return {
            blob,
            extension: 'txt',
            mimeType: 'text/plain',
            meta: `Base64 String (${(outputText.length / 1024).toFixed(1)} KB)`
          };
        }

        case 'image-blur': {
          const radius = parseInt(panel?.querySelector('#opt-blur-radius')?.value || '12', 10);
          engine.updateProgress(40, 'Applying Gaussian blur convolution...');
          const blob = await handlers.blurImage(file, radius);
          return {
            blob,
            extension: 'png',
            mimeType: 'image/png',
            meta: `Blurred Image (Radius: ${radius}px) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'image-border': {
          const width = parseInt(panel?.querySelector('#opt-border-width')?.value || '24', 10);
          const color = panel?.querySelector('#opt-border-color')?.value || '#1e293b';
          const radius = parseInt(panel?.querySelector('#opt-border-radius')?.value || '16', 10);
          engine.updateProgress(40, 'Framing image with custom border & padding...');
          const blob = await handlers.addImageBorder(file, width, color, radius);
          return {
            blob,
            extension: 'png',
            mimeType: 'image/png',
            meta: `Framed Image (${width}px Border) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'image-splitter': {
          const grid = panel?.querySelector('#opt-split-grid')?.value || '3x1';
          const [cols, rows] = grid.split('x').map(n => parseInt(n, 10));
          engine.updateProgress(40, `Slicing image into ${cols * rows} tiles...`);
          const blob = await handlers.splitImage(file, cols, rows);
          return {
            blob,
            extension: 'zip',
            mimeType: 'application/zip',
            meta: `Split Grid (${cols}×${rows} Tiles) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'color-palette-image': {
          const count = parseInt(panel?.querySelector('#opt-palette-count')?.value || '6', 10);
          engine.updateProgress(40, 'Sampling dominant color frequencies...');
          const result = await handlers.extractColorPalette(file, count);
          const container = panel?.querySelector('#palette-swatches-container');
          if (container && result.palette) {
            container.innerHTML = result.palette.map(c => `
              <div style="flex: 1; min-width: 90px; padding: 0.75rem; background: ${c.hex}; border-radius: var(--radius-md); text-align: center; color: ${c.isLight ? '#000000' : '#ffffff'}; font-size: 0.8rem; font-weight: bold; cursor: pointer; box-shadow: var(--shadow-sm);" onclick="navigator.clipboard.writeText('${c.hex}'); window.alert ? null : console.log('Copied');" title="Click to copy ${c.hex}">
                ${c.hex}<br/><span style="font-size: 0.7rem; opacity: 0.85;">${c.pct}%</span>
              </div>
            `).join('');
          }
          return {
            blob: result.blob,
            extension: 'png',
            mimeType: 'image/png',
            meta: `Color Palette (${result.palette.length} Swatches)`
          };
        }

        case 'pixelate-image': {
          const size = parseInt(panel?.querySelector('#opt-pixel-size')?.value || '16', 10);
          engine.updateProgress(40, 'Rendering retro pixel art mosaic...');
          const blob = await handlers.pixelateImage(file, size);
          return {
            blob,
            extension: 'png',
            mimeType: 'image/png',
            meta: `Pixelated Image (${size}px Blocks) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'image-rotate-flip': {
          const deg = parseInt(panel?.querySelector('#opt-rot-deg')?.value || '0', 10);
          const flipH = panel?.querySelector('#opt-flip-h')?.checked || false;
          const flipV = panel?.querySelector('#opt-flip-v')?.checked || false;
          engine.updateProgress(40, 'Transforming canvas orientation...');
          const blob = await handlers.rotateFlipImage(file, deg, flipH, flipV);
          return {
            blob,
            extension: 'png',
            mimeType: 'image/png',
            meta: `Reoriented Image (${deg}° rotation) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        // VIDEO TOOLS
        case 'video-compressor': {
          const res = panel?.querySelector('#opt-vcomp-res')?.value || 'original';
          engine.updateProgress(20, `Compressing video stream (${res})...`);
          const blob = await handlers.compressVideo(file, res, (pct, msg) => engine.updateProgress(pct, msg));
          return {
            blob,
            extension: 'webm',
            mimeType: 'video/webm',
            meta: `Compressed Video • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'video-reverse': {
          engine.updateProgress(20, 'Reversing video frames client-side...');
          const blob = await handlers.reverseVideo(file, (pct, msg) => engine.updateProgress(pct, msg));
          return {
            blob,
            extension: 'webm',
            mimeType: 'video/webm',
            meta: `Reversed Video • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'video-watermark': {
          const text = panel?.querySelector('#opt-vwm-text')?.value || 'MTV Creator';
          const pos = panel?.querySelector('#opt-vwm-pos')?.value || 'bottom-right';
          engine.updateProgress(20, 'Burning text watermark into video frames...');
          const blob = await handlers.addVideoWatermark(file, text, pos, (pct, msg) => engine.updateProgress(pct, msg));
          return {
            blob,
            extension: 'webm',
            mimeType: 'video/webm',
            meta: `Watermarked Video • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'video-mute': {
          engine.updateProgress(20, 'Stripping audio track from video...');
          const blob = await handlers.muteVideo(file, (pct, msg) => engine.updateProgress(pct, msg));
          return {
            blob,
            extension: 'webm',
            mimeType: 'video/webm',
            meta: `Muted Video Clip • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'video-rotate': {
          const deg = parseInt(panel?.querySelector('#opt-vrot-deg')?.value || '90', 10);
          engine.updateProgress(20, `Rotating video stream by ${deg}°...`);
          const blob = await handlers.rotateVideo(file, deg, (pct, msg) => engine.updateProgress(pct, msg));
          return {
            blob,
            extension: 'webm',
            mimeType: 'video/webm',
            meta: `Rotated Video (${deg}°) • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'video-loop': {
          const count = parseInt(panel?.querySelector('#opt-vloop-count')?.value || '2', 10);
          const isBoomerang = panel?.querySelector('#opt-vloop-boomerang')?.checked || false;
          engine.updateProgress(20, `Generating looping video (${count}x)...`);
          const blob = await handlers.loopVideo(file, count, isBoomerang, (pct, msg) => engine.updateProgress(pct, msg));
          return {
            blob,
            extension: 'webm',
            mimeType: 'video/webm',
            meta: `Loop Video (${count}x) • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'video-framerate': {
          const fps = parseInt(panel?.querySelector('#opt-vfps-target')?.value || '24', 10);
          engine.updateProgress(20, `Resampling video to ${fps} FPS...`);
          const blob = await handlers.changeVideoFps(file, fps, (pct, msg) => engine.updateProgress(pct, msg));
          return {
            blob,
            extension: 'webm',
            mimeType: 'video/webm',
            meta: `Adjusted Frame Rate (${fps} FPS) • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'video-snapshot': {
          const time = parseFloat(panel?.querySelector('#opt-vsnap-time')?.value || '1.0');
          engine.updateProgress(40, `Capturing video frame at ${time}s...`);
          const blob = await handlers.extractVideoSnapshot(file, time);
          return {
            blob,
            extension: 'png',
            mimeType: 'image/png',
            meta: `Video Snapshot Frame (${time}s) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'video-aspect-ratio': {
          const ratio = panel?.querySelector('#opt-vaspect-target')?.value || '9:16';
          engine.updateProgress(20, `Reformatting video aspect ratio to ${ratio}...`);
          const blob = await handlers.resizeVideoAspectRatio(file, ratio, (pct, msg) => engine.updateProgress(pct, msg));
          return {
            blob,
            extension: 'webm',
            mimeType: 'video/webm',
            meta: `Aspect Ratio Video (${ratio}) • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'video-color-filter': {
          const filter = panel?.querySelector('#opt-vfilter-preset')?.value || 'vintage';
          engine.updateProgress(20, `Color grading video stream (${filter})...`);
          const blob = await handlers.applyVideoColorFilter(file, filter, (pct, msg) => engine.updateProgress(pct, msg));
          return {
            blob,
            extension: 'webm',
            mimeType: 'video/webm',
            meta: `Color Filtered Video • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        // AUDIO TOOLS
        case 'audio-compressor': {
          const bitrate = parseInt(panel?.querySelector('#opt-acomp-bitrate')?.value || '128', 10);
          engine.updateProgress(35, `Re-encoding audio to ${bitrate} kbps...`);
          const blob = await handlers.compressAudio(file, bitrate);
          const ext = (blob.type === 'audio/mp3' || blob.type === 'audio/mpeg') ? 'mp3' : 'wav';
          return {
            blob,
            extension: ext,
            mimeType: blob.type || 'audio/mp3',
            meta: `Compressed Audio (${bitrate} kbps) • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'audio-joiner': {
          const extraFiles = panel?.querySelector('#opt-ajoin-files')?.files;
          const allFiles = [];
          if (file) allFiles.push(file);
          if (extraFiles && extraFiles.length > 0) {
            for (let i = 0; i < extraFiles.length; i++) allFiles.push(extraFiles[i]);
          }
          if (allFiles.length < 2) {
            throw new Error('Please select at least 2 audio files to merge.');
          }
          engine.updateProgress(35, `Merging ${allFiles.length} audio tracks sequentially...`);
          const blob = await handlers.joinAudioFiles(allFiles);
          return {
            blob,
            extension: 'wav',
            mimeType: 'audio/wav',
            meta: `Joined Audio Track (${allFiles.length} Tracks) • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'audio-normalizer': {
          const gain = parseFloat(panel?.querySelector('#opt-anorm-gain')?.value || '1.5');
          engine.updateProgress(35, 'Balancing volume peaks and dynamic range...');
          const blob = await handlers.normalizeAudio(file, gain);
          return {
            blob,
            extension: 'wav',
            mimeType: 'audio/wav',
            meta: `Normalized Audio Track • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'audio-reverse': {
          engine.updateProgress(35, 'Inverting audio sample buffer...');
          const blob = await handlers.reverseAudio(file);
          return {
            blob,
            extension: 'wav',
            mimeType: 'audio/wav',
            meta: `Reversed Audio Track • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'audio-pitch': {
          const semitones = parseInt(panel?.querySelector('#opt-apitch-shift')?.value || '2', 10);
          engine.updateProgress(35, `Shifting audio pitch by ${semitones > 0 ? '+' + semitones : semitones} semitones...`);
          const blob = await handlers.shiftAudioPitch(file, semitones);
          return {
            blob,
            extension: 'wav',
            mimeType: 'audio/wav',
            meta: `Pitch-Shifted Audio (${semitones > 0 ? '+' + semitones : semitones} ST) • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'audio-bass-boost': {
          const bass = parseFloat(panel?.querySelector('#opt-aeq-bass')?.value || '8');
          const mid = parseFloat(panel?.querySelector('#opt-aeq-mid')?.value || '0');
          const treble = parseFloat(panel?.querySelector('#opt-aeq-treble')?.value || '2');
          engine.updateProgress(35, `Equalizing frequencies (Bass +${bass}dB)...`);
          const blob = await handlers.bassBoostAudio(file, bass, mid, treble);
          return {
            blob,
            extension: 'wav',
            mimeType: 'audio/wav',
            meta: `Bass Boosted Audio (+${bass}dB) • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'audio-bpm': {
          engine.updateProgress(40, 'Detecting rhythmic beat intervals...');
          const result = await handlers.detectAudioBpm(file);
          const bpmVal = typeof result === 'object' ? result.bpm : result;
          const confVal = (typeof result === 'object' && result.confidence) ? result.confidence : 'Estimated';
          return {
            blob: file,
            extension: file.name.split('.').pop() || 'mp3',
            mimeType: file.type || 'audio/mpeg',
            meta: `Detected Rhythm: ~${bpmVal} BPM (${confVal})`
          };
        }

        case 'audio-stereo-panner': {
          const speed = parseFloat(panel?.querySelector('#opt-a8d-speed')?.value || '0.25');
          engine.updateProgress(35, 'Synthesizing 8D spatial audio orbit...');
          const blob = await handlers.applyStereo8D(file, speed);
          return {
            blob,
            extension: 'wav',
            mimeType: 'audio/wav',
            meta: `8D Binaural Spatial Audio • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'audio-cutter-ringtone': {
          const start = parseFloat(panel?.querySelector('#opt-ring-start')?.value || '0');
          const dur = parseFloat(panel?.querySelector('#opt-ring-dur')?.value || '30');
          engine.updateProgress(35, `Cutting ${dur}s ringtone segment with fade envelopes...`);
          const blob = await handlers.createRingtone(file, start, dur);
          return {
            blob,
            extension: 'wav',
            mimeType: 'audio/wav',
            meta: `Phone Ringtone (${dur}s duration) • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        case 'audio-noise-generator': {
          const type = panel?.querySelector('#opt-noise-type')?.value || 'white';
          const dur = parseInt(panel?.querySelector('#opt-noise-dur')?.value || '30', 10);
          engine.updateProgress(35, `Synthesizing ${dur}s of pure ${type} noise...`);
          const blob = await handlers.generateAmbientNoise(type, dur);
          return {
            blob,
            extension: 'wav',
            mimeType: 'audio/wav',
            meta: `Ambient ${type.toUpperCase()} Noise (${dur}s duration) • ${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          };
        }

        // PDF & DOCUMENT TOOLS
        case 'pdf-merger': {
          const files = panel?.querySelector('#opt-pdf-merge-files')?.files;
          const allFiles = files && files.length > 0 ? Array.from(files) : (file ? [file] : []);
          if (allFiles.length < 2) {
            throw new Error('Please select at least 2 PDF files to merge.');
          }
          engine.updateProgress(35, `Merging ${allFiles.length} PDF documents...`);
          const blob = await handlers.mergePdfFiles(allFiles);
          return {
            blob,
            extension: 'pdf',
            mimeType: 'application/pdf',
            meta: `Combined PDF (${allFiles.length} Documents) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'pdf-splitter': {
          const targetFile = file || panel?.querySelector('#opt-pdf-split-file')?.files?.[0];
          if (!targetFile) throw new Error('Please select a PDF file to split.');
          const ranges = panel?.querySelector('#opt-pdf-split-ranges')?.value || '1';
          engine.updateProgress(35, 'Extracting specified PDF pages...');
          const blob = await handlers.splitPdfPages(targetFile, ranges);
          return {
            blob,
            extension: 'pdf',
            mimeType: 'application/pdf',
            meta: `Extracted PDF Pages (${ranges}) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'pdf-page-rotator': {
          const targetFile = file || panel?.querySelector('#opt-pdf-rot-file')?.files?.[0];
          if (!targetFile) throw new Error('Please select a PDF file to rotate.');
          const deg = parseInt(panel?.querySelector('#opt-pdf-rot-deg')?.value || '90', 10);
          engine.updateProgress(35, `Rotating PDF pages by ${deg}°...`);
          const blob = await handlers.rotatePdfPages(targetFile, deg);
          return {
            blob,
            extension: 'pdf',
            mimeType: 'application/pdf',
            meta: `Rotated PDF (${deg}°) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'pdf-watermark': {
          const targetFile = file || panel?.querySelector('#opt-pdf-wm-file')?.files?.[0];
          if (!targetFile) throw new Error('Please select a PDF file to watermark.');
          const text = panel?.querySelector('#opt-pdf-wm-text')?.value || 'CONFIDENTIAL';
          const opacity = parseFloat(panel?.querySelector('#opt-pdf-wm-opacity')?.value || '0.35');
          engine.updateProgress(35, 'Stamping text watermark onto PDF pages...');
          const blob = await handlers.addPdfWatermark(targetFile, text, opacity);
          return {
            blob,
            extension: 'pdf',
            mimeType: 'application/pdf',
            meta: `Watermarked PDF ("${text}") • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'pdf-page-numberer': {
          const targetFile = file || panel?.querySelector('#opt-pdf-num-file')?.files?.[0];
          if (!targetFile) throw new Error('Please select a PDF file to number.');
          const fmt = panel?.querySelector('#opt-pdf-num-fmt')?.value || 'Page {n} of {total}';
          const pos = panel?.querySelector('#opt-pdf-num-pos')?.value || 'bottom-center';
          engine.updateProgress(35, 'Stamping sequential page numbers...');
          const blob = await handlers.numberPdfPages(targetFile, fmt, pos);
          return {
            blob,
            extension: 'pdf',
            mimeType: 'application/pdf',
            meta: `Numbered PDF Document • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'pdf-compressor': {
          const targetFile = file || panel?.querySelector('#opt-pdf-comp-file')?.files?.[0];
          if (!targetFile) throw new Error('Please select a PDF file to compress.');
          const quality = parseInt(panel?.querySelector('#opt-pdf-comp-level')?.value || '75', 10);
          engine.updateProgress(35, 'Compressing and optimizing PDF raster layers...');
          const blob = await handlers.compressPdf(targetFile, quality);
          const origKB = (targetFile.size / 1024).toFixed(1);
          const newKB = (blob.size / 1024).toFixed(1);
          return {
            blob,
            extension: 'pdf',
            mimeType: 'application/pdf',
            meta: `Compressed PDF • ${origKB} KB → ${newKB} KB`
          };
        }

        case 'text-to-pdf': {
          const title = panel?.querySelector('#opt-t2p-title')?.value || 'Document';
          const text = panel?.querySelector('#opt-t2p-text')?.value || '';
          if (!text.trim()) throw new Error('Please enter some text to generate a PDF.');
          engine.updateProgress(35, 'Rendering formatted PDF from text...');
          const blob = await handlers.generateTextToPdf(text, title);
          return {
            blob,
            extension: 'pdf',
            mimeType: 'application/pdf',
            meta: `Generated PDF (${title}) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'pdf-protect': {
          const targetFile = file || panel?.querySelector('#opt-pdf-sec-file')?.files?.[0];
          if (!targetFile) throw new Error('Please select a PDF file to inspect.');
          engine.updateProgress(35, 'Auditing PDF metadata and security structure...');
          const report = await handlers.inspectPdfSecurity(targetFile);
          const reportText = `PDF Security & Metadata Audit Report:
File Name: ${report.fileName || targetFile.name}
File Size: ${((report.fileSizeBytes || targetFile.size) / 1024).toFixed(1)} KB
Total Pages: ${report.pageCount || report.pages || 0}
Title: ${report.title || 'None / Cleared'}
Author: ${report.author || 'None / Anonymous'}
Creator/Producer: ${report.producer || report.creator || 'Unknown'}
Encrypted: ${report.isEncrypted ? 'Yes' : 'No'}
Creation Date: ${report.creationDate || 'Unknown'}
Audit Status: Safe (100% Client-Side In-Memory Inspection)`;
          const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
          return {
            blob,
            extension: 'txt',
            mimeType: 'text/plain',
            meta: `PDF Security Audit Report (${((report.fileSizeBytes || targetFile.size) / 1024).toFixed(1)} KB)`
          };
        }

        case 'pdf-page-delete': {
          const targetFile = file || panel?.querySelector('#opt-pdf-del-file')?.files?.[0];
          if (!targetFile) throw new Error('Please select a PDF file.');
          const raw = panel?.querySelector('#opt-pdf-del-pages')?.value || '1';
          const toDelete = [];
          raw.split(',').forEach(part => {
            const trimmed = part.trim();
            if (trimmed.includes('-')) {
              const [start, end] = trimmed.split('-').map(n => parseInt(n, 10));
              if (!isNaN(start) && !isNaN(end)) {
                for (let i = start; i <= end; i++) toDelete.push(i - 1);
              }
            } else {
              const p = parseInt(trimmed, 10);
              if (!isNaN(p)) toDelete.push(p - 1);
            }
          });
          engine.updateProgress(35, 'Removing specified pages from PDF...');
          const blob = await handlers.deletePdfPages(targetFile, toDelete);
          return {
            blob,
            extension: 'pdf',
            mimeType: 'application/pdf',
            meta: `Cleaned PDF (Deleted pages: ${raw}) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'markdown-to-pdf': {
          const md = panel?.querySelector('#opt-md-content')?.value || '# Sample Document\n\nGenerated with Multi Tube Views.';
          engine.updateProgress(35, 'Compiling Markdown to styled PDF document...');
          const blob = await handlers.generateMarkdownToPdf(md);
          return {
            blob,
            extension: 'pdf',
            mimeType: 'application/pdf',
            meta: `Markdown PDF Document • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        // ========== 13 NEW CONVERTER TOOLS EXECUTION ==========

        case 'heic-to-jpg': {
          const targetFile = file || panel?.querySelector('#opt-heic-file')?.files?.[0];
          if (!targetFile) throw new Error('Please select a HEIC or HEIF image file.');
          const quality = parseInt(panel?.querySelector('#opt-heic-jpg-quality')?.value || '92', 10) / 100;
          const bg = panel?.querySelector('#opt-heic-jpg-bg')?.value || '#FFFFFF';
          engine.updateProgress(30, 'Decoding Apple HEIC image stream...');
          const blob = await handlers.convertHeicToJpg(targetFile, quality, bg);
          engine.updateProgress(90, 'Finalizing JPEG output...');
          const origKB = (targetFile.size / 1024).toFixed(1);
          const newKB = (blob.size / 1024).toFixed(1);
          return {
            blob,
            extension: 'jpg',
            mimeType: 'image/jpeg',
            meta: `Converted JPG • ${origKB} KB → ${newKB} KB`
          };
        }

        case 'heic-to-png': {
          const targetFile = file || panel?.querySelector('#opt-heic-file')?.files?.[0];
          if (!targetFile) throw new Error('Please select a HEIC or HEIF image file.');
          const scale = parseFloat(panel?.querySelector('#opt-heic-png-scale')?.value || '1.0');
          engine.updateProgress(30, 'Decoding HEIC photo to lossless PNG...');
          const blob = await handlers.convertHeicToPng(targetFile, scale);
          const origKB = (targetFile.size / 1024).toFixed(1);
          const newKB = (blob.size / 1024).toFixed(1);
          return {
            blob,
            extension: 'png',
            mimeType: 'image/png',
            meta: `Lossless PNG • ${origKB} KB → ${newKB} KB`
          };
        }

        case 'webp-to-jpg': {
          if (!file) throw new Error('Please select a WebP image.');
          const quality = parseInt(panel?.querySelector('#opt-webp-jpg-quality')?.value || '90', 10) / 100;
          const bg = panel?.querySelector('#opt-webp-jpg-bg')?.value || '#FFFFFF';
          engine.updateProgress(35, 'Converting WebP to universal JPEG format...');
          const blob = await handlers.convertWebpToJpg(file, quality, bg);
          return {
            blob,
            extension: 'jpg',
            mimeType: 'image/jpeg',
            meta: `Converted JPG • ${(file.size / 1024).toFixed(1)} KB → ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'webp-to-png': {
          if (!file) throw new Error('Please select a WebP image.');
          engine.updateProgress(35, 'Rasterizing WebP to lossless PNG with alpha channel...');
          const blob = await handlers.convertWebpToPng(file);
          return {
            blob,
            extension: 'png',
            mimeType: 'image/png',
            meta: `Lossless PNG • ${(file.size / 1024).toFixed(1)} KB → ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'avif-to-jpg': {
          if (!file) throw new Error('Please select an AVIF image.');
          const quality = parseInt(panel?.querySelector('#opt-avif-jpg-quality')?.value || '90', 10) / 100;
          const bg = panel?.querySelector('#opt-avif-jpg-bg')?.value || '#FFFFFF';
          engine.updateProgress(35, 'Converting AVIF to JPEG format...');
          const blob = await handlers.convertAvifToJpg(file, quality, bg);
          return {
            blob,
            extension: 'jpg',
            mimeType: 'image/jpeg',
            meta: `Converted JPG • ${(file.size / 1024).toFixed(1)} KB → ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'avif-to-png': {
          if (!file) throw new Error('Please select an AVIF image.');
          engine.updateProgress(35, 'Converting AVIF to lossless PNG format...');
          const blob = await handlers.convertAvifToPng(file);
          return {
            blob,
            extension: 'png',
            mimeType: 'image/png',
            meta: `Lossless PNG • ${(file.size / 1024).toFixed(1)} KB → ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'svg-to-png': {
          if (!file) throw new Error('Please select an SVG vector file.');
          const scale = parseFloat(panel?.querySelector('#opt-svg-scale')?.value || '2');
          const bg = panel?.querySelector('#opt-svg-bg')?.value || 'transparent';
          engine.updateProgress(35, `Rasterizing SVG vector at ${scale}x resolution...`);
          const blob = await handlers.rasterizeSvgToPng(file, scale, bg);
          return {
            blob,
            extension: 'png',
            mimeType: 'image/png',
            meta: `Rasterized PNG (${scale}x scale) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'pdf-password-protect': {
          if (!file) throw new Error('Please select a PDF document to protect.');
          const userPass = panel?.querySelector('#opt-pdf-user-pass')?.value || '';
          const ownerPass = panel?.querySelector('#opt-pdf-owner-pass')?.value || '';
          if (!userPass) throw new Error('Please enter a user password to lock the PDF.');
          const algo = panel?.querySelector('#opt-pdf-enc-algo')?.value || 'AES-256';
          const perms = {
            printing: panel?.querySelector('#opt-pdf-perm-print')?.checked ?? true,
            copying: panel?.querySelector('#opt-pdf-perm-copy')?.checked ?? true,
            modifying: panel?.querySelector('#opt-pdf-perm-mod')?.checked ?? false
          };
          engine.updateProgress(35, `Encrypting PDF document with ${algo}...`);
          const blob = await handlers.passwordProtectPdf(file, userPass, ownerPass, perms, algo);
          return {
            blob,
            extension: 'pdf',
            mimeType: 'application/pdf',
            meta: `Encrypted Locked PDF • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'pdf-password-remover': {
          if (!file) throw new Error('Please select a password-protected PDF document.');
          const pass = panel?.querySelector('#opt-pdf-unlock-pass')?.value || '';
          engine.updateProgress(35, 'Authenticating and stripping PDF encryption...');
          const blob = await handlers.removePdfPassword(file, pass);
          return {
            blob,
            extension: 'pdf',
            mimeType: 'application/pdf',
            meta: `Unlocked Clean PDF • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'pdf-image-extractor': {
          if (!file) throw new Error('Please select a PDF document to extract images from.');
          engine.updateProgress(30, 'Scanning PDF object streams for embedded images...');
          const res = await handlers.extractPdfImages(file);
          if (!res || res.count === 0) {
            throw new Error('No embedded images found in this PDF document.');
          }
          engine.updateProgress(90, `Extracted ${res.count} images from PDF!`);
          const isZip = !!res.zipBlob;
          return {
            blob: isZip ? res.zipBlob : res.images[0].blob,
            extension: isZip ? 'zip' : 'png',
            mimeType: isZip ? 'application/zip' : 'image/png',
            meta: `Extracted ${res.count} Images • ${isZip ? 'Packaged as ZIP' : 'Single Image'} (${((res.zipBlob?.size || res.images[0]?.blob?.size || 0) / 1024).toFixed(1)} KB)`
          };
        }

        case 'pdf-page-reorganizer': {
          if (!file) throw new Error('Please select a PDF document.');
          const raw = panel?.querySelector('#opt-reorg-sequence')?.value || '';
          const parts = raw.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
          if (parts.length === 0) throw new Error('Please enter a valid page sequence (e.g. 2, 1, 3).');
          const zeroIndexed = parts.map(n => n - 1);
          engine.updateProgress(35, 'Reorganizing and compiling new PDF structure...');
          const blob = await handlers.reorganizePdfPages(file, zeroIndexed);
          return {
            blob,
            extension: 'pdf',
            mimeType: 'application/pdf',
            meta: `Reorganized PDF (${parts.length} pages in new order) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'pdf-to-text': {
          if (!file) throw new Error('Please select a PDF document.');
          const incDiv = panel?.querySelector('#opt-p2t-dividers')?.checked ?? true;
          const norm = panel?.querySelector('#opt-p2t-normalize')?.checked ?? true;
          engine.updateProgress(35, 'Extracting text streams from all PDF pages...');
          const res = await handlers.extractPdfText(file, { includeDividers: incDiv, normalizeSpaces: norm });
          return {
            blob: res.blob,
            extension: 'txt',
            mimeType: 'text/plain',
            meta: `Extracted Text • ${res.pageCount} Pages • ${res.wordCount.toLocaleString()} Words • ${(res.blob.size / 1024).toFixed(1)} KB`
          };
        }

        case 'images-to-pdf': {
          const multiFiles = panel?.querySelector('#opt-img2pdf-files')?.files;
          const files = (multiFiles && multiFiles.length > 0) ? Array.from(multiFiles) : (file ? [file] : []);
          if (files.length === 0) throw new Error('Please select at least one image to convert to PDF.');
          const pageSize = panel?.querySelector('#opt-img2pdf-pagesize')?.value || 'fit';
          const orientation = panel?.querySelector('#opt-img2pdf-orientation')?.value || 'auto';
          const margin = parseInt(panel?.querySelector('#opt-img2pdf-margin')?.value || '0', 10);
          engine.updateProgress(35, `Assembling ${files.length} image(s) into PDF document...`);
          const blob = await handlers.convertImagesToPdf(files, { pageSize, orientation, margin });
          return {
            blob,
            extension: 'pdf',
            mimeType: 'application/pdf',
            meta: `Compiled PDF (${files.length} pages) • ${(blob.size / 1024).toFixed(1)} KB`
          };
        }

        default:
          throw new Error(`Handler not configured for ${toolId}`);
      }
    }
  };

  window.MTVMediaUI = MTVMediaUI;

})();

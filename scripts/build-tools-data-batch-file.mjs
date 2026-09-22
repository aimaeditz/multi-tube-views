// 2 File & Data Converters for Browser Utilities
export const BATCH_FILE_TOOLS = [
  // 1. Base64 to Image Converter
  {
    id: 'base64-to-image-converter',
    categoryId: 'file-data-utilities',
    name: 'Base64 to Image Converter',
    icon: '🖼️',
    title: 'Base64 to Image Converter — Decode Base64 Strings to PNG, JPEG & SVG',
    description: 'Decode Base64 strings (with or without Data URI prefix) into high-resolution PNG, JPEG, SVG, WebP, and GIF images with instant visual preview, dimensions analysis, file size inspector, and one-click image download.',
    keywords: 'base64 to image converter, decode base64 to png, base64 to jpg online, base64 image preview, convert base64 to image file',
    howToUse: [
      { step: '1', title: 'Paste Base64 String', desc: 'Paste raw Base64 data or a data:image/... URI into the input box or load a sample.' },
      { step: '2', title: 'Inspect Live Preview', desc: 'Instantly view the decoded image rendered on an alpha-grid canvas with file dimensions and size.' },
      { step: '3', title: 'Download Image', desc: 'Download your image as a native PNG, JPEG, or SVG file.' }
    ],
    features: [
      { title: 'Auto Format Detection', desc: 'Recognizes PNG, JPEG, GIF, WebP, and SVG headers automatically from data or magic bytes.' },
      { title: 'Transparency Checkerboard', desc: 'Renders alpha transparent images with a high-contrast pattern for clear inspection.' },
      { title: 'Instant Download & Copy', desc: 'Save image directly or copy formatted HTML &lt;img&gt; tag.' }
    ],
    sampleText: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMzYjgyZjYiIHJ4PSI0MCIvPjxwb2x5Z29uIHBvaW50cz0iMTAwLDQwIDE1MCwxNTAgNTAsMTUwIiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1.5rem; margin-bottom: 1.25rem;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="b2i-input" style="margin: 0;">Base64 Image String</label>
            <span id="b2i-input-stats" style="font-size: 0.8rem; color: var(--text-muted);">0 chars</span>
          </div>
          <textarea id="b2i-input" class="bu-textarea" style="height: 250px; font-family: monospace; font-size: 0.85rem;" placeholder="Paste Base64 string or data:image/png;base64,..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="btn-b2i-sample" class="bu-btn bu-btn-subtle">Load SVG Logo Sample</button>
            <button type="button" id="btn-b2i-sample-png" class="bu-btn bu-btn-subtle">Load PNG Sample</button>
            <button type="button" id="btn-b2i-clear" class="bu-btn bu-btn-subtle">Clear</button>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" style="margin: 0;">Image Preview</label>
            <span id="b2i-meta" style="font-size: 0.8rem; font-weight: 600; color: var(--accent-primary);">No Image</span>
          </div>
          <div id="b2i-preview-box" style="height: 250px; border: 1px dashed var(--border-color); border-radius: var(--radius-lg, 12px); display: flex; align-items: center; justify-content: center; background: repeating-conic-gradient(#f1f5f9 0% 25%, #ffffff 0% 50%) 50% / 20px 20px; overflow: hidden; position: relative;">
            <img id="b2i-img" src="" alt="Decoded Base64 Preview" style="max-height: 90%; max-width: 90%; object-fit: contain; display: none;">
            <span id="b2i-empty-msg" style="color: var(--text-muted); font-size: 0.85rem;">Image preview will render here</span>
          </div>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="btn-b2i-download" class="bu-btn bu-btn-primary" disabled>⬇️ Download Image</button>
            <button type="button" id="btn-b2i-copy-tag" class="bu-btn bu-btn-subtle" disabled>📋 Copy &lt;img&gt; Tag</button>
          </div>
        </div>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">Image Metadata &amp; Specs</h3>
        <div class="bu-grid-3col" style="gap: 1rem;">
          <div>Format: <strong id="b2i-fmt">—</strong></div>
          <div>Dimensions: <strong id="b2i-dim">—</strong></div>
          <div>Decoded Size: <strong id="b2i-size">—</strong></div>
        </div>
      </div>
    `,
    renderScript: () => `
      const inputEl = document.getElementById('b2i-input');
      const inputStats = document.getElementById('b2i-input-stats');
      const metaSpan = document.getElementById('b2i-meta');
      const previewImg = document.getElementById('b2i-img');
      const emptyMsg = document.getElementById('b2i-empty-msg');
      const downloadBtn = document.getElementById('btn-b2i-download');
      const copyTagBtn = document.getElementById('btn-b2i-copy-tag');
      const sampleBtn = document.getElementById('btn-b2i-sample');
      const samplePngBtn = document.getElementById('btn-b2i-sample-png');
      const clearBtn = document.getElementById('btn-b2i-clear');
      const fmtEl = document.getElementById('b2i-fmt');
      const dimEl = document.getElementById('b2i-dim');
      const sizeEl = document.getElementById('b2i-size');

      let currentDataUri = '';
      let currentExt = 'png';

      function detectFormat(str) {
        if (str.startsWith('data:image/svg')) return { mime: 'image/svg+xml', ext: 'svg' };
        if (str.startsWith('data:image/png')) return { mime: 'image/png', ext: 'png' };
        if (str.startsWith('data:image/jpeg') || str.startsWith('data:image/jpg')) return { mime: 'image/jpeg', ext: 'jpg' };
        if (str.startsWith('data:image/webp')) return { mime: 'image/webp', ext: 'webp' };
        if (str.startsWith('data:image/gif')) return { mime: 'image/gif', ext: 'gif' };

        // Magic bytes detection in Base64
        const raw = str.replace(/^data:image\\/[a-z+]+;base64,/i, '').trim();
        if (raw.startsWith('iVBORw0KGgo')) return { mime: 'image/png', ext: 'png' };
        if (raw.startsWith('/9j/')) return { mime: 'image/jpeg', ext: 'jpg' };
        if (raw.startsWith('R0lGOD')) return { mime: 'image/gif', ext: 'gif' };
        if (raw.startsWith('UklGR')) return { mime: 'image/webp', ext: 'webp' };
        if (raw.startsWith('PHN2Zy') || raw.startsWith('PD94bWw')) return { mime: 'image/svg+xml', ext: 'svg' };

        return { mime: 'image/png', ext: 'png' };
      }

      function update() {
        let text = inputEl.value.trim();
        if (!text) {
          previewImg.style.display = 'none';
          emptyMsg.style.display = 'block';
          downloadBtn.disabled = true;
          copyTagBtn.disabled = true;
          inputStats.textContent = '0 chars';
          metaSpan.textContent = 'No Image';
          fmtEl.textContent = '—';
          dimEl.textContent = '—';
          sizeEl.textContent = '—';
          return;
        }

        inputStats.textContent = \`\${text.length.toLocaleString()} chars\`;

        const fmt = detectFormat(text);
        currentExt = fmt.ext;

        if (!text.startsWith('data:')) {
          currentDataUri = \`data:\${fmt.mime};base64,\${text}\`;
        } else {
          currentDataUri = text;
        }

        previewImg.onload = () => {
          previewImg.style.display = 'block';
          emptyMsg.style.display = 'none';
          downloadBtn.disabled = false;
          copyTagBtn.disabled = false;

          const w = previewImg.naturalWidth;
          const h = previewImg.naturalHeight;
          const bytes = Math.round((text.length * 3) / 4);
          const sizeKb = (bytes / 1024).toFixed(1);

          metaSpan.textContent = \`\${fmt.ext.toUpperCase()} (\${w} × \${h})\`;
          fmtEl.textContent = fmt.mime;
          dimEl.textContent = \`\${w} × \${h} px\`;
          sizeEl.textContent = \`\${sizeKb} KB (\${bytes.toLocaleString()} bytes)\`;
        };

        previewImg.onerror = () => {
          previewImg.style.display = 'none';
          emptyMsg.style.display = 'block';
          emptyMsg.textContent = '❌ Invalid or corrupted Base64 image string';
          downloadBtn.disabled = true;
          copyTagBtn.disabled = true;
          metaSpan.textContent = 'Decode Error';
        };

        previewImg.src = currentDataUri;
      }

      inputEl.addEventListener('input', update);

      sampleBtn.addEventListener('click', () => {
        inputEl.value = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMzYjgyZjYiIHJ4PSI0MCIvPjxwb2x5Z29uIHBvaW50cz0iMTAwLDQwIDE1MCwxNTAgNTAsMTUwIiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+';
        update();
      });

      samplePngBtn.addEventListener('click', () => {
        // Minimal 16x16 transparent PNG with a red dot
        inputEl.value = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAExJREFUOE9jZKAQMFKon2HUAIJBBw4cwP///x+DMTAwMJz///8/A4ZRDEDOAGkG0sQAhg9oGgB24zAG5LgfE3B5CgMDOj+iWwP9GQgAvmU7Q14/TfAAAAAASUVORK5CYII=';
        update();
      });

      clearBtn.addEventListener('click', () => {
        inputEl.value = '';
        update();
      });

      downloadBtn.addEventListener('click', () => {
        if (!currentDataUri) return;
        const a = document.createElement('a');
        a.href = currentDataUri;
        a.download = \`decoded-image.\${currentExt}\`;
        a.click();
      });

      copyTagBtn.addEventListener('click', () => {
        if (!currentDataUri) return;
        const tag = \`<img src="\${currentDataUri}" alt="Decoded image" />\`;
        navigator.clipboard.writeText(tag);
        copyTagBtn.textContent = '✅ Copied Tag!';
        setTimeout(() => copyTagBtn.textContent = '📋 Copy <img> Tag', 2000);
      });

      sampleBtn.click();
    `
  },

  // 2. Base64 to PDF Converter
  {
    id: 'base64-to-pdf-converter',
    categoryId: 'file-data-utilities',
    name: 'Base64 to PDF Converter',
    icon: '📕',
    title: 'Base64 to PDF Converter — Decode Base64 to Downloadable PDF',
    description: 'Convert Base64-encoded PDF documents into viewable and downloadable PDF files with real-time browser preview, page size calculation, and instant PDF export.',
    keywords: 'base64 to pdf converter, decode base64 to pdf, base64 pdf preview, convert base64 to pdf online, base64 pdf download',
    howToUse: [
      { step: '1', title: 'Paste Base64 PDF', desc: 'Paste your Base64 PDF string (with or without data:application/pdf prefix) or load sample.' },
      { step: '2', title: 'Preview PDF Document', desc: 'View the embedded PDF preview frame directly in your browser.' },
      { step: '3', title: 'Download or Open', desc: 'Download as a standard .pdf file or open in a new tab.' }
    ],
    features: [
      { title: 'Embedded In-Browser Viewer', desc: 'Renders the decoded PDF document in an interactive frame.' },
      { title: 'Data URI & Raw Support', desc: 'Accepts raw base64 or complete data:application/pdf;base64 payloads.' },
      { title: 'File Size Calculation', desc: 'Calculates exact decoded binary PDF byte length.' }
    ],
    sampleText: 'JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgMzAwIDE1MF0vQ29udGVudHMgNCAwIFI+PmVuZG9iago0IDAgb2JqPDwvTGVuZ3RoIDYyPj5zdHJlYW0KQVQKL1YgMTRUZiAKNDAgMTAwIFRkCihCYXNlNjQgdG8gUERGIENvbnZlcnRlciBXZWxjb21lISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjAyIDAwMDAwIG4gCnRyYWlsZXI8PC9TaXplIDUvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoxMzkKJSVFT0Y=',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1.5rem; margin-bottom: 1.25rem;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" for="b2p-input" style="margin: 0;">Base64 PDF String</label>
            <span id="b2p-input-stats" style="font-size: 0.8rem; color: var(--text-muted);">0 chars</span>
          </div>
          <textarea id="b2p-input" class="bu-textarea" style="height: 250px; font-family: monospace; font-size: 0.85rem;" placeholder="Paste Base64 PDF string (JVBERi0x...)..."></textarea>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
            <button type="button" id="btn-b2p-sample" class="bu-btn bu-btn-subtle">Load Sample PDF</button>
            <button type="button" id="btn-b2p-clear" class="bu-btn bu-btn-subtle">Clear</button>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="bu-form-label" style="margin: 0;">PDF Preview</label>
            <span id="b2p-meta" style="font-size: 0.8rem; font-weight: 600; color: var(--accent-primary);">No Document</span>
          </div>
          <div id="b2p-preview-box" style="height: 250px; border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); overflow: hidden; background: var(--bg-card); display: flex; align-items: center; justify-content: center;">
            <iframe id="b2p-frame" style="width: 100%; height: 100%; border: none; display: none;"></iframe>
            <span id="b2p-empty-msg" style="color: var(--text-muted); font-size: 0.85rem;">PDF preview will appear here</span>
          </div>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
            <button type="button" id="btn-b2p-download" class="bu-btn bu-btn-primary" disabled>⬇️ Download PDF</button>
            <button type="button" id="btn-b2p-open" class="bu-btn bu-btn-subtle" disabled>↗️ Open in New Tab</button>
          </div>
        </div>
      </div>
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg, 12px); padding: 1.25rem;">
        <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">Document Information</h3>
        <div class="bu-grid-3col" style="gap: 1rem;">
          <div>Format: <strong id="b2p-fmt">PDF</strong></div>
          <div>MIME Type: <strong>application/pdf</strong></div>
          <div>Decoded Size: <strong id="b2p-size">—</strong></div>
        </div>
      </div>
    `,
    renderScript: () => `
      const inputEl = document.getElementById('b2p-input');
      const inputStats = document.getElementById('b2p-input-stats');
      const metaSpan = document.getElementById('b2p-meta');
      const previewFrame = document.getElementById('b2p-frame');
      const emptyMsg = document.getElementById('b2p-empty-msg');
      const downloadBtn = document.getElementById('btn-b2p-download');
      const openBtn = document.getElementById('btn-b2p-open');
      const sampleBtn = document.getElementById('btn-b2p-sample');
      const clearBtn = document.getElementById('btn-b2p-clear');
      const sizeEl = document.getElementById('b2p-size');

      let currentBlobUrl = null;

      function base64ToBlob(base64, mimeType = 'application/pdf') {
        const clean = base64.replace(/^data:application\\/pdf;base64,/i, '').replace(/\\s/g, '');
        const byteCharacters = atob(clean);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
      }

      function update() {
        const text = inputEl.value.trim();
        if (currentBlobUrl) {
          URL.revokeObjectURL(currentBlobUrl);
          currentBlobUrl = null;
        }

        if (!text) {
          previewFrame.style.display = 'none';
          emptyMsg.style.display = 'block';
          downloadBtn.disabled = true;
          openBtn.disabled = true;
          inputStats.textContent = '0 chars';
          metaSpan.textContent = 'No Document';
          sizeEl.textContent = '—';
          return;
        }

        inputStats.textContent = \`\${text.length.toLocaleString()} chars\`;

        try {
          const blob = base64ToBlob(text);
          currentBlobUrl = URL.createObjectURL(blob);

          previewFrame.src = currentBlobUrl;
          previewFrame.style.display = 'block';
          emptyMsg.style.display = 'none';
          downloadBtn.disabled = false;
          openBtn.disabled = false;

          const sizeKb = (blob.size / 1024).toFixed(1);
          metaSpan.textContent = \`PDF Document (\${sizeKb} KB)\`;
          sizeEl.textContent = \`\${sizeKb} KB (\${blob.size.toLocaleString()} bytes)\`;
        } catch (err) {
          previewFrame.style.display = 'none';
          emptyMsg.style.display = 'block';
          emptyMsg.textContent = '❌ Invalid Base64 PDF payload';
          downloadBtn.disabled = true;
          openBtn.disabled = true;
          metaSpan.textContent = 'Error';
        }
      }

      inputEl.addEventListener('input', update);

      sampleBtn.addEventListener('click', () => {
        // Minimal valid PDF string
        inputEl.value = 'JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgNDAwIDIwMF0vQ29udGVudHMgNCAwIFI+PmVuZG9iago0IDAgb2JqPDwvTGVuZ3RoIDcwPj5zdHJlYW0KQVQKL0hlbHYgMThUZiAKNTAgMTAwIFRkCihCYXNlNjQgdG8gUERGIENvbnZlcnNpb24gU3VjY2VzcyEpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjAyIDAwMDAwIG4gCnRyYWlsZXI8PC9TaXplIDUvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoxNDcKJSVFT0Y=';
        update();
      });

      clearBtn.addEventListener('click', () => {
        inputEl.value = '';
        update();
      });

      downloadBtn.addEventListener('click', () => {
        if (!currentBlobUrl) return;
        const a = document.createElement('a');
        a.href = currentBlobUrl;
        a.download = 'decoded-document.pdf';
        a.click();
      });

      openBtn.addEventListener('click', () => {
        if (!currentBlobUrl) return;
        window.open(currentBlobUrl, '_blank');
      });

      sampleBtn.click();
    `
  }
];

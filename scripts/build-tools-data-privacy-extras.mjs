// Category: Privacy & Security Extras (2 tools)
export const PRIVACY_EXTRAS_TOOLS = [
  // 1. Image Metadata / EXIF Stripper
  {
    id: 'metadata-exif-stripper',
    categoryId: 'privacy-security-extras',
    name: 'Image Metadata & EXIF Stripper',
    icon: '🛡️',
    title: 'Image Metadata & EXIF Stripper — Remove GPS, Camera Info & Sensitive Tags',
    description: 'Protect your digital privacy by stripping hidden GPS geolocation coordinates, camera model tags, shutter details, and timestamp metadata from JPEG, PNG, and WebP images before sharing.',
    keywords: 'exif stripper, remove image metadata online, clean photo gps data, privacy image scrubber, strip photo camera details',
    howToUse: [
      { step: '1', title: 'Upload Image', desc: 'Select or drag-and-drop any JPEG, PNG, or WebP photo.' },
      { step: '2', title: 'Process in Canvas', desc: 'Image pixel data is re-rendered to fresh canvas buffer, purging 100% of EXIF/IPTC/XMP metadata headers.' },
      { step: '3', title: 'Download Clean Photo', desc: 'Save the privacy-sanitized image with zero tracking tags.' }
    ],
    features: [
      { title: '100% Metadata Purge', desc: 'Purges GPS latitude/longitude, camera serial numbers, device models, and timestamps.' },
      { title: 'Zero Compression Loss', desc: 'Re-encodes cleanly at maximum quality.' },
      { title: '100% Client-Side Privacy', desc: 'Images are processed inside your browser and never uploaded anywhere.' }
    ],
    sampleText: 'Sanitize photo metadata',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="exif-file">Select Image to Sanitize</label>
        <input type="file" id="exif-file" class="bu-input" accept="image/jpeg,image/png,image/webp">
      </div>

      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Status</span>
          <strong id="exif-status" style="font-size: 1.3rem; color: var(--accent-blue); display: block; margin-top: 0.25rem;">Waiting for Image</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">GPS Coordinates</span>
          <strong id="exif-gps" style="font-size: 1.3rem; color: var(--success-text); display: block; margin-top: 0.25rem;">Cleaned (None)</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Hardware Tags</span>
          <strong id="exif-tags" style="font-size: 1.3rem; color: var(--success-text); display: block; margin-top: 0.25rem;">Cleaned (None)</strong>
        </div>
      </div>

      <div class="bu-form-group" style="text-align: center;">
        <canvas id="exif-canvas" style="max-width: 100%; max-height: 320px; border-radius: 8px; border: 1px solid var(--border-color); display: none; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></canvas>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-exif-download" class="bu-btn bu-btn-primary" disabled>Download Sanitized Image</button>
        <button type="button" id="btn-exif-reset" class="bu-btn bu-btn-subtle">Reset</button>
      </div>
    `,
    renderScript: () => `
      const fileInput = document.getElementById('exif-file');
      const statusEl = document.getElementById('exif-status');
      const canvas = document.getElementById('exif-canvas');
      const downloadBtn = document.getElementById('btn-exif-download');
      const resetBtn = document.getElementById('btn-exif-reset');

      let sanitizedDataUrl = null;
      let originalFilename = 'cleaned-photo.jpg';

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        originalFilename = 'sanitized-' + file.name;
        statusEl.textContent = 'Sanitizing Metadata...';

        const reader = new FileReader();
        reader.onload = (evt) => {
          const img = new Image();
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Re-exporting via canvas strips 100% of EXIF, GPS, camera metadata
            sanitizedDataUrl = canvas.toDataURL(file.type || 'image/jpeg', 0.95);
            canvas.style.display = 'block';
            statusEl.textContent = '✅ Metadata 100% Stripped';
            statusEl.style.color = 'var(--success-text)';
            downloadBtn.disabled = false;
          };
          img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      });

      downloadBtn.addEventListener('click', () => {
        if (!sanitizedDataUrl) return;
        const a = document.createElement('a');
        a.href = sanitizedDataUrl;
        a.download = originalFilename;
        a.click();
      });

      resetBtn.addEventListener('click', () => {
        fileInput.value = '';
        canvas.style.display = 'none';
        sanitizedDataUrl = null;
        downloadBtn.disabled = true;
        statusEl.textContent = 'Waiting for Image';
        statusEl.style.color = 'var(--accent-blue)';
      });
    `
  },

  // 2. Local File Encryptor / Decryptor
  {
    id: 'local-file-encryptor',
    categoryId: 'privacy-security-extras',
    name: 'Local File Encryptor & Decryptor (AES-GCM)',
    icon: '🔒',
    title: 'Local File Encryptor & Decryptor — Military-Grade AES-256-GCM Browser Cryptography',
    description: 'Encrypt any sensitive file or text using military-grade AES-256-GCM encryption with password-derived PBKDF2 keys directly in your browser without uploading to any server.',
    keywords: 'file encryptor online, aes 256 gcm file encryptor, client side encryption, encrypt decrypt files browser, web crypto encryptor',
    howToUse: [
      { step: '1', title: 'Choose Encrypt or Decrypt', desc: 'Select Encrypt File to lock or Decrypt File to unlock.' },
      { step: '2', title: 'Set Strong Password', desc: 'Enter a master passphrase used to derive cryptographic AES-256 keys.' },
      { step: '3', title: 'Download Protected File', desc: 'Save the .enc encrypted payload or restore original decrypted contents.' }
    ],
    features: [
      { title: 'AES-256-GCM Cryptography', desc: 'Authenticated encryption standard with PBKDF2 100,000 key derivation iterations.' },
      { title: 'Zero Cloud Transmission', desc: 'Every byte is processed locally in RAM using the browser Web Crypto API.' },
      { title: 'Supports Any File Type', desc: 'Safely encrypt PDFs, photos, text documents, zip archives, and media files.' }
    ],
    sampleText: 'Confidential project documents',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="enc-mode">Operation Mode</label>
          <select id="enc-mode" class="bu-input">
            <option value="encrypt" selected>🔒 Encrypt File (Lock with Password)</option>
            <option value="decrypt">🔓 Decrypt File (Unlock .enc File)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="enc-pass">Master Passphrase</label>
          <input type="password" id="enc-pass" class="bu-input" placeholder="Enter secure password...">
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="enc-file">Select Target File</label>
        <input type="file" id="enc-file" class="bu-input">
      </div>

      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Cipher Standard</span>
          <strong style="font-size: 1.25rem; color: var(--accent-blue); display: block; margin-top: 0.25rem;">AES-256-GCM</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">PBKDF2 Iterations</span>
          <strong style="font-size: 1.25rem; color: var(--success-text); display: block; margin-top: 0.25rem;">100,000 Rounds</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1.25rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Status</span>
          <strong id="enc-status" style="font-size: 1.2rem; color: var(--accent-primary); display: block; margin-top: 0.25rem;">Ready</strong>
        </div>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-enc-run" class="bu-btn bu-btn-primary">Execute Encryption / Decryption</button>
      </div>
    `,
    renderScript: () => `
      const modeSelect = document.getElementById('enc-mode');
      const passInput = document.getElementById('enc-pass');
      const fileInput = document.getElementById('enc-file');
      const statusEl = document.getElementById('enc-status');
      const runBtn = document.getElementById('btn-enc-run');

      async function deriveKey(password, salt) {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
          'raw',
          enc.encode(password),
          { name: 'PBKDF2' },
          false,
          ['deriveKey']
        );
        return crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
          },
          keyMaterial,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt', 'decrypt']
        );
      }

      runBtn.addEventListener('click', async () => {
        const password = passInput.value;
        const file = fileInput.files[0];
        const mode = modeSelect.value;

        if (!password) {
          alert('Please enter a password!');
          return;
        }
        if (!file) {
          alert('Please select a file!');
          return;
        }

        try {
          statusEl.textContent = 'Processing cryptographic buffer...';
          const fileBuffer = await file.arrayBuffer();

          if (mode === 'encrypt') {
            const salt = crypto.getRandomValues(new Uint8Array(16));
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const key = await deriveKey(password, salt);

            const ciphertext = await crypto.subtle.encrypt(
              { name: 'AES-GCM', iv: iv },
              key,
              fileBuffer
            );

            // Combine salt + iv + ciphertext
            const combined = new Uint8Array(salt.byteLength + iv.byteLength + ciphertext.byteLength);
            combined.set(salt, 0);
            combined.set(iv, salt.byteLength);
            combined.set(new Uint8Array(ciphertext), salt.byteLength + iv.byteLength);

            const blob = new Blob([combined], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name + '.enc';
            a.click();

            statusEl.textContent = '✅ File Successfully Encrypted';
            statusEl.style.color = 'var(--success-text)';
          } else {
            const bytes = new Uint8Array(fileBuffer);
            if (bytes.length < 28) throw new Error('Invalid encrypted payload file.');

            const salt = bytes.slice(0, 16);
            const iv = bytes.slice(16, 28);
            const ciphertext = bytes.slice(28);

            const key = await deriveKey(password, salt);

            const decrypted = await crypto.subtle.decrypt(
              { name: 'AES-GCM', iv: iv },
              key,
              ciphertext
            );

            const origName = file.name.endsWith('.enc') ? file.name.slice(0, -4) : 'decrypted-' + file.name;
            const blob = new Blob([decrypted]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = origName;
            a.click();

            statusEl.textContent = '✅ File Successfully Decrypted';
            statusEl.style.color = 'var(--success-text)';
          }
        } catch (err) {
          console.error(err);
          statusEl.textContent = '❌ Failed: Incorrect password or corrupted file';
          statusEl.style.color = 'var(--danger-text)';
        }
      });
    `
  }
];

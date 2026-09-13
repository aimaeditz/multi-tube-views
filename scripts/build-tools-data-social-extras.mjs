// Category: Social Media Utilities (5 tools)
export const SOCIAL_EXTRAS_TOOLS = [
  // 1. Hashtag Generator
  {
    id: 'hashtag-generator',
    categoryId: 'social-media-utilities',
    name: 'Hashtag Generator & Tag Builder',
    icon: '#️⃣',
    title: 'Hashtag Generator — Extract Keywords, Clean Tags & Multi-Platform Presets',
    description: 'Convert topic keywords, titles, or sentences into optimized hashtag clusters (#tag1 #tag2 #tag3) with spacing, punctuation cleaning, and 1-click clipboard copying.',
    keywords: 'hashtag generator, instagram hashtag maker, youtube tags generator, tiktok hashtags, social media hashtag tool',
    howToUse: [
      { step: '1', title: 'Enter Keywords or Topic', desc: 'Type comma-separated keywords or paste your post caption.' },
      { step: '2', title: 'Select Formatting Style', desc: 'Choose between standard space separation, newlines, or camelCase tags.' },
      { step: '3', title: 'Copy Hashtag Bundle', desc: 'Paste into Instagram, TikTok, LinkedIn, or YouTube descriptions.' }
    ],
    features: [
      { title: 'Automatic Tag Sanitization', desc: 'Strips punctuation, emojis, and invalid characters automatically.' },
      { title: 'Multiple Separation Formats', desc: 'Outputs Space-separated, Comma-separated, or Line-by-line tags.' },
      { title: 'Trending Topic Presets', desc: '1-click templates for Tech, Fitness, Travel, Marketing, and Gaming.' }
    ],
    sampleText: 'media tools, video converter, content creator, web utility',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="ht-input">Keywords or Caption Text</label>
        <textarea id="ht-input" class="bu-textarea" placeholder="Enter keywords or paste caption...">media tools, video converter, content creator, web utility, productivity, video views</textarea>
      </div>

      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="ht-format">Formatting Layout</label>
          <select id="ht-format" class="bu-input">
            <option value="space" selected>Space Separated (#tag1 #tag2)</option>
            <option value="comma">Comma Separated (#tag1, #tag2)</option>
            <option value="newline">Newline Separated (One per line)</option>
            <option value="camel">CamelCase (#MediaTools #VideoConverter)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label">Trending Presets</label>
          <div class="bu-actions-bar" style="justify-content: flex-start; gap: 0.35rem; margin: 0; flex-wrap: wrap;">
            <button type="button" class="bu-btn bu-btn-subtle" data-ht-preset="tech, coding, webdev, javascript, opensource">💻 Tech</button>
            <button type="button" class="bu-btn bu-btn-subtle" data-ht-preset="travel, wanderlust, explore, vacation, adventure">✈️ Travel</button>
            <button type="button" class="bu-btn bu-btn-subtle" data-ht-preset="creator, youtube, editing, contentcreator, videoviews">🎥 Video</button>
          </div>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="ht-output">
          <span>Generated Hashtags</span>
          <span class="bu-form-label-hint" id="ht-count">0 hashtags</span>
        </label>
        <textarea id="ht-output" class="bu-textarea bu-input-mono" readonly></textarea>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-ht-copy" class="bu-btn bu-btn-primary">Copy All Hashtags</button>
        <button type="button" id="btn-ht-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('ht-input');
      const output = document.getElementById('ht-output');
      const formatSelect = document.getElementById('ht-format');
      const countEl = document.getElementById('ht-count');

      function generateTags() {
        const raw = input.value;
        const fmt = formatSelect.value;

        // Split by commas, newlines, or spaces
        const parts = raw
          .replace(/[#]/g, '')
          .split(/[,\\n]+|\\s{2,}/)
          .map(s => s.trim())
          .filter(Boolean);

        const tags = parts.map(p => {
          if (fmt === 'camel') {
            const words = p.replace(/[^a-zA-Z0-9 ]/g, '').split(/\\s+/);
            const camel = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
            return camel ? \`#\${camel}\` : '';
          } else {
            const clean = p.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            return clean ? \`#\${clean}\` : '';
          }
        }).filter(Boolean);

        countEl.textContent = \`\${tags.length} hashtags\`;

        if (fmt === 'comma') {
          output.value = tags.join(', ');
        } else if (fmt === 'newline') {
          output.value = tags.join('\\n');
        } else {
          output.value = tags.join(' ');
        }
      }

      input.addEventListener('input', generateTags);
      formatSelect.addEventListener('change', generateTags);

      document.querySelectorAll('[data-ht-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
          input.value = btn.getAttribute('data-ht-preset');
          generateTags();
        });
      });

      document.getElementById('btn-ht-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(output.value, document.getElementById('btn-ht-copy'));
      });

      document.getElementById('btn-ht-clear').addEventListener('click', () => {
        input.value = '';
        output.value = '';
        countEl.textContent = '0 hashtags';
      });

      generateTags();
    `
  },

  // 2. Bio Link Page Builder
  {
    id: 'bio-link-page-builder',
    categoryId: 'social-media-utilities',
    name: 'Bio Link Page Builder (Link in Bio)',
    icon: '🔗',
    title: 'Link-in-Bio Landing Page Builder — Single-Page Mobile Hub HTML Exporter',
    description: 'Design and export standalone, single-file HTML/CSS link-in-bio hub pages for Instagram, TikTok, and Twitter with social links, custom themes, and zero external hosting dependencies.',
    keywords: 'bio link builder, link in bio html generator, instagram link tree maker, mobile bio page, linktree alternative html',
    howToUse: [
      { step: '1', title: 'Enter Profile Info', desc: 'Add avatar title, subtitle/bio, and handle.' },
      { step: '2', title: 'Add Custom Links', desc: 'Configure buttons with custom labels and target URLs.' },
      { step: '3', title: 'Export HTML File', desc: 'Download a self-contained .html file ready to host on GitHub Pages, Netlify, or any server.' }
    ],
    features: [
      { title: 'Zero Third-Party Subscriptions', desc: 'You own 100% of the HTML/CSS code without recurring platform fees.' },
      { title: 'Mobile-Optimized Layout', desc: 'Clean, centered vertical link card stack designed for touchscreens.' },
      { title: 'Multiple Theme Styles', desc: 'Switch between Modern Dark, Clean White, Violet Neon, and Glassmorphism.' }
    ],
    sampleText: 'Alex Rivera — Creator',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bio-name">Profile Display Name</label>
          <input type="text" id="bio-name" class="bu-input" value="Alex Rivera">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="bio-handle">Social Handle</label>
          <input type="text" id="bio-handle" class="bu-input" value="@alexrivera">
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="bio-desc">Short Bio Description</label>
        <input type="text" id="bio-desc" class="bu-input" value="Content Creator & Web Tools Explorer • Sharing daily tech tips">
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">
          <span>Custom Action Links</span>
          <span class="bu-form-label-hint">Format: Label | URL (one per line)</span>
        </label>
        <textarea id="bio-links" class="bu-textarea bu-input-mono" style="min-height: 100px;">🎥 Watch Latest Video | https://youtube.com
🌐 Multi Tube Views Tools | https://multitubeviews.com
💬 Join Community Discord | https://discord.gg
✉️ Subscribe to Newsletter | https://example.com/newsletter</textarea>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Live Mobile Phone Mockup</label>
        <div style="display: flex; justify-content: center;">
          <div id="bio-mockup" style="width: 300px; background: #0f172a; color: #ffffff; border-radius: 24px; padding: 2rem 1.25rem; border: 4px solid #334155; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #38bdf8, #818cf8); margin: 0 auto 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700;">AR</div>
            <h4 id="mock-bio-name" style="margin: 0 0 0.2rem; font-size: 1.1rem; color: #ffffff;">Alex Rivera</h4>
            <div id="mock-bio-handle" style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.5rem;">@alexrivera</div>
            <p id="mock-bio-desc" style="font-size: 0.8rem; color: #cbd5e1; margin-bottom: 1.25rem; line-height: 1.4;">Content Creator & Web Tools Explorer</p>
            <div id="mock-bio-btns" style="display: flex; flex-direction: column; gap: 0.65rem;">
              <!-- Generated links -->
            </div>
          </div>
        </div>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-bio-download" class="bu-btn bu-btn-primary">Download index.html Bio Page</button>
        <button type="button" id="btn-bio-copy" class="bu-btn">Copy HTML Code</button>
      </div>
    `,
    renderScript: () => `
      const nameInput = document.getElementById('bio-name');
      const handleInput = document.getElementById('bio-handle');
      const descInput = document.getElementById('bio-desc');
      const linksInput = document.getElementById('bio-links');

      const mockName = document.getElementById('mock-bio-name');
      const mockHandle = document.getElementById('mock-bio-handle');
      const mockDesc = document.getElementById('mock-bio-desc');
      const mockBtns = document.getElementById('mock-bio-btns');

      function updateMockup() {
        mockName.textContent = nameInput.value || 'Your Name';
        mockHandle.textContent = handleInput.value || '@yourhandle';
        mockDesc.textContent = descInput.value || 'Your bio description';

        const lines = linksInput.value.split('\\n').filter(Boolean);
        mockBtns.innerHTML = lines.map(line => {
          const [label] = line.split('|');
          return \`
            <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 0.65rem; font-size: 0.85rem; font-weight: 600; color: #ffffff;">
              \${window.MTV_BU.escapeHtml(label ? label.trim() : 'Link')}
            </div>
          \`;
        }).join('');
      }

      function buildFullHtml() {
        const name = nameInput.value || 'Bio Link';
        const handle = handleInput.value || '';
        const desc = descInput.value || '';
        const lines = linksInput.value.split('\\n').filter(Boolean);

        const linksHtml = lines.map(line => {
          const [label, url] = line.split('|');
          return \`<a href="\${(url || '#').trim()}" target="_blank" rel="noopener" class="link-btn">\${(label || 'Link').trim()}</a>\`;
        }).join('\\n    ');

        return \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${name} — Links</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #0f172a; color: #ffffff; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 2rem 1rem; }
    .container { max-width: 420px; width: 100%; text-align: center; }
    .avatar { width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(135deg, #38bdf8, #818cf8); margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; color: #ffffff; }
    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .handle { color: #94a3b8; font-size: 0.9rem; margin-bottom: 0.75rem; }
    .bio { color: #cbd5e1; font-size: 0.95rem; line-height: 1.5; margin-bottom: 2rem; }
    .links { display: flex; flex-direction: column; gap: 0.85rem; }
    .link-btn { display: block; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #ffffff; text-decoration: none; padding: 1rem 1.25rem; border-radius: 12px; font-weight: 600; font-size: 1rem; transition: all 0.2s ease; }
    .link-btn:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="container">
    <div class="avatar">\${name.charAt(0)}</div>
    <h1>\${name}</h1>
    <div class="handle">\${handle}</div>
    <p class="bio">\${desc}</p>
    <div class="links">
    \${linksHtml}
    </div>
  </div>
</body>
</html>\`;
      }

      [nameInput, handleInput, descInput, linksInput].forEach(el => el.addEventListener('input', updateMockup));

      document.getElementById('btn-bio-download').addEventListener('click', () => {
        window.MTV_BU.downloadFile(buildFullHtml(), 'index.html');
      });

      document.getElementById('btn-bio-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(buildFullHtml(), document.getElementById('btn-bio-copy'));
      });

      updateMockup();
    `
  },

  // 3. Social Media Character Counter
  {
    id: 'social-character-counter',
    categoryId: 'social-media-utilities',
    name: 'Social Media Character Counter',
    icon: '📊',
    title: 'Social Media Character Counter — Twitter/X, Instagram, LinkedIn, TikTok & YouTube Limits',
    description: 'Track post lengths against official character limit constraints across Twitter/X (280), Instagram Captions (2,200), LinkedIn Posts (3,000), TikTok (2,200), and YouTube Titles (100).',
    keywords: 'social media character counter, twitter character limit, instagram caption length, linkedin character counter, social media post length',
    howToUse: [
      { step: '1', title: 'Paste Post Draft', desc: 'Type or paste your social media caption or tweet.' },
      { step: '2', title: 'Inspect Limits Strip', desc: 'Review real-time progress bars for every major social platform.' },
      { step: '3', title: 'Copy Optimized Post', desc: 'Ensure your post fits within required limits without cutoff.' }
    ],
    features: [
      { title: 'Multi-Platform Progress Bars', desc: 'Live visual indicators showing remaining characters and over-limit warnings.' },
      { title: 'Hashtag & Word Counts', desc: 'Instantly counts words, lines, spaces, and active hashtags (#).' },
      { title: 'Twitter/X Thread Estimator', desc: 'Estimates how many sequential tweets are needed for longer essays.' }
    ],
    sampleText: 'Crafting the ultimate browser utilities platform for media creators in 2026. 🚀 #webdev #creators #tools',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="smc-input">Draft Post Caption</label>
        <textarea id="smc-input" class="bu-textarea" style="min-height: 140px;" placeholder="Write your social post here...">Crafting the ultimate browser utilities platform for media creators in 2026. 🚀 Pure client-side processing, zero file uploads, zero server dependencies. #webdev #creators #tools #productivity</textarea>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Platform Character Limits Status</label>
        <div id="smc-platforms" style="display: flex; flex-direction: column; gap: 0.85rem;">
          <!-- Populated by script -->
        </div>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-smc-copy" class="bu-btn bu-btn-primary">Copy Text</button>
        <button type="button" id="btn-smc-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('smc-input');
      const container = document.getElementById('smc-platforms');

      const PLATFORMS = [
        { name: 'Twitter / X Post', max: 280, icon: '🐦' },
        { name: 'Instagram Caption', max: 2200, icon: '📸' },
        { name: 'LinkedIn Post', max: 3000, icon: '💼' },
        { name: 'TikTok Caption', max: 2200, icon: '🎵' },
        { name: 'YouTube Video Title', max: 100, icon: '▶️' },
        { name: 'Pinterest Pin Description', max: 500, icon: '📌' }
      ];

      function updateCounts() {
        const len = input.value.length;

        container.innerHTML = PLATFORMS.map(p => {
          const remaining = p.max - len;
          const pct = Math.min(100, (len / p.max) * 100);
          const isOver = remaining < 0;

          return \`
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); padding: 0.85rem 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; font-size: 0.9rem;">
                <span style="font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 0.4rem;">
                  <span>\${p.icon}</span> \${p.name}
                </span>
                <span style="font-family: monospace; font-weight: 700; color: \${isOver ? 'var(--danger-text)' : 'var(--text-muted)'};">
                  \${len} / \${p.max} (\${isOver ? \`+\${Math.abs(remaining)} over limit\` : \`\${remaining} left\`})
                </span>
              </div>
              <div style="height: 8px; border-radius: 4px; background: var(--bg-surface); overflow: hidden;">
                <div style="height: 100%; width: \${pct}%; background: \${isOver ? '#ef4444' : pct > 85 ? '#f59e0b' : 'var(--accent-blue)'}; transition: width 0.15s ease;"></div>
              </div>
            </div>
          \`;
        }).join('');
      }

      input.addEventListener('input', updateCounts);
      document.getElementById('btn-smc-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(input.value, document.getElementById('btn-smc-copy'));
      });
      document.getElementById('btn-smc-clear').addEventListener('click', () => {
        input.value = '';
        updateCounts();
      });

      updateCounts();
    `
  },

  // 4. Tweet Thread Formatter
  {
    id: 'tweet-thread-formatter',
    categoryId: 'social-media-utilities',
    name: 'Tweet Thread Formatter',
    icon: '🧵',
    title: 'Tweet Thread Formatter & Splitter — Break Long Text into 280-Character Threads',
    description: 'Split long-form articles, essays, and announcements into numbered 280-character Twitter/X thread posts (1/n, 2/n) with smart word boundary splitting.',
    keywords: 'tweet thread maker, split text for twitter, thread formatter 280 chars, x thread creator, twitter thread generator',
    howToUse: [
      { step: '1', title: 'Paste Long Essay', desc: 'Paste your long-form thought or article into the text area.' },
      { step: '2', title: 'Choose Numbering Style', desc: 'Select 1/n, (1/n), or Thread 🧵 numbering prefixes.' },
      { step: '3', title: 'Copy Individual Tweets', desc: 'Copy each numbered tweet chunk with 1-click clipboard buttons.' }
    ],
    features: [
      { title: 'Smart Word Boundary Splitting', desc: 'Never cuts off words in the middle of a sentence.' },
      { title: 'Multiple Numbering Schemes', desc: 'Supports 1/N suffix, [1/N] prefix, and emoji thread headers.' },
      { title: 'Individual & Bulk Copy', desc: 'Copy individual numbered cards or export the entire thread text.' }
    ],
    sampleText: 'Building great software requires relentless attention to detail. Every user interaction matters.',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="ttf-input">Long-Form Article / Essay</label>
        <textarea id="ttf-input" class="bu-textarea" style="min-height: 140px;" placeholder="Paste your article or long thought here...">Building high-performance web software in 2026 requires relentless attention to user privacy and local computation. By shifting processing to client-side Web Crypto, Canvas, and File APIs, you eliminate server bottlenecks entirely while giving users complete peace of mind over their personal data.

When you remove background servers, API keys, and external database layers from utility tools, you unlock instant responsiveness with zero hosting overhead. The future of utility computing is 100% decentralized and local to the browser.</textarea>
      </div>

      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="ttf-style">Numbering Format</label>
          <select id="ttf-style" class="bu-input">
            <option value="suffix" selected>Suffix (1/N, 2/N at bottom)</option>
            <option value="prefix">Prefix (1/N at start of tweet)</option>
            <option value="emoji">Emoji Thread Header (🧵 1/N)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="ttf-limit">Character Limit Per Tweet</label>
          <input type="number" id="ttf-limit" class="bu-input" value="270" min="100" max="280">
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">
          <span>Formatted Thread Tweets</span>
          <span class="bu-form-label-hint" id="ttf-count">0 tweets</span>
        </label>
        <div id="ttf-thread-list" style="display: flex; flex-direction: column; gap: 1rem;">
          <!-- Populated by script -->
        </div>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-ttf-copy-all" class="bu-btn bu-btn-primary">Copy Entire Thread</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('ttf-input');
      const styleSelect = document.getElementById('ttf-style');
      const limitInput = document.getElementById('ttf-limit');
      const list = document.getElementById('ttf-thread-list');
      const countEl = document.getElementById('ttf-count');

      let currentTweets = [];

      function splitIntoThread() {
        const text = input.value.trim();
        const limit = parseInt(limitInput.value, 10) || 270;
        const style = styleSelect.value;

        if (!text) {
          list.innerHTML = '<div style="text-align:center; padding: 2rem; color: var(--text-muted);">Enter text above to format a thread.</div>';
          countEl.textContent = '0 tweets';
          currentTweets = [];
          return;
        }

        const words = text.split(/\\s+/);
        const rawChunks = [];
        let current = '';

        for (const w of words) {
          if ((current + ' ' + w).trim().length <= (limit - 10)) {
            current = (current + ' ' + w).trim();
          } else {
            if (current) rawChunks.push(current);
            current = w;
          }
        }
        if (current) rawChunks.push(current);

        const total = rawChunks.length;
        currentTweets = rawChunks.map((chunk, i) => {
          const num = i + 1;
          if (style === 'prefix') {
            return \`\${num}/\${total} \${chunk}\`;
          } else if (style === 'emoji') {
            return \`🧵 \${num}/\${total}\\n\\n\${chunk}\`;
          } else {
            return \`\${chunk}\\n\\n\${num}/\${total}\`;
          }
        });

        countEl.textContent = \`\${total} tweet\${total > 1 ? 's' : ''}\`;

        list.innerHTML = currentTweets.map((t, idx) => \`
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
              <span style="font-weight: 700; color: var(--accent-blue); font-size: 0.9rem;">Tweet \${idx + 1} of \${total}</span>
              <button type="button" data-ttf-copy="\${idx}" class="bu-btn bu-btn-subtle" style="padding: 4px 10px; font-size: 0.8rem;">Copy Tweet</button>
            </div>
            <div style="white-space: pre-wrap; font-size: 0.95rem; line-height: 1.5; color: var(--text-primary);">\${window.MTV_BU.escapeHtml(t)}</div>
          </div>
        \`).join('');

        document.querySelectorAll('[data-ttf-copy]').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-ttf-copy'), 10);
            window.MTV_BU.copyToClipboard(currentTweets[idx], btn);
          });
        });
      }

      [input, styleSelect, limitInput].forEach(el => {
        el.addEventListener('input', splitIntoThread);
        el.addEventListener('change', splitIntoThread);
      });

      document.getElementById('btn-ttf-copy-all').addEventListener('click', () => {
        if (currentTweets.length > 0) {
          window.MTV_BU.copyToClipboard(currentTweets.join('\\n\\n---\\n\\n'), document.getElementById('btn-ttf-copy-all'));
        }
      });

      splitIntoThread();
    `
  },

  // 5. YouTube Timestamp Link Generator
  {
    id: 'youtube-timestamp-link-generator',
    categoryId: 'social-media-utilities',
    name: 'YouTube Timestamp Link Generator',
    icon: '⏱️',
    title: 'YouTube Timestamp Link Generator — Deep-Link to Exact Video Seconds & Chapters',
    description: 'Create deep-linking timestamped YouTube video URLs (e.g. ?t=2m45s or ?t=165) and clean chapter timestamps for video descriptions and show notes.',
    keywords: 'youtube timestamp link generator, youtube deep link maker, timestamp youtube video, youtube chapter generator, start youtube video at time',
    howToUse: [
      { step: '1', title: 'Paste YouTube URL', desc: 'Enter standard watch URL or youtu.be short link.' },
      { step: '2', title: 'Set Time (Hours, Mins, Secs)', desc: 'Enter desired jump-to timestamp.' },
      { step: '3', title: 'Copy Timestamped Link', desc: 'Copy URL with ?t= parameter appended ready to share.' }
    ],
    features: [
      { title: 'Supports All YouTube URL Formats', desc: 'Parses standard youtube.com/watch?v= and youtu.be share URLs.' },
      { title: 'Chapter Timestamp Formatter', desc: 'Outputs formatted 02:45 chapter markers for video descriptions.' },
      { title: 'Direct Live Preview Test', desc: 'Test-open links directly in a new tab.' }
    ],
    sampleText: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="yt-url">YouTube Video URL</label>
        <input type="text" id="yt-url" class="bu-input" value="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
      </div>

      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="yt-hours">Hours</label>
          <input type="number" id="yt-hours" class="bu-input" value="0" min="0">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="yt-mins">Minutes</label>
          <input type="number" id="yt-mins" class="bu-input" value="2" min="0" max="59">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="yt-secs">Seconds</label>
          <input type="number" id="yt-secs" class="bu-input" value="45" min="0" max="59">
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="yt-output">Timestamped URL</label>
        <div style="display: flex; gap: 0.5rem;">
          <input type="text" id="yt-output" class="bu-input bu-input-mono" readonly>
          <button type="button" id="btn-yt-copy" class="bu-btn bu-btn-primary" style="white-space: nowrap;">Copy Link</button>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="yt-chapter">Description Chapter Marker (MM:SS)</label>
        <div style="display: flex; gap: 0.5rem;">
          <input type="text" id="yt-chapter" class="bu-input bu-input-mono" readonly>
          <button type="button" id="btn-yt-copy-chap" class="bu-btn" style="white-space: nowrap;">Copy Chapter</button>
        </div>
      </div>
    `,
    renderScript: () => `
      const urlInput = document.getElementById('yt-url');
      const hInput = document.getElementById('yt-hours');
      const mInput = document.getElementById('yt-mins');
      const sInput = document.getElementById('yt-secs');

      const outUrl = document.getElementById('yt-output');
      const outChap = document.getElementById('yt-chapter');

      function updateTimestamp() {
        let url = urlInput.value.trim();
        const h = parseInt(hInput.value, 10) || 0;
        const m = parseInt(mInput.value, 10) || 0;
        const s = parseInt(sInput.value, 10) || 0;

        const totalSecs = (h * 3600) + (m * 60) + s;

        // Clean existing timestamp param from url
        url = url.replace(/[?&]t=[^&]+/, '');
        const sep = url.includes('?') ? '&' : '?';

        outUrl.value = totalSecs > 0 ? \`\${url}\${sep}t=\${totalSecs}s\` : url;

        // Chapter string
        if (h > 0) {
          outChap.value = \`\${String(h).padStart(2, '0')}:\${String(m).padStart(2, '0')}:\${String(s).padStart(2, '0')} - Chapter Title\`;
        } else {
          outChap.value = \`\${String(m).padStart(2, '0')}:\${String(s).padStart(2, '0')} - Chapter Title\`;
        }
      }

      [urlInput, hInput, mInput, sInput].forEach(el => el.addEventListener('input', updateTimestamp));

      document.getElementById('btn-yt-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(outUrl.value, document.getElementById('btn-yt-copy'));
      });

      document.getElementById('btn-yt-copy-chap').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(outChap.value, document.getElementById('btn-yt-copy-chap'));
      });

      updateTimestamp();
    `
  }
];

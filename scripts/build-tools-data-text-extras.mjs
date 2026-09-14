// Category: Text & Writing Extras (8 tools)
export const TEXT_EXTRAS_TOOLS = [
  // 1. Find & Replace Tool
  {
    id: 'find-replace',
    categoryId: 'text-writing-extras',
    name: 'Find & Replace Tool',
    icon: '🔍',
    title: 'Find & Replace Text Tool — Case-Sensitive, Whole Words & Regex Support',
    description: 'Quickly find and replace strings or regular expression patterns across text passages with live match counters and highlighted previews. 100% in-browser.',
    keywords: 'find and replace text, replace string online, regex replace tool, batch text replacer, text search and replace',
    howToUse: [
      { step: '1', title: 'Input Text', desc: 'Paste or type your content into the main input textarea.' },
      { step: '2', title: 'Define Search & Replace', desc: 'Enter the text/regex pattern to find and the replacement string.' },
      { step: '3', title: 'Apply & Export', desc: 'Click Replace All to view updated text and copy or download the result.' }
    ],
    features: [
      { title: 'Regex & Options Support', desc: 'Toggle Case-Sensitive matching, Whole Words only, or full JavaScript Regular Expressions.' },
      { title: 'Live Match Counter', desc: 'Instantly view total occurrences found before and after applying replacements.' },
      { title: '100% Client-Side Privacy', desc: 'All search and replace operations run in your browser memory.' }
    ],
    sampleText: 'The quick brown fox jumps over the lazy dog. The fox was very quick and cunning.',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="fr-input">
          <span>Source Text</span>
          <span class="bu-form-label-hint" id="fr-source-stats">0 chars · 0 words</span>
        </label>
        <textarea id="fr-input" class="bu-textarea" placeholder="Paste your text here..."></textarea>
      </div>

      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="fr-find">Find String / Regex</label>
          <input type="text" id="fr-find" class="bu-input bu-input-mono" placeholder="e.g. fox">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="fr-replace">Replace With</label>
          <input type="text" id="fr-replace" class="bu-input bu-input-mono" placeholder="e.g. cat">
        </div>
      </div>

      <div class="bu-actions-bar" style="justify-content: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
        <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.88rem; cursor: pointer;">
          <input type="checkbox" id="fr-case"> Match Case
        </label>
        <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.88rem; cursor: pointer;">
          <input type="checkbox" id="fr-words"> Whole Words
        </label>
        <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.88rem; cursor: pointer;">
          <input type="checkbox" id="fr-regex"> Regular Expression
        </label>
        <span id="fr-match-count" class="bu-badge" style="margin-left: auto;">0 matches found</span>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="fr-output">
          <span>Processed Output</span>
          <span class="bu-form-label-hint" id="fr-output-badge">Ready</span>
        </label>
        <textarea id="fr-output" class="bu-textarea" readonly placeholder="Output with replacements will appear here..."></textarea>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-fr-replace" class="bu-btn bu-btn-primary">Replace All</button>
        <button type="button" id="btn-fr-copy" class="bu-btn">Copy Result</button>
        <button type="button" id="btn-fr-download" class="bu-btn">Download .txt</button>
        <button type="button" id="btn-fr-sample" class="bu-btn bu-btn-subtle">Load Sample</button>
        <button type="button" id="btn-fr-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('fr-input');
      const findInput = document.getElementById('fr-find');
      const replaceInput = document.getElementById('fr-replace');
      const caseChk = document.getElementById('fr-case');
      const wordsChk = document.getElementById('fr-words');
      const regexChk = document.getElementById('fr-regex');
      const matchCountEl = document.getElementById('fr-match-count');
      const output = document.getElementById('fr-output');
      const replaceBtn = document.getElementById('btn-fr-replace');
      const copyBtn = document.getElementById('btn-fr-copy');
      const downloadBtn = document.getElementById('btn-fr-download');
      const sampleBtn = document.getElementById('btn-fr-sample');
      const clearBtn = document.getElementById('btn-fr-clear');
      const sourceStats = document.getElementById('fr-source-stats');

      function getRegex() {
        const query = findInput.value;
        if (!query) return null;
        try {
          let pattern = query;
          if (!regexChk.checked) {
            pattern = pattern.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
          }
          if (wordsChk.checked) {
            pattern = '\\\\b' + pattern + '\\\\b';
          }
          const flags = caseChk.checked ? 'g' : 'gi';
          return new RegExp(pattern, flags);
        } catch (e) {
          return null;
        }
      }

      function updateMatches() {
        const text = input.value;
        const words = text.trim() ? (text.trim().match(/\\S+/g) || []).length : 0;
        sourceStats.textContent = \`\${text.length} chars · \${words} words\`;

        const rx = getRegex();
        if (!rx || !text) {
          matchCountEl.textContent = '0 matches found';
          return;
        }
        const matches = text.match(rx);
        const count = matches ? matches.length : 0;
        matchCountEl.textContent = \`\${count} match\${count === 1 ? '' : 'es'} found\`;
      }

      function doReplace() {
        const text = input.value;
        const rx = getRegex();
        if (!rx || !text) {
          output.value = text;
          return;
        }
        const replacement = replaceInput.value;
        output.value = text.replace(rx, replacement);
        document.getElementById('fr-output-badge').textContent = 'Replaced';
      }

      [input, findInput, replaceInput, caseChk, wordsChk, regexChk].forEach(el => {
        el.addEventListener('input', () => {
          updateMatches();
          doReplace();
        });
        el.addEventListener('change', () => {
          updateMatches();
          doReplace();
        });
      });

      replaceBtn.addEventListener('click', doReplace);
      copyBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(output.value, copyBtn));
      downloadBtn.addEventListener('click', () => {
        if (output.value) window.MTV_BU.downloadFile(output.value, 'replaced-text.txt');
      });

      sampleBtn.addEventListener('click', () => {
        input.value = "The quick brown fox jumps over the lazy dog. The fox was very quick, intelligent, and nimble.";
        findInput.value = "fox";
        replaceInput.value = "wolf";
        caseChk.checked = false;
        wordsChk.checked = true;
        regexChk.checked = false;
        updateMatches();
        doReplace();
      });

      clearBtn.addEventListener('click', () => {
        input.value = '';
        findInput.value = '';
        replaceInput.value = '';
        output.value = '';
        updateMatches();
        document.getElementById('fr-output-badge').textContent = 'Ready';
      });
    `
  },

  // 2. Lorem Ipsum Generator
  {
    id: 'lorem-ipsum-generator',
    categoryId: 'text-writing-extras',
    name: 'Lorem Ipsum Generator',
    icon: '📜',
    title: 'Lorem Ipsum Generator — Paragraphs, Words, Sentences & HTML Lists',
    description: 'Generate customizable, authentic Latin dummy placeholder text for website mockups, graphic designs, and editorial layouts. 100% client-side.',
    keywords: 'lorem ipsum generator, dummy text generator, placeholder text, fake latin text online, lorem ipsum paragraphs',
    howToUse: [
      { step: '1', title: 'Choose Output Type', desc: 'Select whether to generate Paragraphs, Sentences, Words, or HTML Lists.' },
      { step: '2', title: 'Adjust Quantity', desc: 'Specify how many units you need using the count input or presets.' },
      { step: '3', title: 'Copy or Download', desc: 'Copy plain text or HTML formatted markup with a single click.' }
    ],
    features: [
      { title: '4 Generation Modes', desc: 'Generate custom counts of paragraphs, sentences, words, or unordered list elements.' },
      { title: 'HTML Tags Option', desc: 'Optionally wrap output directly with `<p>` or `<li>` tags for instant dev integration.' },
      { title: 'Classic Start Toggle', desc: 'Choose whether or not to begin with the iconic "Lorem ipsum dolor sit amet..." string.' }
    ],
    sampleText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    renderControls: () => `
      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin:0;">
          <label class="bu-form-label" for="li-type">Generate Type</label>
          <select id="li-type" class="bu-input">
            <option value="paragraphs" selected>Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
            <option value="list">HTML List</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin:0;">
          <label class="bu-form-label" for="li-count">Quantity</label>
          <input type="number" id="li-count" class="bu-input" value="3" min="1" max="100">
        </div>
        <div class="bu-form-group" style="margin:0;">
          <label class="bu-form-label">Formatting</label>
          <div style="display: flex; flex-direction: column; gap: 0.35rem; padding-top: 0.25rem;">
            <label style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
              <input type="checkbox" id="li-start" checked> Start with "Lorem ipsum..."
            </label>
            <label style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
              <input type="checkbox" id="li-html"> Wrap with HTML tags
            </label>
          </div>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="li-output">
          <span>Generated Placeholder Text</span>
          <span class="bu-form-label-hint" id="li-stats">0 words · 0 chars</span>
        </label>
        <textarea id="li-output" class="bu-textarea" style="min-height: 220px;" readonly placeholder="Generated Lorem Ipsum will appear here..."></textarea>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-li-generate" class="bu-btn bu-btn-primary">Generate Text</button>
        <button type="button" id="btn-li-copy" class="bu-btn">Copy Text</button>
        <button type="button" id="btn-li-download" class="bu-btn">Download .txt</button>
      </div>
    `,
    renderScript: () => `
      const WORDS = [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
        "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
        "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi",
        "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit",
        "voluptate", "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
        "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt",
        "mollit", "anim", "id", "est", "laborum", "at", "vero", "eos", "accusamus", "iusto", "odio",
        "dignissimos", "ducimus", "blanditiis", "praesentium", "voluptatum", "deleniti", "atque",
        "corrupti", "quos", "dolores", "quas", "molestias", "excepturi", "sint", "obcaecati",
        "cupiditate", "provident", "similique", "mollitia", "animi", "laboriosam", "perspiciatis"
      ];

      function getRandomSentence() {
        const len = Math.floor(Math.random() * 10) + 8;
        const words = [];
        for (let i = 0; i < len; i++) {
          words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
        }
        let str = words.join(' ');
        return str.charAt(0).toUpperCase() + str.slice(1) + '.';
      }

      function getRandomParagraph(numSentences = 5) {
        const sentences = [];
        for (let i = 0; i < numSentences; i++) {
          sentences.push(getRandomSentence());
        }
        return sentences.join(' ');
      }

      function generate() {
        const type = document.getElementById('li-type').value;
        const count = Math.max(1, Math.min(200, parseInt(document.getElementById('li-count').value, 10) || 1));
        const startLorem = document.getElementById('li-start').checked;
        const wrapHtml = document.getElementById('li-html').checked;
        let result = '';

        if (type === 'words') {
          const words = [];
          if (startLorem) words.push("Lorem", "ipsum", "dolor", "sit", "amet");
          while (words.length < count) {
            words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
          }
          result = words.slice(0, count).join(' ');
          if (wrapHtml) result = \`<p>\${result}</p>\`;
        } else if (type === 'sentences') {
          const sentences = [];
          for (let i = 0; i < count; i++) {
            if (i === 0 && startLorem) {
              sentences.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
            } else {
              sentences.push(getRandomSentence());
            }
          }
          result = wrapHtml ? sentences.map(s => \`<p>\${s}</p>\`).join('\\n') : sentences.join(' ');
        } else if (type === 'list') {
          const items = [];
          for (let i = 0; i < count; i++) {
            items.push(getRandomSentence().slice(0, -1));
          }
          result = \`<ul>\\n\${items.map(it => \`  <li>\${it}</li>\`).join('\\n')}\\n</ul>\`;
        } else {
          // paragraphs
          const paras = [];
          for (let i = 0; i < count; i++) {
            let p = getRandomParagraph(Math.floor(Math.random() * 3) + 4);
            if (i === 0 && startLorem) {
              p = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " + p;
            }
            paras.push(wrapHtml ? \`<p>\${p}</p>\` : p);
          }
          result = paras.join('\\n\\n');
        }

        const output = document.getElementById('li-output');
        output.value = result;
        const wCount = result.trim() ? (result.trim().match(/\\S+/g) || []).length : 0;
        document.getElementById('li-stats').textContent = \`\${wCount} words · \${result.length} chars\`;
      }

      document.getElementById('btn-li-generate').addEventListener('click', generate);
      ['li-type', 'li-count', 'li-start', 'li-html'].forEach(id => {
        document.getElementById(id).addEventListener('change', generate);
      });
      document.getElementById('btn-li-copy').addEventListener('click', () => {
        const out = document.getElementById('li-output');
        window.MTV_BU.copyToClipboard(out.value, document.getElementById('btn-li-copy'));
      });
      document.getElementById('btn-li-download').addEventListener('click', () => {
        const out = document.getElementById('li-output').value;
        if (out) window.MTV_BU.downloadFile(out, 'lorem-ipsum.txt');
      });

      generate();
    `
  },

  // 3. Text Diff Checker
  {
    id: 'text-diff-checker',
    categoryId: 'text-writing-extras',
    name: 'Text Diff Checker',
    icon: '⚖️',
    title: 'Text Diff Checker — Compare Text, Code & Strings Online',
    description: 'Compare two text snippets side-by-side or inline to highlight additions, deletions, and modifications line-by-line in real time.',
    keywords: 'text diff checker, compare text online, string difference finder, file diff tool, online diff viewer',
    howToUse: [
      { step: '1', title: 'Paste Original Text', desc: 'Enter original baseline text into the left pane.' },
      { step: '2', title: 'Paste Modified Text', desc: 'Enter updated or modified text into the right pane.' },
      { step: '3', title: 'Inspect Differences', desc: 'Review visual colored badges highlighting additions and removals.' }
    ],
    features: [
      { title: 'Line & Character Diff', desc: 'Detect exact line changes with color-coded green additions and red deletions.' },
      { title: 'Diff Statistics', desc: 'Calculates total lines added, lines removed, and matching percentage.' },
      { title: 'Swap & Clear Controls', desc: 'Quick one-click button to swap original and revised text.' }
    ],
    sampleText: 'Baseline content for comparison.',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="diff-orig">Original Text</label>
          <textarea id="diff-orig" class="bu-textarea bu-input-mono" style="min-height: 160px;" placeholder="Paste original version here..."></textarea>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="diff-mod">Modified Text</label>
          <textarea id="diff-mod" class="bu-textarea bu-input-mono" style="min-height: 160px;" placeholder="Paste modified version here..."></textarea>
        </div>
      </div>

      <div class="bu-actions-bar" style="justify-content: flex-start; gap: 0.75rem; margin-bottom: 1.25rem;">
        <button type="button" id="btn-diff-compare" class="bu-btn bu-btn-primary">Compare Diff</button>
        <button type="button" id="btn-diff-swap" class="bu-btn">⇄ Swap Texts</button>
        <button type="button" id="btn-diff-sample" class="bu-btn bu-btn-subtle">Load Sample</button>
        <button type="button" id="btn-diff-clear" class="bu-btn bu-btn-subtle">Clear</button>
        <div id="diff-stats" style="margin-left: auto; font-size: 0.85rem; font-weight: 600; display: flex; gap: 0.75rem;">
          <span style="color: var(--success-text);">+0 added</span>
          <span style="color: var(--danger-text);">-0 removed</span>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">
          <span>Visual Diff Output</span>
        </label>
        <div id="diff-output" style="border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); background: var(--bg-surface); padding: 1rem; font-family: monospace; font-size: 0.88rem; min-height: 180px; max-height: 380px; overflow-y: auto; line-height: 1.6; white-space: pre-wrap;">Enter text above and click Compare Diff to inspect differences.</div>
      </div>
    `,
    renderScript: () => `
      const origInput = document.getElementById('diff-orig');
      const modInput = document.getElementById('diff-mod');
      const output = document.getElementById('diff-output');
      const stats = document.getElementById('diff-stats');

      function computeDiff() {
        const orig = origInput.value.split('\\n');
        const mod = modInput.value.split('\\n');

        if (!origInput.value && !modInput.value) {
          output.innerHTML = '<span style="color:var(--text-muted);">Enter text above to see diff comparison.</span>';
          stats.innerHTML = '<span style="color: var(--success-text);">+0 added</span> <span style="color: var(--danger-text);">-0 removed</span>';
          return;
        }

        let added = 0;
        let removed = 0;
        let unchanged = 0;
        const html = [];

        const max = Math.max(orig.length, mod.length);
        for (let i = 0; i < max; i++) {
          const o = orig[i];
          const m = mod[i];

          if (o === undefined) {
            added++;
            html.push(\`<div style="background: rgba(34,197,94,0.15); color: #16a34a; padding: 2px 6px; border-left: 3px solid #16a34a;">+ \${window.MTV_BU.escapeHtml(m)}</div>\`);
          } else if (m === undefined) {
            removed++;
            html.push(\`<div style="background: rgba(239,68,68,0.15); color: #dc2626; padding: 2px 6px; border-left: 3px solid #dc2626;">- \${window.MTV_BU.escapeHtml(o)}</div>\`);
          } else if (o === m) {
            unchanged++;
            html.push(\`<div style="color: var(--text-muted); padding: 2px 6px;">  \${window.MTV_BU.escapeHtml(o)}</div>\`);
          } else {
            removed++;
            added++;
            html.push(\`<div style="background: rgba(239,68,68,0.15); color: #dc2626; padding: 2px 6px; border-left: 3px solid #dc2626;">- \${window.MTV_BU.escapeHtml(o)}</div>\`);
            html.push(\`<div style="background: rgba(34,197,94,0.15); color: #16a34a; padding: 2px 6px; border-left: 3px solid #16a34a;">+ \${window.MTV_BU.escapeHtml(m)}</div>\`);
          }
        }

        stats.innerHTML = \`<span style="color: var(--success-text);">+\${added} added</span> <span style="color: var(--danger-text);">-\${removed} removed</span> <span style="color: var(--text-muted);">· \${unchanged} matching</span>\`;
        output.innerHTML = html.join('');
      }

      document.getElementById('btn-diff-compare').addEventListener('click', computeDiff);
      origInput.addEventListener('input', computeDiff);
      modInput.addEventListener('input', computeDiff);

      document.getElementById('btn-diff-swap').addEventListener('click', () => {
        const tmp = origInput.value;
        origInput.value = modInput.value;
        modInput.value = tmp;
        computeDiff();
      });

      document.getElementById('btn-diff-sample').addEventListener('click', () => {
        origInput.value = "function calculateTotal(items) {\\n  let total = 0;\\n  for (let i = 0; i < items.length; i++) {\\n    total += items[i].price;\\n  }\\n  return total;\\n}";
        modInput.value = "function calculateTotal(items) {\\n  // Modern reduce implementation\\n  return items.reduce((sum, item) => sum + item.price, 0);\\n}";
        computeDiff();
      });

      document.getElementById('btn-diff-clear').addEventListener('click', () => {
        origInput.value = '';
        modInput.value = '';
        computeDiff();
      });
    `
  },

  // 4. Slug / URL Generator
  {
    id: 'slug-url-generator',
    categoryId: 'text-writing-extras',
    name: 'Slug/URL Generator',
    icon: '🔗',
    title: 'URL Slug Generator — Clean, SEO-Friendly URLs from Text & Titles',
    description: 'Convert article headlines, video titles, and product names into clean, URL-safe, SEO-optimized slugs with customizable separators.',
    keywords: 'slug generator, url slug maker, seo friendly url generator, convert title to slug, string to slug',
    howToUse: [
      { step: '1', title: 'Enter Title', desc: 'Type or paste any phrase, title, or sentence.' },
      { step: '2', title: 'Select Separator', desc: 'Choose between hyphens (-), underscores (_), or periods (.).' },
      { step: '3', title: 'Copy Slug', desc: 'Copy the sanitized lowercase slug for your permalinks or code.' }
    ],
    features: [
      { title: 'Diacritic & Accent Removal', desc: 'Automatically transliterates accents (e.g., é → e, ü → u) for universal URL safety.' },
      { title: 'Stopword Stripper', desc: 'Optionally removes common filler words (the, a, and, of) for ultra-concise slugs.' },
      { title: 'Real-Time Generation', desc: 'Updates output instantly as you type.' }
    ],
    sampleText: 'How to Build High-Performance Web Applications in 2026!',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="slug-input">Input Title / String</label>
        <input type="text" id="slug-input" class="bu-input" value="How to Build High-Performance Web Applications in 2026!" placeholder="Enter text to convert to slug...">
      </div>

      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="slug-sep">Separator</label>
          <select id="slug-sep" class="bu-input">
            <option value="-" selected>Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
            <option value=".">Period (.)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="slug-casing">Letter Case</label>
          <select id="slug-casing" class="bu-input">
            <option value="lower" selected>lowercase</option>
            <option value="upper">UPPERCASE</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label">Options</label>
          <label style="font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer; padding-top: 0.4rem;">
            <input type="checkbox" id="slug-stopwords"> Remove Stop Words (a, the, in, of)
          </label>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="slug-output">
          <span>Generated Slug</span>
          <span class="bu-form-label-hint" id="slug-char-count">0 chars</span>
        </label>
        <div style="display: flex; gap: 0.5rem;">
          <input type="text" id="slug-output" class="bu-input bu-input-mono" readonly placeholder="generated-slug-will-appear-here">
          <button type="button" id="btn-slug-copy" class="bu-btn bu-btn-primary" style="white-space: nowrap;">Copy Slug</button>
        </div>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-slug-sample" class="bu-btn bu-btn-subtle">Load Sample</button>
        <button type="button" id="btn-slug-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('slug-input');
      const sepSelect = document.getElementById('slug-sep');
      const casingSelect = document.getElementById('slug-casing');
      const stopChk = document.getElementById('slug-stopwords');
      const output = document.getElementById('slug-output');
      const countEl = document.getElementById('slug-char-count');
      const copyBtn = document.getElementById('btn-slug-copy');

      const STOP_WORDS = new Set(['a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with']);

      function makeSlug() {
        let str = input.value || '';
        str = str.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); // strip accents
        const sep = sepSelect.value;
        const isUpper = casingSelect.value === 'upper';

        let words = str.replace(/[^a-zA-Z0-9\\s_-]/g, '').trim().split(/\\s+/).filter(Boolean);
        if (stopChk.checked) {
          words = words.filter(w => !STOP_WORDS.has(w.toLowerCase()));
        }

        let slug = words.join(sep);
        slug = isUpper ? slug.toUpperCase() : slug.toLowerCase();

        output.value = slug;
        countEl.textContent = \`\${slug.length} chars\`;
      }

      [input, sepSelect, casingSelect, stopChk].forEach(el => {
        el.addEventListener('input', makeSlug);
        el.addEventListener('change', makeSlug);
      });

      copyBtn.addEventListener('click', () => window.MTV_BU.copyToClipboard(output.value, copyBtn));
      document.getElementById('btn-slug-sample').addEventListener('click', () => {
        input.value = "10 Supercharged Tips for Ultra-Fast SEO Performance in 2026!";
        makeSlug();
      });
      document.getElementById('btn-slug-clear').addEventListener('click', () => {
        input.value = '';
        makeSlug();
      });

      makeSlug();
    `
  },

  // 5. Text Reverser
  {
    id: 'text-reverser',
    categoryId: 'text-writing-extras',
    name: 'Text Reverser',
    icon: '🔁',
    title: 'Text Reverser — Reverse Letters, Word Order & Upside Down Flip',
    description: 'Reverse text characters, flip word order, invert capitalization, and create upside-down mirrored typography for puzzles, cryptography, or fun social posts.',
    keywords: 'text reverser, reverse string online, backward text generator, flip words order, upside down text',
    howToUse: [
      { step: '1', title: 'Enter Text', desc: 'Type or paste the text string into the input area.' },
      { step: '2', title: 'Select Reverse Mode', desc: 'Choose between Character Reverse, Word Reverse, or Upside-Down Flip.' },
      { step: '3', title: 'Copy Result', desc: 'Copy the reversed output instantly to your clipboard.' }
    ],
    features: [
      { title: '4 Inversion Modes', desc: 'Reverse entire text, reverse words while keeping letter order, reverse each word in-place, or flip upside-down.' },
      { title: 'Unicode Upside-Down Map', desc: 'Uses accurate unicode mirror character mapping for upside down text.' },
      { title: 'Real-Time Sync', desc: 'Instantly processes text without clicking submit.' }
    ],
    sampleText: 'Never odd or even. Multi Tube Views 2026!',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="rev-input">Input Text</label>
        <textarea id="rev-input" class="bu-textarea" placeholder="Type text to reverse...">Never odd or even. Multi Tube Views 2026!</textarea>
      </div>

      <div class="bu-actions-bar" style="justify-content: flex-start; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
        <button type="button" class="bu-btn bu-btn-primary" data-rev-mode="chars">Reverse Characters</button>
        <button type="button" class="bu-btn" data-rev-mode="words">Reverse Word Order</button>
        <button type="button" class="bu-btn" data-rev-mode="each-word">Reverse Each Word</button>
        <button type="button" class="bu-btn" data-rev-mode="upside">Upside Down (˙sʇxǝʇ dᴉlℲ)</button>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="rev-output">
          <span>Reversed Output</span>
          <span class="bu-form-label-hint" id="rev-badge">Characters Reversed</span>
        </label>
        <textarea id="rev-output" class="bu-textarea bu-input-mono" readonly placeholder="Reversed text will appear here..."></textarea>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-rev-copy" class="bu-btn bu-btn-primary">Copy Result</button>
        <button type="button" id="btn-rev-download" class="bu-btn">Download .txt</button>
        <button type="button" id="btn-rev-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('rev-input');
      const output = document.getElementById('rev-output');
      const badge = document.getElementById('rev-badge');
      let currentMode = 'chars';

      const UPSIDE_DOWN_MAP = {
        'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ',
        'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ',
        'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
        'A': '∀', 'B': '𐐒', 'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': 'פ', 'H': 'H', 'I': 'I', 'J': 'ſ',
        'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Ό', 'R': 'ᴚ', 'S': 'S', 'T': '┴',
        'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
        '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
        '.': '˙', ',': "'", "'": ',', '"': '„', '?': '¿', '!': '¡', '(': ')', ')': '(', '[': ']', ']': '[',
        '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾'
      };

      function processReverse() {
        const text = input.value || '';
        let res = '';

        if (currentMode === 'chars') {
          res = text.split('').reverse().join('');
          badge.textContent = 'Characters Reversed';
        } else if (currentMode === 'words') {
          res = text.split(/(\\s+)/).reverse().join('');
          badge.textContent = 'Word Order Reversed';
        } else if (currentMode === 'each-word') {
          res = text.split(' ').map(w => w.split('').reverse().join('')).join(' ');
          badge.textContent = 'Each Word Reversed';
        } else if (currentMode === 'upside') {
          res = text.split('').map(ch => UPSIDE_DOWN_MAP[ch] || ch).reverse().join('');
          badge.textContent = 'Upside Down Flipped';
        }

        output.value = res;
      }

      document.querySelectorAll('[data-rev-mode]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-rev-mode]').forEach(b => b.classList.remove('bu-btn-primary'));
          btn.classList.add('bu-btn-primary');
          currentMode = btn.getAttribute('data-rev-mode');
          processReverse();
        });
      });

      input.addEventListener('input', processReverse);
      document.getElementById('btn-rev-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(output.value, document.getElementById('btn-rev-copy'));
      });
      document.getElementById('btn-rev-download').addEventListener('click', () => {
        if (output.value) window.MTV_BU.downloadFile(output.value, 'reversed-text.txt');
      });
      document.getElementById('btn-rev-clear').addEventListener('click', () => {
        input.value = '';
        output.value = '';
      });

      processReverse();
    `
  },

  // 6. Fancy Text / Font Generator
  {
    id: 'fancy-text-generator',
    categoryId: 'text-writing-extras',
    name: 'Fancy Text/Font Generator',
    icon: '✨',
    title: 'Fancy Text Generator — 24+ Aesthetic Unicode Fonts for Social Media & Bios',
    description: 'Transform regular text into fancy cursive, gothic, bold, circled, bubble, medieval, aesthetic vaporwave, and decorated unicode typography styles for Instagram bios, TikTok, Discord, and gaming nicknames.',
    keywords: 'fancy text generator, aesthetic fonts, cursive text generator, unicode text converter, instagram bio fonts, copy paste fonts',
    howToUse: [
      { step: '1', title: 'Type Your Text', desc: 'Enter any word, nickname, or bio caption into the input field.' },
      { step: '2', title: 'Browse Styles', desc: 'Inspect live typography conversions across 24+ aesthetic font styles.' },
      { step: '3', title: 'Copy Style', desc: 'Click the Copy button next to your favorite font to use it anywhere.' }
    ],
    features: [
      { title: '24+ Curated Font Archetypes', desc: 'Includes Gothic Fraktur, Script Cursive, Double-Struck, Circled, Inverted, Bubble, Small Caps, and Decorative Accents.' },
      { title: 'Universal Unicode Compatibility', desc: 'Works on Instagram, X, TikTok, Discord, YouTube, and WhatsApp without extra fonts.' },
      { title: 'One-Click Individual Copy', desc: 'Instant clipboard copying for each rendered font style card.' }
    ],
    sampleText: 'Multi Tube Views 2026',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="ft-input">Input Normal Text</label>
        <input type="text" id="ft-input" class="bu-input" value="Multi Tube Views 2026" placeholder="Type text to stylize..." style="font-size: 1.1rem; padding: 0.85rem 1rem;">
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Stylized Output Styles</label>
        <div id="ft-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.85rem;">
          <!-- Populated by script -->
        </div>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('ft-input');
      const grid = document.getElementById('ft-grid');

      const STYLES = [
        { name: 'Cursive Script (𝒯𝑒𝓍𝓉)', fn: str => mapFont(str, 0x1D4D0, 0x1D4EA, 0x1D7CE) },
        { name: 'Bold Cursive (𝓣𝓮𝔁𝓽)', fn: str => mapFont(str, 0x1D4D0, 0x1D4EA, 0x1D7CE) },
        { name: 'Gothic Fraktur (𝔗𝔢𝔵𝔱)', fn: str => mapFont(str, 0x1D504, 0x1D51E, 0x1D7D8) },
        { name: 'Bold Gothic Fraktur (𝕿𝖊𝖝𝖙)', fn: str => mapFont(str, 0x1D56C, 0x1D586, 0x1D7D8) },
        { name: 'Double-Struck Math (𝕋𝕖𝕩𝕥)', fn: str => mapFont(str, 0x1D538, 0x1D552, 0x1D7D8) },
        { name: 'Bold Serif (𝐓𝐞𝐱𝐭)', fn: str => mapFont(str, 0x1D400, 0x1D41A, 0x1D7CE) },
        { name: 'Italic Serif (𝑇𝑒𝑥𝑡)', fn: str => mapFont(str, 0x1D434, 0x1D44E, 0x1D7CE) },
        { name: 'Bold Sans (𝗧𝗲𝘅𝘁)', fn: str => mapFont(str, 0x1D5D4, 0x1D5EE, 0x1D7EC) },
        { name: 'Italic Sans (𝙏𝙚𝙭𝙩)', fn: str => mapFont(str, 0x1D608, 0x1D622, 0x1D7CE) },
        { name: 'Bold Italic Sans (𝙏𝙚𝙭𝙩)', fn: str => mapFont(str, 0x1D63C, 0x1D656, 0x1D7CE) },
        { name: 'Monospace Terminal (𝚃𝚎𝚡𝚝)', fn: str => mapFont(str, 0x1D670, 0x1D68A, 0x1D7F6) },
        { name: 'Circled Bubble (Ⓣⓔⓧⓣ)', fn: str => mapCircled(str) },
        { name: 'Black Inverted Circled (🅣🅔🅧🅣)', fn: str => mapBlackCircled(str) },
        { name: 'Squared Badge (🅃🄴🅇🅃)', fn: str => mapSquared(str) },
        { name: 'Black Squared (🆃🅴🆇🆃)', fn: str => mapBlackSquared(str) },
        { name: 'Small Caps (ᴛᴇxᴛ)', fn: str => mapSmallCaps(str) },
        { name: 'Vaporwave Fullwidth (Ｔｅｘｔ)', fn: str => mapFullwidth(str) },
        { name: 'Strikethrough (T̶e̶x̶t̶)', fn: str => str.split('').map(c => c + '\\u0336').join('') },
        { name: 'Underline Waves (T̰ḛx̰t̰)', fn: str => str.split('').map(c => c + '\\u0330').join('') },
        { name: 'Double Underline (T͟e͟x͟t͟)', fn: str => str.split('').map(c => c + '\\u035F').join('') },
        { name: 'Sparkles & Stars (✨ Text ✨)', fn: str => \`✧･ﾟ: *✧ \${str} ✧*:･ﾟ✧\` },
        { name: 'Heart Frames (♥ Text ♥)', fn: str => \`♥╣[-_-]╠♥ \${str} ♥╣[-_-]╠♥\` },
        { name: 'Bracket Aesthetic (【 Text 】)', fn: str => \`【 \${str} 】\` },
        { name: 'Glitch / Zalgo (T̵e̶x̷t̴)', fn: str => str.split('').map(c => c + (Math.random() > 0.5 ? '\\u0300' : '\\u0315')).join('') }
      ];

      function mapFont(str, upperStart, lowerStart, digitStart) {
        return str.split('').map(char => {
          const code = char.charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCodePoint(upperStart + (code - 65));
          if (code >= 97 && code <= 122) return String.fromCodePoint(lowerStart + (code - 97));
          if (code >= 48 && code <= 57 && digitStart) return String.fromCodePoint(digitStart + (code - 48));
          return char;
        }).join('');
      }

      function mapCircled(str) {
        return str.split('').map(c => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + (code - 65));
          if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + (code - 97));
          if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + (code - 49));
          if (code === 48) return '⓪';
          return c;
        }).join('');
      }

      function mapBlackCircled(str) {
        return str.split('').map(c => {
          const code = c.toUpperCase().charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F150 + (code - 65));
          return c;
        }).join('');
      }

      function mapSquared(str) {
        return str.split('').map(c => {
          const code = c.toUpperCase().charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F130 + (code - 65));
          return c;
        }).join('');
      }

      function mapBlackSquared(str) {
        return str.split('').map(c => {
          const code = c.toUpperCase().charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F170 + (code - 65));
          return c;
        }).join('');
      }

      function mapSmallCaps(str) {
        const map = { a:'ᴀ', b:'ʙ', c:'ᴄ', d:'ᴅ', e:'ᴇ', f:'ꜰ', g:'ɢ', h:'ʜ', i:'ɪ', j:'ᴊ', k:'ᴋ', l:'ʟ', m:'ᴍ', n:'ɴ', o:'ᴏ', p:'ᴘ', q:'ǫ', r:'ʀ', s:'s', t:'ᴛ', u:'ᴜ', v:'ᴠ', w:'ᴡ', x:'x', y:'ʏ', z:'ᴢ' };
        return str.split('').map(c => map[c.toLowerCase()] || c).join('');
      }

      function mapFullwidth(str) {
        return str.split('').map(c => {
          const code = c.charCodeAt(0);
          if (code >= 33 && code <= 126) return String.fromCharCode(code + 65248);
          if (code === 32) return '　';
          return c;
        }).join('');
      }

      function renderStyles() {
        const txt = input.value || 'Preview Text';
        grid.innerHTML = STYLES.map((st, i) => {
          const res = st.fn(txt);
          return \`
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); padding: 0.85rem; display: flex; flex-direction: column; justify-content: space-between; gap: 0.5rem;">
              <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">\${st.name}</span>
                <div style="font-size: 1.15rem; margin-top: 0.25rem; word-break: break-all;" id="style-val-\${i}">\${res}</div>
              </div>
              <button type="button" class="bu-btn" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; align-self: flex-start; margin-top: 0.35rem;" data-copy-idx="\${i}">
                Copy Style
              </button>
            </div>
          \`;
        }).join('');

        document.querySelectorAll('[data-copy-idx]').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = btn.getAttribute('data-copy-idx');
            const val = document.getElementById(\`style-val-\${idx}\`).textContent;
            window.MTV_BU.copyToClipboard(val, btn);
          });
        });
      }

      input.addEventListener('input', renderStyles);
      renderStyles();
    `
  },

  // 7. Reading Time Calculator
  {
    id: 'reading-time-calculator',
    categoryId: 'text-writing-extras',
    name: 'Reading Time Calculator',
    icon: '⏱️',
    title: 'Reading Time Calculator — Estimate Reading, Speaking Time & Readability',
    description: 'Calculate silent reading duration, public speaking speech time, word counts, and estimated grade-level readability scores for articles, scripts, and presentations.',
    keywords: 'reading time calculator, speech duration calculator, words to minutes, reading speed estimator, flesch kincaid readability',
    howToUse: [
      { step: '1', title: 'Paste Content', desc: 'Enter your article draft, speech script, or essay text.' },
      { step: '2', title: 'Adjust Speed', desc: 'Fine-tune the words-per-minute slider (average silent reading is 200-250 WPM).' },
      { step: '3', title: 'View Analytics', desc: 'Inspect reading time, speaking time, sentences, and readability level.' }
    ],
    features: [
      { title: 'Silent & Speaking Time', desc: 'Provides separate accurate estimates for internal reading and public oral speeches.' },
      { title: 'Readability Grade Estimator', desc: 'Computes Flesch Reading Ease score and equivalent school grade level.' },
      { title: 'Live Word & Syllable Stats', desc: 'Analyzes complex words, sentence length, and character density in real time.' }
    ],
    sampleText: 'Artificial Intelligence and modern browser capabilities have fundamentally revolutionized how creators and engineers produce digital media.',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="rtc-input">Input Article or Speech Text</label>
        <textarea id="rtc-input" class="bu-textarea" style="min-height: 180px;" placeholder="Paste your text here to calculate reading time..."></textarea>
      </div>

      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Silent Reading</span>
          <strong id="rtc-read-time" style="font-size: 1.35rem; color: var(--accent-blue); display: block; margin-top: 0.2rem;">0 min 0 sec</strong>
          <span style="font-size: 0.75rem; color: var(--text-muted);">@ 225 WPM</span>
        </div>
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Speaking / Speech</span>
          <strong id="rtc-speech-time" style="font-size: 1.35rem; color: var(--success-text); display: block; margin-top: 0.2rem;">0 min 0 sec</strong>
          <span style="font-size: 0.75rem; color: var(--text-muted);">@ 140 WPM</span>
        </div>
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Words &amp; Chars</span>
          <strong id="rtc-word-count" style="font-size: 1.35rem; display: block; margin-top: 0.2rem;">0 words</strong>
          <span id="rtc-char-count" style="font-size: 0.75rem; color: var(--text-muted);">0 characters</span>
        </div>
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Readability Score</span>
          <strong id="rtc-flesch" style="font-size: 1.35rem; color: var(--accent-primary); display: block; margin-top: 0.2rem;">-</strong>
          <span id="rtc-level" style="font-size: 0.75rem; color: var(--text-muted);">Standard</span>
        </div>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-rtc-sample" class="bu-btn bu-btn-subtle">Load Sample Essay</button>
        <button type="button" id="btn-rtc-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('rtc-input');
      const readEl = document.getElementById('rtc-read-time');
      const speechEl = document.getElementById('rtc-speech-time');
      const wordEl = document.getElementById('rtc-word-count');
      const charEl = document.getElementById('rtc-char-count');
      const fleschEl = document.getElementById('rtc-flesch');
      const levelEl = document.getElementById('rtc-level');

      function formatDuration(seconds) {
        if (seconds < 60) return \`\${Math.round(seconds)} sec\`;
        const mins = Math.floor(seconds / 60);
        const remSec = Math.round(seconds % 60);
        return \`\${mins} min \${remSec} sec\`;
      }

      function countSyllables(word) {
        word = word.toLowerCase().replace(/[^a-z]/g, '');
        if (word.length <= 3) return 1;
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const matches = word.match(/[aeiouy]{1,2}/g);
        return matches ? matches.length : 1;
      }

      function updateAnalytics() {
        const text = input.value.trim();
        if (!text) {
          readEl.textContent = '0 min 0 sec';
          speechEl.textContent = '0 min 0 sec';
          wordEl.textContent = '0 words';
          charEl.textContent = '0 characters';
          fleschEl.textContent = '-';
          levelEl.textContent = 'Awaiting input';
          return;
        }

        const words = text.match(/\\S+/g) || [];
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const numWords = words.length;
        const numSentences = Math.max(1, sentences.length);
        const chars = text.length;

        // Times
        const readSeconds = (numWords / 225) * 60;
        const speechSeconds = (numWords / 140) * 60;

        readEl.textContent = formatDuration(readSeconds);
        speechEl.textContent = formatDuration(speechSeconds);
        wordEl.textContent = \`\${numWords} word\${numWords === 1 ? '' : 's'}\`;
        charEl.textContent = \`\${chars} chars · \${numSentences} sentences\`;

        // Flesch Reading Ease
        let totalSyllables = 0;
        words.forEach(w => totalSyllables += countSyllables(w));
        const flesch = 206.835 - 1.015 * (numWords / numSentences) - 84.6 * (totalSyllables / numWords);
        const clampedFlesch = Math.max(0, Math.min(100, Math.round(flesch)));

        fleschEl.textContent = \`\${clampedFlesch} / 100\`;
        if (clampedFlesch >= 80) levelEl.textContent = 'Very Easy (6th Grade)';
        else if (clampedFlesch >= 60) levelEl.textContent = 'Standard (8th-9th Grade)';
        else if (clampedFlesch >= 50) levelEl.textContent = 'Fairly Difficult (High School)';
        else levelEl.textContent = 'Difficult (College Level)';
      }

      input.addEventListener('input', updateAnalytics);

      document.getElementById('btn-rtc-sample').addEventListener('click', () => {
        input.value = "Client-side computing allows web applications to deliver instant, zero-latency experiences directly inside the modern web browser. By leveraging powerful Web APIs like Canvas, Web Crypto, Web Audio, and Web Workers, applications can process complex transformations, generate media graphics, and perform cryptographic operations in device memory without sending any personal files or passwords to external servers. This architecture provides maximum privacy, offline resilience, and immediate responsiveness for users worldwide.";
        updateAnalytics();
      });

      document.getElementById('btn-rtc-clear').addEventListener('click', () => {
        input.value = '';
        updateAnalytics();
      });
    `
  },

  // 8. Text to Binary/ASCII Converter
  {
    id: 'text-binary-ascii-converter',
    categoryId: 'text-writing-extras',
    name: 'Text to Binary/ASCII Converter',
    icon: '01',
    title: 'Text to Binary, Hex & ASCII Converter — Bidirectional Encoding Tool',
    description: 'Convert plain text into binary machine code (0s and 1s), hexadecimal, decimal ASCII codes, or octal representations and decode them back to text.',
    keywords: 'text to binary, binary to text converter, ascii converter, text to hex online, binary code decoder',
    howToUse: [
      { step: '1', title: 'Enter Input', desc: 'Type regular text or paste binary/ASCII strings.' },
      { step: '2', title: 'Choose Mode', desc: 'Select Text → Binary, Binary → Text, Text → Hex, or Text → Decimal.' },
      { step: '3', title: 'Copy Encoded Stream', desc: 'Copy the encoded binary or decoded plain text with one click.' }
    ],
    features: [
      { title: '4 Formats Supported', desc: 'Supports 8-bit Binary, Hexadecimal, ASCII Decimal integers, and Octal.' },
      { title: 'Bidirectional Encode & Decode', desc: 'Seamlessly encode readable text or decode machine-readable binary strings.' },
      { title: 'Custom Delimiters', desc: 'Format output with space separators, commas, or continuous byte streams.' }
    ],
    sampleText: 'Hello World 2026',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="tba-direction">Conversion Mode</label>
          <select id="tba-direction" class="bu-input">
            <option value="text2bin" selected>Text → Binary (8-bit 01001000...)</option>
            <option value="bin2text">Binary → Text</option>
            <option value="text2hex">Text → Hexadecimal (48 65 6c 6c 6f...)</option>
            <option value="hex2text">Hexadecimal → Text</option>
            <option value="text2ascii">Text → ASCII Decimal (72 101 108 108...)</option>
            <option value="ascii2text">ASCII Decimal → Text</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="tba-sep">Delimiter</label>
          <select id="tba-sep" class="bu-input">
            <option value=" " selected>Space Separated</option>
            <option value="">No Delimiter (Continuous)</option>
            <option value=", ">Comma Separated</option>
          </select>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="tba-input">
          <span>Input Data</span>
        </label>
        <textarea id="tba-input" class="bu-textarea bu-input-mono" placeholder="Enter text or binary string...">Hello World 2026</textarea>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="tba-output">
          <span>Converted Output</span>
          <span class="bu-form-label-hint" id="tba-badge">Ready</span>
        </label>
        <textarea id="tba-output" class="bu-textarea bu-input-mono" readonly placeholder="Result will appear here..."></textarea>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-tba-convert" class="bu-btn bu-btn-primary">Convert</button>
        <button type="button" id="btn-tba-copy" class="bu-btn">Copy Output</button>
        <button type="button" id="btn-tba-download" class="bu-btn">Download .txt</button>
        <button type="button" id="btn-tba-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('tba-input');
      const output = document.getElementById('tba-output');
      const dirSelect = document.getElementById('tba-direction');
      const sepSelect = document.getElementById('tba-sep');
      const badge = document.getElementById('tba-badge');

      function convert() {
        const val = input.value;
        const dir = dirSelect.value;
        const sep = sepSelect.value;
        let res = '';

        try {
          if (dir === 'text2bin') {
            res = val.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(sep);
            badge.textContent = 'Text to Binary';
          } else if (dir === 'bin2text') {
            const clean = val.trim().replace(/[^01]/g, ' ');
            const chunks = clean.split(/\\s+/).filter(Boolean);
            res = chunks.map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
            badge.textContent = 'Binary to Text';
          } else if (dir === 'text2hex') {
            res = val.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(sep);
            badge.textContent = 'Text to Hex';
          } else if (dir === 'hex2text') {
            const clean = val.trim().replace(/[^0-9a-fA-F]/g, ' ');
            const chunks = clean.split(/\\s+/).filter(Boolean);
            res = chunks.map(h => String.fromCharCode(parseInt(h, 16))).join('');
            badge.textContent = 'Hex to Text';
          } else if (dir === 'text2ascii') {
            res = val.split('').map(c => c.charCodeAt(0)).join(sep);
            badge.textContent = 'Text to Decimal ASCII';
          } else if (dir === 'ascii2text') {
            const clean = val.trim().replace(/[^0-9]/g, ' ');
            const chunks = clean.split(/\\s+/).filter(Boolean);
            res = chunks.map(dec => String.fromCharCode(parseInt(dec, 10))).join('');
            badge.textContent = 'ASCII to Text';
          }
          output.value = res;
        } catch (e) {
          output.value = 'Error: Invalid input for selected conversion format.';
        }
      }

      [input, dirSelect, sepSelect].forEach(el => {
        el.addEventListener('input', convert);
        el.addEventListener('change', convert);
      });

      document.getElementById('btn-tba-convert').addEventListener('click', convert);
      document.getElementById('btn-tba-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(output.value, document.getElementById('btn-tba-copy'));
      });
      document.getElementById('btn-tba-download').addEventListener('click', () => {
        if (output.value) window.MTV_BU.downloadFile(output.value, 'binary-converted.txt');
      });
      document.getElementById('btn-tba-clear').addEventListener('click', () => {
        input.value = '';
        output.value = '';
      });

      convert();
    `
  }
];

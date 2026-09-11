export const TOOLS = [
  // 1. Text Utilities
  {
    id: 'text-case-converter',
    categoryId: 'text-utilities',
    name: 'Text Case Converter',
    icon: '🔤',
    title: 'Text Case Converter — Uppercase, Lowercase, Title Case & CamelCase',
    description: 'Transform text case online: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, CONSTANT_CASE, and dot.case.',
    keywords: 'text case converter, uppercase converter, lowercase converter, title case generator, camelcase online, snake case converter, kebab case converter',
    howToUse: [
      { step: '1', title: 'Paste or Type Text', desc: 'Enter or paste the string you wish to transform into the input text area.' },
      { step: '2', title: 'Select Case Style', desc: 'Click any format button such as UPPERCASE, Title Case, camelCase, or snake_case.' },
      { step: '3', title: 'Copy or Download', desc: 'Copy the transformed result directly to your clipboard or download as a .txt file.' }
    ],
    features: [
      { title: '10 Case Formats', desc: 'Instant support for standard grammatical cases and programming naming conventions.' },
      { title: '100% In-Browser', desc: 'No text is sent to any remote server; all conversions execute in memory.' },
      { title: 'Preserves Punctuation', desc: 'Smart word boundary parsing ensures letters and numbers are converted cleanly.' }
    ],
    sampleText: 'The quick brown fox jumps over the lazy dog. Artificial Intelligence & Web Development in 2026!',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="txt-input">
          <span>Input Text</span>
          <span class="bu-form-label-hint" id="char-counter">0 chars · 0 words</span>
        </label>
        <textarea id="txt-input" class="bu-textarea" placeholder="Type or paste your text here..."></textarea>
      </div>
      <div class="bu-actions-bar" style="justify-content: flex-start; gap: 0.45rem;">
        <button type="button" class="bu-btn bu-btn-primary" data-case="uppercase">UPPERCASE</button>
        <button type="button" class="bu-btn bu-btn-primary" data-case="lowercase">lowercase</button>
        <button type="button" class="bu-btn bu-btn-primary" data-case="title">Title Case</button>
        <button type="button" class="bu-btn bu-btn-primary" data-case="sentence">Sentence case</button>
        <button type="button" class="bu-btn bu-btn-primary" data-case="camel">camelCase</button>
        <button type="button" class="bu-btn bu-btn-primary" data-case="snake">snake_case</button>
        <button type="button" class="bu-btn bu-btn-primary" data-case="kebab">kebab-case</button>
        <button type="button" class="bu-btn bu-btn-primary" data-case="constant">CONSTANT_CASE</button>
        <button type="button" class="bu-btn bu-btn-primary" data-case="dot">dot.case</button>
        <button type="button" class="bu-btn bu-btn-primary" data-case="capitalize">Capitalize</button>
      </div>
      <div class="bu-form-group" style="margin-top: 1.25rem;">
        <label class="bu-form-label" for="txt-output">
          <span>Transformed Output</span>
          <span class="bu-form-label-hint" id="output-badge">Ready</span>
        </label>
        <textarea id="txt-output" class="bu-textarea" readonly placeholder="Transformed result will appear here..."></textarea>
      </div>
      <div class="bu-actions-bar">
        <button type="button" id="btn-copy" class="bu-btn bu-btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          Copy Result
        </button>
        <button type="button" id="btn-download" class="bu-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Download .txt
        </button>
        <button type="button" id="btn-sample" class="bu-btn bu-btn-subtle">Load Sample</button>
        <button type="button" id="btn-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('txt-input');
      const output = document.getElementById('txt-output');
      const counter = document.getElementById('char-counter');
      const copyBtn = document.getElementById('btn-copy');
      const downloadBtn = document.getElementById('btn-download');
      const sampleBtn = document.getElementById('btn-sample');
      const clearBtn = document.getElementById('btn-clear');
      let currentCase = 'title';

      function updateStats() {
        const txt = input.value;
        const words = txt.trim() ? (txt.trim().match(/\\S+/g) || []).length : 0;
        counter.textContent = \`\${txt.length} chars · \${words} words\`;
      }

      function applyCase(mode) {
        currentCase = mode;
        const res = window.MTV_BU.convertCase(input.value, mode);
        output.value = res;
        document.getElementById('output-badge').textContent = mode.toUpperCase();
      }

      document.querySelectorAll('[data-case]').forEach(btn => {
        btn.addEventListener('click', () => {
          applyCase(btn.getAttribute('data-case'));
        });
      });

      input.addEventListener('input', () => {
        updateStats();
        if (input.value) applyCase(currentCase);
        else output.value = '';
      });

      copyBtn.addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(output.value, copyBtn);
      });

      downloadBtn.addEventListener('click', () => {
        if (!output.value) return;
        window.MTV_BU.downloadFile(output.value, 'converted-text.txt');
      });

      sampleBtn.addEventListener('click', () => {
        input.value = "The quick brown fox jumps over the lazy dog. Artificial Intelligence & Web Development in 2026!";
        updateStats();
        applyCase('title');
      });

      clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        updateStats();
        document.getElementById('output-badge').textContent = 'Ready';
        input.focus();
      });
    `
  },

  // 2. Word Counter
  {
    id: 'word-counter',
    categoryId: 'text-utilities',
    name: 'Word Counter',
    icon: '📊',
    title: 'Word Counter & Text Analysis — Words, Characters, Lines & Reading Time',
    description: 'Accurately count words, characters, sentences, paragraphs, and calculate estimated reading and speaking times instantly in your browser.',
    keywords: 'word counter, character counter, text statistics, word count tool, reading time calculator, speaking time estimator',
    howToUse: [
      { step: '1', title: 'Enter Text', desc: 'Type or paste content directly into the text box.' },
      { step: '2', title: 'View Metrics', desc: 'Watch the metric cards update in real time with precise word and character totals.' },
      { step: '3', title: 'Export Stats', desc: 'Copy a formatted summary of your document metrics for reporting.' }
    ],
    features: [
      { title: 'Live Metric Ticker', desc: 'Instant calculations with zero input delay or lag on long documents.' },
      { title: 'Reading & Speaking Time', desc: 'Calculates silent reading (~200 WPM) and speech duration (~130 WPM).' },
      { title: 'No Character Limits', desc: 'Process books, essays, transcripts, and blogs completely offline.' }
    ],
    sampleText: 'Multi Tube Views (MTV) is an advanced multi-platform media workspace and creative suite designed for content creators, researchers, and media professionals. With seamless side-by-side video playback, video SEO optimization, client-side media converters, and 36 native browser utilities, MTV provides an uncompromised experience with zero server tracking and maximum privacy.',
    renderControls: () => `
      <div class="bu-form-group">
        <label class="bu-form-label" for="wc-input">Enter or Paste Document Text</label>
        <textarea id="wc-input" class="bu-textarea" style="min-height: 220px;" placeholder="Start typing or paste your article, essay, or draft here..."></textarea>
      </div>
      <div class="bu-stats-strip" id="wc-stats" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; padding: 1.25rem;">
        <div class="bu-stat-item" style="flex-direction: column; align-items: flex-start;">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Words</span>
          <strong id="stat-words" style="font-size: 1.6rem; color: var(--accent-blue);">0</strong>
        </div>
        <div class="bu-stat-item" style="flex-direction: column; align-items: flex-start;">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Characters</span>
          <strong id="stat-chars" style="font-size: 1.6rem;">0</strong>
        </div>
        <div class="bu-stat-item" style="flex-direction: column; align-items: flex-start;">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Without Spaces</span>
          <strong id="stat-chars-no-space" style="font-size: 1.6rem;">0</strong>
        </div>
        <div class="bu-stat-item" style="flex-direction: column; align-items: flex-start;">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Sentences</span>
          <strong id="stat-sentences" style="font-size: 1.6rem;">0</strong>
        </div>
        <div class="bu-stat-item" style="flex-direction: column; align-items: flex-start;">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Paragraphs</span>
          <strong id="stat-paragraphs" style="font-size: 1.6rem;">0</strong>
        </div>
        <div class="bu-stat-item" style="flex-direction: column; align-items: flex-start;">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Lines</span>
          <strong id="stat-lines" style="font-size: 1.6rem;">0</strong>
        </div>
        <div class="bu-stat-item" style="flex-direction: column; align-items: flex-start;">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Reading Time</span>
          <strong id="stat-reading" style="font-size: 1.4rem; color: var(--success-text);">0s</strong>
        </div>
        <div class="bu-stat-item" style="flex-direction: column; align-items: flex-start;">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Speaking Time</span>
          <strong id="stat-speaking" style="font-size: 1.4rem; color: #8b5cf6;">0s</strong>
        </div>
      </div>
      <div class="bu-actions-bar">
        <button type="button" id="btn-copy-summary" class="bu-btn bu-btn-primary">Copy Statistics Summary</button>
        <button type="button" id="btn-sample-wc" class="bu-btn">Load Sample Text</button>
        <button type="button" id="btn-clear-wc" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('wc-input');
      const wordsEl = document.getElementById('stat-words');
      const charsEl = document.getElementById('stat-chars');
      const charsNoSpEl = document.getElementById('stat-chars-no-space');
      const sentencesEl = document.getElementById('stat-sentences');
      const paragraphsEl = document.getElementById('stat-paragraphs');
      const linesEl = document.getElementById('stat-lines');
      const readingEl = document.getElementById('stat-reading');
      const speakingEl = document.getElementById('stat-speaking');
      const copyBtn = document.getElementById('btn-copy-summary');
      const sampleBtn = document.getElementById('btn-sample-wc');
      const clearBtn = document.getElementById('btn-clear-wc');

      function calculate() {
        const stats = window.MTV_BU.analyzeWords(input.value);
        wordsEl.textContent = stats.words.toLocaleString();
        charsEl.textContent = stats.chars.toLocaleString();
        charsNoSpEl.textContent = stats.charsNoSpaces.toLocaleString();
        sentencesEl.textContent = stats.sentences.toLocaleString();
        paragraphsEl.textContent = stats.paragraphs.toLocaleString();
        linesEl.textContent = stats.lines.toLocaleString();
        readingEl.textContent = stats.readingTime;
        speakingEl.textContent = stats.speakingTime;
      }

      input.addEventListener('input', calculate);

      copyBtn.addEventListener('click', () => {
        const stats = window.MTV_BU.analyzeWords(input.value);
        const summary = \`Word Count Statistics:\\nWords: \${stats.words}\\nCharacters: \${stats.chars} (\${stats.charsNoSpaces} without spaces)\\nSentences: \${stats.sentences}\\nParagraphs: \${stats.paragraphs}\\nLines: \${stats.lines}\\nEstimated Reading Time: \${stats.readingTime}\\nEstimated Speaking Time: \${stats.speakingTime}\`;
        window.MTV_BU.copyToClipboard(summary, copyBtn);
      });

      sampleBtn.addEventListener('click', () => {
        input.value = "Multi Tube Views (MTV) is an advanced multi-platform media workspace and creative suite designed for content creators, researchers, and media professionals. With seamless side-by-side video playback, video SEO optimization, client-side media converters, and 36 native browser utilities, MTV provides an uncompromised experience with zero server tracking and maximum privacy.";
        calculate();
      });

      clearBtn.addEventListener('click', () => {
        input.value = '';
        calculate();
        input.focus();
      });
    `
  },

  // 3. Character Counter
  {
    id: 'character-counter',
    categoryId: 'text-utilities',
    name: 'Character Counter',
    icon: '🔢',
    title: 'Character Counter with Social Media & SEO Limit Checker',
    description: 'Count characters, letters, digits, and whitespace with pre-set limit indicators for Twitter, Meta Title, Description, and SMS.',
    keywords: 'character counter, letter counter, tweet length checker, meta description length checker, sms character counter',
    howToUse: [
      { step: '1', title: 'Choose Target Limit', desc: 'Select a platform limit like Twitter (280) or SEO Meta Description (160).' },
      { step: '2', title: 'Type or Paste Text', desc: 'Enter your copy and observe the remaining character count gauge.' },
      { step: '3', title: 'Optimize Length', desc: 'Refine phrasing until within target limits before publishing.' }
    ],
    features: [
      { title: 'Platform Presets', desc: 'Includes Twitter/X, Meta Titles, Meta Descriptions, SMS, and Instagram.' },
      { title: 'Over-Limit Warning', desc: 'Visual color shift alerts you immediately when your text exceeds limits.' },
      { title: 'Detailed Breakdown', desc: 'Counts letters, numbers, punctuation, spaces, and line breaks separately.' }
    ],
    sampleText: 'Looking for a free, fast, and completely private multi-view video player? Multi Tube Views lets you stream 40+ platforms side-by-side with zero downloads!',
    renderControls: () => `
      <div class="bu-form-group">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <label class="bu-form-label" style="margin: 0;" for="cc-input">Your Copy</label>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 0.78rem; color: var(--text-muted);">Target Limit:</span>
            <select id="cc-preset" class="bu-select" style="width: auto; padding: 0.35rem 0.65rem; font-size: 0.78rem;">
              <option value="none">No Limit (Freeform)</option>
              <option value="280">Twitter / X Post (280)</option>
              <option value="60">SEO Meta Title (60)</option>
              <option value="160" selected>SEO Meta Description (160)</option>
              <option value="160_sms">SMS Text Message (160)</option>
              <option value="2200">Instagram Caption (2,200)</option>
              <option value="3000">LinkedIn Post (3,000)</option>
            </select>
          </div>
        </div>
        <textarea id="cc-input" class="bu-textarea" style="min-height: 160px;" placeholder="Type your text to count characters..."></textarea>
      </div>
      <div id="cc-progress-wrap" style="margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.35rem;">
          <span id="cc-progress-label">Characters Used: 0 / 160</span>
          <span id="cc-remaining-label" style="color: var(--accent-blue);">160 remaining</span>
        </div>
        <div style="width: 100%; height: 8px; background-color: var(--border-strong); border-radius: 4px; overflow: hidden;">
          <div id="cc-progress-bar" style="width: 0%; height: 100%; background-color: var(--accent-blue); transition: width 0.15s ease, background-color 0.2s ease;"></div>
        </div>
      </div>
      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;">
        <div class="bu-stat-item">Letters: <strong id="cc-letters">0</strong></div>
        <div class="bu-stat-item">Digits: <strong id="cc-digits">0</strong></div>
        <div class="bu-stat-item">Punctuation: <strong id="cc-punct">0</strong></div>
        <div class="bu-stat-item">Whitespace: <strong id="cc-space">0</strong></div>
      </div>
      <div class="bu-actions-bar">
        <button type="button" id="btn-cc-copy" class="bu-btn bu-btn-primary">Copy Text</button>
        <button type="button" id="btn-cc-sample" class="bu-btn">Load Sample</button>
        <button type="button" id="btn-cc-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('cc-input');
      const preset = document.getElementById('cc-preset');
      const progLabel = document.getElementById('cc-progress-label');
      const remLabel = document.getElementById('cc-remaining-label');
      const progBar = document.getElementById('cc-progress-bar');
      const lettersEl = document.getElementById('cc-letters');
      const digitsEl = document.getElementById('cc-digits');
      const punctEl = document.getElementById('cc-punct');
      const spaceEl = document.getElementById('cc-space');
      const copyBtn = document.getElementById('btn-cc-copy');
      const sampleBtn = document.getElementById('btn-cc-sample');
      const clearBtn = document.getElementById('btn-cc-clear');

      function update() {
        const val = input.value;
        const stats = window.MTV_BU.analyzeCharacters(val);
        lettersEl.textContent = stats.letters;
        digitsEl.textContent = stats.digits;
        punctEl.textContent = stats.punctuation;
        spaceEl.textContent = stats.whitespace;

        const limitVal = preset.value;
        if (limitVal === 'none') {
          progLabel.textContent = \`Total Characters: \${stats.chars}\`;
          remLabel.textContent = 'No limit set';
          progBar.style.width = '100%';
          progBar.style.backgroundColor = 'var(--accent-blue)';
        } else {
          const limit = parseInt(limitVal, 10);
          const remaining = limit - stats.chars;
          progLabel.textContent = \`Characters: \${stats.chars} / \${limit}\`;
          if (remaining >= 0) {
            remLabel.textContent = \`\${remaining} remaining\`;
            remLabel.style.color = 'var(--text-secondary)';
            const pct = Math.min(100, (stats.chars / limit) * 100);
            progBar.style.width = pct + '%';
            progBar.style.backgroundColor = pct > 90 ? 'var(--warning-text)' : 'var(--accent-blue)';
          } else {
            remLabel.textContent = \`\${Math.abs(remaining)} characters OVER limit!\`;
            remLabel.style.color = 'var(--danger-text)';
            progBar.style.width = '100%';
            progBar.style.backgroundColor = 'var(--danger-text)';
          }
        }
      }

      input.addEventListener('input', update);
      preset.addEventListener('change', update);

      copyBtn.addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(input.value, copyBtn);
      });

      sampleBtn.addEventListener('click', () => {
        input.value = "Looking for a free, fast, and completely private multi-view video player? Multi Tube Views lets you stream 40+ platforms side-by-side with zero downloads!";
        update();
      });

      clearBtn.addEventListener('click', () => {
        input.value = '';
        update();
        input.focus();
      });
      update();
    `
  },

  // 4. Duplicate Line Remover
  {
    id: 'duplicate-line-remover',
    categoryId: 'text-utilities',
    name: 'Duplicate Line Remover',
    icon: '🧹',
    title: 'Duplicate Line Remover — Clean & Deduplicate Lists Online',
    description: 'Remove repeated lines, email lists, keywords, and URLs with configurable case sensitivity, whitespace trimming, and duplicate counters.',
    keywords: 'duplicate line remover, deduplicate list, remove repeated lines, clean duplicate words, list deduplicator',
    howToUse: [
      { step: '1', title: 'Paste Your List', desc: 'Paste a list of lines, URLs, tags, or records into the input box.' },
      { step: '2', title: 'Configure Rules', desc: 'Choose case-sensitivity, trimming, and whether to keep first or last occurrences.' },
      { step: '3', title: 'Extract Clean List', desc: 'Copy deduplicated lines or download the cleaned file.' }
    ],
    features: [
      { title: 'Live Deduplication Stats', desc: 'Displays original line count, unique count, and total duplicates eliminated.' },
      { title: 'Whitespace Normalization', desc: 'Optionally ignores leading or trailing spaces during comparison.' },
      { title: 'Zero Data Leaks', desc: 'Private lists, customer emails, and keys never leave your browser.' }
    ],
    sampleText: `apple\nbanana\norange\napple\nApple\ngrape\nbanana\npear\n  orange  \nkiwi`,
    renderControls: () => `
      <div class="bu-grid-2col">
        <div class="bu-form-group">
          <label class="bu-form-label" for="dl-input">Original Lines</label>
          <textarea id="dl-input" class="bu-textarea bu-textarea-mono" style="min-height: 200px;" placeholder="Paste lines with duplicates here..."></textarea>
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" for="dl-output">Unique Lines</label>
          <textarea id="dl-output" class="bu-textarea bu-textarea-mono" readonly style="min-height: 200px;" placeholder="Deduplicated list will appear here..."></textarea>
        </div>
      </div>
      <div class="bu-options-wrap">
        <label class="bu-checkbox-label">
          <input type="checkbox" id="dl-trim" checked> Trim whitespace before comparing
        </label>
        <label class="bu-checkbox-label">
          <input type="checkbox" id="dl-case"> Case-sensitive comparison
        </label>
        <label class="bu-checkbox-label">
          <input type="checkbox" id="dl-blank" checked> Remove blank / empty lines
        </label>
      </div>
      <div class="bu-stats-strip" id="dl-stats">
        <div class="bu-stat-item">Original: <strong id="dl-stat-orig">0</strong></div>
        <div class="bu-stat-item">Unique: <strong id="dl-stat-unique" style="color: var(--success-text);">0</strong></div>
        <div class="bu-stat-item">Duplicates Removed: <strong id="dl-stat-removed" style="color: var(--accent-blue);">0</strong></div>
      </div>
      <div class="bu-actions-bar">
        <button type="button" id="btn-dl-copy" class="bu-btn bu-btn-primary">Copy Unique Lines</button>
        <button type="button" id="btn-dl-download" class="bu-btn">Download .txt</button>
        <button type="button" id="btn-dl-sample" class="bu-btn">Load Sample</button>
        <button type="button" id="btn-dl-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('dl-input');
      const output = document.getElementById('dl-output');
      const trimCheck = document.getElementById('dl-trim');
      const caseCheck = document.getElementById('dl-case');
      const blankCheck = document.getElementById('dl-blank');
      const origEl = document.getElementById('dl-stat-orig');
      const uniqueEl = document.getElementById('dl-stat-unique');
      const remEl = document.getElementById('dl-stat-removed');
      const copyBtn = document.getElementById('btn-dl-copy');
      const dlBtn = document.getElementById('btn-dl-download');
      const sampleBtn = document.getElementById('btn-dl-sample');
      const clearBtn = document.getElementById('btn-dl-clear');

      function dedupe() {
        const res = window.MTV_BU.removeDuplicateLines(input.value, {
          caseSensitive: caseCheck.checked,
          trim: trimCheck.checked,
          removeBlank: blankCheck.checked,
          keepFirst: true
        });
        output.value = res.result;
        origEl.textContent = res.originalCount;
        uniqueEl.textContent = res.uniqueCount;
        remEl.textContent = res.removedCount;
      }

      input.addEventListener('input', dedupe);
      trimCheck.addEventListener('change', dedupe);
      caseCheck.addEventListener('change', dedupe);
      blankCheck.addEventListener('change', dedupe);

      copyBtn.addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(output.value, copyBtn);
      });

      dlBtn.addEventListener('click', () => {
        if (!output.value) return;
        window.MTV_BU.downloadFile(output.value, 'unique-lines.txt');
      });

      sampleBtn.addEventListener('click', () => {
        input.value = "apple\\nbanana\\norange\\napple\\nApple\\ngrape\\nbanana\\npear\\n  orange  \\nkiwi";
        dedupe();
      });

      clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        origEl.textContent = '0';
        uniqueEl.textContent = '0';
        remEl.textContent = '0';
        input.focus();
      });
    `
  },

  // 5. Text Sorter
  {
    id: 'text-sorter',
    categoryId: 'text-utilities',
    name: 'Text Sorter',
    icon: '🔀',
    title: 'Online Text & Line Sorter — Alphabetical, Numerical & Length Sorting',
    description: 'Sort lines of text alphabetically (A-Z, Z-A), numerically, by line length, reverse, or randomize order completely in your browser.',
    keywords: 'text sorter, alphabetical sorter, sort lines online, sort text a-z, sort numbers online, random list shuffle',
    howToUse: [
      { step: '1', title: 'Paste Lines', desc: 'Enter names, items, or records, one per line.' },
      { step: '2', title: 'Select Sort Mode', desc: 'Choose A-Z, Z-A, Numerical, Length, Reverse, or Shuffle.' },
      { step: '3', title: 'Export Ordered Text', desc: 'Copy the sorted output directly to your clipboard or download.' }
    ],
    features: [
      { title: '8 Sorting Algorithms', desc: 'Supports alphabetical, natural numeric order, length hierarchy, and random shuffle.' },
      { title: 'Case Options', desc: 'Toggle case sensitivity to distinguish uppercase vs lowercase letters.' },
      { title: 'Instant Processing', desc: 'Sort thousands of lines in milliseconds with zero server upload.' }
    ],
    sampleText: `Zebra\n100\nApple\n2\nBanana\n50\nOrange\nCherry\n10\nMango`,
    renderControls: () => `
      <div class="bu-grid-2col">
        <div class="bu-form-group">
          <label class="bu-form-label" for="ts-input">Unsorted Lines</label>
          <textarea id="ts-input" class="bu-textarea bu-textarea-mono" style="min-height: 220px;" placeholder="Paste text lines here to sort..."></textarea>
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" for="ts-output">Sorted Result</label>
          <textarea id="ts-output" class="bu-textarea bu-textarea-mono" readonly style="min-height: 220px;" placeholder="Sorted output will appear here..."></textarea>
        </div>
      </div>
      <div class="bu-actions-bar" style="gap: 0.45rem;">
        <button type="button" class="bu-btn bu-btn-primary" data-sort="az">A → Z</button>
        <button type="button" class="bu-btn bu-btn-primary" data-sort="za">Z → A</button>
        <button type="button" class="bu-btn bu-btn-primary" data-sort="num-asc">1 → 9 Numeric</button>
        <button type="button" class="bu-btn bu-btn-primary" data-sort="num-desc">9 → 1 Numeric</button>
        <button type="button" class="bu-btn" data-sort="len-asc">Shortest First</button>
        <button type="button" class="bu-btn" data-sort="len-desc">Longest First</button>
        <button type="button" class="bu-btn" data-sort="reverse">Reverse Lines</button>
        <button type="button" class="bu-btn" data-sort="shuffle">Shuffle / Random</button>
      </div>
      <div class="bu-options-wrap">
        <label class="bu-checkbox-label">
          <input type="checkbox" id="ts-trim" checked> Trim whitespace
        </label>
        <label class="bu-checkbox-label">
          <input type="checkbox" id="ts-case"> Case-sensitive sort
        </label>
      </div>
      <div class="bu-actions-bar">
        <button type="button" id="btn-ts-copy" class="bu-btn bu-btn-primary">Copy Sorted Text</button>
        <button type="button" id="btn-ts-download" class="bu-btn">Download .txt</button>
        <button type="button" id="btn-ts-sample" class="bu-btn">Load Sample</button>
        <button type="button" id="btn-ts-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('ts-input');
      const output = document.getElementById('ts-output');
      const trimCheck = document.getElementById('ts-trim');
      const caseCheck = document.getElementById('ts-case');
      const copyBtn = document.getElementById('btn-ts-copy');
      const dlBtn = document.getElementById('btn-ts-download');
      const sampleBtn = document.getElementById('btn-ts-sample');
      const clearBtn = document.getElementById('btn-ts-clear');
      let currentSort = 'az';

      function doSort(mode) {
        currentSort = mode;
        const res = window.MTV_BU.sortLines(input.value, mode, {
          trim: trimCheck.checked,
          caseSensitive: caseCheck.checked
        });
        output.value = res;
      }

      document.querySelectorAll('[data-sort]').forEach(btn => {
        btn.addEventListener('click', () => {
          doSort(btn.getAttribute('data-sort'));
        });
      });

      input.addEventListener('input', () => {
        if (input.value) doSort(currentSort);
        else output.value = '';
      });

      trimCheck.addEventListener('change', () => doSort(currentSort));
      caseCheck.addEventListener('change', () => doSort(currentSort));

      copyBtn.addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(output.value, copyBtn);
      });

      dlBtn.addEventListener('click', () => {
        if (!output.value) return;
        window.MTV_BU.downloadFile(output.value, 'sorted-lines.txt');
      });

      sampleBtn.addEventListener('click', () => {
        input.value = "Zebra\\n100\\nApple\\n2\\nBanana\\n50\\nOrange\\nCherry\\n10\\nMango";
        doSort('az');
      });

      clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        input.focus();
      });
    `
  },

  // 6. Text Cleaner
  {
    id: 'text-cleaner',
    categoryId: 'text-utilities',
    name: 'Text Cleaner',
    icon: '✨',
    title: 'Text Cleaner & Sanitizer — Strip HTML, Whitespace & Line Breaks',
    description: 'Clean up dirty text: remove excess spaces, strip HTML tags, remove blank lines, convert tabs to spaces, and normalize line endings.',
    keywords: 'text cleaner, strip html, remove blank lines, remove extra spaces, text sanitizer, normalize line endings',
    howToUse: [
      { step: '1', title: 'Paste Raw Text', desc: 'Paste raw content containing HTML tags, messy spacing, or extra line breaks.' },
      { step: '2', title: 'Select Cleaning Rules', desc: 'Check or uncheck specific cleanup filters such as stripping HTML or normalizing spaces.' },
      { step: '3', title: 'Copy Cleaned Output', desc: 'Instantly copy the pristine, sanitized text for your documentation or code.' }
    ],
    features: [
      { title: 'Configurable Filters', desc: 'Fine-tune whitespace, tags, emojis, and punctuation stripping independently.' },
      { title: 'HTML Stripping', desc: 'Extracts pure plain text from rich HTML snippets and web scrape dumps.' },
      { title: 'Whitespace Normalization', desc: 'Replaces erratic double/triple spaces with clean single spaces.' }
    ],
    sampleText: `<div class="article">
  <h1>  Title with Extra Spaces   </h1>
  <p>First paragraph with <b>bold tags</b> and tabs\t\there.</p>

  <p>Second paragraph after multiple blank lines...  🎉🚀</p>
</div>`,
    renderControls: () => `
      <div class="bu-grid-2col">
        <div class="bu-form-group">
          <label class="bu-form-label" for="tc-input">Dirty Input Text</label>
          <textarea id="tc-input" class="bu-textarea bu-textarea-mono" style="min-height: 220px;" placeholder="Paste messy text with HTML or erratic whitespace..."></textarea>
        </div>
        <div class="bu-form-group">
          <label class="bu-form-label" for="tc-output">Sanitized Output Text</label>
          <textarea id="tc-output" class="bu-textarea bu-textarea-mono" readonly style="min-height: 220px;" placeholder="Cleaned text will appear here..."></textarea>
        </div>
      </div>
      <div class="bu-options-wrap">
        <label class="bu-checkbox-label"><input type="checkbox" id="tc-strip-html" checked> Strip HTML tags</label>
        <label class="bu-checkbox-label"><input type="checkbox" id="tc-single-spaces" checked> Single spaces only</label>
        <label class="bu-checkbox-label"><input type="checkbox" id="tc-trim-lines" checked> Trim whitespace on each line</label>
        <label class="bu-checkbox-label"><input type="checkbox" id="tc-no-blank" checked> Remove blank lines</label>
        <label class="bu-checkbox-label"><input type="checkbox" id="tc-tabs" checked> Convert tabs to spaces</label>
        <label class="bu-checkbox-label"><input type="checkbox" id="tc-breaks" checked> Normalize line breaks</label>
        <label class="bu-checkbox-label"><input type="checkbox" id="tc-emojis"> Remove emojis</label>
        <label class="bu-checkbox-label"><input type="checkbox" id="tc-spec"> Remove special characters</label>
      </div>
      <div class="bu-actions-bar">
        <button type="button" id="btn-tc-clean" class="bu-btn bu-btn-primary">Clean Text</button>
        <button type="button" id="btn-tc-copy" class="bu-btn">Copy Clean Text</button>
        <button type="button" id="btn-tc-download" class="bu-btn">Download .txt</button>
        <button type="button" id="btn-tc-sample" class="bu-btn">Load Sample</button>
        <button type="button" id="btn-tc-clear" class="bu-btn bu-btn-subtle">Clear</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('tc-input');
      const output = document.getElementById('tc-output');
      const stripHtml = document.getElementById('tc-strip-html');
      const singleSpaces = document.getElementById('tc-single-spaces');
      const trimLines = document.getElementById('tc-trim-lines');
      const noBlank = document.getElementById('tc-no-blank');
      const tabs = document.getElementById('tc-tabs');
      const breaks = document.getElementById('tc-breaks');
      const emojis = document.getElementById('tc-emojis');
      const spec = document.getElementById('tc-spec');
      const cleanBtn = document.getElementById('btn-tc-clean');
      const copyBtn = document.getElementById('btn-tc-copy');
      const dlBtn = document.getElementById('btn-tc-download');
      const sampleBtn = document.getElementById('btn-tc-sample');
      const clearBtn = document.getElementById('btn-tc-clear');

      function clean() {
        const res = window.MTV_BU.cleanText(input.value, {
          stripHtml: stripHtml.checked,
          singleSpaces: singleSpaces.checked,
          trimLines: trimLines.checked,
          removeBlankLines: noBlank.checked,
          tabsToSpaces: tabs.checked,
          normalizeLineBreaks: breaks.checked,
          removeEmojis: emojis.checked,
          removeSpecialChars: spec.checked
        });
        output.value = res;
      }

      [stripHtml, singleSpaces, trimLines, noBlank, tabs, breaks, emojis, spec].forEach(el => {
        el.addEventListener('change', clean);
      });

      input.addEventListener('input', clean);
      cleanBtn.addEventListener('click', clean);

      copyBtn.addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(output.value, copyBtn);
      });

      dlBtn.addEventListener('click', () => {
        if (!output.value) return;
        window.MTV_BU.downloadFile(output.value, 'cleaned-text.txt');
      });

      sampleBtn.addEventListener('click', () => {
        input.value = '<div class="article">\\n  <h1>  Title with Extra Spaces   </h1>\\n  <p>First paragraph with <b>bold tags</b> and tabs\\t\\there.</p>\\n\\n  <p>Second paragraph after multiple blank lines...  🎉🚀</p>\\n</div>';
        clean();
      });

      clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        input.focus();
      });
    `
  }
];

export const TEXT_TOOLS = TOOLS;

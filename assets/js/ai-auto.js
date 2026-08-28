/**
 * Multi Tube Views (MTV) — AI Auto Generator Engine
 * 
 * Dedicated in-app SEO, metadata, and creator content generation powered by
 * server-side Google Gemini 3.7 Flash API via MTV backend (/api/chat & /api/ai-auto).
 */

(function () {
  'use strict';

  class AIAutoEngine {
    constructor() {
      this.apiBase = this.getApiBaseUrl();
      this.activeModel = 'gemini-3.7-flash';
      this.isGenerating = false;
      this.lastResponseText = '';
      this.lastPrompt = '';
      this.availableModels = [
        { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash', badge: 'Recommended' },
        { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', badge: 'Pro' },
        { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', badge: 'Lite' },
        { id: 'gemini-flash-latest', name: 'Gemini Flash Latest', badge: 'Latest' }
      ];

      this.presetPrompts = {
        'youtube-pack': {
          title: 'YouTube SEO Pack',
          prompt: 'Create a complete YouTube SEO optimization pack for: "{input}". Include 3 high-CTR title variations, an engaging 3-paragraph video description with chapter timestamps placeholder, a list of 15 high-ranking tags, and 5 suggested thumbnail text concepts.'
        },
        'titles': {
          title: 'High-CTR Title Ideas',
          prompt: 'Generate 10 compelling, high-CTR video and article title variations for: "{input}". Categorize them into Curiosity/Intrigue, How-To/Educational, Listicle/Rankings, and High Search Volume formats.'
        },
        'keywords': {
          title: 'Keyword & Search Intent',
          prompt: 'Provide a structured keyword strategy for: "{input}". Group keywords into Primary Seed Keywords, Long-Tail Search Queries, Question-Based Keywords (People Also Ask), and Low-Competition Opportunities with estimated search intent.'
        },
        'description': {
          title: 'Video Description & Chapters',
          prompt: 'Write a comprehensive, SEO-optimized video description for: "{input}". Include an engaging hook, main summary, structured timestamp outline ([00:00] Intro, [01:30] Key Concept...), relevant links placeholder, and 3 strategic hashtags.'
        },
        'tiktok-reels': {
          title: 'TikTok & Shorts Script',
          prompt: 'Create a 45-60 second short-form video script for TikTok/Shorts/Reels about: "{input}". Include visual cues [Visual], verbal hook (0-3s), retention structure, and strong call-to-action.'
        },
        'repurpose': {
          title: 'Multi-Platform Repurpose',
          prompt: 'Repurpose the core message of: "{input}" into: 1) A Twitter/X thread outline (5 tweets), 2) A LinkedIn professional post, and 3) A Community tab discussion prompt.'
        },
        'meta-tags': {
          title: 'SEO Meta Description & Tags',
          prompt: 'Write 3 compelling meta descriptions (under 155 characters each), an Open Graph social title, and targeted page keywords for: "{input}".'
        }
      };

      this.init();
    }

    init() {
      document.addEventListener('DOMContentLoaded', () => {
        this.cacheDom();
        this.bindEvents();
        this.fetchAvailableModels();
        this.checkQueryParams();
        this.updateCharCount();
      });
    }

    getApiBaseUrl() {
      if (window.MTV_API_BASE_URL) return window.MTV_API_BASE_URL.replace(/\/+$/, '');
      if (window.location && window.location.origin && window.location.origin !== 'null') {
        return window.location.origin.replace(/\/+$/, '');
      }
      return '';
    }

    cacheDom() {
      this.dom = {
        input: document.getElementById('ai-auto-input'),
        charCount: document.getElementById('ai-auto-char-count'),
        wordCount: document.getElementById('ai-auto-word-count'),
        generateBtn: document.getElementById('btn-ai-auto-generate'),
        clearInputBtn: document.getElementById('btn-ai-auto-clear-input'),
        modeSelect: document.getElementById('ai-auto-mode-select'),
        modelSelect: document.getElementById('ai-auto-model-select'),
        presetChips: document.querySelectorAll('.ai-preset-chip'),
        
        // Output Elements
        outputSection: document.getElementById('ai-auto-output-section'),
        outputPlaceholder: document.getElementById('ai-auto-output-placeholder'),
        loadingState: document.getElementById('ai-auto-loading-state'),
        loadingStatusText: document.getElementById('ai-auto-loading-status'),
        resultContainer: document.getElementById('ai-auto-result-container'),
        formattedOutput: document.getElementById('ai-auto-formatted-output'),
        rawOutput: document.getElementById('ai-auto-raw-output'),
        errorState: document.getElementById('ai-auto-error-state'),
        errorMessage: document.getElementById('ai-auto-error-message'),
        retryBtn: document.getElementById('btn-ai-auto-retry'),
        
        // Output Actions
        copyBtn: document.getElementById('btn-ai-auto-copy'),
        regenerateBtn: document.getElementById('btn-ai-auto-regenerate'),
        clearOutputBtn: document.getElementById('btn-ai-auto-clear-output'),
        downloadBtn: document.getElementById('btn-ai-auto-download'),
        toggleViewBtn: document.getElementById('btn-ai-auto-toggle-view'),
        
        // Stats
        resultModelBadge: document.getElementById('ai-auto-result-model-badge'),
        resultWordCount: document.getElementById('ai-auto-result-words'),
        resultTimeBadge: document.getElementById('ai-auto-result-time'),
        toast: document.getElementById('ai-auto-toast')
      };
    }

    bindEvents() {
      if (this.dom.input) {
        this.dom.input.addEventListener('input', () => this.updateCharCount());
        this.dom.input.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.handleGenerate();
          }
        });
      }

      if (this.dom.generateBtn) {
        this.dom.generateBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleGenerate();
        });
      }

      if (this.dom.clearInputBtn) {
        this.dom.clearInputBtn.addEventListener('click', () => {
          if (this.dom.input) {
            this.dom.input.value = '';
            this.dom.input.focus();
            this.updateCharCount();
          }
        });
      }

      if (this.dom.presetChips) {
        this.dom.presetChips.forEach(chip => {
          chip.addEventListener('click', () => {
            const key = chip.getAttribute('data-preset');
            const sample = chip.getAttribute('data-sample');
            if (this.dom.input) {
              if (sample) {
                this.dom.input.value = sample;
              } else if (key && this.presetPrompts[key]) {
                const currentVal = this.dom.input.value.trim() || 'Tech trends & AI tools 2026';
                this.dom.input.value = currentVal;
              }
              this.updateCharCount();
              this.dom.input.focus();
              this.showToast(`Selected preset: ${chip.textContent.trim()}`);
            }
          });
        });
      }

      if (this.dom.modelSelect) {
        this.dom.modelSelect.addEventListener('change', (e) => {
          this.activeModel = e.target.value;
        });
      }

      if (this.dom.copyBtn) {
        this.dom.copyBtn.addEventListener('click', () => this.handleCopy());
      }

      if (this.dom.regenerateBtn) {
        this.dom.regenerateBtn.addEventListener('click', () => {
          if (this.lastPrompt) {
            if (this.dom.input && !this.dom.input.value.trim()) {
              this.dom.input.value = this.lastPrompt;
            }
            this.handleGenerate();
          } else {
            this.handleGenerate();
          }
        });
      }

      if (this.dom.retryBtn) {
        this.dom.retryBtn.addEventListener('click', () => this.handleGenerate());
      }

      if (this.dom.clearOutputBtn) {
        this.dom.clearOutputBtn.addEventListener('click', () => this.clearOutput());
      }

      if (this.dom.downloadBtn) {
        this.dom.downloadBtn.addEventListener('click', () => this.handleDownload());
      }

      if (this.dom.toggleViewBtn) {
        this.dom.toggleViewBtn.addEventListener('click', () => this.toggleRawView());
      }
    }

    checkQueryParams() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const topic = urlParams.get('topic') || urlParams.get('q') || urlParams.get('prompt');
        const mode = urlParams.get('mode');
        const auto = urlParams.get('auto');

        if (topic && this.dom.input) {
          this.dom.input.value = decodeURIComponent(topic);
          this.updateCharCount();
        }

        if (mode && this.dom.modeSelect) {
          this.dom.modeSelect.value = mode;
        }

        if (auto === '1' || auto === 'true') {
          setTimeout(() => this.handleGenerate(), 300);
        }
      } catch (err) {
        console.warn('Error reading URL params:', err);
      }
    }

    updateCharCount() {
      const text = (this.dom.input ? this.dom.input.value : '') || '';
      const charLen = text.length;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;

      if (this.dom.charCount) this.dom.charCount.textContent = `${charLen} chars`;
      if (this.dom.wordCount) this.dom.wordCount.textContent = `${words} words`;

      if (this.dom.clearInputBtn) {
        this.dom.clearInputBtn.style.visibility = charLen > 0 ? 'visible' : 'hidden';
      }
    }

    async fetchAvailableModels() {
      try {
        const res = await fetch(`${this.apiBase}/api/models`);
        if (res.ok) {
          const data = await res.json();
          if (data.models && Array.isArray(data.models) && data.models.length > 0) {
            this.availableModels = data.models;
            if (data.defaultModel) this.activeModel = data.defaultModel;
            this.renderModelDropdown();
          }
        }
      } catch (err) {
        console.warn('Could not fetch server models, using default:', err);
      }
    }

    renderModelDropdown() {
      if (!this.dom.modelSelect) return;
      this.dom.modelSelect.innerHTML = '';
      this.availableModels.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.name} ${m.badge ? `(${m.badge})` : ''}`;
        if (m.id === this.activeModel) opt.selected = true;
        this.dom.modelSelect.appendChild(opt);
      });
    }

    async handleGenerate() {
      const rawInput = (this.dom.input ? this.dom.input.value : '').trim();
      if (!rawInput) {
        this.showToast('Please enter a topic, keyword, or request first.');
        if (this.dom.input) this.dom.input.focus();
        return;
      }

      if (this.isGenerating) return;

      this.isGenerating = true;
      this.lastPrompt = rawInput;
      const startTime = performance.now();

      // UI State -> Loading
      this.setUiState('loading');
      this.updateLoadingStatus('Connecting to MTV Gemini server...');

      const mode = this.dom.modeSelect ? this.dom.modeSelect.value : 'general';
      let systemInstruction = 'You are an expert AI SEO, metadata, and creator content strategist for Multi Tube Views. Provide comprehensive, structured, high-CTR, and actionable responses using clean Markdown.';
      
      let userPrompt = rawInput;
      if (mode !== 'general' && this.presetPrompts[mode]) {
        userPrompt = this.presetPrompts[mode].prompt.replace('{input}', rawInput);
      }

      try {
        this.updateLoadingStatus('Processing with Gemini 3.7 Flash...');
        
        const endpoint = `${this.apiBase}/api/chat`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            message: userPrompt,
            prompt: userPrompt,
            userPrompt: userPrompt,
            topic: rawInput,
            systemInstruction: systemInstruction,
            provider: 'gemini',
            model: this.activeModel,
            temperature: 0.7,
            toolId: 'ai-auto-' + mode
          })
        });

        const contentType = res.headers.get('content-type') || '';
        let data = null;
        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const rawText = await res.text();
          throw new Error(`Server returned non-JSON response (${res.status}): ${rawText.slice(0, 100)}`);
        }

        const elapsedMs = Math.round(performance.now() - startTime);

        if (data && data.success && data.response) {
          this.lastResponseText = data.response;
          this.renderResult(data.response, data.model || this.activeModel, elapsedMs);
          this.setUiState('result');
          this.showToast('✓ AI content generated successfully!');
        } else {
          const errorMsg = data?.error || 'Could not generate content. Please try again.';
          this.renderError(errorMsg);
          this.setUiState('error');
        }
      } catch (err) {
        console.error('[AI Auto Engine] Request failed:', err);
        this.renderError(err.message || 'Network communication error with server.');
        this.setUiState('error');
      } finally {
        this.isGenerating = false;
      }
    }

    setUiState(state) {
      if (this.dom.outputPlaceholder) this.dom.outputPlaceholder.style.display = state === 'idle' ? 'flex' : 'none';
      if (this.dom.loadingState) this.dom.loadingState.style.display = state === 'loading' ? 'block' : 'none';
      if (this.dom.resultContainer) this.dom.resultContainer.style.display = state === 'result' ? 'block' : 'none';
      if (this.dom.errorState) this.dom.errorState.style.display = state === 'error' ? 'block' : 'none';

      if (this.dom.generateBtn) {
        this.dom.generateBtn.disabled = state === 'loading';
        if (state === 'loading') {
          this.dom.generateBtn.innerHTML = `
            <div class="spinner-inline" style="width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite;"></div>
            <span>Generating...</span>
          `;
        } else {
          this.dom.generateBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            <span>Generate</span>
          `;
        }
      }

      // Scroll smoothly to output if mobile
      if (state === 'loading' && window.innerWidth <= 768 && this.dom.outputSection) {
        this.dom.outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    updateLoadingStatus(msg) {
      if (this.dom.loadingStatusText) {
        this.dom.loadingStatusText.textContent = msg;
      }
    }

    renderResult(text, modelName, elapsedMs) {
      if (this.dom.formattedOutput) {
        this.dom.formattedOutput.innerHTML = this.renderMarkdown(text);
        this.attachCodeCopyListeners();
      }

      if (this.dom.rawOutput) {
        this.dom.rawOutput.value = text;
      }

      const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
      if (this.dom.resultWordCount) {
        this.dom.resultWordCount.textContent = `${wordCount} words`;
      }

      if (this.dom.resultModelBadge) {
        this.dom.resultModelBadge.textContent = modelName || 'Gemini 3.7 Flash';
      }

      if (this.dom.resultTimeBadge) {
        this.dom.resultTimeBadge.textContent = `${(elapsedMs / 1000).toFixed(1)}s`;
      }
    }

    renderError(msg) {
      if (this.dom.errorMessage) {
        this.dom.errorMessage.textContent = msg;
      }
    }

    clearOutput() {
      this.lastResponseText = '';
      this.setUiState('idle');
      this.showToast('Output cleared');
    }

    handleCopy() {
      if (!this.lastResponseText) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(this.lastResponseText).then(() => {
          this.showCopyFeedback();
        }).catch(() => {
          this.fallbackCopy(this.lastResponseText);
        });
      } else {
        this.fallbackCopy(this.lastResponseText);
      }
    }

    showCopyFeedback() {
      if (this.dom.copyBtn) {
        const originalHtml = this.dom.copyBtn.innerHTML;
        this.dom.copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Copied!</span>
        `;
        this.dom.copyBtn.style.borderColor = 'var(--success-border, #34c759)';
        this.dom.copyBtn.style.color = 'var(--success-text, #34c759)';

        setTimeout(() => {
          this.dom.copyBtn.innerHTML = originalHtml;
          this.dom.copyBtn.style.borderColor = '';
          this.dom.copyBtn.style.color = '';
        }, 2200);
      }
      this.showToast('✓ Content copied to clipboard!');
    }

    fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        this.showCopyFeedback();
      } catch (err) {
        this.showToast('Could not copy to clipboard.');
      }
      document.body.removeChild(textarea);
    }

    handleDownload() {
      if (!this.lastResponseText) return;
      const blob = new Blob([this.lastResponseText], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `mtv-ai-auto-${Date.now()}.md`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.showToast(`Downloaded ${filename}`);
    }

    toggleRawView() {
      if (!this.dom.formattedOutput || !this.dom.rawOutput) return;
      const isRaw = this.dom.rawOutput.style.display === 'block';
      if (isRaw) {
        this.dom.rawOutput.style.display = 'none';
        this.dom.formattedOutput.style.display = 'block';
        if (this.dom.toggleViewBtn) this.dom.toggleViewBtn.textContent = 'View Markdown Source';
      } else {
        this.dom.rawOutput.style.display = 'block';
        this.dom.formattedOutput.style.display = 'none';
        if (this.dom.toggleViewBtn) this.dom.toggleViewBtn.textContent = 'View Rendered HTML';
      }
    }

    attachCodeCopyListeners() {
      if (!this.dom.formattedOutput) return;
      const copyBtns = this.dom.formattedOutput.querySelectorAll('.btn-code-copy');
      copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const codeBlock = btn.parentElement.querySelector('code');
          if (codeBlock) {
            const codeText = codeBlock.innerText || codeBlock.textContent || '';
            navigator.clipboard.writeText(codeText).then(() => {
              btn.textContent = 'Copied!';
              setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
            });
          }
        });
      });
    }

    showToast(msg) {
      if (!this.dom.toast) return;
      this.dom.toast.textContent = msg;
      this.dom.toast.classList.add('show');
      setTimeout(() => {
        this.dom.toast.classList.remove('show');
      }, 2600);
    }

    renderMarkdown(text) {
      if (!text) return '';
      
      let out = this.escapeHtml(text);

      // 1. Code blocks with language and copy button
      out = out.replace(/```([a-zA-Z0-9_\-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `
          <div class="ai-code-block-wrapper" style="position: relative; margin: 1rem 0; background: var(--bg-subtle); border: 1px solid var(--border-strong); border-radius: var(--radius-md); overflow: hidden;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.35rem 0.75rem; background: rgba(0,0,0,0.03); border-bottom: 1px solid var(--border-subtle); font-size: 0.72rem; font-weight: 600; color: var(--text-muted);">
              <span>${lang ? lang.toUpperCase() : 'CODE'}</span>
              <button type="button" class="btn-code-copy" style="background: none; border: 1px solid var(--border-subtle); border-radius: 4px; padding: 2px 8px; font-size: 0.7rem; cursor: pointer; color: var(--text-primary);">Copy</button>
            </div>
            <pre style="margin: 0; padding: 0.85rem; overflow-x: auto; font-size: 0.82rem; font-family: var(--font-mono); line-height: 1.45;"><code>${code}</code></pre>
          </div>
        `;
      });

      // 2. Tables
      out = out.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (match) => {
        const rows = match.trim().split('\n');
        let html = '<div class="table-responsive" style="overflow-x: auto; margin: 1rem 0;"><table class="ai-rendered-table" style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">';
        
        let inHeader = true;
        rows.forEach((row, idx) => {
          const cells = row.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
          if (row.includes('---')) {
            inHeader = false;
            return;
          }
          if (idx === 0 || inHeader) {
            html += '<tr style="background: var(--bg-subtle); font-weight: 700; border-bottom: 2px solid var(--border-strong);">';
            cells.forEach(c => {
              html += `<th style="padding: 0.45rem 0.65rem; text-align: left; border: 1px solid var(--border-subtle);">${c}</th>`;
            });
            html += '</tr>';
          } else {
            html += '<tr style="border-bottom: 1px solid var(--border-subtle);">';
            cells.forEach(c => {
              html += `<td style="padding: 0.45rem 0.65rem; border: 1px solid var(--border-subtle);">${c}</td>`;
            });
            html += '</tr>';
          }
        });
        html += '</table></div>';
        return html;
      });

      // 3. Headings
      out = out.replace(/^### (.*$)/gim, '<h3 style="font-size: 1.05rem; font-weight: 700; margin: 1.25rem 0 0.45rem 0; color: var(--text-primary);">$1</h3>');
      out = out.replace(/^## (.*$)/gim, '<h2 style="font-size: 1.2rem; font-weight: 700; margin: 1.45rem 0 0.55rem 0; color: var(--text-primary); border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.35rem;">$1</h2>');
      out = out.replace(/^# (.*$)/gim, '<h1 style="font-size: 1.35rem; font-weight: 800; margin: 1.6rem 0 0.65rem 0; color: var(--text-primary);">$1</h1>');

      // 4. Blockquotes
      out = out.replace(/^> (.*$)/gim, '<blockquote style="border-left: 3px solid var(--accent-blue); padding: 0.45rem 0.85rem; margin: 0.75rem 0; background: var(--accent-subtle); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; color: var(--text-primary); font-size: 0.85rem;">$1</blockquote>');

      // 5. Horizontal rules
      out = out.replace(/^(?:---|\*\*\*|___)\s*$/gim, '<hr style="border: 0; height: 1px; background: var(--border-strong); margin: 1.25rem 0;" />');

      // 6. Bold & Italics
      out = out.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
      out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      out = out.replace(/\*(.*?)\*/g, '<em>$1</em>');

      // 7. Inline code
      out = out.replace(/`([^`]+)`/g, '<code style="background: var(--bg-subtle); border: 1px solid var(--border-subtle); padding: 0.15rem 0.35rem; border-radius: 4px; font-family: var(--font-mono); font-size: 0.8em; color: var(--accent-blue);">$1</code>');

      // 8. Unordered and Ordered Lists
      out = out.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li style="margin-bottom: 0.35rem; line-height: 1.45;">$1</li>');
      out = out.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<li value="$1" style="margin-bottom: 0.35rem; line-height: 1.45;">$2</li>');
      
      // Wrap consecutive <li> into <ul>
      out = out.replace(/((?:<li[^>]*>.*?<\/li>\s*)+)/g, '<ul style="margin: 0.65rem 0 0.85rem 1.25rem; padding: 0; list-style-type: disc;">$1</ul>');

      // 9. Paragraph linebreaks for remaining text
      out = out.replace(/\n\n/g, '<p style="margin-bottom: 0.85rem; line-height: 1.55;"></p>');
      out = out.replace(/\n/g, '<br/>');

      return out;
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }

  window.mtvAIAuto = new AIAutoEngine();
})();

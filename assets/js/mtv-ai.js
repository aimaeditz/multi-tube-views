/**
 * Multi Tube Views (MTV) — Client AI Integration Engine
 * Flow: Frontend -> MTV Express Backend (/api/chat) -> Gemini API (@google/genai) -> Real AI Response -> Frontend UI
 */

(function () {
  'use strict';

  class MtvAIEngine {
    constructor() {
      this.apiBase = this.getApiBaseUrl();
      this.activeModel = 'gemini-3.7-flash';
      this.availableModels = [
        { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash', badge: 'Recommended' },
        { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', badge: 'Pro' },
        { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', badge: 'Lite' },
        { id: 'gemini-flash-latest', name: 'Gemini Flash Latest', badge: 'Latest' }
      ];
      this.isProcessing = false;
      this.chatHistory = [];
      this.init();
    }

    init() {
      document.addEventListener('DOMContentLoaded', () => {
        this.injectModalHtml();
        this.bindEvents();
        this.fetchModels();
      });
    }

    async fetchModels() {
      try {
        const res = await fetch(`${this.apiBase}/api/models`);
        if (res.ok) {
          const data = await res.json();
          if (data.models && Array.isArray(data.models) && data.models.length > 0) {
            this.availableModels = data.models;
            if (data.defaultModel) {
              this.activeModel = data.defaultModel;
            }
            this.updateModelSelectDropdown();
          }
        }
      } catch (err) {
        console.warn('[MTV AI Engine] Failed to fetch models:', err);
      }
    }

    updateModelSelectDropdown() {
      const selectEl = document.getElementById('mtv-ai-model-select');
      if (!selectEl) return;
      
      selectEl.innerHTML = '';
      this.availableModels.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.name} ${m.badge ? `(${m.badge})` : ''}`;
        if (m.id === this.activeModel) opt.selected = true;
        selectEl.appendChild(opt);
      });
    }

    getApiBaseUrl() {
      if (window.MTV_API_BASE_URL) return window.MTV_API_BASE_URL.replace(/\/+$/, '');
      if (window.location && window.location.origin && window.location.origin !== 'null') {
        return window.location.origin.replace(/\/+$/, '');
      }
      return '';
    }

    injectModalHtml() {
      if (document.getElementById('mtv-ai-modal')) return;

      const modalHtml = `
        <div id="mtv-ai-modal" class="mtv-ai-modal-container" aria-hidden="true">
          <div class="mtv-ai-modal-backdrop" id="mtv-ai-backdrop"></div>
          <div class="mtv-ai-modal-box" role="dialog" aria-labelledby="mtv-ai-modal-title">
            <header class="mtv-ai-modal-header">
              <div class="mtv-ai-header-left">
                <div class="mtv-ai-badge-icon">✨</div>
                <div>
                  <h3 id="mtv-ai-modal-title" class="mtv-ai-title">MTV AI Assistant</h3>
                  <div class="mtv-ai-model-selector-wrapper" style="margin-top: 2px;">
                    <select id="mtv-ai-model-select" class="mtv-ai-model-select" style="background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.3); border-radius: 6px; padding: 2px 6px; font-size: 0.75rem; font-weight: 600; color: #2563eb; cursor: pointer; outline: none;">
                      <option value="gemini-3.7-flash">Gemini 3.7 Flash (Recommended)</option>
                      <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Pro)</option>
                      <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Lite)</option>
                      <option value="gemini-flash-latest">Gemini Flash Latest (Latest)</option>
                    </select>
                  </div>
                </div>
              </div>
              <button type="button" class="mtv-ai-close-btn" id="mtv-ai-close-btn" aria-label="Close Modal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </header>

            <div class="mtv-ai-modal-body" id="mtv-ai-chat-body">
              <div class="mtv-ai-welcome-card" id="mtv-ai-welcome">
                <p>Welcome to <strong>Multi Tube Views AI</strong>. Your query is processed securely on our server using Google Gemini 3.7 Flash.</p>
              </div>
              <div class="mtv-ai-messages-list" id="mtv-ai-messages"></div>
            </div>

            <footer class="mtv-ai-modal-footer">
              <form id="mtv-ai-form" class="mtv-ai-input-form">
                <textarea 
                  id="mtv-ai-input" 
                  class="mtv-ai-textarea" 
                  rows="2" 
                  placeholder="Ask MTV AI or refine prompt... (Press Enter to send)"
                  required
                ></textarea>
                <div class="mtv-ai-form-actions">
                  <span class="mtv-ai-status-indicator" id="mtv-ai-status">Ready</span>
                  <button type="submit" class="mtv-ai-submit-btn" id="mtv-ai-send-btn">
                    <span>Send Query</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </button>
                </div>
              </form>
            </footer>
          </div>
        </div>
      `;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = modalHtml;
      document.body.appendChild(wrapper.firstElementChild);

      this.injectStyles();
    }

    injectStyles() {
      if (document.getElementById('mtv-ai-styles')) return;

      const style = document.createElement('style');
      style.id = 'mtv-ai-styles';
      style.textContent = `
        .mtv-ai-modal-container {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 99999;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .mtv-ai-modal-container.active {
          display: flex;
        }
        .mtv-ai-modal-backdrop {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
        }
        .mtv-ai-modal-box {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 720px;
          max-height: 85vh;
          background: var(--bg-card, #ffffff);
          color: var(--text-primary, #1e293b);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .mtv-ai-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-color, #e2e8f0);
          background: var(--bg-surface, #f8fafc);
        }
        .mtv-ai-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .mtv-ai-badge-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem;
        }
        .mtv-ai-title {
          font-size: 1.05rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }
        .mtv-ai-model-tag {
          font-size: 0.75rem;
          color: #3b82f6;
          font-weight: 600;
        }
        .mtv-ai-close-btn {
          background: none; border: none;
          color: var(--text-muted, #64748b);
          cursor: pointer; padding: 0.35rem; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .mtv-ai-close-btn:hover {
          background: rgba(0,0,0,0.06);
          color: var(--text-primary, #0f172a);
        }
        .mtv-ai-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: var(--bg-card, #ffffff);
        }
        .mtv-ai-welcome-card {
          padding: 0.85rem 1rem;
          background: var(--bg-surface, #f1f5f9);
          border-radius: 10px;
          font-size: 0.875rem;
          color: var(--text-secondary, #475569);
          line-height: 1.5;
        }
        .mtv-ai-messages-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .mtv-ai-msg-row {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .mtv-ai-msg-sender {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted, #64748b);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .mtv-ai-msg-bubble {
          padding: 1rem;
          border-radius: 12px;
          font-size: 0.925rem;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .mtv-ai-msg-row.user .mtv-ai-msg-bubble {
          background: #eff6ff;
          color: #1e40af;
          border: 1px solid #bfdbfe;
          align-self: flex-end;
          width: fit-content;
          max-width: 85%;
        }
        .mtv-ai-msg-row.assistant .mtv-ai-msg-bubble {
          background: var(--bg-surface, #f8fafc);
          color: var(--text-primary, #0f172a);
          border: 1px solid var(--border-color, #e2e8f0);
          width: 100%;
        }
        .mtv-ai-msg-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.4rem;
        }
        .mtv-ai-btn-copy {
          background: none; border: 1px solid var(--border-color, #cbd5e1);
          border-radius: 6px; padding: 0.25rem 0.6rem;
          font-size: 0.75rem; font-weight: 600;
          color: var(--text-secondary, #475569); cursor: pointer;
          display: flex; align-items: center; gap: 0.35rem;
        }
        .mtv-ai-btn-copy:hover {
          background: var(--bg-surface, #f1f5f9);
          color: var(--text-primary, #0f172a);
        }
        .mtv-ai-modal-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid var(--border-color, #e2e8f0);
          background: var(--bg-surface, #f8fafc);
        }
        .mtv-ai-input-form {
          display: flex; flex-direction: column; gap: 0.75rem;
        }
        .mtv-ai-textarea {
          width: 100%;
          border: 1px solid var(--border-color, #cbd5e1);
          border-radius: 10px;
          padding: 0.75rem;
          font-size: 0.9rem;
          font-family: inherit;
          background: var(--bg-card, #ffffff);
          color: var(--text-primary, #0f172a);
          resize: vertical;
          outline: none;
        }
        .mtv-ai-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }
        .mtv-ai-form-actions {
          display: flex; align-items: center; justify-content: space-between;
        }
        .mtv-ai-status-indicator {
          font-size: 0.8rem; color: var(--text-muted, #64748b); font-weight: 500;
        }
        .mtv-ai-submit-btn {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #ffffff;
          border: none; border-radius: 8px;
          padding: 0.55rem 1.1rem;
          font-size: 0.875rem; font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; gap: 0.5rem;
          transition: opacity 0.2s;
        }
        .mtv-ai-submit-btn:hover { opacity: 0.92; }
        .mtv-ai-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `;
      document.head.appendChild(style);
    }

    bindEvents() {
      const backdrop = document.getElementById('mtv-ai-backdrop');
      const closeBtn = document.getElementById('mtv-ai-close-btn');
      const form = document.getElementById('mtv-ai-form');
      const textarea = document.getElementById('mtv-ai-input');
      const modelSelect = document.getElementById('mtv-ai-model-select');

      if (backdrop) backdrop.addEventListener('click', () => this.closeModal());
      if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());

      if (modelSelect) {
        modelSelect.addEventListener('change', (e) => {
          this.activeModel = e.target.value;
        });
      }

      if (textarea) {
        textarea.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          }
        });
      }

      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const prompt = textarea.value.trim();
          if (!prompt || this.isProcessing) return;
          textarea.value = '';
          await this.executePrompt(prompt);
        });
      }

      // Delegate global AI action launches across all pages
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-mtv-ai="true"], .btn-ai-launch');
        if (btn) {
          const target = btn.getAttribute('data-target');
          const promptTemplate = btn.getAttribute('data-prompt-template') || '';
          const rawPrompt = btn.getAttribute('data-prompt') || '';
          
          let topicVal = '';
          const topicInput = document.getElementById('creator-topic-input');
          if (topicInput && topicInput.value) {
            topicVal = topicInput.value.trim();
          }

          let finalPrompt = rawPrompt;
          if (promptTemplate) {
            finalPrompt = promptTemplate.replace('{topic}', topicVal || 'Content Strategy');
          }

          if (finalPrompt) {
            e.preventDefault();
            this.openAssistantModal(finalPrompt, null, btn.getAttribute('data-title') || 'MTV Creator Tool AI');
          }
        }
      });
    }

    openAssistantModal(initialPrompt = '', systemInstruction = '', title = 'MTV AI Assistant') {
      const modal = document.getElementById('mtv-ai-modal');
      const titleEl = document.getElementById('mtv-ai-modal-title');
      if (titleEl && title) titleEl.textContent = title;

      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      if (initialPrompt) {
        this.executePrompt(initialPrompt, systemInstruction);
      }
    }

    closeModal() {
      const modal = document.getElementById('mtv-ai-modal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    async executePrompt(promptText, systemInstruction = null) {
      const messagesContainer = document.getElementById('mtv-ai-messages');
      const statusIndicator = document.getElementById('mtv-ai-status');
      const sendBtn = document.getElementById('mtv-ai-send-btn');

      if (!messagesContainer) return;

      const activeModelObj = this.availableModels.find(m => m.id === this.activeModel);
      const activeModelName = activeModelObj ? activeModelObj.name : this.activeModel;

      this.isProcessing = true;
      if (statusIndicator) statusIndicator.textContent = `⚡ Querying ${activeModelName}...`;
      if (sendBtn) sendBtn.disabled = true;

      // 1. Render User Message
      const userMsgRow = document.createElement('div');
      userMsgRow.className = 'mtv-ai-msg-row user';
      userMsgRow.innerHTML = `
        <span class="mtv-ai-msg-sender">You</span>
        <div class="mtv-ai-msg-bubble">${this.escapeHtml(promptText)}</div>
      `;
      messagesContainer.appendChild(userMsgRow);

      // 2. Render Assistant Placeholder with Loading Indicator
      const assistantMsgRow = document.createElement('div');
      assistantMsgRow.className = 'mtv-ai-msg-row assistant';
      const assistantBubbleId = 'ai-msg-' + Date.now();
      assistantMsgRow.innerHTML = `
        <span class="mtv-ai-msg-sender">MTV AI (${activeModelName})</span>
        <div class="mtv-ai-msg-bubble" id="${assistantBubbleId}">⏳ Generating AI response...</div>
        <div class="mtv-ai-msg-actions" id="actions-${assistantBubbleId}" style="display: none;">
          <button type="button" class="mtv-ai-btn-copy" onclick="window.mtvAI.copyMsgText('${assistantBubbleId}', this)">
            📋 Copy Response
          </button>
        </div>
      `;
      messagesContainer.appendChild(assistantMsgRow);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      try {
        const endpoint = `${this.apiBase}/api/chat`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            message: promptText,
            userPrompt: promptText,
            systemInstruction: systemInstruction || 'You are an expert YouTube and social media SEO growth consultant. Provide concise, clear, actionable recommendations.',
            provider: 'gemini',
            model: this.activeModel,
            temperature: 0.7
          })
        });

        const contentType = res.headers.get('content-type') || '';
        let data = null;
        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const rawText = await res.text();
          throw new Error(`Server returned non-JSON response (${res.status}): ${rawText.slice(0, 150)}`);
        }

        const bubbleEl = document.getElementById(assistantBubbleId);
        const actionsEl = document.getElementById(`actions-${assistantBubbleId}`);

        if (data && data.success && data.response) {
          if (bubbleEl) bubbleEl.innerHTML = this.formatMarkdown(data.response);
          if (actionsEl) actionsEl.style.display = 'flex';
          if (statusIndicator) statusIndicator.textContent = `Completed via ${data.model || 'gemini-3.7-flash'}`;
        } else {
          const errMsg = data?.error || 'Failed to generate AI response. Please verify backend API setup.';
          if (bubbleEl) bubbleEl.textContent = `⚠️ Error: ${errMsg}`;
          if (statusIndicator) statusIndicator.textContent = 'Execution Error';
        }
      } catch (err) {
        console.error('[MTV AI Engine] Request failed:', err);
        const bubbleEl = document.getElementById(assistantBubbleId);
        if (bubbleEl) {
          bubbleEl.textContent = `⚠️ Communication Error: ${err.message || 'Unable to connect to backend.'}`;
        }
        if (statusIndicator) statusIndicator.textContent = 'Connection Error';
      } finally {
        this.isProcessing = false;
        if (sendBtn) sendBtn.disabled = false;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }

    copyMsgText(bubbleId, btnEl) {
      const bubble = document.getElementById(bubbleId);
      if (!bubble) return;
      const text = bubble.innerText || bubble.textContent || '';
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        if (btnEl) {
          const origText = btnEl.innerHTML;
          btnEl.innerHTML = '✓ Copied!';
          setTimeout(() => { btnEl.innerHTML = origText; }, 2000);
        }
      }).catch(err => {
        console.warn('Copy failed:', err);
      });
    }

    formatMarkdown(text) {
      if (!text) return '';
      let escaped = this.escapeHtml(text);

      // Bold **text**
      escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic *text*
      escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
      // Code block ```code```
      escaped = escaped.replace(/```([\s\S]*?)```/g, '<pre style="background: rgba(0,0,0,0.05); padding: 0.75rem; border-radius: 6px; overflow-x: auto;"><code>$1</code></pre>');
      // Inline code `code`
      escaped = escaped.replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.05); padding: 0.15rem 0.35rem; border-radius: 4px;">$1</code>');
      // Line breaks
      escaped = escaped.replace(/\n/g, '<br/>');

      return escaped;
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

  window.mtvAI = new MtvAIEngine();
})();

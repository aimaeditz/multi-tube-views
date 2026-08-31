/**
 * MTV AI Core — Lightweight Frontend AI Integration Helper
 * Exposes global MTVAI object:
 *  - MTVAI.run({ task, prompt }) -> returns { result } or { error }
 *  - MTVAI.bindTool({ task, inputId, buttonId, outputId, selectId }) -> auto-wires input + button + output to backend with validation
 */
(function (global) {
  'use strict';

  // Inject validation styles dynamically if not already present
  function injectValidationStyles() {
    if (typeof document === 'undefined' || document.getElementById('mtv-validation-styles')) return;
    const style = document.createElement('style');
    style.id = 'mtv-validation-styles';
    style.textContent = `
      @keyframes mtv-shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-6px); }
        40%, 80% { transform: translateX(6px); }
      }
      .mtv-invalid-field {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25) !important;
        animation: mtv-shake 300ms ease-in-out !important;
        transition: border-color 0.3s ease, box-shadow 0.3s ease !important;
      }
      .mtvai-btn-inactive {
        opacity: 0.65 !important;
        cursor: not-allowed !important;
      }
    `;
    document.head.appendChild(style);
  }

  function triggerFieldFeedback(el) {
    if (!el) return;
    el.classList.remove('mtv-invalid-field');
    void el.offsetWidth; // Force reflow
    el.classList.add('mtv-invalid-field');

    if (el._mtvValidationTimeout) {
      clearTimeout(el._mtvValidationTimeout);
    }
    el._mtvValidationTimeout = setTimeout(() => {
      el.classList.remove('mtv-invalid-field');
    }, 1500);
  }

  function isInputFilled(inputEl) {
    if (!inputEl) return false;
    return Boolean(inputEl.value && inputEl.value.trim().length > 0);
  }

  function isDropdownSelected(selectEl) {
    if (!selectEl) return true;
    // If element or its container is hidden, treat as not applicable
    if (selectEl.offsetParent === null && selectEl.offsetWidth === 0 && selectEl.offsetHeight === 0) {
      return true;
    }
    const val = (selectEl.value || '').trim();
    if (!val) return false;
    if (val.toLowerCase() === 'placeholder' || val.toLowerCase().startsWith('select-') || val === 'select') {
      return false;
    }
    const selectedOpt = selectEl.options[selectEl.selectedIndex];
    if (selectedOpt && selectedOpt.disabled) {
      return false;
    }
    return true;
  }

  function findActiveSelect(buttonEl, config) {
    if (config && config.selectId) {
      const el = document.getElementById(config.selectId);
      if (el) return el;
    }
    const container = (buttonEl ? buttonEl.closest('.card, form, #dedicated-tool-workspace, body') : null) || document.body;
    const selects = Array.from(container.querySelectorAll('select'));
    for (const sel of selects) {
      if (sel.id === 'mtv-ai-model-select' || sel.id === 'ai-auto-model-select') {
        continue; // Skip AI engine model dropdowns
      }
      const style = window.getComputedStyle(sel);
      const parentStyle = sel.parentElement ? window.getComputedStyle(sel.parentElement) : null;
      const grandParentStyle = sel.parentElement && sel.parentElement.parentElement ? window.getComputedStyle(sel.parentElement.parentElement) : null;

      const isHidden = (
        style.display === 'none' || style.visibility === 'hidden' ||
        (parentStyle && parentStyle.display === 'none') ||
        (grandParentStyle && grandParentStyle.display === 'none')
      );

      if (!isHidden) {
        return sel;
      }
    }
    return null;
  }

  const MTVAI = {
    triggerFieldFeedback,
    isInputFilled,
    isDropdownSelected,

    /**
     * Run an AI task through the proxy backend
     * @param {Object} options
     * @param {string} options.task - Task identifier (e.g. 'seo-title', 'hashtags', etc.)
     * @param {string} options.prompt - Prompt or topic text
     * @returns {Promise<{result?: string, error?: string}>}
     */
    async run({ task, prompt }) {
      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return { error: 'Please enter a topic or text first.' };
      }

      try {
        const res = await fetch('/api/ai-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            task: task || 'default',
            prompt: prompt.trim()
          })
        });

        const contentType = res.headers.get('content-type') || '';
        let data = {};
        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const rawText = await res.text();
          return { error: `Server error (${res.status}): ${rawText.slice(0, 100)}` };
        }

        if (!res.ok) {
          return { error: data.error || `HTTP ${res.status} error` };
        }

        if (data.result !== undefined) {
          return { result: data.result };
        } else if (data.error) {
          return { error: data.error };
        } else {
          return { error: 'No response received from AI server' };
        }
      } catch (err) {
        console.error('[MTVAI.run] Network error:', err);
        return { error: err.message || 'Unable to connect to AI server.' };
      }
    },

    /**
     * Auto-wires an input box + generate button + output box to the backend
     * @param {Object} config
     * @param {string} config.task - The tool task ID
     * @param {string} config.inputId - ID of the input field / textarea
     * @param {string} config.buttonId - ID of the generate button
     * @param {string} config.outputId - ID of the output box
     * @param {string} [config.selectId] - Optional ID of the platform/language dropdown
     */
    bindTool({ task, inputId, buttonId, outputId, selectId }) {
      injectValidationStyles();

      const inputEl = document.getElementById(inputId);
      const buttonEl = document.getElementById(buttonId);
      const outputEl = document.getElementById(outputId);

      if (!buttonEl || !inputEl || !outputEl) {
        return;
      }

      // Store current bound task
      buttonEl._mtvaiBoundTask = task;

      // Helper to update button visual active/inactive state
      const updateButtonVisualState = () => {
        if (buttonEl._isProcessing) return; // Do not alter visual state while executing request

        const selectEl = findActiveSelect(buttonEl, { selectId });
        const valid = isInputFilled(inputEl) && isDropdownSelected(selectEl);

        if (valid) {
          buttonEl.classList.remove('mtvai-btn-inactive');
          buttonEl.style.opacity = '1';
          buttonEl.style.cursor = 'pointer';
        } else {
          buttonEl.classList.add('mtvai-btn-inactive');
          buttonEl.style.opacity = '0.65';
          buttonEl.style.cursor = 'not-allowed';
        }
      };

      // Bind input events for live validation feedback
      if (!inputEl._mtvValidationBound) {
        inputEl._mtvValidationBound = true;
        inputEl.addEventListener('input', () => {
          if (isInputFilled(inputEl)) {
            inputEl.classList.remove('mtv-invalid-field');
          }
          updateButtonVisualState();
        });
      }

      // Bind change events to all selects in the container
      const container = buttonEl.closest('.card, form, #dedicated-tool-workspace, body') || document.body;
      const selects = container.querySelectorAll('select');
      selects.forEach(sel => {
        if (!sel._mtvValidationBound) {
          sel._mtvValidationBound = true;
          sel.addEventListener('change', () => {
            if (isDropdownSelected(sel)) {
              sel.classList.remove('mtv-invalid-field');
            }
            updateButtonVisualState();
          });
        }
      });

      // Initial state sync
      updateButtonVisualState();

      buttonEl.onclick = async (e) => {
        if (e) e.preventDefault();

        if (buttonEl.disabled || buttonEl._isProcessing) {
          return;
        }

        const activeTask = buttonEl._mtvaiBoundTask || task;
        const selectEl = findActiveSelect(buttonEl, { selectId });

        const inputValid = isInputFilled(inputEl);
        const selectValid = isDropdownSelected(selectEl);

        if (!inputValid || !selectValid) {
          if (!inputValid) {
            triggerFieldFeedback(inputEl);
          }
          if (!selectValid && selectEl) {
            triggerFieldFeedback(selectEl);
          }
          updateButtonVisualState();
          return; // STOP! Do NOT call backend!
        }

        const prompt = inputEl.value.trim();

        // Save input state
        try {
          sessionStorage.setItem(`mtv_input_${activeTask}`, prompt);
        } catch (err) {}

        // UI Loading state
        buttonEl._isProcessing = true;
        buttonEl.classList.remove('mtvai-btn-inactive');
        const originalBtnHtml = buttonEl.innerHTML;
        const originalDisabled = buttonEl.disabled;
        buttonEl.disabled = true;
        buttonEl.innerHTML = '<span>Generating Output...</span>';

        const loadingEl = document.getElementById('dedicated-tool-loading');
        const loadingText = document.getElementById('dedicated-loading-text');
        const outputWrap = document.getElementById('dedicated-tool-output-wrap');

        if (loadingEl) {
          loadingEl.style.display = 'block';
          if (loadingText) loadingText.textContent = 'Running MTV AI...';
        }
        if (outputWrap) {
          outputWrap.style.display = 'none';
        }

        try {
          const res = await MTVAI.run({ task: activeTask, prompt });

          if (res.error) {
            outputEl.textContent = `Error: ${res.error}`;
          } else {
            // Display result as plain text preserving line breaks
            outputEl.textContent = res.result || '';
            try {
              sessionStorage.setItem(`mtv_output_${activeTask}`, res.result || '');
            } catch (err) {}
          }

          if (outputWrap) {
            outputWrap.style.display = 'block';
          }
          outputEl.scrollTop = 0;
        } catch (err) {
          outputEl.textContent = `Error: ${err.message || 'Generation failed'}`;
          if (outputWrap) {
            outputWrap.style.display = 'block';
          }
        } finally {
          buttonEl._isProcessing = false;
          buttonEl.disabled = originalDisabled;
          buttonEl.innerHTML = originalBtnHtml;
          if (loadingEl) {
            loadingEl.style.display = 'none';
          }
          updateButtonVisualState();
        }
      };
    }
  };

  global.MTVAI = MTVAI;
})(typeof window !== 'undefined' ? window : this);

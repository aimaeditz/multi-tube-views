/**
 * MTV AI Core — Lightweight Frontend AI Integration Helper
 * Exposes global MTVAI object:
 *  - MTVAI.run({ task, prompt }) -> returns { result } or { error }
 *  - MTVAI.bindTool({ task, inputId, buttonId, outputId }) -> auto-wires input + button + output to backend
 */
(function (global) {
  'use strict';

  const MTVAI = {
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
     */
    bindTool({ task, inputId, buttonId, outputId }) {
      const inputEl = document.getElementById(inputId);
      const buttonEl = document.getElementById(buttonId);
      const outputEl = document.getElementById(outputId);

      if (!buttonEl || !inputEl || !outputEl) {
        return;
      }

      // Store current bound task
      buttonEl._mtvaiBoundTask = task;

      buttonEl.onclick = async (e) => {
        if (e) e.preventDefault();
        
        // Always check the current bound task on the button
        const activeTask = buttonEl._mtvaiBoundTask || task;
        const prompt = inputEl.value.trim();

        if (!prompt) {
          const toast = document.getElementById('copy-toast');
          if (toast) {
            toast.textContent = 'Please enter some text or keywords first.';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2500);
          }
          inputEl.focus();
          return;
        }

        // Save input state
        try {
          sessionStorage.setItem(`mtv_input_${activeTask}`, prompt);
        } catch (err) {}

        // UI Loading state
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
          buttonEl.disabled = originalDisabled;
          buttonEl.innerHTML = originalBtnHtml;
          if (loadingEl) {
            loadingEl.style.display = 'none';
          }
        }
      };
    }
  };

  global.MTVAI = MTVAI;
})(typeof window !== 'undefined' ? window : this);

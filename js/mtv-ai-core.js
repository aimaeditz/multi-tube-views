/* ============================================================
   MTV AI SYSTEM — Core Frontend Engine
   ============================================================
   Ye file GitHub repo mein "js/mtv-ai-core.js" path par jaani chahiye.

   Kaam: Har AI tool page isi file ko use karega. Isse tumhe har
   naye tool ke liye alag se network/fetch code nahi likhna padega —
   sirf MTVAI.run() call karo.

   ---------------- USAGE (kisi bhi tool ke andar) ----------------

     const output = await MTVAI.run({
       task: 'hashtag-generator',
       prompt: 'cooking video about pasta ke liye hashtags do'
     });

     if (output.error) {
       console.log('Error:', output.error);
     } else {
       console.log(output.result); // AI ka jawab yahan milega
     }

   ------------------------------------------------------------ */

const MTVAI = {
  endpoint: '/api/ai-proxy',

  async run({ task = 'default', prompt, platform, language, tone } = {}) {
    if (!prompt) {
      return { error: 'Prompt is required' };
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, prompt, platform, language, tone })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Failed to generate response' };
      }

      return { result: data.result };
    } catch (err) {
      return { error: 'Network error: ' + err.message };
    }
  },

  bindTool({ task, inputId, buttonId, outputId }) {
    const btn = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    const output = document.getElementById(outputId);
    const outputWrap = document.getElementById('dedicated-tool-output-wrap');
    const loadingWrap = document.getElementById('dedicated-tool-loading');

    if (!btn || !input || !output) return;

    if (btn._mtvClickListener) {
      btn.removeEventListener('click', btn._mtvClickListener);
    }

    btn._mtvClickListener = async () => {
      const prompt = input.value.trim();
      if (!prompt) {
        const toast = document.getElementById('copy-toast');
        if (toast) {
          toast.textContent = 'Please enter your topic or text first.';
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2500);
        }
        input.focus();
        return;
      }

      const platformSelect = document.getElementById('dedicated-tool-platform-select');
      const langSelect = document.getElementById('dedicated-tool-language-select');
      const toneSelect = document.getElementById('dedicated-tool-tone-select');

      const platform = platformSelect ? platformSelect.value : undefined;
      const language = langSelect ? langSelect.value : undefined;
      const tone = toneSelect ? toneSelect.value : undefined;

      if (loadingWrap) loadingWrap.style.display = 'block';
      if (outputWrap) outputWrap.style.display = 'none';
      btn.disabled = true;

      const res = await MTVAI.run({ task, prompt, platform, language, tone });

      if (loadingWrap) loadingWrap.style.display = 'none';
      btn.disabled = false;

      if (res.error) {
        output.textContent = 'Error: ' + res.error;
      } else {
        output.textContent = res.result || 'No response generated.';
        try {
          sessionStorage.setItem(`mtv_input_${task}`, prompt);
          sessionStorage.setItem(`mtv_output_${task}`, res.result || '');
        } catch (e) {
          // ignore storage quota issues
        }
      }

      if (outputWrap) outputWrap.style.display = 'block';
      if (window.innerWidth <= 768 && outputWrap) {
        outputWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    btn.addEventListener('click', btn._mtvClickListener);
  }
};

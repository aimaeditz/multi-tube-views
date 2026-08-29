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

  async run({ task = 'default', prompt } = {}) {
    if (!prompt) {
      return { error: 'Prompt zaroori hai' };
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Kuch galat ho gaya' };
      }

      return { result: data.result };
    } catch (err) {
      return { error: 'Network error: ' + err.message };
    }
  },

  // Helper: kisi bhi button + input + output-box ko seedha jod dega.
  // Naya tool page banate waqt is helper se UI wiring bahut aasan ho jaati hai.
  bindTool({ task, inputId, buttonId, outputId }) {
    const btn = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    const output = document.getElementById(outputId);

    if (!btn || !input || !output) return;

    btn.addEventListener('click', async () => {
      const prompt = input.value.trim();
      if (!prompt) {
        output.textContent = 'Pehle kuch likho.';
        return;
      }

      output.textContent = 'Soch raha hoon...';
      btn.disabled = true;

      const res = await MTVAI.run({ task, prompt });

      output.textContent = res.error ? ('Error: ' + res.error) : res.result;
      btn.disabled = false;
    });
  }
};

/* ============================================================
   MTV AI SYSTEM — Core Frontend Engine — with Cooldown
   ============================================================
   Same as before, PLUS: after each generate, the button is disabled
   for a short cooldown (8 seconds) showing a countdown, so users can't
   spam-click and burn through API quota unnecessarily.
   ------------------------------------------------------------ */

const MTVAI = {
  endpoint: '/api/ai-proxy',
  cooldownSeconds: 8,

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

  bindTool({ task, inputId, buttonId, outputId }) {
    const btn = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    const output = document.getElementById(outputId);

    if (!btn || !input || !output) return;

    const originalLabel = btn.textContent;

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

      // Cooldown countdown before re-enabling the button
      let secondsLeft = MTVAI.cooldownSeconds;
      btn.textContent = `Wait ${secondsLeft}s`;
      const countdown = setInterval(() => {
        secondsLeft--;
        if (secondsLeft <= 0) {
          clearInterval(countdown);
          btn.disabled = false;
          btn.textContent = originalLabel;
        } else {
          btn.textContent = `Wait ${secondsLeft}s`;
        }
      }, 1000);
    });
  }
};

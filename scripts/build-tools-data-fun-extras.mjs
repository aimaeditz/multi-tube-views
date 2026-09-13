// Category: Fun & Miscellaneous (6 tools)
export const FUN_EXTRAS_TOOLS = [
  // 1. Coin Flipper
  {
    id: 'coin-flipper',
    categoryId: 'fun-miscellaneous',
    name: '3D Coin Flipper & Heads/Tails Simulator',
    icon: '🪙',
    title: 'Coin Flipper & Heads or Tails Simulator — Cryptographically Random Decision Maker',
    description: 'Flip a digital 3D coin with realistic CSS flip animations, cryptographic Web Crypto randomness, flip streak counters, and multiple coin batch flips.',
    keywords: 'coin flipper, heads or tails online, flip a coin 3d, random coin toss, decision maker coin',
    howToUse: [
      { step: '1', title: 'Choose Flip Count', desc: 'Select 1 Coin, 3 Coins, or 5 Coins.' },
      { step: '2', title: 'Click Flip Coin', desc: 'Watch the dynamic 3D spinning coin animation.' },
      { step: '3', title: 'Inspect Random Outcome', desc: 'View Heads/Tails outcome, streaks, and cumulative percentage probability.' }
    ],
    features: [
      { title: 'Web Crypto Randomness', desc: 'True non-predictable randomness using window.crypto.getRandomValues().' },
      { title: 'Dynamic 3D Animation', desc: 'Smooth CSS 3D keyframe tumbling rotation.' },
      { title: 'Historical Streak Counter', desc: 'Tracks total flips, heads count, and tails count across session.' }
    ],
    sampleText: 'Heads or Tails',
    renderControls: () => `
      <div style="text-align: center; margin: 2rem 0;">
        <div id="coin-element" style="width: 130px; height: 130px; border-radius: 50%; background: linear-gradient(135deg, #fbbf24, #d97706); margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: 900; color: #78350f; border: 6px solid #fef08a; box-shadow: 0 10px 25px rgba(217,119,6,0.3); transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
          HEADS
        </div>
        <div id="coin-result-text" style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-top: 1.25rem;">Click to Flip!</div>
      </div>

      <div class="bu-actions-bar" style="justify-content: center; margin-bottom: 1.5rem;">
        <button type="button" id="btn-coin-flip" class="bu-btn bu-btn-primary" style="font-size: 1.1rem; padding: 0.75rem 2.5rem;">🪙 Flip Coin</button>
        <button type="button" id="btn-coin-reset" class="bu-btn bu-btn-subtle">Reset Stats</button>
      </div>

      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem;">
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Total Flips</span>
          <strong id="coin-total" style="font-size: 1.5rem; color: var(--accent-blue); display: block; margin-top: 0.2rem;">0</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Heads Count</span>
          <strong id="coin-heads" style="font-size: 1.5rem; color: var(--success-text); display: block; margin-top: 0.2rem;">0 (0%)</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Tails Count</span>
          <strong id="coin-tails" style="font-size: 1.5rem; color: var(--accent-primary); display: block; margin-top: 0.2rem;">0 (0%)</strong>
        </div>
      </div>
    `,
    renderScript: () => `
      const coin = document.getElementById('coin-element');
      const resultText = document.getElementById('coin-result-text');
      const flipBtn = document.getElementById('btn-coin-flip');
      const resetBtn = document.getElementById('btn-coin-reset');

      const totalEl = document.getElementById('coin-total');
      const headsEl = document.getElementById('coin-heads');
      const tailsEl = document.getElementById('coin-tails');

      let total = 0;
      let heads = 0;
      let tails = 0;
      let isFlipping = false;
      let currentRotation = 0;

      function updateStats() {
        totalEl.textContent = total;
        const hPct = total > 0 ? Math.round((heads / total) * 100) : 0;
        const tPct = total > 0 ? Math.round((tails / total) * 100) : 0;
        headsEl.textContent = \`\${heads} (\${hPct}%)\`;
        tailsEl.textContent = \`\${tails} (\${tPct}%)\`;
      }

      flipBtn.addEventListener('click', () => {
        if (isFlipping) return;
        isFlipping = true;
        flipBtn.disabled = true;

        const array = new Uint8Array(1);
        window.crypto.getRandomValues(array);
        const isHeads = array[0] % 2 === 0;

        currentRotation += 1800 + (isHeads ? 0 : 180);
        coin.style.transform = \`rotateY(\${currentRotation}deg)\`;

        setTimeout(() => {
          total++;
          if (isHeads) {
            heads++;
            coin.textContent = 'HEADS';
            coin.style.background = 'linear-gradient(135deg, #fbbf24, #d97706)';
            resultText.textContent = '🎉 HEADS!';
          } else {
            tails++;
            coin.textContent = 'TAILS';
            coin.style.background = 'linear-gradient(135deg, #94a3b8, #475569)';
            resultText.textContent = '🛡️ TAILS!';
          }
          updateStats();
          isFlipping = false;
          flipBtn.disabled = false;
        }, 800);
      });

      resetBtn.addEventListener('click', () => {
        total = 0; heads = 0; tails = 0;
        updateStats();
        resultText.textContent = 'Click to Flip!';
      });
    `
  },

  // 2. Dice Roller
  {
    id: 'dice-roller',
    categoryId: 'fun-miscellaneous',
    name: 'Multi-Dice Roller (D4 to D100)',
    icon: '🎲',
    title: 'Multi-Dice Roller — D4, D6, D8, D10, D12, D20 & D100 RPG Tabletop Simulator',
    description: 'Roll tabletop roleplaying game dice (D4, D6, D8, D10, D12, D20, D100) with dice quantity multipliers, modifier bonuses (+/-), roll histories, and total sums.',
    keywords: 'dice roller online, d20 dice roller, rpg tabletop dice, dnd dice simulator, roll multiple dice',
    howToUse: [
      { step: '1', title: 'Choose Die Type', desc: 'Select D6, D20, D4, D8, D10, D12, or D100.' },
      { step: '2', title: 'Set Quantity & Modifier', desc: 'Choose number of dice to roll (1-10) and optional +/- modifier.' },
      { step: '3', title: 'Roll Dice', desc: 'Inspect individual dice results and total calculated score.' }
    ],
    features: [
      { title: 'Full RPG Dice Support', desc: 'Complete set of polyhedral dice for D&D, Pathfinder, and tabletop board games.' },
      { title: 'Crypto Random Distribution', desc: 'Cryptographically fair dice rolls using Web Crypto.' },
      { title: 'Roll History Feed', desc: 'Log previous roll checks, critical hits (Nat 20), and fumble alerts.' }
    ],
    sampleText: '1d20 + 3',
    renderControls: () => `
      <div class="bu-actions-bar" style="justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
        <button type="button" class="bu-btn" data-dice-type="4">D4</button>
        <button type="button" class="bu-btn bu-btn-primary" data-dice-type="6">D6</button>
        <button type="button" class="bu-btn" data-dice-type="8">D8</button>
        <button type="button" class="bu-btn" data-dice-type="10">D10</button>
        <button type="button" class="bu-btn" data-dice-type="12">D12</button>
        <button type="button" class="bu-btn" data-dice-type="20">D20</button>
        <button type="button" class="bu-btn" data-dice-type="100">D100</button>
      </div>

      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.5rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="dice-count">Number of Dice</label>
          <input type="number" id="dice-count" class="bu-input" value="2" min="1" max="12">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="dice-modifier">Modifier (+/- Bonus)</label>
          <input type="number" id="dice-modifier" class="bu-input" value="0">
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div id="dice-cubes-box" style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; min-height: 80px; align-items: center;">
          <!-- Generated dice badges -->
        </div>
        <div id="dice-total-display" style="font-size: 2.8rem; font-weight: 900; color: var(--accent-primary);">Total: --</div>
      </div>

      <div class="bu-actions-bar" style="justify-content: center; margin-bottom: 1.5rem;">
        <button type="button" id="btn-dice-roll" class="bu-btn bu-btn-primary" style="font-size: 1.1rem; padding: 0.75rem 2.5rem;">🎲 Roll Dice</button>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Roll History Log</label>
        <div id="dice-history-log" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); padding: 0.75rem; max-height: 120px; overflow-y: auto; font-family: monospace; font-size: 0.85rem; color: var(--text-muted);">
          No rolls yet.
        </div>
      </div>
    `,
    renderScript: () => `
      let selectedSides = 6;
      const countInput = document.getElementById('dice-count');
      const modInput = document.getElementById('dice-modifier');
      const cubesBox = document.getElementById('dice-cubes-box');
      const totalDisplay = document.getElementById('dice-total-display');
      const rollBtn = document.getElementById('btn-dice-roll');
      const historyLog = document.getElementById('dice-history-log');

      const history = [];

      document.querySelectorAll('[data-dice-type]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-dice-type]').forEach(b => b.classList.remove('bu-btn-primary'));
          btn.classList.add('bu-btn-primary');
          selectedSides = parseInt(btn.getAttribute('data-dice-type'), 10);
        });
      });

      function roll() {
        const count = Math.min(12, Math.max(1, parseInt(countInput.value, 10) || 1));
        const mod = parseInt(modInput.value, 10) || 0;

        const rolls = [];
        for (let i = 0; i < count; i++) {
          const arr = new Uint32Array(1);
          window.crypto.getRandomValues(arr);
          const val = (arr[0] % selectedSides) + 1;
          rolls.push(val);
        }

        const sum = rolls.reduce((a, b) => a + b, 0) + mod;

        cubesBox.innerHTML = rolls.map(r => \`
          <div style="width: 60px; height: 60px; background: var(--bg-surface); border: 2px solid var(--accent-blue); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; color: var(--text-primary); box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            \${r}
          </div>
        \`).join('');

        const modStr = mod !== 0 ? (mod > 0 ? \`+\${mod}\` : \`\${mod}\`) : '';
        totalDisplay.textContent = \`Total: \${sum}\`;

        const logEntry = \`Rolled \${count}d\${selectedSides}\${modStr} -> [\${rolls.join(', ')}]\${modStr ? ' ' + modStr : ''} = \${sum}\`;
        history.unshift(logEntry);
        historyLog.innerHTML = history.slice(0, 10).map(h => \`<div>\${h}</div>\`).join('');
      }

      rollBtn.addEventListener('click', roll);
      roll();
    `
  },

  // 3. Spin the Wheel / Decision Maker
  {
    id: 'spin-the-wheel',
    categoryId: 'fun-miscellaneous',
    name: 'Spin the Wheel & Decision Picker',
    icon: '🎡',
    title: 'Spin the Wheel & Random Name Picker — Customizable Decision Wheel Canvas',
    description: 'Create custom spinning decision wheels with custom segment names, vibrant colors, realistic deceleration physics, and cryptographic slice winner selection.',
    keywords: 'spin the wheel, random name picker, decision wheel online, wheel of fortune spinner, random choice picker',
    howToUse: [
      { step: '1', title: 'Enter Choices', desc: 'Type names or choices (one per line).' },
      { step: '2', title: 'Spin Wheel', desc: 'Click Spin to start the rotating visual canvas animation.' },
      { step: '3', title: 'Celebrate Winner', desc: 'Inspect the winning selection dialog.' }
    ],
    features: [
      { title: 'HTML5 Canvas Rendering', desc: 'High-DPI sharp rendering with segment labels and alternating color schemes.' },
      { title: 'Realistic Physics Deceleration', desc: 'Natural easing deceleration curves for suspenseful spins.' },
      { title: 'Unlimited Segments', desc: 'Add 2 to 50 custom choices or participant names.' }
    ],
    sampleText: 'Option 1\\nOption 2\\nOption 3',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1.5rem; margin-bottom: 1.5rem; align-items: center;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="stw-items">Wheel Choices (One per line)</label>
          <textarea id="stw-items" class="bu-textarea" style="min-height: 180px;">🍕 Pizza
🍔 Burgers
🍣 Sushi
🥗 Salad
🌮 Tacos
🍝 Pasta</textarea>
        </div>

        <div style="text-align: center; position: relative;">
          <!-- Pointer -->
          <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 14px solid transparent; border-right: 14px solid transparent; border-top: 24px solid #ef4444; z-index: 10;"></div>
          <canvas id="stw-canvas" width="300" height="300" style="max-width: 100%; border-radius: 50%; box-shadow: 0 8px 25px rgba(0,0,0,0.15);"></canvas>
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div id="stw-winner" style="font-size: 1.6rem; font-weight: 900; color: var(--accent-primary); min-height: 40px;">Ready to Spin!</div>
      </div>

      <div class="bu-actions-bar" style="justify-content: center;">
        <button type="button" id="btn-stw-spin" class="bu-btn bu-btn-primary" style="font-size: 1.15rem; padding: 0.85rem 3rem;">🎡 Spin the Wheel!</button>
      </div>
    `,
    renderScript: () => `
      const canvas = document.getElementById('stw-canvas');
      const ctx = canvas.getContext('2d');
      const itemsInput = document.getElementById('stw-items');
      const spinBtn = document.getElementById('btn-stw-spin');
      const winnerEl = document.getElementById('stw-winner');

      const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

      let currentAngle = 0;
      let isSpinning = false;

      function getItems() {
        return itemsInput.value.split('\\n').map(s => s.trim()).filter(Boolean);
      }

      function drawWheel() {
        const items = getItems();
        const num = items.length;
        if (num === 0) return;

        const arc = (2 * Math.PI) / num;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = cx - 5;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < num; i++) {
          const angle = currentAngle + i * arc;
          ctx.beginPath();
          ctx.fillStyle = COLORS[i % COLORS.length];
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, radius, angle, angle + arc);
          ctx.lineTo(cx, cy);
          ctx.fill();
          ctx.stroke();

          // Text
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle + arc / 2);
          ctx.textAlign = 'right';
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 14px sans-serif';
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 4;
          ctx.fillText(items[i], radius - 20, 5);
          ctx.restore();
        }

        // Center hub
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      itemsInput.addEventListener('input', drawWheel);

      spinBtn.addEventListener('click', () => {
        if (isSpinning) return;
        const items = getItems();
        if (items.length < 2) {
          alert('Please enter at least 2 choices!');
          return;
        }

        isSpinning = true;
        spinBtn.disabled = true;
        winnerEl.textContent = '🎡 Spinning...';

        const spinTime = 4000;
        const start = performance.now();
        const startAngle = currentAngle;
        const totalRotations = (Math.PI * 2 * 6) + (Math.random() * Math.PI * 2);

        function animate(now) {
          const elapsed = now - start;
          const progress = Math.min(1, elapsed / spinTime);
          // Ease-out cubic
          const ease = 1 - Math.pow(1 - progress, 3);

          currentAngle = startAngle + (totalRotations * ease);
          drawWheel();

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            isSpinning = false;
            spinBtn.disabled = false;

            // Compute winning segment at top pointer (3*PI/2)
            const arc = (2 * Math.PI) / items.length;
            const normalized = (3 * Math.PI / 2 - (currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
            const winnerIdx = Math.floor(normalized / arc);
            const winner = items[winnerIdx] || items[0];

            winnerEl.textContent = \`🎉 Winner: \${winner}!\`;
          }
        }

        requestAnimationFrame(animate);
      });

      drawWheel();
    `
  },

  // 4. Typing Speed Test
  {
    id: 'typing-speed-test',
    categoryId: 'fun-miscellaneous',
    name: 'Typing Speed Test (WPM & Accuracy)',
    icon: '⌨️',
    title: 'Typing Speed Test — Words Per Minute (WPM), CPM & Character Accuracy Test',
    description: 'Test your keyboard typing speed (WPM), Characters Per Minute (CPM), and typing accuracy percentage with live character highlighting and 60-second timer challenge.',
    keywords: 'typing speed test, wpm test online, words per minute typing test, keyboard accuracy test, typing test 60 seconds',
    howToUse: [
      { step: '1', title: 'Start Typing', desc: 'Click into the typing field and begin typing the displayed text.' },
      { step: '2', title: 'Keep Typing Cleanly', desc: 'Green indicates correct letters, red indicates typing errors.' },
      { step: '3', title: 'Review WPM Score', desc: 'Inspect your calculated Words Per Minute and Accuracy rating.' }
    ],
    features: [
      { title: 'Live WPM & CPM Calculation', desc: 'Calculates standard net WPM = (all typed characters / 5) / minutes.' },
      { title: 'Character-by-Character Highlighting', desc: 'Visual cursor feedback on correct and incorrect keystrokes.' },
      { title: 'Curated Sentence Bank', desc: 'Randomized paragraphs covering technical, literature, and general themes.' }
    ],
    sampleText: 'The quick brown fox jumps over the lazy dog.',
    renderControls: () => `
      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">WPM Speed</span>
          <strong id="tst-wpm" style="font-size: 1.6rem; color: var(--accent-blue); display: block; margin-top: 0.2rem;">0</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Accuracy</span>
          <strong id="tst-acc" style="font-size: 1.6rem; color: var(--success-text); display: block; margin-top: 0.2rem;">100%</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Time Remaining</span>
          <strong id="tst-time" style="font-size: 1.6rem; color: var(--accent-primary); display: block; margin-top: 0.2rem;">60s</strong>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">Sample Paragraph to Type</label>
        <div id="tst-target-text" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); padding: 1.25rem; font-size: 1.15rem; line-height: 1.8; font-family: monospace; user-select: none;">
          <!-- Target text -->
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="tst-input">Type Here</label>
        <input type="text" id="tst-input" class="bu-input bu-input-mono" placeholder="Start typing the paragraph above..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-tst-restart" class="bu-btn bu-btn-primary">Restart Test</button>
      </div>
    `,
    renderScript: () => `
      const PASSAGES = [
        "Building fast, reliable browser tools requires zero server latency and clean client code.",
        "The quick brown fox jumps over the lazy dog while searching for high performance web utilities.",
        "Client side cryptography ensures total user privacy without transmitting sensitive data over networks.",
        "Modern web standards like Canvas and Web Audio allow complex desktop applications inside browser tabs."
      ];

      let targetPassage = PASSAGES[0];
      let startTime = null;
      let timer = null;
      let timeLeft = 60;
      let isRunning = false;

      const targetBox = document.getElementById('tst-target-text');
      const input = document.getElementById('tst-input');
      const wpmEl = document.getElementById('tst-wpm');
      const accEl = document.getElementById('tst-acc');
      const timeEl = document.getElementById('tst-time');
      const restartBtn = document.getElementById('btn-tst-restart');

      function initTest() {
        if (timer) clearInterval(timer);
        timer = null;
        isRunning = false;
        startTime = null;
        timeLeft = 60;
        timeEl.textContent = '60s';
        wpmEl.textContent = '0';
        accEl.textContent = '100%';
        input.value = '';
        input.disabled = false;

        targetPassage = PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
        renderTarget('');
      }

      function renderTarget(typed) {
        let html = '';
        for (let i = 0; i < targetPassage.length; i++) {
          const expected = targetPassage[i];
          const actual = typed[i];
          if (actual == null) {
            html += \`<span style="color: var(--text-muted);">\${expected}</span>\`;
          } else if (actual === expected) {
            html += \`<span style="color: var(--success-text); background: rgba(16,185,129,0.15); border-radius: 2px;">\${expected}</span>\`;
          } else {
            html += \`<span style="color: #ef4444; background: rgba(239,68,68,0.2); border-radius: 2px;">\${expected}</span>\`;
          }
        }
        targetBox.innerHTML = html;
      }

      input.addEventListener('input', () => {
        if (!isRunning && input.value.length > 0) {
          isRunning = true;
          startTime = performance.now();
          timer = setInterval(() => {
            if (timeLeft > 0) {
              timeLeft--;
              timeEl.textContent = \`\${timeLeft}s\`;
            } else {
              clearInterval(timer);
              input.disabled = true;
            }
          }, 1000);
        }

        const typed = input.value;
        renderTarget(typed);

        if (startTime) {
          const elapsedMins = (performance.now() - startTime) / 60000;
          let correct = 0;
          for (let i = 0; i < typed.length; i++) {
            if (typed[i] === targetPassage[i]) correct++;
          }

          const wpm = elapsedMins > 0 ? Math.round((correct / 5) / elapsedMins) : 0;
          const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;

          wpmEl.textContent = wpm;
          accEl.textContent = \`\${acc}%\`;

          if (typed === targetPassage) {
            clearInterval(timer);
            input.disabled = true;
          }
        }
      });

      restartBtn.addEventListener('click', initTest);
      initTest();
    `
  },

  // 5. Sound Effects / Synthesizer
  {
    id: 'sound-effects-generator',
    categoryId: 'fun-miscellaneous',
    name: 'Sound Effects & Chime Synthesizer',
    icon: '🔊',
    title: 'Sound Effects & UI Chime Synthesizer — Web Audio Oscillator & Bleep Generator',
    description: 'Synthesize custom 8-bit retro gaming sound effects, notification chimes, sci-fi laser zaps, and UI click audio using the browser Web Audio API oscillator with zero external sound files.',
    keywords: 'sound effects generator, web audio synthesizer, 8 bit sound maker, bleeps and chimes generator, ui audio maker',
    howToUse: [
      { step: '1', title: 'Choose Sound Type', desc: 'Select Coin, Jump, Laser, Power Up, Notification, or Error tone.' },
      { step: '2', title: 'Tune Waveform & Frequency', desc: 'Pick Sine, Square, Sawtooth, or Triangle waves.' },
      { step: '3', title: 'Play & Export Audio', desc: 'Trigger instant live playback directly through your computer speakers.' }
    ],
    features: [
      { title: 'Zero External MP3/WAV Files', desc: 'Generates pure acoustic frequencies in real time using Web Audio oscillators.' },
      { title: '6 Preset Sound Archetypes', desc: 'Pre-configured envelopes for Success, Laser, Coin Pickup, UI Pop, and Alert.' },
      { title: 'Frequency Envelope Controls', desc: 'Fine-tune pitch slides and decay durations.' }
    ],
    sampleText: 'Retro 8-bit sound effects',
    renderControls: () => `
      <div class="bu-actions-bar" style="justify-content: center; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
        <button type="button" class="bu-btn bu-btn-primary" data-sfx-preset="coin">🪙 Coin Pickup</button>
        <button type="button" class="bu-btn" data-sfx-preset="laser">🔫 Sci-Fi Laser</button>
        <button type="button" class="bu-btn" data-sfx-preset="powerup">⚡ Power Up</button>
        <button type="button" class="bu-btn" data-sfx-preset="jump">🦘 Game Jump</button>
        <button type="button" class="bu-btn" data-sfx-preset="chime">🔔 UI Notification</button>
        <button type="button" class="bu-btn" data-sfx-preset="error">⚠️ Warning Buzzer</button>
      </div>

      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.5rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="sfx-wave">Oscillator Waveform</label>
          <select id="sfx-wave" class="bu-input">
            <option value="sine" selected>Sine (Smooth / Clean)</option>
            <option value="square">Square (8-Bit Retro)</option>
            <option value="sawtooth">Sawtooth (Sharp / Buzzer)</option>
            <option value="triangle">Triangle (Soft Warm)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="sfx-freq">Start Frequency (Hz)</label>
          <input type="number" id="sfx-freq" class="bu-input" value="987" min="40" max="4000">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="sfx-dur">Duration (Seconds)</label>
          <input type="number" id="sfx-dur" class="bu-input" value="0.25" step="0.05" min="0.05" max="2">
        </div>
      </div>

      <div class="bu-actions-bar" style="justify-content: center;">
        <button type="button" id="btn-sfx-play" class="bu-btn bu-btn-primary" style="font-size: 1.2rem; padding: 0.85rem 3rem;">▶️ Play Sound</button>
      </div>
    `,
    renderScript: () => `
      const waveSelect = document.getElementById('sfx-wave');
      const freqInput = document.getElementById('sfx-freq');
      const durInput = document.getElementById('sfx-dur');
      const playBtn = document.getElementById('btn-sfx-play');

      let audioCtx = null;

      function getAudioContext() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
      }

      function playTone(wave, startFreq, endFreq, dur) {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = wave;
        osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
        if (endFreq) {
          osc.frequency.exponentialRampToValueAtTime(Math.max(10, endFreq), ctx.currentTime + dur);
        }

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + dur);
      }

      playBtn.addEventListener('click', () => {
        const wave = waveSelect.value;
        const freq = parseFloat(freqInput.value) || 440;
        const dur = parseFloat(durInput.value) || 0.25;
        playTone(wave, freq, null, dur);
      });

      document.querySelectorAll('[data-sfx-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-sfx-preset]').forEach(b => b.classList.remove('bu-btn-primary'));
          btn.classList.add('bu-btn-primary');

          const preset = btn.getAttribute('data-sfx-preset');
          if (preset === 'coin') {
            waveSelect.value = 'sine'; freqInput.value = '987'; durInput.value = '0.25';
            playTone('sine', 987, 1318, 0.25);
          } else if (preset === 'laser') {
            waveSelect.value = 'sawtooth'; freqInput.value = '1200'; durInput.value = '0.2';
            playTone('sawtooth', 1200, 100, 0.2);
          } else if (preset === 'powerup') {
            waveSelect.value = 'square'; freqInput.value = '300'; durInput.value = '0.35';
            playTone('square', 300, 1200, 0.35);
          } else if (preset === 'jump') {
            waveSelect.value = 'square'; freqInput.value = '150'; durInput.value = '0.15';
            playTone('square', 150, 600, 0.15);
          } else if (preset === 'chime') {
            waveSelect.value = 'sine'; freqInput.value = '587'; durInput.value = '0.5';
            playTone('sine', 587, 880, 0.5);
          } else if (preset === 'error') {
            waveSelect.value = 'sawtooth'; freqInput.value = '150'; durInput.value = '0.3';
            playTone('sawtooth', 150, 100, 0.3);
          }
        });
      });
    `
  },

  // 6. ASCII Art & Banner Generator
  {
    id: 'ascii-art-generator',
    categoryId: 'fun-miscellaneous',
    name: 'ASCII Art & Text Banner Generator',
    icon: '👾',
    title: 'ASCII Art & Figlet Text Banner Generator — Terminal & Code Header Maker',
    description: 'Transform regular text words and titles into large ASCII art typography banners and code comments for developer READMEs, CLI terminals, and Discord messages.',
    keywords: 'ascii art generator, ascii text banner maker, terminal banner generator, figlet online, code comment banner',
    howToUse: [
      { step: '1', title: 'Enter Text', desc: 'Type your title or handle (e.g. MULTI TUBE).' },
      { step: '2', title: 'Choose Font Style', desc: 'Select Block, Slant, Boxed, or Digital styles.' },
      { step: '3', title: 'Copy ASCII Art', desc: 'Copy formatted monospace ASCII code block for your terminal or markdown files.' }
    ],
    features: [
      { title: '4 Monospace Typography Styles', desc: 'Includes Block Heavy, Slanted Terminal, Framed Box, and Matrix styles.' },
      { title: 'Safe Monospace Rendering', desc: 'Preserves spacing integrity on GitHub, VS Code, Discord, and bash terminals.' },
      { title: '1-Click Markdown Wrapping', desc: 'Copies wrapped in ```markdown code blocks automatically.' }
    ],
    sampleText: 'MULTI TUBE',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="asc-input">Text to Convert</label>
          <input type="text" id="asc-input" class="bu-input" value="MTV 2026" maxlength="20">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="asc-style">ASCII Font Archetype</label>
          <select id="asc-style" class="bu-input">
            <option value="block" selected>Block 3D Font</option>
            <option value="framed">Framed Double Box</option>
            <option value="stars">Star Matrix Banner</option>
          </select>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="asc-output">
          <span>Generated ASCII Banner</span>
          <span class="bu-form-label-hint">Monospace format</span>
        </label>
        <textarea id="asc-output" class="bu-textarea bu-input-mono" style="min-height: 180px; font-size: 0.85rem; line-height: 1.2;" readonly></textarea>
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-asc-copy" class="bu-btn bu-btn-primary">Copy ASCII Art</button>
        <button type="button" id="btn-asc-copy-md" class="bu-btn">Copy as Markdown Code Block</button>
      </div>
    `,
    renderScript: () => `
      const input = document.getElementById('asc-input');
      const styleSelect = document.getElementById('asc-style');
      const output = document.getElementById('asc-output');

      const FONT_MAP = {
        'A': [' █████ ', '██   ██', '███████', '██   ██', '██   ██'],
        'B': ['██████ ', '██   ██', '██████ ', '██   ██', '██████ '],
        'C': [' ██████', '██     ', '██     ', '██     ', ' ██████'],
        'D': ['██████ ', '██   ██', '██   ██', '██   ██', '██████ '],
        'E': ['███████', '██     ', '█████  ', '██     ', '███████'],
        'F': ['███████', '██     ', '█████  ', '██     ', '██     '],
        'G': [' ██████', '██     ', '██  ███', '██   ██', ' ██████'],
        'H': ['██   ██', '██   ██', '███████', '██   ██', '██   ██'],
        'I': ['███████', '  ███  ', '  ███  ', '  ███  ', '███████'],
        'J': ['     ██', '     ██', '     ██', '██   ██', ' █████ '],
        'K': ['██   ██', '██  ██ ', '█████  ', '██  ██ ', '██   ██'],
        'L': ['██     ', '██     ', '██     ', '██     ', '███████'],
        'M': ['███ ███', '███████', '██ █ ██', '██   ██', '██   ██'],
        'N': ['███  ██', '████ ██', '██ ████', '██  ███', '██   ██'],
        'O': [' █████ ', '██   ██', '██   ██', '██   ██', ' █████ '],
        'P': ['██████ ', '██   ██', '██████ ', '██     ', '██     '],
        'Q': [' █████ ', '██   ██', '██ █ ██', '██  ██ ', ' ████ █'],
        'R': ['██████ ', '██   ██', '██████ ', '██   ██', '██   ██'],
        'S': [' ██████', '██     ', ' █████ ', '     ██', '██████ '],
        'T': ['███████', '  ███  ', '  ███  ', '  ███  ', '  ███  '],
        'U': ['██   ██', '██   ██', '██   ██', '██   ██', ' █████ '],
        'V': ['██   ██', '██   ██', '██   ██', ' ██ ██ ', '  ███  '],
        'W': ['██   ██', '██   ██', '██ █ ██', '███████', '███ ███'],
        'X': ['██   ██', ' ██ ██ ', '  ███  ', ' ██ ██ ', '██   ██'],
        'Y': ['██   ██', ' ██ ██ ', '  ███  ', '  ███  ', '  ███  '],
        'Z': ['███████', '   ███ ', '  ███  ', ' ███   ', '███████'],
        '0': [' █████ ', '██  ███', '██ █ ██', '███  ██', ' █████ '],
        '1': [' ████  ', '  ███  ', '  ███  ', '  ███  ', '███████'],
        '2': ['██████ ', '     ██', ' █████ ', '██     ', '███████'],
        '3': ['██████ ', '     ██', ' █████ ', '     ██', '███████'],
        '4': ['██  ██ ', '██  ██ ', '███████', '    ██ ', '    ██ '],
        '5': ['███████', '██     ', '██████ ', '     ██', '██████ '],
        '6': [' ██████', '██     ', '██████ ', '██   ██', ' █████ '],
        '7': ['███████', '    ██ ', '   ██  ', '  ██   ', '  ██   '],
        '8': [' █████ ', '██   ██', ' █████ ', '██   ██', ' █████ '],
        '9': [' █████ ', '██   ██', ' ██████', '     ██', ' █████ '],
        ' ': ['       ', '       ', '       ', '       ', '       ']
      };

      function renderAscii() {
        const text = input.value.toUpperCase();
        const style = styleSelect.value;
        let res = '';

        if (style === 'block') {
          const lines = ['', '', '', '', ''];
          for (const char of text) {
            const matrix = FONT_MAP[char] || FONT_MAP[' '];
            for (let i = 0; i < 5; i++) {
              lines[i] += matrix[i] + ' ';
            }
          }
          res = lines.join('\\n');
        } else if (style === 'framed') {
          const pad = '  ' + text + '  ';
          const top = '╔' + '═'.repeat(pad.length) + '╗';
          const mid = '║' + pad + '║';
          const bot = '╚' + '═'.repeat(pad.length) + '╝';
          res = \`\${top}\\n\${mid}\\n\${bot}\`;
        } else {
          const stars = '*'.repeat(text.length + 8);
          res = \`/\${stars}/\\n/*  \${text}  */\\n/\${stars}/\`;
        }

        output.value = res;
      }

      input.addEventListener('input', renderAscii);
      styleSelect.addEventListener('change', renderAscii);

      document.getElementById('btn-asc-copy').addEventListener('click', () => {
        window.MTV_BU.copyToClipboard(output.value, document.getElementById('btn-asc-copy'));
      });

      document.getElementById('btn-asc-copy-md').addEventListener('click', () => {
        const md = String.fromCharCode(96).repeat(3) + '\\n' + output.value + '\\n' + String.fromCharCode(96).repeat(3);
        window.MTV_BU.copyToClipboard(md, document.getElementById('btn-asc-copy-md'));
      });

      renderAscii();
    `
  }
];

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
      { step: '1', title: 'Choose Flip Count', desc: 'Select 1 Coin, 2 Coins, 3 Coins, or 5 Coins.' },
      { step: '2', title: 'Click Flip Coin', desc: 'Watch the dynamic 3D spinning coin animation with sound.' },
      { step: '3', title: 'Inspect Random Outcome', desc: 'View Heads/Tails outcome, streaks, and cumulative percentage probability.' }
    ],
    features: [
      { title: 'Web Crypto Randomness', desc: 'True non-predictable randomness using window.crypto.getRandomValues().' },
      { title: 'Dynamic 3D Tumbling Animation', desc: 'Smooth CSS 3D keyframe tumbling rotation and metallic sheen.' },
      { title: 'Multi-Coin Batch Flipping', desc: 'Flip 1, 2, 3, or 5 coins simultaneously to resolve multi-player decisions.' },
      { title: 'Acoustic Metallic Ping', desc: 'Web Audio simulated coin chime on toss.' }
    ],
    sampleText: 'Heads or Tails',
    renderControls: () => `
      <div class="bu-actions-bar" style="justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem;">
        <button type="button" class="bu-btn bu-btn-primary" data-coin-count="1">1 Coin</button>
        <button type="button" class="bu-btn" data-coin-count="2">2 Coins</button>
        <button type="button" class="bu-btn" data-coin-count="3">3 Coins</button>
        <button type="button" class="bu-btn" data-coin-count="5">5 Coins</button>
      </div>

      <div style="text-align: center; margin: 1.5rem 0; perspective: 1000px;">
        <div id="coin-stage" style="display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; min-height: 140px; align-items: center;">
          <div class="bu-coin-3d" style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #fbbf24, #d97706); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 900; color: #78350f; border: 5px solid #fef08a; box-shadow: 0 10px 25px rgba(217,119,6,0.35); transition: transform 0.85s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
            HEADS
          </div>
        </div>
        <div id="coin-result-text" style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-top: 1.25rem;">Click to Flip!</div>
      </div>

      <div class="bu-actions-bar" style="justify-content: center; gap: 1rem; margin-bottom: 1.5rem;">
        <button type="button" id="btn-coin-flip" class="bu-btn bu-btn-primary" style="font-size: 1.15rem; padding: 0.85rem 2.5rem;">🪙 Flip Coin(s)</button>
        <button type="button" id="btn-coin-reset" class="bu-btn bu-btn-subtle">Reset Stats</button>
      </div>

      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem;">
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Total Tosses</span>
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
      const stage = document.getElementById('coin-stage');
      const resultText = document.getElementById('coin-result-text');
      const flipBtn = document.getElementById('btn-coin-flip');
      const resetBtn = document.getElementById('btn-coin-reset');

      const totalEl = document.getElementById('coin-total');
      const headsEl = document.getElementById('coin-heads');
      const tailsEl = document.getElementById('coin-tails');

      let numCoins = 1;
      let total = 0;
      let heads = 0;
      let tails = 0;
      let isFlipping = false;
      let rotations = [0, 0, 0, 0, 0];

      function playCoinSound() {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.18);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
        } catch(e) {}
      }

      function renderCoins() {
        let html = '';
        for (let i = 0; i < numCoins; i++) {
          html += \`
            <div id="coin-item-\${i}" class="bu-coin-3d" style="width: 110px; height: 110px; border-radius: 50%; background: linear-gradient(135deg, #fbbf24, #d97706); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 900; color: #78350f; border: 5px solid #fef08a; box-shadow: 0 10px 25px rgba(217,119,6,0.35); transition: transform 0.85s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
              HEADS
            </div>
          \`;
        }
        stage.innerHTML = html;
      }

      function updateStats() {
        totalEl.textContent = total;
        const hPct = total > 0 ? Math.round((heads / total) * 100) : 0;
        const tPct = total > 0 ? Math.round((tails / total) * 100) : 0;
        headsEl.textContent = \`\${heads} (\${hPct}%)\`;
        tailsEl.textContent = \`\${tails} (\${tPct}%)\`;
      }

      document.querySelectorAll('[data-coin-count]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-coin-count]').forEach(b => b.classList.remove('bu-btn-primary'));
          btn.classList.add('bu-btn-primary');
          numCoins = parseInt(btn.getAttribute('data-coin-count'), 10) || 1;
          renderCoins();
          resultText.textContent = \`Ready to flip \${numCoins} coin\${numCoins > 1 ? 's' : ''}!\`;
        });
      });

      flipBtn.addEventListener('click', () => {
        if (isFlipping) return;
        isFlipping = true;
        flipBtn.disabled = true;
        playCoinSound();

        const results = [];
        for (let i = 0; i < numCoins; i++) {
          const arr = new Uint8Array(1);
          window.crypto.getRandomValues(arr);
          const isH = arr[0] % 2 === 0;
          results.push(isH);

          const coinEl = document.getElementById(\`coin-item-\${i}\`);
          if (coinEl) {
            rotations[i] = (rotations[i] || 0) + 1800 + (isH ? 0 : 180);
            coinEl.style.transform = \`rotateY(\${rotations[i]}deg)\`;
          }
        }

        setTimeout(() => {
          let batchHeads = 0;
          let batchTails = 0;

          for (let i = 0; i < numCoins; i++) {
            const isH = results[i];
            const coinEl = document.getElementById(\`coin-item-\${i}\`);
            total++;
            if (isH) {
              heads++;
              batchHeads++;
              if (coinEl) {
                coinEl.textContent = 'HEADS';
                coinEl.style.background = 'linear-gradient(135deg, #fbbf24, #d97706)';
              }
            } else {
              tails++;
              batchTails++;
              if (coinEl) {
                coinEl.textContent = 'TAILS';
                coinEl.style.background = 'linear-gradient(135deg, #94a3b8, #475569)';
              }
            }
          }

          if (numCoins === 1) {
            resultText.textContent = results[0] ? '🎉 HEADS!' : '🛡️ TAILS!';
          } else {
            resultText.textContent = \`Outcome: \${batchHeads} HEADS, \${batchTails} TAILS\`;
          }

          updateStats();
          isFlipping = false;
          flipBtn.disabled = false;
        }, 850);
      });

      resetBtn.addEventListener('click', () => {
        total = 0; heads = 0; tails = 0;
        updateStats();
        resultText.textContent = 'Click to Flip!';
        renderCoins();
      });

      renderCoins();
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
    description: 'Test your keyboard typing speed (WPM), Characters Per Minute (CPM), and typing accuracy percentage with live character highlighting, preset durations (15s, 30s, 60s, 120s), and difficulty categories.',
    keywords: 'typing speed test, wpm test online, words per minute typing test, keyboard accuracy test, typing test 60 seconds',
    howToUse: [
      { step: '1', title: 'Choose Duration & Mode', desc: 'Select 15s, 30s, 60s, or 120s test, and pick text theme.' },
      { step: '2', title: 'Type The Passage', desc: 'Green indicates correct letters, red indicates typing errors.' },
      { step: '3', title: 'Review Comprehensive WPM', desc: 'Inspect Net WPM, Raw WPM, Accuracy, CPM, and error count.' }
    ],
    features: [
      { title: 'Multiple Test Durations', desc: 'Quick 15s sprint, 30s, 60s standard, or 120s endurance typing test.' },
      { title: 'Themed Passage Banks', desc: 'Select from Tech & Web, Quotes & Wisdom, Easy English, or Code & Syntax.' },
      { title: 'Comprehensive Metrics', desc: 'Live Net WPM, Raw WPM, Keystroke Accuracy %, Characters Per Minute (CPM).' }
    ],
    sampleText: 'The quick brown fox jumps over the lazy dog.',
    renderControls: () => `
      <div class="bu-grid-2col" style="gap: 1rem; margin-bottom: 1.25rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label">Test Duration</label>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" class="bu-btn" data-tst-time="15">15s</button>
            <button type="button" class="bu-btn" data-tst-time="30">30s</button>
            <button type="button" class="bu-btn bu-btn-primary" data-tst-time="60">60s</button>
            <button type="button" class="bu-btn" data-tst-time="120">120s</button>
          </div>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="tst-theme">Passage Theme</label>
          <select id="tst-theme" class="bu-input">
            <option value="tech" selected>Tech, Code & Web Engineering</option>
            <option value="quotes">Inspirational Quotes & Literature</option>
            <option value="easy">Common Words & Fast Flow</option>
          </select>
        </div>
      </div>

      <div class="bu-stats-strip" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Net WPM</span>
          <strong id="tst-wpm" style="font-size: 1.8rem; color: var(--accent-blue); display: block; margin-top: 0.2rem;">0</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Accuracy</span>
          <strong id="tst-acc" style="font-size: 1.8rem; color: var(--success-text); display: block; margin-top: 0.2rem;">100%</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Time Left</span>
          <strong id="tst-time-display" style="font-size: 1.8rem; color: var(--accent-primary); display: block; margin-top: 0.2rem;">60s</strong>
        </div>
        <div class="bu-stat-item" style="padding: 1rem;">
          <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">CPM (Chars/min)</span>
          <strong id="tst-cpm" style="font-size: 1.8rem; display: block; margin-top: 0.2rem;">0</strong>
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label">
          <span>Target Passage</span>
          <span class="bu-form-label-hint" id="tst-status-badge">Click input to start typing</span>
        </label>
        <div id="tst-target-text" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md, 8px); padding: 1.25rem; font-size: 1.15rem; line-height: 1.9; font-family: monospace; user-select: none; min-height: 90px;">
          <!-- Target text -->
        </div>
      </div>

      <div class="bu-form-group">
        <label class="bu-form-label" for="tst-input">Type Here</label>
        <input type="text" id="tst-input" class="bu-input bu-input-mono" placeholder="Start typing the passage above..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="font-size: 1.1rem; padding: 0.85rem 1rem;">
      </div>

      <div class="bu-actions-bar">
        <button type="button" id="btn-tst-restart" class="bu-btn bu-btn-primary">🔄 Restart Test / Next Passage</button>
      </div>
    `,
    renderScript: () => `
      const PASSAGE_BANK = {
        tech: [
          "Building fast and reliable browser utilities requires client side execution and zero latency.",
          "Modern web applications harness Web Audio and Canvas APIs to deliver desktop grade productivity.",
          "Client side cryptography guarantees total user confidentiality without sending sensitive packets over networks.",
          "Asynchronous event loops in JavaScript handle non blocking user interfaces with optimal framerates."
        ],
        quotes: [
          "Simplicity is the soul of efficiency, and true craftsmanship is visible in every fine detail.",
          "The secret of getting ahead is getting started. Focus fully on the task directly in front of you.",
          "Great things are not done by impulse, but by a series of small things brought together over time.",
          "Quality is not an act, it is a persistent habit that transforms ordinary work into mastery."
        ],
        easy: [
          "The quick brown fox jumps over the lazy dog and runs across the wide green fields.",
          "Every sunny morning brings a fresh start to build great ideas with passion and focus.",
          "Type each word clearly with smooth rhythm to improve speed and finger dexterity."
        ]
      };

      let selectedDuration = 60;
      let targetPassage = '';
      let startTime = null;
      let timer = null;
      let timeLeft = 60;
      let isRunning = false;

      const targetBox = document.getElementById('tst-target-text');
      const input = document.getElementById('tst-input');
      const wpmEl = document.getElementById('tst-wpm');
      const accEl = document.getElementById('tst-acc');
      const timeEl = document.getElementById('tst-time-display');
      const cpmEl = document.getElementById('tst-cpm');
      const statusBadge = document.getElementById('tst-status-badge');
      const themeSelect = document.getElementById('tst-theme');
      const restartBtn = document.getElementById('btn-tst-restart');

      function initTest() {
        if (timer) clearInterval(timer);
        timer = null;
        isRunning = false;
        startTime = null;
        timeLeft = selectedDuration;
        timeEl.textContent = \`\${timeLeft}s\`;
        wpmEl.textContent = '0';
        accEl.textContent = '100%';
        cpmEl.textContent = '0';
        statusBadge.textContent = 'Click input to start typing';
        input.value = '';
        input.disabled = false;

        const theme = themeSelect.value || 'tech';
        const list = PASSAGE_BANK[theme] || PASSAGE_BANK.tech;
        targetPassage = list[Math.floor(Math.random() * list.length)];
        renderTarget('');
      }

      function renderTarget(typed) {
        let html = '';
        for (let i = 0; i < targetPassage.length; i++) {
          const expected = targetPassage[i];
          const actual = typed[i];
          if (actual == null) {
            html += \`<span style="color: var(--text-muted); opacity: 0.7;">\${expected}</span>\`;
          } else if (actual === expected) {
            html += \`<span style="color: #10b981; background: rgba(16,185,129,0.18); border-radius: 2px; font-weight: bold;">\${expected}</span>\`;
          } else {
            html += \`<span style="color: #ef4444; background: rgba(239,68,68,0.25); border-radius: 2px; text-decoration: underline;">\${expected}</span>\`;
          }
        }
        targetBox.innerHTML = html;
      }

      document.querySelectorAll('[data-tst-time]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-tst-time]').forEach(b => b.classList.remove('bu-btn-primary'));
          btn.classList.add('bu-btn-primary');
          selectedDuration = parseInt(btn.getAttribute('data-tst-time'), 10) || 60;
          initTest();
        });
      });

      themeSelect.addEventListener('change', initTest);

      input.addEventListener('input', () => {
        if (!isRunning && input.value.length > 0) {
          isRunning = true;
          startTime = performance.now();
          statusBadge.textContent = '⚡ Test in progress...';
          timer = setInterval(() => {
            if (timeLeft > 0) {
              timeLeft--;
              timeEl.textContent = \`\${timeLeft}s\`;
            } else {
              clearInterval(timer);
              input.disabled = true;
              statusBadge.textContent = '🏁 Time expired!';
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
          const cpm = elapsedMins > 0 ? Math.round(correct / elapsedMins) : 0;
          const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;

          wpmEl.textContent = wpm;
          cpmEl.textContent = cpm;
          accEl.textContent = \`\${acc}%\`;

          if (typed === targetPassage) {
            clearInterval(timer);
            input.disabled = true;
            statusBadge.textContent = \`🎉 Completed! Speed: \${wpm} WPM (\${acc}% Accuracy)\`;
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
    title: 'Sound Effects & UI Chime Synthesizer — Web Audio Oscillator & WAV Exporter',
    description: 'Synthesize custom 8-bit retro gaming sound effects, notification chimes, sci-fi laser zaps, powerups, and UI clicks with live Web Audio oscillators and client-side .WAV audio export.',
    keywords: 'sound effects generator, web audio synthesizer, 8 bit sound maker, bleeps and chimes generator, download sound effects wav',
    howToUse: [
      { step: '1', title: 'Choose Sound Preset', desc: 'Select Coin, Laser, Powerup, Jump, Chime, Zap, Sparkle, or Fanfare.' },
      { step: '2', title: 'Tune Waveform & Frequency', desc: 'Adjust start/end pitch frequencies, duration, and waveform envelope.' },
      { step: '3', title: 'Play & Export WAV', desc: 'Listen live or download genuine uncompressed .WAV audio files 100% in-browser.' }
    ],
    features: [
      { title: '10 Preset Sound Archetypes', desc: 'Pre-configured sound models for Coin, Laser, Jump, Powerup, Fanfare, Sparkle, Zap, Alert, and Explosion.' },
      { title: 'Client-Side .WAV Audio Export', desc: 'Directly converts audio buffer into downloadable 16-bit PCM .WAV sound files.' },
      { title: 'Custom Oscillator Synthesis', desc: 'Adjust Sine, Square, Sawtooth, and Triangle waves with pitch slide ramps.' }
    ],
    sampleText: 'Retro 8-bit sound effects',
    renderControls: () => `
      <div class="bu-actions-bar" style="justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
        <button type="button" class="bu-btn bu-btn-primary" data-sfx-preset="coin">🪙 Coin Pickup</button>
        <button type="button" class="bu-btn" data-sfx-preset="laser">🔫 Retro Laser</button>
        <button type="button" class="bu-btn" data-sfx-preset="powerup">⚡ Power Up</button>
        <button type="button" class="bu-btn" data-sfx-preset="jump">🦘 Game Jump</button>
        <button type="button" class="bu-btn" data-sfx-preset="chime">🔔 UI Chime</button>
        <button type="button" class="bu-btn" data-sfx-preset="sparkle">✨ Magic Sparkle</button>
        <button type="button" class="bu-btn" data-sfx-preset="zap">🤖 Cyber Zap</button>
        <button type="button" class="bu-btn" data-sfx-preset="fanfare">🎺 Victory Fanfare</button>
        <button type="button" class="bu-btn" data-sfx-preset="error">⚠️ Warning Buzzer</button>
      </div>

      <div class="bu-grid-3col" style="gap: 1rem; margin-bottom: 1.5rem;">
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="sfx-wave">Waveform</label>
          <select id="sfx-wave" class="bu-input">
            <option value="sine" selected>Sine (Pure / Chime)</option>
            <option value="square">Square (8-Bit NES / Arcade)</option>
            <option value="sawtooth">Sawtooth (Buzzy / Laser)</option>
            <option value="triangle">Triangle (Soft Warm Retro)</option>
          </select>
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="sfx-freq">Start Frequency (Hz)</label>
          <input type="number" id="sfx-freq" class="bu-input" value="987" min="40" max="4000">
        </div>
        <div class="bu-form-group" style="margin: 0;">
          <label class="bu-form-label" for="sfx-dur">Duration (Seconds)</label>
          <input type="number" id="sfx-dur" class="bu-input" value="0.25" step="0.05" min="0.05" max="3">
        </div>
      </div>

      <div class="bu-actions-bar" style="justify-content: center; gap: 1rem;">
        <button type="button" id="btn-sfx-play" class="bu-btn bu-btn-primary" style="font-size: 1.15rem; padding: 0.85rem 2.5rem;">▶️ Play Sound</button>
        <button type="button" id="btn-sfx-download" class="bu-btn" style="font-size: 1.05rem; padding: 0.85rem 2rem;">⬇️ Download .WAV</button>
      </div>
    `,
    renderScript: () => `
      const waveSelect = document.getElementById('sfx-wave');
      const freqInput = document.getElementById('sfx-freq');
      const durInput = document.getElementById('sfx-dur');
      const playBtn = document.getElementById('btn-sfx-play');
      const downloadBtn = document.getElementById('btn-sfx-download');

      let audioCtx = null;
      let currentPreset = 'coin';

      function getAudioContext() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
      }

      function playSoundConfig(wave, startFreq, endFreq, dur) {
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

      // Generate offline PCM 16-bit WAV file
      function generateWavBlob(wave, startFreq, endFreq, dur) {
        const sampleRate = 44100;
        const totalSamples = Math.floor(sampleRate * dur);
        const buffer = new Float32Array(totalSamples);

        let phase = 0;
        for (let i = 0; i < totalSamples; i++) {
          const t = i / totalSamples;
          const currentFreq = endFreq ? startFreq * Math.pow(endFreq / startFreq, t) : startFreq;
          const deltaPhase = (2 * Math.PI * currentFreq) / sampleRate;
          phase += deltaPhase;

          let sample = 0;
          if (wave === 'sine') sample = Math.sin(phase);
          else if (wave === 'square') sample = Math.sin(phase) >= 0 ? 0.7 : -0.7;
          else if (wave === 'sawtooth') sample = 2 * ((phase / (2 * Math.PI)) % 1) - 1;
          else if (wave === 'triangle') sample = 2 * Math.abs(2 * ((phase / (2 * Math.PI)) % 1) - 1) - 1;

          // Envelope decay
          const gain = Math.exp(-3 * t);
          buffer[i] = sample * gain * 0.5;
        }

        // Convert to 16-bit PCM WAV
        const wavBuffer = new ArrayBuffer(44 + totalSamples * 2);
        const view = new DataView(wavBuffer);

        const writeString = (offset, string) => {
          for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
        };

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + totalSamples * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM format
        view.setUint16(22, 1, true); // Mono
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true); // Byte rate
        view.setUint16(32, 2, true); // Block align
        view.setUint16(34, 16, true); // Bits per sample
        writeString(36, 'data');
        view.setUint32(40, totalSamples * 2, true);

        let offset = 44;
        for (let i = 0; i < totalSamples; i++) {
          const s = Math.max(-1, Math.min(1, buffer[i]));
          view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
          offset += 2;
        }

        return new Blob([wavBuffer], { type: 'audio/wav' });
      }

      function triggerPreset(preset) {
        currentPreset = preset;
        if (preset === 'coin') {
          waveSelect.value = 'sine'; freqInput.value = '987'; durInput.value = '0.25';
          playSoundConfig('sine', 987, 1318, 0.25);
        } else if (preset === 'laser') {
          waveSelect.value = 'sawtooth'; freqInput.value = '1200'; durInput.value = '0.2';
          playSoundConfig('sawtooth', 1200, 100, 0.2);
        } else if (preset === 'powerup') {
          waveSelect.value = 'square'; freqInput.value = '300'; durInput.value = '0.35';
          playSoundConfig('square', 300, 1200, 0.35);
        } else if (preset === 'jump') {
          waveSelect.value = 'square'; freqInput.value = '150'; durInput.value = '0.15';
          playSoundConfig('square', 150, 600, 0.15);
        } else if (preset === 'chime') {
          waveSelect.value = 'sine'; freqInput.value = '587'; durInput.value = '0.5';
          playSoundConfig('sine', 587, 880, 0.5);
        } else if (preset === 'sparkle') {
          waveSelect.value = 'sine'; freqInput.value = '1200'; durInput.value = '0.4';
          playSoundConfig('sine', 1200, 2400, 0.4);
        } else if (preset === 'zap') {
          waveSelect.value = 'sawtooth'; freqInput.value = '800'; durInput.value = '0.18';
          playSoundConfig('sawtooth', 800, 80, 0.18);
        } else if (preset === 'fanfare') {
          waveSelect.value = 'triangle'; freqInput.value = '440'; durInput.value = '0.6';
          playSoundConfig('triangle', 440, 880, 0.6);
        } else if (preset === 'error') {
          waveSelect.value = 'sawtooth'; freqInput.value = '150'; durInput.value = '0.3';
          playSoundConfig('sawtooth', 150, 100, 0.3);
        }
      }

      document.querySelectorAll('[data-sfx-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-sfx-preset]').forEach(b => b.classList.remove('bu-btn-primary'));
          btn.classList.add('bu-btn-primary');
          triggerPreset(btn.getAttribute('data-sfx-preset'));
        });
      });

      playBtn.addEventListener('click', () => {
        const wave = waveSelect.value;
        const freq = parseFloat(freqInput.value) || 440;
        const dur = parseFloat(durInput.value) || 0.25;
        playSoundConfig(wave, freq, null, dur);
      });

      downloadBtn.addEventListener('click', () => {
        const wave = waveSelect.value;
        const freq = parseFloat(freqInput.value) || 440;
        const dur = parseFloat(durInput.value) || 0.25;
        const blob = generateWavBlob(wave, freq, null, dur);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`\${currentPreset || 'sfx'}-sound.wav\`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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


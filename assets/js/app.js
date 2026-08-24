/**
 * Multi Tube Views (MTV) — Clean Single-Workflow Media Player Engine
 * Robust, deterministic exact multi-player workspace controller
 */

class ToolApp {
  constructor(platformId = 'youtube') {
    this.platformId = platformId;
    this.platformConfig = window.PLATFORM_CONFIG ? window.PLATFORM_CONFIG[platformId] : null;

    // State model: array of { id, index, url, embedData, detectedPlatform, ratio, isMuted, isLoop }
    this.players = [];
    this.playerCount = 4; // default exact player count
    this.isGenerated = false;
    this.gridLayout = 'auto';
    this.globalRatio = 'auto';
    this.globalAudio = 'muted';
    this.globalLoop = 'off';

    // UI Elements
    this.urlInput = document.getElementById('single-url-input');
    this.btnPasteUrl = document.getElementById('btn-paste-url');
    this.btnLoadSample = document.getElementById('btn-load-sample');
    this.btnClearUrl = document.getElementById('btn-clear-url');
    this.btnGenerate = document.getElementById('btn-generate-players');
    this.btnReloadAll = document.getElementById('btn-reload-all');
    this.btnClearAll = document.getElementById('btn-clear-all');

    this.selectCols = document.getElementById('setting-cols');
    this.selectRatio = document.getElementById('setting-ratio');
    this.selectMaxPlayers = document.getElementById('setting-max-players');
    this.selectLoop = document.getElementById('setting-loop');
    this.selectAudio = document.getElementById('setting-audio');

    this.playerGrid = document.getElementById('player-grid');
    this.playerStage = document.getElementById('player-stage');
    this.stageEmptyState = document.getElementById('stage-empty-state');

    this.init();
  }

  init() {
    this.loadSavedPreferences();
    this.bindEvents();
    this.renderInitialState();
  }

  loadSavedPreferences() {
    if (!window.StorageManager) return;

    const savedCols = window.StorageManager.get(window.STORAGE_KEYS.LAYOUT_COLS, 'auto');
    if (savedCols) {
      this.gridLayout = savedCols;
      if (this.selectCols) this.selectCols.value = savedCols;
    }

    const savedMax = window.StorageManager.get(window.STORAGE_KEYS.MAX_PLAYERS, '4');
    if (savedMax) {
      const parsed = parseInt(savedMax, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 32) {
        this.playerCount = parsed;
      }
      if (this.selectMaxPlayers) {
        this.selectMaxPlayers.value = String(this.playerCount);
      }
    }

    const savedLoop = window.StorageManager.get(window.STORAGE_KEYS.LOOP_PREF, 'off');
    if (savedLoop) {
      this.globalLoop = savedLoop;
      if (this.selectLoop) this.selectLoop.value = savedLoop;
    }

    const savedAudio = window.StorageManager.get(window.STORAGE_KEYS.AUDIO_PREF, 'muted');
    if (savedAudio) {
      this.globalAudio = savedAudio;
      if (this.selectAudio) this.selectAudio.value = savedAudio;
    }

    const savedRatio = window.StorageManager.get(window.STORAGE_KEYS.RATIO_PREF, 'auto');
    if (savedRatio) {
      this.globalRatio = savedRatio;
      if (this.selectRatio) this.selectRatio.value = savedRatio;
    }
  }

  bindEvents() {
    // Generate Players Button
    if (this.btnGenerate) {
      this.btnGenerate.addEventListener('click', () => {
        this.generatePlayers();
      });
    }

    // Input Enter Key
    if (this.urlInput) {
      this.urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.generatePlayers();
        }
      });
    }

    // Paste URL Button
    if (this.btnPasteUrl) {
      this.btnPasteUrl.addEventListener('click', async () => {
        try {
          if (navigator.clipboard && navigator.clipboard.readText) {
            const text = await navigator.clipboard.readText();
            if (text && this.urlInput) {
              this.urlInput.value = text.trim();
              this.showToast('Pasted URL from clipboard', 'success');
            }
          } else {
            this.showToast('Please paste using Ctrl+V / Cmd+V', 'warning');
          }
        } catch (_) {
          this.showToast('Please paste using Ctrl+V / Cmd+V', 'warning');
        }
      });
    }

    // Sample Link Button
    if (this.btnLoadSample) {
      this.btnLoadSample.addEventListener('click', () => {
        if (this.platformConfig?.placeholderUrl && this.urlInput) {
          this.urlInput.value = this.platformConfig.placeholderUrl;
          this.showToast(`Loaded sample ${this.platformConfig.name} link`, 'success');
        }
      });
    }

    // Clear Input Button
    if (this.btnClearUrl) {
      this.btnClearUrl.addEventListener('click', () => {
        if (this.urlInput) {
          this.urlInput.value = '';
          this.urlInput.focus();
        }
      });
    }

    // Reload All Button
    if (this.btnReloadAll) {
      this.btnReloadAll.addEventListener('click', () => {
        this.reloadAllPlayers();
      });
    }

    // Clear Grid Button
    if (this.btnClearAll) {
      this.btnClearAll.addEventListener('click', () => {
        this.clearGrid();
      });
    }

    // Settings Change Listeners
    if (this.selectMaxPlayers) {
      this.selectMaxPlayers.addEventListener('change', (e) => {
        const count = parseInt(e.target.value, 10);
        if (!isNaN(count)) {
          this.playerCount = count;
          if (window.StorageManager) {
            window.StorageManager.set(window.STORAGE_KEYS.MAX_PLAYERS, String(this.playerCount));
          }
          if (this.isGenerated) {
            this.generatePlayers(false);
          }
        }
      });
    }

    if (this.selectCols) {
      this.selectCols.addEventListener('change', (e) => {
        this.gridLayout = e.target.value;
        if (this.playerGrid) {
          this.playerGrid.setAttribute('data-cols', this.gridLayout);
        }
        if (window.StorageManager) {
          window.StorageManager.set(window.STORAGE_KEYS.LAYOUT_COLS, this.gridLayout);
        }
      });
    }

    if (this.selectRatio) {
      this.selectRatio.addEventListener('change', (e) => {
        this.globalRatio = e.target.value;
        this.players.forEach(p => p.ratio = this.globalRatio);
        if (window.StorageManager) {
          window.StorageManager.set(window.STORAGE_KEYS.RATIO_PREF, this.globalRatio);
        }
        if (this.isGenerated) {
          this.renderPlayerGrid();
        }
      });
    }

    if (this.selectLoop) {
      this.selectLoop.addEventListener('change', (e) => {
        this.globalLoop = e.target.value;
        this.players.forEach(p => p.isLoop = (this.globalLoop === 'on'));
        if (window.StorageManager) {
          window.StorageManager.set(window.STORAGE_KEYS.LOOP_PREF, this.globalLoop);
        }
        if (this.isGenerated) {
          this.renderPlayerGrid();
        }
      });
    }

    if (this.selectAudio) {
      this.selectAudio.addEventListener('change', (e) => {
        this.globalAudio = e.target.value;
        this.players.forEach(p => p.isMuted = (this.globalAudio === 'muted'));
        if (window.StorageManager) {
          window.StorageManager.set(window.STORAGE_KEYS.AUDIO_PREF, this.globalAudio);
        }
        if (this.isGenerated) {
          this.renderPlayerGrid();
        }
      });
    }
  }

  renderInitialState() {
    this.isGenerated = false;
    this.players = [];
    if (this.stageEmptyState) {
      this.stageEmptyState.style.display = 'flex';
    }
    if (this.playerGrid) {
      this.playerGrid.innerHTML = '';
      this.playerGrid.setAttribute('data-cols', this.gridLayout || 'auto');
    }
  }

  generatePlayers(shouldScroll = true) {
    let rawText = this.urlInput ? this.urlInput.value.trim() : '';

    if (!rawText) {
      // If empty, use platform placeholder sample link if available
      if (this.platformConfig?.placeholderUrl) {
        rawText = this.platformConfig.placeholderUrl;
        if (this.urlInput) this.urlInput.value = rawText;
      } else {
        this.showToast('Please paste a media URL to generate players', 'warning');
        return;
      }
    }

    // Parse input text for single or multiple URLs
    let parsedUrls = [];
    if (window.Validators && typeof window.Validators.parseInputText === 'function') {
      parsedUrls = window.Validators.parseInputText(rawText);
    } else {
      parsedUrls = rawText.split(/[\r\n,;]+/).map(s => s.trim()).filter(Boolean);
    }

    if (parsedUrls.length === 0) {
      parsedUrls = [rawText];
    }

    const targetCount = Math.max(1, Math.min(32, this.playerCount));
    this.players = [];

    for (let i = 0; i < targetCount; i++) {
      // If multiple URLs provided, cycle through them, otherwise repeat primary URL
      const currentUrl = parsedUrls[i % parsedUrls.length];
      const isMuted = (this.globalAudio === 'muted');
      const isLoop = (this.globalLoop === 'on');

      let detectedPlatform = this.platformId;
      if (window.Validators && typeof window.Validators.detectPlatform === 'function') {
        detectedPlatform = window.Validators.detectPlatform(currentUrl) || this.platformId;
      }

      let embedData = null;
      if (window.PlatformEngine) {
        embedData = window.PlatformEngine.generateEmbed(detectedPlatform, currentUrl, {
          muted: isMuted,
          loop: isLoop
        });
      }

      this.players.push({
        id: 'player_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substr(2, 4),
        index: i,
        url: currentUrl,
        embedData: embedData,
        detectedPlatform: detectedPlatform,
        ratio: this.globalRatio || 'auto',
        isMuted: isMuted,
        isLoop: isLoop
      });
    }

    this.isGenerated = true;
    this.renderPlayerGrid();

    this.showToast(`Generated exactly ${targetCount} media player(s)`, 'success');

    if (shouldScroll && this.playerStage) {
      this.playerStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  renderPlayerGrid() {
    if (!this.playerGrid) return;

    if (!this.isGenerated || this.players.length === 0) {
      if (this.stageEmptyState) this.stageEmptyState.style.display = 'flex';
      this.playerGrid.innerHTML = '';
      return;
    }

    if (this.stageEmptyState) this.stageEmptyState.style.display = 'none';
    this.playerGrid.setAttribute('data-cols', this.gridLayout || 'auto');
    this.playerGrid.innerHTML = '';

    // Render EXACTLY this.players.length actual media players
    this.players.forEach((player, index) => {
      const card = document.createElement('div');
      card.className = 'player-card player-card-active';
      card.id = `player-card-${player.id}`;
      card.setAttribute('data-player-index', index);

      card.innerHTML = this.getActiveSlotHtml(player, index);
      this.playerGrid.appendChild(card);
      this.attachSlotEvents(card, player, index);
    });
  }

  getActiveSlotHtml(player, index) {
    const platformKey = player.detectedPlatform || this.platformId;
    const config = window.PLATFORM_CONFIG ? window.PLATFORM_CONFIG[platformKey] : this.platformConfig;
    const platformName = config?.name || (platformKey.charAt(0).toUpperCase() + platformKey.slice(1));
    const platformColor = config?.color || '#0066CC';

    const embed = player.embedData || (window.PlatformEngine ? window.PlatformEngine.generateEmbed(platformKey, player.url, { muted: player.isMuted, loop: player.isLoop }) : { success: false });

    // Determine adaptive media aspect ratio
    let adaptiveClass = 'ratio-video';
    if (player.ratio && player.ratio !== 'auto') {
      adaptiveClass = `ratio-${player.ratio}`;
    } else {
      if (platformKey === 'spotify') {
        const validator = window.Validators ? window.Validators.spotify : null;
        const extracted = validator ? validator.extract(player.url) : { type: 'track' };
        if (extracted.type === 'album' || extracted.type === 'playlist' || extracted.type === 'show') {
          adaptiveClass = 'ratio-audio-spotify-large';
        } else {
          adaptiveClass = 'ratio-audio-spotify';
        }
      } else if (platformKey === 'soundcloud') {
        adaptiveClass = 'ratio-audio-soundcloud';
      } else if (platformKey === 'tiktok' || platformKey === 'snapchat') {
        adaptiveClass = 'ratio-vertical';
      } else if (platformKey === 'youtube') {
        const validator = window.Validators ? window.Validators.youtube : null;
        const extracted = validator ? validator.extract(player.url) : {};
        if (extracted.type === 'short') {
          adaptiveClass = 'ratio-vertical';
        } else {
          adaptiveClass = 'ratio-video';
        }
      }
    }

    let stageContent = '';

    if (embed.success && embed.embedType === 'iframe') {
      stageContent = `
        <div class="player-frame-wrapper ${adaptiveClass}" data-ratio="${player.ratio || 'auto'}">
          <div class="player-loading-overlay" id="loading-overlay-${player.id}">
            <div class="player-spinner"></div>
            <span class="player-loading-text">Loading ${this.escapeHtml(platformName)} Player...</span>
          </div>
          <iframe 
            src="${this.escapeHtml(embed.src)}" 
            title="${this.escapeHtml(embed.title || `${platformName} Player ${index + 1}`)}"
            class="player-iframe"
            allow="${embed.allow || 'autoplay; fullscreen; clipboard-write; encrypted-media; picture-in-picture'}" 
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin">
          </iframe>
        </div>
      `;
    } else {
      // Fallback / Restricted Card with safe verified official platform link
      const reasonText = embed.reason || `${platformName} policies restrict direct cross-origin player embedding. Access and play this media directly on the verified official platform.`;
      stageContent = `
        <div class="player-frame-wrapper fallback-player-card ${adaptiveClass}" data-ratio="${player.ratio || 'auto'}">
          <div class="fallback-icon">🛡️</div>
          <h4 class="fallback-title">Official Platform View</h4>
          <p class="fallback-desc">${this.escapeHtml(reasonText)}</p>
          <div class="fallback-actions">
            <a href="${this.escapeHtml(player.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              <span>Open on ${this.escapeHtml(platformName)}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        </div>
      `;
    }

    return `
      <div class="player-card-bar">
        <div class="player-bar-left">
          <span class="player-badge-num">${index + 1}</span>
          <span class="player-slot-title">PLAYER ${index + 1}</span>
          <span class="player-platform-badge" style="color: ${platformColor}; border-color: ${platformColor}40; background-color: ${platformColor}12;">
            ${this.escapeHtml(platformName)}
          </span>
          ${embed.embedType === 'fallback' ? '<span class="slot-status-tag restricted">Official View</span>' : '<span class="slot-status-tag valid">Live Embed</span>'}
        </div>
        <div class="player-bar-actions">
          <button type="button" class="btn-slot-action btn-reload-slot" title="Reload this player" aria-label="Reload player">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          </button>
          <select class="slot-ratio-select" title="Change aspect ratio">
            <option value="auto" ${player.ratio === 'auto' ? 'selected' : ''}>Auto</option>
            <option value="16-9" ${player.ratio === '16-9' ? 'selected' : ''}>16:9</option>
            <option value="9-16" ${player.ratio === '9-16' ? 'selected' : ''}>9:16 (Vert)</option>
            <option value="4-3" ${player.ratio === '4-3' ? 'selected' : ''}>4:3</option>
            <option value="1-1" ${player.ratio === '1-1' ? 'selected' : ''}>1:1</option>
          </select>
          <a href="${this.escapeHtml(player.url)}" target="_blank" rel="noopener noreferrer" class="btn-slot-action" title="Open source page on ${this.escapeHtml(platformName)}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
          <button type="button" class="btn-slot-action btn-remove-slot" title="Remove this player" aria-label="Remove player">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
      
      ${stageContent}

      <div class="player-card-footer-edit">
        <span class="slot-url-display" title="${this.escapeHtml(player.url)}">${this.escapeHtml(player.url)}</span>
        <button type="button" class="btn-slot-edit-trigger" title="Change URL for this player">Edit Link</button>
      </div>
    `;
  }

  attachSlotEvents(card, player, index) {
    // Handle Iframe Loading State smoothly
    const iframe = card.querySelector('iframe');
    const overlay = card.querySelector('.player-loading-overlay');
    if (iframe && overlay) {
      const hideOverlay = () => {
        overlay.classList.add('hidden');
      };
      iframe.addEventListener('load', hideOverlay);
      // Safety timeout: ensure overlay doesn't block if cross-origin onload doesn't fire
      setTimeout(hideOverlay, 3000);
    }

    // Reload individual player
    const btnReload = card.querySelector('.btn-reload-slot');
    btnReload?.addEventListener('click', () => {
      if (iframe) {
        if (overlay) overlay.classList.remove('hidden');
        const src = iframe.src;
        iframe.src = '';
        setTimeout(() => { 
          iframe.src = src; 
          setTimeout(() => { if (overlay) overlay.classList.add('hidden'); }, 3000);
        }, 50);
        this.showToast(`Reloaded Player ${index + 1}`, 'success');
      }
    });

    // Ratio change
    const selectRatio = card.querySelector('.slot-ratio-select');
    selectRatio?.addEventListener('change', (e) => {
      player.ratio = e.target.value;
      const wrapper = card.querySelector('.player-frame-wrapper');
      if (wrapper) {
        wrapper.className = `player-frame-wrapper ${player.embedData?.embedType === 'fallback' ? 'fallback-player-card' : ''} ratio-${player.ratio}`;
        wrapper.setAttribute('data-ratio', player.ratio);
      }
    });

    // Remove Player
    const btnRemove = card.querySelector('.btn-remove-slot');
    btnRemove?.addEventListener('click', () => {
      this.removePlayer(index);
    });

    // Edit Player Link
    const btnEdit = card.querySelector('.btn-slot-edit-trigger');
    btnEdit?.addEventListener('click', () => {
      const footer = card.querySelector('.player-card-footer-edit');
      if (!footer) return;

      footer.innerHTML = `
        <input type="text" class="slot-inline-edit-input" value="${this.escapeHtml(player.url)}" aria-label="Edit Player URL">
        <button type="button" class="btn btn-primary btn-xs btn-inline-save">Save</button>
        <button type="button" class="btn btn-subtle btn-xs btn-inline-cancel">Cancel</button>
      `;

      const editInput = footer.querySelector('.slot-inline-edit-input');
      editInput?.focus();
      editInput?.select();

      footer.querySelector('.btn-inline-save')?.addEventListener('click', () => {
        const newUrl = editInput.value.trim();
        if (newUrl) {
          this.loadUrlIntoPlayer(index, newUrl);
        }
      });

      footer.querySelector('.btn-inline-cancel')?.addEventListener('click', () => {
        this.renderPlayerGrid();
      });

      editInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          footer.querySelector('.btn-inline-save')?.click();
        } else if (e.key === 'Escape') {
          footer.querySelector('.btn-inline-cancel')?.click();
        }
      });
    });
  }

  loadUrlIntoPlayer(index, newUrl) {
    if (index < 0 || index >= this.players.length) return;
    const player = this.players[index];

    let detectedPlatform = this.platformId;
    if (window.Validators && typeof window.Validators.detectPlatform === 'function') {
      detectedPlatform = window.Validators.detectPlatform(newUrl) || this.platformId;
    }

    let embedData = null;
    if (window.PlatformEngine) {
      embedData = window.PlatformEngine.generateEmbed(detectedPlatform, newUrl, {
        muted: player.isMuted,
        loop: player.isLoop
      });
    }

    player.url = newUrl;
    player.embedData = embedData;
    player.detectedPlatform = detectedPlatform;

    this.renderPlayerGrid();
    this.showToast(`Updated Player ${index + 1}`, 'success');
  }

  removePlayer(index) {
    if (this.players.length <= 1) {
      this.clearGrid();
      return;
    }

    this.players.splice(index, 1);
    this.playerCount = this.players.length;
    this.players.forEach((p, i) => p.index = i);

    if (this.selectMaxPlayers) {
      this.selectMaxPlayers.value = String(this.playerCount);
    }
    if (window.StorageManager) {
      window.StorageManager.set(window.STORAGE_KEYS.MAX_PLAYERS, String(this.playerCount));
    }

    this.renderPlayerGrid();
    this.showToast(`Removed player. Total active players: ${this.playerCount}`, 'success');
  }

  reloadAllPlayers() {
    const iframes = this.playerGrid?.querySelectorAll('iframe');
    const overlays = this.playerGrid?.querySelectorAll('.player-loading-overlay');

    if (iframes && iframes.length > 0) {
      overlays?.forEach(o => o.classList.remove('hidden'));
      iframes.forEach(frame => {
        const curSrc = frame.src;
        frame.src = '';
        setTimeout(() => { 
          frame.src = curSrc; 
          setTimeout(() => overlays?.forEach(o => o.classList.add('hidden')), 3000);
        }, 50);
      });
      this.showToast(`Reloaded ${iframes.length} media player instance(s)`, 'success');
    } else {
      this.showToast('No active players to reload', 'warning');
    }
  }

  clearGrid() {
    this.isGenerated = false;
    this.players = [];
    if (this.stageEmptyState) {
      this.stageEmptyState.style.display = 'flex';
    }
    if (this.playerGrid) {
      this.playerGrid.innerHTML = '';
    }
    this.showToast('Cleared media player workspace', 'success');
  }

  showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${this.escapeHtml(message)}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }, 3000);
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

window.ToolApp = ToolApp;

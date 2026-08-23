/**
 * Multi Tube Views (MTV) — Main Tool Page Controller & Multi-Player Manager
 */

class ToolApp {
  constructor(platformId) {
    this.platformId = platformId;
    this.platformConfig = window.PLATFORM_CONFIG ? window.PLATFORM_CONFIG[platformId] : null;
    this.links = []; // Array of { id, url, selected, status, embedData }
    
    // UI Elements
    this.singleInput = document.getElementById('single-url-input');
    this.batchInput = document.getElementById('batch-url-input');
    this.btnAddSingle = document.getElementById('btn-add-single');
    this.btnAddBatch = document.getElementById('btn-add-batch');
    this.btnSelectAll = document.getElementById('btn-select-all');
    this.btnClearAll = document.getElementById('btn-clear-all');
    this.btnGenerate = document.getElementById('btn-generate-players');
    
    this.linkRowsContainer = document.getElementById('link-rows-list');
    this.queueEmptyState = document.getElementById('queue-empty-state');
    this.queueCountBadge = document.getElementById('queue-count-badge');
    
    this.selectCols = document.getElementById('setting-cols');
    this.selectRatio = document.getElementById('setting-ratio');
    this.selectMaxPlayers = document.getElementById('setting-max-players');
    this.selectAudio = document.getElementById('setting-audio');
    
    this.playerGrid = document.getElementById('player-grid');
    this.playerStage = document.getElementById('player-stage');
    this.stageEmptyState = document.getElementById('stage-empty-state');
    this.playerLoadingState = document.getElementById('player-loading-state');
    
    this.statTotal = document.getElementById('stat-total-count');
    this.statValid = document.getElementById('stat-valid-count');
    this.statRestricted = document.getElementById('stat-restricted-count');
    this.statInvalid = document.getElementById('stat-invalid-count');

    this.init();
  }

  init() {
    this.bindEvents();
    this.loadSavedSettings();
    this.renderQueue();
    this.updateStats();

    // Auto-fill placeholder sample button if available
    const btnSample = document.getElementById('btn-load-sample');
    if (btnSample && this.platformConfig?.placeholderUrl) {
      btnSample.addEventListener('click', () => {
        this.addUrl(this.platformConfig.placeholderUrl);
        this.showToast('Sample link added to queue', 'success');
      });
    }
  }

  loadSavedSettings() {
    if (!window.StorageManager) return;
    
    const savedCols = window.StorageManager.get(window.STORAGE_KEYS.LAYOUT_COLS, 'auto');
    if (this.selectCols) this.selectCols.value = savedCols;

    const savedRatio = window.StorageManager.get(window.STORAGE_KEYS.ASPECT_RATIO, '16-9');
    if (this.selectRatio) this.selectRatio.value = savedRatio;

    const savedAudio = window.StorageManager.get(window.STORAGE_KEYS.AUDIO_PREF, 'muted');
    if (this.selectAudio) this.selectAudio.value = savedAudio;
  }

  bindEvents() {
    // Single Add Button
    if (this.btnAddSingle && this.singleInput) {
      this.btnAddSingle.addEventListener('click', () => {
        const url = this.singleInput.value.trim();
        if (!url) {
          this.showToast('Please enter a URL first', 'warning');
          return;
        }
        if (this.addUrl(url)) {
          this.singleInput.value = '';
        }
      });

      this.singleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.btnAddSingle.click();
        }
      });
    }

    // Batch Add Button
    if (this.btnAddBatch && this.batchInput) {
      this.btnAddBatch.addEventListener('click', () => {
        const text = this.batchInput.value.trim();
        if (!text) {
          this.showToast('Please enter URLs in the textarea', 'warning');
          return;
        }
        const parsedUrls = window.Validators ? window.Validators.parseInputText(text) : text.split('\n');
        if (parsedUrls.length === 0) {
          this.showToast('No valid URL strings found', 'danger');
          return;
        }

        let added = 0;
        parsedUrls.forEach(url => {
          if (this.addUrl(url, false)) added++;
        });

        this.renderQueue();
        this.updateStats();
        this.batchInput.value = '';
        this.showToast(`Added ${added} new URL(s) to queue`, 'success');
      });
    }

    // Select All
    if (this.btnSelectAll) {
      this.btnSelectAll.addEventListener('click', () => {
        const allSelected = this.links.every(l => l.selected);
        this.links.forEach(l => l.selected = !allSelected);
        this.renderQueue();
        this.showToast(allSelected ? 'Deselected all links' : 'Selected all links', 'success');
      });
    }

    // Clear All
    if (this.btnClearAll) {
      this.btnClearAll.addEventListener('click', () => {
        if (this.links.length === 0) return;
        this.links = [];
        this.renderQueue();
        this.updateStats();
        this.clearPlayers();
        this.showToast('Cleared all links from workspace', 'success');
      });
    }

    // Generate Players
    if (this.btnGenerate) {
      this.btnGenerate.addEventListener('click', () => {
        this.generatePlayers();
      });
    }

    // Layout Controls
    if (this.selectCols) {
      this.selectCols.addEventListener('change', (e) => {
        const cols = e.target.value;
        if (this.playerGrid) this.playerGrid.setAttribute('data-cols', cols);
        if (window.StorageManager) window.StorageManager.set(window.STORAGE_KEYS.LAYOUT_COLS, cols);
      });
    }

    if (this.selectRatio) {
      this.selectRatio.addEventListener('change', (e) => {
        const ratio = e.target.value;
        const frames = document.querySelectorAll('.player-frame-wrapper');
        frames.forEach(f => f.setAttribute('data-ratio', ratio));
        if (window.StorageManager) window.StorageManager.set(window.STORAGE_KEYS.ASPECT_RATIO, ratio);
      });
    }

    if (this.selectAudio) {
      this.selectAudio.addEventListener('change', (e) => {
        if (window.StorageManager) window.StorageManager.set(window.STORAGE_KEYS.AUDIO_PREF, e.target.value);
        if (this.playerGrid && this.playerGrid.children.length > 0) {
          this.showToast('Audio preference updated. Click "Generate Players" to apply.', 'warning');
        }
      });
    }

    // Tab Switching for Input Panel
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetTab = btn.getAttribute('data-tab');
        
        const singleBox = document.getElementById('single-input-tab');
        const batchBox = document.getElementById('batch-input-tab');
        if (singleBox && batchBox) {
          singleBox.style.display = targetTab === 'single' ? 'flex' : 'none';
          batchBox.style.display = targetTab === 'batch' ? 'block' : 'none';
        }
      });
    });
  }

  addUrl(urlStr, reRender = true) {
    if (!urlStr || typeof urlStr !== 'string') return false;
    const trimmed = urlStr.trim();

    // Prevent duplicate entries
    if (this.links.some(l => l.url.toLowerCase() === trimmed.toLowerCase())) {
      if (reRender) this.showToast('This URL is already in your list', 'warning');
      return false;
    }

    // Evaluate URL validation & adapter status
    const embedResult = window.PlatformEngine ? window.PlatformEngine.generateEmbed(this.platformId, trimmed, {
      muted: this.selectAudio ? this.selectAudio.value === 'muted' : true
    }) : { success: true };

    let status = 'valid';
    if (!embedResult.success) {
      status = 'invalid';
    } else if (embedResult.embedType === 'fallback') {
      status = 'restricted';
    }

    const item = {
      id: 'link_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      url: trimmed,
      selected: true,
      status: status,
      embedData: embedResult
    };

    this.links.push(item);

    if (reRender) {
      this.renderQueue();
      this.updateStats();
      this.showToast('Link added to workspace', 'success');
    }

    return true;
  }

  removeUrl(id) {
    this.links = this.links.filter(l => l.id !== id);
    this.renderQueue();
    this.updateStats();
    this.showToast('Link removed', 'success');
  }

  renderQueue() {
    if (!this.linkRowsContainer) return;

    if (this.links.length === 0) {
      this.linkRowsContainer.innerHTML = '';
      if (this.queueEmptyState) this.queueEmptyState.style.display = 'flex';
      if (this.queueCountBadge) this.queueCountBadge.textContent = '0 links';
      return;
    }

    if (this.queueEmptyState) this.queueEmptyState.style.display = 'none';
    if (this.queueCountBadge) this.queueCountBadge.textContent = `${this.links.length} ${this.links.length === 1 ? 'link' : 'links'}`;

    this.linkRowsContainer.innerHTML = this.links.map((link, idx) => {
      let statusClass = 'valid';
      let statusLabel = 'Embed Ready';

      if (link.status === 'invalid') {
        statusClass = 'invalid';
        statusLabel = 'Invalid Format';
      } else if (link.status === 'restricted') {
        statusClass = 'restricted';
        statusLabel = 'Official View';
      }

      return `
        <div class="link-row" data-id="${link.id}">
          <input type="checkbox" class="link-checkbox" ${link.selected ? 'checked' : ''} aria-label="Select link ${idx + 1}">
          <span class="link-row-num">#${idx + 1}</span>
          <span class="link-row-url" title="${this.escapeHtml(link.url)}">${this.escapeHtml(link.url)}</span>
          <span class="link-row-status ${statusClass}">${statusLabel}</span>
          <button type="button" class="btn btn-icon-only btn-sm btn-remove-link" title="Remove URL" aria-label="Remove URL">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      `;
    }).join('');

    // Attach row events
    this.linkRowsContainer.querySelectorAll('.link-row').forEach(row => {
      const id = row.getAttribute('data-id');
      const chk = row.querySelector('.link-checkbox');
      const btnRemove = row.querySelector('.btn-remove-link');

      chk?.addEventListener('change', (e) => {
        const item = this.links.find(l => l.id === id);
        if (item) item.selected = e.target.checked;
      });

      btnRemove?.addEventListener('click', () => {
        this.removeUrl(id);
      });
    });
  }

  updateStats() {
    const total = this.links.length;
    const valid = this.links.filter(l => l.status === 'valid').length;
    const restricted = this.links.filter(l => l.status === 'restricted').length;
    const invalid = this.links.filter(l => l.status === 'invalid').length;

    if (this.statTotal) this.statTotal.textContent = total;
    if (this.statValid) this.statValid.textContent = valid;
    if (this.statRestricted) this.statRestricted.textContent = restricted;
    if (this.statInvalid) this.statInvalid.textContent = invalid;
  }

  generatePlayers() {
    const selectedLinks = this.links.filter(l => l.selected);

    if (selectedLinks.length === 0) {
      this.showToast('Please add and select at least one URL first.', 'warning');
      return;
    }

    // Respect max player limit
    const maxVal = this.selectMaxPlayers ? this.selectMaxPlayers.value : '12';
    const limit = maxVal === 'all' ? selectedLinks.length : parseInt(maxVal, 10) || 12;
    const activeList = selectedLinks.slice(0, limit);

    // Show Loading State
    if (this.playerLoadingState) this.playerLoadingState.style.display = 'flex';
    if (this.stageEmptyState) this.stageEmptyState.style.display = 'none';
    if (this.playerGrid) this.playerGrid.innerHTML = '';

    setTimeout(() => {
      if (this.playerLoadingState) this.playerLoadingState.style.display = 'none';
      this.renderPlayerGrid(activeList);
      this.showToast(`Rendered ${activeList.length} media player container(s)`, 'success');
      
      // Smooth scroll to player stage
      this.playerStage?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }

  renderPlayerGrid(items) {
    if (!this.playerGrid) return;
    
    const currentCols = this.selectCols ? this.selectCols.value : 'auto';
    const currentRatio = this.selectRatio ? this.selectRatio.value : '16-9';
    const isMuted = this.selectAudio ? this.selectAudio.value === 'muted' : true;

    this.playerGrid.setAttribute('data-cols', currentCols);
    this.playerGrid.innerHTML = '';

    items.forEach((item, index) => {
      // Re-evaluate embed data with current audio setting
      const embed = window.PlatformEngine ? window.PlatformEngine.generateEmbed(this.platformId, item.url, { muted: isMuted }) : item.embedData;
      
      const card = document.createElement('div');
      card.className = 'player-card';

      if (embed.success && embed.embedType === 'iframe') {
        card.innerHTML = `
          <div class="player-card-bar">
            <div class="player-bar-left">
              <span class="player-badge-num">${index + 1}</span>
              <span>${this.escapeHtml(this.platformConfig?.name || 'Player')}</span>
            </div>
            <div class="player-bar-actions">
              <a href="${this.escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-subtle btn-sm" title="Open source page on official platform">
                <span>Official Page</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </div>
          </div>
          <div class="player-frame-wrapper" data-ratio="${currentRatio}">
            <iframe 
              src="${this.escapeHtml(embed.src)}" 
              title="${this.escapeHtml(embed.title || 'Media Player')}"
              class="player-iframe"
              allow="${embed.allow || 'autoplay; fullscreen'}" 
              loading="lazy"
              referrerpolicy="strict-origin-when-cross-origin">
            </iframe>
          </div>
        `;
      } else {
        // Fallback / Restricted Card with safe official link
        const reasonText = embed.reason || 'This platform or specific media item restricts third-party iframe playback under its security policy. You can safely access and view it on the official verified platform.';
        card.innerHTML = `
          <div class="player-card-bar">
            <div class="player-bar-left">
              <span class="player-badge-num">${index + 1}</span>
              <span>${this.escapeHtml(this.platformConfig?.name || 'Platform')} (Direct Gateway)</span>
            </div>
            <div class="player-bar-actions">
              <span class="embed-badge embed-badge-restricted">Official View Required</span>
            </div>
          </div>
          <div class="player-frame-wrapper fallback-player-card" data-ratio="${currentRatio}">
            <div class="fallback-icon">🛡️</div>
            <h4 class="fallback-title">Official Platform View</h4>
            <p class="fallback-desc">${this.escapeHtml(reasonText)}</p>
            <a href="${this.escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              <span>Open on ${this.escapeHtml(this.platformConfig?.name || 'Official Platform')}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        `;
      }

      this.playerGrid.appendChild(card);
    });
  }

  clearPlayers() {
    if (this.playerGrid) this.playerGrid.innerHTML = '';
    if (this.stageEmptyState) this.stageEmptyState.style.display = 'flex';
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
    toast.innerHTML = `
      <span>${this.escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }, 3200);
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

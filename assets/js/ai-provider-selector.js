/**
 * Multi Tube Views — Frontend AI Provider & Model Selector UI Engine
 * Manages provider discovery, UI dropdown rendering, active provider state,
 * local persistence, and Compare AI Mode integration.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'multitube_selected_ai_provider';
  const MODEL_STORAGE_KEY = 'multitube_selected_ai_model';

  let availableProviders = [];
  let allProviders = [];
  let isCompareMode = false;

  // Get currently selected provider from storage or default to 'auto'
  function getSelectedProvider() {
    return localStorage.getItem(STORAGE_KEY) || 'auto';
  }

  function setSelectedProvider(providerId) {
    localStorage.setItem(STORAGE_KEY, providerId);
    if (providerId === 'compare') {
      isCompareMode = true;
    } else {
      isCompareMode = false;
    }
    updateAllProviderBadges();
  }

  // Fetch provider status from backend
  async function fetchProviders() {
    try {
      const res = await fetch('/api/ai/providers');
      if (res.ok) {
        const data = await res.json();
        availableProviders = data.providers || [];
        allProviders = data.allProviders || [];
      }
    } catch (err) {
      console.warn('AI Provider discovery warning:', err);
    }
  }

  // Render provider selector bar into target container
  function renderProviderSelector(containerElement) {
    if (!containerElement) return;

    const currentProvider = getSelectedProvider();

    const wrapper = document.createElement('div');
    wrapper.className = 'ai-provider-bar p-3 mb-4 rounded-xl border border-slate-700/60 bg-slate-800/80 backdrop-blur text-sm flex flex-wrap items-center justify-between gap-3';
    
    let optionsHtml = `<option value="auto" ${currentProvider === 'auto' ? 'selected' : ''}>⚡ Auto (Best Available + Intelligent Fallback)</option>`;

    const providerDisplayNames = {
      gemini: 'Google Gemini',
      openai: 'OpenAI',
      grok: 'xAI Grok',
      deepseek: 'DeepSeek',
      claude: 'Anthropic Claude',
      mistral: 'Mistral AI',
      openrouter: 'OpenRouter',
    };

    allProviders.forEach(p => {
      const isAvailable = p.configured && p.enabled;
      const statusIcon = isAvailable ? '🟢' : '⚪';
      const statusNote = isAvailable ? 'Available' : 'Not Configured';
      const displayName = providerDisplayNames[p.id] || p.displayName;

      optionsHtml += `<option value="${p.id}" ${currentProvider === p.id ? 'selected' : ''} ${!isAvailable ? 'style="color: #94a3b8;"' : ''}>
        ${statusIcon} ${displayName} (${statusNote})
      </option>`;
    });

    optionsHtml += `<option value="compare" ${currentProvider === 'compare' ? 'selected' : ''}>⚔️ Compare AI Mode (Multi-Provider Parallel)</option>`;

    wrapper.innerHTML = `
      <div class="flex items-center gap-2 font-medium text-slate-200">
        <span class="text-amber-400 font-semibold text-xs tracking-wider uppercase bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">AI Engine</span>
        <span>Select Provider:</span>
      </div>
      <div class="flex items-center gap-2 flex-grow max-w-md">
        <select id="ai-provider-dropdown" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer">
          ${optionsHtml}
        </select>
      </div>
      <div id="ai-provider-status-badge" class="text-xs px-2.5 py-1 rounded-full font-mono flex items-center gap-1.5 bg-slate-900 border border-slate-700 text-slate-300">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span id="ai-provider-badge-text">Auto Routing Active</span>
      </div>
    `;

    containerElement.innerHTML = '';
    containerElement.appendChild(wrapper);

    const dropdown = wrapper.querySelector('#ai-provider-dropdown');
    if (dropdown) {
      dropdown.addEventListener('change', (e) => {
        const val = e.target.value;
        setSelectedProvider(val);
        updateBadgeText(val, wrapper.querySelector('#ai-provider-badge-text'));
      });
      updateBadgeText(currentProvider, wrapper.querySelector('#ai-provider-badge-text'));
    }
  }

  function updateBadgeText(providerId, badgeTextEl) {
    if (!badgeTextEl) return;
    if (providerId === 'auto') {
      const activeCount = availableProviders.length;
      badgeTextEl.textContent = `Auto Routing (${activeCount} ${activeCount === 1 ? 'Provider' : 'Providers'} Online)`;
      badgeTextEl.className = 'text-emerald-400 font-medium';
    } else if (providerId === 'compare') {
      badgeTextEl.textContent = 'Compare Mode Enabled';
      badgeTextEl.className = 'text-purple-400 font-medium';
    } else {
      const found = allProviders.find(p => p.id === providerId);
      if (found && found.configured) {
        badgeTextEl.textContent = `${found.displayName} Connected`;
        badgeTextEl.className = 'text-emerald-400 font-medium';
      } else {
        badgeTextEl.textContent = `${providerId.toUpperCase()} (Fallback Active)`;
        badgeTextEl.className = 'text-amber-400 font-medium';
      }
    }
  }

  function updateAllProviderBadges() {
    const badgeTextEl = document.querySelector('#ai-provider-badge-text');
    if (badgeTextEl) {
      updateBadgeText(getSelectedProvider(), badgeTextEl);
    }
  }

  // Helper to format AI metadata footer on output cards
  function renderAiMetaFooter(meta) {
    if (!meta) return '';
    const providerName = meta.provider ? meta.provider.toUpperCase() : 'AUTO';
    const model = meta.model || '';
    const latency = meta.latencyMs ? `${meta.latencyMs}ms` : '';
    const fallback = meta.fallbackOccurred ? ' • Fallback Used' : '';

    return `
      <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Powered by <strong>${providerName}</strong> ${model ? `(${model})` : ''}</span>
        </span>
        <span>${latency}${fallback}</span>
      </div>
    `;
  }

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', async () => {
    await fetchProviders();
    const targetMount = document.querySelector('#ai-provider-selector-mount');
    if (targetMount) {
      renderProviderSelector(targetMount);
    }
  });

  // Expose global AI Provider API
  window.MultiTubeAI = {
    getSelectedProvider,
    setSelectedProvider,
    fetchProviders,
    renderProviderSelector,
    renderAiMetaFooter,
    getAvailableProviders: () => availableProviders,
  };
})();

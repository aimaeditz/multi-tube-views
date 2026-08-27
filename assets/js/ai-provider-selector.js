/**
 * Multi Tube Views — Frontend AI Provider & Model Selector UI Engine (Silent Backend Proxy)
 * Keeps all AI configuration, routing, and provider selection strictly internal/server-side.
 * Restores the clean original two-box tool interface exactly as designed.
 */

(function () {
  'use strict';

  // Get currently selected provider - always auto-route internally
  function getSelectedProvider() {
    return 'auto';
  }

  function setSelectedProvider(providerId) {
    // No-op: client selection is disabled to keep routing server-side
  }

  async function fetchProviders() {
    // No-op: discovery is handled strictly on the server-side
  }

  // Render provider selector bar - does nothing to keep UI clean and original
  function renderProviderSelector(containerElement) {
    if (containerElement) {
      containerElement.innerHTML = '';
      containerElement.style.display = 'none';
    }
  }

  // Formatting AI metadata footer - returns empty string to hide backend details
  function renderAiMetaFooter(meta) {
    return '';
  }

  // Expose global AI Provider API with silent fallback handlers
  window.MultiTubeAI = Object.assign({}, window.mtvAI || {}, {
    getSelectedProvider: function () {
      return window.mtvAI && typeof window.mtvAI.getSelectedProvider === 'function'
        ? window.mtvAI.getSelectedProvider()
        : 'auto';
    },
    setSelectedProvider: function (providerId) {
      if (window.mtvAI && typeof window.mtvAI.setSelectedProvider === 'function') {
        window.mtvAI.setSelectedProvider(providerId);
      }
    },
    fetchProviders: fetchProviders,
    renderProviderSelector: renderProviderSelector,
    renderAiMetaFooter: renderAiMetaFooter,
    getAvailableProviders: function () { return []; },
  });
})();


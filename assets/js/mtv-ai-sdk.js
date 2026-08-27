/**
 * Multi Tube Views (MTV) — Universal Client AI SDK
 * Provider-agnostic frontend client for interacting with the Universal AI Gateway.
 * Exposes window.mtvAI (and backward-compatible window.MultiTubeAI).
 */

(function () {
  'use strict';

  var DEFAULT_PRODUCTION_BACKEND = 'https://ais-pre-kltpfym7bqtxf22ftlzvjh-682257000756.asia-east1.run.app';

  var MTV_AI_SDK = {
    version: '2.1.0',
    baseUrl: '',
    selectedProvider: 'auto',

    /**
     * Set base API URL if running in a decoupled frontend environment
     */
    setBaseUrl: function (url) {
      this.baseUrl = url ? url.replace(/\/+$/, '') : '';
    },

    /**
     * Get or set selected AI provider
     */
    setSelectedProvider: function (provider) {
      this.selectedProvider = provider || 'auto';
    },

    getSelectedProvider: function () {
      return this.selectedProvider || 'auto';
    },

    /**
     * Resolve active API Base URL with smart domain detection and localStorage fallback
     */
    getApiBaseUrl: function () {
      if (this.baseUrl) return this.baseUrl.replace(/\/+$/, '');

      if (typeof window !== 'undefined') {
        if (window.MTV_API_BASE_URL) {
          return String(window.MTV_API_BASE_URL).replace(/\/+$/, '');
        }

        try {
          var stored = localStorage.getItem('mtv_api_backend_url') || localStorage.getItem('mtv_api_base_url');
          if (stored && stored.trim()) {
            return stored.trim().replace(/\/+$/, '');
          }
        } catch (_) {}

        var host = window.location ? (window.location.hostname || '') : '';
        var isStaticDomain = host.includes('github.io') ||
                             host.includes('multitubeviews.com') ||
                             host.includes('netlify.app') ||
                             host.includes('vercel.app') ||
                             host.includes('pages.dev') ||
                             (host &&
                              host !== 'localhost' &&
                              host !== '127.0.0.1' &&
                              host !== '0.0.0.0' &&
                              !host.includes('asia-east1.run.app'));

        if (isStaticDomain) {
          return DEFAULT_PRODUCTION_BACKEND;
        }
      }

      return '';
    },

    /**
     * Helper to make secure JSON fetch requests to Universal AI Gateway
     */
    _request: async function (endpoint, method, payload, isRetry) {
      var activeBase = this.getApiBaseUrl();
      var url = (activeBase ? activeBase : '') + endpoint;
      var options = {
        method: method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      };

      if (payload && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(payload);
      }

      try {
        var response = await fetch(url, options);
        var contentType = response.headers.get('content-type') || '';

        // Guard against static host returning HTML (e.g. index.html SPA fallback)
        if (contentType.includes('text/html')) {
          if (!isRetry && typeof window !== 'undefined') {
            var fallbackBackend = DEFAULT_PRODUCTION_BACKEND;
            if (activeBase !== fallbackBackend) {
              this.setBaseUrl(fallbackBackend);
              try {
                localStorage.setItem('mtv_api_backend_url', fallbackBackend);
              } catch (_) {}
              return this._request(endpoint, method, payload, true);
            }
          }
          return {
            success: false,
            error: 'The endpoint returned HTML instead of JSON. Connected backend fallback active.',
            errorCode: 'STATIC_HOST_HTML_RESPONSE',
          };
        }

        var text = await response.text();
        var data;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          if (!isRetry && (text.trim().startsWith('<') || text.includes('<html>'))) {
            var fallbackBackend = DEFAULT_PRODUCTION_BACKEND;
            if (activeBase !== fallbackBackend) {
              this.setBaseUrl(fallbackBackend);
              try {
                localStorage.setItem('mtv_api_backend_url', fallbackBackend);
              } catch (_) {}
              return this._request(endpoint, method, payload, true);
            }
          }
          return {
            success: false,
            error: 'Invalid JSON response from server.',
            errorCode: 'PARSING_ERROR',
            rawText: text.slice(0, 200),
          };
        }

        if (!response.ok) {
          return {
            success: false,
            error: data.error || ('Server returned HTTP status ' + response.status),
            errorCode: data.errorCode || 'HTTP_' + response.status,
            data: data,
          };
        }

        return data;
      } catch (err) {
        if (!isRetry && typeof window !== 'undefined') {
          var fallbackBackend = DEFAULT_PRODUCTION_BACKEND;
          if (activeBase !== fallbackBackend) {
            this.setBaseUrl(fallbackBackend);
            try {
              localStorage.setItem('mtv_api_backend_url', fallbackBackend);
            } catch (_) {}
            return this._request(endpoint, method, payload, true);
          }
        }
        return {
          success: false,
          error: err.message || 'Network error communicating with Universal AI Gateway.',
          errorCode: 'NETWORK_ERROR',
        };
      }
    },

    /**
     * Universal generation method for tools, capabilities, or direct prompts
     */
    generate: async function (params) {
      if (!params || typeof params !== 'object') {
        return { success: false, error: 'Parameters object required.', errorCode: 'INVALID_REQUEST' };
      }
      return this._request('/api/ai', 'POST', params);
    },

    /**
     * Execute a specific registered tool by ID with inputs
     */
    executeTool: async function (toolId, input, options) {
      return this.generate({
        toolId: toolId,
        input: input || {},
        options: options || {},
        provider: (options && options.provider) || this.selectedProvider || 'auto',
      });
    },

    /**
     * Analyze helper
     */
    analyze: async function (toolId, input) {
      return this.executeTool(toolId, input);
    },

    /**
     * Compare multiple AI providers on the same tool input or prompt
     */
    compare: async function (params) {
      return this._request('/api/ai/compare', 'POST', params);
    },

    /**
     * Batch execute inputs through a tool
     */
    batch: async function (batchParams) {
      return this._request('/api/ai/batch', 'POST', batchParams);
    },

    /**
     * Get list of all registered tools
     */
    getTools: async function () {
      return this._request('/api/ai/tools', 'GET');
    },

    /**
     * Get specific tool definition
     */
    getTool: async function (toolId) {
      return this._request('/api/ai/tools/' + encodeURIComponent(toolId), 'GET');
    },

    /**
     * Get all supported capabilities
     */
    getCapabilities: async function () {
      return this._request('/api/ai/capabilities', 'GET');
    },

    /**
     * Get all models across providers
     */
    getModels: async function () {
      return this._request('/api/ai/models', 'GET');
    },

    /**
     * Query operational health and provider availability
     */
    getHealth: async function () {
      return this._request('/api/ai/health', 'GET');
    },

    /**
     * Get list of configured providers
     */
    getProviders: async function () {
      return this._request('/api/ai/providers', 'GET');
    },

    /**
     * Get system observability metrics
     */
    getMetrics: async function () {
      return this._request('/api/ai/metrics', 'GET');
    },
  };

  // Expose on global window object
  if (typeof window !== 'undefined') {
    window.mtvAI = MTV_AI_SDK;
    // Backward compatibility alias
    window.MultiTubeAI = MTV_AI_SDK;
  }

  // CommonJS export if used in Node
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MTV_AI_SDK;
  }
})();

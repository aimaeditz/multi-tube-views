/**
 * Multi Tube Views (MTV) — Universal Client AI SDK
 * Provider-agnostic frontend client for interacting with the Universal AI Gateway.
 * Exposes window.mtvAI (and backward-compatible window.MultiTubeAI).
 */

(function () {
  'use strict';

  var MTV_AI_SDK = {
    version: '2.0.0',
    baseUrl: '',

    /**
     * Set base API URL if running in a decoupled frontend environment
     */
    setBaseUrl: function (url) {
      this.baseUrl = url.replace(/\/+$/, '');
    },

    /**
     * Helper to make secure JSON fetch requests to /api/ai
     */
    _request: async function (endpoint, method, payload) {
      var url = (this.baseUrl || '') + endpoint;
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
        var data = await response.json().catch(function () {
          return { error: 'Invalid JSON response from server.', errorCode: 'PARSING_ERROR' };
        });

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

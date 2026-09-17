/**
 * Multi Tube Views (MTV) — Universal Tools Registry & Dynamic Counter
 * Aggregates all tool systems across the platform:
 * 1. AI Tools (ai-tools-data.js)
 * 2. Media Converter Tools (media-tools-data.js)
 * 3. Browser Utilities (browser-utilities-data.js)
 * 4. Creator Tools (creator-tools-data.js)
 */

import { AI_TOOLS_DATA } from './ai-tools-data.js';
import { BU_CATEGORIES, BU_ALL_TOOLS_LIST } from './browser-utilities-data.js';
import { CREATOR_TOOLS_DATA } from './creator-tools-data.js';

export function getWebsiteToolMetrics() {
  // 1. AI Tools Count
  const aiToolsCount = (typeof AI_TOOLS_DATA === 'object' && AI_TOOLS_DATA !== null)
    ? Object.keys(AI_TOOLS_DATA).length
    : (window.MTV_AI_TOOLS_DATA ? Object.keys(window.MTV_AI_TOOLS_DATA).length : 61);

  // 2. Media Converter Tools Count
  let mediaToolsCount = 60;
  if (typeof window !== 'undefined' && window.MTV_ALL_TOOL_CONFIGS) {
    mediaToolsCount = Object.keys(window.MTV_ALL_TOOL_CONFIGS).length;
  } else if (typeof window !== 'undefined' && window.MTV_VALID_TOOLS && Array.isArray(window.MTV_VALID_TOOLS)) {
    mediaToolsCount = window.MTV_VALID_TOOLS.length;
  }

  // 3. Browser Utilities Tools Count
  let browserUtilitiesCount = 89;
  if (Array.isArray(BU_ALL_TOOLS_LIST) && BU_ALL_TOOLS_LIST.length > 0) {
    browserUtilitiesCount = BU_ALL_TOOLS_LIST.length;
  } else if (Array.isArray(BU_CATEGORIES) && BU_CATEGORIES.length > 0) {
    browserUtilitiesCount = BU_CATEGORIES.reduce((acc, cat) => {
      return acc + (Array.isArray(cat.tools) ? cat.tools.length : (cat.toolCount || 0));
    }, 0);
  }

  // 4. Creator Tools Count
  const creatorToolsCount = (typeof CREATOR_TOOLS_DATA === 'object' && CREATOR_TOOLS_DATA !== null)
    ? Object.keys(CREATOR_TOOLS_DATA).length
    : (window.MTV_CREATOR_TOOLS ? Object.keys(window.MTV_CREATOR_TOOLS).length : 20);

  const total = aiToolsCount + mediaToolsCount + browserUtilitiesCount + creatorToolsCount;

  return {
    ai: aiToolsCount,
    media: mediaToolsCount,
    browserUtilities: browserUtilitiesCount,
    creator: creatorToolsCount,
    total: total
  };
}

export function updateHeroToolBadge() {
  const metrics = getWebsiteToolMetrics();
  
  // Target badge element by ID or class selector
  const heroBadge = document.getElementById('hero-total-tools-badge');
  if (heroBadge) {
    heroBadge.textContent = `${metrics.total} Instant Tools`;
  } else {
    // Fallback: search for float-chip-4 text span
    const chip = document.querySelector('.float-chip.float-chip-4 span:last-child');
    if (chip) {
      chip.textContent = `${metrics.total} Instant Tools`;
    }
  }

  // Dispatch custom event for any other components listening for metrics updates
  if (typeof window !== 'undefined') {
    window.MTV_TOOL_METRICS = metrics;
    window.dispatchEvent(new CustomEvent('mtv:tools-metrics-updated', { detail: metrics }));
  }

  return metrics;
}

// Auto-run if in browser environment
if (typeof window !== 'undefined') {
  window.getWebsiteToolMetrics = getWebsiteToolMetrics;
  window.updateHeroToolBadge = updateHeroToolBadge;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateHeroToolBadge();
    });
  } else {
    updateHeroToolBadge();
  }
}

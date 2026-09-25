/**
 * Multi Tube Views (MTV) — Ultimate Traffic Growth & GA4 Analytics Layer
 * 
 * Production Features:
 * 1. Event Tracking: tool_open, tool_complete, file_download, search, outbound_click, scroll_90
 * 2. Core Web Vitals: LCP, FID, CLS, INP, FCP, TTFB
 * 3. Conversion Funnel: first_visit, return_visit, tool_open -> tool_complete
 * 4. Internal Search Tracking: view_search_results
 * 5. Geo & Language: navigator locale & time zone properties
 */

(function () {
  'use strict';

  // Safe wrapper around Google Analytics gtag function
  function sendGaEvent(eventName, params = {}) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
      } else if (window.dataLayer && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: eventName, ...params });
      }
    } catch (e) {
      // Graceful non-blocking error handling
    }
  }

  // -------------------------------------------------------------
  // 1. FIRST VISIT & RETURN VISIT FUNNEL TRACKING
  // -------------------------------------------------------------
  function trackVisitorStatus() {
    try {
      const storageKey = 'mtv_user_journey';
      const raw = localStorage.getItem(storageKey);
      const now = Date.now();
      let journey = raw ? JSON.parse(raw) : null;

      if (!journey) {
        journey = {
          firstVisit: now,
          lastVisit: now,
          visitCount: 1,
          toolsUsed: 0
        };
        localStorage.setItem(storageKey, JSON.stringify(journey));
        sendGaEvent('first_visit', {
          entry_page: window.location.pathname,
          referrer: document.referrer || 'direct'
        });
      } else {
        // Consider it a new visit session if > 30 minutes since last active
        const isNewSession = (now - (journey.lastVisit || 0)) > 30 * 60 * 1000;
        if (isNewSession) {
          journey.visitCount = (journey.visitCount || 1) + 1;
          sendGaEvent('return_visit', {
            visit_count: journey.visitCount,
            days_since_first: Math.round((now - journey.firstVisit) / (1000 * 60 * 60 * 24)),
            entry_page: window.location.pathname
          });
        }
        journey.lastVisit = now;
        localStorage.setItem(storageKey, JSON.stringify(journey));
      }
    } catch (e) {}
  }

  // -------------------------------------------------------------
  // 2. GEO, LOCALE & USER PROPERTIES
  // -------------------------------------------------------------
  function setUserLocaleProperties() {
    try {
      const language = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
      let timezone = 'UTC';
      try {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      } catch (err) {}

      if (typeof window.gtag === 'function') {
        window.gtag('set', 'user_properties', {
          user_locale: language,
          user_timezone: timezone,
          screen_res: `${window.screen.width}x${window.screen.height}`,
          viewport_res: `${window.innerWidth}x${window.innerHeight}`
        });
      }
    } catch (e) {}
  }

  // -------------------------------------------------------------
  // 3. TOOL IDENTIFICATION & OPEN TRACKING
  // -------------------------------------------------------------
  function detectCurrentTool() {
    const path = window.location.pathname;
    let toolCategory = 'general';
    let toolName = document.title || 'Unknown Tool';

    if (path.includes('/ai-tools/')) {
      toolCategory = 'ai-tools';
    } else if (path.includes('/browser-utilities/')) {
      toolCategory = 'browser-utilities';
    } else if (path.includes('/creator-tools/')) {
      toolCategory = 'creator-tools';
    } else if (path.includes('/media-converter-tools/')) {
      toolCategory = 'media-converter-tools';
    } else if (path.includes('/platforms/')) {
      toolCategory = 'platforms';
    } else if (path.endsWith('ai-auto.html') || path.endsWith('ai-auto')) {
      toolCategory = 'ai-tools';
      toolName = 'AI Automation Engine';
    } else if (path.endsWith('ai-prompt.html') || path.endsWith('ai-prompt')) {
      toolCategory = 'ai-tools';
      toolName = 'AI Prompt Engineering Lab';
    } else if (path.endsWith('explore-hub.html') || path.endsWith('explore-hub')) {
      toolCategory = 'hub';
      toolName = 'Explore Hub';
    }

    const h1 = document.querySelector('h1');
    if (h1 && h1.textContent.trim()) {
      toolName = h1.textContent.trim();
    }

    return { toolCategory, toolName, isToolPage: toolCategory !== 'general' && toolCategory !== 'hub' };
  }

  function trackToolOpen() {
    const { toolCategory, toolName, isToolPage } = detectCurrentTool();
    if (isToolPage) {
      sendGaEvent('tool_open', {
        tool_name: toolName,
        tool_category: toolCategory,
        page_path: window.location.pathname
      });
    }
  }

  // -------------------------------------------------------------
  // 4. SCROLL DEPTH TRACKING (90% Page Depth)
  // -------------------------------------------------------------
  function initScrollDepthTracking() {
    let fired90 = false;

    function checkScroll() {
      if (fired90) return;
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );

      if (docHeight <= windowHeight) return;

      const scrollPercent = ((scrollY + windowHeight) / docHeight) * 100;
      if (scrollPercent >= 90) {
        fired90 = true;
        sendGaEvent('scroll_90', {
          page_path: window.location.pathname,
          page_title: document.title,
          scroll_percentage: Math.round(scrollPercent)
        });
        window.removeEventListener('scroll', checkScrollThrottled);
      }
    }

    let ticking = false;
    function checkScrollThrottled() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', checkScrollThrottled, { passive: true });
  }

  // -------------------------------------------------------------
  // 5. OUTBOUND LINKS & DOWNLOAD DELEGATED TRACKING
  // -------------------------------------------------------------
  function initGlobalClickTracking() {
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!target) return;

      // Check for link click
      const link = target.closest('a');
      if (link && link.href) {
        const href = link.href;

        // Check if download link
        if (link.hasAttribute('download') || href.match(/\.(pdf|zip|mp3|wav|jpg|jpeg|png|webp|avif|csv|json|xml|txt|ico|svg)$/i)) {
          const fileName = link.getAttribute('download') || href.split('/').pop() || 'download';
          const fileType = fileName.split('.').pop() || 'file';
          const { toolName } = detectCurrentTool();
          sendGaEvent('file_download', {
            file_name: fileName,
            file_type: fileType,
            tool_name: toolName,
            page_path: window.location.pathname
          });
          return;
        }

        // Check if outbound link
        try {
          const url = new URL(href, window.location.href);
          const isExternal = url.hostname && url.hostname !== window.location.hostname && !url.hostname.includes('multitubeviews.com');
          if (isExternal && !url.protocol.startsWith('javascript:')) {
            sendGaEvent('outbound_click', {
              url: url.href,
              domain: url.hostname,
              link_text: (link.textContent || '').trim().slice(0, 100),
              outbound: true
            });
          }
        } catch (err) {}
      }

      // Check for custom download / export buttons
      const btn = target.closest('button, [role="button"], .btn');
      if (btn) {
        const btnText = (btn.textContent || '').trim().toLowerCase();
        const action = btn.getAttribute('data-action') || '';
        const id = btn.id || '';
        const className = btn.className || '';

        // Download / Export detection
        if (
          action.includes('download') ||
          action.includes('export') ||
          id.includes('download') ||
          id.includes('export') ||
          className.includes('download') ||
          className.includes('export') ||
          btnText.startsWith('download') ||
          btnText.startsWith('export') ||
          btnText.includes('save as') ||
          btnText.includes('export pdf') ||
          btnText.includes('export zip') ||
          btnText.includes('download mp3')
        ) {
          const { toolName } = detectCurrentTool();
          sendGaEvent('file_download', {
            button_label: btnText.slice(0, 50),
            tool_name: toolName,
            page_path: window.location.pathname
          });
        }

        // Tool completion detection (e.g. Generate, Convert, Calculate, Polish, Analyze)
        if (
          action.includes('generate') ||
          action.includes('convert') ||
          action.includes('calculate') ||
          action.includes('analyze') ||
          action.includes('run') ||
          id.includes('generate') ||
          id.includes('convert') ||
          id.includes('calculate') ||
          btnText.includes('generate') ||
          btnText.includes('convert') ||
          btnText.includes('calculate') ||
          btnText.includes('optimize') ||
          btnText.includes('analyze') ||
          btnText.includes('format') ||
          btnText.includes('compress')
        ) {
          const { toolName, toolCategory } = detectCurrentTool();
          sendGaEvent('tool_complete', {
            tool_name: toolName,
            tool_category: toolCategory,
            trigger_button: btnText.slice(0, 50),
            page_path: window.location.pathname
          });
        }
      }
    });
  }

  // -------------------------------------------------------------
  // 6. INTERNAL SEARCH TRACKING
  // -------------------------------------------------------------
  function initSearchTracking() {
    let searchTimeout = null;
    const trackedQueries = new Set();

    function onSearchInput(query) {
      const trimmed = (query || '').trim();
      if (trimmed.length < 2 || trackedQueries.has(trimmed.toLowerCase())) return;

      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        trackedQueries.add(trimmed.toLowerCase());
        sendGaEvent('search', {
          search_term: trimmed,
          page_path: window.location.pathname
        });
        sendGaEvent('view_search_results', {
          search_term: trimmed,
          page_path: window.location.pathname
        });
      }, 700);
    }

    document.addEventListener('input', (e) => {
      const input = e.target;
      if (!input) return;
      if (
        input.type === 'search' ||
        input.id === 'site-search-input' ||
        input.id === 'search-input' ||
        input.id === 'global-search' ||
        (input.name && input.name.includes('search')) ||
        (input.placeholder && input.placeholder.toLowerCase().includes('search')) ||
        (input.className && input.className.includes('search-input'))
      ) {
        onSearchInput(input.value);
      }
    });
  }

  // -------------------------------------------------------------
  // 7. PERFORMANCE MONITORING (Core Web Vitals)
  // -------------------------------------------------------------
  function initWebVitalsTracking() {
    try {
      if (!('PerformanceObserver' in window)) return;

      const reportedMetrics = new Set();

      function reportMetric(name, value, rating = 'good') {
        const key = `${name}_${Math.round(value)}`;
        if (reportedMetrics.has(name)) return;
        reportedMetrics.add(name);

        sendGaEvent('web_vitals', {
          metric_name: name,
          metric_value: Math.round(value * 100) / 100,
          metric_rating: rating,
          page_path: window.location.pathname
        });
      }

      // Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            const val = lastEntry.renderTime || lastEntry.loadTime;
            const rating = val <= 2500 ? 'good' : val <= 4000 ? 'needs_improvement' : 'poor';
            reportMetric('LCP', val, rating);
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {}

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const val = entry.processingStart - entry.startTime;
            const rating = val <= 100 ? 'good' : val <= 300 ? 'needs_improvement' : 'poor';
            reportMetric('FID', val, rating);
          }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {}

      // Cumulative Layout Shift (CLS)
      try {
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
            }
          }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        // Report CLS on pagehide or visibilitychange
        window.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden' && clsScore > 0) {
            const rating = clsScore <= 0.1 ? 'good' : clsScore <= 0.25 ? 'needs_improvement' : 'poor';
            reportMetric('CLS', clsScore, rating);
          }
        }, { once: true });
      } catch (e) {}

      // First Contentful Paint (FCP)
      try {
        const fcpObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              const val = entry.startTime;
              const rating = val <= 1800 ? 'good' : val <= 3000 ? 'needs_improvement' : 'poor';
              reportMetric('FCP', val, rating);
            }
          }
        });
        fcpObserver.observe({ type: 'paint', buffered: true });
      } catch (e) {}

      // Navigation Timing (TTFB)
      try {
        window.addEventListener('load', () => {
          const navEntries = performance.getEntriesByType('navigation');
          if (navEntries && navEntries.length > 0) {
            const nav = navEntries[0];
            const ttfb = nav.responseStart - nav.requestStart;
            if (ttfb >= 0) {
              const rating = ttfb <= 800 ? 'good' : ttfb <= 1800 ? 'needs_improvement' : 'poor';
              reportMetric('TTFB', ttfb, rating);
            }
          }
        });
      } catch (e) {}
    } catch (e) {}
  }

  // -------------------------------------------------------------
  // INITIALIZATION RUNNER
  // -------------------------------------------------------------
  function init() {
    setUserLocaleProperties();
    trackVisitorStatus();
    trackToolOpen();
    initScrollDepthTracking();
    initGlobalClickTracking();
    initSearchTracking();
    initWebVitalsTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global helper API for intentional custom events
  window.mtvAnalytics = {
    trackEvent: sendGaEvent,
    trackToolOpen: (toolName, category) => sendGaEvent('tool_open', { tool_name: toolName, tool_category: category }),
    trackToolComplete: (toolName, category, metadata = {}) => sendGaEvent('tool_complete', { tool_name: toolName, tool_category: category, ...metadata }),
    trackDownload: (fileName, fileType) => sendGaEvent('file_download', { file_name: fileName, file_type: fileType }),
    trackSearch: (searchTerm) => {
      sendGaEvent('search', { search_term: searchTerm });
      sendGaEvent('view_search_results', { search_term: searchTerm });
    }
  };

})();

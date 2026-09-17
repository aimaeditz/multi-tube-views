/**
 * Multi Tube Views (MTV) — Navigation, Mobile Drawer & Directory Search
 */

document.addEventListener('DOMContentLoaded', () => {
  // Shared Navigation Component Synchronization
  const ensureSharedNavbar = () => {
    const navDesktop = document.querySelector('.nav-desktop');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    if (!navDesktop && !mobileDrawer) return;

    const path = window.location.pathname;
    const isSubfolder = path.includes('/platforms/') || path.includes('/browser-utilities/');
    const p = isSubfolder ? '../' : '';

    let activeKey = '';
    if (path.endsWith('/') || path.endsWith('/index.html') || path.includes('/index.html')) {
      activeKey = 'home';
    } else if (path.includes('explore-hub.html')) {
      activeKey = 'explore-hub';
    } else if (path.includes('ai-tools.html') || path.includes('ai-voice-generator.html')) {
      activeKey = 'ai-tools';
    } else if (path.includes('ai-prompt.html') || path.includes('ai-auto.html')) {
      activeKey = 'ai-prompt';
    } else if (path.includes('creator-tools.html')) {
      activeKey = 'creator-tools';
    } else if (path.includes('media-converter-tools.html')) {
      activeKey = 'media-converter-tools';
    } else if (path.includes('browser-utilities')) {
      activeKey = 'browser-utilities';
    } else if (path.includes('platforms')) {
      activeKey = 'platforms';
    } else if (path.includes('about.html')) {
      activeKey = 'about';
    } else if (path.includes('settings.html')) {
      activeKey = 'settings';
    } else if (path.includes('privacy.html')) {
      activeKey = 'privacy';
    } else if (path.includes('disclaimer.html')) {
      activeKey = 'disclaimer';
    } else if (path.includes('terms.html')) {
      activeKey = 'terms';
    } else if (path.includes('contact.html')) {
      activeKey = 'contact';
    }

    if (navDesktop) {
      navDesktop.innerHTML = `
        <a href="${p}index.html" class="nav-link nav-link-home ${activeKey === 'home' ? 'active' : ''}">Home</a>
        <a href="${p}explore-hub.html" class="nav-link ${activeKey === 'explore-hub' ? 'active' : ''}">Explore Hub</a>
        <a href="${p}ai-prompt.html" class="nav-link ${activeKey === 'ai-prompt' ? 'active' : ''}">AI Prompt</a>
        <a href="${p}ai-tools.html" class="nav-link ${activeKey === 'ai-tools' ? 'active' : ''}">AI Tools</a>
        <a href="${p}creator-tools.html" class="nav-link ${activeKey === 'creator-tools' ? 'active' : ''}">Creator Tools</a>
        <a href="${p}media-converter-tools.html" class="nav-link ${activeKey === 'media-converter-tools' ? 'active' : ''}">Converter Tools</a>
        <a href="${p}browser-utilities.html" class="nav-link ${activeKey === 'browser-utilities' ? 'active' : ''}">Browser Utilities</a>
        <a href="${p}platforms.html" class="nav-link ${activeKey === 'platforms' ? 'active' : ''}">Platforms</a>
      `;
    }

    if (mobileDrawer) {
      mobileDrawer.innerHTML = `
        <a href="${p}index.html" class="mobile-nav-link nav-link-home ${activeKey === 'home' ? 'active' : ''}">Home</a>
        <a href="${p}explore-hub.html" class="mobile-nav-link ${activeKey === 'explore-hub' ? 'active' : ''}">Explore Hub</a>
        <a href="${p}ai-prompt.html" class="mobile-nav-link ${activeKey === 'ai-prompt' ? 'active' : ''}">AI Prompt</a>
        <a href="${p}ai-tools.html" class="mobile-nav-link ${activeKey === 'ai-tools' ? 'active' : ''}">AI Tools</a>
        <a href="${p}creator-tools.html" class="mobile-nav-link ${activeKey === 'creator-tools' ? 'active' : ''}">Creator Tools</a>
        <a href="${p}media-converter-tools.html" class="mobile-nav-link ${activeKey === 'media-converter-tools' ? 'active' : ''}">Media Converter Tools</a>
        <a href="${p}browser-utilities.html" class="mobile-nav-link ${activeKey === 'browser-utilities' ? 'active' : ''}">Browser Utilities</a>
        <a href="${p}platforms.html" class="mobile-nav-link ${activeKey === 'platforms' ? 'active' : ''}">Platforms</a>
        <a href="${p}about.html" class="mobile-nav-link ${activeKey === 'about' ? 'active' : ''}">About</a>
        <a href="${p}settings.html" class="mobile-nav-link ${activeKey === 'settings' ? 'active' : ''}">Settings</a>
        <a href="${p}privacy.html" class="mobile-nav-link ${activeKey === 'privacy' ? 'active' : ''}">Privacy Policy</a>
        <a href="${p}disclaimer.html" class="mobile-nav-link ${activeKey === 'disclaimer' ? 'active' : ''}">Disclaimer</a>
        <a href="${p}terms.html" class="mobile-nav-link ${activeKey === 'terms' ? 'active' : ''}">Terms of Service</a>
        <a href="${p}contact.html" class="mobile-nav-link ${activeKey === 'contact' ? 'active' : ''}">Contact</a>
      `;
    }
  };

  ensureSharedNavbar();

  // Update copyright year
  const yearSpans = document.querySelectorAll('.dynamic-year');
  const currentYear = new Date().getFullYear();
  yearSpans.forEach(el => el.textContent = currentYear);

  // Mobile Menu Drawer Handler
  const mobileMenuBtn = document.querySelector('.btn-mobile-menu');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  if (mobileMenuBtn && mobileDrawer) {
    const updateMenuState = (isOpen) => {
      mobileDrawer.classList.toggle('open', isOpen);
      document.body.classList.toggle('drawer-open', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close Navigation Menu' : 'Open Navigation Menu');
      mobileMenuBtn.innerHTML = isOpen 
        ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    };



    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const willOpen = !mobileDrawer.classList.contains('open');
      updateMenuState(willOpen);
    });

    // Prevent clicks inside drawer from closing it inadvertently
    mobileDrawer.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Close on navigation link click
    mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        updateMenuState(false);
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        updateMenuState(false);
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open')) {
        if (!e.target.closest('.mobile-drawer') && !e.target.closest('.btn-mobile-menu')) {
          updateMenuState(false);
        }
      }
    });

    // Auto-close on viewport resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileDrawer.classList.contains('open')) {
        updateMenuState(false);
      }
    });
  }

  // FAQ Accordion Interactivity (Supports both standard and glass FAQ)
  const faqItems = document.querySelectorAll('.faq-item, .glass-faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question, .glass-faq-trigger');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.toggle('open');
        item.classList.toggle('active', isOpen);
        questionBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  });

  // Live Stats Counter Animation with replay on every viewport re-entry
  const initStatsCounter = () => {
    const statsSection = document.getElementById('live-stats-section');
    if (!statsSection) return;

    const statElements = statsSection.querySelectorAll('.live-stat-number[data-target]');
    if (!statElements.length) return;

    const animationFrames = [];
    const duration = 2000; // ms: natural, smooth 2.0s duration (1.5-2.5s)

    const cancelAllFrames = () => {
      animationFrames.forEach(id => cancelAnimationFrame(id));
      animationFrames.length = 0;
    };

    const resetCounters = () => {
      cancelAllFrames();
      statElements.forEach(el => {
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = '0' + suffix;
        el.classList.remove('is-visible');
      });
    };

    const runCountUp = () => {
      cancelAllFrames();
      const startTime = performance.now();

      statElements.forEach((el, index) => {
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        
        // Add class to trigger CSS fade and scale lift transition
        el.classList.add('is-visible');

        const step = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Eased animation: smooth ease-out (starts with momentum and gently decelerates near the end)
          const ease = Math.sin((progress * Math.PI) / 2);
          const currentVal = Math.round(ease * target);
          el.textContent = currentVal + suffix;

          if (progress < 1) {
            animationFrames[index] = requestAnimationFrame(step);
          } else {
            el.textContent = target + suffix;
          }
        };

        animationFrames[index] = requestAnimationFrame(step);
      });
    };

    // Check reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      statElements.forEach(el => {
        const target = el.getAttribute('data-target') || '0';
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = target + suffix;
        el.classList.add('is-visible');
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      runCountUp();
      return;
    }

    let isVisible = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            runCountUp();
          }
        } else {
          // Reset counter to 0 whenever section exits viewport
          if (isVisible) {
            isVisible = false;
            resetCounters();
          }
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '50px 0px'
    });

    observer.observe(statsSection);
  };

  initStatsCounter();

  // Directory Live Search (Homepage)
  const searchInput = document.querySelector('#directory-search-input');
  if (searchInput) {
    const platformCards = document.querySelectorAll('.platform-card');
    const noResultsMsg = document.querySelector('#directory-no-results');

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let matchCount = 0;

      platformCards.forEach(card => {
        const title = card.querySelector('.platform-card-title')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.platform-card-desc')?.textContent.toLowerCase() || '';
        const category = card.getAttribute('data-category')?.toLowerCase() || '';

        if (!query || title.includes(query) || desc.includes(query) || category.includes(query)) {
          card.style.display = '';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (noResultsMsg) {
        noResultsMsg.style.display = matchCount === 0 ? 'block' : 'none';
      }
    });
  }

  // Scroll Reveal Observer (Hardware-accelerated, lightweight, single-trigger)
  const initScrollReveal = () => {
    // Target primary section blocks, cards and explicit reveal targets
    const selector = [
      'section',
      '.site-section',
      '.hero-section',
      '.growth-hero-section',
      '.creator-tools-header',
      '.page-header',
      '.reading-header',
      '.platform-page-header',
      '.prompt-header-section',
      '.bu-card',
      '.creator-tool-card',
      '.media-tool-card',
      '.ai-image-tool-card',
      '.platform-card',
      '.prompt-card',
      '.article-card',
      '.player-card',
      '.glass-card',
      '.feature-showcase-card',
      '.live-stat-card',
      '.glass-cta-card',
      '.scroll-reveal'
    ].join(', ');

    const elements = document.querySelectorAll(selector);

    if (!elements.length) return;

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '60px 0px 60px 0px',
      threshold: 0.01
    });

    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      // If already in or near initial viewport, reveal immediately without delay
      if (rect.top <= windowHeight + 100) {
        el.classList.add('is-revealed');
      } else {
        el.classList.add('scroll-reveal');
        observer.observe(el);
      }
    });
  };

  initScrollReveal();

  // Desktop Navigation Mouse Drag-to-Scroll & Fade Mask Behavior (Desktop only with fine pointer)
  const navDesktop = document.querySelector('.nav-desktop');
  const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (navDesktop && supportsFinePointer && !isTouch && window.innerWidth > 780) {
    // Dynamic mask edge fade updates
    const updateNavFade = () => {
      const scrollLeft = navDesktop.scrollLeft;
      const maxScroll = navDesktop.scrollWidth - navDesktop.clientWidth;
      
      const canScrollLeft = scrollLeft > 1;
      const canScrollRight = scrollLeft < maxScroll - 1;
      
      navDesktop.classList.toggle('can-scroll-left', canScrollLeft);
      navDesktop.classList.toggle('can-scroll-right', canScrollRight);
    };

    // Initialize and bind scroll events
    updateNavFade();
    navDesktop.addEventListener('scroll', updateNavFade, { passive: true });
    window.addEventListener('resize', updateNavFade, { passive: true });
    window.addEventListener('load', updateNavFade, { passive: true });

    let isDown = false;
    let startX;
    let scrollLeft;
    let hasDragged = false;

    navDesktop.addEventListener('mousedown', (e) => {
      // Only drag with left mouse button
      if (e.button !== 0) return;
      isDown = true;
      hasDragged = false;
      startX = e.pageX;
      scrollLeft = navDesktop.scrollLeft;
      navDesktop.style.cursor = 'grabbing';
      navDesktop.style.scrollBehavior = 'auto'; // Smooth scroll breaks instant drag feedback
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX;
      const walk = (x - startX) * 1.5; // Scroll speed multiplier
      if (Math.abs(walk) > 4) {
        hasDragged = true;
      }
      navDesktop.scrollLeft = scrollLeft - walk;
    });

    document.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      navDesktop.style.cursor = '';
      navDesktop.style.scrollBehavior = 'smooth'; // Restore smooth scroll on mouseup
      
      if (hasDragged) {
        // Prevent click navigation on active drag-scroll
        const preventClick = (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          navDesktop.removeEventListener('click', preventClick, true);
        };
        navDesktop.addEventListener('click', preventClick, true);
      }
    });

    // Translate vertical scroll wheel into horizontal scroll for the navbar
    navDesktop.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0 && e.deltaX === 0) {
        e.preventDefault();
        navDesktop.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }

  // Universal Arrow Icon Nudge Animation Enforcer (Site-wide & Future Sections/Pages)
  const applyArrowNudges = (root = document.body) => {
    if (!root) return;

    // 1. Target existing elements with arrow classes or SVG icons inside buttons/links
    const arrowSelectors = 'svg, .arrow, .arrow-right, .arrow-icon, [class*="arrow"]';
    root.querySelectorAll(arrowSelectors).forEach(el => {
      if (!el.classList.contains('arrow-nudge') && !el.classList.contains('arrow-nudge-left') && !el.classList.contains('arrow-nudge-up-right')) {
        const svg = el.tagName === 'SVG' ? el : el.querySelector('svg');
        if (svg && !svg.classList.contains('arrow-nudge')) {
          svg.classList.add('arrow-nudge', 'inline-block');
        }
      }
    });
  };

  applyArrowNudges();

  // Consistently auto-expand all output boxes (textareas, divs, and table wraps) site-wide
  let expandRafId = null;
  const autoExpandOutputs = () => {
    if (expandRafId) cancelAnimationFrame(expandRafId);
    expandRafId = requestAnimationFrame(() => {
      // 1. Handle #dedicated-tool-output div and other inline-tool-output elements
      const dedicatedOutputs = document.querySelectorAll('#dedicated-tool-output, .inline-tool-output');
      dedicatedOutputs.forEach(el => {
        if (el.style.maxHeight !== 'none' || el.style.overflowY !== 'visible') {
          el.style.maxHeight = 'none';
          el.style.overflowY = 'visible';
          el.style.setProperty('max-height', 'none', 'important');
          el.style.setProperty('overflow-y', 'visible', 'important');
        }
      });

      // 2. Handle output table wrappers like .bu-table-wrap
      const tableWraps = document.querySelectorAll('.bu-table-wrap');
      tableWraps.forEach(wrap => {
        if (wrap.style.maxHeight !== 'none' || wrap.style.overflowY !== 'visible') {
          wrap.style.maxHeight = 'none';
          wrap.style.overflowY = 'visible';
          wrap.style.setProperty('max-height', 'none', 'important');
          wrap.style.setProperty('overflow-y', 'visible', 'important');
        }
      });

      // 3. Handle output textareas (any readonly textarea or textarea matching output/result IDs)
      const textareas = document.querySelectorAll('textarea');
      textareas.forEach(textarea => {
        const isOutput = textarea.hasAttribute('readonly') || 
                         textarea.id.includes('output') || 
                         textarea.id.includes('result') ||
                         textarea.readOnly;
        
        if (isOutput) {
          const currentVal = textarea.value;
          if (textarea._prevVal !== currentVal || textarea._prevWidth !== textarea.offsetWidth) {
            textarea.style.overflowY = 'hidden';
            textarea.style.setProperty('overflow-y', 'hidden', 'important');
            textarea.style.resize = 'none';
            
            textarea.style.height = 'auto';
            const newHeight = textarea.scrollHeight;
            textarea.style.height = (newHeight > 0 ? (newHeight + 4) : 150) + 'px';
            
            textarea._prevVal = currentVal;
            textarea._prevWidth = textarea.offsetWidth;
          }
        }
      });
    });
  };

  // Run autoExpandOutputs on load, resize, input, and custom update event
  autoExpandOutputs();
  window.addEventListener('load', autoExpandOutputs, { passive: true });
  window.addEventListener('resize', autoExpandOutputs, { passive: true });
  document.body.addEventListener('input', (e) => {
    if (e.target.tagName === 'TEXTAREA') {
      autoExpandOutputs();
    }
  }, { passive: true });
  document.addEventListener('mtv-tool-output-updated', autoExpandOutputs);

  // Touch handlers for footer social media icons to toggle 'tapped' class
  const initFooterSocialTouch = () => {
    const socialLinks = document.querySelectorAll('.footer-social-link');
    socialLinks.forEach(link => {
      link.addEventListener('touchstart', () => {
        link.classList.add('tapped');
      }, { passive: true });
      link.addEventListener('touchend', () => {
        link.classList.remove('tapped');
      }, { passive: true });
      link.addEventListener('touchcancel', () => {
        link.classList.remove('tapped');
      }, { passive: true });
    });
  };
  initFooterSocialTouch();
});

// Universal Site-Wide Click Tracking for Explore Hub "Featured Tools"
(function initToolClickTracking() {
  function parseToolIdFromUrl(urlStr) {
    if (!urlStr || typeof urlStr !== 'string') return null;
    try {
      if (urlStr.includes('tool=')) {
        const match = urlStr.match(/[?&]tool=([^&#]+)/);
        if (match && match[1]) return decodeURIComponent(match[1]);
      }
      if (urlStr.includes('browser-utilities/') && urlStr.endsWith('.html')) {
        const parts = urlStr.split('/');
        const filename = parts[parts.length - 1];
        const toolId = filename.replace('.html', '');
        if (toolId && toolId !== 'index' && toolId !== 'browser-utilities') {
          return toolId;
        }
      }
      if (urlStr.includes('ai-auto.html')) return 'ai-auto';
    } catch (e) {}
    return null;
  }

  function recordToolClick(toolId) {
    if (!toolId || typeof toolId !== 'string') return;
    try {
      if (window.StorageManager && typeof window.StorageManager.recordToolClick === 'function') {
        window.StorageManager.recordToolClick(toolId);
      } else {
        const raw = localStorage.getItem('mtv_tool_clicks');
        const clicks = raw ? JSON.parse(raw) : {};
        clicks[toolId] = (clicks[toolId] || 0) + 1;
        localStorage.setItem('mtv_tool_clicks', JSON.stringify(clicks));
      }
    } catch (e) {
      console.warn('LocalStorage error while recording tool click:', e);
    }
  }

  function getToolClickCounts() {
    try {
      if (window.StorageManager && typeof window.StorageManager.getToolClicks === 'function') {
        return window.StorageManager.getToolClicks();
      } else {
        const raw = localStorage.getItem('mtv_tool_clicks');
        return raw ? JSON.parse(raw) : {};
      }
    } catch (e) {
      console.warn('LocalStorage error while reading tool clicks:', e);
      return {};
    }
  }

  window.mtvRecordToolClick = recordToolClick;
  window.mtvGetToolClickCounts = getToolClickCounts;
  window.mtvParseToolIdFromUrl = parseToolIdFromUrl;

  document.addEventListener('click', (e) => {
    let target = e.target;
    while (target && target !== document) {
      const dataId = target.getAttribute && (target.getAttribute('data-tool-id') || target.getAttribute('data-tool'));
      if (dataId) {
        recordToolClick(dataId);
        break;
      }
      const href = target.getAttribute && target.getAttribute('href');
      if (href) {
        const toolId = parseToolIdFromUrl(href);
        if (toolId) {
          recordToolClick(toolId);
          break;
        }
      }
      target = target.parentElement;
    }
  }, { capture: true, passive: true });

  if (typeof window !== 'undefined' && window.location) {
    const pageToolId = parseToolIdFromUrl(window.location.href);
    if (pageToolId) {
      recordToolClick(pageToolId);
    }
  }
})();


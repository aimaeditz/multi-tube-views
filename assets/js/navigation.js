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
    } else if (path.includes('ai-tools.html')) {
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
    }

    if (navDesktop) {
      navDesktop.innerHTML = `
        <a href="${p}index.html" class="nav-link ${activeKey === 'home' ? 'active' : ''}">Home</a>
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
        <a href="${p}index.html" class="mobile-nav-link ${activeKey === 'home' ? 'active' : ''}">Home</a>
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
    const duration = 1200; // ms

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
          // Ease-out cubic curve
          const ease = 1 - Math.pow(1 - progress, 3);
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

    const isMobile = window.innerWidth <= 780 || window.matchMedia('(max-width: 780px)').matches;

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches || isMobile) {
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
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.05
    });

    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      // If already in initial viewport, reveal immediately without observing
      if (rect.top <= windowHeight) {
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

    // 2. Walk text nodes to wrap raw arrow characters (→, ↗, ←, ➔, ➜, ➡) in animated spans
    const walkTextNodes = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;
        if (text && (text.includes('→') || text.includes('←') || text.includes('↗') || text.includes('➔') || text.includes('➜') || text.includes('➡'))) {
          const parent = node.parentNode;
          if (parent && !parent.closest('.arrow-nudge-container') && !parent.classList.contains('arrow-nudge') && !parent.classList.contains('arrow-nudge-left') && !parent.classList.contains('arrow-nudge-up-right')) {
            if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(parent.tagName)) return;
            
            const fragment = document.createDocumentFragment();
            const regex = /(→|←|↗|➔|➜|➡)/g;
            let lastIdx = 0;
            let match;

            while ((match = regex.exec(text)) !== null) {
              if (match.index > lastIdx) {
                fragment.appendChild(document.createTextNode(text.substring(lastIdx, match.index)));
              }
              const span = document.createElement('span');
              const char = match[1];
              span.className = (char === '←' ? 'arrow-nudge-left' : (char === '↗' ? 'arrow-nudge-up-right' : 'arrow-nudge')) + ' inline-block';
              span.textContent = char;
              fragment.appendChild(span);

              lastIdx = regex.lastIndex;
            }
            if (lastIdx < text.length) {
              fragment.appendChild(document.createTextNode(text.substring(lastIdx)));
            }
            parent.replaceChild(fragment, node);
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE'].includes(node.tagName)) return;
        if (node.classList && (node.classList.contains('arrow-nudge') || node.classList.contains('arrow-nudge-left') || node.classList.contains('arrow-nudge-up-right'))) return;
        
        const children = Array.from(node.childNodes);
        children.forEach(child => walkTextNodes(child));
      }
    };

    walkTextNodes(root);
  };

  applyArrowNudges();

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(mut => {
      mut.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          applyArrowNudges(node);
        }
      });
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Consistently auto-expand all output boxes (textareas, divs, and table wraps) site-wide
  const autoExpandOutputs = () => {
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
          // Force layout properties to prevent scrolling and allow auto-expansion
          textarea.style.overflowY = 'hidden';
          textarea.style.setProperty('overflow-y', 'hidden', 'important');
          textarea.style.resize = 'none';
          
          textarea.style.height = 'auto';
          const newHeight = textarea.scrollHeight;
          // Add 4px padding safety to avoid any potential sub-pixel layout oscillation
          textarea.style.height = (newHeight > 0 ? (newHeight + 4) : 150) + 'px';
          
          textarea._prevVal = currentVal;
          textarea._prevWidth = textarea.offsetWidth;
        }
      }
    });
  };

  // Run autoExpandOutputs immediately and register triggers
  autoExpandOutputs();
  window.addEventListener('load', autoExpandOutputs);
  window.addEventListener('resize', autoExpandOutputs);
  
  // High-frequency polling to immediately catch programmatic updates or model streamings
  setInterval(autoExpandOutputs, 100);

  // Fallback observer for textarea modifications or dynamic content loading
  document.body.addEventListener('input', (e) => {
    if (e.target.tagName === 'TEXTAREA') {
      autoExpandOutputs();
    }
  });
});

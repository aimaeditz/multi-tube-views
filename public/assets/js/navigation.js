/**
 * Multi Tube Views (MTV) — Navigation, Mobile Drawer & Directory Search
 */

document.addEventListener('DOMContentLoaded', () => {
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
      '.footer-grid',
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
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.05
    });

    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      // If already in or above initial viewport, reveal immediately without observing
      if (rect.top <= windowHeight) {
        el.classList.add('is-revealed');
      } else {
        el.classList.add('scroll-reveal');
        observer.observe(el);
      }
    });
  };

  initScrollReveal();

  // Desktop Navigation Mouse Drag-to-Scroll & Fade Mask Behavior
  const navDesktop = document.querySelector('.nav-desktop');
  if (navDesktop) {
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
});

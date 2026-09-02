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

    // Setup Accessible Collapsible Platforms Sub-menu dynamically
    const platformsLink = Array.from(mobileDrawer.querySelectorAll('.mobile-nav-link'))
      .find(link => {
        const href = link.getAttribute('href') || '';
        return href.endsWith('platforms.html');
      });

    if (platformsLink) {
      const isInsidePlatforms = window.location.pathname.includes('/platforms/') || 
        (platformsLink.getAttribute('href')?.startsWith('../') || false);

      const platformPrefix = isInsidePlatforms ? "" : "platforms/";
      const isMainPlatformsPage = window.location.pathname.endsWith('platforms.html');

      const categories = [
        {
          title: "📺 Video & Streaming",
          platforms: [
            { name: "YouTube", file: "youtube.html" },
            { name: "Dailymotion", file: "dailymotion.html" },
            { name: "Bilibili", file: "bilibili.html" },
            { name: "Rumble", file: "rumble.html" }
          ]
        },
        {
          title: "💬 Social Networks",
          platforms: [
            { name: "Facebook", file: "facebook.html" },
            { name: "Instagram", file: "instagram.html" },
            { name: "Threads", file: "threads.html" },
            { name: "X (Twitter)", file: "x.html" },
            { name: "LinkedIn", file: "linkedin.html" }
          ]
        },
        {
          title: "📱 Short-Form Video",
          platforms: [
            { name: "TikTok", file: "tiktok.html" },
            { name: "Snapchat", file: "snapchat.html" }
          ]
        },
        {
          title: "🎧 Audio & Podcasts",
          platforms: [
            { name: "Spotify", file: "spotify.html" },
            { name: "SoundCloud", file: "soundcloud.html" }
          ]
        },
        {
          title: "👾 Live Broadcasts",
          platforms: [
            { name: "Twitch", file: "twitch.html" },
            { name: "Kick", file: "kick.html" }
          ]
        },
        {
          title: "🎨 Creative & Community",
          platforms: [
            { name: "Vimeo", file: "vimeo.html" },
            { name: "Reddit", file: "reddit.html" },
            { name: "Pinterest", file: "pinterest.html" },
            { name: "Odysee", file: "odysee.html" },
            { name: "Telegram", file: "telegram.html" }
          ]
        }
      ];

      const dropdownGroup = document.createElement('div');
      dropdownGroup.className = 'mobile-nav-dropdown-group';

      const triggerContainer = document.createElement('div');
      triggerContainer.className = 'mobile-nav-dropdown-trigger-container';

      const newPlatformsLink = platformsLink.cloneNode(true);
      newPlatformsLink.id = 'mobile-platforms-link';
      if (!isMainPlatformsPage) {
        newPlatformsLink.classList.remove('active');
      }

      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'mobile-nav-dropdown-toggle-btn';
      toggleBtn.setAttribute('aria-label', 'Toggle Platforms Submenu');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-controls', 'mobile-platforms-submenu');
      toggleBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-icon">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      `;

      triggerContainer.appendChild(newPlatformsLink);
      triggerContainer.appendChild(toggleBtn);

      const submenuContent = document.createElement('div');
      submenuContent.className = 'mobile-nav-dropdown-content';
      submenuContent.id = 'mobile-platforms-submenu';
      submenuContent.setAttribute('aria-hidden', 'true');

      categories.forEach(cat => {
        const catDiv = document.createElement('div');
        catDiv.className = 'mobile-submenu-category';

        const catTitle = document.createElement('div');
        catTitle.className = 'mobile-submenu-category-title';
        catTitle.textContent = cat.title;
        catDiv.appendChild(catTitle);

        const gridDiv = document.createElement('div');
        gridDiv.className = 'mobile-submenu-grid';

        cat.platforms.forEach(plat => {
          const pLink = document.createElement('a');
          pLink.className = 'mobile-submenu-link';
          pLink.setAttribute('href', platformPrefix + plat.file);
          pLink.textContent = plat.name;

          // Check if current page is the specific platform
          if (window.location.pathname.endsWith('/' + plat.file) || window.location.pathname.endsWith(plat.file)) {
            pLink.classList.add('active');
          }

          pLink.addEventListener('click', () => {
            updateMenuState(false);
          });

          gridDiv.appendChild(pLink);
        });

        catDiv.appendChild(gridDiv);
        submenuContent.appendChild(catDiv);
      });

      dropdownGroup.appendChild(triggerContainer);
      dropdownGroup.appendChild(submenuContent);

      platformsLink.parentNode.replaceChild(dropdownGroup, platformsLink);

      const toggleSubmenu = (expand) => {
        toggleBtn.setAttribute('aria-expanded', expand ? 'true' : 'false');
        submenuContent.setAttribute('aria-hidden', expand ? 'false' : 'true');
        submenuContent.classList.toggle('open', expand);
      };

      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleSubmenu(!isExpanded);
      });

      // Auto-expand if we are currently on a platform page
      const isOnPlatformPage = isInsidePlatforms && !isMainPlatformsPage;
      if (isOnPlatformPage) {
        toggleSubmenu(true);
      }
    }

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

  // FAQ Accordion Interactivity
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.toggle('open');
        questionBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  });

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
      '.ai-image-tool-card',
      '.platform-card',
      '.prompt-card',
      '.article-card',
      '.player-card',
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
});

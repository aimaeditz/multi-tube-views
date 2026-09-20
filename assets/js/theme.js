/**
 * Multi Tube Views (MTV) — Theme & Display Settings Engine
 * Production Requirement: Defaults strictly to LIGHT MODE on first visit.
 * Dark Mode is a user-selected secondary alternative.
 */

(function () {
  const root = document.documentElement;

  function getEffectiveTheme(savedTheme) {
    if (savedTheme === 'dark') {
      return 'dark';
    }
    if (savedTheme === 'light') {
      return 'light';
    }
    if (savedTheme === 'system') {
      return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    // Strict requirement: Default interface must be LIGHT MODE
    return 'light';
  }

  function syncThemeMeta(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0A0A0C' : '#FDFDFD');
    }
  }

  function updateToggleButtons(effective) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn, #theme-toggle-btn, [data-action="toggle-theme"]');
    for (let i = 0; i < toggleBtns.length; i++) {
      const btn = toggleBtns[i];
      btn.setAttribute('data-current-theme', effective);
      btn.setAttribute('aria-label', `Switch theme (Current: ${effective})`);
      btn.innerHTML = effective === 'dark' 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  }

  function applyTheme(themeName, isInteractive = false) {
    const effective = getEffectiveTheme(themeName);
    const currentTheme = root.getAttribute('data-theme');

    // Remove the instant bg style block if it exists, to prevent overriding the main theme styles with !important
    const instantBg = document.getElementById('mtv-instant-bg');
    if (instantBg) {
      instantBg.remove();
    }

    if (currentTheme !== effective) {
      if (!isInteractive) {
        root.classList.add('theme-switching');
      }
      root.setAttribute('data-theme', effective);
      root.style.colorScheme = effective;
      root.style.backgroundColor = effective === 'dark' ? '#0A0A0C' : '#FDFDFD';
      
      if (!isInteractive) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            root.classList.remove('theme-switching');
          });
        });
      }
    } else {
      // Ensure background color is precisely aligned
      root.style.backgroundColor = effective === 'dark' ? '#0A0A0C' : '#FDFDFD';
      root.style.colorScheme = effective;
    }

    syncThemeMeta(effective);
    updateToggleButtons(effective);
  }

  function applyPreferences() {
    const sm = window.StorageManager;
    const savedTheme = sm ? sm.get('mtv_theme', 'light') : (localStorage.getItem('mtv_theme') || 'light');
    applyTheme(savedTheme, false);
  }

  // Initial immediate application before full DOM load
  const initialSaved = window.StorageManager ? window.StorageManager.get('mtv_theme', 'light') : (localStorage.getItem('mtv_theme') || 'light');
  applyTheme(initialSaved, false);

  // Mark theme-ready on initial animation frame to allow smooth interactive transitions later without initial load jolt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      root.classList.add('theme-ready');
    });
  } else {
    root.classList.add('theme-ready');
  }

  // Listen for system theme changes ONLY if user explicitly chose 'system'
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const currentStored = window.StorageManager ? window.StorageManager.get('mtv_theme', 'light') : (localStorage.getItem('mtv_theme') || 'light');
      if (currentStored === 'system') {
        applyTheme('system', true);
      }
    });
  }

  // Public theme functions
  window.ThemeEngine = {
    toggle() {
      const current = root.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      if (window.StorageManager) {
        window.StorageManager.set('mtv_theme', next);
      } else {
        try { localStorage.setItem('mtv_theme', next); } catch(e) {}
      }
      applyTheme(next, true);
      return next;
    },
    set(themeName) {
      if (window.StorageManager) {
        window.StorageManager.set('mtv_theme', themeName);
      } else {
        try { localStorage.setItem('mtv_theme', themeName); } catch(e) {}
      }
      applyTheme(themeName, true);
    },
    get() {
      return root.getAttribute('data-theme') || 'light';
    },
    refresh() {
      applyPreferences();
    }
  };

  // Re-run setup on DOMContentLoaded to bind buttons
  document.addEventListener('DOMContentLoaded', () => {
    window.ThemeEngine.refresh();
    
    // Bind all theme toggles directly
    document.querySelectorAll('.theme-toggle-btn, #theme-toggle-btn, [data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.ThemeEngine.toggle();
      });
    });
  });

  // Delegated click listener ensures instant response even for dynamically rendered buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.theme-toggle-btn, #theme-toggle-btn, [data-action="toggle-theme"]');
    if (btn) {
      e.preventDefault();
      window.ThemeEngine.toggle();
    }
  });
})();

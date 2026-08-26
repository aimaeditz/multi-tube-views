/**
 * Multi Tube Views (MTV) — Theme & Display Settings Engine
 * Production Requirement: Defaults strictly to LIGHT MODE on first visit.
 * Dark Mode is a user-selected secondary alternative.
 */

(function () {
  const root = document.documentElement;

  function getEffectiveTheme(savedTheme) {
    if (savedTheme === 'light') {
      return 'light';
    }
    if (savedTheme === 'dark') {
      return 'dark';
    }
    if (savedTheme === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    // Strict requirement: Default interface must be LIGHT MODE
    return 'light';
  }

  function applyTheme(themeName) {
    const effective = getEffectiveTheme(themeName);
    root.setAttribute('data-theme', effective);
    root.style.colorScheme = effective;
    
    // Update theme toggle buttons across the page
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.setAttribute('data-current-theme', effective);
      btn.setAttribute('aria-label', `Switch theme (Current: ${effective})`);
      btn.innerHTML = effective === 'dark' 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    });
  }

  function applyPreferences() {
    const sm = window.StorageManager;
    if (!sm) return;

    // Theme
    const savedTheme = sm.get('mtv_theme', 'light');
    applyTheme(savedTheme);

    // Display Density
    const density = sm.get('mtv_density', 'comfortable');
    if (density === 'compact') {
      document.documentElement.setAttribute('data-density', 'compact');
    } else {
      document.documentElement.removeAttribute('data-density');
    }

    // Motion
    const motion = sm.get('mtv_motion', 'default');
    if (motion === 'reduced') {
      document.documentElement.setAttribute('data-motion', 'reduced');
    } else if (motion === 'off') {
      document.documentElement.setAttribute('data-motion', 'off');
    } else {
      document.documentElement.removeAttribute('data-motion');
    }

    // High Contrast
    const contrast = sm.get('mtv_high_contrast', 'standard');
    if (contrast === 'high') {
      document.documentElement.setAttribute('data-contrast', 'high');
    } else {
      document.documentElement.removeAttribute('data-contrast');
    }

    // Focus Indicators
    const focusInd = sm.get('mtv_focus_indicators', 'default');
    if (focusInd === 'prominent') {
      document.documentElement.setAttribute('data-focus', 'prominent');
    } else {
      document.documentElement.removeAttribute('data-focus');
    }

    // Font Scale
    const fontScale = sm.get('mtv_font_scale', 'standard');
    if (fontScale === 'large') {
      document.documentElement.setAttribute('data-font-scale', 'large');
    } else if (fontScale === 'compact') {
      document.documentElement.setAttribute('data-font-scale', 'compact');
    } else {
      document.documentElement.removeAttribute('data-font-scale');
    }

    // UI Effects
    const uiEffects = sm.get('mtv_ui_effects', 'on');
    if (uiEffects === 'off') {
      document.documentElement.setAttribute('data-effects', 'off');
    } else {
      document.documentElement.removeAttribute('data-effects');
    }

    // Transitions
    const transitions = sm.get('mtv_transitions', 'on');
    if (transitions === 'off') {
      document.documentElement.setAttribute('data-transitions', 'off');
    } else {
      document.documentElement.removeAttribute('data-transitions');
    }

    // Lightweight UI Mode
    const lightweight = sm.get('mtv_lightweight_ui', 'off');
    if (lightweight === 'on') {
      document.documentElement.setAttribute('data-lightweight', 'true');
    } else {
      document.documentElement.removeAttribute('data-lightweight');
    }
  }

  // Initial immediate application before full DOM load (default 'light')
  const savedTheme = window.StorageManager ? window.StorageManager.get('mtv_theme', 'light') : 'light';
  applyTheme(savedTheme);
  applyPreferences();

  // Listen for system theme changes ONLY if user explicitly chose 'system'
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const currentStored = window.StorageManager ? window.StorageManager.get('mtv_theme', 'light') : 'light';
      if (currentStored === 'system') {
        applyTheme('system');
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
      }
      applyTheme(next);
      return next;
    },
    set(themeName) {
      if (window.StorageManager) {
        window.StorageManager.set('mtv_theme', themeName);
      }
      applyTheme(themeName);
    },
    get() {
      return root.getAttribute('data-theme') || 'light';
    },
    refresh() {
      applyPreferences();
    }
  };

  // Re-run setup on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    window.ThemeEngine.refresh();
    
    // Bind all theme toggles
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.ThemeEngine.toggle();
      });
    });
  });
})();

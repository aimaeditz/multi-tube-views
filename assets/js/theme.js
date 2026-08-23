/**
 * Multi Tube Views (MTV) — Theme & Display Settings Engine
 * Supports Light, Dark, System preference with zero-flash rendering.
 */

(function () {
  const root = document.documentElement;

  function getEffectiveTheme(savedTheme) {
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Default to system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(themeName) {
    const effective = getEffectiveTheme(themeName);
    root.setAttribute('data-theme', effective);
    
    // Update theme toggle buttons across the page
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', `Switch theme (Current: ${effective})`);
      btn.innerHTML = effective === 'dark' 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    });
  }

  // Initial immediate application before full DOM load
  const savedTheme = window.StorageManager ? window.StorageManager.get('mtv_theme', 'system') : 'system';
  applyTheme(savedTheme);

  // Apply motion and density preferences
  const savedMotion = window.StorageManager ? window.StorageManager.get('mtv_motion', 'default') : 'default';
  if (savedMotion === 'reduced') {
    document.body?.setAttribute('data-motion', 'reduced');
  }

  const savedDensity = window.StorageManager ? window.StorageManager.get('mtv_density', 'comfortable') : 'comfortable';
  if (savedDensity === 'compact') {
    document.body?.setAttribute('data-density', 'compact');
  }

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const currentStored = window.StorageManager ? window.StorageManager.get('mtv_theme', 'system') : 'system';
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
      const stored = window.StorageManager ? window.StorageManager.get('mtv_theme', 'system') : 'system';
      applyTheme(stored);
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

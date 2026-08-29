/**
 * Multi Tube Views (MTV) — Safe Storage & Preferences Manager
 */

const STORAGE_KEYS = {
  THEME: 'mtv_theme',
  DISPLAY_MODE: 'mtv_display_mode',
  DENSITY: 'mtv_density',
  FONT_SCALE: 'mtv_font_scale',
  MOTION: 'mtv_motion',
  TRANSITIONS: 'mtv_transitions',
  UI_EFFECTS: 'mtv_ui_effects',
  AUTO_LAYOUT: 'mtv_auto_layout',
  HIGH_CONTRAST: 'mtv_high_contrast',
  FOCUS_INDICATORS: 'mtv_focus_indicators',
  TEXT_SCALING: 'mtv_text_scaling',
  PERF_MODE: 'mtv_perf_mode',
  LIGHTWEIGHT_UI: 'mtv_lightweight_ui',
  LAZY_LOAD: 'mtv_lazy_load',
  OPTIMIZE_IMAGES: 'mtv_optimize_images',
  LOW_POWER: 'mtv_low_power',
  LAYOUT_COLS: 'mtv_layout_cols',
  LOOP_PREF: 'mtv_loop_pref',
  AUDIO_PREF: 'mtv_audio_pref',
  MAX_PLAYERS: 'mtv_max_players',
  RATIO_PREF: 'mtv_ratio_pref'
};

const StorageManager = {
  get(key, defaultValue = null) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : defaultValue;
    } catch (e) {
      console.warn('LocalStorage access is restricted:', e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Failed to remove from localStorage:', e);
    }
  },

  clearPreferences() {
    Object.values(STORAGE_KEYS).forEach(k => {
      this.remove(k);
    });
  }
};

window.STORAGE_KEYS = STORAGE_KEYS;
window.StorageManager = StorageManager;

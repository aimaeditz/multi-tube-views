/**
 * Multi Tube Views (MTV) — Safe Storage & Preferences Manager
 */

const STORAGE_KEYS = {
  THEME: 'mtv_theme',
  DENSITY: 'mtv_density',
  MOTION: 'mtv_motion',
  LAYOUT_COLS: 'mtv_layout_cols',
  ASPECT_RATIO: 'mtv_aspect_ratio',
  AUDIO_PREF: 'mtv_audio_pref'
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

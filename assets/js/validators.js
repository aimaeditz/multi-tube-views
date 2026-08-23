/**
 * Multi Tube Views (MTV) — URL Validation, Splitting & Sanitization Engine
 */

const Validators = {
  // Extract and sanitize links from text (newline or comma-separated)
  parseInputText(text) {
    if (!text || typeof text !== 'string') return [];
    
    // Split by newlines, commas, or semicolons
    const rawTokens = text.split(/[\r\n,;]+/);
    const cleaned = [];
    const seen = new Set();

    for (let token of rawTokens) {
      let trimmed = token.trim();
      if (!trimmed) continue;

      // Ensure protocol is present if missing
      if (!/^https?:\/\//i.test(trimmed)) {
        if (/^(www\.|youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com|twitch\.tv|kick\.com|facebook\.com|instagram\.com|tiktok\.com|twitter\.com|x\.com|linkedin\.com|reddit\.com|pinterest\.com|bilibili\.com|rumble\.com|odysee\.com|soundcloud\.com|spotify\.com|open\.spotify\.com|snapchat\.com|threads\.net|t\.me)/i.test(trimmed)) {
          trimmed = 'https://' + trimmed;
        }
      }

      // Validate basic URL structure
      if (this.isValidUrl(trimmed)) {
        if (!seen.has(trimmed)) {
          seen.add(trimmed);
          cleaned.push(trimmed);
        }
      }
    }

    return cleaned;
  },

  isValidUrl(urlString) {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  },

  // Platform specific URL detectors & ID extractors
  youtube: {
    match(urlStr) {
      return /(?:youtube\.com|youtu\.be)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        let id = null;
        let playlistId = null;
        let type = 'video';

        // Check for playlist parameter in query
        if (url.searchParams.has('list')) {
          playlistId = url.searchParams.get('list');
        }

        if (url.hostname.includes('youtu.be')) {
          id = url.pathname.slice(1).split(/[?#]/)[0];
        } else if (url.pathname.includes('/watch')) {
          id = url.searchParams.get('v');
        } else if (url.pathname.includes('/shorts/')) {
          id = url.pathname.split('/shorts/')[1].split(/[?#]/)[0];
          type = 'short';
        } else if (url.pathname.includes('/live/')) {
          id = url.pathname.split('/live/')[1].split(/[?#]/)[0];
          type = 'live';
        } else if (url.pathname.includes('/embed/')) {
          id = url.pathname.split('/embed/')[1].split(/[?#]/)[0];
        } else if (url.pathname.includes('/playlist') && playlistId) {
          return { playlistId, type: 'playlist', valid: true };
        }

        // Validate 11-character YouTube video ID
        if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
          return { id, playlistId, type, valid: true };
        }

        if (playlistId && /^[a-zA-Z0-9_-]{10,}$/.test(playlistId)) {
          return { playlistId, type: 'playlist', valid: true };
        }

        return { valid: false, error: 'Could not extract a valid YouTube video ID (11 characters) or playlist ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid YouTube URL format' };
      }
    }
  },

  vimeo: {
    match(urlStr) {
      return /vimeo\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/(\d+)/);
        if (match && match[1]) {
          return { id: match[1], type: 'video', valid: true };
        }
        return { valid: false, error: 'Could not extract Vimeo numeric video ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Vimeo URL format' };
      }
    }
  },

  dailymotion: {
    match(urlStr) {
      return /(?:dailymotion\.com|dai\.ly)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        let id = null;
        if (url.hostname.includes('dai.ly')) {
          id = url.pathname.slice(1).split(/[?#]/)[0];
        } else {
          const match = url.pathname.match(/\/video\/([a-zA-Z0-9]+)/);
          if (match) id = match[1];
        }
        if (id) return { id, type: 'video', valid: true };
        return { valid: false, error: 'Could not extract Dailymotion video ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Dailymotion URL format' };
      }
    }
  },

  twitch: {
    match(urlStr) {
      return /twitch\.tv/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        // Clips: clips.twitch.tv/ClipID or /channel/clip/ClipID
        if (url.hostname.includes('clips.twitch.tv')) {
          const clipId = url.pathname.slice(1).split(/[?#]/)[0];
          if (clipId) return { id: clipId, type: 'clip', valid: true };
        }
        if (url.pathname.includes('/clip/')) {
          const clipId = url.pathname.split('/clip/')[1].split(/[?#]/)[0];
          if (clipId) return { id: clipId, type: 'clip', valid: true };
        }
        // VOD / Videos: /videos/123456789
        const vodMatch = url.pathname.match(/\/videos\/(\d+)/);
        if (vodMatch) {
          return { id: vodMatch[1], type: 'video', valid: true };
        }
        // Live Channel: /channelname
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length >= 1 && !['directory', 'p', 'downloads', 'jobs'].includes(parts[0].toLowerCase())) {
          return { id: parts[0], type: 'channel', valid: true };
        }
        return { valid: false, error: 'Could not recognize Twitch channel, video, or clip' };
      } catch (e) {
        return { valid: false, error: 'Invalid Twitch URL format' };
      }
    }
  },

  kick: {
    match(urlStr) {
      return /kick\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length >= 1) {
          return { id: parts[0], type: 'channel', valid: true };
        }
        return { valid: false, error: 'Could not recognize Kick channel name' };
      } catch (e) {
        return { valid: false, error: 'Invalid Kick URL format' };
      }
    }
  },

  facebook: {
    match(urlStr) {
      return /(?:facebook\.com|fb\.watch|fb\.me)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const path = url.pathname.toLowerCase();
        
        // Distinguish Facebook Share URLs (/share/v/, /share/p/, /share/r/, fb.me)
        const isShare = path.includes('/share/') || url.hostname.includes('fb.me');
        if (isShare) {
          return {
            id: urlStr,
            type: 'share',
            isShareUrl: true,
            valid: true,
            embedSupported: false,
            reason: 'Facebook share URLs (facebook.com/share/...) cannot be directly embedded by the official Facebook player plugin. Open the link on Facebook or provide a direct video permalink.'
          };
        }

        // Direct public video URL
        const isVideo = path.includes('/videos/') || path.includes('/watch') || url.hostname.includes('fb.watch') || path.includes('/reel/');
        return {
          id: urlStr,
          type: isVideo ? 'video' : 'post',
          isShareUrl: false,
          valid: true,
          embedSupported: true
        };
      } catch (e) {
        return { valid: false, error: 'Invalid Facebook URL format' };
      }
    }
  },

  instagram: {
    match(urlStr) {
      return /instagram\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          return { id: match[1], type: 'reel', valid: true, embedSupported: false };
        }
        return { id: urlStr, type: 'profile', valid: true, embedSupported: false };
      } catch (e) {
        return { valid: false, error: 'Invalid Instagram URL' };
      }
    }
  },

  tiktok: {
    match(urlStr) {
      return /tiktok\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/video\/(\d+)/);
        if (match && match[1]) {
          return { id: match[1], type: 'video', valid: true, embedSupported: false };
        }
        return { id: urlStr, type: 'post', valid: true, embedSupported: false };
      } catch (e) {
        return { valid: false, error: 'Invalid TikTok URL' };
      }
    }
  },

  bilibili: {
    match(urlStr) {
      return /bilibili\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/video\/(BV[a-zA-Z0-9]+)/i);
        if (match && match[1]) {
          return { id: match[1], type: 'video', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Bilibili BV ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Bilibili URL format' };
      }
    }
  },

  rumble: {
    match(urlStr) {
      return /rumble\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        if (url.pathname.includes('/embed/')) {
          const embedId = url.pathname.split('/embed/')[1].split('/')[0];
          if (embedId) return { id: embedId, type: 'embed', valid: true, embedSupported: true };
        }
        const match = url.pathname.match(/\/([a-zA-Z0-9]+)-[a-zA-Z0-9_-]+\.html/);
        if (match && match[1]) {
          return { id: match[1], type: 'video', valid: true, embedSupported: true };
        }
        return { id: urlStr, type: 'video', valid: true, embedSupported: false };
      } catch (e) {
        return { valid: false, error: 'Invalid Rumble URL' };
      }
    }
  },

  odysee: {
    match(urlStr) {
      return /odysee\.com/i.test(urlStr);
    },
    extract(urlStr) {
      return { id: urlStr, type: 'video', valid: true, embedSupported: false };
    }
  },

  spotify: {
    match(urlStr) {
      return /spotify\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
        if (match) {
          return { type: match[1], id: match[2], valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not recognize Spotify track, album, playlist, or episode link' };
      } catch (e) {
        return { valid: false, error: 'Invalid Spotify link' };
      }
    }
  },

  soundcloud: {
    match(urlStr) {
      return /soundcloud\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        if (url.pathname.length > 1) {
          return { id: urlStr, type: 'audio', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Please enter a specific SoundCloud track or playlist URL' };
      } catch (e) {
        return { valid: false, error: 'Invalid SoundCloud URL' };
      }
    }
  },

  x: {
    match(urlStr) {
      return /(?:twitter\.com|x\.com)/i.test(urlStr);
    },
    extract(urlStr) {
      return { id: urlStr, type: 'post', valid: true, embedSupported: false };
    }
  },

  linkedin: {
    match(urlStr) {
      return /linkedin\.com/i.test(urlStr);
    },
    extract(urlStr) {
      return { id: urlStr, type: 'post', valid: true, embedSupported: false };
    }
  },

  reddit: {
    match(urlStr) {
      return /reddit\.com/i.test(urlStr);
    },
    extract(urlStr) {
      return { id: urlStr, type: 'post', valid: true, embedSupported: false };
    }
  },

  pinterest: {
    match(urlStr) {
      return /(?:pinterest\.com|pin\.it)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/pin\/(\d+)/);
        if (match) return { id: match[1], type: 'pin', valid: true, embedSupported: false };
        return { id: urlStr, type: 'pin', valid: true, embedSupported: false };
      } catch (e) {
        return { valid: false, error: 'Invalid Pinterest URL' };
      }
    }
  },

  snapchat: {
    match(urlStr) {
      return /snapchat\.com/i.test(urlStr);
    },
    extract(urlStr) {
      return { id: urlStr, type: 'story', valid: true, embedSupported: false };
    }
  },

  threads: {
    match(urlStr) {
      return /threads\.net/i.test(urlStr);
    },
    extract(urlStr) {
      return { id: urlStr, type: 'post', valid: true, embedSupported: false };
    }
  },

  telegram: {
    match(urlStr) {
      return /t\.me/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) {
          return { channel: parts[0], post: parts[1], id: `${parts[0]}/${parts[1]}`, type: 'message', valid: true, embedSupported: true };
        }
        return { id: urlStr, type: 'channel', valid: true, embedSupported: false };
      } catch (e) {
        return { valid: false, error: 'Invalid Telegram link' };
      }
    }
  }
};

window.Validators = Validators;

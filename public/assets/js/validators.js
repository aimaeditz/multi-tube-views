/**
 * Multi Tube Views (MTV) — URL Validation, Splitting & Sanitization Engine
 */

const Validators = {
  // Extract and sanitize links from text (newline, comma, or semicolon-separated)
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
        if (/^(www\.|youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com|dai\.ly|twitch\.tv|kick\.com|facebook\.com|fb\.watch|fb\.me|instagram\.com|instagr\.am|tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com|twitter\.com|x\.com|linkedin\.com|reddit\.com|redd\.it|pinterest\.com|pin\.it|bilibili\.com|b23\.tv|rumble\.com|odysee\.com|soundcloud\.com|spotify\.com|open\.spotify\.com|snapchat\.com|threads\.net|t\.me|telegram\.me|streamable\.com|peertube|framatube\.org|loom\.com|vevo\.com|myjosh\.in|mojapp\.in|chingari\.io|douyin\.com|kuaishou\.com|triller\.co|trovo\.live|dlive\.tv|caffeine\.tv|nimo\.tv|podcasts\.apple\.com|music\.youtube\.com|anchor\.fm|tumblr\.com|mastodon\.social|newgrounds\.com)/i.test(trimmed)) {
          trimmed = 'https://' + trimmed;
        }
      }

      // Validate basic URL structure
      if (this.isValidUrl(trimmed)) {
        if (!seen.has(trimmed)) {
          seen.add(trimmed);
          cleaned.push(trimmed);
          if (cleaned.length >= 50) break;
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

  // Auto-detect platform from any valid URL string
  detectPlatform(urlStr) {
    if (!urlStr || typeof urlStr !== 'string') return null;
    const trimmed = urlStr.trim();

    // Priority ordering to avoid collisions
    const platformOrder = [
      'youtubemusic', 'youtube', 'vimeo', 'dailymotion', 'twitch', 'kick',
      'spotify', 'soundcloud', 'bilibili', 'facebook',
      'instagram', 'tiktok', 'threads', 'x', 'linkedin',
      'reddit', 'pinterest', 'rumble', 'odysee', 'snapchat', 'telegram',
      'streamable', 'peertube', 'loom', 'vevo', 'josh', 'moj', 'chingari',
      'douyin', 'kuaishou', 'triller', 'trovo', 'dlive', 'caffeine', 'nimotv',
      'applepodcasts', 'anchor', 'tumblr', 'mastodon', 'newgrounds'
    ];

    for (const key of platformOrder) {
      const validator = this[key];
      if (validator && typeof validator.match === 'function') {
        if (validator.match(trimmed)) {
          return key;
        }
      }
    }
    return null;
  },

  // 1. YouTube
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
        } else if (url.pathname.includes('/clip/')) {
          id = url.pathname.split('/clip/')[1].split(/[?#]/)[0];
          type = 'clip';
        } else if (url.pathname.includes('/embed/')) {
          id = url.pathname.split('/embed/')[1].split(/[?#]/)[0];
        } else if (url.pathname.includes('/playlist') && playlistId) {
          return { playlistId, type: 'playlist', valid: true, embedSupported: true };
        }

        // Validate 11-character YouTube video ID
        if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
          return { id, playlistId, type, valid: true, embedSupported: true };
        }

        if (playlistId && /^[a-zA-Z0-9_-]{10,}$/.test(playlistId)) {
          return { playlistId, type: 'playlist', valid: true, embedSupported: true };
        }

        return { valid: false, error: 'Could not extract a valid YouTube video ID (11 characters) or playlist ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid YouTube URL format' };
      }
    }
  },

  // 2. Facebook
  facebook: {
    match(urlStr) {
      return /(?:facebook\.com|fb\.watch|fb\.me|fb\.com)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const path = url.pathname.toLowerCase();
        
        let type = 'video';
        if (path.includes('/reel/') || path.includes('/reels/')) {
          type = 'reel';
        } else if (path.includes('/posts/') || path.includes('/photos/') || path.includes('/photo')) {
          type = 'post';
        }

        return {
          id: urlStr,
          type: type,
          valid: true,
          embedSupported: true
        };
      } catch (e) {
        return { valid: false, error: 'Invalid Facebook URL format' };
      }
    }
  },

  // 3. Instagram
  instagram: {
    match(urlStr) {
      return /(?:instagram\.com|instagr\.am)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/(reel|reels|p|tv)\/([a-zA-Z0-9_-]+)/i);
        if (match && match[2]) {
          const rawType = match[1].toLowerCase();
          const type = rawType.startsWith('reel') ? 'reel' : (rawType === 'tv' ? 'tv' : 'post');
          return { id: match[2], type, valid: true, embedSupported: true };
        }
        
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length >= 1 && !['explore', 'direct', 'accounts', 'stories'].includes(parts[0].toLowerCase())) {
          return {
            id: parts[0],
            type: 'profile',
            valid: true,
            embedSupported: false,
            reason: 'Official platform viewing is required for this content.'
          };
        }

        return { valid: false, error: 'Could not extract valid Instagram post or reel ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Instagram URL format' };
      }
    }
  },

  // 4. TikTok
  tiktok: {
    match(urlStr) {
      return /(?:tiktok\.com)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/(?:video\/|v\/|embed\/v2\/|embed\/)(\d+)/i);
        if (match && match[1]) {
          return { id: match[1], type: 'video', valid: true, embedSupported: true };
        }

        const parts = url.pathname.split('/').filter(Boolean);
        if (url.hostname.startsWith('vm.') || url.hostname.startsWith('vt.')) {
          if (parts.length > 0) {
            return { id: parts[0], type: 'video', isShortLink: true, valid: true, embedSupported: true };
          }
        }

        if (parts.length >= 1 && parts[0].startsWith('@')) {
          return {
            id: parts[0],
            type: 'profile',
            valid: true,
            embedSupported: false,
            reason: 'Official platform viewing is required for this content.'
          };
        }

        return { valid: false, error: 'Could not extract TikTok video ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid TikTok URL format' };
      }
    }
  },

  // 5. Threads
  threads: {
    match(urlStr) {
      return /threads\.net/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/(?:@([\w.-]+)\/post|t)\/([a-zA-Z0-9_-]+)/i);
        if (match) {
          const user = match[1] || '';
          const postId = match[2];
          return { user, postId, id: postId, type: 'post', valid: true, embedSupported: true };
        }
        return { id: urlStr, type: 'profile', valid: true, embedSupported: false, reason: 'Official platform viewing is required for this content.' };
      } catch (e) {
        return { valid: false, error: 'Invalid Threads URL format' };
      }
    }
  },

  // 6. Vimeo
  vimeo: {
    match(urlStr) {
      return /vimeo\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/(?:videos\/|video\/|channels\/[^\/]+\/|groups\/[^\/]+\/videos\/|event\/|^[\/])(\d+)/i);
        if (match && match[1]) {
          return { id: match[1], type: 'video', valid: true, embedSupported: true };
        }
        const numericMatch = url.pathname.match(/(\d{6,12})/);
        if (numericMatch && numericMatch[1]) {
          return { id: numericMatch[1], type: 'video', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Vimeo numeric video ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Vimeo URL format' };
      }
    }
  },

  // 7. Dailymotion
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
          const match = url.pathname.match(/(?:\/video\/|\/embed\/video\/)([a-zA-Z0-9]+)/i);
          if (match) id = match[1];
        }
        if (id) return { id, type: 'video', valid: true, embedSupported: true };
        return { valid: false, error: 'Could not extract Dailymotion video ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Dailymotion URL format' };
      }
    }
  },

  // 8. Twitch
  twitch: {
    match(urlStr) {
      return /twitch\.tv/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        if (url.hostname.includes('clips.twitch.tv')) {
          const clipId = url.pathname.slice(1).split(/[?#]/)[0];
          if (clipId) return { id: clipId, type: 'clip', valid: true, embedSupported: true };
        }
        if (url.pathname.includes('/clip/')) {
          const clipId = url.pathname.split('/clip/')[1].split(/[?#]/)[0];
          if (clipId) return { id: clipId, type: 'clip', valid: true, embedSupported: true };
        }
        const vodMatch = url.pathname.match(/\/videos\/(\d+)/i);
        if (vodMatch) {
          return { id: vodMatch[1], type: 'video', valid: true, embedSupported: true };
        }
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length >= 1 && !['directory', 'p', 'downloads', 'jobs', 'settings', 'subscriptions'].includes(parts[0].toLowerCase())) {
          return { id: parts[0], type: 'channel', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not recognize Twitch channel, video, or clip' };
      } catch (e) {
        return { valid: false, error: 'Invalid Twitch URL format' };
      }
    }
  },

  // 9. Kick
  kick: {
    match(urlStr) {
      return /kick\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const videoMatch = url.pathname.match(/\/video\/([a-zA-Z0-9_-]+)/i);
        if (videoMatch) {
          return { id: videoMatch[1], type: 'video', valid: true, embedSupported: true };
        }
        const clipMatch = url.pathname.match(/\/clip\/([a-zA-Z0-9_-]+)/i);
        if (clipMatch) {
          return { id: clipMatch[1], type: 'clip', valid: true, embedSupported: true };
        }
        if (url.searchParams.has('clip')) {
          return { id: url.searchParams.get('clip'), type: 'clip', valid: true, embedSupported: true };
        }
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length >= 1 && !['categories', 'following', 'auth'].includes(parts[0].toLowerCase())) {
          return { id: parts[0], type: 'channel', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not recognize Kick channel name or stream ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Kick URL format' };
      }
    }
  },

  // 10. Spotify
  spotify: {
    match(urlStr) {
      return /spotify\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/(track|album|playlist|episode|show|artist)\/([a-zA-Z0-9]+)/i);
        if (match) {
          return { type: match[1].toLowerCase(), id: match[2], valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not recognize Spotify track, album, playlist, episode, or show link' };
      } catch (e) {
        return { valid: false, error: 'Invalid Spotify link' };
      }
    }
  },

  // 11. SoundCloud
  soundcloud: {
    match(urlStr) {
      return /soundcloud\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        if (url.pathname.length > 1) {
          const isPlaylist = url.pathname.includes('/sets/');
          return { id: urlStr, type: isPlaylist ? 'playlist' : 'track', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Please enter a specific SoundCloud track or playlist URL' };
      } catch (e) {
        return { valid: false, error: 'Invalid SoundCloud URL' };
      }
    }
  },

  // 12. Bilibili
  bilibili: {
    match(urlStr) {
      return /(?:bilibili\.com|b23\.tv)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const bvMatch = url.pathname.match(/(BV[a-zA-Z0-9]+)/i);
        if (bvMatch) {
          return { id: bvMatch[1], type: 'video', isBvid: true, valid: true, embedSupported: true };
        }
        const avMatch = url.pathname.match(/(?:av|aid=?)(\d+)/i);
        if (avMatch) {
          return { id: avMatch[1], type: 'video', isAid: true, valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Bilibili BV or AV video ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Bilibili URL format' };
      }
    }
  },

  // 13. Telegram
  telegram: {
    match(urlStr) {
      return /(?:t\.me|telegram\.me)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const parts = url.pathname.split('/').filter(Boolean).filter(p => !['s', 'c', 'v'].includes(p.toLowerCase()));
        if (parts.length >= 2 && /^\d+$/.test(parts[1])) {
          return { channel: parts[0], post: parts[1], id: `${parts[0]}/${parts[1]}`, type: 'message', valid: true, embedSupported: true };
        }
        if (parts.length >= 1) {
          return { channel: parts[0], id: parts[0], type: 'channel', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Please enter a valid Telegram channel post link (e.g. t.me/channel/123)' };
      } catch (e) {
        return { valid: false, error: 'Invalid Telegram link' };
      }
    }
  },

  // 14. X / Twitter
  x: {
    match(urlStr) {
      return /(?:twitter\.com|x\.com)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/(?:status|statuses)\/(\d+)/i);
        if (match && match[1]) {
          const parts = url.pathname.split('/').filter(Boolean);
          const user = parts[0] !== 'i' ? parts[0] : '';
          return { id: match[1], user, type: 'post', valid: true, embedSupported: true };
        }
        return { id: urlStr, type: 'profile', valid: true, embedSupported: false, reason: 'Official platform viewing is required for this content.' };
      } catch (e) {
        return { valid: false, error: 'Invalid X/Twitter link' };
      }
    }
  },

  // 15. LinkedIn
  linkedin: {
    match(urlStr) {
      return /linkedin\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const urnMatch = url.pathname.match(/urn:li:(?:activity|ugcPost|share):(\d+)/i) || url.pathname.match(/activity-?(\d+)/i);
        if (urnMatch && urnMatch[1]) {
          return { id: urnMatch[1], urn: `urn:li:activity:${urnMatch[1]}`, type: 'post', valid: true, embedSupported: true };
        }
        if (url.pathname.includes('/embed/')) {
          return { id: urlStr, urn: urlStr, type: 'post', valid: true, embedSupported: true };
        }
        return { id: urlStr, type: 'post', valid: true, embedSupported: true };
      } catch (e) {
        return { valid: false, error: 'Invalid LinkedIn link' };
      }
    }
  },

  // 16. Reddit
  reddit: {
    match(urlStr) {
      return /(?:reddit\.com|redd\.it)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        if (url.hostname.includes('redd.it')) {
          const id = url.pathname.slice(1).split(/[?#]/)[0];
          if (id) return { id, type: 'post', valid: true, embedSupported: true };
        }
        const match = url.pathname.match(/\/r\/([^\/]+)\/comments\/([a-zA-Z0-9]+)(?:\/([^\/]+))?/i);
        if (match) {
          return {
            subreddit: match[1],
            id: match[2],
            slug: match[3] || '',
            type: 'post',
            valid: true,
            embedSupported: true
          };
        }
        const commentsMatch = url.pathname.match(/\/comments\/([a-zA-Z0-9]+)/i);
        if (commentsMatch) {
          return { id: commentsMatch[1], type: 'post', valid: true, embedSupported: true };
        }
        return { id: urlStr, type: 'subreddit', valid: true, embedSupported: false, reason: 'Official platform viewing is required for this content.' };
      } catch (e) {
        return { valid: false, error: 'Invalid Reddit URL' };
      }
    }
  },

  // 17. Pinterest
  pinterest: {
    match(urlStr) {
      return /(?:pinterest\.com|pin\.it)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        if (url.hostname.includes('pin.it')) {
          const id = url.pathname.slice(1).split(/[?#]/)[0];
          if (id) return { id, type: 'pin', isShortLink: true, valid: true, embedSupported: true };
        }
        const match = url.pathname.match(/\/pin\/(\d+)/i);
        if (match && match[1]) {
          return { id: match[1], type: 'pin', valid: true, embedSupported: true };
        }
        return { id: urlStr, type: 'board', valid: true, embedSupported: false, reason: 'Official platform viewing is required for this content.' };
      } catch (e) {
        return { valid: false, error: 'Invalid Pinterest URL' };
      }
    }
  },

  // 18. Rumble
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
        const match = url.pathname.match(/\/([a-zA-Z0-9]+)(?:-[a-zA-Z0-9_-]+)?(?:\.html)?$/i);
        if (match && match[1]) {
          return { id: match[1], type: 'video', valid: true, embedSupported: true };
        }
        return { id: urlStr, type: 'channel', valid: true, embedSupported: false, reason: 'Official platform viewing is required for this content.' };
      } catch (e) {
        return { valid: false, error: 'Invalid Rumble URL' };
      }
    }
  },

  // 19. Odysee
  odysee: {
    match(urlStr) {
      return /(?:odysee\.com|lbry\.tv)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        let path = url.pathname;
        if (path.startsWith('/$/embed/')) {
          path = path.replace('/$/embed/', '');
        }
        if (path.startsWith('/')) path = path.slice(1);
        
        if (path) {
          return { id: path, path: path, type: 'video', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Odysee content claim path' };
      } catch (e) {
        return { valid: false, error: 'Invalid Odysee URL' };
      }
    }
  },

  // 20. Snapchat
  snapchat: {
    match(urlStr) {
      return /snapchat\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/spotlight\/([a-zA-Z0-9_-]+)/i);
        if (match && match[1]) {
          return { id: match[1], type: 'spotlight', valid: true, embedSupported: true };
        }
        return { id: urlStr, type: 'story', valid: true, embedSupported: false, reason: 'Official platform viewing is required for this content.' };
      } catch (e) {
        return { valid: false, error: 'Invalid Snapchat URL' };
      }
    }
  },

  // 21. Streamable
  streamable: {
    match(urlStr) {
      return /streamable\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/(?:e\/|s\/)?([a-zA-Z0-9]+)/i);
        if (match && match[1]) {
          return { id: match[1], type: 'video', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Streamable clip ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Streamable URL' };
      }
    }
  },

  // 22. PeerTube
  peertube: {
    match(urlStr) {
      return /(?:peertube|framatube\.org|tube\.|video\.|peer\.)/i.test(urlStr) || /\/w\/[a-zA-Z0-9_-]+/i.test(urlStr) || /\/videos\/(?:watch|embed)\//i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const host = url.hostname;
        const matchW = url.pathname.match(/\/w\/([a-zA-Z0-9_-]+)/i);
        if (matchW && matchW[1]) {
          return { id: matchW[1], host, type: 'video', valid: true, embedSupported: true };
        }
        const matchWatch = url.pathname.match(/\/videos\/(?:watch|embed)\/([a-zA-Z0-9_-]+)/i);
        if (matchWatch && matchWatch[1]) {
          return { id: matchWatch[1], host, type: 'video', valid: true, embedSupported: true };
        }
        return { id: urlStr, host, type: 'channel', valid: true, embedSupported: false, reason: 'Official platform viewing is required for this PeerTube channel.' };
      } catch (e) {
        return { valid: false, error: 'Invalid PeerTube URL' };
      }
    }
  },

  // 23. Loom
  loom: {
    match(urlStr) {
      return /loom\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/(?:share|embed)\/([a-f0-9]{32}|[a-zA-Z0-9_-]+)/i);
        if (match && match[1]) {
          return { id: match[1], type: 'video', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Loom video ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Loom URL' };
      }
    }
  },

  // 24. Vevo
  vevo: {
    match(urlStr) {
      return /vevo\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/watch\/(?:[a-zA-Z0-9_-]+\/)?([a-zA-Z0-9_-]+)/i);
        if (match && match[1]) {
          return { id: match[1], type: 'video', valid: true, embedSupported: true };
        }
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length > 0) {
          return { id: parts[parts.length - 1], type: 'video', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Vevo video ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Vevo URL' };
      }
    }
  },

  // 25. Josh
  josh: {
    match(urlStr) {
      return /(?:myjosh\.in|share\.myjosh\.in)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/(?:video|content)\/([a-zA-Z0-9_-]+)/i);
        if (match && match[1]) {
          return { id: match[1], type: 'video', valid: true, embedSupported: true };
        }
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length > 0) {
          return { id: parts[parts.length - 1], type: 'video', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Josh video ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Josh URL' };
      }
    }
  },

  // 26. Moj
  moj: {
    match(urlStr) {
      return /(?:mojapp\.in|share\.mojapp\.in)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/(?:\/@[\w.-]+\/video\/|\/video\/|\/embed\/)?([a-zA-Z0-9_-]+)/i);
        const parts = url.pathname.split('/').filter(Boolean);
        const id = (parts.length > 0) ? parts[parts.length - 1] : '';
        if (id) {
          return { id, type: 'video', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Moj video ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Moj URL' };
      }
    }
  },

  // 27. Chingari
  chingari: {
    match(urlStr) {
      return /(?:chingari\.io|share\.chingari\.io)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/(?:post|video|share)\/([a-zA-Z0-9_-]+)/i);
        if (match && match[1]) {
          return { id: match[1], type: 'video', valid: true, embedSupported: true };
        }
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length > 0) {
          return { id: parts[parts.length - 1], type: 'video', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Chingari post ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Chingari URL' };
      }
    }
  },

  // 28. Douyin
  douyin: {
    match(urlStr) {
      return /(?:douyin\.com|iesdouyin\.com)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/(?:video|note)\/(\d+)/i) || url.search.match(/modal_id=(\d+)/i);
        if (match && match[1]) {
          return { id: match[1], type: 'video', valid: true, embedSupported: true };
        }
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length > 0) {
          return { id: parts[parts.length - 1], type: 'video', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Douyin video ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Douyin URL' };
      }
    }
  },

  // 29. Kuaishou
  kuaishou: {
    match(urlStr) {
      return /(?:kuaishou\.com|kwai\.com|kwai-video\.com)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/(?:short-video|photo|p|video)\/([a-zA-Z0-9_-]+)/i);
        if (match && match[1]) {
          return { id: match[1], type: 'video', valid: true, embedSupported: true };
        }
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length > 0) {
          return { id: parts[parts.length - 1], type: 'video', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Kuaishou video ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Kuaishou URL' };
      }
    }
  },

  // 30. Triller
  triller: {
    match(urlStr) {
      return /triller\.co/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/(?:\/@[\w.-]+\/video\/|\/v\/)([a-zA-Z0-9_-]+)/i);
        if (match && match[1]) {
          return { id: match[1], type: 'video', valid: true, embedSupported: true };
        }
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length > 0) {
          return { id: parts[parts.length - 1], type: 'video', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Triller video ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Triller URL' };
      }
    }
  },

  // 31. Trovo
  trovo: {
    match(urlStr) {
      return /trovo\.live/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const matchClip = url.pathname.match(/\/clip\/([a-zA-Z0-9_-]+)/i);
        if (matchClip && matchClip[1]) {
          return { id: matchClip[1], type: 'clip', valid: true, embedSupported: true };
        }
        const matchLive = url.pathname.match(/\/(?:s\/)?([a-zA-Z0-9_]+)/i);
        if (matchLive && matchLive[1]) {
          return { id: matchLive[1], channel: matchLive[1], type: 'channel', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Trovo channel or clip' };
      } catch (e) {
        return { valid: false, error: 'Invalid Trovo URL' };
      }
    }
  },

  // 32. DLive
  dlive: {
    match(urlStr) {
      return /dlive\.tv/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/(?:p\/|c\/)?([a-zA-Z0-9_-]+)/i);
        if (match && match[1]) {
          return { id: match[1], channel: match[1], type: 'channel', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract DLive channel' };
      } catch (e) {
        return { valid: false, error: 'Invalid DLive URL' };
      }
    }
  },

  // 33. Caffeine.tv
  caffeine: {
    match(urlStr) {
      return /caffeine\.tv/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/([a-zA-Z0-9_.-]+)/i);
        if (match && match[1]) {
          return { id: match[1], channel: match[1], type: 'channel', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Caffeine.tv channel' };
      } catch (e) {
        return { valid: false, error: 'Invalid Caffeine.tv URL' };
      }
    }
  },

  // 34. Nimo TV
  nimotv: {
    match(urlStr) {
      return /nimo\.tv/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/(?:v\/|live\/)?([a-zA-Z0-9_.-]+)/i);
        if (match && match[1]) {
          return { id: match[1], channel: match[1], type: 'channel', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Nimo TV channel or video' };
      } catch (e) {
        return { valid: false, error: 'Invalid Nimo TV URL' };
      }
    }
  },

  // 35. Apple Podcasts
  applepodcasts: {
    match(urlStr) {
      return /podcasts\.apple\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const matchPodcast = url.pathname.match(/id(\d+)/i);
        const podcastId = matchPodcast ? matchPodcast[1] : '';
        const episodeId = url.searchParams.get('i') || '';
        if (podcastId || episodeId) {
          const path = url.pathname.replace(/^\//, '');
          return { id: episodeId || podcastId, path, podcastId, episodeId, type: 'podcast', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Apple Podcasts show or episode ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Apple Podcasts URL' };
      }
    }
  },

  // 36. YouTube Music
  youtubemusic: {
    match(urlStr) {
      return /music\.youtube\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const videoId = url.searchParams.get('v');
        const listId = url.searchParams.get('list');
        if (videoId) {
          return { id: videoId, listId, type: 'track', valid: true, embedSupported: true };
        }
        if (listId) {
          return { id: listId, listId, type: 'playlist', valid: true, embedSupported: true };
        }
        const match = url.pathname.match(/\/(?:watch|playlist)\/([a-zA-Z0-9_-]+)/i);
        if (match && match[1]) {
          return { id: match[1], type: 'track', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract YouTube Music track or playlist ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid YouTube Music URL' };
      }
    }
  },

  // 37. Anchor (Spotify for Podcasters)
  anchor: {
    match(urlStr) {
      return /(?:anchor\.fm|podcasters\.spotify\.com)/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/(?:episodes\/|embed\/episodes\/)?([a-zA-Z0-9_-]+)/i);
        const parts = url.pathname.split('/').filter(Boolean);
        if (match && parts.length >= 2 && parts[parts.length - 2] === 'episodes') {
          const station = parts[0];
          const episode = parts[parts.length - 1];
          return { id: `${station}/embed/episodes/${episode}`, station, episode, type: 'episode', valid: true, embedSupported: true };
        }
        if (parts.length > 0) {
          return { id: parts.join('/'), station: parts[0], type: 'station', valid: true, embedSupported: true };
        }
        return { valid: false, error: 'Could not extract Anchor episode ID' };
      } catch (e) {
        return { valid: false, error: 'Invalid Anchor URL' };
      }
    }
  },

  // 38. Tumblr
  tumblr: {
    match(urlStr) {
      return /tumblr\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const match = url.pathname.match(/\/post\/(\d+)(?:\/([a-zA-Z0-9_-]+))?/i);
        if (match && match[1]) {
          const postId = match[1];
          const blog = url.hostname.split('.')[0] !== 'www' && url.hostname.split('.')[0] !== 'tumblr' ? url.hostname.split('.')[0] : (url.pathname.split('/')[1] || '');
          return { id: postId, blog, type: 'post', valid: true, embedSupported: true };
        }
        return { id: urlStr, type: 'blog', valid: true, embedSupported: false, reason: 'Official platform viewing is required for this Tumblr blog.' };
      } catch (e) {
        return { valid: false, error: 'Invalid Tumblr URL' };
      }
    }
  },

  // 39. Mastodon
  mastodon: {
    match(urlStr) {
      return /(?:mastodon\.|mstdn\.|fosstodon\.org|infosec\.exchange|mas\.to)/i.test(urlStr) || /\/@[\w.-]+\/\d+/i.test(urlStr) || /\/users\/[\w.-]+\/statuses\/\d+/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const host = url.hostname;
        const matchStatus = url.pathname.match(/\/@([\w.-]+)\/(\d+)/i) || url.pathname.match(/\/users\/([\w.-]+)\/statuses\/(\d+)/i);
        if (matchStatus && matchStatus[2]) {
          return { id: matchStatus[2], user: matchStatus[1], host, type: 'post', valid: true, embedSupported: true };
        }
        return { id: urlStr, host, type: 'profile', valid: true, embedSupported: false, reason: 'Official platform viewing is required for this Mastodon profile.' };
      } catch (e) {
        return { valid: false, error: 'Invalid Mastodon URL' };
      }
    }
  },

  // 40. Newgrounds
  newgrounds: {
    match(urlStr) {
      return /newgrounds\.com/i.test(urlStr);
    },
    extract(urlStr) {
      try {
        const url = new URL(urlStr);
        const matchPortal = url.pathname.match(/\/portal\/view\/(\d+)/i);
        if (matchPortal && matchPortal[1]) {
          return { id: matchPortal[1], type: 'portal', valid: true, embedSupported: true };
        }
        const matchAudio = url.pathname.match(/\/audio\/listen\/(\d+)/i);
        if (matchAudio && matchAudio[1]) {
          return { id: matchAudio[1], type: 'audio', valid: true, embedSupported: true };
        }
        return { id: urlStr, type: 'channel', valid: true, embedSupported: false, reason: 'Official platform viewing is required for this Newgrounds page.' };
      } catch (e) {
        return { valid: false, error: 'Invalid Newgrounds URL' };
      }
    }
  }
};

window.Validators = Validators;

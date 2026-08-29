/**
 * Multi Tube Views (MTV) — Central Platform Adapter Engine
 * Configures all 20 platform adapters, handles official embed URLs,
 * multi-player slots, Twitch parent domain generation, and restricted fallback logic.
 */

const PLATFORM_CONFIG = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    category: 'Video & Streaming',
    description: 'Public videos, YouTube Shorts, official live streams, and public clips.',
    icon: '▶',
    color: '#FF0000',
    embedSupported: true,
    supportedTypes: ['Standard Videos', 'Shorts', 'Public Live Streams', 'Playlists', 'Clips'],
    placeholderUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    officialDomain: 'youtube.com'
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook Video',
    category: 'Social Media',
    description: 'Public Facebook Watch videos, public reels, and open media posts.',
    icon: 'f',
    color: '#1877F2',
    embedSupported: true,
    supportedTypes: ['Public Watch Videos', 'Open Reels', 'Public Posts'],
    placeholderUrl: 'https://www.facebook.com/facebook/videos/10153231379946729/',
    officialDomain: 'facebook.com'
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social Media',
    description: 'Public reels, video posts, and photo carousels with official embed views.',
    icon: '📷',
    color: '#E4405F',
    embedSupported: true,
    supportedTypes: ['Public Reels', 'Public Posts', 'IGTV'],
    placeholderUrl: 'https://www.instagram.com/reel/C8qJ0S0P_12/',
    officialDomain: 'instagram.com'
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    category: 'Short-Form Video',
    description: 'Public short videos and viral creator clips with official embedded players.',
    icon: '🎵',
    color: '#000000',
    embedSupported: true,
    supportedTypes: ['Public Short Videos', 'Creator Clips', 'Viral Videos'],
    placeholderUrl: 'https://www.tiktok.com/@tiktok/video/7106594312292453678',
    officialDomain: 'tiktok.com'
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    category: 'Social Media',
    description: 'Public video clips and conversation updates from Threads.',
    icon: '🧵',
    color: '#000000',
    embedSupported: true,
    supportedTypes: ['Public Video Threads', 'Discourse', 'Posts'],
    placeholderUrl: 'https://www.threads.net/@zuck/post/CuW62wZLO6m',
    officialDomain: 'threads.net'
  },
  vimeo: {
    id: 'vimeo',
    name: 'Vimeo',
    category: 'Creative Video',
    description: 'High-definition showcase videos, public portfolio films, and animations.',
    icon: 'v',
    color: '#1AB7EA',
    embedSupported: true,
    supportedTypes: ['Public Showcase Videos', 'Documentaries', 'Films'],
    placeholderUrl: 'https://vimeo.com/76979871',
    officialDomain: 'vimeo.com'
  },
  dailymotion: {
    id: 'dailymotion',
    name: 'Dailymotion',
    category: 'Video Sharing',
    description: 'Public news broadcasts, media clips, and community video content.',
    icon: 'd',
    color: '#0066DC',
    embedSupported: true,
    supportedTypes: ['Public Video Streams', 'News Clips', 'Music Videos'],
    placeholderUrl: 'https://www.dailymotion.com/video/x7tgad0',
    officialDomain: 'dailymotion.com'
  },
  twitch: {
    id: 'twitch',
    name: 'Twitch',
    category: 'Live Broadcasts',
    description: 'Live interactive broadcasts, VOD archives, and community gaming clips.',
    icon: '👾',
    color: '#9146FF',
    embedSupported: true,
    supportedTypes: ['Live Channels', 'VOD Archives', 'Stream Clips'],
    placeholderUrl: 'https://www.twitch.tv/monstercat',
    officialDomain: 'twitch.tv'
  },
  kick: {
    id: 'kick',
    name: 'Kick',
    category: 'Live Broadcasts',
    description: 'Live streaming broadcasts and public creator stream channels.',
    icon: '⚡',
    color: '#53FC18',
    embedSupported: true,
    supportedTypes: ['Live Channels', 'Creator Broadcasts', 'Clips'],
    placeholderUrl: 'https://kick.com/xqc',
    officialDomain: 'kick.com'
  },
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    category: 'Audio & Podcasts',
    description: 'Public Spotify tracks, full albums, playlists, podcast episodes, and shows.',
    icon: '🎧',
    color: '#1DB954',
    embedSupported: true,
    supportedTypes: ['Tracks', 'Albums', 'Playlists', 'Podcast Episodes', 'Shows'],
    placeholderUrl: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
    officialDomain: 'spotify.com'
  },
  soundcloud: {
    id: 'soundcloud',
    name: 'SoundCloud',
    category: 'Audio & Music',
    description: 'Public electronic tracks, indie music, DJ sets, and podcast episodes.',
    icon: '☁',
    color: '#FF5500',
    embedSupported: true,
    supportedTypes: ['Public Audio Tracks', 'Playlists', 'Podcasts'],
    placeholderUrl: 'https://soundcloud.com/forss/flickermood',
    officialDomain: 'soundcloud.com'
  },
  bilibili: {
    id: 'bilibili',
    name: 'Bilibili',
    category: 'Animation & Media',
    description: 'Public anime, media creations, educational lectures, and creator streams.',
    icon: '📺',
    color: '#00A1D6',
    embedSupported: true,
    supportedTypes: ['Public BV Videos', 'AV Streams', 'Lectures'],
    placeholderUrl: 'https://www.bilibili.com/video/BV1xx411c7mD',
    officialDomain: 'bilibili.com'
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    category: 'Messaging & Channels',
    description: 'Public channel media broadcasts, video clips, and announcements.',
    icon: '✈',
    color: '#229ED9',
    embedSupported: true,
    supportedTypes: ['Public Channel Broadcasts', 'Open Media', 'Posts'],
    placeholderUrl: 'https://t.me/durov/123',
    officialDomain: 't.me'
  },
  x: {
    id: 'x',
    name: 'X (Twitter)',
    category: 'Social Media',
    description: 'Public posts containing video broadcasts, news clips, and discourse.',
    icon: '𝕏',
    color: '#000000',
    embedSupported: true,
    supportedTypes: ['Public Video Posts', 'Broadcast Clips', 'Media Posts'],
    placeholderUrl: 'https://x.com/NASA/status/1694038753272996163',
    officialDomain: 'x.com'
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'Professional Media',
    description: 'Public professional videos, keynote recordings, and company updates.',
    icon: 'in',
    color: '#0A66C2',
    embedSupported: true,
    supportedTypes: ['Public Keynotes', 'Company Media Posts', 'Articles'],
    placeholderUrl: 'https://www.linkedin.com/posts/linkedin_activity-7123456789012345678-abcd',
    officialDomain: 'linkedin.com'
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    category: 'Community Discussions',
    description: 'Public video posts, community discussions, and open media threads.',
    icon: '🤖',
    color: '#FF4500',
    embedSupported: true,
    supportedTypes: ['Public Media Posts', 'Discussions', 'Video Threads'],
    placeholderUrl: 'https://www.reddit.com/r/space/comments/123456/webb_telescope_deep_space/',
    officialDomain: 'reddit.com'
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    category: 'Visual Discovery',
    description: 'Public video pins, DIY tutorials, recipe clips, and visual design boards.',
    icon: '📌',
    color: '#BD081C',
    embedSupported: true,
    supportedTypes: ['Public Video Pins', 'Design Clips', 'Idea Pins'],
    placeholderUrl: 'https://www.pinterest.com/pin/123456789/',
    officialDomain: 'pinterest.com'
  },
  rumble: {
    id: 'rumble',
    name: 'Rumble',
    category: 'Video Sharing',
    description: 'Public independent video broadcasts, podcasts, and creator channels.',
    icon: '🟢',
    color: '#85c742',
    embedSupported: true,
    supportedTypes: ['Public Videos', 'Podcasts', 'Broadcasts'],
    placeholderUrl: 'https://rumble.com/v11111-example-video.html',
    officialDomain: 'rumble.com'
  },
  odysee: {
    id: 'odysee',
    name: 'Odysee',
    category: 'Decentralized Video',
    description: 'Public open-source media, technology discussions, and creator publications.',
    icon: '🚀',
    color: '#EF1955',
    embedSupported: true,
    supportedTypes: ['Public Publications', 'Open Media', 'Video Posts'],
    placeholderUrl: 'https://odysee.com/@lbry:3/what-is-lbry:4',
    officialDomain: 'odysee.com'
  },
  snapchat: {
    id: 'snapchat',
    name: 'Snapchat',
    category: 'Social Media',
    description: 'Public Spotlight videos and creator stories with direct launch gateway.',
    icon: '👻',
    color: '#FFFC00',
    embedSupported: true,
    supportedTypes: ['Public Spotlight Clips', 'Open Stories'],
    placeholderUrl: 'https://www.snapchat.com/spotlight/W7_EDlXWTBiXAEEniN9XAQAAmfnd66n2b4k1AAQ',
    officialDomain: 'snapchat.com'
  }
};

const PlatformEngine = {
  getConfig(platformId) {
    return PLATFORM_CONFIG[platformId] || null;
  },

  getAllPlatforms() {
    return Object.values(PLATFORM_CONFIG);
  },

  // Generates embed URL or returns official fallback if platform policy restricts iframe playback
  generateEmbed(platformId, urlStr, options = {}) {
    if (!urlStr || typeof urlStr !== 'string') {
      return {
        success: false,
        error: 'Please enter a valid supported link.',
        rawUrl: urlStr
      };
    }

    // Auto-detect platform from URL if needed
    let actualPlatform = platformId;
    if (!actualPlatform || actualPlatform === 'universal' || !PLATFORM_CONFIG[actualPlatform]) {
      if (window.Validators && typeof window.Validators.detectPlatform === 'function') {
        actualPlatform = window.Validators.detectPlatform(urlStr);
      }
    } else {
      // If user pasted a URL belonging to a different platform into a specialized page, auto-adapt!
      if (window.Validators && typeof window.Validators.detectPlatform === 'function') {
        const detected = window.Validators.detectPlatform(urlStr);
        if (detected && detected !== actualPlatform) {
          actualPlatform = detected;
        }
      }
    }

    if (!actualPlatform || !PLATFORM_CONFIG[actualPlatform]) {
      return {
        success: false,
        error: 'Please enter a valid supported link.',
        rawUrl: urlStr
      };
    }

    const config = PLATFORM_CONFIG[actualPlatform];
    const validator = window.Validators ? window.Validators[actualPlatform] : null;
    const extracted = validator ? validator.extract(urlStr) : { valid: true, id: urlStr, embedSupported: true };

    if (!extracted.valid) {
      return {
        success: false,
        error: extracted.error || `Please enter a valid supported link for ${config.name}.`,
        rawUrl: urlStr
      };
    }

    const isMuted = options.muted ?? true;
    const isLoop = options.loop === true || options.loop === 'on';
    const currentHost = (window.location && window.location.hostname) ? window.location.hostname : 'localhost';
    const currentTheme = window.ThemeEngine ? window.ThemeEngine.get() : 'light';

    switch (actualPlatform) {
      // 1. YouTube
      case 'youtube': {
        const muteParam = isMuted ? '&mute=1' : '';
        const loopParam = isLoop ? '&loop=1' : '';

        if (extracted.type === 'playlist' && extracted.playlistId) {
          return {
            success: true,
            embedType: 'iframe',
            src: `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(extracted.playlistId)}${muteParam}${loopParam}`,
            title: `YouTube Playlist (${extracted.playlistId})`,
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          };
        }

        const id = extracted.id;
        let playlistExtra = extracted.playlistId ? `&list=${encodeURIComponent(extracted.playlistId)}` : (isLoop ? `&playlist=${encodeURIComponent(id)}` : '');
        return {
          success: true,
          embedType: 'iframe',
          src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0${muteParam}${loopParam}${playlistExtra}`,
          title: `YouTube Player (${id})`,
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        };
      }

      // 2. Facebook
      case 'facebook': {
        const encoded = encodeURIComponent(urlStr);
        if (extracted.type === 'post') {
          return {
            success: true,
            embedType: 'iframe',
            src: `https://www.facebook.com/plugins/post.php?href=${encoded}&show_text=1&width=500`,
            title: 'Facebook Post',
            allow: 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
          };
        }
        return {
          success: true,
          embedType: 'iframe',
          src: `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=0&width=560`,
          title: 'Facebook Video Player',
          allow: 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
        };
      }

      // 3. Instagram
      case 'instagram': {
        if (!extracted.embedSupported || extracted.type === 'profile') {
          return {
            success: true,
            embedType: 'fallback',
            platformName: 'Instagram',
            rawUrl: urlStr,
            reason: extracted.reason || 'Official platform viewing is required for this content.'
          };
        }
        const id = extracted.id;
        const embedPath = extracted.type === 'reel' ? `reel/${id}` : (extracted.type === 'tv' ? `tv/${id}` : `p/${id}`);
        return {
          success: true,
          embedType: 'iframe',
          src: `https://www.instagram.com/${embedPath}/embed/`,
          title: `Instagram ${extracted.type === 'reel' ? 'Reel' : 'Post'} (${id})`,
          allow: 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
        };
      }

      // 4. TikTok
      case 'tiktok': {
        if (!extracted.embedSupported || extracted.type === 'profile') {
          return {
            success: true,
            embedType: 'fallback',
            platformName: 'TikTok',
            rawUrl: urlStr,
            reason: extracted.reason || 'Official platform viewing is required for this content.'
          };
        }
        const id = extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://www.tiktok.com/embed/v2/${encodeURIComponent(id)}`,
          title: `TikTok Player (${id})`,
          allow: 'autoplay; fullscreen; encrypted-media; picture-in-picture'
        };
      }

      // 5. Threads
      case 'threads': {
        if (!extracted.embedSupported || extracted.type === 'profile') {
          return {
            success: true,
            embedType: 'fallback',
            platformName: 'Threads',
            rawUrl: urlStr,
            reason: extracted.reason || 'Official platform viewing is required for this content.'
          };
        }
        const postId = extracted.postId || extracted.id;
        const src = extracted.user 
          ? `https://www.threads.net/@${encodeURIComponent(extracted.user)}/post/${encodeURIComponent(postId)}/embed`
          : `https://www.threads.net/t/${encodeURIComponent(postId)}/embed`;
        return {
          success: true,
          embedType: 'iframe',
          src: src,
          title: `Threads Post (${postId})`,
          allow: 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
        };
      }

      // 6. Vimeo
      case 'vimeo': {
        const id = extracted.id;
        const muteParam = isMuted ? '1' : '0';
        const loopParam = isLoop ? '1' : '0';
        return {
          success: true,
          embedType: 'iframe',
          src: `https://player.vimeo.com/video/${encodeURIComponent(id)}?dnt=1&muted=${muteParam}&loop=${loopParam}`,
          title: `Vimeo Player (${id})`,
          allow: 'autoplay; fullscreen; picture-in-picture'
        };
      }

      // 7. Dailymotion
      case 'dailymotion': {
        const id = extracted.id;
        const muteParam = isMuted ? '1' : '0';
        const loopParam = isLoop ? '&loop=1' : '';
        return {
          success: true,
          embedType: 'iframe',
          src: `https://www.dailymotion.com/embed/video/${encodeURIComponent(id)}?mute=${muteParam}&ui-logo=0${loopParam}`,
          title: `Dailymotion Player (${id})`,
          allow: 'autoplay; fullscreen; picture-in-picture'
        };
      }

      // 8. Twitch
      case 'twitch': {
        const host = currentHost || 'localhost';
        // Build robust parent domain parameter including current host, localhost, 127.0.0.1
        const parents = Array.from(new Set([host, 'localhost', '127.0.0.1']));
        const parentQuery = parents.map(p => `parent=${encodeURIComponent(p)}`).join('&');

        let src = '';
        if (extracted.type === 'clip') {
          src = `https://clips.twitch.tv/embed?clip=${encodeURIComponent(extracted.id)}&${parentQuery}&autoplay=false`;
        } else if (extracted.type === 'video') {
          src = `https://player.twitch.tv/?video=${encodeURIComponent(extracted.id)}&${parentQuery}&autoplay=false&muted=${isMuted}`;
        } else {
          src = `https://player.twitch.tv/?channel=${encodeURIComponent(extracted.id)}&${parentQuery}&autoplay=false&muted=${isMuted}`;
        }
        return {
          success: true,
          embedType: 'iframe',
          src: src,
          title: `Twitch Stream (${extracted.id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 9. Kick
      case 'kick': {
        let src = '';
        if (extracted.type === 'video') {
          src = `https://player.kick.com/video/${encodeURIComponent(extracted.id)}?autoplay=false&muted=${isMuted}`;
        } else if (extracted.type === 'clip') {
          src = `https://player.kick.com/clip/${encodeURIComponent(extracted.id)}?autoplay=false`;
        } else {
          src = `https://player.kick.com/${encodeURIComponent(extracted.id)}?autoplay=false&muted=${isMuted}`;
        }
        return {
          success: true,
          embedType: 'iframe',
          src: src,
          title: `Kick Stream (${extracted.id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 10. Spotify
      case 'spotify': {
        const type = extracted.type || 'track';
        const id = extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://open.spotify.com/embed/${encodeURIComponent(type)}/${encodeURIComponent(id)}?utm_source=generator&theme=0`,
          title: `Spotify Media (${type}/${id})`,
          allow: 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
        };
      }

      // 11. SoundCloud
      case 'soundcloud': {
        const encoded = encodeURIComponent(urlStr);
        return {
          success: true,
          embedType: 'iframe',
          src: `https://w.soundcloud.com/player/?url=${encoded}&color=%23FF5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`,
          title: 'SoundCloud Player',
          allow: 'autoplay'
        };
      }

      // 12. Bilibili
      case 'bilibili': {
        let src = '';
        if (extracted.isAid) {
          src = `https://player.bilibili.com/player.html?aid=${encodeURIComponent(extracted.id)}&page=1&autoplay=0&danmaku=0`;
        } else {
          src = `https://player.bilibili.com/player.html?bvid=${encodeURIComponent(extracted.id)}&page=1&autoplay=0&danmaku=0`;
        }
        return {
          success: true,
          embedType: 'iframe',
          src: src,
          title: `Bilibili Player (${extracted.id})`,
          allow: 'fullscreen'
        };
      }

      // 13. Telegram
      case 'telegram': {
        if (extracted.channel && extracted.post) {
          return {
            success: true,
            embedType: 'iframe',
            src: `https://t.me/${encodeURIComponent(extracted.channel)}/${encodeURIComponent(extracted.post)}?embed=1&userpic=true`,
            title: `Telegram Post (${extracted.channel}/${extracted.post})`,
            allow: 'autoplay'
          };
        }
        if (extracted.channel) {
          return {
            success: true,
            embedType: 'iframe',
            src: `https://t.me/s/${encodeURIComponent(extracted.channel)}?embed=1`,
            title: `Telegram Channel (${extracted.channel})`,
            allow: 'autoplay'
          };
        }
        return {
          success: true,
          embedType: 'fallback',
          platformName: 'Telegram',
          rawUrl: urlStr,
          reason: 'Official platform viewing is required for this content.'
        };
      }

      // 14. X (Twitter)
      case 'x': {
        if (!extracted.embedSupported || extracted.type === 'profile' || !extracted.id) {
          return {
            success: true,
            embedType: 'fallback',
            platformName: 'X (Twitter)',
            rawUrl: urlStr,
            reason: extracted.reason || 'Official platform viewing is required for this content.'
          };
        }
        const tweetId = extracted.id;
        const themeParam = currentTheme === 'dark' ? 'dark' : 'light';
        return {
          success: true,
          embedType: 'iframe',
          src: `https://platform.twitter.com/embed/Tweet.html?id=${encodeURIComponent(tweetId)}&theme=${themeParam}&dnt=true`,
          title: `X Post (${tweetId})`,
          allow: 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
        };
      }

      // 15. LinkedIn
      case 'linkedin': {
        if (extracted.urn) {
          return {
            success: true,
            embedType: 'iframe',
            src: `https://www.linkedin.com/embed/feed/update/${encodeURIComponent(extracted.urn)}`,
            title: 'LinkedIn Post',
            allow: 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
          };
        }
        if (urlStr.includes('/embed/')) {
          return {
            success: true,
            embedType: 'iframe',
            src: urlStr,
            title: 'LinkedIn Embedded Post',
            allow: 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
          };
        }
        return {
          success: true,
          embedType: 'fallback',
          platformName: 'LinkedIn',
          rawUrl: urlStr,
          reason: 'Official platform viewing is required for this content.'
        };
      }

      // 16. Reddit
      case 'reddit': {
        if (!extracted.embedSupported || extracted.type === 'subreddit' || !extracted.id) {
          return {
            success: true,
            embedType: 'fallback',
            platformName: 'Reddit',
            rawUrl: urlStr,
            reason: extracted.reason || 'Official platform viewing is required for this content.'
          };
        }
        const sub = extracted.subreddit || 'reddit';
        const id = extracted.id;
        const slug = extracted.slug || '';
        return {
          success: true,
          embedType: 'iframe',
          src: `https://www.redditmedia.com/r/${encodeURIComponent(sub)}/comments/${encodeURIComponent(id)}/${encodeURIComponent(slug)}/?ref_source=embed&ref=share&embed=true`,
          title: `Reddit Post (${sub}/${id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 17. Pinterest
      case 'pinterest': {
        if (!extracted.embedSupported || extracted.type === 'board' || !extracted.id) {
          return {
            success: true,
            embedType: 'fallback',
            platformName: 'Pinterest',
            rawUrl: urlStr,
            reason: extracted.reason || 'Official platform viewing is required for this content.'
          };
        }
        return {
          success: true,
          embedType: 'iframe',
          src: `https://assets.pinterest.com/ext/embed.html?id=${encodeURIComponent(extracted.id)}`,
          title: `Pinterest Pin (${extracted.id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 18. Rumble
      case 'rumble': {
        if (extracted.embedSupported && extracted.id) {
          return {
            success: true,
            embedType: 'iframe',
            src: `https://rumble.com/embed/${encodeURIComponent(extracted.id)}/?pub=4`,
            title: `Rumble Player (${extracted.id})`,
            allow: 'autoplay; fullscreen'
          };
        }
        return {
          success: true,
          embedType: 'fallback',
          platformName: 'Rumble',
          rawUrl: urlStr,
          reason: 'Official platform viewing is required for this content.'
        };
      }

      // 19. Odysee
      case 'odysee': {
        if (extracted.embedSupported && extracted.path) {
          return {
            success: true,
            embedType: 'iframe',
            src: `https://odysee.com/$/embed/${encodeURI(extracted.path)}`,
            title: `Odysee Media (${extracted.path})`,
            allow: 'autoplay; fullscreen'
          };
        }
        return {
          success: true,
          embedType: 'fallback',
          platformName: 'Odysee',
          rawUrl: urlStr,
          reason: 'Official platform viewing is required for this content.'
        };
      }

      // 20. Snapchat
      case 'snapchat': {
        if (extracted.embedSupported && extracted.type === 'spotlight' && extracted.id) {
          return {
            success: true,
            embedType: 'iframe',
            src: `https://www.snapchat.com/embed/spotlight/${encodeURIComponent(extracted.id)}`,
            title: `Snapchat Spotlight (${extracted.id})`,
            allow: 'autoplay; fullscreen'
          };
        }
        return {
          success: true,
          embedType: 'fallback',
          platformName: 'Snapchat',
          rawUrl: urlStr,
          reason: 'Official platform viewing is required for this content.'
        };
      }

      default: {
        return {
          success: true,
          embedType: 'fallback',
          platformName: config.name,
          rawUrl: urlStr,
          reason: 'Official platform viewing is required for this content.'
        };
      }
    }
  }
};

window.PLATFORM_CONFIG = PLATFORM_CONFIG;
window.PlatformEngine = PlatformEngine;


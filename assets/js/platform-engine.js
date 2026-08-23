/**
 * Multi Tube Views (MTV) — Central Platform Adapter Engine
 * Configures all 20 platform adapters, handles official embed URLs,
 * Twitch parent domain generation, and restricted fallback logic.
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
    supportedTypes: ['Standard Videos', 'Shorts', 'Public Live Streams', 'Clips'],
    placeholderUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    officialDomain: 'youtube.com'
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook Video',
    category: 'Social Media',
    description: 'Public Facebook watch videos, public reels, and open media posts.',
    icon: 'f',
    color: '#1877F2',
    embedSupported: true,
    supportedTypes: ['Public Watch Videos', 'Open Reels'],
    placeholderUrl: 'https://www.facebook.com/facebook/videos/10153231379946729/',
    officialDomain: 'facebook.com'
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social Media',
    description: 'Public reels, video posts, and profile content with official preview fallback.',
    icon: '📷',
    color: '#E4405F',
    embedSupported: true,
    supportedTypes: ['Public Reels', 'Public Posts', 'IGTV'],
    placeholderUrl: 'https://www.instagram.com/p/CG7y9TynzM1/',
    officialDomain: 'instagram.com'
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    category: 'Short-Form Video',
    description: 'Public short videos and viral creator clips with official view gateway.',
    icon: '🎵',
    color: '#000000',
    embedSupported: true,
    supportedTypes: ['Public Short Videos', 'Creator Clips'],
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
    embedSupported: false,
    supportedTypes: ['Public Video Threads', 'Discourse'],
    placeholderUrl: 'https://www.threads.net/@example/post/12345',
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
    supportedTypes: ['Live Channels', 'Creator Broadcasts'],
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
    supportedTypes: ['Public BV Videos', 'Creations', 'Lectures'],
    placeholderUrl: 'https://www.bilibili.com/video/BV1xx411c7mD',
    officialDomain: 'bilibili.com'
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    category: 'Messaging & Channels',
    description: 'Public channel media broadcasts and announcements.',
    icon: '✈',
    color: '#229ED9',
    embedSupported: true,
    supportedTypes: ['Public Channel Broadcasts', 'Open Media'],
    placeholderUrl: 'https://t.me/telegram/123',
    officialDomain: 't.me'
  },
  x: {
    id: 'x',
    name: 'X (Twitter)',
    category: 'Social Media',
    description: 'Public posts containing video broadcasts, news clips, and discourse.',
    icon: '𝕏',
    color: '#000000',
    embedSupported: false,
    supportedTypes: ['Public Video Posts', 'Broadcast Clips'],
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
    embedSupported: false,
    supportedTypes: ['Public Keynotes', 'Company Media Posts'],
    placeholderUrl: 'https://www.linkedin.com/posts/example',
    officialDomain: 'linkedin.com'
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    category: 'Community Discussions',
    description: 'Public video posts, community discussions, and open media threads.',
    icon: '🤖',
    color: '#FF4500',
    embedSupported: false,
    supportedTypes: ['Public Media Posts', 'Discussions'],
    placeholderUrl: 'https://www.reddit.com/r/space/comments/example',
    officialDomain: 'reddit.com'
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    category: 'Visual Discovery',
    description: 'Public video pins, DIY tutorials, recipe clips, and visual design boards.',
    icon: '📌',
    color: '#BD081C',
    embedSupported: false,
    supportedTypes: ['Public Video Pins', 'Design Clips'],
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
    embedSupported: false,
    supportedTypes: ['Public Publications', 'Open Media'],
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
    embedSupported: false,
    supportedTypes: ['Public Spotlight Clips', 'Open Stories'],
    placeholderUrl: 'https://www.snapchat.com/spotlight/example',
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

  // Generates embed URL or returns null if platform policy restricts iframe playback
  generateEmbed(platformId, urlStr, options = {}) {
    const config = PLATFORM_CONFIG[platformId];
    if (!config) return { error: 'Unknown platform' };

    const validator = window.Validators ? window.Validators[platformId] : null;
    const extracted = validator ? validator.extract(urlStr) : { valid: true, id: urlStr };

    if (!extracted.valid) {
      return {
        success: false,
        error: extracted.error || 'Invalid link for this platform',
        rawUrl: urlStr
      };
    }

    const isMuted = options.muted ?? true;
    const hostname = window.location.hostname || 'localhost';

    switch (platformId) {
      case 'youtube': {
        const isMuted = options.muted ?? true;
        const muteParam = isMuted ? '&mute=1' : '';

        if (extracted.type === 'playlist' && extracted.playlistId) {
          return {
            success: true,
            embedType: 'iframe',
            src: `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(extracted.playlistId)}${muteParam}`,
            title: `YouTube Playlist (${extracted.playlistId})`,
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          };
        }

        const id = extracted.id;
        let playlistExtra = extracted.playlistId ? `&list=${encodeURIComponent(extracted.playlistId)}` : '';
        return {
          success: true,
          embedType: 'iframe',
          src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0${muteParam}${playlistExtra}`,
          title: `YouTube Player (${id})`,
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        };
      }

      case 'vimeo': {
        const id = extracted.id;
        const muteParam = isMuted ? '1' : '0';
        return {
          success: true,
          embedType: 'iframe',
          src: `https://player.vimeo.com/video/${encodeURIComponent(id)}?dnt=1&muted=${muteParam}`,
          title: `Vimeo Player (${id})`,
          allow: 'autoplay; fullscreen; picture-in-picture'
        };
      }

      case 'dailymotion': {
        const id = extracted.id;
        const muteParam = isMuted ? '1' : '0';
        return {
          success: true,
          embedType: 'iframe',
          src: `https://www.dailymotion.com/embed/video/${encodeURIComponent(id)}?mute=${muteParam}&ui-logo=0`,
          title: `Dailymotion Player (${id})`,
          allow: 'autoplay; fullscreen; picture-in-picture'
        };
      }

      case 'twitch': {
        const host = (window.location && window.location.hostname) ? window.location.hostname : 'localhost';
        let src = '';
        if (extracted.type === 'clip') {
          src = `https://clips.twitch.tv/embed?clip=${encodeURIComponent(extracted.id)}&parent=${encodeURIComponent(host)}&autoplay=false`;
        } else if (extracted.type === 'video') {
          src = `https://player.twitch.tv/?video=${encodeURIComponent(extracted.id)}&parent=${encodeURIComponent(host)}&autoplay=false&muted=${isMuted}`;
        } else {
          src = `https://player.twitch.tv/?channel=${encodeURIComponent(extracted.id)}&parent=${encodeURIComponent(host)}&autoplay=false&muted=${isMuted}`;
        }
        return {
          success: true,
          embedType: 'iframe',
          src: src,
          title: `Twitch Stream (${extracted.id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      case 'kick': {
        return {
          success: true,
          embedType: 'iframe',
          src: `https://player.kick.com/${encodeURIComponent(extracted.id)}?autoplay=false&muted=${isMuted}`,
          title: `Kick Stream (${extracted.id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      case 'spotify': {
        const { type, id } = extracted;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://open.spotify.com/embed/${encodeURIComponent(type)}/${encodeURIComponent(id)}?utm_source=generator&theme=0`,
          title: `Spotify Media (${id})`,
          allow: 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
        };
      }

      case 'soundcloud': {
        const encoded = encodeURIComponent(urlStr);
        return {
          success: true,
          embedType: 'iframe',
          src: `https://w.soundcloud.com/player/?url=${encoded}&color=%232563eb&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`,
          title: 'SoundCloud Player',
          allow: 'autoplay'
        };
      }

      case 'bilibili': {
        const bvid = extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://player.bilibili.com/player.html?bvid=${encodeURIComponent(bvid)}&page=1&autoplay=0`,
          title: `Bilibili Player (${bvid})`,
          allow: 'fullscreen'
        };
      }

      case 'facebook': {
        if (extracted.isShareUrl || !extracted.embedSupported) {
          return {
            success: true,
            embedType: 'fallback',
            platformName: 'Facebook',
            rawUrl: urlStr,
            reason: extracted.reason || 'Facebook share URLs cannot be directly embedded by the official Facebook player plugin. Open the link on Facebook or provide a direct video permalink.'
          };
        }
        const encoded = encodeURIComponent(urlStr);
        return {
          success: true,
          embedType: 'iframe',
          src: `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=0&width=560`,
          title: 'Facebook Video Player',
          allow: 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
        };
      }

      case 'rumble': {
        if (extracted.embedSupported && extracted.id) {
          return {
            success: true,
            embedType: 'iframe',
            src: `https://rumble.com/embed/${encodeURIComponent(extracted.id)}/`,
            title: `Rumble Player (${extracted.id})`,
            allow: 'autoplay; fullscreen'
          };
        }
        return {
          success: true,
          embedType: 'fallback',
          platformName: 'Rumble',
          rawUrl: urlStr,
          reason: 'Direct playback requires a recognized Rumble embed permalink. You can access the video directly via the verified official link.'
        };
      }

      case 'telegram': {
        if (extracted.channel && extracted.post) {
          return {
            success: true,
            embedType: 'iframe',
            src: `https://t.me/${encodeURIComponent(extracted.channel)}/${encodeURIComponent(extracted.post)}?embed=1`,
            title: `Telegram Post (${extracted.channel}/${extracted.post})`,
            allow: 'autoplay'
          };
        }
        return {
          success: false,
          fallbackRequired: true,
          error: 'Telegram requires channel and post ID format (e.g. t.me/channel/123)',
          rawUrl: urlStr
        };
      }

      // Platforms with Restricted Third-Party Embed Policies
      case 'instagram':
      case 'tiktok':
      case 'x':
      case 'linkedin':
      case 'reddit':
      case 'pinterest':
      case 'snapchat':
      case 'threads':
      case 'odysee':
      default: {
        return {
          success: true,
          embedType: 'fallback',
          platformName: config.name,
          rawUrl: urlStr,
          reason: `${config.name} policies manage third-party embedding and require direct official view. Access the content safely via the verified official platform link.`
        };
      }
    }
  }
};

window.PLATFORM_CONFIG = PLATFORM_CONFIG;
window.PlatformEngine = PlatformEngine;

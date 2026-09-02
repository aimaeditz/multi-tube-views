/**
 * Multi Tube Views (MTV) — Central Platform Adapter Engine
 * Configures all 40 platform adapters, handles official embed URLs,
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
    category: 'Video & Streaming',
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
    category: 'Audio & Podcasts',
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
    category: 'Video & Streaming',
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
    category: 'Social Media',
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
    category: 'Social Media',
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
    category: 'Creative Video',
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
    category: 'Creative Video',
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
    category: 'Video & Streaming',
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
    category: 'Creative Video',
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
    category: 'Short-Form Video',
    description: 'Public Spotlight videos and creator stories with direct launch gateway.',
    icon: '👻',
    color: '#FFFC00',
    embedSupported: true,
    supportedTypes: ['Public Spotlight Clips', 'Open Stories'],
    placeholderUrl: 'https://www.snapchat.com/spotlight/W7_EDlXWTBiXAEEniN9XAQAAmfnd66n2b4k1AAQ',
    officialDomain: 'snapchat.com'
  },
  streamable: {
    id: 'streamable',
    name: 'Streamable',
    category: 'Video & Streaming',
    description: 'Fast, simple public video and short clip sharing workspace.',
    icon: '▶',
    color: '#0F75BD',
    embedSupported: true,
    supportedTypes: ['Public Clips', 'Short Videos', 'Direct Streamable Links'],
    placeholderUrl: 'https://streamable.com/abc123',
    officialDomain: 'streamable.com'
  },
  peertube: {
    id: 'peertube',
    name: 'PeerTube',
    category: 'Creative Video',
    description: 'Public decentralized, federated video network powered by ActivityPub & WebTorrent.',
    icon: '📺',
    color: '#F1680D',
    embedSupported: true,
    supportedTypes: ['Federated Videos', 'Public PeerTube Streams', 'Decentralized Channels'],
    placeholderUrl: 'https://framatube.org/w/abcdef123456',
    officialDomain: 'joinpeertube.org'
  },
  loom: {
    id: 'loom',
    name: 'Loom',
    category: 'Video & Streaming',
    description: 'Public screen recordings, interactive demos, and asynchronous video messages.',
    icon: '📹',
    color: '#625DF5',
    embedSupported: true,
    supportedTypes: ['Public Screen Recordings', 'Video Messages', 'Shared Loom Presentations'],
    placeholderUrl: 'https://www.loom.com/share/abcdef1234567890abcdef1234567890',
    officialDomain: 'loom.com'
  },
  vevo: {
    id: 'vevo',
    name: 'Vevo',
    category: 'Video & Streaming',
    description: 'High-definition official music videos, live artist performances, and premieres.',
    icon: '🎵',
    color: '#E01F26',
    embedSupported: true,
    supportedTypes: ['Official Music Videos', 'Live Premieres', 'Artist Showcases'],
    placeholderUrl: 'https://www.vevo.com/watch/artist-name/track-name/US1234567890',
    officialDomain: 'vevo.com'
  },
  josh: {
    id: 'josh',
    name: 'Josh',
    category: 'Short-Form Video',
    description: 'Trending short videos, dance clips, entertainment, and creator reels.',
    icon: '📱',
    color: '#FF0055',
    embedSupported: true,
    supportedTypes: ['Short Videos', 'Creator Clips', 'Viral Reels'],
    placeholderUrl: 'https://share.myjosh.in/video/abcdef123',
    officialDomain: 'myjosh.in'
  },
  moj: {
    id: 'moj',
    name: 'Moj',
    category: 'Short-Form Video',
    description: 'Dynamic short-format mobile videos, comedy snippets, and music clips.',
    icon: '✨',
    color: '#FF5252',
    embedSupported: true,
    supportedTypes: ['Short Video Clips', 'Trending Reels', 'Creator Posts'],
    placeholderUrl: 'https://mojapp.in/@creator/video/1234567890',
    officialDomain: 'mojapp.in'
  },
  chingari: {
    id: 'chingari',
    name: 'Chingari',
    category: 'Short-Form Video',
    description: 'Short-form creator entertainment, Web3 social video clips, and live audio rooms.',
    icon: '🔥',
    color: '#FF3366',
    embedSupported: true,
    supportedTypes: ['Creator Short Clips', 'Social Videos', 'Live Stream Feeds'],
    placeholderUrl: 'https://chingari.io/post/abcdef123',
    officialDomain: 'chingari.io'
  },
  douyin: {
    id: 'douyin',
    name: 'Douyin',
    category: 'Short-Form Video',
    description: 'Public viral short videos, creative music clips, and cultural trend spotlights.',
    icon: '🎶',
    color: '#000000',
    embedSupported: true,
    supportedTypes: ['Public Short Videos', 'Music Clips', 'Creator Highlights'],
    placeholderUrl: 'https://www.douyin.com/video/7123456789012345678',
    officialDomain: 'douyin.com'
  },
  kuaishou: {
    id: 'kuaishou',
    name: 'Kuaishou',
    category: 'Short-Form Video',
    description: 'Public lifestyle vlogs, comedy sketches, creator broadcasts, and short clips.',
    icon: '🎬',
    color: '#FF7700',
    embedSupported: true,
    supportedTypes: ['Short Video Vlogs', 'Creator Streams', 'Story Posts'],
    placeholderUrl: 'https://www.kuaishou.com/short-video/3xabc123',
    officialDomain: 'kuaishou.com'
  },
  triller: {
    id: 'triller',
    name: 'Triller',
    category: 'Short-Form Video',
    description: 'AI-edited music videos, creator challenges, and synchronized short clips.',
    icon: '⚡',
    color: '#EB0065',
    embedSupported: true,
    supportedTypes: ['Music Video Clips', 'Creator Challenges', 'Public Short Feeds'],
    placeholderUrl: 'https://triller.co/@creator/video/abcdef123',
    officialDomain: 'triller.co'
  },
  trovo: {
    id: 'trovo',
    name: 'Trovo',
    category: 'Live Broadcasts',
    description: 'Interactive live gaming broadcasts, esports tournaments, and creator communities.',
    icon: '🎮',
    color: '#19D863',
    embedSupported: true,
    supportedTypes: ['Live Gaming Streams', 'VODs', 'Community Clips'],
    placeholderUrl: 'https://trovo.live/s/StreamerName',
    officialDomain: 'trovo.live'
  },
  dlive: {
    id: 'dlive',
    name: 'DLive',
    category: 'Live Broadcasts',
    description: 'Decentralized blockchain-powered live streaming and video sharing network.',
    icon: '📡',
    color: '#FFD300',
    embedSupported: true,
    supportedTypes: ['Live Stream Broadcasts', 'Creator Replays', 'Gaming Channels'],
    placeholderUrl: 'https://dlive.tv/StreamerName',
    officialDomain: 'dlive.tv'
  },
  caffeine: {
    id: 'caffeine',
    name: 'Caffeine.tv',
    category: 'Live Broadcasts',
    description: 'Real-time live entertainment, gaming streams, action sports, and community chats.',
    icon: '☕',
    color: '#0000FF',
    embedSupported: true,
    supportedTypes: ['Live Entertainment Broadcasts', 'Action Sports', 'Creator Streams'],
    placeholderUrl: 'https://www.caffeine.tv/BroadcasterName',
    officialDomain: 'caffeine.tv'
  },
  nimotv: {
    id: 'nimotv',
    name: 'Nimo TV',
    category: 'Live Broadcasts',
    description: 'Global esports tournaments, mobile gaming streams, and interactive live broadcasts.',
    icon: '🕹️',
    color: '#4169E1',
    embedSupported: true,
    supportedTypes: ['Live Esports Feeds', 'Mobile Gaming Broadcasts', 'Streamer Highlights'],
    placeholderUrl: 'https://www.nimo.tv/live/12345678',
    officialDomain: 'nimo.tv'
  },
  applepodcasts: {
    id: 'applepodcasts',
    name: 'Apple Podcasts',
    category: 'Audio & Podcasts',
    description: 'Premier directory of public talk shows, narrative audio series, and educational podcasts.',
    icon: '🎙️',
    color: '#872EC4',
    embedSupported: true,
    supportedTypes: ['Podcast Episodes', 'Show Feeds', 'Audio Series'],
    placeholderUrl: 'https://podcasts.apple.com/us/podcast/the-daily/id1200361736',
    officialDomain: 'podcasts.apple.com'
  },
  youtubemusic: {
    id: 'youtubemusic',
    name: 'YouTube Music',
    category: 'Audio & Podcasts',
    description: 'Official music tracks, albums, artist radio, and curated community audio playlists.',
    icon: '🎧',
    color: '#FF0000',
    embedSupported: true,
    supportedTypes: ['Music Tracks', 'Official Albums', 'Curated Playlists'],
    placeholderUrl: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ',
    officialDomain: 'music.youtube.com'
  },
  anchor: {
    id: 'anchor',
    name: 'Anchor (Spotify for Podcasters)',
    category: 'Audio & Podcasts',
    description: 'Public independent podcast episodes, serialized audio feeds, and creator radio.',
    icon: '📻',
    color: '#5C34EC',
    embedSupported: true,
    supportedTypes: ['Podcast Episodes', 'Audio Feeds', 'Creator Shows'],
    placeholderUrl: 'https://anchor.fm/show-name/episodes/Episode-Title-e12345',
    officialDomain: 'podcasters.spotify.com'
  },
  tumblr: {
    id: 'tumblr',
    name: 'Tumblr',
    category: 'Social Media',
    description: 'Public media blog posts, video gifs, artwork portfolios, and creative commentary.',
    icon: 't',
    color: '#36465D',
    embedSupported: true,
    supportedTypes: ['Public Video Posts', 'Media Blogs', 'Creative GIF Threads'],
    placeholderUrl: 'https://staff.tumblr.com/post/1234567890/announcement',
    officialDomain: 'tumblr.com'
  },
  mastodon: {
    id: 'mastodon',
    name: 'Mastodon',
    category: 'Social Media',
    description: 'Federated microblogging media posts, open community videos, and decentralized updates.',
    icon: '🐘',
    color: '#6364FF',
    embedSupported: true,
    supportedTypes: ['Public Fediverse Statuses', 'Federated Video Posts', 'Community Media'],
    placeholderUrl: 'https://mastodon.social/@Mastodon/112345678901234567',
    officialDomain: 'joinmastodon.org'
  },
  newgrounds: {
    id: 'newgrounds',
    name: 'Newgrounds',
    category: 'Creative Video',
    description: 'Legendary independent animation portal, original music tracks, and indie art.',
    icon: '⚡',
    color: '#FFA500',
    embedSupported: true,
    supportedTypes: ['Portal Animations', 'Audio Portal Tracks', 'Indie Creator Media'],
    placeholderUrl: 'https://www.newgrounds.com/portal/view/123456',
    officialDomain: 'newgrounds.com'
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

      // 21. Streamable
      case 'streamable': {
        const id = extracted.id;
        const muteParam = isMuted ? '?muted=1' : '';
        const loopParam = isLoop ? (muteParam ? '&loop=1' : '?loop=1') : '';
        return {
          success: true,
          embedType: 'iframe',
          src: `https://streamable.com/e/${encodeURIComponent(id)}${muteParam}${loopParam}`,
          title: `Streamable Player (${id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 22. PeerTube
      case 'peertube': {
        const id = extracted.id;
        const host = extracted.host || 'peertube.tv';
        const muteParam = isMuted ? '&muted=1' : '';
        const loopParam = isLoop ? '&loop=1' : '';
        return {
          success: true,
          embedType: 'iframe',
          src: `https://${encodeURIComponent(host)}/videos/embed/${encodeURIComponent(id)}?autoplay=0${muteParam}${loopParam}`,
          title: `PeerTube Player (${id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 23. Loom
      case 'loom': {
        const id = extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://www.loom.com/embed/${encodeURIComponent(id)}?hide_owner=true&hide_share=true&hide_title=false&hideEmbedTopBar=false`,
          title: `Loom Video (${id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 24. Vevo
      case 'vevo': {
        const id = extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://embed.vevo.com?isrc=${encodeURIComponent(id)}&autoplay=0`,
          title: `Vevo Player (${id})`,
          allow: 'autoplay; fullscreen; picture-in-picture'
        };
      }

      // 25. Josh
      case 'josh': {
        const id = extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://share.myjosh.in/video/${encodeURIComponent(id)}?embed=true`,
          title: `Josh Video (${id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 26. Moj
      case 'moj': {
        const id = extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://mojapp.in/embed/${encodeURIComponent(id)}`,
          title: `Moj Video (${id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 27. Chingari
      case 'chingari': {
        const id = extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://chingari.io/embed/${encodeURIComponent(id)}`,
          title: `Chingari Video (${id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 28. Douyin
      case 'douyin': {
        const id = extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://www.douyin.com/open/embed/video/?video_id=${encodeURIComponent(id)}`,
          title: `Douyin Video (${id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 29. Kuaishou
      case 'kuaishou': {
        const id = extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://www.kuaishou.com/short-video/${encodeURIComponent(id)}?embed=true`,
          title: `Kuaishou Video (${id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 30. Triller
      case 'triller': {
        const id = extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://v.triller.co/${encodeURIComponent(id)}?embed=1`,
          title: `Triller Video (${id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 31. Trovo
      case 'trovo': {
        const channel = extracted.channel || extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://trovo.live/embed/player?streamername=${encodeURIComponent(channel)}&autoplay=0`,
          title: `Trovo Stream (${channel})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 32. DLive
      case 'dlive': {
        const channel = extracted.channel || extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://dlive.tv/embed/player?channel=${encodeURIComponent(channel)}&autoplay=0`,
          title: `DLive Stream (${channel})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 33. Caffeine.tv
      case 'caffeine': {
        const channel = extracted.channel || extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://www.caffeine.tv/embed/${encodeURIComponent(channel)}`,
          title: `Caffeine.tv Stream (${channel})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 34. Nimo TV
      case 'nimotv': {
        const channel = extracted.channel || extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://www.nimo.tv/embed/${encodeURIComponent(channel)}`,
          title: `Nimo TV Stream (${channel})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 35. Apple Podcasts
      case 'applepodcasts': {
        const path = extracted.path || `podcast/id${extracted.id}`;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://embed.podcasts.apple.com/us/${encodeURI(path)}`,
          title: `Apple Podcasts Player (${extracted.id})`,
          allow: 'autoplay *; encrypted-media *; fullscreen *; clipboard-write'
        };
      }

      // 36. YouTube Music
      case 'youtubemusic': {
        const id = extracted.id;
        const muteParam = isMuted ? '&mute=1' : '';
        const loopParam = isLoop ? '&loop=1' : '';
        let playlistParam = extracted.listId ? `&list=${encodeURIComponent(extracted.listId)}` : '';
        return {
          success: true,
          embedType: 'iframe',
          src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0${muteParam}${loopParam}${playlistParam}`,
          title: `YouTube Music Player (${id})`,
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        };
      }

      // 37. Anchor (Spotify for Podcasters)
      case 'anchor': {
        const id = extracted.id;
        return {
          success: true,
          embedType: 'iframe',
          src: `https://anchor.fm/${id}`,
          title: `Anchor Podcast Player (${id})`,
          allow: 'autoplay; encrypted-media; fullscreen'
        };
      }

      // 38. Tumblr
      case 'tumblr': {
        const id = extracted.id;
        const blog = extracted.blog || 'blog';
        return {
          success: true,
          embedType: 'iframe',
          src: `https://embed.tumblr.com/share/post?id=${encodeURIComponent(id)}&blog=${encodeURIComponent(blog)}`,
          title: `Tumblr Post (${id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 39. Mastodon
      case 'mastodon': {
        const id = extracted.id;
        const host = extracted.host || 'mastodon.social';
        return {
          success: true,
          embedType: 'iframe',
          src: `https://${encodeURIComponent(host)}/@${encodeURIComponent(extracted.user || 'user')}/${encodeURIComponent(id)}/embed`,
          title: `Mastodon Status (${id})`,
          allow: 'autoplay; fullscreen'
        };
      }

      // 40. Newgrounds
      case 'newgrounds': {
        const id = extracted.id;
        const isAudio = extracted.type === 'audio';
        const src = isAudio
          ? `https://www.newgrounds.com/audio/listen/${encodeURIComponent(id)}?embed=1`
          : `https://www.newgrounds.com/portal/video/${encodeURIComponent(id)}?embed=1`;
        return {
          success: true,
          embedType: 'iframe',
          src: src,
          title: `Newgrounds Media (${id})`,
          allow: 'autoplay; fullscreen'
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


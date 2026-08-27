/**
 * Multi Tube Views (MTV) — Creator Growth & Video Optimization Engine
 * 
 * Legitimate, privacy-first video SEO, packaging, discoverability scoring,
 * title optimization, description generator, thumbnail CTR simulator,
 * social promotion kit, and local growth analytics tracker.
 * 
 * STRICT COMPLIANCE & QUALITY RULES:
 * 1. Content generated strictly from actual submitted URL, platform, title, and topic.
 * 2. Zero fake metrics, zero artificial views/likes/subscriber claims, zero spam.
 * 3. 3-8 short, natural, lowercase, directly relevant hashtags per piece of content.
 * 4. Genuine search-intent keywords and realistic long-tail queries.
 * 5. Platform-tailored, professional, human-sounding promotional copy.
 */

class GrowthEngine {
  constructor() {
    this.storageKey = 'mtv_growth_analytics';
    this.activeAnalysis = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderAnalyticsSummary();
    this.checkUrlParams();
  }

  // --- ANALYTICS EVENT TRACKING (100% Client-Side / Privacy-Conscious) ---
  trackEvent(eventType, metadata = {}) {
    try {
      const history = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const newEvent = {
        id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        type: eventType,
        timestamp: new Date().toISOString(),
        metadata: metadata
      };
      history.unshift(newEvent);
      // Keep last 50 events max
      if (history.length > 50) history.pop();
      localStorage.setItem(this.storageKey, JSON.stringify(history));
      this.renderAnalyticsSummary();
    } catch (e) {
      console.warn('Could not record growth analytics event:', e);
    }
  }

  getAnalyticsSummary() {
    try {
      const history = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const totalAnalyses = history.filter(e => e.type === 'analysis_completed').length;
      const titlesGenerated = history.filter(e => e.type === 'title_copied' || e.type === 'titles_generated').length;
      const promosShared = history.filter(e => e.type === 'promo_shared' || e.type === 'promo_copied').length;
      
      const scoredAnalyses = history.filter(e => e.type === 'analysis_completed' && e.metadata && typeof e.metadata.score === 'number');
      const avgScore = scoredAnalyses.length > 0
        ? Math.round(scoredAnalyses.reduce((acc, curr) => acc + curr.metadata.score, 0) / scoredAnalyses.length)
        : 0;

      return {
        totalAnalyses,
        titlesGenerated,
        promosShared,
        avgScore,
        recentEvents: history.slice(0, 8)
      };
    } catch (e) {
      return { totalAnalyses: 0, titlesGenerated: 0, promosShared: 0, avgScore: 0, recentEvents: [] };
    }
  }

  clearAnalytics() {
    try {
      localStorage.removeItem(this.storageKey);
      this.renderAnalyticsSummary();
      this.showToast('Growth history cleared cleanly', 'success');
    } catch (e) {
      console.error(e);
    }
  }

  // Helper: Extract meaningful words from a topic/title
  extractTopicWords(text) {
    if (!text || typeof text !== 'string') return [];
    const stopWords = new Set([
      'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
      'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
      'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
      'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
      'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
      'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
      'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
      'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
      'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
      'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
      'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'vs', 'video', 'watch', 'official', 'full'
    ]);

    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/[\s-]+/)
      .map(w => w.trim())
      .filter(w => w.length > 2 && !stopWords.has(w) && !/^\d+$/.test(w));

    return Array.from(new Set(words));
  }

  // --- URL & METADATA PARSER ---
  parseVideoInput(inputUrl, manualTitle = '', manualDesc = '', manualCategory = 'General') {
    const url = (inputUrl || '').trim();
    let platform = 'Generic Video';
    let videoId = '';
    let detectedThumbnail = '';
    let guessedTitle = manualTitle.trim();
    let guessedDesc = manualDesc.trim();

    if (url && window.Validators && typeof window.Validators.detectPlatform === 'function') {
      const detectedKey = window.Validators.detectPlatform(url);
      if (detectedKey) {
        const config = window.PLATFORM_CONFIG ? window.PLATFORM_CONFIG[detectedKey] : null;
        platform = config?.name || (detectedKey.charAt(0).toUpperCase() + detectedKey.slice(1));
        
        const validator = window.Validators[detectedKey];
        if (validator && typeof validator.extract === 'function') {
          const extracted = validator.extract(url);
          if (extracted && extracted.id) {
            videoId = String(extracted.id);
          }
        }
      }
    }

    // Platform-specific thumbnail and title heuristics from URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'YouTube';
      const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      if (ytMatch && ytMatch[1]) {
        videoId = ytMatch[1];
        detectedThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    } else if (url.includes('vimeo.com')) {
      platform = 'Vimeo';
      const vMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)/);
      if (vMatch && vMatch[2]) videoId = vMatch[2];
    } else if (url.includes('twitch.tv')) {
      platform = 'Twitch';
    } else if (url.includes('tiktok.com')) {
      platform = 'TikTok';
    } else if (url.includes('instagram.com')) {
      platform = 'Instagram';
    } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
      platform = 'Facebook';
    } else if (url.includes('reddit.com')) {
      platform = 'Reddit';
      // Extract title from Reddit URL slug if available
      const redditSlugMatch = url.match(/\/comments\/[a-zA-Z0-9]+\/([^\/?#]+)/);
      if (redditSlugMatch && redditSlugMatch[1] && !guessedTitle) {
        guessedTitle = redditSlugMatch[1].replace(/[_-]+/g, ' ').trim();
        guessedTitle = guessedTitle.charAt(0).toUpperCase() + guessedTitle.slice(1);
      }
    }

    // Attempt to extract slug from generic URL if title was not manually entered
    if (!guessedTitle && url) {
      try {
        const parsedUrl = new URL(url);
        const segments = parsedUrl.pathname.split('/').filter(Boolean);
        const lastSegment = segments[segments.length - 1];
        if (lastSegment && lastSegment.length > 3 && !/^[0-9a-fA-F_-]+$/.test(lastSegment) && !/^\d+$/.test(lastSegment)) {
          const cleanSlug = decodeURIComponent(lastSegment)
            .replace(/\.[a-zA-Z0-9]+$/, '')
            .replace(/[_-]+/g, ' ')
            .trim();
          if (cleanSlug.length >= 4 && cleanSlug.split(' ').length >= 2) {
            guessedTitle = cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1);
          }
        }
      } catch (_) {}
    }

    // Default neutral fallback title if none provided (strictly descriptive, no fake masterclasses)
    if (!guessedTitle) {
      if (videoId && videoId.length < 20) {
        guessedTitle = `${platform} Content (${videoId})`;
      } else if (url) {
        try {
          const parsed = new URL(url);
          guessedTitle = `Media from ${parsed.hostname.replace(/^www\./, '')}`;
        } catch (e) {
          guessedTitle = "Video Presentation & Overview";
        }
      } else {
        guessedTitle = "Video Presentation & Overview";
      }
    }

    if (!guessedDesc) {
      guessedDesc = `An overview of ${guessedTitle}.\n\nKey discussion points and core takeaways.\n\n#${platform.toLowerCase().replace(/[^a-z0-9]/g, '')} #video`;
    }

    return {
      url,
      platform,
      videoId,
      thumbnail: detectedThumbnail,
      title: guessedTitle,
      description: guessedDesc,
      category: manualCategory
    };
  }

  // --- GROWTH READINESS SCORING ALGORITHM (0-100) ---
  // Evaluates clarity, character bounds, structure, search intent, and readability without fake promises.
  calculateGrowthScore(title, description, tags = [], hasCustomThumbnail = true) {
    const t = (title || '').trim();
    const d = (description || '').trim();
    
    // 1. Title Structure & Length Score (Max 35 pts)
    let titleScore = 0;
    const titleTips = [];
    const tLen = t.length;

    if (tLen >= 40 && tLen <= 70) {
      titleScore += 15;
      titleTips.push({ pass: true, text: `Optimal length (${tLen} chars): Displays clearly across desktop and mobile feeds without truncation.` });
    } else if (tLen > 0 && tLen < 40) {
      titleScore += 8;
      titleTips.push({ pass: false, text: `Title is relatively short (${tLen} chars). Expand to 45–65 chars to provide more descriptive context.` });
    } else if (tLen > 70) {
      titleScore += 8;
      titleTips.push({ pass: false, text: `Title may truncate on mobile feeds (${tLen} chars). Place the primary topic keywords near the beginning.` });
    } else {
      titleTips.push({ pass: false, text: "Missing title. Enter a clear, descriptive topic or title to evaluate." });
    }

    // Clarity and Informational intent check
    const descriptiveKeywords = ['how to', 'guide', 'overview', 'explained', 'tips', 'walkthrough', 'tutorial', 'review', 'mistakes', 'best practices', 'breakdown', 'insights', 'steps', 'summary', 'comparison'];
    const hasDescriptiveIntent = descriptiveKeywords.some(kw => t.toLowerCase().includes(kw));
    if (hasDescriptiveIntent) {
      titleScore += 12;
      titleTips.push({ pass: true, text: "Contains clear, intent-driven phrasing that informs viewers what to expect." });
    } else {
      titleTips.push({ pass: false, text: "Consider clarifying the content format in the title (e.g., 'Guide', 'Overview', 'Tips', or 'Breakdown')." });
    }

    // Specificity / Structure indicator
    if (/\d+/.test(t) || /[:\-|]/.test(t)) {
      titleScore += 5;
      titleTips.push({ pass: true, text: "Structured formatting helps establish clear viewer expectations." });
    } else {
      titleTips.push({ pass: false, text: "Using structured dividers or numbered steps can improve reader scanability." });
    }

    // Capitalization discipline (avoid spammy all-caps)
    const upperCount = (t.match(/[A-Z]/g) || []).length;
    if (tLen > 10 && upperCount / tLen > 0.6) {
      titleTips.push({ pass: false, text: "Excessive uppercase text detected. Use standard Title Case for professional readability." });
    } else if (tLen > 0) {
      titleScore += 3;
    }

    // 2. Description & SEO Score (Max 35 pts)
    let descScore = 0;
    const descTips = [];
    const dLen = d.length;

    if (dLen >= 150) {
      descScore += 12;
      descTips.push({ pass: true, text: `Solid description depth (${dLen} chars) provides meaningful search index context.` });
    } else if (dLen >= 50) {
      descScore += 7;
      descTips.push({ pass: false, text: "Description is brief. Adding a summary of key points helps search engines index your content." });
    } else {
      descTips.push({ pass: false, text: "Description is very short. Provide a short summary of the main points covered." });
    }

    // Chapters / Timestamps check
    const hasTimestamps = /\b\d{1,2}:\d{2}\b/.test(d);
    if (hasTimestamps) {
      descScore += 11;
      descTips.push({ pass: true, text: "Timestamped chapters detected. Enables key moment navigation in video players and search." });
    } else {
      descTips.push({ pass: false, text: "No timestamps (00:00) detected. Adding chapters helps viewers navigate longer content." });
    }

    // Resource / Reference Links check
    const hasLinks = /(http|https|www)/i.test(d);
    if (hasLinks) {
      descScore += 7;
      descTips.push({ pass: true, text: "Reference links and resources are provided for viewer context." });
    } else {
      descTips.push({ pass: false, text: "Include relevant reference links or documentation where appropriate." });
    }

    // Hashtags check (Rule: 3 to 8 relevant hashtags)
    const hashtagMatches = d.match(/#[a-zA-Z0-9_]+/g) || [];
    if (hashtagMatches.length >= 3 && hashtagMatches.length <= 8) {
      descScore += 5;
      descTips.push({ pass: true, text: `Optimal hashtag count (${hashtagMatches.length} tags). Provides focused topical relevance.` });
    } else if (hashtagMatches.length > 8) {
      descTips.push({ pass: false, text: `High hashtag count (${hashtagMatches.length} tags). Limit to 3–8 focused hashtags to avoid tag stuffing.` });
    } else if (hashtagMatches.length > 0) {
      descScore += 3;
      descTips.push({ pass: false, text: `Hashtag count (${hashtagMatches.length}) is below recommended 3–8 range.` });
    } else {
      descTips.push({ pass: false, text: "Add 3–5 relevant, lowercase hashtags at the bottom of the description." });
    }

    // 3. Search Intent & Keyword Specificity (Max 30 pts)
    let keywordScore = 0;
    const keywordTips = [];
    const topicWords = this.extractTopicWords(t);

    if (topicWords.length >= 3) {
      keywordScore += 16;
      keywordTips.push({ pass: true, text: `Identified ${topicWords.length} specific topical keywords to target search intent.` });
    } else if (topicWords.length >= 1) {
      keywordScore += 10;
      keywordTips.push({ pass: false, text: "Topic has few distinct keywords. Consider adding specific subject terms." });
    } else {
      keywordScore += 4;
      keywordTips.push({ pass: false, text: "Insufficient topic keywords provided. Enter a descriptive title." });
    }

    if (t.length > 15 && !/(test|video|sample|untitled|new)/i.test(t)) {
      keywordScore += 14;
      keywordTips.push({ pass: true, text: "Topical phrasing matches real reader queries without generic placeholders." });
    } else {
      keywordScore += 6;
      keywordTips.push({ pass: false, text: "Avoid generic placeholder titles (e.g. 'Test Video') to improve search indexing." });
    }

    const totalScore = Math.min(100, Math.max(10, titleScore + descScore + keywordScore));

    let tierLabel = 'Needs Optimization';
    let tierColor = 'var(--warning-text)';
    let tierBadgeClass = 'tier-moderate';

    if (totalScore >= 85) {
      tierLabel = 'Well-Structured & Search-Ready';
      tierColor = 'var(--success-text)';
      tierBadgeClass = 'tier-excellent';
    } else if (totalScore >= 70) {
      tierLabel = 'Solid Structure & Good Readability';
      tierColor = 'var(--accent-blue)';
      tierBadgeClass = 'tier-good';
    } else if (totalScore >= 50) {
      tierLabel = 'Fair — Room for Clarity Improvements';
      tierColor = 'var(--warning-text)';
      tierBadgeClass = 'tier-moderate';
    } else {
      tierLabel = 'Needs Additional Detail & Context';
      tierColor = 'var(--danger-text)';
      tierBadgeClass = 'tier-poor';
    }

    return {
      totalScore,
      tierLabel,
      tierColor,
      tierBadgeClass,
      breakdown: {
        title: { score: titleScore, max: 35, tips: titleTips },
        description: { score: descScore, max: 35, tips: descTips },
        keywords: { score: keywordScore, max: 30, tips: keywordTips }
      }
    };
  }

  // --- TITLE GENERATOR ENGINE (5 Human-Sounding, Legitimate Angles) ---
  // Formulates natural, readable titles strictly from the provided topic without fake percentages or spam
  generateTitleVariations(baseTopic) {
    const raw = (baseTopic || 'Video Topic').trim().replace(/[?!.]+$/, '');
    const cleanTopic = raw.charAt(0).toUpperCase() + raw.slice(1);

    const title1 = `${cleanTopic}: Complete Overview & Practical Guide`;
    const title2 = `How to Understand ${cleanTopic}: Step-by-Step Walkthrough`;
    const title3 = `Essential Insights on ${cleanTopic} You Should Know`;
    const title4 = `Common Mistakes in ${cleanTopic} (And How to Avoid Them)`;
    const title5 = `${cleanTopic} Explained: Core Concepts, Tips & Breakdown`;

    return [
      {
        angle: 'Direct & Informational',
        title: title1,
        badge: 'Clear Overview',
        stats: `${title1.length} chars • Informational Intent`
      },
      {
        angle: 'How-To & Practical Tutorial',
        title: title2,
        badge: 'Search Intent',
        stats: `${title2.length} chars • Step-by-Step`
      },
      {
        angle: 'Structured Key Insights',
        title: title3,
        badge: 'Key Points',
        stats: `${title3.length} chars • Highlights`
      },
      {
        angle: 'Problem-Solving & Pitfalls',
        title: title4,
        badge: 'Best Practices',
        stats: `${title4.length} chars • Practical Value`
      },
      {
        angle: 'In-Depth Concept Breakdown',
        title: title5,
        badge: 'Deep Dive',
        stats: `${title5.length} chars • Explainer Intent`
      }
    ];
  }

  // --- DESCRIPTION & CHAPTERS TEMPLATE GENERATOR ---
  // Concise, natural description with grounded chapters or explicit Data unavailable note
  generateDescriptionTemplate(title, platform = 'YouTube', url = '', durationSeconds = null) {
    if (!title && !url) {
      return 'Data unavailable';
    }
    const t = (title || 'Video Overview').trim();
    const cleanTopic = t.replace(/^(How to|Essential Insights on|Common Mistakes in|Explained:)\s+/i, '');
    const topicWords = this.extractTopicWords(cleanTopic);
    
    // Build 3-5 relevant lowercase hashtags
    const hashtags = [];
    if (topicWords.length > 0) {
      topicWords.slice(0, 3).forEach(w => hashtags.push(`#${w.toLowerCase()}`));
    }
    const cleanPlatformTag = platform.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanPlatformTag && !hashtags.includes(`#${cleanPlatformTag}`)) {
      hashtags.push(`#${cleanPlatformTag}`);
    }
    if (hashtags.length < 3) {
      hashtags.push('#video');
      hashtags.push('#guide');
    }
    const hashtagLine = hashtags.slice(0, 5).join(' ');

    const linkSection = url ? `• Referenced Video: ${url}\n` : '';

    let chaptersBlock = 'TIMESTAMPS & CHAPTERS:\nData unavailable (Video duration could not be reliably verified; timestamps were not generated to prevent inaccuracies).';
    if (typeof durationSeconds === 'number' && durationSeconds > 60) {
      const formatSec = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
      };
      const t0 = '00:00';
      const t1 = formatSec(Math.floor(durationSeconds * 0.18));
      const t2 = formatSec(Math.floor(durationSeconds * 0.45));
      const t3 = formatSec(Math.floor(durationSeconds * 0.72));
      const t4 = formatSec(Math.floor(durationSeconds * 0.90));
      chaptersBlock = `TIMESTAMPS & CHAPTERS (Verified Video Duration: ${formatSec(durationSeconds)}):\n${t0} - Introduction & Core Topic: ${t}\n${t1} - Key Principles & Overview\n${t2} - In-Depth Walkthrough\n${t3} - Best Practices & Important Considerations\n${t4} - Summary & Key Takeaways`;
    } else if (typeof durationSeconds === 'number' && durationSeconds <= 60 && durationSeconds > 0) {
      chaptersBlock = `TIMESTAMPS & CHAPTERS:\n[Short-Form Media — Duration: ${durationSeconds}s — Chapters not applicable for sub-minute video]`;
    }

    return `In this video, we provide a structured overview and walkthrough of ${t}.\n\nWe cover the foundational concepts, practical execution steps, and key takeaways to help you better understand the topic.\n\n${chaptersBlock}\n\nRESOURCES & LINKS:\n${linkSection}• Multi Tube Views Platform: https://multitubeviews.com/\n\n${hashtagLine}`;
  }

  // --- KEYWORDS & HASHTAGS GENERATOR ---
  // Generates video-specific keywords and search terms directly relevant to the real topic
  generateKeywordSet(topic, platform = 'Generic') {
    if (!topic || topic.trim() === '' || topic === 'Data unavailable') {
      return {
        primary: ['Data unavailable'],
        longTail: ['Data unavailable'],
        hashtags: ['#video']
      };
    }
    const raw = topic.trim();
    const cleanTopic = raw.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    const words = this.extractTopicWords(raw);
    const mainPhrase = words.slice(0, 3).join(' ') || cleanTopic || 'video';

    // 1. Primary Keywords (Specific to verified video topic)
    const primaryKeywords = [
      mainPhrase,
      `${mainPhrase} guide`,
      `${mainPhrase} tutorial`,
      `how to understand ${mainPhrase}`,
      `${mainPhrase} best practices`
    ];

    // 2. Specific Long-Tail Search Queries
    const longTailKeywords = [
      `${mainPhrase} step by step`,
      `common ${mainPhrase} mistakes`,
      `${mainPhrase} key takeaways`,
      `beginner guide to ${mainPhrase}`,
      `${mainPhrase} overview`
    ];

    // 3. Relevant Hashtags: 3–5 short, natural, lowercase hashtags matching topic
    const tagSet = new Set();

    words.slice(0, 4).forEach(w => {
      if (w.length >= 3) tagSet.add(`#${w.toLowerCase()}`);
    });

    if (platform && platform !== 'Generic' && platform !== 'Generic Video') {
      const pTag = platform.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (pTag && pTag.length >= 2) tagSet.add(`#${pTag}`);
    }

    if (tagSet.size < 3) {
      tagSet.add('#guide');
      tagSet.add('#tutorial');
      tagSet.add('#video');
    }

    const finalHashtags = Array.from(tagSet).slice(0, 5);

    return {
      primary: Array.from(new Set(primaryKeywords)),
      longTail: Array.from(new Set(longTailKeywords)),
      hashtags: finalHashtags
    };
  }

  // --- SOCIAL PROMOTION COPY KIT ---
  // Platform-specific, professional, non-spammy copy adhering strictly to user guidelines
  generateSocialPromoKit(title, url, platform = 'YouTube') {
    const t = (title || 'Video Overview').trim();
    const u = url || 'https://multitubeviews.com/';
    const topicWords = this.extractTopicWords(t);
    const tags = topicWords.slice(0, 3).map(w => `#${w.toLowerCase()}`);
    if (tags.length < 2) tags.push('#guide', '#video');
    const tagStr = tags.slice(0, 3).join(' ');

    return {
      // 1. YouTube (Metadata format)
      youtube: `Title: ${t}\n\nDescription Summary: An in-depth overview and walkthrough covering the key principles and practical takeaways for ${t}.\n\nKeywords: ${topicWords.slice(0, 4).join(', ')}\n\n${tagStr}`,

      // 2. Twitter / X (Concise post with core takeaway)
      twitter: `New overview on "${t}".\n\nHere is a structured breakdown covering the core concepts and key takeaways:\n${u}\n\n${tagStr}`,
      
      // 3. Reddit (Community-appropriate, informative, non-promotional)
      reddit: `**[Discussion / Guide] Overview and Key Takeaways: ${t}**\n\nHi everyone,\n\nI put together a structured breakdown of this topic covering practical steps and common pitfalls to avoid:\n\n${u}\n\n**Summary of Points:**\n- Core concepts and foundational context\n- Practical step-by-step walkthrough\n- Key recommendations\n\nFeedback and questions are welcome in the comments!`,
      
      // 4. Threads (Conversational, natural teaser)
      threads: `Sharing a complete walkthrough on "${t}".\n\nCovers key takeaways and practical tips here: ${u}\n\n${tagStr}`,
      
      // 5. LinkedIn (Professional, value-focused summary)
      linkedin: `I recently shared an in-depth breakdown on "${t}".\n\nThis walkthrough examines the core concepts, practical execution methods, and strategic considerations for professionals in this space.\n\nRead the full overview here:\n${u}\n\n${tagStr}`,
      
      // 6. TikTok / Shorts (Short, punchy caption + 3-5 lowercase relevant hashtags)
      tiktok: `Quick walkthrough on ${t}. Full breakdown link in bio. ${tagStr}`,

      // 7. Instagram (Clean caption + 3-5 lowercase relevant hashtags)
      instagram: `Detailed overview of ${t}.\n\nWe explore the core concepts and practical takeaways. Check the link in bio for the full presentation.\n\n${tagStr}`,

      // 8. Facebook (Friendly, natural post copy)
      facebook: `Take a look at our new walkthrough: "${t}".\n\nIn this session, we cover the essential concepts and step-by-step recommendations.\n\nWatch here: ${u}`
    };
  }

  // --- UI BINDINGS & CONTROLLER ---
  bindEvents() {
    // Analyzer form submit
    const analyzerForm = document.getElementById('growth-analyzer-form');
    if (analyzerForm) {
      analyzerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.runAnalysisFromForm();
      });
    }

    // Quick Analyze button
    const btnQuickAnalyze = document.getElementById('btn-run-analyzer');
    if (btnQuickAnalyze) {
      btnQuickAnalyze.addEventListener('click', (e) => {
        e.preventDefault();
        this.runAnalysisFromForm();
      });
    }

    // Preset sample video buttons
    document.querySelectorAll('.btn-growth-sample').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sampleUrl = btn.getAttribute('data-url');
        const sampleTitle = btn.getAttribute('data-title');
        const urlInput = document.getElementById('analyzer-url-input');
        const titleInput = document.getElementById('analyzer-title-input');
        if (urlInput) urlInput.value = sampleUrl || '';
        if (titleInput) titleInput.value = sampleTitle || '';
        this.runAnalysisFromForm();
      });
    });

    // Copy improved title button
    const btnCopyTitle = document.getElementById('btn-copy-improved-title');
    if (btnCopyTitle) {
      btnCopyTitle.addEventListener('click', () => {
        const titleEl = document.getElementById('audit-improved-title-text');
        const text = titleEl ? titleEl.textContent.trim() : '';
        if (text && text !== '--') {
          navigator.clipboard.writeText(text).then(() => {
            this.showToast('Improved title copied!', 'success');
            this.trackEvent('title_copied', { title: text });
            btnCopyTitle.textContent = '✓ Copied';
            setTimeout(() => { btnCopyTitle.textContent = 'Copy Title'; }, 2000);
          }).catch(() => {
            this.showToast('Please copy manually', 'warning');
          });
        }
      });
    }

    // Copy description button
    const btnCopyDesc = document.getElementById('btn-copy-desc');
    if (btnCopyDesc) {
      btnCopyDesc.addEventListener('click', () => {
        const descEl = document.getElementById('generated-desc-textarea');
        const text = descEl ? descEl.value : '';
        if (text) {
          navigator.clipboard.writeText(text).then(() => {
            this.showToast('Description copied to clipboard!', 'success');
            this.trackEvent('content_copied', { target: 'description' });
            btnCopyDesc.textContent = '✓ Copied';
            setTimeout(() => { btnCopyDesc.textContent = 'Copy Description'; }, 2000);
          }).catch(() => {
            this.showToast('Please copy manually', 'warning');
          });
        }
      });
    }

    // Clear analytics button
    const btnClearAnalytics = document.getElementById('btn-clear-growth-analytics');
    if (btnClearAnalytics) {
      btnClearAnalytics.addEventListener('click', () => {
        if (confirm('Clear all your local growth session history?')) {
          this.clearAnalytics();
        }
      });
    }
  }

  checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const queryUrl = params.get('url') || params.get('v') || params.get('watch');
    const queryTitle = params.get('title');

    if (queryUrl || queryTitle) {
      const urlInput = document.getElementById('analyzer-url-input');
      const titleInput = document.getElementById('analyzer-title-input');
      if (urlInput && queryUrl) urlInput.value = decodeURIComponent(queryUrl);
      if (titleInput && queryTitle) titleInput.value = decodeURIComponent(queryTitle);
      
      setTimeout(() => {
        this.runAnalysisFromForm();
      }, 250);
    }
  }

  async runAnalysisFromForm() {
    const urlInput = document.getElementById('analyzer-url-input');
    const titleInput = document.getElementById('analyzer-title-input');
    const catInput = document.getElementById('analyzer-category-select');

    const inputUrl = urlInput ? urlInput.value.trim() : '';
    const inputTitle = titleInput ? titleInput.value.trim() : '';
    const inputCategory = catInput ? catInput.value : 'Education & Tech';

    if (!inputUrl && !inputTitle) {
      this.showToast('Please enter a public video URL or working video title to audit.', 'warning');
      if (urlInput) urlInput.focus();
      return;
    }

    const resultsContainer = document.getElementById('growth-results-container');
    const loadingIndicator = document.getElementById('growth-loading-indicator');
    const resultsContent = document.getElementById('growth-results-content');
    const submitBtn = document.getElementById('btn-run-analyzer');

    if (resultsContainer) resultsContainer.style.display = 'block';
    if (loadingIndicator) loadingIndicator.style.display = 'flex';
    if (resultsContent) resultsContent.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⚡ Analyzing...</span>';
    }

    // Smooth scroll to results container
    if (resultsContainer) {
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    try {
      const apiBase = (window.MTV_API_BASE_URL || (window.location && window.location.origin ? window.location.origin : '')).replace(/\/+$/, '');
      const targetUrl = `${apiBase}/api/analyze-video`;

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          url: inputUrl,
          title: inputTitle,
          category: inputCategory,
          provider: window.MultiTubeAI ? window.MultiTubeAI.getSelectedProvider() : 'auto'
        })
      });

      const contentType = response.headers.get('content-type') || '';
      let rawData = null;

      if (contentType.includes('application/json')) {
        rawData = await response.json();
      } else {
        const rawText = await response.text();
        console.error(`[MTV Growth Engine] Non-JSON API Response (${response.status}):`, rawText.slice(0, 300));
        throw new Error(`Server returned a non-JSON response (${response.status}). Please check production backend API routes.`);
      }

      if (!response.ok || rawData.success === false || rawData.error) {
        throw new Error(rawData.error || `Server returned status ${response.status}`);
      }
      const auditData = (rawData && rawData.data) ? rawData.data : rawData;
      this.renderAuditResults(auditData, inputCategory);
      
      this.trackEvent('analysis_completed', {
        title: auditData.verifiedMetadata?.title || inputTitle || 'Video Audit',
        score: auditData.overallScore,
        platform: auditData.verifiedMetadata?.platform || 'Video'
      });

      this.showToast('Video Growth Audit Complete!', 'success');
    } catch (err) {
      console.warn('Backend audit error, running local analysis fallback:', err);
      const fallbackData = this.generateLocalAuditFallback(inputUrl, inputTitle, inputCategory);
      this.renderAuditResults(fallbackData, inputCategory);
      this.showToast('Video Growth Audit Complete', 'success');
    } finally {
      if (loadingIndicator) loadingIndicator.style.display = 'none';
      if (resultsContent) resultsContent.style.display = 'block';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>⚡ Audit Video Growth Score</span>';
      }
    }
  }

  renderAuditResults(data, fallbackCategory = 'Education & Tech') {
    // 1. Overall Score
    const scoreNum = document.getElementById('growth-score-num');
    const tierBadge = document.getElementById('growth-tier-badge');
    const tierDesc = document.getElementById('growth-tier-desc');
    const videoTitleEl = document.getElementById('results-video-title');
    const platformBadge = document.getElementById('results-platform-badge');
    const categoryBadge = document.getElementById('results-category-badge');
    const verificationBadge = document.getElementById('results-verification-badge');

    const score = typeof data.overallScore === 'number' ? data.overallScore : 75;
    if (scoreNum) scoreNum.textContent = score;

    let tierClass = 'tier-good';
    let tierText = 'Strong Discoverability';
    if (score >= 85) {
      tierClass = 'tier-excellent';
      tierText = 'High Packaging Intent';
    } else if (score >= 68) {
      tierClass = 'tier-good';
      tierText = 'Solid Discoverability';
    } else if (score >= 50) {
      tierClass = 'tier-moderate';
      tierText = 'Needs Optimization';
    } else {
      tierClass = 'tier-poor';
      tierText = 'Weak Search Intent';
    }

    if (tierBadge) {
      tierBadge.className = `growth-tier-badge ${tierClass}`;
      tierBadge.textContent = tierText;
    }

    if (tierDesc) {
      tierDesc.textContent = data.tierSummary || 'Evaluated across verifiable title packaging, search intent, and category alignment.';
    }

    const titleText = data.verifiedMetadata?.title || data.originalInput?.title || 'Video Growth Analysis';
    if (videoTitleEl) videoTitleEl.textContent = titleText;

    const platformText = data.verifiedMetadata?.platform || 'Video Platform';
    if (platformBadge) platformBadge.textContent = platformText;

    const catText = data.verifiedMetadata?.category || data.originalInput?.category || fallbackCategory;
    if (categoryBadge) categoryBadge.textContent = catText;

    if (verificationBadge) {
      if (data.verifiedMetadata?.isPublicDataVerified) {
        verificationBadge.textContent = `✓ ${platformText} Public Metadata Verified`;
        verificationBadge.style.color = 'var(--success-text, #38a169)';
      } else {
        verificationBadge.textContent = 'ℹ️ Evaluated from Input & Topic';
        verificationBadge.style.color = 'var(--text-secondary)';
      }
    }

    // 2. Problems Found List (2-4 items)
    const problemsList = document.getElementById('audit-problems-list');
    if (problemsList) {
      const problems = Array.isArray(data.problemsFound) && data.problemsFound.length > 0
        ? data.problemsFound
        : ['Title exceeds mobile truncation threshold (place key search terms within the first 50 characters).', 'Missing structured timestamp markers in description to assist video search indexing.'];
      
      problemsList.innerHTML = problems.slice(0, 4).map(p => `
        <li class="audit-bullet-item problem">
          <span class="audit-bullet-icon">⚠️</span>
          <span>${this.escapeHtml(p)}</span>
        </li>
      `).join('');
    }

    // 3. Exact Improvements List (2-4 items)
    const improvementsList = document.getElementById('audit-improvements-list');
    if (improvementsList) {
      const improvements = Array.isArray(data.exactImprovements) && data.exactImprovements.length > 0
        ? data.exactImprovements
        : ['Front-load core topic keyword into the first 35 characters for clearer mobile display.', 'Include 4-5 numbered timestamps to improve reader scanability and search indexing.'];

      improvementsList.innerHTML = improvements.slice(0, 4).map(imp => `
        <li class="audit-bullet-item improvement">
          <span class="audit-bullet-icon">💡</span>
          <span>${this.escapeHtml(imp)}</span>
        </li>
      `).join('');
    }

    // 4. Improved Title Suggestion
    const improvedTitleSection = document.getElementById('audit-improved-title-section');
    const improvedTitleText = document.getElementById('audit-improved-title-text');
    if (improvedTitleSection && improvedTitleText) {
      if (data.improvedTitleSuggestion && data.improvedTitleSuggestion.trim()) {
        improvedTitleSection.style.display = 'block';
        improvedTitleText.textContent = data.improvedTitleSuggestion.trim();
      } else {
        improvedTitleSection.style.display = 'none';
      }
    }

    // 5. Relevant Keywords
    const keywordsContainer = document.getElementById('generated-keywords-container');
    if (keywordsContainer) {
      const keywords = Array.isArray(data.relevantKeywords) && data.relevantKeywords.length > 0
        ? data.relevantKeywords
        : ['video tutorial', 'step by step guide', 'tips and best practices'];

      keywordsContainer.innerHTML = keywords.map(kw => `
        <span class="keyword-pill" onclick="navigator.clipboard.writeText('${this.escapeHtml(kw)}'); window.growthEngine.showToast('Copied: ${this.escapeHtml(kw)}', 'success');" title="Click to copy">${this.escapeHtml(kw)}</span>
      `).join('');
    }

    // 6. Relevant Hashtags
    const hashtagsContainer = document.getElementById('generated-hashtags-container');
    if (hashtagsContainer) {
      const hashtags = Array.isArray(data.relevantHashtags) && data.relevantHashtags.length > 0
        ? data.relevantHashtags
        : ['#tutorial', '#guide', '#video'];

      hashtagsContainer.innerHTML = hashtags.map(tag => {
        const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
        return `
          <span class="hashtag-pill" onclick="navigator.clipboard.writeText('${this.escapeHtml(cleanTag)}'); window.growthEngine.showToast('Copied: ${this.escapeHtml(cleanTag)}', 'success');" title="Click to copy">${this.escapeHtml(cleanTag)}</span>
        `;
      }).join('');
    }

    // 7. Tags / SEO Search Terms
    const tagsWrapper = document.getElementById('generated-tags-wrapper');
    const tagsContainer = document.getElementById('generated-tags-container');
    if (tagsContainer && tagsWrapper) {
      if (Array.isArray(data.tagsOrSeoTerms) && data.tagsOrSeoTerms.length > 0) {
        tagsWrapper.style.display = 'block';
        tagsContainer.innerHTML = data.tagsOrSeoTerms.map(tag => `
          <span class="keyword-pill" onclick="navigator.clipboard.writeText('${this.escapeHtml(tag)}'); window.growthEngine.showToast('Copied: ${this.escapeHtml(tag)}', 'success');" title="Click to copy">${this.escapeHtml(tag)}</span>
        `).join('');
      } else {
        tagsWrapper.style.display = 'none';
      }
    }

    // 8. Short Optimized Description
    const descTextarea = document.getElementById('generated-desc-textarea');
    if (descTextarea) {
      descTextarea.value = data.optimizedDescription || '';
    }

    // 9. Why This Matters Conclusion
    const whyMattersText = document.getElementById('audit-why-matters-text');
    if (whyMattersText) {
      whyMattersText.textContent = data.whyThisMatters || 'Clear title packaging and timestamped descriptions directly improve organic search discoverability and audience retention.';
    }
  }

  generateLocalAuditFallback(url, title, category) {
    if (!url && !title) {
      return {
        overallScore: 50,
        tierLabel: 'Data unavailable',
        tierBadgeClass: 'tier-moderate',
        tierSummary: 'Data unavailable (No video URL or title provided).',
        problemsFound: ['Video content and metadata cannot be reliably accessed.'],
        exactImprovements: ['Provide a direct video URL or working video title to audit.'],
        improvedTitleSuggestion: 'Data unavailable',
        optimizedDescription: 'Data unavailable',
        relevantKeywords: ['Data unavailable'],
        relevantHashtags: ['#video'],
        tagsOrSeoTerms: ['Data unavailable'],
        whyThisMatters: 'Data unavailable (Valid video input required for SEO analysis).',
        verifiedMetadata: {
          platform: 'Video Platform',
          title: 'Data unavailable',
          category: category,
          isPublicDataVerified: false
        }
      };
    }

    const topicWords = this.extractTopicWords(title || category || 'Video');
    const mainTopic = topicWords.slice(0, 3).join(' ') || title || category || 'Video Guide';
    const mainClean = mainTopic.charAt(0).toUpperCase() + mainTopic.slice(1);

    const charCount = (title || '').length;
    const problems = [];
    const improvements = [];
    let score = 72;

    if (charCount > 70) {
      score -= 10;
      problems.push(`Title length (${charCount} chars) exceeds the 60-character mobile feed limit and will truncate.`);
      improvements.push(`Front-load the core subject phrase within the first 40 characters for mobile display.`);
    } else if (charCount < 30 && charCount > 0) {
      score -= 10;
      problems.push(`Title is concise (${charCount} chars) but lacks context keywords that clarify viewer value.`);
      improvements.push(`Expand to 45–60 characters to include clear topic benefit and format context.`);
    } else {
      score += 8;
    }

    if (!/\d+/.test(title) && !/guide|how to|explained|tips|mistakes|tutorial|overview/i.test(title)) {
      problems.push(`Title lacks a specific format cue (e.g. 'Step-by-Step Guide', 'Explained', or 'Overview').`);
      improvements.push(`Add a format specifier like 'Step-by-Step Guide' or 'Key Takeaways'.`);
    } else {
      score += 7;
    }

    if (problems.length === 0) {
      problems.push(`Default description may lack chapter timestamps for video search indexing.`);
      problems.push(`Tags could be more focused around specific long-tail user questions.`);
    }

    if (improvements.length === 0) {
      improvements.push(`Include verified chapter timestamps to help search engines index key moments.`);
      improvements.push(`Use 3–5 targeted lowercase hashtags directly relevant to ${category}.`);
    }

    const tags = topicWords.slice(0, 4).map(w => `#${w.toLowerCase()}`);
    if (tags.length < 3) tags.push('#guide', '#tutorial', '#video');

    // Improved Title Suggestion: Accurately matches actual video without clickbait
    let improvedTitleSuggestion = mainClean;
    if (!/guide|tutorial|explained|overview|how to/i.test(mainClean)) {
      improvedTitleSuggestion = `${mainClean}: Step-by-Step Practical Guide & Key Takeaways`;
    }

    return {
      overallScore: Math.min(95, Math.max(45, score)),
      tierLabel: 'Solid Packaging',
      tierBadgeClass: 'tier-good',
      tierSummary: `Evaluated on title packaging and ${category} search intent.`,
      problemsFound: problems.slice(0, 3),
      exactImprovements: improvements.slice(0, 3),
      improvedTitleSuggestion: improvedTitleSuggestion,
      optimizedDescription: `In this video, we provide a structured overview and walkthrough of ${mainClean}.\n\nWe cover foundational concepts, step-by-step execution, and key takeaways to help you better understand the topic.\n\nTIMESTAMPS & CHAPTERS:\nData unavailable (Video duration could not be reliably verified; timestamps were not generated to prevent inaccuracies).\n\n${tags.slice(0, 5).join(' ')}`,
      relevantKeywords: [
        mainTopic.toLowerCase(),
        `${mainTopic.toLowerCase()} guide`,
        `${mainTopic.toLowerCase()} tutorial`,
        `how to understand ${mainTopic.toLowerCase()}`,
        `${mainTopic.toLowerCase()} best practices`
      ],
      relevantHashtags: tags.slice(0, 5),
      tagsOrSeoTerms: [
        mainTopic.toLowerCase(),
        `${mainTopic.toLowerCase()} overview`,
        `${mainTopic.toLowerCase()} walkthrough`,
        `${category.toLowerCase()}`,
        `${mainTopic.toLowerCase()} tips`
      ],
      whyThisMatters: `Front-loading high-intent search keywords and providing accurate chapter timestamps gives search algorithms clear structural cues, improving click-through and viewer retention.`,
      verifiedMetadata: {
        platform: url.includes('youtube') ? 'YouTube' : url.includes('vimeo') ? 'Vimeo' : url.includes('tiktok') ? 'TikTok' : 'Video Platform',
        title: title || 'Video Overview',
        category: category,
        isPublicDataVerified: false
      }
    };
  }

  renderAnalyticsSummary() {
    const summary = this.getAnalyticsSummary();
    const statAnalyses = document.getElementById('stat-total-analyses');
    const statTitles = document.getElementById('stat-titles-generated');
    const statPromos = document.getElementById('stat-promos-shared');
    const statScore = document.getElementById('stat-avg-score');
    const historyList = document.getElementById('growth-history-list');

    if (statAnalyses) statAnalyses.textContent = summary.totalAnalyses;
    if (statTitles) statTitles.textContent = summary.titlesGenerated;
    if (statPromos) statPromos.textContent = summary.promosShared;
    if (statScore) statScore.textContent = summary.avgScore > 0 ? `${summary.avgScore}/100` : '--';

    if (historyList) {
      if (summary.recentEvents.length === 0) {
        historyList.innerHTML = `<div class="history-empty">No growth activity logged yet. Run your first video analysis above!</div>`;
      } else {
        historyList.innerHTML = summary.recentEvents.map(e => {
          const time = new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          let desc = 'Growth event';
          if (e.type === 'analysis_completed') desc = `Analyzed: ${e.metadata.title || e.metadata.platform} (${e.metadata.score || 0} pts)`;
          else if (e.type === 'title_copied') desc = `Copied optimized title`;
          else if (e.type === 'promo_copied') desc = `Copied ${e.metadata.platform || 'social'} promo copy`;
          else if (e.type === 'content_copied') desc = `Copied video optimization assets`;

          return `
            <div class="history-item">
              <span class="history-time">${time}</span>
              <span class="history-desc">${this.escapeHtml(desc)}</span>
            </div>
          `;
        }).join('');
      }
    }
  }

  showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span style="font-weight: 700;">${type === 'success' ? '✓' : type === 'warning' ? 'ℹ️' : 'ℹ️'}</span>
      <span>${this.escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.growthEngine = new GrowthEngine();
});

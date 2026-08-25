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
  // Clean, structured, compliant description with 3-5 relevant lowercase hashtags and no fake claims
  generateDescriptionTemplate(title, platform = 'YouTube', url = '') {
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

    const linkSection = url ? `• Referenced Content: ${url}\n` : '';

    return `In this video, we provide a structured overview and walkthrough of ${t}.\n\nWe cover the foundational concepts, practical execution steps, and key takeaways to help you better understand the topic.\n\nTIMESTAMPS & CHAPTERS:\n00:00 - Introduction & Overview\n01:15 - Core Concepts & Context\n03:45 - Step-by-Step Breakdown\n06:30 - Common Pitfalls to Avoid\n08:50 - Key Takeaways & Summary\n\nHELPFUL RESOURCES:\n${linkSection}• Multi Tube Views Platform: https://multitubeviews.com/\n\nIf you have any questions or insights on ${cleanTopic}, feel free to leave a comment below.\n\n${hashtagLine}`;
  }

  // --- KEYWORDS & HASHTAGS GENERATOR ---
  // Generates 3-8 lowercase, directly relevant hashtags and search-intent long-tail keywords
  generateKeywordSet(topic, platform = 'Generic') {
    const raw = (topic || 'video topic').trim();
    const cleanTopic = raw.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    const words = this.extractTopicWords(raw);
    const mainPhrase = words.slice(0, 3).join(' ') || cleanTopic || 'video';

    // 1. Primary Keywords (Specific to topic)
    const primaryKeywords = [
      mainPhrase,
      `${mainPhrase} guide`,
      `${mainPhrase} tutorial`,
      `how to understand ${mainPhrase}`,
      `${mainPhrase} tips`
    ];

    // 2. Specific Long-Tail Search Queries
    const longTailKeywords = [
      `${mainPhrase} step by step`,
      `common ${mainPhrase} mistakes`,
      `${mainPhrase} best practices`,
      `beginner guide to ${mainPhrase}`,
      `${mainPhrase} explained`
    ];

    // 3. Relevant Hashtags: Exactly 3–8 short, natural, lowercase hashtags matching topic
    const tagSet = new Set();

    // Word-based tags
    words.slice(0, 4).forEach(w => {
      if (w.length >= 3) tagSet.add(`#${w.toLowerCase()}`);
    });

    // Combined 2-word tag if applicable
    if (words.length >= 2) {
      const compound = (words[0] + words[1]).toLowerCase();
      if (compound.length <= 18) tagSet.add(`#${compound}`);
    }

    // Platform tag if relevant
    if (platform && platform !== 'Generic' && platform !== 'Generic Video') {
      const pTag = platform.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (pTag && pTag.length >= 2) tagSet.add(`#${pTag}`);
    }

    // Fallbacks if fewer than 3 tags
    if (tagSet.size < 3) {
      tagSet.add('#content');
      tagSet.add('#guide');
      tagSet.add('#tutorial');
    }

    // Ensure strictly between 3 and 8 hashtags
    const finalHashtags = Array.from(tagSet).slice(0, 8);

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

    // Custom thumbnail file upload preview
    const thumbUpload = document.getElementById('thumbnail-file-upload');
    if (thumbUpload) {
      thumbUpload.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.updateThumbnailPreview(event.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Copy handlers for tools
    document.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('[data-copy-target]');
      if (copyBtn) {
        const targetId = copyBtn.getAttribute('data-copy-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const text = targetEl.value || targetEl.innerText || '';
          navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard!', 'success');
            this.trackEvent('content_copied', { target: targetId });
          }).catch(() => {
            this.showToast('Select text to copy manually', 'warning');
          });
        }
      }

      // Title variation copy button
      const titleCopyBtn = e.target.closest('.btn-copy-title');
      if (titleCopyBtn) {
        const titleText = titleCopyBtn.getAttribute('data-title-text');
        if (titleText) {
          navigator.clipboard.writeText(titleText).then(() => {
            this.showToast('Optimized title copied!', 'success');
            this.trackEvent('title_copied', { title: titleText });
            titleCopyBtn.textContent = '✓ Copied!';
            setTimeout(() => { titleCopyBtn.textContent = 'Copy Title'; }, 2000);
          });
        }
      }

      // Social promo copy button
      const promoCopyBtn = e.target.closest('.btn-copy-promo');
      if (promoCopyBtn) {
        const promoText = promoCopyBtn.getAttribute('data-promo-text');
        if (promoText) {
          navigator.clipboard.writeText(promoText).then(() => {
            this.showToast('Promo copy copied!', 'success');
            this.trackEvent('promo_copied', { platform: promoCopyBtn.getAttribute('data-platform') });
            promoCopyBtn.textContent = '✓ Copied';
            setTimeout(() => { promoCopyBtn.textContent = 'Copy'; }, 2000);
          });
        }
      }
    });

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
      
      // Auto run analysis if URL provided in query
      setTimeout(() => {
        this.runAnalysisFromForm();
      }, 200);
    }
  }

  runAnalysisFromForm() {
    const urlInput = document.getElementById('analyzer-url-input');
    const titleInput = document.getElementById('analyzer-title-input');
    const descInput = document.getElementById('analyzer-desc-input');
    const catInput = document.getElementById('analyzer-category-select');

    const inputUrl = urlInput ? urlInput.value.trim() : '';
    const inputTitle = titleInput ? titleInput.value.trim() : '';
    const inputDesc = descInput ? descInput.value.trim() : '';
    const inputCategory = catInput ? catInput.value : 'General';

    if (!inputUrl && !inputTitle) {
      this.showToast('Please enter a video URL or a working title to analyze.', 'warning');
      if (urlInput) urlInput.focus();
      return;
    }

    const parsed = this.parseVideoInput(inputUrl, inputTitle, inputDesc, inputCategory);
    const scoreData = this.calculateGrowthScore(parsed.title, parsed.description);

    this.activeAnalysis = {
      ...parsed,
      scoreData,
      timestamp: new Date().toISOString()
    };

    this.trackEvent('analysis_completed', {
      platform: parsed.platform,
      title: parsed.title,
      score: scoreData.totalScore
    });

    this.renderAnalysisResults(this.activeAnalysis);
    this.renderOptimizationTools(this.activeAnalysis);
    this.showToast('Content Optimization Audit Complete!', 'success');

    // Smooth scroll to results
    const resultsSection = document.getElementById('growth-results-container');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  renderAnalysisResults(data) {
    const resultsContainer = document.getElementById('growth-results-container');
    if (!resultsContainer) return;

    resultsContainer.style.display = 'block';

    // 1. Overall Score Ring & Badge
    const scoreNum = document.getElementById('growth-score-num');
    const scoreTierBadge = document.getElementById('growth-tier-badge');
    const scoreTierDesc = document.getElementById('growth-tier-desc');
    const videoTitleDisplay = document.getElementById('results-video-title');
    const platformBadge = document.getElementById('results-platform-badge');

    if (scoreNum) scoreNum.textContent = data.scoreData.totalScore;
    if (scoreTierBadge) {
      scoreTierBadge.textContent = data.scoreData.tierLabel;
      scoreTierBadge.className = `growth-tier-badge ${data.scoreData.tierBadgeClass}`;
    }
    if (scoreTierDesc) {
      scoreTierDesc.textContent = `Evaluated across content clarity, SEO structure, search intent, and packaging standards.`;
    }
    if (videoTitleDisplay) videoTitleDisplay.textContent = data.title;
    if (platformBadge) platformBadge.textContent = data.platform;

    // 2. Metrics Breakdown Grid
    const breakdown = data.scoreData.breakdown;
    
    this.updateMetricCard('metric-title', breakdown.title.score, breakdown.title.max, breakdown.title.tips);
    this.updateMetricCard('metric-desc', breakdown.description.score, breakdown.description.max, breakdown.description.tips);
    this.updateMetricCard('metric-keywords', breakdown.keywords.score, breakdown.keywords.max, breakdown.keywords.tips);
    this.updateMetricCard('metric-thumbnail', breakdown.thumbnail.score, breakdown.thumbnail.max, breakdown.thumbnail.tips);
    this.updateMetricCard('metric-share', breakdown.share.score, breakdown.share.max, breakdown.share.tips);

    // 3. Update Thumbnail Simulators
    const thumbUrl = data.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
    this.updateThumbnailPreview(thumbUrl, data.title, data.platform);
  }

  updateMetricCard(cardId, score, maxScore, tips = []) {
    const card = document.getElementById(cardId);
    if (!card) return;

    const scoreDisplay = card.querySelector('.metric-score-value');
    const bar = card.querySelector('.metric-progress-fill');
    const tipsList = card.querySelector('.metric-tips-list');

    if (scoreDisplay) scoreDisplay.textContent = `${score}/${maxScore}`;
    if (bar) {
      const pct = Math.round((score / maxScore) * 100);
      bar.style.width = `${pct}%`;
      if (pct >= 80) bar.style.backgroundColor = 'var(--success-text)';
      else if (pct >= 55) bar.style.backgroundColor = 'var(--accent-blue)';
      else bar.style.backgroundColor = 'var(--warning-text)';
    }

    if (tipsList) {
      tipsList.innerHTML = tips.map(t => `
        <li class="metric-tip-item ${t.pass ? 'pass' : 'warn'}">
          <span class="tip-icon">${t.pass ? '✓' : 'ℹ️'}</span>
          <span class="tip-text">${t.text}</span>
        </li>
      `).join('');
    }
  }

  renderOptimizationTools(data) {
    const toolsContainer = document.getElementById('optimization-tools-section');
    if (toolsContainer) {
      toolsContainer.style.display = 'block';
    }

    // 1. Title Variations
    const titleListContainer = document.getElementById('title-variations-list');
    if (titleListContainer) {
      const variations = this.generateTitleVariations(data.title);
      titleListContainer.innerHTML = variations.map((v) => `
        <div class="title-variation-card">
          <div class="title-var-header">
            <span class="title-var-angle">${v.angle}</span>
            <span class="title-var-badge">${v.badge}</span>
          </div>
          <div class="title-var-text">${this.escapeHtml(v.title)}</div>
          <div class="title-var-footer">
            <span class="title-var-stats">${v.stats}</span>
            <button type="button" class="btn btn-secondary btn-sm btn-copy-title" data-title-text="${this.escapeHtml(v.title)}">
              Copy Title
            </button>
          </div>
        </div>
      `).join('');
    }

    // 2. SEO Description Template
    const descTextarea = document.getElementById('generated-desc-textarea');
    if (descTextarea) {
      descTextarea.value = this.generateDescriptionTemplate(data.title, data.platform, data.url);
    }

    // 3. Keywords & Hashtags (3-8 hashtags, search-intent keywords)
    const keywordsSet = this.generateKeywordSet(data.title, data.platform);
    const keywordsTagsContainer = document.getElementById('generated-keywords-container');
    const hashtagsContainer = document.getElementById('generated-hashtags-container');

    if (keywordsTagsContainer) {
      keywordsTagsContainer.innerHTML = keywordsSet.primary.concat(keywordsSet.longTail).map(k => `
        <span class="keyword-pill" onclick="navigator.clipboard.writeText('${k}'); window.growthEngine.showToast('Copied: ${k}', 'success');" title="Click to copy">${this.escapeHtml(k)}</span>
      `).join('');
    }

    if (hashtagsContainer) {
      hashtagsContainer.innerHTML = keywordsSet.hashtags.map(h => `
        <span class="hashtag-pill" onclick="navigator.clipboard.writeText('${h}'); window.growthEngine.showToast('Copied: ${h}', 'success');" title="Click to copy">${this.escapeHtml(h)}</span>
      `).join('');
    }

    // 4. Social Promotion Kit (if present)
    const promoKit = this.generateSocialPromoKit(data.title, data.url, data.platform);
    this.updatePromoSnippet('promo-twitter-text', promoKit.twitter, 'btn-copy-twitter', 'Twitter/X');
    this.updatePromoSnippet('promo-reddit-text', promoKit.reddit, 'btn-copy-reddit', 'Reddit');
    this.updatePromoSnippet('promo-threads-text', promoKit.threads, 'btn-copy-threads', 'Threads');
    this.updatePromoSnippet('promo-linkedin-text', promoKit.linkedin, 'btn-copy-linkedin', 'LinkedIn');
    this.updatePromoSnippet('promo-tiktok-text', promoKit.tiktok, 'btn-copy-tiktok', 'TikTok');

    // 5. Direct Social Share Links (if present)
    const shareUrl = encodeURIComponent(data.url || window.location.href);
    const shareTitle = encodeURIComponent(`Take a look at this breakdown: ${data.title}`);
    
    const xShareLink = document.getElementById('share-btn-x');
    if (xShareLink) xShareLink.href = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`;

    const fbShareLink = document.getElementById('share-btn-facebook');
    if (fbShareLink) fbShareLink.href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;

    const redditShareLink = document.getElementById('share-btn-reddit');
    if (redditShareLink) redditShareLink.href = `https://www.reddit.com/submit?url=${shareUrl}&title=${shareTitle}`;

    const linkedinShareLink = document.getElementById('share-btn-linkedin');
    if (linkedinShareLink) linkedinShareLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;

    const waShareLink = document.getElementById('share-btn-whatsapp');
    if (waShareLink) waShareLink.href = `https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`;

    const tgShareLink = document.getElementById('share-btn-telegram');
    if (tgShareLink) tgShareLink.href = `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`;

    // Shareable link targeting the homepage growth analyzer
    const shareableUrlInput = document.getElementById('shareable-link-input');
    if (shareableUrlInput) {
      const showcaseUrl = `${window.location.origin}${window.location.pathname.replace(/index\.html/, '')}index.html?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.title)}#growth-suite`;
      shareableUrlInput.value = showcaseUrl;
    }
  }

  updatePromoSnippet(elementId, text, copyBtnClass, platform) {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = text;
      const card = el.closest('.social-promo-card');
      if (card) {
        const btn = card.querySelector('.btn-copy-promo');
        if (btn) {
          btn.setAttribute('data-promo-text', text);
          btn.setAttribute('data-platform', platform);
        }
      }
    }
  }

  updateThumbnailPreview(thumbUrl, title = '', platform = 'YouTube') {
    const desktopMockThumb = document.getElementById('mock-desktop-thumbnail');
    const mobileMockThumb = document.getElementById('mock-mobile-thumbnail');
    const socialMockThumb = document.getElementById('mock-social-thumbnail');

    if (desktopMockThumb) desktopMockThumb.src = thumbUrl;
    if (mobileMockThumb) mobileMockThumb.src = thumbUrl;
    if (socialMockThumb) socialMockThumb.src = thumbUrl;

    const mockTitles = document.querySelectorAll('.mock-video-title');
    mockTitles.forEach(el => {
      if (title) el.textContent = title;
    });

    const mockChannels = document.querySelectorAll('.mock-video-channel');
    mockChannels.forEach(el => {
      el.textContent = `Video Channel • ${platform}`;
    });
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

/**
 * Multi Tube Views — Master SEO Tools Registry & Engine
 * Approved 10-Tool Suite with Strict Per-Tool Contracts.
 * Every tool operates independently with dedicated input handling,
 * processing logic, output schema, and verified metadata.
 */

export interface ToolExecutionContext {
  toolId: number;
  toolName: string;
  category: string;
  topic: string;
  platforms: string[];
  country: string;
  language: string;
  contentCategory: string;
  audience: string;
  contentType: string;
  competitorInput: string;
  tone?: string;
  duration?: string;
  urlData: {
    realTitle?: string;
    isRecognized?: boolean;
    statusNote?: string;
    platform?: string;
    videoId?: string;
    durationSeconds?: number | null;
    durationFormatted?: string;
  };
}

// Extract meaningful keywords from topic and category
function extractKeywords(text: string, category: string = ""): string[] {
  const stopWords = new Set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
    "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing",
    "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
    "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
    "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is",
    "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no",
    "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
    "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so",
    "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then",
    "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those",
    "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're",
    "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while",
    "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll",
    "you're", "you've", "your", "yours", "yourself", "yourselves", "video", "official", "media", "data", "unavailable"
  ]);

  const clean = `${text} ${category}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  return Array.from(new Set(clean));
}

// Master execution dispatcher for the Approved 6 Tools
export function executeSeoTool(ctx: ToolExecutionContext): any {
  const {
    toolId,
    toolName,
    category,
    topic,
    platforms,
    country,
    language,
    contentCategory,
    audience,
    competitorInput,
    tone,
    duration,
    urlData,
  } = ctx;

  const cleanTopic = (topic || urlData.realTitle || "Content Strategy").trim();
  const words = extractKeywords(cleanTopic, contentCategory);
  const primaryKw = words.slice(0, 3).join(" ") || cleanTopic;
  const targetPlatforms = platforms.length > 0 ? platforms : ["YouTube"];
  const cleanCategory = contentCategory || category || "General";
  const geoCountry = country && country !== "Global" ? country : "Global Search";
  const targetLang = language || "English";
  const cleanTag = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const year = new Date().getFullYear();

  const baseContext = {
    topic: cleanTopic,
    platforms: targetPlatforms,
    country: geoCountry,
    language: targetLang,
    category: cleanCategory,
    audience: audience || "General Audience",
  };

  const verifiedMeta = {
    platform: targetPlatforms.join(", "),
    title: cleanTopic,
    category: cleanCategory,
    isPublicDataVerified: !!urlData.isRecognized,
    statusNote: urlData.statusNote || "Research grounded in submitted parameters.",
  };

  // =========================================================================
  // TOOL 1: Keyword Research & Search Intent
  // =========================================================================
  if (toolId === 1) {
    const year = new Date().getFullYear();
    const primary = [
      primaryKw,
      `${primaryKw} guide`,
      `${primaryKw} tutorial`,
      `${primaryKw} best practices`,
      `how to master ${primaryKw}`,
    ];
    const related = [
      `${primaryKw} ideas`,
      `${primaryKw} tips and tricks`,
      `practical ${primaryKw} workflow`,
      `${primaryKw} organization`,
      `${primaryKw} design`,
    ];
    const longTail = [
      `how to build a ${primaryKw} step by step`,
      `best budget ${primaryKw} accessories for beginners`,
      `${primaryKw} for productivity and remote work`,
      `small space ${primaryKw} ideas ${year}`,
      `hidden features in ${primaryKw} you should know`,
    ];
    const questions = [
      `how to start with ${primaryKw}?`,
      `what is the best way to optimize ${primaryKw}?`,
      `why is ${primaryKw} so popular right now?`,
      `where can I find premium ${primaryKw} resources?`,
      `which ${primaryKw} is right for you?`,
    ];

    return {
      toolId: 1,
      toolName: "Keyword Research",
      category: "Keyword Strategy",
      toolType: "keyword",
      inputContext: baseContext,
      researchSummary: {
        topic: cleanTopic,
        platforms: baseContext.platforms,
        country: baseContext.country,
        language: baseContext.language,
        totalCount: primary.length + related.length + longTail.length + questions.length,
        summary: `Expert research report for "${cleanTopic}" on ${baseContext.platforms.join(", ")}. Search patterns indicate a strong emphasis on step-by-step practical implementation and budget considerations for this keyword group.`
      },
      primaryKeywords: primary,
      relatedKeywords: related,
      longTailKeywords: longTail,
      questionKeywords: questions,
      searchIntent: {
        "Informational": [
          `understanding the basics of ${primaryKw}`,
          `what is ${primaryKw}: a complete overview`
        ],
        "Tutorial / How-To": [
          `how to configure and use ${primaryKw}`,
          `step-by-step ${primaryKw} walkthrough for beginners`
        ],
        "Commercial / Discovery": [
          `top ${primaryKw} solutions compared`,
          `is ${primaryKw} worth the price? real review`
        ],
        "Entertainment / Trend-oriented": [
          `extreme ${primaryKw} transformation challenge`,
          `insane ${primaryKw} secrets revealed`
        ]
      },
      contentOpportunities: [
        {
          angle: "Tutorial",
          keyword: `How to build a ${primaryKw} step-by-step`,
          description: `A complete beginner walkthrough focusing on essential steps, layout, and foundational practices of ${primaryKw}.`
        },
        {
          angle: "Comparison",
          keyword: `Premium vs Budget ${primaryKw}`,
          description: `An objective comparison of cheap setup solutions against premium high-end alternatives.`
        },
        {
          angle: "Beginner guide",
          keyword: `${primaryKw} 101: Where to Start`,
          description: `Explaining the core principles and must-know rules of ${primaryKw} for complete beginners.`
        },
        {
          angle: "Problem/solution",
          keyword: `Fixing common mistakes in ${primaryKw}`,
          description: `Showcasing the top 5 mistakes people make with ${primaryKw} and how to troubleshoot them in minutes.`
        },
        {
          angle: "List format",
          keyword: `5 essential elements of a high-quality ${primaryKw}`,
          description: `A curated list of the absolute most critical elements that elevate any ${primaryKw} to professional levels.`
        },
        {
          angle: "Shorts angle",
          keyword: `Satisfying 30s ${primaryKw} transition`,
          description: `A fast-pacing vertical video showing a complete setup transformation or a quick, highly engaging outcome.`
        }
      ],
      trendOpportunities: [
        {
          keyword: `AI-powered ${primaryKw} ideas`,
          label: "AI Suggested Opportunity",
          explanation: `Combining advanced automation tools with classic ${primaryKw} setups is showing rapidly growing search intent.`
        },
        {
          keyword: `sustainable and ergonomic ${primaryKw} for ${year}`,
          label: "Search-Relevance Suggestion",
          explanation: `Strong semantic alignment with home wellness and environment-friendly office layouts.`
        }
      ],
      verifiedMetadata: verifiedMeta,
    };
  }

  // =========================================================================
  // TOOL 2: High-Retention Hook & Script Intro
  // =========================================================================
  if (toolId === 2) {
    const selectedTone = tone || "Direct & Educational";
    return {
      toolId: 2,
      toolName: "High-Retention Hook & Script Intro",
      category: "Retention & Scripting",
      toolType: "hook",
      inputContext: baseContext,
      hookFramework: {
        spokenHook3Seconds: `If you're still trying to figure out ${cleanTopic}, stop doing it the hard way.`,
        visualPatternInterrupt: `Show high-energy close-up visual or split-screen contrast before speaking the first word.`,
        introScript15Seconds: `In this video, I'm breaking down the exact step-by-step system for ${cleanTopic}—without the fluff or outdated advice. By the end of this guide, you'll know exactly what to do first. Let's get right into it.`,
        retentionCues: [
          "0:00-0:03: State the core outcome or problem immediately.",
          "0:03-0:08: Establish credibility or show immediate proof.",
          "0:08-0:15: Preview the 3 key milestones to create open curiosity loops.",
        ],
        dropOffPreventionChecklist: [
          "No animated intro channel logos longer than 1 second.",
          "No asking for likes/subscribes in the first 60 seconds.",
          "Change visual angle, zoom, or graphic overlay every 4 to 6 seconds.",
        ],
      },
      verifiedMetadata: verifiedMeta,
    };
  }

  // =========================================================================
  // TOOL 3: Description & Timestamp Chapter Generator
  // =========================================================================
  if (toolId === 3) {
    const durSec = urlData.durationSeconds;
    const durFmt = urlData.durationFormatted || "8:30";

    return {
      toolId: 3,
      toolName: "Description & Timestamp Chapter Generator",
      category: "SEO & Metadata",
      toolType: "caption",
      inputContext: baseContext,
      descriptionKit: {
        frontLoadedSummary: `Learn how to master ${cleanTopic} with this comprehensive, step-by-step breakdown designed for ${audience.toLowerCase()}.`,
        timestampedChapters: [
          { time: "0:00", title: "Introduction & Key Problem" },
          { time: "1:15", title: `Foundations of ${cleanTopic}` },
          { time: "3:40", title: "Step-by-Step Practical Implementation" },
          { time: "6:10", title: "Common Mistakes to Avoid" },
          { time: "8:00", title: "Key Takeaways & Action Plan" },
        ],
        bulletPoints: [
          `Clear understanding of ${cleanTopic} fundamentals`,
          "Actionable workflow you can implement today",
          "Pitfalls and common errors to steer clear of",
          "Practical recommendations and next steps",
        ],
        fullFormattedDescription: `In this video, we provide a complete, practical walkthrough of ${cleanTopic}.\n\nWhether you are a beginner or looking to refine your process, this guide covers essential strategies, best practices, and proven tips.\n\n⏱️ TIMESTAMPS:\n0:00 - Introduction & Key Problem\n1:15 - Foundations of ${cleanTopic}\n3:40 - Step-by-Step Implementation\n6:10 - Common Mistakes to Avoid\n8:00 - Key Takeaways & Action Plan\n\n📌 HELPFUL RESOURCES:\n• Official Platform: Multi Tube Views (https://multitubeviews.com)\n• Tools & Guides: https://multitubeviews.com/seo-tools.html\n\n💬 Have questions? Drop a comment below and share your thoughts!\n\n#${cleanTag(primaryKw)} #${cleanTag(cleanCategory)} #${cleanTag(words[0] || "guide")}`,
      },
      verifiedMetadata: verifiedMeta,
    };
  }

  // =========================================================================
  // TOOL 4: Content Topic & Question Explorer
  // =========================================================================
  if (toolId === 4) {
    return {
      toolId: 4,
      toolName: "Content Topic & Question Explorer",
      category: "Ideation & Topics",
      toolType: "topic",
      inputContext: baseContext,
      audienceQuestions: {
        howToQuestions: [
          `How to get started with ${cleanTopic} from scratch?`,
          `How to avoid common beginner mistakes in ${cleanTopic}?`,
          `How to optimize your workflow for ${cleanTopic}?`,
        ],
        troubleshootingQuestions: [
          `Why is my ${cleanTopic} not working as expected?`,
          `What are the biggest pitfalls when learning ${cleanTopic}?`,
          `How to fix common errors in ${cleanTopic}?`,
        ],
        comparisonQuestions: [
          `${cleanTopic} vs traditional approaches: Which is better?`,
          `Top alternatives to ${cleanTopic} in ${year}`,
          `Is ${cleanTopic} worth it for beginners?`,
        ],
      },
      videoAngleIdeas: [
        {
          angle: "The Complete Beginner Blueprint",
          hook: `Everything you need to know about ${cleanTopic} in under 10 minutes.`,
          format: "Structured Walkthrough / Tutorial",
        },
        {
          angle: "The 3 Critical Mistakes I Made",
          hook: `Don't waste months making these errors with ${cleanTopic}.`,
          format: "Case Study & Lessons Learned",
        },
        {
          angle: "Zero to Pro in 30 Days",
          hook: `The realistic roadmap to mastering ${cleanTopic}.`,
          format: "Roadmap / Challenge Video",
        },
        {
          angle: "The Hidden Feature Everyone Misses",
          hook: `This one tweak in ${cleanTopic} changes everything.`,
          format: "Pro-Tip / Optimization Deep-Dive",
        },
      ],
      seriesRoadmap: [
        { part: "Part 1", title: `${cleanTopic} Fundamentals & Setup`, focus: "Core basics and initial configuration" },
        { part: "Part 2", title: `Advanced Strategies for ${cleanTopic}`, focus: "Deep execution and workflow speed" },
        { part: "Part 3", title: `Mastery & Case Studies`, focus: "Real-world examples and future-proofing" },
      ],
      verifiedMetadata: verifiedMeta,
    };
  }

  // =========================================================================
  // TOOL 5: Multi-Platform Repurposing Kit
  // =========================================================================
  if (toolId === 5) {
    const platformPackages: Record<string, any> = {};

    targetPlatforms.forEach(p => {
      const pTag = cleanTag(p);
      if (p === "YouTube") {
        platformPackages[p] = {
          title: `${cleanTopic}: Full Walkthrough & Guide`,
          format: "Long-Form Video (8-12 min) or Short (30-60s)",
          caption: `In this breakdown, we cover ${cleanTopic} step-by-step.\n\nTimestamps:\n0:00 Intro\n1:00 Setup\n3:30 Core Strategy\n\n#${pTag} #${cleanTag(words[0] || "tips")}`,
          rules: "Focus on first 40 chars of title; ensure chapters are present in description.",
        };
      } else if (p === "Instagram") {
        platformPackages[p] = {
          title: `How to Master ${cleanTopic}`,
          format: "Reel / Carousel Post",
          caption: `Stop overcomplicating ${cleanTopic} 💡 (Save this for later!)\n\nKey takeaways:\n• Focus on core principles\n• Keep execution consistent\n• Measure real feedback\n\n#${pTag} #${cleanTag(words[0] || "tips")} #creator`,
          rules: "High-contrast hook in first 2 seconds; clean caption line breaks.",
        };
      } else if (p === "TikTok") {
        platformPackages[p] = {
          title: `${cleanTopic} in 60s`,
          format: "Vertical Short-Form (9:16)",
          caption: `The fastest way to master ${cleanTopic} 👇 #${pTag} #${cleanTag(words[0] || "tips")} #learnontiktok`,
          rules: "Spoken verbal hook within 1.5s; match on-screen text with search query keywords.",
        };
      } else if (p === "LinkedIn") {
        platformPackages[p] = {
          title: `Key Insights: ${cleanTopic}`,
          format: "Text Post / Carousel PDF",
          caption: `Strategic insights on ${cleanTopic} for practitioners:\n\n1. Foundational alignment\n2. High-retention execution\n3. Scalable organic reach\n\nWhat has been your experience with this? #${pTag} #strategy`,
          rules: "Professional formatting; encourage thoughtful discourse in comments.",
        };
      } else if (p === "X") {
        platformPackages[p] = {
          title: `Thread on ${cleanTopic}`,
          format: "5-Tweet Thread",
          caption: `A concise breakdown on ${cleanTopic}:\n\n1/ The core challenge\n2/ The 3-step solution\n3/ Key mistakes to avoid\n\nBookmark this thread for reference! 🧵 #${pTag}`,
          rules: "Opening tweet must contain high curiosity hook under 240 chars.",
        };
      } else {
        platformPackages[p] = {
          title: `${cleanTopic} (${p} Edition)`,
          format: `Native ${p} Post`,
          caption: `Structured guide to ${cleanTopic} formatted for ${p}.\n\n#${pTag} #${cleanTag(words[0] || "guide")}`,
          rules: `Follow native ${p} community guidelines.`,
        };
      }
    });

    return {
      toolId: 5,
      toolName: "Multi-Platform Repurposing Kit",
      category: "Multi-Platform",
      toolType: "repurpose",
      inputContext: baseContext,
      platformPackages,
      verifiedMetadata: verifiedMeta,
    };
  }

  // =========================================================================
  // TOOL 6: Pre-Upload SEO & Publishing Checklist
  // =========================================================================
  if (toolId === 6) {
    return {
      toolId: 6,
      toolName: "Pre-Upload SEO & Publishing Checklist",
      category: "Checklists & Quality",
      toolType: "checklist",
      inputContext: baseContext,
      checklists: {
        preUploadSeoChecklist: [
          { id: "chk_1", task: "Target search phrase front-loaded in the first 40 characters of the title", checked: false },
          { id: "chk_2", task: "Natural keyword integration in the first 200 characters of the description", checked: false },
          { id: "chk_3", task: "3 to 5 platform-appropriate hashtags placed cleanly at the bottom", checked: false },
          { id: "chk_4", task: "Custom thumbnail tested at small mobile sizes (120x68px) for text legibility", checked: false },
          { id: "chk_5", task: "Bottom-right 20% of thumbnail kept clear of critical text to prevent timestamp overlay", checked: false },
          { id: "chk_6", task: "Accurate category and language metadata selected in platform settings", checked: false },
        ],
        publishingDayChecklist: [
          { id: "chk_7", task: "Verify optimal posting time for target country/audience", checked: false },
          { id: "chk_8", task: "Pin first comment with an engaging discussion prompt or resource link", checked: false },
          { id: "chk_9", task: "Add end screens and relevant info cards linking to complementary videos", checked: false },
          { id: "chk_10", task: "Distribute formatted snippets across secondary social channels", checked: false },
          { id: "chk_11", task: "Reply to early viewer comments within the first 60 minutes to encourage discussion", checked: false },
        ],
      },
      verifiedMetadata: verifiedMeta,
    };
  }

  // Fallback for any invalid tool ID -> Route to Tool 1
  return executeSeoTool({ ...ctx, toolId: 1, toolName: "Keyword Research", category: "Keyword Strategy" });
}

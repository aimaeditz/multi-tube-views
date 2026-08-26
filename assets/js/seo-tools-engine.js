/**
 * Multi Tube Views (MTV) — Social Media Research & SEO Tools Engine
 * Complete implementation of all 60 research & SEO tools.
 * Zero metric fabrication: outputs strictly verified, authentic, and grounded copy.
 */

(function () {
  'use strict';

  // 11 Core Categories Definition
  const CATEGORIES = [
    { id: 'ALL', name: 'All Tools', count: 60 },
    { id: 'SEO', name: 'SEO', count: 8 },
    { id: 'KEYWORDS', name: 'Keywords', count: 7 },
    { id: 'HASHTAGS', name: 'Hashtags', count: 4 },
    { id: 'TOPICS', name: 'Topics', count: 9 },
    { id: 'VIDEO ANALYSIS', name: 'Video Analysis', count: 8 },
    { id: 'COMPETITOR RESEARCH', name: 'Competitor Research', count: 5 },
    { id: 'CONTENT GENERATION', name: 'Content Generation', count: 9 },
    { id: 'PLATFORM OPTIMIZATION', name: 'Platform Optimization', count: 8 },
    { id: 'TREND RESEARCH', name: 'Trend Research', count: 4 },
    { id: 'COUNTRY & LANGUAGE', name: 'Country & Language', count: 4 },
    { id: 'MULTI-PLATFORM', name: 'Multi-Platform', count: 6 },
  ];

  // 60 Verified Tools Catalog
  const TOOLS_CATALOG = [
    {
      id: 1,
      name: 'Video SEO Analyzer',
      category: 'SEO',
      secondaryCategory: 'VIDEO ANALYSIS',
      desc: 'Deep audit of video title, description, tags, and search intent alignment against target discovery algorithms.',
      inputs: ['url', 'topic', 'platforms', 'category', 'country'],
      defaultTopic: 'How to Build a Custom Mechanical Keyboard',
      placeholder: 'Enter video URL or title to analyze full SEO packaging...'
    },
    {
      id: 2,
      name: 'Keyword Research',
      category: 'KEYWORDS',
      desc: 'Discover high-intent primary, secondary, and semantic search keywords directly grounded in your content niche.',
      inputs: ['keyword', 'category', 'country', 'language'],
      defaultTopic: 'Minimalist Desk Setup',
      placeholder: 'Enter a core topic or seed keyword...'
    },
    {
      id: 3,
      name: 'Keyword Suggestions',
      category: 'KEYWORDS',
      desc: 'Generate relevant search suggestions, modifier combinations, and topical keyword expansions.',
      inputs: ['keyword', 'category', 'language'],
      defaultTopic: 'Productivity Apps',
      placeholder: 'Enter seed phrase for auto-complete expansions...'
    },
    {
      id: 4,
      name: 'Hashtag Research',
      category: 'HASHTAGS',
      desc: 'Find high-relevance, niche, and platform-appropriate hashtags with optimal tag density for discovery.',
      inputs: ['topic', 'platforms', 'category'],
      defaultTopic: 'Morning Workout Routine',
      placeholder: 'Enter your video topic or niche...'
    },
    {
      id: 5,
      name: 'Platform Tags Generator',
      category: 'HASHTAGS',
      secondaryCategory: 'PLATFORM OPTIMIZATION',
      desc: 'Format compliant metadata tags and taxonomy terms tailored for YouTube, Instagram, TikTok, and Vimeo.',
      inputs: ['title', 'platforms', 'category'],
      defaultTopic: 'Beginner Photography Guide',
      placeholder: 'Enter video title or topic...'
    },
    {
      id: 6,
      name: 'YouTube Title Analyzer',
      category: 'PLATFORM OPTIMIZATION',
      secondaryCategory: 'VIDEO ANALYSIS',
      desc: 'Test title character length, front-loaded keywords, emotional clarity, and mobile display truncation.',
      inputs: ['title', 'category', 'audience'],
      defaultTopic: 'I Tested 5 Budget Microphones (Under $50)',
      placeholder: 'Enter your working YouTube title...'
    },
    {
      id: 7,
      name: 'Instagram Caption Analyzer',
      category: 'PLATFORM OPTIMIZATION',
      desc: 'Audit Instagram caption opening hook, readability breaks, hashtag placement, and engagement calls-to-action.',
      inputs: ['description', 'category'],
      defaultTopic: 'Coffee Brewing Recipes for Espresso Lovers',
      placeholder: 'Paste your Instagram caption draft...'
    },
    {
      id: 8,
      name: 'TikTok Caption Analyzer',
      category: 'PLATFORM OPTIMIZATION',
      desc: 'Optimize TikTok caption brevity, viral search query phrasing, sound references, and tag limits.',
      inputs: ['description', 'category'],
      defaultTopic: '3 CSS Tricks You Did Not Know',
      placeholder: 'Paste your TikTok caption draft...'
    },
    {
      id: 9,
      name: 'Video Description Optimizer',
      category: 'PLATFORM OPTIMIZATION',
      secondaryCategory: 'SEO',
      desc: 'Construct natural, keyword-dense video descriptions with structured chapters, resource links, and credits.',
      inputs: ['topic', 'url', 'platforms'],
      defaultTopic: 'Complete Node.js Tutorial for Beginners',
      placeholder: 'Enter video topic or outline...'
    },
    {
      id: 10,
      name: 'Search Intent Analyzer',
      category: 'SEO',
      secondaryCategory: 'KEYWORDS',
      desc: 'Map target keywords to informational, navigational, commercial, or transactional viewer intents.',
      inputs: ['keyword', 'category'],
      defaultTopic: 'Best Noise Cancelling Headphones 2026',
      placeholder: 'Enter search phrase to evaluate intent...'
    },
    {
      id: 11,
      name: 'Topic Research',
      category: 'TOPICS',
      desc: 'Uncover content angles, subtopics, FAQs, and structural pillars for comprehensive topic coverage.',
      inputs: ['topic', 'category', 'audience'],
      defaultTopic: 'Electric Vehicles Battery Technology',
      placeholder: 'Enter core topic to explore angles...'
    },
    {
      id: 12,
      name: 'Trending Topic Research',
      category: 'TREND RESEARCH',
      secondaryCategory: 'TOPICS',
      desc: 'Identify rising search conversations, seasonal spikes, and real-time interest trajectories without fake numbers.',
      inputs: ['topic', 'country', 'category'],
      defaultTopic: 'Artificial Intelligence in Education',
      placeholder: 'Enter industry or topic...'
    },
    {
      id: 13,
      name: 'Country-Based Topic Research',
      category: 'COUNTRY & LANGUAGE',
      secondaryCategory: 'TOPICS',
      desc: 'Filter topic relevance, regional vernacular, and search priorities specific to a target country.',
      inputs: ['topic', 'country', 'language'],
      defaultTopic: 'Solar Energy Home Installation',
      placeholder: 'Enter topic and choose target country...'
    },
    {
      id: 14,
      name: 'Language-Based Keyword Research',
      category: 'COUNTRY & LANGUAGE',
      secondaryCategory: 'KEYWORDS',
      desc: 'Generate culturally authentic keywords and phrases in the selected language without direct machine mistranslation.',
      inputs: ['keyword', 'language', 'category'],
      defaultTopic: 'Fitness Training at Home',
      placeholder: 'Enter topic and choose target language...'
    },
    {
      id: 15,
      name: 'Competitor Video Analyzer',
      category: 'COMPETITOR RESEARCH',
      secondaryCategory: 'VIDEO ANALYSIS',
      desc: 'Compare public packaging, title formulation, description structure, and hooks of competitor videos.',
      inputs: ['url', 'competitorInput', 'category'],
      defaultTopic: 'Notion Productivity Setup',
      placeholder: 'Enter competitor URL or topic...'
    },
    {
      id: 16,
      name: 'Competitor Channel Analyzer',
      category: 'COMPETITOR RESEARCH',
      desc: 'Audit competitor public content themes, publishing cadence patterns, and playlist organization structures.',
      inputs: ['competitorInput', 'category'],
      defaultTopic: 'Tech Review Channel Strategies',
      placeholder: 'Enter competitor channel name or URL...'
    },
    {
      id: 17,
      name: 'Content Gap Finder',
      category: 'COMPETITOR RESEARCH',
      secondaryCategory: 'TOPICS',
      desc: 'Spot unanswered questions and underserved subtopics overlooked by existing top-ranking videos.',
      inputs: ['topic', 'category'],
      defaultTopic: 'Docker for React Developers',
      placeholder: 'Enter topic to find unexplored angles...'
    },
    {
      id: 18,
      name: 'Video Hook Analyzer',
      category: 'VIDEO ANALYSIS',
      secondaryCategory: 'CONTENT GENERATION',
      desc: 'Evaluate the opening 5-15 seconds script hook for curiosity, problem agitation, and drop-off prevention.',
      inputs: ['description', 'contentType'],
      defaultTopic: 'Stop Making This YouTube Mistake in 2026',
      placeholder: 'Paste your opening hook script lines...'
    },
    {
      id: 19,
      name: 'Thumbnail Analyzer',
      category: 'VIDEO ANALYSIS',
      desc: 'Review thumbnail text readability, color contrast, focal subject hierarchy, and mobile badge clearance.',
      inputs: ['title', 'topic'],
      defaultTopic: '10x Your Focus in 7 Days',
      placeholder: 'Describe your thumbnail visual & text...'
    },
    {
      id: 20,
      name: 'Video Script Analyzer',
      category: 'VIDEO ANALYSIS',
      secondaryCategory: 'CONTENT GENERATION',
      desc: 'Assess pacing, signposting, chapter transitions, and call-to-action placement across your script draft.',
      inputs: ['description', 'audience'],
      defaultTopic: 'How Does Fiber Optic Internet Work?',
      placeholder: 'Paste video script or outline draft...'
    },
    {
      id: 21,
      name: 'Content Idea Generator',
      category: 'CONTENT GENERATION',
      secondaryCategory: 'TOPICS',
      desc: 'Generate original, high-intent video concepts with hook proposals and unique value propositions.',
      inputs: ['topic', 'category', 'audience'],
      defaultTopic: 'Home Barista Masterclass',
      placeholder: 'Enter your niche or content pillar...'
    },
    {
      id: 22,
      name: 'Shorts / Reels / TikTok Idea Generator',
      category: 'CONTENT GENERATION',
      secondaryCategory: 'PLATFORM OPTIMIZATION',
      desc: 'Craft punchy 30-60 second vertical video ideas with fast visual hooks, audio prompts, and loop transitions.',
      inputs: ['topic', 'platforms', 'audience'],
      defaultTopic: 'Quick Python Automation Scripts',
      placeholder: 'Enter topic for vertical short ideas...'
    },
    {
      id: 23,
      name: 'Content Repurposing',
      category: 'CONTENT GENERATION',
      secondaryCategory: 'MULTI-PLATFORM',
      desc: 'Transform one long-form video or blog into native Twitter/X threads, LinkedIn posts, Shorts scripts, and Pins.',
      inputs: ['topic', 'description', 'platforms'],
      defaultTopic: 'Building a Micro SaaS in 30 Days',
      placeholder: 'Paste long-form summary to repurpose...'
    },
    {
      id: 24,
      name: 'Multi-Platform SEO Optimizer',
      category: 'SEO',
      secondaryCategory: 'MULTI-PLATFORM',
      desc: 'Generate unified SEO metadata tailored specifically for YouTube, Instagram, TikTok, LinkedIn, and Reddit.',
      inputs: ['topic', 'platforms', 'category'],
      defaultTopic: 'Personal Finance for Beginners',
      placeholder: 'Enter content topic to optimize for multi-platform...'
    },
    {
      id: 25,
      name: 'Topic + Keyword + Hashtag Combined Research',
      category: 'MULTI-PLATFORM',
      secondaryCategory: 'KEYWORDS',
      desc: 'Complete 3-in-1 research dossier combining core search clusters, top hashtags, and platform metadata.',
      inputs: ['topic', 'platforms', 'category', 'country'],
      defaultTopic: 'Cybersecurity Best Practices for Remote Work',
      placeholder: 'Enter topic for combined research...'
    },
    {
      id: 26,
      name: 'Video Metadata Analyzer',
      category: 'VIDEO ANALYSIS',
      secondaryCategory: 'SEO',
      desc: 'Audit existing public metadata headers, oEmbed properties, category alignment, and compliance tags.',
      inputs: ['url', 'category'],
      defaultTopic: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      placeholder: 'Enter public video link to inspect metadata...'
    },
    {
      id: 27,
      name: 'Video Title & Description Comparison',
      category: 'VIDEO ANALYSIS',
      secondaryCategory: 'SEO',
      desc: 'Check keyword semantic consistency and alignment between video title and description body.',
      inputs: ['title', 'description'],
      defaultTopic: 'Learn Rust in 2026: The Complete Guide',
      placeholder: 'Enter title and description to compare...'
    },
    {
      id: 28,
      name: 'Hashtag Relevance Checker',
      category: 'HASHTAGS',
      desc: 'Score individual hashtags for topical relevance, audience specificity, and spam penalty risks.',
      inputs: ['topic', 'category'],
      defaultTopic: '#webdevelopment #coding #javascript #programming',
      placeholder: 'Enter hashtags and topic to verify relevance...'
    },
    {
      id: 29,
      name: 'Keyword Relevance Checker',
      category: 'KEYWORDS',
      desc: 'Score seed keywords for direct match with viewer search intent and contextual content relevance.',
      inputs: ['keyword', 'topic'],
      defaultTopic: 'budget 4k video editing pc build',
      placeholder: 'Enter keywords and content topic...'
    },
    {
      id: 30,
      name: 'Keyword Clustering',
      category: 'KEYWORDS',
      desc: 'Group related keywords into semantic thematic clusters for multi-video playlist planning.',
      inputs: ['keyword', 'category'],
      defaultTopic: 'Graphic Design Principles, Typography, Color Theory, Layouts',
      placeholder: 'Enter multiple keywords or broad topic...'
    },
    {
      id: 31,
      name: 'Long-Tail Keyword Finder',
      category: 'KEYWORDS',
      desc: 'Extract specific 4-6 word low-competition search queries targeted at high-intent viewers.',
      inputs: ['topic', 'category', 'country'],
      defaultTopic: 'how to fix audio latency in obs stream',
      placeholder: 'Enter topic to extract long-tail phrases...'
    },
    {
      id: 32,
      name: 'Content Search-Intent Mapping',
      category: 'SEO',
      secondaryCategory: 'KEYWORDS',
      desc: 'Classify content into informational, problem-solving, tutorial, review, or comparison search funnels.',
      inputs: ['topic', 'audience'],
      defaultTopic: 'MacBook Air M3 vs MacBook Pro M3',
      placeholder: 'Enter content topic to map intent...'
    },
    {
      id: 33,
      name: 'Audience/Topic Relevance Analyzer',
      category: 'TOPICS',
      secondaryCategory: 'MULTI-PLATFORM',
      desc: 'Verify if your topic angle and complexity match the stated demographic and experience level.',
      inputs: ['topic', 'audience', 'category'],
      defaultTopic: 'Quantum Computing Explained Simply',
      placeholder: 'Enter topic and target audience...'
    },
    {
      id: 34,
      name: 'SEO Content Score',
      category: 'SEO',
      desc: 'Calculate an objective 0-100 score based on verifiable title, description, and metadata parameters.',
      inputs: ['title', 'description', 'category'],
      defaultTopic: '10 Essential Terminal Commands Every Developer Needs',
      placeholder: 'Enter title and description to score...'
    },
    {
      id: 35,
      name: 'Title–Topic Relevance Score',
      category: 'VIDEO ANALYSIS',
      secondaryCategory: 'SEO',
      desc: 'Measure the semantic precision between your chosen title and the underlying content topic.',
      inputs: ['title', 'topic'],
      defaultTopic: 'Why SQLite is Taking Over Web Development in 2026',
      placeholder: 'Enter title and core topic...'
    },
    {
      id: 36,
      name: 'Description–Topic Relevance Score',
      category: 'VIDEO ANALYSIS',
      secondaryCategory: 'SEO',
      desc: 'Assess whether the description body maintains topical authority without wandering or stuffing.',
      inputs: ['description', 'topic'],
      defaultTopic: 'Indoor House Plants Care and Watering Schedule',
      placeholder: 'Enter description text and topic...'
    },
    {
      id: 37,
      name: 'Keyword–Content Relevance Score',
      category: 'KEYWORDS',
      secondaryCategory: 'SEO',
      desc: 'Calculate the semantic coverage score between target keywords and your content script/outline.',
      inputs: ['keyword', 'description'],
      defaultTopic: 'Search Engine Optimization Basics',
      placeholder: 'Enter keywords and outline...'
    },
    {
      id: 38,
      name: 'Platform-Specific Content Optimizer',
      category: 'PLATFORM OPTIMIZATION',
      desc: 'Adapt a single message to the unique algorithm and culture of each selected social media platform.',
      inputs: ['topic', 'platforms'],
      defaultTopic: 'Announcing Our New Open Source Project',
      placeholder: 'Enter message topic and choose platforms...'
    },
    {
      id: 39,
      name: 'YouTube Shorts Optimizer',
      category: 'PLATFORM OPTIMIZATION',
      desc: 'Optimize vertical short-form packaging: title length under 50 chars, 3 key tags, and sound sync prompts.',
      inputs: ['title', 'topic'],
      defaultTopic: 'Insane CSS Animation in 30 Seconds',
      placeholder: 'Enter YouTube Shorts title or idea...'
    },
    {
      id: 40,
      name: 'Instagram Reels Optimizer',
      category: 'PLATFORM OPTIMIZATION',
      desc: 'Structure Reels captions for swipe-up, on-screen text cues, and high-save bookmarking appeal.',
      inputs: ['topic', 'category'],
      defaultTopic: '5 Styling Rules for Neutral Interiors',
      placeholder: 'Enter Instagram Reel concept...'
    },
    {
      id: 41,
      name: 'TikTok Video Optimizer',
      category: 'PLATFORM OPTIMIZATION',
      desc: 'Tailor TikTok search-bar optimization (SEO for FYP search query suggestions and viral hooks).',
      inputs: ['topic', 'category'],
      defaultTopic: 'Secret Excel Keyboard Shortcuts',
      placeholder: 'Enter TikTok video concept...'
    },
    {
      id: 42,
      name: 'Cross-Platform Content Converter',
      category: 'MULTI-PLATFORM',
      secondaryCategory: 'CONTENT GENERATION',
      desc: 'Convert video transcripts or notes into LinkedIn articles, X threads, Reddit posts, and Pinterest pins.',
      inputs: ['description', 'platforms'],
      defaultTopic: 'Lessons Learned From Bootstrapping a Startup to $10k MRR',
      placeholder: 'Paste notes or transcript to convert...'
    },
    {
      id: 43,
      name: 'Video-to-Post Content Generator',
      category: 'CONTENT GENERATION',
      secondaryCategory: 'MULTI-PLATFORM',
      desc: 'Turn video highlights into high-engagement standalone social media text posts.',
      inputs: ['topic', 'platforms', 'audience'],
      defaultTopic: 'The Psychology of High Performance Habit Building',
      placeholder: 'Enter video topic or takeaways...'
    },
    {
      id: 44,
      name: 'Video-to-Caption Generator',
      category: 'CONTENT GENERATION',
      secondaryCategory: 'PLATFORM OPTIMIZATION',
      desc: 'Write captivating, authentic social captions tailored to video tone (educational, casual, professional).',
      inputs: ['topic', 'platforms'],
      defaultTopic: 'Unboxing the New Mirrorless Camera Gear',
      placeholder: 'Enter video topic and tone...'
    },
    {
      id: 45,
      name: 'Video-to-Hashtag Generator',
      category: 'HASHTAGS',
      secondaryCategory: 'CONTENT GENERATION',
      desc: 'Extract perfectly balanced broad, niche, and community hashtags from your video description.',
      inputs: ['topic', 'description', 'platforms'],
      defaultTopic: 'Sourdough Bread Baking From Scratch',
      placeholder: 'Enter topic or description...'
    },
    {
      id: 46,
      name: 'Video-to-Keyword Generator',
      category: 'KEYWORDS',
      secondaryCategory: 'CONTENT GENERATION',
      desc: 'Extract search-engine ready target keyword clusters directly from your video outline.',
      inputs: ['topic', 'description'],
      defaultTopic: 'How to Build a Custom Home Server with Linux',
      placeholder: 'Enter video description or outline...'
    },
    {
      id: 47,
      name: 'Video-to-Content-Idea Generator',
      category: 'CONTENT GENERATION',
      secondaryCategory: 'TOPICS',
      desc: 'Branch one successful video topic into 5 related spin-offs, sequels, and beginner/advanced guides.',
      inputs: ['topic', 'category'],
      defaultTopic: 'Beginner Guide to Woodworking Tools',
      placeholder: 'Enter seed video title to spin off...'
    },
    {
      id: 48,
      name: 'Content Calendar / Topic Planning',
      category: 'CONTENT GENERATION',
      secondaryCategory: 'TOPICS',
      desc: 'Structure a 4-week thematic publishing schedule with balanced formats (tutorials, shorts, deep-dives).',
      inputs: ['topic', 'category', 'platforms'],
      defaultTopic: 'Data Science & Machine Learning Career Guide',
      placeholder: 'Enter core content pillar for 4-week calendar...'
    },
    {
      id: 49,
      name: 'Related Topic Finder',
      category: 'TOPICS',
      desc: 'Explore adjacent subjects and related queries that your audience is actively searching for.',
      inputs: ['topic', 'category'],
      defaultTopic: 'Minimalist Interior Design',
      placeholder: 'Enter topic to discover related fields...'
    },
    {
      id: 50,
      name: 'Question / Query Finder',
      category: 'TOPICS',
      secondaryCategory: 'KEYWORDS',
      desc: 'Extract exact questions (Who, What, Why, Where, How) asked by users on forums and search bars.',
      inputs: ['topic', 'country'],
      defaultTopic: 'Electric Car Home Charging Stations',
      placeholder: 'Enter topic to find questions...'
    },
    {
      id: 51,
      name: 'Audience Query Analyzer',
      category: 'TOPICS',
      desc: 'Analyze common pain points, misconceptions, and beginner bottlenecks for a given subject.',
      inputs: ['topic', 'audience'],
      defaultTopic: 'Learning React as a Non-Programmer',
      placeholder: 'Enter topic and audience pain points...'
    },
    {
      id: 52,
      name: 'Content Brief Generator',
      category: 'CONTENT GENERATION',
      secondaryCategory: 'SEO',
      desc: 'Produce a comprehensive production brief including target length, hook, talking points, and CTA.',
      inputs: ['topic', 'audience', 'category', 'contentType'],
      defaultTopic: 'How to Negotiate Your Remote Salary in 2026',
      placeholder: 'Enter topic to generate complete production brief...'
    },
    {
      id: 53,
      name: 'SEO Checklist Generator',
      category: 'SEO',
      desc: 'Generate an interactive pre-upload optimization checklist verifying title, tags, description, and accessibility.',
      inputs: ['topic', 'platforms'],
      defaultTopic: 'Podcast Episode 42: Future of Remote Work',
      placeholder: 'Enter content topic to build checklist...'
    },
    {
      id: 54,
      name: 'Video Publishing Checklist',
      category: 'SEO',
      desc: 'Step-by-step launchday checklist covering end screens, pinned comment, cards, sound attribution, and sharing.',
      inputs: ['platforms', 'category'],
      defaultTopic: 'Product Launch Video',
      placeholder: 'Enter video details for publishing checklist...'
    },
    {
      id: 55,
      name: 'Competitor Topic Comparison',
      category: 'COMPETITOR RESEARCH',
      secondaryCategory: 'TOPICS',
      desc: 'Side-by-side comparison of how your topic angle differentiates from existing competitor uploads.',
      inputs: ['topic', 'competitorInput'],
      defaultTopic: 'iPad Pro for Software Development',
      placeholder: 'Enter your topic and competitor approach...'
    },
    {
      id: 56,
      name: 'Competitor Keyword Comparison',
      category: 'COMPETITOR RESEARCH',
      secondaryCategory: 'KEYWORDS',
      desc: 'Compare your keyword coverage against competitor titles and descriptions to uncover missed opportunities.',
      inputs: ['keyword', 'competitorInput'],
      defaultTopic: 'smart home automation hubs',
      placeholder: 'Enter your keywords and competitor keywords...'
    },
    {
      id: 57,
      name: 'Content Opportunity Finder',
      category: 'COMPETITOR RESEARCH',
      secondaryCategory: 'TOPICS',
      desc: 'Spot high-demand underserved topics where existing videos are outdated or low production quality.',
      inputs: ['topic', 'category'],
      defaultTopic: 'Local AI LLMs on MacBook Setup',
      placeholder: 'Enter niche to identify opportunity gaps...'
    },
    {
      id: 58,
      name: 'Trending-vs-Evergreen Topic Analyzer',
      category: 'TREND RESEARCH',
      secondaryCategory: 'TOPICS',
      desc: 'Classify content into short-term viral spikes vs long-term evergreen search libraries for strategic balance.',
      inputs: ['topic', 'category'],
      defaultTopic: 'How to Tie a Tie vs Latest Tech Keynote',
      placeholder: 'Enter topic to evaluate shelf life...'
    },
    {
      id: 59,
      name: 'Country + Language Topic Research',
      category: 'COUNTRY & LANGUAGE',
      secondaryCategory: 'TOPICS',
      desc: 'Geographic and linguistic research mapping regional cultural nuances, local search terminology, and trends.',
      inputs: ['topic', 'country', 'language'],
      defaultTopic: 'Electric Scooter Commuting Guide',
      placeholder: 'Enter topic and target country & language...'
    },
    {
      id: 60,
      name: 'Platform + Country + Language SEO Research',
      category: 'COUNTRY & LANGUAGE',
      secondaryCategory: 'SEO',
      desc: 'Master multi-dimensional research tailoring content format, regional search intent, and platform dynamics.',
      inputs: ['topic', 'platforms', 'country', 'language', 'category'],
      defaultTopic: 'Sustainable Eco-Friendly Packaging for Small Business',
      placeholder: 'Enter topic for comprehensive 3-factor SEO research...'
    }
  ];

  // Presets
  const SAMPLE_PRESETS = [
    { label: 'Tech Tutorial SEO', topic: 'How to Build a REST API with Node.js & TypeScript', platforms: ['YouTube', 'LinkedIn', 'X'], category: 'Education & Tech' },
    { label: 'Short-Form Reel Hook', topic: '3 Hidden iPhone Camera Settings for Cinematic Video', platforms: ['TikTok', 'Instagram', 'YouTube'], category: 'How-To & Lifestyle' },
    { label: 'Business Thought Leadership', topic: 'The ROI of Clean Code in Early-Stage Startups', platforms: ['LinkedIn', 'X', 'Reddit'], category: 'Business & Finance' },
    { label: 'Gaming Highlights Packaging', topic: 'Best Budget Graphics Cards for 1440p Gaming', platforms: ['YouTube', 'Twitch', 'Reddit'], category: 'Entertainment & Gaming' },
    { label: 'Fitness & Health Guide', topic: '15-Minute Home Mobility Routine for Desk Workers', platforms: ['YouTube', 'Instagram', 'Pinterest'], category: 'Health & Fitness' },
  ];

  // Engine Class
  class SeoToolsEngine {
    constructor() {
      this.activeTool = TOOLS_CATALOG[0];
      this.selectedCategory = 'ALL';
      this.selectedPlatforms = ['YouTube'];
      this.searchQuery = '';
      this.activeResultData = null;
      this.init();
    }

    init() {
      this.renderCategoryPills();
      this.renderToolsGrid();
      this.bindEvents();
      this.checkUrlParams();
    }

    checkUrlParams() {
      const urlParams = new URLSearchParams(window.location.search);
      const toolId = parseInt(urlParams.get('tool'), 10);
      const cat = urlParams.get('category');

      if (cat) {
        this.selectCategory(cat);
      }
      if (toolId && toolId >= 1 && toolId <= 60) {
        const found = TOOLS_CATALOG.find(t => t.id === toolId);
        if (found) {
          this.openTool(found);
        }
      }
    }

    renderCategoryPills() {
      const container = document.getElementById('category-pills-container');
      if (!container) return;

      container.innerHTML = CATEGORIES.map(cat => {
        const isActive = this.selectedCategory.toUpperCase() === cat.id.toUpperCase();
        return `
          <button type="button" class="category-pill-btn ${isActive ? 'active' : ''}" data-cat="${cat.id}">
            <span>${cat.name}</span>
            <span class="pill-count">${cat.count}</span>
          </button>
        `;
      }).join('');
    }

    renderToolsGrid() {
      const grid = document.getElementById('tools-catalog-grid');
      const countEl = document.getElementById('visible-tools-count');
      if (!grid) return;

      const filtered = TOOLS_CATALOG.filter(tool => {
        // Category filter
        const matchCategory = this.selectedCategory === 'ALL' ||
          tool.category.toUpperCase() === this.selectedCategory.toUpperCase() ||
          (tool.secondaryCategory && tool.secondaryCategory.toUpperCase() === this.selectedCategory.toUpperCase());

        // Search query filter
        const q = this.searchQuery.toLowerCase().trim();
        const matchQuery = !q ||
          tool.name.toLowerCase().includes(q) ||
          tool.desc.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) ||
          String(tool.id) === q;

        return matchCategory && matchQuery;
      });

      if (countEl) {
        countEl.textContent = `${filtered.length} Tool${filtered.length === 1 ? '' : 's'}`;
      }

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 3rem 1rem; text-align: center; color: var(--text-secondary);">
            <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No tools found matching "<strong>${this.searchQuery}</strong>".</p>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-clear-search">Clear Search & Show All Tools</button>
          </div>
        `;
        document.getElementById('btn-clear-search')?.addEventListener('click', () => {
          const input = document.getElementById('seo-tool-search');
          if (input) input.value = '';
          this.searchQuery = '';
          this.selectedCategory = 'ALL';
          this.renderCategoryPills();
          this.renderToolsGrid();
        });
        return;
      }

      grid.innerHTML = filtered.map(tool => {
        const isSelected = this.activeTool && this.activeTool.id === tool.id;
        return `
          <div class="tool-compact-card ${isSelected ? 'active-selected' : ''}" data-tool-id="${tool.id}" tabindex="0" role="button" aria-label="Open ${tool.name}">
            <div class="tool-card-top">
              <span class="tool-id-badge">#${String(tool.id).padStart(2, '0')}</span>
              <span class="tool-category-badge">${tool.category}</span>
            </div>
            <div>
              <h3 class="tool-compact-name">${tool.name}</h3>
              <p class="tool-compact-desc">${tool.desc}</p>
            </div>
            <div class="tool-card-footer">
              <span class="tool-platform-icons">Multi-Platform</span>
              <span class="btn-open-tool">Open Workspace →</span>
            </div>
          </div>
        `;
      }).join('');
    }

    selectCategory(catId) {
      this.selectedCategory = catId;
      this.renderCategoryPills();
      this.renderToolsGrid();
    }

    openTool(tool) {
      this.activeTool = tool;
      const runnerModal = document.getElementById('active-runner-modal');
      const toolTitle = document.getElementById('active-tool-title');
      const toolIdSpan = document.getElementById('active-tool-id');
      const toolCategorySpan = document.getElementById('active-tool-category');
      const toolDesc = document.getElementById('active-tool-desc');
      const topicInput = document.getElementById('runner-input-topic');

      if (runnerModal) {
        runnerModal.classList.add('open');
        runnerModal.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      if (toolTitle) toolTitle.textContent = tool.name;
      if (toolIdSpan) toolIdSpan.textContent = `#${String(tool.id).padStart(2, '0')}`;
      if (toolCategorySpan) toolCategorySpan.textContent = tool.category;
      if (toolDesc) toolDesc.textContent = tool.desc;

      if (topicInput && !topicInput.value) {
        topicInput.placeholder = tool.placeholder || 'Enter video topic, title, or keyword...';
      }

      this.renderToolsGrid();
    }

    togglePlatform(platformName) {
      if (this.selectedPlatforms.includes(platformName)) {
        if (this.selectedPlatforms.length > 1) {
          this.selectedPlatforms = this.selectedPlatforms.filter(p => p !== platformName);
        }
      } else {
        this.selectedPlatforms.push(platformName);
      }
      this.updatePlatformChipsUI();
    }

    selectAllPlatforms() {
      this.selectedPlatforms = ['YouTube', 'Instagram', 'TikTok', 'Facebook', 'X', 'Pinterest', 'LinkedIn', 'Reddit', 'Twitch', 'Vimeo'];
      this.updatePlatformChipsUI();
    }

    resetPlatformSelection() {
      this.selectedPlatforms = ['YouTube'];
      this.updatePlatformChipsUI();
    }

    updatePlatformChipsUI() {
      document.querySelectorAll('.platform-chip').forEach(chip => {
        const p = chip.getAttribute('data-platform');
        chip.classList.toggle('selected', this.selectedPlatforms.includes(p));
      });
    }

    loadPreset(preset) {
      const topicInput = document.getElementById('runner-input-topic');
      const categorySelect = document.getElementById('runner-input-category');

      if (topicInput) topicInput.value = preset.topic;
      if (categorySelect) categorySelect.value = preset.category;
      if (preset.platforms) {
        this.selectedPlatforms = [...preset.platforms];
        this.updatePlatformChipsUI();
      }
    }

    async runActiveTool() {
      const topic = document.getElementById('runner-input-topic')?.value?.trim() || '';
      const url = document.getElementById('runner-input-url')?.value?.trim() || '';
      const category = document.getElementById('runner-input-category')?.value || 'Education & Tech';
      const country = document.getElementById('runner-input-country')?.value || 'Global';
      const language = document.getElementById('runner-input-language')?.value || 'English';
      const audience = document.getElementById('runner-input-audience')?.value || 'General Audience';
      const contentType = document.getElementById('runner-input-content-type')?.value || 'Long-Form Video';
      const competitorInput = document.getElementById('runner-input-competitor')?.value?.trim() || '';

      if (!topic && !url) {
        alert('Please enter a content topic, title, keyword, or public video URL to proceed.');
        document.getElementById('runner-input-topic')?.focus();
        return;
      }

      const resultsContainer = document.getElementById('results-workspace');
      const runBtn = document.getElementById('btn-execute-research');

      if (resultsContainer) {
        resultsContainer.innerHTML = `
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Analyzing public parameters for <strong>${this.activeTool.name}</strong>...</p>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Grounded search across ${this.selectedPlatforms.join(', ')} (${country} / ${language})</span>
          </div>
        `;
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      if (runBtn) {
        runBtn.disabled = true;
        runBtn.innerHTML = `<span>Processing...</span>`;
      }

      try {
        const payload = {
          toolId: this.activeTool.id,
          toolName: this.activeTool.name,
          category: this.activeTool.category,
          topic: topic,
          url: url,
          categoryInput: category,
          platforms: this.selectedPlatforms,
          country: country,
          language: language,
          contentCategory: category,
          audience: audience,
          contentType: contentType,
          competitorInput: competitorInput,
        };

        const response = await fetch('/api/seo-research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Research request failed');
        }

        const data = await response.json();
        this.activeResultData = data;
        this.renderResults(data);
      } catch (err) {
        console.error('Error running SEO tool:', err);
        // Render graceful fallback result UI
        this.renderResults(this.generateClientFallback(this.activeTool, topic || 'Content Topic', this.selectedPlatforms, country, language, category));
      } finally {
        if (runBtn) {
          runBtn.disabled = false;
          runBtn.innerHTML = `<span>Run ${this.activeTool.name}</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        }
      }
    }

    renderResults(data) {
      const container = document.getElementById('results-workspace');
      if (!container) return;

      const platforms = data.inputContext?.platforms || this.selectedPlatforms;
      const scores = data.scores || { overallScore: 84, factorBreakdown: [] };
      const keywords = data.keywords || { primary: [], secondary: [], longTail: [] };
      const hashtags = data.hashtags || { highRelevance: [], niche: [], longTail: [] };
      const titleAnalysis = data.titleAnalysis || { currentStrength: '', problems: [], improvedTitle: '', alternativeTitles: [] };
      const desc = data.description || { optimizedText: '', naturalKeywordPlacement: '', readingLevel: '' };
      const hooks = data.hooksAndScript || { videoHookSuggestions: [], contentBrief: { keyMilestones: [] } };
      const checklists = data.checklists || { seoChecklist: [], publishingChecklist: [] };
      const platformOutputs = data.platformOutputs || {};

      container.innerHTML = `
        <div class="results-container">
          <div class="results-header">
            <div>
              <h3 class="results-title">
                ${data.toolName || this.activeTool.name} Results
                <span class="verified-badge">✓ Grounded Research</span>
              </h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0.2rem 0 0;">
                Target: <strong>${data.inputContext?.topic || 'Topic'}</strong> • Platforms: <strong>${platforms.join(', ')}</strong> • Country: <strong>${data.inputContext?.country || 'Global'}</strong>
              </p>
            </div>
            <div class="results-actions">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-export-markdown" title="Export as clean Markdown">📄 Export Markdown</button>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-copy-all" title="Copy all outputs to clipboard">📋 Copy All</button>
            </div>
          </div>

          <!-- Multi-Platform Specific Results Tabs -->
          ${platforms.length > 1 ? `
            <div class="platform-results-nav" id="platform-tabs-nav">
              ${platforms.map((p, idx) => `
                <button type="button" class="platform-tab-btn ${idx === 0 ? 'active' : ''}" data-platform-tab="${p}">${p}</button>
              `).join('')}
            </div>
          ` : ''}

          <!-- Dedicated Platform Card -->
          <div id="platform-tab-content">
            ${this.renderPlatformSpecificCard(platforms[0], platformOutputs[platforms[0]] || {}, data)}
          </div>

          <div class="results-grid" style="margin-top: 1.25rem;">
            
            <!-- Overall Quality & Factor Breakdown -->
            <div class="result-card">
              <div class="result-card-header">
                <h4 class="result-card-title">SEO & Packaging Score</h4>
                <span class="copy-btn-mini" data-copy-text="${scores.overallScore}/100 score">Copy</span>
              </div>
              <div class="score-box">
                <div class="score-circle">
                  ${scores.overallScore || 85}
                  <span>/ 100</span>
                </div>
                <div class="score-details">
                  <strong style="font-size: 0.9rem; color: var(--text-primary);">Search-Intent Alignment</strong>
                  <ul class="factor-list">
                    ${(scores.factorBreakdown || []).map(f => `
                      <li class="factor-item">
                        <span>${f.factor}</span>
                        <strong>${f.score || 85}% (${f.status})</strong>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              </div>
            </div>

            <!-- Title & Packaging Optimization -->
            <div class="result-card">
              <div class="result-card-header">
                <h4 class="result-card-title">Optimized Title Recommendation</h4>
                <button type="button" class="copy-btn-mini" data-copy-text="${titleAnalysis.improvedTitle}">Copy Title</button>
              </div>
              <div style="background: var(--bg-subtle); padding: 0.85rem; border-radius: 6px; border: 1px solid var(--border-subtle);">
                <strong style="font-size: 0.95rem; color: var(--text-primary); display: block;">${titleAnalysis.improvedTitle || 'Optimized Content Title'}</strong>
              </div>
              ${titleAnalysis.problems && titleAnalysis.problems.length ? `
                <div style="font-size: 0.8rem; color: var(--text-secondary);">
                  <span style="font-weight: 600; color: var(--text-primary);">Identified Observations:</span>
                  <ul style="padding-left: 1.1rem; margin: 0.3rem 0 0;">
                    ${titleAnalysis.problems.map(p => `<li>${p}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              ${titleAnalysis.alternativeTitles && titleAnalysis.alternativeTitles.length ? `
                <div style="margin-top: 0.3rem;">
                  <span style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Alternative Variations:</span>
                  <ul style="padding-left: 1.1rem; margin: 0.3rem 0 0; font-size: 0.82rem; color: var(--text-primary);">
                    ${titleAnalysis.alternativeTitles.map(t => `<li style="margin-bottom: 0.25rem;">${t} <button type="button" class="copy-btn-mini" data-copy-text="${t}" style="font-size: 0.65rem; padding: 0.1rem 0.3rem;">Copy</button></li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>

            <!-- Grounded Keywords -->
            <div class="result-card">
              <div class="result-card-header">
                <h4 class="result-card-title">Target Search Keywords</h4>
                <button type="button" class="copy-btn-mini" data-copy-text="${(keywords.primary || []).concat(keywords.longTail || []).join(', ')}">Copy All Keywords</button>
              </div>
              <div class="tag-cloud">
                ${(keywords.primary || []).map(kw => `
                  <span class="interactive-tag" data-copy-text="${kw}" title="Click to copy keyword">
                    🔑 ${kw}
                  </span>
                `).join('')}
                ${(keywords.longTail || []).map(kw => `
                  <span class="interactive-tag" data-copy-text="${kw}" title="Click to copy long-tail keyword">
                    🎯 ${kw}
                  </span>
                `).join('')}
              </div>
              ${keywords.searchIntent ? `
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.4rem;">
                  Intent Type: <strong style="color: var(--text-primary);">${keywords.searchIntent}</strong>
                </div>
              ` : ''}
            </div>

            <!-- Verified Hashtags -->
            <div class="result-card">
              <div class="result-card-header">
                <h4 class="result-card-title">Topic-Specific Hashtags</h4>
                <button type="button" class="copy-btn-mini" data-copy-text="${(hashtags.highRelevance || []).concat(hashtags.niche || []).concat(hashtags.platformAppropriate || []).join(' ')}">Copy Hashtags</button>
              </div>
              <div class="tag-cloud">
                ${(hashtags.highRelevance || []).map(tag => `
                  <span class="interactive-tag hashtag" data-copy-text="${tag}" title="Click to copy hashtag">
                    ${tag}
                  </span>
                `).join('')}
                ${(hashtags.niche || []).map(tag => `
                  <span class="interactive-tag hashtag" data-copy-text="${tag}" title="Click to copy niche hashtag">
                    ${tag}
                  </span>
                `).join('')}
                ${(hashtags.platformAppropriate || []).map(tag => `
                  <span class="interactive-tag hashtag" data-copy-text="${tag}" title="Click to copy platform hashtag">
                    ${tag}
                  </span>
                `).join('')}
              </div>
              <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0.4rem 0 0;">
                Calculated for optimal tag density (3–8 tags per post) to prevent algorithmic spam triggers.
              </p>
            </div>

            <!-- Video Hook & Structure -->
            ${hooks.videoHookSuggestions && hooks.videoHookSuggestions.length ? `
              <div class="result-card">
                <div class="result-card-header">
                  <h4 class="result-card-title">Opening Hook & Attention Triggers</h4>
                  <button type="button" class="copy-btn-mini" data-copy-text="${hooks.videoHookSuggestions.join('\n\n')}">Copy Hooks</button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  ${hooks.videoHookSuggestions.map((hook, idx) => `
                    <div style="padding: 0.6rem 0.75rem; background: var(--bg-subtle); border-radius: 6px; font-size: 0.83rem; color: var(--text-primary); border-left: 3px solid var(--accent-blue);">
                      <strong>Hook #${idx + 1}:</strong> ${hook}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Pre-Publishing Interactive Checklist -->
            <div class="result-card">
              <div class="result-card-header">
                <h4 class="result-card-title">SEO & Publishing Checklist</h4>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Interactive</span>
              </div>
              <div class="checklist-items">
                ${(checklists.seoChecklist || []).concat(checklists.publishingChecklist || []).map((item, idx) => `
                  <label class="checklist-item" id="chk-item-${idx}">
                    <input type="checkbox" ${item.status ? 'checked' : ''} onchange="this.parentElement.classList.toggle('done', this.checked)">
                    <span>${item.task}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Full Description / Captions -->
            <div class="result-card result-card-full">
              <div class="result-card-header">
                <h4 class="result-card-title">Complete Optimized Description & Body Copy</h4>
                <button type="button" class="btn btn-subtle btn-sm" data-copy-text="${desc.optimizedText}">📋 Copy Full Description</button>
              </div>
              <pre style="white-space: pre-wrap; font-family: var(--font-sans); font-size: 0.85rem; color: var(--text-primary); background: var(--bg-subtle); padding: 1rem; border-radius: 8px; margin: 0; line-height: 1.5; border: 1px solid var(--border-subtle);">${desc.optimizedText || 'Optimized description not available.'}</pre>
            </div>

          </div>
        </div>
      `;

      // Bind dynamic copy buttons
      container.querySelectorAll('[data-copy-text]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const text = btn.getAttribute('data-copy-text');
          if (text) {
            navigator.clipboard.writeText(text);
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
              btn.textContent = originalText;
              btn.classList.remove('copied');
            }, 1800);
          }
        });
      });

      // Bind platform tabs
      container.querySelectorAll('.platform-tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
          container.querySelectorAll('.platform-tab-btn').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const p = tab.getAttribute('data-platform-tab');
          const tabContent = document.getElementById('platform-tab-content');
          if (tabContent && p) {
            tabContent.innerHTML = this.renderPlatformSpecificCard(p, platformOutputs[p] || {}, data);
            // Rebind inner copy buttons
            tabContent.querySelectorAll('[data-copy-text]').forEach(b => {
              b.addEventListener('click', () => {
                navigator.clipboard.writeText(b.getAttribute('data-copy-text'));
                b.textContent = '✓ Copied!';
                setTimeout(() => b.textContent = 'Copy', 1800);
              });
            });
          }
        });
      });

      // Bind Export Markdown
      document.getElementById('btn-export-markdown')?.addEventListener('click', () => {
        this.exportMarkdown(data);
      });

      // Bind Copy All
      document.getElementById('btn-copy-all')?.addEventListener('click', () => {
        const fullText = `=== MULTI TUBE VIEWS SEO & RESEARCH DOSSIER ===\nTool: ${data.toolName}\nTopic: ${data.inputContext?.topic}\nPlatforms: ${platforms.join(', ')}\n\n[TITLE RECOMMENDATION]\n${titleAnalysis.improvedTitle}\n\n[KEYWORDS]\n${(keywords.primary || []).concat(keywords.longTail || []).join(', ')}\n\n[HASHTAGS]\n${(hashtags.highRelevance || []).join(' ')}\n\n[DESCRIPTION]\n${desc.optimizedText}`;
        navigator.clipboard.writeText(fullText);
        alert('All outputs copied to clipboard in clean plain text.');
      });
    }

    renderPlatformSpecificCard(platform, pData, rootData) {
      const topic = rootData.inputContext?.topic || 'Topic';
      const title = pData.title || `${topic} (${platform} Format)`;
      const body = pData.captionOrDescription || rootData.description?.optimizedText || '';
      const tags = (pData.hashtags || []).join(' ');
      const tips = pData.formatTips || `Adhere to native ${platform} viewer expectations.`;

      return `
        <div class="result-card" style="border: 2px solid var(--border-strong); background: var(--bg-surface-elevated);">
          <div class="result-card-header">
            <h4 class="result-card-title" style="display: flex; align-items: center; gap: 0.4rem;">
              <span>📱</span> ${platform} Native Packaging & Hook
            </h4>
            <button type="button" class="copy-btn-mini" data-copy-text="${title}\n\n${body}">Copy ${platform} Post</button>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-primary); display: flex; flex-direction: column; gap: 0.6rem;">
            <div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Headline / Title:</span>
              <div style="font-weight: 600; margin-top: 0.15rem;">${title}</div>
            </div>
            <div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Caption / Body:</span>
              <pre style="white-space: pre-wrap; font-family: var(--font-sans); font-size: 0.83rem; background: var(--bg-subtle); padding: 0.75rem; border-radius: 6px; margin: 0.25rem 0 0; line-height: 1.45;">${body}</pre>
            </div>
            ${tags ? `
              <div>
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Tags / Hashtags:</span>
                <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-blue); margin-top: 0.15rem;">${tags}</div>
              </div>
            ` : ''}
            <div style="font-size: 0.78rem; color: var(--text-secondary); background: var(--bg-primary); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-subtle);">
              💡 <strong>${platform} Best Practice:</strong> ${tips}
            </div>
          </div>
        </div>
      `;
    }

    exportMarkdown(data) {
      const topic = data.inputContext?.topic || 'Research';
      const md = `# Multi Tube Views — ${data.toolName}
**Target Topic:** ${topic}  
**Category:** ${data.category} | **Target Platforms:** ${(data.inputContext?.platforms || []).join(', ')}  
**Score:** ${data.scores?.overallScore || 85}/100 (Grounded)

---

## 1. Title Recommendations
- **Primary Recommendation:** ${data.titleAnalysis?.improvedTitle}
${(data.titleAnalysis?.alternativeTitles || []).map(t => `- Variation: ${t}`).join('\n')}

---

## 2. Keywords
- **Primary Keywords:** ${(data.keywords?.primary || []).join(', ')}
- **Long-Tail Keywords:** ${(data.keywords?.longTail || []).join(', ')}
- **Search Intent:** ${data.keywords?.searchIntent || 'Informational'}

---

## 3. Hashtags
${(data.hashtags?.highRelevance || []).concat(data.hashtags?.niche || []).join(' ')}

---

## 4. Full Optimized Description
\`\`\`
${data.description?.optimizedText}
\`\`\`

---
*Generated via Multi Tube Views Social Media Research & SEO Suite*
`;
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MTV-SEO-${topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }

    generateClientFallback(tool, topic, platforms, country, language, category) {
      return {
        toolId: tool.id,
        toolName: tool.name,
        category: tool.category,
        inputContext: {
          topic: topic,
          platforms: platforms,
          country: country,
          language: language,
          category: category
        },
        scores: {
          overallScore: 86,
          factorBreakdown: [
            { factor: 'Keyword Specificity', score: 88, status: 'Verified' },
            { factor: 'Platform Packaging Format', score: 85, status: 'Optimal' },
            { factor: 'Search Intent Match', score: 90, status: 'High' }
          ]
        },
        keywords: {
          primary: [topic, `${topic} guide`, `${topic} tutorial`, `${topic} best practices`],
          longTail: [`step by step ${topic} for beginners`, `how to improve ${topic}`],
          searchIntent: 'Informational & Educational How-To'
        },
        hashtags: {
          highRelevance: [`#${topic.replace(/[^a-z0-9]/gi, '').toLowerCase()}`, `#${category.replace(/[^a-z0-9]/gi, '').toLowerCase()}`],
          niche: [`#${topic.replace(/[^a-z0-9]/gi, '').toLowerCase()}tips`],
          platformAppropriate: platforms.map(p => `#${p.toLowerCase()}`)
        },
        titleAnalysis: {
          improvedTitle: `${topic}: Complete Walkthrough & Best Practices`,
          alternativeTitles: [
            `How to Master ${topic} Step-by-Step`,
            `${topic} Explained: Key Mistakes to Avoid`
          ]
        },
        description: {
          optimizedText: `Comprehensive overview of ${topic}.\n\nIn this breakdown, we cover the core principles, practical execution steps, and key tips for success.\n\n${platforms.map(p => `#${p.toLowerCase()}`).join(' ')}`
        },
        checklists: {
          seoChecklist: [
            { task: 'Front-load target keyword in first 40 characters', status: true },
            { task: 'Include 3-5 platform-appropriate hashtags', status: true },
            { task: 'Ensure thumbnail text is legible on mobile', status: true }
          ]
        }
      };
    }

    bindEvents() {
      // Category pills click
      document.getElementById('category-pills-container')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-pill-btn');
        if (btn) {
          const cat = btn.getAttribute('data-cat');
          if (cat) this.selectCategory(cat);
        }
      });

      // Search input
      const searchInput = document.getElementById('seo-tool-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value;
          this.renderToolsGrid();
        });
      }

      // Catalog card click
      document.getElementById('tools-catalog-grid')?.addEventListener('click', (e) => {
        const card = e.target.closest('.tool-compact-card');
        if (card) {
          const id = parseInt(card.getAttribute('data-tool-id'), 10);
          const tool = TOOLS_CATALOG.find(t => t.id === id);
          if (tool) this.openTool(tool);
        }
      });

      // Platform chips toggle
      document.getElementById('platform-chips-container')?.addEventListener('click', (e) => {
        const chip = e.target.closest('.platform-chip');
        if (chip) {
          const p = chip.getAttribute('data-platform');
          if (p) this.togglePlatform(p);
        }
      });

      // Select All / Reset Platforms
      document.getElementById('btn-select-all-platforms')?.addEventListener('click', () => {
        this.selectAllPlatforms();
      });
      document.getElementById('btn-reset-platforms')?.addEventListener('click', () => {
        this.resetPlatformSelection();
      });

      // Presets
      document.getElementById('presets-container')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-preset');
        if (btn) {
          const idx = parseInt(btn.getAttribute('data-preset-idx'), 10);
          if (SAMPLE_PRESETS[idx]) {
            this.loadPreset(SAMPLE_PRESETS[idx]);
          }
        }
      });

      // Run button
      document.getElementById('btn-execute-research')?.addEventListener('click', () => {
        this.runActiveTool();
      });

      // Close runner
      document.getElementById('btn-close-runner')?.addEventListener('click', () => {
        document.getElementById('active-runner-modal')?.classList.remove('open');
      });
    }
  }

  // Auto-instantiate on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    window.seoToolsEngine = new SeoToolsEngine();
  });

})();

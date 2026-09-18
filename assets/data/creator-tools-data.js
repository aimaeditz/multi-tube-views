/**
 * Multi Tube Views (MTV) — Creator Tools Registry
 * 70 High-Performance AI-Powered Creator Tools.
 */

export const CREATOR_CATEGORIES = [
  { id: 'all', name: 'All Tools', count: 70 },
  { id: 'seo', name: 'SEO & Metadata', count: 12 },
  { id: 'titles', name: 'Titles & CTR', count: 5 },
  { id: 'writing', name: 'Writing & Scripting', count: 6 },
  { id: 'strategy', name: 'Analytics & Strategy', count: 17 },
  { id: 'visuals', name: 'Thumbnails & Visuals', count: 10 },
  { id: 'engagement', name: 'Engagement & Community', count: 10 },
  { id: 'repurposing', name: 'Multi-Platform Repurposing', count: 10 }
];

export const CREATOR_TOOLS_DATA = {
  'ai-auto': {
    title: 'AI Auto',
    desc: 'Generate SEO-ready content & creator output',
    icon: '⚡',
    category: 'scripting-hooks',
    promptTemplate: 'Create a comprehensive, professional media optimization layout and execution plan for the topic: {topic}. Provide optimized title, keywords, hashtag cloud, description script, and distribution channel directions.',
    placeholder: 'Enter topic, title, or keywords (e.g., Responsive CSS design system)',
    label: 'Your Topic / Video Idea / SEO Request',
    dateAdded: '2026-09-14'
  },
  'seo-title': {
    title: 'SEO Title',
    desc: 'High-CTR video / page titles',
    icon: '📝',
    category: 'titles-ctr',
    promptTemplate: 'Generate 10 high-CTR video and page title ideas for: {topic}. Make them engaging, concise, and optimized for search.',
    placeholder: 'Enter your video topic or keywords (e.g., Beginner Gardening Guide)',
    label: 'Topic / Content Theme',
    dateAdded: '2026-09-06'
  },
  'keywords': {
    title: 'Keywords',
    desc: 'Seed & long-tail keyword ideas',
    icon: '🔑',
    category: 'seo-metadata',
    promptTemplate: 'Provide a structured list of seed and long-tail keyword ideas for: {topic}. Group them by search intent and relevance.',
    placeholder: 'Enter your seed topic or keywords (e.g., Healthy Breakfast Recipes)',
    label: 'Seed Topic / Keywords',
    dateAdded: '2026-08-30'
  },
  'hashtags': {
    title: 'Hashtags',
    desc: 'Platform hashtag sets',
    icon: '#️⃣',
    category: 'seo-metadata',
    promptTemplate: 'Generate a high-performing hashtag set (15-20 hashtags) for: {topic} across YouTube, Instagram, TikTok, and X.',
    placeholder: 'Enter your video topic or keywords (e.g., Solo Travel Vlogging)',
    label: 'Video Topic / Hashtag Focus',
    dateAdded: '2026-06-01'
  },
  'meta-description': {
    title: 'Meta Description',
    desc: 'Search snippet descriptions',
    icon: '📄',
    category: 'seo-metadata',
    promptTemplate: 'Write 3 compelling meta descriptions (under 155 characters each) for: {topic}. Include strong calls to action.',
    placeholder: 'Enter your page or video topic (e.g., Affordable Gaming Laptops 2026)',
    label: 'Page / Video Topic',
    dateAdded: '2026-06-01'
  },
  'topic-ideas': {
    title: 'Topic Ideas',
    desc: 'Content topic brainstorm',
    icon: '💡',
    category: 'ideation-planning',
    promptTemplate: 'Brainstorm 10 creative, engaging, and viral content topic ideas about: {topic}.',
    placeholder: 'Enter your broad topic area (e.g., Personal Finance for College Students)',
    label: 'Broad Content Area',
    dateAdded: '2026-06-01'
  },
  'youtube-seo-pack': {
    title: 'YouTube SEO Pack',
    desc: 'Title + description + tags direction',
    icon: '🎬',
    category: 'seo-metadata',
    promptTemplate: 'Create a complete YouTube SEO pack for: {topic}. Include 3 title options, a video description with timestamps placeholder, and 15 video tags.',
    placeholder: 'Enter your video topic or keywords (e.g., Python Coding for Kids)',
    label: 'YouTube Video Topic',
    dateAdded: '2026-06-01'
  },
  'grammar-polish': {
    title: 'Grammar Polish',
    desc: 'Clean up draft text',
    icon: '✨',
    category: 'writing-polish',
    promptTemplate: '{topic}',
    placeholder: 'Paste your draft text here to polish (e.g., The video are showing how to build a website from zero.)',
    label: 'Draft Text',
    dateAdded: '2026-06-01'
  },
  'translate': {
    title: 'Translate',
    desc: 'Simple translation helper',
    icon: '🌐',
    category: 'writing-polish',
    promptTemplate: '{topic}',
    placeholder: 'Paste text to translate into selected Target Language (e.g., Hello, welcome to my technology channel.)',
    label: 'Text to Translate',
    dateAdded: '2026-06-01'
  },
  'thumbnail-text': {
    title: 'Thumbnail Text Ideas',
    desc: 'Short, bold text ideas for video thumbnails',
    icon: '🖼️',
    category: 'titles-ctr',
    promptTemplate: 'Generate 10 short, bold thumbnail text ideas for: {topic}.',
    placeholder: 'Enter your video topic or title (e.g., How I built a $10k/mo app)',
    label: 'Video Topic / Title',
    dateAdded: '2026-06-01'
  },
  'video-hook': {
    title: 'Video Hook Generator',
    desc: "Attention-grabbing opening lines for your video's first 5 seconds",
    icon: '🪝',
    category: 'scripting-hooks',
    promptTemplate: 'Generate 8 viral hook opening lines for: {topic}.',
    placeholder: 'Enter your video topic or main concept (e.g., Why 99% of podcasts fail)',
    label: 'Video Topic / Concept',
    dateAdded: '2026-06-01'
  },
  'script-outline': {
    title: 'Video Script Outline',
    desc: 'Quick bullet-point script or outline for your video',
    icon: '📋',
    category: 'scripting-hooks',
    promptTemplate: 'Create a clear script outline for a video about: {topic}.',
    placeholder: 'Enter your video topic or idea (e.g., Beginner Guide to Stock Investing)',
    label: 'Video Topic / Idea',
    dateAdded: '2026-06-01'
  },
  'bio-generator': {
    title: 'Bio Generator',
    desc: 'Write a channel or profile bio/about section',
    icon: '👤',
    category: 'writing-polish',
    promptTemplate: 'Generate 5 short channel or profile bio options for: {topic}.',
    placeholder: 'Enter your niche, channel theme, or background (e.g., Tech reviewer & coding instructor)',
    label: 'Niche / Channel Theme / Creator Info',
    dateAdded: '2026-06-01'
  },
  'content-calendar': {
    title: 'Content Calendar',
    desc: 'Generate a 7-day or 30-day content posting plan',
    icon: '📅',
    category: 'ideation-planning',
    promptTemplate: 'Generate a 7-day content calendar plan for: {topic}.',
    placeholder: 'Enter your niche or content focus (e.g., Fitness & healthy meal prep)',
    label: 'Niche / Content Focus',
    dateAdded: '2026-06-01'
  },
  'trending-topics': {
    title: 'Trending Topics Finder',
    desc: 'Fresh, currently-relevant content topic ideas',
    icon: '🔥',
    category: 'ideation-planning',
    promptTemplate: 'Generate 15 trending and currently relevant topic ideas for: {topic}.',
    placeholder: 'Enter your niche or subject area (e.g., Artificial Intelligence & Automation)',
    label: 'Niche / Subject Area',
    dateAdded: '2026-06-01'
  },
  'emoji-suggestions': {
    title: 'Emoji Suggestions',
    desc: 'Relevant emojis to pair with your caption or title',
    icon: '😃',
    category: 'writing-polish',
    promptTemplate: 'Suggest relevant emoji sets for: {topic}.',
    placeholder: 'Enter your video title, caption, or topic (e.g., Summer travel vlog in Tokyo)',
    label: 'Title / Caption / Topic',
    dateAdded: '2026-06-01'
  },
  'title-comparer': {
    title: 'Title Comparer',
    desc: 'Compare two titles and get the stronger pick with reasoning',
    icon: '⚖️',
    category: 'titles-ctr',
    promptTemplate: 'Compare these two titles and pick the stronger one: {topic}',
    placeholder: 'Enter two titles to compare (e.g., "10 Coding Tips" vs "How I Mastered Coding in 30 Days")',
    label: 'Two Titles to Compare (separated by vs or new line)',
    dateAdded: '2026-06-01'
  },
  'content-repurposing': {
    title: 'Content Repurposing Ideas',
    desc: 'Turn one topic into ideas for Shorts/Reels, carousel posts, blog posts, and threads',
    icon: '🔄',
    category: 'ideation-planning',
    promptTemplate: 'Turn this topic or piece of content into repurposing ideas across 4 formats (Shorts/Reels, Carousel, Blog, Thread): {topic}',
    placeholder: 'Enter a topic, article draft, or video concept (e.g., 5 Productivity Hacks for Freelancers)',
    label: 'Topic / Content Idea',
    dateAdded: '2026-06-01'
  },
  'ab-title-test': {
    title: 'A/B Title Split-Test',
    desc: 'Get two contrasting title styles to test against each other',
    icon: '🧪',
    category: 'titles-ctr',
    promptTemplate: 'Generate 2 contrasting title options for an A/B test for: {topic}',
    placeholder: 'Enter your video topic or working title (e.g., How to Learn Web Development)',
    label: 'Topic / Draft Title',
    dateAdded: '2026-09-02'
  },
  'description-seo-booster': {
    title: 'Description SEO Booster',
    desc: 'Expand a short description into a full, SEO-optimized video description',
    icon: '🚀',
    category: 'seo',
    promptTemplate: 'Expand this short draft description into an SEO-optimized video description with tags: {topic}',
    placeholder: 'Enter a short draft description or topic (e.g., Video about how to build a SaaS app in 2026)',
    label: 'Draft Description / Topic',
    dateAdded: '2026-06-01'
  },

  // --- Titles & Metadata (New Tools) ---
  'video-title-brainstormer': {
    title: 'Video Title Brainstormer',
    desc: 'Generate viral and curiosity-inducing video title variations',
    icon: '🧠',
    category: 'titles',
    promptTemplate: 'Generate 12 high-converting, viral video title variations for: {topic}. Include curiosity gaps, power words, and number-based formats.',
    placeholder: 'Enter your video topic or core message (e.g., How I built a profitable side hustle)',
    label: 'Video Topic / Core Concept',
    dateAdded: '2026-09-18'
  },
  'meta-description-pro': {
    title: 'Meta Description Pro',
    desc: 'Generate click-worthy search engine meta descriptions with CTAs',
    icon: '📝',
    category: 'seo',
    promptTemplate: 'Generate 5 professional search engine meta descriptions (140-155 characters) with strong calls-to-action for: {topic}.',
    placeholder: 'Enter your page or video topic (e.g., Ultimate Web Design Checklist for Beginners)',
    label: 'Page / Content Focus',
    dateAdded: '2026-09-18'
  },
  'long-tail-keyword-finder': {
    title: 'Long-Tail Keyword Finder',
    desc: 'Discover low-competition, high-intent long-tail keywords',
    icon: '🔍',
    category: 'seo',
    promptTemplate: 'Generate 20 low-competition, long-tail search keyword variations grouped by search intent for: {topic}.',
    placeholder: 'Enter seed keyword or topic (e.g., Drone photography for real estate)',
    label: 'Seed Keyword / Niche',
    dateAdded: '2026-09-18'
  },
  'faq-schema-generator': {
    title: 'FAQ Schema Generator',
    desc: 'Generate structured FAQ questions and answers for content SEO',
    icon: '❓',
    category: 'seo',
    promptTemplate: 'Generate 5 frequently asked questions and clear, authoritative answers suitable for FAQ schema on: {topic}.',
    placeholder: 'Enter your topic or product (e.g., Solar panel installation for home owners)',
    label: 'Topic / Product / Service',
    dateAdded: '2026-09-18'
  },
  'internal-linking-strategy': {
    title: 'Internal Linking Strategy',
    desc: 'Suggest contextual internal linking opportunities and anchor text',
    icon: '🔗',
    category: 'seo',
    promptTemplate: 'Suggest an internal linking strategy with anchor text and target article concepts for content about: {topic}.',
    placeholder: 'Enter main content topic or article title (e.g., Complete Guide to Search Engine Optimization)',
    label: 'Main Content Topic',
    dateAdded: '2026-09-18'
  },
  'search-intent-classifier': {
    title: 'Search Intent Classifier',
    desc: 'Analyze target keywords and classify informational vs transactional intent',
    icon: '🎯',
    category: 'seo',
    promptTemplate: 'Analyze these keywords and categorize them by search intent (Informational, Navigational, Commercial, Transactional): {topic}.',
    placeholder: 'Paste keywords list (e.g., best camera under 500, buy sony vlogging camera, how to film vlogs)',
    label: 'Keywords List',
    dateAdded: '2026-09-18'
  },
  'content-gap-analyzer': {
    title: 'Content Gap Analyzer',
    desc: 'Identify missing topics and sub-angles competitors have overlooked',
    icon: '📊',
    category: 'strategy',
    promptTemplate: 'Identify 10 content gaps, missing angles, and overlooked sub-topics in current content about: {topic}.',
    placeholder: 'Enter your topic or competitor focus area (e.g., Productivity tips for remote workers)',
    label: 'Topic / Niche',
    dateAdded: '2026-09-18'
  },
  'anchor-text-optimizer': {
    title: 'Anchor Text Optimizer',
    desc: 'Generate diverse, natural anchor text variations for link building',
    icon: '⚓',
    category: 'seo',
    promptTemplate: 'Provide 15 natural, contextual anchor text variations (exact match, partial match, branded, conversational) for linking to: {topic}.',
    placeholder: 'Enter target page topic or keyword (e.g., Best Budget Video Editing Software)',
    label: 'Target Page / Keyword',
    dateAdded: '2026-09-18'
  },
  'featured-snippet-optimizer': {
    title: 'Featured Snippet Optimizer',
    desc: 'Format concise answers targeting Google Position 0 snippets',
    icon: '🏆',
    category: 'seo',
    promptTemplate: 'Format a clear paragraph snippet (40-50 words), list snippet, and table structure designed to win Google Featured Snippets for: {topic}.',
    placeholder: 'Enter the target search query or question (e.g., How to calculate video bitrate)',
    label: 'Search Query / Question',
    dateAdded: '2026-09-18'
  },
  'pillar-cluster-planner': {
    title: 'Pillar Cluster Planner',
    desc: 'Design a pillar page structure with supporting sub-topic cluster posts',
    icon: '🏛️',
    category: 'strategy',
    promptTemplate: 'Create a complete content pillar strategy with 1 main pillar page and 8 supporting cluster article topics for: {topic}.',
    placeholder: 'Enter core topic area (e.g., Video Marketing Strategy)',
    label: 'Core Topic Area',
    dateAdded: '2026-09-18'
  },

  // --- Thumbnails & Visuals (New Tools) ---
  'storyboard-visual-prompts': {
    title: 'Storyboard Visual Prompts',
    desc: 'Generate scene-by-scene AI image generation prompts for video storyboards',
    icon: '📐',
    category: 'visuals',
    promptTemplate: 'Generate a 5-scene visual storyboard with detailed AI image generation prompts and camera angle descriptions for: {topic}.',
    placeholder: 'Enter your video concept or scene description (e.g., Cyberpunk tech review intro sequence)',
    label: 'Video Scene Concept',
    dateAdded: '2026-09-18'
  },
  'b-roll-shot-list': {
    title: 'B-Roll Shot List',
    desc: 'Create a shot list of complementary cinematic B-roll visual ideas',
    icon: '🎥',
    category: 'visuals',
    promptTemplate: 'Generate a structured B-roll shot list (close-ups, wide shots, movement shots, cutaways) for a video about: {topic}.',
    placeholder: 'Enter your video script topic or setting (e.g., Coffee shop morning routine vlog)',
    label: 'Video Topic / Setting',
    dateAdded: '2026-09-18'
  },
  'b-roll-concept-planner': {
    title: 'B-Roll Concept Planner',
    desc: 'Brainstorm creative visual metaphors and background footage concepts',
    icon: '📹',
    category: 'visuals',
    promptTemplate: 'Brainstorm 10 creative visual metaphors and storytelling B-roll footage concepts for: {topic}.',
    placeholder: 'Enter video theme or key message (e.g., Overcoming creative burnout)',
    label: 'Video Theme / Message',
    dateAdded: '2026-09-18'
  },
  'quote-card-text-generator': {
    title: 'Quote Card Text Generator',
    desc: 'Extract and format punchy key takeaway quotes for social visual graphics',
    icon: '💬',
    category: 'visuals',
    promptTemplate: 'Extract 5 high-impact, memorable quote card callouts with attribution styling from this content: {topic}.',
    placeholder: 'Paste video transcript, article summary, or core message',
    label: 'Transcript / Article Text',
    dateAdded: '2026-09-18'
  },
  'carousel-slide-planner': {
    title: 'Carousel Slide Planner',
    desc: 'Outline multi-slide Instagram and LinkedIn visual carousel posts',
    icon: '📱',
    category: 'visuals',
    promptTemplate: 'Design an 8-slide educational visual carousel outline (Hook slide, 5 content slides, summary slide, CTA slide) for: {topic}.',
    placeholder: 'Enter topic or guide concept (e.g., 5 Common Lighting Mistakes in Video)',
    label: 'Carousel Topic',
    dateAdded: '2026-09-18'
  },
  'image-alt-text-generator': {
    title: 'Image Alt Text Generator',
    desc: 'Write descriptive, SEO-friendly image alt text for accessibility',
    icon: '🖼️',
    category: 'visuals',
    promptTemplate: 'Write 5 descriptive, accessible, and SEO-optimized image alt text options for images depicting: {topic}.',
    placeholder: 'Describe image elements or theme (e.g., Creator editing video on dual monitors in dark studio)',
    label: 'Image Visual Description',
    dateAdded: '2026-09-18'
  },
  'fantasy-world-map-describer': {
    title: 'Fantasy World Map Describer',
    desc: 'Describe geography, regions, and landmarks for worldbuilding visuals',
    icon: '🗺️',
    category: 'visuals',
    promptTemplate: 'Generate detailed visual descriptions of terrain, kingdoms, and visual landmarks for a world map inspired by: {topic}.',
    placeholder: 'Enter fantasy setting idea (e.g., Floating island archipelago with crystal rivers)',
    label: 'Worldbuilding Concept',
    dateAdded: '2026-09-18'
  },
  'comic-strip-dialogue-generator': {
    title: 'Comic Strip Dialogue Generator',
    desc: 'Write panel-by-panel dialogue and visual descriptions for webcomics',
    icon: '🗨️',
    category: 'visuals',
    promptTemplate: 'Script a 4-panel comic strip complete with character dialogue, expression notes, and background visuals for: {topic}.',
    placeholder: 'Enter funny scenario or story concept (e.g., Programmer trying to fix a single bug at 3 AM)',
    label: 'Comic Concept / Scenario',
    dateAdded: '2026-09-18'
  },
  'visual-hook-designer': {
    title: 'Visual Hook Designer',
    desc: 'Plan high-impact visual openings and visual pattern interrupts',
    icon: '🎨',
    category: 'visuals',
    promptTemplate: 'Design 5 visual pattern interrupts and high-impact visual hook ideas for the first 3 seconds of a video on: {topic}.',
    placeholder: 'Enter video concept or topic (e.g., Unboxing a $5,000 mystery box)',
    label: 'Video Concept',
    dateAdded: '2026-09-18'
  },
  'infographic-outline-planner': {
    title: 'Infographic Outline Planner',
    desc: 'Structure data, statistics, and visual hierarchy for infographics',
    icon: '📊',
    category: 'visuals',
    promptTemplate: 'Structure a visual infographic layout outline with header, 4 data/process sections, and footer sources for: {topic}.',
    placeholder: 'Enter topic or dataset (e.g., Evolution of Video Streaming 2010 to 2026)',
    label: 'Infographic Topic / Data Focus',
    dateAdded: '2026-09-18'
  },

  // --- Engagement & Community (New Tools) ---
  'audience-engagement-replies': {
    title: 'Audience Engagement Replies',
    desc: 'Craft thoughtful, conversation-starting replies to community comments',
    icon: '💬',
    category: 'engagement',
    promptTemplate: 'Craft 5 engaging, appreciative, and conversation-expanding community replies to viewers asking or commenting about: {topic}.',
    placeholder: 'Paste viewer comments or main video feedback theme',
    label: 'Viewer Comment / Feedback',
    dateAdded: '2026-09-18'
  },
  'community-poll-creator': {
    title: 'Community Poll Creator',
    desc: 'Create interactive multiple-choice community post polls',
    icon: '📊',
    category: 'engagement',
    promptTemplate: 'Create 5 engaging YouTube/social community polls with compelling question copy and 4 distinct voting options for: {topic}.',
    placeholder: 'Enter niche or content decision topic (e.g., Which camera gear should I review next?)',
    label: 'Poll Topic / Question Idea',
    dateAdded: '2026-09-18'
  },
  'question-of-the-day': {
    title: 'Question of the Day',
    desc: 'Generate viral discussion questions to boost comment section activity',
    icon: '❓',
    category: 'engagement',
    promptTemplate: 'Generate 10 thought-provoking "Question of the Day" comment prompts for content about: {topic}.',
    placeholder: 'Enter video topic or community theme (e.g., Best productivity tool of 2026)',
    label: 'Content Topic / Niche',
    dateAdded: '2026-09-18'
  },
  'meme-caption-writer': {
    title: 'Meme Caption Writer',
    desc: 'Write relatable, shareable meme captions tailored to your creator niche',
    icon: '😂',
    category: 'engagement',
    promptTemplate: 'Write 8 funny, relatable meme captions tailored to content creators in the niche of: {topic}.',
    placeholder: 'Enter niche or situation (e.g., Video editing late at night, Premiere crashing)',
    label: 'Creator Niche / Scenario',
    dateAdded: '2026-09-18'
  },
  'social-media-challenge-creator': {
    title: 'Social Media Challenge Creator',
    desc: 'Design viral community participation challenges and hashtags',
    icon: '🏆',
    category: 'engagement',
    promptTemplate: 'Design an interactive social media challenge including name, rules, hashtag, and sample post outline for: {topic}.',
    placeholder: 'Enter fitness, creative, or learning goal (e.g., 30-Day Daily Short Video Challenge)',
    label: 'Challenge Concept / Niche',
    dateAdded: '2026-09-18'
  },
  'milestone-celebration-post': {
    title: 'Milestone Celebration Post',
    desc: 'Write authentic subscriber/follower milestone appreciation posts',
    icon: '🎉',
    category: 'engagement',
    promptTemplate: 'Write 3 heartfelt, authentic milestone celebration posts thanking the community for reaching: {topic}.',
    placeholder: 'Enter milestone (e.g., 100,000 YouTube Subscribers or 1 Million Views)',
    label: 'Milestone Achieved',
    dateAdded: '2026-09-18'
  },
  'ama-question-generator': {
    title: 'AMA Question Generator',
    desc: 'Seed engaging Ask-Me-Anything questions for live streams or Q&A videos',
    icon: '🙋‍♂️',
    category: 'engagement',
    promptTemplate: 'Generate 15 engaging, insightful Ask-Me-Anything (AMA) questions covering background, tech, process, and future plans for: {topic}.',
    placeholder: 'Enter your background or channel focus (e.g., Full-time travel creator & filmmaker)',
    label: 'Creator Persona / Niche',
    dateAdded: '2026-09-18'
  },
  'engagement-bait-question': {
    title: 'Engagement Bait Question',
    desc: 'Formulate high-response discussion prompts for video end screens and captions',
    icon: '🪝',
    category: 'engagement',
    promptTemplate: 'Write 6 high-response engagement questions specifically formatted for end-of-video calls to comment on: {topic}.',
    placeholder: 'Enter video core debate or takeaway (e.g., Is AI going to replace web developers?)',
    label: 'Video Takeaway / Debate',
    dateAdded: '2026-09-18'
  },
  'community-challenge-idea-generator': {
    title: 'Community Challenge Idea Generator',
    desc: 'Brainstorm creative fan submissions and interactive channel challenges',
    icon: '⚡',
    category: 'engagement',
    promptTemplate: 'Brainstorm 5 fan submission video concepts and interactive channel challenge ideas for: {topic}.',
    placeholder: 'Enter audience niche (e.g., Beginner music producers, indie game devs)',
    label: 'Audience / Creator Niche',
    dateAdded: '2026-09-18'
  },
  'live-qa-question-generator': {
    title: 'Live Q&A Question Generator',
    desc: 'Generate structured Q&A topic buckets and audience icebreakers for live streams',
    icon: '🎙️',
    category: 'engagement',
    promptTemplate: 'Create a structured Live Q&A outline with 4 topic buckets and 12 audience icebreaker questions for: {topic}.',
    placeholder: 'Enter live stream theme (e.g., Q&A on building a YouTube channel in 2026)',
    label: 'Live Stream Theme',
    dateAdded: '2026-09-18'
  },

  // --- Analytics & Strategy (New Tools) ---
  'video-pacing-retention-doctor': {
    title: 'Video Pacing Retention Doctor',
    desc: 'Analyze video structure and diagnose drop-off points with retention pacing fixes',
    icon: '🩺',
    category: 'strategy',
    promptTemplate: 'Analyze this video outline/concept and provide a retention pacing audit identifying drop-off risks and 5 pattern interrupt fixes for: {topic}.',
    placeholder: 'Enter video structure or script concept summary',
    label: 'Video Structure / Script Concept',
    dateAdded: '2026-09-18'
  },
  'sponsor-segment-transition': {
    title: 'Sponsor Segment Transition',
    desc: 'Write natural, non-jarring transitions into sponsor read integrations',
    icon: '🤝',
    category: 'strategy',
    promptTemplate: 'Write 3 natural, seamless segue transitions linking the video topic to the sponsor product for: {topic}.',
    placeholder: 'Enter video topic and sponsor product (e.g., Video: Coding Tutorial, Sponsor: VPN Service)',
    label: 'Video Topic & Sponsor Info',
    dateAdded: '2026-09-18'
  },
  'video-endscreen-annotation': {
    title: 'Video Endscreen Annotation',
    desc: 'Script compelling 20-second end screen verbal calls to action',
    icon: '🎬',
    category: 'strategy',
    promptTemplate: 'Write 3 high-converting 20-second end screen verbal scripts driving viewers to watch the next recommended video about: {topic}.',
    placeholder: 'Enter current video topic and next suggested video concept',
    label: 'Current Video & Next Suggested Video',
    dateAdded: '2026-09-18'
  },
  'case-study-hook-generator': {
    title: 'Case Study Hook Generator',
    desc: 'Frame transformation and results story angles for case study videos',
    icon: '📈',
    category: 'strategy',
    promptTemplate: 'Generate 5 compelling case study story hooks emphasizing problem, mechanism, and transformation results for: {topic}.',
    placeholder: 'Enter client or project results (e.g., Grew client channel from 0 to 50k subs in 90 days)',
    label: 'Results / Project Transformation',
    dateAdded: '2026-09-18'
  },
  'value-proposition-builder': {
    title: 'Value Proposition Builder',
    desc: 'Define your channel mission, target viewer persona, and unique positioning statement',
    icon: '💎',
    category: 'strategy',
    promptTemplate: 'Construct a clear channel value proposition, target audience avatar profile, and positioning statement for: {topic}.',
    placeholder: 'Enter creator niche and main offer (e.g., Teaching busy moms easy meal prep)',
    label: 'Niche / Channel Core Focus',
    dateAdded: '2026-09-18'
  },
  'brand-voice-guide': {
    title: 'Brand Voice Guide',
    desc: 'Formulate a brand tone, vocabulary list, and communication style guide',
    icon: '🗣️',
    category: 'strategy',
    promptTemplate: 'Create a comprehensive brand voice style guide (Primary Tone, Do’s & Don’ts, Key Phrases, Audience Perception) for: {topic}.',
    placeholder: 'Enter creator personality traits or channel style (e.g., Energetic tech enthusiast, sarcastic humor)',
    label: 'Creator Personality / Channel Vibe',
    dateAdded: '2026-09-18'
  },
  'content-refresh-suggestor': {
    title: 'Content Refresh Suggestor',
    desc: 'Ideas to update, modernize, and re-release older performing content',
    icon: '🔄',
    category: 'strategy',
    promptTemplate: 'Provide 8 strategic ideas to modernize, update data, and re-produce an older video topic for today’s audience: {topic}.',
    placeholder: 'Enter older video topic or concept (e.g., Best camera settings 2022)',
    label: 'Older Video Topic / Concept',
    dateAdded: '2026-09-18'
  },
  'follower-growth-strategy': {
    title: 'Follower Growth Strategy',
    desc: 'Actionable 30-day roadmap to accelerate channel subscriber velocity',
    icon: '🚀',
    category: 'strategy',
    promptTemplate: 'Develop a 30-day channel growth roadmap covering content cadence, distribution channels, and audience conversion tactics for: {topic}.',
    placeholder: 'Enter current channel niche and sub count (e.g., Gaming channel at 500 subscribers aiming for 5,000)',
    label: 'Channel Niche & Current Scale',
    dateAdded: '2026-09-18'
  },
  'eeat-content-checklist': {
    title: 'E-E-A-T Content Checklist',
    desc: 'Audit content for Experience, Expertise, Authoritativeness, and Trustworthiness signals',
    icon: '✅',
    category: 'strategy',
    promptTemplate: 'Provide an E-E-A-T audit checklist and content enhancement recommendations to maximize trust signals for content on: {topic}.',
    placeholder: 'Enter topic or niche (e.g., Personal Finance & Crypto Investment Guides)',
    label: 'Content Topic / Niche',
    dateAdded: '2026-09-18'
  },
  'competitor-gap-finder': {
    title: 'Competitor Gap Finder',
    desc: 'Analyze top competing channels to find unmet viewer demands',
    icon: '🔍',
    category: 'strategy',
    promptTemplate: 'Analyze competitor offerings in this space and identify 6 unmet audience demands, visual gaps, and differentiation opportunities for: {topic}.',
    placeholder: 'Enter creator niche or top competitor names (e.g., Tech review channels focusing on laptops)',
    label: 'Niche / Competitor Focus',
    dateAdded: '2026-09-18'
  },

  // --- Multi-Platform Repurposing (New Tools) ---
  'tiktok-trend-adapter': {
    title: 'TikTok Trend Adapter',
    desc: 'Adapt trending audio formats and viral story structures to your channel niche',
    icon: '🎵',
    category: 'repurposing',
    promptTemplate: 'Adapt popular TikTok trend formats and viral audio storytelling concepts to fit the creator niche of: {topic}.',
    placeholder: 'Enter your channel niche (e.g., Software engineering, home cooking)',
    label: 'Channel Niche',
    dateAdded: '2026-09-18'
  },
  'content-repurposing-matrix': {
    title: 'Content Repurposing Matrix',
    desc: 'Map 1 long-form video into 10 multi-platform micro-assets',
    icon: '🧩',
    category: 'repurposing',
    promptTemplate: 'Create a full multi-platform repurposing execution matrix mapping 1 long-form video into 3 Short scripts, 1 LinkedIn article, 1 X thread, and 2 carousels for: {topic}.',
    placeholder: 'Enter video transcript or main topic idea',
    label: 'Main Video Topic / Outline',
    dateAdded: '2026-09-18'
  },
  'linkedin-post-generator': {
    title: 'LinkedIn Post Generator',
    desc: 'Turn video insights into professional storytelling LinkedIn posts',
    icon: '💼',
    category: 'repurposing',
    promptTemplate: 'Write 3 professional, high-engagement LinkedIn posts with line breaks and strong hooks based on: {topic}.',
    placeholder: 'Enter video topic, key lesson, or industry insight',
    label: 'Key Insight / Video Takeaway',
    dateAdded: '2026-09-18'
  },
  'twitter-thread-builder': {
    title: 'Twitter Thread Builder',
    desc: 'Convert long-form concepts into readable 7-tweet value threads',
    icon: '🧵',
    category: 'repurposing',
    promptTemplate: 'Format a viral 7-tweet X/Twitter thread (Hook tweet, 5 value tweets, 1 CTA tweet) summarizing: {topic}.',
    placeholder: 'Enter video concept or key tutorial steps',
    label: 'Tutorial / Video Concept',
    dateAdded: '2026-09-18'
  },
  'instagram-caption-writer': {
    title: 'Instagram Caption Writer',
    desc: 'Write engaging Instagram Reel and post captions with line breaks & hashtags',
    icon: '📸',
    category: 'repurposing',
    promptTemplate: 'Write 3 compelling Instagram captions complete with line breaks, call to action, and 10 targeted hashtags for: {topic}.',
    placeholder: 'Enter post topic or Reel summary',
    label: 'Post Topic / Reel Concept',
    dateAdded: '2026-09-18'
  },
  'cross-platform-repost-adapter': {
    title: 'Cross-Platform Repost Adapter',
    desc: 'Tailor one caption for YouTube Shorts, TikTok, Instagram Reels, and Pinterest',
    icon: '🔄',
    category: 'repurposing',
    promptTemplate: 'Adapt this post copy into 4 platform-tailored versions specifically formatted for YouTube Shorts, TikTok, Instagram Reels, and Pinterest: {topic}.',
    placeholder: 'Enter base video caption or core message',
    label: 'Base Caption / Core Message',
    dateAdded: '2026-09-18'
  },
  'event-webinar-promo': {
    title: 'Event Webinar Promo',
    desc: 'Write promotional announcement copy for live events, streams, or webinars',
    icon: '🎟️',
    category: 'repurposing',
    promptTemplate: 'Generate a multi-channel promotional post series (Initial announcement, 24-hour reminder, Live now post) for a webinar/stream on: {topic}.',
    placeholder: 'Enter event title, date/time, and key benefit',
    label: 'Event Details & Key Takeaways',
    dateAdded: '2026-09-18'
  },
  'youtube-shorts-script': {
    title: 'YouTube Shorts Script',
    desc: 'Write fast-paced 60-second vertical video scripts with visual cues',
    icon: '⚡',
    category: 'repurposing',
    promptTemplate: 'Write a fast-paced 60-second vertical video script with visual cues, voiceover lines, and text overlays for: {topic}.',
    placeholder: 'Enter quick tutorial topic or viral fact',
    label: 'Shorts Topic / Concept',
    dateAdded: '2026-09-18'
  },
  'podcast-episode-planner': {
    title: 'Podcast Episode Planner',
    desc: 'Outline podcast interview questions, chapter timestamps, and show notes',
    icon: '🎙️',
    category: 'repurposing',
    promptTemplate: 'Create a complete podcast episode structure with intro hook, 8 interview questions, mid-roll break, show notes summary, and chapter timestamps for: {topic}.',
    placeholder: 'Enter podcast episode guest or topic focus',
    label: 'Podcast Topic / Guest Info',
    dateAdded: '2026-09-18'
  },
  'newsletter-curator': {
    title: 'Newsletter Curator',
    desc: 'Transform video content into a subscriber email newsletter issue',
    icon: '📬',
    category: 'repurposing',
    promptTemplate: 'Write an engaging subscriber email newsletter issue (Catchy Subject Line, Preview Text, Main Story, Key Takeaways, CTA) based on: {topic}.',
    placeholder: 'Enter video topic or weekly takeaway outline',
    label: 'Video Topic / Weekly Lessons',
    dateAdded: '2026-09-18'
  }
};

export const CREATOR_TOOLS_LIST = Object.keys(CREATOR_TOOLS_DATA);

if (typeof window !== 'undefined') {
  window.MTV_CREATOR_CATEGORIES = CREATOR_CATEGORIES;
  window.MTV_CREATOR_TOOLS = CREATOR_TOOLS_DATA;
  window.MTV_CREATOR_TOOLS_LIST = CREATOR_TOOLS_LIST;
}

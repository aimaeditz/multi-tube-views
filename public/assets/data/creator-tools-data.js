/**
 * Multi Tube Views (MTV) — Creator Tools Registry
 * 20 High-Performance AI-Powered Creator Tools.
 */

export const CREATOR_TOOLS_DATA = {
  'ai-auto': {
    title: 'AI Auto',
    desc: 'Generate SEO-ready content & creator output',
    icon: '⚡',
    promptTemplate: 'Create a comprehensive, professional media optimization layout and execution plan for the topic: {topic}. Provide optimized title, keywords, hashtag cloud, description script, and distribution channel directions.',
    placeholder: 'Enter topic, title, or keywords (e.g., Responsive CSS design system)',
    label: 'Your Topic / Video Idea / SEO Request'
  },
  'seo-title': {
    title: 'SEO Title',
    desc: 'High-CTR video / page titles',
    icon: '📝',
    promptTemplate: 'Generate 10 high-CTR video and page title ideas for: {topic}. Make them engaging, concise, and optimized for search.',
    placeholder: 'Enter your video topic or keywords (e.g., Beginner Gardening Guide)',
    label: 'Topic / Content Theme'
  },
  'keywords': {
    title: 'Keywords',
    desc: 'Seed & long-tail keyword ideas',
    icon: '🔑',
    promptTemplate: 'Provide a structured list of seed and long-tail keyword ideas for: {topic}. Group them by search intent and relevance.',
    placeholder: 'Enter your seed topic or keywords (e.g., Healthy Breakfast Recipes)',
    label: 'Seed Topic / Keywords'
  },
  'hashtags': {
    title: 'Hashtags',
    desc: 'Platform hashtag sets',
    icon: '#️⃣',
    promptTemplate: 'Generate a high-performing hashtag set (15-20 hashtags) for: {topic} across YouTube, Instagram, TikTok, and X.',
    placeholder: 'Enter your video topic or keywords (e.g., Solo Travel Vlogging)',
    label: 'Video Topic / Hashtag Focus'
  },
  'meta-description': {
    title: 'Meta Description',
    desc: 'Search snippet descriptions',
    icon: '📄',
    promptTemplate: 'Write 3 compelling meta descriptions (under 155 characters each) for: {topic}. Include strong calls to action.',
    placeholder: 'Enter your page or video topic (e.g., Affordable Gaming Laptops 2026)',
    label: 'Page / Video Topic'
  },
  'topic-ideas': {
    title: 'Topic Ideas',
    desc: 'Content topic brainstorm',
    icon: '💡',
    promptTemplate: 'Brainstorm 10 creative, engaging, and viral content topic ideas about: {topic}.',
    placeholder: 'Enter your broad topic area (e.g., Personal Finance for College Students)',
    label: 'Broad Content Area'
  },
  'youtube-seo-pack': {
    title: 'YouTube SEO Pack',
    desc: 'Title + description + tags direction',
    icon: '🎬',
    promptTemplate: 'Create a complete YouTube SEO pack for: {topic}. Include 3 title options, a video description with timestamps placeholder, and 15 video tags.',
    placeholder: 'Enter your video topic or keywords (e.g., Python Coding for Kids)',
    label: 'YouTube Video Topic'
  },
  'grammar-polish': {
    title: 'Grammar Polish',
    desc: 'Clean up draft text',
    icon: '✨',
    promptTemplate: '{topic}',
    placeholder: 'Paste your draft text here to polish (e.g., The video are showing how to build a website from zero.)',
    label: 'Draft Text'
  },
  'translate': {
    title: 'Translate',
    desc: 'Simple translation helper',
    icon: '🌐',
    promptTemplate: '{topic}',
    placeholder: 'Paste text to translate into selected Target Language (e.g., Hello, welcome to my technology channel.)',
    label: 'Text to Translate'
  },
  'thumbnail-text': {
    title: 'Thumbnail Text Ideas',
    desc: 'Short, bold text ideas for video thumbnails',
    icon: '🖼️',
    promptTemplate: 'Generate 10 short, bold thumbnail text ideas for: {topic}.',
    placeholder: 'Enter your video topic or title (e.g., How I built a $10k/mo app)',
    label: 'Video Topic / Title'
  },
  'video-hook': {
    title: 'Video Hook Generator',
    desc: "Attention-grabbing opening lines for your video's first 5 seconds",
    icon: '🪝',
    promptTemplate: 'Generate 8 viral hook opening lines for: {topic}.',
    placeholder: 'Enter your video topic or main concept (e.g., Why 99% of podcasts fail)',
    label: 'Video Topic / Concept'
  },
  'script-outline': {
    title: 'Video Script Outline',
    desc: 'Quick bullet-point script or outline for your video',
    icon: '📋',
    promptTemplate: 'Create a clear script outline for a video about: {topic}.',
    placeholder: 'Enter your video topic or idea (e.g., Beginner Guide to Stock Investing)',
    label: 'Video Topic / Idea'
  },
  'bio-generator': {
    title: 'Bio Generator',
    desc: 'Write a channel or profile bio/about section',
    icon: '👤',
    promptTemplate: 'Generate 5 short channel or profile bio options for: {topic}.',
    placeholder: 'Enter your niche, channel theme, or background (e.g., Tech reviewer & coding instructor)',
    label: 'Niche / Channel Theme / Creator Info'
  },
  'content-calendar': {
    title: 'Content Calendar',
    desc: 'Generate a 7-day or 30-day content posting plan',
    icon: '📅',
    promptTemplate: 'Generate a 7-day content calendar plan for: {topic}.',
    placeholder: 'Enter your niche or content focus (e.g., Fitness & healthy meal prep)',
    label: 'Niche / Content Focus'
  },
  'trending-topics': {
    title: 'Trending Topics Finder',
    desc: 'Fresh, currently-relevant content topic ideas',
    icon: '🔥',
    promptTemplate: 'Generate 15 trending and currently relevant topic ideas for: {topic}.',
    placeholder: 'Enter your niche or subject area (e.g., Artificial Intelligence & Automation)',
    label: 'Niche / Subject Area'
  },
  'emoji-suggestions': {
    title: 'Emoji Suggestions',
    desc: 'Relevant emojis to pair with your caption or title',
    icon: '😃',
    promptTemplate: 'Suggest relevant emoji sets for: {topic}.',
    placeholder: 'Enter your video title, caption, or topic (e.g., Summer travel vlog in Tokyo)',
    label: 'Title / Caption / Topic'
  },
  'title-comparer': {
    title: 'Title Comparer',
    desc: 'Compare two titles and get the stronger pick with reasoning',
    icon: '⚖️',
    promptTemplate: 'Compare these two titles and pick the stronger one: {topic}',
    placeholder: 'Enter two titles to compare (e.g., "10 Coding Tips" vs "How I Mastered Coding in 30 Days")',
    label: 'Two Titles to Compare (separated by vs or new line)'
  },
  'content-repurposing': {
    title: 'Content Repurposing Ideas',
    desc: 'Turn one topic into ideas for Shorts/Reels, carousel posts, blog posts, and threads',
    icon: '🔄',
    promptTemplate: 'Turn this topic or piece of content into repurposing ideas across 4 formats (Shorts/Reels, Carousel, Blog, Thread): {topic}',
    placeholder: 'Enter a topic, article draft, or video concept (e.g., 5 Productivity Hacks for Freelancers)',
    label: 'Topic / Content Idea'
  },
  'ab-title-test': {
    title: 'A/B Title Split-Test',
    desc: 'Get two contrasting title styles to test against each other',
    icon: '🧪',
    promptTemplate: 'Generate 2 contrasting title options for an A/B test for: {topic}',
    placeholder: 'Enter your video topic or working title (e.g., How to Learn Web Development)',
    label: 'Topic / Draft Title'
  },
  'description-seo-booster': {
    title: 'Description SEO Booster',
    desc: 'Expand a short description into a full, SEO-optimized video description',
    icon: '🚀',
    promptTemplate: 'Expand this short draft description into an SEO-optimized video description with tags: {topic}',
    placeholder: 'Enter a short draft description or topic (e.g., Video about how to build a SaaS app in 2026)',
    label: 'Draft Description / Topic'
  }
};

export const CREATOR_TOOLS_LIST = Object.keys(CREATOR_TOOLS_DATA);

if (typeof window !== 'undefined') {
  window.MTV_CREATOR_TOOLS = CREATOR_TOOLS_DATA;
  window.MTV_CREATOR_TOOLS_LIST = CREATOR_TOOLS_LIST;
}

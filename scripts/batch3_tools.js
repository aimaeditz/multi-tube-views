import fs from 'fs';
import path from 'path';

// 50 NEW TOOLS (Batch 3 of 3 - Final)
export const BATCH_3_TOOLS = {
  // Category 1: Video & Scripting (8 tools)
  'vlog-script': {
    title: 'Vlog Script Generator',
    desc: 'Generate engaging vlog scripts with dynamic intros, talking points, b-roll cues, and sign-offs.',
    icon: '📹',
    category: 'video',
    label: 'Vlog Topic & Setting',
    placeholder: 'e.g., Day in the life of a remote software developer in Tokyo, focusing on morning routine and co-working spaces...'
  },
  'unboxing-script': {
    title: 'Unboxing Video Script Generator',
    desc: 'Create high-energy product unboxing scripts with package impressions, feature reveals, and first tests.',
    icon: '📦',
    category: 'video',
    label: 'Product Details & Key Features',
    placeholder: 'e.g., Noise-cancelling wireless headphones with 40hr battery, premium matte case, and sound quality tests...'
  },
  'tutorial-step-script': {
    title: 'Tutorial Video Step Script Generator',
    desc: 'Structure clear, numbered step-by-step tutorial scripts with beginner-friendly explanations and screen callouts.',
    icon: '🛠️',
    category: 'video',
    label: 'Tutorial Subject & Skill Level',
    placeholder: 'e.g., How to build a responsive portfolio website with Tailwind CSS for beginner web developers...'
  },
  'sponsorship-read-script': {
    title: 'Video Sponsorship Read Script Generator',
    desc: 'Draft organic, seamless sponsorship ad reads with smooth segment transitions and strong discount codes.',
    icon: '🎙️',
    category: 'video',
    label: 'Sponsor Brand, Offer & Talking Points',
    placeholder: 'e.g., NordVPN 70% off deal with code MULTI, emphasizing security on public Wi-Fi and geo-unblocking...'
  },
  'documentary-narration-script': {
    title: 'Documentary Narration Script Generator',
    desc: 'Compose cinematic, immersive voiceover narration for historical, scientific, or investigative mini-documentaries.',
    icon: '🎥',
    category: 'video',
    label: 'Documentary Topic & Tone',
    placeholder: 'e.g., The rise and sudden disappearance of the Mayan civilization in the 9th century, dramatic and reflective...'
  },
  'gaming-commentary-script': {
    title: 'Gaming Commentary Script Generator',
    desc: 'Produce punchy gameplay commentary outlines with banter hooks, hype reactions, and viewer engagement cues.',
    icon: '🎮',
    category: 'video',
    label: 'Game Title & Playthrough Scenario',
    placeholder: 'e.g., Elden Ring boss fight with level 1 wretch challenge, highlighting humorous deaths and clutch victory...'
  },
  'cooking-video-script': {
    title: 'Cooking Video Script Generator',
    desc: 'Craft delicious, pace-optimized cooking and recipe scripts with ingredient callouts and sensory descriptions.',
    icon: '🍳',
    category: 'video',
    label: 'Recipe Name, Key Ingredients & Style',
    placeholder: 'e.g., 15-minute creamy garlic butter Tuscan shrimp pasta, quick weeknight dinner style with sizzling audio cues...'
  },
  'travel-vlog-script': {
    title: 'Travel Vlog Script Generator',
    desc: 'Generate wanderlust-inducing travel vlog itineraries and narration covering hidden gems, food, and culture.',
    icon: '✈️',
    category: 'video',
    label: 'Destination, Highlights & Travel Style',
    placeholder: 'e.g., 48 hours in Lisbon exploring historic Alfama, pastel de nata bakeries, and scenic tram viewpoints on a budget...'
  },

  // Category 2: Social & Growth (8 tools + 1 mixed)
  'instagram-story-ideas': {
    title: 'Instagram Story Idea Generator',
    desc: 'Brainstorm high-retention Instagram Story sequences with interactive polls, sticker prompts, and swipe-up CTAs.',
    icon: '📱',
    category: 'social',
    label: 'Brand / Creator Niche & Goal',
    placeholder: 'e.g., Fitness coach launching a 30-day summer strength challenge, goal to drive DM inquiries...'
  },
  'pinterest-pin-description': {
    title: 'Pinterest Pin Description Generator',
    desc: 'Write keyword-rich, click-worthy Pinterest descriptions with search-friendly hashtags and clear save incentives.',
    icon: '📌',
    category: 'social',
    label: 'Pin Topic & Destination URL Purpose',
    placeholder: 'e.g., Minimalist Scandinavian home office organization ideas with DIY floating shelves...'
  },
  'reddit-comment-reply': {
    title: 'Reddit Comment Reply Generator',
    desc: 'Draft authentic, value-first Reddit replies tailored to community etiquette and subreddit norms.',
    icon: '💬',
    category: 'social',
    label: 'Original Post Context & Your Perspective',
    placeholder: 'e.g., r/webdev thread asking if junior devs should learn TypeScript in 2026, supportive and practical advice...'
  },
  'discord-server-announcement': {
    title: 'Discord Server Announcement Generator',
    desc: 'Create formatted, community-ready Discord announcements with clean emoji headers, role pings, and event bullet points.',
    icon: '📢',
    category: 'social',
    label: 'Announcement Topic & Server Details',
    placeholder: 'e.g., Weekend community game night tournament with prizes and voice channel links for a gaming clan...'
  },
  'newsletter-subject-line': {
    title: 'Newsletter Subject Line Generator',
    desc: 'Generate high-open-rate email newsletter subject lines and preview text using curiosity, urgency, and value.',
    icon: '✉️',
    category: 'social',
    label: 'Newsletter Content & Target Audience',
    placeholder: 'e.g., Weekly tech digest explaining how generative AI is reshaping front-end development workflows...'
  },
  'social-proof-post': {
    title: 'Social Proof Post Generator',
    desc: 'Transform client testimonials, reviews, and metrics into captivating social proof posts for LinkedIn, X, and Instagram.',
    icon: '⭐',
    category: 'social',
    label: 'Customer Result, Quote or Milestone',
    placeholder: 'e.g., A SaaS client cut video rendering time from 2 hours to 8 minutes using our platform, quote praising speed...'
  },
  'behind-the-scenes-post': {
    title: 'Behind-the-Scenes Post Generator',
    desc: 'Write relatable behind-the-scenes social posts sharing creator workflows, mistakes, and raw production moments.',
    icon: '🎬',
    category: 'social',
    label: 'Project & Behind-the-Scenes Context',
    placeholder: 'e.g., Building a new media workspace feature late at night, troubleshooting CSS grid bugs with coffee...'
  },
  'follower-milestone-post': {
    title: 'Follower Milestone Post Generator',
    desc: 'Craft heartfelt, celebratory milestone announcement posts thanking supporters and sharing future roadmap vision.',
    icon: '🎉',
    category: 'social',
    label: 'Milestone Number & Platform',
    placeholder: 'e.g., Reaching 50,000 subscribers on YouTube after 2 years of weekly content creation, thanking the community...'
  },
  'personal-bio-about-me': {
    title: 'Personal Bio / About-Me Page Writer',
    desc: 'Generate versatile personal bios and about-me pages tailored for portfolios, LinkedIn, speaking bios, and social headers.',
    icon: '🖋️',
    category: 'social',
    label: 'Name, Career Field, Achievements & Personal Tone',
    placeholder: 'e.g., Full-stack engineer & video creator passionate about open source, modern web performance, friendly tone...'
  },

  // Category 3: Copywriting & Sales (8 tools + 1 mixed)
  'saas-feature-announcement': {
    title: 'SaaS Feature Announcement Writer',
    desc: 'Write compelling product update copy highlighting user benefits, problem-solution payoffs, and getting-started steps.',
    icon: '🚀',
    category: 'copywriting',
    label: 'Feature Name, Benefits & Availability',
    placeholder: 'e.g., Instant multi-stream sync feature allowing creators to watch 4 live streams without audio lag...'
  },
  'referral-program-copy': {
    title: 'Referral Program Copy Generator',
    desc: 'Craft persuasive double-sided referral copy for emails, landing pages, and in-app banners that drives viral invites.',
    icon: '🤝',
    category: 'copywriting',
    label: 'Incentive Structure & Audience',
    placeholder: 'e.g., Give $20, Get $20 referral program for a creator productivity app, targeting freelance editors...'
  },
  'app-store-listing-description': {
    title: 'App Store Listing Description Writer',
    desc: 'Compose ASO-optimized iOS App Store and Google Play descriptions with punchy feature bullets and promotional text.',
    icon: '📲',
    category: 'copywriting',
    label: 'App Name, Core Features & Target Users',
    placeholder: 'e.g., Multi Tube Views mobile companion app for side-by-side stream monitoring, zero account required...'
  },
  'crowdfunding-pitch-copy': {
    title: 'Crowdfunding Pitch Copy Generator',
    desc: 'Draft emotional, high-converting Kickstarter or Indiegogo campaign copy with mission hooks and reward tiers.',
    icon: '💡',
    category: 'copywriting',
    label: 'Project Vision, Target Goal & Backer Perks',
    placeholder: 'e.g., Open-source portable audio mixer for remote interviewers, $25k funding goal, early bird pricing...'
  },
  'real-estate-listing-description': {
    title: 'Real Estate Listing Description Writer',
    desc: 'Generate alluring property listing descriptions highlighting architectural details, neighborhood perks, and luxury finishes.',
    icon: '🏡',
    category: 'copywriting',
    label: 'Property Specs, Location & Special Features',
    placeholder: 'e.g., 3-bed 2-bath mid-century modern home in Austin with private sunlit courtyard, chef\'s kitchen, near parks...'
  },
  'restaurant-menu-description': {
    title: 'Restaurant Menu Description Writer',
    desc: 'Write mouth-watering culinary descriptions for restaurant menus using sensory adjectives and provenance details.',
    icon: '🍽️',
    category: 'copywriting',
    label: 'Dish Name, Ingredients & Cooking Style',
    placeholder: 'e.g., Wood-fired artisanal sourdough pizza with San Marzano tomatoes, fresh buffalo mozzarella, and aged balsamic...'
  },
  'event-invitation-copy': {
    title: 'Event Invitation Copy Generator',
    desc: 'Draft irresistible event invitations and RSVP copy for workshops, conferences, launches, and celebrations.',
    icon: '🎟️',
    category: 'copywriting',
    label: 'Event Name, Date, Key Highlights & Audience',
    placeholder: 'e.g., Creator Economy Summit 2026, virtual keynote session with industry leaders, networking lounge, free RSVP...'
  },
  'loyalty-program-copy': {
    title: 'Loyalty Program Copy Generator',
    desc: 'Create engaging loyalty and VIP rewards program copy with tier names, point-earning incentives, and exclusive perks.',
    icon: '💎',
    category: 'copywriting',
    label: 'Brand Niche & Reward Tiers',
    placeholder: 'e.g., Coffee subscription club with Bronze, Silver, and Gold bean tiers, free seasonal tasting boxes...'
  },
  'scholarship-grant-essay-helper': {
    title: 'Scholarship/Grant Application Essay Helper',
    desc: 'Structure inspiring scholarship and grant essays with personal narrative hooks, academic goals, and financial impact.',
    icon: '🎓',
    category: 'copywriting',
    label: 'Scholarship Prompt, Personal Background & Academic Goal',
    placeholder: 'e.g., First-generation STEM student applying for computer science leadership grant, community volunteer work...'
  },

  // Category 4: Creative & Narrative (8 tools)
  'mystery-plot-generator': {
    title: 'Mystery Plot Generator',
    desc: 'Generate intricate whodunit mystery plots complete with red herrings, hidden clues, motive twists, and detectives.',
    icon: '🔍',
    category: 'creative',
    label: 'Crime Setting, Victim & Detective Concept',
    placeholder: 'e.g., A renowned tech CEO found locked inside a soundproof vault at an annual retreat in the Swiss Alps...'
  },
  'scifi-concept-generator': {
    title: 'Sci-Fi Concept Generator',
    desc: 'Develop imaginative science fiction world premises, futuristic dilemmas, speculative tech, and story conflicts.',
    icon: '🛸',
    category: 'creative',
    label: 'Sci-Fi Subgenre & Core Speculative Premise',
    placeholder: 'e.g., Cyberpunk space colony where memories are traded as currency and a hacker uncovers a missing century...'
  },
  'monologue-writer': {
    title: 'Monologue Writer',
    desc: 'Write powerful dramatic, comedic, or introspective theatrical monologues tailored to character motivations.',
    icon: '🎭',
    category: 'creative',
    label: 'Character Profile, Emotion & Situation',
    placeholder: 'e.g., An astronaut delivering a final transmission back home after their ship gets caught in orbital drift...'
  },
  'character-name-generator': {
    title: 'Character Name Generator',
    desc: 'Generate themed character names with origins, symbolic meanings, titles, and nickname variations for writers.',
    icon: '👤',
    category: 'creative',
    label: 'Genre, Cultural Vibe & Character Role',
    placeholder: 'e.g., Dark fantasy rogue with noble ancestry, gritty Scandinavian sound, secretive personality...'
  },
  'setting-scene-description': {
    title: 'Setting/Scene Description Generator',
    desc: 'Create sensory-rich environment descriptions evoking atmosphere, lighting, smells, and emotional undertones.',
    icon: '🌄',
    category: 'creative',
    label: 'Location, Time of Day & Mood',
    placeholder: 'e.g., An overgrown abandoned botanical greenhouse during a twilight summer thunderstorm, eerie yet serene...'
  },
  'joke-pun-generator': {
    title: 'Joke & Pun Generator',
    desc: 'Generate clever dad jokes, situational puns, one-liners, and humorous banter on any topic or industry.',
    icon: '😄',
    category: 'creative',
    label: 'Topic, Profession or Keyword',
    placeholder: 'e.g., Software engineering, git commits, coffee addiction, clean and witty humor...'
  },
  'fable-moral-story': {
    title: 'Fable/Moral Story Generator',
    desc: 'Write timeless fables featuring animal protagonists, metaphorical challenges, and clear moral lessons.',
    icon: '🦊',
    category: 'creative',
    label: 'Lesson / Moral & Animal Characters',
    placeholder: 'e.g., An impatient hummingbird and a steady tortoise learning that haste without strategy wastes energy...'
  },
  'superhero-origin-story': {
    title: 'Superhero Origin Story Generator',
    desc: 'Craft thrilling superhero origin arcs with inciting incidents, unique power mechanics, flaws, and nemesis encounters.',
    icon: '⚡',
    category: 'creative',
    label: 'Power Concept, Identity & City Setting',
    placeholder: 'e.g., A sonic acoustics engineer in Neo-Chicago who gains the ability to manipulate kinetic sound vibrations...'
  },

  // Category 5: SEO & Discovery (8 tools)
  'faq-content-generator': {
    title: 'FAQ Content Generator',
    desc: 'Generate structured, SEO-friendly FAQ questions and authoritative answers with Schema.org readiness.',
    icon: '❓',
    category: 'seo',
    label: 'Product, Service or Topic',
    placeholder: 'e.g., Multi Tube Views public media player workspace, account requirements, supported platforms, and privacy...'
  },
  'product-page-seo-description': {
    title: 'Product Page SEO Description Writer',
    desc: 'Write high-ranking ecommerce product descriptions blending user-focused benefits with primary and secondary keywords.',
    icon: '🏷️',
    category: 'seo',
    label: 'Product Name, Target Keywords & Specs',
    placeholder: 'e.g., Ergonomic bamboo standing desk, target keywords: motorized adjustable desk, home office furniture...'
  },
  'blog-outline-generator': {
    title: 'Blog Outline Generator',
    desc: 'Generate comprehensive, search-optimized article outlines with H2/H3 headers, search intent matching, and takeaways.',
    icon: '📝',
    category: 'seo',
    label: 'Target Keyword & Topic Concept',
    placeholder: 'e.g., How to optimize video metadata for multi-platform streaming, comprehensive creator guide...'
  },
  'content-refresh-suggestions': {
    title: 'Content Refresh Suggestion Tool',
    desc: 'Analyze older blog posts or pages to generate actionable content updates, stat refreshes, and internal link ideas.',
    icon: '🔄',
    category: 'seo',
    label: 'Existing Article Title or URL Summary',
    placeholder: 'e.g., 2024 Guide to Social Media Video Aspect Ratios, needing 2026 platform dimension updates...'
  },
  'category-page-seo-description': {
    title: 'Category Page SEO Description Writer',
    desc: 'Write descriptive, keyword-targeted introductory copy for ecommerce or content category archive pages.',
    icon: '📂',
    category: 'seo',
    label: 'Category Name, Product Types & Target Intent',
    placeholder: 'e.g., Wireless creator microphones and audio gear, commercial intent, highlighting Lavalier and shotgun mics...'
  },
  'people-also-ask-answers': {
    title: 'People-Also-Ask Answer Generator',
    desc: 'Produce direct, authoritative 40-60 word answers specifically crafted to capture Google People Also Ask rich snippets.',
    icon: '💡',
    category: 'seo',
    label: 'Specific Question & Context',
    placeholder: 'e.g., Can you watch multiple Twitch and YouTube streams at the same time on one screen?...'
  },
  'title-tag-length-checker': {
    title: 'Title Tag Length Checker',
    desc: 'Evaluate SEO title tags for character length, pixel width approximation, power words, and mobile snippet truncation.',
    icon: '📏',
    category: 'seo',
    label: 'Proposed SEO Title Tag & Brand Name',
    placeholder: 'e.g., Best Multi-Platform Media Workspace for Creators (2026) | Multi Tube Views...'
  },
  'onpage-seo-checklist': {
    title: 'On-Page SEO Checklist Generator',
    desc: 'Generate tailored on-page optimization checklists covering title, meta, headers, images, schema, and internal links.',
    icon: '📋',
    category: 'seo',
    label: 'Page Type, Target Keyword & Audience',
    placeholder: 'e.g., Landing page targeting \'free online audio video converter\', high competition SaaS search...'
  },

  // Category 6: Technical & Code (8 tools)
  'regex-cheatsheet-generator': {
    title: 'Regex Cheat-Sheet Generator',
    desc: 'Generate custom regular expression patterns, flags, group explanations, and test cases for any text parsing task.',
    icon: '🔣',
    category: 'technical',
    label: 'Text Pattern Matching Goal',
    placeholder: 'e.g., Matching international phone numbers with optional country codes and dashed extensions...'
  },
  'http-status-code-explainer': {
    title: 'HTTP Status Code Explainer',
    desc: 'Explain HTTP response codes with root cause diagnoses, common triggers, RFC specifications, and client/server fixes.',
    icon: '🌐',
    category: 'technical',
    label: 'Status Code (e.g., 403, 429, 502, 504) & Context',
    placeholder: 'e.g., 504 Gateway Timeout occurring during reverse proxy file uploads on Nginx...'
  },
  'config-file-comment-generator': {
    title: 'Config File Comment Generator',
    desc: 'Add clear, professional documentation comments and security tips to complex JSON, YAML, TOML, or INI configs.',
    icon: '⚙️',
    category: 'technical',
    label: 'Configuration Snippet or Type',
    placeholder: 'e.g., Docker compose file with PostgreSQL, Redis cache, and Node backend service with volumes...'
  },
  'code-snippet-formatter-guide': {
    title: 'Code Snippet Formatter Guide',
    desc: 'Receive clean code styling guides, linter recommendations, naming conventions, and idiomatic refactoring tips.',
    icon: '🧹',
    category: 'technical',
    label: 'Language & Code Pattern',
    placeholder: 'e.g., TypeScript async/await error handling pattern in Express REST API controllers...'
  },
  'db-query-optimization-tips': {
    title: 'Database Query Optimization Tips Generator',
    desc: 'Analyze slow SQL and NoSQL queries to suggest index strategies, join optimizations, and execution plan fixes.',
    icon: '🗄️',
    category: 'technical',
    label: 'SQL Query, Table Structure & Database Engine',
    placeholder: 'e.g., PostgreSQL query joining 2 million rows of user events with transactions on created_at...'
  },
  'a11y-checklist-generator': {
    title: 'Web Accessibility (a11y) Checklist Generator',
    desc: 'Generate WCAG 2.2 AA compliance checklists tailored to web components, forms, modals, and screen reader navigability.',
    icon: '♿',
    category: 'technical',
    label: 'Component Type & User Flow',
    placeholder: 'e.g., Custom dropdown select menu with keyboard navigation and ARIA live regions...'
  },
  'browser-compatibility-notes': {
    title: 'Browser Compatibility Notes Generator',
    desc: 'Check modern CSS, JavaScript, and Web API features against browser support matrices with polyfill solutions.',
    icon: '💻',
    category: 'technical',
    label: 'Web Feature or API (e.g., CSS Container Queries, WebCodecs)',
    placeholder: 'e.g., CSS subgrid and view transitions API support across Chrome, Safari, and Firefox with fallbacks...'
  },
  'tech-stack-recommendation': {
    title: 'Tech Stack Recommendation Generator',
    desc: 'Evaluate project requirements to recommend optimal frontend, backend, database, and hosting architecture stacks.',
    icon: '🏗️',
    category: 'technical',
    label: 'Project Idea, Scale & Team Skillset',
    placeholder: 'e.g., Real-time collaborative whiteboard app with 10k concurrent users, solo developer proficient in React...'
  }
};

console.log('Batch 3 count:', Object.keys(BATCH_3_TOOLS).length);

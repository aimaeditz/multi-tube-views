import fs from 'fs';
import path from 'path';

// Complete 50 Batch 3 tools with rich promptTemplates and systemInstructions
export const BATCH_3_FULL_DATA = {
  // Category 1: Video & Scripting (8)
  'vlog-script': {
    title: 'Vlog Script Generator',
    desc: 'Generate engaging vlog scripts with dynamic intros, talking points, b-roll cues, and sign-offs.',
    icon: '📹',
    category: 'video',
    label: 'Vlog Topic & Setting',
    placeholder: 'e.g., Day in the life of a remote software developer in Tokyo, focusing on morning routine and co-working spaces...',
    promptTemplate: 'Write a dynamic, highly engaging vlog video script for: {topic}. Structure with: 1) 0:00-0:15 Teaser Hook & Visual Cold Open, 2) 0:15-1:00 Cinematic Title & Day Objective, 3) 3-4 Core Story Segments with [Visual Cues], [A-Roll Talking Points], and [B-Roll Cutaway Instructions], 4) Climax / Reflection Moment, and 5) Natural Outro & Community Question.',
    systemInstruction: 'You are a master vlog producer and storytelling director. Write an engaging vlog script complete with timecodes, on-screen text instructions, visual camera directions, conversational talking points, and b-roll suggestions.',
    alias: 'script-outline'
  },
  'unboxing-script': {
    title: 'Unboxing Video Script Generator',
    desc: 'Create high-energy product unboxing scripts with package impressions, feature reveals, and first tests.',
    icon: '📦',
    category: 'video',
    label: 'Product Details & Key Features',
    placeholder: 'e.g., Noise-cancelling wireless headphones with 40hr battery, premium matte case, and sound quality tests...',
    promptTemplate: 'Write an exciting, high-retention product unboxing video script for: {topic}. Include: 1) Packaging Impressions & ASMR Box Opening cues, 2) First Glance Build Quality & In-The-Hand Feel, 3) Guided Tour of Included Accessories, 4) Immediate First-Impression Test / Demo, and 5) Honest Early Verdict with Recommendation.',
    systemInstruction: 'You are a professional tech and gadget reviewer. Write a high-energy, authentic product unboxing script with tactile sensory cues, macro camera angles, feature walkthroughs, and balanced consumer advice.',
    alias: 'sales-headline'
  },
  'tutorial-step-script': {
    title: 'Tutorial Video Step Script Generator',
    desc: 'Structure clear, numbered step-by-step tutorial scripts with beginner-friendly explanations and screen callouts.',
    icon: '🛠️',
    category: 'video',
    label: 'Tutorial Subject & Skill Level',
    placeholder: 'e.g., How to build a responsive portfolio website with Tailwind CSS for beginner web developers...',
    promptTemplate: 'Create a clear, structured step-by-step tutorial script for: {topic}. Include: 1) The Finished Result Preview (What viewers will achieve), 2) Prerequisites & Tool Setup, 3) Chronological numbered steps with exact [On-Screen Visuals] and [Audio Explanations], 4) Common pitfalls and how to avoid them, and 5) Summary recap and next steps.',
    systemInstruction: 'You are an expert technical educator and tutorial designer. Write a crystal-clear, pedagogical video script with numbered micro-steps, callout banners, zoomed UI cues, and foolproof guidance.',
    alias: 'script-outline'
  },
  'sponsorship-read-script': {
    title: 'Video Sponsorship Read Script Generator',
    desc: 'Draft organic, seamless sponsorship ad reads with smooth segment transitions and strong discount codes.',
    icon: '🎙️',
    category: 'video',
    label: 'Sponsor Brand, Offer & Talking Points',
    placeholder: 'e.g., NordVPN 70% off deal with code MULTI, emphasizing security on public Wi-Fi and geo-unblocking...',
    promptTemplate: 'Write an organic, seamless 60-second sponsored ad integration script for: {topic}. Provide: 1) A natural segue from typical creator content into the sponsor, 2) Personal genuine endorsement angle, 3) 3 mandatory brand talking points framed around audience benefits, 4) Special discount callout with unique code/link, and 5) Smooth transition back into the main video.',
    systemInstruction: 'You are a creator economy sponsorship strategist. Write natural, high-converting 60-second sponsor ad reads that retain audience interest while fulfilling key sponsor talking points and promo codes.',
    alias: 'sponsor-script'
  },
  'documentary-narration-script': {
    title: 'Documentary Narration Script Generator',
    desc: 'Compose cinematic, immersive voiceover narration for historical, scientific, or investigative mini-documentaries.',
    icon: '🎥',
    category: 'video',
    label: 'Documentary Topic & Tone',
    placeholder: 'e.g., The rise and sudden disappearance of the Mayan civilization in the 9th century, dramatic and reflective...',
    promptTemplate: 'Compose cinematic, immersive voiceover narration copy for a mini-documentary on: {topic}. Structure with: 1) Atmospheric opening hook with sweeping visual cues, 2) Historical context and tension build, 3) The turning point / crisis, 4) Critical analysis with pacing pauses indicated by [pause], and 5) Resonant philosophical conclusion.',
    systemInstruction: 'You are a renowned documentary filmmaker and voiceover writer. Compose evocative, lyrical, and well-researched narration with dramatic pacing, musical cues, and thought-provoking insights.',
    alias: 'voiceover-formatter'
  },
  'gaming-commentary-script': {
    title: 'Gaming Commentary Script Generator',
    desc: 'Produce punchy gameplay commentary outlines with banter hooks, hype reactions, and viewer engagement cues.',
    icon: '🎮',
    category: 'video',
    label: 'Game Title & Playthrough Scenario',
    placeholder: 'e.g., Elden Ring boss fight with level 1 wretch challenge, highlighting humorous deaths and clutch victory...',
    promptTemplate: 'Create an energetic gaming commentary outline and talking-points guide for: {topic}. Include: 1) Challenge premise and stakes setup, 2) Key gameplay checkpoints with reaction triggers, 3) 5 witty banter topics to fill slow moments, 4) Live chat / audience engagement prompts, and 5) Climax celebration / cliffhanger teaser.',
    systemInstruction: 'You are a top gaming content creator and streamer. Produce high-energy, humorous, and engaging gameplay commentary cues, comedic self-deprecations, hype moments, and chat interactions.',
    alias: 'video-hook'
  },
  'cooking-video-script': {
    title: 'Cooking Video Script Generator',
    desc: 'Craft delicious, pace-optimized cooking and recipe scripts with ingredient callouts and sensory descriptions.',
    icon: '🍳',
    category: 'video',
    label: 'Recipe Name, Key Ingredients & Style',
    placeholder: 'e.g., 15-minute creamy garlic butter Tuscan shrimp pasta, quick weeknight dinner style with sizzling audio cues...',
    promptTemplate: 'Write an irresistible, pace-optimized recipe video script for: {topic}. Provide: 1) Sensory hero shot description (cheese pull, sizzle, steam), 2) Mise-en-place ingredient list graphic text, 3) Step-by-step culinary process with chef techniques & flavor secrets, 4) Plating presentation tips, and 5) The first bite taste test reaction and call to save the recipe.',
    systemInstruction: 'You are a culinary television writer and food creator. Write delicious, sensory-rich recipe scripts featuring crisp Foley audio cues, culinary terminology, time-saving kitchen hacks, and mouthwatering descriptions.',
    alias: 'script-outline'
  },
  'travel-vlog-script': {
    title: 'Travel Vlog Script Generator',
    desc: 'Generate wanderlust-inducing travel vlog itineraries and narration covering hidden gems, food, and culture.',
    icon: '✈️',
    category: 'video',
    label: 'Destination, Highlights & Travel Style',
    placeholder: 'e.g., 48 hours in Lisbon exploring historic Alfama, pastel de nata bakeries, and scenic tram viewpoints on a budget...',
    promptTemplate: 'Write an inspiring, wanderlust-inducing travel vlog script for: {topic}. Include: 1) Arrival montage & first impressions hook, 2) Hidden gem recommendation off the beaten tourist path, 3) Local culinary experience with taste descriptions, 4) Practical budgeting & transport tips, and 5) Golden hour sunset reflection and itinerary wrap-up.',
    systemInstruction: 'You are an adventurous travel filmmaker. Write evocative, cultural travel vlog scripts with scenic location callouts, honest traveler advice, budgeting notes, and inspiring storytelling.',
    alias: 'script-outline'
  },

  // Category 2: Social & Growth (8 + 1 mixed)
  'instagram-story-ideas': {
    title: 'Instagram Story Idea Generator',
    desc: 'Brainstorm high-retention Instagram Story sequences with interactive polls, sticker prompts, and swipe-up CTAs.',
    icon: '📱',
    category: 'social',
    label: 'Brand / Creator Niche & Goal',
    placeholder: 'e.g., Fitness coach launching a 30-day summer strength challenge, goal to drive DM inquiries...',
    promptTemplate: 'Generate a high-converting 5-part Instagram Story sequence for: {topic}. For each frame provide: 1) Story format (Photo / Video / Boomerang), 2) Exact on-screen text copy, 3) Interactive sticker mechanism (Poll, Quiz, Slider, Question Box, Link Sticker), and 4) Psychological engagement trigger.',
    systemInstruction: 'You are an Instagram engagement and conversion specialist. Design interactive, tap-forward-resistant Instagram Story arcs that drive comments, sticker taps, and direct message conversations.',
    alias: 'tiktok-caption'
  },
  'pinterest-pin-description': {
    title: 'Pinterest Pin Description Generator',
    desc: 'Write keyword-rich, click-worthy Pinterest descriptions with search-friendly hashtags and clear save incentives.',
    icon: '📌',
    category: 'social',
    label: 'Pin Topic & Destination URL Purpose',
    placeholder: 'e.g., Minimalist Scandinavian home office organization ideas with DIY floating shelves...',
    promptTemplate: 'Generate 4 search-optimized Pinterest Pin descriptions for: {topic}. Each description must include: 1) An inspiring, click-worthy opening hook, 2) High-volume natural keywords integrated seamlessly, 3) A compelling reason to Save / Pin for later, and 4) 5 targeted Pinterest hashtags.',
    systemInstruction: 'You are an organic Pinterest marketing and SEO expert. Write engaging, algorithm-optimized pin descriptions that maximize saves, repins, and outbound click-through rates.',
    alias: 'meta-description'
  },
  'reddit-comment-reply': {
    title: 'Reddit Comment Reply Generator',
    desc: 'Draft authentic, value-first Reddit replies tailored to community etiquette and subreddit norms.',
    icon: '💬',
    category: 'social',
    label: 'Original Post Context & Your Perspective',
    placeholder: 'e.g., r/webdev thread asking if junior devs should learn TypeScript in 2026, supportive and practical advice...',
    promptTemplate: 'Write 3 distinct, authentic Reddit replies for: {topic}. Variation 1: The Helpful Veteran (In-depth practical advice with formatting). Variation 2: The Direct & Concise TL;DR. Variation 3: The Empathetic Discussion Starter. All replies must adhere strictly to Reddiquette, avoiding corporate jargon or self-promotional spam.',
    systemInstruction: 'You are a veteran Redditor and community contributor. Write helpful, culturally authentic Reddit comments that respect subreddit norms, use clean markdown, and provide undeniable value.',
    alias: 'hate-comment-reply'
  },
  'discord-server-announcement': {
    title: 'Discord Server Announcement Generator',
    desc: 'Create formatted, community-ready Discord announcements with clean emoji headers, role pings, and event bullet points.',
    icon: '📢',
    category: 'social',
    label: 'Announcement Topic & Server Details',
    placeholder: 'e.g., Weekend community game night tournament with prizes and voice channel links for a gaming clan...',
    promptTemplate: 'Draft a polished, high-engagement Discord announcement message for: {topic}. Format using markdown headers, quote blocks, bulleted event logistics, channel link mentions, relevant emoji accents, and appropriate role tag callouts (@everyone / @here / @Announcements).',
    systemInstruction: 'You are a community manager and Discord administrator. Craft exciting, easily scannable server announcements with clear formatting, action links, and lively community culture.',
    alias: 'product-launch-copy'
  },
  'newsletter-subject-line': {
    title: 'Newsletter Subject Line Generator',
    desc: 'Generate high-open-rate email newsletter subject lines and preview text using curiosity, urgency, and value.',
    icon: '✉️',
    category: 'social',
    label: 'Newsletter Content & Target Audience',
    placeholder: 'e.g., Weekly tech digest explaining how generative AI is reshaping front-end development workflows...',
    promptTemplate: 'Generate 12 high-open-rate email subject lines paired with snippet/preview text for: {topic}. Categorize into: 1) Curiosity Gap (3), 2) Direct Benefit & How-To (3), 3) Urgent / FOMO (3), and 4) Short & Intriguing (under 35 characters) (3).',
    systemInstruction: 'You are an email marketing director with a focus on open rates. Generate punchy, spam-trigger-free subject lines and preview text pairs engineered for maximum inbox visibility.',
    alias: 'newsletter-subject-ab'
  },
  'social-proof-post': {
    title: 'Social Proof Post Generator',
    desc: 'Transform client testimonials, reviews, and metrics into captivating social proof posts for LinkedIn, X, and Instagram.',
    icon: '⭐',
    category: 'social',
    label: 'Customer Result, Quote or Milestone',
    placeholder: 'e.g., A SaaS client cut video rendering time from 2 hours to 8 minutes using our platform, quote praising speed...',
    promptTemplate: 'Transform this customer success story into 3 high-impact social proof posts for: {topic}. Variation 1: The LinkedIn Case Study (Hook -> Challenge -> Solution -> Quantified Win -> Takeaway). Variation 2: The X/Twitter Single Post (Crisp metric + customer quote). Variation 3: The Humble Gratitude Post celebrating client success.',
    systemInstruction: 'You are a B2B product marketing and customer evidence specialist. Write compelling social proof posts that highlight customer ROI without sounding boastful or scripted.',
    alias: 'linkedin-hook'
  },
  'behind-the-scenes-post': {
    title: 'Behind-the-Scenes Post Generator',
    desc: 'Write relatable behind-the-scenes social posts sharing creator workflows, mistakes, and raw production moments.',
    icon: '🎬',
    category: 'social',
    label: 'Project & Behind-the-Scenes Context',
    placeholder: 'e.g., Building a new media workspace feature late at night, troubleshooting CSS grid bugs with coffee...',
    promptTemplate: 'Write 3 authentic, relatable behind-the-scenes social media posts for: {topic}. Include: 1) The unpolished reality / struggle, 2) The creative breakthrough or lesson learned, 3) High-engagement question inviting followers to share their own experience, and 4) Suggested visual format (desk photo, screen recording, timelapse).',
    systemInstruction: 'You are a brand storyteller and personal branding expert. Write transparent, humble, and captivating behind-the-scenes updates that forge deep emotional connections with audiences.',
    alias: 'linkedin-hook'
  },
  'follower-milestone-post': {
    title: 'Follower Milestone Post Generator',
    desc: 'Craft heartfelt, celebratory milestone announcement posts thanking supporters and sharing future roadmap vision.',
    icon: '🎉',
    category: 'social',
    label: 'Milestone Number & Platform',
    placeholder: 'e.g., Reaching 50,000 subscribers on YouTube after 2 years of weekly content creation, thanking the community...',
    promptTemplate: 'Write a heartfelt, inspirational milestone celebration post for: {topic}. Structure with: 1) The humble beginning (day 1 retrospective), 2) Genuine gratitude to the early supporters and community, 3) 3 biggest lessons learned along the way, 4) Exciting teaser of what is coming next, and 5) Community give-back / celebratory CTA.',
    systemInstruction: 'You are a creator community strategist. Craft celebratory milestone posts that center on community gratitude, personal vulnerability, and inspiring future momentum rather than vanity metrics.',
    alias: 'linkedin-hook'
  },
  'personal-bio-about-me': {
    title: 'Personal Bio / About-Me Page Writer',
    desc: 'Generate versatile personal bios and about-me pages tailored for portfolios, LinkedIn, speaking bios, and social headers.',
    icon: '🖋️',
    category: 'social',
    label: 'Name, Career Field, Achievements & Personal Tone',
    placeholder: 'e.g., Full-stack engineer & video creator passionate about open source, modern web performance, friendly tone...',
    promptTemplate: 'Generate 4 versatile personal bio variations based on: {topic}. Provide: 1) Ultra-Short Social Bio (<160 chars for Twitter/Instagram), 2) Elevator Pitch Bio (1 paragraph for LinkedIn summary), 3) Formal Speaker / Conference Bio (3rd-person, highlighting credentials), and 4) Website About-Me Page Narrative (1st-person, warm, personal story).',
    systemInstruction: 'You are a professional executive branding consultant and copywriter. Write distinct, authentic personal bios that position the individual as an authoritative yet relatable leader in their field.',
    alias: 'bio-generator'
  },

  // Category 3: Copywriting & Sales (8 + 1 mixed)
  'saas-feature-announcement': {
    title: 'SaaS Feature Announcement Writer',
    desc: 'Write compelling product update copy highlighting user benefits, problem-solution payoffs, and getting-started steps.',
    icon: '🚀',
    category: 'copywriting',
    label: 'Feature Name, Benefits & Availability',
    placeholder: 'e.g., Instant multi-stream sync feature allowing creators to watch 4 live streams without audio lag...',
    promptTemplate: 'Write a comprehensive product feature announcement copy package for: {topic}. Include: 1) Exciting Hero Headline & Subhead, 2) The Old Way vs The New Way comparison, 3) 3 Core User Benefits with micro-illustrations, 4) Quick 3-step getting started guide, and 5) In-app notification banner copy.',
    systemInstruction: 'You are a senior product marketing manager at a high-growth SaaS company. Write crisp, benefit-driven feature announcements that drive immediate adoption and reduce customer friction.',
    alias: 'product-launch-copy'
  },
  'referral-program-copy': {
    title: 'Referral Program Copy Generator',
    desc: 'Craft persuasive double-sided referral copy for emails, landing pages, and in-app banners that drives viral invites.',
    icon: '🤝',
    category: 'copywriting',
    label: 'Incentive Structure & Audience',
    placeholder: 'e.g., Give $20, Get $20 referral program for a creator productivity app, targeting freelance editors...',
    promptTemplate: 'Generate a complete high-converting referral program copy kit for: {topic}. Provide: 1) Catchy program name & tagline, 2) In-app referral modal copy explaining the dual incentive, 3) Pre-written invite email for users to send to friends, 4) 1-click shareable social message, and 5) FAQ addressing program rules and payout terms.',
    systemInstruction: 'You are a growth marketer specializing in viral referral loops. Write double-sided referral copy that clearly articulates mutual value and motivates immediate sharing.',
    alias: 'cta-multiplier'
  },
  'app-store-listing-description': {
    title: 'App Store Listing Description Writer',
    desc: 'Compose ASO-optimized iOS App Store and Google Play descriptions with punchy feature bullets and promotional text.',
    icon: '📲',
    category: 'copywriting',
    label: 'App Name, Core Features & Target Users',
    placeholder: 'e.g., Multi Tube Views mobile companion app for side-by-side stream monitoring, zero account required...',
    promptTemplate: 'Write an ASO-optimized App Store and Google Play listing copy kit for: {topic}. Include: 1) 30-character App Title with primary keyword, 2) 30-character Subtitle, 3) 170-character Promotional Text, 4) Compelling above-the-fold description hook, 5) Feature breakdown formatted with bullet emojis, and 6) Keyword list suggestions.',
    systemInstruction: 'You are an App Store Optimization (ASO) and mobile copywriting expert. Write conversion-focused app descriptions that balance search indexing with high download conversion rates.',
    alias: 'meta-description'
  },
  'crowdfunding-pitch-copy': {
    title: 'Crowdfunding Pitch Copy Generator',
    desc: 'Draft emotional, high-converting Kickstarter or Indiegogo campaign copy with mission hooks and reward tiers.',
    icon: '💡',
    category: 'copywriting',
    label: 'Project Vision, Target Goal & Backer Perks',
    placeholder: 'e.g., Open-source portable audio mixer for remote interviewers, $25k funding goal, early bird pricing...',
    promptTemplate: 'Draft a compelling crowdfunding campaign pitch for Kickstarter/Indiegogo based on: {topic}. Structure with: 1) Mission statement & opening emotional hook, 2) The problem in today\'s market and why our solution is unique, 3) Technical specs / craftsmanship details, 4) 3 structured backer reward tiers (Early Bird, Standard, VIP Bundle), and 5) Creator bio & fulfillment timeline commitment.',
    systemInstruction: 'You are a crowdfunding launch consultant with multiple funded campaigns. Write emotive, trustworthy, and urgent project copy that turns casual readers into passionate financial backers.',
    alias: 'sales-headline'
  },
  'real-estate-listing-description': {
    title: 'Real Estate Listing Description Writer',
    desc: 'Generate alluring property listing descriptions highlighting architectural details, neighborhood perks, and luxury finishes.',
    icon: '🏡',
    category: 'copywriting',
    label: 'Property Specs, Location & Special Features',
    placeholder: 'e.g., 3-bed 2-bath mid-century modern home in Austin with private sunlit courtyard, chef\'s kitchen, near parks...',
    promptTemplate: 'Write 3 captivating real estate property descriptions for: {topic}. Include: 1) The Luxury Editorial Style (Emphasizing architecture, natural light, and lifestyle), 2) The Feature-Packed MLS Summary (Bed/bath, square footage, upgrades, school districts), and 3) The Social Media Teaser with emoji highlights and open-house CTA.',
    systemInstruction: 'You are a high-end luxury real estate copywriter. Write descriptive, evocative property listings that paint an irresistible picture of homeownership and highlight premium architectural features.',
    alias: 'meta-description'
  },
  'restaurant-menu-description': {
    title: 'Restaurant Menu Description Writer',
    desc: 'Write mouth-watering culinary descriptions for restaurant menus using sensory adjectives and provenance details.',
    icon: '🍽️',
    category: 'copywriting',
    label: 'Dish Name, Ingredients & Cooking Style',
    placeholder: 'e.g., Wood-fired artisanal sourdough pizza with San Marzano tomatoes, fresh buffalo mozzarella, and aged balsamic...',
    promptTemplate: 'Write 5 enticing, mouthwatering restaurant menu descriptions for: {topic}. Focus on artisanal preparation methods (slow-roasted, wood-fired, hand-folded), ingredient provenance, texture contrasts, and delicate flavor pairings that elevate perceived value and appetite appeal.',
    systemInstruction: 'You are a gastronomic menu consultant and culinary writer. Craft sensory, evocative menu item descriptions that highlight flavor profiles, cooking methods, and artisan sourcing.',
    alias: 'metaphor-finder'
  },
  'event-invitation-copy': {
    title: 'Event Invitation Copy Generator',
    desc: 'Draft irresistible event invitations and RSVP copy for workshops, conferences, launches, and celebrations.',
    icon: '🎟️',
    category: 'copywriting',
    label: 'Event Name, Date, Key Highlights & Audience',
    placeholder: 'e.g., Creator Economy Summit 2026, virtual keynote session with industry leaders, networking lounge, free RSVP...',
    promptTemplate: 'Create an irresistible event invitation copy package for: {topic}. Include: 1) 3 Subject Line options with RSVP urgency, 2) Engaging email invitation highlighting keynote speakers and key takeaways, 3) 3 quick bullet reasons why attendees cannot afford to miss it, 4) Clear logistical details (Date, Time, Virtual/In-Person, RSVP deadline), and 5) High-converting registration button microcopy.',
    systemInstruction: 'You are an event marketing copywriter. Craft compelling, calendar-worthy invitations that communicate high value, exclusive networking, and clear urgency to maximize RSVP rates.',
    alias: 'product-launch-copy'
  },
  'loyalty-program-copy': {
    title: 'Loyalty Program Copy Generator',
    desc: 'Create engaging loyalty and VIP rewards program copy with tier names, point-earning incentives, and exclusive perks.',
    icon: '💎',
    category: 'copywriting',
    label: 'Brand Niche & Reward Tiers',
    placeholder: 'e.g., Coffee subscription club with Bronze, Silver, and Gold bean tiers, free seasonal tasting boxes...',
    promptTemplate: 'Design a complete customer loyalty and VIP program copy suite for: {topic}. Provide: 1) Creative program name & currency (e.g. Points, Stars, Credits), 2) 3 distinct tier names with unlock criteria, 3) Specific exclusive perks for each tier, 4) Welcome email copy upon enrollment, and 5) Milestone celebration notification when a member levels up.',
    systemInstruction: 'You are a customer retention and loyalty program copywriter. Design exciting, aspirational reward tier structures and persuasive microcopy that incentivizes repeat purchases.',
    alias: 'feature-to-benefit'
  },
  'scholarship-grant-essay-helper': {
    title: 'Scholarship/Grant Application Essay Helper',
    desc: 'Structure inspiring scholarship and grant essays with personal narrative hooks, academic goals, and financial impact.',
    icon: '🎓',
    category: 'copywriting',
    label: 'Scholarship Prompt, Personal Background & Academic Goal',
    placeholder: 'e.g., First-generation STEM student applying for computer science leadership grant, community volunteer work...',
    promptTemplate: 'Draft a compelling, structured scholarship/grant application essay outline and draft for: {topic}. Structure with: 1) Personal Narrative Hook (Formative moment / overcoming obstacle), 2) Academic & Career Ambitions (Clear vision for the future), 3) Community Impact & Leadership (Giving back to others), and 4) Financial Justification (How this specific grant removes barriers to graduation).',
    systemInstruction: 'You are an academic advisor and admissions consultant. Craft inspiring, authentic scholarship application essays that highlight student resilience, leadership, academic excellence, and societal impact.',
    alias: 'sales-headline'
  },

  // Category 4: Creative & Narrative (8)
  'mystery-plot-generator': {
    title: 'Mystery Plot Generator',
    desc: 'Generate intricate whodunit mystery plots complete with red herrings, hidden clues, motive twists, and detectives.',
    icon: '🔍',
    category: 'creative',
    label: 'Crime Setting, Victim & Detective Concept',
    placeholder: 'e.g., A renowned tech CEO found locked inside a soundproof vault at an annual retreat in the Swiss Alps...',
    promptTemplate: 'Develop an intricate, page-turning mystery plot based on: {topic}. Include: 1) The Crime Scene & Baffling Circumstance, 2) The Lead Investigator profile and personal weakness, 3) 3 Plausible Suspects with distinct motives and alibis, 4) 2 Misleading Red Herrings and 1 Crucial Overlooked Clue, and 5) The Shocking Climax Revelation explaining the true culprit\'s method.',
    systemInstruction: 'You are a bestselling mystery and thriller novelist. Craft ingenious whodunit plots featuring airtight alibis, subtle foreshadowing, deceptive red herrings, and shocking logical resolutions.',
    alias: 'cliffhanger-crafter'
  },
  'scifi-concept-generator': {
    title: 'Sci-Fi Concept Generator',
    desc: 'Develop imaginative science fiction world premises, futuristic dilemmas, speculative tech, and story conflicts.',
    icon: '🛸',
    category: 'creative',
    label: 'Sci-Fi Subgenre & Core Speculative Premise',
    placeholder: 'e.g., Cyberpunk space colony where memories are traded as currency and a hacker uncovers a missing century...',
    promptTemplate: 'Develop an imaginative, thought-provoking science fiction story universe concept for: {topic}. Provide: 1) The Speculative "What If?" Core Premise, 2) The Technological / Scientific Breakthrough and its unintended dark side, 3) Society\'s Division (Who benefits vs who suffers), 4) The Protagonist\'s moral dilemma, and 5) 3 major story arcs or chapter catalysts.',
    systemInstruction: 'You are an award-winning science fiction author and speculative futurist. Develop mind-bending, socially insightful sci-fi premises with unique technology systems and rich philosophical questions.',
    alias: 'metaphor-finder'
  },
  'monologue-writer': {
    title: 'Monologue Writer',
    desc: 'Write powerful dramatic, comedic, or introspective theatrical monologues tailored to character motivations.',
    icon: '🎭',
    category: 'creative',
    label: 'Character Profile, Emotion & Situation',
    placeholder: 'e.g., An astronaut delivering a final transmission back home after their ship gets caught in orbital drift...',
    promptTemplate: 'Write a powerful, audition-ready character monologue based on: {topic}. Include: 1) Character background & emotional objective (What do they desperately want?), 2) Stage directions & subtext cues in [brackets], 3) An escalating emotional shift from beginning to end, and 4) A memorable, punchy final closing statement.',
    systemInstruction: 'You are a master playwright and dramatic screenwriter. Write gripping, nuanced monologues featuring authentic rhythm, raw vulnerability, sharp comedic or dramatic turns, and rich subtext.',
    alias: 'voiceover-formatter'
  },
  'character-name-generator': {
    title: 'Character Name Generator',
    desc: 'Generate themed character names with origins, symbolic meanings, titles, and nickname variations for writers.',
    icon: '👤',
    category: 'creative',
    label: 'Genre, Cultural Vibe & Character Role',
    placeholder: 'e.g., Dark fantasy rogue with noble ancestry, gritty Scandinavian sound, secretive personality...',
    promptTemplate: 'Generate 15 evocative, memorable character names tailored to: {topic}. For each name provide: 1) Full Name, 2) Cultural / Linguistic Origin, 3) Hidden Etymological Meaning or Symbolism, 4) Common In-World Nickname, and 5) An optional Title or Epithet.',
    systemInstruction: 'You are a literary naming specialist and folklorist. Create distinctive, resonant character names tailored to genres, worldbuilding cultures, and narrative archetypes.',
    alias: 'one-liner-maker'
  },
  'setting-scene-description': {
    title: 'Setting/Scene Description Generator',
    desc: 'Create sensory-rich environment descriptions evoking atmosphere, lighting, smells, and emotional undertones.',
    icon: '🌄',
    category: 'creative',
    label: 'Location, Time of Day & Mood',
    placeholder: 'e.g., An overgrown abandoned botanical greenhouse during a twilight summer thunderstorm, eerie yet serene...',
    promptTemplate: 'Write a sensory-rich, atmospheric scene setting description for: {topic}. Engage all 5 senses: 1) Sight (Lighting, architecture, shadows, palette), 2) Sound (Ambient acoustics, distant whispers, cadence), 3) Smell & Taste (Atmospheric scents, moisture, decay or freshness), 4) Touch (Temperature, textures, humidity), and 5) The psychological mood evoked in a character entering the space.',
    systemInstruction: 'You are an evocative creative writing coach and novelist. Craft vivid, immersive setting descriptions that use figurative language, sensory immersion, and emotional resonance.',
    alias: 'metaphor-finder'
  },
  'joke-pun-generator': {
    title: 'Joke & Pun Generator',
    desc: 'Generate clever dad jokes, situational puns, one-liners, and humorous banter on any topic or industry.',
    icon: '😄',
    category: 'creative',
    label: 'Topic, Profession or Keyword',
    placeholder: 'e.g., Software engineering, git commits, coffee addiction, clean and witty humor...',
    promptTemplate: 'Generate 15 clever, family-friendly jokes and witty puns on: {topic}. Group them into: 1) Quick One-Liners (5), 2) Punny Dad Jokes with setup/punchline (5), and 3) Relatable Observational Situations (5). Keep them sharp, clever, and entertaining.',
    systemInstruction: 'You are a stand-up comedian and comedy writer. Craft punchy, witty, clean jokes and puns with sharp comedic timing, wordplay, and relatable observations.',
    alias: 'one-liner-maker'
  },
  'fable-moral-story': {
    title: 'Fable/Moral Story Generator',
    desc: 'Write timeless fables featuring animal protagonists, metaphorical challenges, and clear moral lessons.',
    icon: '🦊',
    category: 'creative',
    label: 'Lesson / Moral & Animal Characters',
    placeholder: 'e.g., An impatient hummingbird and a steady tortoise learning that haste without strategy wastes energy...',
    promptTemplate: 'Write a charming, timeless fable based on: {topic}. Structure with: 1) The animal protagonists and their contrasting traits, 2) The unexpected challenge or contest they face in the wild, 3) The humorous or humbling consequence of folly, 4) The moment of realization and assistance, and 5) The explicit moral proverb stated clearly at the end.',
    systemInstruction: 'You are a classic storyteller in the tradition of Aesop and La Fontaine. Write timeless, metaphorical fables with charming animal characters, vivid natural imagery, and clear philosophical morals.',
    alias: 'metaphor-finder'
  },
  'superhero-origin-story': {
    title: 'Superhero Origin Story Generator',
    desc: 'Craft thrilling superhero origin arcs with inciting incidents, unique power mechanics, flaws, and nemesis encounters.',
    icon: '⚡',
    category: 'creative',
    label: 'Power Concept, Identity & City Setting',
    placeholder: 'e.g., A sonic acoustics engineer in Neo-Chicago who gains the ability to manipulate kinetic sound vibrations...',
    promptTemplate: 'Develop a thrilling superhero origin story package for: {topic}. Provide: 1) Civilian identity, mundane profession, and personal trauma, 2) The inciting scientific / mystical accident that granted abilities, 3) Detailed power mechanics (strengths, physics, and critical biological limits), 4) The Hero Code & Costume Aesthetic, and 5) The birth of their arch-nemesis.',
    systemInstruction: 'You are a veteran comic book writer and narrative worldbuilder. Create dynamic, grounded superhero origin mythologies with distinct power rules, character vulnerabilities, and epic villain connections.',
    alias: 'audience-persona'
  },

  // Category 5: SEO & Discovery (8)
  'faq-content-generator': {
    title: 'FAQ Content Generator',
    desc: 'Generate structured, SEO-friendly FAQ questions and authoritative answers with Schema.org readiness.',
    icon: '❓',
    category: 'seo',
    label: 'Product, Service or Topic',
    placeholder: 'e.g., Multi Tube Views public media player workspace, account requirements, supported platforms, and privacy...',
    promptTemplate: 'Generate a structured, SEO-friendly FAQ section for: {topic}. Provide 8 high-intent user questions accompanied by clear, authoritative 40-70 word answers. Include a ready-to-copy JSON-LD FAQPage schema markup snippet for direct inclusion in webpage headers.',
    systemInstruction: 'You are an SEO content strategist and technical Schema specialist. Generate high-intent, crawl-friendly FAQs with accurate answers and valid Schema.org FAQPage JSON-LD code.',
    alias: 'faq-generator'
  },
  'product-page-seo-description': {
    title: 'Product Page SEO Description Writer',
    desc: 'Write high-ranking ecommerce product descriptions blending user-focused benefits with primary and secondary keywords.',
    icon: '🏷️',
    category: 'seo',
    label: 'Product Name, Target Keywords & Specs',
    placeholder: 'e.g., Ergonomic bamboo standing desk, target keywords: motorized adjustable desk, home office furniture...',
    promptTemplate: 'Write an SEO-optimized, high-converting product page description for: {topic}. Structure with: 1) Keyword-rich H1 title and compelling product narrative hook, 2) Bulleted key features paired with tangible user benefits, 3) Technical specifications table format, 4) Natural integration of primary and LSI search keywords, and 5) Clear trust badges and purchase CTA.',
    systemInstruction: 'You are an ecommerce SEO copywriter. Write ranking-focused, conversion-engineered product descriptions that balance search engine crawler optimization with compelling consumer copywriting.',
    alias: 'meta-description'
  },
  'blog-outline-generator': {
    title: 'Blog Outline Generator',
    desc: 'Generate comprehensive, search-optimized article outlines with H2/H3 headers, search intent matching, and takeaways.',
    icon: '📝',
    category: 'seo',
    label: 'Target Keyword & Topic Concept',
    placeholder: 'e.g., How to optimize video metadata for multi-platform streaming, comprehensive creator guide...',
    promptTemplate: 'Generate a comprehensive, search-intent-optimized long-form blog outline for: {topic}. Include: 1) Recommended SEO Title & Target Search Intent (Informational, Commercial, etc.), 2) Introduction hook and thesis statement, 3) 5-7 major H2 sections with nested H3 subheadings, bullet points of facts to include, and internal link suggestions, and 4) Actionable conclusion with key takeaways checklist.',
    systemInstruction: 'You are an organic content marketing lead. Create comprehensive, search-intent-matched content outlines with clear hierarchical header tags (H2/H3), semantic coverage, and reader retention cues.',
    alias: 'script-outline'
  },
  'content-refresh-suggestions': {
    title: 'Content Refresh Suggestion Tool',
    desc: 'Analyze older blog posts or pages to generate actionable content updates, stat refreshes, and internal link ideas.',
    icon: '🔄',
    category: 'seo',
    label: 'Existing Article Title or URL Summary',
    placeholder: 'e.g., 2024 Guide to Social Media Video Aspect Ratios, needing 2026 platform dimension updates...',
    promptTemplate: 'Generate an actionable content refresh and decay audit for: {topic}. Provide: 1) Identified outdated aspects needing modern 2026 replacement, 2) 3 new high-volume sub-topics / FAQs to add for search intent expansion, 3) Visual asset upgrades (infographics, video embeds), 4) Internal link opportunities, and 5) Revised Title & Meta Description to boost CTR.',
    systemInstruction: 'You are an SEO content decay and audit specialist. Analyze topics to identify gaps, outdated information, and quick wins to restore decaying organic rankings and search traffic.',
    alias: 'competitor-angle'
  },
  'category-page-seo-description': {
    title: 'Category Page SEO Description Writer',
    desc: 'Write descriptive, keyword-targeted introductory copy for ecommerce or content category archive pages.',
    icon: '📂',
    category: 'seo',
    label: 'Category Name, Product Types & Target Intent',
    placeholder: 'e.g., Wireless creator microphones and audio gear, commercial intent, highlighting Lavalier and shotgun mics...',
    promptTemplate: 'Write an SEO-optimized category page content guide for: {topic}. Provide: 1) Short top-of-page introduction (<60 words) designed to welcome users without pushing products below the fold, 2) In-depth bottom-of-page buyer guide (250 words) with H2 subheadings, and 3) 4 quick FAQ accordion entries to target long-tail queries.',
    systemInstruction: 'You are an ecommerce category architecture and SEO writer. Write dual-section category copy: concise above-the-fold intros and rich below-the-fold buyer guides with long-tail keywords.',
    alias: 'meta-description'
  },
  'people-also-ask-answers': {
    title: 'People-Also-Ask Answer Generator',
    desc: 'Produce direct, authoritative 40-60 word answers specifically crafted to capture Google People Also Ask rich snippets.',
    icon: '💡',
    category: 'seo',
    label: 'Specific Question & Context',
    placeholder: 'e.g., Can you watch multiple Twitch and YouTube streams at the same time on one screen?...',
    promptTemplate: 'Craft 4 direct, concise answers (40-55 words each) engineered specifically to win Google People Also Ask (PAA) rich snippet boxes for: {topic}. Format each answer to begin immediately with the direct factual response (no filler intros), followed by 1 supporting detail and a concluding verification point.',
    systemInstruction: 'You are a Featured Snippet and PAA optimization specialist. Write concise, definitive, fact-first answers formatted precisely to trigger Google rich answers and voice search responses.',
    alias: 'featured-snippet-seo'
  },
  'title-tag-length-checker': {
    title: 'Title Tag Length Checker',
    desc: 'Evaluate SEO title tags for character length, pixel width approximation, power words, and mobile snippet truncation.',
    icon: '📏',
    category: 'seo',
    label: 'Proposed SEO Title Tag & Brand Name',
    placeholder: 'e.g., Best Multi-Platform Media Workspace for Creators (2026) | Multi Tube Views...',
    promptTemplate: 'Analyze and optimize proposed SEO title tags for: {topic}. Provide: 1) Character count evaluation (ideal 50-60 chars) and estimated pixel width check (<580px), 2) Truncation risk assessment for desktop vs mobile SERP, 3) Click-through power word and number analysis, and 4) 5 rewritten, perfectly formatted variations with brand suffix.',
    systemInstruction: 'You are an SEO on-page engineer. Analyze title tag character length, pixel width safety, front-loaded keyword placement, and psychological CTR triggers.',
    alias: 'seo-title'
  },
  'onpage-seo-checklist': {
    title: 'On-Page SEO Checklist Generator',
    desc: 'Generate tailored on-page optimization checklists covering title, meta, headers, images, schema, and internal links.',
    icon: '📋',
    category: 'seo',
    label: 'Page Type, Target Keyword & Audience',
    placeholder: 'e.g., Landing page targeting \'free online audio video converter\', high competition SaaS search...',
    promptTemplate: 'Generate a rigorous, prioritized on-page SEO checklist customized for: {topic}. Group items into: 1) URL & Snippet Optimization (Slug, Title, Meta), 2) Content & Structure (H1-H3, Keyword Density, Semantic Entities), 3) Media & Accessibility (Alt text, file compression), 4) Technical & Schema (Canonical, Structured Data), and 5) Internal & Outbound Linking Strategy.',
    systemInstruction: 'You are an enterprise technical SEO auditor. Create thorough, actionable on-page checklists that cover semantic content optimization, technical crawler directives, and UX metrics.',
    alias: 'competitor-angle'
  },

  // Category 6: Technical & Code (8)
  'regex-cheatsheet-generator': {
    title: 'Regex Cheat-Sheet Generator',
    desc: 'Generate custom regular expression patterns, flags, group explanations, and test cases for any text parsing task.',
    icon: '🔣',
    category: 'technical',
    label: 'Text Pattern Matching Goal',
    placeholder: 'e.g., Matching international phone numbers with optional country codes and dashed extensions...',
    promptTemplate: 'Generate a production-ready regular expression (Regex) pattern and documentation guide for: {topic}. Include: 1) The exact Regex pattern string with flags (g, i, m), 2) Token-by-token breakdown explaining each character group and quantifier, 3) 5 Valid test strings that match, 4) 3 Invalid test strings that fail, and 5) Code implementation snippets in JavaScript/TypeScript and Python.',
    systemInstruction: 'You are a regular expression and parsing specialist. Generate clean, efficient regex patterns with zero catastrophic backtracking risks, tokenized breakdowns, and rigorous test cases.',
    alias: 'plain-english'
  },
  'http-status-code-explainer': {
    title: 'HTTP Status Code Explainer',
    desc: 'Explain HTTP response codes with root cause diagnoses, common triggers, RFC specifications, and client/server fixes.',
    icon: '🌐',
    category: 'technical',
    label: 'Status Code (e.g., 403, 429, 502, 504) & Context',
    placeholder: 'e.g., 504 Gateway Timeout occurring during reverse proxy file uploads on Nginx...',
    promptTemplate: 'Provide a comprehensive engineering diagnosis and resolution guide for HTTP status code: {topic}. Include: 1) Official RFC name and classification (Client Error vs Server Error), 2) Root technical cause in plain English, 3) 4 most common real-world triggers, 4) Step-by-step troubleshooting checklist for backend engineers and DevOps, and 5) Client-side handling best practices (retries with exponential backoff).',
    systemInstruction: 'You are a web infrastructure architect and network engineer. Explain HTTP status codes with precision, diagnosing server architecture bottlenecks, header errors, and client mitigation strategies.',
    alias: 'plain-english'
  },
  'config-file-comment-generator': {
    title: 'Config File Comment Generator',
    desc: 'Add clear, professional documentation comments and security tips to complex JSON, YAML, TOML, or INI configs.',
    icon: '⚙️',
    category: 'technical',
    label: 'Configuration Snippet or Type',
    placeholder: 'e.g., Docker compose file with PostgreSQL, Redis cache, and Node backend service with volumes...',
    promptTemplate: 'Annotate and thoroughly document this configuration file or architecture setup: {topic}. Provide: 1) Annotated configuration file with professional inline comments explaining each directive, 2) Security best practices and permission warnings, 3) Environment variable recommendations for sensitive keys, and 4) Validation / linting command to verify syntax before deployment.',
    systemInstruction: 'You are a DevOps and site reliability engineer. Annotate configuration files with clear, professional documentation, production warnings, and environment security recommendations.',
    alias: 'docstring-commenter'
  },
  'code-snippet-formatter-guide': {
    title: 'Code Snippet Formatter Guide',
    desc: 'Receive clean code styling guides, linter recommendations, naming conventions, and idiomatic refactoring tips.',
    icon: '🧹',
    category: 'technical',
    label: 'Language & Code Pattern',
    placeholder: 'e.g., TypeScript async/await error handling pattern in Express REST API controllers...',
    promptTemplate: 'Generate an idiomatic code style guide and clean refactoring example for: {topic}. Provide: 1) The standard "Messy / Anti-Pattern" example, 2) The refactored "Clean Code" version following SOLID principles, 3) Explicit naming conventions and directory organization tips, and 4) Recommended ESLint / Prettier rule settings.',
    systemInstruction: 'You are a principal software engineer and clean code author. Deliver idiomatic code formatting advice, refactoring anti-patterns into readable, maintainable, and testable architectures.',
    alias: 'plain-english'
  },
  'db-query-optimization-tips': {
    title: 'Database Query Optimization Tips Generator',
    desc: 'Analyze slow SQL and NoSQL queries to suggest index strategies, join optimizations, and execution plan fixes.',
    icon: '🗄️',
    category: 'technical',
    label: 'SQL Query, Table Structure & Database Engine',
    placeholder: 'e.g., PostgreSQL query joining 2 million rows of user events with transactions on created_at...',
    promptTemplate: 'Analyze and provide query optimization recommendations for: {topic}. Provide: 1) Diagnosis of potential query bottlenecks (Full Table Scans, N+1 queries, Cartesian joins), 2) Suggested composite or partial index definitions (B-Tree, GIN, etc.), 3) Refactored, high-performance query rewrite, and 4) Query execution plan tips (EXPLAIN ANALYZE guidance).',
    systemInstruction: 'You are a database administrator (DBA) and query tuning specialist. Analyze SQL and NoSQL queries to eliminate sequential scans, design targeted indices, and drastically cut query latency.',
    alias: 'plain-english'
  },
  'a11y-checklist-generator': {
    title: 'Web Accessibility (a11y) Checklist Generator',
    desc: 'Generate WCAG 2.2 AA compliance checklists tailored to web components, forms, modals, and screen reader navigability.',
    icon: '♿',
    category: 'technical',
    label: 'Component Type & User Flow',
    placeholder: 'e.g., Custom dropdown select menu with keyboard navigation and ARIA live regions...',
    promptTemplate: 'Generate a comprehensive WCAG 2.2 Level AA accessibility compliance checklist for: {topic}. Cover: 1) Keyboard Navigation (Focus management, Tab order, Enter/Space/Escape interactions), 2) Screen Reader & ARIA (Roles, States, Live Regions, Labels), 3) Visual & Color Contrast (4.5:1 ratio, focus indicator rings), and 4) Mobile touch target sizing (minimum 44x44px) and testing tools.',
    systemInstruction: 'You are a certified web accessibility specialist (CPACC). Create actionable WCAG 2.2 AA compliance checklists with exact ARIA attribute guidance, focus traps, and keyboard event handlers.',
    alias: 'plain-english'
  },
  'browser-compatibility-notes': {
    title: 'Browser Compatibility Notes Generator',
    desc: 'Check modern CSS, JavaScript, and Web API features against browser support matrices with polyfill solutions.',
    icon: '💻',
    category: 'technical',
    label: 'Web Feature or API (e.g., CSS Container Queries, WebCodecs)',
    placeholder: 'e.g., CSS subgrid and view transitions API support across Chrome, Safari, and Firefox with fallbacks...',
    promptTemplate: 'Generate a browser compatibility and fallback guide for: {topic}. Include: 1) Current browser support breakdown (Chromium, Safari / WebKit, Firefox), 2) Known quirks or partial implementations on iOS Safari vs desktop, 3) Progressive enhancement fallback strategy (using @supports or feature detection), and 4) Recommended polyfill or modern graceful degradation pattern.',
    systemInstruction: 'You are a web standards engineer and frontend compatibility expert. Provide accurate cross-browser support evaluations with graceful degradation and progressive enhancement fallbacks.',
    alias: 'plain-english'
  },
  'tech-stack-recommendation': {
    title: 'Tech Stack Recommendation Generator',
    desc: 'Evaluate project requirements to recommend optimal frontend, backend, database, and hosting architecture stacks.',
    icon: '🏗️',
    category: 'technical',
    label: 'Project Idea, Scale & Team Skillset',
    placeholder: 'e.g., Real-time collaborative whiteboard app with 10k concurrent users, solo developer proficient in React...',
    promptTemplate: 'Deliver an architectural tech stack recommendation for: {topic}. Provide: 1) Recommended Frontend framework & state strategy, 2) Backend language, framework & API protocol (REST vs GraphQL vs WebSocket), 3) Database engine & caching layer, 4) Hosting & Deployment infrastructure, and 5) Key trade-off analysis comparing development speed vs long-term maintenance costs.',
    systemInstruction: 'You are a chief technology officer (CTO) and software architect. Recommend balanced, pragmatic technology stacks based on scale, time-to-market, maintainability, and developer experience.',
    alias: 'plain-english'
  }
};

console.log('Total Batch 3 tools defined:', Object.keys(BATCH_3_FULL_DATA).length);

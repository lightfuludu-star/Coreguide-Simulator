// ==============================================================================
// CoreGuide VA Simulator - Social Media VA 14-Day Curriculum Framework
// Execution to Strategy Progression across Industry-Specific Platforms
// ==============================================================================

import { TaskItem, ClientPersona, CompetencyMetric } from '../types';

export interface SocialMediaPlatformContext {
  industryId: 'b2b_saas' | 'fashion_lifestyle' | 'food_hospitality' | 'personal_brand_creator';
  industryName: string;
  primaryPlatforms: ('LinkedIn' | 'X' | 'Instagram' | 'TikTok' | 'Substack' | 'Pinterest')[];
  recommendedTools: string[];
  targetAudience: string;
  brandVoice: string;
}

export const SOCIAL_INDUSTRY_CONTEXTS: Record<string, SocialMediaPlatformContext> = {
  b2b_saas: {
    industryId: 'b2b_saas',
    industryName: 'B2B Software & Technology',
    primaryPlatforms: ['LinkedIn', 'X'],
    recommendedTools: ['Notion', 'Buffer', 'Canva', 'Taplio'],
    targetAudience: 'Tech founders, VP Engineering, Product Managers, B2B buyers',
    brandVoice: 'Authoritative, insightful, data-driven, practical, no-fluff',
  },
  fashion_lifestyle: {
    industryId: 'fashion_lifestyle',
    industryName: 'Fashion, Beauty & Lifestyle Goods',
    primaryPlatforms: ['Instagram', 'TikTok', 'Pinterest'],
    recommendedTools: ['Canva', 'CapCut', 'Later', 'Notion'],
    targetAudience: 'Fashion-forward Gen Z and Millennial trendsetters, style enthusiasts',
    brandVoice: 'Chic, visual, inspiring, editorial, aspirational',
  },
  food_hospitality: {
    industryId: 'food_hospitality',
    industryName: 'Food, Culinary & Restaurant Delivery',
    primaryPlatforms: ['Instagram', 'TikTok'],
    recommendedTools: ['Canva', 'CapCut', 'Meta Business Suite'],
    targetAudience: 'Local foodies, working professionals, culinary enthusiasts',
    brandVoice: 'Vibrant, appetizing, community-focused, sensory, energetic',
  },
  personal_brand_creator: {
    industryId: 'personal_brand_creator',
    industryName: 'Founder Personal Brand & Executive Advisory',
    primaryPlatforms: ['LinkedIn', 'X', 'Substack'],
    recommendedTools: ['Notion', 'Typefully', 'Canva', 'Substack'],
    targetAudience: 'Entrepreneurs, angel investors, industry operators, aspiring leaders',
    brandVoice: 'Thought leadership, authentic storytelling, vulnerable lessons, sharp commentary',
  },
};

export function getSocialMediaContext(client: ClientPersona): SocialMediaPlatformContext {
  const ind = (client.industry || '').toLowerCase();
  if (ind.includes('food') || ind.includes('restaurant') || ind.includes('culinary')) {
    return SOCIAL_INDUSTRY_CONTEXTS.food_hospitality;
  }
  if (ind.includes('fashion') || ind.includes('beauty') || ind.includes('apparel') || ind.includes('lifestyle')) {
    return SOCIAL_INDUSTRY_CONTEXTS.fashion_lifestyle;
  }
  if (ind.includes('founder') || ind.includes('creator') || ind.includes('consult') || ind.includes('advisory')) {
    return SOCIAL_INDUSTRY_CONTEXTS.personal_brand_creator;
  }
  return SOCIAL_INDUSTRY_CONTEXTS.b2b_saas;
}

export interface GenerateSocialMediaTaskParams {
  dayNumber: number;
  client: ClientPersona;
  competencies?: CompetencyMetric[];
  previousTasks?: TaskItem[];
  previousSubmissions?: any[];
  identifiedWeaknesses?: string[];
  chatHistory?: any[];
}

export function generateSocialMediaTask(params: GenerateSocialMediaTaskParams): TaskItem {
  const { dayNumber, client, identifiedWeaknesses = [] } = params;
  const ctx = getSocialMediaContext(client);
  const company = client.companyName || 'Brand Studio';
  const founderName = client.ceoName || 'Founder';
  const platformsStr = ctx.primaryPlatforms.join(' & ');

  const hasHookWeakness = identifiedWeaknesses.some((w) => /hook|headline|scroll|open/i.test(w));
  const hasStrategyWeakness = identifiedWeaknesses.some((w) => /strateg|metric|kpi|analytics/i.test(w));

  // ----------------------------------------------------------------------------
  // PHASE 1: DAYS 1–3 — FOUNDATION, PROFILE AUDIT & AUDIENCE MAPPING
  // ----------------------------------------------------------------------------
  if (dayNumber === 1) {
    return {
      id: 'task-sm-day-1',
      dayNumber: 1,
      phaseId: 1,
      title: `Day 1: Platform Selection, Bio Optimization & Account Audit (${platformsStr})`,
      category: 'Content & Copywriting',
      priority: 'high',
      estimatedMinutes: 35,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Welcome to ${company}! Your first assignment is establishing our core social footprint. We focus on ${platformsStr} based on our ${ctx.industryName} audience. 1. Conduct a full profile audit of our current presence. 2. Write 3 compelling bio options (140-160 characters) using strong value propositions, proof points, and clear link-in-bio CTAs. 3. Define banner/header image guidelines and handle consistency across our active channels.`,
      clientContext: `${founderName} message: "We don't need to be everywhere at once. I want us dominating ${platformsStr} where our actual customers spend time. Audit our profiles and give me clean, punchy bios that explain what we do in 3 seconds."`,
      deliverables: [
        { id: 'del-sm-1-1', label: `Profile Audit & 3 Bio Variants for ${platformsStr}`, type: 'document', required: true },
        { id: 'del-sm-1-2', label: 'Header Visual & Link-in-Bio Strategy Note', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 2) {
    return {
      id: 'task-sm-day-2',
      dayNumber: 2,
      phaseId: 1,
      title: `Day 2: Target Audience Research & Customer Pain-Point Avatar`,
      category: 'Research & Synthesis',
      priority: 'medium',
      estimatedMinutes: 40,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Before creating content, identify who we are talking to. For ${company} (${ctx.industryName}): 1. Develop a Target Audience Avatar representing our ideal consumer/client. 2. Identify their 5 biggest frustrations, 3 aspirational desires, and the questions they ask online. 3. Audit 2 competing accounts in our niche to analyze what topics generate their highest comment engagement.`,
      clientContext: `${founderName} message: "If we try to speak to everyone, we speak to no one. Build an audience persona so that every hook and caption we post speaks directly to our target customer's pain points."`,
      deliverables: [
        { id: 'del-sm-2-1', label: `Target Audience Persona & Pain-Point Dossier for ${company}`, type: 'document', required: true },
        { id: 'del-sm-2-2', label: 'Competitor Social Engagement Teardown Matrix', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 3) {
    return {
      id: 'task-sm-day-3',
      dayNumber: 3,
      phaseId: 1,
      title: `Day 3: Core Content Pillars & Monthly Content Ideation Bank`,
      category: 'Content & Copywriting',
      priority: 'medium',
      estimatedMinutes: 40,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Establish sustainable content architecture for ${company}: 1. Formulate 4 foundational Content Pillars tailored to our niche (e.g. Educational/How-To, Social Proof/Case Studies, Industry Contrarian Takes, Culture/Behind-the-Scenes). 2. Generate a 20-idea content topic bank categorized under these 4 pillars. 3. Specify the optimal format (text post, carousel, video reel, thread) for each topic idea.`,
      clientContext: `${founderName} message: "I never want us staring at a blank screen wondering what to post. Create a structured content pillar matrix and brainstorm 20 ideas that reinforce our brand positioning."`,
      deliverables: [
        { id: 'del-sm-3-1', label: `4 Core Content Pillars Framework & Rationale for ${company}`, type: 'document', required: true },
        { id: 'del-sm-3-2', label: '20-Idea Content Topic Bank (Categorized with Formats)', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 2: DAYS 4–7 — CONTENT PLANNING & MULTI-FORMAT CREATION
  // ----------------------------------------------------------------------------
  if (dayNumber === 4) {
    return {
      id: 'task-sm-day-4',
      dayNumber: 4,
      phaseId: 2,
      title: `Day 4: Weekly Content Calendar Matrix & Workflow Architecture (Notion/Canva)`,
      category: 'Operations & CRM',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Structure a 7-day Weekly Content Calendar for ${company} across ${platformsStr}: 1. Layout the exact publishing schedule (days, times, timezone, platform). 2. Map pillar balance across the week (avoid 3 promotional posts in a row). 3. Document asset status tracking (Drafted, Creative Ready, Approved by ${founderName}, Scheduled). 4. Ensure visual cohesion and copy deadlines are clear.`,
      clientContext: `${founderName} message: "Organize our next 7 days into a tight publishing grid. I need to see what is going live on which day, at what time, and what asset is required so we can batch-produce smoothly."`,
      deliverables: [
        { id: 'del-sm-4-1', label: `7-Day Master Content Calendar Grid for ${platformsStr}`, type: 'spreadsheet', required: true },
        { id: 'del-sm-4-2', label: 'Content Production & Asset Approval Workflow SOP', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 5) {
    const primaryPlatform = ctx.primaryPlatforms[0];
    return {
      id: 'task-sm-day-5',
      dayNumber: 5,
      phaseId: 2,
      title: `Day 5: High-Converting Hook & Caption Copywriting (${primaryPlatform})`,
      category: 'Content & Copywriting',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Draft 3 complete, publication-ready organic posts for ${primaryPlatform}: 1. Apply the 3-part copy framework: Scroll-stopping Hook (first 1-2 lines), Value-packed Body with skimmable spacing, and Conversion CTA. ${hasHookWeakness ? 'CRITICAL COACHING NOTE: Write 3 alternative hooks for each post to test different angles (curiosity, contrarian, problem/solution).' : ''} 2. Ensure brand voice is strictly maintained (${ctx.brandVoice}). 3. Provide formatting guidelines and visual accompaniment notes.`,
      clientContext: `${founderName} message: "Nobody reads boring social copy. The first line decides whether someone keeps scrolling or stops. Write 3 top-tier posts for ${primaryPlatform} with hooks that demand attention."`,
      deliverables: [
        { id: 'del-sm-5-1', label: `3 Publication-Ready Copy Drafts with Hook Variations for ${primaryPlatform}`, type: 'document', required: true },
        { id: 'del-sm-5-2', label: 'Visual Creative Directing Notes for Graphic/Image Team', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 6) {
    return {
      id: 'task-sm-day-6',
      dayNumber: 6,
      phaseId: 2,
      title: `Day 6: Short-Form Video Concepts & Storyboard Scripts (Reels/TikTok/Shorts)`,
      category: 'Content & Copywriting',
      priority: 'medium',
      estimatedMinutes: 45,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Short-form video is essential for organic reach. Develop 2 short-form video concepts (30-45 seconds each) for ${company}: 1. Concept 1: Educational / Quick Tip answering a common customer pain point. 2. Concept 2: Behind-the-scenes / Founder insight showcasing authentic brand value. 3. Format each concept with a 3-second visual hook, scene-by-scene script, on-screen text overlay notes, and background audio recommendation.`,
      clientContext: `${founderName} message: "I want to start recording video, but I don't have time to think about what to say. Hand me two short-form scripts that I can shoot on my phone in 10 minutes."`,
      deliverables: [
        { id: 'del-sm-6-1', label: '2 Short-Form Video Scripts & Visual Storyboard Deck', type: 'document', required: true },
        { id: 'del-sm-6-2', label: 'Audio & On-Screen Text Overlay Production Guide', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 7) {
    return {
      id: 'task-sm-day-7',
      dayNumber: 7,
      phaseId: 2,
      title: `Day 7: Multi-Platform Scheduling Protocol & SEO Keyword/Hashtag Clusters`,
      category: 'Operations & CRM',
      priority: 'medium',
      estimatedMinutes: 35,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Optimize discoverability across active platforms: 1. Research and build 3 distinct hashtag/keyword clusters (Broad, Niche, Community-Specific) tailored to ${company}'s industry. 2. Establish our native scheduling protocol: optimal posting windows by day of week based on audience timezone. 3. Write a concise checklist for pre-publishing checks (spelling, audio sync, tagged accounts, UTM parameters).`,
      clientContext: `${founderName} message: "Random posting times waste good content. Give me an organized keyword cluster and scheduling matrix so our posts index on search and reach peak active viewers."`,
      deliverables: [
        { id: 'del-sm-7-1', label: `SEO Keyword & Hashtag Clusters Matrix for ${company}`, type: 'document', required: true },
        { id: 'del-sm-7-2', label: 'Publishing Checklist & Peak Timing Reference Guide', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 3: DAYS 8–10 — COMMUNITY MANAGEMENT, AMBIGUITY & CRISIS HANDLING
  // ----------------------------------------------------------------------------
  if (dayNumber === 8) {
    return {
      id: 'task-sm-day-8',
      dayNumber: 8,
      phaseId: 3,
      title: `Day 8: Incomplete Founder Brief Triage & Urgent Campaign Clarification`,
      category: 'Content & Copywriting',
      priority: 'urgent',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${founderName} sent a hasty voice-note text: "Need a major post up today about our new offer. Make it go crazy. Highlight the discount." The message leaves out the exact discount percentage, the landing page link, the targeted audience, and the campaign end date. 1. Use the Client Chat to ask ${founderName} the 3 essential questions required to execute properly. 2. Once clarified (or based on standard campaign logic), draft the high-urgency promotional post with full creative guidelines.`,
      clientContext: `${founderName} message: "Need a major post up today about our new offer. Make it go crazy. Highlight the discount. (Sent from mobile on the road)"`,
      deliverables: [
        { id: 'del-sm-8-1', label: 'Clarification Inquiry & Strategic Campaign Framework for Founder', type: 'text', required: true },
        { id: 'del-sm-8-2', label: 'Polished High-Urgency Promotional Post & Visual Creative Brief', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 9) {
    return {
      id: 'task-sm-day-9',
      dayNumber: 9,
      phaseId: 3,
      title: `Day 9: Community Comment Crisis De-escalation & Moderation Playbook`,
      category: 'Client Communications',
      priority: 'urgent',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `A popular post from ${company} accumulated 14 negative comments within 2 hours: customers complain about an unannounced price change, a defective batch, or customer support delay. Two comments accuse the brand of being greedy. 1. Triage the comments: categorize into Valid Feedback, Trolls/Abuse, and Inquiries. 2. Draft calm, respectful public de-escalation replies that transition angry users to private DMs. 3. Build a Community Moderation Playbook with approved responses and banned keyword triggers.`,
      clientContext: `${founderName} message: "The comments on our latest post are turning into a dumpster fire. Do not delete them blindly—that makes people angrier. Handle this with grace, calm the community down, and get legitimate complaints into private DMs."`,
      deliverables: [
        { id: 'del-sm-9-1', label: 'Crisis Comment Public Response Scripts & De-escalation Suite', type: 'document', required: true },
        { id: 'del-sm-9-2', label: 'Community Moderation Playbook & Escalation Decision Tree', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 10) {
    return {
      id: 'task-sm-day-10',
      dayNumber: 10,
      phaseId: 3,
      title: `Day 10: Niche Creator Collaboration Brief & Outreach Terms Agreement`,
      category: 'Client Communications',
      priority: 'high',
      estimatedMinutes: 40,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `${company} is launching an organic creator gifting/collaboration campaign. 1. Establish creator vetting criteria (engagement rate > 3.5%, audience authenticity, aesthetic alignment with ${company}). 2. Draft an enticing, non-spammy direct outreach message (DM & email) inviting micro-creators to partner with us. 3. Draft a simple 1-page Collaboration Brief specifying deliverable expectations (e.g. 1 Reel + 2 Story frames), usage rights, and timeline.`,
      clientContext: `${founderName} message: "I want micro-creators talking about us, but I don't want to pay $5,000 to agencies. Vetting genuine creators and sending a clear, respectful brief is how we win organic reach."`,
      deliverables: [
        { id: 'del-sm-10-1', label: 'Micro-Creator Direct Outreach Script (DM & Email Variants)', type: 'email_draft', required: true },
        { id: 'del-sm-10-2', label: '1-Page Creator Collaboration Brief & Deliverable Guidelines', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 4: DAYS 11–12 — VIRAL INFLUX & CAMPAIGN PRESSURE
  // ----------------------------------------------------------------------------
  if (dayNumber === 11) {
    return {
      id: 'task-sm-day-11',
      dayNumber: 11,
      phaseId: 4,
      title: `Day 11: Viral Post Influx — High-Velocity Comment & DM Conversion Sprint`,
      category: 'Client Communications',
      priority: 'urgent',
      estimatedMinutes: 50,
      deadlineHours: 3,
      deadlineType: 'hard',
      brief: `A post published yesterday hit the algorithm, generating 45,000 views, 60+ comments, and 18 inbound DMs asking: "How do I buy?", "Do you ship internationally?", and "Is there a discount code?" 1. Execute a high-velocity engagement sprint: triage and categorize inbound DMs into Warm Leads, Product Support, and General Comments. 2. Draft 5 high-converting DM reply templates with trackable links. 3. Implement an algorithm-boosting reply strategy to keep the post viral for another 24 hours.`,
      clientContext: `${founderName} message: "Our post is blowing up right now! Attention has a short half-life. We need every question answered and warm DM leads converted into site visits in the next 3 hours."`,
      deliverables: [
        { id: 'del-sm-11-1', label: 'Inbound DM Lead Triage & High-Converting Response Matrix', type: 'spreadsheet', required: true },
        { id: 'del-sm-11-2', label: 'Viral Comment Engagement Strategy & Link Tracking Protocol', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 12) {
    return {
      id: 'task-sm-day-12',
      dayNumber: 12,
      phaseId: 4,
      title: `Day 12: Influencer PR Gifting Campaign Tracker & Follow-Up Cadence`,
      category: 'Operations & CRM',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${company} shipped product gift boxes to 15 targeted creators. 1. Build an Influencer PR Campaign Tracking Spreadsheet (Creator Name, Handle, Follower Count, Date Shipped, Tracking Number, Date Delivered, Content Live Date, Content Link, Post Engagement, Notes). 2. Draft a polite, non-pushy follow-up message check-in sent 3 days post-delivery confirming package receipt and offering answers.`,
      clientContext: `${founderName} message: "15 packages went out this week. If we don't track them diligently, half of them will sit unboxed in someone's mailroom. Build the master tracker and execute the follow-up cadence."`,
      deliverables: [
        { id: 'del-sm-12-1', label: 'Influencer PR Campaign Master Tracking Spreadsheet', type: 'spreadsheet', required: true },
        { id: 'del-sm-12-2', label: 'Post-Delivery Creator Check-In & Relationship Follow-Up Scripts', type: 'email_draft', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 5: DAYS 13–14 — STRATEGY & CAPSTONE ASSESSMENT
  // ----------------------------------------------------------------------------
  if (dayNumber === 13) {
    return {
      id: 'task-sm-day-13',
      dayNumber: 13,
      phaseId: 5,
      title: `Day 13: Monthly Social Media Visibility Audit & Executive Analytics Report`,
      category: 'Research & Synthesis',
      priority: 'high',
      estimatedMinutes: 50,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Move from day-to-day execution to executive strategy. Analyze a 30-day performance dataset for ${company} across ${platformsStr}: 1. Calculate key performance indicators: Total Reach, Engagement Rate by Format (Video vs Carousel vs Text), Follower Growth, and Link Clicks. 2. Identify top 3 winning posts and explain why they succeeded. 3. Formulate 4 data-backed strategic recommendations for next month's content roadmap.`,
      clientContext: `${founderName} message: "I don't just want vanity metrics. Show me what worked, what flopped, and what we should double down on next month based on hard numbers."`,
      deliverables: [
        { id: 'del-sm-13-1', label: `Monthly Social Media Analytics Executive Dashboard & KPI Report`, type: 'spreadsheet', required: true },
        { id: 'del-sm-13-2', label: 'Executive Insights & Data-Backed Content Strategy Memo', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // Day 14: Practical Capstone
  return {
    id: 'task-sm-day-14',
    dayNumber: 14,
    phaseId: 5,
    title: 'Day 14: Final 14-Day Practical Capstone — 30-Day Master Content Blueprint & Campaign Suite',
    category: 'Content & Copywriting',
    priority: 'urgent',
    estimatedMinutes: 60,
    deadlineHours: 4,
    deadlineType: 'hard',
    brief: `Your 14-day Social Media VA graduation practical assessment. Demonstrate mastery across all social media competencies: Platform Selection & Optimization, Content Architecture, Copywriting & Hook Mastery, Community Management & Crisis Handling, and Data-Driven Content Strategy:
1. 30-Day Master Social Media Content Blueprint: Build an end-to-end strategic editorial calendar for ${company} across ${platformsStr} incorporating content pillars, publishing cadence, and format diversification.
2. Complete Campaign Suite:
   - 4 Full-length publication-ready posts with hooks and CTA variations.
   - 2 Short-form video scripts with visual cue storyboards.
   - 1 Community Crisis Management & Moderation SOP.
   - 1 Influencer / Creator Partnership Strategy Playbook.`,
    clientContext: `${founderName} message: "You have proven you understand our voice, our audience, and the mechanics of organic reach. This capstone is your master portfolio piece. Deliver a 30-day blueprint and asset package that any executive would gladly approve."`,
    deliverables: [
      { id: 'del-sm-14-1', label: `30-Day Master Social Media Strategic Editorial Calendar for ${company}`, type: 'spreadsheet', required: true },
      { id: 'del-sm-14-2', label: '4 High-Converting Multi-Platform Copy Drafts & Visual Briefs', type: 'document', required: true },
      { id: 'del-sm-14-3', label: '2 Short-Form Video Storyboard Scripts with Overlay Directing', type: 'document', required: true },
      { id: 'del-sm-14-4', label: 'Master Social Media Standard Operating Procedure (SOP) & Policy Guide', type: 'document', required: true },
    ],
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

// ==============================================================================
// CoreGuide VA Simulator - Content Writing VA 14-Day Curriculum Framework
// Multi-Format Writing: Social, Long-Form, Business, Commercial, Scripts, Technical
// ==============================================================================

import { TaskItem, ClientPersona, CompetencyMetric } from '../types';

export interface ContentWritingIndustryContext {
  industryId: 'web3_tech' | 'ecommerce_dtc' | 'personal_brand_executive' | 'b2b_saas';
  industryName: string;
  targetAudience: string;
  voiceStyle: string;
  typicalProductsOrTopics: string[];
}

export const CONTENT_WRITING_CONTEXTS: Record<string, ContentWritingIndustryContext> = {
  web3_tech: {
    industryId: 'web3_tech',
    industryName: 'Web3, Blockchain & Decentralized Technology',
    targetAudience: 'Mainstream tech-curious professionals, developers, everyday investors',
    voiceStyle: 'Clear, demystifying, forward-looking, conversational, zero-jargon',
    typicalProductsOrTopics: ['Decentralized identity protocol', 'Smart contract security audits', 'Zero-knowledge proofs explained simply', 'Web3 wallet onboarding'],
  },
  ecommerce_dtc: {
    industryId: 'ecommerce_dtc',
    industryName: 'Direct-to-Consumer E-Commerce & Lifestyle Brands',
    targetAudience: 'Discerning modern consumers seeking sustainable, high-quality everyday goods',
    voiceStyle: 'Vibrant, sensory, benefit-driven, warm, persuasive',
    typicalProductsOrTopics: ['Minimalist linen apparel collection', 'Ceramic cookware set', 'Organic calming sleep tea', 'Ergonomic workspace essentials'],
  },
  personal_brand_executive: {
    industryId: 'personal_brand_executive',
    industryName: 'Founder Thought Leadership & Executive Advisory',
    targetAudience: 'Aspiring entrepreneurs, early-stage founders, startup operators, investors',
    voiceStyle: 'Reflective, punchy, authentic, vulnerable lessons, sharp tactical frameworks',
    typicalProductsOrTopics: ['Lessons from scaling from 0 to $5M ARR', 'Why hiring for culture fit fails', 'The art of saying no to good ideas', 'Building resilient remote teams'],
  },
  b2b_saas: {
    industryId: 'b2b_saas',
    industryName: 'B2B SaaS & Enterprise Productivity',
    targetAudience: 'Operations leaders, Directors of IT, productivity enthusiasts',
    voiceStyle: 'Actionable, authoritative, structured, clear ROI-focused, educational',
    typicalProductsOrTopics: ['Async workflow management', 'Eliminating meeting overload', 'Automating customer onboarding', 'SaaS tech stack consolidation'],
  },
};

export function getContentWritingContext(client: ClientPersona): ContentWritingIndustryContext {
  const ind = (client.industry || '').toLowerCase();
  if (ind.includes('web3') || ind.includes('crypto') || ind.includes('blockchain')) {
    return CONTENT_WRITING_CONTEXTS.web3_tech;
  }
  if (ind.includes('commerce') || ind.includes('retail') || ind.includes('fashion') || ind.includes('food') || ind.includes('beauty')) {
    return CONTENT_WRITING_CONTEXTS.ecommerce_dtc;
  }
  if (ind.includes('founder') || ind.includes('consult') || ind.includes('advisory') || ind.includes('coach')) {
    return CONTENT_WRITING_CONTEXTS.personal_brand_executive;
  }
  return CONTENT_WRITING_CONTEXTS.b2b_saas;
}

export interface GenerateContentWritingTaskParams {
  dayNumber: number;
  client: ClientPersona;
  competencies?: CompetencyMetric[];
  previousTasks?: TaskItem[];
  previousSubmissions?: any[];
  identifiedWeaknesses?: string[];
  chatHistory?: any[];
}

export function generateContentWritingTask(params: GenerateContentWritingTaskParams): TaskItem {
  const { dayNumber, client, identifiedWeaknesses = [] } = params;
  const ctx = getContentWritingContext(client);
  const company = client.companyName || 'Editorial Group';
  const founderName = client.ceoName || 'Managing Editor';

  const hasToneWeakness = identifiedWeaknesses.some((w) => /tone|voice|jargon|readab|audience/i.test(w));
  const hasFormattingWeakness = identifiedWeaknesses.some((w) => /format|heading|structure|bullet|skimm/i.test(w));

  // ----------------------------------------------------------------------------
  // PHASE 1: DAYS 1–3 — FOUNDATION, VOICE CALIBRATION & COMMERCIAL COPY
  // ----------------------------------------------------------------------------
  if (dayNumber === 1) {
    return {
      id: 'task-cw-day-1',
      dayNumber: 1,
      phaseId: 1,
      title: `Day 1: Brand Voice Audit, Audience Persona & Style Guide Definition (${ctx.industryName})`,
      category: 'Content & Copywriting',
      priority: 'high',
      estimatedMinutes: 35,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Welcome to ${company}'s editorial team! Your first assignment is calibrating to our brand voice. 1. Review ${company}'s target audience ("${ctx.targetAudience}") and core style ("${ctx.voiceStyle}"). 2. Write a 1-page Brand Editorial Style Guide covering: Tone Spectrum (e.g. Confident but humble, not arrogant), Vocabulary Do's and Don'ts, Sentence Length Rules (Grade 7-8 readability), and Formatting Guidelines. 3. Draft 2 short social thought-leadership posts (150 words each) demonstrating mastery of this voice.`,
      clientContext: `${founderName} message: "The biggest mistake writers make is sounding like a robot or a textbook. We need our writing to sound like an authentic, insightful human. Study our guidelines and build our master voice sheet."`,
      deliverables: [
        { id: 'del-cw-1-1', label: `Brand Editorial Voice & Style Guide for ${company}`, type: 'document', required: true },
        { id: 'del-cw-1-2', label: '2 Voice-Calibrated Short-Form Social Posts', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 2) {
    return {
      id: 'task-cw-day-2',
      dayNumber: 2,
      phaseId: 1,
      title: 'Day 2: Commercial Copywriting: High-Converting Product & Feature Descriptions',
      category: 'Content & Copywriting',
      priority: 'high',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Commercial copy must sell the transformation, not just the features. For ${company}'s flagship offering: "${ctx.typicalProductsOrTopics[0]}": 1. Write 3 high-converting product/service descriptions tailored to different awareness levels: [A] Short-form e-commerce card blurb (50 words), [B] Feature-to-Benefit bullet breakdown (transforming 4 technical specs into tangible consumer benefits), [C] Long-form landing page product story (200 words). 2. Ensure every description leads with an emotional hook.`,
      clientContext: `${founderName} message: "Features tell, but benefits sell. Don't just list what our product does—tell the customer how it makes their life easier, calmer, or more successful."`,
      deliverables: [
        { id: 'del-cw-2-1', label: '3-Tier Commercial Product Copy Suite (Short, Benefits, Story)', type: 'document', required: true },
        { id: 'del-cw-2-2', label: 'Feature-to-Benefit Emotional Translation Table', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 3) {
    return {
      id: 'task-cw-day-3',
      dayNumber: 3,
      phaseId: 1,
      title: 'Day 3: Long-Form Article Architecture, Outline & Research Synthesis',
      category: 'Research & Synthesis',
      priority: 'medium',
      estimatedMinutes: 40,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Great articles succeed in the outline phase. Structure a comprehensive outline for a long-form cornerstone guide: "${ctx.typicalProductsOrTopics[1]}": 1. Define target reader search intent and primary keyword themes. 2. Build a full H2 and H3 hierarchical outline structure with key talking points under each section. 3. Integrate 3 authoritative external data statistics or research citations to back up our arguments. 4. Write an irresistible opening hook and thesis statement.`,
      clientContext: `${founderName} message: "Never start typing a 1,500-word article without an approved outline. Structure the headings logically so a reader can skim the page in 10 seconds and understand the entire premise."`,
      deliverables: [
        { id: 'del-cw-3-1', label: 'Comprehensive Long-Form Article Outline (H2/H3 Hierarchy)', type: 'document', required: true },
        { id: 'del-cw-3-2', label: 'Research Citations, Data Bank & Reader Search Intent Memo', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 2: DAYS 4–7 — LONG-FORM ARTICLES, NEWSLETTERS & VIDEO SCRIPTS
  // ----------------------------------------------------------------------------
  if (dayNumber === 4) {
    return {
      id: 'task-cw-day-4',
      dayNumber: 4,
      phaseId: 2,
      title: 'Day 4: 1,500-Word SEO Cornerstone Blog Article & Meta Optimization',
      category: 'Content & Copywriting',
      priority: 'high',
      estimatedMinutes: 50,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Draft the complete, publication-ready 1,500-word long-form guide based on yesterday's approved outline: 1. Maintain flawless flow and rhythm: punchy opening paragraph, engaging transition sentences, and bulleted takeaways. ${hasFormattingWeakness ? 'CRITICAL COACHING NOTE: Use short paragraphs (1-3 sentences max) to ensure high mobile readability.' : ''} 2. Naturally integrate target keywords without keyword stuffing. 3. Write an SEO Title Tag (under 60 chars) and Meta Description (under 155 chars) with an active click CTA.`,
      clientContext: `${founderName} message: "This is our cornerstone piece for the month. Write with authority, clear examples, and clean formatting. Make it so valuable that industry peers bookmark it and share it on LinkedIn."`,
      deliverables: [
        { id: 'del-cw-4-1', label: `1,500-Word Publication-Ready Long-Form Guide for ${company}`, type: 'document', required: true },
        { id: 'del-cw-4-2', label: 'SEO Title, Meta Description & Social Share Teaser Copy', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 5) {
    return {
      id: 'task-cw-day-5',
      dayNumber: 5,
      phaseId: 2,
      title: 'Day 5: Weekly Email Newsletter Drafting & Subject Line A/B Test Suite',
      category: 'Content & Copywriting',
      priority: 'high',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Email newsletters require intimacy and conversational energy. Draft our weekly broadcast email (400-600 words) for ${company}'s 12,000 subscribers: 1. Topic: An insightful breakdown of "${ctx.typicalProductsOrTopics[2]}". 2. Craft 3 distinct Subject Line pairs for an A/B test (Pair A: Curiosity vs Direct Benefit, Pair B: Short 2-word punchy vs Question, Pair C: Contrarian angle). 3. Write matching preview text (preheader) for each subject line. 4. Include 1 focused primary Call-to-Action.`,
      clientContext: `${founderName} message: "Our subscribers get 100 emails a day. The subject line determines open rates, and the first 2 sentences determine read rates. Write an email that reads like a note from an insightful friend."`,
      deliverables: [
        { id: 'del-cw-5-1', label: 'Weekly Email Newsletter Broadcast Copy (400-600 Words)', type: 'email_draft', required: true },
        { id: 'del-cw-5-2', label: 'Subject Line A/B Test Suite (3 Pairs with Preview Text)', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 6) {
    return {
      id: 'task-cw-day-6',
      dayNumber: 6,
      phaseId: 2,
      title: 'Day 6: 5-Day Educational Email Onboarding & Nurture Sequence',
      category: 'Content & Copywriting',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Build an automated 5-Day Educational Email Course welcoming new leads:
Email 1: Welcome, setting expectations, and a quick quick-win takeaway.
Email 2: The #1 mistake most people make in our industry and how to avoid it.
Email 3: Case study teardown / Client transformation story.
Email 4: Actionable tactical framework (Step-by-step implementation).
Email 5: The logical next step (Introducing ${company}'s paid solution with zero high-pressure hype).
Draft all 5 emails with subject lines and clear progression.`,
      clientContext: `${founderName} message: "A nurture sequence should educate first and sell second. Walk the reader through a 5-day journey where they learn something genuinely useful every single morning."`,
      deliverables: [
        { id: 'del-cw-6-1', label: '5-Day Automated Educational Email Nurture Sequence Copy', type: 'document', required: true },
        { id: 'del-cw-6-2', label: 'Email Course Architecture & Automation Trigger Flowchart', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 7) {
    return {
      id: 'task-cw-day-7',
      dayNumber: 7,
      phaseId: 2,
      title: 'Day 7: Short-Form Educational Video Script & Visual Storyboard Copy',
      category: 'Content & Copywriting',
      priority: 'medium',
      estimatedMinutes: 40,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Scriptwriting is a specialized branch of writing. Draft 2 short-form educational video scripts (45-60 seconds each / 130-150 words spoken): 1. Video 1: "The 60-Second Breakdown" explaining "${ctx.typicalProductsOrTopics[0]}" in simple terms. 2. Video 2: "Stop Doing This" myth-busting script addressing a popular misconception. 3. Format as a two-column script: Left column (Spoken Audio dialogue), Right column (Visual B-roll, on-screen text overlays, and gestures).`,
      clientContext: `${founderName} message: "Writing for the ear is totally different from writing for the eye. Keep sentences short, conversational, and rhythmically punchy so I can speak them naturally on camera."`,
      deliverables: [
        { id: 'del-cw-7-1', label: '2 Short-Form Video Production Scripts (Two-Column Format)', type: 'document', required: true },
        { id: 'del-cw-7-2', label: 'Visual Pacing & Audio Directing Guide for Presenter', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 3: DAYS 8–10 — INCOMPLETE BRIEFS, TECHNICAL TRANSLATION & LINE EDITING
  // ----------------------------------------------------------------------------
  if (dayNumber === 8) {
    return {
      id: 'task-cw-day-8',
      dayNumber: 8,
      phaseId: 3,
      title: 'Day 8: Incomplete Founder Voice-Note Brief Triage & Editorial Clarification',
      category: 'Content & Copywriting',
      priority: 'urgent',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${founderName} sent a messy 3-minute voice transcription: "Hey, write an article about our scaling journey. Make sure to talk about how we changed our mindset and why people who focus on vanity metrics are losing. Keep it punchy." The brief omits: target publication (LinkedIn article vs blog?), exact word count, intended takeaway for the reader, and specific examples. 1. Use the Client Chat to ask ${founderName} the 3 essential questions needed to frame the story. 2. Draft the opening section and narrative arc based on clarification.`,
      clientContext: `${founderName} message: "Hey, write an article about our scaling journey. Make sure to talk about how we changed our mindset and why people who focus on vanity metrics are losing. Keep it punchy. (Sent while walking to lunch)"`,
      deliverables: [
        { id: 'del-cw-8-1', label: 'Editorial Brief Clarification Inquiry & Narrative Framework', type: 'text', required: true },
        { id: 'del-cw-8-2', label: 'Refined Article Hook, Thesis Statement & Narrative Arc Draft', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 9) {
    return {
      id: 'task-cw-day-9',
      dayNumber: 9,
      phaseId: 3,
      title: 'Day 9: Technical Translation: Simplifying Complex Technical Concepts to Plain English',
      category: 'Content & Copywriting',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `One of the most valuable skills in content writing is translating dense technical subject matter into accessible prose. Take a 500-word dense, jargon-filled technical brief (e.g. on blockchain consensus, neural network quantization, or database sharding) and: 1. Identify 6 terms that alienate non-technical readers. 2. Rewrite the concept using a real-world metaphor (e.g. explaining a blockchain ledger as a shared Google Sheet). 3. Produce a 400-word educational article that an intelligent high-schooler could understand without losing technical accuracy. ${hasToneWeakness ? 'CRITICAL COACHING NOTE: Eradicate buzzwords. If a sentence requires a dictionary, simplify it.' : ''}`,
      clientContext: `${founderName} message: "Our engineers wrote this technical explanation and it is completely unreadable to our actual customers. Translate this into crystal-clear plain English without dumbing down the core insight."`,
      deliverables: [
        { id: 'del-cw-9-1', label: 'Technical Translation Article: Plain-English Concept Guide', type: 'document', required: true },
        { id: 'del-cw-9-2', label: 'Jargon-to-Metaphor Translation Reference Table', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 10) {
    return {
      id: 'task-cw-day-10',
      dayNumber: 10,
      phaseId: 3,
      title: 'Day 10: Rigorous Line Editing, Proofreading & AP Style Compliance Polish',
      category: 'Content & Copywriting',
      priority: 'urgent',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Edit and elevate a draft written by an external contributor. The 800-word draft contains 12 deliberate errors: passive voice overuse, redundant filler words ("in order to", "due to the fact that"), comma splices, inconsistent capitalization, and weak verbs. 1. Perform a thorough Line Edit: strengthen verbs, trim word count by 20% while preserving meaning, and ensure AP Style compliance. 2. Provide a Track Changes marked-up version with editorial comments explaining why each change was made.`,
      clientContext: `${founderName} message: "A great writer is first a ruthless editor. This guest submission has good ideas but the writing is flabby and sloppy. Polish it into a clean, tight piece ready for publication."`,
      deliverables: [
        { id: 'del-cw-10-1', label: 'Polished, Tightened Publication-Ready Article (Post-Edit)', type: 'document', required: true },
        { id: 'del-cw-10-2', label: 'Editorial Markup & Justification Changelog (Before vs After)', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 4: DAYS 11–12 — BUSINESS WRITING & CONTENT PILLARS
  // ----------------------------------------------------------------------------
  if (dayNumber === 11) {
    return {
      id: 'task-cw-day-11',
      dayNumber: 11,
      phaseId: 4,
      title: 'Day 11: High-Stakes Business Writing: Executive Pitch Deck & 1-Page Proposal Copy',
      category: 'Content & Copywriting',
      priority: 'urgent',
      estimatedMinutes: 50,
      deadlineHours: 3,
      deadlineType: 'hard',
      brief: `Draft executive-grade business copy for ${company}: 1. Write the core copy for an 8-slide Executive Pitch Deck: [1] Problem, [2] Solution, [3] Product Overview, [4] Market Opportunity, [5] Business Model, [6] Traction/Proof, [7] The Team, [8] The Ask. Ensure slide headlines tell a continuous story when read in sequence. 2. Draft a 1-page Executive Business Proposal summarizing scope of work, deliverables, timeline, and investment terms.`,
      clientContext: `${founderName} message: "Business writing requires extreme brevity and punch. Slide copy cannot have paragraphs—give me headline statements that pack a punch and clean bullet points."`,
      deliverables: [
        { id: 'del-cw-11-1', label: '8-Slide Executive Pitch Deck Narrative Copy Deck', type: 'document', required: true },
        { id: 'del-cw-11-2', label: '1-Page Executive Business Proposal & Scope of Work Document', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 12) {
    return {
      id: 'task-cw-day-12',
      dayNumber: 12,
      phaseId: 4,
      title: 'Day 12: Topic Cluster & Pillar Content Architecture Strategy',
      category: 'Research & Synthesis',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Design a comprehensive Pillar Content & Topic Cluster Strategy for ${company}: 1. Select 1 Core Pillar Theme (e.g. "The Ultimate Guide to Remote Team Operations"). 2. Architect 6 supporting Sub-Topic Cluster Articles that link back to the pillar (Keyword target, reader angle, internal linking strategy). 3. Map out how this cluster captures both top-of-funnel educational search traffic and bottom-of-funnel buyer intent.`,
      clientContext: `${founderName} message: "Writing isolated blog posts doesn't build domain authority. Give me a structured topic cluster strategy where every article connects to a central pillar and drives search ranking."`,
      deliverables: [
        { id: 'del-cw-12-1', label: 'Pillar Content & 6-Article Topic Cluster Architecture Matrix', type: 'spreadsheet', required: true },
        { id: 'del-cw-12-2', label: 'Internal Linking Strategy & Search Intent Funnel Memo', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 5: DAYS 13–14 — REPURPOSING SUITE & MASTER CAPSTONE
  // ----------------------------------------------------------------------------
  if (dayNumber === 13) {
    return {
      id: 'task-cw-day-13',
      dayNumber: 13,
      phaseId: 5,
      title: 'Day 13: 1-to-5 Multi-Channel Content Repurposing Engine',
      category: 'Content & Copywriting',
      priority: 'high',
      estimatedMinutes: 50,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Demonstrate maximum editorial leverage by taking 1 core 1,500-word cornerstone article and repurposing it into 5 distinct platform assets:
Asset 1: An engaging 500-word Email Newsletter adaptation with personal intro.
Asset 2: A 7-slide LinkedIn carousel text deck with visual layout directing.
Asset 3: A high-engagement X thread (6-8 tweets) with viral hook.
Asset 4: A 45-second short-form video script with spoken dialogue and text overlays.
Asset 5: 3 punchy quote graphics text cards.`,
      clientContext: `${founderName} message: "Great writers don't create 20 pieces from scratch. They write one master piece of research and repurpose it into 5 high-performing formats across every channel. Show me your repurposing engine."`,
      deliverables: [
        { id: 'del-cw-13-1', label: '1-to-5 Master Content Repurposing Suite (Newsletter, Slides, Thread, Script)', type: 'document', required: true },
        { id: 'del-cw-13-2', label: 'Content Multiplication Matrix & Asset Distribution Schedule', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // Day 14: Practical Capstone
  return {
    id: 'task-cw-day-14',
    dayNumber: 14,
    phaseId: 5,
    title: 'Day 14: Final 14-Day Practical Capstone — Master Multi-Format Editorial Portfolio & Exam',
    category: 'Content & Copywriting',
    priority: 'urgent',
    estimatedMinutes: 60,
    deadlineHours: 4,
    deadlineType: 'hard',
    brief: `Your 14-day Content Writing VA graduation practical assessment. Demonstrate mastery across all professional writing disciplines: Brand Voice Calibration, Commercial Copy, SEO Long-Form Journalism, Email Nurturing, Technical Translation, Scriptwriting, and Editorial Polish:
1. Master Long-Form Feature Guide: 1,500 words with H2/H3 structure, meta tags, and data citations.
2. Complete Writing Portfolio Suite:
   - 1 High-Converting Commercial Product Copy Package (3 variants).
   - 1 Technical Concept Simplification / Plain-English Translation Article.
   - 1 Full 5-Day Educational Email Course Nurture Sequence.
   - 1 Executive Pitch Deck Narrative Copy Deck (8 slides).`,
    clientContext: `${founderName} message: "You have proven you can write in our voice across every format—from landing page copy to technical translation to long-form journalism. This capstone is your master writing portfolio. Deliver a body of work that showcases professional-grade excellence."`,
    deliverables: [
      { id: 'del-cw-14-1', label: `1,500-Word Master SEO Long-Form Cornerstone Guide for ${company}`, type: 'document', required: true },
      { id: 'del-cw-14-2', label: 'Multi-Format Writing Portfolio Suite (Commercial, Technical, Email Course)', type: 'document', required: true },
      { id: 'del-cw-14-3', label: 'Executive Pitch Deck Narrative Copy Deck (8 Slides)', type: 'document', required: true },
      { id: 'del-cw-14-4', label: 'Master Editorial Standards & AP Style Compliance Handbook', type: 'document', required: true },
    ],
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

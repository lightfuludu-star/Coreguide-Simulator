// ==============================================================================
// CoreGuide VA Simulator - Official 7 VA Services & 6-Stage Curriculum (V1)
// ==============================================================================

import { ClientPersona, TaskItem, CompetencyMetric } from '../types';
import { generateSimulatedClient } from './clientGenerator';
import {
  EXECUTIVE_VA_SKILLS,
  getInitialExecutiveVaCompetencies,
  generateDynamicExecutiveVaTask,
} from './executiveVaFramework';

export interface VaServiceDefinition {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  isV1BetaFocus: boolean;
  description: string;
  toolsRecommended: string[];
  skills: {
    id: string;
    name: string;
    description: string;
    subSkills: string[];
  }[];
  defaultClient: ClientPersona;
  initialTasks: TaskItem[];
  competencies: CompetencyMetric[];
}

// ------------------------------------------------------------------------------
// Official 6 Stages of the 90-Day Progression (+ Day 90 Capstone)
// ------------------------------------------------------------------------------
export const SIMULATION_STAGES = [
  {
    stageNumber: 1,
    name: 'Stage 1 — Foundation',
    daysRange: 'Days 1–7',
    startDay: 1,
    endDay: 7,
    focus: 'Fundamental communication protocols, ticket/inbox hygiene, SOP adherence, and understanding client voice.',
    difficulty: 'easy' as const,
  },
  {
    stageNumber: 2,
    name: 'Stage 2 — Independent Execution',
    daysRange: 'Days 8–21',
    startDay: 8,
    endDay: 21,
    focus: 'Cross-referencing documentation, handling multi-tier requests, researching discrepancies, and preparing synthesis reports.',
    difficulty: 'medium' as const,
  },
  {
    stageNumber: 3,
    name: 'Stage 3 — Problem Solving',
    daysRange: 'Days 22–35',
    startDay: 22,
    endDay: 35,
    focus: 'Navigating incomplete briefs, triaging overlapping urgent demands, making sound judgements under uncertainty.',
    difficulty: 'medium' as const,
  },
  {
    stageNumber: 4,
    name: 'Stage 4 — Client Management',
    daysRange: 'Days 36–50',
    startDay: 36,
    endDay: 50,
    focus: 'Managing client expectations, proactive status communication, maintaining workflow momentum, and managing feedback.',
    difficulty: 'hard' as const,
  },
  {
    stageNumber: 5,
    name: 'Stage 5 — Pressure & Multiple Tasks',
    daysRange: 'Days 51–70',
    startDay: 51,
    endDay: 70,
    focus: 'Managing ticket surges, concurrent deadlines, crisis de-escalation, and high-velocity execution with zero errors.',
    difficulty: 'hard' as const,
  },
  {
    stageNumber: 6,
    name: 'Stage 6 — Advanced Professional Execution',
    daysRange: 'Days 71–89',
    startDay: 71,
    endDay: 89,
    focus: 'End-to-end management with complete autonomy, drafting standard operating procedures, proactive workflow optimization.',
    difficulty: 'hard' as const,
  },
  {
    stageNumber: 7,
    name: 'Day 90 — Capstone',
    daysRange: 'Day 90',
    startDay: 90,
    endDay: 90,
    focus: 'Holistic multi-scenario practical capstone exam assessing all core competency dimensions and service-specific skills.',
    difficulty: 'crisis' as const,
  },
];

// ==============================================================================
// 1. CUSTOMER SERVICE VA
// ==============================================================================
const CUSTOMER_SERVICE_VA: VaServiceDefinition = {
  id: 'customer_service',
  name: 'Customer Service VA',
  shortName: 'Customer Service',
  badge: 'Core Track',
  isV1BetaFocus: true,
  description: 'Master helpdesk ticketing (Zendesk/Gorgias), empathetic complaint handling, refund policy enforcement, live chat multi-tasking, and VIP customer retention.',
  toolsRecommended: ['Gorgias', 'Zendesk', 'Intercom', 'Shopify Admin', 'Slack', 'Loom', 'Google Docs'],
  skills: [
    {
      id: 'cs-sk-1',
      name: 'Complaint Handling & De-escalation',
      description: 'Defusing upset customers and transforming negative experiences into brand loyalty.',
      subSkills: ['Active Empathy Framing', 'De-escalation Language', 'Sentiment Assessment', 'Apology Frameworks'],
    },
    {
      id: 'cs-sk-2',
      name: 'Customer Communication & Brand Tone',
      description: 'Delivering warm, human, clear, and on-brand email and chat responses.',
      subSkills: ['Brand Tone Calibration', 'Concise Structuring', 'Macro Customization', 'Positive Framing'],
    },
    {
      id: 'cs-sk-3',
      name: 'Ticket Management & Macro Triage',
      description: 'Managing ticket queues, applying customized macros, and routing urgent issues.',
      subSkills: ['Queue Categorization', 'SLA Adherence', 'Tagging & Metadata', 'Zendesk/Gorgias Workflow'],
    },
    {
      id: 'cs-sk-4',
      name: 'Escalation & Refund Policy Logic',
      description: 'Balancing client financial guidelines with customer satisfaction and fraud prevention.',
      subSkills: ['Return Exception Logic', 'Store Credit Incentives', 'Courier Tracking Investigation', 'Cross-Team Escalation'],
    },
  ],
  defaultClient: generateSimulatedClient('customer_service', 'ecommerce_beauty'),
  initialTasks: [
    {
      id: 'task-cs-01',
      dayNumber: 1,
      phaseId: 1,
      title: 'Day 1: Damaged Shipment & Upset Customer Ticket Triage',
      category: 'Client Communications',
      priority: 'high',
      estimatedMinutes: 30,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: 'A first-time VIP customer (order #LG-8942) received a shattered Vitamin C Glow Serum bottle in her package. She sent an upset email threatening to leave a 1-star TikTok review. Draft an empathetic, compliant response offering an immediate priority replacement plus bonus store credit following Lumina Living guidelines.',
      clientContext: 'Sarah message: "Welcome to Lumina Living! Here is your first ticket. Remember: acknowledge her frustration immediately, take accountability, and offer the free expedited reshipment. Do not make her send photos of broken glass for safety reasons."',
      deliverables: [
        { id: 'del-cs-1', label: 'Drafted Customer Support Email Reply (Gorgias format)', type: 'email_draft', required: true },
        { id: 'del-cs-2', label: 'Internal Ticket Note & Reshipment Order Summary', type: 'text', required: true },
      ],
      status: 'in_progress',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-cs-02',
      dayNumber: 2,
      phaseId: 1,
      title: 'Day 2: Multi-Item Return & Store Credit Retention Flow',
      category: 'Operations & CRM',
      priority: 'medium',
      estimatedMinutes: 35,
      deadlineHours: 8,
      deadlineType: 'soft',
      brief: 'A customer wants to return two unopened moisturizers because they accidentally ordered duplicate scents. Formulate a response explaining our return steps, but provide an enticing offer: an instant $45 gift card (+15% bonus) or a prepaid return label with a $6 restocking deduction.',
      clientContext: 'Sarah message: "Our primary retention goal is converting returns into store credit. Keep your tone helpful and make the store credit option sound super easy and beneficial."',
      deliverables: [
        { id: 'del-cs-3', label: 'Customer Return Options Email', type: 'email_draft', required: true },
        { id: 'del-cs-4', label: 'Shopify Tagging & Return Status Code', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-cs-03',
      dayNumber: 3,
      phaseId: 1,
      title: 'Day 3: Macro Audit & Tone Personalization Optimization',
      category: 'Operations & CRM',
      priority: 'medium',
      estimatedMinutes: 40,
      deadlineHours: 24,
      deadlineType: 'none',
      brief: 'Audit 3 existing customer service macros ("Where Is My Order", "Ingredient Safety", "Subscription Cancellation") and rewrite them to sound more human, empathetic, and aligned with Lumina brand voice.',
      clientContext: 'Sarah message: "Our current canned responses feel too robotic. Rewrite these 3 templates so the team can use them as flexible, warm baselines."',
      deliverables: [
        { id: 'del-cs-5', label: 'Rewritten 3-Macro Playbook Document', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ],
  competencies: [
    {
      id: 'comp-cs-1',
      name: 'Complaint Handling & De-escalation',
      category: 'Service Specific',
      score: 93,
      level: 'Advanced',
      description: 'De-escalating emotionally charged situations with warmth and brand loyalty retention.',
      keySkills: ['Empathy Framing', 'De-escalation', 'Active Listening', 'Tone Calibration'],
      trend: '+12%',
    },
    {
      id: 'comp-cs-2',
      name: 'Customer Communication & Brand Tone',
      category: 'Service Specific',
      score: 91,
      level: 'Advanced',
      description: 'Writing warm, clear, and human customer replies adhering to client brand guidelines.',
      keySkills: ['Positive Phrasing', 'Brand Tone', 'Clarity', 'Formatting'],
      trend: '+8%',
    },
    {
      id: 'comp-cs-3',
      name: 'Ticket Management & Macro Triage',
      category: 'Service Specific',
      score: 90,
      level: 'Proficient',
      description: 'Accurately categorizing tickets, meeting first-response SLAs, and customizing macro replies.',
      keySkills: ['Queue Triage', 'SLA Adherence', 'Macro Bank Optimization', 'Tagging Hygiene'],
      trend: '+6%',
    },
    {
      id: 'comp-cs-4',
      name: 'Escalation & Refund Policy Logic',
      category: 'Service Specific',
      score: 88,
      level: 'Proficient',
      description: 'Balancing company refund policies against customer lifetime value and fraud prevention.',
      keySkills: ['Refund Logic', 'Retention Offers', 'Courier Investigation', 'Fraud Spotting'],
      trend: '+10%',
    },
  ],
};

// ==============================================================================
// 2. SOCIAL MEDIA VA
// ==============================================================================
const SOCIAL_MEDIA_VA: VaServiceDefinition = {
  id: 'social_media',
  name: 'Social Media VA',
  shortName: 'Social Media',
  badge: 'Core Track',
  isV1BetaFocus: true,
  description: 'Manage content scheduling, hook & caption copywriting, community DM moderation, Canva asset prep, hashtag research, and monthly engagement reporting.',
  toolsRecommended: ['Buffer', 'Later', 'Canva', 'Notion', 'Instagram Creator Studio', 'TikTok', 'CapCut', 'Slack'],
  skills: [
    {
      id: 'sm-sk-1',
      name: 'Content Planning & Calendar Strategy',
      description: 'Structuring multi-platform scheduling pipelines in Notion, Later, and Buffer.',
      subSkills: ['Publishing Cadence', 'Optimal Time Analysis', 'Asset Organization', 'Multi-Platform Formatting'],
    },
    {
      id: 'sm-sk-2',
      name: 'Hook & Caption Copywriting',
      description: 'Writing high-converting captions, viral opening hooks, and engaging call-to-actions (CTAs).',
      subSkills: ['Hook Formulas', 'Storytelling Captions', 'CTA Placement', 'Tone of Voice Adaptation'],
    },
    {
      id: 'sm-sk-3',
      name: 'Community Management & DM Triage',
      description: 'Responding to comments, triaging influencer DMs, and proactively engaging niche communities.',
      subSkills: ['DM Triage', 'Crisis Comment Handling', 'Engagement Pod Tactics', 'Spam Moderation'],
    },
    {
      id: 'sm-sk-4',
      name: 'Content Research & Trend Auditing',
      description: 'Tracking reach, saves, audio trends, hashtag clusters, and compiling weekly growth insights.',
      subSkills: ['Trend Spotting', 'Metrics Interpretation', 'Hashtag Auditing', 'Competitor Analysis'],
    },
  ],
  defaultClient: generateSimulatedClient('social_media', 'fashion_apparel'),
  initialTasks: [
    {
      id: 'task-sm-01',
      dayNumber: 1,
      phaseId: 1,
      title: 'Day 1: Weekly Instagram Carousel Copy & Hook Planning',
      category: 'Research & Synthesis',
      priority: 'high',
      estimatedMinutes: 35,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: 'Draft 3 carousel post concepts for Aura Collective autumn capsule launch. For each post, write: 1 attention-grabbing hook, a 4-slide micro-story caption, 3 interactive engagement questions, and 8 curated niche hashtags.',
      clientContext: 'Elena message: "Welcome aboard! We are launching our organic linen trench coat next Tuesday. Give me 3 creative caption directions that highlight sustainable craftsmanship without sounding dry or preachy."',
      deliverables: [
        { id: 'del-sm-1', label: '3-Post Instagram Copy & Hook Document', type: 'document', required: true },
        { id: 'del-sm-2', label: 'Slide-by-Slide Visual Direction Brief for Canva', type: 'text', required: true },
      ],
      status: 'in_progress',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-sm-02',
      dayNumber: 2,
      phaseId: 1,
      title: 'Day 2: High-Priority Influencer & VIP DM Inbox Triage',
      category: 'Client Communications',
      priority: 'urgent',
      estimatedMinutes: 30,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: 'Process 12 unread Instagram DMs from fashion creators asking for gifting collaborations. Categorize them by follower count & engagement quality, and draft customized outreach acceptance responses for the top 2 creators.',
      clientContext: 'Elena message: "Check the DM inbox spreadsheet. Creator @stylewithmaya (85k followers) and @claire.eco (40k followers) are exact brand matches. Draft warm responses inviting them to our PR seeding list."',
      deliverables: [
        { id: 'del-sm-3', label: 'Influencer DM Triage & Selection Table', type: 'spreadsheet', required: true },
        { id: 'del-sm-4', label: '2 Drafted DM Collaboration Outreach Responses', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ],
  competencies: [
    {
      id: 'comp-sm-1',
      name: 'Content Planning & Scheduling',
      category: 'Service Specific',
      score: 92,
      level: 'Advanced',
      description: 'Structuring multi-platform scheduling pipelines in Notion, Later, and Buffer with zero missed dates.',
      keySkills: ['Notion Calendars', 'Asset Sizing', 'Publishing Cadence', 'Cross-Platform Formatting'],
      trend: '+12%',
    },
    {
      id: 'comp-sm-2',
      name: 'Hook & Caption Copywriting',
      category: 'Service Specific',
      score: 93,
      level: 'Advanced',
      description: 'Writing punchy, on-brand hooks and captions that maximize read-through rate and conversions.',
      keySkills: ['Hook Formulas', 'Brand Voice', 'Storytelling', 'CTA Optimization'],
      trend: '+14%',
    },
    {
      id: 'comp-sm-3',
      name: 'Community Management & DM Triage',
      category: 'Service Specific',
      score: 89,
      level: 'Proficient',
      description: 'Engaging creators, managing PR seeding lists, and protecting brand reputation in comment threads.',
      keySkills: ['DM Triage', 'Influencer Outreach', 'Crisis Moderation', 'Relationship Building'],
      trend: '+9%',
    },
    {
      id: 'comp-sm-4',
      name: 'Content Research & Trend Auditing',
      category: 'Service Specific',
      score: 88,
      level: 'Proficient',
      description: 'Synthesizing engagement metrics, hashtag clusters, and audio trends into actionable suggestions.',
      keySkills: ['Trend Spotting', 'Engagement Metrics', 'Competitor Auditing', 'Reporting'],
      trend: '+7%',
    },
  ],
};

// ==============================================================================
// 3. EXECUTIVE VA (14-DAY CORE ARCHITECTURE & 14 COMPETENCIES)
// ==============================================================================
const defaultExecClient = generateSimulatedClient('executive_admin', 'b2b_saas');

const EXECUTIVE_VA: VaServiceDefinition = {
  id: 'executive_admin',
  name: 'Executive VA',
  shortName: 'Executive VA',
  badge: '14-Day Simulation',
  isV1BetaFocus: true,
  description: 'Support high-velocity founders & CEOs across calendar deconfliction, inbox triage, business research, multi-city travel logistics, and C-suite operational decision making.',
  toolsRecommended: ['Google Workspace', 'Notion', 'Slack', 'Asana', 'Superhuman', 'Zoom', 'Loom'],
  skills: EXECUTIVE_VA_SKILLS.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    subSkills: s.subSkills,
  })),
  defaultClient: defaultExecClient,
  initialTasks: [
    generateDynamicExecutiveVaTask({
      dayNumber: 1,
      client: defaultExecClient,
      identifiedWeaknesses: [],
    }),
  ],
  competencies: getInitialExecutiveVaCompetencies(),
};

// ==============================================================================
// 4. TRAVEL MANAGEMENT VA
// ==============================================================================
const TRAVEL_MANAGEMENT_VA: VaServiceDefinition = {
  id: 'travel_management',
  name: 'Travel Management VA',
  shortName: 'Travel Management',
  badge: 'Official Service',
  isV1BetaFocus: false,
  description: 'Design end-to-end luxury travel itineraries, coordinate flights, private lodging, ground transport, visa checks, and manage real-time travel disruptions.',
  toolsRecommended: ['TripIt', 'Google Workspace', 'Expedia Partner Solutions', 'Slack', 'Loom', 'Notion'],
  skills: [
    {
      id: 'tm-sk-1',
      name: 'Itinerary Design & Logistics Coordination',
      description: 'Building master door-to-door schedules with confirmation codes, transit buffers, and dining bookings.',
      subSkills: ['Door-to-Door Itineraries', 'Confirmation Code Tracking', 'Time Zone Adjustment', 'Local Customs'],
    },
    {
      id: 'tm-sk-2',
      name: 'Flight & Accommodation Deconfliction',
      description: 'Selecting optimal flight routings, airline loyalty seat selection, and boutique hotel bookings.',
      subSkills: ['Flight Routing Analysis', 'Loyalty Tier Benefits', 'Hotel Negotiation', 'Transfer Arrangements'],
    },
    {
      id: 'tm-sk-3',
      name: 'Travel Expense & Budget Tracking',
      description: 'Reconciling corporate travel cards, keeping expenses within policy, and logging itemized receipts.',
      subSkills: ['Budget Reconciliation', 'Per Diem Calculations', 'Receipt Filing', 'Currency Exchange'],
    },
    {
      id: 'tm-sk-4',
      name: 'Emergency Rebooking & Real-Time Support',
      description: 'Handling missed connections, airline delays, cancellations, and lost luggage resolution.',
      subSkills: ['Rapid Rebooking', 'Emergency Contact Protocols', 'Alternative Routing', 'Stress De-escalation'],
    },
  ],
  defaultClient: generateSimulatedClient('travel_management', 'luxury_travel'),
  initialTasks: [
    {
      id: 'task-tm-01',
      dayNumber: 1,
      phaseId: 1,
      title: 'Day 1: Multi-Leg European Executive Travel & Itinerary Design',
      category: 'Calendar & Travel',
      priority: 'high',
      estimatedMinutes: 40,
      deadlineHours: 8,
      deadlineType: 'soft',
      brief: 'Julian has a 4-day trip across London, Zurich, and Milan for investor roadshows. Build an end-to-end itinerary with flight options, private airport transfers, 5-star hotel options with flexible cancellation, and 15-minute buffer windows between meetings.',
      clientContext: 'Julian message: "I need minimum connection times of 90 minutes for international transfers, aisle seating in business class, and hotels with high-speed fiber internet."',
      deliverables: [
        { id: 'del-tm-1', label: 'Comprehensive Master Travel Itinerary Document', type: 'document', required: true },
        { id: 'del-tm-2', label: 'Travel Expense Estimate & Booking Comparison Matrix', type: 'spreadsheet', required: true },
      ],
      status: 'in_progress',
      createdAt: new Date().toISOString(),
    },
  ],
  competencies: [
    {
      id: 'comp-tm-1',
      name: 'Itinerary Design & Logistics',
      category: 'Service Specific',
      score: 92,
      level: 'Advanced',
      description: 'Creating comprehensive, door-to-door travel schedules with zero scheduling gaps.',
      keySkills: ['Itinerary Building', 'Time Buffers', 'Local Logistics'],
      trend: '+12%',
    },
    {
      id: 'comp-tm-2',
      name: 'Flight & Accommodation Deconfliction',
      category: 'Service Specific',
      score: 90,
      level: 'Proficient',
      description: 'Selecting optimal routes, managing airline loyalty perks, and hotel booking policies.',
      keySkills: ['Route Optimization', 'Seat Selection', 'Hotel Policies'],
      trend: '+8%',
    },
    {
      id: 'comp-tm-3',
      name: 'Travel Expense & Budget Tracking',
      category: 'Service Specific',
      score: 88,
      level: 'Proficient',
      description: 'Tracking travel costs, itemizing receipts, and adhering strictly to corporate budgets.',
      keySkills: ['Expense Tracking', 'Currency Conversion', 'Receipt Logging'],
      trend: '+6%',
    },
    {
      id: 'comp-tm-4',
      name: 'Emergency Rebooking & Support',
      category: 'Service Specific',
      score: 89,
      level: 'Proficient',
      description: 'Executing fast, calm rebooking solutions when flights are delayed or cancelled.',
      keySkills: ['Crisis Routing', 'Airline Negotiations', 'Real-Time Communication'],
      trend: '+10%',
    },
  ],
};

// ==============================================================================
// 5. SOCIAL MARKETING & COLD OUTREACH VA
// ==============================================================================
const SOCIAL_OUTREACH_VA: VaServiceDefinition = {
  id: 'social_outreach',
  name: 'Social Marketing & Cold Outreach VA',
  shortName: 'Social Marketing & Outreach',
  badge: 'Official Service',
  isV1BetaFocus: false,
  description: 'Drive B2B growth via personalized LinkedIn outreach, cold email multi-touch sequences, icebreaker research, response handling, and booking qualified discovery calls.',
  toolsRecommended: ['LinkedIn Sales Navigator', 'Lemlist', 'Instantly', 'Apollo.io', 'HubSpot', 'Google Sheets'],
  skills: [
    {
      id: 'so-sk-1',
      name: 'Prospect List Building & Qualification',
      description: 'Identifying target decision makers matching Ideal Customer Profile (ICP) criteria.',
      subSkills: ['Sales Navigator Filters', 'ICP Verification', 'Lead Scoring', 'List Segmentation'],
    },
    {
      id: 'so-sk-2',
      name: 'Cold Outreach & Icebreaker Personalization',
      description: 'Crafting high-converting 1-to-1 personalized hooks referencing recent prospect activity.',
      subSkills: ['Custom Icebreakers', 'Value Proposition Framing', 'Hook Writing', 'Spam Trigger Avoidance'],
    },
    {
      id: 'so-sk-3',
      name: 'Multi-Channel Follow-Up Cadence',
      description: 'Structuring 4-to-6 step email and LinkedIn touchpoint cadences with escalating value.',
      subSkills: ['Cadence Architecture', 'Break-Up Email Copy', 'Timing Optimization', 'A/B Subject Testing'],
    },
    {
      id: 'so-sk-4',
      name: 'Response Handling & Meeting Booking',
      description: 'Triaging prospect replies, addressing common objections, and sharing scheduling links.',
      subSkills: ['Objection Handling', 'Calendly Coordination', 'Lead Qualification', 'CRM Pipeline Logging'],
    },
  ],
  defaultClient: generateSimulatedClient('social_outreach', 'digital_marketing'),
  initialTasks: [
    {
      id: 'task-so-01',
      dayNumber: 1,
      phaseId: 1,
      title: 'Day 1: 20-Lead Hyper-Personalized Cold Outreach Sequence',
      category: 'Research & Synthesis',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 8,
      deadlineType: 'soft',
      brief: 'Research 20 B2B Marketing Directors at Series A-B startups. Write custom icebreaker sentences referencing their recent LinkedIn posts or company announcements, and draft a 3-touch follow-up sequence.',
      clientContext: 'Claire message: "No generic templates allowed. The first sentence must prove you actually spent 3 minutes reviewing their background before pitching our growth audit."',
      deliverables: [
        { id: 'del-so-1', label: '20-Lead Prospect Sheet with Custom Icebreakers', type: 'spreadsheet', required: true },
        { id: 'del-so-2', label: '3-Step Multi-Touch Email & LinkedIn Sequence', type: 'document', required: true },
      ],
      status: 'in_progress',
      createdAt: new Date().toISOString(),
    },
  ],
  competencies: [
    {
      id: 'comp-so-1',
      name: 'Prospect Qualification & List Building',
      category: 'Service Specific',
      score: 91,
      level: 'Advanced',
      description: 'Filtering decision makers accurately and verifying contact deliverability.',
      keySkills: ['Sales Navigator', 'ICP Matching', 'List Cleaning'],
      trend: '+12%',
    },
    {
      id: 'comp-so-2',
      name: 'Icebreaker Personalization & Copy',
      category: 'Service Specific',
      score: 93,
      level: 'Advanced',
      description: 'Writing compelling custom hooks that increase email open and reply rates.',
      keySkills: ['Icebreaker Research', 'Subject Lines', 'Call to Action'],
      trend: '+15%',
    },
    {
      id: 'comp-so-3',
      name: 'Follow-Up Cadence Strategy',
      category: 'Service Specific',
      score: 89,
      level: 'Proficient',
      description: 'Designing high-converting multi-step follow-ups without triggering spam flags.',
      keySkills: ['Cadence Timing', 'Value-Add Messaging', 'A/B Testing'],
      trend: '+8%',
    },
    {
      id: 'comp-so-4',
      name: 'Response Handling & Meeting Booking',
      category: 'Service Specific',
      score: 90,
      level: 'Proficient',
      description: 'Swiftly replying to interested leads and handling scheduling questions smoothly.',
      keySkills: ['Objection Handling', 'Calendly Integration', 'HubSpot Logging'],
      trend: '+10%',
    },
  ],
};

// ==============================================================================
// 6. LEAD GENERATION & RESEARCH VA
// ==============================================================================
const LEAD_GEN_RESEARCH_VA: VaServiceDefinition = {
  id: 'lead_gen_research',
  name: 'Lead Generation & Research VA',
  shortName: 'Lead Gen & Research',
  badge: 'Official Service',
  isV1BetaFocus: false,
  description: 'Conduct in-depth market intelligence, prospect research, contact data validation, competitor auditing, and maintain pristine CRM data hygiene.',
  toolsRecommended: ['Apollo.io', 'LinkedIn Sales Navigator', 'Google Sheets', 'NeverBounce', 'HubSpot', 'Clay'],
  skills: [
    {
      id: 'lg-sk-1',
      name: 'Ideal Customer Profile (ICP) Targeting',
      description: 'Defining and executing search queries across industry verticals, headcount, and revenue criteria.',
      subSkills: ['Boolean Search Queries', 'Industry Tagging', 'Revenue Filters', 'Tech Stack Lookup'],
    },
    {
      id: 'lg-sk-2',
      name: 'Contact Verification & Data Enrichment',
      description: 'Validating corporate emails, phone numbers, and cross-checking data accuracy against multiple sources.',
      subSkills: ['Email Verification Tools', 'Phone Verification', 'Data De-duplication', 'Accuracy Validation'],
    },
    {
      id: 'lg-sk-3',
      name: 'Market & Competitor Intelligence',
      description: 'Auditing competitor pricing, feature releases, hiring trends, and compiling synthesized intelligence decks.',
      subSkills: ['Competitor Audits', 'Pricing Comparison', 'Executive Synthesis', 'Industry Benchmarking'],
    },
    {
      id: 'lg-sk-4',
      name: 'CRM Data Hygiene & Organization',
      description: 'Structuring clean spreadsheets and mapping custom fields into HubSpot, Salesforce, and Airtable.',
      subSkills: ['Spreadsheet Formulas', 'Field Mapping', 'CRM Imports', 'Error Checking'],
    },
  ],
  defaultClient: generateSimulatedClient('lead_gen_research', 'real_estate'),
  initialTasks: [
    {
      id: 'task-lg-01',
      dayNumber: 1,
      phaseId: 1,
      title: 'Day 1: Commercial Real Estate Property Owner Research & Verification',
      category: 'Research & Synthesis',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 8,
      deadlineType: 'none',
      brief: 'Build a verified database of 25 commercial property owners in the greater metropolitan area with properties valued above $5M. Include parcel numbers, validated LLC ownership, direct contact phone/email, and estimated square footage.',
      clientContext: 'Rachel message: "Accuracy is everything. Verify the registered agent on the Secretary of State portal and cross-check phone numbers with 2 sources."',
      deliverables: [
        { id: 'del-lg-1', label: '25-Property Owner Research Spreadsheet', type: 'spreadsheet', required: true },
        { id: 'del-lg-2', label: 'Market Research Summary & Methodology Notes', type: 'document', required: true },
      ],
      status: 'in_progress',
      createdAt: new Date().toISOString(),
    },
  ],
  competencies: [
    {
      id: 'comp-lg-1',
      name: 'ICP Targeting & Boolean Search',
      category: 'Service Specific',
      score: 93,
      level: 'Advanced',
      description: 'Building precise target lists using advanced search operators and platform filters.',
      keySkills: ['Boolean Operators', 'Filters', 'Target Segmentation'],
      trend: '+12%',
    },
    {
      id: 'comp-lg-2',
      name: 'Contact Verification & Accuracy',
      category: 'Service Specific',
      score: 94,
      level: 'Advanced',
      description: 'Zero bounce rates with rigorous multi-source email and phone validation.',
      keySkills: ['NeverBounce', 'Cross-Verification', 'Data Hygiene'],
      trend: '+10%',
    },
    {
      id: 'comp-lg-3',
      name: 'Market & Competitor Intelligence',
      category: 'Service Specific',
      score: 89,
      level: 'Proficient',
      description: 'Synthesizing market trends, competitor pricing, and executive summaries.',
      keySkills: ['Competitive Benchmarks', 'Market Sizing', 'Synthesis Reports'],
      trend: '+7%',
    },
    {
      id: 'comp-lg-4',
      name: 'CRM Organization & Spreadsheets',
      category: 'Service Specific',
      score: 91,
      level: 'Advanced',
      description: 'Formatting clean data tables with standard schema rules and zero duplicates.',
      keySkills: ['Google Sheets Formulas', 'Data Formatting', 'CRM Mapping'],
      trend: '+9%',
    },
  ],
};

// ==============================================================================
// 7. CONTENT WRITING VA
// ==============================================================================
const CONTENT_WRITING_VA: VaServiceDefinition = {
  id: 'content_writing',
  name: 'Content Writing VA',
  shortName: 'Content Writing',
  badge: 'Official Service',
  isV1BetaFocus: false,
  description: 'Write engaging blog articles, SEO-optimized guides, weekly email newsletters, social summaries, and conduct in-depth topic research with pristine grammar.',
  toolsRecommended: ['Google Docs', 'Grammarly', 'SurferSEO', 'Hemingway App', 'Notion', 'WordPress'],
  skills: [
    {
      id: 'cw-sk-1',
      name: 'Long-Form Article & Blog Drafting',
      description: 'Writing comprehensive 1,200–2,000 word thought leadership articles with engaging narrative structure.',
      subSkills: ['Article Outlining', 'Storytelling Structure', 'H2/H3 Heading Hierarchy', 'Introduction Hooks'],
    },
    {
      id: 'cw-sk-2',
      name: 'Newsletter & Email Sequence Writing',
      description: 'Writing punchy, high-open-rate newsletters and 5-day educational email nurture sequences.',
      subSkills: ['Subject Line Formulas', 'Conversational Copy', 'Clickable CTAs', 'Newsletter Curation'],
    },
    {
      id: 'cw-sk-3',
      name: 'SEO Keyword Research & Structure',
      description: 'Incorporating primary/secondary keywords naturally, writing meta tags, and formatting for featured snippets.',
      subSkills: ['Keyword Placement', 'Meta Descriptions', 'Search Intent Analysis', 'Internal Link Structure'],
    },
    {
      id: 'cw-sk-4',
      name: 'Content Editing & Proofreading',
      description: 'Polishing drafts for AP style, tone consistency, Hemingway grade readability, and zero typos.',
      subSkills: ['Line Editing', 'Proofreading', 'Fact Checking', 'Brand Style Guide Adherence'],
    },
  ],
  defaultClient: generateSimulatedClient('content_writing', 'digital_marketing'),
  initialTasks: [
    {
      id: 'task-cw-01',
      dayNumber: 1,
      phaseId: 1,
      title: 'Day 1: 1,500-Word SEO Guide on Modern Remote Work Workflows',
      category: 'Content & Copywriting',
      priority: 'high',
      estimatedMinutes: 50,
      deadlineHours: 8,
      deadlineType: 'soft',
      brief: 'Write an actionable 1,500-word blog article titled "The 2026 Executive Guide to Asynchronous Team Productivity". Include target SEO keywords naturally, write an engaging opening hook, format with clear H2/H3 subheadings, and provide a 150-word meta description.',
      clientContext: 'Liam message: "Keep the tone authoritative yet conversational. Aim for Hemingway Grade 8 readability and cite 2 reputable research studies in the body text."',
      deliverables: [
        { id: 'del-cw-1', label: 'Complete 1,500-Word Article Draft with Meta Data', type: 'document', required: true },
        { id: 'del-cw-2', label: 'SEO Keyword Density & Source Citation Log', type: 'text', required: true },
      ],
      status: 'in_progress',
      createdAt: new Date().toISOString(),
    },
  ],
  competencies: [
    {
      id: 'comp-cw-1',
      name: 'Long-Form Article Drafting',
      category: 'Service Specific',
      score: 93,
      level: 'Advanced',
      description: 'Writing structured, engaging, and in-depth thought leadership content.',
      keySkills: ['Narrative Flow', 'Subheading Hierarchy', 'Actionable Takeaways'],
      trend: '+12%',
    },
    {
      id: 'comp-cw-2',
      name: 'Newsletter & Email Writing',
      category: 'Service Specific',
      score: 91,
      level: 'Advanced',
      description: 'Writing high-converting newsletter editions and email sequences.',
      keySkills: ['Subject Lines', 'Conversational Tone', 'CTA Placement'],
      trend: '+10%',
    },
    {
      id: 'comp-cw-3',
      name: 'SEO Keyword Structure & Search Intent',
      category: 'Service Specific',
      score: 90,
      level: 'Proficient',
      description: 'Natural keyword integration, meta titles, descriptions, and snippet optimization.',
      keySkills: ['Search Intent', 'Meta Descriptions', 'Keyword Density'],
      trend: '+8%',
    },
    {
      id: 'comp-cw-4',
      name: 'Editing & Proofreading Precision',
      category: 'Service Specific',
      score: 94,
      level: 'Advanced',
      description: 'Flawless grammar, AP style alignment, and high readability scores.',
      keySkills: ['Line Editing', 'Fact Checking', 'Tone Consistency'],
      trend: '+14%',
    },
  ],
};

// ==============================================================================
// ALL EXACT 7 OFFICIAL VA SERVICES REGISTRY
// ==============================================================================
export const ALL_VA_SERVICES: VaServiceDefinition[] = [
  EXECUTIVE_VA,
  SOCIAL_MEDIA_VA,
  CUSTOMER_SERVICE_VA,
  TRAVEL_MANAGEMENT_VA,
  SOCIAL_OUTREACH_VA,
  LEAD_GEN_RESEARCH_VA,
  CONTENT_WRITING_VA,
];

export const getServiceById = (id: string): VaServiceDefinition => {
  return ALL_VA_SERVICES.find((s) => s.id === id) || CUSTOMER_SERVICE_VA;
};

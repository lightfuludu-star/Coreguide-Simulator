// ==============================================================================
// CoreGuide VA Simulator - Executive VA 14-Day Simulation Framework
// Technical Specification: 14 Core Skills, 5 Progressive Phases, Dynamic Engine
// ==============================================================================

import { ClientPersona, TaskItem, CompetencyMetric, TaskDeliverable } from '../types';

// ------------------------------------------------------------------------------
// 1. THE 14 OFFICIAL EXECUTIVE VA CORE SKILLS
// ------------------------------------------------------------------------------
export interface ExecutiveVaSkillDef {
  id: string;
  name: string;
  code: string;
  category: 'Executive Support';
  description: string;
  beginnerScope: string;
  intermediateScope: string;
  advancedScope: string;
  subSkills: string[];
  evaluationCriteria: string[];
  remediationTrigger: string;
}

export const EXECUTIVE_VA_SKILLS: ExecutiveVaSkillDef[] = [
  {
    id: 'eva-sk-1',
    name: 'Calendar Management',
    code: 'CAL_MGMT',
    category: 'Executive Support',
    description: 'Deconflicting multi-stakeholder schedules, applying executive buffer rules, and managing international time zones.',
    beginnerScope: 'Setting up simple calendar appointments, applying 15-min buffers, basic time blocking.',
    intermediateScope: 'Resolving overlapping bookings, multi-timezone conversions (PST/EST/GMT/SGT), recurring syncs.',
    advancedScope: 'Managing complex executive schedules, multi-city travel calendars, urgent last-minute deconfliction.',
    subSkills: ['Timezone Conversion', 'Buffer Management', 'Recurring Hold Blocks', 'Deconfliction Logic'],
    evaluationCriteria: ['Zero double bookings', 'Proper time zone math', 'Buffer time included', 'Clear event titles & location/link'],
    remediationTrigger: 'Overlapping bookings, missing video links, or incorrect time zone calculations.',
  },
  {
    id: 'eva-sk-2',
    name: 'Meeting Coordination',
    code: 'MTG_COORD',
    category: 'Executive Support',
    description: 'Aligning multi-party participant availability, preparing agendas, distributing pre-reads, and coordinating follow-ups.',
    beginnerScope: 'Setting up Zoom/Google Meet links, drafting clear meeting invites with standard agenda points.',
    intermediateScope: 'Coordinating 3+ executive attendees across departments, collecting agenda topics from stakeholders.',
    advancedScope: 'Board meetings, investor pitch coordination, sensitive stakeholder alignment with pre-call dossiers.',
    subSkills: ['Platform Link Generation', 'Agenda Structuring', 'Participant Availability Polls', 'Pre-Meeting Materials'],
    evaluationCriteria: ['Working meeting links', 'Context-rich agendas', 'Participant confirmation tracking', 'Pre-call briefing attached'],
    remediationTrigger: 'Missing agenda, broken link, or lack of attendee confirmation steps.',
  },
  {
    id: 'eva-sk-3',
    name: 'Email Management',
    code: 'EMAIL_MGMT',
    category: 'Executive Support',
    description: 'Triaging high-volume executive inboxes, categorizing actionable emails, and drafting high-level replies on behalf of the CEO.',
    beginnerScope: 'Reviewing and categorizing emails into Action Required, FYI, Newsletters, and Archive.',
    intermediateScope: 'Drafting polite, concise email responses on behalf of the founder, flagging urgent investor/client threads.',
    advancedScope: 'Zero-inbox triage of 150+ daily emails, managing sensitive escalations, proactive follow-up triggers.',
    subSkills: ['Priority Inbox Triage', 'Drafting on Behalf', 'Follow-up Triggers', 'VIP Routing'],
    evaluationCriteria: ['Accurate priority categorization', 'Professional founder voice calibration', 'Urgent items surfaced first'],
    remediationTrigger: 'Misclassifying urgent emails or using inappropriate tone in drafts.',
  },
  {
    id: 'eva-sk-4',
    name: 'Travel Planning',
    code: 'TRAVEL_PLAN',
    category: 'Executive Support',
    description: 'Designing end-to-end executive travel logistics including flights, hotels, airport ground transfers, and door-to-door itineraries.',
    beginnerScope: 'Finding flight and hotel options matching founder preferences, compiling basic comparison tables.',
    intermediateScope: 'Building master multi-day business itineraries with confirmation codes, transit buffers, and dining reservations.',
    advancedScope: 'Multi-city international roadshows, private transfer deconfliction, emergency flight rebooking protocols.',
    subSkills: ['Flight Routing Comparison', 'Door-to-Door Itineraries', 'Hotel Booking Policy', 'Ground Transit Logistics'],
    evaluationCriteria: ['Logical connection buffers (>90 mins)', 'Adherence to seat/hotel preferences', 'Complete confirmation data', 'Clear timezones'],
    remediationTrigger: 'Unrealistic transit buffers, ignoring seat/hotel preferences, or missing confirmation details.',
  },
  {
    id: 'eva-sk-5',
    name: 'Research',
    code: 'RESEARCH',
    category: 'Executive Support',
    description: 'Conducting structured market, competitor, vendor, and business intelligence research synthesized into executive briefs.',
    beginnerScope: 'Basic internet research on tools, vendors, or event venues with clean comparison summaries.',
    intermediateScope: 'Competitor feature audits, customer demographic data, software tool evaluation matrices.',
    advancedScope: 'Deep market analysis, executive background dossiers, strategic partnership vetting.',
    subSkills: ['Competitor Auditing', 'Vendor Benchmarking', 'Data Synthesis', 'Executive Briefing Format'],
    evaluationCriteria: ['Verified reliable sources', 'Structured comparison tables', 'Clear takeaway summary', 'Pros/cons analysis'],
    remediationTrigger: 'Vague unsourced claims, cluttered formatting, or lack of clear actionable takeaways.',
  },
  {
    id: 'eva-sk-6',
    name: 'Document and Information Organization',
    code: 'DOC_ORG',
    category: 'Executive Support',
    description: 'Structuring digital workspaces, Notion wikis, Google Drive taxonomies, VIP contact lists, and Standard Operating Procedures (SOPs).',
    beginnerScope: 'Organizing documents into logical folders, creating company contact lists, formatting clean Google Docs.',
    intermediateScope: 'Building structured Notion databases, maintaining executive reference sheets and meeting records.',
    advancedScope: 'Architecting company-wide knowledge repositories, document access permissions, Master SOP libraries.',
    subSkills: ['Folder Taxonomy', 'Notion Database Setup', 'Contact Directory Hygiene', 'SOP Documentation'],
    evaluationCriteria: ['Intuitive categorization', 'Standard naming conventions', 'Clean typography & layout', 'Zero orphaned files'],
    remediationTrigger: 'Messy folder structures, inconsistent naming conventions, or broken document links.',
  },
  {
    id: 'eva-sk-7',
    name: 'Administrative Support',
    code: 'ADMIN_SUPP',
    category: 'Executive Support',
    description: 'Executing day-to-day operational tasks including expense reconciliation, invoice logging, contract signature tracking, and vendor outreach.',
    beginnerScope: 'Logging receipts into spreadsheets, filing standard forms, routine administrative correspondence.',
    intermediateScope: 'Tracking expense categories against budgets, managing signature requests (DocuSign), vendor follow-ups.',
    advancedScope: 'Multi-entity administrative coordination, cross-department task tracking, operational workflow audits.',
    subSkills: ['Expense Tracking', 'Invoice Logging', 'Contract Administration', 'Vendor Liaison'],
    evaluationCriteria: ['Mathematical accuracy in sheets', 'Timely follow-ups', 'Proper file attachments', 'Clear audit trails'],
    remediationTrigger: 'Calculation errors in spreadsheets or missing vendor follow-up dates.',
  },
  {
    id: 'eva-sk-8',
    name: 'Personal Assistance',
    code: 'PERS_ASST',
    category: 'Executive Support',
    description: 'Managing personal executive errands, family calendar coordination, personal reservations, and high-trust tasks.',
    beginnerScope: 'Booking restaurant reservations, researching personal appointments, gift ideation based on preferences.',
    intermediateScope: 'Coordinating family travel schedules, personal vendor appointments (repairs, wellness), personal budgeting.',
    advancedScope: 'Balancing personal & professional calendar boundaries, high-discretion personal logistics.',
    subSkills: ['Personal Scheduling', 'Family Travel Logistics', 'Vendor Sourcing', 'Work-Life Boundary Management'],
    evaluationCriteria: ['Strict confidentiality', 'Attention to personal dietary/lifestyle preferences', 'Zero work schedule overlap'],
    remediationTrigger: 'Scheduling personal items over critical executive meetings or leaking personal details.',
  },
  {
    id: 'eva-sk-9',
    name: 'Communication',
    code: 'COMMUNICATION',
    category: 'Executive Support',
    description: 'Delivering clear, professional, concise written and verbal updates calibrated to executive and VIP stakeholder standards.',
    beginnerScope: 'Writing polite, grammatically clean messages and deliverable notes with clear subject lines.',
    intermediateScope: 'Executive email drafting with the BLUF (Bottom Line Up Front) model, active listening, asking clear clarifying questions.',
    advancedScope: 'Representing the CEO in external communications with board members, investors, and VIP clients.',
    subSkills: ['BLUF Formatting', 'Executive Etiquette', 'Active Clarification', 'Concise Status Updates'],
    evaluationCriteria: ['Clear structure (bullet points)', 'Polite & confident tone', 'No grammatical errors', 'Actionable closing'],
    remediationTrigger: 'Long rambling paragraphs, passive-aggressive tone, or failure to state the key point first.',
  },
  {
    id: 'eva-sk-10',
    name: 'Prioritization',
    code: 'PRIORITIZATION',
    category: 'Executive Support',
    description: 'Applying the Eisenhower Matrix to rank urgent vs important tasks, triaging competing executive requests, and protecting founder focus.',
    beginnerScope: 'Identifying urgent deadlines vs flexible tasks, completing high-priority items first.',
    intermediateScope: 'Triaging multiple simultaneous requests from the founder, ordering them by business impact.',
    advancedScope: 'Shielding the founder from low-value interruptions, dynamically reprioritizing schedules during crises.',
    subSkills: ['Eisenhower Matrix', 'Impact vs Urgency Scoring', 'Queue Ordering', 'Focus Shielding'],
    evaluationCriteria: ['High-impact tasks tackled first', 'Explicit priority rationale provided to client', 'Realistic deadlines set'],
    remediationTrigger: 'Focusing on minor administrative chores while critical executive items are delayed.',
  },
  {
    id: 'eva-sk-11',
    name: 'Time Management',
    code: 'TIME_MGMT',
    category: 'Executive Support',
    description: 'Estimating task duration accurately, meeting strict turnaround windows, and delivering under tight time constraints.',
    beginnerScope: 'Completing assignments within estimated minutes, tracking start and finish times.',
    intermediateScope: 'Managing multiple tasks within a 4-hour workday window without missing deadlines.',
    advancedScope: 'High-velocity turnaround during fast-breaking executive events with zero accuracy loss.',
    subSkills: ['Duration Estimation', 'SLA Adherence', 'Pacing Under Deadlines', 'Turnaround Discipline'],
    evaluationCriteria: ['Submission on or before deadline', 'Accurate turnaround tracking', 'Proactive communication if delayed'],
    remediationTrigger: 'Submitting deliverables past deadline without proactive notification.',
  },
  {
    id: 'eva-sk-12',
    name: 'Executive Judgement',
    code: 'EXEC_JUDGEMENT',
    category: 'Executive Support',
    description: 'Navigating incomplete briefs, making reasonable recommendations, asking targeted clarification questions instead of blind guessing.',
    beginnerScope: 'Recognizing when instructions are missing critical details, identifying assumptions.',
    intermediateScope: 'Formulating concise clarification questions (who, what, when, why) rather than guessing blindly.',
    advancedScope: 'Making sound autonomous decisions aligned with founder goals when the founder is unavailable.',
    subSkills: ['Ambiguity Navigation', 'Clarification Asking', 'Option Evaluation', 'Risk Assessment'],
    evaluationCriteria: ['Appropriate questions asked', 'No reckless guessing', 'Balanced recommendations with reasoning'],
    remediationTrigger: 'Blindly executing based on incomplete assumptions or asking trivial questions easily found in context.',
  },
  {
    id: 'eva-sk-13',
    name: 'Confidentiality and Professionalism',
    code: 'CONFIDENTIALITY',
    category: 'Executive Support',
    description: 'Safeguarding proprietary business information, investor data, executive communications, and maintaining emotional composure.',
    beginnerScope: 'Respecting company privacy, treating client data with discretion, professional demeanor.',
    intermediateScope: 'Redacting sensitive financial/personal numbers in public channels, handling NDA documentation.',
    advancedScope: 'Managing sensitive board and M&A discussions, upholding highest ethical and confidentiality standards.',
    subSkills: ['Data Privacy Protocols', 'NDA Handling', 'Discretion Under Pressure', 'Professional Boundaries'],
    evaluationCriteria: ['Zero unauthorized data exposure', 'Secure document handling', 'Calm professional composure'],
    remediationTrigger: 'Leaking internal notes, sharing sensitive documents carelessly, or unprofessional reactions.',
  },
  {
    id: 'eva-sk-14',
    name: 'Multi-task Management',
    code: 'MULTITASK_MGMT',
    category: 'Executive Support',
    description: 'Managing concurrent task queues, context-switching between administrative, research, and communication tasks without errors.',
    beginnerScope: 'Handling a 2-part deliverable without omitting required files.',
    intermediateScope: 'Juggling calendar updates, email responses, and research tasks simultaneously.',
    advancedScope: 'Simultaneous multi-threaded executive management with strict deadlines and competing priorities.',
    subSkills: ['Context Switching', 'Multi-Deliverable Tracking', 'Checklist Discipline', 'Cross-Functional Execution'],
    evaluationCriteria: ['All deliverable parts submitted', 'Consistent quality across all components', 'Clean status tracking'],
    remediationTrigger: 'Forgetting sub-deliverables or dropping quality on secondary tasks.',
  },
];

// Map skill list to CompetencyMetric for state management
export const getInitialExecutiveVaCompetencies = (): CompetencyMetric[] => {
  return EXECUTIVE_VA_SKILLS.map((skill) => ({
    id: skill.id,
    name: skill.name,
    category: 'Executive Support',
    score: 85,
    level: 'Developing',
    description: skill.description,
    keySkills: skill.subSkills,
    trend: '+0%',
  }));
};

// ------------------------------------------------------------------------------
// 2. THE 14-DAY PROGRESSION ARCHITECTURE (5 PHASES)
// ------------------------------------------------------------------------------
export interface ExecutiveProgressionPhase {
  phaseId: number;
  name: string;
  daysRange: string;
  startDay: number;
  endDay: number;
  competencyTier: 'Beginner' | 'Foundational Execution' | 'Independent Execution' | 'Multi-Skill & Judgement' | 'Mini Professional Simulation';
  theme: string;
  description: string;
  primarySkills: string[];
  instructionCompleteness: 'Complete' | 'Guided' | 'Incomplete (Requires Clarification)' | 'Complex Multi-Threaded';
}

export const EXECUTIVE_14_DAY_PHASES: ExecutiveProgressionPhase[] = [
  {
    phaseId: 1,
    name: 'Phase 1 — Foundation',
    daysRange: 'Days 1–3',
    startDay: 1,
    endDay: 3,
    competencyTier: 'Beginner',
    theme: 'Founder Onboarding, Communication Rules & Tool Setup',
    description: 'Understand the founder, business model, working hours, communication preferences, tools, and basic meeting/calendar hygiene.',
    primarySkills: ['Meeting Coordination', 'Calendar Management', 'Document and Information Organization', 'Communication'],
    instructionCompleteness: 'Complete',
  },
  {
    phaseId: 2,
    name: 'Phase 2 — Foundational Execution',
    daysRange: 'Days 4–7',
    startDay: 4,
    endDay: 7,
    competencyTier: 'Foundational Execution',
    theme: 'Core VA Responsibilities Without Step-by-Step Hand-Holding',
    description: 'Realistic administrative execution: email triage, calendar deconfliction, market/business research, travel options, and pre-meeting briefing notes.',
    primarySkills: ['Email Management', 'Calendar Management', 'Research', 'Travel Planning', 'Administrative Support', 'Time Management'],
    instructionCompleteness: 'Guided',
  },
  {
    phaseId: 3,
    name: 'Phase 3 — Independent Execution',
    daysRange: 'Days 8–10',
    startDay: 8,
    endDay: 10,
    competencyTier: 'Independent Execution',
    theme: 'Incomplete Instructions, Clarification Skills & Multi-Skill Synergy',
    description: 'The founder gives concise, incomplete instructions ("Sort out my meeting with David", "Organize my trip next week"). Student must ask targeted questions rather than guessing.',
    primarySkills: ['Executive Judgement', 'Communication', 'Meeting Coordination', 'Travel Planning', 'Prioritization'],
    instructionCompleteness: 'Incomplete (Requires Clarification)',
  },
  {
    phaseId: 4,
    name: 'Phase 4 — Multi-Skill & Judgement Tasks',
    daysRange: 'Days 11–12',
    startDay: 11,
    endDay: 12,
    competencyTier: 'Multi-Skill & Judgement',
    theme: 'Competing Deadlines, Priority Ranking & Integrated Workflows',
    description: 'Combined high-stakes tasks: travel logistics combined with calendar deconfliction, email triage combined with urgent research, making executive recommendations.',
    primarySkills: ['Prioritization', 'Executive Judgement', 'Multi-task Management', 'Calendar Management', 'Research'],
    instructionCompleteness: 'Complex Multi-Threaded',
  },
  {
    phaseId: 5,
    name: 'Phase 5 — Mini Professional Simulation',
    daysRange: 'Days 13–14',
    startDay: 13,
    endDay: 14,
    competencyTier: 'Mini Professional Simulation',
    theme: 'Autonomous Executive Support & Final 14-Day Practical Assessment',
    description: 'The founder treats the VA as a trusted partner. Multiple related responsibilities with realistic turnaround. Evaluates Accuracy, Communication, Judgement, Initiative, Client Handling, and all 14 skills.',
    primarySkills: ['Multi-task Management', 'Confidentiality and Professionalism', 'Executive Judgement', 'Communication', 'Time Management'],
    instructionCompleteness: 'Complex Multi-Threaded',
  },
];

// ------------------------------------------------------------------------------
// 3. INDUSTRY-ADAPTIVE BUSINESS CONTEXT GENERATOR
// ------------------------------------------------------------------------------
export interface IndustryBusinessContext {
  industryId: string;
  industryName: string;
  typicalStakeholders: { role: string; name: string; email: string }[];
  typicalVendors: string[];
  typicalTravelDestinations: { city: string; purpose: string }[];
  typicalResearchTopics: string[];
  typicalUrgentScenarios: string[];
}

export const INDUSTRY_CONTEXTS: Record<string, IndustryBusinessContext> = {
  b2b_saas: {
    industryId: 'b2b_saas',
    industryName: 'B2B SaaS & Tech',
    typicalStakeholders: [
      { role: 'VP of Engineering', name: 'David Chen', email: 'david@company.com' },
      { role: 'Lead Investor (Sequoia)', name: 'Marcus Sterling', email: 'msterling@sequoiacap.com' },
      { role: 'Head of Sales', name: 'Rachel Adams', email: 'rachel@company.com' },
      { role: 'Legal Counsel', name: 'Jonathan Pierce', email: 'jpierce@piercelegal.com' },
    ],
    typicalVendors: ['AWS Cloud Services', 'Notion Enterprise', 'Gong.io', 'Zoom Pro'],
    typicalTravelDestinations: [
      { city: 'San Francisco (SFO)', purpose: 'SaaS Growth Summit & Tier-1 VC Partner Meeting' },
      { city: 'London (LHR)', purpose: 'European Enterprise Client Roadshow' },
    ],
    typicalResearchTopics: [
      'Competitor feature breakdown of AI workflow integrations',
      'Top 5 enterprise CRM vendor pricing and compliance comparison',
      'Benchmark report on executive compensation in Series B SaaS',
    ],
    typicalUrgentScenarios: [
      'Board term-sheet review overlapping with crucial engineering sprint demo',
      'Production server incident during executive quarterly business review',
    ],
  },
  ecommerce_beauty: {
    industryId: 'ecommerce_beauty',
    industryName: 'E-Commerce & Clean Beauty',
    typicalStakeholders: [
      { role: 'Director of Supply Chain', name: 'Elena Rostova', email: 'elena@company.com' },
      { role: 'Lead Chemist & Formulation Partner', name: 'Dr. David Morales', email: 'dmorales@purelabs.com' },
      { role: 'Head of Brand Marketing', name: 'Chloe Laurent', email: 'chloe@company.com' },
      { role: 'Retail Account Manager (Sephora)', name: 'Amanda Vance', email: 'avance@sephora.com' },
    ],
    typicalVendors: ['EcoPackaging Co.', 'Shopify Plus Partner', 'Gorgias Helpdesk', 'DHL Express Global'],
    typicalTravelDestinations: [
      { city: 'Paris (CDG)', purpose: 'Global Clean Cosmetics Expo & Supplier Audit' },
      { city: 'New York (JFK)', purpose: 'Sephora Retail Buyers Pitch & Media Preview' },
    ],
    typicalResearchTopics: [
      'Sustainable packaging supplier cost and minimum order quantity comparison',
      'Top 10 clean beauty micro-influencer engagement metrics audit',
      'Competitor summer sunscreen launch campaign analysis',
    ],
    typicalUrgentScenarios: [
      'Customs delay on organic serum ingredients threatening Q4 launch date',
      'Batch packaging discrepancy before major influencer seeding campaign',
    ],
  },
  fashion_apparel: {
    industryId: 'fashion_apparel',
    industryName: 'Fashion & Sustainable Apparel',
    typicalStakeholders: [
      { role: 'Lead Textile Designer', name: 'Maya Lin', email: 'maya@company.com' },
      { role: 'Production Facility Director', name: 'David Rossi', email: 'drossi@milanotextiles.it' },
      { role: 'PR Agency Director', name: 'Sienna Miller', email: 'sienna@hautecomm.com' },
      { role: 'Wholesale Buyer', name: 'Julian Vance', email: 'julian@nordstrom.com' },
    ],
    typicalVendors: ['Organic Cotton Collective', 'Shopify Plus', 'Klaviyo', 'FedEx Logistics'],
    typicalTravelDestinations: [
      { city: 'Milan (MXP)', purpose: 'Sustainable Textile Sourcing & Manufacturer Inspection' },
      { city: 'New York (LGA)', purpose: 'New York Fashion Week Showroom Presentation' },
    ],
    typicalResearchTopics: [
      'Organic linen and recycled wool suppliers in Portugal and Italy',
      'Competitor direct-to-consumer pricing structure for eco-outerwear',
      'High-conversion lookbook layout trends across sustainable fashion brands',
    ],
    typicalUrgentScenarios: [
      'Runway sample shipping delay 48 hours before celebrity photo shoot',
      'Double-booked showroom meeting with major department store buyers',
    ],
  },
  real_estate: {
    industryId: 'real_estate',
    industryName: 'Real Estate & Property',
    typicalStakeholders: [
      { role: 'Senior Acquisitions Partner', name: 'David Wright', email: 'david@company.com' },
      { role: 'Escrow Officer', name: 'Patricia Gomez', email: 'pgomez@firstam.com' },
      { role: 'Lead Architect', name: 'Liam Hughes', email: 'liam@hughesarch.com' },
      { role: 'Private Equity Investor', name: 'Arthur Pendelton', email: 'apendelton@crestviewpe.com' },
    ],
    typicalVendors: ['CoStar Commercial Data', 'DocuSign Real Estate', 'Matterport 3D', 'First American Title'],
    typicalTravelDestinations: [
      { city: 'Miami (MIA)', purpose: 'Waterfront Commercial Property Due Diligence & Closing' },
      { city: 'Dallas (DFW)', purpose: 'Multi-Family Development Land Acquisition Tour' },
    ],
    typicalResearchTopics: [
      'Commercial cap rates and zoning regulations in emerging metropolitan sub-markets',
      'Top 5 property management software systems for 500+ unit portfolios',
      'Comparative market analysis (CMA) for prime downtown commercial square footage',
    ],
    typicalUrgentScenarios: [
      'Escrow closing deadline conflict with overseas investor conference call',
      'Urgent zoning amendment hearing requiring executive testimony and packet',
    ],
  },
  luxury_travel: {
    industryId: 'luxury_travel',
    industryName: 'Luxury Travel & Hospitality',
    typicalStakeholders: [
      { role: 'Head of Concierge', name: 'Antoine Dubois', email: 'antoine@company.com' },
      { role: 'Private Aviation Charter Director', name: 'Captain David Scott', email: 'dscott@netjets.com' },
      { role: 'VIP Client Lead', name: 'Victoria Sterling', email: 'vsterling@apexholdings.com' },
      { role: 'Boutique Hotel General Manager', name: 'Matteo Bellini', email: 'mbellini@villadeste.it' },
    ],
    typicalVendors: ['TripIt Pro', 'Amadeus GDS', 'Virtuoso Luxury Network', 'Wheels Up Aviation'],
    typicalTravelDestinations: [
      { city: 'Zurich (ZRH)', purpose: 'Private Wealth Hospitality Summit & Alpine Resort Audit' },
      { city: 'Tokyo (HND)', purpose: 'Luxury Ryokan Partnership Onboarding & Michelin Tasting' },
    ],
    typicalResearchTopics: [
      'Private helicopter transfers and yacht charter safety records in the Mediterranean',
      'Exclusive buy-out retreat properties accommodating 30 executive guests in Europe',
      'Comparison of top corporate concierge booking platforms and margin structures',
    ],
    typicalUrgentScenarios: [
      'Cancelled private jet connection for ultra-high-net-worth client family',
      'Last-minute villa relocation due to unannounced construction noise',
    ],
  },
  digital_marketing: {
    industryId: 'digital_marketing',
    industryName: 'Digital Marketing & Creator Media',
    typicalStakeholders: [
      { role: 'Creative Director', name: 'David Kalu', email: 'david@company.com' },
      { role: 'Enterprise Client CMO', name: 'Samantha Reed', email: 'sreed@nexusbrand.com' },
      { role: 'Head of Media Buying', name: 'Alex Rivera', email: 'alex@company.com' },
      { role: 'Talent Agency Lead', name: 'Marcus Cole', email: 'mcole@wmeagency.com' },
    ],
    typicalVendors: ['Notion Enterprise', 'Monday.com', 'Slack Connect', 'Figma Pro'],
    typicalTravelDestinations: [
      { city: 'Austin (AUS)', purpose: 'SXSW Creator Media Keynote & Client Dinner' },
      { city: 'New York (JFK)', purpose: 'Quarterly CMO Executive Briefing & Retainer Renewal' },
    ],
    typicalResearchTopics: [
      'B2B podcast sponsorship ROI and pricing models across tech creators',
      'Top 10 creator marketing workflow automation tools for 50-person agency',
      'Agency benchmark pricing for multi-platform short-form video production',
    ],
    typicalUrgentScenarios: [
      'Client CMO threatening contract pause due to delayed quarterly reporting deck',
      'Double-booked key client pitch and live media webinar keynote',
    ],
  },
  consulting_advisory: {
    industryId: 'consulting_advisory',
    industryName: 'Consulting & Professional Services',
    typicalStakeholders: [
      { role: 'Senior Practice Partner', name: 'David Sterling', email: 'david@company.com' },
      { role: 'Client CEO (Fortune 500)', name: 'Eleanor Bennett', email: 'ebennett@globalcorp.com' },
      { role: 'Lead Financial Modeler', name: 'Vikram Patel', email: 'vpatel@company.com' },
      { role: 'Managing Partner', name: 'Jonathan Vance', email: 'jvance@vanguardstrategy.com' },
    ],
    typicalVendors: ['Gartner Research', 'DocuSign Enterprise', 'Google Workspace Enterprise', 'Zoom Phone'],
    typicalTravelDestinations: [
      { city: 'London (LHR)', purpose: 'Global Strategy Practice Steering Committee & Client QBR' },
      { city: 'Singapore (SIN)', purpose: 'Asia-Pacific Digital Transformation Client Launch' },
    ],
    typicalResearchTopics: [
      'Cross-border corporate restructuring frameworks and tax governance trends',
      'Executive dashboard benchmarks for Fortune 500 post-merger integration',
      'Top 5 advisory market research subscriptions and enterprise licensing models',
    ],
    typicalUrgentScenarios: [
      'Urgent M&A steering committee rescheduled with 2 hours notice across 3 continents',
      'Confidential client NDA and board deck requiring instant redacted delivery',
    ],
  },
};

// ------------------------------------------------------------------------------
// 4. DYNAMIC TASK GENERATION ENGINE FOR EXECUTIVE VA (DAYS 1–14+)
// ------------------------------------------------------------------------------

export function getIndustryContext(industryId: string): IndustryBusinessContext {
  return (
    INDUSTRY_CONTEXTS[industryId] ||
    INDUSTRY_CONTEXTS['b2b_saas'] ||
    Object.values(INDUSTRY_CONTEXTS)[0]
  );
}

export interface GenerateExecutiveTaskParams {
  dayNumber: number;
  client: ClientPersona;
  competencies?: CompetencyMetric[];
  previousTasks?: TaskItem[];
  previousSubmissions?: any[];
  identifiedWeaknesses?: string[];
  chatHistory?: any[];
  toolsKnown?: string[];
}

export function generateDynamicExecutiveVaTask(params: GenerateExecutiveTaskParams): TaskItem {
  const {
    dayNumber,
    client,
    competencies = [],
    previousTasks = [],
    identifiedWeaknesses = [],
  } = params;

  const industryId = client.industry?.toLowerCase().includes('beauty') || client.industry?.toLowerCase().includes('commerce')
    ? 'ecommerce_beauty'
    : client.industry?.toLowerCase().includes('fashion')
    ? 'fashion_apparel'
    : client.industry?.toLowerCase().includes('estate')
    ? 'real_estate'
    : client.industry?.toLowerCase().includes('travel')
    ? 'luxury_travel'
    : client.industry?.toLowerCase().includes('marketing') || client.industry?.toLowerCase().includes('creator')
    ? 'digital_marketing'
    : client.industry?.toLowerCase().includes('consult') || client.industry?.toLowerCase().includes('advisory')
    ? 'consulting_advisory'
    : 'b2b_saas';

  const context = getIndustryContext(industryId);
  const founderName = client.ceoName || 'Marcus Vance';
  const founderRole = client.ceoRole || 'Founder & CEO';
  const company = client.companyName || 'Apex Horizon Technologies';
  const timezone = client.timezone?.split(' ')[0] || 'EST';

  const s1 = context.typicalStakeholders[0];
  const s2 = context.typicalStakeholders[1];
  const s3 = context.typicalStakeholders[2];
  const dest1 = context.typicalTravelDestinations[0];
  const dest2 = context.typicalTravelDestinations[1] || dest1;
  const researchTopic = context.typicalResearchTopics[0];
  const researchTopic2 = context.typicalResearchTopics[1];

  // Determine if a weakness needs active remediation
  const hasCalendarWeakness = identifiedWeaknesses.some((w) => /calendar|timezone|buffer|overlap/i.test(w));
  const hasClarificationWeakness = identifiedWeaknesses.some((w) => /clarif|guess|incomplete|assumption/i.test(w));
  const hasResearchWeakness = identifiedWeaknesses.some((w) => /research|source|data|table/i.test(w));
  const hasEmailWeakness = identifiedWeaknesses.some((w) => /email|inbox|tone|categor/i.test(w));

  // ----------------------------------------------------------------------------
  // PHASE 1: DAYS 1–3 — FOUNDATION (Beginner)
  // ----------------------------------------------------------------------------
  if (dayNumber === 1) {
    return {
      id: `task-eva-day-1`,
      dayNumber: 1,
      phaseId: 1,
      title: `Day 1: Founder Onboarding, Calendar Hygiene & First Meeting Setup`,
      category: 'Calendar & Travel',
      priority: 'high',
      estimatedMinutes: 35,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Welcome to ${company}! Your first assignment is to establish operational rhythm with ${founderName}: 1. Review ${founderName}'s working hours (${client.workingHours || '08:00 AM - 05:00 PM ' + timezone}) and communication preferences. 2. Coordinate a 45-minute introductory alignment video meeting between ${founderName} and ${s1.name} (${s1.role}) for Thursday at 2:00 PM ${timezone}. 3. Ensure a 15-minute buffer before and after the call, generate a Zoom meeting link, and draft a structured agenda note.`,
      clientContext: `${founderName} (${founderRole}) message: "Welcome to the team! My schedule gets chaotic very quickly, so calendar hygiene and clear agendas are essential. Please set up the sync with ${s1.name} (${s1.email}), make sure there is a 15-minute buffer on my calendar so I am not jumping between calls without a breather, and send me a clean confirmation note."`,
      deliverables: [
        { id: 'del-eva-1-1', label: `Calendar Invite Details & Meeting Agenda for ${s1.name}`, type: 'calendar_invite', required: true },
        { id: 'del-eva-1-2', label: 'Executive Working Preferences & Onboarding Acknowledgement Note', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 2) {
    return {
      id: `task-eva-day-2`,
      dayNumber: 2,
      phaseId: 1,
      title: `Day 2: Executive Calendar Deconfliction & Weekly Time Blocking`,
      category: 'Calendar & Travel',
      priority: 'urgent',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${founderName} has a direct calendar conflict on Friday at 11:00 AM ${timezone}: an urgent meeting with ${s2.name} (${s2.role}) clashes with an internal 1-on-1 with ${s1.name}. ${founderName} cannot reschedule ${s2.name}. 1. Propose a new Friday morning slot for ${s1.name} before 10:30 AM ${timezone}. 2. Draft a polite, professional rescheduling email to ${s1.name} explaining the change with context. 3. Structure ${founderName}'s Friday afternoon with protected Focus Time blocks and 15-min buffers.`,
      clientContext: `${founderName} message: "I cannot move the call with ${s2.name} under any circumstances. Please deconflict my calendar, reschedule ${s1.name} gracefully with options, and block out 2 hours of protected focus time for me on Friday afternoon."`,
      deliverables: [
        { id: 'del-eva-2-1', label: `Drafted Rescheduling Email to ${s1.name}`, type: 'email_draft', required: true },
        { id: 'del-eva-2-2', label: 'Updated Friday Time-Blocked Calendar Schedule', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 3) {
    return {
      id: `task-eva-day-3`,
      dayNumber: 3,
      phaseId: 1,
      title: `Day 3: Executive Knowledge Repository & Contact Directory Organization`,
      category: 'Operations & CRM',
      priority: 'medium',
      estimatedMinutes: 35,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `${founderName}'s key operational files, stakeholder contacts, and vendor details are disorganized across notes and chats. Build a structured Master Executive Knowledge Repository (Notion/Doc layout) for ${company}: 1. Organize a VIP stakeholder contact directory with roles, emails, and notes. 2. Define a clean 4-tier Google Drive folder taxonomy (Executive, Finance, Stakeholders, Operations). 3. Document ${founderName}'s core operating rules for future reference.`,
      clientContext: `${founderName} message: "I spend too much time hunting for contact emails and file links. Please set up a clean, structured master reference directory so everything we need is accessible in one click."`,
      deliverables: [
        { id: 'del-eva-3-1', label: `Master Executive Directory & VIP Contact Matrix for ${company}`, type: 'document', required: true },
        { id: 'del-eva-3-2', label: 'Company Digital Folder Taxonomy & Access Architecture', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 2: DAYS 4–7 — FOUNDATIONAL EXECUTION (Beginner → Early Intermediate)
  // ----------------------------------------------------------------------------
  if (dayNumber === 4) {
    return {
      id: `task-eva-day-4`,
      dayNumber: 4,
      phaseId: 2,
      title: `Day 4: Executive Inbox Triage & 4-Bucket Priority Action Matrix`,
      category: 'Inbox Management',
      priority: 'high',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${founderName} has 12 unread emails that piled up during a morning workshop. Triage all 12 into 4 distinct priority buckets: [1] Action Required (Urgent & Important), [2] Delegated / Forwarded, [3] FYI / Read Later, [4] Archive / Spam. Draft an executive response on ${founderName}'s behalf to an urgent inquiry from ${s2.name} requesting financial projections for ${company}.`,
      clientContext: `${founderName} message: "My inbox is overflowing. Categorize these 12 emails by priority and draft a concise, executive-level response for ${s2.name} letting them know I am reviewing the numbers and will provide the full breakdown by end of week."`,
      deliverables: [
        { id: 'del-eva-4-1', label: '12-Email Priority Categorization Matrix & Action Plan', type: 'spreadsheet', required: true },
        { id: 'del-eva-4-2', label: `Drafted Response on Behalf of ${founderName} to ${s2.name}`, type: 'email_draft', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 5) {
    return {
      id: `task-eva-day-5`,
      dayNumber: 5,
      phaseId: 2,
      title: `Day 5: Industry Market Intelligence & Competitor Benchmark Research`,
      category: 'Research & Synthesis',
      priority: 'medium',
      estimatedMinutes: 45,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `${founderName} is preparing for a quarterly strategy sync and requires research on: "${researchTopic}". 1. Identify 3 leading market solutions/competitors in the ${context.industryName} space. 2. Build a structured feature and pricing comparison matrix. 3. Synthesize the findings into a 1-page executive summary with 3 actionable recommendations for ${company}.`,
      clientContext: `${founderName} message: "I need verified data, not generic buzzwords. Compare the top 3 options, highlight the pros/cons for our business stage, and give me a clear bottom-line recommendation."`,
      deliverables: [
        { id: 'del-eva-5-1', label: '3-Competitor Feature & Pricing Benchmark Matrix', type: 'spreadsheet', required: true },
        { id: 'del-eva-5-2', label: 'Executive Research Dossier with Strategic Recommendations', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 6) {
    return {
      id: `task-eva-day-6`,
      dayNumber: 6,
      phaseId: 2,
      title: `Day 6: Executive Business Travel Planning & Multi-Option Logistics`,
      category: 'Calendar & Travel',
      priority: 'high',
      estimatedMinutes: 40,
      deadlineHours: 5,
      deadlineType: 'soft',
      brief: `${founderName} is traveling to ${dest1.city} for "${dest1.purpose}". 1. Research 3 flight options adhering to preferences (morning departure, minimum 90-minute layover if connecting, aisle seat). 2. Find 2 executive boutique hotels within 15 minutes of the venue with flexible cancellation and high-speed Wi-Fi. 3. Map out airport ground transfer options and build a preliminary door-to-door itinerary table.`,
      clientContext: `${founderName} message: "I hate tight airport connections and noisy hotel rooms. Compare 3 flight routings and 2 hotel options close to the venue, and calculate total estimated travel costs."`,
      deliverables: [
        { id: 'del-eva-6-1', label: `Flight & Hotel Comparison Matrix for ${dest1.city} Trip`, type: 'spreadsheet', required: true },
        { id: 'del-eva-6-2', label: 'Preliminary Door-to-Door Travel Itinerary & Expense Summary', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 7) {
    return {
      id: `task-eva-day-7`,
      dayNumber: 7,
      phaseId: 2,
      title: `Day 7: C-Suite Meeting Preparation & 1-Page Pre-Call Briefing Dossier`,
      category: 'Operations & CRM',
      priority: 'high',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `By Day 7, you are expected to operate independently. ${founderName} has a critical 1-hour strategic meeting on Monday morning with ${s3.name} (${s3.role}). Without needing step-by-step guidance: 1. Research ${s3.name}'s professional background and company relationship history. 2. Formulate a structured 5-point meeting agenda with time allocations. 3. Prepare a 1-page pre-call executive briefing dossier including talking points, potential objections, and desired outcomes.`,
      clientContext: `${founderName} message: "This meeting with ${s3.name} is pivotal for our next quarter. Prepare my 1-page executive brief, agenda, and key talking points so I can walk in 100% prepared."`,
      deliverables: [
        { id: 'del-eva-7-1', label: `1-Page Pre-Meeting Executive Briefing Dossier on ${s3.name}`, type: 'document', required: true },
        { id: 'del-eva-7-2', label: 'Time-Allocated Meeting Agenda & Strategic Talking Points', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 3: DAYS 8–10 — INDEPENDENT EXECUTION (Incomplete Instructions)
  // ----------------------------------------------------------------------------
  if (dayNumber === 8) {
    return {
      id: `task-eva-day-8`,
      dayNumber: 8,
      phaseId: 3,
      title: `Day 8: Incomplete Founder Instruction — Meeting Clarification & Booking`,
      category: 'Client Communications',
      priority: 'urgent',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${founderName} sent a brief, incomplete Slack message: "Can you sort out my meeting with David?" The company has multiple Davids and no date/duration was specified. 1. Identify all missing information. 2. Formulate a polite, precise clarification message (via client chat / notes) asking for the specific David, duration, target dates, and meeting objective. 3. Once clarified (or in deliverable), book the meeting, resolve any schedule overlap, and prepare the calendar invitation with a video link.`,
      clientContext: `${founderName} message: "Can you sort out my meeting with David?" (Note: Message ${founderName} in chat if you need clarification on which David, duration, or timing!)`,
      deliverables: [
        { id: 'del-eva-8-1', label: 'Targeted Clarification Message & Information Checklist', type: 'text', required: true },
        { id: 'del-eva-8-2', label: 'Complete Calendar Booking, Deconfliction & Agenda Confirmation', type: 'calendar_invite', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 9) {
    return {
      id: `task-eva-day-9`,
      dayNumber: 9,
      phaseId: 3,
      title: `Day 9: Ambiguous Travel Request — Clarification & Multi-City Itinerary`,
      category: 'Calendar & Travel',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 5,
      deadlineType: 'soft',
      brief: `${founderName} sent a casual message: "Please help me organize my trip next week to ${dest2.city}." Details like travel dates, departure time preferences, hotel location, and ground transit needs were omitted. 1. Ask targeted clarification questions rather than guessing blindly. 2. Construct a comprehensive 3-day door-to-door itinerary including flight options, hotel booking with flexible check-in, ground transfers, and meeting buffers.`,
      clientContext: `${founderName} message: "Please help me organize my trip next week to ${dest2.city}. Need flight options and somewhere good to stay near the meetings."`,
      deliverables: [
        { id: 'del-eva-9-1', label: 'Executive Travel Clarification & Preference Query Log', type: 'text', required: true },
        { id: 'del-eva-9-2', label: `Master 3-Day Door-to-Door Travel Itinerary for ${dest2.city}`, type: 'document', required: true },
        { id: 'del-eva-9-3', label: 'Travel Expense & Booking Verification Table', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 10) {
    return {
      id: `task-eva-day-10`,
      dayNumber: 10,
      phaseId: 3,
      title: `Day 10: Multi-Request Administrative Triage with Incomplete Details`,
      category: 'Operations & CRM',
      priority: 'urgent',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${founderName} sent a rapid voice-note summary with 3 incomplete requests: 1. "Find some options for this vendor software we discussed." 2. "Follow up with ${s2.name} regarding the contract signature." 3. "Reschedule my Thursday lunch to next week." You must determine the order of priority, ask targeted clarification where required, draft the vendor comparison, and write the outreach email.`,
      clientContext: `${founderName} message: "Need some options for this software tool we discussed, follow up with ${s2.name} about the contract, and move my Thursday lunch. Prioritize what needs attention first and give me an update."`,
      deliverables: [
        { id: 'del-eva-10-1', label: '3-Task Priority Ranking & Execution Strategy Note', type: 'text', required: true },
        { id: 'del-eva-10-2', label: `Vendor Software Comparison Matrix (${researchTopic2 || 'Operations'})`, type: 'spreadsheet', required: true },
        { id: 'del-eva-10-3', label: `Contract Follow-Up Email Draft to ${s2.name}`, type: 'email_draft', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 4: DAYS 11–12 — MULTI-SKILL & JUDGEMENT TASKS (Intermediate → Advanced)
  // ----------------------------------------------------------------------------
  if (dayNumber === 11) {
    return {
      id: `task-eva-day-11`,
      dayNumber: 11,
      phaseId: 4,
      title: `Day 11: Multi-Skill Task — Executive Travel Combined with Calendar Deconfliction`,
      category: 'Calendar & Travel',
      priority: 'urgent',
      estimatedMinutes: 50,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${founderName} must fly to ${dest1.city} next Tuesday on short notice for an emergency partner summit. The travel window directly clashes with 3 existing commitments on Tuesday afternoon: a team sprint retro, a 1-on-1 with ${s1.name}, and an introductory investor call with ${s3.name}. 1. Build the door-to-door flight & transfer schedule. 2. Deconflict all 3 meetings by finding optimal reschedule slots later in the week. 3. Draft customized, empathetic rescheduling emails for all 3 affected parties.`,
      clientContext: `${founderName} message: "I have to be in ${dest1.city} on Tuesday. Reschedule my existing Tuesday calls with care—especially ${s3.name}, who is a VIP. Send me the updated calendar and travel master plan."`,
      deliverables: [
        { id: 'del-eva-11-1', label: 'Master Travel Itinerary with Flight & Ground Transit Links', type: 'document', required: true },
        { id: 'del-eva-11-2', label: `3-Part Tailored Rescheduling Email Bank (${s1.name}, ${s3.name}, Team)`, type: 'email_draft', required: true },
        { id: 'del-eva-11-3', label: 'Deconflicted Weekly Master Calendar Schedule', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 12) {
    return {
      id: `task-eva-day-12`,
      dayNumber: 12,
      phaseId: 4,
      title: `Day 12: Multi-Skill Task — Email Prioritization Combined with Urgent Research & Competing Deadlines`,
      category: 'Research & Synthesis',
      priority: 'urgent',
      estimatedMinutes: 50,
      deadlineHours: 3,
      deadlineType: 'hard',
      brief: `${founderName} is in an all-day offsite meeting with limited connectivity. 6 high-stakes emails arrive simultaneously: a vendor contract renewal with a 24-hour price lock deadline, a board inquiry from ${s2.name}, a VIP partnership pitch, and 3 internal operational blockers. 1. Apply the Eisenhower Matrix to rank the incoming queue. 2. Conduct rapid benchmark research on the vendor pricing to determine if ${company} is overpaying. 3. Draft executive responses and send a concise midday briefing to ${founderName}.`,
      clientContext: `${founderName} message: "I am in workshops until 4:00 PM. Triage the incoming queue, check if the vendor price increase is reasonable, and send me a prioritized summary so I only need to make quick yes/no decisions."`,
      deliverables: [
        { id: 'del-eva-12-1', label: 'Eisenhower Priority Matrix & Queue Triage Log', type: 'spreadsheet', required: true },
        { id: 'del-eva-12-2', label: 'Vendor Pricing Benchmark & Cost-Saving Recommendation Brief', type: 'document', required: true },
        { id: 'del-eva-12-3', label: `Midday Executive Briefing Memo & Drafted Response to ${s2.name}`, type: 'email_draft', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 5: DAYS 13–14 — MINI PROFESSIONAL SIMULATION (Advanced Professional)
  // ----------------------------------------------------------------------------
  if (dayNumber === 13) {
    return {
      id: `task-eva-day-13`,
      dayNumber: 13,
      phaseId: 5,
      title: `Day 13: High-Pressure Executive Operations & Confidential Stakeholder Liaison`,
      category: 'Operations & CRM',
      priority: 'urgent',
      estimatedMinutes: 55,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${founderName} now treats you as a trusted executive support partner. An urgent operational pivot occurred: an executive board meeting has been moved up by 48 hours. 1. Coordinate calendar availability across 4 executive stakeholders (${s1.name}, ${s2.name}, ${s3.name}, and Legal). 2. Collect and organize 4 confidential board deck slide contributions into a master folder with restricted access. 3. Draft a polished, high-discretion board memo communicating the updated schedule and agenda.`,
      clientContext: `${founderName} message: "The board meeting has been moved up to Thursday morning. This is high-stakes and confidential. Align all stakeholder schedules, assemble the board presentation packet, and draft the executive memo for my signature."`,
      deliverables: [
        { id: 'del-eva-13-1', label: 'Multi-Stakeholder Board Deconfliction & Availability Matrix', type: 'spreadsheet', required: true },
        { id: 'del-eva-13-2', label: `Confidential Board Rescheduling Memo & Meeting Packet on Behalf of ${founderName}`, type: 'email_draft', required: true },
        { id: 'del-eva-13-3', label: 'Restricted Document Access Architecture & Meeting Briefing Note', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // Day 14: Capstone Mini Professional Simulation
  return {
    id: `task-eva-day-14`,
    dayNumber: 14,
    phaseId: 5,
    title: `Day 14: Final 14-Day Practical Capstone — Full-Spectrum Executive VA Simulation`,
    category: 'Operations & CRM',
    priority: 'urgent',
    estimatedMinutes: 60,
    deadlineHours: 4,
    deadlineType: 'hard',
    brief: `Your 14-day Executive VA milestone practical evaluation. Demonstrate mastery across all 14 Executive VA competencies and 5 Universal Evaluation Dimensions (Accuracy, Communication, Judgement, Initiative, Client Handling): 1. Executive Inbox Zero Triage of 8 complex operational messages. 2. End-to-End Master Travel & Multi-Timezone Calendar Schedule for ${founderName}'s upcoming roadshow. 3. Strategic Competitor & Vendor Intelligence Dossier with Executive Recommendations for ${company}. 4. Comprehensive Daily Executive Briefing & Action Item Handover Memo.`,
    clientContext: `${founderName} (${founderRole}) message: "You have become an indispensable part of my executive support team over these two weeks. This is your comprehensive practical assessment. Handle this full-spectrum operational package with your highest standard of precision, discretion, and executive communication."`,
    deliverables: [
      { id: 'del-eva-14-1', label: 'Master Daily Executive Briefing & 8-Email Triage Action Log', type: 'document', required: true },
      { id: 'del-eva-14-2', label: 'End-to-End Multi-City Travel Itinerary & Time-Blocked Calendar Matrix', type: 'spreadsheet', required: true },
      { id: 'del-eva-14-3', label: `Strategic Market Intelligence Dossier & Executive Recommendations for ${company}`, type: 'document', required: true },
      { id: 'del-eva-14-4', label: `VIP Stakeholder Communication Suite (Drafted on Behalf of ${founderName})`, type: 'email_draft', required: true },
    ],
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}


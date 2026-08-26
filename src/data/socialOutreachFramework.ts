// ==============================================================================
// CoreGuide VA Simulator - Social Marketing & Cold Outreach VA 14-Day Framework
// Complete End-to-End Pipeline: Founder Offer to Discovery Call Handoff
// Workflow: Offer → ICP → Prospect Research → Qualification → Personalization → Outreach → Response → Follow-up → Qualification → Handoff
// ==============================================================================

import { TaskItem, ClientPersona, CompetencyMetric } from '../types';

export interface DynamicOutreachContext {
  companyName: string;
  founderName: string;
  founderRole: string;
  industry: string;
  businessSize: string;
  offer: string;
  targetMarket: string;
  targetTitles: string[];
  targetGeography: string;
  targetCompanySize: string;
  primaryChannel: string;
  secondaryChannel: string;
  dealSize: string;
  corePainPoint: string;
  qualificationCriteria: string[];
  disqualificationRules: string[];
  buyingSignals: string[];
  bookingLink: string;
  outboundDomain: string;
  crmPlatform: string;
  campaignObjective: string;
}

/**
 * Dynamically resolves real, context-grounded outreach parameters from the active client persona.
 * Never relies on universal hardcoded business facts.
 */
export function getDynamicOutreachContext(client: ClientPersona): DynamicOutreachContext {
  const companyName = client.companyName || 'GrowthCatalyst Media';
  const founderName = client.ceoName || 'Claire Montgomery';
  const founderRole = client.ceoRole || 'VP of Growth & Partnerships';
  const industry = client.industry || 'Digital Marketing & Creator Media';
  const businessSize = client.businessSize || 'Growth Stage';
  const timezone = client.timezone || 'EST';
  const indLower = industry.toLowerCase();

  let targetGeography = 'North America (US & Canada)';
  if (timezone.includes('GMT') || timezone.includes('UTC+0') || timezone.includes('London') || timezone.includes('UK')) {
    targetGeography = 'UK & Western Europe';
  } else if (timezone.includes('AEST') || timezone.includes('SGT') || timezone.includes('Singapore') || timezone.includes('Australia')) {
    targetGeography = 'APAC (Australia & Singapore)';
  }

  if (indLower.includes('saas') || indLower.includes('tech') || indLower.includes('software')) {
    return {
      companyName,
      founderName,
      founderRole,
      industry,
      businessSize,
      offer: 'AI-assisted customer support & workflow automation reducing resolution times by 65%',
      targetMarket: 'Scaling B2B SaaS & Tech companies with active support operations',
      targetTitles: ['VP Customer Success', 'Chief Operating Officer (COO)', 'Head of Support', 'VP Operations'],
      targetGeography,
      targetCompanySize: '40–200 employees ($8M–$30M ARR)',
      primaryChannel: 'Targeted Cold Email',
      secondaryChannel: 'LinkedIn InMail',
      dealSize: '$15,000 – $40,000 ARR',
      corePainPoint: 'High support agent churn, slow ticket response times during peak surges, and rising support headcount costs',
      qualificationCriteria: [
        'Headcount between 40 and 200 employees with dedicated customer support teams',
        'Headquartered in the target geographic market',
        'Direct budget authority (VP Customer Success, COO, or VP Operations)',
        'Active hiring for customer success or support roles in the last 90 days',
      ],
      disqualificationRules: [
        'Pre-seed or seed-stage startups with fewer than 15 employees',
        'Companies with in-house proprietary automation engineering teams',
        'Consultants, agencies, or outsourced staffing providers',
      ],
      buyingSignals: [
        'Recent Series A/B funding announcement',
        'Active job postings for Support Engineers or CS Managers',
        'Recent executive transition (new VP Customer Success appointed)',
        'Public user complaints regarding customer support latency on G2/Trustpilot',
      ],
      bookingLink: `${founderName.toLowerCase().split(' ')[0]}.${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.io/demo`,
      outboundDomain: `@outbound.${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.io`,
      crmPlatform: 'HubSpot / Apollo',
      campaignObjective: '15 qualified product demonstrations per month',
    };
  }

  if (indLower.includes('consult') || indLower.includes('advisory') || indLower.includes('professional')) {
    return {
      companyName,
      founderName,
      founderRole,
      industry,
      businessSize,
      offer: 'Fractional RevOps & Systems Architecture removing executive bottlenecks for scaling partnerships',
      targetMarket: 'Independent management consulting practices and boutique corporate advisory firms',
      targetTitles: ['Managing Partner', 'Founder & CEO', 'Senior Partner', 'Head of Advisory Practice'],
      targetGeography,
      targetCompanySize: '15–80 fee-earning consultants ($5M–$25M revenue)',
      primaryChannel: 'LinkedIn Executive Messaging',
      secondaryChannel: 'Executive Cold Email',
      dealSize: '$7,500/month ongoing advisory retainer',
      corePainPoint: 'Founders trapped in daily billable delivery, lack of standard operational SOPs, and inconsistent client onboarding pipelines',
      qualificationCriteria: [
        'Firm headcount of 15 to 80 professionals',
        'Active commercial advisory practice in target geography',
        'Direct Managing Partner or Founder decision-maker',
        'Expressed operational scaling challenges or hiring new associates',
      ],
      disqualificationRules: [
        'Solo freelance practitioners with no team',
        'Massive enterprise consultancies (e.g. Big 4) with centralized corporate procurement',
        'Non-profit organizations without budget authority',
      ],
      buyingSignals: [
        'Managing Partner posting on LinkedIn regarding practice growth or capacity constraints',
        'Firm opening a new regional practice group or office',
        'Merger or strategic partnership announcement',
      ],
      bookingLink: `${founderName.toLowerCase().split(' ')[0]}.${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/intro-advisory`,
      outboundDomain: `@advisory.${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      crmPlatform: 'HubSpot CRM',
      campaignObjective: '10 partner-level introductory discovery calls per month',
    };
  }

  return {
    companyName,
    founderName,
    founderRole,
    industry,
    businessSize,
    offer: 'Paid social customer acquisition & creative testing engine delivering guaranteed 3x ROAS for scaling brands',
    targetMarket: 'Direct-to-Consumer (DTC) and scaling consumer tech brands with active ad spend',
    targetTitles: ['Chief Marketing Officer (CMO)', 'VP of Growth', 'Head of Performance Marketing', 'Founder & CEO'],
    targetGeography,
    targetCompanySize: '20–120 employees ($4M–$25M annual revenue)',
    primaryChannel: 'LinkedIn Outreach',
    secondaryChannel: 'Personalized Cold Email',
    dealSize: '$4,500 – $9,000/month retainer + performance incentive',
    corePainPoint: 'Rising customer acquisition costs (CAC), ad creative fatigue on Meta and TikTok, and unpredictable revenue growth',
    qualificationCriteria: [
      'Active brand in target geography with minimum estimated annual revenue of $3M',
      'Spending at least $15,000/month on digital advertising channels',
      'Direct decision-maker with marketing budget authority (CMO, VP Growth, or Founder)',
      'Product or service with strong gross margins (>50%) able to support paid acquisition',
    ],
    disqualificationRules: [
      'Early-stage ideas or pre-launch businesses with zero existing product-market fit',
      'Brands spending less than $5,000/month on ads with no acquisition budget',
      'Non-decision-makers with no authority over agency/vendor retainers',
    ],
    buyingSignals: [
      'Active job postings for Performance Marketer, Media Buyer, or Growth Lead',
      'Noticeable scaling of ad library impressions across Meta and TikTok in last 30 days',
      'New CMO or VP Growth executive appointment announced in last 6 months',
      'Recent growth capital or private equity backing',
    ],
    bookingLink: `${founderName.toLowerCase().split(' ')[0]}.${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.io/intro-call`,
    outboundDomain: `@growth.${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.io`,
    crmPlatform: 'HubSpot CRM',
    campaignObjective: '15 qualified growth discovery calls per month',
  };
}

export interface GenerateOutreachTaskParams {
  dayNumber: number;
  client: ClientPersona;
  competencies?: CompetencyMetric[];
  previousTasks?: TaskItem[];
  previousSubmissions?: any[];
  identifiedWeaknesses?: string[];
  chatHistory?: any[];
}

export function generateSocialOutreachTask(params: GenerateOutreachTaskParams): TaskItem {
  const { dayNumber, client, identifiedWeaknesses = [] } = params;
  const ctx = getDynamicOutreachContext(client);

  const hasCopyWeakness = identifiedWeaknesses.some((w) => /copy|pitch|spam|cta|length|word count/i.test(w));
  const hasObjectionWeakness = identifiedWeaknesses.some((w) => /object|compet|pricing|rejection/i.test(w));
  const hasQualificationWeakness = identifiedWeaknesses.some((w) => /qualif|icp|filter|disqualif|target/i.test(w));
  const hasPersonalizationWeakness = identifiedWeaknesses.some((w) => /personaliz|icebreaker|flatter|generic/i.test(w));

  // ----------------------------------------------------------------------------
  // PHASE 1: DAYS 1–3 — FOUNDATION (OFFER, ICP & QUALIFICATION STANDARDS)
  // ----------------------------------------------------------------------------
  if (dayNumber === 1) {
    return {
      id: 'task-so-day-1',
      dayNumber: 1,
      phaseId: 1,
      title: 'Day 1: Founder Core Offer Analysis & Value Proposition Breakdown',
      category: 'Research & Synthesis',
      priority: 'high',
      estimatedMinutes: 35,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Welcome to ${ctx.companyName}'s outbound business development team! Your first assignment is mastering our core commercial offer: "${ctx.offer}".
1. Review the client's offer and break down the primary business transformation we deliver for ${ctx.targetMarket}.
2. Identify the top 3 alternative solutions our prospective buyers currently rely on (e.g. in-house team, doing nothing, competing agencies/software) and define what makes our approach superior.
3. Formulate an executive elevator pitch (under 50 words) that captures our value proposition with zero sales fluff.
4. Prepare 2 strategic clarification questions to ask ${ctx.founderName} in Client Chat regarding our competitive positioning and commercial goals.`,
      clientContext: `${ctx.founderName} note: "Before you draft a single outreach message or build a list, you must deeply understand what we sell and why executives buy from us. Message me in chat if you have any questions about our offer or target market before submitting."`,
      deliverables: [
        { id: 'del-so-1-1', label: `Core Offer Breakdown & Value Proposition Analysis for ${ctx.companyName}`, type: 'document', required: true },
        { id: 'del-so-1-2', label: '50-Word Executive Elevator Pitch & Positioning Statement', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 2) {
    return {
      id: 'task-so-day-2',
      dayNumber: 2,
      phaseId: 1,
      title: 'Day 2: Ideal Customer Profile (ICP) & Buyer Persona Architecture',
      category: 'Research & Synthesis',
      priority: 'high',
      estimatedMinutes: 40,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Construct the authoritative Ideal Customer Profile (ICP) specification for ${ctx.companyName}:
1. Define our firmographic boundaries: Target industry sub-verticals, target company size (${ctx.targetCompanySize}), geographic perimeter (${ctx.targetGeography}), and minimum commercial viability thresholds.
2. Architect our buyer personas: Detail the exact decision-maker roles (${ctx.targetTitles.join(', ')}), their daily operational KPIs, and their primary business bottlenecks.
3. Analyze their pressing core pain point: "${ctx.corePainPoint}". Explain how our offer directly solves this friction.
${hasQualificationWeakness ? 'CRITICAL COACHING NOTE: Ensure your ICP includes negative firmographics (who we do NOT want to target) to avoid wasted outreach.' : ''}`,
      clientContext: `${ctx.founderName} note: "Targeting the wrong companies with a great message still produces zero deals. Give me a crystal-clear ICP specification so we only spend energy reaching accounts with real budget."`,
      deliverables: [
        { id: 'del-so-2-1', label: `Ideal Customer Profile (ICP) Master Specification Sheet for ${ctx.companyName}`, type: 'document', required: true },
        { id: 'del-so-2-2', label: 'Decision-Maker Buyer Persona & Pain-Point Map', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 3) {
    return {
      id: 'task-so-day-3',
      dayNumber: 3,
      phaseId: 1,
      title: 'Day 3: Prospect Qualification Criteria & Disqualification Framework',
      category: 'Research & Synthesis',
      priority: 'high',
      estimatedMinutes: 40,
      deadlineHours: 5,
      deadlineType: 'soft',
      brief: `Social Marketing & Cold Outreach requires rigorous qualification before any message is sent. Establish our Qualification & Disqualification Rules:
1. Define the 4 Core Qualification Pillars (Fit, Need, Timing, Authority) tailored specifically to ${ctx.companyName}'s offer.
2. Codify our mandatory Qualification Criteria: ${ctx.qualificationCriteria.slice(0, 3).join('; ')}.
3. Establish strict Disqualification Rules: ${ctx.disqualificationRules.join('; ')}.
4. Build a 10-point Lead Qualification Scoring Rubric used to score candidate prospects before they enter our outreach sequence.`,
      clientContext: `${ctx.founderName} note: "A bad prospect wastes our time, burns our domain reputation, and frustrates sales calls. Build an airtight qualification scorecard so we know exactly who qualifies and who gets disqualified instantly."`,
      deliverables: [
        { id: 'del-so-3-1', label: '4-Pillar Prospect Qualification & Disqualification Specification', type: 'document', required: true },
        { id: 'del-so-3-2', label: '10-Point Lead Qualification Scoring Rubric', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 2: DAYS 4–7 — INDEPENDENT EXECUTION (PROSPECTING & PREPARATION)
  // ----------------------------------------------------------------------------
  if (dayNumber === 4) {
    return {
      id: 'task-so-day-4',
      dayNumber: 4,
      phaseId: 2,
      title: 'Day 4: Target Company Sourcing & Strategic ICP Fit Scoring',
      category: 'Data & Spreadsheets',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Move from theory into independent prospecting execution. Identify 15 target companies strictly matching ${ctx.companyName}'s ICP:
1. Source company name, official website domain, primary headquarters location (within ${ctx.targetGeography}), estimated headcount (${ctx.targetCompanySize}), and core business model.
2. Evaluate each company against our Day 3 qualification rubric: assign an ICP Fit Score (1–10).
3. Write a concise, 1-sentence business justification for each company explaining *why* they need ${ctx.companyName}'s solution today.`,
      clientContext: `${ctx.founderName} note: "Do not just pull a generic random list from a directory. Every single company on this sheet must be vetted against our ICP with an explicit reason why they are a prime fit for ${ctx.dealSize}."`,
      deliverables: [
        { id: 'del-so-4-1', label: '15-Company Target Sourcing & ICP Fit Scoring Database', type: 'spreadsheet', required: true },
        { id: 'del-so-4-2', label: 'Sourcing Methodology & ICP Alignment Rationale Memo', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 5) {
    return {
      id: 'task-so-day-5',
      dayNumber: 5,
      phaseId: 2,
      title: 'Day 5: Decision-Maker Identification & Buying Signals Intelligence',
      category: 'Research & Synthesis',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Outreach success hinges on timely buying triggers. For 10 approved target companies from yesterday's batch:
1. Identify the primary decision-maker holding one of our target titles: ${ctx.targetTitles[0]} or ${ctx.targetTitles[1]}.
2. Verify their full name, verified business email, LinkedIn profile URL, and office location.
3. Research specific, public buying signals (${ctx.buyingSignals.slice(0, 3).join('; ')}) that indicate why right now is the optimal window to reach out.
4. Document the exact trigger event and source citation for each prospect.`,
      clientContext: `${ctx.founderName} note: "Cold outreach without a buying signal feels like spam. Tie every contact to a real event—a new hire, a funding round, or scaling pains. That is what earns executive attention."`,
      deliverables: [
        { id: 'del-so-5-1', label: '10-Lead Decision-Maker Contact & Buying Trigger Matrix', type: 'spreadsheet', required: true },
        { id: 'del-so-5-2', label: 'Buying Signal Verification & Sourcing Provenance Note', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 6) {
    return {
      id: 'task-so-day-6',
      dayNumber: 6,
      phaseId: 2,
      title: 'Day 6: Hyper-Personalization & Custom Icebreaker Engineering',
      category: 'Content & Copywriting',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Generic flattery gets deleted. Engineer hyper-personalized opening lines (icebreakers) for the 10 decision-makers identified on Day 5:
1. Research each prospect's public footprint: a recent LinkedIn post, podcast interview, conference keynote, company press release, or milestone.
2. Write an authentic, personalized first sentence (under 30 words) for each prospect referencing their specific achievement or insight.
3. Craft a natural transition bridge connecting the icebreaker into ${ctx.companyName}'s core value proposition without sounding salesy.
${hasPersonalizationWeakness ? 'CRITICAL COACHING NOTE: Never write "I noticed you are the VP at Company X". Reference something specific they actually wrote, shared, or built.' : ''}`,
      clientContext: `${ctx.founderName} note: "Personalization is our competitive edge. If our first sentence proves we actually researched their work, our reply rates jump from 3% to 25%. Deliver 10 bespoke opening lines."`,
      deliverables: [
        { id: 'del-so-6-1', label: '10-Prospect Custom Icebreaker & Value-Bridge Copy Suite', type: 'spreadsheet', required: true },
        { id: 'del-so-6-2', label: 'Executive Personalization Guidelines & Quality Assurance SOP', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 7) {
    return {
      id: 'task-so-day-7',
      dayNumber: 7,
      phaseId: 2,
      title: 'Day 7: Multi-Channel Outreach Sequence Copywriting (LinkedIn & Cold Email)',
      category: 'Content & Copywriting',
      priority: 'urgent',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Draft our complete, multi-channel 3-touch sequence across our primary channels (${ctx.primaryChannel} and ${ctx.secondaryChannel}):
1. Touch 1 (Day 1 - Initial Outreach): Scroll-stopping hook, recognition of ${ctx.corePainPoint}, quantifiable proof metric, and a soft, friction-free interest CTA (under 100 words). ${hasCopyWeakness ? 'CRITICAL COACHING NOTE: Never ask for a 30-minute call on Touch 1! Ask for permission to share an asset or a quick insight.' : ''}
2. Touch 2 (Day 4 - Value-Add Bump): Provide a mini-benchmark, contrarian observation, or brief case study snippet.
3. Touch 3 (Day 8 - Permission / Breakup): Graceful closing note giving them an easy out while leaving the door open.
4. Draft 2 distinct LinkedIn connection request notes (under 300 characters each).`,
      clientContext: `${ctx.founderName} note: "Write for busy executives reading on their phones between meetings. Short paragraphs, clear value, and zero high-pressure pitch slapping. Deliver a sequence our team can launch immediately."`,
      deliverables: [
        { id: 'del-so-7-1', label: '3-Touch Master Multi-Channel Outreach Sequence Copy Suite', type: 'document', required: true },
        { id: 'del-so-7-2', label: 'LinkedIn Connection Notes & Touchpoint Cadence Flowchart', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 3: DAYS 8–10 — OUTREACH & PROBLEM SOLVING (LIVE RESPONSES & CLARIFICATION)
  // ----------------------------------------------------------------------------
  if (dayNumber === 8) {
    return {
      id: 'task-so-day-8',
      dayNumber: 8,
      phaseId: 3,
      title: 'Day 8: Incomplete Founder Campaign Directive & Active Clarification',
      category: 'Research & Synthesis',
      priority: 'urgent',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${ctx.founderName} sent a hasty voice note: "Hey, we need to spin up an urgent outbound push for our new offer tier today. Build a list and start reaching out immediately."
The directive leaves out critical campaign parameters: target sub-vertical, company size threshold, geographical boundaries, sending domain, and booking link.
1. Formulate 3 targeted clarification questions and message ${ctx.founderName} in Client Chat to extract the missing parameters.
2. Based on the client's response, build a comprehensive Campaign Scoping Blueprint establishing the verified audience filters, channel strategy (${ctx.primaryChannel}), and booking protocol (${ctx.bookingLink}).`,
      clientContext: `${ctx.founderName} note: "Hey, we need to spin up an urgent outbound push for our new offer tier today. Build a list and start reaching out immediately. (Sent on mobile from airport)" (Note: Message ${ctx.founderName} in chat to clarify missing campaign details!)`,
      deliverables: [
        { id: 'del-so-8-1', label: 'Campaign Scoping Clarification Query & Strategic Brief for Founder', type: 'text', required: true },
        { id: 'del-so-8-2', label: 'Scoped Campaign Execution Blueprint & Channel Architecture', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 9) {
    return {
      id: 'task-so-day-9',
      dayNumber: 9,
      phaseId: 3,
      title: 'Day 9: Multi-State Prospect Response Triage & Dynamic Response Simulation',
      category: 'Client Communications',
      priority: 'urgent',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Outreach campaigns generated 4 distinct live prospect responses representing the 4 core prospect states. Draft professional, high-conversion replies for all 4 scenarios:
- State 1 (Positive / Interested): "${ctx.targetTitles[0]} at a qualified firm says: 'This looks relevant to our current sprint. Do you have time for a quick chat Thursday at 2:00 PM?'" &rarr; Validate qualification, confirm timing, and send ${ctx.founderName}'s scheduling link (${ctx.bookingLink}).
- State 2 (Neutral / Pricing Objection): "Prospect replies: 'Looks interesting, but what does this cost?'" &rarr; Deflect early price resistance with an estimated range (${ctx.dealSize}), explain that investment scales with volume, and suggest a 15-minute introductory call.
- State 3 (Neutral / Competitor Objection): "Prospect replies: 'We already use an alternative provider and are locked into an annual contract.'" &rarr; Highlight our unique differentiator without disparaging the competitor, and ask for permission to stay in touch.
- State 4 (Negative / Timing): "Prospect replies: 'Not a priority right now, check back in Q3.'" &rarr; Acknowledge politely, share a valuable industry resource, and set a CRM follow-up task.
${hasObjectionWeakness ? 'CRITICAL COACHING NOTE: Never argue with a prospect. Validate their position with empathy, plant an insightful seed, and guide them smoothly toward discovery.' : ''}`,
      clientContext: `${ctx.founderName} note: "Getting replies is only half the battle. How you triage and reply to pricing questions, competitor mentions, and meeting requests determines whether we book calls or lose deals. Write sharp, tailored responses for all four."`,
      deliverables: [
        { id: 'del-so-9-1', label: '4-State Prospect Response Handling Suite (Positive, Pricing, Competitor, Timing)', type: 'document', required: true },
        { id: 'del-so-9-2', label: `Sales Objection Handling Decision Tree & Script Playbook for ${ctx.companyName}`, type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 10) {
    return {
      id: 'task-so-day-10',
      dayNumber: 10,
      phaseId: 3,
      title: 'Day 10: No-Response Follow-Up Cadence & Strategic Breakup Sequence',
      category: 'Content & Copywriting',
      priority: 'medium',
      estimatedMinutes: 40,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Over 70% of prospective buyers open cold outreach but fail to respond immediately due to busy schedules. Construct our No-Response Re-engagement System:
1. Draft 2 creative, value-added follow-up touchpoints (e.g. sharing a 1-page benchmark report or industry teardown) that provide standalone value without requiring a reply.
2. Draft an executive "Breakup Email" using disarming reverse psychology to elicit a definitive yes/no answer.
3. Establish pipeline governance rules: define when an unresponsive lead should be marked "Closed - Unresponsive" vs when they should be recycled into our quarterly nurture pool in ${ctx.crmPlatform}.`,
      clientContext: `${ctx.founderName} note: "Most people give up after one email. The real pipeline is built in the follow-up cadence. Deliver copy that actually adds value rather than lazily asking 'did you see my email?'"`,
      deliverables: [
        { id: 'del-so-10-1', label: 'Multi-Touch Value-Added Follow-Up & Breakup Sequence Suite', type: 'document', required: true },
        { id: 'del-so-10-2', label: `Unresponsive Lead Recycling & Pipeline Governance SOP (${ctx.crmPlatform})`, type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 4: DAYS 11–12 — PRESSURE / MULTIPLE PRIORITIES (WORKLOAD SURGE & PIVOT)
  // ----------------------------------------------------------------------------
  if (dayNumber === 11) {
    return {
      id: 'task-so-day-11',
      dayNumber: 11,
      phaseId: 4,
      title: 'Day 11: Queue Triage Under Pressure — High-Velocity Inbound & Batch Sprint',
      category: 'Operations & CRM',
      priority: 'urgent',
      estimatedMinutes: 50,
      deadlineHours: 3,
      deadlineType: 'hard',
      brief: `HIGH-PRESSURE SPRINT: Multiple competing priorities arrive simultaneously:
- Case 1: Two warm leads replied asking for meeting times with ${ctx.founderName} tomorrow morning.
- Case 2: One prospect requested a custom case study before agreeing to a call.
- Case 3: One hostile prospect demanded to be unsubscribed and removed from our database immediately.
- Case 4: ${ctx.founderName} needs 15 new personalized accounts researched and staged in ${ctx.crmPlatform} by 3:00 PM for a partner campaign.
1. Build a Priority Triage Matrix ranking all 4 cases by revenue impact and urgency.
2. Draft immediate customer responses for Cases 1, 2, and 3 (including GDPR/CAN-SPAM compliant opt-out confirmation).
3. Prepare the 15-account staged batch queue for Case 4.`,
      clientContext: `${ctx.founderName} note: "Everything is happening at once. Do not panic—prioritize! The warm leads must be booked before they lose interest, the opt-out must be handled compliantly, and the 15-lead batch must be staged. Execute cleanly!"`,
      deliverables: [
        { id: 'del-so-11-1', label: 'Priority Action Matrix & Multi-Case Inbound Response Suite', type: 'spreadsheet', required: true },
        { id: 'del-so-11-2', label: '15-Lead Staged Outbound Batch & Compliance Confirmation Log', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 12) {
    return {
      id: 'task-so-day-12',
      dayNumber: 12,
      phaseId: 4,
      title: 'Day 12: Campaign Optimization Under Fire & Strategic Audience Pivot',
      category: 'Research & Synthesis',
      priority: 'urgent',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Mid-campaign performance audit reveals a bottleneck: the initial outreach batch to ${ctx.targetTitles[0]}s generated only a 1.2% reply rate, while industry benchmark is 8%+.
${ctx.founderName} requests an immediate campaign pivot:
1. Diagnose the friction point: analyze subject line deliverability, hook relevance, and CTA friction.
2. Execute an Audience & Title Pivot: shift targeting from ${ctx.targetTitles[0]} to ${ctx.targetTitles[1]}, who directly feel the daily pain point of "${ctx.corePainPoint}".
3. Rewrite the primary outreach hook and revise the sequence to speak directly to the new title's operational KPIs.
4. Prepare an executive discovery briefing sheet for a qualified prospect who just booked on ${ctx.founderName}'s calendar.`,
      clientContext: `${ctx.founderName} note: "When a campaign underperforms, top VAs don't keep doing the same thing. Diagnose why the message didn't resonate, pivot the target role, and rewrite the angle so we hit our target of ${ctx.campaignObjective}."`,
      deliverables: [
        { id: 'del-so-12-1', label: 'Outbound Campaign Friction Diagnostic & Messaging Pivot Report', type: 'document', required: true },
        { id: 'del-so-12-2', label: 'Revised Multi-Channel Sequence Suite & Pre-Call Prospect Briefing Sheet', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 5: DAYS 13–14 — PROFESSIONAL EXECUTION & FINAL PRACTICAL CAPSTONE
  // ----------------------------------------------------------------------------
  if (dayNumber === 13) {
    return {
      id: 'task-so-day-13',
      dayNumber: 13,
      phaseId: 5,
      title: 'Day 13: End-to-End Outbound Pipeline Architecture & Founder Handoff SOP',
      category: 'Operations & CRM',
      priority: 'high',
      estimatedMinutes: 50,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Demonstrate executive-grade pipeline management for ${ctx.companyName}:
1. Build our Master Outbound Pipeline Architecture in ${ctx.crmPlatform} mapping the 6 progression stages: [Lead Identified] &rarr; [Qualified Prospect] &rarr; [In Outreach] &rarr; [Engaged / Conversation] &rarr; [Meeting Scheduled] &rarr; [Founder Handoff].
2. Conduct a Pipeline Hygiene Audit on 25 simulated leads, identifying bottlenecks and stalled opportunities.
3. Formulate our Standard Operating Procedure for Qualified Lead Handoff: define the exact briefing format, calendar notification protocol, and CRM tagging handover between the VA and ${ctx.founderName}.`,
      clientContext: `${ctx.founderName} note: "I want an outbound engine that runs like clockwork. Build a pipeline architecture where every lead is tracked, follow-ups are automated, and warm meetings are handed over to me with complete briefing sheets."`,
      deliverables: [
        { id: 'del-so-13-1', label: `Master Outbound CRM Pipeline Architecture & Stage Hygiene Matrix (${ctx.crmPlatform})`, type: 'spreadsheet', required: true },
        { id: 'del-so-13-2', label: 'Qualified Opportunity Founder Handoff Protocol & Briefing Template', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // Day 14: Final 14-Day Practical Capstone Exam
  return {
    id: 'task-so-day-14',
    dayNumber: 14,
    phaseId: 5,
    title: 'Day 14: Final 14-Day Practical Capstone — Full-Spectrum Outbound System & Discovery Handoff',
    category: 'Operations & CRM',
    priority: 'urgent',
    estimatedMinutes: 60,
    deadlineHours: 4,
    deadlineType: 'hard',
    brief: `Your 14-day Social Marketing & Cold Outreach VA graduation practical assessment. Demonstrate complete mastery across the entire business development workflow: Offer Analysis, ICP Definition, Prospect Research, Qualification, Personalization, Multi-Channel Outreach, Response Handling, Follow-Up, and Founder Discovery Call Handoff:
1. Master ICP & 15-Lead Qualified Target Prospect Database: Full firmographic vetting, decision-maker contact details, and documented buying triggers matching ${ctx.targetMarket}.
2. Complete Multi-Channel Outbound Sequence Suite: 3-touch cold email sequence + 2 LinkedIn connection notes + 5 custom hyper-personalized icebreakers.
3. Multi-Scenario Live Prospect Response Resolution: Complete response scripts resolving 4 simultaneous prospect states (Positive Meeting Request, Pricing Resistance, Competitor Objection, and CAN-SPAM Opt-out).
4. Executive Pre-Call Discovery Briefing Dossier: Comprehensive 1-page briefing for ${ctx.founderName} on a qualified prospect attending an upcoming discovery call (${ctx.dealSize}).`,
    clientContext: `${ctx.founderName} note: "You have mastered the complete outbound cycle from understanding our offer to qualifying leads, personalizing outreach, handling tough objections, and setting up qualified calls. This capstone is your master outbound portfolio. Deliver a system that any founder would hire you to run on day one."`,
    deliverables: [
      { id: 'del-so-14-1', label: `Master ICP & 15-Lead Qualified Target Prospect Database for ${ctx.companyName}`, type: 'spreadsheet', required: true },
      { id: 'del-so-14-2', label: 'Multi-Channel Sequence Suite & Hyper-Personalized Icebreaker Bank', type: 'document', required: true },
      { id: 'del-so-14-3', label: 'Comprehensive Sales Objection & Prospect Response Handling Playbook', type: 'document', required: true },
      { id: 'del-so-14-4', label: 'Executive Pre-Call Discovery Briefing Dossier & Founder Handoff Package', type: 'document', required: true },
    ],
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

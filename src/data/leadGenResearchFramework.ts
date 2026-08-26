// ==============================================================================
// CoreGuide VA Simulator - Lead Generation & Research VA 14-Day Framework
// Information Discovery, Verification, Data Hygiene & Strategic Market Synthesis
// ==============================================================================

import { TaskItem, ClientPersona, CompetencyMetric } from '../types';

export interface LeadGenIndustryContext {
  industryId: string;
  industryName: string;
  targetSectorDescription: string;
  typicalEntities: string;
  keyDataPoints: string[];
}

export const LEAD_GEN_CONTEXTS: Record<string, LeadGenIndustryContext> = {
  saas_technology: {
    industryId: 'saas_technology',
    industryName: 'Enterprise SaaS & Cloud Infrastructure',
    targetSectorDescription: 'Fast-growing B2B software companies ($5M-$50M ARR) scaling their engineering and product teams',
    typicalEntities: 'Software vendors, cloud infrastructure providers, AI tool developers',
    keyDataPoints: ['Company Name', 'Domain URL', 'Headquarters', 'Employee Count', 'Estimated Revenue', 'Key Decision Maker Title', 'Direct Email', 'LinkedIn URL', 'Tech Stack Tools', 'Funding Stage'],
  },
  commercial_services: {
    industryId: 'commercial_services',
    industryName: 'Commercial Property & Facility Services',
    targetSectorDescription: 'Regional commercial property management firms, logistics centers, and corporate facilities',
    typicalEntities: 'Property asset management groups, corporate facility operators, commercial leasing brokers',
    keyDataPoints: ['Company Name', 'Property Portfolio Sq Ft', 'Headquarters', 'Managing Director', 'Verified Contact Email', 'Phone Number', 'Service Vendor Contracts', 'Facility Type'],
  },
  professional_services: {
    industryId: 'professional_services',
    industryName: 'Management Consulting & Corporate Advisory',
    targetSectorDescription: 'Mid-market boutique management consulting, accounting, and M&A advisory practices',
    typicalEntities: 'Advisory partnerships, boutique consultancies, executive search firms',
    keyDataPoints: ['Firm Name', 'Practice Area', 'Partner/Principal Name', 'Direct Email', 'Office Locations', 'Headcount', 'Industry Specialization', 'Recent Deals/Engagements'],
  },
  healthcare_biotech: {
    industryId: 'healthcare_biotech',
    industryName: 'Healthcare & Digital Health Solutions',
    targetSectorDescription: 'Telehealth platforms, private medical practice groups, and health-tech service providers',
    typicalEntities: 'Clinical practice networks, digital health platforms, diagnostic centers',
    keyDataPoints: ['Organization Name', 'Specialty Area', 'Chief Medical Officer / Practice Director', 'Direct Email', 'Clinic Locations', 'Accreditation Status', 'EMR Software Used'],
  },
};

export function getLeadGenContext(client: ClientPersona): LeadGenIndustryContext {
  const ind = (client.industry || '').toLowerCase();
  if (ind.includes('estate') || ind.includes('property') || ind.includes('facility') || ind.includes('commercial')) {
    return LEAD_GEN_CONTEXTS.commercial_services;
  }
  if (ind.includes('consult') || ind.includes('advisory') || ind.includes('legal') || ind.includes('finance')) {
    return LEAD_GEN_CONTEXTS.professional_services;
  }
  if (ind.includes('health') || ind.includes('medical') || ind.includes('bio')) {
    return LEAD_GEN_CONTEXTS.healthcare_biotech;
  }
  return LEAD_GEN_CONTEXTS.saas_technology;
}

export interface GenerateLeadGenTaskParams {
  dayNumber: number;
  client: ClientPersona;
  competencies?: CompetencyMetric[];
  previousTasks?: TaskItem[];
  previousSubmissions?: any[];
  identifiedWeaknesses?: string[];
  chatHistory?: any[];
}

export function generateLeadGenTask(params: GenerateLeadGenTaskParams): TaskItem {
  const { dayNumber, client, identifiedWeaknesses = [] } = params;
  const ctx = getLeadGenContext(client);
  const company = client.companyName || 'Market Research Group';
  const founderName = client.ceoName || 'Research Director';

  const hasVerificationWeakness = identifiedWeaknesses.some((w) => /verif|valid|accuracy|bounce|check/i.test(w));
  const hasFormattingWeakness = identifiedWeaknesses.some((w) => /format|spread|column|schema|data/i.test(w));

  // ----------------------------------------------------------------------------
  // PHASE 1: DAYS 1–3 — FOUNDATION, RESEARCH OBJECTIVE & BOOLEAN SEARCH
  // ----------------------------------------------------------------------------
  if (dayNumber === 1) {
    return {
      id: 'task-lg-day-1',
      dayNumber: 1,
      phaseId: 1,
      title: `Day 1: Research Objective Formulation & ICP Search Criteria Architecture (${ctx.industryName})`,
      category: 'Research & Synthesis',
      priority: 'high',
      estimatedMinutes: 35,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Welcome to ${company}'s Market Intelligence team! Your first assignment is establishing our research framework for: "${ctx.targetSectorDescription}". 1. Define our Ideal Account Profile (firmographic criteria: headcount, estimated revenue, geography, entity types). 2. Establish our Data Dictionary defining the 10 core fields we collect for every record (${ctx.keyDataPoints.slice(0, 8).join(', ')}). 3. Create a standardized verification standard to ensure data integrity.`,
      clientContext: `${founderName} message: "Bad data wastes weeks of time. Before we build any lists, define exactly what companies qualify, what data fields we capture, and what our standard of proof is for verified information."`,
      deliverables: [
        { id: 'del-lg-1-1', label: `Research Objective & Target Account Profiling Specification`, type: 'document', required: true },
        { id: 'del-lg-1-2', label: '10-Point Master Data Dictionary & Verification Standard', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 2) {
    return {
      id: 'task-lg-day-2',
      dayNumber: 2,
      phaseId: 1,
      title: 'Day 2: Advanced Boolean Search String Engineering & Sourcing Platform Mapping',
      category: 'Research & Synthesis',
      priority: 'medium',
      estimatedMinutes: 40,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Master the search syntax used by professional researchers: 1. Construct 5 distinct advanced Boolean search strings (using AND, OR, NOT, site:, intitle:, inurl:) tailored to discover relevant accounts in ${ctx.industryName}. 2. Map out 4 verified public/professional directories or registers where target organizations are listed (e.g. industry associations, licensing registries, conference speaker rosters). 3. Test each query and document the exact result counts.`,
      clientContext: `${founderName} message: "Do not just type keywords into basic Google. Build professional Boolean search strings that filter out recruiters, job boards, and irrelevant blogs so we only surface target organizations."`,
      deliverables: [
        { id: 'del-lg-2-1', label: 'Advanced Boolean Search String Architecture & Query Bank', type: 'document', required: true },
        { id: 'del-lg-2-2', label: 'Target Industry Directory & Source Repository Matrix', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 3) {
    return {
      id: 'task-lg-day-3',
      dayNumber: 3,
      phaseId: 1,
      title: 'Day 3: Company Discovery & Organizational Structure Hierarchy Mapping',
      category: 'Data & Spreadsheets',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Identify 10 target companies matching our ICP and map their internal leadership hierarchy: 1. Record company name, website domain, primary office location, estimated headcount, and core service offering. 2. For each company, map the executive organizational structure: who is the C-suite leader, who heads operations, and who manages procurement/budget? 3. Populate our preliminary research database with clean formatting.`,
      clientContext: `${founderName} message: "Finding a company is easy. Mapping who actually makes the decisions inside the building is the real skill. Give me 10 verified organizations with their leadership hierarchies clearly mapped."`,
      deliverables: [
        { id: 'del-lg-3-1', label: '10-Company Target Discovery Database & Org Structure Matrix', type: 'spreadsheet', required: true },
        { id: 'del-lg-3-2', label: 'Organizational Leadership Hierarchy Mapping Notes', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 2: DAYS 4–7 — CONTACT ENRICHMENT, VERIFICATION & COMPETITOR AUDITS
  // ----------------------------------------------------------------------------
  if (dayNumber === 4) {
    return {
      id: 'task-lg-day-4',
      dayNumber: 4,
      phaseId: 2,
      title: 'Day 4: Decision-Maker Contact Enrichment & Multi-Point Data Sourcing',
      category: 'Data & Spreadsheets',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Enrich our target company list with direct decision-maker contact intelligence: 1. For 15 specific target accounts, identify the primary decision maker. 2. Source their full verified name, exact executive title, direct business email address, personal LinkedIn URL, and company phone switchboard. 3. Tag each record with source methodology (e.g. company press release, corporate filings, LinkedIn Sales Navigator, verified web directory).`,
      clientContext: `${founderName} message: "No generic placeholder emails. Every record must have a direct business email and a verified LinkedIn profile. If you cannot find direct details, note the exact gatekeeper pathway."`,
      deliverables: [
        { id: 'del-lg-4-1', label: '15-Decision Maker Enriched Contact Database', type: 'spreadsheet', required: true },
        { id: 'del-lg-4-2', label: 'Data Sourcing Transparency & Provenance Log', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 5) {
    return {
      id: 'task-lg-day-5',
      dayNumber: 5,
      phaseId: 2,
      title: 'Day 5: Information Cross-Verification & Independent Source Triangulation',
      category: 'Research & Synthesis',
      priority: 'urgent',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Raw research data often contains outdated information (e.g. executives who left 6 months ago or dead phone numbers). 1. Conduct a rigorous Cross-Verification Audit on a batch of 20 raw contact records. 2. Verify each executive still holds their title across 2 independent sources (e.g. company leadership page + recent media interview). 3. Identify and flag 3 invalid/stale records, providing verified updated replacements. ${hasVerificationWeakness ? 'CRITICAL COACHING NOTE: Never trust a single directory. Triangulate facts against official corporate records.' : ''}`,
      clientContext: `${founderName} message: "A stale email address ruins our reputation. Run this list through independent cross-verification. Show me your audit methodology and replace any records that fail our verification standards."`,
      deliverables: [
        { id: 'del-lg-5-1', label: 'Data Verification Audit Log (Confidence Scores & Dual Sources)', type: 'spreadsheet', required: true },
        { id: 'del-lg-5-2', label: 'Verification Protocol & Stale Record Remediation Report', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 6) {
    return {
      id: 'task-lg-day-6',
      dayNumber: 6,
      phaseId: 2,
      title: 'Day 6: Master Data Cleaning, Formatting Standards & De-duplication Protocol',
      category: 'Data & Spreadsheets',
      priority: 'medium',
      estimatedMinutes: 40,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Clean and format a messy 40-record raw research spreadsheet: 1. Standardize text casing (Proper Title Case for names, lowercase for emails, clean URLs without http:// or tracking parameters). 2. Standardize phone numbers into E.164 international format (+1-XXX-XXX-XXXX). 3. Detect and merge 4 duplicate company entries with conflicting details. 4. Ensure all columns match master CRM import requirements.`,
      clientContext: `${founderName} message: "Messy spreadsheets cannot be imported into our systems. Clean the formatting, purge duplicates, and ensure every column header strictly matches our schema."`,
      deliverables: [
        { id: 'del-lg-6-1', label: 'Cleaned, Standardized & De-duplicated Master Research Database', type: 'spreadsheet', required: true },
        { id: 'del-lg-6-2', label: 'Data Cleaning Rules & Formatting Guidelines Documentation', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 7) {
    return {
      id: 'task-lg-day-7',
      dayNumber: 7,
      phaseId: 2,
      title: 'Day 7: Competitor Benchmarking & Service Offering Comparison Matrix',
      category: 'Research & Synthesis',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Execute an in-depth Competitor Landscape Audit for ${company}: 1. Identify the top 4 leading organizations in our sector. 2. Build a granular comparison matrix: Core Services Offered, Pricing/Packaging Model, Public Client Logos/Testimonials, Key Strengths, and Identified Operational Weaknesses. 3. Synthesize the findings into an executive benchmark summary highlighting 3 market gaps ${company} can exploit.`,
      clientContext: `${founderName} message: "I need to know how our competitors price their offerings and what their customers complain about. Give me a detailed benchmark matrix and strategic takeaways."`,
      deliverables: [
        { id: 'del-lg-7-1', label: 'Competitor Benchmark Comparison Matrix (4 Key Players)', type: 'spreadsheet', required: true },
        { id: 'del-lg-7-2', label: 'Strategic Market Gap & Competitive Intelligence Summary Memo', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 3: DAYS 8–10 — INCOMPLETE BRIEFS, AMBIGUITY & PUBLIC RECORDS
  // ----------------------------------------------------------------------------
  if (dayNumber === 8) {
    return {
      id: 'task-lg-day-8',
      dayNumber: 8,
      phaseId: 3,
      title: 'Day 8: Incomplete Research Brief Triage & Active Scoping Clarification',
      category: 'Research & Synthesis',
      priority: 'urgent',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${founderName} sent an ambiguous note: "Need a comprehensive list of all major players in this sector by tomorrow. Group them properly." The note fails to specify: geographic scope (US only, EMEA, global?), minimum headcount threshold, whether public or private firms, and what specific data points are needed for grouping. 1. Use the Client Chat to ask ${founderName} the 3 essential scoping questions. 2. Build the conditional research architecture while awaiting confirmation.`,
      clientContext: `${founderName} message: "Need a comprehensive list of all major players in this sector by tomorrow. Group them properly. (Sent from mobile)"`,
      deliverables: [
        { id: 'del-lg-8-1', label: 'Research Scope Clarification Inquiry & Taxonomy Framework', type: 'text', required: true },
        { id: 'del-lg-8-2', label: 'Sector Categorization Taxonomy & Scoping Architecture Document', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 9) {
    return {
      id: 'task-lg-day-9',
      dayNumber: 9,
      phaseId: 3,
      title: 'Day 9: Corporate Entity Verification & Public Registry Investigation (Sec of State)',
      category: 'Research & Synthesis',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `High-value research requires validating that organizations are legally active corporate entities. For 5 target organizations: 1. Query official public business registries (e.g. Secretary of State, Companies House, SEC EDGAR filings). 2. Document legal entity name, jurisdiction of incorporation, entity status (Active/Good Standing), registered agent, and date of formation. 3. Identify any corporate parent/subsidiary relationships.`,
      clientContext: `${founderName} message: "Before we propose partnerships, I need to know these are legitimate, active corporate entities. Verify their legal registrations and ownership structures through official public records."`,
      deliverables: [
        { id: 'del-lg-9-1', label: 'Corporate Entity Verification & Secretary of State Audit Matrix', type: 'spreadsheet', required: true },
        { id: 'del-lg-9-2', label: 'Public Records Due Diligence & Corporate Ownership Dossier', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 10) {
    return {
      id: 'task-lg-day-10',
      dayNumber: 10,
      phaseId: 3,
      title: 'Day 10: Pattern Recognition & Opportunity Identification with Incomplete Data',
      category: 'Research & Synthesis',
      priority: 'medium',
      estimatedMinutes: 40,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Real-world intelligence is never complete. Analyze a dataset of 25 industry companies where only 70% of data points are known: 1. Identify underlying patterns: which sub-verticals are hiring fastest? What software tools appear most frequently among market leaders? 2. Deduce missing variables using proxy indicators (e.g. estimating revenue tier from employee count and office locations). 3. Formulate an Opportunity Assessment Report.`,
      clientContext: `${founderName} message: "You will rarely have 100% of the puzzle. Look at the incomplete data, spot the patterns, and tell me what the market trends are telling us."`,
      deliverables: [
        { id: 'del-lg-10-1', label: 'Pattern Recognition & Market Opportunity Analysis Report', type: 'document', required: true },
        { id: 'del-lg-10-2', label: 'Proxy Estimation Methodology & Trend Correlation Matrix', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 4: DAYS 11–12 — HIGH-PRESSURE SYNTHESIS & VENDOR EVALUATIONS
  // ----------------------------------------------------------------------------
  if (dayNumber === 11) {
    return {
      id: 'task-lg-day-11',
      dayNumber: 11,
      phaseId: 4,
      title: 'Day 11: Urgent Market Sizing & Vendor Evaluation Matrix (Tight Turnaround)',
      category: 'Research & Synthesis',
      priority: 'urgent',
      estimatedMinutes: 50,
      deadlineHours: 3,
      deadlineType: 'hard',
      brief: `${founderName} is entering a board meeting in 3 hours and needs an emergency vendor comparison for 5 commercial solutions: 1. Compare all 5 vendors across: Enterprise Pricing, Feature Parity, Security Compliance (SOC2/GDPR), Implementation Timeline, and User Rating on G2/Capterra. 2. Build a weighted scoring model ranking the vendors from best to worst fit. 3. Draft a 1-page bottom-line executive summary.`,
      clientContext: `${founderName} message: "I have 3 hours before the board asks for my vendor recommendation. Build an airtight evaluation matrix with weighted scores so my decision is backed by cold hard data."`,
      deliverables: [
        { id: 'del-lg-11-1', label: '5-Vendor Weighted Evaluation & Scoring Matrix', type: 'spreadsheet', required: true },
        { id: 'del-lg-11-2', label: 'Executive Board Vendor Selection Briefing Memo', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 12) {
    return {
      id: 'task-lg-day-12',
      dayNumber: 12,
      phaseId: 4,
      title: 'Day 12: Multi-Market Regional Analysis & Headcount Expansion Intelligence',
      category: 'Data & Spreadsheets',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Research regional market expansion opportunities across 3 target metropolitan markets for ${company}: 1. Collect and compare data on: Regional Business Density, Average Headcount Growth, Talent Availability, and Competitor Saturation. 2. Synthesize findings into a comparative heat-map spreadsheet. 3. Highlight the #1 optimal market for expansion with data citations.`,
      clientContext: `${founderName} message: "We are expanding our footprint next quarter. Compare the top 3 candidate regions with verified data on market density and competition so we pick the right market."`,
      deliverables: [
        { id: 'del-lg-12-1', label: '3-Market Regional Expansion Heat Map & Comparative Dataset', type: 'spreadsheet', required: true },
        { id: 'del-lg-12-2', label: 'Market Expansion Feasibility Memo & Executive Recommendation', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 5: DAYS 13–14 — CRM ARCHITECTURE & MASTER CAPSTONE
  // ----------------------------------------------------------------------------
  if (dayNumber === 13) {
    return {
      id: 'task-lg-day-13',
      dayNumber: 13,
      phaseId: 5,
      title: 'Day 13: Master CRM Import Schema Architecture & Data Governance Audit',
      category: 'Operations & CRM',
      priority: 'high',
      estimatedMinutes: 50,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Design our production CRM data architecture for ${company}: 1. Build a Master CRM Import Schema mapping 20 custom fields across Company, Contact, and Deal stages (Field Name, Data Type, Validation Regex, Required Flag). 2. Audit a test batch of 50 records to ensure 100% compliance with data hygiene standards. 3. Document our ongoing Data Governance SOP.`,
      clientContext: `${founderName} message: "Our CRM is only as valuable as the discipline of our data architecture. Build a master schema and import protocol that keeps our database clean as we scale."`,
      deliverables: [
        { id: 'del-lg-13-1', label: 'Master CRM Schema Specification & Field Mapping Architecture', type: 'spreadsheet', required: true },
        { id: 'del-lg-13-2', label: 'Data Hygiene & Database Governance Standard Operating Procedure', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // Day 14: Practical Capstone
  return {
    id: 'task-lg-day-14',
    dayNumber: 14,
    phaseId: 5,
    title: 'Day 14: Final 14-Day Practical Capstone — Master Market Intelligence Dossier & Research Report',
    category: 'Research & Synthesis',
    priority: 'urgent',
    estimatedMinutes: 60,
    deadlineHours: 4,
    deadlineType: 'hard',
    brief: `Your 14-day Lead Generation & Research VA graduation practical assessment. Demonstrate mastery across all research competencies: Search String Engineering, Corporate Discovery, Multi-Source Verification, Data Hygiene & Spreadsheet Architecture, Public Registry Audits, and Strategic Market Synthesis:
1. Master Market Intelligence Dossier: A comprehensive verified database of 25 qualified target organizations with complete leadership hierarchies, decision-maker contact details, and source citations.
2. Strategic Executive Research Report:
   - 1 Competitor Landscape Benchmark Matrix.
   - 1 Public Corporate Registry Due Diligence Audit.
   - 1 Executive Summary Report synthesizing market opportunities and actionable recommendations for ${company}.`,
    clientContext: `${founderName} message: "You have proven you can find, verify, and synthesize complex business data into actionable executive intelligence. This capstone is your master research portfolio. Deliver a report that commands immediate confidence."`,
    deliverables: [
      { id: 'del-lg-14-1', label: `Master 25-Account Verified Market Intelligence Database for ${company}`, type: 'spreadsheet', required: true },
      { id: 'del-lg-14-2', label: 'Strategic Market Intelligence Executive Report & Data Synthesis', type: 'document', required: true },
      { id: 'del-lg-14-3', label: 'Public Corporate Registry Verification & Due Diligence Dossier', type: 'document', required: true },
      { id: 'del-lg-14-4', label: 'Master Research Methodology & Data Governance Architecture', type: 'document', required: true },
    ],
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

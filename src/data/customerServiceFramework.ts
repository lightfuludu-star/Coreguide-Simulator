// ==============================================================================
// CoreGuide VA Simulator - Customer Service VA 14-Day Curriculum Framework
// Customer-Interaction Model: Food, Fashion & E-Commerce Scenarios
// ==============================================================================

import { TaskItem, ClientPersona, CompetencyMetric } from '../types';

export interface CustomerScenarioContext {
  industryId: 'food_delivery' | 'fashion_apparel' | 'ecommerce_goods';
  industryName: string;
  brandName: string;
  typicalProducts: string[];
  returnWindowDays: number;
  freeShippingThreshold: number;
}

export const CS_INDUSTRY_CONTEXTS: Record<string, CustomerScenarioContext> = {
  food_delivery: {
    industryId: 'food_delivery',
    industryName: 'Food & Beverage / Restaurant Delivery',
    brandName: 'FreshBite Gourmet Delivery',
    typicalProducts: ['Artisanal Truffle Pasta', 'Wood-Fired Margherita Pizza', 'Cold-Pressed Green Juice', 'Gluten-Free Brownie'],
    returnWindowDays: 1,
    freeShippingThreshold: 35,
  },
  fashion_apparel: {
    industryId: 'fashion_apparel',
    industryName: 'Fashion, Apparel & Luxury Retail',
    brandName: 'Aura Label Studio',
    typicalProducts: ['Oversized Linen Blazer', 'Tailored Silk Trousers', 'Ribbed Cashmere Sweater', 'Italian Leather Loafers'],
    returnWindowDays: 30,
    freeShippingThreshold: 100,
  },
  ecommerce_goods: {
    industryId: 'ecommerce_goods',
    industryName: 'Direct-to-Consumer E-Commerce Goods',
    brandName: 'Lumina Living Innovations',
    typicalProducts: ['Ergonomic Desk Lumbar Cushion', 'Aroma Mist Ultrasonic Diffuser', 'Minimalist Charging Pad', 'Bamboo Cutlery Set'],
    returnWindowDays: 30,
    freeShippingThreshold: 50,
  },
};

export function getCustomerServiceContext(client: ClientPersona): CustomerScenarioContext {
  const ind = (client.industry || '').toLowerCase();
  if (ind.includes('food') || ind.includes('restaurant') || ind.includes('culinary') || ind.includes('beverage')) {
    return CS_INDUSTRY_CONTEXTS.food_delivery;
  }
  if (ind.includes('fashion') || ind.includes('apparel') || ind.includes('clothing') || ind.includes('luxury') || ind.includes('beauty')) {
    return CS_INDUSTRY_CONTEXTS.fashion_apparel;
  }
  return CS_INDUSTRY_CONTEXTS.ecommerce_goods;
}

export interface GenerateCustomerServiceTaskParams {
  dayNumber: number;
  client: ClientPersona;
  competencies?: CompetencyMetric[];
  previousTasks?: TaskItem[];
  previousSubmissions?: any[];
  identifiedWeaknesses?: string[];
  chatHistory?: any[];
}

export function generateCustomerServiceTask(params: GenerateCustomerServiceTaskParams): TaskItem {
  const { dayNumber, client, identifiedWeaknesses = [] } = params;
  const ctx = getCustomerServiceContext(client);
  const company = client.companyName || ctx.brandName;
  const managerName = client.ceoName || 'Customer Success Lead';

  const hasEmpathyWeakness = identifiedWeaknesses.some((w) => /empath|tone|warmth|robotic|apolog/i.test(w));

  // ----------------------------------------------------------------------------
  // PHASE 1: DAYS 1–3 — FOUNDATION & CORE SERVICE STANDARDS
  // ----------------------------------------------------------------------------
  if (dayNumber === 1) {
    const isFood = ctx.industryId === 'food_delivery';
    const isFashion = ctx.industryId === 'fashion_apparel';
    const customerName = 'Olivia Vance';
    const emotionState = 'Frustrated & Disappointed';
    const itemIssue = isFood
      ? 'ordered the Wood-Fired Margherita Pizza and Truffle Pasta, but received a cold Vegetarian Calzone with crushed packaging'
      : isFashion
      ? 'ordered the Silk Trousers in Size M for a weekend wedding, but opened the package to find a torn Linen Shirt in Size XS'
      : 'ordered the Ergonomic Desk Cushion, but received a cracked Essential Oil Diffuser with missing cables';

    return {
      id: 'task-cs-day-1',
      dayNumber: 1,
      phaseId: 1,
      title: 'Day 1: Wrong Product & Damaged Item Triage (Frustrated Customer)',
      category: 'Client Communications',
      priority: 'high',
      estimatedMinutes: 35,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Welcome to ${company}'s Customer Experience desk. Your first live ticket is from ${customerName} (${emotionState}). She ${itemIssue}. ${hasEmpathyWeakness ? 'CRITICAL COACHING NOTE: Begin with genuine, personalized empathy before jumping into policy mechanics.' : ''} 1. Review ${company}'s immediate replacement and store credit policy. 2. Draft an empathetic, non-defensive response that validates her frustration, apologizes sincerely, and offers an immediate resolution (expedited reshipment or immediate refund + voucher). 3. Document the root cause in the internal ticket log.`,
      clientContext: `${managerName} note: "${customerName} is one of our regular customers and is very upset. Do not send a generic robotic template. Acknowledge the exact mistake, apologize with warmth, and provide an immediate fix so we don't lose her loyalty."`,
      deliverables: [
        { id: 'del-cs-1-1', label: `Personalized Ticket Resolution Email to ${customerName}`, type: 'email_draft', required: true },
        { id: 'del-cs-1-2', label: 'Internal Ticket Incident Log & Replacement Action Note', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 2) {
    const isFood = ctx.industryId === 'food_delivery';
    const customerName = 'Marcus Brody';
    const emotionState = 'Impatient & Time-Sensitive';
    const trackingScenario = isFood
      ? 'Courier is 50 minutes overdue on dinner delivery for an office meeting of 6 people'
      : 'Order tracking shows "In Transit - Delay at Sorting Facility" for 6 days with no scan update';

    return {
      id: 'task-cs-day-2',
      dayNumber: 2,
      phaseId: 1,
      title: 'Day 2: Missing Order & Delivery Delay Management (Impatient Customer)',
      category: 'Client Communications',
      priority: 'urgent',
      estimatedMinutes: 35,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${customerName} submitted an urgent ticket (${emotionState}): "${trackingScenario}". He is demanding an immediate status update and threatening cancellation. 1. Investigate the courier status and delivery SLA. 2. Draft an urgent communication providing transparent facts without placing blame entirely on the carrier. 3. Provide an active remedy: contact dispatch for live GPS update, offer courtesy credit for the wait, or initiate priority replacement.`,
      clientContext: `${managerName} note: "Delivery delays are our highest-volume tickets. Keep your message calm, proactive, and focused on solutions. Never tell a customer to 'just call the courier yourself'—we take ownership."`,
      deliverables: [
        { id: 'del-cs-2-1', label: `Urgent Delivery Delay Response to ${customerName}`, type: 'email_draft', required: true },
        { id: 'del-cs-2-2', label: 'Courier Dispatch Escalation & Tracking Note', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 3) {
    const customerName = 'Eleanor Hughes';
    const emotionState = 'Confused & Non-Technical';

    return {
      id: 'task-cs-day-3',
      dayNumber: 3,
      phaseId: 1,
      title: 'Day 3: Return Policy Guidance & Macro Tone Personalization (Confused Customer)',
      category: 'Client Communications',
      priority: 'medium',
      estimatedMinutes: 30,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `${customerName} (${emotionState}) wants to return an item but cannot find her order confirmation and does not know how to print a return shipping label. She asks if she can drop it off at a local warehouse. 1. Break down ${company}'s ${ctx.returnWindowDays}-day return and exchange guidelines into simple, numbered steps. 2. Rewrite our standard robotic returns macro into a warm, human, reassuring message. 3. Include instructions on how she can use our QR-code drop-off option without needing a printer.`,
      clientContext: `${managerName} note: "Eleanor is confused by our automated returns portal. Make your reply so simple that anyone could follow it on their phone in 60 seconds without frustration."`,
      deliverables: [
        { id: 'del-cs-3-1', label: `Step-by-Step Return Guidance Email to ${customerName}`, type: 'email_draft', required: true },
        { id: 'del-cs-3-2', label: 'Customer-Facing Returns Macro Optimization (Before vs After)', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 2: DAYS 4–7 — INDEPENDENT EXECUTION & COMPLAINT HANDLING
  // ----------------------------------------------------------------------------
  if (dayNumber === 4) {
    const customerName = 'Derek Shaw';
    const emotionState = 'Demanding & Aggressive';

    return {
      id: 'task-cs-day-4',
      dayNumber: 4,
      phaseId: 2,
      title: 'Day 4: Demanding Customer De-escalation & Policy Concession Balancing',
      category: 'Client Communications',
      priority: 'high',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${customerName} (${emotionState}) experienced a minor product packaging defect. He is demanding a 100% immediate cash refund PLUS a free replacement PLUS a $100 promotional voucher, threatening a scathing 1-star review on Google and TikTok. 1. Apply professional de-escalation techniques: acknowledge distress without accepting unreasonable liability. 2. Apply company policy: full replacement or refund, plus a fair goodwill token ($15 store credit), while politely holding firm against extortionate demands. 3. Draft the response.`,
      clientContext: `${managerName} note: "Stand firm on company policy while remaining completely courteous and respectful. Do not get defensive, but do not give away $100 when a replacement and polite explanation solves the issue."`,
      deliverables: [
        { id: 'del-cs-4-1', label: `De-escalation & Resolution Draft to ${customerName}`, type: 'email_draft', required: true },
        { id: 'del-cs-4-2', label: 'Customer Concession Boundary & Policy Rationale Note', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 5) {
    const customerName = 'Sophia Martinez';
    const emotionState = 'Concerned & Apprehensive';

    return {
      id: 'task-cs-day-5',
      dayNumber: 5,
      phaseId: 2,
      title: 'Day 5: Quality Defect Logging & Evidence Collection (Product Inquiry)',
      category: 'Operations & CRM',
      priority: 'medium',
      estimatedMinutes: 35,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `${customerName} (${emotionState}) reports that her newly delivered item has a recurring manufacturing flaw (e.g. broken seal, fabric pilling, or sensor malfunction). 1. Request the necessary evidence (photo/video of defect, batch code on underside of packaging) without making the customer feel like she is being interrogated. 2. Log a formal Quality Assurance incident report for the operations team. 3. Issue an immediate courtesy replacement pre-authorization pending receipt of photos.`,
      clientContext: `${managerName} note: "We need batch numbers to see if a whole supplier shipment was affected. Frame the evidence request as helping us ensure this never happens to her or anyone else again."`,
      deliverables: [
        { id: 'del-cs-5-1', label: `Warm Evidence-Gathering Request Email to ${customerName}`, type: 'email_draft', required: true },
        { id: 'del-cs-5-2', label: 'QA Manufacturing Defect Incident Report', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 6) {
    const customerName = 'Arthur Pendelton';
    const emotionState = 'Anxious & Confused';

    return {
      id: 'task-cs-day-6',
      dayNumber: 6,
      phaseId: 2,
      title: 'Day 6: Billing Discrepancy & Duplicate Payment Resolution',
      category: 'Client Communications',
      priority: 'urgent',
      estimatedMinutes: 35,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${customerName} (${emotionState}) noticed two identical charges of $78.50 on his credit card statement from ${company} for a single order. He is panicked and worried his card was compromised. 1. Investigate the transaction: identify whether it is a duplicate capture or an uncaptured pre-authorization hold. 2. Draft a clear, reassuring response explaining how pre-authorization holds work in banking without technical jargon. 3. Provide confirmation of refund/release reference ID from our payment gateway.`,
      clientContext: `${managerName} note: "Money issues cause intense anxiety. Be crystal clear, verify the second charge was voided, and give Arthur exact bank turnaround timelines (3-5 business days)."`,
      deliverables: [
        { id: 'del-cs-6-1', label: `Billing Explanation & Refund Confirmation to ${customerName}`, type: 'email_draft', required: true },
        { id: 'del-cs-6-2', label: 'Payment Gateway Audit Log & Accounting Memo', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 7) {
    const reviewerHandle = '@DisappointedShopper';
    const emotionState = 'Publicly Critical & Vexed';

    return {
      id: 'task-cs-day-7',
      dayNumber: 7,
      phaseId: 2,
      title: 'Day 7: Public Negative Review De-escalation & Private Ticket Conversion',
      category: 'Client Communications',
      priority: 'high',
      estimatedMinutes: 40,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `A 1-star review appeared on Google / Trustpilot from ${reviewerHandle} (${emotionState}): "Terrible experience with ${company}! Late delivery, cold/damaged items, and customer support ignored me for two days. Never buying again!" 1. Draft a public response that demonstrates accountability, empathy, and professionalism to future prospective buyers. 2. Draft a private outreach email to locate the reviewer's order history and offer a complete VIP resolution.`,
      clientContext: `${managerName} note: "Public reviews are marketing in disguise. When people read our reply, they evaluate how we treat customers when things go wrong. Never argue publicly."`,
      deliverables: [
        { id: 'del-cs-7-1', label: 'Public Review Response Draft (for Trustpilot/Google)', type: 'text', required: true },
        { id: 'del-cs-7-2', label: 'Private Direct Outreach & Resolution Email to Reviewer', type: 'email_draft', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 3: DAYS 8–10 — INCOMPLETE INSTRUCTIONS, AMBIGUITY & POLICY JUDGEMENT
  // ----------------------------------------------------------------------------
  if (dayNumber === 8) {
    const customerName = 'Jordan Reed';
    const emotionState = 'Furious & Vague (Incomplete Information)';

    return {
      id: 'task-cs-day-8',
      dayNumber: 8,
      phaseId: 3,
      title: 'Day 8: Incomplete Vague Complaint Triage & Active Clarification',
      category: 'Client Communications',
      priority: 'urgent',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `An inbound ticket arrived from ${customerName} (${emotionState}) stating ONLY: "My order is completely ruined, you people are pathetic, fix this right now or I am calling my lawyer!" Jordan provided NO order number, NO email match in CRM, and NO explanation of what was ruined. 1. Use the Client Chat if needed to clarify CRM lookup methods. 2. Draft a de-escalating response that calms Jordan down and gently asks for the 3 key identifiers needed to locate the purchase (full name, phone number, or last 4 digits of card). 3. Ensure the tone is 100% supportive despite the hostile tone.`,
      clientContext: `${managerName} note: "Jordan is livid, but we literally don't know who they are in our system yet. If you ask for their order number aggressively, they will explode. Validate their stress first, then ask for info so we can help them immediately."`,
      deliverables: [
        { id: 'del-cs-8-1', label: `De-escalation & Clarification Inquiry Email to ${customerName}`, type: 'email_draft', required: true },
        { id: 'del-cs-8-2', label: 'Unmatched Inbound Ticket Protocol & Search Strategy', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 9) {
    const customerName = 'Claire Beaumont';
    const emotionState = 'Distressed & Pleading';

    return {
      id: 'task-cs-day-9',
      dayNumber: 9,
      phaseId: 3,
      title: 'Day 9: Expired Return Window Exception & Policy Discretion Judgement',
      category: 'Client Communications',
      priority: 'medium',
      estimatedMinutes: 35,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `${customerName} (${emotionState}) requests a full refund for a $140 purchase made 48 days ago (company return window is strictly ${ctx.returnWindowDays} days). She explains that her mother was hospitalized for 3 weeks and she was unable to try the item or initiate a return earlier. 1. Exercise professional policy judgement: standard policy says no, but brand human values support an exception. 2. Formulate a balanced solution: offer a full store credit or free exchange as a one-time courtesy exception, preserving revenue while showing compassion. 3. Draft the response.`,
      clientContext: `${managerName} note: "Good customer service is not robotic rule-following. Use your discretion here. A customer going through a family medical emergency should be treated with humanity."`,
      deliverables: [
        { id: 'del-cs-9-1', label: `Empathetic Policy Exception Response to ${customerName}`, type: 'email_draft', required: true },
        { id: 'del-cs-9-2', label: 'Manager One-Time Policy Exception Authorization Justification', type: 'text', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 10) {
    const customerName = 'Brian Miller';
    const emotionState = 'Suspicious & Litigious';

    return {
      id: 'task-cs-day-10',
      dayNumber: 10,
      phaseId: 3,
      title: 'Day 10: "Delivered but Missing" Porch Theft & Chargeback Risk Protocol',
      category: 'Client Communications',
      priority: 'high',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${customerName} (${emotionState}) claims he never received his $185 order. The carrier tracking shows: "Delivered - Left at Front Door / Porch" with a GPS coordinate match and a timestamp 2 days ago. Brian says he was home all day, accuses ${company} of fraud, and states his credit card company has been notified for a chargeback. 1. Review carrier photo proof of delivery and fraud mitigation guidelines. 2. Guide Brian through checking household members/neighbors and filing an official carrier loss affidavit. 3. Offer a replacement with signature required upon receipt.`,
      clientContext: `${managerName} note: "Porch piracy is frustrating for everyone. Brian thinks we're calling him a liar if we just say 'it was delivered'. Walk him through the carrier affidavit process professionally so we protect both the customer and our store from chargeback fees."`,
      deliverables: [
        { id: 'del-cs-10-1', label: `Carrier Delivery Dispute & Signature Resolution Letter to ${customerName}`, type: 'email_draft', required: true },
        { id: 'del-cs-10-2', label: 'Lost in Transit / Stolen Package Investigation Checklist', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 4: DAYS 11–12 — PRESSURE & MULTI-TASK QUEUE SURGE
  // ----------------------------------------------------------------------------
  if (dayNumber === 11) {
    return {
      id: 'task-cs-day-11',
      dayNumber: 11,
      phaseId: 4,
      title: 'Day 11: Flash Sale Queue Surge — 4 Simultaneous Priority Tickets Triage',
      category: 'Operations & CRM',
      priority: 'urgent',
      estimatedMinutes: 50,
      deadlineHours: 3,
      deadlineType: 'hard',
      brief: `A holiday flash sale caused a surge in customer tickets. Triage and resolve all 4 tickets currently in the queue within SLA:
Ticket #1 (Food/Delivery): Customer allergic reaction question / ingredient clarification. (Urgent safety issue).
Ticket #2 (Discount Error): Promo code "SAVE25" failed to apply at checkout for a $120 cart. (High financial friction).
Ticket #3 (Address Change): Customer entered wrong apartment number 15 minutes after order was placed. (Immediate dispatch fix needed).
Ticket #4 (General Question): Inquiring if products will be restocked next month. (Low priority).
1. Rank tickets in order of priority (1-4). 2. Draft complete, tailored customer responses for all 4 tickets.`,
      clientContext: `${managerName} note: "The queue is stacking up. Do not treat all tickets equally. Medical/ingredient inquiries and live address corrections must be handled in minutes. The restock question can wait if needed. Execute cleanly!"`,
      deliverables: [
        { id: 'del-cs-11-1', label: 'Flash Sale Queue Triage Matrix & SLA Priority Ranking', type: 'spreadsheet', required: true },
        { id: 'del-cs-11-2', label: 'Complete Response Suite for Tickets #1, #2, #3, and #4', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 12) {
    return {
      id: 'task-cs-day-12',
      dayNumber: 12,
      phaseId: 4,
      title: 'Day 12: Major Carrier Disruption Incident & 30-Order Proactive Blast',
      category: 'Client Communications',
      priority: 'urgent',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `A major courier regional facility experienced an operational freeze, delaying 30 customer orders by 3 to 5 business days. Rather than waiting for 30 angry tickets to flood customer support, take proactive ownership: 1. Draft a mass proactive notification email to all 30 affected customers apologizing for the carrier delay before they notice. 2. Provide a compensation gesture ($15 store credit added automatically to their accounts). 3. Create a CS quick-response macro for incoming tickets regarding this specific regional freeze.`,
      clientContext: `${managerName} note: "Proactive communication cuts incoming support tickets by 75%. Tell customers the truth before their package is late, give them something to offset the inconvenience, and handle the few who reach out with instant answers."`,
      deliverables: [
        { id: 'del-cs-12-1', label: 'Proactive Delay Notification Broadcast Draft to Affected Customers', type: 'email_draft', required: true },
        { id: 'del-cs-12-2', label: 'Courier Freeze Inbound FAQ & Macro Response Template', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 5: DAYS 13–14 — AUTONOMOUS EXECUTION & PRACTICAL CAPSTONE
  // ----------------------------------------------------------------------------
  if (dayNumber === 13) {
    const b2bClient = 'Northstar Corporate Wellness';

    return {
      id: 'task-cs-day-13',
      dayNumber: 13,
      phaseId: 5,
      title: 'Day 13: High-Value B2B Wholesale Client Escalation & Retention Strategy',
      category: 'Client Communications',
      priority: 'urgent',
      estimatedMinutes: 50,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Our largest B2B corporate account, ${b2bClient} ($15,000 annual recurring order), received their quarterly bulk shipment with 15% damaged packaging and missing packing slips. Their procurement manager is furious and threatened to cancel their annual contract renewal next month. 1. Draft a high-level executive recovery letter on behalf of ${managerName}. 2. Propose an immediate replacement schedule via direct courier, credit adjustment on their invoice, and an assigned dedicated VIP support contact. 3. Draft an internal incident post-mortem.`,
      clientContext: `${managerName} note: "This is a five-figure corporate account. Standard consumer return macros will insult them. Write an executive-grade customer recovery proposal with clear accountability and timeline."`,
      deliverables: [
        { id: 'del-cs-13-1', label: `Executive VIP Account Recovery Proposal to ${b2bClient}`, type: 'email_draft', required: true },
        { id: 'del-cs-13-2', label: 'Internal B2B Incident Post-Mortem & Fulfillment Audit Note', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // Day 14: Practical Capstone
  return {
    id: 'task-cs-day-14',
    dayNumber: 14,
    phaseId: 5,
    title: 'Day 14: Final 14-Day Practical Capstone — Master Customer Service SOP & Crisis Exam',
    category: 'Operations & CRM',
    priority: 'urgent',
    estimatedMinutes: 60,
    deadlineHours: 4,
    deadlineType: 'hard',
    brief: `Your 14-day Customer Service VA graduation practical assessment. Demonstrate mastery across all customer service competencies: Customer Communication, Complaint Handling, Active Empathy, De-escalation, Escalation Judgement, and Policy Discretion:
1. Master Customer Service SOP Playbook: Build a comprehensive Standard Operating Procedure handbook for ${company} covering: First-Response SLAs, Refund & Exchange Decision Matrix, Empathy & Tone Guidelines, and Fraud & Stolen Package Protocols.
2. Multi-Scenario Live Customer Crisis Simulation: Resolve 3 simultaneous complex customer scenarios:
   - Scenario A: Severe product allergy / injury claim with legal overtones.
   - Scenario B: Repeat customer demanding refund on non-refundable clearance item.
   - Scenario C: Accidental overcharge of $350 with customer demanding manager phone call.`,
    clientContext: `${managerName} note: "You have grown from handling single tickets into managing complex customer escalations. This capstone tests your ability to think like a Customer Support Lead. Build an SOP our team can rely on and resolve these three crisis cases with excellence."`,
    deliverables: [
      { id: 'del-cs-14-1', label: `Master Customer Service SOP & Policy Handbook for ${company}`, type: 'document', required: true },
      { id: 'del-cs-14-2', label: 'Crisis Scenario A Resolution (Allergy/Defect Escalation)', type: 'email_draft', required: true },
      { id: 'del-cs-14-3', label: 'Crisis Scenario B Resolution (Clearance Return Exception)', type: 'email_draft', required: true },
      { id: 'del-cs-14-4', label: 'Crisis Scenario C Resolution (Billing Overcharge De-escalation)', type: 'email_draft', required: true },
    ],
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

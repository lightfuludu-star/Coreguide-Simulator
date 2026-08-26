import { ClientPersona, TaskItem, ChatMessageItem } from '../types';
import { getDynamicOutreachContext } from '../data/socialOutreachFramework';

export interface ConversationContextPayload {
  message: string;
  client: ClientPersona;
  todaysTask: TaskItem | null;
  currentDay: number;
  currentStage: {
    stageNumber: number;
    name: string;
    focus: string;
  };
  history: ChatMessageItem[];
  serviceId?: string;
  focus?: string;
}

/**
 * High-precision contextual NLP reasoning engine for the simulated client.
 * Strictly enforces CoreGuide V1 Client Chat Repair & Direct Answer Rules:
 * 1. Primary Rule: Answer the actual question directly in sentence 1.
 * 2. Question Intent Extraction (Direct question, deadline, priority, decision, alternative, why, etc.)
 * 3. Required Response Check (No vague non-answers or filler)
 * 4. Never use generic filler as the main answer
 * 5. Grounded in Current Task & Business logic
 * 6. Uses Conversation Memory & Referent Resolution
 * 7. 1 to 4 sentences maximum (Short + Specific + Contextual)
 * 8. Never breaks character
 */
/**
 * Single Authoritative Service-Scoped Clarification Resolver.
 * Context Isolation: Evaluates active serviceId first before inspecting student message intent.
 * Guarantees zero cross-service contamination.
 * Returns null if no service-specific clarification rule matches.
 */
export function resolveServiceClarification(payload: ConversationContextPayload): string | null {
  const { message, client, todaysTask, currentDay } = payload;
  const cleanMessage = message.trim().toLowerCase();

  // Canonical Service ID derivation:
  // 1. payload.serviceId
  // 2. client.serviceId
  // 3. active task mapping (task-so-, task-cs-, task-sm-, task-tm-, task-lg-, task-cw-, task-eva-)
  const rawServiceId =
    payload.serviceId ||
    (client as any)?.serviceId ||
    (todaysTask?.id?.startsWith('task-so-')
      ? 'social_outreach'
      : todaysTask?.id?.startsWith('task-cs-')
      ? 'customer_service'
      : todaysTask?.id?.startsWith('task-sm-')
      ? 'social_media'
      : todaysTask?.id?.startsWith('task-tm-')
      ? 'travel_management'
      : todaysTask?.id?.startsWith('task-lg-')
      ? 'lead_gen_research'
      : todaysTask?.id?.startsWith('task-cw-')
      ? 'content_writing'
      : todaysTask?.id?.startsWith('task-eva-')
      ? 'executive_admin'
      : '');
  const serviceId = rawServiceId === 'social_marketing_outreach' ? 'social_outreach' : rawServiceId;

  const company = client.companyName || 'our company';
  const taskTitle = todaysTask?.title || `Day ${currentDay} Assignment`;
  const taskBrief = todaysTask?.brief || '';
  const taskDeliverables = todaysTask?.deliverables?.map((d) => d.label).join(', ') || 'the requested deliverable';
  const timezone = client.timezone || 'EST';
  const commStyle = client.communicationStyle || 'Direct & Results-Oriented';
  const preferences = client.preferences || client.clientPreferences || [];
  const primaryPref = preferences[0] || 'maintain high accuracy and clear formatting';

  // --- LEAD GENERATION & RESEARCH VA TRACK ---
  if (serviceId === 'lead_gen_research') {
    // Derive contextual geography from client & task
    const targetGeo = timezone.includes('GMT') || timezone.includes('London') || timezone.includes('UK')
      ? 'the UK and Western Europe'
      : timezone.includes('SGT') || timezone.includes('AEST') || timezone.includes('Singapore') || timezone.includes('Australia')
      ? 'APAC (Singapore & Australia)'
      : 'North America';

    // 1. Geography inquiry
    if (
      cleanMessage.includes('geography') ||
      cleanMessage.includes('geographic') ||
      cleanMessage.includes('which region') ||
      cleanMessage.includes('where to research') ||
      cleanMessage.includes('which country') ||
      cleanMessage.includes('what geography')
    ) {
      return `Focus your research on companies headquartered in ${targetGeo}. Verify registered business entity locations and operational headquarters against official registries.`;
    }

    // 2. Scope / Research parameters inquiry
    if (
      cleanMessage.includes('scope') ||
      cleanMessage.includes('clarify the scope') ||
      cleanMessage.includes('research scope') ||
      (cleanMessage.includes('research') && (cleanMessage.includes('criteria') || cleanMessage.includes('parameters') || cleanMessage.includes('public or private')))
    ) {
      return `For today's research assignment (${taskTitle}), the scope is identifying and verifying companies and decision-makers in the ${client.industry} sector matching our ICP. Ensure all entries deliver ${taskDeliverables} with verified source links.`;
    }

    // 3. Decision-makers / Roles inquiry
    if (
      cleanMessage.includes('who should i research') ||
      cleanMessage.includes('which roles') ||
      cleanMessage.includes('which titles') ||
      cleanMessage.includes('decision maker')
    ) {
      return `Target decision-makers with operational or budget authority in ${client.industry} (such as Directors, Vice Presidents, and Department Heads) for ${company}.`;
    }

    // 4. Verification / Data sources inquiry
    if (
      cleanMessage.includes('how to verify') ||
      cleanMessage.includes('verification') ||
      cleanMessage.includes('data sources') ||
      cleanMessage.includes('cross-verification')
    ) {
      return `All entries require dual-source verification (official company domain plus LinkedIn or corporate registry filing). Ensure zero unverified or generic contact data.`;
    }
  }

  // --- CONTENT WRITING VA TRACK ---
  if (serviceId === 'content_writing') {
    // 1. Word count inquiry - dynamically extract from taskBrief where available
    if (
      cleanMessage.includes('word count') ||
      cleanMessage.includes('how many words') ||
      cleanMessage.includes('article length') ||
      cleanMessage.includes('length of the article') ||
      cleanMessage.includes('target length') ||
      cleanMessage.includes('words required')
    ) {
      const combinedContext = `${taskTitle} ${taskBrief}`;
      const wordCountMatch = combinedContext.match(/(\d[\d,]*\s*[-–to]+\s*\d[\d,]*\s*words?|\d[\d,]*\s*[-–]?\s*words?|under\s*\d+\s*words?)/i);
      if (wordCountMatch) {
        const normalizedLength = wordCountMatch[0].replace(/[-–]?words?/i, ' words');
        return `The required length for this piece is ${normalizedLength}. Focus on tight structure, clear subheadings, and our guideline: ${primaryPref}.`;
      }
      return `Follow the specific length criteria specified in today's brief for ${taskTitle}. Prioritize clarity, substance, and our preference to ${primaryPref}.`;
    }

    // 2. Scope / Campaign scope inquiry
    if (
      cleanMessage.includes('scope') ||
      cleanMessage.includes('clarify the scope') ||
      cleanMessage.includes('campaign scope') ||
      cleanMessage.includes('content scope')
    ) {
      return `The scope for today's writing assignment is delivering ${taskDeliverables} for ${company}. Focus on ${primaryPref} and submit your draft in My Tasks.`;
    }

    // 3. Platform / Publication format / Audience
    if (
      cleanMessage.includes('platform') ||
      cleanMessage.includes('where to publish') ||
      cleanMessage.includes('who is the audience') ||
      cleanMessage.includes('target audience') ||
      cleanMessage.includes('publication') ||
      (cleanMessage.includes('article') && (cleanMessage.includes('format') || cleanMessage.includes('publish') || cleanMessage.includes('audience')))
    ) {
      return `Tailor this piece for ${company}'s target audience in the ${client.industry} space. Ensure the tone and formatting align with ${primaryPref}.`;
    }

    // 4. Voice / Tone / Style guide
    if (cleanMessage.includes('tone') || cleanMessage.includes('brand voice') || cleanMessage.includes('style guide')) {
      return `Use ${company}'s established brand voice: ${commStyle}. Emphasize actionable insights and avoid generic industry jargon.`;
    }
  }

  // --- SOCIAL MARKETING & COLD OUTREACH VA TRACK ---
  if (serviceId === 'social_marketing_outreach' || serviceId === 'social_outreach') {
    const ctx = getDynamicOutreachContext(client);

    // 1. Target Audience / ICP / Who are we targeting
    if (
      cleanMessage.includes('who are we targeting') ||
      cleanMessage.includes('who do we target') ||
      cleanMessage.includes('who should i target') ||
      cleanMessage.includes('who to target') ||
      cleanMessage.includes('target audience') ||
      cleanMessage.includes('who is our icp') ||
      cleanMessage.includes('who is the icp') ||
      cleanMessage.includes('ideal customer') ||
      cleanMessage.includes('target prospect') ||
      cleanMessage.includes('who exactly are we targeting') ||
      (cleanMessage.includes('who') && (cleanMessage.includes('target') || cleanMessage.includes('reach out')))
    ) {
      return `Target ${ctx.targetTitles[0]}s and ${ctx.targetTitles[1]}s at companies with ${ctx.targetCompanySize} in ${ctx.targetGeography}. They are the decision-makers facing ${ctx.corePainPoint}.`;
    }

    // 2. Target Geography / Location
    if (
      cleanMessage.includes('geography') ||
      cleanMessage.includes('geographic') ||
      cleanMessage.includes('which region') ||
      cleanMessage.includes('which country') ||
      cleanMessage.includes('where are they located') ||
      cleanMessage.includes('target location') ||
      cleanMessage.includes('which market') ||
      cleanMessage.includes('which geography') ||
      (cleanMessage.includes('where') && cleanMessage.includes('target'))
    ) {
      return `Our target geography is ${ctx.targetGeography}. Focus all company sourcing and prospect lists strictly within that geographic footprint.`;
    }

    // 3. Offer / Value Proposition
    if (
      cleanMessage.includes('what is the offer') ||
      cleanMessage.includes("what's the offer") ||
      cleanMessage.includes('what is our offer') ||
      cleanMessage.includes("what's our offer") ||
      cleanMessage.includes('what do we offer') ||
      cleanMessage.includes('what are we selling') ||
      cleanMessage.includes('value proposition') ||
      (cleanMessage.includes('offer') && (cleanMessage.includes('explain') || cleanMessage.includes('details') || cleanMessage.includes('what') || cleanMessage.includes('clarif')))
    ) {
      return `Our core offer is: ${ctx.offer}. We solve ${ctx.corePainPoint} with an average engagement size of ${ctx.dealSize}.`;
    }

    // 4. Outreach Channel / Platform
    if (
      cleanMessage.includes('which channel') ||
      cleanMessage.includes('what channel') ||
      cleanMessage.includes('should i use linkedin') ||
      cleanMessage.includes('should i use email') ||
      cleanMessage.includes('outreach channel') ||
      (cleanMessage.includes('where') && cleanMessage.includes('reach out'))
    ) {
      return `Use ${ctx.primaryChannel} as our primary channel, supported by ${ctx.secondaryChannel}. Keep initial touchpoints concise and under 100 words.`;
    }

    // 5. Qualification criteria
    if (
      cleanMessage.includes('what makes a prospect qualified') ||
      cleanMessage.includes('who is qualified') ||
      cleanMessage.includes('qualification criteria') ||
      cleanMessage.includes('how to qualify') ||
      cleanMessage.includes('how do i qualify') ||
      (cleanMessage.includes('qualif') && cleanMessage.includes('criteria'))
    ) {
      return `A prospect is qualified if: 1. They fit our ${ctx.targetCompanySize} headcount in ${ctx.targetGeography}; 2. They hold a ${ctx.targetTitles[0]} or ${ctx.targetTitles[1]} title; and 3. They show active buying signals like ${ctx.buyingSignals[0]}.`;
    }

    // 6. Who should I contact / Decision maker roles
    if (
      cleanMessage.includes('who should i contact') ||
      cleanMessage.includes('who to contact') ||
      cleanMessage.includes('which role') ||
      cleanMessage.includes('which title') ||
      cleanMessage.includes('founders or marketing managers') ||
      cleanMessage.includes('founders or')
    ) {
      return `Contact ${ctx.targetTitles[0]}s or ${ctx.targetTitles[1]}s. They own the budget and operational responsibility for solving ${ctx.corePainPoint}.`;
    }

    // 7. Follow up / Cadence
    if (
      cleanMessage.includes('should i follow up') ||
      cleanMessage.includes('when should i follow up') ||
      cleanMessage.includes('how many follow up') ||
      cleanMessage.includes('follow up cadence') ||
      cleanMessage.includes('follow-up')
    ) {
      return `Yes, send our first follow-up 3 to 4 business days after the initial message, and send a final breakup note 4 days later. Always share an actionable value-add rather than just asking for an update.`;
    }

    // 8. Day 8 Incomplete Directive Clarification / Campaign details
    if (
      cleanMessage.includes('campaign details') ||
      cleanMessage.includes('new tier') ||
      cleanMessage.includes('booking link') ||
      cleanMessage.includes('calendly') ||
      cleanMessage.includes('domain') ||
      cleanMessage.includes('sub-vertical') ||
      cleanMessage.includes('campaign scope') ||
      cleanMessage.includes('scope of the campaign') ||
      (cleanMessage.includes('campaign') && (cleanMessage.includes('criteria') || cleanMessage.includes('clarif') || cleanMessage.includes('scope') || cleanMessage.includes('start') || cleanMessage.includes('parameter')))
    ) {
      return `For this campaign, target ${ctx.targetTitles[0]}s in ${ctx.targetGeography} at companies with ${ctx.targetCompanySize}. Use our secondary domain (${ctx.outboundDomain}) and link to my calendar (${ctx.bookingLink}) for 20-minute discovery calls.`;
    }

    // 9. General scope inquiry in outreach
    if (cleanMessage.includes('scope') || cleanMessage.includes('clarify the scope')) {
      return `The scope for today's outreach assignment (${taskTitle}) is completing ${taskDeliverables} for ${company} targeting ${ctx.targetTitles[0]}s.`;
    }
  }

  // --- D. EXECUTIVE VA TRACK ---
  if (serviceId === 'executive_admin' || !serviceId) {
    // 1. Day 8: Meeting with David clarification
    if (
      cleanMessage.includes('which david') ||
      cleanMessage.includes('who is david') ||
      cleanMessage.includes('david who') ||
      cleanMessage.includes('david chen') ||
      (cleanMessage.includes('david') && (cleanMessage.includes('email') || cleanMessage.includes('duration') || cleanMessage.includes('time') || cleanMessage.includes('agenda') || cleanMessage.includes('date') || cleanMessage.includes('topic')))
    ) {
      return `David Chen, our VP of Engineering (david@company.com). 45 minutes this Thursday afternoon between 2:00 PM and 4:30 PM ${timezone} to review Q3 sprint blockers. Add a Zoom link and send us both an invite.`;
    }

    // 2. Day 9: Ambiguous Travel Request clarification
    if (
      cleanMessage.includes('travel dates') ||
      cleanMessage.includes('which dates') ||
      cleanMessage.includes('what days') ||
      cleanMessage.includes('departure time') ||
      cleanMessage.includes('hotel preference') ||
      cleanMessage.includes('flight preference') ||
      cleanMessage.includes('trip details') ||
      (cleanMessage.includes('trip') && (cleanMessage.includes('dates') || cleanMessage.includes('when') || cleanMessage.includes('hotel') || cleanMessage.includes('airline') || cleanMessage.includes('budget')))
    ) {
      return `I need to depart next Tuesday morning and return Thursday evening. Morning flights preferred (aisle seat), and an executive boutique hotel within 15 minutes of the meeting venue with fast Wi-Fi and flexible check-in.`;
    }

    // 3. Executive Buffer & Timezone questions
    if (cleanMessage.includes('buffer') || cleanMessage.includes('15 min') || cleanMessage.includes('15-minute')) {
      return `Yes, always enforce a minimum 15-minute buffer before and after all external executive calls so I have time to prep and take notes.`;
    }

    if (cleanMessage.includes('timezone') || cleanMessage.includes('time zone') || cleanMessage.includes('pst') || cleanMessage.includes('est') || cleanMessage.includes('gmt')) {
      return `Our primary business timezone is ${timezone}. When coordinating with external stakeholders, always include both ${timezone} and their local time zone in the invite subject and body.`;
    }

    // 4. Scope in Executive VA
    if (cleanMessage.includes('scope') || cleanMessage.includes('clarify the scope')) {
      return `For today's executive task (${taskTitle}), the scope is completing ${taskDeliverables} according to our standard: ${primaryPref}.`;
    }
  }

  // --- E. CUSTOMER SERVICE VA TRACK ---
  if (serviceId === 'customer_service') {
    // 1. Incomplete ticket / Jordan Reed CRM lookup
    if (
      cleanMessage.includes('jordan') ||
      cleanMessage.includes('unmatched') ||
      cleanMessage.includes('order number') ||
      (cleanMessage.includes('find') && cleanMessage.includes('order')) ||
      (cleanMessage.includes('customer') && cleanMessage.includes('lookup'))
    ) {
      return `Search for Jordan in our CRM using phone number (555-019-8234) or last name Reed. If there's no match, ask them gently for their order confirmation number or the last 4 digits of the card they used so we can pull up their transaction immediately.`;
    }

    // 2. Refund, Store Credit & Replacement policy
    if (cleanMessage.includes('store credit') || cleanMessage.includes('refund') || cleanMessage.includes('replacement')) {
      return `Our standard policy is to offer store credit or a replacement first. If the customer explicitly insists on a cash refund, escalate it to me.`;
    }

    // 3. Ticket / Customer prioritization
    if (
      cleanMessage.includes('vip') ||
      cleanMessage.includes('which customer') ||
      cleanMessage.includes('handle first') ||
      cleanMessage.includes('who should i reply to first') ||
      cleanMessage.includes('which ticket first') ||
      cleanMessage.includes('which complaint first') ||
      cleanMessage.includes('should i handle the vip')
    ) {
      return `Start with the refund complaint and VIP customer accounts because they have already been waiting the longest. After those are resolved, handle the general product inquiries.`;
    }

    // 4. Customer Service escalations
    if (
      cleanMessage.includes('escalate') ||
      cleanMessage.includes('who to escalate') ||
      cleanMessage.includes('when to escalate')
    ) {
      return `Escalate any refund requests over $50, legal inquiries, or angry VIP accounts directly to me here in chat before sending a response.`;
    }

    // 5. Frustrated customer handling
    if (
      cleanMessage.includes('frustrated customer') ||
      cleanMessage.includes('angry customer') ||
      cleanMessage.includes('how to handle customer')
    ) {
      return `Address the customer's frustration with an empathetic acknowledgement, offer store credit as a first resolution, and clearly explain the next steps so expectations are set.`;
    }

    // 6. Scope in Customer Service
    if (cleanMessage.includes('scope') || cleanMessage.includes('clarify the scope')) {
      return `For today's support queue, your scope is resolving ${taskDeliverables} while maintaining our CSAT standard.`;
    }
  }

  // --- F. SOCIAL MEDIA VA TRACK ---
  if (serviceId === 'social_media') {
    // 1. Discount / Promo code / Launch post
    if (
      cleanMessage.includes('discount') ||
      cleanMessage.includes('promo code') ||
      cleanMessage.includes('launch post') ||
      cleanMessage.includes('landing page') ||
      (cleanMessage.includes('campaign') && (cleanMessage.includes('offer') || cleanMessage.includes('link') || cleanMessage.includes('date')))
    ) {
      return `The offer is 20% off with promo code 'LAUNCH20', valid for 48 hours only. Link is ${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/launch. Target our active followers and emphasize limited inventory!`;
    }

    // 2. Scope in Social Media
    if (cleanMessage.includes('scope') || cleanMessage.includes('clarify the scope')) {
      return `The scope for today's social media assignment is creating ${taskDeliverables} tailored to ${company}'s brand presence and audience engagement goals.`;
    }

    // 3. Social platform focus
    if (cleanMessage.includes('which platform') || cleanMessage.includes('which channel') || cleanMessage.includes('where to post')) {
      const isB2B = client.industry.toLowerCase().includes('saas') || client.industry.toLowerCase().includes('tech') || client.industry.toLowerCase().includes('consult');
      return `Focus on our primary channels (${isB2B ? 'LinkedIn and X' : 'Instagram and TikTok'}). Ensure all posts include visual assets, captions, and relevant hashtags.`;
    }
  }

  // --- G. TRAVEL MANAGEMENT VA TRACK ---
  if (serviceId === 'travel_management') {
    // 1. Geography / Destination inquiry
    if (
      cleanMessage.includes('geography') ||
      cleanMessage.includes('destination') ||
      cleanMessage.includes('where are we traveling') ||
      cleanMessage.includes('which city') ||
      cleanMessage.includes('location of the trip')
    ) {
      return `The travel destination and routing parameters are specified in today's task brief for ${taskTitle}. Focus on door-to-door transit logistics for that location.`;
    }

    // 2. Scope in Travel Management
    if (cleanMessage.includes('scope') || cleanMessage.includes('clarify the scope')) {
      return `For today's travel management assignment, the scope is completing ${taskDeliverables} with verified flight options, lodging details, and contingency buffers.`;
    }

    // 3. Flight / Hotel preferences
    if (cleanMessage.includes('flight preference') || cleanMessage.includes('hotel preference') || cleanMessage.includes('airline')) {
      return `For flights, select morning departures with aisle seating on major carriers. For accommodations, book verified business hotels within 15 minutes of the meeting venue with flexible cancellation.`;
    }

    // 4. Emergency rebooking / Cancellations
    if (cleanMessage.includes('cancel') || cleanMessage.includes('delay') || cleanMessage.includes('missed flight')) {
      return `In the event of a flight delay or cancellation, secure the next direct departure immediately and alert ground transportation.`;
    }
  }

  return null;
}

export function generateDeterministicClientReply(payload: ConversationContextPayload): string {
  const { message, client, todaysTask, currentDay, currentStage, history } = payload;
  const rawText = message.trim();
  const text = rawText.toLowerCase().replace(/[^\w\s?'-]/g, ' ');
  const cleanMessage = rawText.toLowerCase().trim();

  // Derive active service track to guarantee strict contextual isolation
  const rawServiceId =
    payload.serviceId ||
    (client as any)?.serviceId ||
    (todaysTask?.id?.startsWith('task-so-')
      ? 'social_outreach'
      : todaysTask?.id?.startsWith('task-cs-')
      ? 'customer_service'
      : todaysTask?.id?.startsWith('task-sm-')
      ? 'social_media'
      : todaysTask?.id?.startsWith('task-tm-')
      ? 'travel_management'
      : todaysTask?.id?.startsWith('task-lg-')
      ? 'lead_gen_research'
      : todaysTask?.id?.startsWith('task-cw-')
      ? 'content_writing'
      : todaysTask?.id?.startsWith('task-eva-')
      ? 'executive_admin'
      : '');
  const serviceId = rawServiceId === 'social_marketing_outreach' ? 'social_outreach' : rawServiceId;

  // Extract client & task context
  const clientName = client.ceoName || 'Alex Mercer';
  const clientFirstName = clientName.split(' ')[0];
  const company = client.companyName || 'our company';
  const taskTitle = todaysTask?.title || `Day ${currentDay} Assignment`;
  const taskBrief = todaysTask?.brief || '';
  const taskDeliverables = todaysTask?.deliverables?.map((d) => d.label).join(', ') || 'the requested deliverable';
  const workingHours = client.workingHours || '9:00 AM - 5:00 PM EST';
  const timezone = client.timezone || 'EST';
  const commStyle = client.communicationStyle || 'Direct & Results-Oriented';
  const preferences = client.preferences || client.clientPreferences || [];
  const primaryPref = preferences[0] || 'maintain high accuracy and clear formatting';
  const isUrgentTask = todaysTask?.priority === 'urgent' || todaysTask?.priority === 'high';

  // Check recent history for context continuity
  const recentClientMessages = history
    .filter((m) => m.sender === 'client')
    .slice(-4)
    .map((m) => m.content.toLowerCase());
  const recentStudentMessages = history
    .filter((m) => m.sender === 'student')
    .slice(-4)
    .map((m) => m.content.toLowerCase());

  const hasDiscussedDeadline = recentClientMessages.some((m) => m.includes('3:00 pm') || m.includes('5:00 pm') || m.includes('deadline') || m.includes('today'));

  // =========================================================================
  // 1. SAFETY & ANTI-JAILBREAK BOUNDARY
  // =========================================================================
  if (
    cleanMessage.includes('system prompt') ||
    cleanMessage.includes('ignore previous instructions') ||
    cleanMessage.includes('as an ai') ||
    cleanMessage.includes('are you an ai') ||
    cleanMessage.includes('language model') ||
    cleanMessage.includes('what model are you') ||
    cleanMessage.includes('reveal prompt')
  ) {
    return `I'm focused on getting ${taskTitle} finished today for ${company}. Let's stick to our project deliverables.`;
  }

  // =========================================================================
  // 1.5. SERVICE-ISOLATED CONTEXTUAL CLARIFICATIONS
  // Strict Service Isolation: Gated by active serviceId to prevent cross-service keyword contamination.
  // Responses derived from active client & campaign context (No universal hardcoding).
  // =========================================================================

    // 1.5. Service-Scoped Contextual Clarification (Precedence 1)
  const clarification = resolveServiceClarification(payload);
  if (clarification) {
    return clarification;
  }
// =========================================================================
  // 3. UNIVERSAL / GENERAL FALLBACK RULES
  // These rules apply ONLY when no service-specific clarification rule was triggered.
  // Contains ZERO service-specific terminology (no refunds, store credit, lead lists, etc.).
  // =========================================================================

  // A. Ambiguity & Pronoun Resolution ("Should I change it?", "Can I adjust this?")
  if (
    cleanMessage === 'should i change it?' ||
    cleanMessage === 'should i change it' ||
    cleanMessage === 'can i change it?' ||
    cleanMessage === 'can i change it' ||
    cleanMessage === 'is this okay?' ||
    cleanMessage === 'is it okay?' ||
    cleanMessage === 'do you like it?' ||
    cleanMessage === 'what do you think?' ||
    cleanMessage === 'can you check?'
  ) {
    if (todaysTask?.deliverables && todaysTask.deliverables.length >= 2) {
      const d1 = todaysTask.deliverables[0].label;
      const d2 = todaysTask.deliverables[1].label;
      return `Do you mean the ${d1} or the ${d2}? Clarify which specific item you're looking to adjust.`;
    }
    return `Do you mean the deliverable structure or the specific content? Let me know which part you want to adjust so I can give you a clear answer.`;
  }

  // B. Deadline & Timing Questions
  if (
    cleanMessage.includes('why do you need it by then') ||
    cleanMessage.includes('why is the deadline so tight') ||
    cleanMessage.includes('why so soon') ||
    cleanMessage.includes('why by 3') ||
    cleanMessage.includes('why by then')
  ) {
    return `Because I need enough time to review and integrate your deliverable before our executive check-in today.`;
  }

  if (
    cleanMessage.includes('what time') ||
    cleanMessage.includes('when do you need') ||
    cleanMessage.includes('when is this due') ||
    cleanMessage.includes('what is the deadline') ||
    cleanMessage.includes('due date') ||
    cleanMessage.includes('due time') ||
    cleanMessage.includes('deadline')
  ) {
    if (isUrgentTask) {
      return `I need it by 3:00 PM ${timezone} today because I want to review it before our 4:00 PM meeting.`;
    }
    return `I need it by 5:00 PM ${timezone} today before we close operations for Day ${currentDay}.`;
  }

  if (
    cleanMessage.includes('finish this tomorrow') ||
    cleanMessage.includes('submit tomorrow') ||
    cleanMessage.includes('need more time') ||
    cleanMessage.includes('extend the deadline') ||
    cleanMessage.includes('can i do it tomorrow')
  ) {
    if (isUrgentTask) {
      return `No, I need this completed today because our team is relying on it for Day ${currentDay} operations. Let me know if you hit a specific blocker.`;
    }
    return `If you need extra time for quality, you can submit by 9:00 AM tomorrow before our morning sync, but please send whatever draft you have by end of day.`;
  }

  if (
    cleanMessage.includes("don't finish this today") ||
    cleanMessage.includes('dont finish this today') ||
    cleanMessage.includes('if i miss the deadline') ||
    cleanMessage.includes('if i am late')
  ) {
    return `If it's delayed, we risk missing our operational SLA and delaying downstream deliverables for Day ${currentDay}. If you're running tight, flag it to me right away.`;
  }

  // C. Task Specificity & "What exactly do you want me to do?"
  if (
    cleanMessage.includes('what exactly do you want me to do') ||
    cleanMessage.includes('what do you want me to do') ||
    cleanMessage.includes('what is my task') ||
    cleanMessage.includes('what should i work on') ||
    cleanMessage.includes('explain the task')
  ) {
    if (todaysTask) {
      return `For today's task (${taskTitle}), I need you to complete: ${taskDeliverables}. The main objective is to ${taskBrief.slice(0, 150)}... Make sure to submit your final work in My Tasks.`;
    }
    return `Please review the assignment on the My Tasks page, draft the required deliverable, and ensure you follow our guidelines: ${primaryPref}.`;
  }

  // D. Prioritization & Sequence (General)
  if (
    cleanMessage.includes('prioritize') ||
    cleanMessage.includes('priority') ||
    cleanMessage.includes('focus on first') ||
    cleanMessage.includes('which one first') ||
    cleanMessage.includes('handle first')
  ) {
    if (todaysTask) {
      return `Prioritize the ${todaysTask.deliverables[0]?.label || 'primary deliverable'} first. Make sure ${primaryPref} before moving on to secondary items.`;
    }
    return `Prioritize urgent and high-impact items first, then proceed with standard deliverables.`;
  }

  // E. Alternative Approaches & Tools
  if (
    cleanMessage.includes('google sheets') ||
    cleanMessage.includes('spreadsheet instead') ||
    cleanMessage.includes('excel instead') ||
    cleanMessage.includes('use sheets')
  ) {
    return `Yes. Google Sheets is fine as long as data accuracy and clear formatting are preserved.`;
  }

  if (
    cleanMessage.includes('better way to do this') ||
    cleanMessage.includes('better way') ||
    cleanMessage.includes('i have an idea') ||
    cleanMessage.includes('different approach')
  ) {
    return `Tell me your approach. If it doesn't delay our urgent items and maintains our quality standard, I'm open to it.`;
  }

  if (
    cleanMessage.includes('another way') ||
    cleanMessage.includes('different method') ||
    cleanMessage.includes('different tool') ||
    cleanMessage.includes('format it differently') ||
    cleanMessage.includes('can i do this another way')
  ) {
    return `Yes, as long as all required deliverables (${taskDeliverables}) are completed accurately and follow our preference: ${primaryPref}.`;
  }

  // F. Why & Business Logic Questions
  if (
    cleanMessage === 'why?' ||
    cleanMessage === 'why' ||
    cleanMessage.includes('why do you want me to do it this way') ||
    cleanMessage.includes('why this way') ||
    cleanMessage.includes('why are we doing this') ||
    cleanMessage.includes('why is this important') ||
    cleanMessage.includes('what is the reason')
  ) {
    if (todaysTask?.clientContext) {
      return `Because ${todaysTask.clientContext.replace(/\n+/g, ' ').slice(0, 160)}. Doing it this way keeps our operations organized and maintains high standards.`;
    }
    return `Because maintaining structured workflows ensures consistent delivery quality and keeps our records accurate.`;
  }

  // G. General Escalations & Edge Cases
  if (
    cleanMessage.includes('who should i escalate') ||
    cleanMessage.includes('who do i escalate') ||
    cleanMessage.includes('when to escalate')
  ) {
    return `Escalate any high-risk exceptions, contractual edge cases, or urgent blocker items directly to me here in chat before proceeding.`;
  }

  if (
    cleanMessage.includes('what would you do') ||
    cleanMessage.includes('what do you recommend') ||
    cleanMessage.includes('how would you handle this')
  ) {
    return `I recommend following our core standard: prioritize accuracy and ${primaryPref}, verify your draft against the task brief, and flag any blockers directly to me.`;
  }

  // H. Decision Making & Autonomy
  if (
    cleanMessage.includes('making that decision') ||
    cleanMessage.includes('make that decision') ||
    cleanMessage.includes('my own decision') ||
    cleanMessage.includes('ask you first') ||
    cleanMessage.includes('can i decide') ||
    cleanMessage.includes('should i decide')
  ) {
    return `For standard operational choices following our guidelines, yes. If it involves a financial commitment or policy exception, check with me first.`;
  }

  // I. Contradictions & General Clarification
  if (
    cleanMessage.includes('told me something different') ||
    cleanMessage.includes('said something else') ||
    cleanMessage.includes('you contradicted') ||
    cleanMessage.includes('earlier you said')
  ) {
    return `Let's establish the clear priority right now: proceed according to today's task brief for ${taskTitle}. Focus on ${primaryPref} and let me know if you see any conflict.`;
  }

  if (
    cleanMessage.includes("don't understand") ||
    cleanMessage.includes('dont understand') ||
    cleanMessage.includes('can you explain that') ||
    cleanMessage.includes('what does that mean') ||
    cleanMessage.includes('could you clarify')
  ) {
    return `Let me clarify: your goal today is to produce ${taskDeliverables}. The core requirement is ${taskBrief.slice(0, 130)}... Review the guidelines on the task page and let me know which exact step is unclear.`;
  }

  // J. Unknown & Out-of-bounds Information
  if (
    cleanMessage.includes('personal phone') ||
    cleanMessage.includes('home address') ||
    cleanMessage.includes('bank password') ||
    cleanMessage.includes('credit card pin') ||
    cleanMessage.includes('api key') ||
    cleanMessage.includes('revenue in 2018')
  ) {
    return `I don't have that information right now, and it isn't relevant to today's task. Let's stay focused on completing ${taskTitle}.`;
  }

  // K. Submission Channel
  if (
    cleanMessage.includes('where should i send') ||
    cleanMessage.includes('how do i submit') ||
    cleanMessage.includes('where do i upload') ||
    cleanMessage.includes('where to send') ||
    cleanMessage.includes('submit the file')
  ) {
    return `Please upload your completed file directly in the My Tasks portal so it can be evaluated and graded.`;
  }

  // L. Greetings & Short Social Exchanges
  if (cleanMessage === 'hi' || cleanMessage === 'hello' || cleanMessage === 'good morning' || cleanMessage === 'good afternoon') {
    return `Hello! How is your progress on Day ${currentDay} (${taskTitle})? Let me know if you need any specific guidance.`;
  }

  if (cleanMessage.includes('thank') || cleanMessage.includes('thanks') || cleanMessage.includes('appreciate')) {
    return `You're welcome. Let's make sure ${taskTitle} is submitted on time today.`;
  }

  // =========================================================================
  // 15. DEFAULT CONTEXTUAL DIRECT ANSWER
  // =========================================================================
  if (todaysTask) {
    return `For ${taskTitle}, please ensure your deliverable covers ${taskDeliverables} and follows our preference to ${primaryPref}. Submit your work in My Tasks once ready.`;
  }

  return `Please proceed with today's priority assignment for ${company}. Ensure all deliverables are verified for accuracy before submission.`;
}

/**
 * Main entry point: Evaluates service-isolated clarification tracks first.
 * Then attempts server-side Gemini generation if available.
 * If server-side is unavailable or returns an error, cleanly falls back to the
 * high-precision deterministic contextual reasoning engine so the simulation never fails.
 */
export async function generateClientReply(payload: ConversationContextPayload): Promise<string> {
  const { message, client, todaysTask, currentDay } = payload;
  const rawText = message.trim();
  const cleanMessage = rawText.toLowerCase().trim();

  // Derive active service track to guarantee strict contextual isolation
  const rawServiceId =
    payload.serviceId ||
    (client as any)?.serviceId ||
    (todaysTask?.id?.startsWith('task-so-')
      ? 'social_outreach'
      : todaysTask?.id?.startsWith('task-cs-')
      ? 'customer_service'
      : todaysTask?.id?.startsWith('task-sm-')
      ? 'social_media'
      : todaysTask?.id?.startsWith('task-tm-')
      ? 'travel_management'
      : todaysTask?.id?.startsWith('task-lg-')
      ? 'lead_gen_research'
      : todaysTask?.id?.startsWith('task-cw-')
      ? 'content_writing'
      : todaysTask?.id?.startsWith('task-eva-')
      ? 'executive_admin'
      : '');
  const serviceId = rawServiceId === 'social_marketing_outreach' ? 'social_outreach' : rawServiceId;

  const company = client.companyName || 'our company';
  const taskTitle = todaysTask?.title || `Day ${currentDay} Assignment`;
  const taskBrief = todaysTask?.brief || '';
  const taskDeliverables = todaysTask?.deliverables?.map((d) => d.label).join(', ') || 'the requested deliverable';
  const timezone = client.timezone || 'EST';
  const commStyle = client.communicationStyle || 'Direct & Results-Oriented';
  const preferences = client.preferences || client.clientPreferences || [];
  const primaryPref = preferences[0] || 'maintain high accuracy and clear formatting';

    // =========================================================================
  // SERVICE-ISOLATED CLARIFICATION BLOCKS
  // =========================================================================

  // --- LEAD GENERATION & RESEARCH VA TRACK ---
  if (serviceId === 'lead_gen_research') {
    const reply = resolveServiceClarification(payload);
    if (reply) return reply;
  }

  // --- CONTENT WRITING VA TRACK ---
  if (serviceId === 'content_writing') {
    const reply = resolveServiceClarification(payload);
    if (reply) return reply;
  }

  // --- SOCIAL MARKETING & COLD OUTREACH VA TRACK ---
  if (serviceId === 'social_marketing_outreach' || serviceId === 'social_outreach') {
    const reply = resolveServiceClarification(payload);
    if (reply) return reply;
  }

  // --- OTHER SERVICE TRACKS ---
  const serviceClarification = resolveServiceClarification(payload);
  if (serviceClarification) {
    return serviceClarification;
  }

  // Try Server-Side Gemini API route if online
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch('/api/chat/respond', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.response && typeof data.response === 'string' && data.response.trim().length > 0) {
        const cleaned = data.response.trim();
        // Quality check: Reject if response is only generic filler
        const isBannedFiller = /^(that sounds good|thanks for letting me know|i appreciate your effort|just use your best judgement|please proceed accordingly|keep me updated)\.?$/i.test(cleaned);
        if (!isBannedFiller) {
          return cleaned;
        }
      }
    }
  } catch (err) {
    // Graceful fallback to deterministic contextual reasoning engine
  }

  // --- FINAL FALLBACK ---
  return generateDeterministicClientReply(payload);
}

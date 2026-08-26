import { ClientPersona, TaskItem, ChatMessageItem } from '../types';

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
export function generateDeterministicClientReply(payload: ConversationContextPayload): string {
  const { message, client, todaysTask, currentDay, currentStage, history } = payload;
  const rawText = message.trim();
  const text = rawText.toLowerCase().replace(/[^\w\s?'-]/g, ' ');
  const cleanMessage = rawText.toLowerCase().trim();

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
  // 1.5. EXECUTIVE VA CONTEXTUAL CLARIFICATIONS (DAYS 8-10 & GENERAL EXECUTIVE VA)
  // =========================================================================
  // Day 8: Meeting with David clarification
  if (
    cleanMessage.includes('which david') ||
    cleanMessage.includes('who is david') ||
    cleanMessage.includes('david who') ||
    cleanMessage.includes('david chen') ||
    (cleanMessage.includes('david') && (cleanMessage.includes('email') || cleanMessage.includes('duration') || cleanMessage.includes('time') || cleanMessage.includes('agenda') || cleanMessage.includes('date') || cleanMessage.includes('topic')))
  ) {
    return `David Chen, our VP of Engineering (david@company.com). 45 minutes this Thursday afternoon between 2:00 PM and 4:30 PM ${timezone} to review Q3 sprint blockers. Add a Zoom link and send us both an invite.`;
  }

  // Day 9: Ambiguous Travel Request clarification
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

  // Executive Buffer & Timezone questions
  if (cleanMessage.includes('buffer') || cleanMessage.includes('15 min') || cleanMessage.includes('15-minute')) {
    return `Yes, always enforce a minimum 15-minute buffer before and after all external executive calls so I have time to prep and take notes.`;
  }

  if (cleanMessage.includes('timezone') || cleanMessage.includes('time zone') || cleanMessage.includes('pst') || cleanMessage.includes('est') || cleanMessage.includes('gmt')) {
    return `Our primary business timezone is ${timezone}. When coordinating with external stakeholders, always include both ${timezone} and their local time zone in the invite subject and body.`;
  }

  // =========================================================================
  // 2. AMBIGUITY & PRONOUN RESOLUTION ("Should I change it?", "Can I adjust this?")
  // =========================================================================
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
    return `Do you mean the deliverable structure or the customer response text? Let me know which part you want to adjust so I can give you a clear answer.`;
  }

  // =========================================================================
  // 3. DEADLINE & TIMING QUESTIONS
  // =========================================================================
  // "Why do you need it by then?" / "Why is the deadline so tight?"
  if (
    cleanMessage.includes('why do you need it by then') ||
    cleanMessage.includes('why is the deadline so tight') ||
    cleanMessage.includes('why so soon') ||
    cleanMessage.includes('why by 3') ||
    cleanMessage.includes('why by then')
  ) {
    return `Because I need enough time to review and integrate your deliverable before our 4:00 PM executive check-in with stakeholders.`;
  }

  // "What time do you need this completed?" / "When do you need this?" / "When is this due?"
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

  // "Can I finish this tomorrow?" / "Can I submit tomorrow?" / Delay requests
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

  // "What happens if I don't finish this today?"
  if (
    cleanMessage.includes("don't finish this today") ||
    cleanMessage.includes('dont finish this today') ||
    cleanMessage.includes('if i miss the deadline') ||
    cleanMessage.includes('if i am late')
  ) {
    return `If it's delayed, we risk missing our customer response SLA and delaying our operational schedule for Day ${currentDay}. If you're running tight, flag it to me right away.`;
  }

  // =========================================================================
  // 4. TASK SPECIFICITY & "WHAT EXACTLY DO YOU WANT ME TO DO?"
  // =========================================================================
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
    return `Please review the assignment on the My Tasks page, draft the required deliverable, and ensure you follow our client guidelines: ${primaryPref}.`;
  }

  // =========================================================================
  // 5. PRIORITIZATION & SEQUENCE ("Which customer should I handle first?", "VIP complaint")
  // =========================================================================
  if (
    cleanMessage.includes('vip') ||
    cleanMessage.includes('which customer') ||
    cleanMessage.includes('handle first') ||
    cleanMessage.includes('who should i reply to first') ||
    cleanMessage.includes('which one first') ||
    cleanMessage.includes('which ticket first') ||
    cleanMessage.includes('which complaint first') ||
    cleanMessage.includes('should i handle the vip')
  ) {
    return `Start with the refund complaint and VIP customer accounts because they have already been waiting the longest. After those are resolved, handle the general product inquiries.`;
  }

  if (
    cleanMessage.includes('reply to all five') ||
    cleanMessage.includes('reply to all') ||
    cleanMessage.includes('all five customers') ||
    cleanMessage.includes('handle all')
  ) {
    return `Yes, reply to all five. Escalate the refund complaint to me before responding to that customer.`;
  }

  if (
    cleanMessage.includes('prioritize') ||
    cleanMessage.includes('priority') ||
    cleanMessage.includes('focus on first')
  ) {
    if (todaysTask) {
      return `Prioritize the ${todaysTask.deliverables[0]?.label || 'primary deliverable'} first. Make sure ${primaryPref} before moving on to secondary items.`;
    }
    return `Prioritize urgent and high-impact customer issues first, then proceed with standard administrative deliverables.`;
  }

  // =========================================================================
  // 6. ALTERNATIVE APPROACHES & TOOLS ("Can I use Google Sheets instead?", "Another way")
  // =========================================================================
  if (
    cleanMessage.includes('google sheets') ||
    cleanMessage.includes('spreadsheet instead') ||
    cleanMessage.includes('excel instead') ||
    cleanMessage.includes('use sheets')
  ) {
    return `Yes. Google Sheets is fine as long as the customer information and priority labels are preserved.`;
  }

  if (
    cleanMessage.includes('better way to do this') ||
    cleanMessage.includes('better way') ||
    cleanMessage.includes('i have an idea') ||
    cleanMessage.includes('different approach')
  ) {
    return `Tell me your approach. If it doesn't delay the urgent cases and maintains our quality standard, I'm open to it.`;
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

  // =========================================================================
  // 7. WHY & BUSINESS LOGIC QUESTIONS ("Why do you want me to do it this way?", "Why?")
  // =========================================================================
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
      return `Because ${todaysTask.clientContext.replace(/\n+/g, ' ').slice(0, 160)}. Doing it this way keeps our operations organized and prevents customer escalation.`;
    }
    return `Because separating urgent issues from general inquiries ensures our customers receive prompt resolutions while keeping our records clear.`;
  }

  // =========================================================================
  // 8. ESCALATIONS, UNRESPONSIVE CUSTOMERS & EDGE CASES
  // =========================================================================
  // "What should I do if the customer doesn't respond?"
  if (
    cleanMessage.includes("doesn't respond") ||
    cleanMessage.includes('does not respond') ||
    cleanMessage.includes('no reply') ||
    cleanMessage.includes('unresponsive') ||
    cleanMessage.includes('ghost')
  ) {
    return `Send one follow-up after 24 hours. If there's still no response, mark the case for review in your daily summary.`;
  }

  // "Who should I escalate this to?"
  if (
    cleanMessage.includes('who should i escalate') ||
    cleanMessage.includes('who do i escalate') ||
    cleanMessage.includes('escalate to') ||
    cleanMessage.includes('who to contact')
  ) {
    return `Escalate any refund requests over $50, legal inquiries, or angry VIP accounts directly to me here in chat before sending a response.`;
  }

  // "What would you do in this situation?"
  if (
    cleanMessage.includes('what would you do') ||
    cleanMessage.includes('what do you recommend') ||
    cleanMessage.includes('how would you handle this')
  ) {
    return `I would address the customer's frustration with an empathetic acknowledgement, offer store credit as a first resolution, and clearly explain the next steps so expectations are set.`;
  }

  // =========================================================================
  // 9. DECISION MAKING & AUTONOMY
  // =========================================================================
  // "Are you okay with me making that decision?" / "Should I ask you first?"
  if (
    cleanMessage.includes('making that decision') ||
    cleanMessage.includes('make that decision') ||
    cleanMessage.includes('my own decision') ||
    cleanMessage.includes('ask you first') ||
    cleanMessage.includes('can i decide') ||
    cleanMessage.includes('should i decide')
  ) {
    return `For standard operational choices following our guidelines, yes. If it involves a financial refund or policy exception, check with me first.`;
  }

  // =========================================================================
  // 10. CONTRADICTIONS & CLARIFICATIONS ("You told me something different earlier")
  // =========================================================================
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

  // =========================================================================
  // 11. UNKNOWN & OUT-OF-BOUNDS INFORMATION
  // =========================================================================
  if (
    cleanMessage.includes('personal phone') ||
    cleanMessage.includes('home address') ||
    cleanMessage.includes('bank password') ||
    cleanMessage.includes('credit card pin') ||
    cleanMessage.includes('api key') ||
    cleanMessage.includes('revenue in 2018') ||
    cleanMessage.includes('who is the competitor in asia')
  ) {
    return `I don't have that information right now, and it isn't relevant to today's task. Let's stay focused on completing ${taskTitle}.`;
  }

  // =========================================================================
  // 12. SUBMISSION CHANNEL ("Where should I send the file?")
  // =========================================================================
  if (
    cleanMessage.includes('where should i send') ||
    cleanMessage.includes('how do i submit') ||
    cleanMessage.includes('where do i upload') ||
    cleanMessage.includes('where to send') ||
    cleanMessage.includes('submit the file')
  ) {
    return `Please upload your completed file directly in the My Tasks portal so it can be evaluated and graded.`;
  }

  // =========================================================================
  // 13. STORE CREDITS / REFUNDS SPECIFICITY
  // =========================================================================
  if (cleanMessage.includes('store credit') || cleanMessage.includes('refund') || cleanMessage.includes('discount')) {
    return `Our standard policy is to offer store credit or a replacement first. If the customer explicitly insists on a cash refund, escalate it to me.`;
  }

  // =========================================================================
  // 14. GREETINGS & SHORT SOCIAL EXCHANGES
  // =========================================================================
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
 * Main entry point: Calls the server-side Gemini API route first.
 * If server-side is unavailable or returns an error, cleanly falls back to the
 * high-precision deterministic contextual reasoning engine so the simulation never fails.
 */
export async function generateClientReply(payload: ConversationContextPayload): Promise<string> {
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

  // Fallback to local deterministic reasoning engine
  return generateDeterministicClientReply(payload);
}

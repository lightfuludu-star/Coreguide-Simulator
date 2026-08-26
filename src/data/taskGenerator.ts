// ==============================================================================
// CoreGuide VA Simulator - Dynamic Task & 5-Dimension Evaluation Engine (V1)
// Generates realistic tasks across 90 days & evaluates across the 5 Core Criteria:
// 1. Accuracy (0-10)
// 2. Communication (0-10)
// 3. Judgement (0-10)
// 4. Initiative (0-10)
// 5. Client Handling (0-10)
// ==============================================================================

import { TaskItem, TaskEvaluation, ClientPersona, CompetencyMetric } from '../types';
import { VaServiceDefinition, SIMULATION_STAGES } from './vaServicesData';
import { generateDynamicExecutiveVaTask } from './executiveVaFramework';

// Determine stage for a given day based on the official 6 stages:
// Stage 1: Days 1–7
// Stage 2: Days 8–21
// Stage 3: Days 22–35
// Stage 4: Days 36–50
// Stage 5: Days 51–70
// Stage 6: Days 71–89
// Day 90: Capstone
export const getStageForDay = (day: number) => {
  if (day >= 90) return SIMULATION_STAGES[6]; // Day 90 Capstone
  if (day >= 71) return SIMULATION_STAGES[5]; // Stage 6 (Days 71–89)
  if (day >= 51) return SIMULATION_STAGES[4]; // Stage 5 (Days 51–70)
  if (day >= 36) return SIMULATION_STAGES[3]; // Stage 4 (Days 36–50)
  if (day >= 22) return SIMULATION_STAGES[2]; // Stage 3 (Days 22–35)
  if (day >= 8) return SIMULATION_STAGES[1];  // Stage 2 (Days 8–21)
  return SIMULATION_STAGES[0];                // Stage 1 (Days 1–7)
};

// Generates dynamic realistic task for a given day & service
export const generateTaskForDay = (
  day: number,
  service: VaServiceDefinition,
  client: ClientPersona,
  options?: {
    competencies?: CompetencyMetric[];
    previousTasks?: TaskItem[];
    previousSubmissions?: any[];
    identifiedWeaknesses?: string[];
  }
): TaskItem => {
  // If Executive VA track is active, leverage the 14-day dynamic Executive VA framework
  if (service.id === 'executive_admin') {
    return generateDynamicExecutiveVaTask({
      dayNumber: day,
      client,
      competencies: options?.competencies,
      previousTasks: options?.previousTasks,
      previousSubmissions: options?.previousSubmissions,
      identifiedWeaknesses: options?.identifiedWeaknesses,
    });
  }

  const stage = getStageForDay(day);

  // Check if we have a predefined task in service.initialTasks
  const predefined = service.initialTasks.find((t) => t.dayNumber === day);
  if (predefined) {
    return { ...predefined };
  }

  // Otherwise, procedurally generate a rich scenario tailored to the service & stage
  let title = '';
  let brief = '';
  let clientContext = '';
  let category: TaskItem['category'] = 'Client Communications';
  let priority: TaskItem['priority'] = 'medium';
  let estimatedMinutes = 35;
  let deliverables: TaskItem['deliverables'] = [];

  if (service.id === 'customer_service') {
    if (day === 90) {
      // Day 90 Capstone
      title = 'Day 90: Final Capstone Assessment — Multi-Scenario Crisis & SOP Audit';
      priority = 'urgent';
      estimatedMinutes = 60;
      category = 'Operations & CRM';
      brief = `Complete your final 3-part graduation practical capstone for ${client.companyName}: 1. De-escalate an executive VIP customer threat of public escalation due to a batch shipping delay. 2. Resolve a live queue backlog of 35 tickets with custom macro triage logic. 3. Draft a comprehensive 4-page Customer Experience Standard Operating Procedure (SOP) handbook.`;
      clientContext = `${client.ceoName} message: "This is your final Day 90 graduation capstone. You have managed our customer queue with exceptional composure. Treat this scenario as live and deliver your highest standard of support."`;
      deliverables = [
        { id: `del-cs-${day}-1`, label: 'VIP Executive De-escalation & Containment Response', type: 'email_draft', required: true },
        { id: `del-cs-${day}-2`, label: '35-Ticket Triage & Routing Matrix', type: 'spreadsheet', required: true },
        { id: `del-cs-${day}-3`, label: `Master ${client.companyName} Support SOP Handbook (v1.0)`, type: 'document', required: true },
      ];
    } else if (stage.stageNumber === 5) {
      // Stage 5: Pressure & Multiple Tasks (Days 51–70)
      title = `Day ${day}: Flash Sale Queue Surge — 50-Ticket Rush Triage & SLA Rescue`;
      priority = 'urgent';
      estimatedMinutes = 45;
      category = 'Operations & CRM';
      brief = 'During peak promotional traffic, support ticket volume surged by 300%. Triage and draft categorized responses for 5 common inquiry clusters: 1. Delayed carrier tracking, 2. Address modification requests, 3. Broken discount codes, 4. Sold out restock queries, 5. Cancellation before dispatch.';
      clientContext = `${client.ceoName} message: "Queue is backing up fast! We have an SLA target of under 1 hour first-response time. Focus on speed while keeping our tone friendly and empathetic."`;
      deliverables = [
        { id: `del-cs-${day}-1`, label: '5-Category Rapid Response Macro Bank', type: 'document', required: true },
        { id: `del-cs-${day}-2`, label: 'Queue Prioritization Log', type: 'spreadsheet', required: true },
      ];
    } else if (stage.stageNumber === 4) {
      // Stage 4: Client Management (Days 36–50)
      title = `Day ${day}: Client Promo Glitch Containment & Policy Alignment`;
      priority = 'high';
      estimatedMinutes = 40;
      category = 'Client Communications';
      brief = 'An incorrect promotional discount code was accidentally shared with 300 subscribers. Draft a graceful, empathetic email to affected customers explaining the glitch, offering an immediate 25% apology gift code with free shipping, and compile a status summary for the executive team.';
      clientContext = `${client.ceoName} message: "We need proactive client management here. Lead customer communication with extreme care and warmth so we protect customer lifetime value."`;
      deliverables = [
        { id: `del-cs-${day}-1`, label: 'Apology & Order Adjustment Email Blast Draft', type: 'email_draft', required: true },
        { id: `del-cs-${day}-2`, label: 'Executive Status Summary & Risk Log', type: 'document', required: true },
      ];
    } else if (stage.stageNumber === 3) {
      // Stage 3: Problem Solving (Days 22–35)
      title = `Day ${day}: Ambiguous Return Exception & Tracking Discrepancy`;
      priority = 'medium';
      estimatedMinutes = 35;
      category = 'Client Communications';
      brief = 'A high-spend customer claims her package was marked "Delivered" by the carrier but never arrived. Standard policy requires a 5-day carrier investigation, but the customer needs the item for an upcoming trip. Evaluate customer history and propose a win-win resolution.';
      clientContext = `${client.ceoName} message: "Use your best judgement here. Balance our refund policy with customer loyalty."`;
      deliverables = [
        { id: `del-cs-${day}-1`, label: 'Customer Resolution Email with Tracking Update', type: 'email_draft', required: true },
        { id: `del-cs-${day}-2`, label: 'Internal Exception Approval Note', type: 'text', required: true },
      ];
    } else {
      // Stage 2 & Stage 1
      title = `Day ${day}: Customer Guidance & Knowledge Base FAQ Update`;
      priority = 'medium';
      estimatedMinutes = 30;
      category = 'Client Communications';
      brief = `A group of customers requested guidance on product usage and subscription renewal options. Draft clear, step-by-step instructions and update the corresponding customer FAQ sheet for ${client.companyName}.`;
      clientContext = `${client.ceoName} message: "Educating customers clearly reduces repeat tickets. Keep your tone encouraging and concise."`;
      deliverables = [
        { id: `del-cs-${day}-1`, label: 'Customer Guidance Email Draft', type: 'email_draft', required: true },
        { id: `del-cs-${day}-2`, label: 'Updated Knowledge Base FAQ Entries', type: 'document', required: true },
      ];
    }
  } else if (service.id === 'social_media') {
    if (day === 90) {
      title = 'Day 90: Final Capstone — Master 30-Day Campaign Blueprint & Launch Strategy';
      priority = 'urgent';
      estimatedMinutes = 60;
      category = 'Research & Synthesis';
      brief = `Create a comprehensive 30-day multi-channel campaign blueprint for ${client.companyName}. Includes 15 short-form video storyboard briefs, 10 carousel copy drafts with hooks, a 20-creator influencer seeding roster, and a community crisis moderation playbook.`;
      clientContext = `${client.ceoName} message: "This is your final capstone project. Show your complete mastery of copywriting, visual direction, community growth, and creator workflows."`;
      deliverables = [
        { id: `del-sm-${day}-1`, label: '30-Day Multi-Platform Content Calendar & Copy Bank', type: 'spreadsheet', required: true },
        { id: `del-sm-${day}-2`, label: 'Creator PR Seeding & Outreach Roster', type: 'spreadsheet', required: true },
        { id: `del-sm-${day}-3`, label: 'Campaign Storyboard & Visual Style Guide', type: 'document', required: true },
      ];
    } else if (stage.stageNumber >= 4) {
      title = `Day ${day}: Viral Video Engagement Blitz & Influencer Collaboration Triage`;
      priority = 'high';
      estimatedMinutes = 40;
      category = 'Client Communications';
      brief = 'A recent reel gained substantial organic traction, bringing 400+ comments and 25 creator collaboration inquiries. Filter top comments, draft 10 high-engagement community replies, and formulate 3 formal collaboration briefs.';
      clientContext = `${client.ceoName} message: "Engage with top comments immediately to maximize algorithm velocity and lock in creator partnerships."`;
      deliverables = [
        { id: `del-sm-${day}-1`, label: 'Top-10 Community Engagement Reply Bank', type: 'text', required: true },
        { id: `del-sm-${day}-2`, label: 'Influencer Gifting & Collaboration Agreement Brief', type: 'document', required: true },
      ];
    } else {
      title = `Day ${day}: Weekly Content Matrix & Aesthetic Storyboard Briefs`;
      priority = 'medium';
      estimatedMinutes = 35;
      category = 'Research & Synthesis';
      brief = 'Prepare 5 days of multi-format social content: 3 carousel posts, 2 short-form video hooks, and 5 interactive story concepts aligned with brand aesthetic and audience interests.';
      clientContext = `${client.ceoName} message: "Focus on clean aesthetic storytelling and clear CTAs for every post."`;
      deliverables = [
        { id: `del-sm-${day}-1`, label: 'Weekly Content Schedule & Copywriting Draft', type: 'document', required: true },
      ];
    }
  } else {
    // Executive VA, Travel Management, Social Outreach, Lead Gen, Content Writing
    if (day === 90) {
      title = `Day 90: Final Capstone Assessment — Executive Operations Mastery for ${client.companyName}`;
      priority = 'urgent';
      estimatedMinutes = 60;
      category = 'Operations & CRM';
      brief = `Deliver the complete Day 90 capstone portfolio for ${client.companyName}: Master operating procedures, synthesized strategic intelligence report, and multi-stakeholder execution playbook.`;
      clientContext = `${client.ceoName} message: "This is your final capstone assessment. Show complete autonomy, impeccable precision, and executive excellence."`;
      deliverables = [
        { id: `del-gen-${day}-1`, label: 'Comprehensive Master Operating SOP Handbook', type: 'document', required: true },
        { id: `del-gen-${day}-2`, label: 'Strategic Executive Deliverable & Intelligence Report', type: 'spreadsheet', required: true },
      ];
    } else {
      title = `Day ${day}: ${stage.name} — Priority Operational Execution`;
      priority = stage.stageNumber >= 5 ? 'urgent' : 'high';
      estimatedMinutes = 40;
      category = 'Operations & CRM';
      brief = `Execute Day ${day} priority deliverable milestones for ${client.companyName}. Deconflict schedules, prepare executive summaries, and format status reports for ${client.ceoName}.`;
      clientContext = `${client.ceoName} message: "I need clean, synthesized outputs with zero fluff. Keep the workflow moving forward with maximum clarity."`;
      deliverables = [
        { id: `del-gen-${day}-1`, label: 'Executive Deliverable & Status Brief', type: 'document', required: true },
      ];
    }
  }

  const deadlineType: 'none' | 'soft' | 'hard' =
    priority === 'urgent' || day === 90 || day % 7 === 0
      ? 'hard'
      : priority === 'high' || stage.stageNumber >= 3
      ? 'soft'
      : day % 3 === 0
      ? 'none'
      : 'soft';

  return {
    id: `task-dyn-${service.id}-d${day}`,
    dayNumber: day,
    phaseId: stage.stageNumber,
    title,
    category,
    priority,
    estimatedMinutes,
    deadlineHours: 8,
    deadlineType,
    brief,
    clientContext,
    deliverables,
    status: 'in_progress',
    createdAt: new Date().toISOString(),
  };
};

// ==============================================================================
// 5-DIMENSION EVALUATION GENERATOR
// ==============================================================================

export interface EvaluationInput {
  task: TaskItem;
  client: ClientPersona;
  service: VaServiceDefinition;
  studentNotes: string;
  attachmentsCount: number;
}

export const evaluateStudentSubmission = ({
  task,
  client,
  service,
  studentNotes,
  attachmentsCount,
}: EvaluationInput): TaskEvaluation => {
  const notesLength = studentNotes.trim().length;

  // Base scores across the 5 Core Dimensions:
  // 1. Accuracy
  // 2. Communication
  // 3. Judgement
  // 4. Initiative
  // 5. Client Handling
  let accuracyScore = 8.5;
  let commScore = 9.0;
  let judgementScore = 8.2;
  let initiativeScore = 8.5;
  let clientHandlingScore = 9.0;

  // Bonus for thorough submissions
  if (notesLength > 180) {
    accuracyScore = Math.min(10, accuracyScore + 0.8);
    commScore = Math.min(10, commScore + 0.7);
    judgementScore = Math.min(10, judgementScore + 1.0);
  } else if (notesLength < 40) {
    accuracyScore = Math.max(6.0, accuracyScore - 1.5);
    commScore = Math.max(6.5, commScore - 1.2);
  }

  if (attachmentsCount > 0) {
    initiativeScore = Math.min(10, initiativeScore + 0.8);
    accuracyScore = Math.min(10, accuracyScore + 0.5);
  }

  // Calculate composite 0-100 score
  const avgDimension = (accuracyScore + commScore + judgementScore + initiativeScore + clientHandlingScore) / 5;
  const compositeScore = Math.round(avgDimension * 10);

  // Generate dynamic contextual feedback
  const strengths: string[] = [];
  const areasToImprove: string[] = [];

  if (service.id === 'customer_service') {
    strengths.push('Demonstrated strong empathetic de-escalation framing, acknowledging customer frustration right away.');
    strengths.push('Adhered strictly to client policy guidelines regarding store credit incentives and polite tone.');
    strengths.push('Provided concise, clear action steps without unnecessary corporate jargon.');

    areasToImprove.push('Ensure internal ticket tagging in Gorgias/Zendesk is completed immediately after replying.');
    areasToImprove.push('Consider adding a proactive tracking check link to reduce repetitive follow-up inquiries.');
  } else if (service.id === 'social_media') {
    strengths.push('Crafted high-converting opening hooks tailored to the brand aesthetic and audience attention span.');
    strengths.push('Included clear, frictionless call-to-actions (CTAs) guiding community engagement.');
    strengths.push('Maintained consistent brand tone across caption storytelling.');

    areasToImprove.push('Incorporate 2-3 additional long-tail aesthetic hashtags to improve organic explore discoverability.');
    areasToImprove.push('Specify optimal posting time windows based on follower activity peaks in future calendar briefs.');
  } else {
    strengths.push('Delivered clean, highly structured executive outputs with logical information architecture.');
    strengths.push('Demonstrated sound judgement and proactive anticipation of stakeholder needs.');
    strengths.push('Followed executive formatting rules with clear bullet points and action items.');

    areasToImprove.push('Add executive summary highlights at the very top of complex deliverables for fast mobile reading.');
    areasToImprove.push('Double-check calendar buffer times between consecutive meetings.');
  }

  // Client reaction quote based on persona
  let clientReaction = '';
  if (client.ceoName === 'Sarah Jenkins') {
    clientReaction = `"Really appreciate how quickly you took care of this customer. Your empathy was genuine, and offering the store credit bonus kept our brand loyalty intact. Excellent work!"`;
  } else if (client.ceoName === 'Elena Rostova') {
    clientReaction = `"Love the energy and creative tone in this submission! The hook was sharp and fits the Aura aesthetic perfectly. Great job keeping the community hyped."`;
  } else {
    clientReaction = `"Solid turnaround on this deliverable. The formatting is clean, the priorities are right, and I have exactly what I need to take action. Keep up the high standard."`;
  }

  return {
    score: compositeScore,
    accuracy: Number(accuracyScore.toFixed(1)),
    communication: Number(commScore.toFixed(1)),
    judgement: Number(judgementScore.toFixed(1)),
    initiative: Number(initiativeScore.toFixed(1)),
    clientHandling: Number(clientHandlingScore.toFixed(1)),
    feedback: `Outstanding execution on Day ${task.dayNumber} assignment. You balanced client guidelines with proactive problem solving, maintaining high standards across all 5 evaluation dimensions.`,
    strengths,
    areasToImprove,
    clientReaction,
    evaluatedBy: 'CoreGuide AI Evaluator & Client Review',
    evaluatedAt: new Date().toISOString(),
  };
};

// ==============================================================================
// CoreGuide VA Simulator - Dynamic Task & 5-Dimension Evaluation Engine (V2)
// Adaptive Task Generation & Repetition Prevention across All 7 VA Services:
// 1. Executive VA (executive_admin)
// 2. Customer Service VA (customer_service)
// 3. Social Media VA (social_media)
// 4. Travel Management VA (travel_management)
// 5. Social Marketing & Cold Outreach VA (social_outreach)
// 6. Lead Generation & Research VA (lead_gen_research)
// 7. Content Writing VA (content_writing)
// ==============================================================================

import { TaskItem, TaskEvaluation, ClientPersona, CompetencyMetric } from '../types';
import { VaServiceDefinition, SIMULATION_STAGES } from './vaServicesData';
import { generateDynamicExecutiveVaTask } from './executiveVaFramework';
import { generateCustomerServiceTask } from './customerServiceFramework';
import { generateSocialMediaTask } from './socialMediaFramework';
import { generateTravelManagementTask } from './travelManagementFramework';
import { generateSocialOutreachTask } from './socialOutreachFramework';
import { generateLeadGenTask } from './leadGenResearchFramework';
import { generateContentWritingTask } from './contentWritingFramework';

// Determine stage for a given day based on the official 6 stages (90-day curriculum preservation):
export const getStageForDay = (day: number) => {
  if (day >= 90) return SIMULATION_STAGES[6]; // Day 90 Capstone
  if (day >= 71) return SIMULATION_STAGES[5]; // Stage 6 (Days 71–89)
  if (day >= 51) return SIMULATION_STAGES[4]; // Stage 5 (Days 51–70)
  if (day >= 36) return SIMULATION_STAGES[3]; // Stage 4 (Days 36–50)
  if (day >= 22) return SIMULATION_STAGES[2]; // Stage 3 (Days 22–35)
  if (day >= 8) return SIMULATION_STAGES[1];  // Stage 2 (Days 8–21)
  return SIMULATION_STAGES[0];                // Stage 1 (Days 1–7)
};

export interface TaskGenerationOptions {
  competencies?: CompetencyMetric[];
  previousTasks?: TaskItem[];
  previousSubmissions?: any[];
  identifiedWeaknesses?: string[];
  chatHistory?: any[];
  industry?: string;
  isRemediation?: boolean;
}

// Repetition Prevention Engine: compares generated candidate against recent tasks across
// objective, scenario, deliverables, and category to prevent substantial duplicates
function preventRepetition(candidate: TaskItem, previousTasks: TaskItem[] = [], isRemediation = false): TaskItem {
  if (previousTasks.length === 0) return candidate;

  // Look back at the last 3 completed tasks
  const recentTasks = previousTasks.slice(-3);
  const duplicateMatch = recentTasks.find((prev) => {
    if (prev.id === candidate.id) return true;

    // 1. Normalized title match
    const titleA = prev.title.trim().toLowerCase().replace(/^day \d+:\s*/, '');
    const titleB = candidate.title.trim().toLowerCase().replace(/^day \d+:\s*/, '');
    const titleSimilar = titleA === titleB || (titleA.length > 15 && titleB.includes(titleA));

    // 2. Deliverable overlap
    const prevDels = prev.deliverables?.map((d) => d.label.toLowerCase()) || [];
    const candDels = candidate.deliverables?.map((d) => d.label.toLowerCase()) || [];
    const sharedDels = candDels.filter((cd) => prevDels.some((pd) => pd === cd || (cd.length > 20 && pd.includes(cd.slice(0, 25)))));
    const delSimilar = candDels.length > 0 && sharedDels.length >= Math.ceil(candDels.length * 0.75);

    // 3. Substantial brief overlap
    const briefA = prev.brief.slice(0, 70).toLowerCase();
    const briefB = candidate.brief.slice(0, 70).toLowerCase();
    const briefSimilar = briefA === briefB;

    return titleSimilar || delSimilar || briefSimilar;
  });

  if (duplicateMatch) {
    if (isRemediation) {
      // Good remediation: Preserve skill focus, but mutate business context, sub-vertical & buying triggers
      return {
        ...candidate,
        id: `${candidate.id}-remed-${Date.now() % 1000}`,
        title: `${candidate.title} (Targeted Remediation Scenario)`,
        priority: 'high',
        brief: `[Targeted Skill Remediation] Apply this core methodology to an alternative scenario: focus on an adjacent sub-vertical with distinct buying triggers and alternative decision-makers. ${candidate.brief}`,
      };
    }

    // Unintentional repetition: inject contextual differentiation variant
    return {
      ...candidate,
      id: `${candidate.id}-var-${Date.now() % 1000}`,
      title: `${candidate.title} (Advanced Scope)`,
      priority: candidate.priority === 'low' ? 'medium' : candidate.priority === 'medium' ? 'high' : 'urgent',
      brief: `[Accelerated Execution Window] ${candidate.brief} Note: Ensure enhanced attention to client preferences and include a priority handover note.`,
    };
  }

  return candidate;
}

// Generates dynamic realistic task for a given day & service across all 7 official VA tracks
export const generateTaskForDay = (
  day: number,
  service: VaServiceDefinition,
  client: ClientPersona,
  options?: TaskGenerationOptions
): TaskItem => {
  const opts = options || {};
  let generatedTask: TaskItem;

  switch (service.id) {
    case 'executive_admin':
      generatedTask = generateDynamicExecutiveVaTask({
        dayNumber: day,
        client,
        competencies: opts.competencies,
        previousTasks: opts.previousTasks,
        previousSubmissions: opts.previousSubmissions,
        identifiedWeaknesses: opts.identifiedWeaknesses,
        chatHistory: opts.chatHistory,
      });
      break;

    case 'customer_service':
      generatedTask = generateCustomerServiceTask({
        dayNumber: day,
        client,
        competencies: opts.competencies,
        previousTasks: opts.previousTasks,
        previousSubmissions: opts.previousSubmissions,
        identifiedWeaknesses: opts.identifiedWeaknesses,
        chatHistory: opts.chatHistory,
      });
      break;

    case 'social_media':
      generatedTask = generateSocialMediaTask({
        dayNumber: day,
        client,
        competencies: opts.competencies,
        previousTasks: opts.previousTasks,
        previousSubmissions: opts.previousSubmissions,
        identifiedWeaknesses: opts.identifiedWeaknesses,
        chatHistory: opts.chatHistory,
      });
      break;

    case 'travel_management':
      generatedTask = generateTravelManagementTask({
        dayNumber: day,
        client,
        competencies: opts.competencies,
        previousTasks: opts.previousTasks,
        previousSubmissions: opts.previousSubmissions,
        identifiedWeaknesses: opts.identifiedWeaknesses,
        chatHistory: opts.chatHistory,
      });
      break;

    case 'social_outreach':
      generatedTask = generateSocialOutreachTask({
        dayNumber: day,
        client,
        competencies: opts.competencies,
        previousTasks: opts.previousTasks,
        previousSubmissions: opts.previousSubmissions,
        identifiedWeaknesses: opts.identifiedWeaknesses,
        chatHistory: opts.chatHistory,
      });
      break;

    case 'lead_gen_research':
      generatedTask = generateLeadGenTask({
        dayNumber: day,
        client,
        competencies: opts.competencies,
        previousTasks: opts.previousTasks,
        previousSubmissions: opts.previousSubmissions,
        identifiedWeaknesses: opts.identifiedWeaknesses,
        chatHistory: opts.chatHistory,
      });
      break;

    case 'content_writing':
      generatedTask = generateContentWritingTask({
        dayNumber: day,
        client,
        competencies: opts.competencies,
        previousTasks: opts.previousTasks,
        previousSubmissions: opts.previousSubmissions,
        identifiedWeaknesses: opts.identifiedWeaknesses,
        chatHistory: opts.chatHistory,
      });
      break;

    default:
      generatedTask = generateCustomerServiceTask({
        dayNumber: day,
        client,
        competencies: opts.competencies,
        previousTasks: opts.previousTasks,
        previousSubmissions: opts.previousSubmissions,
        identifiedWeaknesses: opts.identifiedWeaknesses,
      });
      break;
  }

  // Enforce repetition prevention against previously generated tasks
  return preventRepetition(generatedTask, opts.previousTasks, opts.isRemediation);
};

// ==============================================================================
// 5-DIMENSION EVALUATION GENERATOR (Preserved)
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
  } else if (service.id === 'travel_management') {
    strengths.push('Constructed clean, door-to-door itinerary timing with realistic airport buffers.');
    strengths.push('Vetted flight routing and lodging proximity against client preferences.');
    strengths.push('Maintained clear policy compliance regarding per diem and cancellation rules.');

    areasToImprove.push('Always include local emergency contact numbers and hospital locations for international legs.');
    areasToImprove.push('Highlight timezone shifts prominently at the top of each travel day.');
  } else if (service.id === 'social_outreach') {
    strengths.push('Accurately identified ICP decision-maker titles with verified business email channels.');
    strengths.push('Crafted low-friction, conversational call-to-actions without aggressive pitch slapping.');
    strengths.push('Demonstrated strong understanding of prospect buying triggers.');

    areasToImprove.push('Shorten cold email first touches to under 100 words for higher mobile read rates.');
    areasToImprove.push('Test contrarian industry observations in follow-up subject lines.');
  } else if (service.id === 'lead_gen_research') {
    strengths.push('Applied rigorous Boolean search logic to filter out irrelevant recruiter and blog listings.');
    strengths.push('Cross-verified contact intelligence across multiple independent public sources.');
    strengths.push('Maintained high data hygiene standards with standardized formatting.');

    areasToImprove.push('Always document exact sourcing URLs for corporate registry and entity validation.');
    areasToImprove.push('Include confidence scores for estimated revenue and headcount figures.');
  } else if (service.id === 'content_writing') {
    strengths.push('Calibrated voice perfectly to target audience readability standards (Grade 7-8).');
    strengths.push('Structured long-form copy with skimmable H2/H3 subheadings and clear bullet points.');
    strengths.push('Demonstrated sharp commercial copy that translated technical features into tangible benefits.');

    areasToImprove.push('Eliminate passive voice in opening paragraphs for higher reader engagement.');
    areasToImprove.push('Ensure meta descriptions consistently include an active click verb.');
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

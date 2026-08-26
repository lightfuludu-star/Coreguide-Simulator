// ==============================================================================
// CoreGuide VA Simulator - Social Marketing & Cold Outreach VA Verification Suite
// ==============================================================================

import { ALL_VA_SERVICES } from '../src/data/vaServicesData';
import { generateSimulatedClient } from '../src/data/clientGenerator';
import { generateTaskForDay } from '../src/data/taskGenerator';
import { getDynamicOutreachContext, generateSocialOutreachTask } from '../src/data/socialOutreachFramework';
import { generateDeterministicClientReply } from '../src/services/clientConversationEngine';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`[FAIL] ${message}`);
  }
}

console.log('===============================================================================');
console.log('CoreGuide VA Simulator - Social Outreach VA Correction Verification Suite');
console.log('===============================================================================');

// --- 1. Scope & Official Services Verification ---
console.log('\n--- 1. Scope & Official Services Verification ---');
assert(ALL_VA_SERVICES.length === 7, 'Exactly 7 official VA services exist');
const soService = ALL_VA_SERVICES.find(s => s.id === 'social_outreach');
assert(!!soService, 'Social Marketing & Cold Outreach VA exists in ALL_VA_SERVICES');
assert(soService?.name === 'Social Marketing & Cold Outreach VA', `Correct service name: ${soService?.name}`);

// --- 2. Dynamic Context Generation (No Universal Hardcoding) ---
console.log('\n--- 2. Dynamic Context Generation Across Different Clients ---');
const defaultClient = generateSimulatedClient('social_outreach');
const ctxDefault = getDynamicOutreachContext(defaultClient);
assert(ctxDefault.companyName === 'GrowthCatalyst Media', `Default client company: ${ctxDefault.companyName}`);
assert(ctxDefault.targetGeography.includes('North America'), `Default geography: ${ctxDefault.targetGeography}`);
assert(ctxDefault.targetTitles.includes('Chief Marketing Officer (CMO)'), `Default target title includes CMO`);
assert(ctxDefault.dealSize.includes('$4,500'), `Default deal size: ${ctxDefault.dealSize}`);

// Custom client: UK Consulting firm (David Sterling, London)
const ukConsultingClient = {
  ...defaultClient,
  companyName: 'Vanguard Strategy Partners',
  ceoName: 'David Sterling',
  industry: 'Consulting & Professional Services',
  timezone: 'GMT (UTC+0) • London, UK',
};
const ctxUK = getDynamicOutreachContext(ukConsultingClient);
assert(ctxUK.targetGeography.includes('UK') || ctxUK.targetGeography.includes('Europe'), `UK client geography derived dynamically: ${ctxUK.targetGeography}`);
assert(ctxUK.targetTitles.includes('Managing Partner'), `Consulting client targets Managing Partner`);
assert(ctxUK.offer.includes('Fractional RevOps'), `Consulting client offer is tailored: ${ctxUK.offer.slice(0, 40)}...`);

// Custom client: B2B SaaS Tech (Marcus Vance)
const saasClient = {
  ...defaultClient,
  companyName: 'Apex Horizon Technologies',
  ceoName: 'Marcus Vance',
  industry: 'B2B SaaS & Tech',
  timezone: 'EST (UTC-5) • New York, USA',
};
const ctxSaaS = getDynamicOutreachContext(saasClient);
assert(ctxSaaS.offer.includes('customer support'), `SaaS client offer is tailored: ${ctxSaaS.offer.slice(0, 40)}...`);
assert(ctxSaaS.targetTitles.includes('VP Customer Success'), `SaaS client targets VP Customer Success`);

// --- 3. 14-Day Social Outreach Curriculum Progression ---
console.log('\n--- 3. 14-Day Social Outreach Curriculum Progression ---');
const generatedSoTasks: any[] = [];
for (let day = 1; day <= 14; day++) {
  const task = generateTaskForDay(day, soService!, defaultClient, {
    previousTasks: generatedSoTasks,
  });
  generatedSoTasks.push(task);

  assert(!!task.id && task.id.startsWith('task-so-'), `Day ${day}: Task ID is valid (${task.id})`);
  assert(task.deliverables.length >= 2, `Day ${day}: Deliverables count >= 2 (${task.deliverables.length})`);
  assert(task.brief.length > 80, `Day ${day}: Brief is comprehensive (${task.brief.length} chars)`);

  if (day > 1) {
    const prev = generatedSoTasks[day - 2];
    assert(prev.title !== task.title, `Day ${day} title differs from Day ${day - 1}`);
    assert(prev.brief.slice(0, 50) !== task.brief.slice(0, 50), `Day ${day} brief differs from Day ${day - 1}`);
  }
}

// Verify specific pedagogical milestones
assert(generatedSoTasks[0].title.includes('Core Offer Analysis'), 'Day 1 is Founder Core Offer Analysis');
assert(generatedSoTasks[1].title.includes('Ideal Customer Profile'), 'Day 2 is ICP & Buyer Persona Architecture');
assert(generatedSoTasks[2].title.includes('Qualification Criteria'), 'Day 3 is Prospect Qualification Criteria (Foundation)');
assert(generatedSoTasks[3].title.includes('Target Company Sourcing'), 'Day 4 is Target Company Sourcing & ICP Fit');
assert(generatedSoTasks[4].title.includes('Decision-Maker Identification'), 'Day 5 is Decision-Maker & Buying Signals');
assert(generatedSoTasks[5].title.includes('Hyper-Personalization'), 'Day 6 is Hyper-Personalization & Icebreakers');
assert(generatedSoTasks[6].title.includes('Multi-Channel Outreach Sequence'), 'Day 7 is Multi-Channel Sequence Copywriting');
assert(generatedSoTasks[7].title.includes('Incomplete Founder Campaign Directive'), 'Day 8 is Incomplete Directive Clarification');
assert(generatedSoTasks[8].title.includes('Multi-State Prospect Response'), 'Day 9 is Multi-State Prospect Response Triage');
assert(generatedSoTasks[9].title.includes('No-Response Follow-Up'), 'Day 10 is No-Response Follow-Up Cadence');
assert(generatedSoTasks[10].title.includes('Queue Triage'), 'Day 11 is Queue Triage Under Pressure');
assert(generatedSoTasks[11].title.includes('Campaign Optimization'), 'Day 12 is Campaign Optimization & Audience Pivot');
assert(generatedSoTasks[12].title.includes('Outbound Pipeline Architecture'), 'Day 13 is Pipeline Architecture & Handoff');
assert(generatedSoTasks[13].title.includes('Practical Capstone'), 'Day 14 is Master Practical Capstone');

// --- 4. Context-Aware Client Clarification Tests ---
console.log('\n--- 4. Context-Aware Client Clarification Tests (Social Outreach) ---');
const dummyStage = { stageNumber: 1, name: 'Foundation', focus: 'Offer and ICP' };

// Test 4.1: Who are we targeting?
const replyTargeting = generateDeterministicClientReply({
  message: 'Who are we targeting for this campaign?',
  client: defaultClient,
  todaysTask: generatedSoTasks[0],
  currentDay: 1,
  currentStage: dummyStage,
  history: [],
  serviceId: 'social_outreach',
});
assert(replyTargeting.includes('Chief Marketing Officer (CMO)') || replyTargeting.includes('VP of Growth'), `Targeting reply identifies correct titles: "${replyTargeting}"`);
assert(replyTargeting.includes('North America'), `Targeting reply includes client geography`);

// Test 4.2: What is the target geography for UK client?
const replyGeoUK = generateDeterministicClientReply({
  message: "What's our target geography?",
  client: ukConsultingClient,
  todaysTask: generatedSoTasks[1],
  currentDay: 2,
  currentStage: dummyStage,
  history: [],
  serviceId: 'social_outreach',
});
assert(replyGeoUK.includes('UK') || replyGeoUK.includes('Western Europe'), `UK client geography correctly returned: "${replyGeoUK}"`);

// Test 4.3: What's the offer?
const replyOffer = generateDeterministicClientReply({
  message: "What's our offer?",
  client: saasClient,
  todaysTask: generatedSoTasks[0],
  currentDay: 1,
  currentStage: dummyStage,
  history: [],
  serviceId: 'social_outreach',
});
assert(replyOffer.includes('customer support'), `SaaS client offer returned dynamically: "${replyOffer}"`);

// Test 4.4: Which channel should I use?
const replyChannel = generateDeterministicClientReply({
  message: 'Which channel should I use for outreach?',
  client: defaultClient,
  todaysTask: generatedSoTasks[6],
  currentDay: 7,
  currentStage: dummyStage,
  history: [],
  serviceId: 'social_outreach',
});
assert(replyChannel.includes('LinkedIn') || replyChannel.includes('Email'), `Channel reply is direct: "${replyChannel}"`);

// Test 4.5: What makes a prospect qualified?
const replyQual = generateDeterministicClientReply({
  message: 'What makes a prospect qualified?',
  client: defaultClient,
  todaysTask: generatedSoTasks[2],
  currentDay: 3,
  currentStage: dummyStage,
  history: [],
  serviceId: 'social_outreach',
});
assert(replyQual.includes('qualified if:'), `Qualification criteria returned: "${replyQual}"`);

// Test 4.6: Should I follow up?
const replyFollowUp = generateDeterministicClientReply({
  message: 'When should I follow up if they do not reply?',
  client: defaultClient,
  todaysTask: generatedSoTasks[9],
  currentDay: 10,
  currentStage: dummyStage,
  history: [],
  serviceId: 'social_outreach',
});
assert(replyFollowUp.includes('3 to 4 business days') || replyFollowUp.includes('follow-up'), `Follow-up cadence returned: "${replyFollowUp}"`);

// Test 4.7: Who should I contact? (Founders or marketing managers?)
const replyWhoContact = generateDeterministicClientReply({
  message: 'Should I contact founders or marketing managers?',
  client: defaultClient,
  todaysTask: generatedSoTasks[4],
  currentDay: 5,
  currentStage: dummyStage,
  history: [],
  serviceId: 'social_outreach',
});
assert(replyWhoContact.includes('Chief Marketing Officer') || replyWhoContact.includes('Contact'), `Direct role answer given: "${replyWhoContact}"`);

// --- 5. Cross-Service Isolation Tests (No Keyword Contamination) ---
console.log('\n--- 5. Cross-Service Isolation Tests (No Keyword Contamination) ---');

// In Customer Service, asking "What's our target geography?" should NOT return outreach geography!
const csClient = generateSimulatedClient('customer_service');
const csTask = generateTaskForDay(1, ALL_VA_SERVICES.find(s => s.id === 'customer_service')!, csClient);
const csReplyGeo = generateDeterministicClientReply({
  message: "What's our target geography?",
  client: csClient,
  todaysTask: csTask,
  currentDay: 1,
  currentStage: dummyStage,
  history: [],
  serviceId: 'customer_service',
});
assert(!csReplyGeo.includes('prospect lists strictly within'), `Customer Service is NOT contaminated by Outreach geography: "${csReplyGeo}"`);

// In Executive VA, asking about "campaign" should NOT return Outreach campaign!
const execClient = generateSimulatedClient('executive_admin');
const execTask = generateTaskForDay(1, ALL_VA_SERVICES.find(s => s.id === 'executive_admin')!, execClient);
const execReplyCampaign = generateDeterministicClientReply({
  message: "Tell me about the campaign parameters.",
  client: execClient,
  todaysTask: execTask,
  currentDay: 1,
  currentStage: dummyStage,
  history: [],
  serviceId: 'executive_admin',
});
assert(!execReplyCampaign.includes('secondary domain') && !execReplyCampaign.includes('discovery calls'), `Executive VA is NOT contaminated by Outreach campaign response: "${execReplyCampaign}"`);

// --- 6. Repetition Prevention & Targeted Remediation Tests ---
console.log('\n--- 6. Repetition Prevention & Targeted Remediation Tests ---');
const duplicateCandidate = { ...generatedSoTasks[3] }; // Day 4 task
const preventedTask = generateTaskForDay(4, soService!, defaultClient, {
  previousTasks: [generatedSoTasks[3]],
  isRemediation: false,
});
assert(preventedTask.title.includes('(Advanced Scope)') || preventedTask.priority === 'urgent', `Unintentional duplicate candidate differentiated: "${preventedTask.title}"`);

const remediationTask = generateTaskForDay(4, soService!, defaultClient, {
  previousTasks: [generatedSoTasks[3]],
  isRemediation: true,
});
assert(remediationTask.title.includes('Remediation') || remediationTask.brief.includes('Remediation'), `Remediation scenario maintains skill but shifts context: "${remediationTask.title}"`);

// --- 7. Regression Test on All Other 6 Services ---
console.log('\n--- 7. Regression Test on All Other 6 Approved VA Services ---');
const otherServices = ALL_VA_SERVICES.filter(s => s.id !== 'social_outreach');
assert(otherServices.length === 6, 'Exactly 6 other approved services tested for regression');

for (const serv of otherServices) {
  const cl = generateSimulatedClient(serv.id);
  const t1 = generateTaskForDay(1, serv, cl);
  const t2 = generateTaskForDay(2, serv, cl, { previousTasks: [t1] });
  const t14 = generateTaskForDay(14, serv, cl);

  assert(!!t1.id && t1.deliverables.length >= 2, `${serv.name}: Day 1 task valid`);
  assert(!!t2.id && t2.title !== t1.title, `${serv.name}: Day 2 task differs from Day 1`);
  assert(!!t14.id && t14.phaseId === 5, `${serv.name}: Day 14 capstone valid`);
}

console.log('\n===============================================================================');
console.log(`VERIFICATION SUMMARY: ${passedTests} passed, ${failedTests} failed out of ${totalTests} total tests`);
console.log('===============================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL SOCIAL OUTREACH VA CORRECTIONS & REGRESSION TESTS PASSED PERFECTLY!');
}

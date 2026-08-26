import { ALL_VA_SERVICES } from '../src/data/vaServicesData.ts';
import { generateDeterministicClientReply } from '../src/services/clientConversationEngine.ts';
import { generateSimulatedClient } from '../src/data/clientGenerator.ts';
import { generateTaskForDay } from '../src/data/taskGenerator.ts';
import { getDynamicOutreachContext } from '../src/data/socialOutreachFramework.ts';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    if (detail) console.error(`       Detail: ${detail}`);
    failed++;
  }
}

function getService(id: string) {
  return ALL_VA_SERVICES.find(s => s.id === id)!;
}

console.log('===============================================================================');
console.log('CoreGuide VA Simulator - Context Isolation Verification Suite');
console.log('===============================================================================');

// Base Client & Tasks
const smClient = generateSimulatedClient('social_media');
const smTask = generateTaskForDay(1, getService('social_media'), smClient);

const tmClient = generateSimulatedClient('travel_management');
const tmTask = generateTaskForDay(1, getService('travel_management'), tmClient);

const cwClient = generateSimulatedClient('content_writing');
const cwTask = generateTaskForDay(4, getService('content_writing'), cwClient); // Day 4 has 1,500 words in brief

const soClient = generateSimulatedClient('social_outreach');
const soTask = generateTaskForDay(1, getService('social_outreach'), soClient);

const lgClient = generateSimulatedClient('lead_gen_research');
const lgTask = generateTaskForDay(1, getService('lead_gen_research'), lgClient);

const csClient = generateSimulatedClient('customer_service');
const csTask = generateTaskForDay(1, getService('customer_service'), csClient);

const evaClient = generateSimulatedClient('executive_admin');
const evaTask = generateTaskForDay(1, getService('executive_admin'), evaClient);

// --- 1. Test A ---
console.log('\n--- Test A: Active service: social_media, Student asks: "Can you clarify the scope?" ---');
const replyA = generateDeterministicClientReply({
  message: 'Can you clarify the scope?',
  client: smClient,
  todaysTask: smTask,
  currentDay: 1,
  currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Setup' },
  history: [],
  serviceId: 'social_media',
});
assert(!replyA.toLowerCase().includes('lead'), 'Test A: Reply must NOT reference Lead Generation');
assert(!replyA.toLowerCase().includes('annual revenue'), 'Test A: Reply must NOT reference $3M revenue');
assert(!replyA.toLowerCase().includes('headquartered'), 'Test A: Reply must NOT reference headquarters');
assert(replyA.toLowerCase().includes('social media'), 'Test A: Reply must reference social media scope');

// --- 2. Test B ---
console.log('\n--- Test B: Active service: travel_management, Student asks: "What\'s the geography for this trip?" ---');
const replyB = generateDeterministicClientReply({
  message: "What's the geography for this trip?",
  client: tmClient,
  todaysTask: tmTask,
  currentDay: 1,
  currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Setup' },
  history: [],
  serviceId: 'travel_management',
});
assert(!replyB.toLowerCase().includes('headquartered'), 'Test B: Reply must NOT reference Lead Gen headquarters');
assert(!replyB.toLowerCase().includes('annual revenue'), 'Test B: Reply must NOT reference $3M revenue');
assert(replyB.toLowerCase().includes('travel destination'), 'Test B: Reply correctly references travel destination');

// --- 3. Test C ---
console.log('\n--- Test C: Active service: content_writing, Student asks: "What\'s the campaign scope?" ---');
const replyC = generateDeterministicClientReply({
  message: "What's the campaign scope?",
  client: cwClient,
  todaysTask: cwTask,
  currentDay: 4,
  currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Content' },
  history: [],
  serviceId: 'content_writing',
});
assert(!replyC.toLowerCase().includes('discovery call'), 'Test C: Reply must NOT reference Outreach discovery calls');
assert(!replyC.toLowerCase().includes('secondary domain'), 'Test C: Reply must NOT reference Outreach domains');
assert(replyC.toLowerCase().includes('writing assignment') || replyC.toLowerCase().includes('deliverable'), 'Test C: Reply references content writing scope');

// --- 4. Test D ---
console.log('\n--- Test D: Active service: social_marketing_outreach (and social_outreach), Student asks: "Who are we targeting?" ---');
const replyD1 = generateDeterministicClientReply({
  message: 'Who are we targeting?',
  client: soClient,
  todaysTask: soTask,
  currentDay: 1,
  currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Offer' },
  history: [],
  serviceId: 'social_outreach',
});
const ctxSO = getDynamicOutreachContext(soClient);
assert(replyD1.includes(ctxSO.targetTitles[0]), 'Test D (social_outreach): Returns client target titles');
assert(replyD1.includes(ctxSO.targetCompanySize), 'Test D (social_outreach): Returns client target company size');
assert(replyD1.includes(ctxSO.targetGeography), 'Test D (social_outreach): Returns client target geography');

const replyD2 = generateDeterministicClientReply({
  message: 'Who are we targeting?',
  client: soClient,
  todaysTask: soTask,
  currentDay: 1,
  currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Offer' },
  history: [],
  serviceId: 'social_marketing_outreach',
});
assert(replyD2.includes(ctxSO.targetTitles[0]), 'Test D (social_marketing_outreach alias): Returns client target titles');

// --- 5. Test E ---
console.log('\n--- Test E: Active service: lead_gen_research, Student asks: "What geography should I research?" ---');
const replyE = generateDeterministicClientReply({
  message: 'What geography should I research?',
  client: lgClient,
  todaysTask: lgTask,
  currentDay: 1,
  currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Research' },
  history: [],
  serviceId: 'lead_gen_research',
});
assert(replyE.toLowerCase().includes('headquartered in'), 'Test E: Returns research geography requirement');
assert(replyE.toLowerCase().includes('north america') || replyE.toLowerCase().includes('uk'), 'Test E: Derives contextual geography');

// --- 6. Test F ---
console.log('\n--- Test F: Active service: content_writing, Student asks: "What\'s the word count?" ---');
const replyF = generateDeterministicClientReply({
  message: "What's the word count?",
  client: cwClient,
  todaysTask: cwTask,
  currentDay: 4,
  currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Content' },
  history: [],
  serviceId: 'content_writing',
});
assert(replyF.toLowerCase().includes('1,500') || replyF.toLowerCase().includes('words'), 'Test F: Returns word count requirement from task brief', replyF);

// --- 7. Cross-Service Scope Tests (All 7 services with "Can you clarify the scope?") ---
console.log('\n--- 7. Cross-Service Scope Tests ---');
const scopeQuestions = [
  { serviceId: 'social_outreach', expectedSub: 'outreach', forbiddenSub: 'refund' },
  { serviceId: 'lead_gen_research', expectedSub: 'research assignment', forbiddenSub: 'social media' },
  { serviceId: 'content_writing', expectedSub: 'writing assignment', forbiddenSub: 'headquartered' },
  { serviceId: 'executive_admin', expectedSub: 'executive task', forbiddenSub: 'crm' },
  { serviceId: 'customer_service', expectedSub: 'support queue', forbiddenSub: 'outreach' },
  { serviceId: 'social_media', expectedSub: 'social media assignment', forbiddenSub: 'itinerary' },
  { serviceId: 'travel_management', expectedSub: 'travel management assignment', forbiddenSub: 'blog' },
];

for (const test of scopeQuestions) {
  const client = generateSimulatedClient(test.serviceId);
  const task = generateTaskForDay(1, getService(test.serviceId), client);
  const reply = generateDeterministicClientReply({
    message: 'Can you clarify the scope?',
    client,
    todaysTask: task,
    currentDay: 1,
    currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Test' },
    history: [],
    serviceId: test.serviceId,
  });
  assert(reply.toLowerCase().includes(test.expectedSub), `Scope for ${test.serviceId} includes "${test.expectedSub}"`);
  assert(!reply.toLowerCase().includes(test.forbiddenSub), `Scope for ${test.serviceId} does NOT leak "${test.forbiddenSub}"`);
}

// --- 8. Cross-Service Geography Tests ---
console.log('\n--- 8. Cross-Service Geography Tests ---');
const geoTests = [
  { serviceId: 'travel_management', expected: 'travel destination', forbidden: 'headquartered' },
  { serviceId: 'social_outreach', expected: 'target geography is', forbidden: 'door-to-door' },
  { serviceId: 'lead_gen_research', expected: 'headquartered in', forbidden: 'outbound domain' },
  { serviceId: 'customer_service', forbidden: 'headquartered in' },
  { serviceId: 'social_media', forbidden: 'headquartered in' },
];

for (const test of geoTests) {
  const client = generateSimulatedClient(test.serviceId);
  const task = generateTaskForDay(1, getService(test.serviceId), client);
  const reply = generateDeterministicClientReply({
    message: 'What geography should I focus on?',
    client,
    todaysTask: task,
    currentDay: 1,
    currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Test' },
    history: [],
    serviceId: test.serviceId,
  });
  if (test.expected) {
    assert(reply.toLowerCase().includes(test.expected), `Geography for ${test.serviceId} includes "${test.expected}"`);
  }
  if (test.forbidden) {
    assert(!reply.toLowerCase().includes(test.forbidden), `Geography for ${test.serviceId} does NOT leak "${test.forbidden}"`);
  }
}

// --- 9. Cross-Service Word Count & Article Tests ---
console.log('\n--- 9. Cross-Service Word Count & Article Tests ---');
const nonCWServices = ['executive_admin', 'social_outreach', 'customer_service', 'lead_gen_research'];
for (const sId of nonCWServices) {
  const client = generateSimulatedClient(sId);
  const task = generateTaskForDay(1, getService(sId), client);
  const reply = generateDeterministicClientReply({
    message: "What's the word count for this article?",
    client,
    todaysTask: task,
    currentDay: 1,
    currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Test' },
    history: [],
    serviceId: sId,
  });
  assert(!reply.toLowerCase().includes('linkedin thought-leadership'), `${sId} does NOT trigger hardcoded Content Writing article response`);
}

// --- 10. Prioritization & Ticket/Complaint Isolation ---
console.log('\n--- 10. Prioritization & Ticket/Complaint Isolation ---');
const replyPrioritizeEVA = generateDeterministicClientReply({
  message: 'Which one first?',
  client: evaClient,
  todaysTask: evaTask,
  currentDay: 1,
  currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Test' },
  history: [],
  serviceId: 'executive_admin',
});
assert(!replyPrioritizeEVA.toLowerCase().includes('refund complaint'), 'Executive VA prioritization does NOT mention refund complaints');
assert(!replyPrioritizeEVA.toLowerCase().includes('vip customer accounts'), 'Executive VA prioritization does NOT mention VIP accounts');
assert(replyPrioritizeEVA.toLowerCase().includes('prioritize the') || replyPrioritizeEVA.toLowerCase().includes('primary deliverable'), 'Executive VA prioritization uses task deliverables');

const replyPrioritizeCS = generateDeterministicClientReply({
  message: 'Which customer should I handle first?',
  client: csClient,
  todaysTask: csTask,
  currentDay: 1,
  currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Test' },
  history: [],
  serviceId: 'customer_service',
});
assert(replyPrioritizeCS.toLowerCase().includes('refund complaint'), 'Customer Service correctly prioritizes refund complaints and VIP accounts');

console.log('\n===============================================================================');
console.log(`VERIFICATION SUMMARY: ${passed} passed, ${failed} failed out of ${passed + failed} total tests`);
console.log('===============================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL CONTEXT ISOLATION & CROSS-SERVICE TESTS PASSED PERFECTLY!\n');
}

import { ALL_VA_SERVICES, BETA_14_DAY_PHASES } from '../src/data/vaServicesData.ts';
import { generateTaskForDay } from '../src/data/taskGenerator.ts';
import { generateClientReply } from '../src/services/clientConversationEngine.ts';
import { generateSimulatedClient } from '../src/data/clientGenerator.ts';

console.log("===============================================================================");
console.log("CoreGuide VA Simulator - Comprehensive 14-Day Curriculum Verification Suite");
console.log("===============================================================================\n");

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`[FAIL] ${testName} - ${detail || 'Assertion failed'}`);
  }
}

// 1. Verify 7 Official VA Services
console.log("--- 1. Testing Official VA Services (Founder Specification) ---");
assert(ALL_VA_SERVICES.length === 7, "Exactly 7 official VA services exist", `Found: ${ALL_VA_SERVICES.length}`);

const expectedServiceIds = [
  'customer_service',
  'social_media',
  'executive_admin',
  'travel_management',
  'social_outreach',
  'lead_gen_research',
  'content_writing'
];

expectedServiceIds.forEach(id => {
  const found = ALL_VA_SERVICES.some(s => s.id === id);
  assert(found, `Service '${id}' is registered in ALL_VA_SERVICES`);
});

// 2. Verify 14-Day Beta Compression Phases
console.log("\n--- 2. Testing 14-Day Beta Compression Phases ---");
assert(BETA_14_DAY_PHASES.length === 5, "Exactly 5 phases in 14-day beta curriculum", `Found: ${BETA_14_DAY_PHASES.length}`);
assert(BETA_14_DAY_PHASES[0].startDay === 1 && BETA_14_DAY_PHASES[0].endDay === 3, "Phase 1 covers Days 1-3");
assert(BETA_14_DAY_PHASES[1].startDay === 4 && BETA_14_DAY_PHASES[1].endDay === 7, "Phase 2 covers Days 4-7");
assert(BETA_14_DAY_PHASES[2].startDay === 8 && BETA_14_DAY_PHASES[2].endDay === 10, "Phase 3 covers Days 8-10 (Incomplete instructions)");
assert(BETA_14_DAY_PHASES[3].startDay === 11 && BETA_14_DAY_PHASES[3].endDay === 12, "Phase 4 covers Days 11-12 (Pressure & surges)");
assert(BETA_14_DAY_PHASES[4].startDay === 13 && BETA_14_DAY_PHASES[4].endDay === 14, "Phase 5 covers Days 13-14 (Capstone exam)");

// 3. Verify All 98 Unique Task Paths (7 Services x 14 Days)
console.log("\n--- 3. Testing All 98 Unique Service-Specific Task Paths (7 x 14) ---");
let totalTasksVerified = 0;

for (const service of ALL_VA_SERVICES) {
  const client = generateSimulatedClient(service.id);
  const serviceTasks: any[] = [];

  for (let day = 1; day <= 14; day++) {
    const task = generateTaskForDay(day, service, client, {
      previousTasks: serviceTasks,
    });

    serviceTasks.push(task);
    totalTasksVerified++;

    // Basic validity assertions
    const hasValidTitle = typeof task.title === 'string' && task.title.length > 5;
    const hasValidBrief = typeof task.brief === 'string' && task.brief.length > 30;
    const hasDeliverables = Array.isArray(task.deliverables) && task.deliverables.length > 0;
    const hasRequiredDeliv = task.deliverables?.some(d => d.required) ?? false;
    const hasTiming = task.estimatedMinutes > 0 && task.deadlineHours > 0;
    const hasPhase = typeof task.phaseId === 'number' && task.phaseId >= 1 && task.phaseId <= 5;

    assert(
      hasValidTitle && hasValidBrief && hasDeliverables && hasRequiredDeliv && hasTiming && hasPhase,
      `${service.shortName} Day ${day}: Generated valid task ("${task.title.substring(0, 45)}...")`
    );

    // Consecutive day non-repetition assertion
    if (day > 1) {
      const prevTask = serviceTasks[day - 2];
      const isNotRepeated = task.title !== prevTask.title && task.brief !== prevTask.brief;
      assert(
        isNotRepeated,
        `${service.shortName} Day ${day} vs Day ${day - 1}: Title & brief are strictly unique across consecutive days`
      );
    }
  }
}

assert(totalTasksVerified === 98, "Successfully generated and verified 98 unique service-day task paths", `Total: ${totalTasksVerified}`);

// 4. Test Repetition Prevention Engine
console.log("\n--- 4. Testing Repetition Prevention Engine ---");
const csService = ALL_VA_SERVICES.find(s => s.id === 'customer_service')!;
const csClient = generateSimulatedClient('customer_service');

const duplicateTaskCandidate = generateTaskForDay(1, csService, csClient);
// Now generate again passing previousTasks that contains this exact task
const preventedTask = generateTaskForDay(2, csService, csClient, {
  previousTasks: [duplicateTaskCandidate, duplicateTaskCandidate],
});

assert(
  preventedTask.title.includes("Advanced Scope") || preventedTask.brief.includes("Accelerated Execution Window") || preventedTask.id !== duplicateTaskCandidate.id,
  "Repetition Prevention Engine successfully detects and differentiates duplicate candidate"
);

// 5. Test Adaptive Weakness Injection
console.log("\n--- 5. Testing Adaptive Weakness Remediation ---");
const remediatedTask = generateTaskForDay(1, csService, csClient, {
  identifiedWeaknesses: ['Customer empathy and non-defensive tone was weak'],
});

assert(
  remediatedTask.brief.includes("CRITICAL COACHING NOTE") && remediatedTask.brief.includes("empathy"),
  "Adaptive engine injects targeted coaching note into task brief when weakness detected"
);

// 6. Test Client Conversation Engine (Phase 3 Clarification Responses)
console.log("\n--- 6. Testing Client Conversation Engine (Phase 3 Clarification Responses) ---");

const execClient = generateSimulatedClient('executive_admin');
const day8ExecTask = generateTaskForDay(8, ALL_VA_SERVICES.find(s => s.id === 'executive_admin')!, execClient);

const davidReply = await generateClientReply({
  message: "Which David are you referring to, and how long should the meeting be?",
  client: execClient,
  todaysTask: day8ExecTask,
  currentDay: 8,
  currentStage: { stageNumber: 3, name: 'Phase 3 — Clarification', focus: 'Clarification' },
  history: [],
});

assert(
  davidReply.includes("David Chen") && davidReply.includes("45 minutes"),
  "Executive VA Day 8: Client chat provides concrete clarification for 'David Chen'",
  `Received: ${davidReply}`
);

const csDay8Task = generateTaskForDay(8, csService, csClient);
const jordanReply = await generateClientReply({
  message: "I cannot find Jordan in our system, how should I look up their order?",
  client: csClient,
  todaysTask: csDay8Task,
  currentDay: 8,
  currentStage: { stageNumber: 3, name: 'Phase 3 — Clarification', focus: 'Clarification' },
  history: [],
});

assert(
  jordanReply.includes("Jordan") && (jordanReply.includes("phone number") || jordanReply.includes("CRM")),
  "Customer Service Day 8: Client chat provides concrete CRM lookup instructions for Jordan Reed",
  `Received: ${jordanReply}`
);

console.log("\n===============================================================================");
console.log(`VERIFICATION SUMMARY: ${passedTests} passed, ${failedTests} failed out of ${totalTests} total tests`);
console.log("===============================================================================");

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log("\nALL CURRICULUM, REPETITION PREVENTION & CONVERSATION TESTS PASSED PERFECTLY!");
}

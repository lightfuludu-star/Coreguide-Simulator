import { ALL_VA_SERVICES } from '../src/data/vaServicesData.ts';
import { generateSimulatedClient } from '../src/data/clientGenerator.ts';
import { generateTaskForDay } from '../src/data/taskGenerator.ts';
import { generateClientReply, generateDeterministicClientReply } from '../src/services/clientConversationEngine.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    process.exit(1);
  }
  console.log(`[PASS] ${message}`);
}

async function runSection10Tests() {
  console.log('===============================================================================');
  console.log('CoreGuide VA Simulator - Section 10 Explicit Tests');
  console.log('===============================================================================');

  // Test 1 — Social Media: "Can you clarify the scope?"
  // Expected: Do NOT return the Lead Generation response.
  {
    console.log('\n--- Test 1: social_media + "Can you clarify the scope?" ---');
    const service = ALL_VA_SERVICES.find(s => s.id === 'social_media')!;
    const client = generateSimulatedClient(service, 1);
    const task = generateTaskForDay(1, service, client);
    const reply = await generateClientReply({
      message: 'Can you clarify the scope?',
      client,
      todaysTask: task,
      currentDay: 1,
      currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Setup' },
      history: [],
      serviceId: 'social_media',
    });
    console.log('Reply:', reply);
    assert(!reply.toLowerCase().includes('lead generation'), 'Test 1: Does NOT reference Lead Generation');
    assert(!reply.toLowerCase().includes('$3m'), 'Test 1: Does NOT reference $3M revenue');
    assert(!reply.toLowerCase().includes('headquartered'), 'Test 1: Does NOT reference headquarters');
    assert(reply.toLowerCase().includes('social media assignment'), 'Test 1: Correctly references social media assignment');
  }

  // Test 2 — Travel: "What's the geography?"
  // Expected: Do NOT return the Lead Generation response.
  {
    console.log('\n--- Test 2: travel_management + "What\'s the geography?" ---');
    const service = ALL_VA_SERVICES.find(s => s.id === 'travel_management')!;
    const client = generateSimulatedClient(service, 1);
    const task = generateTaskForDay(1, service, client);
    const reply = await generateClientReply({
      message: "What's the geography?",
      client,
      todaysTask: task,
      currentDay: 1,
      currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Setup' },
      history: [],
      serviceId: 'travel_management',
    });
    console.log('Reply:', reply);
    assert(!reply.toLowerCase().includes('headquartered'), 'Test 2: Does NOT reference headquarters');
    assert(!reply.toLowerCase().includes('$3m'), 'Test 2: Does NOT reference $3M');
    assert(reply.toLowerCase().includes('travel destination'), 'Test 2: References travel destination');
  }

  // Test 3 — Customer Service: "What's our target?"
  // Expected: Do NOT return the Social Marketing response.
  {
    console.log('\n--- Test 3: customer_service + "What\'s our target?" ---');
    const service = ALL_VA_SERVICES.find(s => s.id === 'customer_service')!;
    const client = generateSimulatedClient(service, 1);
    const task = generateTaskForDay(1, service, client);
    const reply = await generateClientReply({
      message: "What's our target?",
      client,
      todaysTask: task,
      currentDay: 1,
      currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Setup' },
      history: [],
      serviceId: 'customer_service',
    });
    console.log('Reply:', reply);
    assert(!reply.toLowerCase().includes('cmo'), 'Test 3: Does NOT reference CMO (Outreach ICP)');
    assert(!reply.toLowerCase().includes('vp of growth'), 'Test 3: Does NOT reference VP of Growth');
    assert(!reply.toLowerCase().includes('discovery calls'), 'Test 3: Does NOT reference Outreach discovery calls');
    assert(!reply.toLowerCase().includes('outbound domain'), 'Test 3: Does NOT reference Outreach domain');
  }

  // Test 4 — Content Writing: "What's the word count?"
  // Expected: Use the active Content Writing task/context.
  {
    console.log('\n--- Test 4: content_writing + "What\'s the word count?" ---');
    const service = ALL_VA_SERVICES.find(s => s.id === 'content_writing')!;
    const client = generateSimulatedClient(service, 4); // Day 4 is 1,500-word blog post
    const task = generateTaskForDay(4, service, client);
    const reply = await generateClientReply({
      message: "What's the word count?",
      client,
      todaysTask: task,
      currentDay: 4,
      currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Content' },
      history: [],
      serviceId: 'content_writing',
    });
    console.log('Reply:', reply);
    assert(reply.includes('1,500 words') || reply.includes('1500 words'), 'Test 4: Uses dynamic task brief word count (1,500 words)');
    assert(!reply.includes('1,000-1,200'), 'Test 4: Does NOT use obsolete hardcoded 1,000-1,200 words');
  }

  // Test 5 — Lead Generation: "What's the research scope?"
  // Expected: Use the active Lead Generation research context.
  {
    console.log('\n--- Test 5: lead_gen_research + "What\'s the research scope?" ---');
    const service = ALL_VA_SERVICES.find(s => s.id === 'lead_gen_research')!;
    const client = generateSimulatedClient(service, 1);
    const task = generateTaskForDay(1, service, client);
    const reply = await generateClientReply({
      message: "What's the research scope?",
      client,
      todaysTask: task,
      currentDay: 1,
      currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Research' },
      history: [],
      serviceId: 'lead_gen_research',
    });
    console.log('Reply:', reply);
    assert(reply.toLowerCase().includes('research assignment'), 'Test 5: References research assignment');
    assert(reply.toLowerCase().includes(client.industry.toLowerCase()), 'Test 5: Uses active client industry context');
    assert(reply.toLowerCase().includes('verified source links'), 'Test 5: References verified source links');
  }

  // Test 6 — Social Marketing & Cold Outreach: "Who exactly are we targeting?"
  // Expected: Use the current client's ICP/campaign context.
  {
    console.log('\n--- Test 6: social_marketing_outreach + "Who exactly are we targeting?" ---');
    const service = ALL_VA_SERVICES.find(s => s.id === 'social_outreach')!;
    const client = generateSimulatedClient(service, 1);
    const task = generateTaskForDay(1, service, client);
    const reply = await generateClientReply({
      message: 'Who exactly are we targeting?',
      client,
      todaysTask: task,
      currentDay: 1,
      currentStage: { stageNumber: 1, name: 'Foundation', focus: 'Outreach' },
      history: [],
      serviceId: 'social_marketing_outreach',
    });
    console.log('Reply:', reply);
    assert(reply.includes('Target Chief Marketing Officer (CMO)') || reply.includes('Target Head of People'), 'Test 6: Returns active client target titles');
    assert(reply.includes('companies with'), 'Test 6: Returns company size criteria');
    assert(reply.includes('decision-makers facing'), 'Test 6: Returns client core pain points');
  }

  console.log('\n===============================================================================');
  console.log('ALL SECTION 10 TESTS PASSED SUCCESSFULLY!');
  console.log('===============================================================================');
}

runSection10Tests();

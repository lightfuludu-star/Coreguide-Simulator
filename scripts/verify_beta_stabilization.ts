import assert from 'node:assert';
import { ALL_VA_SERVICES, getServiceById } from '../src/data/vaServicesData.ts';
import { generateSimulatedClient, getAvailableIndustriesForService } from '../src/data/clientGenerator.ts';
import { generateTaskForDay } from '../src/data/taskGenerator.ts';

console.log('===============================================================================');
console.log('CoreGuide Simulator — 14-Day Beta Stabilization Validation');
console.log('===============================================================================');

// 1. Authoritative 7 Services Verification
console.log('\n[1] Verifying Authoritative 7 Services...');
const expectedServiceIds = [
  'executive_admin',
  'social_media',
  'customer_service',
  'travel_management',
  'social_outreach',
  'lead_gen_research',
  'content_writing',
];
assert.strictEqual(ALL_VA_SERVICES.length, 7, 'Must have exactly 7 official services');
for (const id of expectedServiceIds) {
  const found = ALL_VA_SERVICES.find((s) => s.id === id);
  assert(found, `Service ${id} must exist in official catalog`);
}
console.log('  -> PASS: All 7 official services are present and authoritative.');

// 2. Travel Management Archetypes Verification
console.log('\n[2] Verifying Travel Management Client Archetypes (Pastor, Event Planner, Creator, Founder)...');
const tmArchetypes = ['founder', 'pastor', 'event_planner', 'travel_creator'];
const tmIndustries = getAvailableIndustriesForService('travel_management');
for (const arch of tmArchetypes) {
  const foundInIndustries = tmIndustries.find((i) => i.id === arch);
  assert(foundInIndustries, `Travel Management must have industry option '${arch}'`);
  const client = generateSimulatedClient('travel_management', arch);
  assert(client, `Must generate client for archetype '${arch}'`);
  assert(client.ceoName, `Client for '${arch}' must have valid name`);
  console.log(`  -> PASS: Travel Management archetype '${arch}': ${client.ceoName} (${client.companyName})`);
}

// 3. Customer Service Verticals Verification (Food, Fashion, Health, E-Commerce)
console.log('\n[3] Verifying Customer Service Verticals (Food, Fashion, Health, E-Commerce)...');
const csVerticals = ['food_delivery', 'fashion_apparel', 'health_wellness', 'ecommerce_goods'];
const csIndustries = getAvailableIndustriesForService('customer_service');
for (const vert of csVerticals) {
  const foundInIndustries = csIndustries.find((i) => i.id === vert);
  assert(foundInIndustries, `Customer Service must have industry option '${vert}'`);
  const client = generateSimulatedClient('customer_service', vert);
  const task = generateTaskForDay(1, getServiceById('customer_service'), client, { industry: vert });
  assert(task.brief, `Day 1 task must exist for Customer Service '${vert}'`);
  if (vert === 'food_delivery') {
    assert(task.brief.includes('shawarma') || task.brief.includes('vanilla'), 'Day 1 food task must reference food scenario (shawarma/vanilla)');
  }
  console.log(`  -> PASS: Customer Service vertical '${vert}': ${task.title}`);
}

// 4. Day 1 Initialization Guarantee Verification
console.log('\n[4] Verifying Day 1 Initialization (No Day 6 or Day 14 Fallbacks)...');
for (const srv of ALL_VA_SERVICES) {
  const client = generateSimulatedClient(srv.id);
  const day1Task = generateTaskForDay(1, srv, client);
  assert.strictEqual(day1Task.dayNumber, 1, `Day 1 task must have dayNumber === 1 for ${srv.id}`);
  assert(day1Task.title.includes('Day 1'), `Day 1 task title must explicitly indicate Day 1 for ${srv.id}`);
  assert(!day1Task.id.includes('day-6') && !day1Task.id.includes('day-14'), `Day 1 task must not be Day 6 or Day 14 for ${srv.id}`);
}
console.log('  -> PASS: Day 1 tasks initialize deterministically on Day 1 across all 7 services.');

// 5. 14-Day Progression Structure Verification
console.log('\n[5] Verifying 14-Day Progression Phases across All Services...');
for (const srv of ALL_VA_SERVICES) {
  const client = generateSimulatedClient(srv.id);
  for (let day = 1; day <= 14; day++) {
    const task = generateTaskForDay(day, srv, client);
    assert(task, `Task for Day ${day} must exist for ${srv.name}`);
    assert(task.title, `Task for Day ${day} must have title`);
    assert(task.deliverables.length > 0, `Task for Day ${day} must have at least 1 deliverable`);

    // Verify phase difficulty progression
    if (day <= 3) {
      assert.strictEqual(task.phaseId, 1, `Days 1-3 must be Phase 1 (Foundation) for ${srv.name}`);
    } else if (day <= 7) {
      assert.strictEqual(task.phaseId, 2, `Days 4-7 must be Phase 2 (Independent Execution) for ${srv.name}`);
    } else if (day <= 10) {
      assert.strictEqual(task.phaseId, 3, `Days 8-10 must be Phase 3 (Problem Solving) for ${srv.name}`);
    } else if (day <= 12) {
      assert.strictEqual(task.phaseId, 4, `Days 11-12 must be Phase 4 (Pressure) for ${srv.name}`);
    } else {
      assert.strictEqual(task.phaseId, 5, `Days 13-14 must be Phase 5 (Capstone) for ${srv.name}`);
    }
  }
  console.log(`  -> PASS: ${srv.name} possesses full 14-day progressive curriculum.`);
}

console.log('\n===============================================================================');
console.log('ALL 14-DAY BETA STABILIZATION VERIFICATIONS PASSED SUCCESSFULLY!');
console.log('===============================================================================');

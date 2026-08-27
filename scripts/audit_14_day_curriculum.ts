import { ALL_VA_SERVICES, getServiceById } from '../src/data/vaServicesData.ts';
import { generateSimulatedClient } from '../src/data/clientGenerator.ts';
import { generateTaskForDay } from '../src/data/taskGenerator.ts';

const services = [
  { id: 'executive_admin', name: 'Executive VA', industry: 'b2b_saas' },
  { id: 'social_media', name: 'Social Media VA', industry: 'fashion_lifestyle' },
  { id: 'customer_service', name: 'Customer Service VA', industry: 'food_delivery' },
  { id: 'travel_management', name: 'Travel Management VA', industry: 'founder' },
  { id: 'social_outreach', name: 'Social Marketing & Cold Outreach VA', industry: 'digital_marketing' },
  { id: 'lead_gen_research', name: 'Lead Generation & Research VA', industry: 'saas_technology' },
  { id: 'content_writing', name: 'Content Writing VA', industry: 'web3_tech' },
];

console.log('================================================================================');
console.log('SERVICE-BY-SERVICE 14-DAY CURRICULUM AUDIT');
console.log('================================================================================\n');

for (const s of services) {
  const serviceDef = getServiceById(s.id);
  const client = generateSimulatedClient(s.id, s.industry);

  console.log(`\n--------------------------------------------------------------------------------`);
  console.log(`SERVICE: ${s.name} (${s.id})`);
  console.log(`Client: ${client.ceoName} (${client.companyName}) • Vertical: ${client.industry}`);
  console.log(`--------------------------------------------------------------------------------`);

  for (let day = 1; day <= 14; day++) {
    const task = generateTaskForDay(day, serviceDef, client, {
      competencies: serviceDef.competencies,
      industry: s.industry,
    });

    const deliverables = task.deliverables.map((d) => d.label).join('; ');
    console.log(`Day ${day.toString().padStart(2, ' ')}: [${task.id}] ${task.title}`);
    console.log(`   Category: ${task.category} | Priority: ${task.priority}`);
    console.log(`   Deliverables: ${deliverables}`);
  }
}

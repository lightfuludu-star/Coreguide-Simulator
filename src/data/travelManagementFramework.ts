// ==============================================================================
// CoreGuide VA Simulator - Travel Management VA 14-Day Curriculum Framework
// 4 Client Archetypes: Founder, Pastor, Event Planner, YouTube Travel Creator
// ==============================================================================

import { TaskItem, ClientPersona, CompetencyMetric } from '../types';

export type TravelClientArchetype = 'founder' | 'pastor' | 'event_planner' | 'travel_creator';

export interface TravelArchetypeContext {
  archetypeId: TravelClientArchetype;
  archetypeName: string;
  clientRole: string;
  travelPurpose: string;
  keyPreferences: string[];
  typicalDestinations: string[];
  budgetTier: string;
}

export const TRAVEL_ARCHETYPES: Record<TravelClientArchetype, TravelArchetypeContext> = {
  founder: {
    archetypeId: 'founder',
    archetypeName: 'Tech Founder & C-Suite Executive',
    clientRole: 'CEO & Founder',
    travelPurpose: 'Investor roadshows, client summits, quarterly board meetings, executive retreats',
    keyPreferences: ['Direct business class flights', 'Hotels with dedicated workspaces and <5 min to meeting hub', 'Private black car / Uber Black', '15-minute buffers between calls'],
    typicalDestinations: ['San Francisco', 'New York', 'London', 'Singapore'],
    budgetTier: 'Executive / Premium',
  },
  pastor: {
    archetypeId: 'pastor',
    archetypeName: 'Ministry Leader & Keynote Pastor',
    clientRole: 'Senior Pastor & Conference Speaker',
    travelPurpose: 'National leadership conferences, ministry retreats, multi-city church speaking tours',
    keyPreferences: ['Reliable morning flights', 'Quiet hotel suites with study area for sermon prep', 'Church volunteer airport pickup coordination or rental car', 'Dietary restrictions (healthy / non-processed)'],
    typicalDestinations: ['Atlanta', 'Dallas', 'Chicago', 'Nairobi'],
    budgetTier: 'Stewardship / Mid-Tier Non-Profit',
  },
  event_planner: {
    archetypeId: 'event_planner',
    archetypeName: 'Corporate Event & Conference Planner',
    clientRole: 'VP Global Events',
    travelPurpose: 'Multi-speaker summits, venue site inspections, 30-person VIP executive retreats',
    keyPreferences: ['Group room blocks', 'Staggered airport shuttles for 20+ attendees', 'Vendor logistics & banquet dining', 'Strict master budget spreadsheet'],
    typicalDestinations: ['Orlando', 'Las Vegas', 'Barcelona', 'Denver'],
    budgetTier: 'Corporate Group Budget',
  },
  travel_creator: {
    archetypeId: 'travel_creator',
    archetypeName: 'YouTube Travel Creator & Documentarian',
    clientRole: 'Content Creator & Producer',
    travelPurpose: 'Multi-city video filming, cultural storytelling, unique excursions, gear transport',
    keyPreferences: ['Scenic boutique lodging / unique Airbnb stays', 'Extra baggage allowance for 4 camera cases', 'Uninterrupted 100+ Mbps Wi-Fi for 4K video uploads', 'Golden hour filming time-blocks'],
    typicalDestinations: ['Tokyo', 'Reykjavik', 'Oaxaca', 'Bali'],
    budgetTier: 'Flexible / Content ROI Focused',
  },
};

export function getTravelArchetype(client: ClientPersona): TravelArchetypeContext {
  const role = (client.ceoRole || '').toLowerCase();
  const ind = (client.industry || '').toLowerCase();
  const name = (client.ceoName || '').toLowerCase();

  if (role.includes('pastor') || ind.includes('ministry') || ind.includes('church') || name.includes('pastor')) {
    return TRAVEL_ARCHETYPES.pastor;
  }
  if (role.includes('event') || ind.includes('event') || ind.includes('conference')) {
    return TRAVEL_ARCHETYPES.event_planner;
  }
  if (role.includes('creator') || role.includes('youtube') || ind.includes('creator') || ind.includes('media')) {
    return TRAVEL_ARCHETYPES.travel_creator;
  }
  return TRAVEL_ARCHETYPES.founder;
}

export interface GenerateTravelManagementTaskParams {
  dayNumber: number;
  client: ClientPersona;
  competencies?: CompetencyMetric[];
  previousTasks?: TaskItem[];
  previousSubmissions?: any[];
  identifiedWeaknesses?: string[];
  chatHistory?: any[];
}

export function generateTravelManagementTask(params: GenerateTravelManagementTaskParams): TaskItem {
  const { dayNumber, client, identifiedWeaknesses = [] } = params;
  const arch = getTravelArchetype(client);
  const clientName = client.ceoName || 'Travel Client';
  const company = client.companyName || 'Travel Program';
  const dest1 = arch.typicalDestinations[0];
  const dest2 = arch.typicalDestinations[1] || 'New York';

  const hasFlightWeakness = identifiedWeaknesses.some((w) => /flight|layover|connection|transit/i.test(w));
  const hasItineraryWeakness = identifiedWeaknesses.some((w) => /itinerary|buffer|schedule|time/i.test(w));

  // ----------------------------------------------------------------------------
  // PHASE 1: DAYS 1–3 — FOUNDATION, PREFERENCE PROFILING & CORE SOURCING
  // ----------------------------------------------------------------------------
  if (dayNumber === 1) {
    return {
      id: 'task-tm-day-1',
      dayNumber: 1,
      phaseId: 1,
      title: `Day 1: Client Travel Preference Profile & Multi-Option Flight Sourcing (${arch.archetypeName})`,
      category: 'Calendar & Travel',
      priority: 'high',
      estimatedMinutes: 35,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Welcome to ${company}! Your first assignment is managing travel logistics for ${clientName} (${arch.clientRole}): 1. Document ${clientName}'s Master Travel Preference Profile (preferred airlines, seat type, layover thresholds, passport details, loyalty numbers). 2. Research and present 3 distinct flight options for an upcoming trip to ${dest1}: Option A (Best Direct / Premium), Option B (Optimal Value), Option C (Flexible Morning Departure). Include departure/arrival times, layover durations, and baggage policies.`,
      clientContext: `${clientName} message: "I travel frequently and bad flights ruin my energy. Build a clear comparison of 3 realistic flight options to ${dest1}. Factor in my preferences: ${arch.keyPreferences[0]} and ${arch.keyPreferences[1]}."`,
      deliverables: [
        { id: 'del-tm-1-1', label: `Client Travel Preference Profile & Booking Guidelines for ${clientName}`, type: 'document', required: true },
        { id: 'del-tm-1-2', label: `3-Option Flight Comparison Matrix for ${dest1}`, type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 2) {
    return {
      id: 'task-tm-day-2',
      dayNumber: 2,
      phaseId: 1,
      title: `Day 2: Strategic Accommodation Sourcing & Critical Amenity Vetting (${dest1})`,
      category: 'Calendar & Travel',
      priority: 'medium',
      estimatedMinutes: 40,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `${clientName} needs accommodation in ${dest1} for 3 nights. 1. Research and evaluate 3 vetted lodging options matching our ${arch.budgetTier} guidelines. 2. Verify critical non-negotiable amenities: high-speed verified Wi-Fi (>50 Mbps), proximity to main destination hub (<15 min commute), quiet work area, and flexible cancellation policy. 3. Build a side-by-side comparison with pricing, location maps, and pros/cons.`,
      clientContext: `${clientName} message: "Never book a hotel without verifying Wi-Fi speed and transit time to my meetings/events. I cannot afford to be stranded in traffic or unable to upload files."`,
      deliverables: [
        { id: 'del-tm-2-1', label: `3-Property Lodging Comparison & Location Matrix for ${dest1}`, type: 'spreadsheet', required: true },
        { id: 'del-tm-2-2', label: 'Accommodation Recommendation Summary & Cancellation Policy Note', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 3) {
    return {
      id: 'task-tm-day-3',
      dayNumber: 3,
      phaseId: 1,
      title: `Day 3: Ground Transportation Logistics & Airport Transfer Coordination`,
      category: 'Calendar & Travel',
      priority: 'medium',
      estimatedMinutes: 35,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `Coordinate seamless door-to-door ground transit for ${clientName} in ${dest1}: 1. Arrange arrival airport transfer (comparing pre-booked executive chauffeur vs ride-share pickup zone vs dedicated vehicle rental). 2. Map out daily transit between hotel and meeting/speaking/filming venues with traffic rush-hour buffer calculations. 3. Create a mobile-friendly Ground Transportation Cheat Sheet with emergency driver contacts, pickup pin locations, and confirmation numbers.`,
      clientContext: `${clientName} message: "Landing at an unfamiliar airport after a long flight is exhausting. Make sure I have exact instructions on where to walk, who is picking me up, and how to get to my hotel without friction."`,
      deliverables: [
        { id: 'del-tm-3-1', label: 'Ground Transportation Strategy & Commute Time Matrix', type: 'spreadsheet', required: true },
        { id: 'del-tm-3-2', label: 'Mobile Executive Ground Transit Cheat Sheet', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 2: DAYS 4–7 — COMPLETE ITINERARIES, BUDGETS & VENUE RESERVATIONS
  // ----------------------------------------------------------------------------
  if (dayNumber === 4) {
    return {
      id: 'task-tm-day-4',
      dayNumber: 4,
      phaseId: 2,
      title: `Day 4: Master Door-to-Door Daily Travel Itinerary Construction (${dest1})`,
      category: 'Calendar & Travel',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Assemble a comprehensive, time-blocked Master Itinerary for ${clientName}'s upcoming trip to ${dest1}: 1. Incorporate all travel legs: home departure, flight check-in cutoff, flight times with timezone changes, baggage claim, airport transfer, hotel check-in, scheduled engagements, and return journey. ${hasItineraryWeakness ? 'CRITICAL COACHING NOTE: Ensure generous 30-minute buffers between commitments so delays do not cause missed meetings.' : ''} 2. Include confirmation codes, addresses, emergency contacts, and local weather forecasts.`,
      clientContext: `${clientName} message: "I want one master document on my phone that answers every question: what time I need to leave, where my driver is, my hotel reservation code, and what my day looks like. Keep it clean and mistake-free."`,
      deliverables: [
        { id: 'del-tm-4-1', label: `Master Door-to-Door Travel Itinerary for ${dest1}`, type: 'document', required: true },
        { id: 'del-tm-4-2', label: 'Time-Blocked Travel Schedule & Calendar Sync Matrix', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 5) {
    return {
      id: 'task-tm-day-5',
      dayNumber: 5,
      phaseId: 2,
      title: `Day 5: Dining Reservations, Private Meeting Rooms & Venue Coordination`,
      category: 'Operations & CRM',
      priority: 'medium',
      estimatedMinutes: 35,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `${clientName} requires venue arrangements in ${dest1}: 1. Research and reserve a private dining room for a VIP dinner with 4 key stakeholders, adhering to dietary restrictions (gluten-free and plant-based options required). 2. Book a quiet, professional 6-person meeting room for 3 hours near the hotel with AV presentation screen and conference phone setup. 3. Confirm all reservation cancellation policies and dress code guidelines.`,
      clientContext: `${clientName} message: "A noisy restaurant will ruin an executive dinner. Pick a venue with a quiet ambiance, great service, and healthy food options, and secure a private conference room for my team sync."`,
      deliverables: [
        { id: 'del-tm-5-1', label: `Curated Dining & Private Meeting Room Venue Dossier for ${dest1}`, type: 'document', required: true },
        { id: 'del-tm-5-2', label: 'Reservation Confirmation Log & Dietary Requirements Matrix', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 6) {
    return {
      id: 'task-tm-day-6',
      dayNumber: 6,
      phaseId: 2,
      title: `Day 6: Travel Expense Tracking, Receipt Audit & Per Diem Budget Reconciliation`,
      category: 'Data & Spreadsheets',
      priority: 'high',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Manage post-travel financial reconciliation for ${clientName}: 1. Review 10 simulated travel expense receipts (flights, hotels, meals, Uber rides, baggage fees, client entertainment). 2. Categorize all expenses against the company travel policy and per diem limits. 3. Flag 2 out-of-policy expenses (e.g. personal mini-bar charges or missing itemized meal receipts) and draft an audit memo explaining how they should be handled for reimbursement.`,
      clientContext: `${clientName} message: "Finance needs our expense reports submitted by Friday. Categorize all my receipts, calculate the total spend against budget, and draft the reimbursement breakdown."`,
      deliverables: [
        { id: 'del-tm-6-1', label: 'Master Travel Expense Reconciliation & Receipt Audit Spreadsheet', type: 'spreadsheet', required: true },
        { id: 'del-tm-6-2', label: 'Travel Expense Policy Compliance & Reimbursement Memo', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 7) {
    return {
      id: 'task-tm-day-7',
      dayNumber: 7,
      phaseId: 2,
      title: `Day 7: International Compliance Dossier: Visas, Currency & Emergency Protocols`,
      category: 'Research & Synthesis',
      priority: 'medium',
      estimatedMinutes: 40,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `${clientName} is planning an international trip next month to ${dest2}. 1. Audit visa and entry requirements based on citizenship (passport validity >6 months, tourist/business visa ETA, health declaration). 2. Prepare currency exchange guidance: local currency customs, credit card foreign transaction fee recommendations, and tipping customs. 3. Compile an Emergency Protocol Sheet (nearest embassy/consulate, 24/7 travel insurance hotline, local emergency numbers).`,
      clientContext: `${clientName} message: "International travel requires thorough preparation. Make sure my paperwork, visa requirements, and emergency contacts are bulletproof before I leave the country."`,
      deliverables: [
        { id: 'del-tm-7-1', label: `International Travel Compliance & Entry Requirements Dossier for ${dest2}`, type: 'document', required: true },
        { id: 'del-tm-7-2', label: 'Emergency Contact & Financial Currency Briefing Sheet', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 3: DAYS 8–10 — INCOMPLETE REQUESTS, AMBIGUITY & CHANGING CONSTRAINTS
  // ----------------------------------------------------------------------------
  if (dayNumber === 8) {
    return {
      id: 'task-tm-day-8',
      dayNumber: 8,
      phaseId: 3,
      title: `Day 8: Incomplete Travel Request Triage & Active Clarification ("Book My Flight")`,
      category: 'Calendar & Travel',
      priority: 'urgent',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${clientName} sent an incomplete voice note: "Hey, need to fly to ${dest2} next week for a few days. Book something good." The request omits exact departure date, return date, preferred airport (if multi-airport city), whether anyone else is traveling, and meeting start times. 1. Use the Client Chat to ask ${clientName} the 4 essential questions needed to book without making costly assumptions. 2. Draft the booking framework with conditional scenarios while awaiting confirmation.`,
      clientContext: `${clientName} message: "Hey, need to fly to ${dest2} next week for a few days. Book something good. (Sent from airport security line)"`,
      deliverables: [
        { id: 'del-tm-8-1', label: `Clarification Inquiry & Strategic Travel Options Framework for ${clientName}`, type: 'text', required: true },
        { id: 'del-tm-8-2', label: 'Conditional Flight & Lodging Booking Scenarios Document', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 9) {
    return {
      id: 'task-tm-day-9',
      dayNumber: 9,
      phaseId: 3,
      title: `Day 9: Last-Minute Schedule Shift & Meeting Calendar Deconfliction`,
      category: 'Calendar & Travel',
      priority: 'urgent',
      estimatedMinutes: 40,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `An urgent change occurred: while in ${dest1}, ${clientName}'s keynote speech / investor meeting has been moved forward by 3.5 hours (from 4:00 PM to 12:30 PM). This creates a direct clash with hotel check-out, scheduled ground transit, and lunch. 1. Deconflict the schedule: request early check-out luggage hold with hotel front desk, reschedule driver pickup time, and notify all attendees. 2. Issue an updated emergency revised schedule.`,
      clientContext: `${clientName} message: "They just moved my presentation to 12:30 PM! My whole schedule is blown up. Re-align my hotel check-out, move my car pickup, and send me the updated timeline immediately."`,
      deliverables: [
        { id: 'del-tm-9-1', label: 'Urgent Schedule Adjustment & Stakeholder Notification Suite', type: 'email_draft', required: true },
        { id: 'del-tm-9-2', label: 'Revised Same-Day Operational Timeline Matrix', type: 'spreadsheet', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 10) {
    return {
      id: 'task-tm-day-10',
      dayNumber: 10,
      phaseId: 3,
      title: `Day 10: Multi-City, Multi-Timezone Synchronization Logistics`,
      category: 'Calendar & Travel',
      priority: 'high',
      estimatedMinutes: 45,
      deadlineHours: 6,
      deadlineType: 'soft',
      brief: `${clientName} is embarking on a 3-city trip across 3 different timezones over 5 days (e.g. London GMT -> New York EST -> San Francisco PST). 1. Build a synchronized multi-timezone itinerary tracking local time vs home timezone for all flights, calls, and meetings. 2. Identify circadian rhythm buffers: ensure no early morning meetings immediately following transatlantic flight legs. 3. Coordinate calendar invites with correct automatic timezone translations.`,
      clientContext: `${clientName} message: "Timezone mistakes cause missed calls. Map out my 3-city trip so I always know what time it is locally and what time it is back home before I dial in."`,
      deliverables: [
        { id: 'del-tm-10-1', label: 'Multi-City Multi-Timezone Master Synchronization Schedule', type: 'spreadsheet', required: true },
        { id: 'del-tm-10-2', label: 'Timezone Fatigue Management & Meeting Alignment Plan', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 4: DAYS 11–12 — PRESSURE, CANCELLATIONS & MULTI-TRAVELER EMERGENCIES
  // ----------------------------------------------------------------------------
  if (dayNumber === 11) {
    return {
      id: 'task-tm-day-11',
      dayNumber: 11,
      phaseId: 4,
      title: `Day 11: Flight Cancellation Emergency Rebooking & Stranded Transit Recovery`,
      category: 'Calendar & Travel',
      priority: 'urgent',
      estimatedMinutes: 50,
      deadlineHours: 3,
      deadlineType: 'hard',
      brief: `CRISIS SCENARIO: ${clientName}'s connecting flight in Chicago has been canceled due to severe weather. The airline automatically rebooked them on a flight departing 22 hours later, which will cause them to miss their primary speaking event/meeting tomorrow morning. 1. Find 2 alternative same-day routing options (including competing airlines or nearby alternate airports). 2. Secure a nearby airport hotel day-room reservation if an overnight stay is inevitable. 3. Draft urgent communications to airline rebooking agents and event coordinators.`,
      clientContext: `${clientName} message: "I am stuck at the gate in Chicago! The airline's rebooking makes me miss the entire event. Find me another flight on ANY airline that gets me there by tonight, or get me a hotel room immediately!"`,
      deliverables: [
        { id: 'del-tm-11-1', label: 'Emergency Flight Re-routing Matrix (Multi-Airline Sourcing)', type: 'spreadsheet', required: true },
        { id: 'del-tm-11-2', label: 'Crisis Stakeholder Communication & Airline Compensation Letter', type: 'email_draft', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (dayNumber === 12) {
    return {
      id: 'task-tm-day-12',
      dayNumber: 12,
      phaseId: 4,
      title: `Day 12: Multi-Traveler Group Coordination under Tight Budget Constraints`,
      category: 'Data & Spreadsheets',
      priority: 'urgent',
      estimatedMinutes: 45,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `Coordinate travel arrangements for a team of 4 travelers departing from 3 different origin cities arriving in ${dest1} for an annual retreat. Total group budget is strictly capped at $4,800 total. 1. Source and coordinate staggered flight arrivals within a 90-minute window so they can share a single airport transfer van. 2. Secure a 4-bedroom executive suite or 4 individual corporate rooms within budget. 3. Build the master team manifest.`,
      clientContext: `${clientName} message: "We have 4 team members flying in from different states. Coordinate their arrivals so they land around the same time, don't exceed our $4,800 budget cap, and keep everyone organized."`,
      deliverables: [
        { id: 'del-tm-12-1', label: 'Multi-Traveler Group Manifest & Staggered Arrival Matrix', type: 'spreadsheet', required: true },
        { id: 'del-tm-12-2', label: 'Group Accommodation & Budget Allocation Plan ($4,800 Cap)', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // ----------------------------------------------------------------------------
  // PHASE 5: DAYS 13–14 — VIP LOGISTICS & PRACTICAL CAPSTONE
  // ----------------------------------------------------------------------------
  if (dayNumber === 13) {
    return {
      id: 'task-tm-day-13',
      dayNumber: 13,
      phaseId: 5,
      title: `Day 13: Executive VIP Retreat Logistics & Travel Contingency Protocol`,
      category: 'Operations & CRM',
      priority: 'high',
      estimatedMinutes: 50,
      deadlineHours: 4,
      deadlineType: 'hard',
      brief: `${clientName} is organizing a high-profile 20-person executive retreat. 1. Draft the comprehensive Event Travel Operational Blueprint (flight booking deadlines, VIP arrival greeting protocol, dietary preference logistics, private charter transit). 2. Develop a proactive Risk Management & Contingency Protocol (flight delay triggers, medical emergency hospital locations, backup meeting facilities).`,
      clientContext: `${clientName} message: "This retreat is high-stakes. Every detail must be accounted for. If a key speaker's flight is delayed or an attendee loses their luggage, our contingency protocol must solve it instantly."`,
      deliverables: [
        { id: 'del-tm-13-1', label: '20-Person Executive Retreat Travel Blueprint & Master Manifest', type: 'spreadsheet', required: true },
        { id: 'del-tm-13-2', label: 'Travel Risk Management & Contingency Emergency Protocol', type: 'document', required: true },
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // Day 14: Practical Capstone
  return {
    id: 'task-tm-day-14',
    dayNumber: 14,
    phaseId: 5,
    title: `Day 14: Final 14-Day Practical Capstone — Master Travel & Event Logistics Dossier`,
    category: 'Calendar & Travel',
    priority: 'urgent',
    estimatedMinutes: 60,
    deadlineHours: 4,
    deadlineType: 'hard',
    brief: `Your 14-day Travel Management VA graduation practical assessment. Demonstrate mastery across all travel competencies: Preference Profiling, Route & Accommodation Optimization, Door-to-Door Scheduling, Expense Audit & Policy Compliance, Crisis Disruption Recovery, and Multi-Traveler Logistics:
1. End-to-End Multi-City Master Travel Dossier: Build a complete door-to-door itinerary for ${clientName} across 2 destinations incorporating flights, lodging, private ground transfers, dining, and time-blocked calendar syncing.
2. Complete Travel Management Suite:
   - 1 Comprehensive Flight & Hotel Comparison Evaluation Matrix.
   - 1 Emergency Disruption & Flight Cancellation Recovery Playbook.
   - 1 Post-Travel Expense Reconciliation Audit Report ($2,500 budget with policy exceptions).`,
    clientContext: `${clientName} message: "You have proven you can keep my travel completely seamless under real-world pressures. This capstone is your master portfolio piece. Deliver a travel dossier that demonstrates executive-level precision."`,
    deliverables: [
      { id: 'del-tm-14-1', label: `Master Multi-City Door-to-Door Travel Dossier for ${clientName}`, type: 'document', required: true },
      { id: 'del-tm-14-2', label: 'Comprehensive Flight, Hotel & Ground Sourcing Matrix', type: 'spreadsheet', required: true },
      { id: 'del-tm-14-3', label: 'Travel Disruption & Emergency Crisis SOP Playbook', type: 'document', required: true },
      { id: 'del-tm-14-4', label: 'Post-Trip Expense Reconciliation & Policy Audit Report', type: 'spreadsheet', required: true },
    ],
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

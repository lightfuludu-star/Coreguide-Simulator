// ==============================================================================
// CoreGuide VA Simulator - Dynamic Client Generation Engine (V1)
// Architecture: Student → selected VA service → industry preference → simulated business → simulated client
// ==============================================================================

import { ClientPersona } from '../types';

export interface IndustryOption {
  id: string;
  name: string;
  description: string;
}

export const AVAILABLE_INDUSTRIES: IndustryOption[] = [
  { id: 'ecommerce_beauty', name: 'E-Commerce & Clean Beauty', description: 'Fast-scaling D2C cosmetics, skincare, and wellness products' },
  { id: 'fashion_apparel', name: 'Fashion & Sustainable Apparel', description: 'Direct-to-consumer apparel, designer lifestyle brands & accessories' },
  { id: 'b2b_saas', name: 'B2B SaaS & Tech', description: 'Enterprise software platforms, AI tools, and high-velocity product teams' },
  { id: 'real_estate', name: 'Real Estate & Property', description: 'High-end residential brokerages, property investment, and commercial management' },
  { id: 'luxury_travel', name: 'Luxury Travel & Hospitality', description: 'Boutique travel advisories, private aviation, luxury retreats & hospitality' },
  { id: 'digital_marketing', name: 'Digital Marketing & Creator Media', description: 'Growth marketing agencies, multi-platform creators, and media brands' },
  { id: 'consulting_advisory', name: 'Consulting & Professional Services', description: 'Management consulting, executive coaching, and financial advisory' },
];

export interface ClientProfileTemplate {
  serviceId: string;
  industryId: string;
  companyName: string;
  industry: string;
  businessSize: string;
  ceoName: string;
  ceoRole: string;
  avatarUrl: string;
  timezone: string;
  workingHours: string;
  goals: string;
  communicationStyle: string;
  expectations: string;
  preferences: string[];
  timeSensitivity: string;
  companyBackground?: string;
  temperament?: string;
}

// Comprehensive catalog of simulated businesses tailored across services and industries
export const SIMULATED_CLIENT_CATALOG: ClientProfileTemplate[] = [
  // 1. Customer Service VA - Food, Beverage & Restaurant Delivery
  {
    serviceId: 'customer_service',
    industryId: 'food_delivery',
    companyName: 'FreshBite Gourmet Delivery',
    industry: 'Food & Restaurant Delivery',
    businessSize: 'High-volume Food Delivery App (45 restaurant partners, 12k weekly orders)',
    ceoName: 'Sarah Jenkins',
    ceoRole: 'Head of Customer Experience',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    timezone: 'EST (UTC-5) • New York, USA',
    workingHours: '10:00 AM – 08:00 PM EST',
    goals: 'Triage delivery delay tickets, wrong food orders (e.g. peppered vs vanilla shawarma, cold food), and maintain a 4.9+ CSAT score.',
    communicationStyle: 'Empathetic, urgent, and solution-focused',
    expectations: 'Always acknowledge order distress immediately; offer instant re-delivery or meal replacement credit; escalate severe food allergy complaints immediately.',
    preferences: [
      'Validate customer frustration within the first sentence before citing delivery policies',
      'Provide immediate $15 re-order credit + free priority courier before processing straight card refunds',
      'Never blame the courier or kitchen to the customer; represent FreshBite as a unified team',
      'Flag any food safety or incorrect ingredient tickets for kitchen management review'
    ],
    timeSensitivity: 'Urgent: Live food delivery complaints must be answered within 5 minutes',
    companyBackground: 'FreshBite Gourmet Delivery partners with premier local restaurants, artisanal shawarma kitchens, and gourmet eateries for on-demand doorstep delivery.',
  },

  // 1b. Customer Service VA - Fashion & Apparel
  {
    serviceId: 'customer_service',
    industryId: 'fashion_apparel',
    companyName: 'Aura Label Studio',
    industry: 'Fashion, Apparel & Luxury Retail',
    businessSize: 'Direct-to-Consumer Fashion Label (18 employees)',
    ceoName: 'Elena Rostova',
    ceoRole: 'Director of Customer Experience',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    timezone: 'EST (UTC-5) • New York, USA',
    workingHours: '09:00 AM – 06:00 PM EST',
    goals: 'Manage sizing exchanges, damaged garment reports, shipping tracking requests, and uphold a luxury brand experience.',
    communicationStyle: 'Chic, polished, warm, and accommodating',
    expectations: 'Facilitate pre-paid return labels effortlessly; provide personalized size recommendation guidance; ensure VIP clients feel valued.',
    preferences: [
      'Offer complimentary exchange with free expedited shipping before processing returns',
      'Always refer to items by their style name (e.g., Silk Trousers, Cashmere Knit)',
      'Include a personalized styling tip or care instruction in ticket responses'
    ],
    timeSensitivity: 'High: Wedding/event emergency wardrobe tickets require response within 30 minutes',
    companyBackground: 'Aura Label Studio is an eco-luxury apparel brand shipping designer clothing worldwide.',
  },

  // 1c. Customer Service VA - E-Commerce Goods
  {
    serviceId: 'customer_service',
    industryId: 'ecommerce_goods',
    companyName: 'Lumina Living Innovations',
    industry: 'Direct-to-Consumer E-Commerce Goods',
    businessSize: 'D2C Consumer Goods (28 employees, 25k monthly orders)',
    ceoName: 'Marcus Vance',
    ceoRole: 'Customer Operations Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    timezone: 'PST (UTC-8) • Los Angeles, USA',
    workingHours: '08:00 AM – 05:00 PM PST',
    goals: 'Resolve product setup questions, return requests, warranty claims, and package tracking disputes.',
    communicationStyle: 'Clear, structured, and helpful',
    expectations: 'Troubleshoot product issues patiently; adhere to 30-day return policy; provide tracking carrier links.',
    preferences: [
      'Provide step-by-step troubleshooting instructions with bullet points',
      'Offer store credit with a 15% bonus before issuing card refunds',
      'Ensure zero unverified claims: ask for photos of damaged items before dispatching replacements'
    ],
    timeSensitivity: 'High: Damaged package reports require same-day resolution',
    companyBackground: 'Lumina Living Innovations designs and distributes smart home goods and lifestyle products.',
  },

  // 1d. Customer Service VA - Health & Wellness
  {
    serviceId: 'customer_service',
    industryId: 'health_wellness',
    companyName: 'PureGlow Wellness Labs',
    industry: 'Health, Wellness & Supplements',
    businessSize: 'Clean Health & Nutritional Supplements Brand (22 employees)',
    ceoName: 'Dr. David Morales',
    ceoRole: 'VP of Customer Care & Clinical Support',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    timezone: 'CST (UTC-6) • Austin, USA',
    workingHours: '08:30 AM – 05:30 PM CST',
    goals: 'Deliver safe, knowledgeable customer guidance on supplement ingredients, auto-ship subscriptions, and product guarantees.',
    communicationStyle: 'Empathetic, scientifically accurate, and reassuring',
    expectations: 'Never make medical diagnostic claims; explain batch testing standards; resolve recurring subscription cancel/pause requests effortlessly.',
    preferences: [
      'Clarify that supplements support general wellness rather than treating medical illnesses',
      'Prioritize auto-ship subscription retention by offering pause or delivery interval changes',
      'Immediately escalate adverse physical reaction reports to quality control'
    ],
    timeSensitivity: 'High: Adverse reaction inquiries must be flagged and acknowledged within 15 minutes',
    companyBackground: 'PureGlow Wellness Labs produces physician-formulated clean nutritional supplements and adaptogens.',
  },

  // 2. Social Media VA - Fashion & Apparel (Default Beta Client)
  {
    serviceId: 'social_media',
    industryId: 'fashion_apparel',
    companyName: 'Solstice Glow / Aura Collective',
    industry: 'Fashion & Sustainable Apparel',
    businessSize: 'Boutique Apparel Brand (15 employees, 180k followers)',
    ceoName: 'Elena Rostova',
    ceoRole: 'Creative Director & Founder',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    timezone: 'EST (UTC-5) • New York, USA',
    workingHours: '09:00 AM – 06:00 PM EST',
    goals: 'Scale organic TikTok and Instagram reach by 35% while keeping the comment community engaged and influencer DMs fully triaged.',
    communicationStyle: 'Fast-paced, creative, aesthetic-driven',
    expectations: 'Every post must feature a sharp curiosity hook; draft weekly content grids 5 days ahead of schedule; zero bland corporate hashtags.',
    preferences: [
      'Captions must start with a compelling 1-line opening hook before the line break',
      'Include a clear call-to-action (CTA) in every single post (save, comment keyword, or link in bio)',
      'Respond to verified creator mentions and influencer DMs within 30 minutes',
      'Format all deliverable calendars in clean Notion tables'
    ],
    timeSensitivity: 'Medium-High: Trending audio opportunities and viral post replies must be handled same-day',
    companyBackground: 'Aura Collective is an eco-luxe clothing brand with 180,000 Instagram followers and 95,000 TikTok followers.',
  },

  // 2. Social Media VA - E-Commerce & Beauty
  {
    serviceId: 'social_media',
    industryId: 'ecommerce_beauty',
    companyName: 'Botanica Botanicals',
    industry: 'E-Commerce & Clean Beauty',
    businessSize: 'Direct-to-Consumer Lifestyle (20 employees)',
    ceoName: 'Camilla Vance',
    ceoRole: 'Brand Marketing Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    timezone: 'PST (UTC-8) • San Francisco, USA',
    workingHours: '08:30 AM – 05:30 PM PST',
    goals: 'Build consistent multi-format weekly reels and carousels showcasing natural ingredient benefits and customer transformations.',
    communicationStyle: 'Visual, trend-conscious, and energetic',
    expectations: 'Highlight skincare science in accessible language; organize user-generated content (UGC) repository systematically.',
    preferences: [
      'Use warm, empowering brand tone; avoid medical jargon without plain-English explanations',
      'Coordinate with our video editor on Friday afternoons for the following week drops'
    ],
    timeSensitivity: 'Medium: Content approvals submitted at least 48 hours before publish time',
  },

  // 3. Executive VA - B2B SaaS & Tech
  {
    serviceId: 'executive_admin',
    industryId: 'b2b_saas',
    companyName: 'Apex Horizon Technologies',
    industry: 'B2B SaaS & Tech',
    businessSize: 'Series B Scale-up (85 employees)',
    ceoName: 'Marcus Vance',
    ceoRole: 'Founder & Chief Executive Officer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    timezone: 'EST (UTC-5) • New York, USA',
    workingHours: '07:30 AM – 06:30 PM EST',
    goals: 'Protect executive focus hours, maintain zero-inbox triage for VIP partners, and ensure flawless multi-timezone meeting deconfliction.',
    communicationStyle: 'Direct, concise, and executive-ready',
    expectations: 'Provide 3 specific time slots with timezone conversions when scheduling; prepare 1-page synthesis briefs prior to investor meetings.',
    preferences: [
      'Morning briefing email must be delivered by 07:15 AM EST sharp',
      'Never schedule external meetings before 10:00 AM or after 4:30 PM without explicit confirmation',
      'Use bullet points with bold keywords for fast mobile scanning',
      'Attach direct Notion/Google Doc links in all calendar invites'
    ],
    timeSensitivity: 'High: Board member and top investor scheduling conflicts must be resolved within 30 minutes',
    companyBackground: 'Apex Horizon is a fast-growing B2B enterprise software company scaling rapidly in North America and Europe.',
  },

  // 3. Executive VA - Consulting & Advisory
  {
    serviceId: 'executive_admin',
    industryId: 'consulting_advisory',
    companyName: 'Vanguard Strategy Partners',
    industry: 'Consulting & Professional Services',
    businessSize: 'Global Advisory Practice (40 consultants)',
    ceoName: 'David Sterling',
    ceoRole: 'Senior Managing Director',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    timezone: 'GMT (UTC+0) • London, UK',
    workingHours: '08:00 AM – 06:00 PM GMT',
    goals: 'Seamlessly coordinate executive calendar across London, New York, and Singapore client accounts with zero double bookings.',
    communicationStyle: 'Formal, precise, and proactive',
    expectations: 'Maintain strict confidentiality; cross-reference client retainers and project codes in all scheduling entries.',
    preferences: [
      'Ensure 15-minute buffer between back-to-back video calls',
      'Include dial-in passcodes directly in meeting title for international dialers'
    ],
    timeSensitivity: 'High: C-suite client scheduling adjustments require same-day handling',
  },

  // 4. Travel Management VA - Founder (Tech & C-Suite)
  {
    serviceId: 'travel_management',
    industryId: 'founder',
    companyName: 'Aethel Ventures & Tech Capital',
    industry: 'Executive / Tech Venture Capital',
    businessSize: 'Venture Capital & Tech Studio (24 partners)',
    ceoName: 'Julian Thorne',
    ceoRole: 'Managing Partner & Founder',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    timezone: 'EST (UTC-5) • New York & Miami',
    workingHours: '08:00 AM – 06:30 PM EST',
    goals: 'Deconflict multi-city executive roadshows, board meetings, private aviation, and high-stakes client summits with zero transit delay.',
    communicationStyle: 'Direct, polished, and proactive',
    expectations: 'Direct flights preferred, 90-min transit buffers, dedicated workspace in hotel suites, and instant disruption contingency rebooking.',
    preferences: [
      'Always secure forward business class or aisle seating with premium lounge access',
      'Confirm private ground chauffeur 24 hours prior to touchdown in each city',
      'Attach calendar invites with airport terminals, confirmation codes, and local emergency contacts',
      'Provide local tipping etiquette and foreign exchange briefing for international stops'
    ],
    timeSensitivity: 'Urgent: Flight delays or cancelled connections require immediate alternative re-routing within 20 minutes',
    companyBackground: 'Aethel Ventures is a venture fund and tech advisory firm with executive partners regularly traveling between New York, San Francisco, London, and Singapore.',
  },

  // 4b. Travel Management VA - Pastor (Ministry & Conference Keynote)
  {
    serviceId: 'travel_management',
    industryId: 'pastor',
    companyName: 'Kingdom Life Fellowship & Global Faith Summit',
    industry: 'Ministry & Leadership Conferences',
    businessSize: 'International Ministry & Conference Network',
    ceoName: 'Pastor David Mensah',
    ceoRole: 'Senior Pastor & Conference Speaker',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    timezone: 'EST (UTC-5) • Atlanta, USA',
    workingHours: '08:30 AM – 05:00 PM EST',
    goals: 'Coordinate speaking tour logistics across national conferences with quiet lodging for sermon prep and seamless local ministry team pickups.',
    communicationStyle: 'Warm, respectful, structured, and considerate',
    expectations: 'Ensure reliable morning flights to avoid late-night fatigue; confirm volunteer airport pickups 48 hours in advance; adhere to healthy dietary restrictions.',
    preferences: [
      'Quiet hotel room or suite with an ergonomic study desk away from elevators',
      'Non-dairy and low-sodium dietary preferences communicated to host conference teams',
      'Coordinate luggage logistics for sermon materials, books, and formal pastoral attire',
      'Maintain clear itinerary printouts with local host contact numbers'
    ],
    timeSensitivity: 'High: Speaking schedule conflicts or airport pickup changes must be resolved proactively',
    companyBackground: 'Kingdom Life Fellowship organizes multi-city leadership conferences, humanitarian tours, and ministerial retreats across North America and Africa.',
  },

  // 4c. Travel Management VA - Event Planner (Corporate Summits & Group Logistics)
  {
    serviceId: 'travel_management',
    industryId: 'event_planner',
    companyName: 'Horizon Global Events & Summits',
    industry: 'Corporate Events & Conference Logistics',
    businessSize: 'Event Operations Agency (32 staff)',
    ceoName: "Sarah O'Connor",
    ceoRole: 'VP of Global Events & Production',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    timezone: 'CST (UTC-6) • Chicago, USA',
    workingHours: '08:00 AM – 06:00 PM CST',
    goals: 'Flawlessly manage group room blocks, 30-person airport shuttle manifests, VIP speaker travel, and strict event budget tracking.',
    communicationStyle: 'Detailed, organized, and spreadsheet-driven',
    expectations: 'Maintain single master tracking sheet for all attendees; negotiate flexible cancellation terms with hotel sales reps; prepare emergency backup transport.',
    preferences: [
      'Color-code arrival schedules by flight terminal and arrival waves',
      'Keep master room block attrition deadlines highlighted 30 days ahead',
      'Always request group contract copies and banquet event orders (BEOs)',
      'Deliver daily logistics digest every afternoon by 4:00 PM CST'
    ],
    timeSensitivity: 'High: Group booking deadlines and speaker flight cancellations require rapid response',
    companyBackground: 'Horizon Global Events produces tier-1 corporate tech summits, executive retreats, and multi-track conferences for Fortune 500 enterprises.',
  },

  // 4d. Travel Management VA - YouTube Travel Creator (Filming Expeditions)
  {
    serviceId: 'travel_management',
    industryId: 'travel_creator',
    companyName: 'Odyssey Travel Media / Marcus Drake Films',
    industry: 'Travel Media & Digital Production',
    businessSize: 'Creator Media Studio (850k YouTube subscribers)',
    ceoName: 'Marcus Drake',
    ceoRole: 'Lead Travel Documentarian & Producer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    timezone: 'PST (UTC-8) • Los Angeles & Global',
    workingHours: '09:00 AM – 06:00 PM PST',
    goals: 'Coordinate multi-country filming expeditions, unique scenic stays, excess baggage permits for camera gear, and uninterrupted high-speed upload Wi-Fi.',
    communicationStyle: 'Fast-paced, creative, and dynamic',
    expectations: 'Verify drone permit regulations and camera battery airline limits for each country; book lodging with authentic local aesthetic and reliable 100+ Mbps Wi-Fi.',
    preferences: [
      'Verify airline media baggage rates and pre-book heavy gear allowance',
      'Schedule travel legs to accommodate optimal lighting (golden hour filming slots)',
      'Confirm international eSIM or portable Wi-Fi hotspot prior to departure',
      'Include cultural shooting etiquette and drone restriction notes in every dossier'
    ],
    timeSensitivity: 'Medium-High: Weather-dependent filming delays require immediate flexible date shifting',
    companyBackground: 'Odyssey Travel Media produces documentary travel films and cultural explorations with over 850,000 active subscribers worldwide.',
  },

  // 5. Social Marketing & Cold Outreach VA - Digital Marketing & Creator Media
  {
    serviceId: 'social_outreach',
    industryId: 'digital_marketing',
    companyName: 'GrowthCatalyst Media',
    industry: 'Digital Marketing & Creator Media',
    businessSize: 'B2B Growth Agency (24 employees)',
    ceoName: 'Claire Montgomery',
    ceoRole: 'VP of Growth & Partnerships',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
    timezone: 'CST (UTC-6) • Chicago, USA',
    workingHours: '08:30 AM – 05:30 PM CST',
    goals: 'Generate 15 qualified discovery calls per month through targeted LinkedIn and cold email personalization sequences.',
    communicationStyle: 'Metrics-driven, energetic, and concise',
    expectations: 'Never send cookie-cutter generic templates; every outreach message must reference a specific post, podcast, or company milestone.',
    preferences: [
      'Verify all lead emails with zero bounce tolerance before uploading to sequencing software',
      'Draft 2 distinct follow-up variations for prospects who open without replying',
      'Maintain clean CRM pipeline stages in HubSpot'
    ],
    timeSensitivity: 'Medium-High: Positive prospect replies must be responded to within 1 hour during business hours',
  },

  // 6. Lead Generation & Research VA - Real Estate & Property
  {
    serviceId: 'lead_gen_research',
    industryId: 'real_estate',
    companyName: 'Prestige Property Investments',
    industry: 'Real Estate & Property',
    businessSize: 'Commercial & Residential Investment Group (22 brokers)',
    ceoName: 'Rachel Sterling',
    ceoRole: 'Director of Asset Acquisition',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    timezone: 'EST (UTC-5) • Boston, USA',
    workingHours: '08:00 AM – 05:00 PM EST',
    goals: 'Build accurate databases of property owners, verify tax assessment records, and conduct deep demographic and zoning research.',
    communicationStyle: 'Analytical, factual, and thorough',
    expectations: 'All research spreadsheets must cite official municipal sources, parcel IDs, and direct phone/email contacts with 95%+ verified accuracy.',
    preferences: [
      'Format data in standard tabular layout with validated column formatting',
      'Highlight off-market properties with equity estimates in green fill',
      'Provide a 3-bullet executive summary at the beginning of all market research reports'
    ],
    timeSensitivity: 'Standard: Weekly batch reports delivered on Thursdays at 4:00 PM EST',
  },

  // 7. Content Writing VA - Digital Marketing & Publishing
  {
    serviceId: 'content_writing',
    industryId: 'digital_marketing',
    companyName: 'Veritas Editorial & Content Studio',
    industry: 'Digital Marketing & Creator Media',
    businessSize: 'Content Agency & Publication (16 writers/editors)',
    ceoName: 'Liam Gallagher',
    ceoRole: 'Editor-in-Chief & Lead Content Strategist',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    timezone: 'EST (UTC-5) • Austin, USA',
    workingHours: '09:00 AM – 05:00 PM EST',
    goals: 'Produce high-ranking SEO blog articles, weekly thought-leadership newsletters, and comprehensive case studies with zero factual errors.',
    communicationStyle: 'Editorial, articulate, and feedback-focused',
    expectations: 'Thoroughly research source statistics, write engaging H2/H3 subheadings, and adhere strictly to AP Style and client brand tone.',
    preferences: [
      'Every article draft must include meta title, meta description (under 155 chars), and 3 internal link suggestions',
      'Cite reputable industry studies (Gartner, McKinsey, Harvard Business Review) rather than generic blog posts',
      'Submit drafts with clean Hemingway Grade 8 readability score'
    ],
    timeSensitivity: 'Standard: Review drafts delivered 48 hours ahead of publication schedule',
  },
];

// Helper to generate or match a client for a student based on (serviceId, industryPreference)
export const generateSimulatedClient = (
  serviceId: string,
  industryPreference?: string
): ClientPersona => {
  // 1. Look for exact service + industry match
  let match = SIMULATED_CLIENT_CATALOG.find(
    (c) => c.serviceId === serviceId && (industryPreference ? c.industryId === industryPreference : true)
  );

  // 2. Fallback to any client in the catalog for this service
  if (!match) {
    match = SIMULATED_CLIENT_CATALOG.find((c) => c.serviceId === serviceId);
  }

  // 3. Fallback to default Lumina/Sarah
  if (!match) {
    match = SIMULATED_CLIENT_CATALOG[0];
  }

  return {
    id: `client-${match.serviceId}-${match.industryId || 'def'}`,
    companyName: match.companyName,
    industry: match.industry,
    businessSize: match.businessSize,
    ceoName: match.ceoName,
    ceoRole: match.ceoRole,
    avatarUrl: match.avatarUrl,
    timezone: match.timezone,
    workingHours: match.workingHours,
    goals: match.goals,
    communicationStyle: match.communicationStyle,
    expectations: match.expectations,
    preferences: match.preferences,
    clientPreferences: match.preferences, // alias
    timeSensitivity: match.timeSensitivity,
    companyBackground: match.companyBackground || `${match.companyName} is an established company in the ${match.industry} sector.`,
    temperament: match.temperament || `${match.communicationStyle}. Focuses on high reliability and clarity.`,
    satisfactionScore: 92,
  };
};

/**
 * Returns the authoritative list of industry/client-type options tailored for each VA service.
 */
export function getAvailableIndustriesForService(serviceId: string): IndustryOption[] {
  switch (serviceId) {
    case 'travel_management':
      return [
        { id: 'founder', name: 'Tech Founder / Executive Travel', description: 'Investor roadshows, multi-city board meetings, private aviation, and summit logistics' },
        { id: 'pastor', name: 'Ministry Leader / Conference Pastor', description: 'National leadership conferences, ministry speaking tours, quiet study lodging, and volunteer pickups' },
        { id: 'event_planner', name: 'Corporate Event & Conference Planner', description: 'Multi-attendee summits, 30-person room blocks, banquet orders, and group shuttle manifests' },
        { id: 'travel_creator', name: 'YouTube Travel Creator & Documentarian', description: 'Filming expeditions, scenic boutique stays, excess camera gear permits, and 4K upload Wi-Fi' },
      ];

    case 'customer_service':
      return [
        { id: 'food_delivery', name: 'Food & Restaurant Delivery', description: 'Triage live delivery delays, wrong food items (e.g. peppered vs vanilla shawarma), and courier communication' },
        { id: 'fashion_apparel', name: 'Fashion & Luxury Apparel', description: 'Manage sizing exchanges, delicate garment returns, pre-paid labels, and designer care inquiries' },
        { id: 'ecommerce_goods', name: 'Direct-to-Consumer E-Commerce', description: 'Product troubleshooting, shipment tracking, warranty claims, and store credit bonus triage' },
        { id: 'health_wellness', name: 'Health & Wellness Supplements', description: 'Auto-ship subscription retention, ingredient guidance, and adverse reaction escalation' },
      ];

    case 'executive_admin':
      return [
        { id: 'b2b_saas', name: 'B2B SaaS & Tech', description: 'Series B tech scale-up executive support, board meetings, and investor relations' },
        { id: 'consulting_advisory', name: 'Consulting & Professional Services', description: 'Global corporate advisory practice, international client deconfliction' },
        { id: 'real_estate', name: 'Real Estate & Property Group', description: 'High-stakes commercial acquisitions, zoning meetings, and escrow logistics' },
        { id: 'fashion_apparel', name: 'Fashion & Luxury Apparel', description: 'Designer showroom logistics, fashion week schedules, and executive errands' },
        { id: 'ecommerce_beauty', name: 'E-Commerce & Clean Beauty', description: 'D2C brand executive support, supplier summits, and influencer gifting coordination' },
      ];

    case 'social_media':
      return [
        { id: 'fashion_lifestyle', name: 'Fashion & Lifestyle Apparel', description: 'Chic aesthetic grids, TikTok & Instagram trends, and influencer community management' },
        { id: 'ecommerce_beauty', name: 'E-Commerce & Clean Skincare', description: 'Product transformation reels, carousel breakdowns, and UGC community management' },
        { id: 'b2b_saas', name: 'B2B Software & Tech', description: 'LinkedIn thought-leadership, product release updates, and tech community engagement' },
        { id: 'personal_brand_creator', name: 'Founder Personal Brand', description: 'X threads, LinkedIn founder storytelling, Substack newsletter growth' },
        { id: 'food_hospitality', name: 'Food & Culinary Delivery', description: 'Appetizing visual content, sensory reels, and local foodie community outreach' },
      ];

    case 'social_outreach':
      return [
        { id: 'digital_marketing', name: 'Digital Marketing & Creator Agency', description: 'High-growth B2B agency pitching multi-platform brands and eCommerce clients' },
        { id: 'b2b_saas', name: 'Enterprise B2B SaaS', description: 'Targeting VP of Engineering and Operations leaders with personalized tech software demos' },
        { id: 'consulting_advisory', name: 'Corporate Advisory & Consulting', description: 'Executive cold outreach to mid-market CEOs and CFOs for strategic retainers' },
      ];

    case 'lead_gen_research':
      return [
        { id: 'saas_technology', name: 'Enterprise SaaS & Cloud', description: 'Building verified lead-lists of software decision-makers and tech stack audits' },
        { id: 'commercial_services', name: 'Commercial Property & Facilities', description: 'Researching commercial building portfolios, facility managers, and ownership entities' },
        { id: 'professional_services', name: 'Management Consulting & Advisory', description: 'Boutique consulting partner discovery and verified corporate contact directories' },
        { id: 'healthcare_biotech', name: 'Healthcare & Digital Health', description: 'Telehealth clinical networks, medical directors, and EMR software intelligence' },
      ];

    case 'content_writing':
      return [
        { id: 'web3_tech', name: 'Web3 & Decentralized Tech', description: 'Demystifying complex blockchain protocols, smart contract security, and Web3 explainers' },
        { id: 'ecommerce_dtc', name: 'D2C E-Commerce & Lifestyle', description: 'Sensory product descriptions, landing page conversion copy, and email newsletters' },
        { id: 'personal_brand_executive', name: 'Founder Thought Leadership', description: 'Punchy LinkedIn articles, startup lesson essays, and business proposal decks' },
        { id: 'b2b_saas', name: 'B2B SaaS & Productivity', description: 'Actionable workflow guides, ROI case studies, and enterprise software tutorials' },
      ];

    default:
      return AVAILABLE_INDUSTRIES;
  }
}

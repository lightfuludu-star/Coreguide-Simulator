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
  // 1. Customer Service VA - E-Commerce & Beauty (Default Beta Client)
  {
    serviceId: 'customer_service',
    industryId: 'ecommerce_beauty',
    companyName: 'Lumina Living / Lumina Glow',
    industry: 'E-Commerce & Clean Beauty',
    businessSize: 'Growth-stage D2C (28 employees, 25k monthly orders)',
    ceoName: 'Sarah Jenkins',
    ceoRole: 'Head of Customer Experience',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    timezone: 'PST (UTC-8) • Los Angeles, USA',
    workingHours: '08:00 AM – 05:00 PM PST',
    goals: 'Reclaim 18 hours/week from daily ticket backlog and maintain a 4.8+ CSAT score across all Gorgias and Instagram channels.',
    communicationStyle: 'Collaborative, empathetic, and detail-oriented',
    expectations: 'Zero unvetted refund approvals; daily morning ticket status summary by 9:00 AM PST; prioritize brand goodwill over rigid bureaucracy.',
    preferences: [
      'Always address the customer by their first name with a warm greeting',
      'Offer store credit with a 15% bonus before issuing straight cash refunds',
      'Never copy-paste raw macros without adding a personalized sentence',
      'Flag any allergic reaction reports or batch defect complaints in Slack immediately'
    ],
    timeSensitivity: 'High: Customer escalation tickets require acknowledgment within 45 minutes',
    companyBackground: 'Lumina Living is a direct-to-consumer clean skincare company doing 25,000 monthly orders across North America.',
  },

  // 1. Customer Service VA - B2B SaaS
  {
    serviceId: 'customer_service',
    industryId: 'b2b_saas',
    companyName: 'FlowSync Cloud Systems',
    industry: 'B2B SaaS & Tech',
    businessSize: 'Series A Tech (35 employees)',
    ceoName: 'Michael Chang',
    ceoRole: 'VP of Customer Success',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    timezone: 'EST (UTC-5) • New York, USA',
    workingHours: '09:00 AM – 06:00 PM EST',
    goals: 'Reduce first-response time on enterprise user tickets below 1 hour and synthesize bug reports for the engineering sprint.',
    communicationStyle: 'Structured, technical, and solution-focused',
    expectations: 'Thoroughly reproduce user issues before escalating to engineering; maintain high ticket categorization hygiene in Zendesk.',
    preferences: [
      'Include browser version, operating system, and screenshot attachments in all bug escalation notes',
      'Provide step-by-step workaround documentation when a feature is in maintenance',
      'Summarize daily resolved tickets in bullet points at 5:30 PM EST'
    ],
    timeSensitivity: 'High: System outage or billing block inquiries must be acknowledged within 15 minutes',
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

  // 4. Travel Management VA - Luxury Travel & Hospitality
  {
    serviceId: 'travel_management',
    industryId: 'luxury_travel',
    companyName: 'Aethel Luxury Expeditions',
    industry: 'Luxury Travel & Hospitality',
    businessSize: 'Boutique Advisory (18 travel curators)',
    ceoName: 'Julian Thorne',
    ceoRole: 'Managing Partner & Head of Private Aviation',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    timezone: 'EST (UTC-5) • Miami, USA',
    workingHours: '08:30 AM – 06:00 PM EST',
    goals: 'Deliver end-to-end door-to-door luxury itineraries, flight deconfliction, private lodging confirmations, and emergency real-time rebooking.',
    communicationStyle: 'Polished, proactive, and meticulous',
    expectations: 'Every itinerary must include confirmation numbers, contact persons, baggage limits, visa requirements, and VIP concierge contacts.',
    preferences: [
      'Always secure aisle or forward business class seating with lounge access',
      'Confirm airport private ground transfer drivers 24 hours prior to touchdown',
      'Provide currency conversion notes and local tipping customs for each destination'
    ],
    timeSensitivity: 'Urgent: Flight delays or cancelled connections require immediate alternative routing within 20 minutes',
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

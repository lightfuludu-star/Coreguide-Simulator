import fs from 'node:fs';

const content = fs.readFileSync('src/services/clientConversationEngine.ts', 'utf-8');
const lines = content.split('\n');

const suspectTerms = [
  'geography',
  'geographic',
  'scope',
  'research',
  'parameters',
  'public or private',
  'word count',
  'voice note',
  'article length',
  'article',
  'campaign',
  'outreach',
  'store credit',
  'refund',
  'replacement',
  'promo code'
];

let currentServiceBlock = 'GLOBAL';
let currentFunction = 'NONE';
let braceDepth = 0;
const suspectFindings = [];

lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  const trimmed = line.trim();

  if (trimmed.includes('function generateDeterministicClientReply')) {
    currentFunction = 'generateDeterministicClientReply';
    currentServiceBlock = 'GLOBAL_IN_FUNCTION';
  } else if (trimmed.includes('function generateClientReply')) {
    currentFunction = 'generateClientReply';
    currentServiceBlock = 'GLOBAL_IN_FUNCTION';
  }

  // Detect service block start
  if (trimmed.includes("if (serviceId === 'lead_gen_research')")) {
    currentServiceBlock = 'lead_gen_research';
  } else if (trimmed.includes("if (serviceId === 'content_writing')")) {
    currentServiceBlock = 'content_writing';
  } else if (trimmed.includes("if (serviceId === 'social_marketing_outreach' || serviceId === 'social_outreach')") || trimmed.includes("if (serviceId === 'social_outreach')")) {
    currentServiceBlock = 'social_outreach';
  } else if (trimmed.includes("if (serviceId === 'executive_admin'")) {
    currentServiceBlock = 'executive_admin';
  } else if (trimmed.includes("if (serviceId === 'customer_service')")) {
    currentServiceBlock = 'customer_service';
  } else if (trimmed.includes("if (serviceId === 'social_media')")) {
    currentServiceBlock = 'social_media';
  } else if (trimmed.includes("if (serviceId === 'travel_management')")) {
    currentServiceBlock = 'travel_management';
  } else if (trimmed.includes('UNIVERSAL / GENERAL FALLBACK RULES') || trimmed.includes('Try Server-Side Gemini API')) {
    currentServiceBlock = 'UNIVERSAL_FALLBACK';
  }

  suspectTerms.forEach(term => {
    if (trimmed.includes(`cleanMessage.includes('${term}')`) || trimmed.includes(`cleanMessage.includes("${term}")`)) {
      suspectFindings.push({
        lineNum,
        currentFunction,
        currentServiceBlock,
        term,
        line: trimmed
      });
    }
  });
});

console.log(`Found ${suspectFindings.length} occurrences of suspect clarification terms:`);
suspectFindings.forEach(f => {
  console.log(`Line ${f.lineNum} [${f.currentFunction} -> ${f.currentServiceBlock}]: "${f.term}"`);
  console.log(`   ${f.line}`);
});

const leaks = suspectFindings.filter(f => f.currentServiceBlock.startsWith('GLOBAL') || f.currentServiceBlock === 'UNIVERSAL_FALLBACK');
if (leaks.length > 0) {
  console.error(`\n[CRITICAL LEAK] Found ${leaks.length} suspect rules outside service blocks!`);
  process.exit(1);
} else {
  console.log('\n[PERFECT] All suspect terms are strictly enclosed within service-scoped blocks!');
}

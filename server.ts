import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import mammoth from 'mammoth';
import ExcelJS from 'exceljs';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Helper to extract text from Google Docs/Sheets links
async function fetchGoogleDocumentContent(url: string): Promise<{ accessible: boolean; text?: string; error?: string }> {
  try {
    let exportUrl = '';
    const docMatch = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
    const sheetMatch = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);

    if (docMatch && docMatch[1]) {
      exportUrl = `https://docs.google.com/document/d/${docMatch[1]}/export?format=txt`;
    } else if (sheetMatch && sheetMatch[1]) {
      exportUrl = `https://docs.google.com/spreadsheets/d/${sheetMatch[1]}/export?format=csv`;
    } else {
      // General URL or Drive file
      return {
        accessible: true,
        text: `External Document Reference: ${url}`,
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(exportUrl, {
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();

      // Check if redirected to Google sign-in HTML page
      if (text.includes('ServiceLogin') || text.includes('accounts.google.com') || (contentType.includes('text/html') && text.includes('Sign in'))) {
        return {
          accessible: false,
          error: "We couldn't access this document. Please make sure the link has the required access (e.g. 'Anyone with the link can view') or upload the file instead.",
        };
      }

      if (text.trim().length > 0) {
        return { accessible: true, text: text.substring(0, 15000) };
      }
    }

    return {
      accessible: false,
      error: "We couldn't access this document. Please make sure the link has the required access or upload the file instead.",
    };
  } catch (err: any) {
    return {
      accessible: false,
      error: "We couldn't access this document. Please make sure the link has the required access or upload the file instead.",
    };
  }
}

// Helper to extract content from base64 uploaded files
async function extractUploadedFileContent(
  base64DataUrl: string,
  fileType: string,
  fileName: string
): Promise<{ text: string; multimodalPart?: any }> {
  try {
    const parts = base64DataUrl.split(',');
    const base64Data = parts.length > 1 ? parts[1] : parts[0];
    const mimeMatch = base64DataUrl.match(/data:([^;]+);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : '';

    const buffer = Buffer.from(base64Data, 'base64');
    const ext = fileName.split('.').pop()?.toLowerCase() || fileType.toLowerCase();

    // 1. DOCX parsing via Mammoth
    if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      return { text: `[DOCX Extracted Content from ${fileName}]:\n${result.value.trim()}` };
    }

    // 2. XLSX parsing via ExcelJS
    if (ext === 'xlsx') {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const sheetOutputs: string[] = [];

      workbook.eachSheet((worksheet, sheetId) => {
        sheetOutputs.push(`--- Sheet: ${worksheet.name} ---`);
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          const rowValues = Array.isArray(row.values) ? row.values.slice(1) : [];
          sheetOutputs.push(`Row ${rowNumber}: ${rowValues.map((v) => (v !== null && v !== undefined ? String(v) : '')).join(' | ')}`);
        });
      });

      return { text: `[Excel XLSX Extracted Spreadsheet Data from ${fileName}]:\n${sheetOutputs.join('\n').substring(0, 15000)}` };
    }

    // 3. CSV, TXT, MD parsing
    if (ext === 'csv' || ext === 'txt' || ext === 'md') {
      const decodedText = buffer.toString('utf-8');
      return { text: `[File Content from ${fileName}]:\n${decodedText.substring(0, 15000)}` };
    }

    // 4. PDF (multimodal inlineData for Gemini)
    if (ext === 'pdf' || mimeType.includes('pdf')) {
      return {
        text: `[PDF Document Attachment: ${fileName}, Size: ${buffer.length} bytes]`,
        multimodalPart: {
          inlineData: {
            mimeType: 'application/pdf',
            data: base64Data,
          },
        },
      };
    }

    // 5. Images (PNG, JPG, JPEG, WEBP)
    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext) || mimeType.startsWith('image/')) {
      const imgMime = ext === 'png' ? 'image/png' : 'image/jpeg';
      return {
        text: `[Visual Image Deliverable Attachment: ${fileName}]`,
        multimodalPart: {
          inlineData: {
            mimeType: imgMime,
            data: base64Data,
          },
        },
      };
    }

    return { text: `[Attachment: ${fileName} (${ext})]` };
  } catch (err: any) {
    console.warn('Error extracting file content:', err);
    return { text: `[Attachment: ${fileName} - Raw binary data]` };
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '20mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // CoreGuide Task Submission & Real Deliverable 5-Dimension Evaluation
  app.post('/api/submissions/evaluate', async (req, res) => {
    try {
      const { task, client, submission, timing, chatHistory, attemptNumber = 1, userProfile } = req.body || {};

      if (!task || !client || !submission) {
        res.status(400).json({ error: 'Task, client, and submission data are required' });
        return;
      }

      // Strict Server-Side Beta Access Check
      if (userProfile) {
        const isAdm = userProfile.role === 'admin' || userProfile.accessType === 'ADMIN';
        const isFullStudent = userProfile.accessType === 'FULL_STUDENT';
        const isBetaTester = userProfile.accessType === 'BETA_TESTER' || userProfile.is_beta_tester;

        if (userProfile.accessType === 'NOT_ACTIVATED') {
          res.status(403).json({ error: 'Access not activated. An administrator must activate your access before submitting deliverables.' });
          return;
        }

        if (isBetaTester && !isAdm && !isFullStudent) {
          // Check maximum allowed simulation day (14)
          if (task.dayNumber > 14) {
            res.status(403).json({ error: 'Beta test limit exceeded. Days 15–90 are restricted for beta testers.' });
            return;
          }

          // Check beta expiration by calendar date
          if (userProfile.beta_expiry_date) {
            const expiryTime = new Date(userProfile.beta_expiry_date).getTime();
            if (Date.now() >= expiryTime || userProfile.beta_status === 'expired') {
              res.status(403).json({ error: 'Your CoreGuide beta period has ended. Thank you for helping us test CoreGuide.' });
              return;
            }
          }

          if (userProfile.beta_status === 'revoked') {
            res.status(403).json({ error: 'Your CoreGuide access has been temporarily disabled.' });
            return;
          }
        }
      }

      let extractedContent = '';
      let multimodalPart: any = null;

      // Handle Link Submission
      if (submission.submissionType === 'link') {
        const linkUrl = submission.documentLink || '';
        const fetchResult = await fetchGoogleDocumentContent(linkUrl);
        if (!fetchResult.accessible) {
          res.json({
            accessible: false,
            error: fetchResult.error,
          });
          return;
        }
        extractedContent = fetchResult.text || '';
      } else if (submission.fileData) {
        // Handle File Upload Submission
        const fileResult = await extractUploadedFileContent(
          submission.fileData,
          submission.fileType || '',
          submission.fileName || 'deliverable'
        );
        extractedContent = fileResult.text;
        multimodalPart = fileResult.multimodalPart;
      }

      const gemini = getGeminiClient();
      if (!gemini) {
        res.json({ fallback: true, extractedSummary: extractedContent.substring(0, 300) });
        return;
      }

      const clientName = client.ceoName || 'Sarah Jenkins';
      const clientRole = client.ceoRole || 'CEO';
      const companyName = client.companyName || 'Lumina Living';
      const industry = client.industry || 'E-Commerce';
      const studentMessage = submission.submissionMessage || '';

      const taskBrief = task.brief || '';
      const taskTitle = task.title || '';
      const deliverablesList = Array.isArray(task.deliverables)
        ? task.deliverables.map((d: any) => `- [${d.type.toUpperCase()}] ${d.label} (Required: ${d.required ? 'Yes' : 'No'})`).join('\n')
        : 'Deliverables not specified';

      const timingInfo = timing ? `
- Deadline Type: ${timing.deadlineType || task.deadlineType || 'soft'}
- Actual Turnaround Time: ${timing.actualDurationMinutes || 30} minutes (Estimated: ${task.estimatedMinutes || 30} mins)
- On-Time Status: ${timing.submittedOnTime ? 'ON-TIME' : `LATE (Exceeded deadline by ${timing.minutesLate || 0} minutes)`}` : '';

      const systemInstruction = `You are CoreGuide's Executive Assessment Engine & Master VA Coaching System.
You are evaluating a student Virtual Assistant's REAL submitted deliverable for ${companyName} (${industry}).
The client is ${clientName} (${clientRole}).

TASK BRIEF & ASSIGNMENT:
- Title: ${taskTitle} (Day ${task.dayNumber})
- Brief: ${taskBrief}
- Required Deliverables:
${deliverablesList}
- Client Tone & Guidelines: ${task.clientContext || client.expectations || 'High precision, professional communication, clear structure.'}
${timingInfo ? `\nTIMING & DEADLINE PERFORMANCE:${timingInfo}` : ''}

STUDENT SUBMISSION DETAILS:
- Submission Type: ${submission.submissionType} (${submission.fileName || submission.documentLink})
- Student Note to Client: "${studentMessage}"
- Submission Attempt: #${attemptNumber}

EVALUATION METHODOLOGY (5 UNIVERSAL CRITERIA):
You MUST evaluate the submission across the 5 official CoreGuide competency dimensions (each scored strictly 0.0 to 10.0):
1. ACCURACY (0–10): Did the student follow the specific requirements in the brief? Are numbers, customer details, policies, formatting, and requested deliverables correct?
2. COMMUNICATION (0–10): Is the writing clear, professional, well-structured, and empathetic? Is the student's submission note concise and effective?
3. JUDGEMENT (0–10): Did the student make sound business decisions, handle exceptions gracefully, and protect the client's interests?
4. INITIATIVE (0–10): Did the student go beyond the bare minimum (e.g. adding helpful categorization, proactive summaries, clean formatting)?
5. CLIENT HANDLING (0–10): How well does this deliverable protect brand loyalty and satisfy ${clientName}'s expectations? Factor in timeliness: if prompt under a hard deadline, praise turnaround; if late, reflect realistic feedback on deadline management without automatically failing a quality deliverable.

OUTPUT FORMAT REQUIREMENT:
Respond ONLY with a valid, clean JSON object (no markdown code blocks, no backticks, just pure JSON) with the following structure:
{
  "score": 88,
  "accuracy": 8.8,
  "communication": 9.0,
  "judgement": 8.5,
  "initiative": 8.5,
  "clientHandling": 9.0,
  "decision": "approved", // "approved" if composite score >= 75 and key requirements met, otherwise "revision_requested"
  "feedback": "Comprehensive, constructive coaching feedback paragraph explaining the evaluation and deadline performance.",
  "strengths": [
    "Concrete strength 1 citing specific elements found in the submission",
    "Concrete strength 2 citing specific details",
    "Concrete strength 3"
  ],
  "weaknesses": [
    "Specific gap or missing requirement (if any, or empty array if pristine)"
  ],
  "areasToImprove": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2"
  ],
  "clientReaction": "A realistic, in-character 1-2 sentence response quote from ${clientName} (${clientRole}) reacting specifically to what the student produced, their note, and their timing."
}`;

      const contentParts: any[] = [];
      if (multimodalPart) {
        contentParts.push(multimodalPart);
      }
      contentParts.push({
        text: `Here is the student's submitted deliverable content:\n\n${extractedContent || '[Non-text visual deliverable / structured document attached]'}\n\nStudent Message: "${studentMessage}"\n\nPerform a thorough, objective 5-dimension evaluation according to the rubric.`,
      });

      // 10-second timeout race for Gemini evaluation
      const timeoutPromise = new Promise<any>((_, reject) =>
        setTimeout(() => reject(new Error('Evaluation timeout')), 9500)
      );

      const generatePromise = gemini.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          {
            role: 'user',
            parts: contentParts,
          },
        ],
        config: {
          systemInstruction,
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const rawText = response.text?.trim() || '{}';

      let parsedEval: any = null;
      try {
        parsedEval = JSON.parse(rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, ''));
      } catch (e) {
        console.warn('Failed to parse Gemini evaluation JSON:', rawText);
      }

      if (parsedEval && typeof parsedEval.score === 'number') {
        const evaluation = {
          id: 'eval-' + Date.now(),
          taskId: task.id,
          score: Math.min(100, Math.max(0, Math.round(parsedEval.score))),
          accuracy: Math.min(10, Math.max(0, Number(parsedEval.accuracy || 8.5))),
          communication: Math.min(10, Math.max(0, Number(parsedEval.communication || 8.5))),
          judgement: Math.min(10, Math.max(0, Number(parsedEval.judgement || 8.5))),
          initiative: Math.min(10, Math.max(0, Number(parsedEval.initiative || 8.5))),
          clientHandling: Math.min(10, Math.max(0, Number(parsedEval.clientHandling || 8.5))),
          decision: parsedEval.decision === 'revision_requested' ? 'revision_requested' : 'approved',
          feedback: parsedEval.feedback || `Evaluated deliverable for Day ${task.dayNumber}.`,
          strengths: Array.isArray(parsedEval.strengths) ? parsedEval.strengths : ['Completed requested deliverable requirements.'],
          weaknesses: Array.isArray(parsedEval.weaknesses) ? parsedEval.weaknesses : [],
          areasToImprove: Array.isArray(parsedEval.areasToImprove) ? parsedEval.areasToImprove : (parsedEval.weaknesses || []),
          recommendations: Array.isArray(parsedEval.areasToImprove) ? parsedEval.areasToImprove : [],
          clientReaction: parsedEval.clientReaction || `"${clientName}: Thank you for completing this assignment."`,
          evaluatedBy: 'CoreGuide AI Evaluator & Client Review',
          evaluatedAt: new Date().toISOString(),
          submittedOnTime: timing ? timing.submittedOnTime : true,
          minutesLate: timing ? (timing.minutesLate || 0) : 0,
          actualDurationMinutes: timing ? (timing.actualDurationMinutes || task.estimatedMinutes || 30) : (task.estimatedMinutes || 30),
          deadlineType: timing?.deadlineType || task.deadlineType || 'soft',
        };

        res.json({
          accessible: true,
          evaluation,
          clientReaction: evaluation.clientReaction,
          extractedSummary: extractedContent.substring(0, 500),
        });
        return;
      }

      res.json({ fallback: true, extractedSummary: extractedContent.substring(0, 300) });
    } catch (err: any) {
      console.warn('Error during evaluation endpoint execution:', err);
      res.json({ fallback: true, error: err?.message });
    }
  });

  // CoreGuide Client Conversation Endpoint - Strict Direct Answer Enforcement
  app.post('/api/chat/respond', async (req, res) => {
    try {
      const { message, client, todaysTask, currentDay, currentStage, history, serviceId } = req.body || {};

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const gemini = getGeminiClient();
      if (!gemini) {
        // Return 200 with fallback flag so frontend gracefully uses local deterministic NLP engine
        res.status(200).json({ fallback: true, message: 'Gemini API key not configured, utilizing local contextual reasoning engine' });
        return;
      }

      // Extract client and task parameters
      const clientName = client?.ceoName || 'Alex Mercer';
      const clientFirstName = clientName.split(' ')[0];
      const clientRole = client?.ceoRole || 'Founder & CEO';
      const companyName = client?.companyName || 'Aura Glow Skincare';
      const industry = client?.industry || 'E-Commerce';
      const businessSize = client?.businessSize || 'Growth Scale';
      const communicationStyle = client?.communicationStyle || 'Direct & Results-Oriented';
      const timezone = client?.timezone || 'EST';
      const workingHours = client?.workingHours || '9:00 AM - 5:00 PM EST';
      const goals = client?.goals || 'Scale daily operational efficiency';
      const expectations = client?.expectations || 'High attention to detail and clear communication';
      const preferences = Array.isArray(client?.preferences)
        ? client.preferences.join('; ')
        : Array.isArray(client?.clientPreferences)
        ? client.clientPreferences.join('; ')
        : 'Ensure high accuracy and clear formatting';

      const taskTitle = todaysTask?.title || `Day ${currentDay} Priority Assignment`;
      const taskBrief = todaysTask?.brief || 'Complete daily VA deliverable';
      const taskPriority = todaysTask?.priority || 'medium';
      const taskDeadlineHours = todaysTask?.deadlineHours || 4;
      const taskDeliverables = Array.isArray(todaysTask?.deliverables)
        ? todaysTask.deliverables.map((d: any) => `- ${d.label} (${d.type})`).join('\n')
        : 'Deliverable submission';
      const taskContext = todaysTask?.clientContext || '';

      // Format conversation history for reference & memory continuity
      const recentHistoryFormatted = Array.isArray(history) && history.length > 0
        ? history
            .slice(-10)
            .map((m: any) => `${m.sender === 'student' ? 'Student VA' : clientName}: "${m.content}"`)
            .join('\n')
        : 'No prior conversation today.';

      const systemInstruction = `You are roleplaying as "${clientName}", the ${clientRole} of ${companyName} (${industry}).
You are in a real-time 1-on-1 workplace communication channel with your assigned Virtual Assistant (the student).

YOUR IDENTITY & CLIENT PERSONA:
- Name: ${clientName} (${clientRole})
- Company: ${companyName} (${industry}, ${businessSize})
- Working Schedule: ${workingHours} (${timezone})
- Communication Style: ${communicationStyle}
- Client Goals: ${goals}
- Expectations: ${expectations}
- Operating Guidelines & Preferences: ${preferences}

CURRENT SIMULATION CONTEXT:
- Day: Day ${currentDay} of 90 (Stage ${currentStage?.stageNumber || 1}: ${currentStage?.name || 'Foundation'})
- Task Title: "${taskTitle}"
- Priority: ${taskPriority}
- Deadline: Due within ${taskDeadlineHours} hours
- Task Objective & Brief: ${taskBrief}
- Required Deliverables:
${taskDeliverables}
- Client Scenario / Context: "${taskContext}"

RECENT CONVERSATION HISTORY:
${recentHistoryFormatted}

================================================================================
CRITICAL CONVERSATION CONTRACT & DIRECT ANSWER RULES:
================================================================================
1. PRIMARY DIRECT ANSWER RULE:
   - Your #1 priority is to ANSWER WHAT THE STUDENT ACTUALLY ASKED in the very first sentence.
   - Do NOT start with generic praise, encouragement, or filler ("I appreciate you checking in", "That sounds good", "Thanks for letting me know", "Great question", "Time management is important").
   - Do NOT repeat your personality description or generic company background.
   - Do NOT give a vague non-answer when a concrete answer is possible.

2. QUESTION INTENT EXTRACTION & PRONOUN RESOLUTION:
   - Identify the student's actual intent (Deadline inquiry, Priority inquiry, Permission/Decision request, Alternative suggestion, Clarification, Why/Reasoning question, Escalation question, etc.).
   - Understand referents like "it", "this", "that", "the spreadsheet", "the customer", "the deadline" using the task and chat history.
   - If a reference is genuinely ambiguous (e.g. "Should I change it?"), ask a specific clarifying question naming the options (e.g. "Do you mean the customer response template or the spreadsheet?").

3. CONCRETE TASK & BUSINESS LOGIC:
   - If asked "When do you need this?" or "What time?": State the concrete time directly (e.g., "I need it by 3:00 PM ${timezone} today because I want to review it before our 4:00 PM meeting.").
   - If asked "Which customer / complaint should I handle first?": Answer based on urgency and task brief (e.g. "Start with the refund complaint because it has already been waiting for more than 24 hours."). If no specific rule exists: "I don't have a specific priority rule for that. Use the urgency of the complaint and customer impact to decide, and tell me how you prioritized it."
   - If asked "Can I use Google Sheets / do this another way?": Give a realistic answer: "Yes, Google Sheets is fine as long as customer details and priority labels are preserved."
   - If asked "Why do you want me to do it this way?": Provide the real operational reason from the task context.
   - If asked "What should I do if the customer doesn't respond?": Provide a clear operational SLA (e.g. "Send one follow-up after 24 hours. If there's still no response, mark the case for review.").
   - If asked for clarification on incomplete or ambiguous instructions (e.g. which person, missing travel dates, customer order lookup, campaign filters): Provide the specific concrete details (e.g. specific name/role, travel window, or CRM search parameters) so the student can proceed with execution.
   - If asked about unknown facts (personal private info, unlisted passwords, etc.): State clearly "I don't have that information right now." Never invent facts.

4. BANNED GENERIC FILLER AS SOLE ANSWER:
   - BANNED: "That sounds good.", "Thanks for letting me know.", "I appreciate your effort.", "Just use your best judgement.", "Please proceed accordingly.", "Keep me updated.", "Let's make sure everything is handled properly."
   - Acknowledge or thank ONLY after giving the direct answer, never in place of it.

5. LENGTH & VOICE:
   - 1 to 4 sentences maximum.
   - SHORT + SPECIFIC + CONTEXTUAL.
   - Speak 100% naturally as ${clientName}. NEVER mention AI, prompts, system rules, or models.

OUTPUT FORMAT:
Respond with a JSON object:
{
  "intent": "brief label of student intent",
  "directAnswer": "1-4 sentence direct, specific, context-aware answer from ${clientName}"
}`;

      // Call Gemini with a 6-second timeout race to ensure fast responsive chat
      const timeoutPromise = new Promise<any>((_, reject) =>
        setTimeout(() => reject(new Error('Generation timeout')), 6000)
      );

      const generatePromise = gemini.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `Student VA Message: "${message}"\n\nGenerate your direct answer as ${clientName}:` }],
          },
        ],
        config: {
          systemInstruction,
          temperature: 0.4,
          responseMimeType: 'application/json',
        },
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const rawText = response.text?.trim() || '{}';

      let parsed: any = null;
      try {
        parsed = JSON.parse(rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, ''));
      } catch (e) {
        console.warn('Failed to parse Gemini chat response JSON:', rawText);
      }

      const generatedReply = parsed?.directAnswer || parsed?.response || rawText;

      // Quality check against generic filler
      const fillerOnlyPatterns = [
        /^that sounds good\.?$/i,
        /^thanks for letting me know\.?$/i,
        /^i appreciate your effort\.?$/i,
        /^just use your best judgement\.?$/i,
        /^please proceed accordingly\.?$/i,
        /^keep me updated\.?$/i,
      ];

      const isOnlyFiller = fillerOnlyPatterns.some((pattern) => pattern.test(generatedReply.trim()));

      if (generatedReply && !isOnlyFiller && typeof generatedReply === 'string' && generatedReply.length > 5) {
        res.json({ response: generatedReply.trim(), status: 'success', intent: parsed?.intent });
      } else {
        res.json({ fallback: true });
      }
    } catch (err: any) {
      // Gracefully handle network/headers timeouts by signaling fallback to frontend
      const errorMsg = err?.message || 'Server generation error';
      res.status(200).json({ fallback: true, error: errorMsg });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CoreGuide VA Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start CoreGuide server:', err);
});

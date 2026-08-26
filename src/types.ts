// ==============================================================================
// CoreGuide VA Simulator - TypeScript Type Definitions
// Supabase Database Models (16 Relational Tables) & UI Application Types
// ==============================================================================

export type UserRole = 'student' | 'instructor' | 'admin';
export type AccessType = 'NOT_ACTIVATED' | 'BETA_TESTER' | 'FULL_STUDENT' | 'ADMIN';
export type BetaStatus = 'not_started' | 'active' | 'expired' | 'revoked';

// ------------------------------------------------------------------------------
// 1. SUPABASE DATABASE MODELS (16 Core Relational Tables)
// ------------------------------------------------------------------------------

// Table 1: students
export interface DbStudent {
  id: string; // UUID references auth.users(id)
  name: string;
  email: string;
  experience_level: string;
  primary_service_id: string | null;
  tools_known: string[];
  tools_learning: string[];
  industry_interest: string;
  current_day: number;
  current_stage: number;
  simulation_status: 'active' | 'paused' | 'completed' | 'remediating';
  // Beta Access Layer Fields
  access_type?: AccessType;
  is_beta_tester?: boolean;
  beta_start_date?: string | null;
  beta_expiry_date?: string | null;
  beta_status?: BetaStatus;
  beta_duration?: number;
  last_activity?: string;
  created_at: string;
  updated_at: string;
}

// Table 2: services
export interface DbService {
  id: string; // UUID
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
}

// Table 3: skills
export interface DbSkill {
  id: string; // UUID
  service_id: string; // UUID references services(id)
  name: string;
  description: string | null;
  created_at: string;
}

// Table 4: sub_skills
export interface DbSubSkill {
  id: string; // UUID
  skill_id: string; // UUID references skills(id)
  name: string;
  description: string | null;
  created_at: string;
}

// Table 5: competency_levels
export type CompetencyLevelType = 'beginner' | 'intermediate' | 'advanced';

export interface DbCompetencyLevel {
  id: string; // UUID
  skill_id: string; // UUID references skills(id)
  level: CompetencyLevelType;
  description: string;
}

// Table 6: simulations
export interface DbSimulation {
  id: string; // UUID
  student_id: string; // UUID references students(id)
  service_id: string | null; // UUID references services(id)
  current_day: number;
  current_stage: number;
  status: 'active' | 'paused' | 'completed';
  started_at: string;
  completed_at: string | null;
}

// Table 7: clients
export interface DbClient {
  id: string; // UUID
  simulation_id: string; // UUID references simulations(id)
  name: string;
  business_name: string;
  industry: string;
  business_size: string | null;
  role: string | null;
  goals: string | null;
  communication_style: string | null;
  personality: string | null;
  expectations: string | null;
  preferences: Record<string, any>;
  time_sensitivity: string | null;
  knowledge_level: string | null;
  tolerance: string | null;
  priorities: string | null;
  created_at: string;
}

// Table 8: client_memory
export interface DbClientMemory {
  id: string; // UUID
  client_id: string; // UUID references clients(id)
  memory_type: 'preference' | 'relationship' | 'incident' | 'schedule' | string;
  content: string;
  importance: number; // 1 - 5
  created_at: string;
}

// Table 9: conversations
export interface DbConversation {
  id: string; // UUID
  client_id: string; // UUID references clients(id)
  student_id: string; // UUID references students(id)
  created_at: string;
  updated_at: string;
}

// Table 10: messages
export type MessageSenderType = 'student' | 'client' | 'system';

export interface DbMessage {
  id: string; // UUID
  conversation_id: string; // UUID references conversations(id)
  sender_type: MessageSenderType;
  content: string;
  created_at: string;
}

// Table 11: tasks
export type TaskDifficulty = 'easy' | 'medium' | 'hard' | 'crisis';
export type TaskDeadlineType = 'flexible' | 'standard' | 'urgent' | 'hard_deadline';
export type DeadlineType = 'none' | 'soft' | 'hard';
export type DbTaskStatus = 'pending' | 'in_progress' | 'submitted' | 'evaluated';

export interface DbTask {
  id: string; // UUID
  simulation_id: string; // UUID references simulations(id)
  client_id: string; // UUID references clients(id)
  day: number;
  stage: number;
  title: string;
  client_message: string;
  objective: string;
  context: string;
  constraints: string | null;
  expected_deliverable: string;
  skill_id: string | null; // UUID references skills(id)
  sub_skill_id: string | null; // UUID references sub_skills(id)
  difficulty: TaskDifficulty;
  deadline_type: TaskDeadlineType;
  status: DbTaskStatus;
  created_at: string;
  completed_at: string | null;
}

// Table 12: submissions
export interface DbSubmission {
  id: string; // UUID
  task_id: string; // UUID references tasks(id)
  student_id: string; // UUID references students(id)
  submission_text: string | null;
  file_url: string | null;
  external_link: string | null;
  submitted_at: string;
}

// Table 13: evaluations
export interface DbEvaluation {
  id: string; // UUID
  submission_id: string; // UUID references submissions(id)
  accuracy_score: number; // 0 - 100
  communication_score: number; // 0 - 100
  judgement_score: number; // 0 - 100
  initiative_score: number; // 0 - 100
  client_handling_score: number; // 0 - 100
  overall_score: number; // 0 - 100
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  created_at: string;
}

// Table 14: skill_scores
export type StrengthStatusType = 'critical_gap' | 'developing' | 'proficient' | 'mastered';

export interface DbSkillScore {
  id: string; // UUID
  student_id: string; // UUID references students(id)
  skill_id: string; // UUID references skills(id)
  score: number; // 0 - 100
  competency_level: CompetencyLevelType;
  strength_status: StrengthStatusType;
  last_updated: string;
}

// Table 15: remediation_tasks
export type RemediationStatus = 'assigned' | 'in_progress' | 'completed' | 'waived';

export interface DbRemediationTask {
  id: string; // UUID
  student_id: string; // UUID references students(id)
  original_task_id: string | null; // UUID references tasks(id)
  skill_id: string | null; // UUID references skills(id)
  reason: string;
  task_content: string;
  status: RemediationStatus;
  result: string | null;
  created_at: string;
  completed_at: string | null;
}

// Table 16: progress
export interface DbProgress {
  id: string; // UUID
  simulation_id: string; // UUID references simulations(id)
  day: number;
  stage: number;
  completed: boolean;
  score: number | null;
  created_at: string;
}

// ------------------------------------------------------------------------------
// 2. UI PRESENTATION ADAPTER TYPES
// ------------------------------------------------------------------------------

export interface StudentProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  accessType?: AccessType;
  currentDay: number;
  targetNiche: string;
  avatarUrl?: string;
  createdAt: string;
  simulationStartDate: string;
  lastActivity?: string;
  // Beta Access Layer Fields
  is_beta_tester?: boolean;
  beta_start_date?: string | null;
  beta_expiry_date?: string | null;
  beta_status?: BetaStatus;
  beta_duration?: number;
}

export type SimulationPhaseId = 1 | 2 | 3 | 4 | 5 | 6 | number;

export interface SimulationPhase {
  id: SimulationPhaseId;
  name: string;
  title: string;
  daysRange: string;
  startDay: number;
  endDay: number;
  description: string;
  focusCompetencies: string[];
  status: 'locked' | 'active' | 'completed';
}

export interface ClientPersona {
  id: string;
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
  clientPreferences?: string[]; // compatibility alias
  timeSensitivity: string;
  painPoints?: string[];
  companyBackground?: string;
  temperament?: string;
  satisfactionScore: number; // 0 - 100
}

export type SubmissionState =
  | 'not_submitted'
  | 'uploading'
  | 'submitted'
  | 'under_evaluation'
  | 'evaluated'
  | 'revision_requested'
  | 'resubmitted'
  | 'approved';

export type TaskStatus = 'pending' | 'in_progress' | 'submitted' | 'evaluated' | 'revision_requested';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory =
  | 'Inbox Management'
  | 'Calendar & Travel'
  | 'Research & Synthesis'
  | 'Data & Spreadsheets'
  | 'Client Communications'
  | 'Operations & CRM'
  | 'Content & Copywriting';

export interface TaskDeliverable {
  id: string;
  label: string;
  type: 'document' | 'spreadsheet' | 'email_draft' | 'calendar_invite' | 'link' | 'text' | 'image';
  required: boolean;
}

export interface TaskSubmissionAttachment {
  name: string;
  size: string;
  type: string;
  fileData?: string; // base64 data URL
}

export interface TaskSubmissionRecord {
  id: string;
  attemptNumber: number;
  taskId: string;
  studentId?: string;
  submissionType: 'file' | 'link';
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  fileData?: string;
  documentLink?: string;
  extractedContent?: string;
  submissionMessage: string;
  submittedAt: string;
  estimatedMinutes?: number;
  taskStartedAt?: string;
  deadlineAt?: string;
  deadlineType?: DeadlineType;
  actualDurationMinutes?: number;
  submittedOnTime?: boolean;
  minutesLate?: number;
  status: 'under_review' | 'evaluated' | 'revision_requested' | 'approved';
  evaluation?: TaskEvaluation;
  clientReaction?: string;
}

// Compatibility alias
export type TaskSubmission = TaskSubmissionRecord;

export interface TaskEvaluation {
  id?: string;
  submissionId?: string;
  taskId?: string;
  score: number; // 0 - 100
  accuracy: number; // 0 - 10
  communication: number; // 0 - 10
  judgement: number; // 0 - 10
  initiative: number; // 0 - 10
  clientHandling: number; // 0 - 10
  decision?: 'approved' | 'revision_requested';
  evaluatedAt: string;
  feedback: string;
  strengths: string[];
  weaknesses?: string[];
  areasToImprove: string[];
  recommendations?: string[];
  clientReaction?: string;
  evaluatedBy: string;
  submittedOnTime?: boolean;
  minutesLate?: number;
  actualDurationMinutes?: number;
  deadlineType?: DeadlineType;
}

export interface ChatMessageItem {
  id: string;
  sender: 'student' | 'client' | 'system';
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'read';
}

export type ActiveTabType = 'dashboard' | 'client' | 'tasks' | 'chat' | 'progress' | 'roadmap' | 'profile';

export interface TaskItem {
  id: string;
  dayNumber: number;
  phaseId: SimulationPhaseId;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedMinutes: number;
  deadlineHours: number;
  deadlineType?: DeadlineType; // 'none' | 'soft' | 'hard'
  taskStartedAt?: string; // ISO timestamp when student started task
  deadlineAt?: string; // ISO timestamp when hard countdown expires
  actualDurationMinutes?: number;
  submittedOnTime?: boolean;
  minutesLate?: number;
  isStarted?: boolean; // Whether student clicked [ START TASK ]
  revisionStartedAt?: string;
  revisionDeadlineAt?: string;
  brief: string;
  clientContext: string;
  deliverables: TaskDeliverable[];
  status: TaskStatus;
  submissionState?: SubmissionState;
  submission?: TaskSubmissionRecord;
  submissions?: TaskSubmissionRecord[];
  evaluation?: TaskEvaluation;
  createdAt: string;
}

export interface CompetencyMetric {
  id: string;
  name: string;
  category: string;
  score: number; // 0 - 100
  level: 'Novice' | 'Developing' | 'Proficient' | 'Advanced' | 'Expert' | string;
  description: string;
  keySkills: string[];
  trend?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'task' | 'feedback' | 'client' | 'system';
  read: boolean;
}

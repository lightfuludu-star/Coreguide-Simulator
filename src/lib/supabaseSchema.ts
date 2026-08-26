// ==============================================================================
// CoreGuide VA Simulator - Supabase Database Schema Definitions & Documentation
// 16 Relational Tables with Foreign Keys, Indexing, and Row Level Security (RLS)
// ==============================================================================

export interface SchemaTableField {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  foreignTable?: string;
  nullable?: boolean;
  defaultValue?: string;
  description: string;
}

export interface SchemaTableMeta {
  tableName: string;
  category: 'Curriculum Taxonomy' | 'Simulation & Persona' | 'Communications' | 'Execution & Grading' | 'Analytics & Remediation';
  description: string;
  rlsSummary: string;
  fields: SchemaTableField[];
}

export const SCHEMA_TABLES_META: SchemaTableMeta[] = [
  {
    tableName: 'students',
    category: 'Simulation & Persona',
    description: 'Individual student training profiles mapped to Supabase Auth users.',
    rlsSummary: 'Strict auth.uid() isolation. Students can only select, insert, and update their own record.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, isForeign: true, foreignTable: 'auth.users(id)', description: 'Supabase auth user UUID' },
      { name: 'name', type: 'TEXT', nullable: false, description: 'Student full name' },
      { name: 'email', type: 'TEXT', nullable: false, description: 'Student primary email address' },
      { name: 'experience_level', type: 'TEXT', defaultValue: "'Beginner'", description: 'Trainee background level' },
      { name: 'primary_service_id', type: 'UUID', isForeign: true, foreignTable: 'services(id)', description: 'Target VA specialization track' },
      { name: 'tools_known', type: 'TEXT[]', defaultValue: "'{}'", description: 'Array of software tools student is proficient in' },
      { name: 'tools_learning', type: 'TEXT[]', defaultValue: "'{}'", description: 'Array of software tools student is targeting to learn' },
      { name: 'industry_interest', type: 'TEXT', defaultValue: "'Executive & Tech VA'", description: 'Specific industry domain focus' },
      { name: 'current_day', type: 'INTEGER', defaultValue: '1', description: 'Active day in 90-day simulation (1-90)' },
      { name: 'current_stage', type: 'INTEGER', defaultValue: '1', description: 'Active phase/stage in simulation (1-4)' },
      { name: 'simulation_status', type: 'TEXT', defaultValue: "'active'", description: "State ('active', 'paused', 'completed', 'remediating')" },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Timestamp account was registered' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Auto-updated modification timestamp' },
    ],
  },
  {
    tableName: 'services',
    category: 'Curriculum Taxonomy',
    description: 'Master service categories and specialization tracks available in CoreGuide.',
    rlsSummary: 'Public read-only for authenticated students.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique service identifier' },
      { name: 'name', type: 'TEXT', nullable: false, description: 'Service track title (e.g. Executive & Tech VA)' },
      { name: 'description', type: 'TEXT', description: 'Curriculum scope and outcomes' },
      { name: 'active', type: 'BOOLEAN', defaultValue: 'TRUE', description: 'Whether service track is actively open' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Creation timestamp' },
    ],
  },
  {
    tableName: 'skills',
    category: 'Curriculum Taxonomy',
    description: 'High-level core competencies mapped to specific VA services.',
    rlsSummary: 'Public read-only for authenticated students.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique skill UUID' },
      { name: 'service_id', type: 'UUID', isForeign: true, foreignTable: 'services(id)', nullable: false, description: 'Parent service track' },
      { name: 'name', type: 'TEXT', nullable: false, description: 'Competency title (e.g. Executive Communication)' },
      { name: 'description', type: 'TEXT', description: 'Skill rubric and mastery benchmark criteria' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Creation timestamp' },
    ],
  },
  {
    tableName: 'sub_skills',
    category: 'Curriculum Taxonomy',
    description: 'Granular tactical micro-skills underpinning each core competency.',
    rlsSummary: 'Public read-only for authenticated students.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique sub-skill UUID' },
      { name: 'skill_id', type: 'UUID', isForeign: true, foreignTable: 'skills(id)', nullable: false, description: 'Parent skill' },
      { name: 'name', type: 'TEXT', nullable: false, description: 'Sub-skill title (e.g. Multi-Leg Travel Logistics)' },
      { name: 'description', type: 'TEXT', description: 'Specific tactical checklist' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Creation timestamp' },
    ],
  },
  {
    tableName: 'competency_levels',
    category: 'Curriculum Taxonomy',
    description: 'Evaluation benchmarks (Beginner, Intermediate, Advanced) per skill.',
    rlsSummary: 'Public read-only for authenticated students.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Unique level benchmark UUID' },
      { name: 'skill_id', type: 'UUID', isForeign: true, foreignTable: 'skills(id)', nullable: false, description: 'Target skill' },
      { name: 'level', type: 'TEXT', nullable: false, description: "'beginner' | 'intermediate' | 'advanced'" },
      { name: 'description', type: 'TEXT', nullable: false, description: 'Behavioral indicators and grading criteria' },
    ],
  },
  {
    tableName: 'simulations',
    category: 'Simulation & Persona',
    description: 'Active 90-day simulation instances assigned to each enrolled student.',
    rlsSummary: 'Students can only select, create, and update simulations where student_id = auth.uid().',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Simulation run UUID' },
      { name: 'student_id', type: 'UUID', isForeign: true, foreignTable: 'students(id)', nullable: false, description: 'Assigned student' },
      { name: 'service_id', type: 'UUID', isForeign: true, foreignTable: 'services(id)', description: 'Simulated service track' },
      { name: 'current_day', type: 'INTEGER', defaultValue: '1', description: 'Current progression day (1-90)' },
      { name: 'current_stage', type: 'INTEGER', defaultValue: '1', description: 'Simulation stage (1-4)' },
      { name: 'status', type: 'TEXT', defaultValue: "'active'", description: "'active' | 'paused' | 'completed'" },
      { name: 'started_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Start timestamp' },
      { name: 'completed_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Graduation timestamp' },
    ],
  },
  {
    tableName: 'clients',
    category: 'Simulation & Persona',
    description: 'Dynamic simulated client persona profiles assigned to each student simulation.',
    rlsSummary: 'Accessible only by student owning the parent simulation instance.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Client persona UUID' },
      { name: 'simulation_id', type: 'UUID', isForeign: true, foreignTable: 'simulations(id)', nullable: false, description: 'Parent simulation' },
      { name: 'name', type: 'TEXT', nullable: false, description: 'Client persona full name (e.g. Marcus Vance)' },
      { name: 'business_name', type: 'TEXT', nullable: false, description: 'Simulated company name' },
      { name: 'industry', type: 'TEXT', nullable: false, description: 'Enterprise industry vertical' },
      { name: 'business_size', type: 'TEXT', description: 'Company headcount & funding stage' },
      { name: 'role', type: 'TEXT', description: 'Client executive title' },
      { name: 'goals', type: 'TEXT', description: 'Q1-Q4 operational objectives' },
      { name: 'communication_style', type: 'TEXT', description: 'Direct, rapid Slack messages, bulleted briefings' },
      { name: 'personality', type: 'TEXT', description: 'Behavioral traits and working quirks' },
      { name: 'expectations', type: 'TEXT', description: 'SLA turnaround times & formatting rules' },
      { name: 'preferences', type: 'JSONB', defaultValue: "'{}'", description: 'Specific calendar & email rules' },
      { name: 'time_sensitivity', type: 'TEXT', description: 'Urgency threshold for deliverables' },
      { name: 'knowledge_level', type: 'TEXT', description: 'Executive familiarity with technical details' },
      { name: 'tolerance', type: 'TEXT', description: 'Error tolerance margin before escalation' },
      { name: 'priorities', type: 'TEXT', description: 'Highest executive levers' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Persona generation timestamp' },
    ],
  },
  {
    tableName: 'client_memory',
    category: 'Simulation & Persona',
    description: 'Long-term context memory units for the simulated client persona.',
    rlsSummary: 'Accessible only by the student paired with the client via simulation ownership.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Memory entry UUID' },
      { name: 'client_id', type: 'UUID', isForeign: true, foreignTable: 'clients(id)', nullable: false, description: 'Target client' },
      { name: 'memory_type', type: 'TEXT', nullable: false, description: "'preference' | 'relationship' | 'incident' | 'schedule'" },
      { name: 'content', type: 'TEXT', nullable: false, description: 'Factual memory note (e.g. Dislikes meetings before 10 AM)' },
      { name: 'importance', type: 'INTEGER', defaultValue: '3', description: 'Priority weight 1-5' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Memory creation timestamp' },
    ],
  },
  {
    tableName: 'conversations',
    category: 'Communications',
    description: 'Direct messaging channels between students and their simulated client.',
    rlsSummary: 'Strict student_id = auth.uid() isolation for full read/write operations.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Conversation thread UUID' },
      { name: 'client_id', type: 'UUID', isForeign: true, foreignTable: 'clients(id)', nullable: false, description: 'Simulated client participant' },
      { name: 'student_id', type: 'UUID', isForeign: true, foreignTable: 'students(id)', nullable: false, description: 'Student participant' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Thread creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Last message timestamp' },
    ],
  },
  {
    tableName: 'messages',
    category: 'Communications',
    description: 'Individual message transmissions in a simulation conversation.',
    rlsSummary: 'Verified by conversation student ownership check.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Message UUID' },
      { name: 'conversation_id', type: 'UUID', isForeign: true, foreignTable: 'conversations(id)', nullable: false, description: 'Parent conversation' },
      { name: 'sender_type', type: 'TEXT', nullable: false, description: "'student' | 'client' | 'system'" },
      { name: 'content', type: 'TEXT', nullable: false, description: 'Message body text' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Message sent timestamp' },
    ],
  },
  {
    tableName: 'tasks',
    category: 'Execution & Grading',
    description: 'Simulated daily work assignments issued to the student.',
    rlsSummary: 'Student can only view and update tasks linked to their own simulation.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Task UUID' },
      { name: 'simulation_id', type: 'UUID', isForeign: true, foreignTable: 'simulations(id)', nullable: false, description: 'Associated simulation' },
      { name: 'client_id', type: 'UUID', isForeign: true, foreignTable: 'clients(id)', nullable: false, description: 'Issuing client persona' },
      { name: 'day', type: 'INTEGER', nullable: false, description: 'Simulation day (1-90)' },
      { name: 'stage', type: 'INTEGER', nullable: false, description: 'Simulation stage (1-4)' },
      { name: 'title', type: 'TEXT', nullable: false, description: 'Assignment title' },
      { name: 'client_message', type: 'TEXT', nullable: false, description: 'Raw incoming message/email from client' },
      { name: 'objective', type: 'TEXT', nullable: false, description: 'Core business objective' },
      { name: 'context', type: 'TEXT', nullable: false, description: 'Background scenario context' },
      { name: 'constraints', type: 'TEXT', description: 'Timezone rules, confidential boundaries, budget caps' },
      { name: 'expected_deliverable', type: 'TEXT', nullable: false, description: 'Format and items to be produced' },
      { name: 'skill_id', type: 'UUID', isForeign: true, foreignTable: 'skills(id)', description: 'Target primary skill' },
      { name: 'sub_skill_id', type: 'UUID', isForeign: true, foreignTable: 'sub_skills(id)', description: 'Target sub-skill' },
      { name: 'difficulty', type: 'TEXT', defaultValue: "'medium'", description: "'easy' | 'medium' | 'hard' | 'crisis'" },
      { name: 'deadline_type', type: 'TEXT', defaultValue: "'standard'", description: "'flexible' | 'standard' | 'urgent' | 'hard_deadline'" },
      { name: 'status', type: 'TEXT', defaultValue: "'pending'", description: "'pending' | 'in_progress' | 'submitted' | 'evaluated'" },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Task issue timestamp' },
      { name: 'completed_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Task completion timestamp' },
    ],
  },
  {
    tableName: 'submissions',
    category: 'Execution & Grading',
    description: 'Deliverables submitted by students in response to simulation tasks.',
    rlsSummary: 'Strict student_id = auth.uid() isolation for submissions.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Submission UUID' },
      { name: 'task_id', type: 'UUID', isForeign: true, foreignTable: 'tasks(id)', nullable: false, description: 'Associated task' },
      { name: 'student_id', type: 'UUID', isForeign: true, foreignTable: 'students(id)', nullable: false, description: 'Submitting student' },
      { name: 'submission_text', type: 'TEXT', description: 'Written deliverable, email drafts, or briefing notes' },
      { name: 'file_url', type: 'TEXT', description: 'Attached spreadsheet or PDF deliverable URL' },
      { name: 'external_link', type: 'TEXT', description: 'Google Docs / Notion / Sheet URL' },
      { name: 'submitted_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Submission timestamp' },
    ],
  },
  {
    tableName: 'evaluations',
    category: 'Execution & Grading',
    description: 'Detailed rubric evaluations and scores across 5 core grading criteria.',
    rlsSummary: 'Accessible only by student owning the submission being evaluated.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Evaluation UUID' },
      { name: 'submission_id', type: 'UUID', isForeign: true, foreignTable: 'submissions(id)', nullable: false, description: 'Evaluated submission' },
      { name: 'accuracy_score', type: 'NUMERIC(5,2)', nullable: false, description: '0-100 score for precision & detail' },
      { name: 'communication_score', type: 'NUMERIC(5,2)', nullable: false, description: '0-100 score for tone, clarity, and brevity' },
      { name: 'judgement_score', type: 'NUMERIC(5,2)', nullable: false, description: '0-100 score for decision quality & triage' },
      { name: 'initiative_score', type: 'NUMERIC(5,2)', nullable: false, description: '0-100 score for proactiveness & problem solving' },
      { name: 'client_handling_score', type: 'NUMERIC(5,2)', nullable: false, description: '0-100 score for stakeholder temperament matching' },
      { name: 'overall_score', type: 'NUMERIC(5,2)', nullable: false, description: '0-100 weighted aggregate composite score' },
      { name: 'strengths', type: 'JSONB', defaultValue: "'[]'", description: 'Key performance highlights' },
      { name: 'weaknesses', type: 'JSONB', defaultValue: "'[]'", description: 'Identified gaps & oversights' },
      { name: 'recommendations', type: 'JSONB', defaultValue: "'[]'", description: 'Actionable corrective recommendations' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Evaluation completion timestamp' },
    ],
  },
  {
    tableName: 'skill_scores',
    category: 'Analytics & Remediation',
    description: 'Running mastery scores and competency levels per student per skill.',
    rlsSummary: 'Strict student_id = auth.uid() isolation.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Score entry UUID' },
      { name: 'student_id', type: 'UUID', isForeign: true, foreignTable: 'students(id)', nullable: false, description: 'Student' },
      { name: 'skill_id', type: 'UUID', isForeign: true, foreignTable: 'skills(id)', nullable: false, description: 'Evaluated skill' },
      { name: 'score', type: 'NUMERIC(5,2)', defaultValue: '0', description: 'Cumulative skill rating (0-100)' },
      { name: 'competency_level', type: 'TEXT', defaultValue: "'beginner'", description: "'beginner' | 'intermediate' | 'advanced'" },
      { name: 'strength_status', type: 'TEXT', defaultValue: "'developing'", description: "'critical_gap' | 'developing' | 'proficient' | 'mastered'" },
      { name: 'last_updated', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Last score recalculation timestamp' },
    ],
  },
  {
    tableName: 'remediation_tasks',
    category: 'Analytics & Remediation',
    description: 'Targeted corrective practice tasks triggered when scores fall below mastery thresholds.',
    rlsSummary: 'Strict student_id = auth.uid() isolation.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Remediation task UUID' },
      { name: 'student_id', type: 'UUID', isForeign: true, foreignTable: 'students(id)', nullable: false, description: 'Assigned student' },
      { name: 'original_task_id', type: 'UUID', isForeign: true, foreignTable: 'tasks(id)', description: 'Task that triggered remediation' },
      { name: 'skill_id', type: 'UUID', isForeign: true, foreignTable: 'skills(id)', description: 'Target skill needing reinforcement' },
      { name: 'reason', type: 'TEXT', nullable: false, description: 'Diagnostic reason for remedial assignment' },
      { name: 'task_content', type: 'TEXT', nullable: false, description: 'Reinforcement drill instructions' },
      { name: 'status', type: 'TEXT', defaultValue: "'assigned'", description: "'assigned' | 'in_progress' | 'completed' | 'waived'" },
      { name: 'result', type: 'TEXT', description: 'Outcome and grade of remediation attempt' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Assignment timestamp' },
      { name: 'completed_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Completion timestamp' },
    ],
  },
  {
    tableName: 'progress',
    category: 'Analytics & Remediation',
    description: 'Daily progression logs tracking completion and performance across all 90 days.',
    rlsSummary: 'Secured via simulation ownership check for the authenticated student.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, defaultValue: 'gen_random_uuid()', description: 'Progress log UUID' },
      { name: 'simulation_id', type: 'UUID', isForeign: true, foreignTable: 'simulations(id)', nullable: false, description: 'Associated simulation' },
      { name: 'day', type: 'INTEGER', nullable: false, description: 'Simulation day (1-90)' },
      { name: 'stage', type: 'INTEGER', nullable: false, description: 'Simulation stage (1-4)' },
      { name: 'completed', type: 'BOOLEAN', defaultValue: 'FALSE', description: 'Whether day milestones are cleared' },
      { name: 'score', type: 'NUMERIC(5,2)', nullable: true, description: 'Overall day performance rating' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'NOW()', description: 'Log creation timestamp' },
    ],
  },
];

export const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- CoreGuide VA Simulator - PostgreSQL & Supabase Database Architecture
-- Complete Schema Migration: 16 Core Tables, RLS Policies, Indexes & Taxonomies
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. MASTER CURRICULUM TAXONOMY
-- ==============================================================================

-- Table 2: services
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 1: students
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    experience_level TEXT DEFAULT 'Beginner',
    primary_service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    tools_known TEXT[] DEFAULT '{}',
    tools_learning TEXT[] DEFAULT '{}',
    industry_interest TEXT DEFAULT 'Executive & Tech VA',
    current_day INTEGER DEFAULT 1 CHECK (current_day >= 1 AND current_day <= 90),
    current_stage INTEGER DEFAULT 1 CHECK (current_stage >= 1 AND current_stage <= 4),
    simulation_status TEXT DEFAULT 'active' CHECK (simulation_status IN ('active', 'paused', 'completed', 'remediating')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 3: skills
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 4: sub_skills
CREATE TABLE IF NOT EXISTS public.sub_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 5: competency_levels
CREATE TABLE IF NOT EXISTS public.competency_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    description TEXT NOT NULL
);

-- ==============================================================================
-- 3. SIMULATION CORE ENGINE & CLIENT PERSONA
-- ==============================================================================

-- Table 6: simulations
CREATE TABLE IF NOT EXISTS public.simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    current_day INTEGER DEFAULT 1 CHECK (current_day >= 1 AND current_day <= 90),
    current_stage INTEGER DEFAULT 1 CHECK (current_stage >= 1 AND current_stage <= 4),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Table 7: clients
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    simulation_id UUID NOT NULL REFERENCES public.simulations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    business_size TEXT,
    role TEXT,
    goals TEXT,
    communication_style TEXT,
    personality TEXT,
    expectations TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    time_sensitivity TEXT,
    knowledge_level TEXT,
    tolerance TEXT,
    priorities TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 8: client_memory
CREATE TABLE IF NOT EXISTS public.client_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    memory_type TEXT NOT NULL,
    content TEXT NOT NULL,
    importance INTEGER DEFAULT 3 CHECK (importance >= 1 AND importance <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 9: conversations
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 10: messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('student', 'client', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. TASKS, SUBMISSIONS, EVALUATIONS & PROGRESS
-- ==============================================================================

-- Table 11: tasks
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    simulation_id UUID NOT NULL REFERENCES public.simulations(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 90),
    stage INTEGER NOT NULL CHECK (stage >= 1 AND stage <= 4),
    title TEXT NOT NULL,
    client_message TEXT NOT NULL,
    objective TEXT NOT NULL,
    context TEXT NOT NULL,
    constraints TEXT,
    expected_deliverable TEXT NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
    sub_skill_id UUID REFERENCES public.sub_skills(id) ON DELETE SET NULL,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'crisis')),
    deadline_type TEXT DEFAULT 'standard' CHECK (deadline_type IN ('flexible', 'standard', 'urgent', 'hard_deadline')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'evaluated')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Table 12: submissions
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    submission_text TEXT,
    file_url TEXT,
    external_link TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 13: evaluations
CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    accuracy_score NUMERIC(5,2) NOT NULL CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
    communication_score NUMERIC(5,2) NOT NULL CHECK (communication_score >= 0 AND communication_score <= 100),
    judgement_score NUMERIC(5,2) NOT NULL CHECK (judgement_score >= 0 AND judgement_score <= 100),
    initiative_score NUMERIC(5,2) NOT NULL CHECK (initiative_score >= 0 AND initiative_score <= 100),
    client_handling_score NUMERIC(5,2) NOT NULL CHECK (client_handling_score >= 0 AND client_handling_score <= 100),
    overall_score NUMERIC(5,2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    strengths JSONB DEFAULT '[]'::jsonb,
    weaknesses JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 14: skill_scores
CREATE TABLE IF NOT EXISTS public.skill_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    score NUMERIC(5,2) DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    competency_level TEXT DEFAULT 'beginner' CHECK (competency_level IN ('beginner', 'intermediate', 'advanced')),
    strength_status TEXT DEFAULT 'developing' CHECK (strength_status IN ('critical_gap', 'developing', 'proficient', 'mastered')),
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_skill UNIQUE (student_id, skill_id)
);

-- Table 15: remediation_tasks
CREATE TABLE IF NOT EXISTS public.remediation_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    original_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    task_content TEXT NOT NULL,
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'waived')),
    result TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Table 16: progress
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    simulation_id UUID NOT NULL REFERENCES public.simulations(id) ON DELETE CASCADE,
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 90),
    stage INTEGER NOT NULL CHECK (stage >= 1 AND stage <= 4),
    completed BOOLEAN DEFAULT FALSE,
    score NUMERIC(5,2) CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_simulation_day UNIQUE (simulation_id, day)
);

-- ==============================================================================
-- 5. PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_students_primary_service ON public.students(primary_service_id);
CREATE INDEX IF NOT EXISTS idx_skills_service ON public.skills(service_id);
CREATE INDEX IF NOT EXISTS idx_sub_skills_skill ON public.sub_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_competency_levels_skill ON public.competency_levels(skill_id);

CREATE INDEX IF NOT EXISTS idx_simulations_student ON public.simulations(student_id);
CREATE INDEX IF NOT EXISTS idx_simulations_status ON public.simulations(status);
CREATE INDEX IF NOT EXISTS idx_clients_simulation ON public.clients(simulation_id);
CREATE INDEX IF NOT EXISTS idx_client_memory_client ON public.client_memory(client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_student ON public.conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_conversations_client ON public.conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at ASC);

CREATE INDEX IF NOT EXISTS idx_tasks_simulation ON public.tasks(simulation_id);
CREATE INDEX IF NOT EXISTS idx_tasks_client ON public.tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_day ON public.tasks(day);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_skill ON public.tasks(skill_id);

CREATE INDEX IF NOT EXISTS idx_submissions_task ON public.submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_submission ON public.evaluations(submission_id);
CREATE INDEX IF NOT EXISTS idx_skill_scores_student ON public.skill_scores(student_id);
CREATE INDEX IF NOT EXISTS idx_remediation_student ON public.remediation_tasks(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_simulation ON public.progress(simulation_id);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competency_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remediation_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- 1. Services
CREATE POLICY "Services are viewable by authenticated users" 
ON public.services FOR SELECT TO authenticated USING (true);

-- 2. Skills
CREATE POLICY "Skills are viewable by authenticated users" 
ON public.skills FOR SELECT TO authenticated USING (true);

-- 3. Sub-Skills
CREATE POLICY "Sub-skills are viewable by authenticated users" 
ON public.sub_skills FOR SELECT TO authenticated USING (true);

-- 4. Competency Levels
CREATE POLICY "Competency levels are viewable by authenticated users" 
ON public.competency_levels FOR SELECT TO authenticated USING (true);

-- 5. Students
CREATE POLICY "Students can view own profile" 
ON public.students FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Students can insert own profile" 
ON public.students FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Students can update own profile" 
ON public.students FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 6. Simulations
CREATE POLICY "Students can view own simulations" 
ON public.simulations FOR SELECT TO authenticated USING (student_id = auth.uid());

CREATE POLICY "Students can insert own simulations" 
ON public.simulations FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own simulations" 
ON public.simulations FOR UPDATE TO authenticated USING (student_id = auth.uid());

-- 7. Clients
CREATE POLICY "Students can view own simulation clients" 
ON public.clients FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.simulations s 
        WHERE s.id = clients.simulation_id 
        AND s.student_id = auth.uid()
    )
);

CREATE POLICY "Students can manage own simulation clients" 
ON public.clients FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.simulations s 
        WHERE s.id = clients.simulation_id 
        AND s.student_id = auth.uid()
    )
);

-- 8. Client Memory
CREATE POLICY "Students can access own client memory" 
ON public.client_memory FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.clients c
        JOIN public.simulations s ON c.simulation_id = s.id
        WHERE c.id = client_memory.client_id
        AND s.student_id = auth.uid()
    )
);

-- 9. Conversations
CREATE POLICY "Students can view own conversations" 
ON public.conversations FOR SELECT TO authenticated USING (student_id = auth.uid());

CREATE POLICY "Students can create own conversations" 
ON public.conversations FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own conversations" 
ON public.conversations FOR UPDATE TO authenticated USING (student_id = auth.uid());

-- 10. Messages
CREATE POLICY "Students can view messages in own conversations" 
ON public.messages FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = messages.conversation_id 
        AND c.student_id = auth.uid()
    )
);

CREATE POLICY "Students can send messages to own conversations" 
ON public.messages FOR INSERT TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE c.id = messages.conversation_id 
        AND c.student_id = auth.uid()
    )
);

-- 11. Tasks
CREATE POLICY "Students can view tasks in own simulation" 
ON public.tasks FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.simulations s 
        WHERE s.id = tasks.simulation_id 
        AND s.student_id = auth.uid()
    )
);

CREATE POLICY "Students can update task status in own simulation" 
ON public.tasks FOR UPDATE TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.simulations s 
        WHERE s.id = tasks.simulation_id 
        AND s.student_id = auth.uid()
    )
);

-- 12. Submissions
CREATE POLICY "Students can view own submissions" 
ON public.submissions FOR SELECT TO authenticated USING (student_id = auth.uid());

CREATE POLICY "Students can submit deliverables" 
ON public.submissions FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can edit own submissions" 
ON public.submissions FOR UPDATE TO authenticated USING (student_id = auth.uid());

-- 13. Evaluations
CREATE POLICY "Students can view own evaluations" 
ON public.evaluations FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.submissions sub 
        WHERE sub.id = evaluations.submission_id 
        AND sub.student_id = auth.uid()
    )
);

-- 14. Skill Scores
CREATE POLICY "Students can view own skill scores" 
ON public.skill_scores FOR SELECT TO authenticated USING (student_id = auth.uid());

CREATE POLICY "Students can manage own skill scores" 
ON public.skill_scores FOR ALL TO authenticated USING (student_id = auth.uid());

-- 15. Remediation Tasks
CREATE POLICY "Students can access own remediation tasks" 
ON public.remediation_tasks FOR ALL TO authenticated USING (student_id = auth.uid());

-- 16. Progress
CREATE POLICY "Students can view own progress" 
ON public.progress FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.simulations s 
        WHERE s.id = progress.simulation_id 
        AND s.student_id = auth.uid()
    )
);

CREATE POLICY "Students can manage own progress" 
ON public.progress FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.simulations s 
        WHERE s.id = progress.simulation_id 
        AND s.student_id = auth.uid()
    )
);

-- ==============================================================================
-- 7. AUTOMATED UPDATED_AT TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_students_updated_at ON public.students;
CREATE TRIGGER tr_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_conversations_updated_at ON public.conversations;
CREATE TRIGGER tr_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
`;

-- ==============================================================================
-- CoreGuide VA Simulator - Master Supabase Database Schema
-- 16 Database Tables, Indexes, Foreign Keys, and Strict Row Level Security (RLS)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. MASTER CURRICULUM TAXONOMY
-- ==============================================================================

-- 1. services
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. students
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

-- 3. skills
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. sub_skills
CREATE TABLE IF NOT EXISTS public.sub_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. competency_levels
CREATE TABLE IF NOT EXISTS public.competency_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    description TEXT NOT NULL
);

-- ==============================================================================
-- 3. SIMULATION & CLIENT ENGINE
-- ==============================================================================

-- 6. simulations
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

-- 7. clients
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

-- 8. client_memory
CREATE TABLE IF NOT EXISTS public.client_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    memory_type TEXT NOT NULL,
    content TEXT NOT NULL,
    importance INTEGER DEFAULT 3 CHECK (importance >= 1 AND importance <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. conversations
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. messages
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

-- 11. tasks
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

-- 12. submissions
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    submission_text TEXT,
    file_url TEXT,
    external_link TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. evaluations
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

-- 14. skill_scores
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

-- 15. remediation_tasks
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

-- 16. progress
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
-- 5. INDEXES
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
-- 7. UPDATED_AT TRIGGER
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

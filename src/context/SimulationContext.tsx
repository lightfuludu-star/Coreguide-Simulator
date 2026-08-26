import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TaskItem,
  TaskEvaluation,
  ClientPersona,
  CompetencyMetric,
  NotificationItem,
  ChatMessageItem,
  SimulationPhase,
  TaskSubmissionRecord,
  SubmissionState,
} from '../types';
import {
  VaServiceDefinition,
  ALL_VA_SERVICES,
  getServiceById,
  SIMULATION_STAGES,
  BETA_14_DAY_PHASES,
} from '../data/vaServicesData';
import { generateTaskForDay, evaluateStudentSubmission, getStageForDay } from '../data/taskGenerator';
import { generateSimulatedClient, AVAILABLE_INDUSTRIES } from '../data/clientGenerator';
import { generateClientReply } from '../services/clientConversationEngine';
import { evaluateDeliverable, EvaluationResponse } from '../services/deliverableEvaluator';
import { useAuth } from './AuthContext';
import { getBetaAccessState, BetaAccessState, BETA_MAX_SIMULATION_DAY } from '../utils/betaAccess';

export type NavigationTab = 'dashboard' | 'client' | 'tasks' | 'chat' | 'progress' | 'admin';

export interface SubmitDeliverableOptions {
  taskId: string;
  submissionType: 'file' | 'link';
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  fileData?: string; // base64
  documentLink?: string;
  submissionMessage: string;
}

export interface SimulationContextType {
  currentDay: number;
  maxUnlockedDay: number;
  setCurrentDay: (day: number) => void;
  advanceToNextDay: () => void;
  activeService: VaServiceDefinition;
  selectedIndustry: string;
  selectService: (serviceId: string, industryPreference?: string) => void;
  availableServices: VaServiceDefinition[];
  phases: SimulationPhase[];
  currentStage: typeof SIMULATION_STAGES[0];
  client: ClientPersona;
  tasks: TaskItem[];
  todaysTask: TaskItem | null;
  startTask: (taskId: string) => void;
  competencies: CompetencyMetric[];
  notifications: NotificationItem[];
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  submitTask: (payload: SubmitDeliverableOptions | any) => Promise<EvaluationResponse>;
  markNotificationAsRead: (id: string) => void;
  unreadNotificationsCount: number;
  chatMessages: ChatMessageItem[];
  sendChatMessage: (content: string) => void;
  isClientTyping: boolean;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  // Beta Test Layer State
  betaState: BetaAccessState;
  isBetaAdminModalOpen: boolean;
  setIsBetaAdminModalOpen: (open: boolean) => void;
  // Admin Action Helpers
  activateStudent: (studentId: string) => void;
  reactivateStudent: (studentId: string) => void;
  extendStudent: (studentId: string, days?: number) => void;
  expireStudent: (studentId: string) => void;
  revokeStudent: (studentId: string) => void;
  resetStudentToNotActivated: (studentId: string) => void;
  grantFullAccess: (studentId: string) => void;
  grantAdmin: (studentId: string) => void;
  stats: {
    completionPercentage: number;
    tasksCompleted: number;
    totalTasksAssigned: number;
    averageScore: number;
    clientSatisfaction: number;
  };
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    activateStudentById,
    reactivateStudentById,
    extendStudentById,
    expireStudentById,
    revokeStudentById,
    resetStudentToNotActivatedById,
    grantFullAccessById,
    grantAdminById,
  } = useAuth();

  const betaState = getBetaAccessState(user);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('customer_service');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ecommerce_beauty');
  const [currentDay, setCurrentDayState] = useState<number>(() => {
    return user?.currentDay ? Math.min(user.currentDay, betaState.maxAllowedSimulationDay) : 6;
  });
  const [maxUnlockedDay, setMaxUnlockedDay] = useState<number>(() => {
    return user?.currentDay ? Math.min(user.currentDay, betaState.maxAllowedSimulationDay) : 6;
  });
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isBetaAdminModalOpen, setIsBetaAdminModalOpen] = useState<boolean>(false);
  const [isClientTyping, setIsClientTyping] = useState<boolean>(false);

  const activeService = getServiceById(selectedServiceId);
  const [client, setClient] = useState<ClientPersona>(() =>
    generateSimulatedClient(selectedServiceId, selectedIndustry)
  );

  // Helper to initialize timing attributes on a task if not already populated
  const initializeTaskTiming = (task: TaskItem): TaskItem => {
    const taskStartedAt = task.taskStartedAt || new Date().toISOString();
    const deadlineType = task.deadlineType || (task.priority === 'urgent' ? 'hard' : 'soft');
    let deadlineAt = task.deadlineAt;
    if (!deadlineAt) {
      if (deadlineType === 'hard') {
        const mins = task.estimatedMinutes || 30;
        deadlineAt = new Date(new Date(taskStartedAt).getTime() + mins * 60 * 1000).toISOString();
      } else if (deadlineType === 'soft') {
        const mins = (task.deadlineHours ? task.deadlineHours * 60 : (task.estimatedMinutes || 45) * 2);
        deadlineAt = new Date(new Date(taskStartedAt).getTime() + mins * 60 * 1000).toISOString();
      }
    }
    return {
      ...task,
      deadlineType,
      taskStartedAt,
      deadlineAt,
      isStarted: task.isStarted ?? true,
    };
  };

  // Initialize tasks with stored timestamps from localStorage if available, or generate Day 1 task
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(`coreguide_tasks_v2_${selectedServiceId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t) => initializeTaskTiming(t));
        }
      }
    } catch {
      // ignore
    }
    const initial = generateTaskForDay(1, activeService, client, {
      competencies: activeService.competencies,
      industry: selectedIndustry,
    });
    return [initializeTaskTiming(initial)];
  });

  // Save tasks to localStorage on update to guarantee timers persist across page refreshes & reloads
  useEffect(() => {
    try {
      localStorage.setItem(`coreguide_tasks_v2_${selectedServiceId}`, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks, selectedServiceId]);

  const [competencies, setCompetencies] = useState<CompetencyMetric[]>(activeService.competencies);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([]);

  // Setup client and tasks whenever service or industry changes
  useEffect(() => {
    const s = getServiceById(selectedServiceId);
    const assignedClient = generateSimulatedClient(selectedServiceId, selectedIndustry);
    setClient(assignedClient);

    try {
      const saved = localStorage.getItem(`coreguide_tasks_v2_${selectedServiceId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed.map((t) => initializeTaskTiming(t)));
        } else {
          const initTask = generateTaskForDay(1, s, assignedClient, { competencies: s.competencies, industry: selectedIndustry });
          setTasks([initializeTaskTiming(initTask)]);
        }
      } else {
        const initTask = generateTaskForDay(1, s, assignedClient, { competencies: s.competencies, industry: selectedIndustry });
        setTasks([initializeTaskTiming(initTask)]);
      }
    } catch {
      const initTask = generateTaskForDay(1, s, assignedClient, { competencies: s.competencies, industry: selectedIndustry });
      setTasks([initializeTaskTiming(initTask)]);
    }

    setCompetencies(s.competencies);
    setCurrentDayState(1);
    setMaxUnlockedDay(1);

    // Initial greeting chat message from client
    setChatMessages([
      {
        id: 'msg-init-1',
        sender: 'client',
        content: `Hi! I'm ${assignedClient.ceoName} (${assignedClient.ceoRole} at ${assignedClient.companyName}). Welcome to the team! I've assigned your Day 1 task in the queue. Feel free to message me here if you need any clarification as you work through it.`,
        timestamp: '9:00 AM',
        status: 'read',
      },
    ]);

    setNotifications([
      {
        id: 'notif-1',
        title: `Welcome to ${s.name}`,
        message: `${assignedClient.ceoName} assigned your Day 1 task. Review the brief and client rules.`,
        time: 'Just now',
        type: 'task',
        read: false,
      },
    ]);
  }, [selectedServiceId, selectedIndustry]);

  // Ensure current day task exists and has timing initialized
  useEffect(() => {
    const existingTask = tasks.find((t) => t.dayNumber === currentDay);
    if (!existingTask) {
      const evaluatedList = tasks.filter((t) => t.status === 'evaluated');
      const latestEvaluated = evaluatedList[evaluatedList.length - 1];
      const identifiedWeaknesses = latestEvaluated?.evaluation?.areasToImprove || [];

      const generated = generateTaskForDay(currentDay, activeService, client, {
        competencies,
        previousTasks: tasks,
        previousSubmissions: tasks.flatMap((t) => t.submissions || []),
        identifiedWeaknesses,
        industry: selectedIndustry,
      });
      const initialized = initializeTaskTiming(generated);
      setTasks((prev) => [...prev, initialized]);
    }
  }, [currentDay, activeService, client, tasks, competencies, selectedIndustry]);

  const startTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? initializeTaskTiming(t) : t))
    );
  };

  const is14DayTrack = !isAdmin && user?.accessType !== 'FULL_STUDENT';
  const currentBetaPhase = BETA_14_DAY_PHASES.find((p) => currentDay >= p.startDay && currentDay <= p.endDay) || BETA_14_DAY_PHASES[4];
  const currentStage = is14DayTrack
    ? {
        stageNumber: currentBetaPhase.phaseId,
        name: currentBetaPhase.name,
        daysRange: currentBetaPhase.daysRange,
        startDay: currentBetaPhase.startDay,
        endDay: currentBetaPhase.endDay,
        focus: currentBetaPhase.description,
        difficulty: currentBetaPhase.difficulty,
      }
    : getStageForDay(currentDay);

  // Map progression stages to UI phase items
  const phases: SimulationPhase[] = is14DayTrack
    ? BETA_14_DAY_PHASES.map((p) => ({
        id: p.phaseId as 1 | 2 | 3 | 4,
        name: p.name,
        title: p.title,
        daysRange: p.daysRange,
        startDay: p.startDay,
        endDay: p.endDay,
        description: p.description,
        focusCompetencies: activeService.skills.map((sk) => sk.name).slice(0, 4),
        status:
          currentDay > p.endDay
            ? 'completed'
            : currentDay >= p.startDay
            ? 'active'
            : 'locked',
      }))
    : SIMULATION_STAGES.slice(0, 6).map((s, idx) => ({
        id: (idx + 1) as 1 | 2 | 3 | 4,
        name: `Stage ${s.stageNumber}`,
        title: s.name.replace(`Stage ${s.stageNumber} — `, ''),
        daysRange: s.daysRange,
        startDay: s.startDay,
        endDay: s.endDay,
        description: s.focus,
        focusCompetencies: activeService.skills.map((sk) => sk.name).slice(0, 4),
        status:
          currentDay > s.endDay
            ? 'completed'
            : currentDay >= s.startDay
            ? 'active'
            : 'locked',
      }));

  const selectService = (serviceId: string, industryPreference?: string) => {
    setSelectedServiceId(serviceId);
    if (industryPreference) {
      setSelectedIndustry(industryPreference);
    }
  };

  // Enforce sequential day progression: cannot navigate past maxUnlockedDay or beta limit (Day 14)
  const setCurrentDay = (day: number) => {
    const maxAllowed = betaState.isBetaTester && user?.role !== 'admin' && user?.accessType !== 'ADMIN'
      ? BETA_MAX_SIMULATION_DAY
      : 90;
    const effectiveLimit = Math.min(maxUnlockedDay, maxAllowed);
    const targetDay = Math.max(1, Math.min(effectiveLimit, day));
    setCurrentDayState(targetDay);
  };

  // Advance to next day sequentially after completing or submitting work
  const advanceToNextDay = () => {
    const maxAllowed = betaState.isBetaTester && user?.role !== 'admin' && user?.accessType !== 'ADMIN'
      ? BETA_MAX_SIMULATION_DAY
      : 90;

    if (currentDay < maxAllowed) {
      const nextDay = currentDay + 1;
      setCurrentDayState(nextDay);
      setMaxUnlockedDay((prev) => Math.max(prev, nextDay));

      // Add notification for new day
      const newNotif: NotificationItem = {
        id: 'notif-' + Date.now(),
        title: `Advanced to Day ${nextDay}`,
        message: `Day ${nextDay} assignment is now active for ${client.companyName}.`,
        time: 'Just now',
        type: 'task',
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    } else if (betaState.isBetaTester && currentDay >= BETA_MAX_SIMULATION_DAY) {
      const limitNotif: NotificationItem = {
        id: 'notif-beta-limit-' + Date.now(),
        title: '14-Day Beta Test Limit Reached',
        message: 'You have accessed up to Day 14 in the 14-day beta test environment. Days 15–90 belong to the complete 90-day simulation curriculum.',
        time: 'Just now',
        type: 'system',
        read: false,
      };
      setNotifications((prev) => [limitNotif, ...prev]);
    }
  };

  // Submit task and evaluate real deliverable across 5 Universal Dimensions
  const submitTask = async (
    payload: SubmitDeliverableOptions | any
  ): Promise<EvaluationResponse> => {
    if (!betaState.canPerformTasks) {
      if (betaState.isNotStarted) {
        throw new Error('Your beta access has not been activated yet. An administrator will activate your 14-day beta window soon.');
      }
      if (betaState.isRevoked) {
        throw new Error('Your CoreGuide access has been temporarily disabled. Please contact your administrator.');
      }
      throw new Error('Your CoreGuide beta period has ended. Thank you for helping us test CoreGuide.');
    }

    let taskId = '';
    let submissionType: 'file' | 'link' = 'file';
    let fileName = '';
    let fileSize = '';
    let fileType = '';
    let fileData = '';
    let documentLink = '';
    let submissionMessage = '';

    if (typeof payload === 'string') {
      taskId = payload;
    } else if (payload && typeof payload === 'object') {
      taskId = payload.taskId;
      submissionType = payload.submissionType || 'file';
      fileName = payload.fileName || '';
      fileSize = payload.fileSize || '';
      fileType = payload.fileType || '';
      fileData = payload.fileData || '';
      documentLink = payload.documentLink || '';
      submissionMessage = payload.submissionMessage || payload.notes || '';
    }

    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) {
      throw new Error(`Task ${taskId} not found`);
    }

    const existingSubmissions = targetTask.submissions || [];
    const attemptNumber = existingSubmissions.length + 1;

    // Timing calculations
    const submissionTime = new Date().toISOString();
    const taskStartedAt = targetTask.taskStartedAt || submissionTime;
    const deadlineAt = targetTask.deadlineAt;
    const durationMs = Math.max(1000, new Date(submissionTime).getTime() - new Date(taskStartedAt).getTime());
    const actualDurationMinutes = Math.max(1, Math.round(durationMs / (1000 * 60)));
    const deadlineType = targetTask.deadlineType || (targetTask.priority === 'urgent' ? 'hard' : 'soft');

    let submittedOnTime = true;
    let minutesLate = 0;

    if (deadlineType === 'none') {
      submittedOnTime = true;
      minutesLate = 0;
    } else if (deadlineAt) {
      const isPast = new Date(submissionTime).getTime() > new Date(deadlineAt).getTime();
      if (isPast) {
        submittedOnTime = false;
        minutesLate = Math.max(1, Math.round((new Date(submissionTime).getTime() - new Date(deadlineAt).getTime()) / (1000 * 60)));
      } else {
        submittedOnTime = true;
        minutesLate = 0;
      }
    }

    const timingPayload = {
      taskStartedAt,
      deadlineAt,
      submittedAt: submissionTime,
      actualDurationMinutes,
      submittedOnTime,
      minutesLate,
      deadlineType,
    };

    // Set state to under_evaluation during processing
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'submitted',
              submissionState: 'under_evaluation',
            }
          : t
      )
    );

    // Call server evaluation engine (Gemini 3.7 Flash + document extraction)
    const evalResult = await evaluateDeliverable({
      task: targetTask,
      client,
      userProfile: user,
      submission: {
        submissionType,
        fileName,
        fileType,
        fileSize,
        fileData,
        documentLink,
        submissionMessage,
      },
      timing: timingPayload,
      chatHistory: chatMessages,
      attemptNumber,
    });

    const { evaluation, decision } = evalResult;

    // Create persistent submission record for history
    const newSubmissionRecord: TaskSubmissionRecord = {
      id: 'sub-' + Math.random().toString(36).substring(2, 9),
      attemptNumber,
      taskId,
      submissionType,
      fileName,
      fileSize,
      fileType,
      fileData,
      documentLink,
      submissionMessage,
      submittedAt: submissionTime,
      taskStartedAt,
      deadlineAt,
      actualDurationMinutes,
      submittedOnTime,
      minutesLate,
      deadlineType,
      status: decision === 'approved' ? 'approved' : 'revision_requested',
      evaluation,
      clientReaction: evalResult.clientReaction,
    };

    const updatedSubmissions = [...existingSubmissions, newSubmissionRecord];
    const finalTaskStatus = decision === 'approved' ? 'evaluated' : 'revision_requested';
    const finalSubmissionState: SubmissionState = decision === 'approved' ? 'approved' : 'revision_requested';

    // Update tasks state
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: finalTaskStatus,
            submissionState: finalSubmissionState,
            submission: newSubmissionRecord,
            submissions: updatedSubmissions,
            evaluation,
            actualDurationMinutes,
            submittedOnTime,
            minutesLate,
          };
        }
        return t;
      })
    );

    // Update client satisfaction based on evaluation score
    setClient((prev) => {
      const delta = evaluation.score >= 85 ? 1 : evaluation.score < 70 ? -2 : 0;
      return {
        ...prev,
        satisfactionScore: Math.min(99, Math.max(65, prev.satisfactionScore + delta)),
      };
    });

    // Notification of evaluation ready
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: decision === 'approved' ? `Deliverable Approved: ${evaluation.score}/100` : `Revision Requested: Day ${targetTask.dayNumber}`,
      message: `${client.ceoName} reviewed your Day ${targetTask.dayNumber} submission.`,
      time: 'Just now',
      type: 'feedback',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Send personalized client chat reaction
    setTimeout(() => {
      if (evalResult.clientReaction) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: 'msg-' + Date.now(),
            sender: 'client',
            content: evalResult.clientReaction,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
          },
        ]);
      }
    }, 1200);

    return evalResult;
  };

  // Client interactive chat with Contextual NLP & Gemini Generation
  const sendChatMessage = async (content: string) => {
    if (!content.trim()) return;

    const studentMsg: ChatMessageItem = {
      id: 'msg-' + Date.now(),
      sender: 'student',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    const updatedHistory = [...chatMessages, studentMsg];
    setChatMessages(updatedHistory);
    setIsClientTyping(true);

    try {
      const replyContent = await generateClientReply({
        message: content.trim(),
        client,
        todaysTask,
        currentDay,
        currentStage,
        history: updatedHistory,
        serviceId: selectedServiceId,
      });

      const clientReply: ChatMessageItem = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'client',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };

      setChatMessages((prev) => [...prev, clientReply]);
    } catch (err) {
      console.error('Error generating client response:', err);
    } finally {
      setIsClientTyping(false);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const todaysTask = tasks.find((t) => t.dayNumber === currentDay) || tasks[0] || null;

  const evaluatedTasks = tasks.filter((t) => t.status === 'evaluated');
  const totalScore = evaluatedTasks.reduce((acc, curr) => acc + (curr.evaluation?.score || 0), 0);
  const averageScore = evaluatedTasks.length > 0 ? Math.round(totalScore / evaluatedTasks.length) : 92;
  const tasksCompleted = tasks.filter((t) => t.status === 'evaluated' || t.status === 'submitted').length;
  const totalTasksAssigned = tasks.length;
  const completionPercentage = Math.round((currentDay / 90) * 100);

  return (
    <SimulationContext.Provider
      value={{
        currentDay,
        maxUnlockedDay,
        setCurrentDay,
        advanceToNextDay,
        activeService,
        selectedIndustry,
        selectService,
        availableServices: ALL_VA_SERVICES,
        phases,
        currentStage,
        client,
        tasks,
        todaysTask,
        startTask,
        competencies,
        notifications,
        activeTab,
        setActiveTab,
        selectedTaskId,
        setSelectedTaskId,
        submitTask,
        markNotificationAsRead,
        unreadNotificationsCount,
        chatMessages,
        sendChatMessage,
        isClientTyping,
        isOnboardingOpen,
        setIsOnboardingOpen,
        betaState,
        isBetaAdminModalOpen,
        setIsBetaAdminModalOpen,
        activateStudent: activateStudentById,
        reactivateStudent: reactivateStudentById,
        extendStudent: extendStudentById,
        expireStudent: expireStudentById,
        revokeStudent: revokeStudentById,
        resetStudentToNotActivated: resetStudentToNotActivatedById,
        grantFullAccess: grantFullAccessById,
        grantAdmin: grantAdminById,
        stats: {
          completionPercentage,
          tasksCompleted,
          totalTasksAssigned,
          averageScore,
          clientSatisfaction: client.satisfactionScore,
        },
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = (): SimulationContextType => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};

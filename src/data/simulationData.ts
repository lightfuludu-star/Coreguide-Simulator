// ==============================================================================
// CoreGuide VA Simulator - Simulation Data Facade & Defaults
// Exports rich defaults from vaServicesData and taskGenerator
// ==============================================================================

import { ALL_VA_SERVICES, getServiceById, SIMULATION_STAGES } from './vaServicesData';
import { SimulationPhase, NotificationItem } from '../types';

export { ALL_VA_SERVICES, getServiceById, SIMULATION_STAGES };

// Default active track is Customer Service VA (Core V1 Focus)
export const DEFAULT_SERVICE = ALL_VA_SERVICES[0];

export const INITIAL_PHASES: SimulationPhase[] = SIMULATION_STAGES.slice(0, 4).map((s, idx) => ({
  id: (idx + 1) as 1 | 2 | 3 | 4,
  name: `Stage ${s.stageNumber}`,
  title: s.name.replace(`Stage ${s.stageNumber}: `, ''),
  daysRange: s.daysRange,
  startDay: s.startDay,
  endDay: s.endDay,
  description: s.focus,
  focusCompetencies: ['Client Communication', 'Task Prioritization', 'SOP Adherence', 'Accuracy Under Pressure'],
  status: idx === 0 ? 'active' : 'locked',
}));

export const PRIMARY_CLIENT = DEFAULT_SERVICE.defaultClient;
export const INITIAL_TASKS = DEFAULT_SERVICE.initialTasks;
export const INITIAL_COMPETENCIES = DEFAULT_SERVICE.competencies;

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Client Contract Activated (Day 1)',
    message: `${DEFAULT_SERVICE.defaultClient.ceoName} at ${DEFAULT_SERVICE.defaultClient.companyName} assigned your Day 1 onboarding deliverable.`,
    time: '10m ago',
    type: 'task',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Welcome to CoreGuide VA Simulator',
    message: 'Review your client operating profile and Golden Communication Rules before submitting work.',
    time: '1h ago',
    type: 'system',
    read: false,
  },
];

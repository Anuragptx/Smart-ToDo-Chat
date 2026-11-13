/**
 * Application Constants & Default Seed Registries
 * Centralized single source of truth for categories, storage keys, seed tasks, and navigation.
 */

export const STORAGE_KEYS = {
  TASKS: 'flowtask_tasks_v2',
  CATEGORIES: 'flowtask_categories_v2',
  SETTINGS: 'flowtask_settings_v2',
  USER: 'flowtask_user_v2'
};

export const DEFAULT_CATEGORIES = [
  { id: 'work', name: 'Work', color: '#6366f1' },       // Indigo
  { id: 'personal', name: 'Personal', color: '#ec4899' }, // Pink
  { id: 'development', name: 'Development', color: '#06b6d4' }, // Cyan
  { id: 'study', name: 'Study', color: '#f59e0b' },       // Amber
  { id: 'health', name: 'Health', color: '#10b981' }      // Emerald
];

export const INITIAL_SEED_TASKS = [
  {
    id: 'seed-task-1',
    title: 'Deploy Q4 Product Architecture Review',
    description: 'Finalize service blueprint and present latency optimization roadmap to engineering leadership.',
    priority: 'high',
    category: 'Work',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '16:00',
    completed: false,
    completedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    subtasks: [
      { id: 'sub-1-1', title: 'Compile distributed cache performance metrics', completed: true },
      { id: 'sub-1-2', title: 'Diagram microservice event-bus topology', completed: true },
      { id: 'sub-1-3', title: 'Schedule calendar invite with lead architects', completed: false }
    ]
  },
  {
    id: 'seed-task-2',
    title: 'Refactor UI State with React 19 Hooks',
    description: 'Migrate legacy component prop drills to modern context and verify bundle size impact.',
    priority: 'high',
    category: 'Development',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '18:30',
    completed: false,
    completedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    subtasks: [
      { id: 'sub-2-1', title: 'Benchmark render tree performance', completed: false },
      { id: 'sub-2-2', title: 'Write unit tests for custom hooks', completed: false }
    ]
  },
  {
    id: 'seed-task-3',
    title: '30-Minute Cardiovascular Mobility Routine',
    description: 'Post-work active recovery session: zone-2 cardio followed by lower back stretches.',
    priority: 'medium',
    category: 'Health',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dueTime: '07:30',
    completed: false,
    completedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    subtasks: [
      { id: 'sub-3-1', title: '15-min steady treadmill pacing', completed: false },
      { id: 'sub-3-2', title: 'Full-body foam rolling session', completed: false }
    ]
  },
  {
    id: 'seed-task-4',
    title: 'Study Distributed Systems: Paxos vs Raft Consensus',
    description: 'Read Chapter 4 of Designing Data-Intensive Applications and take structured notes.',
    priority: 'low',
    category: 'Study',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    dueTime: '20:00',
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    subtasks: [
      { id: 'sub-4-1', title: 'Summarize leader election edge cases', completed: true },
      { id: 'sub-4-2', title: 'Log notes into digital second brain', completed: true }
    ]
  }
];

export const PRIORITIES = [
  { value: 'high', label: 'High Priority', color: 'red', emoji: '🔴' },
  { value: 'medium', label: 'Medium Priority', color: 'amber', emoji: '🟡' },
  { value: 'low', label: 'Low Priority', color: 'emerald', emoji: '🟢' }
];

export const NAV_VIEWS = [
  { id: 'all', label: 'All Tasks', icon: 'LayersIcon' },
  { id: 'today', label: "Today's Schedule", icon: 'CalendarIcon' },
  { id: 'upcoming', label: 'Upcoming Deadlines', icon: 'ClockIcon' },
  { id: 'completed', label: 'Completed Archive', icon: 'CheckCheckIcon' },
  { id: 'analytics', label: 'Productivity Analytics', icon: 'BarChartIcon' }
];

export const KEYBOARD_SHORTCUTS = [
  { key: 'N', action: 'Create New Task' },
  { key: 'Ctrl + K / ⌘K', action: 'Focus Global Search' },
  { key: '/', action: 'Quick Filter / Search' },
  { key: '1', action: 'View All Tasks' },
  { key: '2', action: "View Today's Tasks" },
  { key: '3', action: 'View Upcoming Deadlines' },
  { key: '4', action: 'View Productivity Analytics' },
  { key: '?', action: 'Toggle Shortcuts Modal' },
  { key: 'Esc', action: 'Close Modals & Blur Inputs' }
];

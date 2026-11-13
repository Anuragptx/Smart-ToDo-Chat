/**
 * Smart AI Productivity Engine
 * Provides priority recommendations, task breakdowns into subtasks,
 * and contextual workload analytics.
 */

// Keyword dictionaries for NLP priority scoring
const HIGH_PRIORITY_KEYWORDS = [
  'urgent', 'asap', 'immediately', 'critical', 'deadline', 'today', 'emergency',
  'exam', 'test', 'interview', 'client', 'presentation', 'deploy', 'launch',
  'security', 'bug', 'fix', 'error', 'boss', 'payment', 'tax', 'invoice'
];

const LOW_PRIORITY_KEYWORDS = [
  'maybe', 'someday', 'eventually', 'optional', 'casual', 'browse', 'watch',
  'look into', 'read later', 'explore', 'idea', 'wishlist', 'cleaning'
];

// Curated templates for smart task breakdown
const SUBTASK_TEMPLATES = [
  {
    triggers: ['presentation', 'slide', 'pitch', 'deck', 'talk'],
    subtasks: [
      'Outline key talking points & narrative arc',
      'Collect supporting data, charts, and case studies',
      'Design clean slide deck with visual hierarchy',
      'Run rehearsal timing and speaking practice'
    ]
  },
  {
    triggers: ['interview', 'job', 'resume', 'cv', 'application'],
    subtasks: [
      'Tailor resume and portfolio to role requirements',
      'Research company culture, recent news, and tech stack',
      'Prepare STAR-method answers for behavioral questions',
      'Draft thoughtful questions for the interviewers'
    ]
  },
  {
    triggers: ['website', 'app', 'feature', 'code', 'develop', 'project', 'backend', 'frontend'],
    subtasks: [
      'Define scope and technical architecture specifications',
      'Set up database schema and API endpoints',
      'Implement core UI components and interaction states',
      'Run end-to-end testing and deploy to staging'
    ]
  },
  {
    triggers: ['exam', 'study', 'test', 'course', 'learn', 'revision'],
    subtasks: [
      'Review syllabus notes and highlight key definitions',
      'Solve 5 past practice problems / mock questions',
      'Summarize challenging concepts into active recall flashcards',
      'Final revision review of high-yield topics'
    ]
  },
  {
    triggers: ['trip', 'travel', 'vacation', 'flight', 'hotel'],
    subtasks: [
      'Confirm flight bookings and hotel reservation details',
      'Create packing list and prepare travel essentials',
      'Map out daily itinerary and local dining spots',
      'Download offline navigation maps and documents'
    ]
  },
  {
    triggers: ['gym', 'workout', 'fitness', 'health', 'run', 'marathon'],
    subtasks: [
      'Dynamic stretching and 5-min mobility warmup',
      'Main compound strength or endurance circuit',
      'Core conditioning and cool-down stretches',
      'Hydrate with electrolytes and log progress'
    ]
  },
  {
    triggers: ['clean', 'declutter', 'room', 'apartment', 'house', 'desk'],
    subtasks: [
      'Organize desk surface and manage loose cables',
      'Wipe down monitors and dusting surfaces',
      'Sort laundry and put away miscellaneous items',
      'Empty waste bins and aerate workspace'
    ]
  },
  {
    triggers: ['article', 'blog', 'write', 'essay', 'report', 'paper'],
    subtasks: [
      'Conduct background research and gather references',
      'Draft rough outline with key section headers',
      'Write first flow draft without self-editing',
      'Proofread for clarity, tone, and grammar'
    ]
  }
];

export function predictPriority(text) {
  if (!text) return 'medium';
  const lower = text.toLowerCase();

  for (const kw of HIGH_PRIORITY_KEYWORDS) {
    if (lower.includes(kw)) return 'high';
  }

  for (const kw of LOW_PRIORITY_KEYWORDS) {
    if (lower.includes(kw)) return 'low';
  }

  return 'medium';
}

export function generateSmartSubtasks(taskTitle) {
  if (!taskTitle) return [];
  const lower = taskTitle.toLowerCase();

  for (const template of SUBTASK_TEMPLATES) {
    if (template.triggers.some(t => lower.includes(t))) {
      return template.subtasks.map(title => ({
        id: crypto.randomUUID(),
        title,
        completed: false
      }));
    }
  }

  // General fallback breakdown
  return [
    { id: crypto.randomUUID(), title: `Clarify requirements for "${taskTitle}"`, completed: false },
    { id: crypto.randomUUID(), title: `Draft initial action steps and resources`, completed: false },
    { id: crypto.randomUUID(), title: `Execute core work session (25-min Pomodoro)`, completed: false },
    { id: crypto.randomUUID(), title: `Review final outcome and verify completion`, completed: false }
  ];
}

export function generateProductivityInsights(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const highPriorityPending = tasks.filter(t => !t.completed && t.priority === 'high').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const insights = [];

  if (total === 0) {
    insights.push({
      type: 'tip',
      icon: 'sparkles',
      title: 'Ready for High Output',
      message: 'Add your top 3 daily priorities to set a clear direction for today.'
    });
    return insights;
  }

  if (completionRate >= 80) {
    insights.push({
      type: 'success',
      icon: 'award',
      title: 'Peak Productivity',
      message: `Outstanding! You have completed ${completionRate}% of your tasks. Keep this momentum going.`
    });
  } else if (highPriorityPending >= 3) {
    insights.push({
      type: 'warning',
      icon: 'alert',
      title: 'High Priority Concentration',
      message: `You have ${highPriorityPending} high-priority tasks pending. Consider focusing on the single most critical one first.`
    });
  } else if (pending > 8) {
    insights.push({
      type: 'tip',
      icon: 'zap',
      title: 'Batch Your Work',
      message: 'Try grouping small administrative tasks together in a single 30-minute power block.'
    });
  } else {
    insights.push({
      type: 'tip',
      icon: 'sparkles',
      title: 'Balanced Schedule',
      message: 'Your workload is well-paced. Tackle your hardest task during your peak energy hours.'
    });
  }

  return insights;
}

export const AI_TASK_SUGGESTIONS = [
  { title: 'Conduct weekly priority audit and inbox zero', category: 'Work', priority: 'medium' },
  { title: 'Hydrate: Drink 8 glasses of water throughout the day', category: 'Health', priority: 'low' },
  { title: 'Review open pull requests and code refactoring tasks', category: 'Development', priority: 'high' },
  { title: 'Read 15 pages of technical book or paper', category: 'Study', priority: 'medium' },
  { title: '30-minute mindful focus block without phone or notifications', category: 'Personal', priority: 'medium' }
];

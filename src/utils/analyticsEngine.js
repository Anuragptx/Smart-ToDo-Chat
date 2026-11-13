/**
 * Real-time Data-Driven Analytics Engine for Things To Do
 * 
 * Provides pure, zero-fake data calculations for:
 * - Weekly Completion Cadence (Monday to Sunday)
 * - Tasks Completed Today & This Week
 * - Daily Velocity Trends & Comparison vs Yesterday
 * - Real Productivity Streak Tracking
 * - Most Productive Day Calculation
 * - Completion vs Pending Ratio
 * - Historical Completion Records
 */

/**
 * Returns formatted YYYY-MM-DD in local time
 */
export function getLocalDateKey(dateInput) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const date = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
}

/**
 * Returns Monday 00:00:00 of the current calendar week
 */
export function getMondayOfCurrentWeek(referenceDate = new Date()) {
  const d = new Date(referenceDate);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  // In ISO week, Monday is day 1. If Sunday (0), Monday was 6 days ago (-6). Otherwise (1 - day).
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Generates the 7 days of the current week (Monday to Sunday)
 */
export function getDaysOfCurrentWeek(referenceDate = new Date()) {
  const monday = getMondayOfCurrentWeek(referenceDate);
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const days = [];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const isDayToday = (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
    const isFuture = d.getTime() > today.getTime();

    const dateKey = getLocalDateKey(d);

    days.push({
      index: i,
      shortLabel: dayNames[i],
      fullLabel: fullDayNames[i],
      date: d,
      dateKey,
      formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isToday: isDayToday,
      isFuture: isFuture,
      completedTasks: [],
      count: 0
    });
  }

  return days;
}

/**
 * Calculates genuine productivity streak based on actual completed task dates.
 * A streak is active if a task was completed today, or completed yesterday.
 */
export function calculateProductivityStreak(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) return 0;

  // Collect unique dates where at least one task was completed
  const completedDateSet = new Set();
  tasks.forEach(t => {
    if (t.completed) {
      const key = getLocalDateKey(t.completedAt || t.createdAt);
      if (key) completedDateSet.add(key);
    }
  });

  if (completedDateSet.size === 0) return 0;

  const today = new Date();
  const todayKey = getLocalDateKey(today);

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = getLocalDateKey(yesterday);

  let streak;
  let checkDate = new Date();

  // If completed today, start counting from today backwards
  if (completedDateSet.has(todayKey)) {
    streak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (completedDateSet.has(yesterdayKey)) {
    // If not completed today yet, but completed yesterday, streak is still active
    streak = 1;
    checkDate.setDate(checkDate.getDate() - 2);
  } else {
    // Neither today nor yesterday had any completed task
    return 0;
  }

  // Continue checking consecutive prior days
  while (true) {
    const key = getLocalDateKey(checkDate);
    if (completedDateSet.has(key)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Main analytics computation function.
 * Pure function: takes current `tasks` and generates 100% data-driven metrics.
 */
export function computeTaskAnalytics(tasks = [], referenceDate = new Date()) {
  const allTasks = Array.isArray(tasks) ? tasks : [];
  const total = allTasks.length;
  const completedTasks = allTasks.filter(t => t.completed);
  const pendingTasks = allTasks.filter(t => !t.completed);

  const completedTotal = completedTasks.length;
  const pendingTotal = pendingTasks.length;

  const today = new Date(referenceDate);
  const todayKey = getLocalDateKey(today);

  const yesterday = new Date(referenceDate);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = getLocalDateKey(yesterday);

  // 1. Current Week Days (Mon to Sun)
  const weekDays = getDaysOfCurrentWeek(referenceDate);
  const sundayDate = weekDays[6].date;
  sundayDate.setHours(23, 59, 59, 999);

  // Map each completed task to its day in the current week
  let completedThisWeekCount = 0;

  weekDays.forEach(day => {
    const tasksOnThisDay = completedTasks.filter(t => {
      const taskDateKey = getLocalDateKey(t.completedAt || t.createdAt);
      return taskDateKey === day.dateKey;
    });

    day.completedTasks = tasksOnThisDay;
    day.count = tasksOnThisDay.length;
    completedThisWeekCount += day.count;
  });

  // Calculate y-axis maximum with clean scale
  const maxDayCount = Math.max(0, ...weekDays.map(d => d.count));
  // Provide neat stepping: minimum scale 4 so empty days look clean
  const yAxisMax = Math.max(4, maxDayCount);

  // 2. Completed Today & Yesterday
  const todayDayObj = weekDays.find(d => d.isToday);
  const completedTodayCount = todayDayObj ? todayDayObj.count : (
    completedTasks.filter(t => getLocalDateKey(t.completedAt || t.createdAt) === todayKey).length
  );

  const completedYesterdayCount = completedTasks.filter(t => 
    getLocalDateKey(t.completedAt || t.createdAt) === yesterdayKey
  ).length;

  // 3. Daily Completion Trend
  const trendDiff = completedTodayCount - completedYesterdayCount;
  let trendDirection;
  let trendLabel;

  if (completedTodayCount === 0 && completedYesterdayCount === 0) {
    trendDirection = 'none';
    trendLabel = 'No completions yet today';
  } else if (trendDiff > 0) {
    trendDirection = 'up';
    trendLabel = `+${trendDiff} vs yesterday`;
  } else if (trendDiff < 0) {
    trendDirection = 'down';
    trendLabel = `${trendDiff} vs yesterday`;
  } else {
    trendDirection = 'steady';
    trendLabel = `Even with yesterday (${completedTodayCount} tasks)`;
  }

  // 4. Elapsed Days this week (for average daily completion calculation)
  // Monday is index 0. If today is Wednesday (index 2), elapsed = 3 days.
  const todayIndex = weekDays.findIndex(d => d.isToday);
  const daysElapsed = todayIndex >= 0 ? todayIndex + 1 : 1;
  const averagePerDay = (completedThisWeekCount / Math.max(1, daysElapsed)).toFixed(1);

  // 5. Most Productive Day of the week
  let mostProductiveDay = {
    hasData: false,
    dayName: 'None yet',
    count: 0,
    formattedDate: '',
    display: 'No completions this week'
  };

  if (maxDayCount > 0) {
    const bestDay = weekDays.reduce((max, curr) => curr.count > max.count ? curr : max, weekDays[0]);
    mostProductiveDay = {
      hasData: true,
      dayName: bestDay.fullLabel,
      count: bestDay.count,
      formattedDate: bestDay.formattedDate,
      display: `${bestDay.fullLabel} (${bestDay.count} task${bestDay.count === 1 ? '' : 's'})`
    };
  }

  // 6. Productivity Streak
  const streakDays = calculateProductivityStreak(allTasks);

  // 7. Weekly Completion Rate (%)
  // Relevant tasks for the week: tasks completed this week + tasks pending due this week
  const mondayKey = weekDays[0].dateKey;
  const sundayKey = weekDays[6].dateKey;
  
  const pendingDueThisWeek = pendingTasks.filter(t => {
    if (!t.dueDate) return false;
    return t.dueDate >= mondayKey && t.dueDate <= sundayKey;
  }).length;

  const totalThisWeek = completedThisWeekCount + pendingDueThisWeek;
  const weeklyCompletionRate = totalThisWeek > 0 
    ? Math.round((completedThisWeekCount / totalThisWeek) * 100)
    : (total > 0 ? Math.round((completedTotal / total) * 100) : 0);

  const overallCompletionRate = total > 0 ? Math.round((completedTotal / total) * 100) : 0;

  // 8. Completion vs Pending Ratio
  let ratioDisplay = '0 : 0';
  let ratioNumber = 0;
  if (pendingTotal === 0 && completedTotal > 0) {
    ratioDisplay = `${completedTotal} : 0 (100% Complete)`;
    ratioNumber = completedTotal;
  } else if (completedTotal === 0 && pendingTotal > 0) {
    ratioDisplay = `0 : ${pendingTotal} (All Pending)`;
    ratioNumber = 0;
  } else if (pendingTotal > 0) {
    const r = (completedTotal / pendingTotal).toFixed(1);
    ratioNumber = parseFloat(r);
    ratioDisplay = `${completedTotal} : ${pendingTotal} (${r} : 1)`;
  }

  // 9. Historical Completion Log (Recent 8 completed tasks)
  const recentCompletions = [...completedTasks]
    .sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt))
    .slice(0, 8);

  // Week range label e.g. "Nov 10 – Nov 16"
  const startMonth = weekDays[0].date.toLocaleDateString('en-US', { month: 'short' });
  const startDay = weekDays[0].date.getDate();
  const endMonth = weekDays[6].date.toLocaleDateString('en-US', { month: 'short' });
  const endDay = weekDays[6].date.getDate();
  const weekRangeLabel = startMonth === endMonth 
    ? `${startMonth} ${startDay} – ${endDay}, ${weekDays[6].date.getFullYear()}`
    : `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${weekDays[6].date.getFullYear()}`;

  return {
    weekDays,
    maxDayCount,
    yAxisMax,
    completedTodayCount,
    completedYesterdayCount,
    completedThisWeekCount,
    averagePerDay,
    trendDiff,
    trendDirection,
    trendLabel,
    mostProductiveDay,
    streakDays,
    weeklyCompletionRate,
    overallCompletionRate,
    completedTotal,
    pendingTotal,
    total,
    ratioDisplay,
    ratioNumber,
    recentCompletions,
    weekRangeLabel
  };
}

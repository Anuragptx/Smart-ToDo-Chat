import { useMemo, useState } from 'react';
import {
  CheckCheckIcon,
  AlertCircleIcon,
  SparklesIcon,
  AwardIcon,
  ZapIcon,
  LayersIcon,
  EditIcon,
  CalendarIcon,
  CheckIcon,
  BarChartIcon,
  PlusIcon
} from './Icons';
import { computeTaskAnalytics } from '../utils/analyticsEngine';
import { generateProductivityInsights } from '../services/aiService';
import { formatCompletionTimestamp } from '../utils/dateUtils';
import { getInitials, getProfileCompletion } from '../utils/userUtils';

export default function AnalyticsView({ 
  tasks = [], 
  categories = [], 
  user, 
  onOpenProfile,
  onNavigateView,
  onOpenNewTask
}) {
  const [showEmptyGridPreview, setShowEmptyGridPreview] = useState(false);

  // Pure, real-time analytics computed directly from the single source of truth (tasks)
  const analytics = useMemo(() => computeTaskAnalytics(tasks), [tasks]);

  const {
    weekDays,
    yAxisMax,
    completedTodayCount,
    completedThisWeekCount,
    averagePerDay,
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
    recentCompletions,
    weekRangeLabel
  } = analytics;

  // Priority counts
  const highPriority = tasks.filter(t => t.priority === 'high').length;
  const medPriority = tasks.filter(t => t.priority === 'medium').length;
  const lowPriority = tasks.filter(t => t.priority === 'low').length;

  // AI Insights driven by real task data & analytics metrics
  const insights = useMemo(() => {
    return generateProductivityInsights(tasks, analytics);
  }, [tasks, analytics]);

  // Helper for category color lookup
  const getCategoryColor = (catName) => {
    const found = categories.find(c => c.name === catName);
    return found ? found.color : '#6366f1';
  };

  return (
    <div className="analytics-view-container">
      {/* Top Welcome & Identity Banner */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-left-col">
          <div className="welcome-avatar-wrap">
            {user?.avatarImage ? (
              <img src={user.avatarImage} alt={user?.name || "User"} className="welcome-avatar-img" />
            ) : (
              <div className="welcome-avatar-initials">{getInitials(user?.name || 'User')}</div>
            )}
          </div>
          <div className="welcome-text-col">
            <h3 className="welcome-title">
              Welcome back, {user?.name && user.name.trim() ? user.name.trim() : 'User'} 👋
            </h3>
            <p className="welcome-subtext">
              {user?.bio || "Live productivity telemetry and real-time task completion cadence."}
            </p>
          </div>
        </div>

        <div className="welcome-profile-status">
          <div className="profile-strength-pill" onClick={onOpenProfile} title="Click to view & edit your profile">
            <div className="strength-meter-wrap">
              <span className="strength-label">Profile Strength</span>
              <span className="strength-val">{getProfileCompletion(user)}%</span>
            </div>
            <div className="strength-track">
              <div 
                className={`strength-fill ${getProfileCompletion(user) === 100 ? 'complete' : ''}`} 
                style={{ width: `${getProfileCompletion(user)}%` }} 
              />
            </div>
            <button type="button" className="edit-profile-pill-btn">
              <EditIcon size={12} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Zero Completion Callout Banner if user hasn't completed any task */}
      {completedTotal === 0 && (
        <div className="zero-completions-callout-banner">
          <div className="zero-callout-icon-wrap">
            <SparklesIcon size={20} className="text-cyan" />
          </div>
          <div className="zero-callout-text-wrap">
            <h4 className="zero-callout-title">No Tasks Completed Yet</h4>
            <p className="zero-callout-sub">
              Your analytics dashboard is active and tracking your workspace in real time. Complete any task to unlock your productivity streak, daily velocity, and weekly completion cadence.
            </p>
          </div>
          {onNavigateView && (
            <button 
              type="button" 
              className="btn-zero-callout-action" 
              onClick={() => onNavigateView('all')}
            >
              <CheckCheckIcon size={14} /> Start Working
            </button>
          )}
        </div>
      )}

      {/* Top 4 Primary Core KPI Cards */}
      <div className="analytics-kpi-grid">
        {/* Total Tasks */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL WORKLOAD</span>
            <div className="kpi-icon-wrap indigo">
              <LayersIcon size={16} />
            </div>
          </div>
          <div className="kpi-value">{total}</div>
          <span className="kpi-subtext">
            {completedTotal} completed • {pendingTotal} pending
          </span>
        </div>

        {/* Tasks Completed Today */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">COMPLETED TODAY</span>
            <div className="kpi-icon-wrap emerald">
              <CheckCheckIcon size={16} />
            </div>
          </div>
          <div className="kpi-value text-emerald">{completedTodayCount}</div>
          <div className="kpi-subtext-trend">
            <span className={`trend-indicator ${trendDirection}`}>
              {trendDirection === 'up' && '↗'}
              {trendDirection === 'down' && '↘'}
              {trendDirection === 'steady' && '➔'}
              {trendDirection === 'none' && '•'} {trendLabel}
            </span>
          </div>
        </div>

        {/* Tasks Completed This Week */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">COMPLETED THIS WEEK</span>
            <div className="kpi-icon-wrap cyan">
              <CalendarIcon size={16} />
            </div>
          </div>
          <div className="kpi-value text-cyan">{completedThisWeekCount}</div>
          <span className="kpi-subtext">
            {weeklyCompletionRate}% weekly completion rate
          </span>
        </div>

        {/* Real Productivity Streak */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">PRODUCTIVITY STREAK</span>
            <div className="kpi-icon-wrap amber">
              <ZapIcon size={16} />
            </div>
          </div>
          <div className="kpi-value text-amber">
            🔥 {streakDays} {streakDays === 1 ? 'Day' : 'Days'}
          </div>
          <span className="kpi-subtext">
            {streakDays > 0 ? 'Consecutive daily activity' : 'Complete a task today to start!'}
          </span>
        </div>
      </div>

      {/* Secondary Productivity Intelligence Grid */}
      <div className="analytics-intelligence-grid">
        {/* Weekly Completion Rate */}
        <div className="intel-card">
          <div className="intel-card-top">
            <span className="intel-label">Weekly Completion Rate</span>
            <span className="intel-val-highlight text-cyan">{weeklyCompletionRate}%</span>
          </div>
          <div className="intel-progress-track">
            <div 
              className="intel-progress-fill cyan" 
              style={{ width: `${weeklyCompletionRate}%` }} 
            />
          </div>
          <span className="intel-desc">
            {completedThisWeekCount > 0 
              ? `${completedThisWeekCount} completed vs targets this week` 
              : 'No completed tasks recorded this week'}
          </span>
        </div>

        {/* Daily Completion Trend */}
        <div className="intel-card">
          <div className="intel-card-top">
            <span className="intel-label">Daily Completion Trend</span>
            <span className={`intel-status-pill ${trendDirection}`}>
              {trendDirection === 'up' && '↗ Upward Velocity'}
              {trendDirection === 'down' && '↘ Reduced'}
              {trendDirection === 'steady' && '➔ Steady Pace'}
              {trendDirection === 'none' && '• Awaiting Action'}
            </span>
          </div>
          <div className="intel-trend-body">
            <span className="intel-trend-text">{trendLabel}</span>
            <span className="intel-meta-note">
              {completedThisWeekCount > 0 
                ? `Avg: ${averagePerDay} tasks/day this week` 
                : 'Awaiting task activity'}
            </span>
          </div>
        </div>

        {/* Most Productive Day */}
        <div className="intel-card">
          <div className="intel-card-top">
            <span className="intel-label">Most Productive Day</span>
            <AwardIcon size={16} className="text-amber" />
          </div>
          <div className="intel-lead-val">
            {mostProductiveDay.hasData ? (
              <>
                <strong className="text-primary">{mostProductiveDay.dayName}</strong>
                <span className="intel-badge-count">{mostProductiveDay.count} tasks</span>
              </>
            ) : (
              <span className="text-muted">No completions this week</span>
            )}
          </div>
          <span className="intel-desc">
            {mostProductiveDay.hasData ? `Highest velocity on ${mostProductiveDay.formattedDate}` : 'Complete tasks to establish cadence'}
          </span>
        </div>

        {/* Completion vs Pending Ratio */}
        <div className="intel-card">
          <div className="intel-card-top">
            <span className="intel-label">Completed vs Pending Ratio</span>
            <span className="intel-val-highlight text-indigo">
              {total > 0 ? `${overallCompletionRate}%` : '0%'}
            </span>
          </div>
          <div className="ratio-split-track">
            <div 
              className="split-fill completed" 
              style={{ width: `${total > 0 ? (completedTotal / total) * 100 : 0}%` }}
              title={`Completed: ${completedTotal}`}
            />
            <div 
              className="split-fill pending" 
              style={{ width: `${total > 0 ? (pendingTotal / total) * 100 : 0}%` }}
              title={`Pending: ${pendingTotal}`}
            />
          </div>
          <span className="intel-desc">
            {ratioDisplay}
          </span>
        </div>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="analytics-charts-row">
        {/* Weekly Completion Cadence Bar Chart (Monday to Sunday) */}
        <div className="dashboard-widget-card weekly-chart-widget">
          <div className="widget-header">
            <div>
              <h4 className="widget-title">Weekly Completion Cadence</h4>
              <span className="widget-subtitle">Actual tasks completed from Monday to Sunday</span>
            </div>
            <div className="widget-header-badges">
              <span className="widget-badge range-badge">{weekRangeLabel}</span>
              {completedThisWeekCount > 0 ? (
                <span className="widget-badge live-data-badge">
                  <span className="live-dot" /> Real Data
                </span>
              ) : (
                <span className="widget-badge awaiting-data-badge">
                  0 Completions This Week
                </span>
              )}
            </div>
          </div>

          {/* If no completed tasks yet this week and not previewing grid, display "No Analytics Data Yet" empty state */}
          {completedThisWeekCount === 0 && !showEmptyGridPreview ? (
            <div className="no-analytics-chart-empty-state">
              <div className="analytics-empty-orb">
                <BarChartIcon size={32} className="text-indigo" />
              </div>
              <span className="analytics-empty-badge">AWAITING TASK COMPLETIONS</span>
              <h4 className="analytics-empty-title">No Analytics Data Yet</h4>
              <p className="analytics-empty-desc">
                {total === 0 
                  ? "You have not added any tasks to your workspace yet. Create tasks and check them off to generate your real-time weekly cadence and velocity metrics."
                  : "You haven't completed any tasks for the current week yet. Mark tasks as complete in your workspace to unlock your real-time weekly completion cadence and productivity trends."}
              </p>
              <div className="analytics-empty-actions">
                {onNavigateView && (
                  <button 
                    type="button" 
                    className="btn-empty-primary" 
                    onClick={() => onNavigateView('all')}
                  >
                    <CheckCheckIcon size={14} />
                    <span>View Pending Tasks ({pendingTotal})</span>
                  </button>
                )}
                {onOpenNewTask && (
                  <button 
                    type="button" 
                    className="btn-empty-ghost" 
                    onClick={onOpenNewTask}
                  >
                    <PlusIcon size={14} />
                    <span>Create New Task</span>
                  </button>
                )}
                <button
                  type="button"
                  className="btn-toggle-grid-preview"
                  onClick={() => setShowEmptyGridPreview(true)}
                  title="Inspect the Monday to Sunday weekly grid layout"
                >
                  Preview Week Grid
                </button>
              </div>
            </div>
          ) : (
            <>
              {completedThisWeekCount === 0 && showEmptyGridPreview && (
                <div className="empty-grid-preview-banner">
                  <span>Previewing Monday–Sunday baseline grid (All values 0)</span>
                  <button 
                    type="button" 
                    className="btn-close-preview" 
                    onClick={() => setShowEmptyGridPreview(false)}
                  >
                    Back to Empty State
                  </button>
                </div>
              )}

              {/* Bar Chart Visual with Monday to Sunday data */}
              <div className="bar-chart-visual-wrapper">
                {/* Y-Axis Reference Guidelines */}
                <div className="chart-y-axis-guides">
                  <div className="y-guide-line" style={{ bottom: '100%' }}>
                    <span className="y-guide-label">{yAxisMax}</span>
                  </div>
                  <div className="y-guide-line" style={{ bottom: '75%' }}>
                    <span className="y-guide-label">{Math.round(yAxisMax * 0.75)}</span>
                  </div>
                  <div className="y-guide-line" style={{ bottom: '50%' }}>
                    <span className="y-guide-label">{Math.round(yAxisMax * 0.5)}</span>
                  </div>
                  <div className="y-guide-line" style={{ bottom: '25%' }}>
                    <span className="y-guide-label">{Math.round(yAxisMax * 0.25)}</span>
                  </div>
                  <div className="y-guide-line" style={{ bottom: '0%' }}>
                    <span className="y-guide-label">0</span>
                  </div>
                </div>

                {/* 7 Daily Bars: Monday to Sunday */}
                <div className="bar-chart-visual">
                  {weekDays.map((day) => {
                    const heightPercent = day.count > 0 ? Math.round((day.count / yAxisMax) * 100) : 0;
                    return (
                      <div 
                        key={day.index} 
                        className={`chart-bar-column ${day.isToday ? 'is-today-column' : ''} ${day.isFuture ? 'is-future-column' : ''}`}
                      >
                        {/* Hover Detail Tooltip */}
                        <div className="bar-tooltip">
                          <div className="tooltip-header">
                            <strong>{day.fullLabel}</strong> • {day.formattedDate}
                            {day.isToday && <span className="tooltip-today-tag">TODAY</span>}
                          </div>
                          <div className="tooltip-count">
                            {day.count} {day.count === 1 ? 'task' : 'tasks'} completed
                          </div>
                          {day.completedTasks.length > 0 ? (
                            <div className="tooltip-tasks-list">
                              {day.completedTasks.slice(0, 3).map(t => (
                                <div key={t.id} className="tooltip-task-item">
                                  ✓ {t.title}
                                </div>
                              ))}
                              {day.completedTasks.length > 3 && (
                                <div className="tooltip-more-note">
                                  +{day.completedTasks.length - 3} more
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="tooltip-empty-note">
                              {day.isFuture ? 'Upcoming day' : 'Zero completions recorded'}
                            </div>
                          )}
                        </div>

                        {/* Numeric Count on top of bar */}
                        <span className={`bar-top-value ${day.count > 0 ? 'has-completions' : 'zero-val'} ${day.isToday ? 'text-cyan' : ''}`}>
                          {day.count}
                        </span>

                        {/* Bar Track & Fill */}
                        <div className="bar-track">
                          <div 
                            className={`bar-fill ${day.isToday ? 'today-bar' : ''} ${day.count === 0 ? 'empty-bar' : ''}`}
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>

                        {/* Day & Date Labels */}
                        <div className="bar-label-group">
                          <span className={`bar-day-label ${day.isToday ? 'active-day' : ''}`}>
                            {day.shortLabel}
                          </span>
                          <span className="bar-subdate-label">
                            {day.formattedDate.split(' ')[1]}
                          </span>
                          {day.isToday && (
                            <span className="today-chip">TODAY</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Metadata */}
              <div className="chart-footer-meta">
                <span className="meta-item">
                  <span className="dot dot-indigo"></span> Completed Tasks (Real History)
                </span>
                <span className="meta-item">
                  Week Total: <strong>{completedThisWeekCount} tasks</strong>
                </span>
                <span className="meta-item">
                  Average: <strong>{averagePerDay} tasks/day</strong>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Priority & Category Balance Widget */}
        <div className="dashboard-widget-card priority-breakdown-widget">
          <div className="widget-header">
            <div>
              <h4 className="widget-title">Priority & Category Balance</h4>
              <span className="widget-subtitle">Real workload distribution across registries</span>
            </div>
          </div>

          <div className="priority-bars-stack">
            <div className="breakdown-bar-item">
              <div className="bar-info-row">
                <span className="bar-name">🔴 High Priority</span>
                <span className="bar-val">{highPriority} {highPriority === 1 ? 'task' : 'tasks'} ({total > 0 ? Math.round((highPriority / total) * 100) : 0}%)</span>
              </div>
              <div className="track-bg">
                <div 
                  className="fill-bar red" 
                  style={{ width: `${total > 0 ? (highPriority / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="breakdown-bar-item">
              <div className="bar-info-row">
                <span className="bar-name">🟡 Medium Priority</span>
                <span className="bar-val">{medPriority} {medPriority === 1 ? 'task' : 'tasks'} ({total > 0 ? Math.round((medPriority / total) * 100) : 0}%)</span>
              </div>
              <div className="track-bg">
                <div 
                  className="fill-bar amber" 
                  style={{ width: `${total > 0 ? (medPriority / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="breakdown-bar-item">
              <div className="bar-info-row">
                <span className="bar-name">🟢 Low Priority</span>
                <span className="bar-val">{lowPriority} {lowPriority === 1 ? 'task' : 'tasks'} ({total > 0 ? Math.round((lowPriority / total) * 100) : 0}%)</span>
              </div>
              <div className="track-bg">
                <div 
                  className="fill-bar emerald" 
                  style={{ width: `${total > 0 ? (lowPriority / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Category Breakdown Chips */}
          <div className="category-pills-breakdown">
            {categories.map((c) => {
              const cCount = tasks.filter(t => t.category === c.name).length;
              return (
                <div key={c.id} className="cat-metric-chip">
                  <span className="chip-dot" style={{ backgroundColor: c.color }} />
                  <span className="chip-name">{c.name}:</span>
                  <span className="chip-num">{cCount}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Historical Completion Records Section */}
      <div className="dashboard-widget-card completion-history-widget">
        <div className="widget-header">
          <div className="history-title-wrap">
            <CheckCheckIcon size={18} className="text-emerald" />
            <div>
              <h4 className="widget-title">Recent Completion History</h4>
              <span className="widget-subtitle">Verified task completion records from application storage</span>
            </div>
          </div>
          <span className="widget-badge">{recentCompletions.length} Recent Records</span>
        </div>

        {recentCompletions.length > 0 ? (
          <div className="history-records-list">
            {recentCompletions.map(task => {
              const catColor = getCategoryColor(task.category);
              return (
                <div key={task.id} className="history-record-row">
                  <div className="history-record-left">
                    <div className="history-check-circle">
                      <CheckIcon size={13} />
                    </div>
                    <div className="history-task-details">
                      <span className="history-task-title">{task.title}</span>
                      <div className="history-task-meta">
                        <span 
                          className="history-cat-badge"
                          style={{ 
                            backgroundColor: `${catColor}15`, 
                            color: catColor,
                            borderColor: `${catColor}35`
                          }}
                        >
                          {task.category || 'Work'}
                        </span>
                        <span className={`history-priority-tag ${task.priority || 'medium'}`}>
                          {task.priority === 'high' && '🔴 High'}
                          {task.priority === 'medium' && '🟡 Medium'}
                          {task.priority === 'low' && '🟢 Low'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="history-record-right">
                    <span className="history-completed-time">
                      ✓ {formatCompletionTimestamp(task.completedAt || task.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="history-empty-state">
            <div className="history-empty-icon">
              <CheckCheckIcon size={24} className="text-muted" />
            </div>
            <p className="history-empty-text">
              No completed tasks recorded in history yet.
            </p>
            <span className="history-empty-sub">
              Check off tasks from your workspace to automatically build your real completion timeline.
            </span>
          </div>
        )}
      </div>

      {/* AI Productivity Advisor Card */}
      <div className="dashboard-widget-card ai-insights-widget">
        <div className="widget-header">
          <div className="ai-title-wrap">
            <SparklesIcon size={18} className="text-indigo" />
            <div>
              <h4 className="widget-title">AI Productivity Advisor</h4>
              <span className="widget-subtitle">Actionable suggestions generated from your real task patterns</span>
            </div>
          </div>
          <span className="ai-live-badge">REAL-TIME TELEMETRY</span>
        </div>

        <div className="insights-cards-grid">
          {insights.map((ins, i) => (
            <div key={i} className={`insight-card-item ${ins.type}`}>
              <div className="insight-icon-column">
                {ins.icon === 'award' && <AwardIcon size={20} className="text-emerald" />}
                {ins.icon === 'alert' && <AlertCircleIcon size={20} className="text-amber" />}
                {ins.icon === 'zap' && <ZapIcon size={20} className="text-cyan" />}
                {ins.icon === 'sparkles' && <SparklesIcon size={20} className="text-indigo" />}
              </div>
              <div className="insight-body">
                <h5 className="insight-card-title">{ins.title}</h5>
                <p className="insight-card-desc">{ins.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

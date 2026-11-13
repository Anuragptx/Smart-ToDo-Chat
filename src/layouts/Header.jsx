import { useState, useRef, useEffect } from 'react';
import {
  SearchIcon,
  PlusIcon,
  TrashIcon,
  ArrowUpDownIcon,
  CheckIcon,
  FilterIcon,
  ClockIcon,
  CalendarIcon,
  SparklesIcon
} from '../components/ui/Icons';
import { getTimeGreetingDetails, getInitials } from '../utils/userUtils';

const SORT_OPTIONS = [
  { id: 'dueDate', label: 'Due Date', hint: 'Upcoming deadlines first', icon: '📅' },
  { id: 'priority', label: 'Priority', hint: 'High to Low urgency', icon: '⚡' },
  { id: 'createdAt', label: 'Date Created', hint: 'Recently added first', icon: '🕒' }
];

export default function Header({
  currentView,
  selectedCategory,
  tasksCount,
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  onOpenNewTask,
  onClearCompleted,
  hasCompletedTasks,
  onToggleMobileMenu,
  user,
  onOpenProfile,
  onOpenAiAssistant
}) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Real-time ticking clock (updates every 1000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close custom sort dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    if (isSortOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isSortOpen]);

  const getViewTitle = () => {
    if (selectedCategory) return `${selectedCategory} Tasks`;
    switch (currentView) {
      case 'today': return "Today's Schedule";
      case 'upcoming': return "Upcoming Deadlines";
      case 'completed': return "Completed Archive";
      case 'analytics': return "Productivity Analytics";
      default: return "All Tasks";
    }
  };

  const greetingDetails = getTimeGreetingDetails(currentTime, user?.name);

  const liveTimeString = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const fullDateString = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const currentSortObj = SORT_OPTIONS.find(o => o.id === sortBy) || SORT_OPTIONS[0];

  return (
    <header className="app-header-container">
      {/* Top Navbar Row */}
      <div className="header-top-navbar">
        <div className="header-left-cluster">
          <button 
            className="mobile-hamburger-btn" 
            onClick={onToggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="view-title-group">
            <div className="title-row">
              <h2 className="view-heading">{getViewTitle()}</h2>
              <span className="task-count-pill">{tasksCount} {tasksCount === 1 ? 'task' : 'tasks'}</span>
            </div>
          </div>
        </div>

        {/* Global Instant Search */}
        <div className="header-search-container">
          <div className="search-input-wrapper">
            <SearchIcon size={15} className="search-icon-svg" />
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks, subtasks, categories... (/ or ⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="clear-search-btn" 
                onClick={() => setSearchQuery('')}
                title="Clear search"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
            <span className="search-kbd-hint">⌘K</span>
          </div>
        </div>

        <div className="header-right-actions">
          {/* Priority Filter */}
          <div className="header-filter-wrapper">
            <FilterIcon size={14} className="filter-prefix-icon" />
            <select 
              className="header-filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
          </div>

          {/* Custom Interactive Sort Popover */}
          <div className="interactive-sort-dropdown-container" ref={sortDropdownRef}>
            <button
              type="button"
              className={`btn-interactive-sort-trigger ${isSortOpen ? 'open' : ''} ${sortBy !== 'dueDate' ? 'has-active-sort' : ''}`}
              onClick={() => setIsSortOpen(!isSortOpen)}
              aria-haspopup="true"
              aria-expanded={isSortOpen}
              title="Sort tasks"
            >
              <ArrowUpDownIcon size={14} className="sort-trigger-icon" />
              <span className="sort-trigger-label">
                <span className="sort-prefix">Sort:</span> {currentSortObj.label}
              </span>
              <span className="sort-caret-arrow">▾</span>
            </button>

            {isSortOpen && (
              <div className="interactive-sort-popover" role="menu">
                <div className="sort-popover-header">
                  <span className="popover-title">Sort Tasks By</span>
                </div>
                <div className="sort-options-list">
                  {SORT_OPTIONS.map((opt) => {
                    const isSelected = sortBy === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`sort-option-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setSortBy(opt.id);
                          setIsSortOpen(false);
                        }}
                        role="menuitem"
                      >
                        <span className="sort-opt-icon">{opt.icon}</span>
                        <div className="sort-opt-text">
                          <span className="sort-opt-label">{opt.label}</span>
                          <span className="sort-opt-hint">{opt.hint}</span>
                        </div>
                        {isSelected && (
                          <div className="sort-check-badge">
                            <CheckIcon size={13} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bulk Delete Completed */}
          {hasCompletedTasks && (
            <button 
              className="btn-danger-ghost" 
              onClick={onClearCompleted}
              title="Delete all completed tasks"
            >
              <TrashIcon size={14} />
              <span className="hide-on-mobile">Clear Done</span>
            </button>
          )}

          {/* New Task Primary Button */}
          <button 
            className="btn-primary-gradient" 
            onClick={onOpenNewTask}
            title="Create New Task (N)"
          >
            <PlusIcon size={16} />
            <span>New Task</span>
            <kbd className="btn-kbd-badge">N</kbd>
          </button>

          {/* User Profile Trigger Button */}
          <button
            type="button"
            className="header-profile-btn"
            onClick={onOpenProfile}
            title={`Profile: ${user?.name || 'User'} (Click to view profile)`}
            aria-label="Open Profile Settings"
          >
            {user?.avatarImage ? (
              <img src={user.avatarImage} alt={user?.name || "User"} className="header-avatar-img" />
            ) : (
              <span className="header-avatar-initials">{getInitials(user?.name || 'User')}</span>
            )}
          </button>
        </div>
      </div>

      {/* Dedicated Dashboard Welcome, Date & Live Time Hero Card */}
      <div className="header-greeting-dashboard-card">
        <div className="greeting-card-left">
          <div className="greeting-time-orb" style={{ borderColor: `${greetingDetails.badgeColor}40` }}>
            <span className="time-emoji-glyph">{greetingDetails.icon}</span>
          </div>
          <div className="greeting-text-column">
            <div className="greeting-headline-row">
              <h1 className="greeting-hero-heading">
                {greetingDetails.greeting}, <span className="greeting-user-name">{greetingDetails.displayName}</span> 👋
              </h1>
              <span className="greeting-period-badge" style={{ backgroundColor: `${greetingDetails.badgeColor}18`, color: greetingDetails.badgeColor, borderColor: `${greetingDetails.badgeColor}35` }}>
                {greetingDetails.period}
              </span>
            </div>
            <p className="greeting-hero-subtext">
              {user?.bio && user.bio.trim()
                ? user.bio.trim()
                : "Welcome to your smart productivity workspace. Stay focused, execute seamlessly."}
            </p>
          </div>
        </div>

        {/* Dedicated Live Clock & Calendar Module */}
        <div className="greeting-card-right">
          <div className="live-telemetry-cluster">
            {/* Live Clock Card */}
            <div className="telemetry-box clock-box">
              <div className="telemetry-header">
                <span className="telemetry-beacon-dot" />
                <span className="telemetry-label">LIVE TIME</span>
              </div>
              <div className="telemetry-value clock-value">
                <ClockIcon size={15} className="telemetry-icon text-cyan" />
                <span className="clock-digits-tabular">{liveTimeString}</span>
              </div>
            </div>

            {/* Calendar Date Card */}
            <div className="telemetry-box date-box">
              <div className="telemetry-header">
                <CalendarIcon size={13} className="telemetry-icon text-amber" />
                <span className="telemetry-label">CALENDAR</span>
              </div>
              <div className="telemetry-value date-value">
                <span className="calendar-date-text">{fullDateString}</span>
              </div>
            </div>

            {/* Quick AI Assistant Action Pill */}
            {onOpenAiAssistant && (
              <button 
                type="button" 
                className="telemetry-ai-shortcut-btn"
                onClick={onOpenAiAssistant}
                title="Launch AI Productivity Assistant"
              >
                <SparklesIcon size={14} className="text-purple-animated" />
                <span>AI Assistant</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

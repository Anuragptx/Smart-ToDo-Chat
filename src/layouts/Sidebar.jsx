import {
  LayersIcon,
  CalendarIcon,
  ClockIcon,
  CheckCheckIcon,
  BarChartIcon,
  SparklesIcon,
  SettingsIcon,
  MoonIcon,
  SunIcon,
  KeyboardIcon,
  EditIcon
} from '../components/ui/Icons';
import { isToday, isUpcoming } from '../utils/dateUtils';
import { getInitials } from '../utils/userUtils';
import { calculateProductivityStreak } from '../utils/analyticsEngine';

export default function Sidebar({
  currentView,
  setCurrentView,
  selectedCategory,
  setSelectedCategory,
  categories,
  tasks,
  theme,
  toggleTheme,
  onOpenSettings,
  onOpenProfile,
  onOpenAiAssistant,
  onOpenShortcuts,
  user,
  isOpen,
  onCloseMobile
}) {
  const allCount = tasks.filter(t => !t.completed).length;
  const todayCount = tasks.filter(t => !t.completed && isToday(t.dueDate)).length;
  const upcomingCount = tasks.filter(t => !t.completed && isUpcoming(t.dueDate)).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const realStreak = calculateProductivityStreak(tasks);

  const handleNavClick = (view) => {
    setCurrentView(view);
    setSelectedCategory(null);
    if (onCloseMobile) onCloseMobile();
  };

  const handleCategoryClick = (catName) => {
    setSelectedCategory(selectedCategory === catName ? null : catName);
    if (currentView === 'analytics') {
      setCurrentView('all');
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <span className="brand-logo-glow"></span>
            <CheckCheckIcon size={20} className="brand-svg" />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">Things To Do</h1>
            <span className="brand-subtitle">Smart AI Workspace</span>
          </div>
        </div>

        {/* User Profile Snippet */}
        <div 
          className="user-profile-card clickable" 
          onClick={onOpenProfile}
          title="Click to view & edit your profile"
          role="button"
          tabIndex={0}
        >
          <div className="user-avatar-wrap">
            {user.avatarImage ? (
              <img 
                src={user.avatarImage} 
                alt={user.name || "User Avatar"} 
                className="user-avatar-img"
              />
            ) : (
              <div className="user-avatar">{getInitials(user.name || 'User')}</div>
            )}
          </div>
          <div className="user-info">
            <div className="user-name-row">
              <span className="user-name">{user.name && user.name.trim() ? user.name.trim() : 'User'}</span>
              <span className="streak-badge" title="Consecutive daily productivity streak based on completed tasks">
                🔥 {realStreak}d
              </span>
            </div>
            <span className="user-role">{user.bio || user.role || 'Productivity Enthusiast'}</span>
          </div>
          <button 
            type="button" 
            className="edit-profile-icon-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onOpenProfile();
            }}
            title="Edit profile name, photo & bio"
            aria-label="Edit Profile"
          >
            <EditIcon size={13} />
          </button>
        </div>

        {/* Main Navigation Views */}
        <div className="sidebar-section">
          <span className="section-label">WORKSPACES</span>
          <nav className="nav-list">
            <button
              className={`nav-item ${currentView === 'all' && !selectedCategory ? 'active' : ''}`}
              onClick={() => handleNavClick('all')}
            >
              <div className="nav-item-left">
                <LayersIcon size={17} className="nav-icon text-indigo" />
                <span className="nav-item-title">All Tasks</span>
              </div>
              <span className="nav-badge">{allCount}</span>
            </button>

            <button
              className={`nav-item ${currentView === 'today' ? 'active' : ''}`}
              onClick={() => handleNavClick('today')}
            >
              <div className="nav-item-left">
                <CalendarIcon size={17} className="nav-icon text-cyan" />
                <span className="nav-item-title">Today</span>
              </div>
              {todayCount > 0 && <span className="nav-badge highlight">{todayCount}</span>}
            </button>

            <button
              className={`nav-item ${currentView === 'upcoming' ? 'active' : ''}`}
              onClick={() => handleNavClick('upcoming')}
            >
              <div className="nav-item-left">
                <ClockIcon size={17} className="nav-icon text-amber" />
                <span className="nav-item-title">Upcoming</span>
              </div>
              {upcomingCount > 0 && <span className="nav-badge">{upcomingCount}</span>}
            </button>

            <button
              className={`nav-item ${currentView === 'completed' ? 'active' : ''}`}
              onClick={() => handleNavClick('completed')}
            >
              <div className="nav-item-left">
                <CheckCheckIcon size={17} className="nav-icon text-emerald" />
                <span className="nav-item-title">Completed</span>
              </div>
              <span className="nav-badge muted">{completedCount}</span>
            </button>

            <button
              className={`nav-item ${currentView === 'analytics' ? 'active' : ''}`}
              onClick={() => handleNavClick('analytics')}
            >
              <div className="nav-item-left">
                <BarChartIcon size={17} className="nav-icon text-indigo" />
                <span className="nav-item-title">Analytics</span>
              </div>
              <span className="nav-chip-live">LIVE</span>
            </button>
          </nav>
        </div>

        {/* Categories Section */}
        <div className="sidebar-section">
          <div className="section-header-flex">
            <span className="section-label">CATEGORIES</span>
          </div>
          <nav className="category-list">
            {categories.map((cat) => {
              const catTasksCount = tasks.filter(t => !t.completed && t.category === cat.name).length;
              const isCatActive = selectedCategory === cat.name;

              return (
                <button
                  key={cat.id}
                  className={`category-item ${isCatActive ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <div className="cat-item-left">
                    <span 
                      className="cat-color-dot" 
                      style={{ backgroundColor: cat.color }} 
                    />
                    <span className="cat-name">{cat.name}</span>
                  </div>
                  {catTasksCount > 0 && <span className="cat-badge">{catTasksCount}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick AI Assistant Interactive Trigger */}
        <div 
          className="sidebar-ai-card interactive-ai-card"
          onClick={onOpenAiAssistant}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenAiAssistant(); }}
          title="Open AI Productivity Assistant (Generate subtasks & ideas)"
        >
          <div className="ai-card-glow-layer" />
          <div className="ai-card-content">
            <div className="ai-icon-bubble-animated">
              <SparklesIcon size={18} className="sparkle-svg-pulse" />
            </div>
            <div className="ai-card-text">
              <div className="ai-card-badge-row">
                <span className="ai-card-title">AI Assistant</span>
                <span className="ai-card-status-pill">
                  <span className="live-dot" />
                  ACTIVE
                </span>
              </div>
              <span className="ai-card-sub">Generate subtasks & smart ideas</span>
            </div>
          </div>
          <div className="ai-card-action-bar">
            <span className="ai-action-text">Launch Assistant</span>
            <span className="ai-action-arrow">→</span>
          </div>
        </div>

        {/* Modern Segmented Dock: Modes, Shortcuts & Settings */}
        <div className="sidebar-footer-dock">
          {/* Mode Switcher */}
          <button 
            type="button"
            className="footer-dock-btn theme-dock-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme Mode"
          >
            <div className="dock-btn-icon-orb">
              {theme === 'dark' ? <SunIcon size={15} className="text-amber-glow" /> : <MoonIcon size={15} className="text-indigo-glow" />}
            </div>
            <span className="dock-btn-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {/* Shortcuts */}
          <button 
            type="button"
            className="footer-dock-btn shortcuts-dock-btn"
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts (?)"
            aria-label="Keyboard Shortcuts"
          >
            <div className="dock-btn-icon-orb">
              <KeyboardIcon size={15} />
            </div>
            <span className="dock-btn-label">Keys</span>
            <kbd className="dock-kbd-mini">?</kbd>
          </button>

          {/* Settings */}
          <button 
            type="button"
            className="footer-dock-btn settings-dock-btn"
            onClick={onOpenSettings}
            title="System Preferences & Workspace Settings"
            aria-label="Settings"
          >
            <div className="dock-btn-icon-orb">
              <SettingsIcon size={15} />
            </div>
            <span className="dock-btn-label">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}

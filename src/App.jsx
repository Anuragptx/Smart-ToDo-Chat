/**
 * Things To Do - Production Smart To-Do Web Application
 * Clean, modular architecture with separation of concerns:
 * Layouts, Hooks, Services, Components, and Modals.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import AppLayout from './layouts/AppLayout';
import Sidebar from './layouts/Sidebar';
import Header from './layouts/Header';
import TaskInput from './components/tasks/TaskInput';
import TaskList from './components/tasks/TaskList';
import AnalyticsView from './components/analytics/AnalyticsView';
import TaskModal from './components/modals/TaskModal';
import AIAssistantModal from './components/modals/AIAssistantModal';
import SettingsModal from './components/modals/SettingsModal';
import ProfileModal from './components/modals/ProfileModal';
import KeyboardShortcutsModal from './components/modals/KeyboardShortcutsModal';
import { UndoToast, NotificationToast } from './components/ui/Toast';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { storageService } from './services/storageService';
import { soundService } from './services/soundService';
import './App.css';

export default function App() {
  // Application Data State
  const [categories, setCategories] = useState(() => storageService.loadCategories());
  const [settings, setSettings] = useState(() => storageService.loadSettings());
  const [user, setUser] = useState(() => storageService.loadUser());

  // Task Management Custom Hook
  const {
    tasks,
    setTasks,
    filteredTasks,
    currentView,
    setCurrentView,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    undoToast,
    hasCompletedTasks,
    addTask,
    saveTask,
    toggleComplete,
    undoComplete,
    deleteTask,
    bulkClearCompleted,
    updateSubtasks,
    reorderTasks
  } = useTasks();

  // Theme Management Custom Hook
  const { theme, toggleTheme } = useTheme(settings.theme || 'dark', (newTheme) => {
    setSettings(prev => ({ ...prev, theme: newTheme }));
  });

  // Modal Visibility State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Notification Toast State
  const [notificationToast, setNotificationToast] = useState(null);
  const notificationTimeoutRef = useRef(null);

  const showToast = useCallback((message) => {
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    setNotificationToast(message);
    notificationTimeoutRef.current = setTimeout(() => {
      setNotificationToast(null);
    }, 3500);
  }, []);

  // Synchronize categories, settings, sound, and user to persistent storage
  useEffect(() => {
    storageService.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    storageService.saveSettings(settings);
    soundService.enabled = settings.soundEnabled;
  }, [settings]);

  useEffect(() => {
    storageService.saveUser(user);
  }, [user]);

  // Modal Open Handlers
  const handleOpenNewTask = useCallback(() => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }, []);

  const handleCloseAllModals = useCallback(() => {
    setIsTaskModalOpen(false);
    setIsAiModalOpen(false);
    setIsSettingsOpen(false);
    setIsProfileModalOpen(false);
    setIsShortcutsOpen(false);
    setIsMobileMenuOpen(false);
  }, []);

  // Global Keyboard Shortcuts
  useKeyboardShortcuts({
    onOpenNewTask: handleOpenNewTask,
    onToggleShortcuts: () => setIsShortcutsOpen(prev => !prev),
    onNavigateView: (view) => setCurrentView(view),
    onCloseModals: handleCloseAllModals
  });

  return (
    <AppLayout
      sidebar={
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          tasks={tasks}
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenAiAssistant={() => setIsAiModalOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          user={user}
          isOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
      }
      header={
        <Header
          currentView={currentView}
          selectedCategory={selectedCategory}
          tasksCount={filteredTasks.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onOpenNewTask={handleOpenNewTask}
          onClearCompleted={bulkClearCompleted}
          hasCompletedTasks={hasCompletedTasks}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
          user={user}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenAiAssistant={() => setIsAiModalOpen(true)}
        />
      }
      toasts={
        <>
          <UndoToast toast={undoToast} onUndo={undoComplete} />
          <NotificationToast message={notificationToast} />
        </>
      }
    >
      {currentView === 'analytics' ? (
        <AnalyticsView
          tasks={tasks}
          categories={categories}
          user={user}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onNavigateView={setCurrentView}
          onOpenNewTask={handleOpenNewTask}
        />
      ) : (
        <>
          {/* Quick Task Add Bar */}
          <TaskInput
            onAddTask={addTask}
            categories={categories}
          />

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={toggleComplete}
            onDeleteTask={deleteTask}
            onEditTask={handleEditTask}
            onUpdateSubtasks={updateSubtasks}
            onReorderTasks={reorderTasks}
            categories={categories}
            onOpenNewTask={handleOpenNewTask}
            currentView={currentView}
          />
        </>
      )}

      {/* Application Modals */}
      {isTaskModalOpen && (
        <TaskModal
          key={editingTask ? editingTask.id : 'new-task'}
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={saveTask}
          taskToEdit={editingTask}
          categories={categories}
        />
      )}

      {isAiModalOpen && (
        <AIAssistantModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onAddTask={addTask}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          key={user?.name || 'settings'}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={setSettings}
          theme={theme}
          toggleTheme={toggleTheme}
          tasks={tasks}
          onImportTasks={(imported) => setTasks(imported)}
          onResetTasks={(resetSeed) => {
            setTasks(resetSeed);
            setCategories(storageService.loadCategories());
          }}
          user={user}
          onUpdateUser={setUser}
          onShowToast={showToast}
        />
      )}

      {isProfileModalOpen && (
        <ProfileModal
          key={user?.name || 'profile'}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          onSaveUser={setUser}
          theme={theme}
          toggleTheme={toggleTheme}
          onShowToast={showToast}
        />
      )}

      {isShortcutsOpen && (
        <KeyboardShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
        />
      )}
    </AppLayout>
  );
}

/**
 * Custom hook for Task management, filtering, reordering, and state persistence.
 */
import { useState, useEffect, useMemo, useRef } from 'react';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';
import { isToday, isUpcoming } from '../utils/dateUtils';

export function useTasks() {
  const [tasks, setTasks] = useState(() => storageService.loadTasks());
  const [currentView, setCurrentView] = useState('all'); // 'all', 'today', 'upcoming', 'completed', 'analytics'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [undoToast, setUndoToast] = useState(null);

  const undoTimeoutRef = useRef(null);

  // Sync tasks to persistent storage
  useEffect(() => {
    storageService.saveTasks(tasks);
  }, [tasks]);

  const addTask = (newTaskData) => {
    const created = {
      id: crypto.randomUUID(),
      title: newTaskData.title,
      description: newTaskData.description || '',
      priority: newTaskData.priority || 'medium',
      category: newTaskData.category || 'Work',
      dueDate: newTaskData.dueDate || null,
      dueTime: newTaskData.dueTime || null,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      subtasks: newTaskData.subtasks || []
    };

    setTasks(prev => [created, ...prev]);
    soundService.playAdd();
  };

  const saveTask = (taskData) => {
    if (taskData.id) {
      setTasks(prev => prev.map(t => t.id === taskData.id ? { ...t, ...taskData } : t));
    } else {
      addTask(taskData);
    }
  };

  const toggleComplete = (taskId) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const willComplete = !targetTask.completed;

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          completed: willComplete,
          completedAt: willComplete ? new Date().toISOString() : null
        };
      }
      return t;
    }));

    if (willComplete) {
      soundService.playComplete();
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      setUndoToast({
        taskId,
        title: targetTask.title
      });
      undoTimeoutRef.current = setTimeout(() => {
        setUndoToast(null);
      }, 5000);
    } else {
      soundService.playUndo();
    }
  };

  const undoComplete = () => {
    if (!undoToast) return;
    const { taskId } = undoToast;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: false, completedAt: null } : t));
    soundService.playUndo();
    setUndoToast(null);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    soundService.playDelete();
  };

  const bulkClearCompleted = () => {
    if (window.confirm('Are you sure you want to delete all completed tasks?')) {
      setTasks(prev => prev.filter(t => !t.completed));
      soundService.playDelete();
    }
  };

  const updateSubtasks = (taskId, updatedSubtasks) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    }));
  };

  const reorderTasks = (reorderedTasks) => {
    setTasks(reorderedTasks);
  };

  // Filter & Search Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = task.title.toLowerCase().includes(q);
        const inDesc = (task.description || '').toLowerCase().includes(q);
        const inCat = (task.category || '').toLowerCase().includes(q);
        const inSub = (task.subtasks || []).some(s => s.title.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inCat && !inSub) return false;
      }

      // 2. Navigation View
      if (currentView === 'today') {
        if (!isToday(task.dueDate)) return false;
      } else if (currentView === 'upcoming') {
        if (!isUpcoming(task.dueDate)) return false;
      } else if (currentView === 'completed') {
        if (!task.completed) return false;
      }

      // 3. Category Filter
      if (selectedCategory) {
        if (task.category !== selectedCategory) return false;
      }

      // 4. Priority Filter
      if (priorityFilter !== 'all') {
        if (task.priority !== priorityFilter) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priority') {
        const pOrder = { high: 1, medium: 2, low: 3 };
        return (pOrder[a.priority] || 4) - (pOrder[b.priority] || 4);
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });
  }, [tasks, currentView, selectedCategory, priorityFilter, sortBy, searchQuery]);

  const hasCompletedTasks = tasks.some(t => t.completed);

  return {
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
  };
}

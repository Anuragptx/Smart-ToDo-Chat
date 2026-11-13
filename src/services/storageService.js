/**
 * Storage Service
 * Handles all persistent storage operations, schema normalization, and JSON/CSV export routines.
 */
import { STORAGE_KEYS, DEFAULT_CATEGORIES, INITIAL_SEED_TASKS } from '../constants';

export const storageService = {
  /**
   * Load tasks from localStorage with schema validation
   */
  loadTasks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!data) {
        this.saveTasks(INITIAL_SEED_TASKS);
        return INITIAL_SEED_TASKS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return INITIAL_SEED_TASKS;
      
      // Normalize schema: ensure completed tasks carry completedAt
      return parsed.map(t => {
        if (t.completed && !t.completedAt) {
          return { ...t, completedAt: t.createdAt || new Date().toISOString() };
        }
        return t;
      });
    } catch (e) {
      console.error('StorageService: Error loading tasks, using fallback seed.', e);
      return INITIAL_SEED_TASKS;
    }
  },

  /**
   * Persist tasks to localStorage
   */
  saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('StorageService: Error saving tasks to storage.', e);
    }
  },

  /**
   * Load categories registry
   */
  loadCategories() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!data) {
        this.saveCategories(DEFAULT_CATEGORIES);
        return DEFAULT_CATEGORIES;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  },

  /**
   * Persist categories
   */
  saveCategories(categories) {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch {
      // Storage quota or privacy mode fallback
    }
  },

  /**
   * Load application settings
   */
  loadSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        return {
          theme: 'dark',
          soundEnabled: true,
          notificationsEnabled: false,
          defaultPriority: 'medium',
          autoBreakdownSuggestion: true
        };
      }
      return JSON.parse(data);
    } catch {
      return { theme: 'dark', soundEnabled: true, notificationsEnabled: false, defaultPriority: 'medium' };
    }
  },

  /**
   * Persist settings
   */
  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Storage quota or privacy mode fallback
    }
  },

  /**
   * Load user profile
   */
  loadUser() {
    const defaultUser = {
      name: 'Anurag Kumar',
      email: 'anurag@workspace.dev',
      role: 'Productivity Architect',
      bio: 'Focusing on high-impact goals 🚀',
      avatarImage: null,
      avatarText: 'AK',
      streakDays: 0
    };

    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (!data) return defaultUser;
      const parsed = JSON.parse(data);
      return { ...defaultUser, ...parsed };
    } catch {
      return defaultUser;
    }
  },

  /**
   * Persist user profile
   */
  saveUser(user) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {
      // Storage quota or privacy mode fallback
    }
  },

  /**
   * Export tasks as structured JSON
   */
  exportJSON(tasks) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `thingstodo_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  /**
   * Export tasks as standard CSV
   */
  exportCSV(tasks) {
    let csv = 'ID,Title,Description,Priority,Category,Due_Date,Due_Time,Completed,Completed_At,Created_At,Subtasks_Count\n';
    tasks.forEach(t => {
      const cleanTitle = (t.title || '').replace(/"/g, '""');
      const cleanDesc = (t.description || '').replace(/"/g, '""');
      csv += `"${t.id}","${cleanTitle}","${cleanDesc}","${t.priority}","${t.category}","${t.dueDate || ''}","${t.dueTime || ''}",${t.completed},"${t.completedAt || ''}","${t.createdAt}",${(t.subtasks || []).length}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `thingstodo_export_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
};

// Aliased export for backwards compatibility
export const storage = storageService;

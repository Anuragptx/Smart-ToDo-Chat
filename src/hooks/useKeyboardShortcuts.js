/**
 * Global Keyboard Shortcuts Hook
 * Provides hotkey handling for quick navigation, modal toggling, search focus, and task creation.
 */
import { useEffect } from 'react';

export function useKeyboardShortcuts({
  onOpenNewTask,
  onToggleShortcuts,
  onNavigateView,
  onCloseModals
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts when user is focused inside an input, textarea, or select
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      // Ctrl+K or Cmd+K -> Focus global search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.focus();
        return;
      }

      // / -> Focus global search
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.focus();
        return;
      }

      // N -> New Task
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (onOpenNewTask) onOpenNewTask();
        return;
      }

      // ? -> Toggle shortcuts guide
      if (e.key === '?') {
        e.preventDefault();
        if (onToggleShortcuts) onToggleShortcuts();
        return;
      }

      // Numbers 1-4 for view navigation
      if (onNavigateView) {
        if (e.key === '1') onNavigateView('all');
        if (e.key === '2') onNavigateView('today');
        if (e.key === '3') onNavigateView('upcoming');
        if (e.key === '4') onNavigateView('analytics');
      }

      // Escape -> Close all modals
      if (e.key === 'Escape') {
        if (onCloseModals) onCloseModals();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenNewTask, onToggleShortcuts, onNavigateView, onCloseModals]);
}

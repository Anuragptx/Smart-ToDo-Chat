/**
 * Reusable Floating Notification & Undo Toasts
 */
import { CheckIcon, UndoIcon } from './Icons';

export function UndoToast({ toast, onUndo }) {
  if (!toast) return null;

  return (
    <div className="undo-toast-bubble" role="status">
      <span>Completed <strong>"{toast.title}"</strong></span>
      <button className="undo-action-btn" onClick={onUndo} aria-label="Undo task completion">
        <UndoIcon size={14} />
        <span>Undo</span>
      </button>
    </div>
  );
}

export function NotificationToast({ message }) {
  if (!message) return null;

  return (
    <div className="notification-toast-bubble" role="status">
      <CheckIcon size={16} />
      <span>{message}</span>
    </div>
  );
}

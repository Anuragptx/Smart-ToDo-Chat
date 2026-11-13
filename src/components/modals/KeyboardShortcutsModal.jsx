import { CloseIcon, KeyboardIcon } from '../ui/Icons';
import { KEYBOARD_SHORTCUTS } from '../../constants';

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = KEYBOARD_SHORTCUTS || [
    { key: 'N', desc: 'Create a new task' },
    { key: '⌘ + K  or  /', desc: 'Focus global search input' },
    { key: 'Esc', desc: 'Close open dialogs or clear search' },
    { key: '1', desc: 'Navigate to All Tasks' },
    { key: '2', desc: 'Navigate to Today’s Tasks' },
    { key: '3', desc: 'Navigate to Upcoming Tasks' },
    { key: '4', desc: 'Navigate to Analytics Dashboard' },
    { key: '?', desc: 'Toggle keyboard shortcuts menu' }
  ];

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div 
        className="modal-glass-container shortcuts-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="modal-header-row">
          <div className="shortcuts-title-row">
            <KeyboardIcon size={18} className="text-indigo" />
            <h3 className="modal-title">Keyboard Shortcuts</h3>
          </div>
          <button className="modal-close-icon-btn" onClick={onClose}>
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="shortcuts-modal-body">
          <p className="shortcuts-desc">
            Boost your productivity by navigating Things To Do entirely with your keyboard.
          </p>

          <div className="shortcuts-list-grid">
            {shortcuts.map((s, idx) => (
              <div key={idx} className="shortcut-item-row">
                <span className="shortcut-desc">{s.desc}</span>
                <kbd className="shortcut-key-badge">{s.key}</kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

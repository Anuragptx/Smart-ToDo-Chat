import { useState } from 'react';
import {
  CloseIcon,
  CalendarIcon,
  ClockIcon,
  FlagIcon,
  TagIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
  CheckIcon
} from '../ui/Icons';
import { generateSmartSubtasks } from '../../services/aiService';
import { getISOStringForInput } from '../../utils/dateUtils';

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  categories
}) {
  const [title, setTitle] = useState(taskToEdit ? (taskToEdit.title || '') : '');
  const [description, setDescription] = useState(taskToEdit ? (taskToEdit.description || '') : '');
  const [priority, setPriority] = useState(taskToEdit ? (taskToEdit.priority || 'medium') : 'medium');
  const [category, setCategory] = useState(taskToEdit ? (taskToEdit.category || (categories[0]?.name || 'Work')) : (categories[0]?.name || 'Work'));
  const [dueDate, setDueDate] = useState(taskToEdit ? (taskToEdit.dueDate || '') : getISOStringForInput());
  const [dueTime, setDueTime] = useState(taskToEdit ? (taskToEdit.dueTime || '') : '');
  const [subtasks, setSubtasks] = useState(taskToEdit ? (taskToEdit.subtasks || []) : []);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  if (!isOpen) return null;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskInput.trim()) return;
    const newSub = {
      id: crypto.randomUUID(),
      title: newSubtaskInput.trim(),
      completed: false
    };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskInput('');
  };

  const handleToggleSubtask = (subId) => {
    setSubtasks(subtasks.map(s => 
      s.id === subId ? { ...s, completed: !s.completed } : s
    ));
  };

  const handleDeleteSubtask = (subId) => {
    setSubtasks(subtasks.filter(s => s.id !== subId));
  };

  const handleAiBreakdown = () => {
    if (!title.trim()) return;
    const generated = generateSmartSubtasks(title.trim());
    setSubtasks([...subtasks, ...generated]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: taskToEdit ? taskToEdit.id : undefined,
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      subtasks
    });

    onClose();
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div 
        className="modal-glass-container" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header-row">
          <h3 className="modal-title">
            {taskToEdit ? 'Edit Task Details' : 'Create New Task'}
          </h3>
          <button className="modal-close-icon-btn" onClick={onClose} aria-label="Close dialog">
            <CloseIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content-form">
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-title-input">Task Title *</label>
            <input
              id="task-title-input"
              type="text"
              className="form-input"
              placeholder="e.g. Prepare System Architecture Review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-desc-input">Description / Notes</label>
            <textarea
              id="task-desc-input"
              className="form-textarea"
              placeholder="Add key context, resources, links, or expectations..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Metadata Grid */}
          <div className="modal-fields-grid">
            {/* Priority */}
            <div className="form-group">
              <label className="form-label">
                <FlagIcon size={14} /> Priority Level
              </label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="high">🔴 High Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="low">🟢 Low Priority</option>
              </select>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">
                <TagIcon size={14} /> Category
              </label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label className="form-label">
                <CalendarIcon size={14} /> Due Date
              </label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Due Time */}
            <div className="form-group">
              <label className="form-label">
                <ClockIcon size={14} /> Due Time (Optional)
              </label>
              <input
                type="time"
                className="form-input"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="modal-subtasks-section">
            <div className="subtasks-section-header">
              <span className="subtasks-section-title">Subtasks Checklist ({subtasks.length})</span>
              <button
                type="button"
                className="btn-ai-decompose"
                onClick={handleAiBreakdown}
                disabled={!title.trim()}
                title="Use AI to automatically break down this task"
              >
                <SparklesIcon size={14} />
                <span>AI Auto-Breakdown</span>
              </button>
            </div>

            <div className="modal-subtasks-list">
              {subtasks.map((sub) => (
                <div key={sub.id} className="modal-subtask-item">
                  <button
                    type="button"
                    className={`subtask-check-circle ${sub.completed ? 'checked' : ''}`}
                    onClick={() => handleToggleSubtask(sub.id)}
                  >
                    {sub.completed && <CheckIcon size={12} />}
                  </button>
                  <span className={`subtask-item-text ${sub.completed ? 'completed' : ''}`}>
                    {sub.title}
                  </span>
                  <button
                    type="button"
                    className="subtask-remove-btn"
                    onClick={() => handleDeleteSubtask(sub.id)}
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="add-subtask-row">
              <input
                type="text"
                className="form-input"
                placeholder="Add subtask and press enter..."
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSubtask(e);
                  }
                }}
              />
              <button
                type="button"
                className="btn-add-subtask-circle"
                onClick={handleAddSubtask}
                disabled={!newSubtaskInput.trim()}
              >
                <PlusIcon size={16} />
              </button>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-submit"
            >
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

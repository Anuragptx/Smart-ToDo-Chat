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
} from './Icons';
import { generateSmartSubtasks } from '../services/aiService';
import { getISOStringForInput } from '../utils/dateUtils';

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

  const handleSmartBreakdown = () => {
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
      subtasks,
      completed: taskToEdit ? taskToEdit.completed : false,
      createdAt: taskToEdit ? taskToEdit.createdAt : new Date().toISOString()
    });

    onClose();
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div 
        className="modal-glass-container task-dialog-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="modal-header-row">
          <h3 className="modal-title">
            {taskToEdit ? 'Edit Task Details' : 'Create New Task'}
          </h3>
          <button className="modal-close-icon-btn" onClick={onClose}>
            <CloseIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-modal-form">
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input-lg"
              placeholder="e.g. Design System Architecture Review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Notes</label>
            <textarea
              className="form-textarea"
              placeholder="Add additional context, acceptance criteria, or markdown links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="modal-fields-grid">
            <div className="form-group">
              <label className="form-label">
                <FlagIcon size={14} className="text-secondary" /> Priority Level
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

            <div className="form-group">
              <label className="form-label">
                <TagIcon size={14} className="text-secondary" /> Category
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

            <div className="form-group">
              <label className="form-label">
                <CalendarIcon size={14} className="text-secondary" /> Due Date
              </label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <ClockIcon size={14} className="text-secondary" /> Due Time
              </label>
              <input
                type="time"
                className="form-input"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>

          <div className="subtasks-section">
            <div className="subtasks-header-row">
              <label className="form-label">Subtasks & Milestones</label>
              {title.trim().length > 3 && (
                <button
                  type="button"
                  className="btn-smart-subtasks-inline"
                  onClick={handleSmartBreakdown}
                  title="Generate subtasks automatically from task title"
                >
                  <SparklesIcon size={13} />
                  <span>AI Breakdown</span>
                </button>
              )}
            </div>

            <div className="modal-subtasks-list">
              {subtasks.map((st) => (
                <div key={st.id} className="modal-subtask-row">
                  <button
                    type="button"
                    className={`subtask-check-circle ${st.completed ? 'completed' : ''}`}
                    onClick={() => handleToggleSubtask(st.id)}
                  >
                    {st.completed && <CheckIcon size={12} />}
                  </button>
                  <span className={`subtask-modal-title ${st.completed ? 'completed' : ''}`}>
                    {st.title}
                  </span>
                  <button
                    type="button"
                    className="btn-trash-ghost"
                    onClick={() => handleDeleteSubtask(st.id)}
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="add-subtask-inline-row">
              <input
                type="text"
                className="subtask-inline-input"
                placeholder="+ Add a subtask..."
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
              />
              <button
                type="button"
                className="btn-add-subtask-inline"
                onClick={handleAddSubtask}
              >
                <PlusIcon size={14} />
                <span>Add</span>
              </button>
            </div>
          </div>

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
              <CheckIcon size={16} />
              <span>{taskToEdit ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

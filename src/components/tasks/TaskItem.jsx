import { useState } from 'react';
import {
  CheckIcon,
  TrashIcon,
  EditIcon,
  CalendarIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GripVerticalIcon,
  PlusIcon
} from '../ui/Icons';
import { isOverdue, formatDueDate } from '../../utils/dateUtils';
import { generateSmartSubtasks } from '../../services/aiService';

export default function TaskItem({
  task,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onUpdateSubtasks,
  onDragStart,
  onDragOver,
  onDrop,
  categoryColor
}) {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const subtasks = task.subtasks || [];
  const completedSubtasksCount = subtasks.filter(s => s.completed).length;
  const totalSubtasksCount = subtasks.length;
  const subtaskPercent = totalSubtasksCount > 0 ? Math.round((completedSubtasksCount / totalSubtasksCount) * 100) : 0;

  const overdue = !task.completed && isOverdue(task.dueDate, task.dueTime);
  const formattedDate = formatDueDate(task.dueDate, task.dueTime);

  const handleToggleSubtask = (subId) => {
    const updated = subtasks.map(s => 
      s.id === subId ? { ...s, completed: !s.completed } : s
    );
    onUpdateSubtasks(task.id, updated);
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSub = {
      id: crypto.randomUUID(),
      title: newSubtaskTitle.trim(),
      completed: false
    };
    onUpdateSubtasks(task.id, [...subtasks, newSub]);
    setNewSubtaskTitle('');
    setShowSubtasks(true);
  };

  const handleDeleteSubtask = (subId) => {
    const updated = subtasks.filter(s => s.id !== subId);
    onUpdateSubtasks(task.id, updated);
  };

  const handleAiBreakdownClick = (e) => {
    e.stopPropagation();
    const generated = generateSmartSubtasks(task.title);
    onUpdateSubtasks(task.id, [...subtasks, ...generated]);
    setShowSubtasks(true);
  };

  return (
    <div
      className={`task-card-item ${task.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''} priority-${task.priority}`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, task.id)}
    >
      {/* Priority Left Border Accent */}
      <div className={`priority-accent-bar priority-${task.priority}`} />

      <div className="task-main-row">
        {/* Drag Grip Handle */}
        <div className="drag-handle" title="Drag to reorder">
          <GripVerticalIcon size={16} />
        </div>

        {/* Circular Checkbox */}
        <button
          type="button"
          className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => onToggleComplete(task.id)}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        >
          {task.completed && <CheckIcon size={14} className="check-svg" />}
        </button>

        {/* Task Title & Meta */}
        <div className="task-content-area" onClick={() => onEditTask(task)}>
          <div className="task-title-line">
            <span className={`task-title-text ${task.completed ? 'strikethrough' : ''}`}>
              {task.title}
            </span>
          </div>

          {task.description && (
            <p className="task-desc-text">{task.description}</p>
          )}

          {/* Badges Ribbon */}
          <div className="task-badges-ribbon">
            {/* Category Tag */}
            {task.category && (
              <span 
                className="badge-tag" 
                style={{ 
                  color: categoryColor || 'var(--text-secondary)',
                  backgroundColor: `${categoryColor || '#6366f1'}15`,
                  borderColor: `${categoryColor || '#6366f1'}30`
                }}
              >
                {task.category}
              </span>
            )}

            {/* Priority Badge */}
            <span className={`badge-priority priority-${task.priority}`}>
              {task.priority ? task.priority.toUpperCase() : 'MEDIUM'}
            </span>

            {/* Due Date Badge */}
            {formattedDate && (
              <span className={`badge-date ${overdue ? 'overdue-pill' : ''}`}>
                <CalendarIcon size={12} />
                <span>{formattedDate}</span>
              </span>
            )}

            {/* Subtasks Progress Pill */}
            {totalSubtasksCount > 0 && (
              <button
                type="button"
                className="badge-subtask-progress"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSubtasks(!showSubtasks);
                }}
              >
                {showSubtasks ? <ChevronDownIcon size={12} /> : <ChevronRightIcon size={12} />}
                <span>{completedSubtasksCount}/{totalSubtasksCount} subtasks</span>
                <span className="mini-progress-track">
                  <span className="mini-progress-fill" style={{ width: `${subtaskPercent}%` }} />
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Actions Cluster (Appears on Hover) */}
        <div className="task-actions-cluster">
          {totalSubtasksCount === 0 && !task.completed && (
            <button
              type="button"
              className="action-icon-btn ai-btn"
              onClick={handleAiBreakdownClick}
              title="Break down with AI subtasks"
            >
              <SparklesIcon size={15} />
            </button>
          )}

          <button
            type="button"
            className="action-icon-btn"
            onClick={() => onEditTask(task)}
            title="Edit task details"
          >
            <EditIcon size={15} />
          </button>

          <button
            type="button"
            className="action-icon-btn delete-btn"
            onClick={() => onDeleteTask(task.id)}
            title="Delete task"
          >
            <TrashIcon size={15} />
          </button>
        </div>
      </div>

      {/* Subtasks Collapsible Panel */}
      {showSubtasks && (
        <div className="subtasks-expanded-panel">
          <div className="subtasks-list">
            {subtasks.map((sub) => (
              <div key={sub.id} className="subtask-row">
                <button
                  type="button"
                  className={`subtask-checkbox ${sub.completed ? 'checked' : ''}`}
                  onClick={() => handleToggleSubtask(sub.id)}
                  aria-label={sub.completed ? "Mark subtask incomplete" : "Mark subtask complete"}
                >
                  {sub.completed && <CheckIcon size={11} />}
                </button>
                <span className={`subtask-title ${sub.completed ? 'strikethrough' : ''}`}>
                  {sub.title}
                </span>
                <button
                  type="button"
                  className="subtask-del-btn"
                  onClick={() => handleDeleteSubtask(sub.id)}
                  title="Remove subtask"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Quick Add Subtask Input */}
          <form onSubmit={handleAddSubtask} className="add-subtask-form">
            <PlusIcon size={14} className="text-muted" />
            <input
              type="text"
              className="add-subtask-input"
              placeholder="Add next subtask step..."
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
            />
            {newSubtaskTitle.trim() && (
              <button type="submit" className="add-subtask-submit-btn">
                Add
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

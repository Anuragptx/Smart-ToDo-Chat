import { useState } from 'react';
import TaskItem from './TaskItem';
import { SparklesIcon, CheckCheckIcon, PlusIcon } from './Icons';

export default function TaskList({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onUpdateSubtasks,
  onReorderTasks,
  categories,
  onOpenNewTask,
  currentView
}) {
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetTaskId) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetTaskId) return;

    const draggedIndex = tasks.findIndex(t => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex(t => t.id === targetTaskId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newTasks = [...tasks];
    const [removed] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, removed);

    onReorderTasks(newTasks);
    setDraggedTaskId(null);
  };

  const getCategoryColor = (catName) => {
    const found = categories.find(c => c.name === catName);
    return found ? found.color : '#6366f1';
  };

  // Empty state handling
  if (tasks.length === 0) {
    return (
      <div className="empty-tasks-container">
        <div className="empty-illustration-orb">
          <SparklesIcon size={36} className="empty-sparkle-icon" />
        </div>
        <h3 className="empty-title">
          {currentView === 'completed'
            ? 'No completed tasks yet'
            : currentView === 'today'
            ? 'Clear schedule for today!'
            : 'No tasks found in this view'}
        </h3>
        <p className="empty-subtitle">
          {currentView === 'completed'
            ? 'Complete your pending goals and check them off to view them here.'
            : currentView === 'today'
            ? 'Plan out your morning focus by assigning due dates to your tasks.'
            : 'Capture ideas, organize goals, or ask the AI assistant to outline your day.'}
        </p>
        {currentView !== 'completed' && (
          <button className="btn-empty-create" onClick={onOpenNewTask}>
            <PlusIcon size={15} />
            <span>Create a Task</span>
          </button>
        )}
      </div>
    );
  }

  // Split into Active vs Completed sections for cleaner visual hierarchy
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="task-list-wrapper">
      {/* Active Tasks Group */}
      {activeTasks.length > 0 && (
        <div className="tasks-section-group">
          {completedTasks.length > 0 && (
            <div className="section-divider-row">
              <span className="section-divider-title">Pending ({activeTasks.length})</span>
            </div>
          )}
          <div className="tasks-cards-stack">
            {activeTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
                onUpdateSubtasks={onUpdateSubtasks}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                categoryColor={getCategoryColor(task.category)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks Group */}
      {completedTasks.length > 0 && (
        <div className="tasks-section-group completed-group">
          <div className="section-divider-row">
            <span className="section-divider-title">
              <CheckCheckIcon size={14} className="text-emerald" /> Completed ({completedTasks.length})
            </span>
          </div>
          <div className="tasks-cards-stack">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
                onUpdateSubtasks={onUpdateSubtasks}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                categoryColor={getCategoryColor(task.category)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

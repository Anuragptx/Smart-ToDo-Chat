import { useState, useRef, useEffect } from 'react';
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  SparklesIcon,
  CheckIcon
} from './Icons';
import { predictPriority, generateSmartSubtasks } from '../services/aiService';
import { getISOStringForInput } from '../utils/dateUtils';

export default function TaskInput({ onAddTask, categories = [] }) {
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [dueDate, setDueDate] = useState(getISOStringForInput());
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState(categories[0]?.name || 'Work');
  const [autoBreakdown, setAutoBreakdown] = useState(false);
  const [predictedPriority, setPredictedPriority] = useState('medium');
  const [activeDateTab, setActiveDateTab] = useState('today');

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  const handleTitleChange = (e) => {
    const nextTitle = e.target.value;
    setTitle(nextTitle);
    if (nextTitle.length > 2) {
      const pred = predictPriority(nextTitle);
      setPredictedPriority(pred);
      if (!isExpanded) {
        setPriority(pred);
      }
    }
  };

  const handleQuickDateSelect = (type) => {
    setActiveDateTab(type);
    const d = new Date();
    if (type === 'today') {
      setDueDate(getISOStringForInput(d));
    } else if (type === 'tomorrow') {
      d.setDate(d.getDate() + 1);
      setDueDate(getISOStringForInput(d));
    } else if (type === 'next-week') {
      const day = d.getDay();
      const diff = (8 - day) % 7 || 7;
      d.setDate(d.getDate() + diff);
      setDueDate(getISOStringForInput(d));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let initialSubtasks = [];
    if (autoBreakdown) {
      initialSubtasks = generateSmartSubtasks(title.trim());
    }

    onAddTask({
      title: title.trim(),
      description: '',
      priority: priority || predictedPriority || 'medium',
      category: category || (categories[0]?.name || 'Work'),
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      subtasks: initialSubtasks
    });

    setTitle('');
    setAutoBreakdown(false);
    setIsExpanded(false);
  };

  const previewSubtasks = autoBreakdown && title.trim().length > 3
    ? generateSmartSubtasks(title.trim()).slice(0, 3)
    : [];

  return (
    <div 
      className={`quick-task-bar-container ${isExpanded ? 'expanded' : ''} ${title.trim() ? 'has-input' : ''}`}
      ref={containerRef}
    >
      <form onSubmit={handleSubmit} className="quick-task-form">
        <div className="task-input-primary-row">
          <button 
            type="submit" 
            className={`quick-add-btn ${title.trim() ? 'btn-active' : ''}`} 
            aria-label="Add task"
            title="Press Enter to Add"
          >
            <PlusIcon size={18} />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            className="task-quick-input"
            placeholder="Add a new task... (Type naturally e.g. 'Deploy urgent bugfix' or press N)"
            value={title}
            onChange={handleTitleChange}
            onFocus={() => setIsExpanded(true)}
          />

          {title.trim().length > 2 && (
            <div 
              className={`smart-priority-badge priority-${priority || predictedPriority}`}
              onClick={() => {
                const nextP = priority === 'high' ? 'medium' : priority === 'medium' ? 'low' : 'high';
                setPriority(nextP);
              }}
              title="Click to quickly toggle priority"
            >
              <SparklesIcon size={12} />
              <span>AI {((priority || predictedPriority)).toUpperCase()}</span>
            </div>
          )}

          <div className="input-right-kbd-group">
            <span className="kbd-shortcut-hint">
              {isExpanded ? (
                <span><kbd>↵ Enter</kbd> to add</span>
              ) : (
                <span><kbd>N</kbd> for new task</span>
              )}
            </span>
          </div>
        </div>

        {isExpanded && (
          <div className="task-input-expanded-controls">
            <div className="interactive-quick-date-pills">
              <span className="pill-group-label">Due Date:</span>
              <button
                type="button"
                className={`date-pill ${activeDateTab === 'today' ? 'active' : ''}`}
                onClick={() => handleQuickDateSelect('today')}
              >
                📅 Today
              </button>
              <button
                type="button"
                className={`date-pill ${activeDateTab === 'tomorrow' ? 'active' : ''}`}
                onClick={() => handleQuickDateSelect('tomorrow')}
              >
                ⚡ Tomorrow
              </button>
              <button
                type="button"
                className={`date-pill ${activeDateTab === 'next-week' ? 'active' : ''}`}
                onClick={() => handleQuickDateSelect('next-week')}
              >
                📆 Next Week
              </button>

              <div className="custom-date-pill">
                <CalendarIcon size={13} className="text-secondary" />
                <input
                  type="date"
                  className="control-inline-date-input"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    setActiveDateTab('custom');
                  }}
                  title="Choose custom date"
                />
              </div>

              <div className="custom-time-pill">
                <ClockIcon size={13} className="text-secondary" />
                <input
                  type="time"
                  className="control-inline-time-input"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  placeholder="Set time"
                  title="Choose due time"
                />
              </div>
            </div>

            <div className="interactive-selectors-row">
              <div className="interactive-priority-group">
                <span className="pill-group-label">Priority:</span>
                <div className="priority-pill-buttons">
                  <button
                    type="button"
                    className={`priority-select-pill pill-high ${priority === 'high' ? 'active' : ''}`}
                    onClick={() => setPriority('high')}
                  >
                    🔴 High
                  </button>
                  <button
                    type="button"
                    className={`priority-select-pill pill-medium ${priority === 'medium' ? 'active' : ''}`}
                    onClick={() => setPriority('medium')}
                  >
                    🟡 Medium
                  </button>
                  <button
                    type="button"
                    className={`priority-select-pill pill-low ${priority === 'low' ? 'active' : ''}`}
                    onClick={() => setPriority('low')}
                  >
                    🟢 Low
                  </button>
                </div>
              </div>

              <div className="interactive-category-group">
                <span className="pill-group-label">Category:</span>
                <div className="category-pill-buttons">
                  {categories.map((c) => {
                    const isSelected = category === c.name;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        className={`cat-select-pill ${isSelected ? 'active' : ''}`}
                        onClick={() => setCategory(c.name)}
                      >
                        <span className="cat-pill-dot" style={{ backgroundColor: c.color }} />
                        <span>{c.name}</span>
                        {isSelected && <CheckIcon size={11} className="cat-check" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="interactive-ai-toggle-row">
              <button
                type="button"
                className={`ai-auto-breakdown-switch ${autoBreakdown ? 'enabled' : ''}`}
                onClick={() => setAutoBreakdown(!autoBreakdown)}
              >
                <div className="switch-sparkle-halo">
                  <SparklesIcon size={15} />
                </div>
                <div className="switch-text-col">
                  <span className="switch-title">Auto-breakdown into subtasks with AI</span>
                  <span className="switch-desc">
                    {autoBreakdown ? '✨ AI Subtask Generator Active' : 'Click to enable automated action steps'}
                  </span>
                </div>
                <div className={`switch-knob-track ${autoBreakdown ? 'checked' : ''}`}>
                  <div className="switch-knob" />
                </div>
              </button>
            </div>

            {autoBreakdown && previewSubtasks.length > 0 && (
              <div className="live-ai-subtask-preview">
                <div className="preview-label-row">
                  <span className="preview-tag">AI Generated Steps:</span>
                </div>
                <div className="preview-chips-flex">
                  {previewSubtasks.map((st, i) => (
                    <div key={i} className="preview-step-chip">
                      <span className="step-counter">{i + 1}</span>
                      <span className="step-text">{st.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="controls-footer-row">
              <button
                type="button"
                className="btn-ghost-cancel"
                onClick={() => setIsExpanded(false)}
              >
                Cancel (<kbd>Esc</kbd>)
              </button>

              <button
                type="submit"
                className="btn-submit-task"
                disabled={!title.trim()}
              >
                <PlusIcon size={16} />
                <span>Add Task to Workspace</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

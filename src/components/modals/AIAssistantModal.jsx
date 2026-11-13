import { useState } from 'react';
import {
  CloseIcon,
  SparklesIcon,
  PlusIcon,
  CheckCheckIcon,
  ZapIcon,
  CheckIcon,
  TrashIcon
} from '../ui/Icons';
import { AI_TASK_SUGGESTIONS, generateSmartSubtasks, predictPriority } from '../../services/aiService';
import { getISOStringForInput } from '../../utils/dateUtils';

const QUICK_STARTER_PROMPTS = [
  { icon: '🚀', text: 'Launch SaaS Web Application' },
  { icon: '🎨', text: 'Redesign UI/UX Landing Page' },
  { icon: '⚡', text: 'Optimize Database Queries & Latency' },
  { icon: '📚', text: 'Prepare System Architecture Review' },
  { icon: '✈️', text: 'Plan 4-Day Travel Itinerary' },
  { icon: '🏋️', text: 'Establish 30-Day Morning Habit' }
];

const SUGGESTION_CATEGORIES = ['All', 'Work', 'Health', 'Learning', 'Personal'];

export default function AIAssistantModal({
  isOpen,
  onClose,
  onAddTask
}) {
  const [breakdownInput, setBreakdownInput] = useState('');
  const [previewSubtasks, setPreviewSubtasks] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newStepText, setNewStepText] = useState('');
  const [selectedIdeaCategory, setSelectedIdeaCategory] = useState('All');
  const [addedItemIds, setAddedItemIds] = useState(new Set());

  if (!isOpen) return null;

  const handleAddSuggestion = (item, idx) => {
    onAddTask({
      title: item.title,
      description: 'Suggested by Things To Do AI Productivity Assistant',
      priority: item.priority || 'medium',
      category: item.category || 'Work',
      dueDate: getISOStringForInput(),
      dueTime: '17:00',
      subtasks: []
    });

    setAddedItemIds(prev => new Set(prev).add(idx));
  };

  const executeBreakdown = (text) => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const subtasks = generateSmartSubtasks(text.trim());
      setPreviewSubtasks(subtasks);
      setHasGenerated(true);
      setIsGenerating(false);
    }, 280);
  };

  const handleGenerateBreakdown = (e) => {
    e.preventDefault();
    executeBreakdown(breakdownInput);
  };

  const handleSelectStarterPrompt = (promptText) => {
    setBreakdownInput(promptText);
    executeBreakdown(promptText);
  };

  const handleRemoveSubtask = (indexToRemove) => {
    setPreviewSubtasks(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddCustomStep = (e) => {
    e.preventDefault();
    if (!newStepText.trim()) return;
    setPreviewSubtasks(prev => [
      ...prev,
      { id: crypto.randomUUID(), title: newStepText.trim(), completed: false }
    ]);
    setNewStepText('');
  };

  const handleCreateTaskFromBreakdown = () => {
    if (!breakdownInput.trim()) return;

    onAddTask({
      title: breakdownInput.trim(),
      description: 'AI-decomposed multi-step project breakdown',
      priority: predictPriority(breakdownInput),
      category: 'Work',
      dueDate: getISOStringForInput(),
      dueTime: '18:00',
      subtasks: previewSubtasks
    });

    setBreakdownInput('');
    setPreviewSubtasks([]);
    setHasGenerated(false);
    onClose();
  };

  const filteredSuggestions = selectedIdeaCategory === 'All'
    ? AI_TASK_SUGGESTIONS
    : AI_TASK_SUGGESTIONS.filter(item => (item.category || 'Work').toLowerCase() === selectedIdeaCategory.toLowerCase());

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div 
        className="modal-glass-container ai-modal interactive-ai-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {/* Animated AI Modal Header */}
        <div className="modal-header-row ai-modal-header">
          <div className="ai-modal-header-title">
            <div className="ai-icon-halo-pulse">
              <SparklesIcon size={20} className="sparkle-svg-animated" />
            </div>
            <div>
              <div className="ai-title-badge-row">
                <h3 className="modal-title">AI Productivity Assistant</h3>
                <span className="ai-engine-chip">
                  <span className="pulse-green-dot"></span>
                  AI ENGINE ACTIVE
                </span>
              </div>
              <span className="modal-subtext">
                Deconstruct goals into actionable milestones and explore curated blueprints
              </span>
            </div>
          </div>
          <button className="modal-close-icon-btn" onClick={onClose} aria-label="Close dialog">
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="ai-modal-body">
          {/* Section 1: Task & Project Decomposition */}
          <div className="ai-section-box interactive-generator-box">
            <div className="ai-section-header-flex">
              <div>
                <h4 className="ai-section-title">
                  <ZapIcon size={16} className="text-cyan" /> Intelligent Milestone Breakdown
                </h4>
                <p className="ai-section-desc">
                  Enter any high-level objective, feature, or project and AI will generate ordered, executable subtasks.
                </p>
              </div>
            </div>

            {/* Quick Starter Brainstorm Pills */}
            <div className="ai-starter-prompts-row">
              <span className="starter-label">Quick Suggestions:</span>
              <div className="starter-pills-scroll">
                {QUICK_STARTER_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="starter-prompt-pill"
                    onClick={() => handleSelectStarterPrompt(p.text)}
                  >
                    <span className="starter-icon">{p.icon}</span>
                    <span className="starter-text">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Decomposition Input Form */}
            <form onSubmit={handleGenerateBreakdown} className="ai-breakdown-form">
              <div className="ai-input-group">
                <input
                  type="text"
                  className="form-input ai-input"
                  placeholder="e.g. Build authentication with OAuth, Redesign product onboarding, Plan trip..."
                  value={breakdownInput}
                  onChange={(e) => setBreakdownInput(e.target.value)}
                  autoFocus
                />
                <button 
                  type="submit" 
                  className={`btn-ai-decompose ${isGenerating ? 'loading' : ''}`}
                  disabled={!breakdownInput.trim() || isGenerating}
                >
                  <SparklesIcon size={15} />
                  <span>{isGenerating ? 'Analyzing...' : 'Break Down Goal'}</span>
                </button>
              </div>
            </form>

            {/* Generated Subtasks Preview Panel */}
            {hasGenerated && (
              <div className="ai-preview-panel">
                <div className="preview-heading-row">
                  <span className="preview-heading">
                    ✨ Generated Milestone Steps ({previewSubtasks.length})
                  </span>
                  <span className="preview-sub">Review, add custom steps, or delete items before importing:</span>
                </div>

                <div className="preview-subtasks-list">
                  {previewSubtasks.map((st, i) => (
                    <div key={st.id || i} className="preview-subtask-row interactive-step-row">
                      <div className="step-left-info">
                        <span className="step-num">{i + 1}</span>
                        <span className="step-title">{st.title}</span>
                      </div>
                      <button
                        type="button"
                        className="btn-remove-step"
                        onClick={() => handleRemoveSubtask(i)}
                        title="Remove step"
                      >
                        <TrashIcon size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Custom Additional Step Input */}
                <form onSubmit={handleAddCustomStep} className="add-extra-step-form">
                  <input
                    type="text"
                    className="extra-step-input"
                    placeholder="+ Add custom milestone step..."
                    value={newStepText}
                    onChange={(e) => setNewStepText(e.target.value)}
                  />
                  {newStepText.trim() && (
                    <button type="submit" className="btn-add-extra-step">
                      <PlusIcon size={13} />
                      <span>Add Step</span>
                    </button>
                  )}
                </form>

                {/* Confirm & Add Button */}
                <button 
                  type="button"
                  className="btn-confirm-ai-tasks"
                  onClick={handleCreateTaskFromBreakdown}
                >
                  <CheckCheckIcon size={16} />
                  <span>Import Project & All {previewSubtasks.length} Subtasks</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Curated High-Impact Blueprints */}
          <div className="ai-section-box ideas-hub-box">
            <div className="ideas-header-row">
              <div>
                <h4 className="ai-section-title">
                  <SparklesIcon size={16} className="text-indigo" /> Recommended Habit Blueprints
                </h4>
                <p className="ai-section-desc">
                  One-click queue high-impact productivity habits and best practices into your workspace.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="idea-category-filter-pills">
                {SUGGESTION_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`idea-cat-pill ${selectedIdeaCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedIdeaCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="ai-suggestions-grid">
              {filteredSuggestions.map((item, idx) => {
                const isAdded = addedItemIds.has(idx);
                return (
                  <div key={idx} className={`ai-suggestion-card ${isAdded ? 'card-added' : ''}`}>
                    <div className="suggestion-text-col">
                      <span className="suggestion-title">{item.title}</span>
                      <div className="suggestion-meta">
                        <span className="suggestion-cat">{item.category}</span>
                        <span className={`suggestion-priority priority-${item.priority || 'medium'}`}>
                          {item.priority ? item.priority.toUpperCase() : 'MEDIUM'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`btn-add-ai-blueprint ${isAdded ? 'added' : ''}`}
                      onClick={() => handleAddSuggestion(item, idx)}
                      disabled={isAdded}
                      title={isAdded ? "Added to your workspace" : "Add to your tasks"}
                    >
                      {isAdded ? (
                        <>
                          <CheckIcon size={13} />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <PlusIcon size={13} />
                          <span>Add Task</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

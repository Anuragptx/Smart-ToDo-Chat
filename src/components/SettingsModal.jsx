import { useState, useRef } from 'react';
import {
  CloseIcon,
  MoonIcon,
  SunIcon,
  DownloadIcon,
  UploadIcon,
  TrashIcon,
  SettingsIcon,
  UserIcon,
  CheckIcon
} from './Icons';
import { storageService } from '../services/storageService';
import { INITIAL_SEED_TASKS } from '../constants';
import { getInitials, getProfileCompletion } from '../utils/userUtils';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  theme,
  toggleTheme,
  tasks,
  onImportTasks,
  onResetTasks,
  user,
  onUpdateUser,
  onShowToast
}) {
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [nameError, setNameError] = useState('');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  if (!isOpen) return null;

  const handleNameChange = (e) => {
    const val = e.target.value;
    if (val.length <= 30) {
      setName(val);
      if (val.trim()) setNameError('');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setNameError('Name cannot be empty. Please enter your name.');
      return;
    }

    const updatedUser = {
      ...user,
      name: trimmed,
      role: role.trim() || 'Productivity Enthusiast',
      bio: bio.trim(),
      avatarText: getInitials(trimmed)
    };

    onUpdateUser(updatedUser);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2500);

    if (onShowToast) {
      onShowToast(`Profile saved! Name updated to "${trimmed}" 👋`);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert('File size exceeds 3MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const updatedUser = {
        ...user,
        avatarImage: event.target.result
      };
      onUpdateUser(updatedUser);
      if (onShowToast) onShowToast('Profile picture updated! 📸');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    const updatedUser = {
      ...user,
      avatarImage: null
    };
    onUpdateUser(updatedUser);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
    if (onShowToast) onShowToast('Profile picture removed.');
  };

  const handleSoundToggle = () => {
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const handleNotificationsToggle = async () => {
    if (!('Notification' in window)) {
      alert('Desktop notifications are not supported in this browser.');
      return;
    }

    if (Notification.permission === 'granted') {
      onUpdateSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled });
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        onUpdateSettings({ ...settings, notificationsEnabled: true });
        new Notification('Things To Do Notifications Enabled', {
          body: 'You will receive timely alerts for upcoming tasks.'
        });
      }
    }
  };

  const handleExportJSON = () => {
    storageService.exportJSON(tasks);
  };

  const handleExportCSV = () => {
    storageService.exportCSV(tasks);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          onImportTasks(imported);
          alert(`Successfully imported ${imported.length} tasks!`);
          onClose();
        } else {
          alert('Invalid file format. Please upload a valid JSON task export.');
        }
      } catch {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div 
        className="modal-glass-container settings-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="modal-header-row">
          <div className="settings-header-title">
            <SettingsIcon size={18} className="text-indigo" />
            <h3 className="modal-title">Settings & Preferences</h3>
          </div>
          <button className="modal-close-icon-btn" onClick={onClose}>
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="settings-modal-body">
          <div className="settings-group-box">
            <div className="settings-box-header-row">
              <h4 className="settings-group-title">
                <UserIcon size={16} className="text-indigo" /> User Profile & Personalization
              </h4>
              <span className="profile-strength-badge">
                {getProfileCompletion(user)}% Complete
              </span>
            </div>

            <div className="settings-avatar-row">
              <div className="settings-avatar-preview">
                {user.avatarImage ? (
                  <img src={user.avatarImage} alt={user.name || "User"} className="avatar-preview-img" />
                ) : (
                  <div className="avatar-preview-initials">{getInitials(name || user.name || 'User')}</div>
                )}
              </div>

              <div className="settings-avatar-meta">
                <span className="avatar-meta-title">Personal Avatar</span>
                <span className="avatar-meta-sub">Photo or automatic initials: <strong>{getInitials(name || user.name || 'User')}</strong></span>
                <div className="settings-avatar-buttons">
                  <button 
                    type="button" 
                    className="btn-upload-photo-sm"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    <UploadIcon size={13} /> {user.avatarImage ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  {user.avatarImage && (
                    <button 
                      type="button" 
                      className="btn-remove-photo-sm"
                      onClick={handleRemovePhoto}
                    >
                      <TrashIcon size={13} /> Remove
                    </button>
                  )}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="settings-profile-form">
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">
                    Full Name <span className="text-red">*</span>
                  </label>
                  <span className="char-counter">{name.length}/30</span>
                </div>
                <input
                  type="text"
                  className={`form-input ${nameError ? 'input-error' : ''}`}
                  placeholder="e.g. Anurag Kumar"
                  value={name}
                  onChange={handleNameChange}
                  maxLength={30}
                  required
                />
                {nameError ? (
                  <span className="error-hint-msg">{nameError}</span>
                ) : (
                  <span className="form-hint">Displayed in greetings, headers, and dashboard metrics.</span>
                )}
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">Role / Job Title</label>
                  <span className="char-counter">{role.length}/40</span>
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Lead Architect, Software Engineer..."
                  value={role}
                  onChange={(e) => {
                    if (e.target.value.length <= 40) setRole(e.target.value);
                  }}
                  maxLength={40}
                />
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">Bio / Daily Focus</label>
                  <span className="char-counter">{bio.length}/90</span>
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Focusing on high-impact goals 🚀"
                  value={bio}
                  onChange={(e) => {
                    if (e.target.value.length <= 90) setBio(e.target.value);
                  }}
                  maxLength={90}
                />
              </div>

              <div className="profile-form-footer">
                <button type="submit" className="btn-save-profile">
                  <CheckIcon size={14} /> Save Profile
                </button>
                {isSavedRecently && (
                  <span className="profile-saved-tag">
                    <CheckIcon size={12} /> Saved successfully!
                  </span>
                )}
              </div>
            </form>
          </div>

          <div className="settings-group-box">
            <h4 className="settings-group-title">Appearance & Theme</h4>
            <div className="settings-row-item">
              <div>
                <span className="settings-row-label">Interface Mode</span>
                <span className="settings-row-sub">Choose between Dark Obsidian or Clean Paper themes</span>
              </div>
              <button 
                type="button" 
                className="btn-theme-toggle-settings"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <MoonIcon size={16} /> : <SunIcon size={16} />}
                <span>{theme === 'dark' ? 'Dark Obsidian' : 'Clean Paper'}</span>
              </button>
            </div>
          </div>

          <div className="settings-group-box">
            <h4 className="settings-group-title">Audio & Notifications</h4>
            
            <div className="settings-row-item">
              <div>
                <span className="settings-row-label">Chime Sound Effects</span>
                <span className="settings-row-sub">Play harmonic feedback chimes on task completion & creation</span>
              </div>
              <label className="switch-toggle-label">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={handleSoundToggle}
                />
                <span className="slider-round"></span>
              </label>
            </div>

            <div className="settings-row-item">
              <div>
                <span className="settings-row-label">Desktop Notifications</span>
                <span className="settings-row-sub">Receive timely alerts when scheduled deadlines arrive</span>
              </div>
              <label className="switch-toggle-label">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={handleNotificationsToggle}
                />
                <span className="slider-round"></span>
              </label>
            </div>
          </div>

          <div className="settings-group-box">
            <h4 className="settings-group-title">Data Backup, Export & Reset</h4>
            <p className="settings-section-desc">
              All tasks and preferences are securely persisted in your browser's local sandbox storage.
            </p>

            <div className="settings-actions-grid">
              <button 
                type="button" 
                className="btn-data-action"
                onClick={handleExportJSON}
              >
                <DownloadIcon size={15} />
                <span>Export JSON Backup</span>
              </button>

              <button 
                type="button" 
                className="btn-data-action"
                onClick={handleExportCSV}
              >
                <DownloadIcon size={15} />
                <span>Export Spreadsheet (CSV)</span>
              </button>

              <button 
                type="button" 
                className="btn-data-action"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon size={15} />
                <span>Import JSON Tasks</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <button 
                type="button" 
                className="btn-data-action danger"
                onClick={() => {
                  if (confirm('Reset workspace to initial sample tasks? This replaces existing task records.')) {
                    onResetTasks(INITIAL_SEED_TASKS);
                    onClose();
                  }
                }}
              >
                <TrashIcon size={15} />
                <span>Reset to Seed Workspace</span>
              </button>
            </div>
          </div>

          <div className="settings-group-box meta">
            <div className="app-info-row">
              <span className="app-info-title">Things To Do v2.4.0</span>
              <span className="app-info-sub">React 19 • Local Storage Engine • Zero External Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

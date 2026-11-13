import { useState, useRef } from 'react';
import {
  CloseIcon,
  UploadIcon,
  TrashIcon,
  MoonIcon,
  SunIcon,
  SparklesIcon,
  CheckIcon,
  UserIcon
} from '../ui/Icons';
import { getInitials, getProfileCompletion } from '../../utils/userUtils';

export default function ProfileModal({
  isOpen,
  onClose,
  user,
  onSaveUser,
  theme,
  toggleTheme,
  onShowToast
}) {
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarImage, setAvatarImage] = useState(user?.avatarImage || null);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleNameChange = (e) => {
    const val = e.target.value;
    if (val.length <= 30) {
      setName(val);
      if (val.trim()) {
        setErrorMessage('');
      }
    }
  };

  const handleRoleChange = (e) => {
    if (e.target.value.length <= 40) {
      setRole(e.target.value);
    }
  };

  const handleBioChange = (e) => {
    if (e.target.value.length <= 90) {
      setBio(e.target.value);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert('Image size exceeds 3MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    // Validation 1: Name cannot be empty
    if (!trimmedName) {
      setErrorMessage('Name cannot be empty. Please enter your name.');
      return;
    }

    // Validation 2: Max 30 characters
    if (trimmedName.length > 30) {
      setErrorMessage('Name cannot exceed 30 characters.');
      return;
    }

    const updatedUser = {
      ...user,
      name: trimmedName,
      role: role.trim() || 'Productivity Enthusiast',
      bio: bio.trim(),
      avatarImage: avatarImage,
      avatarText: getInitials(trimmedName)
    };

    onSaveUser(updatedUser);
    onClose();

    if (onShowToast) {
      onShowToast(`Profile updated! Welcome, ${trimmedName} 👋`);
    }
  };

  const previewUser = {
    name: name.trim() || 'User',
    role: role.trim(),
    bio: bio.trim(),
    avatarImage
  };
  const completionPercent = getProfileCompletion(previewUser);
  const initials = getInitials(name || 'User');

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div 
        className="modal-glass-container profile-settings-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header-row">
          <div className="profile-modal-header-title">
            <div className="profile-icon-halo">
              <UserIcon size={18} className="text-indigo" />
            </div>
            <div>
              <h3 className="modal-title">Profile Settings</h3>
              <span className="modal-subtext">Personalize your identity across Things To Do</span>
            </div>
          </div>
          <button className="modal-close-icon-btn" onClick={onClose} aria-label="Close dialog">
            <CloseIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-modal-form">
          {/* Avatar & Photo Upload Section */}
          <div className="profile-avatar-row">
            <div className="avatar-preview-wrap">
              {avatarImage ? (
                <img 
                  src={avatarImage} 
                  alt={name || "User Avatar"} 
                  className="profile-photo-img" 
                />
              ) : (
                <div className="profile-initials-avatar">
                  {initials}
                </div>
              )}
            </div>

            <div className="avatar-controls-col">
              <span className="avatar-row-title">Profile Picture</span>
              <span className="avatar-row-sub">Upload a custom photo or use your generated initials: <strong>{initials}</strong></span>
              
              <div className="avatar-btns-group">
                <button
                  type="button"
                  className="btn-upload-photo"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon size={14} />
                  <span>{avatarImage ? 'Change Photo' : 'Upload Photo'}</span>
                </button>

                {avatarImage && (
                  <button
                    type="button"
                    className="btn-remove-photo"
                    onClick={handleRemovePhoto}
                    title="Remove custom photo and use initials"
                  >
                    <TrashIcon size={14} />
                    <span>Remove</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>
          </div>

          {/* Profile Completion Indicator */}
          <div className="profile-completion-box">
            <div className="completion-meta-row">
              <span className="completion-title">
                <SparklesIcon size={14} className="text-amber" /> Profile Strength
              </span>
              <span className="completion-percent">{completionPercent}%</span>
            </div>
            <div className="completion-track">
              <div 
                className={`completion-fill ${completionPercent === 100 ? 'complete' : ''}`}
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          {/* Name Field with Live Validation */}
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="profile-name-input">
                Your Name <span className="text-red">*</span>
              </label>
              <span className={`char-counter ${name.length === 30 ? 'text-amber' : ''}`}>
                {name.length}/30
              </span>
            </div>
            <input
              id="profile-name-input"
              type="text"
              className={`form-input-lg ${errorMessage ? 'input-error' : ''}`}
              placeholder="e.g. Anurag Kumar"
              value={name}
              onChange={handleNameChange}
              maxLength={30}
              required
              autoFocus
            />
            {errorMessage ? (
              <span className="error-hint-msg">{errorMessage}</span>
            ) : (
              <span className="form-hint">Shown in greetings, dashboards, and profile badges.</span>
            )}
          </div>

          {/* Role / Job Title Field */}
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="profile-role-input">
                Job Title / Specialty
              </label>
              <span className="char-counter">{role.length}/40</span>
            </div>
            <input
              id="profile-role-input"
              type="text"
              className="form-input"
              placeholder="e.g. Software Engineer, Lead Architect, Student..."
              value={role}
              onChange={handleRoleChange}
              maxLength={40}
            />
          </div>

          {/* Bio / Status Message Field */}
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="profile-bio-input">
                Bio / Daily Focus Status
              </label>
              <span className="char-counter">{bio.length}/90</span>
            </div>
            <input
              id="profile-bio-input"
              type="text"
              className="form-input"
              placeholder="e.g. Building scalable web systems 🚀"
              value={bio}
              onChange={handleBioChange}
              maxLength={90}
            />
          </div>

          {/* Theme Quick Toggle */}
          <div className="profile-theme-quick-row">
            <div className="theme-toggle-info">
              <span className="theme-toggle-label">Appearance Preference</span>
              <span className="theme-toggle-sub">Currently in {theme === 'dark' ? 'Dark Obsidian' : 'Clean Paper'} Mode</span>
            </div>
            <button
              type="button"
              className="btn-theme-quick"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <MoonIcon size={15} /> : <SunIcon size={15} />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          {/* Modal Actions Footer */}
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
              <CheckIcon size={15} />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

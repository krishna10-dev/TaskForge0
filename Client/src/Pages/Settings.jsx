import React, { useState, useEffect, useRef } from 'react';
import { getUserProfile, updateUserProfile, uploadFile } from '../api';
import './Settings.css';

// Reusable Top Navigation Component
const SettingsTopNav = ({ user }) => (
  <header className="dashboard-top-nav">
    <div className="dashboard-nav-left">
      <div className="dashboard-search-container">
        <span className="material-symbols-outlined dashboard-search-icon">search</span>
        <input className="dashboard-search-input" placeholder="Search settings..." type="text" />
      </div>
    </div>
    <div className="dashboard-nav-right">
      <button className="dashboard-nav-icon-btn">
        <span className="material-symbols-outlined">notifications</span>
      </button>
      <button className="dashboard-nav-icon-btn">
        <span className="material-symbols-outlined">settings</span>
      </button>
      <div className="dashboard-nav-divider"></div>
      <div className="dashboard-user-profile">
        <div className="dashboard-user-info">
          <p className="dashboard-user-name">{user?.username || 'User'}</p>
          <p className="dashboard-user-role">{user?.jobTitle || 'Role'}</p>
        </div>
        <div className="dashboard-user-avatar">
          <img alt="User profile" src={user?.avatar || 'https://via.placeholder.com/150'} />
        </div>
      </div>
    </div>
  </header>
);

// Reusable Sidebar Link Component
const SettingsMenuLink = ({ icon, label, active = false, logout = false, onClick }) => (
  <a 
    href="#" 
    className={`dashboard-menu-link ${active ? 'dashboard-menu-link-active' : ''} ${logout ? 'dashboard-logout-link' : ''}`}
    onClick={(e) => {
      e.preventDefault();
      onClick && onClick();
    }}
  >
    <span className="material-symbols-outlined">{icon}</span>
    <span className="dashboard-menu-label">{label}</span>
  </a>
);

const Settings = () => {
  const [activeSettingTab, setActiveSettingTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', jobTitle: '', avatar: '' });
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserProfile();
        setUser(data);
        setFormData({
          username: data.username,
          email: data.email,
          jobTitle: data.jobTitle || 'Senior Project Orchestrator',
          avatar: data.avatar || 'https://via.placeholder.com/150'
        });
      } catch (error) {
        console.error('Failed to load profile', error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append('file', file);

    try {
      const { data: fileUrl } = await uploadFile(fileData);
      setFormData({ ...formData, avatar: `http://localhost:5000${fileUrl}` });
    } catch (err) {
      console.error("Error uploading avatar", err);
      alert('Failed to upload avatar.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data } = await updateUserProfile(formData);
      setUser(data);
      
      // Update localStorage so dashboard stays in sync
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const updatedUserInfo = { ...userInfo, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderSettingContent = () => {
    if (!user) return <p>Loading profile...</p>;

    switch (activeSettingTab) {
      case 'profile':
        return (
          <div className="settings-profile-view">
            <header className="settings-view-header">
              <h1 className="settings-view-title">Profile Settings</h1>
              <p className="settings-view-subtitle">Update your personal information and application preferences.</p>
            </header>

            <div className="settings-grid">
              <div className="settings-avatar-col">
                <div className="avatar-upload-group">
                  <div className="avatar-preview-box" onClick={() => fileInputRef.current.click()}>
                    <img 
                      alt="Profile avatar" 
                      src={formData.avatar} 
                    />
                    <div className="avatar-overlay">
                      <span className="material-symbols-outlined">photo_camera</span>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleAvatarUpload} />
                  <button className="change-photo-btn" onClick={() => fileInputRef.current.click()}>Change Photo</button>
                </div>
              </div>

              <div className="settings-form-col">
                <div className="settings-section">
                  <div className="section-header-row">
                    <div className="header-accent"></div>
                    <h3 className="section-label">Personal Information</h3>
                  </div>
                  <div className="settings-form-grid">
                    <div className="form-group">
                      <label>Full Name / Username</label>
                      <input type="text" name="username" value={formData.username} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Job Title</label>
                      <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
                    </div>
                    <div className="form-group full-width">
                      <label>Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <div className="section-header-row">
                    <div className="header-accent"></div>
                    <h3 className="section-label">Preferences</h3>
                  </div>
                  <div className="preferences-list">
                    <div className="preference-item">
                      <div className="pref-info">
                        <p className="pref-title">Interface Theme</p>
                        <p className="pref-desc">Switch between light and dark visual modes</p>
                      </div>
                      <div className="theme-toggle-group">
                        <button className="theme-btn active">
                          <span className="material-symbols-outlined">light_mode</span>
                          Light
                        </button>
                        <button className="theme-btn">
                          <span className="material-symbols-outlined">dark_mode</span>
                          Dark
                        </button>
                      </div>
                    </div>

                    <div className="preference-item">
                      <div className="pref-info">
                        <p className="pref-title">Language</p>
                        <p className="pref-desc">Preferred language for the dashboard</p>
                      </div>
                      <select className="settings-select">
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>German</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="settings-actions">
                  <button className="action-btn-cancel" onClick={() => setFormData({ ...user })}>Cancel</button>
                  <button className="action-btn-save" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="settings-placeholder">This settings section is coming soon.</div>;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="dashboard-side-nav">
        <div className="dashboard-brand-section">
          <div className="dashboard-brand-icon-box">
            <span className="material-symbols-outlined">precision_manufacturing</span>
          </div>
          <div>
            <h2 className="dashboard-brand-title">Precision</h2>
            <p className="dashboard-brand-subtitle">Orchestrator v1.0</p>
          </div>
        </div>
        
        <nav className="dashboard-side-menu">
          <div className="menu-group-label">General</div>
          <SettingsMenuLink 
            icon="dashboard" 
            label="Back to Dashboard" 
            onClick={() => window.location.href = '/dashboard'}
          />
          
          <div className="menu-group-label" style={{ marginTop: '24px' }}>Account Settings</div>
          <SettingsMenuLink 
            icon="person" 
            label="Profile" 
            active={activeSettingTab === 'profile'}
            onClick={() => setActiveSettingTab('profile')}
          />
          <SettingsMenuLink 
            icon="notifications" 
            label="Notifications" 
            active={activeSettingTab === 'notifications'}
            onClick={() => setActiveSettingTab('notifications')}
          />
          <SettingsMenuLink 
            icon="shield" 
            label="Security" 
            active={activeSettingTab === 'security'}
            onClick={() => setActiveSettingTab('security')}
          />
          <SettingsMenuLink 
            icon="group" 
            label="Team" 
            active={activeSettingTab === 'team'}
            onClick={() => setActiveSettingTab('team')}
          />
          <SettingsMenuLink 
            icon="payments" 
            label="Billing" 
            active={activeSettingTab === 'billing'}
            onClick={() => setActiveSettingTab('billing')}
          />
        </nav>
        
        <div className="dashboard-side-footer">
          <SettingsMenuLink icon="help" label="Support" />
          <SettingsMenuLink icon="logout" label="Logout" logout onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }} />
        </div>
      </aside>

      <div className="dashboard-main-container">
        <SettingsTopNav user={user} />
        <main className="dashboard-scroll-content">
          <div className="settings-page-wrapper">
            {renderSettingContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;

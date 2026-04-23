import React, { useState, useEffect, useRef } from 'react';
import { getUserProfile, updateUserProfile, uploadFile } from '../api';
import './Settings.css';

const Settings = ({ onProfileUpdate, searchQuery = '' }) => {
  const [activeSettingTab, setActiveSettingTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', jobTitle: '', avatar: '' });
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const navItems = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'security', label: 'Security', icon: 'shield' },
    { id: 'team', label: 'Team', icon: 'group' },
    { id: 'billing', label: 'Billing', icon: 'payments' },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserProfile();
        setUser(data);
        setFormData({
          username: data.username,
          email: data.email,
          jobTitle: data.jobTitle || 'Senior Project Orchestrator',
          avatar: data.avatar || ''
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
      const fullUrl = `http://localhost:5000${fileUrl}`;
      setFormData({ ...formData, avatar: fullUrl });
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
      
      // Notify parent component (Dashboard) if callback provided
      if (onProfileUpdate) {
        onProfileUpdate(updatedUserInfo);
      }
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderSettingContent = () => {
    if (!user) return <div className="settings-placeholder">Loading profile...</div>;

    switch (activeSettingTab) {
      case 'profile':
        return (
          <div className="settings-profile-view">
            <header className="settings-view-header">
              <h1 className="settings-view-title">Profile Settings</h1>
              <p className="settings-view-subtitle">Update your personal information and application preferences.</p>
            </header>

            <div className="settings-grid">
              {/* Profile Avatar Section */}
              <div className="settings-avatar-col">
                <div className="avatar-upload-group">
                  <div className="avatar-preview-box" onClick={() => fileInputRef.current.click()}>
                    <img 
                      alt="Profile avatar" 
                      src={formData.avatar || 'https://via.placeholder.com/150'} 
                    />
                    <div className="avatar-overlay">
                      <span className="material-symbols-outlined">photo_camera</span>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleAvatarUpload} />
                  <button className="change-photo-btn" onClick={() => fileInputRef.current.click()}>Change Photo</button>
                </div>
              </div>

              {/* Information Forms */}
              <div className="settings-form-col">
                {/* Personal Info */}
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

                {/* Preferences */}
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

                {/* Actions */}
                <div className="settings-actions">
                  <button className="action-btn-cancel" onClick={() => setFormData({
                    username: user.username,
                    email: user.email,
                    jobTitle: user.jobTitle,
                    avatar: user.avatar
                  })}>Cancel</button>
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
    <div className="settings-container">
      <div className="settings-layout">
        {/* Settings Sidebar */}
        <aside className="settings-sidebar">
          <div className="settings-sidebar-header">
            <h2 className="settings-sidebar-title">Settings</h2>
            <p className="settings-sidebar-subtitle">Manage your workspace</p>
          </div>
          <nav className="settings-nav">
            {filteredNavItems.map(item => (
              <button 
                key={item.id}
                className={`settings-nav-item ${activeSettingTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveSettingTab(item.id)}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            {filteredNavItems.length === 0 && (
              <p style={{ padding: '20px', color: '#64748b', fontSize: '13px' }}>
                No settings found matching "{searchQuery}"
              </p>
            )}
          </nav>
          <div className="settings-sidebar-footer">
            <button className="settings-nav-item">
              <span className="material-symbols-outlined">contact_support</span>
              <span>Support</span>
            </button>
            <button className="settings-nav-item logout">
              <span className="material-symbols-outlined">logout</span>
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* Settings Content */}
        <main className="settings-content">
          {renderSettingContent()}
        </main>
      </div>
    </div>
  );
};

export default Settings;

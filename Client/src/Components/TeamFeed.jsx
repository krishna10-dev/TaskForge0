import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { getActivities, createActivity, uploadFile } from '../api';
import './TeamFeed.css';

// Reusable Activity Card Component
const ActivityCard = ({ user, action, target, time, type, content, metadata }) => {
  const getBorderColor = () => {
    switch (type) {
      case 'comment': return 'var(--dashboard-on-primary-container)';
      case 'file': return 'var(--dashboard-on-tertiary-container)';
      case 'complete': return '#14b8a6';
      default: return 'var(--dashboard-primary)';
    }
  };

  return (
    <article className="team-activity-card animate-in">
      <div className="activity-card-accent" style={{ backgroundColor: getBorderColor() }}></div>
      <div className="activity-card-layout">
        <div className="activity-user-avatar">
          <img alt={user?.name || user?.username || 'User'} src={user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsv-yFtmJlBEK4j2N927v6zDGTRfMBWveVV0-0SxXy5ECZ20OVMmu7M1j53cdFJQetDxT2UPhtmXP8kNDIiA5EC2uaPdBVAk5iRWsOfC3O3WmaA6pgGyg64bVLlIzx7sPVqyNGYuDX6Ehe9GpC0EkYWLCxOq3GOL5kf3Llmh_HQpoB91kXaxidG0IzP5vg_A9MO6ULfp4_QaVffY2v5kXINuFZuXa9gy1_xEEePqk68nS1MrZ-_iY5FFRNo_D3vRZ7oBW6XK-SA-RN'} />
        </div>
        <div className="activity-main-content">
          <div className="activity-header-row">
            <p className="activity-description">
              <span className="activity-user-name">{user?.name || user?.username || 'User'}</span>
              <span className="activity-action-text">{action}</span>
              <span className="activity-target-link">{target}</span>
            </p>
            <span className="activity-timestamp">{time}</span>
          </div>

          {type === 'comment' && (
            <div className="activity-comment-box">
              <p>{content}</p>
            </div>
          )}

          {type === 'file' && (
            <div className="activity-file-attachment">
              <div className="file-icon-box">
                <span className="material-symbols-outlined">description</span>
              </div>
              <div className="file-info">
                <p className="file-name">{metadata?.fileName}</p>
                <p className="file-meta">{metadata?.fileSize} • {metadata?.fileType}</p>
              </div>
              {metadata?.fileUrl && (
                <a href={`http://localhost:5000${metadata.fileUrl}`} target="_blank" rel="noopener noreferrer" className="material-symbols-outlined file-download-btn">download</a>
              )}
            </div>
          )}

          {type === 'complete' && (
            <div className="activity-completion-status" style={{ 
              backgroundColor: '#f0fdfa', 
              border: '1px solid #5eead4', 
              padding: '12px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span className="material-symbols-outlined" style={{ color: '#14b8a6', fontSize: '24px' }}>verified</span>
              <div>
                <p style={{ margin: 0, fontWeight: '600', color: '#0f766e', fontSize: '14px' }}>Objective Finalized</p>
                <p style={{ margin: 0, color: '#134e4a', fontSize: '13px' }}>{content}</p>
              </div>
            </div>
          )}

          <div className="activity-footer-meta" style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            {metadata?.project && (
              <span className="project-badge" style={{ 
                backgroundColor: '#f1f5f9', 
                color: '#64748b', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontSize: '11px',
                fontWeight: '600'
              }}>
                #{metadata.project.replace(/\s+/g, '-')}
              </span>
            )}
            {metadata?.priority && (
              <span className={`priority-pill priority-${metadata.priority.toLowerCase()}`}>
                <span className="priority-dot"></span>
                {metadata.priority}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

// Reusable Sidebar Section Component
const SidebarSection = ({ title, badge, children }) => (
  <section className="feed-sidebar-section">
    <div className="sidebar-section-header">
      <h4 className="sidebar-section-title">{title}</h4>
      {badge && <span className="sidebar-section-badge">{badge}</span>}
    </div>
    <div className="sidebar-section-content">
      {children}
    </div>
  </section>
);

const TeamFeed = ({ searchQuery = '' }) => {
  const [filter, setFilter] = useState('All');
  const [newComment, setNewComment] = useState('');
  const [activities, setActivities] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await getActivities();
        const formattedData = data.map(act => ({
          ...act,
          time: new Date(act.createdAt).toLocaleString(),
          user: act.User || { name: 'Unknown' }
        }));
        setActivities(formattedData);
      } catch (err) {
        console.error("Error fetching activities", err);
      }
    };
    fetchActivities();

    const socket = io('http://localhost:5000');
    socket.on('new_activity', (act) => {
      const formattedAct = {
        ...act,
        time: 'Just now',
        user: act.User || { name: 'Unknown' }
      };
      setActivities(prev => [formattedAct, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createActivity({
        type: "comment",
        action: "posted an update to",
        target: "General",
        content: newComment,
        metadata: { priority: "Low" }
      });
      setNewComment('');
    } catch (err) {
      console.error("Error posting comment", err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data: fileUrl } = await uploadFile(formData);
      
      await createActivity({
        type: "file",
        action: "attached a file to",
        target: "General",
        content: `Uploaded ${file.name}`,
        metadata: {
          fileName: file.name,
          fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          fileType: file.type.split('/')[1] || 'Unknown',
          fileUrl: fileUrl,
          priority: "Medium"
        }
      });
    } catch (err) {
      console.error("Error uploading file", err);
      alert('Error uploading file. Make sure it is a supported type.');
    }
  };

  const filteredActivities = activities.filter(act => {
    const matchesFilter = filter === 'All' || 
                         (filter === 'Comments' && act.type === 'comment') ||
                         (filter === 'Files' && act.type === 'file') ||
                         (filter === 'Tasks' && act.type === 'complete');
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
                          act.content?.toLowerCase().includes(searchLower) || 
                          act.action?.toLowerCase().includes(searchLower) ||
                          act.target?.toLowerCase().includes(searchLower) ||
                          act.user?.username?.toLowerCase().includes(searchLower) ||
                          act.user?.name?.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="team-feed-container">
      <div className="team-feed-layout">
        <section className="central-feed-column">
          <header className="feed-welcome-header">
            <h1 className="feed-title">Team Activity</h1>
            <p className="feed-subtitle">Synchronized collaboration.</p>
          </header>

          {/* New Post Input */}
          <div className="feed-post-container">
            <form onSubmit={handlePostComment} className="feed-post-box">
              <textarea 
                placeholder="Share an update on Core Engine or Infrastructure..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <div className="feed-post-actions">
                <div className="post-tools">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleFileUpload} 
                  />
                  <button type="button" className="material-symbols-outlined" onClick={() => fileInputRef.current.click()}>attach_file</button>
                  <button type="button" className="material-symbols-outlined">alternate_email</button>
                  <button type="button" className="material-symbols-outlined">mood</button>
                </div>
                <button type="submit" className="feed-submit-btn" disabled={!newComment.trim()}>
                  Post Update
                </button>
              </div>
            </form>
          </div>

          {/* Feed Filters */}
          <div className="feed-filter-bar">
            {['All', 'Comments', 'Files', 'Tasks'].map(f => (
              <button 
                key={f} 
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="activity-stream">
            {filteredActivities.length > 0 ? (
              filteredActivities.map(act => (
                <ActivityCard key={act.id} {...act} />
              ))
            ) : (
              <div className="empty-feed">
                <span className="material-symbols-outlined">cloud_off</span>
                <p>No activity found for this filter.</p>
              </div>
            )}
          </div>
        </section>

        <aside className="feed-supplemental-sidebar">
          <SidebarSection title="Project Presence" badge="Active">
            <div className="presence-list">
              {[
                { name: "Tokyo Node", status: "Optimizing", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsv-yFtmJlBEK4j2N927v6zDGTRfMBWveVV0-0SxXy5ECZ20OVMmu7M1j53cdFJQetDxT2UPhtmXP8kNDIiA5EC2uaPdBVAk5iRWsOfC3O3WmaA6pgGyg64bVLlIzx7sPVqyNGYuDX6Ehe9GpC0EkYWLCxOq3GOL5kf3Llmh_HQpoB91kXaxidG0IzP5vg_A9MO6ULfp4_QaVffY2v5kXINuFZuXa9gy1_xEEePqk68nS1MrZ-_iY5FFRNo_D3vRZ7oBW6XK-SA-RN" },
                { name: "Auth Engine", status: "Testing JWT", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOzVqqT0TAJJRLJPeaGGUEuU4HYKIReupg9vf3oPs1rgJ6IIc6R7bftxgbCB7WPsug6w_pcV6EGgrkeee8WxvttfitEvSGdaofkdq4UuRbq5uAXqUS8o0Tsd2K1osTUlnOs625ipsIXmut2BEriA6qimx2mVEqjCUlJWmQHylD-3xo1_cQo-BADX8J1bzBKhtzZKBTXeUx-PdHpxOAiavxi-3i_1oipZGgkBYA6l0seadt767crP8vqbjPpUrLV3Fuco2RG8ZgGaGM" }
              ].map((user, i) => (
                <div className="presence-item" key={i}>
                  <div className="presence-avatar-wrapper">
                    <img src={user.avatar} alt={user.name} />
                    <div className="status-dot online"></div>
                  </div>
                  <div className="presence-info">
                    <p className="presence-name">{user.name}</p>
                    <p className="presence-status">{user.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </SidebarSection>

          <SidebarSection title="Trending Ecosystem">
            <div className="trending-list">
              {[
                { name: "#Infrastructure", val: 65, color: "var(--dashboard-on-tertiary-container)" },
                { name: "#UI-Revamp", val: 32, color: "var(--dashboard-primary)" },
                { name: "#Security-2.0", val: 100, color: "#14b8a6" }
              ].map((t, i) => (
                <div className="trending-item" key={i}>
                  <p className="trending-name">{t.name}</p>
                  <div className="trending-progress-bar">
                    <div className="progress-fill" style={{ width: `${t.val}%`, backgroundColor: t.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </SidebarSection>
        </aside>
      </div>
    </div>
  );
};

export default TeamFeed;

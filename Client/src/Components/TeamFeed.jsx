import React from 'react';
import './TeamFeed.css';

// Reusable Activity Card Component
const ActivityCard = ({ user, action, target, time, type, content, metadata }) => {
  const getGradient = () => {
    switch (type) {
      case 'comment': return 'from-primary to-primary-container';
      case 'file': return 'from-on-tertiary-container to-tertiary-container';
      case 'complete': return 'from-tertiary-fixed-dim to-tertiary-container';
      default: return 'from-primary to-primary-container';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'comment': return 'var(--dashboard-primary)';
      case 'file': return 'var(--dashboard-on-tertiary-container)';
      case 'complete': return 'var(--dashboard-tertiary-fixed-dim)';
      default: return 'var(--dashboard-primary)';
    }
  };

  return (
    <article className="team-activity-card">
      <div className="activity-card-accent" style={{ background: `linear-gradient(to bottom, ${getBorderColor()}, var(--dashboard-tertiary-container))` }}></div>
      <div className="activity-card-layout">
        <div className="activity-user-avatar">
          <img alt={user.name} src={user.avatar} />
        </div>
        <div className="activity-main-content">
          <div className="activity-header-row">
            <p className="activity-description">
              <span className="activity-user-name">{user.name}</span>
              <span className="activity-action-text">{action}</span>
              <a className="activity-target-link" href="#">{target}</a>
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
                <p className="file-name">{metadata.fileName}</p>
                <p className="file-meta">{metadata.fileSize} • {metadata.fileType}</p>
              </div>
              <button className="material-symbols-outlined file-download-btn">download</button>
            </div>
          )}

          {type === 'complete' && (
            <div className="activity-completion-status">
              <span className="material-symbols-outlined">check_circle</span>
              <span>{content}</span>
            </div>
          )}

          <div className="activity-footer-meta">
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

const TeamFeed = () => {
  return (
    <div className="team-feed-container">
      <div className="team-feed-layout">
        {/* Central Feed */}
        <section className="central-feed-column">
          <header className="feed-welcome-header">
            <h1 className="feed-title">Team Activity</h1>
            <p className="feed-subtitle">Real-time collaboration across your active project cycles.</p>
          </header>

          <div className="activity-stream">
            <h3 className="stream-group-label">
              <span>Today</span>
              <div className="label-line"></div>
            </h3>

            <ActivityCard 
              type="comment"
              user={{
                name: "Sarah Chen",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuClg_TZ8VdNhsLx1YXaHoeUK65klYCCSL3u4w31pPZz-9JVFaHuzpluRgcwd08YW_1C8MUqrDWuLMJmVT2j5-I4dQPQiKl2Fdf6ye9j0jzWm2WDv5d-JSWjXKv_iDlA9_-FRed30LVfNoho8vrYnoSHcXGUgr3msIIaSxmAud9QdR9Us-JSWBy0p0gbahHRy2KCKCbGGfKZ_yLo6XWumC4vQ-Q2fOb_Kbvrvzgae0QFxi2Zm1EukRWq_I2aHrJtmqnPsQ3hLe43IlZc"
              }}
              action="commented on"
              target="Q4 Brand Architecture"
              time="2m ago"
              content='"The typography shifts in the latest proposal look solid. We might want to tighten the kerning on the H1 headers for mobile views."'
              metadata={{ priority: "Urgent" }}
            />

            <ActivityCard 
              type="file"
              user={{
                name: "Marcus Wright",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCj2nvAcqNkwhJs9wedVL7_6YWUjPYqM8YqNgE1BBzaCZkGl7JsFKVuLe35WcaNmqXaGtvpJudiOwwe3xjsMsTn2eOQpX6Mx32foLyhr48iXxzeuqrYEjpDiQNcFLq0ixDXEPpF6B6jP0b8DiE7XQIYU8V0Tog_j2WhEP9_o1AkjB1bXZNnC_aYlCL19BguBcQ4r8gMDpMp-uL33jIfDiiYwJUw22D1XM8qGWxihK3xoNSaGhTn2STkgw9AjXQwPYWyOrPfviPRKuKP"
              }}
              action="attached a file to"
              target="Infrastructure Migration"
              time="1h ago"
              metadata={{ 
                fileName: "cloud_arch_final_v2.pdf",
                fileSize: "12.4 MB",
                fileType: "PDF Document",
                priority: "Medium"
              }}
            />

            <ActivityCard 
              type="complete"
              user={{
                name: "Elena Rodriguez",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwNJgedg0UkBa-e97Br85yQDpUXcOhrN2Vt1F_4Do7HPLuHub1cbrqnewElII4EdbujyzRyXkjWzriwh9noKattmg62CwfrvMsShrKA6QUZYizMiUhk5GPl5MbZRRx3YdH36dxWmk-bG-x0I7MZkZYKuwF_O0aBFrapi7Ublo1I5xZtTdlZIHOsGnxKsphLHVI6-Qbv3lYjr6Ofa2T_Qkqu-KdMtU6NLSK5bf6opsUM5PAi6IZI_-Idlxn69a6NfF_Emvcse6OPUvO"
              }}
              action="completed"
              target="Vendor API Integration"
              time="4h ago"
              content="Successfully deployed to production environment"
            />
          </div>
        </section>

        {/* Supplemental Sidebar */}
        <aside className="feed-supplemental-sidebar">
          <SidebarSection title="Team Presence" badge="12 Online">
            <div className="presence-list">
              <div className="presence-item">
                <div className="presence-avatar-wrapper">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsv-yFtmJlBEK4j2N927v6zDGTRfMBWveVV0-0SxXy5ECZ20OVMmu7M1j53cdFJQetDxT2UPhtmXP8kNDIiA5EC2uaPdBVAk5iRWsOfC3O3WmaA6pgGyg64bVLlIzx7sPVqyNGYuDX6Ehe9GpC0EkYWLCxOq3GOL5kf3Llmh_HQpoB91kXaxidG0IzP5vg_A9MO6ULfp4_QaVffY2v5kXINuFZuXa9gy1_xEEePqk68nS1MrZ-_iY5FFRNo_D3vRZ7oBW6XK-SA-RN" alt="User" />
                  <div className="status-dot online"></div>
                </div>
                <div className="presence-info">
                  <p className="presence-name">Jordan Lee</p>
                  <p className="presence-status">Focusing • Deep Work</p>
                </div>
              </div>
              <div className="presence-item">
                <div className="presence-avatar-wrapper">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOzVqqT0TAJJRLJPeaGGUEuU4HYKIReupg9vf3oPs1rgJ6IIc6R7bftxgbCB7WPsug6w_pcV6EGgrkeee8WxvttfitEvSGdaofkdq4UuRbq5uAXqUS8o0Tsd2K1osTUlnOs625ipsIXmut2BEriA6qimx2mVEqjCUlJWmQHylD-3xo1_cQo-BADX8J1bzBKhtzZKBTXeUx-PdHpxOAiavxi-3i_1oipZGgkBYA6l0seadt767crP8vqbjPpUrLV3Fuco2RG8ZgGaGM" alt="User" />
                  <div className="status-dot online"></div>
                </div>
                <div className="presence-info">
                  <p className="presence-name">Sarah Chen</p>
                  <p className="presence-status">Active now</p>
                </div>
              </div>
            </div>
          </SidebarSection>

          <SidebarSection title="Pinned Updates">
            <div className="pinned-update-card">
              <div className="pinned-header">
                <span className="material-symbols-outlined">push_pin</span>
                <span className="pinned-label">Critical</span>
              </div>
              <p className="pinned-text">Sprint Retrospective moved to 2:00 PM Thursday.</p>
              <p className="pinned-meta">By Management • 4h ago</p>
            </div>
          </SidebarSection>

          <SidebarSection title="Trending Tasks">
            <div className="trending-list">
              <div className="trending-item">
                <p className="trending-name">#API-Revamp</p>
                <div className="trending-progress-bar">
                  <div className="progress-fill" style={{ width: '80%', backgroundColor: 'var(--dashboard-on-tertiary-container)' }}></div>
                </div>
              </div>
              <div className="trending-item">
                <p className="trending-name">#Design-System-Audit</p>
                <div className="trending-progress-bar">
                  <div className="progress-fill" style={{ width: '25%', backgroundColor: 'var(--dashboard-primary)' }}></div>
                </div>
              </div>
            </div>
          </SidebarSection>
        </aside>
      </div>
    </div>
  );
};

export default TeamFeed;

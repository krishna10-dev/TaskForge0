import React, { useState } from 'react';
import './Dashboard.css';
import MyTasks from '../Components/MyTasks';
import FocusMode from '../Components/FocusMode';
import TeamFeed from '../Components/TeamFeed';

// Asset Imports
import userAvatar from '../assets/user.png';

// Reusable Top Navigation Component
const DashboardTopNav = () => (
  <header className="dashboard-top-nav">
    <div className="dashboard-nav-left">
      <div className="dashboard-search-container">
        <span className="material-symbols-outlined dashboard-search-icon">search</span>
        <input className="dashboard-search-input" placeholder="Search tasks, teams, or projects..." type="text" />
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
          <p className="dashboard-user-name">Marcus Thorne</p>
          <p className="dashboard-user-role">Lead Orchestrator</p>
        </div>
        <div className="dashboard-user-avatar">
          <img alt="User profile" src={userAvatar} />
        </div>
      </div>
    </div>
  </header>
);

// Reusable Sidebar Link Component
const DashboardMenuLink = ({ icon, label, active = false, logout = false, onClick }) => (
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

// Reusable Side Navigation Component
const DashboardSideNav = ({ activeTab, onTabChange }) => (
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
    <button className="dashboard-create-task-btn">
      <span className="material-symbols-outlined">add</span>
      <span>New Task</span>
    </button>
    <nav className="dashboard-side-menu">
      <DashboardMenuLink 
        icon="dashboard" 
        label="Dashboard" 
        active={activeTab === 'dashboard'} 
        onClick={() => onTabChange('dashboard')} 
      />
      <DashboardMenuLink 
        icon="checklist" 
        label="My Tasks" 
        active={activeTab === 'mytasks'} 
        onClick={() => onTabChange('mytasks')} 
      />
      <DashboardMenuLink 
        icon="filter_center_focus" 
        label="Focus Mode" 
        active={activeTab === 'focusmode'} 
        onClick={() => onTabChange('focusmode')} 
      />
      <DashboardMenuLink 
        icon="group" 
        label="Team Feed" 
        active={activeTab === 'teamfeed'} 
        onClick={() => onTabChange('teamfeed')} 
      />
      <DashboardMenuLink icon="analytics" label="Analytics" />
    </nav>
    <div className="dashboard-side-footer">
      <DashboardMenuLink icon="help" label="Help Center" />
      <DashboardMenuLink icon="logout" label="Logout" logout />
    </div>
  </aside>
);

// Reusable Stat Card Component
const DashboardStatCard = ({ icon, label, value, trend, progress, highlight = false }) => (
  <div className={`dashboard-stat-card ${highlight ? 'dashboard-stat-card-highlight' : ''}`}>
    {!highlight ? (
      <>
        <div className="dashboard-stat-header">
          <div className="dashboard-stat-icon-box">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          {trend && <span className="dashboard-trend-pill">{trend}</span>}
        </div>
        <p className="dashboard-stat-label">{label}</p>
        <h3 className="dashboard-stat-value">{value}</h3>
        {progress && (
          <div className="dashboard-stat-progress-container">
            <div className="dashboard-stat-progress-bar" style={{ width: progress }}></div>
          </div>
        )}
      </>
    ) : (
      <div className="dashboard-highlight-content">
        <p className="dashboard-stat-label-alt">{label}</p>
        <h3 className="dashboard-stat-value-alt">{value}</h3>
        <p className="dashboard-highlight-text">You're in the top 2% of performers this week.</p>
        <span className="material-symbols-outlined dashboard-highlight-bg-icon">workspace_premium</span>
      </div>
    )}
  </div>
);

// Reusable Project Card Component
const DashboardProjectCard = ({ title, desc, progress, accentColor, progressColor, team }) => (
  <div className="dashboard-project-card">
    <div className="dashboard-project-accent" style={{ background: accentColor }}></div>
    <div className="dashboard-project-header">
      <div className="dashboard-project-icon-box">
        <span className="material-symbols-outlined">analytics</span>
      </div>
      <div className="dashboard-team-stack">
        {team.map((avatar, idx) => (
          typeof avatar === 'string' ? (
            <img key={idx} alt={`Team ${idx}`} className="dashboard-avatar-stack" src={avatar} />
          ) : (
            <div key={idx} className="dashboard-avatar-stack dashboard-avatar-more">+{avatar}</div>
          )
        ))}
      </div>
    </div>
    <h4 className="dashboard-project-title">{title}</h4>
    <p className="dashboard-project-desc">{desc}</p>
    <div className="dashboard-progress-section">
      <div className="dashboard-progress-labels">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="dashboard-progress-bg">
        <div className="dashboard-progress-fill" style={{ width: `${progress}%`, backgroundColor: progressColor }}></div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <header className="dashboard-welcome-header">
              <div className="dashboard-welcome-text">
                <h1 className="dashboard-welcome-title">Morning, Orchestrator.</h1>
                <p className="dashboard-welcome-subtitle">
                  You have <span className="dashboard-text-highlight">12 priority tasks</span> requiring attention today.
                </p>
              </div>
              <div className="dashboard-header-actions">
                <button className="dashboard-action-btn-secondary">
                  <span className="material-symbols-outlined">filter_list</span>
                  <span>Filter</span>
                </button>
                <button className="dashboard-action-btn-primary">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </header>

            <section className="dashboard-stats-section">
              <DashboardStatCard icon="task_alt" label="Active Tasks" value="124" trend="+12%" progress="75%" />
              <DashboardStatCard icon="trending_up" label="Completion Rate" value="94.2%" trend="+8%" />
              <DashboardStatCard icon="event_busy" label="Deadlines Today" value="3" />
              <DashboardStatCard label="Productivity Score" value="A+" highlight />
            </section>

            <div className="dashboard-content-grid">
              <div className="dashboard-main-col">
                <section className="dashboard-projects-section">
                  <div className="dashboard-section-header">
                    <h2 className="dashboard-section-title">Active Projects</h2>
                    <button className="dashboard-view-all-btn">
                      View all <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                  <div className="dashboard-projects-grid">
                    <DashboardProjectCard 
                      title="Global Scale Expansion"
                      desc="Infrastructure upgrade for EMEA and APAC regions focusing on latency reduction."
                      progress={68}
                      accentColor="linear-gradient(to right, #497cff, #89f5e7)"
                      progressColor="#497cff"
                      team={[
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuCXt4pneFOjcYK7-rgGvWB69pL5Nz4Ibaz0_e9RjQDntQZaXd4e9QKbYCjupGUr-7YpjdKLUXVCblNkuedFb4lwXKs8SEAK09vVcU4E8A9wU_oqG47tqpjvyFVTM48KmNFqtizcN8Se3JPDgKEgORvB8_5W3duXiQqgeI3i8u6EeSXgOsaOhuNlKOcQDCYedlrPHCfx-SLzLRGg6Hy-vvzkVxv7PoYfxDmA9F6XO2iUABwlzLrB90alZI2m11JWMrFZy7rXFi4deBcr",
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDXApJieP8wMOZPgVxfLRaHHAX0IAIyhyz8sXRHzPYav5Rp5etKT0AA3z1eiSE2bg5fjKcEAyGJmpL4lNmgG6v3ZmkQZX9bUlFSWUxB42EWRm81ItjKapcwLjzh1qQ5tjz7rrO_pyR-aZz2Mfvl5lE2-Qev2yMzONgYXRTqecvxDX6KeUdg2_Ud6ZxPSpP5VbXkWyg33MKsADkQde9zkinZfE40kZfNNJDr4uxFSpZouu8hjhmSL_BLzx7HidLGQpVkqBhFGlia1Pwa",
                        4
                      ]}
                    />
                    <DashboardProjectCard 
                      title="Precision UI Revamp"
                      desc="Complete overhaul of the core design system to align with editorial precision standards."
                      progress={32}
                      accentColor="linear-gradient(to right, #89f5e7, #0c9488)"
                      progressColor="#0c9488"
                      team={[
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuCje6mp5oblupn_YX6yMJ7LenjIyCHZy2KO9tleJHyHYLoBXLmdlIsaUhG-qdt-UFAHJZowxnxv785Ai06hmP2XamTrHmGrENNBkq_mO7B_Qm_81ilzH5FEEqcGBptdAIQq9xYm3FQeMHB1bjAMjPPuGzRG_qtjbnhCEaLmVRQrSzb9wES6ZbLKMrLOb6osTxB5HTShVyfs8eKHkhvpQQ6YlffIm9dPiqnCAzee3WzL3cr1upXrhTt_EUhkdcSV0OG__p9ToFEh5JYq",
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuAOeCkIazlK9uZjYAQ-8nvBq8SQGdQDCXSDAZISAc2p60BY6mrQaV6VjDNJNWQjDybwsmE2M0315-RMQak__jF7JmibO_WSwSR_v27_2hL3FGr748JqQq37oebtZx2yxw8qgMe72kzaQRNk_0S_w1-dqRVK4MHTB6v2aEbYz5XRjhk8UX5gEAmO_7A1kOgu9g-I95P8RIwGO2_UBd1Z7DOgK76di7mfkuI6HM_Q4VtvDuS5GVRaUJiC6SJ6R4QNZSxqxKsN4lkyJw4e"
                      ]}
                    />
                  </div>
                </section>
              </div>

              <aside className="dashboard-activity-column">
                <div className="dashboard-activity-card">
                  <div className="dashboard-section-header">
                    <h2 className="dashboard-section-title">Recent Activity</h2>
                    <button className="dashboard-refresh-btn">Refresh</button>
                  </div>
                  <div className="dashboard-activity-timeline">
                    <div className="dashboard-timeline-item">
                      <div className="dashboard-timeline-icon" style={{ backgroundColor: 'var(--dashboard-on-primary-container)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'white' }}>chat_bubble</span>
                      </div>
                      <div className="dashboard-timeline-content">
                        <p><strong>Sarah Chen</strong> commented on <span className="dashboard-activity-link">API Auth Logic</span></p>
                        <p className="dashboard-timeline-subtext">"Can we double check the token expiration logic?"</p>
                        <span className="dashboard-timeline-time">12 minutes ago</span>
                      </div>
                    </div>
                    <div className="dashboard-timeline-item">
                      <div className="dashboard-timeline-icon" style={{ backgroundColor: 'var(--dashboard-tertiary-fixed-dim)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--dashboard-on-tertiary-container)' }}>check_circle</span>
                      </div>
                      <div className="dashboard-timeline-content">
                        <p><strong>Marcus T.</strong> completed <span className="dashboard-activity-link">User Onboarding Flows</span></p>
                        <span className="dashboard-timeline-time">2 hours ago</span>
                      </div>
                    </div>
                    <div className="dashboard-timeline-item">
                      <div className="dashboard-timeline-icon" style={{ backgroundColor: 'var(--dashboard-error-container)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--dashboard-error)' }}>warning</span>
                      </div>
                      <div className="dashboard-timeline-content">
                        <p><strong className="dashboard-text-error">Urgent Alert</strong>: <span className="dashboard-activity-link">Database Latency</span> spike detected</p>
                        <span className="dashboard-timeline-time">6 hours ago</span>
                      </div>
                    </div>
                  </div>
                  <button className="dashboard-load-more-btn">Load Older Activity</button>
                </div>
              </aside>
            </div>
          </>
        );
      case 'mytasks':
        return <MyTasks />;
      case 'focusmode':
        return <FocusMode />;
      case 'teamfeed':
        return <TeamFeed />;
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <DashboardSideNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="dashboard-main-container">
        <DashboardTopNav />
        <main className="dashboard-scroll-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

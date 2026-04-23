/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getTasks, updateTask } from '../api';
import './Dashboard.css';
import MyTasks from '../Components/MyTasks';
import FocusMode from '../Components/FocusMode';
import TeamFeed from '../Components/TeamFeed';
import Analytics from '../Components/Analytics';
import HelpCenter from '../Components/HelpCenter';
import Settings from '../Components/Settings';
import CreateTask from '../Components/CreateTask';

// Asset Imports
import userAvatar from '../assets/user.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');
const socket = io(SOCKET_URL);

// Reusable Top Navigation Component
const DashboardTopNav = ({ user, searchQuery, setSearchQuery, activeTab }) => {
  const getPlaceholder = () => {
    switch (activeTab) {
      case 'mytasks': return "Search my tasks...";
      case 'helpcenter': return "Search help articles...";
      case 'settings': return "Search settings...";
      default: return "Search tasks, teams, or projects...";
    }
  };

  return (
    <header className="dashboard-top-nav">
      <div className="dashboard-nav-left">
        <div className="dashboard-search-container">
          <span className="material-symbols-outlined dashboard-search-icon">search</span>
          <input 
            className="dashboard-search-input" 
            placeholder={getPlaceholder()} 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="dashboard-nav-right">
        <button className="dashboard-nav-icon-btn">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <Link to="/settings" className="dashboard-nav-icon-btn">
          <span className="material-symbols-outlined">settings</span>
        </Link>
        <div className="dashboard-nav-divider"></div>
        <div className="dashboard-user-profile">
          <div className="dashboard-user-info">
            <p className="dashboard-user-name">{user?.username || 'Guest'}</p>
            <p className="dashboard-user-role">{user?.jobTitle || 'Lead Orchestrator'}</p>
          </div>
          <div className="dashboard-user-avatar">
            <img alt="User profile" src={user?.avatar || userAvatar} />
          </div>
        </div>
      </div>
    </header>
  );
};

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
const DashboardSideNav = ({ activeTab, onTabChange, onCreateTaskOpen, onLogout }) => (
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
    <button className="dashboard-create-task-btn" onClick={onCreateTaskOpen}>
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
      <DashboardMenuLink 
        icon="analytics" 
        label="Analytics" 
        active={activeTab === 'analytics'} 
        onClick={() => onTabChange('analytics')} 
      />
    </nav>
    <div className="dashboard-side-footer">
      <DashboardMenuLink 
        icon="help" 
        label="Help Center" 
        active={activeTab === 'helpcenter'} 
        onClick={() => onTabChange('helpcenter')} 
      />
      <DashboardMenuLink icon="logout" label="Logout" logout onClick={onLogout} />
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
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const tasksRef = useRef([]);



  const fetchTasks = async () => {
    try {
      const { data } = await getTasks();
      setTasks(data);
      tasksRef.current = data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleQuickComplete = async (task) => {
    if (task.status === 'Done') return;
    try {
      await updateTask(task.id, { ...task, status: 'Done', progress: 100 });
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userInfo));
      fetchTasks();
    }

    // Socket listeners for live updates
    const onTaskUpdated = (updatedTask) => {
      setTasks(prevTasks => {
        const index = prevTasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          const newTasks = [...prevTasks];
          newTasks[index] = updatedTask;
          return newTasks;
        }
        return prevTasks;
      });
    };

    const onTaskCreated = (newTask) => {
      setTasks(prevTasks => {
        if (prevTasks.some(t => t.id === newTask.id)) return prevTasks;
        return [newTask, ...prevTasks];
      });
    };

    socket.on('task_updated', onTaskUpdated);
    socket.on('task_created', onTaskCreated);

    return () => {
      socket.off('task_updated', onTaskUpdated);
      socket.off('task_created', onTaskCreated);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  // Filter Logic
  const filteredTasks = tasks.filter(task => {
    const matchStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = task.title.toLowerCase().includes(searchLower) || 
                        (task.description && task.description.toLowerCase().includes(searchLower)) ||
                        (task.project && task.project.toLowerCase().includes(searchLower));
    return matchStatus && matchPriority && matchSearch;
  });

  // Dynamic Stat Calculations
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(t => t.status !== 'Done').length;
  const doneTasks = tasks.filter(t => t.status === 'Done').length;
  const completionRate = totalTasks > 0 ? ((doneTasks / totalTasks) * 100).toFixed(1) : 0;
  
  const today = new Date().toDateString();
  const deadlinesToday = tasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate).toDateString() === today && t.status !== 'Done';
  }).length;

  // Project-based Stats for Distribution
  const projectsData = Array.from(new Set(tasks.map(t => t.project))).map(project => {
    const projectTasks = tasks.filter(t => t.project === project);
    // Calculate overall project progress based on individual task progress
    const totalProgress = projectTasks.reduce((acc, t) => acc + (t.progress || 0), 0);
    const progress = projectTasks.length > 0 ? Math.round(totalProgress / projectTasks.length) : 0;
    
    return {
      title: project,
      progress,
      tasksCount: projectTasks.length,
      accentColor: project === 'Core Engine' ? 'linear-gradient(to right, #497cff, #89f5e7)' : 
                   project === 'Infrastructure' ? 'linear-gradient(to right, #0c9488, #5eead4)' :
                   project === 'UI Revamp' ? 'linear-gradient(to right, #ba1a1a, #ffdad6)' :
                   'linear-gradient(to right, #fbbf24, #fef3c7)',
      progressColor: project === 'Core Engine' ? '#497cff' : 
                     project === 'Infrastructure' ? '#0c9488' :
                     project === 'UI Revamp' ? '#ba1a1a' :
                     '#fbbf24'
    };
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <header className="dashboard-welcome-header">
              <div className="dashboard-welcome-text">
                <h1 className="dashboard-welcome-title">Morning, {user?.username || 'Orchestrator'}.</h1>
                <p className="dashboard-welcome-subtitle">
                  You have <span className="dashboard-text-highlight">{activeTasks} active tasks</span> requiring attention.
                </p>
              </div>
              <div className="dashboard-header-actions">
                <div className="dashboard-filter-group">
                  <select 
                    className="dashboard-filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                  <select 
                    className="dashboard-filter-select"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="All">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <button className="dashboard-action-btn-primary" onClick={() => setIsCreateTaskOpen(true)}>
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </header>

            <section className="dashboard-stats-section">
              <DashboardStatCard 
                icon="task_alt" 
                label="Active Tasks" 
                value={activeTasks} 
                trend={totalTasks > 0 ? `Total: ${totalTasks}` : "No tasks"} 
                progress={`${Math.min((activeTasks / 20) * 100, 100)}%`} 
              />
              <DashboardStatCard 
                icon="trending_up" 
                label="Completion Rate" 
                value={`${completionRate}%`} 
                trend={completionRate > 50 ? "+8%" : "-2%"} 
              />
              <DashboardStatCard 
                icon="event_busy" 
                label="Deadlines Today" 
                value={deadlinesToday} 
              />
              <DashboardStatCard 
                label="Productivity Score" 
                value={completionRate > 80 ? "A+" : completionRate > 50 ? "B" : "C"} 
                highlight 
              />
            </section>

            <div className="dashboard-content-grid">
              <div className="dashboard-main-col">
                <section className="dashboard-projects-section">
                  <div className="dashboard-section-header">
                    <h2 className="dashboard-section-title">Project Streams (Live Tracking)</h2>
                  </div>
                  <div className="dashboard-projects-grid">
                    {projectsData.map((project, idx) => (
                      <DashboardProjectCard 
                        key={idx}
                        title={project.title}
                        desc={`${project.tasksCount} total objectives tracked in this stream.`}
                        progress={project.progress}
                        accentColor={project.accentColor}
                        progressColor={project.progressColor}
                        team={[]}
                      />
                    ))}
                    {projectsData.length === 0 && <p>No project data available.</p>}
                  </div>
                </section>
              </div>

              <aside className="dashboard-activity-column">
                <div className="dashboard-activity-card">
                  <div className="dashboard-section-header">
                    <h2 className="dashboard-section-title">Timeline</h2>
                    <button className="dashboard-refresh-btn" onClick={fetchTasks}>Refresh</button>
                  </div>
                  <div className="dashboard-activity-timeline">
                    {filteredTasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5).map(task => (
                      <div className="dashboard-timeline-item" key={task.id} style={{ opacity: task.status === 'Done' ? 0.7 : 1 }}>
                        <div className="dashboard-timeline-icon" style={{ backgroundColor: task.status === 'Done' ? '#14b8a6' : 'var(--dashboard-on-primary-container)' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'white' }}>{task.status === 'Done' ? 'verified' : 'task'}</span>
                        </div>
                        <div className="dashboard-timeline-content" style={{ flex: 1 }}>
                          <p style={{ textDecoration: task.status === 'Done' ? 'line-through' : 'none' }}><strong>{task.title}</strong></p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                             <p className="dashboard-timeline-subtext">{task.status} • {task.priority}</p>
                             <div style={{ width: '40px', height: '4px', background: '#f1f5f9', borderRadius: '2px' }}>
                               <div style={{ width: `${task.progress || 0}%`, height: '100%', background: '#3b82f6', borderRadius: '2px' }}></div>
                             </div>
                          </div>
                        </div>
                        {task.status !== 'Done' && (
                          <button 
                            className="dashboard-quick-complete-btn" 
                            onClick={() => handleQuickComplete(task)}
                            title="Mark as Done"
                            style={{ 
                              background: '#f2f4f6', 
                              border: 'none', 
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer', 
                              color: '#14b8a6', 
                              marginLeft: '12px' 
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>done</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </>
        );
      case 'mytasks':
        return <MyTasks initialTasks={tasks} searchQuery={searchQuery} onRefresh={fetchTasks} />;
      case 'focusmode':
        return <FocusMode />;
      case 'teamfeed':
        return <TeamFeed searchQuery={searchQuery} />;
      case 'analytics':
        return <Analytics searchQuery={searchQuery} />;
      case 'helpcenter':
        return <HelpCenter searchQuery={searchQuery} />;
      case 'settings':
        return <Settings searchQuery={searchQuery} onProfileUpdate={(updatedUser) => setUser(updatedUser)} />;
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <DashboardSideNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onCreateTaskOpen={() => setIsCreateTaskOpen(true)} 
        onLogout={handleLogout}
      />
      <div className="dashboard-main-container">
        <DashboardTopNav user={user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeTab={activeTab} />
        <main className="dashboard-scroll-content">
          {renderContent()}
        </main>
      </div>
      <CreateTask 
        isOpen={isCreateTaskOpen} 
        onClose={() => setIsCreateTaskOpen(false)} 
        onTaskCreated={fetchTasks}
      />
    </div>
  );
};

export default Dashboard;

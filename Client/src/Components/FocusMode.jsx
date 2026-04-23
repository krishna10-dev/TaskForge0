/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { getTasks, updateTask } from '../api';
import './FocusMode.css';

const FocusMode = () => {
  const [mode, setMode] = useState('Work'); // 'Work', 'Short Break', 'Long Break'
  const [isActive, setIsActive] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showTaskPicker, setShowTaskPicker] = useState(false);
  const [taskSearchQuery, setTaskSearchQuery] = useState('');

  // Load custom durations from localStorage or use defaults
  const [durations, setDurations] = useState(() => {
    const saved = localStorage.getItem('focusDurations');
    return saved ? JSON.parse(saved) : { 'Work': 25, 'Short Break': 5, 'Long Break': 15 };
  });

  const [timeLeft, setTimeLeft] = useState(durations[mode] * 60);
  const [sessionStarted, setSessionStarted] = useState(false);

  const fetchFocusData = async () => {
    try {
      const { data } = await getTasks();
      const pendingTasks = data.filter(t => t.status !== 'Done');
      setTasks(pendingTasks);
      if (pendingTasks.length > 0 && !currentTask) {
        setCurrentTask(pendingTasks[0]);
      }
    } catch (err) {
      console.error('Error fetching tasks for Focus Mode:', err);
    }
  };

  useEffect(() => {
    fetchFocusData();
  }, []);

  // Removed the buggy useEffect that reset timeLeft on pause

  const handleSessionComplete = () => {
    setIsActive(false);
    setSessionStarted(false);
    // Visual or audio feedback could be added here
    alert(`${mode} session complete!`);
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const switchMode = (newMode) => {
    if (isActive && !window.confirm('A session is currently active. Switch anyway?')) {
      return;
    }
    setMode(newMode);
    setTimeLeft(durations[newMode] * 60);
    setIsActive(false);
    setSessionStarted(false);
  };

  const handleDurationChange = (m, value) => {
    const val = parseInt(value) || 1;
    const newDurations = { ...durations, [m]: val };
    setDurations(newDurations);
    localStorage.setItem('focusDurations', JSON.stringify(newDurations));
    
    // If we haven't started the session and we are changing the duration of the current mode, update timeLeft
    if (!sessionStarted && mode === m) {
      setTimeLeft(val * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSession = () => {
    if (!isActive) {
      setSessionStarted(true);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (window.confirm('Reset current session?')) {
      setIsActive(false);
      setSessionStarted(false);
      setTimeLeft(durations[mode] * 60);
    }
  };

  const handleCompleteTask = async () => {
    if (!currentTask) return;
    try {
      await updateTask(currentTask.id, { ...currentTask, status: 'Done' });
      const remaining = tasks.filter(t => t.id !== currentTask.id);
      setTasks(remaining);
      setCurrentTask(remaining.length > 0 ? remaining[0] : null);
      alert('Task marked as completed!');
    } catch {
      alert('Failed to complete task');
    }
  };

  const queueTasks = tasks.filter(t => t.id !== currentTask?.id);

  // Dynamic Focus Protocols based on state
  const getProtocols = () => {
    const workProtocols = [
      { text: "Single-tasking increases output by 40%.", color: "#497cff" },
      { text: "Your brain's peak focus window is roughly 90 minutes.", color: "#00174b" },
      { text: "Eliminate digital clutter. Close unused browser tabs.", color: "#ba1a1a" },
      { text: "Deep work requires zero interruptions. Put your phone away.", color: "#0c9488" }
    ];

    const breakProtocols = [
      { text: "Stay hydrated. Brain function depends on water.", color: "#14b8a6" },
      { text: "Stand up and stretch. Increase blood flow to your prefrontal cortex.", color: "#fbbf24" },
      { text: "Look at something 20 feet away for 20 seconds to reduce eye strain.", color: "#6bd8cb" },
      { text: "Breaks are not rewards; they are essential for cognitive recovery.", color: "#497cff" }
    ];

    const pool = mode === 'Work' ? workProtocols : breakProtocols;
    return pool; // Showing all relevant tips for the current mode
  };

  const activeProtocols = getProtocols();

  return (
    <div className="focus-mode-container">
      {/* Mode Selector & Settings Toggle */}
      <div className="focus-top-controls">
        <div className="focus-mode-selector">
          {Object.keys(durations).map(m => (
            <button 
              key={m} 
              className={`mode-btn ${mode === m ? 'active' : ''}`}
              onClick={() => switchMode(m)}
            >
              {m}
            </button>
          ))}
        </div>
        <button className={`focus-settings-toggle ${showSettings ? 'active' : ''}`} onClick={() => setShowSettings(!showSettings)}>
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="focus-settings-panel">
          {Object.keys(durations).map(m => (
            <div key={m} className="setting-item">
              <label>{m} (min)</label>
              <input 
                type="number" 
                min="1" 
                max="120"
                value={durations[m]} 
                onChange={(e) => handleDurationChange(m, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Timer Section */}
      <section className="focus-timer-section">
        <span className="focus-session-label">{mode} Session</span>
        <h1 className="focus-timer-display">{formatTime(timeLeft)}</h1>
        <div className="focus-timer-controls">
          <button className="focus-control-btn focus-btn-pause" onClick={toggleSession}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isActive ? 'pause_circle' : 'play_circle'}
            </span>
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button className="focus-control-btn" onClick={resetTimer}>
            <span className="material-symbols-outlined">restart_alt</span>
            Reset
          </button>
          <button className="focus-control-btn focus-btn-complete" onClick={handleCompleteTask}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Done
          </button>
        </div>
      </section>

      {/* Current Focus Card */}
      {currentTask ? (
        <div className="focus-task-card">
          <div className="focus-card-blade"></div>
          <div className="focus-card-header">
            <span className="focus-card-label">Current Focus</span>
            <button className="focus-change-btn" onClick={() => setShowTaskPicker(true)}>
              Change Task
            </button>
          </div>
          <h2 className="focus-card-title">{currentTask.title}</h2>
          <div className="focus-card-meta">
            <div className="focus-meta-item">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>account_tree</span>
              {currentTask.project}
            </div>
            <div className="focus-meta-item">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>priority_high</span>
              {currentTask.priority} Priority
            </div>
          </div>
        </div>
      ) : (
        <div className="focus-task-card empty">
          <p>No active tasks to focus on.</p>
          <button className="focus-change-btn" onClick={() => setShowTaskPicker(true)}>Select Task</button>
        </div>
      )}

      {/* Task Picker Modal */}
      {showTaskPicker && (
        <div className="modal-overlay" onClick={() => setShowTaskPicker(false)}>
          <div className="focus-task-picker" onClick={e => e.stopPropagation()}>
            <div className="picker-header">
              <h3>Change Focus</h3>
              <button onClick={() => setShowTaskPicker(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="picker-search" style={{ padding: '0 20px 15px' }}>
              <div className="dashboard-search-container" style={{ width: '100%', background: '#f1f5f9' }}>
                <span className="material-symbols-outlined dashboard-search-icon">search</span>
                <input 
                  className="dashboard-search-input" 
                  placeholder="Search tasks..." 
                  type="text" 
                  value={taskSearchQuery}
                  onChange={(e) => setTaskSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="picker-list">
              {tasks.filter(t => 
                t.title.toLowerCase().includes(taskSearchQuery.toLowerCase()) || 
                t.project.toLowerCase().includes(taskSearchQuery.toLowerCase())
              ).length > 0 ? (
                tasks.filter(t => 
                  t.title.toLowerCase().includes(taskSearchQuery.toLowerCase()) || 
                  t.project.toLowerCase().includes(taskSearchQuery.toLowerCase())
                ).map(task => (
                  <div 
                    key={task.id} 
                    className={`picker-item ${currentTask?.id === task.id ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentTask(task);
                      setShowTaskPicker(false);
                      setTaskSearchQuery('');
                    }}
                  >
                    <div className="picker-item-info">
                      <p className="picker-item-title">{task.title}</p>
                      <p className="picker-item-project">{task.project} • {task.priority}</p>
                    </div>
                    {currentTask?.id === task.id && <span className="material-symbols-outlined">check_circle</span>}
                  </div>
                ))
              ) : (
                <p className="empty-text">No pending tasks found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Secondary Content Grid */}
      <div className="focus-secondary-grid">
        {/* Next Up List */}
        <section>
          <h3 className="focus-section-title">Queue</h3>
          <div className="focus-next-list">
            {queueTasks.slice(0, 4).map(task => (
              <div className="focus-next-item" key={task.id} onClick={() => setCurrentTask(task)}>
                <p className="focus-next-title">{task.title}</p>
                <p className="focus-next-estimate">{task.project}</p>
              </div>
            ))}
            {queueTasks.length === 0 && <p className="empty-text">Queue is empty.</p>}
          </div>
        </section>

        {/* Focus Protocol */}
        <section>
          <h3 className="focus-section-title">Focus Protocol</h3>
          <div className="focus-feed-list">
            {activeProtocols.map((protocol, index) => (
              <div className="focus-feed-item" key={index}>
                <div className="focus-feed-dot" style={{ backgroundColor: protocol.color }}></div>
                <div className="focus-feed-content">
                  <p>{protocol.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FocusMode;

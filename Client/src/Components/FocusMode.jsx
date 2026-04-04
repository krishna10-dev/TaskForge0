import React, { useState, useEffect } from 'react';
import './FocusMode.css';

const FocusMode = () => {
  const [timeLeft, setTimeLeft] = useState(1498); // 24:58 in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSession = () => setIsActive(!isActive);

  return (
    <div className="focus-mode-container">
      {/* Timer Section */}
      <section className="focus-timer-section">
        <span className="focus-session-label">Active Session</span>
        <h1 className="focus-timer-display">{formatTime(timeLeft)}</h1>
        <div className="focus-timer-controls">
          <button className="focus-control-btn focus-btn-pause" onClick={toggleSession}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isActive ? 'pause_circle' : 'play_circle'}
            </span>
            {isActive ? 'Pause Session' : 'Resume Session'}
          </button>
          <button className="focus-control-btn focus-btn-complete">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Complete Task
          </button>
        </div>
      </section>

      {/* Current Focus Card */}
      <div className="focus-task-card">
        <div className="focus-card-blade"></div>
        <span className="focus-card-label">Current Focus</span>
        <h2 className="focus-card-title">Database Migration for Legacy Nodes</h2>
        <div className="focus-card-meta">
          <div className="focus-meta-item">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>account_tree</span>
            Infrastructure
          </div>
          <div className="focus-meta-item">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>schedule</span>
            Due 4:00 PM
          </div>
        </div>
        <button className="focus-card-more-btn">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      {/* Secondary Content Grid */}
      <div className="focus-secondary-grid">
        {/* Next Up List */}
        <section>
          <h3 className="focus-section-title">Next Up</h3>
          <div className="focus-next-list">
            <div className="focus-next-item">
              <p className="focus-next-title">API Endpoint Documentation</p>
              <p className="focus-next-estimate">15 mins estimated</p>
            </div>
            <div className="focus-next-item">
              <p className="focus-next-title">Stakeholder Review: Q3 Roadmap</p>
              <p className="focus-next-estimate">45 mins estimated</p>
            </div>
          </div>
        </section>

        {/* Focus Feed */}
        <section>
          <h3 className="focus-section-title">Focus Feed</h3>
          <div className="focus-feed-list">
            <div className="focus-feed-item">
              <div className="focus-feed-dot" style={{ backgroundColor: 'var(--dashboard-tertiary-fixed-dim)' }}></div>
              <div className="focus-feed-content">
                <p>System nodes are 82% synchronized.</p>
                <span className="focus-feed-time">Just now</span>
              </div>
            </div>
            <div className="focus-feed-item">
              <div className="focus-feed-dot" style={{ backgroundColor: 'var(--dashboard-outline-variant)' }}></div>
              <div className="focus-feed-content">
                <p>Auto-backup completed for 'Infrastructure'.</p>
                <span className="focus-feed-time">12 mins ago</span>
              </div>
            </div>
            <div className="focus-feed-item">
              <div className="focus-feed-dot" style={{ backgroundColor: 'var(--dashboard-outline-variant)' }}></div>
              <div className="focus-feed-content">
                <p>Deep Work session: Hour 2 initiated.</p>
                <span className="focus-feed-time">1 hour ago</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FocusMode;

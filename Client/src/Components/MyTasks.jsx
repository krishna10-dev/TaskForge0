import React from 'react';
import './MyTasks.css';

// Reusable Kanban Card Component
const KanbanCard = ({ id, tag, tagBg, tagColor, title, accent, team, metaIcon, metaValue, progress, status }) => (
  <div className={`kanban-card ${status === 'Done' ? 'kanban-card-done' : ''}`}>
    <div className="kanban-card-accent" style={{ background: accent }}></div>
    <div className="kanban-card-header">
      <span className="kanban-card-tag" style={{ backgroundColor: tagBg, color: tagColor }}>{tag}</span>
      <span className="kanban-card-id">{id}</span>
    </div>
    <h4 className="kanban-card-title">{title}</h4>
    
    {progress !== undefined && (
      <div className="kanban-progress-container">
        <div className="kanban-progress-label-box">
          <span>PROGRESS</span>
          <span>{progress}%</span>
        </div>
        <div className="kanban-progress-bg">
          <div className="kanban-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    )}

    <div className="kanban-card-footer">
      <div className="kanban-team-stack">
        {team.map((avatar, idx) => (
          <img key={idx} alt="Assignee" className="kanban-avatar" src={avatar} />
        ))}
      </div>
      <div className="kanban-meta">
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{metaIcon}</span>
        <span>{metaValue}</span>
      </div>
    </div>
  </div>
);

// Reusable Kanban Column Component
const KanbanColumn = ({ title, count, color, children }) => (
  <div className="kanban-column">
    <div className="kanban-column-header">
      <div className="kanban-column-title-box">
        <span className="kanban-dot" style={{ backgroundColor: color }}></span>
        <h3 className="kanban-column-title">{title}</h3>
        <span className="kanban-count">{count}</span>
      </div>
      <span className="material-symbols-outlined kanban-column-actions">more_horiz</span>
    </div>
    <div className="kanban-list">
      {children}
    </div>
  </div>
);

const MyTasks = () => {
  return (
    <div className="mytasks-container">
      <header className="mytasks-header">
        <h2 className="mytasks-title">My Tasks</h2>
        <div className="mytasks-view-actions">
          <button className="mytasks-view-btn mytasks-view-btn-active">Board View</button>
          <button className="mytasks-view-btn">List View</button>
        </div>
      </header>

      <div className="kanban-board">
        <KanbanColumn title="Backlog" count="4" color="#94a3b8">
          <KanbanCard 
            id="#PO-104"
            tag="INTERNAL"
            tagBg="var(--dashboard-surface-container-high)"
            tagColor="var(--dashboard-on-surface-variant)"
            title="Database migration for legacy nodes"
            accent="linear-gradient(to right, #e2e8f0, #94a3b8)"
            team={["https://lh3.googleusercontent.com/aida-public/AB6AXuANstcuDmAeTXfSi08IZnYYuc0Oy5djxoh8bDNdg6XveU2Himh5pWSB8lskGtpLWrW9zCBP6Gc9enzPtcIpz5nuH-eDS0wFkkNvI2lXbOd43MCVJpkxqqvCl6rDb4Uup4lNqn55U9ELnLJRO7Kt5M_AkLkM7V58U4U7RaFAKKLo_Dd7tloEYSa594fshyplh4eXZX0pd2QiGGq-p6Qjzd4-wekC3rVdLoI4inGDZVBeT6dx6nDht197SynVQnpSfCGxIu7Tp7fZrrsX", "https://lh3.googleusercontent.com/aida-public/AB6AXuDujF4c-MzLKLpgIQu7In_IlQTjL9NI9acl1XwV7-ku0jhdtT5-41Dk3_T4q3A6fGKnMmpD0gC5C_A6bbhyOdJsKBnWmVU8YGriYOiSfwWexow12v752SxmFKB5Gf-4-nQKjR1gd-v7ZIijkaO2rl5cTXqnyGjKBl-C0y2SnKem4DV8uOb-xyJ1W4mQ3CPU2eOXuoey-yNK440Xp1w3hrTgf0yqEwAlZGN8j5fb89rug9fcs-l48gD-VfwHcUBslL3mj5mcnjAprnRL"]}
            metaIcon="chat_bubble"
            metaValue="12"
          />
          <KanbanCard 
            id="#PO-112"
            tag="LOW"
            tagBg="var(--dashboard-secondary-container)"
            tagColor="var(--dashboard-on-secondary-container)"
            title="Update documentation for API endpoints v2.4"
            accent="linear-gradient(to right, #d1d5db, #6b7280)"
            team={["https://lh3.googleusercontent.com/aida-public/AB6AXuCs9XohE0yUh9NrKjSL2cVTBcHFG_926FxHMgReI3G0QGEH-4tliknvvCQxL5tBKHOtwhx_pcXhJsDv63sqWUM9VYE-NhPjeMjaWNd1mJfcZi7gWjzJq6WOzzZr6kMJsbAobTwA31pLDWoXZW1YR6xTL0lONdqHeCjtMCpC_nppKtfp0vT0Rlhxwrg3wJdWbGAQ5N-p3PPR7bklPXqNNYYUJQ7e0Kv2qfPXO4hsmIepIhCDmSoUy7pYzaduy96D6tZyPRsI2K1-5y5g"]}
            metaIcon="attach_file"
            metaValue="3"
          />
        </KanbanColumn>

        <KanbanColumn title="In Progress" count="2" color="#3b82f6">
          <KanbanCard 
            id="#PO-88"
            tag="URGENT"
            tagBg="var(--dashboard-error-container)"
            tagColor="var(--dashboard-error)"
            title="Neural network fine-tuning for edge devices"
            accent="linear-gradient(to right, #60a5fa, #2563eb)"
            team={["https://lh3.googleusercontent.com/aida-public/AB6AXuCCUoRpWU6aTY6oL3PCnb0qnoYXtly516uEddysSTcPeGXGLBTmfs4_6J0fM_5gvgUShpUvWxUz_9B-eYbTEF2d_4Y97ng_Bfk6j8rgIHI_3eEu1CSoSd7HXZ-SPTnlO7IqLlNImw47XuvhJo0tfmBEOtCSwv14xNfOwoHNS5i6bkJfuncZpvwvNJkLhdsjKIvm65dmST-kUnYhEX5LOjanF5L3N51VWc6zLTMnapLFJUkitYepwQVvq6SBnJqIJXag1atRjPUg_RuQ", "https://lh3.googleusercontent.com/aida-public/AB6AXuCthmERnMUd53NEzxEX95wUPF_puKpuA_Uzyvg-azhA227SPGkuWO0yMfkKp3E3wNojP7pnJtQvtfsVpM036L5UYR9FvLGOeLAJQXTmlBXfg9xlDCNYEvYQTPzfdV8HtKlUI6qFb5qM_Y9zfxk5_rNyD_vLlYCk81b3xxytmgl6E41AHM-aVP1qu4BOxK9h3Fg45csr3x3EsOdlFqr8Zgw2UQrEKXXe5jLjT37uIL3P8gLrk_CQ6FWkMle0s8cJV64YnREjI6Z443HD"]}
            metaIcon="schedule"
            metaValue="2d left"
            progress={65}
          />
        </KanbanColumn>

        <KanbanColumn title="In Review" count="3" color="#fbbf24">
          <KanbanCard 
            id="#PO-92"
            tag="MEDIUM"
            tagBg="var(--dashboard-surface-container-high)"
            tagColor="var(--dashboard-on-surface-variant)"
            title="Security audit for auth middleware"
            accent="linear-gradient(to right, #fde68a, #fbbf24)"
            team={["https://lh3.googleusercontent.com/aida-public/AB6AXuC0YMrmwUgFsWCFhzaPRvoOUungebL6txluXQRpM8jM8ji8UDgt3r4TPu9cnRnIv8wL4P05Wf8uswpyYFG0velWkO1VUd1SQFpNB1lSyF9MSxeLMeu71_BTWnVHS9iKVfJHzyisWNJtOrCDWhCegqHnD4H2dRgralkcgt5uOOGwFhJlhpWCvD7RVCHCJ68RIleiUJyV8j1tP5Vq_fhXcGt-UQyqvf3XfYi6LZPWNjfi-EFEC1IsBlwNXGeIBnmlxW2ZDyD8-t8cKm_u"]}
            metaIcon="warning"
            metaValue="Reviewing"
          />
        </KanbanColumn>

        <KanbanColumn title="Done" count="18" color="#14b8a6">
          <KanbanCard 
            id="#PO-72"
            tag="DONE"
            tagBg="var(--dashboard-tertiary-fixed)"
            tagColor="var(--dashboard-on-tertiary-container)"
            title="Redesign orchestration engine dashboard"
            accent="#14b8a6"
            team={["https://lh3.googleusercontent.com/aida-public/AB6AXuC54Y7sgJKow3si6oAO14XlV3-TsHN1b0fijpnzBz1h3tjJqng1jMmer8ofndSjXcrGPhBOULyxbzfTD5EGvslTX9FBVw1dcCKrh_XPbC-PL55veau2LpAh0-VA__71gjYuLvPa2_ZBNoSKXYa8HugsKDTgUXpZ8w5YVOgmq50O-wxihbQon6Y1UKrXubV5jotwFbiNDSnjnw7brhXb0a37U4mCs4YBNSHB8El9mjjHb5K2cJfO1b6ZiiP6GJVOuqXaqQq4ykGtYDNK"]}
            metaIcon="check_circle"
            metaValue="Archived"
            status="Done"
          />
        </KanbanColumn>
      </div>
    </div>
  );
};

export default MyTasks;

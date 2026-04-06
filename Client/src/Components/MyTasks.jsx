import React, { useState } from 'react';
import { updateTask, deleteTask } from '../api';
import './MyTasks.css';

// Reusable Kanban Card Component
const KanbanCard = ({ task, onClick, onDragStart }) => {
  const { id, title, priority, status, dueDate, project } = task;
  
  const tagBg = priority === 'High' ? 'var(--dashboard-error-container)' : 
                priority === 'Medium' ? 'var(--dashboard-secondary-container)' : 
                'var(--dashboard-surface-container-high)';
  
  const tagColor = priority === 'High' ? 'var(--dashboard-error)' : 
                   priority === 'Medium' ? 'var(--dashboard-on-secondary-container)' : 
                   'var(--dashboard-on-surface-variant)';

  const accent = status === 'Done' ? '#14b8a6' : 
                 status === 'In Progress' ? 'linear-gradient(to right, #60a5fa, #2563eb)' : 
                 'linear-gradient(to right, #e2e8f0, #94a3b8)';

  const daysLeft = dueDate ? Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div 
      className={`kanban-card ${status === 'Done' ? 'kanban-card-done' : ''}`}
      onClick={() => onClick(task)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task.id);
        if(onDragStart) onDragStart(e, task);
      }}
    >
      <div className="kanban-card-accent" style={{ background: accent }}></div>
      <div className="kanban-card-header">
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="kanban-card-tag" style={{ backgroundColor: tagBg, color: tagColor }}>{priority}</span>
          <span className="kanban-card-tag" style={{ backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '10px' }}>{project}</span>
        </div>
        <span className="kanban-card-id">#{id}</span>
      </div>
      <h4 className="kanban-card-title">{title}</h4>
      
      <div className="kanban-card-footer">
        <div className="kanban-team-stack">
          {status === 'Done' ? (
            <span className="material-symbols-outlined" style={{fontSize: '20px', color: '#14b8a6'}}>task_alt</span>
          ) : (
            <span className="material-symbols-outlined" style={{fontSize: '18px', color: '#94a3b8'}}>person</span>
          )}
        </div>
        <div className="kanban-meta">
          {status !== 'Done' && daysLeft !== null && (
            <span style={{ 
              color: daysLeft < 0 ? '#ba1a1a' : daysLeft < 3 ? '#fbbf24' : '#94a3b8',
              fontSize: '11px',
              fontWeight: '600',
              marginRight: '8px'
            }}>
              {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
            </span>
          )}
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{status === 'Done' ? 'verified' : 'calendar_today'}</span>
          <span>{status === 'Done' ? 'Completed' : (dueDate ? new Date(dueDate).toLocaleDateString() : 'No date')}</span>
        </div>
      </div>
    </div>
  );
};

// Task Details Modal Component
const TaskDetailsModal = ({ task, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  if (!task) return null;

  const handleSave = async () => {
    try {
      await updateTask(task.id, editedTask);
      onUpdate();
      onClose();
    } catch {
      alert('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
        onDelete();
        onClose();
      } catch {
        alert('Failed to delete task');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="task-details-modal">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Task Details</h2>
            <p className="modal-subtitle">#{task.id} • Registered in {task.project}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="modal-content">
          <div className="details-grid">
            <div className="details-main">
              <div className="detail-group">
                <label>Title</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editedTask.title} 
                    onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                    className="edit-input"
                  />
                ) : (
                  <h3>{task.title}</h3>
                )}
              </div>
              <div className="detail-group">
                <label>Description</label>
                {isEditing ? (
                  <textarea 
                    value={editedTask.description} 
                    onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                    className="edit-textarea"
                    rows="5"
                  />
                ) : (
                  <p>{task.description || 'No description provided.'}</p>
                )}
              </div>
            </div>

            <aside className="details-sidebar">
              <div className="detail-sidebar-item">
                <label>Status</label>
                <select 
                  value={editedTask.status} 
                  disabled={!isEditing}
                  onChange={(e) => setEditedTask({...editedTask, status: e.target.value})}
                  className="detail-select"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="detail-sidebar-item">
                <label>Priority</label>
                <select 
                  value={editedTask.priority} 
                  disabled={!isEditing}
                  onChange={(e) => setEditedTask({...editedTask, priority: e.target.value})}
                  className="detail-select"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="detail-sidebar-item">
                <label>Due Date</label>
                <input 
                  type="date" 
                  value={editedTask.dueDate ? editedTask.dueDate.split('T')[0] : ''} 
                  disabled={!isEditing}
                  onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
                  className="detail-input"
                />
              </div>
            </aside>
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-left">
            <button className="delete-task-btn" onClick={handleDelete}>
              <span className="material-symbols-outlined">delete</span>
              Delete Task
            </button>
          </div>
          <div className="footer-right">
            {isEditing ? (
              <>
                <button className="action-btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="action-btn-create" onClick={handleSave}>Save Changes</button>
              </>
            ) : (
              <button className="action-btn-create" onClick={() => setIsEditing(true)}>
                <span className="material-symbols-outlined" style={{fontSize: '18px'}}>edit</span>
                Edit Task
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Kanban Column Component
const KanbanColumn = ({ title, count, color, onDrop, children }) => (
  <div 
    className="kanban-column"
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('taskId');
      if (taskId && onDrop) {
        onDrop(taskId, title);
      }
    }}
  >
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

const MyTasks = ({ initialTasks = [], onRefresh }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [projectFilter, setProjectFilter] = useState('All');

  const projects = ['All', ...new Set(initialTasks.map(t => t.project))];

  const filteredTasks = projectFilter === 'All' 
    ? initialTasks 
    : initialTasks.filter(t => t.project === projectFilter);

  const getTasksByStatus = (status) => filteredTasks.filter(task => task.status === status);

  const todoTasks = getTasksByStatus('To Do');
  const inProgressTasks = getTasksByStatus('In Progress');
  const doneTasks = getTasksByStatus('Done');

  const handleDrop = async (taskId, newStatus) => {
    try {
      const taskToUpdate = initialTasks.find(t => t.id === parseInt(taskId));
      if (taskToUpdate && taskToUpdate.status !== newStatus) {
        await updateTask(taskId, { ...taskToUpdate, status: newStatus });
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to update task status upon drop:', error);
    }
  };

  return (
    <div className="mytasks-container">
      <header className="mytasks-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h2 className="mytasks-title">My Tasks</h2>
          <select 
            className="mytasks-project-select" 
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              fontSize: '13px',
              color: '#64748b',
              outline: 'none'
            }}
          >
            {projects.map(p => <option key={p} value={p}>{p === 'All' ? 'All Projects' : p}</option>)}
          </select>
        </div>
        <div className="mytasks-view-actions">
          <button className="mytasks-view-btn mytasks-view-btn-active">Board View</button>
          <button className="mytasks-view-btn" onClick={onRefresh}>Refresh</button>
        </div>
      </header>

      <div className="kanban-board">
        <KanbanColumn title="To Do" count={todoTasks.length} color="#94a3b8" onDrop={handleDrop}>
          {todoTasks.map(task => (
            <KanbanCard key={task.id} task={task} onClick={setSelectedTask} />
          ))}
        </KanbanColumn>

        <KanbanColumn title="In Progress" count={inProgressTasks.length} color="#3b82f6" onDrop={handleDrop}>
          {inProgressTasks.map(task => (
            <KanbanCard key={task.id} task={task} onClick={setSelectedTask} />
          ))}
        </KanbanColumn>

        <KanbanColumn title="Done" count={doneTasks.length} color="#14b8a6" onDrop={handleDrop}>
          {doneTasks.map(task => (
            <KanbanCard key={task.id} task={task} onClick={setSelectedTask} />
          ))}
        </KanbanColumn>
      </div>

      {selectedTask && (
        <TaskDetailsModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onUpdate={onRefresh}
          onDelete={onRefresh}
        />
      )}
    </div>
  );
};

export default MyTasks;

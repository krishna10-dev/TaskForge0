import React, { useState, useEffect } from 'react';
import { updateTask, deleteTask, uploadFile, uploadTaskProof } from '../api';
import './MyTasks.css';

// Reusable Kanban Card Component
const KanbanCard = ({ task, onClick, onDragStart }) => {
  const { id, title, priority, status, dueDate, project, progress, Attachments = [] } = task;
  
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
      
      {/* Progress Bar in Kanban Card */}
      <div className="kanban-progress-container" style={{ margin: '12px 0 8px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>
          <span>Progress</span>
          <span>{progress || 0}%</span>
        </div>
        <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${progress || 0}%`, 
            background: status === 'Done' ? '#14b8a6' : (progress > 70 ? '#3b82f6' : '#94a3b8'),
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      <div className="kanban-card-footer">
        <div className="kanban-meta-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {Attachments && Attachments.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#64748b', fontSize: '11px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>attach_file</span>
              <span>{Attachments.length}</span>
            </div>
          )}
          <div className="kanban-team-stack">
            {status === 'Done' ? (
              <span className="material-symbols-outlined" style={{fontSize: '20px', color: '#14b8a6'}}>task_alt</span>
            ) : (
              <span className="material-symbols-outlined" style={{fontSize: '18px', color: '#94a3b8'}}>person</span>
            )}
          </div>
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
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setEditedTask({ ...task });
  }, [task]);

  if (!task) return null;

  const handleSave = async () => {
    try {
      // Auto-set status to Done if progress is 100%
      const finalTask = { ...editedTask };
      if (finalTask.progress === 100) {
        finalTask.status = 'Done';
      }
      await updateTask(task.id, finalTask);
      onUpdate();
      setIsEditing(false);
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data: fileUrl } = await uploadFile(formData);
      
      await uploadTaskProof(task.id, {
        fileName: file.name,
        fileUrl: fileUrl,
        fileSize: file.size,
        fileType: file.type
      });
      
      onUpdate();
      alert('Proof of work uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload proof of work');
    } finally {
      setUploading(false);
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

              {/* Progress Tracker Section */}
              <div className="detail-group">
                <label>Task Progress ({editedTask.progress || 0}%)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="10"
                    value={editedTask.progress || 0}
                    onChange={(e) => setEditedTask({...editedTask, progress: parseInt(e.target.value)})}
                    disabled={!isEditing}
                    style={{ flex: 1, accentColor: 'var(--dashboard-primary)' }}
                  />
                  
                  <span style={{ fontWeight: '600', color: 'var(--dashboard-primary)', width: '40px' }}>{editedTask.progress || 0}%</span>
                </div>
              </div>

              {/* Proof of Work Section */}
              <div className="detail-group proof-section">
                <label>Proof of Work (Files, Images, Videos)</label>
                <div className="attachments-list">
                  {task.Attachments && task.Attachments.length > 0 ? (
                    <div className="attachments-grid">
                      {task.Attachments.map((att) => (
                        <a key={att.id} href={`http://localhost:5000${att.fileUrl}`} target="_blank" rel="noopener noreferrer" className="attachment-item">
                          <span className="material-symbols-outlined">
                            {att.fileType.includes('image') ? 'image' : 
                             att.fileType.includes('video') ? 'movie' : 'description'}
                          </span>
                          <span className="attachment-name">{att.fileName}</span>
                          <button style={{border: 'none'}}>Remove</button>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="no-attachments">No proof uploaded yet.</p>
                  )}
                </div>
                <div className="upload-proof-box">
                  <input 
                    type="file" 
                    id="proof-upload" 
                    hidden 
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <label htmlFor="proof-upload" className="upload-label">
                    <span className="material-symbols-outlined">{uploading ? 'sync' : 'cloud_upload'}</span>
                    <span>{uploading ? 'Uploading...' : 'Upload Proof of Work'}</span>
                  </label>
                </div>
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

const MyTasks = ({ initialTasks = [], searchQuery = '', onRefresh }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [projectFilter, setProjectFilter] = useState('All');

  const projects = ['All', ...new Set(initialTasks.map(t => t.project))];

  const filteredTasks = initialTasks.filter(t => {
    const matchProject = projectFilter === 'All' || t.project === projectFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = t.title.toLowerCase().includes(searchLower) || 
                        (t.description && t.description.toLowerCase().includes(searchLower)) ||
                        (t.project && t.project.toLowerCase().includes(searchLower));
    return matchProject && matchSearch;
  });

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

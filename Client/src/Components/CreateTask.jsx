import React, { useState } from 'react';
import { createTask } from '../api';
import './CreateTask.css';

const CreateTask = ({ isOpen, onClose, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('Design System UI');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createTask({
        title,
        description,
        project,
        dueDate,
        priority,
        status: 'To Do',
      });
      setTitle('');
      setDescription('');
      setProject('Design System UI');
      setDueDate('');
      setPriority('Medium');
      onTaskCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="create-task-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Create New Task</h2>
            <p className="modal-subtitle">Define a new objective for your team curator.</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="modal-content">
          <form className="create-task-form" id="createTaskForm" onSubmit={handleSubmit}>
            {error && <p className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
            <div className="form-sections-grid">
              {/* Left Column */}
              <div className="form-column">
                <div className="form-group">
                  <label className="form-label">Task Title</label>
                  <input 
                    className="form-input-text title-input" 
                    placeholder="e.g., Finalize Brand Identity" 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-input-text desc-textarea" 
                    placeholder="Provide context and requirements..." 
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Right Column */}
              <div className="form-column">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Project</label>
                    <select 
                      className="form-select"
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                    >
                      <option>Design System UI</option>
                      <option>Backend Orchestration</option>
                      <option>Market Integration</option>
                      <option>Precision Engine</option>
                      <option>Frontend Development</option>
                      <option>Backend Development</option>
                      <option>Database Management</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input 
                      className="form-input-date" 
                      type="date" 
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority Level</label>
                  <div className="priority-selector">
                    {['Low', 'Medium', 'High'].map((p) => (
                      <label className="priority-option" key={p}>
                        <input 
                          name="priority" 
                          type="radio" 
                          value={p}
                          checked={priority === p}
                          onChange={(e) => setPriority(e.target.value)}
                        />
                        <div className={`priority-box ${p.toLowerCase()}`}>{p}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="action-btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
          <button 
            className="action-btn-create" 
            form="createTaskForm" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;

import React, { useState } from 'react';
import './Assignments.css';

const Assignments = () => {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Algebra Practice Problems',
      class: '11A',
      subject: 'Mathematics',
      description: 'Complete problems 1-20 from chapter 5',
      dueDate: '2024-01-20',
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Science Project',
      class: '11B',
      subject: 'Science',
      description: 'Research project on photosynthesis',
      dueDate: '2024-01-25',
      status: 'active',
      createdAt: '2024-01-16'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    class: '',
    subject: '',
    description: '',
    dueDate: '',
    status: 'active'
  });

  const classes = ['11A', '11B', '12A', '12B', '10A', '10B'];
  const subjects = ['Mathematics', 'Science', 'English', 'Computer Science', 'Physics', 'Chemistry'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingAssignment) {
      // Update existing assignment
      setAssignments(assignments.map(assignment =>
        assignment.id === editingAssignment.id
          ? { ...assignment, ...formData }
          : assignment
      ));
      setEditingAssignment(null);
    } else {
      // Create new assignment
      const newAssignment = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAssignments([newAssignment, ...assignments]);
    }

    // Reset form
    setFormData({
      title: '',
      class: '',
      subject: '',
      description: '',
      dueDate: '',
      status: 'active'
    });
    setShowCreateForm(false);
    alert(editingAssignment ? 'Assignment updated successfully!' : 'Assignment created successfully!');
  };

  const handleEdit = (assignment) => {
    setFormData(assignment);
    setEditingAssignment(assignment);
    setShowCreateForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(assignments.filter(assignment => assignment.id !== id));
      alert('Assignment deleted successfully!');
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingAssignment(null);
    setFormData({
      title: '',
      class: '',
      subject: '',
      description: '',
      dueDate: '',
      status: 'active'
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="assignments">
      <div className="assignments-header">
        <div>
          <h1>Assignments & Homework</h1>
          <p>Create and manage assignments for your students</p>
        </div>
        <button
          className="create-assignment-btn"
          onClick={() => setShowCreateForm(true)}
        >
          ➕ Create New Assignment
        </button>
      </div>

      {showCreateForm && (
        <div className="assignment-form-container">
          <div className="assignment-form-card">
            <div className="form-header">
              <h2>{editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}</h2>
              <button className="close-btn" onClick={handleCancel}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="assignment-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Assignment Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Algebra Practice Problems"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Class *</label>
                  <select
                    value={formData.class}
                    onChange={(e) => handleInputChange('class', e.target.value)}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide detailed instructions for the assignment..."
                  rows="6"
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingAssignment ? '💾 Update Assignment' : '✅ Create Assignment'}
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="assignments-list">
        {assignments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No assignments yet</h3>
            <p>Create your first assignment to get started</p>
            <button className="create-first-btn" onClick={() => setShowCreateForm(true)}>
              Create Assignment
            </button>
          </div>
        ) : (
          <div className="assignments-grid">
            {assignments.map((assignment) => {
              const daysUntilDue = getDaysUntilDue(assignment.dueDate);
              const isOverdue = daysUntilDue < 0;
              const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

              return (
                <div key={assignment.id} className="assignment-card">
                  <div className="assignment-card-header">
                    <div>
                      <h3>{assignment.title}</h3>
                      <div className="assignment-meta">
                        <span className="meta-badge class">{assignment.class}</span>
                        <span className="meta-badge subject">{assignment.subject}</span>
                        <span className={`meta-badge status ${assignment.status}`}>
                          {assignment.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="assignment-card-body">
                    <p className="assignment-description">{assignment.description}</p>
                    <div className="assignment-details">
                      <div className="detail-item">
                        <span className="detail-label">📅 Created:</span>
                        <span className="detail-value">{formatDate(assignment.createdAt)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">⏰ Due Date:</span>
                        <span className={`detail-value ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}`}>
                          {formatDate(assignment.dueDate)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">⏳ Time Left:</span>
                        <span className={`detail-value ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}`}>
                          {isOverdue 
                            ? `${Math.abs(daysUntilDue)} days overdue`
                            : daysUntilDue === 0
                            ? 'Due today!'
                            : daysUntilDue === 1
                            ? 'Due tomorrow'
                            : `${daysUntilDue} days remaining`
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="assignment-card-footer">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(assignment)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(assignment.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;


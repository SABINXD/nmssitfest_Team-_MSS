import React, { useState } from 'react';
import './Assignments.css';

const Assignments = () => {
  const [filter, setFilter] = useState('all'); // all, pending, submitted, graded
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  // Mock assignments data
  const assignments = [
    {
      id: 1,
      title: 'Mathematics Problem Set 5',
      subject: 'Mathematics',
      teacher: 'Mr. Smith',
      dueDate: '2024-01-15',
      dueTime: '23:59',
      status: 'pending',
      description: 'Complete problems 1-20 from Chapter 5. Show all work.',
      maxScore: 100,
      submittedDate: null,
      grade: null,
      feedback: null
    },
    {
      id: 2,
      title: 'Science Lab Report',
      subject: 'Science',
      teacher: 'Dr. Brown',
      dueDate: '2024-01-18',
      dueTime: '17:00',
      status: 'submitted',
      description: 'Write a lab report on the experiment conducted last week.',
      maxScore: 50,
      submittedDate: '2024-01-17',
      grade: null,
      feedback: null
    },
    {
      id: 3,
      title: 'English Essay',
      subject: 'English',
      teacher: 'Ms. Johnson',
      dueDate: '2024-01-10',
      dueTime: '23:59',
      status: 'graded',
      description: 'Write a 1000-word essay on "The Impact of Technology on Education".',
      maxScore: 100,
      submittedDate: '2024-01-09',
      grade: 85,
      feedback: 'Excellent work! Your arguments are well-structured. Consider adding more examples in the third paragraph.'
    },
    {
      id: 4,
      title: 'History Research Paper',
      subject: 'History',
      teacher: 'Mr. Davis',
      dueDate: '2024-01-20',
      dueTime: '23:59',
      status: 'pending',
      description: 'Research and write a paper on World War II causes and effects.',
      maxScore: 150,
      submittedDate: null,
      grade: null,
      feedback: null
    }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    return assignment.status === filter;
  });

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (assignment) => {
    const daysLeft = getDaysUntilDue(assignment.dueDate);
    
    if (assignment.status === 'graded') {
      return <span className="badge graded">Graded</span>;
    }
    if (assignment.status === 'submitted') {
      return <span className="badge submitted">Submitted</span>;
    }
    if (daysLeft < 0) {
      return <span className="badge overdue">Overdue</span>;
    }
    if (daysLeft <= 1) {
      return <span className="badge urgent">Due Soon</span>;
    }
    return <span className="badge pending">Pending</span>;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleSubmitAssignment = (assignmentId) => {
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }
    // API call to submit assignment
    alert(`Assignment submitted successfully! File: ${uploadFile.name}`);
    setUploadFile(null);
    setSelectedAssignment(null);
  };

  return (
    <div className="assignments">
      <div className="assignments-header">
        <div>
          <h1>Assignments & Homework</h1>
          <p>View, submit, and track your assignments</p>
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'submitted' ? 'active' : ''}`}
            onClick={() => setFilter('submitted')}
          >
            Submitted
          </button>
          <button
            className={`filter-btn ${filter === 'graded' ? 'active' : ''}`}
            onClick={() => setFilter('graded')}
          >
            Graded
          </button>
        </div>
      </div>

      <div className="assignments-list">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="assignment-card">
            <div className="assignment-header">
              <div className="assignment-title-section">
                <h3>{assignment.title}</h3>
                <div className="assignment-meta">
                  <span className="subject-badge">{assignment.subject}</span>
                  <span>👨‍🏫 {assignment.teacher}</span>
                </div>
              </div>
              {getStatusBadge(assignment)}
            </div>

            <div className="assignment-body">
              <p className="assignment-description">{assignment.description}</p>
              
              <div className="assignment-details">
                <div className="detail-item">
                  <span className="detail-label">Due Date:</span>
                  <span className="detail-value">
                    {new Date(assignment.dueDate).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })} at {assignment.dueTime}
                  </span>
                </div>
                {assignment.status === 'pending' && (
                  <div className="detail-item">
                    <span className="detail-label">Days Left:</span>
                    <span className={`detail-value ${getDaysUntilDue(assignment.dueDate) <= 1 ? 'urgent-text' : ''}`}>
                      {getDaysUntilDue(assignment.dueDate)} days
                    </span>
                  </div>
                )}
                {assignment.submittedDate && (
                  <div className="detail-item">
                    <span className="detail-label">Submitted:</span>
                    <span className="detail-value">
                      {new Date(assignment.submittedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {assignment.grade !== null && (
                  <div className="detail-item">
                    <span className="detail-label">Grade:</span>
                    <span className="detail-value grade-value">
                      {assignment.grade}/{assignment.maxScore} ({Math.round((assignment.grade / assignment.maxScore) * 100)}%)
                    </span>
                  </div>
                )}
              </div>

              {assignment.feedback && (
                <div className="feedback-section">
                  <h4>Teacher Feedback:</h4>
                  <p>{assignment.feedback}</p>
                </div>
              )}

              <div className="assignment-actions">
                {assignment.status === 'pending' && (
                  <button
                    className="submit-btn"
                    onClick={() => setSelectedAssignment(assignment)}
                  >
                    📤 Submit Assignment
                  </button>
                )}
                {assignment.status === 'submitted' && (
                  <span className="submitted-text">Awaiting grading...</span>
                )}
                {assignment.status === 'graded' && (
                  <button className="view-btn">View Details</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedAssignment && (
        <div className="upload-modal">
          <div className="upload-modal-content">
            <div className="modal-header">
              <h2>Submit: {selectedAssignment.title}</h2>
              <button className="close-btn" onClick={() => {
                setSelectedAssignment(null);
                setUploadFile(null);
              }}>
                ✕
              </button>
            </div>
            
            <div className="upload-form">
              <div className="form-group">
                <label>Upload Assignment File</label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    {uploadFile ? (
                      <span>📄 {uploadFile.name}</span>
                    ) : (
                      <span>📁 Click to select file or drag and drop</span>
                    )}
                  </label>
                </div>
                <p className="file-hint">Accepted formats: PDF, DOC, DOCX, TXT (Max 10MB)</p>
              </div>

              <div className="form-actions">
                <button
                  className="submit-assignment-btn"
                  onClick={() => handleSubmitAssignment(selectedAssignment.id)}
                >
                  Submit Assignment
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setSelectedAssignment(null);
                    setUploadFile(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;

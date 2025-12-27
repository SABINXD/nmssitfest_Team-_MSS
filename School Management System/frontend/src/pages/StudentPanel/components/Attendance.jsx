import React, { useState } from 'react';
import './Attendance.css';

const Attendance = () => {
  const [viewMode, setViewMode] = useState('monthly'); // daily, weekly, monthly
  const [showLeaveRequest, setShowLeaveRequest] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'sick'
  });

  // Mock attendance data
  const attendanceData = {
    overall: {
      present: 92,
      absent: 5,
      late: 3,
      percentage: 92.3,
      totalDays: 100
    },
    monthly: [
      { date: '2024-01-01', status: 'present', subject: 'All Subjects' },
      { date: '2024-01-02', status: 'present', subject: 'All Subjects' },
      { date: '2024-01-03', status: 'late', subject: 'All Subjects' },
      { date: '2024-01-04', status: 'present', subject: 'All Subjects' },
      { date: '2024-01-05', status: 'absent', subject: 'All Subjects' },
      { date: '2024-01-08', status: 'present', subject: 'All Subjects' },
      { date: '2024-01-09', status: 'present', subject: 'All Subjects' },
      { date: '2024-01-10', status: 'present', subject: 'All Subjects' },
      { date: '2024-01-11', status: 'late', subject: 'All Subjects' },
      { date: '2024-01-12', status: 'present', subject: 'All Subjects' },
      { date: '2024-01-15', status: 'present', subject: 'All Subjects' },
      { date: '2024-01-16', status: 'absent', subject: 'All Subjects' },
      { date: '2024-01-17', status: 'present', subject: 'All Subjects' },
      { date: '2024-01-18', status: 'present', subject: 'All Subjects' },
      { date: '2024-01-19', status: 'present', subject: 'All Subjects' }
    ],
    subjectWise: [
      { subject: 'Mathematics', present: 45, absent: 2, late: 1, percentage: 93.8 },
      { subject: 'English', present: 46, absent: 1, late: 1, percentage: 95.8 },
      { subject: 'Science', present: 44, absent: 3, late: 1, percentage: 91.7 },
      { subject: 'History', present: 47, absent: 1, late: 0, percentage: 97.9 },
      { subject: 'Physics', present: 45, absent: 2, late: 1, percentage: 93.8 }
    ]
  };

  const leaveRequests = [
    { id: 1, startDate: '2024-01-05', endDate: '2024-01-05', reason: 'Medical appointment', status: 'approved', type: 'medical' },
    { id: 2, startDate: '2024-01-16', endDate: '2024-01-16', reason: 'Family emergency', status: 'approved', type: 'emergency' },
    { id: 3, startDate: '2024-01-25', endDate: '2024-01-25', reason: 'Personal', status: 'pending', type: 'personal' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#27ae60';
      case 'absent': return '#e74c3c';
      case 'late': return '#f39c12';
      default: return '#7f8c8d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return '✅';
      case 'absent': return '❌';
      case 'late': return '⏰';
      default: return '❓';
    }
  };

  const handleLeaveRequestChange = (field, value) => {
    setLeaveRequest(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitLeaveRequest = () => {
    if (!leaveRequest.startDate || !leaveRequest.reason) {
      alert('Please fill in all required fields');
      return;
    }
    // API call to submit leave request
    alert('Leave request submitted successfully!');
    setLeaveRequest({ startDate: '', endDate: '', reason: '', type: 'sick' });
    setShowLeaveRequest(false);
  };

  return (
    <div className="attendance">
      <div className="attendance-header">
        <div>
          <h1>Attendance Records</h1>
          <p>Track your attendance and submit leave requests</p>
        </div>
        <div className="header-actions">
          <button className="request-leave-btn" onClick={() => setShowLeaveRequest(true)}>
            📝 Request Leave
          </button>
          <div className="view-mode-selector">
            <button
              className={`view-btn ${viewMode === 'daily' ? 'active' : ''}`}
              onClick={() => setViewMode('daily')}
            >
              Daily
            </button>
            <button
              className={`view-btn ${viewMode === 'weekly' ? 'active' : ''}`}
              onClick={() => setViewMode('weekly')}
            >
              Weekly
            </button>
            <button
              className={`view-btn ${viewMode === 'monthly' ? 'active' : ''}`}
              onClick={() => setViewMode('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      <div className="attendance-overview">
        <div className="overview-card attendance-card">
          <div className="overview-icon">📊</div>
          <div className="overview-content">
            <h3>Overall Attendance</h3>
            <p className="overview-value">{attendanceData.overall.percentage}%</p>
            <span className="overview-label">{attendanceData.overall.totalDays} days tracked</span>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon" style={{ background: '#27ae60' }}>✅</div>
          <div className="overview-content">
            <h3>Present</h3>
            <p className="overview-value">{attendanceData.overall.present}</p>
            <span className="overview-label">Days</span>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon" style={{ background: '#e74c3c' }}>❌</div>
          <div className="overview-content">
            <h3>Absent</h3>
            <p className="overview-value">{attendanceData.overall.absent}</p>
            <span className="overview-label">Days</span>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon" style={{ background: '#f39c12' }}>⏰</div>
          <div className="overview-content">
            <h3>Late</h3>
            <p className="overview-value">{attendanceData.overall.late}</p>
            <span className="overview-label">Days</span>
          </div>
        </div>
      </div>

      {viewMode === 'monthly' && (
        <div className="attendance-calendar">
          <h2>Monthly Attendance Record</h2>
          <div className="calendar-grid">
            {attendanceData.monthly.map((record, index) => (
              <div
                key={index}
                className="calendar-day"
                style={{ borderColor: getStatusColor(record.status) }}
              >
                <div className="day-date">
                  {new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </div>
                <div className="day-status" style={{ color: getStatusColor(record.status) }}>
                  {getStatusIcon(record.status)}
                </div>
                <div className="day-label">{record.status.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="subject-attendance">
        <h2>Subject-wise Attendance</h2>
        <div className="subject-list">
          {attendanceData.subjectWise.map((subject, index) => (
            <div key={index} className="subject-card">
              <div className="subject-header">
                <h3>{subject.subject}</h3>
                <div className="subject-percentage" style={{ color: subject.percentage >= 90 ? '#27ae60' : subject.percentage >= 80 ? '#3498db' : '#f39c12' }}>
                  {subject.percentage}%
                </div>
              </div>
              <div className="subject-stats">
                <div className="stat-item">
                  <span className="stat-label">Present:</span>
                  <span className="stat-value present">{subject.present}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Absent:</span>
                  <span className="stat-value absent">{subject.absent}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Late:</span>
                  <span className="stat-value late">{subject.late}</span>
                </div>
              </div>
              <div className="subject-bar">
                <div
                  className="subject-bar-fill"
                  style={{
                    width: `${subject.percentage}%`,
                    background: subject.percentage >= 90 ? '#27ae60' : subject.percentage >= 80 ? '#3498db' : '#f39c12'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="leave-requests-section">
        <div className="section-header">
          <h2>Leave Requests</h2>
        </div>
        <div className="leave-requests-list">
          {leaveRequests.map((request) => (
            <div key={request.id} className="leave-request-card">
              <div className="request-info">
                <div className="request-dates">
                  <strong>
                    {new Date(request.startDate).toLocaleDateString()}
                    {request.endDate !== request.startDate && ` - ${new Date(request.endDate).toLocaleDateString()}`}
                  </strong>
                </div>
                <div className="request-reason">{request.reason}</div>
                <div className="request-type">{request.type}</div>
              </div>
              <div className={`request-status ${request.status}`}>
                {request.status === 'approved' ? '✅ Approved' : request.status === 'pending' ? '⏳ Pending' : '❌ Rejected'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showLeaveRequest && (
        <div className="leave-modal">
          <div className="leave-modal-content">
            <div className="modal-header">
              <h2>Request Leave</h2>
              <button className="close-btn" onClick={() => setShowLeaveRequest(false)}>
                ✕
              </button>
            </div>

            <div className="leave-form">
              <div className="form-group">
                <label>Leave Type</label>
                <select
                  value={leaveRequest.type}
                  onChange={(e) => handleLeaveRequestChange('type', e.target.value)}
                >
                  <option value="sick">Sick Leave</option>
                  <option value="medical">Medical Appointment</option>
                  <option value="emergency">Family Emergency</option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={leaveRequest.startDate}
                    onChange={(e) => handleLeaveRequestChange('startDate', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={leaveRequest.endDate}
                    onChange={(e) => handleLeaveRequestChange('endDate', e.target.value)}
                    min={leaveRequest.startDate}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason *</label>
                <textarea
                  value={leaveRequest.reason}
                  onChange={(e) => handleLeaveRequestChange('reason', e.target.value)}
                  rows="4"
                  placeholder="Please provide a reason for your leave request"
                  required
                />
              </div>

              <div className="form-actions">
                <button className="submit-btn" onClick={handleSubmitLeaveRequest}>
                  Submit Request
                </button>
                <button className="cancel-btn" onClick={() => setShowLeaveRequest(false)}>
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

export default Attendance;

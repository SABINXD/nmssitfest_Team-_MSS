import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Mock data - replace with actual API calls
  const stats = {
    upcomingAssignments: 3,
    averageGrade: 85.5,
    attendancePercentage: 92.3,
    upcomingClasses: 2
  };

  const notifications = [
    { id: 1, type: 'assignment', message: 'Math Assignment due tomorrow', time: '2 hours ago', urgent: true },
    { id: 2, type: 'exam', message: 'Science exam scheduled for next week', time: '1 day ago', urgent: false },
    { id: 3, type: 'event', message: 'School sports day registration open', time: '2 days ago', urgent: false }
  ];

  const upcomingClasses = [
    { subject: 'Mathematics', teacher: 'Mr. Smith', time: '10:00 AM', room: 'Room 201' },
    { subject: 'Science', teacher: 'Ms. Johnson', time: '11:30 AM', room: 'Room 305' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>{greeting}, {user?.name || 'Student'}! 👋</h1>
          <p>Here's your academic overview for today</p>
        </div>
        <div className="date-display">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>{stats.upcomingAssignments}</h3>
            <p>Upcoming Assignments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>{stats.averageGrade}%</h3>
            <p>Average Grade</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.attendancePercentage}%</h3>
            <p>Attendance</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{stats.upcomingClasses}</h3>
            <p>Classes Today</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>🔔 Notifications</h2>
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div key={notification.id} className={`notification-item ${notification.urgent ? 'urgent' : ''}`}>
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
                {notification.urgent && <span className="urgent-badge">Urgent</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>📚 Upcoming Classes</h2>
          <div className="classes-list">
            {upcomingClasses.map((classItem, index) => (
              <div key={index} className="class-item">
                <div className="class-time">{classItem.time}</div>
                <div className="class-details">
                  <h4>{classItem.subject}</h4>
                  <p>{classItem.teacher} • {classItem.room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

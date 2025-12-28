import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Mock data - replace with actual API calls
  const stats = {
    totalClasses: 5,
    totalStudents: 125,
    todayClasses: 3,
    pendingGrading: 8
  };

  const todaySchedule = [
    { subject: 'Mathematics', class: '11A', time: '10:00 AM - 10:45 AM', room: 'Room 201' },
    { subject: 'Mathematics', class: '11B', time: '11:30 AM - 12:15 PM', room: 'Room 201' },
    { subject: 'Mathematics', class: '12A', time: '02:00 PM - 02:45 PM', room: 'Room 305' }
  ];

  const recentNotifications = [
    { id: 1, type: 'assignment', message: '5 assignments pending review', time: '1 hour ago', urgent: true },
    { id: 2, type: 'attendance', message: 'Attendance for Class 11A needs to be marked', time: '2 hours ago', urgent: false },
    { id: 3, type: 'student', message: 'New student enrolled in your class', time: '1 day ago', urgent: false }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>{greeting}, {user?.name || 'Teacher'}! 👋</h1>
          <p>Here's your teaching overview for today</p>
        </div>
        <div className="date-display">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>{stats.totalClasses}</h3>
            <p>Total Classes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-info">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{stats.todayClasses}</h3>
            <p>Classes Today</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>{stats.pendingGrading}</h3>
            <p>Pending Grading</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>📅 Today's Schedule</h2>
          <div className="schedule-list">
            {todaySchedule.map((schedule, index) => (
              <div key={index} className="schedule-item">
                <div className="schedule-time">{schedule.time}</div>
                <div className="schedule-details">
                  <h3>{schedule.subject}</h3>
                  <p>Class: {schedule.class} | Room: {schedule.room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>🔔 Notifications</h2>
          <div className="notifications-list">
            {recentNotifications.map((notification) => (
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
      </div>
    </div>
  );
};

export default Dashboard;


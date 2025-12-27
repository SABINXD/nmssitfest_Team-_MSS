import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import ClassSchedules from './components/ClassSchedules';
import Assignments from './components/Assignments';
import Grades from './components/Grades';
import Attendance from './components/Attendance';
import './StudentPanel.css';

const StudentPanel = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'schedules', label: 'Class Schedules', icon: '📅' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'grades', label: 'Grades', icon: '📈' },
    { id: 'attendance', label: 'Attendance', icon: '✅' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <Profile />;
      case 'schedules':
        return <ClassSchedules />;
      case 'assignments':
        return <Assignments />;
      case 'grades':
        return <Grades />;
      case 'attendance':
        return <Attendance />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="student-panel">
      <div className="student-sidebar">
        <div className="sidebar-header">
          <h2>Student Portal</h2>
          <div className="student-info">
            <div className="student-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div className="student-name">
              <p>{user?.name || 'Student'}</p>
              <span>{user?.email || 'student@school.edu'}</span>
            </div>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-label">{section.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="student-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default StudentPanel;

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import MyClasses from './components/MyClasses';
import Students from './components/Students';
import Attendance from './components/Attendance';
import Assignments from './components/Assignments';
import GradeSheets from './components/GradeSheets';
import './TeacherPanel.css';

const TeacherPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'classes', label: 'My Classes', icon: '📚' },
    { id: 'students', label: 'Students', icon: '👨‍🎓' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'attendance', label: 'Attendance', icon: '✅' },
    { id: 'gradeSheets', label: 'Grade Sheets', icon: '📊' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <Profile />;
      case 'classes':
        return <MyClasses />;
      case 'students':
        return <Students />;
      case 'assignments':
        return <Assignments />;
      case 'attendance':
        return <Attendance />;
      case 'gradeSheets':
        return <GradeSheets />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="teacher-panel">
      <div className="teacher-sidebar">
        <div className="sidebar-header">
          <h2>Teacher Portal</h2>
          <div className="teacher-info">
            <div className="teacher-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'T'}
            </div>
            <div className="teacher-name">
              <p>{user?.name || 'Teacher'}</p>
              <span>{user?.email || 'teacher@school.edu'}</span>
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

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="teacher-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default TeacherPanel;


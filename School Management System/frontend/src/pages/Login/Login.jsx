import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    student: { email: '', password: '' },
    teacher: { email: '', password: '' },
    admin: { email: '', password: '' }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (userType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [userType]: {
        ...prev[userType],
        [field]: value
      }
    }));
    setError(''); // Clear error on input change
  };

  // Helper function for permissions
  const getPermissionsByRole = (role) => {
    const permissions = {
      student: ['view_timetable', 'view_grades', 'submit_assignments'],
      teacher: ['manage_classes', 'upload_materials', 'grade_students', 'generate_timetable'],
      admin: ['manage_users', 'system_settings', 'view_reports', 'all_permissions']
    };
    return permissions[role] || [];
  };

  const handleLogin = async (userType) => {
    const { email, password } = formData[userType];
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user object based on type
      const userData = {
        id: Date.now().toString(),
        email: email,
        name: email.split('@')[0].replace('.', ' '),
        role: userType,
        avatar: userType === 'student' ? '👨‍🎓' : userType === 'teacher' ? '👨‍🏫' : '⚙️',
        permissions: getPermissionsByRole(userType)
      };
      
      // Login using auth context
      login(userData);
      
      // Redirect based on user type
      switch(userType) {
        case 'student':
          navigate('/student');
          break;
        case 'teacher':
          navigate('/teacher');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
      
    } catch (err) {
      console.log(err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (userType) => {
    alert(`Password reset link will be sent to your ${userType} email.`);
  };

  const handleQuickLogin = (userType, demoEmail) => {
    setActiveTab(userType);
    setFormData(prev => ({
      ...prev,
      [userType]: {
        email: demoEmail,
        password: 'demo123'
      }
    }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="logo-section">
            <img src="/logo.png" alt="NMSS SMART Logo" className="login-logo" />
            <h1>NMSS SMART</h1>
          </div>
          <p className="login-subtitle">Access your school management portal</p>
        </div>

        {/* Login Tabs */}
        <div className="login-tabs">
          <button
            className={`tab-btn ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => setActiveTab('student')}
          >
            <span className="tab-icon">👨‍🎓</span>
            Student Login
          </button>
          <button
            className={`tab-btn ${activeTab === 'teacher' ? 'active' : ''}`}
            onClick={() => setActiveTab('teacher')}
          >
            <span className="tab-icon">👨‍🏫</span>
            Teacher Login
          </button>
          <button
            className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <span className="tab-icon">⚙️</span>
            Admin Login
          </button>
        </div>

        {/* Login Form */}
        <div className="login-form-container">
          {/* Student Login */}
          {activeTab === 'student' && (
            <div className="login-form">
              <div className="form-header">
                <h2>Student Portal</h2>
                <p>Access your timetable, assignments, and grades</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="student-email">
                  <span className="label-icon">📧</span>
                  Student Email
                </label>
                <input
                  id="student-email"
                  type="email"
                  placeholder="student@school.edu"
                  value={formData.student.email}
                  onChange={(e) => handleInputChange('student', 'email', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="student-password">
                  <span className="label-icon">🔒</span>
                  Password
                </label>
                <input
                  id="student-password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.student.password}
                  onChange={(e) => handleInputChange('student', 'password', e.target.value)}
                />
              </div>
              
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <button 
                  className="forgot-password"
                  onClick={() => handleForgotPassword('student')}
                >
                  Forgot Password?
                </button>
              </div>
              
              <button
                className="login-btn student-btn"
                onClick={() => handleLogin('student')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner">⏳</span>
                ) : (
                  <>
                    <span className="btn-icon">🎓</span>
                    Sign in as Student
                  </>
                )}
              </button>
              
              <button
                className="demo-btn"
                onClick={() => handleQuickLogin('student', 'demo.student@school.edu')}
              >
                Try Demo Student Account
              </button>
            </div>
          )}

          {/* Teacher Login */}
          {activeTab === 'teacher' && (
            <div className="login-form">
              <div className="form-header">
                <h2>Teacher Portal</h2>
                <p>Manage classes, upload materials, and track attendance</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="teacher-email">
                  <span className="label-icon">📧</span>
                  Teacher Email
                </label>
                <input
                  id="teacher-email"
                  type="email"
                  placeholder="teacher@school.edu"
                  value={formData.teacher.email}
                  onChange={(e) => handleInputChange('teacher', 'email', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="teacher-password">
                  <span className="label-icon">🔒</span>
                  Password
                </label>
                <input
                  id="teacher-password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.teacher.password}
                  onChange={(e) => handleInputChange('teacher', 'password', e.target.value)}
                />
              </div>
              
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <button 
                  className="forgot-password"
                  onClick={() => handleForgotPassword('teacher')}
                >
                  Forgot Password?
                </button>
              </div>
              
              <button
                className="login-btn teacher-btn"
                onClick={() => handleLogin('teacher')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner">⏳</span>
                ) : (
                  <>
                    <span className="btn-icon">📚</span>
                    Sign in as Teacher
                  </>
                )}
              </button>
              
              <button
                className="demo-btn"
                onClick={() => handleQuickLogin('teacher', 'demo.teacher@school.edu')}
              >
                Try Demo Teacher Account
              </button>
            </div>
          )}

          {/* Admin Login */}
          {activeTab === 'admin' && (
            <div className="login-form">
              <div className="form-header admin-header">
                <h2>Admin Portal</h2>
                <p>Manage school operations, users, and system settings</p>
                <div className="admin-warning">
                  <span className="warning-icon">⚠️</span>
                  Restricted access - authorized personnel only
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="admin-email">
                  <span className="label-icon">👑</span>
                  Admin Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@school.edu"
                  value={formData.admin.email}
                  onChange={(e) => handleInputChange('admin', 'email', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="admin-password">
                  <span className="label-icon">🔐</span>
                  Admin Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  placeholder="Enter admin password"
                  value={formData.admin.password}
                  onChange={(e) => handleInputChange('admin', 'password', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="admin-2fa">
                  <span className="label-icon">🔢</span>
                  2FA Code (Optional)
                </label>
                <input
                  id="admin-2fa"
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                />
              </div>
              
              <button
                className="login-btn admin-btn"
                onClick={() => handleLogin('admin')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner">⏳</span>
                ) : (
                  <>
                    <span className="btn-icon">⚙️</span>
                    Sign in as Admin
                  </>
                )}
              </button>
              
              <button
                className="demo-btn admin-demo-btn"
                onClick={() => handleQuickLogin('admin', 'admin@school.edu')}
              >
                Try Demo Admin Account
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">❌</span>
              {error}
            </div>
          )}

          {/* Back to Home */}
          <div className="back-home">
            <button 
              className="home-btn"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>Need help? Contact support: support@nmss.edu</p>
          <p className="footer-note">
            By logging in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
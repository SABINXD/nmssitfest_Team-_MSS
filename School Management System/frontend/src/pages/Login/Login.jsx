import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    student: { usernameOrEmail: '', password: '' }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      student: {
        ...prev.student,
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

  const handleLogin = async () => {
    const { usernameOrEmail, password } = formData.student;
    
    // Basic validation
    if (!usernameOrEmail || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Determine if input is email or username
      const isEmail = usernameOrEmail.includes('@');
      const requestBody = {
        password,
        ...(isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail })
      };

      // Call backend API
      const res = await fetch('http://localhost:5000/api/students/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      // Handle non-JSON responses (network errors, etc.)
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        if (!res.ok) {
          throw new Error(`Server error (${res.status}): ${res.statusText}`);
        }
        throw new Error('Invalid response from server');
      }
      
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }
      
      // Create user object from backend response
      const userData = {
        id: data.student._id || data.student.studentId,
        email: data.student.email,
        username: data.student.username,
        name: data.student.name,
        role: 'student',
        avatar: '👨‍🎓',
        permissions: getPermissionsByRole('student'),
        studentId: data.student.studentId,
        grade: data.student.grade,
        class: data.student.class,
        rollNumber: data.student.rollNumber
      };
      
      // Login using auth context
      login(userData);
      
      // Redirect to student portal
      navigate('/student');
      
    } catch (err) {
      console.error('Login error:', err);
      // Handle network errors (backend server not running, etc.)
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Cannot connect to server. Please make sure the backend server is running.');
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Demo login - works without backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userData = {
        id: 'demo-student-' + Date.now(),
        email: 'demo.student@school.edu',
        username: 'demostudent',
        name: 'Demo Student',
        role: 'student',
        avatar: '👨‍🎓',
        permissions: getPermissionsByRole('student'),
        studentId: 'DEMO001',
        grade: '10',
        class: 'A',
        isDemo: true
      };
      
      login(userData);
      navigate('/student');
      
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset link will be sent to your student email.');
  };


  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header student-header">
          <div className="portal-icon student-icon">🎓</div>
          <div className="logo-section">
            <img src="/logo.png" alt="NMSS SMART Logo" className="login-logo" />
            <h1>NMSS SMART</h1>
          </div>
          <p className="login-subtitle">Student Portal Access</p>
        </div>

        {/* Login Form */}
        <div className="login-form-container">
          {/* Student Login */}
          <div className="login-form">
              <div className="form-header">
                <h2>Student Portal</h2>
                <p>Access your timetable, assignments, and grades</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="student-username-email">
                  <span className="label-icon">👤</span>
                  Username or Email
                </label>
                <input
                  id="student-username-email"
                  type="text"
                  placeholder="username or student@school.edu"
                  value={formData.student.usernameOrEmail}
                  onChange={(e) => handleInputChange('usernameOrEmail', e.target.value)}
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
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>
              
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <button 
                  className="forgot-password"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>
              
              <button
                className="login-btn student-btn"
                onClick={handleLogin}
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
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                🔓 Login as Demo Student
              </button>
            </div>

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
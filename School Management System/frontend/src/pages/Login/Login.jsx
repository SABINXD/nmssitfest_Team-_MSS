import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    student: { email: '', password: '' }
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
    const { email, password } = formData.student;
    
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
      
      // Create user object
      const userData = {
        id: Date.now().toString(),
        email: email,
        name: email.split('@')[0].replace('.', ' '),
        role: 'student',
        avatar: '👨‍🎓',
        permissions: getPermissionsByRole('student')
      };
      
      // Login using auth context
      login(userData);
      
      // Redirect to student portal
      navigate('/student');
      
    } catch (err) {
      console.log(err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset link will be sent to your student email.');
  };

  const handleQuickLogin = (demoEmail) => {
    setFormData(prev => ({
      ...prev,
      student: {
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

        {/* Login Form */}
        <div className="login-form-container">
          {/* Student Login */}
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
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
                onClick={() => handleQuickLogin('demo.student@school.edu')}
              >
                Try Demo Student Account
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
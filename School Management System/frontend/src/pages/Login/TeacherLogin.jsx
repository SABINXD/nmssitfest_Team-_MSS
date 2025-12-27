import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../contexts/AuthContext';

const TeacherLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const getPermissionsByRole = (role) => {
    const permissions = {
      teacher: ['manage_classes', 'upload_materials', 'grade_students', 'generate_timetable']
    };
    return permissions[role] || [];
  };

  const handleLogin = async () => {
    const { email, password } = formData;
    
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now().toString(),
        email: email,
        name: email.split('@')[0].replace('.', ' '),
        role: 'teacher',
        avatar: '👨‍🏫',
        permissions: getPermissionsByRole('teacher')
      };
      
      login(userData);
      navigate('/teacher');
      
    } catch (err) {
      console.log(err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <img src="/logo.png" alt="NMSS SMART Logo" className="login-logo" />
            <h1>NMSS SMART</h1>
          </div>
          <p className="login-subtitle">Teacher Portal Access</p>
        </div>

        <div className="login-form-container">
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
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
            </div>
            
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <button className="forgot-password">
                Forgot Password?
              </button>
            </div>
            
            <button
              className="login-btn teacher-btn"
              onClick={handleLogin}
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

            {error && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {error}
              </div>
            )}

            <div className="back-home">
              <button className="home-btn" onClick={() => navigate('/')}>
                ← Back to Home
              </button>
            </div>
          </div>
        </div>

        <div className="login-footer">
          <p>Need help? Contact support: support@nmss.edu</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;


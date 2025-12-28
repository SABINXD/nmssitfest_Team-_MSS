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
    setError(''); // Clear error on input change
  };

  const handleLogin = async () => {
    const { email, password } = formData;
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:5000/api/teachers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email, // allowing username or email based on your snippet
          email,
          password
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Update global auth state
      login({ ...data.teacher, role: 'teacher' });
      
      // Redirect to teacher dashboard
      navigate('/teacher');
      
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Please contact the administrator to reset your teacher account password.');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header teacher-header">
          <div className="portal-icon teacher-icon">👨‍🏫</div>
          <div className="logo-section">
            <img src="/logo.png" alt="NMSS SMART Logo" className="login-logo" />
            <h1>NMSS SMART</h1>
          </div>
          <p className="login-subtitle">Teacher Portal Access</p>
        </div>

        {/* Login Form */}
        <div className="login-form-container">
          <div className="login-form">
            <div className="form-header">
              <h2>Teacher Portal</h2>
              <p>Manage classes, upload materials, and track attendance</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="teacher-email">
                <span className="label-icon">📧</span>
                Teacher Email / Username
              </label>
              <input
                id="teacher-email"
                type="text"
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
              <button 
                className="forgot-password"
                onClick={handleForgotPassword}
              >
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
                  <span className="btn-icon">👨‍🏫</span>
                  Sign in as Teacher
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">❌</span>
              {error}
            </div>
          )}

          {/* Back to Home/Portal Selection */}
          <div className="back-home">
            <button 
              className="home-btn"
              onClick={() => navigate('/')}
            >
              ← Back to Portal Selection
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>Need help? Contact IT Support: it-support@nmss.edu</p>
          <p className="footer-note">
            Secure Teacher Access - Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
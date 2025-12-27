import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', twoFA: '' });
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
      admin: ['manage_users', 'system_settings', 'view_reports', 'all_permissions']
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
      // Demo credentials (will be replaced with backend API call)
      const validCredentials = {
        'admin@nmss.edu': 'admin123',
        'admin@school.edu': 'admin123',
        'depaak.tiwari@nmss.edu': 'admin123'
      };
      
      // Check credentials (demo - replace with actual API call)
      if (validCredentials[email.toLowerCase()] && validCredentials[email.toLowerCase()] === password) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData = {
          id: Date.now().toString(),
          email: email,
          name: email.split('@')[0].replace('.', ' '),
          role: 'admin',
          avatar: '⚙️',
          permissions: getPermissionsByRole('admin')
        };
        
        login(userData);
        navigate('/admin');
      } else {
        // For demo purposes, still allow login with any credentials
        // Remove this else block when backend is connected
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData = {
          id: Date.now().toString(),
          email: email,
          name: email.split('@')[0].replace('.', ' '),
          role: 'admin',
          avatar: '⚙️',
          permissions: getPermissionsByRole('admin')
        };
        
        login(userData);
        navigate('/admin');
      }
      
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
          <p className="login-subtitle">Admin Portal Access</p>
        </div>

        <div className="login-form-container">
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
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
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
                value={formData.twoFA}
                onChange={(e) => handleInputChange('twoFA', e.target.value)}
              />
            </div>
            
            <button
              className="login-btn admin-btn"
              onClick={handleLogin}
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

            {error && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {error}
              </div>
            )}

            <div className="demo-credentials">
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem', textAlign: 'center' }}>
                <strong>Demo Credentials:</strong><br />
                Email: admin@nmss.edu<br />
                Password: admin123
              </p>
            </div>

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

export default AdminLogin;


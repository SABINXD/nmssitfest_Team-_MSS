import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@school.edu',
    phone: '+1 234 567 8900',
    address: '123 Main Street, City, State 12345',
    dateOfBirth: '2005-05-15',
    studentId: 'STU2024001',
    grade: '11th Grade',
    section: 'A'
  });

  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'Jane Doe', relationship: 'Mother', phone: '+1 234 567 8901', email: 'jane.doe@email.com' },
    { id: 2, name: 'John Doe Sr.', relationship: 'Father', phone: '+1 234 567 8902', email: 'john.sr@email.com' }
  ]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePersonalInfo = () => {
    // API call to save personal info
    setIsEditing(false);
    alert('Personal information updated successfully!');
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // API call to change password
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password changed successfully!');
  };

  const handleAddEmergencyContact = () => {
    const newContact = {
      id: emergencyContacts.length + 1,
      name: '',
      relationship: '',
      phone: '',
      email: ''
    };
    setEmergencyContacts([...emergencyContacts, newContact]);
  };

  const handleUpdateEmergencyContact = (id, field, value) => {
    setEmergencyContacts(emergencyContacts.map(contact =>
      contact.id === id ? { ...contact, [field]: value } : contact
    ));
  };

  const handleRemoveEmergencyContact = (id) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Profile Management</h1>
        <p>Manage your personal information and account settings</p>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Information
        </button>
        <button
          className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Password & Security
        </button>
        <button
          className={`tab-button ${activeTab === 'emergency' ? 'active' : ''}`}
          onClick={() => setActiveTab('emergency')}
        >
          Emergency Contacts
        </button>
        <button
          className={`tab-button ${activeTab === 'academic' ? 'active' : ''}`}
          onClick={() => setActiveTab('academic')}
        >
          Academic Details
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'personal' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Personal Information</h2>
              {!isEditing && (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  ✏️ Edit
                </button>
              )}
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={personalInfo.name}
                  onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={personalInfo.address}
                  onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                  disabled={!isEditing}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Student ID</label>
                  <input
                    type="text"
                    value={personalInfo.studentId}
                    disabled
                    className="disabled-input"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button className="save-btn" onClick={handleSavePersonalInfo}>
                    💾 Save Changes
                  </button>
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Change Password</h2>
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              <div className="form-actions">
                <button className="save-btn" onClick={handleChangePassword}>
                  🔒 Change Password
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emergency' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Emergency Contacts</h2>
              <button className="add-btn" onClick={handleAddEmergencyContact}>
                ➕ Add Contact
              </button>
            </div>

            <div className="emergency-contacts">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="contact-card">
                  <div className="contact-form">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => handleUpdateEmergencyContact(contact.id, 'name', e.target.value)}
                        placeholder="Full name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Relationship</label>
                      <input
                        type="text"
                        value={contact.relationship}
                        onChange={(e) => handleUpdateEmergencyContact(contact.id, 'relationship', e.target.value)}
                        placeholder="e.g., Mother, Father, Guardian"
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => handleUpdateEmergencyContact(contact.id, 'phone', e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => handleUpdateEmergencyContact(contact.id, 'email', e.target.value)}
                        placeholder="Email address"
                      />
                    </div>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveEmergencyContact(contact.id)}
                  >
                    🗑️ Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'academic' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Academic Details</h2>
            </div>

            <div className="academic-info">
              <div className="info-card">
                <h3>Current Enrollment</h3>
                <div className="info-item">
                  <span className="info-label">Grade:</span>
                  <span className="info-value">{personalInfo.grade}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Section:</span>
                  <span className="info-value">{personalInfo.section}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Student ID:</span>
                  <span className="info-value">{personalInfo.studentId}</span>
                </div>
              </div>

              <div className="info-card">
                <h3>Academic Performance</h3>
                <div className="info-item">
                  <span className="info-label">Current GPA:</span>
                  <span className="info-value">3.75</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Total Credits:</span>
                  <span className="info-value">24</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Attendance Rate:</span>
                  <span className="info-value">92.3%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

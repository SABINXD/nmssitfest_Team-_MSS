import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    employeeId: user?.employeeId || '',
    department: user?.department || '',
    subjects: user?.subjects?.join(', ') || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // API call to save profile
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and account details</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {user?.name?.charAt(0)?.toUpperCase() || 'T'}
            </div>
            <h2>{profileData.name || 'Teacher Name'}</h2>
            <p>{profileData.email || 'teacher@school.edu'}</p>
          </div>

          <div className="profile-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Employee ID</label>
              <input
                type="text"
                value={profileData.employeeId}
                disabled
                className="disabled-input"
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                value={profileData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Subjects</label>
              <input
                type="text"
                value={profileData.subjects}
                onChange={(e) => handleChange('subjects', e.target.value)}
                disabled={!isEditing}
                placeholder="Comma-separated subjects"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                value={profileData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                disabled={!isEditing}
                rows="3"
              />
            </div>

            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="form-actions">
                <button className="save-btn" onClick={handleSave}>
                  💾 Save Changes
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


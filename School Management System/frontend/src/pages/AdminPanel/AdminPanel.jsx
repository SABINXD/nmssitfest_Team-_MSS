import React, { useState, useCallback } from 'react';
import RoutineGenerator from '../RoutineGenerator/RoutineGenerator';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [studentsFile, setStudentsFile] = useState(null);
  const [students, setStudents] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Handle student file selection
  const handleFileSelect = (file) => {
    if (!file) return;
    
    if (!file.name.endsWith('.xlsx')) {
      setError('Please upload only .xlsx files');
      return;
    }

    setStudentsFile(file);
    setError(null);
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  // Process student file and generate credentials
  const processStudentsFile = async () => {
    if (!studentsFile) {
      setError('Please upload a student file first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setStudents([]);

    try {
      const formData = new FormData();
      formData.append('studentsFile', studentsFile);

      // Call backend API
      const response = await fetch('http://localhost:5000/api/students/upload', {
        method: 'POST',
        body: formData,
      });

      // Check if response is OK
      if (!response.ok) {
        // Check content type before parsing
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || 'Failed to process student file');
        } else {
          // If it's HTML (like a 404 page), get text instead
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          throw new Error(`Server error (${response.status}): ${response.statusText}. Make sure the backend server is running on port 5000.`);
        }
      }

      // Check if response is an Excel file
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        // Get the Excel file from response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `student_credentials_${Date.now()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        setSuccess('Students processed and saved to database! Credentials file downloaded.');
      } else {
        // If not Excel, try to parse as JSON (for error messages)
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setSuccess('Students processed successfully!');
      }
      
    } catch (err) {
      console.error('Error processing file:', err);
      let errorMessage = err.message || 'Failed to process student file. Please check the file format and try again.';
      
      // Provide helpful error messages
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend server is running on port 5000.';
      } else if (err.message.includes('5000')) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download credentials as CSV
  const downloadCredentials = () => {
    if (students.length === 0) {
      setError('No student credentials to download');
      return;
    }

    const csvContent = [
      ['Student ID', 'Name', 'Email', 'Password', 'Class'],
      ...students.map(s => [s.id, s.name, s.email, s.password, s.class])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_credentials.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>⚙️ Admin Panel</h1>
        <p>Manage students, generate timetables, and system settings</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          👨‍🎓 Student Management
        </button>
        <button
          className={`admin-tab ${activeTab === 'routine' ? 'active' : ''}`}
          onClick={() => setActiveTab('routine')}
        >
          📅 Routine Generator
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'students' && (
          <div className="students-management">
            <div className="section-header">
              <h2>Student Management</h2>
              <p>Upload student Excel file to generate login credentials</p>
            </div>

            {/* File Upload */}
            <div className="upload-section">
              <div 
                className={`file-upload-area ${dragOver ? 'drag-over' : ''}`}
                onClick={() => document.getElementById('students-file-input').click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="upload-icon">📄</div>
                <p>Drag & drop your students.xlsx file here</p>
                <p><strong>or click to browse</strong></p>
                <input
                  id="students-file-input"
                  type="file"
                  className="file-input"
                  accept=".xlsx"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
              </div>

              {studentsFile && (
                <div className="selected-file">
                  <div className="file-icon">✅</div>
                  <div className="file-info">
                    <h4>{studentsFile.name}</h4>
                    <p>{formatFileSize(studentsFile.size)}</p>
                  </div>
                  <button 
                    className="remove-file" 
                    onClick={() => {
                      setStudentsFile(null);
                      setStudents([]);
                      setSuccess(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Process Button */}
            {studentsFile && (
              <div className="action-section">
                <button
                  className="process-btn"
                  onClick={processStudentsFile}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner">⏳</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      🔄 Process File & Generate Credentials
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Messages */}
            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                ✅ {success}
              </div>
            )}

            {/* Student Credentials Table */}
            {students.length > 0 && (
              <div className="credentials-section">
                <div className="credentials-header">
                  <h3>Generated Student Credentials</h3>
                  <button className="download-btn" onClick={downloadCredentials}>
                    ⬇️ Download CSV
                  </button>
                </div>
                <div className="credentials-table-container">
                  <table className="credentials-table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Class</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr key={index}>
                          <td>{student.id}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>
                            <code>{student.password}</code>
                          </td>
                          <td>{student.class}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="requirements">
              <h3>📋 File Requirements:</h3>
              <ul>
                <li>File must be in .xlsx format (Excel)</li>
                <li>Required columns: Name, Email, Class, Roll Number</li>
                <li>Maximum file size: 10MB</li>
                <li>Credentials will be auto-generated for each student</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'routine' && (
          <div className="routine-section">
            <RoutineGenerator />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;


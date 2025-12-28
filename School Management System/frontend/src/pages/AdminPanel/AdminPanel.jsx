import React, { useState, useCallback } from 'react';
import RoutineGenerator from '../RoutineGenerator/RoutineGenerator';
import LibraryPanel from './LibraryPanel';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [studentsFile, setStudentsFile] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachersFile, setTeachersFile] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragOverTeachers, setDragOverTeachers] = useState(false);
  const [classFilter, setClassFilter] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [teacherNameSearch, setTeacherNameSearch] = useState('');

  // Fetch all students from backend
  const fetchStudents = React.useCallback(() => {
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(() => setError('Failed to fetch students from server.'));
  }, []);

  // Fetch all teachers from backend
  const fetchTeachers = React.useCallback(() => {
    fetch('http://localhost:5000/api/teachers')
      .then(res => res.json())
      .then(data => setTeachers(data))
      .catch(() => setError('Failed to fetch teachers from server.'));
  }, []);

  React.useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    } else if (activeTab === 'teachers') {
      fetchTeachers();
    }
  }, [activeTab, fetchStudents, fetchTeachers]);

  // Get unique class list for filter dropdown
  const classList = React.useMemo(() => {
    const setCls = new Set();
    students.forEach(s => s.class && setCls.add(s.class));
    return Array.from(setCls).sort();
  }, [students]);

  // Filtered students
  const filteredStudents = students.filter(student => {
    const classMatch = classFilter ? student.class === classFilter : true;
    const nameMatch = nameSearch ? student.name.toLowerCase().includes(nameSearch.toLowerCase()) : true;
    return classMatch && nameMatch;
  });

  // Get unique department list for filter dropdown
  const departmentList = React.useMemo(() => {
    const deptSet = new Set();
    teachers.forEach(t => t.department && deptSet.add(t.department));
    return Array.from(deptSet).sort();
  }, [teachers]);

  // Filtered teachers
  const filteredTeachers = teachers.filter(teacher => {
    const deptMatch = departmentFilter ? teacher.department === departmentFilter : true;
    const nameMatch = teacherNameSearch ? teacher.name.toLowerCase().includes(teacherNameSearch.toLowerCase()) : true;
    return deptMatch && nameMatch;
  });

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

  // Handle teacher file selection
  const handleTeacherFileSelect = (file) => {
    if (!file) return;
    
    if (!file.name.endsWith('.xlsx')) {
      setError('Please upload only .xlsx files');
      return;
    }

    setTeachersFile(file);
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

  const handleDragOverTeachers = useCallback((e) => {
    e.preventDefault();
    setDragOverTeachers(true);
  }, []);

  const handleDragLeaveTeachers = useCallback((e) => {
    e.preventDefault();
    setDragOverTeachers(false);
  }, []);

  const handleDropTeachers = useCallback((e) => {
    e.preventDefault();
    setDragOverTeachers(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleTeacherFileSelect(file);
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
        fetchStudents(); // Refresh the student list
      } else {
        // If not Excel, try to parse as JSON (for error messages)
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setSuccess('Students processed successfully!');
        fetchStudents(); // Refresh the student list
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

  // Process teacher file and generate credentials
  const processTeachersFile = async () => {
    if (!teachersFile) {
      setError('Please upload a teacher file first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setTeachers([]);

    try {
      const formData = new FormData();
      formData.append('teachersFile', teachersFile);

      // Call backend API
      const response = await fetch('http://localhost:5000/api/teachers/upload', {
        method: 'POST',
        body: formData,
      });

      // Check if response is OK
      if (!response.ok) {
        // Check content type before parsing
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || 'Failed to process teacher file');
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
        a.download = `teacher_credentials_${Date.now()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        setSuccess('Teachers processed and saved to database! Credentials file downloaded.');
        fetchTeachers(); // Refresh the teacher list
      } else {
        // If not Excel, try to parse as JSON (for error messages)
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setSuccess('Teachers processed successfully!');
        fetchTeachers(); // Refresh the teacher list
      }
      
    } catch (err) {
      console.error('Error processing file:', err);
      let errorMessage = err.message || 'Failed to process teacher file. Please check the file format and try again.';
      
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
          className={`admin-tab ${activeTab === 'teachers' ? 'active' : ''}`}
          onClick={() => setActiveTab('teachers')}
        >
          👨‍🏫 Teacher Management
        </button>
        <button
          className={`admin-tab ${activeTab === 'routine' ? 'active' : ''}`}
          onClick={() => setActiveTab('routine')}
        >
          📅 Routine Generator
        </button>
        <button
          className={`admin-tab ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          📚 Library
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

            {/* Student Database Table with Login Indicator */}
            {students.length > 0 && (
              <div className="credentials-section">
                <div className="credentials-header">
                  <h3>All Students in Database</h3>
                  <div style={{ display: 'flex', gap: 16, margin: '16px 0' }}>
                    <div>
                      <label>Filter by Class:{' '}
                        <select value={classFilter} onChange={e => setClassFilter(e.target.value)}>
                          <option value=''>All</option>
                          {classList.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div>
                      <label>Search by Name:{' '}
                        <input
                          type="text"
                          placeholder="Enter name..."
                          value={nameSearch}
                          onChange={e => setNameSearch(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="credentials-table-container">
                  <table className="credentials-table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Class</th>
                        <th>Login Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, index) => (
                        <tr key={index}>
                          <td>{student.studentId}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.username}</td>
                          <td>{student.class}</td>
                          <td>
                            {student.lastLogin ? (
                              <span style={{ color: 'green', fontWeight: 'bold' }}>Logged in</span>
                            ) : (
                              <span style={{ color: 'gray' }}>Never logged in</span>
                            )}
                          </td>
                          <td style={{display:'flex',gap:8}}>
                            <button
                              title="Reset Password"
                              style={{background:'#f3f4f6',border:'none',borderRadius:4,padding:'4px 8px',color:'#0b4da2',fontWeight:'bold',cursor:'pointer',fontSize:'0.9rem'}} 
                              onClick={async () => {
                                if(window.confirm('Reset password for this student? Password will be set to username.')) {
                                  await fetch(`http://localhost:5000/api/students/reset-password/${student._id}`,{method:'POST'});
                                  alert('Password reset to username');
                                  fetchStudents(); // Refresh the data
                                }
                              }}
                            >🔑 Reset</button>
                            <button
                              title="Delete Student"
                              style={{background:'#fee2e2',border:'none',borderRadius:4,padding:'4px 8px',color:'#dc2626',fontWeight:'bold',cursor:'pointer',fontSize:'0.9rem',display:'flex',alignItems:'center',gap:2}}
                              onClick={async () => {
                                if(window.confirm('Are you sure you want to delete this student?')) {
                                  await fetch(`http://localhost:5000/api/students/${student._id}`,{method:'DELETE'});
                                  alert('Student deleted');
                                  fetchStudents(); // Refresh the data
                                }
                              }}
                            >🗑️ Delete</button>
                          </td>
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

        {activeTab === 'teachers' && (
          <div className="teachers-management">
            <div className="section-header">
              <h2>Teacher Management</h2>
              <p>Upload teacher Excel file to generate login credentials</p>
            </div>

            {/* File Upload */}
            <div className="upload-section">
              <div 
                className={`file-upload-area ${dragOverTeachers ? 'drag-over' : ''}`}
                onClick={() => document.getElementById('teachers-file-input').click()}
                onDragOver={handleDragOverTeachers}
                onDragLeave={handleDragLeaveTeachers}
                onDrop={handleDropTeachers}
              >
                <div className="upload-icon">📄</div>
                <p>Drag & drop your teachers.xlsx file here</p>
                <p><strong>or click to browse</strong></p>
                <input
                  id="teachers-file-input"
                  type="file"
                  className="file-input"
                  accept=".xlsx"
                  onChange={(e) => handleTeacherFileSelect(e.target.files[0])}
                />
              </div>

              {teachersFile && (
                <div className="selected-file">
                  <div className="file-icon">✅</div>
                  <div className="file-info">
                    <h4>{teachersFile.name}</h4>
                    <p>{formatFileSize(teachersFile.size)}</p>
                  </div>
                  <button 
                    className="remove-file" 
                    onClick={() => {
                      setTeachersFile(null);
                      setTeachers([]);
                      setSuccess(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Process Button */}
            {teachersFile && (
              <div className="action-section">
                <button
                  className="process-btn"
                  onClick={processTeachersFile}
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

            {/* Teacher Database Table with Login Indicator */}
            {teachers.length > 0 && (
              <div className="credentials-section">
                <div className="credentials-header">
                  <h3>All Teachers in Database</h3>
                  <div style={{ display: 'flex', gap: 16, margin: '16px 0' }}>
                    <div>
                      <label>Filter by Department:{' '}
                        <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
                          <option value=''>All</option>
                          {departmentList.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div>
                      <label>Search by Name:{' '}
                        <input
                          type="text"
                          placeholder="Enter name..."
                          value={teacherNameSearch}
                          onChange={e => setTeacherNameSearch(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="credentials-table-container">
                  <table className="credentials-table">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Department</th>
                        <th>Subjects</th>
                        <th>Login Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeachers.map((teacher, index) => (
                        <tr key={index}>
                          <td>{teacher.employeeId}</td>
                          <td>{teacher.name}</td>
                          <td>{teacher.email}</td>
                          <td>{teacher.username}</td>
                          <td>{teacher.department}</td>
                          <td>{teacher.subjects && teacher.subjects.join(', ')}</td>
                          <td>
                            {teacher.lastLogin ? (
                              <span style={{ color: 'green', fontWeight: 'bold' }}>Logged in</span>
                            ) : (
                              <span style={{ color: 'gray' }}>Never logged in</span>
                            )}
                          </td>
                          <td style={{display:'flex',gap:8}}>
                            <button
                              title="Reset Password"
                              style={{background:'#f3f4f6',border:'none',borderRadius:4,padding:'4px 8px',color:'#059669',fontWeight:'bold',cursor:'pointer',fontSize:'0.9rem'}} 
                              onClick={async () => {
                                if(window.confirm('Reset password for this teacher? Password will be set to username.')) {
                                  await fetch(`http://localhost:5000/api/teachers/reset-password/${teacher._id}`,{method:'POST'});
                                  alert('Password reset to username');
                                  fetchTeachers(); // Refresh the data
                                }
                              }}
                            >🔑 Reset</button>
                            <button
                              title="Delete Teacher"
                              style={{background:'#fee2e2',border:'none',borderRadius:4,padding:'4px 8px',color:'#dc2626',fontWeight:'bold',cursor:'pointer',fontSize:'0.9rem',display:'flex',alignItems:'center',gap:2}}
                              onClick={async () => {
                                if(window.confirm('Are you sure you want to delete this teacher?')) {
                                  await fetch(`http://localhost:5000/api/teachers/${teacher._id}`,{method:'DELETE'});
                                  alert('Teacher deleted');
                                  fetchTeachers(); // Refresh the data
                                }
                              }}
                            >🗑️ Delete</button>
                          </td>
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
                <li>Required columns: Name, Email, Department</li>
                <li>Optional columns: Employee ID, Username, Subjects, Phone, Address, Is Active</li>
                <li>Maximum file size: 10MB</li>
                <li>Credentials will be auto-generated for each teacher</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'routine' && (
          <div className="routine-section">
            <RoutineGenerator />
          </div>
        )}

        {activeTab === 'library' && (
          <div className="library-section">
            <LibraryPanel />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;


import React, { useState, useEffect } from 'react';
import './Students.css';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/students');
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const classList = ['all', ...new Set(students.map(s => s.class).filter(Boolean))];

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="students">
        <div className="students-header">
          <h1>Students</h1>
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="students">
      <div className="students-header">
        <h1>Students</h1>
        <p>View and manage your students</p>
      </div>

      <div className="students-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            {classList.map(cls => (
              <option key={cls} value={cls}>
                {cls === 'all' ? 'All Classes' : `Class ${cls}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student._id || student.id}>
                  <td>{student.name || 'N/A'}</td>
                  <td>{student.class || 'N/A'}</td>
                  <td>{student.email || 'N/A'}</td>
                  <td>
                    <button 
                      className="view-student-btn"
                      onClick={() => handleViewStudent(student)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Student Details Modal */}
      {isModalOpen && selectedStudent && (
        <div className="student-modal" onClick={closeModal}>
          <div className="student-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Student Details</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="student-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{selectedStudent.name || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Student ID:</span>
                  <span className="detail-value">{selectedStudent.studentId || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedStudent.email || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Username:</span>
                  <span className="detail-value">{selectedStudent.username || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Class:</span>
                  <span className="detail-value">{selectedStudent.class || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Grade:</span>
                  <span className="detail-value">{selectedStudent.grade || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Roll Number:</span>
                  <span className="detail-value">{selectedStudent.rollNumber || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Age:</span>
                  <span className="detail-value">{selectedStudent.age || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">
                    <span className={`status-badge ${selectedStudent.enrolled ? 'enrolled' : 'not-enrolled'}`}>
                      {selectedStudent.enrolled ? 'Enrolled' : 'Not Enrolled'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Enrollment Date:</span>
                  <span className="detail-value">{formatDate(selectedStudent.createdAt)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Login:</span>
                  <span className="detail-value">{formatDate(selectedStudent.lastLogin)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="close-modal-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;


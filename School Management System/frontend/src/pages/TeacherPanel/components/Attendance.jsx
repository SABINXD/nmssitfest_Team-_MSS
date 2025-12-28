import React, { useState } from 'react';
import './Attendance.css';

const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState('11A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data - replace with actual API calls
  const students = [
    { id: 1, name: 'John Doe', rollNumber: '001', status: 'present' },
    { id: 2, name: 'Jane Smith', rollNumber: '002', status: 'present' },
    { id: 3, name: 'Bob Johnson', rollNumber: '003', status: 'absent' },
    { id: 4, name: 'Alice Williams', rollNumber: '004', status: 'present' },
    { id: 5, name: 'Charlie Brown', rollNumber: '005', status: 'present' }
  ];

  const handleStatusChange = (studentId, status) => {
    // API call to update attendance
    console.log(`Updating attendance for student ${studentId} to ${status}`);
  };

  const handleSaveAttendance = () => {
    // API call to save attendance
    alert('Attendance saved successfully!');
  };

  return (
    <div className="attendance">
      <div className="attendance-header">
        <h1>Mark Attendance</h1>
        <p>Record and manage student attendance</p>
      </div>

      <div className="attendance-controls">
        <div className="control-group">
          <label>Select Class</label>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="11A">Class 11A</option>
            <option value="11B">Class 11B</option>
            <option value="12A">Class 12A</option>
            <option value="12B">Class 12B</option>
          </select>
        </div>
        <div className="control-group">
          <label>Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.rollNumber}</td>
                <td>{student.name}</td>
                <td>
                  <span className={`status-badge ${student.status}`}>
                    {student.status === 'present' ? 'Present' : 'Absent'}
                  </span>
                </td>
                <td>
                  <div className="status-buttons">
                    <button
                      className={`status-btn present ${student.status === 'present' ? 'active' : ''}`}
                      onClick={() => handleStatusChange(student.id, 'present')}
                    >
                      ✓ Present
                    </button>
                    <button
                      className={`status-btn absent ${student.status === 'absent' ? 'active' : ''}`}
                      onClick={() => handleStatusChange(student.id, 'absent')}
                    >
                      ✗ Absent
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="attendance-footer">
        <button className="save-attendance-btn" onClick={handleSaveAttendance}>
          💾 Save Attendance
        </button>
      </div>
    </div>
  );
};

export default Attendance;


import React from 'react';
import './MyClasses.css';

const MyClasses = () => {
  // Mock data - replace with actual API calls
  const classes = [
    { id: 1, subject: 'Mathematics', class: '11A', schedule: 'Mon, Wed, Fri - 10:00 AM', students: 25 },
    { id: 2, subject: 'Mathematics', class: '11B', schedule: 'Mon, Wed, Fri - 11:30 AM', students: 28 },
    { id: 3, subject: 'Mathematics', class: '12A', schedule: 'Tue, Thu - 02:00 PM', students: 22 },
    { id: 4, subject: 'Advanced Math', class: '12B', schedule: 'Tue, Thu - 03:30 PM', students: 20 },
    { id: 5, subject: 'Mathematics', class: '10A', schedule: 'Mon, Wed - 09:00 AM', students: 30 }
  ];

  return (
    <div className="my-classes">
      <div className="classes-header">
        <h1>My Classes</h1>
        <p>Manage and view your assigned classes</p>
      </div>

      <div className="classes-grid">
        {classes.map((classItem) => (
          <div key={classItem.id} className="class-card">
            <div className="class-card-header">
              <h2>{classItem.subject}</h2>
              <span className="class-badge">{classItem.class}</span>
            </div>
            <div className="class-card-body">
              <div className="class-info-item">
                <span className="info-label">📅 Schedule:</span>
                <span className="info-value">{classItem.schedule}</span>
              </div>
              <div className="class-info-item">
                <span className="info-label">👨‍🎓 Students:</span>
                <span className="info-value">{classItem.students}</span>
              </div>
            </div>
            <div className="class-card-footer">
              <button className="view-btn">View Details</button>
              <button className="manage-btn">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyClasses;


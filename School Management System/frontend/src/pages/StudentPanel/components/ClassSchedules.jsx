import React, { useState } from 'react';
import './ClassSchedules.css';

const ClassSchedules = () => {
  const [viewMode, setViewMode] = useState('weekly'); // daily, weekly, monthly

  // Mock schedule data
  const weeklySchedule = {
    Monday: [
      { time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Smith', room: 'Room 201' },
      { time: '09:00 - 10:00', subject: 'English', teacher: 'Ms. Johnson', room: 'Room 305' },
      { time: '10:30 - 11:30', subject: 'Science', teacher: 'Dr. Brown', room: 'Lab 101' },
      { time: '11:30 - 12:30', subject: 'History', teacher: 'Mr. Davis', room: 'Room 205' },
      { time: '14:00 - 15:00', subject: 'Physical Education', teacher: 'Coach Wilson', room: 'Gym' }
    ],
    Tuesday: [
      { time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Smith', room: 'Room 201' },
      { time: '09:00 - 10:00', subject: 'Physics', teacher: 'Dr. Brown', room: 'Lab 101' },
      { time: '10:30 - 11:30', subject: 'English', teacher: 'Ms. Johnson', room: 'Room 305' },
      { time: '11:30 - 12:30', subject: 'Chemistry', teacher: 'Ms. White', room: 'Lab 102' },
      { time: '14:00 - 15:00', subject: 'Art', teacher: 'Ms. Garcia', room: 'Room 401' }
    ],
    Wednesday: [
      { time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Smith', room: 'Room 201' },
      { time: '09:00 - 10:00', subject: 'English', teacher: 'Ms. Johnson', room: 'Room 305' },
      { time: '10:30 - 11:30', subject: 'Biology', teacher: 'Dr. Brown', room: 'Lab 101' },
      { time: '11:30 - 12:30', subject: 'Geography', teacher: 'Mr. Davis', room: 'Room 205' },
      { time: '14:00 - 15:00', subject: 'Computer Science', teacher: 'Mr. Lee', room: 'Lab 201' }
    ],
    Thursday: [
      { time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Smith', room: 'Room 201' },
      { time: '09:00 - 10:00', subject: 'Physics', teacher: 'Dr. Brown', room: 'Lab 101' },
      { time: '10:30 - 11:30', subject: 'English', teacher: 'Ms. Johnson', room: 'Room 305' },
      { time: '11:30 - 12:30', subject: 'History', teacher: 'Mr. Davis', room: 'Room 205' },
      { time: '14:00 - 15:00', subject: 'Music', teacher: 'Ms. Taylor', room: 'Room 301' }
    ],
    Friday: [
      { time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Smith', room: 'Room 201' },
      { time: '09:00 - 10:00', subject: 'English', teacher: 'Ms. Johnson', room: 'Room 305' },
      { time: '10:30 - 11:30', subject: 'Science', teacher: 'Dr. Brown', room: 'Lab 101' },
      { time: '11:30 - 12:30', subject: 'Chemistry', teacher: 'Ms. White', room: 'Lab 102' },
      { time: '14:00 - 15:00', subject: 'Physical Education', teacher: 'Coach Wilson', room: 'Gym' }
    ]
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  const getNextClass = () => {
    const todaySchedule = weeklySchedule[today] || [];
    return todaySchedule.find(classItem => {
      const [startTime] = classItem.time.split(' - ');
      return startTime > currentTime;
    });
  };

  const nextClass = getNextClass();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="class-schedules">
      <div className="schedules-header">
        <div>
          <h1>Class Schedules</h1>
          <p>View your class timetable and upcoming classes</p>
        </div>
        <div className="view-mode-selector">
          <button
            className={`view-btn ${viewMode === 'daily' ? 'active' : ''}`}
            onClick={() => setViewMode('daily')}
          >
            Daily
          </button>
          <button
            className={`view-btn ${viewMode === 'weekly' ? 'active' : ''}`}
            onClick={() => setViewMode('weekly')}
          >
            Weekly
          </button>
          <button
            className={`view-btn ${viewMode === 'monthly' ? 'active' : ''}`}
            onClick={() => setViewMode('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      {nextClass && (
        <div className="next-class-alert">
          <div className="alert-icon">⏰</div>
          <div className="alert-content">
            <h3>Next Class: {nextClass.subject}</h3>
            <p>{nextClass.time} • {nextClass.teacher} • {nextClass.room}</p>
          </div>
        </div>
      )}

      {viewMode === 'weekly' && (
        <div className="weekly-schedule">
          {days.map((day) => (
            <div key={day} className={`day-column ${day === today ? 'today' : ''}`}>
              <div className="day-header">
                <h3>{day}</h3>
                {day === today && <span className="today-badge">Today</span>}
              </div>
              <div className="classes-list">
                {weeklySchedule[day]?.map((classItem, index) => (
                  <div key={index} className="schedule-item">
                    <div className="class-time">{classItem.time}</div>
                    <div className="class-info">
                      <h4>{classItem.subject}</h4>
                      <p className="teacher-name">{classItem.teacher}</p>
                      <p className="room-number">📍 {classItem.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'daily' && (
        <div className="daily-schedule">
          <div className="day-header-large">
            <h2>{today}</h2>
            <p>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="classes-list">
            {weeklySchedule[today]?.map((classItem, index) => (
              <div key={index} className="schedule-item-large">
                <div className="time-badge">{classItem.time}</div>
                <div className="class-details-large">
                  <h3>{classItem.subject}</h3>
                  <div className="class-meta">
                    <span>👨‍🏫 {classItem.teacher}</span>
                    <span>📍 {classItem.room}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'monthly' && (
        <div className="monthly-schedule">
          <div className="monthly-info">
            <h2>Monthly View</h2>
            <p>Select a day to view detailed schedule</p>
          </div>
          <div className="schedule-summary">
            <div className="summary-card">
              <h3>Total Classes per Week</h3>
              <p className="summary-number">25</p>
            </div>
            <div className="summary-card">
              <h3>Subjects</h3>
              <p className="summary-number">10</p>
            </div>
            <div className="summary-card">
              <h3>Weekly Hours</h3>
              <p className="summary-number">25h</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSchedules;
    
import React, { useState } from 'react';
import './Grades.css';

const Grades = () => {
  const [selectedTerm, setSelectedTerm] = useState('current');

  // Mock grades data
  const currentGrades = [
    { subject: 'Mathematics', grade: 88, maxGrade: 100, percentage: 88, letterGrade: 'B+', assignments: 5, average: 88 },
    { subject: 'English', grade: 92, maxGrade: 100, percentage: 92, letterGrade: 'A-', assignments: 4, average: 92 },
    { subject: 'Science', grade: 85, maxGrade: 100, percentage: 85, letterGrade: 'B', assignments: 6, average: 85 },
    { subject: 'History', grade: 90, maxGrade: 100, percentage: 90, letterGrade: 'A-', assignments: 3, average: 90 },
    { subject: 'Physics', grade: 87, maxGrade: 100, percentage: 87, letterGrade: 'B+', assignments: 5, average: 87 },
    { subject: 'Chemistry', grade: 83, maxGrade: 100, percentage: 83, letterGrade: 'B', assignments: 4, average: 83 }
  ];

  const gradeHistory = {
    'Fall 2023': [
      { subject: 'Mathematics', grade: 85, percentage: 85, letterGrade: 'B' },
      { subject: 'English', grade: 90, percentage: 90, letterGrade: 'A-' },
      { subject: 'Science', grade: 82, percentage: 82, letterGrade: 'B-' },
      { subject: 'History', grade: 88, percentage: 88, letterGrade: 'B+' }
    ],
    'Spring 2023': [
      { subject: 'Mathematics', grade: 88, percentage: 88, letterGrade: 'B+' },
      { subject: 'English', grade: 91, percentage: 91, letterGrade: 'A-' },
      { subject: 'Science', grade: 84, percentage: 84, letterGrade: 'B' },
      { subject: 'History', grade: 89, percentage: 89, letterGrade: 'B+' }
    ]
  };

  const calculateOverallGPA = (grades) => {
    const total = grades.reduce((sum, item) => sum + item.percentage, 0);
    return (total / grades.length).toFixed(1);
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return '#27ae60';
    if (percentage >= 80) return '#3498db';
    if (percentage >= 70) return '#f39c12';
    return '#e74c3c';
  };

  const getLetterGradeColor = (letterGrade) => {
    if (letterGrade.startsWith('A')) return '#27ae60';
    if (letterGrade.startsWith('B')) return '#3498db';
    if (letterGrade.startsWith('C')) return '#f39c12';
    return '#e74c3c';
  };

  const overallGPA = calculateOverallGPA(currentGrades);

  return (
    <div className="grades">
      <div className="grades-header">
        <div>
          <h1>Grades & Academic Performance</h1>
          <p>Track your academic progress and performance</p>
        </div>
        <div className="term-selector">
          <button
            className={`term-btn ${selectedTerm === 'current' ? 'active' : ''}`}
            onClick={() => setSelectedTerm('current')}
          >
            Current Term
          </button>
          <button
            className={`term-btn ${selectedTerm === 'history' ? 'active' : ''}`}
            onClick={() => setSelectedTerm('history')}
          >
            Grade History
          </button>
        </div>
      </div>

      {selectedTerm === 'current' && (
        <>
          <div className="performance-overview">
            <div className="overview-card gpa-card">
              <div className="overview-icon">📊</div>
              <div className="overview-content">
                <h3>Overall GPA</h3>
                <p className="overview-value">{overallGPA}%</p>
                <span className="overview-label">Current Term Average</span>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-icon">📈</div>
              <div className="overview-content">
                <h3>Total Subjects</h3>
                <p className="overview-value">{currentGrades.length}</p>
                <span className="overview-label">Enrolled Courses</span>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-icon">⭐</div>
              <div className="overview-content">
                <h3>Highest Grade</h3>
                <p className="overview-value">
                  {Math.max(...currentGrades.map(g => g.percentage))}%
                </p>
                <span className="overview-label">
                  {currentGrades.find(g => g.percentage === Math.max(...currentGrades.map(g => g.percentage)))?.subject}
                </span>
              </div>
            </div>
          </div>

          <div className="grades-list">
            {currentGrades.map((subject, index) => (
              <div key={index} className="grade-card">
                <div className="grade-header">
                  <div className="subject-info">
                    <h3>{subject.subject}</h3>
                    <span className="assignments-count">{subject.assignments} assignments</span>
                  </div>
                  <div className="grade-badge" style={{ background: getGradeColor(subject.percentage) }}>
                    {subject.letterGrade}
                  </div>
                </div>

                <div className="grade-body">
                  <div className="grade-bar-container">
                    <div className="grade-bar">
                      <div
                        className="grade-bar-fill"
                        style={{
                          width: `${subject.percentage}%`,
                          background: getGradeColor(subject.percentage)
                        }}
                      />
                    </div>
                    <div className="grade-percentage">{subject.percentage}%</div>
                  </div>

                  <div className="grade-details">
                    <div className="detail-row">
                      <span>Current Grade:</span>
                      <strong>{subject.grade}/{subject.maxGrade}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Average:</span>
                      <strong>{subject.average}%</strong>
                    </div>
                    <div className="detail-row">
                      <span>Letter Grade:</span>
                      <strong style={{ color: getLetterGradeColor(subject.letterGrade) }}>
                        {subject.letterGrade}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="performance-chart">
            <h2>Subject-wise Performance</h2>
            <div className="chart-container">
              {currentGrades.map((subject, index) => (
                <div key={index} className="chart-bar-item">
                  <div className="chart-label">{subject.subject}</div>
                  <div className="chart-bar-wrapper">
                    <div
                      className="chart-bar"
                      style={{
                        height: `${subject.percentage}%`,
                        background: getGradeColor(subject.percentage)
                      }}
                    >
                      <span className="chart-value">{subject.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {selectedTerm === 'history' && (
        <div className="grade-history">
          {Object.entries(gradeHistory).map(([term, grades]) => (
            <div key={term} className="history-term">
              <h2>{term}</h2>
              <div className="history-grades">
                {grades.map((subject, index) => (
                  <div key={index} className="history-grade-card">
                    <div className="history-subject">{subject.subject}</div>
                    <div className="history-grade-info">
                      <div className="history-percentage" style={{ color: getGradeColor(subject.percentage) }}>
                        {subject.percentage}%
                      </div>
                      <div className="history-letter" style={{ color: getLetterGradeColor(subject.letterGrade) }}>
                        {subject.letterGrade}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="term-gpa">
                  <strong>Term GPA: {calculateOverallGPA(grades)}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="transcript-section">
        <h2>📄 Reports & Transcripts</h2>
        <div className="transcript-actions">
          <button className="download-btn">
            📥 Download Current Transcript
          </button>
          <button className="download-btn">
            📥 Download Full Academic Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Grades;

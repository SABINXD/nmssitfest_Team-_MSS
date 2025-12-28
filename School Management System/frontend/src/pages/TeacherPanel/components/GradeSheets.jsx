import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './GradeSheets.css';

const GradeSheets = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [gradeSheets, setGradeSheets] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Grade calculation function
  const calculateGrade = (percentage) => {
    if (percentage >= 90) return { letter: 'A+', gpa: 4.0 };
    if (percentage >= 85) return { letter: 'A', gpa: 3.7 };
    if (percentage >= 80) return { letter: 'A-', gpa: 3.3 };
    if (percentage >= 75) return { letter: 'B+', gpa: 3.0 };
    if (percentage >= 70) return { letter: 'B', gpa: 2.7 };
    if (percentage >= 65) return { letter: 'B-', gpa: 2.3 };
    if (percentage >= 60) return { letter: 'C+', gpa: 2.0 };
    if (percentage >= 55) return { letter: 'C', gpa: 1.7 };
    if (percentage >= 50) return { letter: 'C-', gpa: 1.3 };
    if (percentage >= 45) return { letter: 'D+', gpa: 1.0 };
    if (percentage >= 40) return { letter: 'D', gpa: 0.7 };
    return { letter: 'F', gpa: 0.0 };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.name.endsWith('.xlsx')) {
        setExcelFile(file);
        setError(null);
        setSuccess(null);
      } else {
        setError('Please upload a valid .xlsx file');
        setExcelFile(null);
      }
    }
  };

  const processExcelFile = async () => {
    if (!excelFile) {
      setError('Please select an Excel file');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            setError('Excel file is empty');
            setIsProcessing(false);
            return;
          }

          // Expected format: Student Name, Subject, Credit Hours, Marks
          // Or alternative: Name, [Subject1], [Subject2], ..., [SubjectN], Credit Hours
          // We'll handle flexible column structure
          
          const firstRow = jsonData[0];
          const columns = Object.keys(firstRow);
          
          // Find student name column (could be "Name", "Student Name", "Student", etc.)
          const nameColumn = columns.find(col => 
            col.toLowerCase().includes('name') || 
            col.toLowerCase().includes('student')
          ) || columns[0];

          // Find credit hours column
          const creditColumn = columns.find(col => 
            col.toLowerCase().includes('credit') || 
            col.toLowerCase().includes('hours')
          );

          // Find all subject columns (columns that are not name or credit hours)
          const subjectColumns = columns.filter(col => 
            col !== nameColumn && 
            col !== creditColumn &&
            !col.toLowerCase().includes('credit') &&
            !col.toLowerCase().includes('hours')
          );

          if (!nameColumn) {
            setError('Could not find student name column. Please ensure your Excel file has a "Name" or "Student Name" column.');
            setIsProcessing(false);
            return;
          }

          // Process data and generate grade sheets
          const processedData = {};
          
          jsonData.forEach((row, index) => {
            const studentName = row[nameColumn]?.toString().trim();
            if (!studentName) return;

            if (!processedData[studentName]) {
              processedData[studentName] = {
                name: studentName,
                subjects: [],
                totalCredits: 0,
                totalGradePoints: 0
              };
            }

            // Process each subject
            subjectColumns.forEach(subject => {
              const marks = parseFloat(row[subject]) || 0;
              const creditHours = creditColumn ? (parseFloat(row[creditColumn]) || 3) : 3; // Default to 3 if not specified
              
              if (marks > 0) { // Only add subjects with marks
                const grade = calculateGrade(marks);
                processedData[studentName].subjects.push({
                  subject: subject,
                  marks: marks,
                  creditHours: creditHours,
                  grade: grade.letter,
                  gpa: grade.gpa,
                  gradePoints: grade.gpa * creditHours
                });
              }
            });
          });

          // Calculate GPA for each student
          Object.keys(processedData).forEach(studentName => {
            const student = processedData[studentName];
            student.totalCredits = student.subjects.reduce((sum, sub) => sum + sub.creditHours, 0);
            student.totalGradePoints = student.subjects.reduce((sum, sub) => sum + sub.gradePoints, 0);
            student.cgpa = student.totalCredits > 0 
              ? (student.totalGradePoints / student.totalCredits).toFixed(2) 
              : 0;
          });

          const gradeSheetArray = Object.values(processedData);
          
          if (gradeSheetArray.length === 0) {
            setError('No valid student data found in the Excel file');
          } else {
            setGradeSheets(gradeSheetArray);
            setSuccess(`Successfully processed ${gradeSheetArray.length} student grade sheet(s)`);
          }

        } catch (err) {
          setError(`Error processing Excel file: ${err.message}`);
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        setError('Error reading file');
        setIsProcessing(false);
      };

      reader.readAsArrayBuffer(excelFile);
    } catch (err) {
      setError(`Error: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadGradeSheet = (student) => {
    // Create a simple text file with grade sheet
    let content = `GRADE SHEET\n`;
    content += `========================\n\n`;
    content += `Student Name: ${student.name}\n`;
    content += `Date: ${new Date().toLocaleDateString()}\n\n`;
    content += `Subject Details:\n`;
    content += `${'='.repeat(60)}\n`;
    content += `${'Subject'.padEnd(30)} | Marks | Credit | Grade | GPA\n`;
    content += `${'-'.repeat(60)}\n`;
    
    student.subjects.forEach(sub => {
      content += `${sub.subject.padEnd(30)} | ${sub.marks.toString().padStart(5)} | ${sub.creditHours.toString().padStart(6)} | ${sub.grade.padStart(5)} | ${sub.gpa.toFixed(2)}\n`;
    });
    
    content += `${'='.repeat(60)}\n`;
    content += `Total Credits: ${student.totalCredits}\n`;
    content += `CGPA: ${student.cgpa}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${student.name}_GradeSheet.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grade-sheets">
      <div className="grade-sheets-header">
        <h1>Grade Sheets Generator</h1>
        <p>Upload an Excel file with student marks to generate grade sheets</p>
      </div>

      <div className="upload-section">
        <div className="file-upload-area">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="file-input"
            id="excel-file-input"
          />
          <label htmlFor="excel-file-input" className="file-upload-label">
            <div className="upload-icon">📊</div>
            <p className="upload-text">
              {excelFile ? excelFile.name : 'Click to upload Excel file (.xlsx)'}
            </p>
            {excelFile && (
              <p className="file-size">{formatFileSize(excelFile.size)}</p>
            )}
          </label>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            {success}
          </div>
        )}

        <div className="action-section">
          <button
            className="process-btn"
            onClick={processExcelFile}
            disabled={!excelFile || isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner">⏳</span>
                Processing...
              </>
            ) : (
              <>
                <span>📋</span>
                Generate Grade Sheets
              </>
            )}
          </button>
        </div>

        <div className="format-info">
          <h3>Excel File Format</h3>
          <p>Your Excel file should contain the following columns:</p>
          <ul>
            <li><strong>Name</strong> or <strong>Student Name</strong> - Student's full name</li>
            <li><strong>Subject columns</strong> - Each subject as a column header with marks as values</li>
            <li><strong>Credit Hours</strong> (optional) - Credit hours for each subject (default: 3)</li>
          </ul>
          <p className="example-note">
            <strong>Example:</strong> Columns: Name, Mathematics, Science, English, Credit Hours<br />
            Rows contain student names and their marks in each subject.
          </p>
        </div>
      </div>

      {gradeSheets.length > 0 && (
        <div className="grade-sheets-results">
          <h2>Generated Grade Sheets ({gradeSheets.length})</h2>
          
          <div className="grade-sheets-grid">
            {gradeSheets.map((student, index) => (
              <div key={index} className="grade-sheet-card">
                <div className="grade-sheet-header">
                  <h3>{student.name}</h3>
                  <button 
                    className="download-btn"
                    onClick={() => downloadGradeSheet(student)}
                  >
                    📥 Download
                  </button>
                </div>

                <div className="grade-sheet-content">
                  <div className="subjects-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Marks</th>
                          <th>Credit</th>
                          <th>Grade</th>
                          <th>GPA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {student.subjects.map((subject, idx) => (
                          <tr key={idx}>
                            <td>{subject.subject}</td>
                            <td>{subject.marks}</td>
                            <td>{subject.creditHours}</td>
                            <td className="grade-cell">{subject.grade}</td>
                            <td>{subject.gpa.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grade-summary">
                    <div className="summary-item">
                      <span className="summary-label">Total Credits:</span>
                      <span className="summary-value">{student.totalCredits}</span>
                    </div>
                    <div className="summary-item highlight">
                      <span className="summary-label">CGPA:</span>
                      <span className="summary-value">{student.cgpa}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeSheets;


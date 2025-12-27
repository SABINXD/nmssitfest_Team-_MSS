import React, { useState, useCallback } from 'react';
import './RoutineGenerator.css';

const RoutineGenerator = () => {
  const [teachersFile, setTeachersFile] = useState(null);
  const [classesFile, setClassesFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState({ teachers: false, classes: false });

  // Handle file selection
  const handleFileSelect = (type, file) => {
    if (!file) return;
    
    if (!file.name.endsWith('.xlsx')) {
      setError('Please upload only .xlsx files');
      return;
    }

    if (type === 'teachers') {
      setTeachersFile(file);
    } else {
      setClassesFile(file);
    }
    setError(null);
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: true }));
  }, []);

  const handleDragLeave = useCallback((e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: false }));
  }, []);

  const handleDrop = useCallback((e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: false }));
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(type, file);
    }
  }, []);

  // Remove selected file
  const removeFile = (type) => {
    if (type === 'teachers') {
      setTeachersFile(null);
    } else {
      setClassesFile(null);
    }
  };

  // Generate routine
  const generateRoutine = async () => {
    if (!teachersFile || !classesFile) {
      setError('Please upload both files');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append('teachers_file', teachersFile);
    formData.append('classes_file', classesFile);

    try {
      // Send to your FastAPI backend (running on port 8000)
      const response = await fetch('http://localhost:8000/generate-routine', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate routine');
      }

      // Create download link for the ZIP file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
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
    <div className="routine-generator">
      {isGenerating && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h3>Generating Timetable</h3>
            <p>This may take a few moments...</p>
          </div>
        </div>
      )}

      <div className="generator-container">
        <div className="generator-header">
          <h1>Generate School Timetable</h1>
          <p>Upload teacher and class data to automatically generate optimized timetables for your school</p>
        </div>

        <div className="upload-section">
          {/* Teachers File Upload */}
          <div className="upload-card">
            <div className="card-header">
              <div className="card-icon">
                👨‍🏫
              </div>
              <div>
                <h3>Teachers Data</h3>
                <span>Upload teacher information file</span>
              </div>
            </div>

            <div 
              className={`file-upload-area ${dragOver.teachers ? 'drag-over' : ''}`}
              onClick={() => document.getElementById('teachers-input').click()}
              onDragOver={(e) => handleDragOver(e, 'teachers')}
              onDragLeave={(e) => handleDragLeave(e, 'teachers')}
              onDrop={(e) => handleDrop(e, 'teachers')}
            >
              <div className="upload-icon">📄</div>
              <p>Drag & drop your teachers.xlsx file here</p>
              <p><strong>or click to browse</strong></p>
              <input
                id="teachers-input"
                type="file"
                className="file-input"
                accept=".xlsx"
                onChange={(e) => handleFileSelect('teachers', e.target.files[0])}
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
                  onClick={() => removeFile('teachers')}
                  aria-label="Remove file"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Classes File Upload */}
          <div className="upload-card">
            <div className="card-header">
              <div className="card-icon">
                👨‍🎓
              </div>
              <div>
                <h3>Classes Data</h3>
                <span>Upload class information file</span>
              </div>
            </div>

            <div 
              className={`file-upload-area ${dragOver.classes ? 'drag-over' : ''}`}
              onClick={() => document.getElementById('classes-input').click()}
              onDragOver={(e) => handleDragOver(e, 'classes')}
              onDragLeave={(e) => handleDragLeave(e, 'classes')}
              onDrop={(e) => handleDrop(e, 'classes')}
            >
              <div className="upload-icon">📚</div>
              <p>Drag & drop your classes.xlsx file here</p>
              <p><strong>or click to browse</strong></p>
              <input
                id="classes-input"
                type="file"
                className="file-input"
                accept=".xlsx"
                onChange={(e) => handleFileSelect('classes', e.target.files[0])}
              />
            </div>

            {classesFile && (
              <div className="selected-file">
                <div className="file-icon">✅</div>
                <div className="file-info">
                  <h4>{classesFile.name}</h4>
                  <p>{formatFileSize(classesFile.size)}</p>
                </div>
                <button 
                  className="remove-file" 
                  onClick={() => removeFile('classes')}
                  aria-label="Remove file"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Requirements Section */}
        <div className="requirements">
          <h3>📋 File Requirements:</h3>
          <ul>
            <li>Both files must be in .xlsx format (Excel)</li>
            <li>Teachers file should contain: Name, Subjects, Availability per day</li>
            <li>Classes file should contain: Class, Section, Subjects with theory+practical hours</li>
            <li>Example format: "Physics(4+2)" for 4 theory + 2 practical periods</li>
            <li>Maximum file size: 10MB each</li>
          </ul>
        </div>

        {/* Generate Button */}
        <div className="generate-section">
          <button 
            className="generate-btn"
            onClick={generateRoutine}
            disabled={!teachersFile || !classesFile || isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="spinner">⏳</span>
                Generating...
              </>
            ) : (
              <>
                🚀 Generate Timetable
              </>
            )}
          </button>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          {/* Download Result */}
          {downloadUrl && (
            <div className="result-section">
              <h3>✅ Timetable Generated Successfully!</h3>
              <p>Your timetable files are ready to download. The ZIP contains:</p>
              <ul>
                <li>Individual class timetables</li>
                <li>Individual teacher timetables</li>
                <li>Summary reports</li>
              </ul>
              <a 
                href={downloadUrl} 
                className="download-btn"
                download="timetable_output.zip"
              >
                ⬇️ Download ZIP File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutineGenerator;
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'students-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.originalname.endsWith('.xlsx')) {
      cb(null, true);
    } else {
      cb(new Error('Only .xlsx files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Generate random password
const generatePassword = () => {
  const length = 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Generate username from name
const generateUsername = (name, rollNumber) => {
  // Convert name to lowercase, remove spaces, take first 6 characters
  const namePart = name.toLowerCase().replace(/\s+/g, '').substring(0, 6);
  // Add roll number if available
  const rollPart = rollNumber ? rollNumber.toString().padStart(3, '0') : '';
  return (namePart + rollPart).substring(0, 10);
};

// Generate student ID
const generateStudentId = (index) => {
  return 'STU' + String(index + 1).padStart(4, '0');
};

// Upload and process student file
router.post('/upload', (req, res, next) => {
  upload.single('studentsFile')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Maximum size is 10MB.' });
      }
      return res.status(400).json({ error: err.message });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please select an Excel file.' });
    }

    const filePath = req.file.path;
    
    // Read Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ error: 'Excel file is empty' });
    }

    // Validate required columns
    const requiredColumns = ['Name', 'Email', 'Class', 'Roll Number'];
    const firstRow = data[0];
    const missingColumns = requiredColumns.filter(col => !firstRow.hasOwnProperty(col));
    
    if (missingColumns.length > 0) {
      return res.status(400).json({ 
        error: `Missing required columns: ${missingColumns.join(', ')}` 
      });
    }

    const students = [];
    const errors = [];
    let studentIndex = 0;

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Skip empty rows
      if (!row.Name || !row.Email) {
        continue;
      }

      try {
        // Generate credentials
        const studentId = generateStudentId(studentIndex);
        let username = generateUsername(row.Name, row['Roll Number']);
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if email already exists
        const existingStudent = await Student.findOne({ email: row.Email });
        if (existingStudent) {
          errors.push(`Row ${i + 2}: Email ${row.Email} already exists`);
          continue;
        }

        // Check if username already exists
        const existingUsername = await Student.findOne({ username: username });
        if (existingUsername) {
          // Add number suffix if username exists
          let counter = 1;
          let newUsername = username + counter;
          while (await Student.findOne({ username: newUsername })) {
            counter++;
            newUsername = username + counter;
          }
          username = newUsername;
        }

        // Create student object
        const studentData = {
          name: row.Name.trim(),
          email: row.Email.trim().toLowerCase(),
          class: row.Class ? row.Class.trim() : row.grade || '',
          grade: row.Class ? row.Class.trim() : row.grade || '',
          rollNumber: row['Roll Number'] ? row['Roll Number'].toString() : '',
          username: username,
          password: hashedPassword,
          studentId: studentId,
          enrolled: true
        };

        // Save to database
        const student = new Student(studentData);
        await student.save();

        // Store for credentials file (with plain password)
        students.push({
          'Student ID': studentId,
          'Name': studentData.name,
          'Email': studentData.email,
          'Username': username,
          'Password': password,
          'Class': studentData.class,
          'Roll Number': studentData.rollNumber
        });

        studentIndex++;
      } catch (err) {
        errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }

    if (students.length === 0) {
      return res.status(400).json({ 
        error: 'No students were processed. Check your file format.',
        errors: errors
      });
    }

    // Generate credentials Excel file
    const credentialsWorkbook = xlsx.utils.book_new();
    const credentialsWorksheet = xlsx.utils.json_to_sheet(students);
    xlsx.utils.book_append_sheet(credentialsWorkbook, credentialsWorksheet, 'Student Credentials');
    
    const credentialsPath = path.join(__dirname, '../uploads', `credentials-${Date.now()}.xlsx`);
    xlsx.writeFile(credentialsWorkbook, credentialsPath);

    // Read the file for download
    const credentialsFile = fs.readFileSync(credentialsPath);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Send response with file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=student_credentials_${Date.now()}.xlsx`);
    
    res.send(credentialsFile);

    // Clean up credentials file after sending (async)
    setTimeout(() => {
      if (fs.existsSync(credentialsPath)) {
        fs.unlinkSync(credentialsPath);
      }
    }, 5000);

  } catch (error) {
    console.error('Error processing file:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error('Error deleting uploaded file:', unlinkErr);
      }
    }
    
    res.status(500).json({ 
      error: 'Error processing file', 
      message: error.message || 'An unexpected error occurred while processing the file.'
    });
  }
});

module.exports = router;


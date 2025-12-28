const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const Teacher = require('../models/Teacher');
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
    cb(null, 'teachers-' + uniqueSuffix + path.extname(file.originalname));
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
const generateUsername = (name, employeeId) => {
  // Convert name to lowercase, remove spaces, take first 6 characters
  const namePart = name.toLowerCase().replace(/\s+/g, '').substring(0, 6);
  // Add employee ID part if available
  const empPart = employeeId ? employeeId.toString().substring(0, 4) : '';
  return (namePart + empPart).substring(0, 10);
};

// Generate employee ID if not provided
const generateEmployeeId = (index) => {
  return 'EMP' + String(index + 1).padStart(4, '0');
};

// Upload and process teacher file
router.post('/upload', (req, res, next) => {
  upload.single('teachersFile')(req, res, (err) => {
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

    // Validate required columns (at minimum Name, Email, Department)
    const requiredColumns = ['Name', 'Email', 'Department'];
    const firstRow = data[0];
    const missingColumns = requiredColumns.filter(col => !firstRow.hasOwnProperty(col));
    
    if (missingColumns.length > 0) {
      return res.status(400).json({ 
        error: `Missing required columns: ${missingColumns.join(', ')}` 
      });
    }

    const teachers = [];
    const errors = [];
    let teacherIndex = 0;

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Skip empty rows
      if (!row.Name || !row.Email) {
        continue;
      }

      try {
        // Generate credentials
        const employeeId = row['Employee ID'] || generateEmployeeId(teacherIndex);
        let username = row['Username'] || generateUsername(row.Name, employeeId);
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if email, username, or employeeId already exists
        const existingTeacher = await Teacher.findOne({ 
          $or: [
            { email: row.Email },
            { username: username },
            { employeeId: employeeId }
          ]
        });
        
        if (existingTeacher) {
          // Make username unique by adding index
          username = generateUsername(row.Name, employeeId) + teacherIndex;
        }

        // Parse subjects (can be comma-separated string or array)
        let subjects = [];
        if (row['Subjects']) {
          if (typeof row['Subjects'] === 'string') {
            subjects = row['Subjects'].split(',').map(s => s.trim()).filter(s => s);
          } else if (Array.isArray(row['Subjects'])) {
            subjects = row['Subjects'];
          }
        }

        const teacherData = {
          name: row.Name.trim(),
          email: row.Email.trim().toLowerCase(),
          username: username.toLowerCase(),
          password: hashedPassword,
          employeeId: employeeId,
          department: row.Department.trim(),
          subjects: subjects,
          phone: row['Phone'] ? row['Phone'].toString().trim() : '',
          address: row['Address'] ? row['Address'].trim() : '',
          isActive: row['Is Active'] !== undefined ? row['Is Active'] : true
        };

        // Create teacher
        const teacher = new Teacher(teacherData);
        await teacher.save();

        // Store for credentials file (with plain password)
        teachers.push({
          'Employee ID': employeeId,
          'Name': teacherData.name,
          'Email': teacherData.email,
          'Username': username,
          'Password': password,
          'Department': teacherData.department,
          'Subjects': subjects.join(', '),
          'Phone': teacherData.phone || '',
          'Address': teacherData.address || ''
        });

        teacherIndex++;
      } catch (err) {
        errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }

    if (teachers.length === 0) {
      return res.status(400).json({ 
        error: 'No teachers were processed. Check your file format.',
        errors: errors
      });
    }

    // Generate credentials Excel file
    const credentialsWorkbook = xlsx.utils.book_new();
    const credentialsWorksheet = xlsx.utils.json_to_sheet(teachers);
    xlsx.utils.book_append_sheet(credentialsWorkbook, credentialsWorksheet, 'Teacher Credentials');
    
    const credentialsPath = path.join(__dirname, '../uploads', `teacher_credentials-${Date.now()}.xlsx`);
    xlsx.writeFile(credentialsWorkbook, credentialsPath);

    // Read the file for download
    const credentialsFile = fs.readFileSync(credentialsPath);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Send response with file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=teacher_credentials_${Date.now()}.xlsx`);
    
    res.send(credentialsFile);

    // Clean up credentials file after sending (async)
    setTimeout(() => {
      if (fs.existsSync(credentialsPath)) {
        fs.unlinkSync(credentialsPath);
      }
    }, 5000);

  } catch (error) {
    console.error('Error processing file:', error);
    
    // Clean up uploaded file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Error processing teacher file', 
      details: error.message 
    });
  }
});

module.exports = router;


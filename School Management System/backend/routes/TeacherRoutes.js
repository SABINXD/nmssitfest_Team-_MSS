const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');

// Get all teachers
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching teachers', error: err });
  }
});

// Teacher login route
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if ((!username && !email) || !password) {
      return res.status(400).json({ error: 'Username or email and password are required.' });
    }
    
    // Allow login by username or email
    const teacher = await Teacher.findOne({
      $or: [
        { username: username || '' },
        { email: email || '' }
      ]
    });
    
    if (!teacher) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    
    // Update lastLogin field
    teacher.lastLogin = new Date();
    await teacher.save();
    
    // Return teacher info (excluding password)
    const { password: _, ...teacherData } = teacher.toObject();
    res.status(200).json({ message: 'Login successful', teacher: teacherData });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Create new teacher
router.post('/', async (req, res) => {
  try {
    const { name, email, username, password, employeeId, department, subjects, phone, address } = req.body;
    
    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({
      $or: [{ email }, { username }, { employeeId }]
    });
    
    if (existingTeacher) {
      return res.status(400).json({ error: 'Teacher with this email, username, or employee ID already exists.' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const teacher = new Teacher({
      name,
      email,
      username,
      password: hashedPassword,
      employeeId,
      department,
      subjects: subjects || [],
      phone,
      address
    });
    
    await teacher.save();
    
    // Return teacher info (excluding password)
    const { password: _, ...teacherData } = teacher.toObject();
    res.status(201).json({ message: 'Teacher created successfully', teacher: teacherData });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Update teacher
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Don't allow password update through this route
    if (updates.password) {
      delete updates.password;
    }
    
    const teacher = await Teacher.findByIdAndUpdate(id, updates, { new: true });
    
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }
    
    res.status(200).json({ message: 'Teacher updated successfully', teacher });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Delete teacher
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByIdAndDelete(id);
    
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }
    
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Reset teacher password to username
router.post('/reset-password/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }
    
    const hashedPassword = await bcrypt.hash(teacher.username, 10);
    teacher.password = hashedPassword;
    await teacher.save();
    
    res.status(200).json({ message: 'Password reset to username successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;

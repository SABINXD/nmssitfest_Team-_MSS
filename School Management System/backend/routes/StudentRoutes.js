const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Import the Student model

// Sample route to fetch all students (for now)
router.get('/', async (req, res) => {
  try {
    // Fetch all students from the database
    const students = await Student.find();
    // Respond with the students list
    res.status(200).json(students);
  } catch (err) {
    // Handle error if there’s an issue
    res.status(500).json({ message: 'Error fetching students', error: err });
  }
});

// Student login route
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if ((!username && !email) || !password) {
      return res.status(400).json({ error: 'Username or email and password are required.' });
    }
    // Allow login by username or email
    const student = await Student.findOne({
      $or: [
        { username: username || '' },
        { email: email || '' }
      ]
    });
    if (!student) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    // Update lastLogin field
    student.lastLogin = new Date();
    await student.save();
    // Optionally, you can return student info (excluding password)
    const { password: _, ...studentData } = student.toObject();
    res.status(200).json({ message: 'Login successful', student: studentData });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Delete student by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Reset student password to username
router.post('/reset-password/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash(student.username, 10);
    student.password = hashed;
    await student.save();
    res.status(200).json({ message: 'Password reset to username' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;

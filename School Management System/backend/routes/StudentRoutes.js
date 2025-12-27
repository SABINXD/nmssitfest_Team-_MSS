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

module.exports = router;

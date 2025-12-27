const mongoose = require('mongoose');

// Define the student schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: false
  },
  grade: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: false
  },
  rollNumber: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  enrolled: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model based on the schema
const Student = mongoose.model('Student', studentSchema);

// Export the model
module.exports = Student;

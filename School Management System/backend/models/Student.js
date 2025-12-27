const mongoose = require('mongoose');

// Define the student schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  enrolled: {
    type: Boolean,
    default: true
  }
});

// Create a model based on the schema
const Student = mongoose.model('Student', studentSchema);

// Export the model
module.exports = Student;

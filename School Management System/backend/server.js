const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // Load environment from .env

// Import routes with error handling
let studentRoutes, studentUploadRoutes;
try {
  studentRoutes = require('./routes/StudentRoutes');  // Import the student routes
  studentUploadRoutes = require('./routes/StudentUploadRoutes');  // Import the student upload routes
  console.log('Routes loaded successfully');
} catch (error) {
  console.error('Error loading routes:', error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // to parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // to parse form data

// Verify that MongoDB URI is loaded
if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment. Make sure `.env` exists.');
  process.exit(1);
}

// Mask the password part of the MongoDB URI for logging
const maskedUri = process.env.MONGODB_URI.replace(/(mongodb\+srv:\/\/[^:]+:)[^@]+(@.+)/, '$1******$2');
console.log('MongoDB URI (loaded):', maskedUri);

// Connect to MongoDB using the URI from env (without the deprecated options)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    console.error('If this is an Atlas URI, ensure network access (IP whitelist) allows your IP and credentials are correct.');
  });

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Use the student routes
app.use('/api/students', studentRoutes);  // Map the routes to /api/students
app.use('/api/students', studentUploadRoutes);  // Map the upload routes to /api/students

// Sample route (this one can be your health check route or welcome message)
app.get('/', (req, res) => {
  res.send('Hello from Express server!');
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found', 
    path: req.path,
    method: req.method,
    message: 'The requested endpoint does not exist. Check your route path and method.'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

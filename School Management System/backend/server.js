const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // Load environment from .env
const studentRoutes = require('./routes/StudentRoutes');  // Import the student routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // to parse incoming JSON requests

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

// Use the student routes
app.use('/api/students', studentRoutes);  // Map the routes to /api/students

// Sample route (this one can be your health check route or welcome message)
app.get('/', (req, res) => {
  res.send('Hello from Express server!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

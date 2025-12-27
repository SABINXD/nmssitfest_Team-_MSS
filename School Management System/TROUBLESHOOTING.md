# Troubleshooting Guide

## Error: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

This error occurs when the server returns HTML instead of JSON. Here's how to fix it:

### Step 1: Check if Backend Server is Running

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies (if not done):**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```

4. **Verify server is running:**
   - You should see: `Server running on port 5000`
   - Open browser and go to: `http://localhost:5000`
   - You should see: "Hello from Express server!"

### Step 2: Check Required Packages

Make sure these packages are installed in the backend:
- `multer` - for file uploads
- `xlsx` - for reading Excel files
- `bcryptjs` - for password hashing

Install them if missing:
```bash
cd backend
npm install multer xlsx bcryptjs
```

### Step 3: Check MongoDB Connection

1. **Verify `.env` file exists in backend directory:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

2. **Check MongoDB connection:**
   - Server should log: "Connected to MongoDB"
   - If you see connection errors, check your MongoDB URI

### Step 4: Check File Format

Make sure your Excel file has these exact column headers (case-sensitive):
- **Name**
- **Email**
- **Class**
- **Roll Number**

### Step 5: Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab** - for JavaScript errors
- **Network tab** - to see the API request/response
  - Look for the request to `http://localhost:5000/api/students/upload`
  - Check the response status and content

### Common Issues:

1. **"Cannot connect to server"**
   - Backend server is not running
   - Backend is running on different port
   - CORS issues (should be handled by server.js)

2. **"404 Not Found"**
   - Route not registered correctly
   - Check `server.js` has the upload route

3. **"500 Internal Server Error"**
   - Check backend console for error details
   - Usually MongoDB connection or file processing error

4. **"Missing required columns"**
   - Excel file doesn't have correct column headers
   - Check column names are exactly: Name, Email, Class, Roll Number

### Testing the API Directly

You can test the API using curl or Postman:

```bash
curl -X POST http://localhost:5000/api/students/upload \
  -F "studentsFile=@path/to/your/students.xlsx"
```

If this works, the issue is in the frontend. If it doesn't, the issue is in the backend.


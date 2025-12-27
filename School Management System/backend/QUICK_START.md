# Quick Start Guide - Backend Server

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

This will install:
- express
- mongoose
- cors
- dotenv
- multer (for file uploads)
- xlsx (for Excel file processing)
- bcryptjs (for password hashing)

## Step 2: Create .env File

Create a `.env` file in the `backend` directory with:

```
MONGODB_URI=your_mongodb_connection_string_here
PORT=5000
```

**Example MongoDB URI formats:**
- Local: `mongodb://localhost:27017/school_management`
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/school_management?retryWrites=true&w=majority`

## Step 3: Start the Server

```bash
npm run dev
```

or

```bash
npm start
```

## Step 4: Verify Server is Running

1. **Check console output:**
   - Should see: `Server running on port 5000`
   - Should see: `Connected to MongoDB`

2. **Test in browser:**
   - Go to: `http://localhost:5000`
   - Should see: "Hello from Express server!"

3. **Test API endpoint:**
   - Go to: `http://localhost:5000/api/test`
   - Should see JSON: `{"message":"API is working!","timestamp":"..."}`

## Step 5: Test Upload Endpoint

The upload endpoint is available at:
- **URL:** `POST http://localhost:5000/api/students/upload`
- **Content-Type:** `multipart/form-data`
- **Field name:** `studentsFile`

## Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Verify `.env` file exists and has correct MongoDB URI
- Check console for error messages

### MongoDB connection fails
- Verify MongoDB URI is correct
- Check if MongoDB server is running (for local)
- Check network access (for Atlas)

### 404 errors
- Make sure server is running
- Check route path matches exactly: `/api/students/upload`
- Verify all dependencies are installed

### File upload errors
- Check file is `.xlsx` format
- Verify file size is under 10MB
- Check Excel file has correct column headers


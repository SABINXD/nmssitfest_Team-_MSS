# Backend Setup Instructions

## Installation Steps

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install required packages:**
   ```bash
   npm install
   ```

   This will install:
   - `multer` - For handling file uploads
   - `xlsx` - For reading Excel files
   - `bcryptjs` - For password hashing

3. **Make sure you have a `.env` file with:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. **Create uploads directory (if it doesn't exist):**
   The uploads directory will be created automatically, but you can create it manually:
   ```bash
   mkdir uploads
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```

## API Endpoint

### Upload Student File
- **URL:** `POST /api/students/upload`
- **Content-Type:** `multipart/form-data`
- **Body:** Form data with field name `studentsFile` containing the Excel file

### Response
- Returns an Excel file (.xlsx) with student credentials
- File contains: Student ID, Name, Email, Username, Password, Class, Roll Number

## File Format

The Excel file must have these columns:
- Name
- Email
- Class
- Roll Number

See `STUDENT_FILE_FORMAT.md` in the root directory for detailed format information.


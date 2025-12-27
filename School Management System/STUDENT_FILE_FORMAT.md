# Student Excel File Format

## File Requirements
- **File Format:** `.xlsx` (Excel format)
- **Maximum File Size:** 10MB
- **First Row:** Must contain column headers

## Required Columns

The Excel file must contain the following columns in the first row:

| Column Name | Description | Required | Example |
|------------|-------------|----------|---------|
| **Name** | Full name of the student | ✅ Yes | "Ram Bahadur Thapa" |
| **Email** | Student email address | ✅ Yes | "ram.thapa@nmss.edu" |
| **Class** | Class and section | ✅ Yes | "11A", "12B", "9C" |
| **Roll Number** | Student roll number | ✅ Yes | "001", "042", "123" |

## Example Excel File Structure

```
| Name              | Email                  | Class | Roll Number |
|-------------------|------------------------|-------|-------------|
| Ram Bahadur Thapa | ram.thapa@nmss.edu     | 11A   | 001         |
| Sita Devi         | sita.devi@nmss.edu     | 11A   | 002         |
| Hari Prasad       | hari.prasad@nmss.edu   | 11B   | 001         |
| Gita Kumari      | gita.kumari@nmss.edu   | 12A   | 015         |
```

## Column Details

### 1. Name
- Full name of the student
- Can include first name, middle name, and last name
- Example: "Ram Bahadur Thapa", "Sita Devi", "Hari Prasad"

### 2. Email
- Valid email address format
- Should follow school email pattern (e.g., `firstname.lastname@nmss.edu`)
- Must be unique for each student
- Example: "ram.thapa@nmss.edu", "sita.devi@nmss.edu"

### 3. Class
- Class and section designation
- Format: Grade + Section (e.g., "11A", "12B", "9C")
- Example: "11A", "11B", "12A", "12B", "9C"

### 4. Roll Number
- Unique identifier for the student within their class
- Can be numeric or alphanumeric
- Example: "001", "042", "123", "A01"

## What Happens After Upload?

1. **File Validation:** The system checks if the file is in `.xlsx` format
2. **Data Processing:** The system reads all student records from the file
3. **Credential Generation:** For each student, the system will:
   - Generate a unique Student ID (e.g., STU001, STU002)
   - Use the provided email or generate one if missing
   - Generate a secure password
   - Associate the student with their class
4. **Display Results:** All generated credentials are displayed in a table
5. **Download:** You can download all credentials as a CSV file

## Generated Output

After processing, you'll receive:
- **Student ID:** Auto-generated unique identifier
- **Name:** From your Excel file
- **Email:** From your Excel file (or auto-generated)
- **Password:** Auto-generated secure password
- **Class:** From your Excel file

## Notes

- **Email Format:** If email is missing, the system may generate one based on the student's name
- **Password:** Passwords are auto-generated and should be shared securely with students
- **Student ID:** Auto-generated sequential IDs (STU001, STU002, etc.)
- **Class Format:** Ensure class names are consistent (e.g., always use "11A" not "11 A" or "11-A")

## Sample Excel Template

You can create a template with these exact column headers:
```
Name | Email | Class | Roll Number
```

Then fill in the student data below the header row.


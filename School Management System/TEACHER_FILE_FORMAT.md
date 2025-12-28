# Teacher Excel File Format

## File Requirements
- **File Format:** `.xlsx` (Excel format)
- **Maximum File Size:** 10MB
- **First Row:** Must contain column headers

## Required Columns

The Excel file must contain the following columns in the first row:

| Column Name | Description | Required | Example |
|------------|-------------|----------|---------|
| **Name** | Full name of the teacher | ✅ Yes | "John Smith" |
| **Email** | Teacher email address | ✅ Yes | "john.smith@nmss.edu" |
| **Department** | Teacher department | ✅ Yes | "Mathematics", "Science", "English" |

## Optional Columns

The following columns are optional but can be included for more complete teacher information:

| Column Name | Description | Required | Example |
|------------|-------------|----------|---------|
| **Employee ID** | Unique employee identifier | ❌ No | "EMP0001", "T001" |
| **Username** | Preferred username | ❌ No | "johnsmith" |
| **Subjects** | Subjects taught (comma-separated) | ❌ No | "Math, Algebra, Geometry" |
| **Phone** | Contact phone number | ❌ No | "9876543210", "+977-1-1234567" |
| **Address** | Teacher address | ❌ No | "Kathmandu, Nepal" |
| **Is Active** | Active status (true/false) | ❌ No | true, false, 1, 0 |

## Example Excel File Structure

### Minimum Required Columns

```
| Name        | Email                 | Department  |
|-------------|-----------------------|-------------|
| John Smith  | john.smith@nmss.edu   | Mathematics |
| Jane Doe    | jane.doe@nmss.edu     | Science     |
| Bob Johnson | bob.johnson@nmss.edu  | English     |
```

### Complete Example with All Columns

```
| Name        | Email                 | Department  | Employee ID | Username   | Subjects                    | Phone        | Address          | Is Active |
|-------------|-----------------------|-------------|-------------|------------|-----------------------------|--------------|------------------|-----------|
| John Smith  | john.smith@nmss.edu   | Mathematics | EMP0001     | johnsmith  | Math, Algebra, Geometry      | 9876543210   | Kathmandu, Nepal | true      |
| Jane Doe    | jane.doe@nmss.edu     | Science     | EMP0002     | janedoe    | Physics, Chemistry           | 9876543211   | Lalitpur, Nepal  | true      |
| Bob Johnson | bob.johnson@nmss.edu  | English     | EMP0003     | bobjohnson | English, Literature, Grammar | 9876543212   | Bhaktapur, Nepal | true      |
```

## Column Details

### 1. Name (Required)
- Full name of the teacher
- Can include first name, middle name, and last name
- Example: "John Smith", "Jane Doe", "Bob Johnson"

### 2. Email (Required)
- Valid email address format
- Should follow school email pattern (e.g., `firstname.lastname@nmss.edu`)
- Must be unique for each teacher
- Will be converted to lowercase automatically
- Example: "john.smith@nmss.edu", "jane.doe@nmss.edu"

### 3. Department (Required)
- Department or subject area the teacher belongs to
- Examples: "Mathematics", "Science", "English", "Computer Science", "Physical Education"
- Used for filtering and organization in the admin panel

### 4. Employee ID (Optional)
- Unique identifier for the employee
- If not provided, system will auto-generate (e.g., EMP0001, EMP0002)
- Must be unique if provided
- Examples: "EMP0001", "T001", "TEACHER-001"

### 5. Username (Optional)
- Preferred username for login
- If not provided, system will auto-generate based on name and employee ID
- Must be unique if provided
- Will be converted to lowercase automatically
- Example: "johnsmith", "jane.doe", "bobjohnson"

### 6. Subjects (Optional)
- List of subjects the teacher teaches
- Can be provided as:
  - Comma-separated string: "Math, Algebra, Geometry"
  - Multiple columns (not recommended)
- Examples: "Physics, Chemistry", "English, Literature", "Computer Science"

### 7. Phone (Optional)
- Contact phone number
- Can be in any format
- Examples: "9876543210", "+977-1-1234567", "01-1234567"

### 8. Address (Optional)
- Physical address of the teacher
- Can be in any format
- Examples: "Kathmandu, Nepal", "123 Main Street, City"

### 9. Is Active (Optional)
- Indicates if the teacher is currently active
- Accepts: true, false, 1, 0, "true", "false"
- Defaults to true if not provided
- Examples: true, false, 1, 0

## What Happens After Upload?

1. **File Validation:** The system checks if the file is in `.xlsx` format
2. **Data Processing:** The system reads all teacher records from the file
3. **Credential Generation:** For each teacher, the system will:
   - Use provided Employee ID or generate one (EMP0001, EMP0002, etc.)
   - Use provided Username or generate one based on name and employee ID
   - Generate a secure random password (8 characters with letters, numbers, and symbols)
   - Hash the password for secure storage
   - Parse subjects (if provided as comma-separated string)
   - Set isActive to true if not specified
4. **Database Storage:** All teachers are saved to the database
5. **Credentials File:** You'll receive a downloadable Excel file with all credentials

## Generated Output

After processing, you'll receive a credentials Excel file containing:

| Column | Description | Source |
|--------|-------------|--------|
| **Employee ID** | Unique employee identifier | Provided or auto-generated |
| **Name** | Teacher's full name | From your Excel file |
| **Email** | Teacher's email address | From your Excel file |
| **Username** | Login username | Provided or auto-generated |
| **Password** | Auto-generated secure password | System generated (plain text in file only) |
| **Department** | Teacher's department | From your Excel file |
| **Subjects** | Subjects taught | From your Excel file |
| **Phone** | Contact number | From your Excel file (if provided) |
| **Address** | Physical address | From your Excel file (if provided) |

## Notes

- **Email Format:** Email addresses will be automatically converted to lowercase
- **Password:** Passwords are auto-generated (8 characters: letters, numbers, symbols) and should be shared securely with teachers
- **Employee ID:** If not provided, auto-generated sequential IDs (EMP0001, EMP0002, etc.)
- **Username:** If not provided, auto-generated from name and employee ID
- **Unique Constraints:** Email, Username, and Employee ID must be unique. If duplicates are found, the system will attempt to modify them automatically
- **Department Format:** Ensure department names are consistent (e.g., always use "Mathematics" not "Math" or "math")
- **Subjects Format:** Use comma-separated values for multiple subjects: "Math, Algebra, Geometry"
- **Password Security:** Generated passwords are hashed before storage. The plain text password appears only in the downloaded credentials file

## Sample Excel Template

You can create a template with these column headers (minimum required):

```
Name | Email | Department
```

Or include all optional columns:

```
Name | Email | Department | Employee ID | Username | Subjects | Phone | Address | Is Active
```

Then fill in the teacher data below the header row.

## Example Use Cases

### Case 1: Minimal Data (Only Required Columns)
```
Name        | Email                 | Department
John Smith  | john.smith@nmss.edu   | Mathematics
Jane Doe    | jane.doe@nmss.edu     | Science
```
- Employee ID, Username, and Password will be auto-generated
- Subjects, Phone, Address will be empty
- Is Active will default to true

### Case 2: Complete Data (All Columns)
```
Name        | Email                 | Department  | Employee ID | Username   | Subjects                    | Phone        | Address          | Is Active
John Smith  | john.smith@nmss.edu   | Mathematics | EMP001      | johnsmith  | Math, Algebra, Geometry      | 9876543210   | Kathmandu        | true
Jane Doe    | jane.doe@nmss.edu     | Science     | EMP002      | janedoe    | Physics, Chemistry           | 9876543211   | Lalitpur         | true
```
- All provided data will be used
- Password will still be auto-generated for security


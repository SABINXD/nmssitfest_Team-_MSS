Library Management - Admin Panel

Overview
- Adds a Library Management UI to the Admin Panel (tab: 📚 Library).
- Uses existing site color palette (CSS variables in `src/index.css`) and keeps layout/structure consistent.

Features
- CRUD books (title, authors, ISBN, category, copies, location)
- Borrow a book (borrower type/id/name, due date)
- Return a book (marks returned, calculates simple fine if overdue)
- View borrow records

API Endpoints (Backend)
- GET /api/library/books         - list books
- POST /api/library/books        - create book
- GET /api/library/books/:id     - get book
- PUT /api/library/books/:id     - update book
- DELETE /api/library/books/:id  - delete book
- POST /api/library/books/:id/borrow - borrow a book
- POST /api/library/books/:id/return - return a book (body: { recordId })
- GET /api/library/records      - list borrow records

Quick manual test steps
1. Start backend server on port 5000 (make sure MONGODB_URI is set).
2. Open Admin Panel -> Library.
3. Add a book with 2 copies, confirm it appears in the table.
4. Click Borrow on the book and enter borrower id/name (use existing studentId/employeeId if you want validation).
5. Verify available copies decreased and a borrow record appears.
6. Click Return on the record to mark it returned and verify copies increased.

Notes
- UI uses the same CSS variables (`--soft-teal`, `--soft-yellow`, etc.) so it follows the Home page gradient blend consistently.
- Fine is a simple 1 unit/day calculation when returning late (can be adjusted in backend).

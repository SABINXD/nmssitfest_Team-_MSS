Library API (backend)

Models
- Book: title, authors, isbn, category, publisher, year, totalCopies, availableCopies, location
- BorrowRecord: book(ref), borrowerType, borrowerId, borrowerName, borrowedAt, dueDate, returnedAt, status, fine

Routes
- Mounted at /api/library
- See `routes/LibraryRoutes.js` for request/response details

Manual verification
1. Start server: node server.js (ensure MONGODB_URI set)
2. Use curl / Postman to hit endpoints, or use Admin UI in frontend
3. Example borrow:
   POST http://localhost:5000/api/library/books/<bookId>/borrow
   body: { "borrowerType": "Student", "borrowerId": "S123", "borrowerName":"Jane" }
4. Return:
   POST http://localhost:5000/api/library/books/<bookId>/return
   body: { "recordId": "<borrowRecordId>" }

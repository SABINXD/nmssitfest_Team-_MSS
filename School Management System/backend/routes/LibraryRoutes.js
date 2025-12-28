const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Simple health check for the library routes
router.get('/health', (req, res) => res.json({ ok: true, service: 'library' }));

// GET /api/library/books - list books (supports ?q=search)
router.get('/books', async (req, res) => {
  try {
    const { q, available } = req.query;
    let filter = {};
    if (q) filter.$text = { $search: q };
    if (available === 'true') filter.availableCopies = { $gt: 0 };
    const books = await Book.find(filter).sort({ title: 1 });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// POST /api/library/books - create book
router.post('/books', async (req, res) => {
  try {
    const payload = req.body;
    payload.availableCopies = payload.availableCopies ?? payload.totalCopies ?? 1;
    const book = await Book.create(payload);
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create book', details: err.message });
  }
});

// GET /api/library/books/:id
router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// PUT /api/library/books/:id - update
router.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update book', details: err.message });
  }
});

// DELETE /api/library/books/:id
router.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    // Optionally delete related borrow records
    await BorrowRecord.deleteMany({ book: book._id });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// POST /api/library/books/:id/borrow - borrow a book
// body: { borrowerType, borrowerId, borrowerName, days }
router.post('/books/:id/borrow', async (req, res) => {
  try {
    const { borrowerType, borrowerId, borrowerName, days = 14 } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (book.availableCopies <= 0) return res.status(400).json({ error: 'No copies available' });

    // optional: validate borrower exists
    if (borrowerType === 'Student') {
      const s = await Student.findOne({ studentId: borrowerId });
      if (!s) return res.status(404).json({ error: 'Student not found' });
    }
    if (borrowerType === 'Teacher') {
      const t = await Teacher.findOne({ employeeId: borrowerId });
      if (!t) return res.status(404).json({ error: 'Teacher not found' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(days, 10));

    const record = await BorrowRecord.create({
      book: book._id,
      borrowerType,
      borrowerId,
      borrowerName,
      dueDate
    });

    book.availableCopies = Math.max(0, book.availableCopies - 1);
    await book.save();

    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to borrow book', details: err.message });
  }
});

// POST /api/library/books/:id/return - return a book
// body: { recordId }
router.post('/books/:id/return', async (req, res) => {
  try {
    const { recordId } = req.body;
    const record = await BorrowRecord.findById(recordId);
    if (!record) return res.status(404).json({ error: 'Borrow record not found' });
    if (record.returnedAt) return res.status(400).json({ error: 'Already returned' });

    record.returnedAt = new Date();
    record.status = 'Returned';
    // compute fine (if overdue)
    if (record.dueDate && record.returnedAt > record.dueDate) {
      const diffDays = Math.ceil((record.returnedAt - record.dueDate) / (1000 * 60 * 60 * 24));
      record.fine = diffDays * 1; // simple 1 currency unit per day
    }
    await record.save();

    const book = await Book.findById(record.book);
    if (book) {
      book.availableCopies = book.availableCopies + 1;
      await book.save();
    }

    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to return book', details: err.message });
  }
});

// GET /api/library/records - list borrow records
router.get('/records', async (req, res) => {
  try {
    const records = await BorrowRecord.find().populate('book').sort({ borrowedAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

module.exports = router;
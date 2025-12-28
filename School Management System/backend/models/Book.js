const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  authors: [{ type: String, trim: true }],
  isbn: { type: String, trim: true, index: true },
  category: { type: String, trim: true },
  publisher: { type: String, trim: true },
  year: { type: Number },
  totalCopies: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
  location: { type: String, trim: true },
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

bookSchema.index({ title: 'text', authors: 'text', isbn: 'text', category: 'text' });

module.exports = mongoose.model('Book', bookSchema);

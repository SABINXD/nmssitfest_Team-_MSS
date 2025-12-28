const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowerType: { type: String, enum: ['Student', 'Teacher', 'Admin', 'Other'], required: true },
  borrowerId: { type: String, required: true }, // could be studentId / teacherId / adminId
  borrowerName: { type: String, required: true },
  borrowedAt: { type: Date, default: Date.now },
  dueDate: { type: Date },
  returnedAt: { type: Date, default: null },
  status: { type: String, enum: ['Borrowed', 'Returned', 'Overdue'], default: 'Borrowed' },
  fine: { type: Number, default: 0 }
});

borrowRecordSchema.index({ borrowerId: 1 });

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);

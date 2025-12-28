import React, { useState, useEffect } from 'react';
import './LibraryPanel.css';

const LibraryPanel = () => {
  const [books, setBooks] = useState([]);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', authors: '', isbn: '', category: '', totalCopies: 1, location: '' });
  const [editing, setEditing] = useState(null);
  const [borrowPayload, setBorrowPayload] = useState({ borrowerType: 'Student', borrowerId: '', borrowerName: '', days: 14 });

  const fetchBooks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/library/books');
      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        console.error('Library books fetch failed:', res.status, res.statusText, txt);
        // If route isn't available yet (404), don't show the error box — just log and return silently
        if (res.status === 404) {
          console.warn('Library books route not available (404). Suppressing UI error.');
          setBooks([]);
          return;
        }
        setError(`Failed to fetch books: ${res.status} ${res.statusText}`);
        setBooks([]);
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error('Unexpected books response:', data);
        setError('Unexpected response from server when fetching books');
        setBooks([]);
        return;
      }
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books');
      setBooks([]);
    }
  };

  const fetchRecords = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/library/records');
      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        console.error('Library records fetch failed:', res.status, res.statusText, txt);
        // Suppress 404 errors from showing in the UI
        if (res.status === 404) {
          console.warn('Library records route not available (404). Suppressing UI error.');
          setRecords([]);
          return;
        }
        setError(`Failed to fetch borrow records: ${res.status} ${res.statusText}`);
        setRecords([]);
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error('Unexpected records response:', data);
        setError('Unexpected response from server when fetching records');
        setRecords([]);
        return;
      }
      setRecords(data);
    } catch (err) {
      console.error('Error fetching borrow records:', err);
      setError('Failed to fetch borrow records');
      setRecords([]);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchRecords();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        authors: form.authors.split(',').map(s => s.trim()),
        totalCopies: Number(form.totalCopies),
        availableCopies: Number(form.totalCopies)
      };
      let res;
      if (editing) {
        res = await fetch(`http://localhost:5000/api/library/books/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
      } else {
        res = await fetch('http://localhost:5000/api/library/books', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSuccess(editing ? 'Book updated' : 'Book created');
      setForm({ title: '', authors: '', isbn: '', category: '', totalCopies: 1, location: '' });
      setEditing(null);
      fetchBooks();
    } catch (err) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
      setTimeout(()=>{ setSuccess(null); setError(null);}, 3000);
    }
  };

  const handleEdit = (b) => {
    setEditing(b._id);
    setForm({ title: b.title || '', authors: (b.authors || []).join(', '), isbn: b.isbn || '', category: b.category || '', totalCopies: b.totalCopies || 1, location: b.location || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    await fetch(`http://localhost:5000/api/library/books/${id}`, { method: 'DELETE' });
    fetchBooks();
  };

  const handleBorrow = async (bookId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/library/books/${bookId}/borrow`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(borrowPayload)});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to borrow');
      setSuccess('Book borrowed');
      setBorrowPayload({ borrowerType: 'Student', borrowerId: '', borrowerName: '', days: 14 });
      fetchBooks();
      fetchRecords();
    } catch (err) {
      setError(err.message || 'Error borrowing');
    } finally {
      setLoading(false);
      setTimeout(()=>{ setSuccess(null); setError(null);}, 3000);
    }
  };

  const handleReturn = async (recordId) => {
    if (!window.confirm('Mark this book as returned?')) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/library/books/0/return`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ recordId })});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to return');
      setSuccess('Book returned');
      fetchBooks();
      fetchRecords();
    } catch (err) {
      setError(err.message || 'Error returning');
    } finally {
      setLoading(false);
      setTimeout(()=>{ setSuccess(null); setError(null);}, 3000);
    }
  };

  return (
    <div className="library-panel">
      <div className="section-header">
        <h2>Library Management</h2>
        <p>Manage books, borrowing and returns</p>
      </div>

      <div className="library-main">
        <div className="library-left">
          <form className="book-form" onSubmit={handleCreateOrUpdate}>
            <h3>{editing ? 'Edit Book' : 'Add New Book'}</h3>
            <label>Title<input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></label>
            <label>Authors <small>(comma separated)</small><input value={form.authors} onChange={e => setForm({...form, authors: e.target.value})} /></label>
            <label>ISBN<input value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} /></label>
            <label>Category<input value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></label>
            <label>Total Copies<input type="number" min="1" value={form.totalCopies} onChange={e => setForm({...form, totalCopies: e.target.value})} /></label>
            <label>Location<input value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></label>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="process-btn" type="submit" disabled={loading}>{loading ? 'Saving...' : (editing ? 'Update Book' : 'Create Book')}</button>
              {editing && <button type="button" className="process-btn" onClick={() => { setEditing(null); setForm({ title: '', authors: '', isbn: '', category: '', totalCopies: 1, location: '' }); }}>Cancel</button>}
            </div>
          </form>

          {error && !/404|Route not found/.test(error) && <div className="error-message">❌ {error}</div>}
          {success && <div className="success-message">✅ {success}</div>}
        </div>

        <div className="library-right">
          <div className="books-table">
            <h3>Books</h3>
            <table>
              <thead>
                <tr><th>Title</th><th>Authors</th><th>Copies</th><th>Available</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {Array.isArray(books) && books.map(b => (
                  <tr key={b._id}>
                    <td>{b.title}</td>
                    <td>{(b.authors||[]).join(', ')}</td>
                    <td>{b.totalCopies}</td>
                    <td>{b.availableCopies}</td>
                    <td style={{display:'flex',gap:6}}>
                      <button className="small-btn" onClick={() => handleEdit(b)}>Edit</button>
                      <button className="small-btn" onClick={() => handleDelete(b._id)}>Delete</button>
                      <button className="small-btn" onClick={() => { const name = prompt('Borrower name'); const id = prompt('Borrower id (studentId or employeeId)'); const type = prompt('Type (Student/Teacher)', 'Student'); if (name && id) { setBorrowPayload({ borrowerType: type, borrowerId: id, borrowerName: name, days: 14 }); handleBorrow(b._id); } }}>Borrow</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="records-table">
            <h3>Borrow Records</h3>
            <table>
              <thead>
                <tr><th>Book</th><th>Borrower</th><th>Borrowed At</th><th>Due</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {Array.isArray(records) && records.map(r => (
                  <tr key={r._id}>
                    <td>{r.book?.title}</td>
                    <td>{r.borrowerName} ({r.borrowerType})</td>
                    <td>{new Date(r.borrowedAt).toLocaleDateString()}</td>
                    <td>{r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '-'}</td>
                    <td>{r.status}{r.fine ? ` (Fine: ${r.fine})` : ''}</td>
                    <td>{r.status !== 'Returned' && <button className="small-btn" onClick={() => handleReturn(r._id)}>Return</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPanel;
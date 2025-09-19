const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory database
let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', year: 1925 },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084', year: 1960 },
  { id: 3, title: '1984', author: 'George Orwell', isbn: '9780451524935', year: 1949 }
];
let nextId = 4;

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all books
app.get('/api/books', (req, res) => {
  res.json(books);
});

// Search books
app.get('/api/books/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json(books);
  
  const filtered = books.filter(book => 
    book.title.toLowerCase().includes(q.toLowerCase()) ||
    book.author.toLowerCase().includes(q.toLowerCase()) ||
    book.isbn.includes(q)
  );
  res.json(filtered);
});

// Get book by ID
app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// Add new book
app.post('/api/books', (req, res) => {
  const { title, author, isbn, year } = req.body;
  if (!title || !author || !isbn || !year) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const newBook = { id: nextId++, title, author, isbn, year: parseInt(year) };
  books.push(newBook);
  res.status(201).json(newBook);
});

// Update book
app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex === -1) return res.status(404).json({ error: 'Book not found' });
  
  const { title, author, isbn, year } = req.body;
  books[bookIndex] = { id, title, author, isbn, year: parseInt(year) };
  res.json(books[bookIndex]);
});

// Delete book
app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex === -1) return res.status(404).json({ error: 'Book not found' });
  
  books.splice(bookIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
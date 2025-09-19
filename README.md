# Library Management System

A complete full-stack library management system with CRUD functionality and search features.

## Features
- ✅ Add new books
- ✅ View all books  
- ✅ Edit existing books
- ✅ Delete books
- ✅ Search books by title, author, or ISBN
- ✅ Responsive design
- ✅ Real-time updates
- ✅ Smooth animations

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** In-memory storage (easily upgradable to MongoDB/MySQL)

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   cd sample
   npm install
   ```

2. **Run the Application:**
   ```bash
   npm start
   ```

3. **Access the Application:**
   Open your browser and go to `http://localhost:3000`

## API Endpoints
- `GET /api/books` - Get all books
- `GET /api/books/search?q=query` - Search books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

## Default Data
The system comes with 3 sample books:
- The Great Gatsby
- To Kill a Mockingbird
- 1984

## Usage
1. Click "Add Book" to add new books
2. Use the search box to find specific books
3. Click "Edit" on any book card to modify it
4. Click "Delete" to remove books (with confirmation)
5. All operations update the display in real-time
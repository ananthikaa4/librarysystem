class LibraryManager {
    constructor() {
        this.books = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadBooks();
    }

    bindEvents() {
        document.getElementById('addBookBtn').addEventListener('click', () => this.openModal());
        document.getElementById('searchBtn').addEventListener('click', () => this.searchBooks());
        document.getElementById('searchInput').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.searchBooks();
        });
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('bookForm').addEventListener('submit', (e) => this.handleSubmit(e));
        
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('bookModal')) {
                this.closeModal();
            }
        });
    }

    async loadBooks() {
        try {
            const response = await fetch('/api/books');
            this.books = await response.json();
            this.renderBooks(this.books);
        } catch (error) {
            console.error('Error loading books:', error);
        }
    }

    async searchBooks() {
        const query = document.getElementById('searchInput').value;
        try {
            const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
            const books = await response.json();
            this.renderBooks(books);
        } catch (error) {
            console.error('Error searching books:', error);
        }
    }

    renderBooks(books) {
        const grid = document.getElementById('booksGrid');
        
        if (books.length === 0) {
            grid.innerHTML = '<div class="no-books">No books found</div>';
            return;
        }

        grid.innerHTML = books.map(book => `
            <div class="book-card" data-id="${book.id}">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>ISBN:</strong> ${book.isbn}</p>
                <p><strong>Year:</strong> ${book.year}</p>
                <div class="book-actions">
                    <button class="btn btn-edit" onclick="library.editBook(${book.id})">Edit</button>
                    <button class="btn btn-danger" onclick="library.deleteBook(${book.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    openModal(book = null) {
        const modal = document.getElementById('bookModal');
        const form = document.getElementById('bookForm');
        const title = document.getElementById('modalTitle');
        
        if (book) {
            title.textContent = 'Edit Book';
            document.getElementById('bookId').value = book.id;
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('isbn').value = book.isbn;
            document.getElementById('year').value = book.year;
        } else {
            title.textContent = 'Add Book';
            form.reset();
            document.getElementById('bookId').value = '';
        }
        
        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('bookModal').style.display = 'none';
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const bookId = document.getElementById('bookId').value;
        const bookData = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            isbn: document.getElementById('isbn').value,
            year: parseInt(document.getElementById('year').value)
        };

        try {
            let response;
            if (bookId) {
                response = await fetch(`/api/books/${bookId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookData)
                });
            } else {
                response = await fetch('/api/books', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookData)
                });
            }

            if (response.ok) {
                this.closeModal();
                this.loadBooks();
                this.showNotification(bookId ? 'Book updated successfully!' : 'Book added successfully!');
            }
        } catch (error) {
            console.error('Error saving book:', error);
        }
    }

    async editBook(id) {
        try {
            const response = await fetch(`/api/books/${id}`);
            const book = await response.json();
            this.openModal(book);
        } catch (error) {
            console.error('Error loading book:', error);
        }
    }

    async deleteBook(id) {
        if (!confirm('Are you sure you want to delete this book?')) return;
        
        try {
            const response = await fetch(`/api/books/${id}`, { method: 'DELETE' });
            if (response.ok) {
                this.loadBooks();
                this.showNotification('Book deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the library manager
const library = new LibraryManager();
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

const API_BASE = 'http://localhost:5051';

interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  pageCount: number;
  price: number;
}

interface BooksResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  books: Book[];
}

interface BookListProps {
  onGoToCart: (returnPage: number, returnCategory: string, returnSort: string) => void;
  initialPage?: number;
  initialCategory?: string;
  initialSort?: 'asc' | 'desc';
}

export default function BookList({ onGoToCart, initialPage = 1, initialCategory = 'All', initialSort = 'asc' }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSort);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [addedBookId, setAddedBookId] = useState<number | null>(null);

  const { addToCart, cartCount, cartTotal } = useCart();
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    fetch(`${API_BASE}/books/categories`)
      .then(res => res.json())
      .then((data: string[]) => setCategories(data))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const categoryParam = selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
        const res = await fetch(`${API_BASE}/books?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}${categoryParam}`);
        const data: BooksResponse = await res.json();
        setBooks(data.books);
        setTotalCount(data.totalCount);
      } catch (err) {
        console.error('Failed to fetch books:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [page, pageSize, sortOrder, selectedCategory]);

  const handleAddToCart = async (book: Book) => {
    await addToCart(book.bookId);
    setAddedBookId(book.bookId);
    setTimeout(() => setAddedBookId(null), 1500);
  };

  return (
    <div className="container-fluid mt-4">
      {cartCount > 0 && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="card border-success shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center py-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-5">🛒</span>
                  <strong>Cart Summary:</strong>
                  <span className="badge bg-success rounded-pill">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
                  <span className="text-muted">·</span>
                  <span className="fw-semibold text-success">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="btn btn-success btn-sm" onClick={() => onGoToCart(page, selectedCategory, sortOrder)}>View Cart →</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="row mb-3 align-items-end g-2">
        <div className="col-12"><h2 className="mb-0">📚 Bookstore</h2></div>
        <div className="col-sm-auto">
          <div className="input-group input-group-sm">
            <span className="input-group-text"><i>Category</i></span>
            <select className="form-select form-select-sm" value={selectedCategory} onChange={e => { setSelectedCategory(e.target.value); setPage(1); }} style={{ minWidth: '150px' }}>
              <option value="All">All Categories</option>
              {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </div>
        </div>
        <div className="col-sm-auto">
          <div className="input-group input-group-sm">
            <span className="input-group-text">Per page</span>
            <select className="form-select form-select-sm" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
        <div className="col-sm-auto ms-auto">
          <span className="text-muted small">{totalCount} book{totalCount !== 1 ? 's' : ''} found</span>
        </div>
      </div>
      {loading ? (
        <div className="text-center my-5"><div className="spinner-border text-primary" role="status" /></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th><button className="btn btn-sm btn-outline-light" onClick={() => { setSortOrder(p => p === 'asc' ? 'desc' : 'asc'); setPage(1); }}>Title {sortOrder === 'asc' ? '▲' : '▼'}</button></th>
                <th>Author</th><th>Publisher</th><th>ISBN</th><th>Category</th><th>Pages</th><th>Price</th><th>Add to Cart</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.bookId}>
                  <td>{book.title}</td><td>{book.author}</td><td>{book.publisher}</td><td>{book.isbn}</td>
                  <td><span className="badge bg-secondary">{book.classification}</span></td>
                  <td>{book.pageCount}</td><td>${book.price.toFixed(2)}</td>
                  <td><button className={`btn btn-sm ${addedBookId === book.bookId ? 'btn-success' : 'btn-outline-primary'}`} onClick={() => handleAddToCart(book)}>{addedBookId === book.bookId ? '✓ Added' : '+ Add'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <nav><ul className="pagination justify-content-center flex-wrap">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(1)}>«</button></li>
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(p => p - 1)}>‹</button></li>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <li key={p} className={`page-item ${p === page ? 'active' : ''}`}><button className="page-link" onClick={() => setPage(p)}>{p}</button></li>
        ))}
        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(p => p + 1)}>›</button></li>
        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(totalPages)}>»</button></li>
      </ul></nav>
      <p className="text-center text-muted small">Page {page} of {totalPages}</p>
    </div>
  );
}

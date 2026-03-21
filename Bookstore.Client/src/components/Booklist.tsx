import { useEffect, useState } from 'react';

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

const API_BASE = 'http://localhost:5051/books';

export default function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const totalPages = Math.ceil(totalCount / pageSize);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `${API_BASE}?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`
                );
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
    }, [page, pageSize, sortOrder]);

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setPage(1); // reset to first page
    };

    const toggleSort = () => {
        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        setPage(1);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">📚 Bookstore</h2>

            {/* Controls row */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                    <label className="form-label mb-0">Results per page:</label>
                    <select
                        className="form-select form-select-sm w-auto"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
                <span className="text-muted">
          {totalCount} book{totalCount !== 1 ? 's' : ''} total
        </span>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status" />
                </div>
            ) : (
                <table className="table table-striped table-bordered table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>
                            <button
                                className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                                onClick={toggleSort}
                            >
                                Title
                                <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                            </button>
                        </th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>ISBN</th>
                        <th>Category</th>
                        <th>Pages</th>
                        <th>Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {books.map(book => (
                        <tr key={book.bookId}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.publisher}</td>
                            <td>{book.isbn}</td>
                            <td>
                                <span className="badge bg-secondary">{book.classification}</span>
                            </td>
                            <td>{book.pageCount}</td>
                            <td>${book.price.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <nav>
                <ul className="pagination justify-content-center flex-wrap">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(1)}>
                            «
                        </button>
                    </li>
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(p => p - 1)}>
                            ‹
                        </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setPage(p)}>
                                {p}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(p => p + 1)}>
                            ›
                        </button>
                    </li>
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(totalPages)}>
                            »
                        </button>
                    </li>
                </ul>
            </nav>

            <p className="text-center text-muted">
                Page {page} of {totalPages}
            </p>
        </div>
    );
}
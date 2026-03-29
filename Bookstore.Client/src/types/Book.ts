export interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  pageCount: number;
  price: number;
}

export interface BooksResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  books: Book[];
}

export interface CartItem {
  bookId: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

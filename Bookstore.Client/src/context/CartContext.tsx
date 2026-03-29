import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface CartItem {
  bookId: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  subtotal: number;
}

const API_BASE = 'http://localhost:5051';

interface CartContextType {
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  addToCart: (bookId: number) => Promise<void>;
  removeFromCart: (bookId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/cart`, { credentials: 'include' });
      const data = await res.json();
      setCartItems(data.items);
      setCartTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  }, []);

  const addToCart = async (bookId: number) => {
    try {
      const res = await fetch(`${API_BASE}/cart/add/${bookId}`, { method: 'POST', credentials: 'include' });
      const data = await res.json();
      setCartItems(data.items);
      setCartTotal(data.total);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const removeFromCart = async (bookId: number) => {
    try {
      const res = await fetch(`${API_BASE}/cart/remove/${bookId}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      setCartItems(data.items);
      setCartTotal(data.total);
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch(`${API_BASE}/cart/clear`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      setCartItems(data.items);
      setCartTotal(data.total);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, cartTotal, cartCount, addToCart, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

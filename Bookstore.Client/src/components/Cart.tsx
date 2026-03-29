import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

interface CartProps {
  onContinueShopping: () => void;
}

export default function Cart({ onContinueShopping }: CartProps) {
  const { cartItems, cartTotal, removeFromCart, clearCart, fetchCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2>🛒 Your Cart</h2>
        <p className="text-muted mt-3">Your cart is empty.</p>
        <button className="btn btn-primary mt-2" onClick={onContinueShopping}>
          ← Browse Books
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row mb-3 align-items-center">
        <div className="col">
          <h2 className="mb-0">🛒 Your Cart</h2>
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-secondary btn-sm" onClick={onContinueShopping}>
            ← Continue Shopping
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th className="text-end">Price</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Subtotal</th>
                  <th className="text-center">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.bookId}>
                    <td>{item.title}</td>
                    <td>{item.author}</td>
                    <td className="text-end">${item.price.toFixed(2)}</td>
                    <td className="text-center">
                      <span className="badge bg-primary rounded-pill">{item.quantity}</span>
                    </td>
                    <td className="text-end fw-semibold">${item.subtotal.toFixed(2)}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.bookId)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-light">
                  <td colSpan={4} className="text-end fw-bold">Total:</td>
                  <td className="text-end fw-bold text-success fs-5">${cartTotal.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <div className="row g-2 mt-2">
        <div className="col-sm-auto">
          <button className="btn btn-outline-secondary w-100" onClick={onContinueShopping}>← Continue Shopping</button>
        </div>
        <div className="col-sm-auto ms-sm-auto">
          <button className="btn btn-outline-danger" onClick={clearCart}>Clear Cart</button>
        </div>
        <div className="col-sm-auto">
          <button className="btn btn-success">Checkout →</button>
        </div>
      </div>
    </div>
  );
}

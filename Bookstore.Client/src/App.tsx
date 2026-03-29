import { useState } from 'react';
import BookList from './components/Booklist';
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';

type View = 'books' | 'cart';

interface ReturnState {
  page: number;
  category: string;
  sort: string;
}

function App() {
  const [view, setView] = useState<View>('books');
  const [returnState, setReturnState] = useState<ReturnState>({
    page: 1,
    category: 'All',
    sort: 'asc',
  });

  const handleGoToCart = (returnPage: number, returnCategory: string, returnSort: string) => {
    setReturnState({ page: returnPage, category: returnCategory, sort: returnSort });
    setView('cart');
  };

  const handleContinueShopping = () => {
    setView('books');
  };

  return (
    <CartProvider>
      <div>
        {view === 'books' ? (
          <BookList
            onGoToCart={handleGoToCart}
            initialPage={returnState.page}
            initialCategory={returnState.category}
            initialSort={returnState.sort as 'asc' | 'desc'}
          />
        ) : (
          <Cart onContinueShopping={handleContinueShopping} />
        )}
      </div>
    </CartProvider>
  );
}

export default App;

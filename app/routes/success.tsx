// success.tsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Jeśli używasz react-router
import { db } from '../services/index'; // Upewnij się, że masz dostęp do swojego db

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const updateProductsAndClearCart = async () => {
      try {
        // Pobierz dane o zamówieniu (np. z sesji, lokalnego storage, lub przekazane w query params)
        const orderData = JSON.parse(localStorage.getItem('orderData') || '{}');

        if (orderData.cart && Object.keys(orderData.cart).length > 0) {
          const cartItems = Object.values(orderData.cart);

          // Zaktualizuj bazę danych - zmniejsz ilości produktów
          for (const item of cartItems) {
            await db.product.updateMany({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: parseInt(item.stock, 10), // Zmniejsz ilość
                },
              },
            });
          }

          // Wyczyść koszyk z lokalnej pamięci
          localStorage.removeItem('cart');
          localStorage.removeItem('orderData');

        }
      } catch (error) {
        console.error('Błąd przy aktualizacji produktów lub czyszczeniu koszyka:', error);
      }
    };

    updateProductsAndClearCart();
  }, [navigate]);

  return (
    <div className='py-16 text-center flex flex-col items-center'>
      <h1 className='py-10 text-2xl'>Twoja płatność została zrealizowana pomyślnie!</h1>
      <p>Dziękujemy za zakupy! :)</p>
      <img src="https://res.cloudinary.com/djio9fbja/image/upload/f_auto,q_auto/v1/public/zsa7ti63lpljo6spth7p" alt="Opis zdjęcia" className='py-4 md:py-2 w-96 object-cover' />
    </div>
  );
};

export default SuccessPage;
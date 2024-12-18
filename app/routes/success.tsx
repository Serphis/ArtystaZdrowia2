import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Success = () => {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');

    if (sessionId) {
      // Wysłanie zapytania do backendu, aby zapisać zamówienie w bazie
      const saveOrder = async () => {
        try {
          const response = await fetch('https://www.artystazdrowia.com/databaseHandler', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId }),  // Przesyłamy ID sesji płatności
          });

          const result = await response.json();

          if (result.status === 'success') {
            console.log('Zamówienie zostało zapisane:', result.orderId);
          } else {
            console.error('Błąd zapisania zamówienia:', result.message);
          }
        } catch (error) {
          console.error('Błąd podczas zapisywania zamówienia:', error);
        }
      };

      saveOrder();
    }
  }, [location.search]);

  return (
    <div className="text-center">
      <h1 className="text-3xl">Dziękujemy za zakupy!</h1>
      <p>Twoje zamówienie zostało złożone pomyślnie.</p>
    </div>
  );
};

export default Success;

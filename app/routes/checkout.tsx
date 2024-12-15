import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Załaduj publiczny klucz Stripe (zamień na swój klucz testowy/produkcyjny)
const stripePromise = loadStripe('pk_test_51QWDzLC66ozEbyTE3bWJdZCIgsFId1VpLZ35NaR67Xbn16UbxLJ9iEvYTinebp7KmbYncMmdlWRtchkGBjzuVH4o00NbPwKvop');

const Checkout = () => {
  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            { id: 'swieczka-1', quantity: 2 }, // Przykładowe dane produktu
          ],
        }),
      });

      const session = await response.json();

      if (session.error) {
        console.error(session.error);
        alert('Błąd podczas tworzenia sesji płatności');
        return;
      }

      const stripe = await stripePromise;
      const { error } = await stripe?.redirectToCheckout({ sessionId: session.id });

      if (error) {
        console.error(error.message);
        alert('Wystąpił błąd podczas przekierowania do płatności.');
      }
    } catch (error) {
      console.error(error);
      alert('Wystąpił błąd podczas obsługi płatności.');
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Podsumowanie zamówienia</h1>
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleCheckout}
        >
          Zapłać
        </button>
      </div>
    </Elements>
  );
};

export default Checkout;

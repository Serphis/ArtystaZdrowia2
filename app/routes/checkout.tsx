import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Załaduj publiczny klucz Stripe (zamień na swój klucz testowy/produkcyjny)
const stripePromise = process.env.NEXT_PUBLIC_PUBLICZNY_KLUCZ_STRIPE
  ? loadStripe(process.env.NEXT_PUBLIC_PUBLICZNY_KLUCZ_STRIPE)
  : null;
  
const Checkout = () => {
  const handleCheckout = async () => {
    try {
      const response = await fetch('https://www.artystazdrowia.com/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            { id: 'swieczka-1', quantity: 1 }, // Przykładowy produkt 1
            { id: 'swieczka-2', quantity: 2 }  // Przykładowy produkt 2
          ],
        }),
      });

      // Sprawdzenie odpowiedzi HTTP
      if (!response.ok) {
        console.error('Błąd HTTP:', response.status, response.statusText);
        const responseClone = response.clone();
        const errorText = await responseClone.text();
        console.error('Treść odpowiedzi (HTML):', errorText);
        alert('Błąd podczas tworzenia sesji płatności. Skontaktuj się z obsługą.');
        return;
      }

      let session;
      try {
        // Próba parsowania odpowiedzi jako JSON
        session = await response.json();
      } catch (jsonError) {
        const responseClone = response.clone();
        const errorText = await responseClone.text();
        console.error('Błąd parsowania JSON:', jsonError);
        console.error('Treść odpowiedzi (HTML):', errorText);
        alert('Błąd podczas przetwarzania danych płatności. Skontaktuj się z obsługą.');
        return;
      }

      // Sprawdzenie, czy sesja zawiera błąd
      if (session.error) {
        console.error(session.error);
        alert('Błąd podczas tworzenia sesji płatności: ' + session.error.message);
        return;
      }

      // Pobranie Stripe i przekierowanie do płatności
      const stripe = await stripePromise;
      if (!stripe) {
        alert('Stripe nie został poprawnie załadowany.');
        return;
      }
      const { error } = await stripe?.redirectToCheckout({ sessionId: session.id });

      if (error) {
        console.error(error.message);
        alert('Wystąpił błąd podczas przekierowania do płatności.');
      }
    } catch (error) {
      console.error('Błąd podczas obsługi płatności:', error);
      alert('Wystąpił błąd podczas obsługi płatności. Spróbuj ponownie później.');
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

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { getCartData } from "./cart";
import { getSession, commitSession } from "../utils/session.server";
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);

  const { matchedItems, totalPrice } = await getCartData(session);

  return json({ cart: matchedItems, totalPrice });
};


// Załaduj publiczny klucz Stripe (zamień na swój klucz testowy/produkcyjny)
const stripePromise = loadStripe('pk_test_51QWDzLC66ozEbyTE3bWJdZCIgsFId1VpLZ35NaR67Xbn16UbxLJ9iEvYTinebp7KmbYncMmdlWRtchkGBjzuVH4o00NbPwKvop');

export default function Checkout() {

  let { cart } = useLoaderData();

  const handleCheckout = async () => {
    try {
      const items = Object.values(cart).map(item => ({
        id: `${item.name} - ${item.sizeName}`, // Możesz użyć kombinacji nazwy i rozmiaru jako unikalnego id
        quantity: parseInt(item.stock, 10), // Liczba sztuk na podstawie pola `stock`
        price: parseInt(item.sizePrice)*100,
      }));
  
      const response = await fetch('https://www.artystazdrowia.com/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
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
      const { error } = await stripe!.redirectToCheckout({ sessionId: session.id });

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
      <div className="py-4 font-light flex flex-row space-x-4 sm:space-x-12 md:space-x-20 lg:space-x-32 justify-center">
        <div className="rounded-md p-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl tracking-widest text-center px-2 pt-4 pb-4">
            Podsumowanie zamówienia
          </h1>
          <div className="space-y-3 my-4">
            {Object.values(cart).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between shadow-md rounded-lg ring-1 ring-black"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-sm md:text-base w-28 sm:w-40 md:w-60 lg:w-80 lg:text-lg p-2 md:px-4 font-normal tracking-widest">
                    {item.name}
                  </span>
                </div>
                <div className="text-right mx-2">
                  <p className="text-lg lg:text-xl font-semibold">
                    {item.sizePrice} zł
                  </p>
                  <p className="text-sm lg:text-md">Ilość: {item.stock}</p>
                  <p className="text-sm lg:text-md">Rozmiar: {item.sizeName}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              className="group transition duration-300 ease-in-out px-2 py-2 mb-2 text-l ring-1 ring-black hover:bg-black hover:text-white text-black bg-white rounded-sm shadow-md"
              onClick={handleCheckout}
            >
              Zapłać
            </button>
          </div>
        </div>
      </div>
    </Elements>
  );
}
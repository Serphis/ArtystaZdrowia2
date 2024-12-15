import { json, redirect } from '@remix-run/node'; // Importujemy potrzebne funkcje z Remix
import Stripe from 'stripe';

// Inicjalizuj Stripe z Twoim kluczem sekretnym
const stripe = new Stripe(`${process.env.SEKRETNY_KLUCZ_STRIPE}`, {
  apiVersion: '2024-11-20.acacia',
});

// Funkcja `action` obsługująca zapytanie POST
export const action = async ({ request }: { request: Request }) => {
  if (request.method === 'POST') {
    try {
      const { items } = await request.json(); // Odbieramy dane z ciała zapytania (items)
  
      // Tworzymy linie zamówienia
      const lineItems = items.map((item: { id: string; quantity: number }) => ({
        price_data: {
          currency: 'pln',
          product_data: {
            name: item.id, // Nazwa produktu np. "Świeczka zapachowa"
          },
          unit_amount: 4999, // Cena w groszach (np. 49.99 zł)
        },
        quantity: item.quantity,
      }));

      // Tworzymy sesję Stripe Checkout
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'blik'], // Obsługiwane metody płatności
        line_items: lineItems,
        mode: 'payment',
        success_url: `${new URL('https://www.artystazdrowia.com//success', request.url)}`, // URL po udanej płatności
        cancel_url: `${new URL('https://www.artystazdrowia.com//cancel', request.url)}`, // URL po anulowaniu płatności
      });

      // Zwracamy ID sesji Stripe
      return json({ id: session.id });
    } catch (err: any) {
      console.error(err);
      return json({ error: err.message }, { status: 500 });
    }
  }
  // Jeśli metoda nie jest POST, zwróć 405
  return new Response('Method Not Allowed', { status: 405 });
};

// // Opcjonalnie, jeśli chcesz obsługiwać stronę sukcesu lub anulowania, możesz dodać loadera
// export const loader = async () => {
//   return redirect('/'); // Przekierowanie na stronę główną lub inną stronę
// };

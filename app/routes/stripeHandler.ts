import { json, Request, Response } from '@remix-run/node';
import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.SEKRETNY_KLUCZ_STRIPE}`, {
  apiVersion: '2024-11-20.acacia',
});

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

// export const action = async ({ request }: { request: Request }) => {
//   if (request.method === 'POST') {
//     try {
//       const formData = new URLSearchParams(await request.text());
//       const lineItems = JSON.parse(formData.get('line_items') || '[]');
  
//       // Tworzymy sesję Stripe Checkout
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],  // Możliwe metody płatności (np. karta)
//         line_items: lineItems,  // Przedmioty płatności
//         mode: 'payment',  // Tryb płatności
//         success_url: 'https://www.artystazdrowia.com/success',  // URL po sukcesie
//         return_url: 'https://www.artystazdrowia.com/return',    // URL po anulowaniu
//       });
  
//       // Zwracamy ID sesji Stripe, aby przekierować do checkout
//       return json({ id: session.id });
//     } catch (error) {
//       console.error('Błąd podczas tworzenia sesji Stripe:', error);
//       return json({ error: 'Wystąpił błąd podczas tworzenia sesji płatności.' }, { status: 500 });
//     }
//   }
// }  
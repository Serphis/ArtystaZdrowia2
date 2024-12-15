import { json } from '@remix-run/node';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Inicjalizuj Stripe za pomocą klucza sekretniego
const stripe = new Stripe('sk_test_51QWDzLC66ozEbyTEdjGMl9IgVn06On2iYuITAVvHRtczpfV3324WUtTPOrIFI90VH4HAFucuGYyT4FT6P7FoXnGh00tw3AzlBE', {
  apiVersion: "2024-11-20.acacia",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      try {
        const { items } = req.body;
  
        // Tworzymy linie zamówienia
        const lineItems = items.map((item: { id: string; quantity: number }) => ({
          price_data: {
            currency: 'pln',
            product_data: {
              name: item.id, // np. "Świeczka zapachowa"
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
        success_url: `${req.headers.origin}/success`, // URL po udanej płatności
        cancel_url: `${req.headers.origin}/cancel`,  // URL po anulowaniu płatności
    });

    res.status(200).json({ id: session.id });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Metoda niedozwolona');
  }
}
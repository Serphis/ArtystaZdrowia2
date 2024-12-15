import { json } from '@remix-run/node';
import Stripe from 'stripe';

// Inicjalizuj Stripe za pomocą klucza sekretniego
const stripe = new Stripe('sk_test_51QWDzLC66ozEbyTEdjGMl9IgVn06On2iYuITAVvHRtczpfV3324WUtTPOrIFI90VH4HAFucuGYyT4FT6P7FoXnGh00tw3AzlBE', {
  apiVersion: "2024-11-20.acacia",
});

export let action = async ({ request }) => {
  try {
    const formData = new URLSearchParams(await request.text());

    // Twoja logika tworzenia sesji checkout
    const items = JSON.parse(formData.get('items') || '[]');

    const lineItems = items.map((item: { id: string; quantity: number }) => ({
      price_data: {
        currency: 'pln',
        product_data: {
          name: item.id,
        },
        unit_amount: 4999, // Cena w groszach
      },
      quantity: item.quantity,
    }));

    // Tworzymy sesję Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik'], // Obsługiwane metody płatności
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success`, // URL po udanej płatności
      cancel_url: `${request.headers.get('origin')}/cancel`,  // URL po anulowaniu płatności
    });

    return json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    return json({ error: err.message }, { status: 500 });
  }
};

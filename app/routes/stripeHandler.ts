import { json, Request, Response } from '@remix-run/node';
import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.SEKRETNY_KLUCZ_STRIPE}`, {
  apiVersion: '2024-11-20.acacia',
});

export const action = async ({ request }: { request: Request }) => {
  if (request.method === 'POST') {
    try {
      const formData = new URLSearchParams(await request.text());
      const lineItems = JSON.parse(formData.get('line_items') || '[]');
      const mode = formData.get('mode') || 'payment';
      const successUrl = formData.get('success_url') || 'https://www.artystazdrowia.com/success';
      const returnUrl = formData.get('return_url') || 'https://www.artystazdrowia.com/return';
  
      // Tworzymy sesję Stripe Checkout
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],  // Możliwe metody płatności (np. karta)
        lineItems,  // Przedmioty płatności
        mode,  // Tryb płatności
        success_url: successUrl,  // URL po sukcesie
        return_url: returnUrl,    // URL po anulowaniu
      });
  
      // Zwracamy ID sesji Stripe, aby przekierować do checkout
      return json({ id: session.id });
    } catch (error) {
      console.error('Błąd podczas tworzenia sesji Stripe:', error);
      return json({ error: 'Wystąpił błąd podczas tworzenia sesji płatności.' }, { status: 500 });
    }
  }
}  
import { json, Request, Response } from '@remix-run/node';
import Stripe from 'stripe';
import { db } from '../services/index';

const stripe = new Stripe(`${process.env.SEKRETNY_KLUCZ_STRIPE}`, {
  apiVersion: '2024-11-20.acacia',
});

export const action = async ({ req }: { req: Request }) => {
  if (req.method === 'POST') {
    try {
      const { items } = await req.json();

      alert(items)

      const lineItems = items.map((item: { id: string; quantity: number; price: number }) => ({
        price_data: {
          currency: 'pln',
          product_data: {
            name: item.id,
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      }));

      alert(lineItems)

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'blik'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${new URL('https://www.artystazdrowia.com/success', req.url)}`,
        cancel_url: `${new URL('https://www.artystazdrowia.com/cancel', req.url)}`,
      });

      return json({ id: session.id });
    } catch (error: any) {
      console.error('Error creating Stripe session:', error);
      return json({ message: 'Stripe session creation failed', error: error.message }, { status: 500 });
    }
  }
};
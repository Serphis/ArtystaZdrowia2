import { json, Request, Response } from '@remix-run/node';
import { response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.SEKRETNY_KLUCZ_STRIPE}`, {
  apiVersion: '2024-11-20.acacia',
});

export const action = async ({ request }: { request: Request }) => {
  if (request.method === 'POST') {
    try {
      const { items } = await request.json();

      const shippingCost = 1800;
  
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

      lineItems.push({
        price_data: {
          currency: 'pln',
          product_data: {
            name: 'Koszt przesyłki',
          },
          unit_amount: shippingCost,
        },
        quantity: 1,
      });      

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'blik', 'przelewy24'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${new URL('https://www.artystazdrowia.com//success', request.url)}`,
        cancel_url: `${new URL('https://www.artystazdrowia.com//cancel', request.url)}`,
      });

      return json({ id: session.id });
    } catch (err: any) {
      console.error(err);
      return json({ error: err.message }, { status: 500 });
    }
  }
  return null;
};
import { json, redirect } from '@remix-run/node';
import Stripe from 'stripe';
import { db } from '../services/index';

const stripe = new Stripe(`${process.env.SEKRETNY_KLUCZ_STRIPE}`, {
  apiVersion: '2024-11-20.acacia',
});

export const action = async ({ request }: { request: Request }) => {
  if (request.method === 'POST') {
    try {
      const { items, orderData, parcelLocker } = await request.json();
  
      console.log("AAAAAAAAAAAAAa", orderData)
      
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

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'blik'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${new URL('https://www.artystazdrowia.com//success', request.url)}`,
        cancel_url: `${new URL('https://www.artystazdrowia.com//cancel', request.url)}`,
      });

      const order = await db.order.create({
        data: {
          email: '',
          receiverName,
          receiverPhone,
          deliveryMethod,
          paymentMethod,
          totalPrice,
          address,
          zipCode,
          parcelLocker,
          products: {
            create: items.map(item => ({
              productId: item.id,
              sizeId: item.sizeId,
              sizePrice: item.price,
              sizeStock: item.stock,
              quantity: item.quantity,
            })),
          },
        },
      });

      return json({ id: session.id });
    } catch (err: any) {
      console.error(err);
      return json({ error: err.message }, { status: 500 });
    }
  }
  return new Response('Method Not Allowed', { status: 405 });
};

// // Opcjonalnie, jeśli chcesz obsługiwać stronę sukcesu lub anulowania, możesz dodać loadera
// export const loader = async () => {
//   return redirect('/'); // Przekierowanie na stronę główną lub inną stronę
// };

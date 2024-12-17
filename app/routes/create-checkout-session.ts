import { json, Request, Response } from '@remix-run/node';
import Stripe from 'stripe';
import { db } from '../services/index';

const stripe = new Stripe(`${process.env.SEKRETNY_KLUCZ_STRIPE}`, {
  apiVersion: '2024-11-20.acacia',
});

export const action = async ({ req }) => {
  if (req.method === 'POST') {
    try {
      const { 
        customerData,
        deliveryMethod,
        paymentMethod,
        totalPrice,
        address,
        parcelLocker,
        cart,
        stripeCheckout,
      } = await req.json();
      
      if (stripeCheckout) {

        const items = Object.values(cart).map((item: any) => ({
          id: `${item.name} - ${item.sizeName}`,
          quantity: parseInt(item.stock, 10),
          price: parseInt(item.sizePrice) * 100,
          sizeName: item.sizeName,
          sizeId: item.sizeId,
        }));

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
          success_url: `${new URL('https://www.artystazdrowia.com/success', req.url)}`,
          cancel_url: `${new URL('https://www.artystazdrowia.com/cancel', req.url)}`,
        });

        const order = await db.order.create({
          data: {
            email: customerData.email,
            receiverName: customerData.name,
            receiverPhone: customerData.phone,
            deliveryMethod,
            paymentMethod,
            totalPrice,
            address,
            parcelLocker,
            products: {
              create: items.map(item => ({
                product: { connect: { id: item.id } },
                size: { connect: { id: item.sizeId } },
                sizeName: item.sizeName,
                sizePrice: item.price,
                quantity: item.quantity,
              })),
            },
          },
        });


        return json({ sessionId: session.id, order });
      }
    } catch (error: any) {
      console.error('Error processing checkout:', error);
      return json({ message: 'Checkout failed', error: error.message }, { status: 500 });
    }
  }
}

// // Opcjonalnie, jeśli chcesz obsługiwać stronę sukcesu lub anulowania, możesz dodać loadera
// export const loader = async () => {
//   return redirect('/'); // Przekierowanie na stronę główną lub inną stronę
// };

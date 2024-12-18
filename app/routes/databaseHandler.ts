import { json } from '@remix-run/node';
import { db } from '../services/index';

export const action = async ({ req }: { req: Request }) => {
  if (req.method === 'POST') {
    const formData = new URLSearchParams(await req.text());

    const cart = JSON.parse(formData.get('cart')); // Pobranie danych koszyka z formularza
    const totalPrice = formData.get('totalPrice');
    const deliveryMethod = formData.get('deliveryMethod');
    const paymentMethod = formData.get('paymentMethod');
    const address = JSON.parse(formData.get('address'));
    const customerData = JSON.parse(formData.get('customerData'));
    const parcelLocker = formData.get('parcelLocker');
    const selectedPoint = JSON.parse(formData.get('selectedPoint'));
    const zipCode = address.zip || '';

    try {
        // Tworzymy obiekt zamówienia
        const order = await db.order.create({
            data: {
                email: customerData.email,
                receiverName: customerData.name,
                receiverPhone: customerData.phone,
                deliveryMethod,
                paymentMethod,
                totalPrice: parseFloat(totalPrice),
                address,  // Adres w formacie JSON
                parcelLocker,
                zipCode,
                shippingStatus: 'Nie wysłano',
                status: 'Oczekujące',
                products: {
                create: Object.values(cart).map(item => ({
                    productId: item.productId,
                    sizeId: item.sizeId,
                    sizeName: item.sizeName,
                    sizePrice: item.sizePrice,
                    quantity: parseInt(item.stock, 10),
                })),
                },
            },
        });

        return new Response(JSON.stringify({ status: 'success', orderId: newOrder.id }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ status: 'error', message: error.message }), { status: 500 });
    }
  }
};
    
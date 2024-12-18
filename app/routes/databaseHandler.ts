import { json } from '@remix-run/node';
import { prisma } from '../utils/prisma.server';
import Stripe from 'stripe';

// Inicjalizacja Stripe z kluczem prywatnym
const stripe = new Stripe('YOUR_STRIPE_SECRET_KEY', { apiVersion: '2022-11-15' });

export const action = async ({ request }: { request: Request }) => {
    const formData = await request.json();
    const { sessionId } = formData;

    if (!sessionId) {
        return new Response(
            JSON.stringify({ status: 'error', message: 'Brak sessionId w zapytaniu.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        // Pobranie danych sesji płatności z Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Sprawdzenie statusu płatności
        if (session.payment_status !== 'paid') {
            return new Response(
                JSON.stringify({ status: 'error', message: 'Płatność nie została dokonana.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Jeśli płatność została dokonana, tworzymy zamówienie w bazie
        const { cart, totalPrice, deliveryMethod, paymentMethod, address, customerData, parcelLocker, selectedPoint } = formData;

        const newOrder = await prisma.order.create({
            data: {
                email: customerData.email,
                receiverName: customerData.name,
                receiverPhone: customerData.phone,
                deliveryMethod: deliveryMethod,
                paymentMethod: paymentMethod,
                totalPrice: totalPrice,
                address: address,
                parcelLocker: parcelLocker,
                zipCode: address.zip,
                shippingStatus: 'Nie wysłano',
                status: 'Oczekujące',
                products: {
                    create: Object.values(cart).map((item: any) => ({
                        productId: item.productId,
                        sizeId: item.sizeId,
                        sizeName: item.sizeName,
                        sizePrice: item.sizePrice,
                        quantity: parseInt(item.stock),
                    })),
                },
            },
        });

        // Zwracamy odpowiedź z ID zamówienia
        return new Response(
            JSON.stringify({ status: 'success', orderId: newOrder.id }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Błąd podczas zapisywania zamówienia:', error);
        return new Response(
            JSON.stringify({ status: 'error', message: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

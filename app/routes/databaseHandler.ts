import { json } from '@remix-run/node';
import { prisma } from '../utils/prisma.server';
import { getSession, commitSession } from "../utils/session.server";

export const action = async ({ request }: { request: Request }) => {
    const formData = await request.json();
    const { orderData, cart, totalPrice, deliveryMethod, paymentMethod, address, customerData, parcelLocker, selectedPoint } = formData;
    const session = await getSession(request);

    session.set('orderData', orderData);

    const headers = new Headers();
    headers.append("Set-Cookie", await commitSession(session));  

    try {
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

        return new Response(
            JSON.stringify({ status: 'success', orderId: newOrder.id }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ status: 'error', message: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      };
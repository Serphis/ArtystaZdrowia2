import { json } from '@remix-run/node';
import { db } from '../services/index';

export const action = async ({ req }: { req: Request }) => {
  if (req.method === 'POST') {
    try {
        const { orderData } = await req.json();
        
        const order = await db.order.create({
            data: {
              email: orderData.customer.email,
              receiverName: orderData.customer.name,
              receiverPhone: orderData.customer.phone,
              deliveryMethod: orderData.delivery.method,
              paymentMethod: orderData.payment.method,
              totalPrice: orderData.payment.totalPrice,
              address: orderData.delivery.address,
              parcelLocker: orderData.delivery.parcelLocker,
              products: {
                create: orderData.items.map((item) => ({
                  product: { connect: { id: item.id } },
                  size: { connect: { id: item.sizeId } },
                  sizeName: item.sizeName,
                  sizePrice: item.price,
                  quantity: item.quantity,
                })),
              },
            },
          });
    
          return json({ orderId: order.id });
        } catch (error: any) {
          console.error('Error creating order:', error);
          return json({ message: 'Order creation failed', error: error.message }, { status: 500 });
        }
      }
    };
    
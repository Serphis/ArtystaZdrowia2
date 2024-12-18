// app/routes/admin/order/$orderId.tsx

import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '../services/index'; // Upewnij się, że masz dostęp do swojego db

export const loader: LoaderFunction = async ({ params }) => {
  const orderId = params.orderId;

  if (!orderId) {
    throw new Response('Zamówienie nie znalezione', { status: 404 });
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      products: {
        include: {
          product: true,
          size: true,
        },
      },
    },
  });

  if (!order) {
    throw new Response('Zamówienie nie znalezione', { status: 404 });
  }

  return json({ order });
};

export default function OrderDetails() {
  const { order } = useLoaderData();

  if (!order) {
    return <div>Nie znaleziono zamówienia</div>;
  }

  return (
    <main className="font-serif">
      <div className="p-8 w-full rounded-md bg-white">
        <h1 className="text-3xl flex justify-center font-light tracking-widest">
          Szczegóły Zamówienia {order.id}
        </h1>
        <div className="py-8">
          <div className="space-y-4">
            <div>
              <strong>Odbiorca:</strong> {order.receiverName}
            </div>
            <div>
              <strong>Adres dostawy:</strong> {order.address?.street}, {order.address?.zip} {order.address?.city}
            </div>
            <div>
              <strong>Metoda dostawy:</strong> {order.deliveryMethod}
            </div>
            <div>
              <strong>Metoda płatności:</strong> {order.paymentMethod}
            </div>
            <div>
              <strong>Status zamówienia:</strong> {order.status}
            </div>
            <div>
              <strong>Łączna cena:</strong> {order.totalPrice/100} PLN
            </div>

            <h2 className="text-xl mt-4">Produkty w zamówieniu:</h2>
            <ul>
              {order.products.map((item) => (
                <li key={item.id}>
                  <div className="flex justify-between">
                    <div>{item.product.name} (Rozmiar: {item.sizeName})</div>
                    <div>
                      {item.quantity} x {item.sizePrice} PLN
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

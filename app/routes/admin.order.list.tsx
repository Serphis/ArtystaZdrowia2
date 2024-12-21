// app/routes/order/list.tsx

import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '../services/index'; // Upewnij się, że masz dostęp do swojego db
import { Link } from 'react-router-dom';
import { requireAdmin } from '../utils/auth.server'; 

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdmin(request);

  const orders = await db.order.findMany({
    include: {
      products: {
        include: {
          product: true,
          size: true,
        },
      },
    },
  });

  return json({ orders });
};

export default function OrderList() {
  const { orders = [] } = useLoaderData();

  const validOrders = orders.filter((order) => order.id && order.receiverName);

  return (
    <main className="font-serif">
      <form method="post">
        <div className="p-8 w-full rounded-md bg-white">
          <h1 className="text-3xl flex justify-center font-light tracking-widest">
            Lista Zamówień
          </h1>
          <div className="py-8">
            {validOrders.length > 0 ? (
              <div className="flex flex-row flex-wrap justify-center gap-5">
                {validOrders.map((order) => (
                  <div key={order.id}>
                    <div className="flex flex-col w-60 md:w-80 ring-1 ring-black rounded-lg">
                      <Link
                        to={`/admin/order/${order.id}`}
                        className="transition duration-500 ease-in-out hover:bg-slate-100 hover:text-slate-800 font-medium p-1 pb-2 rounded-2xl"
                      >
                        <div className="text-center text-md py-2 px-2">
                          Zamówienie nr: {order.id}
                        </div>
                        <div className="text-center text-sm py-1 px-2">
                          Odbiorca: {order.receiverName}
                        </div>
                        <div className="text-center text-sm py-1 px-2">
                          Metoda dostawy: {order.deliveryMethod}
                        </div>
                        <div className="text-center text-sm py-1 px-2">
                          Łączna cena: {order.totalPrice/100} PLN
                        </div>
                        <div className="text-center text-sm py-1 px-2">
                          Status zamówienia: {order.status}
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>Brak zamówień</div>
            )}
          </div>
        </div>
      </form>
    </main>
  );
}

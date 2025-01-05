import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '../services/index';
import { Link, useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedStatus = searchParams.get('status') || '';

  const validOrders = orders.filter((order) => order.id && order.receiverName);
  
  const filteredOrders = selectedStatus
  ? validOrders.filter((order) => order.status === selectedStatus)
  : validOrders;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setSearchParams(status ? { status } : {});
  };

  return (
    <main className="font-serif">
      <form method="post">
        <div className="p-8 w-full rounded-md bg-white">
          <h1 className="text-3xl flex justify-center font-light tracking-widest">
            Lista Zamówień
          </h1>

          <div className="my-3 flex justify-end">
            <label htmlFor="statusFilter" className="mr-2 pt-1 text-sm">
              Filtruj wg statusu:
            </label>
            <select
              id="statusFilter"
              value={selectedStatus}
              onChange={handleStatusChange}
              className="border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="">Wszystkie</option>
              <option value="Zakończone">Zakończone</option>
              <option value="Oczekujące">Oczekujące</option>
              <option value="W trakcie realizacji">W trakcie realizacji</option>
              <option value="Anulowane">Anulowane</option>
            </select>
          </div>

          <div className="">
            {filteredOrders.length > 0 ? (
              <table className="table-fixed w-full border-collapse border border-black rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-1/5 border border-black text-center py-1 break-words">Nr Zamówienia</th>
                    <th className="w-1/5 border border-black text-center py-1 break-words">Odbiorca</th>
                    <th className="w-1/5 border border-black text-center py-1 break-words">Metoda Dostawy</th>
                    <th className="w-1/5 border border-black text-center py-1 break-words">Łączna Cena</th>
                    <th className="w-1/5 border border-black text-center py-1 break-words">Status</th>
                    <th className="w-1/5 border border-black text-center py-1 break-words"> </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-100 hover:text-slate-800 transition duration-500 ease-in-out"
                    >
                      <td className="border border-black text-center py-1 break-words">
                          {order.id}
                      </td>
                      <td className="border border-black text-center py-1 break-words">
                        {order.receiverName}
                      </td>
                      <td className="border border-black text-center py-1 break-words">
                        {order.deliveryMethod}
                      </td>
                      <td className="border border-black text-center py-1 break-words">
                        {order.totalPrice / 100} PLN
                      </td>
                      <td className="border border-black text-center py-1 break-words">
                        {order.status}
                      </td>
                      <td className="border border-black text-center break-words font-bold">
                        <Link to={`/admin/order/${order.id}`} className="block w-full h-full py-4 bg-slate-50">
                          Szczegóły
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>Brak zamówień</div>
            )}
          </div>
        </div>
      </form>
    </main>
  );
}

// app/routes/admin/order/$orderId.tsx

import { ActionFunction, LoaderFunction, json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { db } from '../services/index'; // Upewnij się, że masz dostęp do swojego db
import { requireAdmin } from '../utils/auth.server'; 

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAdmin(request);

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

export const action: ActionFunction = async ({ request, params }) => {
  const orderId = params.orderId;

  if (!orderId) {
    throw new Response('Zamówienie nie znalezione', { status: 404 });
  }

  const formData = await request.formData();
  const newStatus = formData.get('status');

  if (!newStatus || typeof newStatus !== 'string') {
    throw new Response('Nieprawidłowy status', { status: 400 });
  }

  await db.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  return json({ success: true });
};

export default function OrderDetails() {
  const { order } = useLoaderData();

  if (!order) {
    return <div>Nie znaleziono zamówienia</div>;
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString();

  return (
    <main className="font-serif">
      <div className="p-8 w-full rounded-md bg-white px-2 sm:px-20 md:px-40 lg:px-60 xl:px-80">
        <h1 className="text-3xl flex justify-center font-light tracking-widest">
          Szczegóły Zamówienia {order.id}
        </h1>
        <div className="py-8">
          <div className="space-y-4">
            <div>
              <strong>Data utworzenia zamówienia:</strong> {formattedDate}
            </div>
            <div>
              <strong>Odbiorca:</strong> {order.receiverName}
            </div>
            <div>
              <strong>Email odbiorcy:</strong> {order.email}
            </div>
            <div>
              <strong>Nr telefonu:</strong> {order.receiverPhone}
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
            <div className='flex flex-row justify-between'>
              <div>
                <strong>Status zamówienia:</strong>
                <p>{order.status}</p>
              </div>
              <div>
                <Form method="post" className="space-y-2">
                  <select name="status" defaultValue={order.status} className="border rounded-md p-2">
                    <option value="Oczekujące">Oczekujące</option>
                    <option value="W trakcie realizacji">W trakcie realizacji</option>
                    <option value="Zakończone">Zakończone</option>
                    <option value="Anulowane">Anulowane</option>
                  </select>
                  <button
                    type="submit"
                    className="ml-4 bg-slate-200 text-black px-4 py-2 rounded hover:text-white hover:bg-slate-800"
                  >
                    Zatwierdź
                  </button>
                </Form>
              </div>
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

import { Form, useLoaderData } from "@remix-run/react";
import { LoaderFunction, ActionFunction, json, redirect } from '@remix-run/node';
import { db } from '../services/index';
import { requireAdmin } from '../utils/auth.server'; 

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdmin(request);

  const products = await db.product.findMany({
    include: { sizes: true },
  });

  return json({ products });
};

export const action: ActionFunction = async ({ request }) => {
  await requireAdmin(request);

  const formData = await request.formData();
  const sizeId = formData.get('sizeId');
  const newStock = formData.get('stock');
  const productId = formData.get('productId');
  const newDescription = formData.get('description');
  const newName = formData.get('productName');
  const newSizeName = formData.get('sizeName');
  const newPrice = formData.get('price');

  if (productId && typeof newName === 'string') {
    await db.product.update({
      where: { id: productId as string },
      data: { name: newName },
    });
  }

  if (productId && typeof newDescription === 'string') {
    await db.product.update({
      where: { id: productId as string },
      data: { description: newDescription },
    });
  }

  if (sizeId && newStock !== null) {
    const parsedStock = parseInt(newStock as string, 10);

    if (isNaN(parsedStock)) {
      return json({ error: 'Nieprawidłowe dane wejściowe' }, { status: 400 });
    }

    await db.size.update({
      where: { id: sizeId as string },
      data: { stock: parsedStock },
    });
  }

  if (sizeId && typeof newSizeName === 'string') {
    await db.size.update({
      where: { id: sizeId as string },
      data: { name: newSizeName },
    });
  }

  if (sizeId && newPrice !== null) {
    const parsedPrice = parseFloat(newPrice as string);

    if (isNaN(parsedPrice)) {
      return json({ error: 'Nieprawidłowe dane wejściowe' }, { status: 400 });
    }

    await db.size.update({
      where: { id: sizeId as string },
      data: { price: parsedPrice },
    });
  }

  return redirect('/admin/product/stock');
};

export default function AdminProductList() {
  const { products } = useLoaderData();

  return (
    <main className="p-8 font-serif">
      <h1 className="text-3xl font-light tracking-widest text-center">
        Panel Administratora - Produkty
      </h1>
      <div className="py-8">
        <div className="flex flex-col gap-8 rounded-md bg-gray-50">
          {products.map((product: any) => (
            <div key={product.id} className="flex flex-row border p-4">
              <div className="flex flex-col">
                <Form method="post" className="flex flex-col gap-2">
                  <input type="hidden" name="productId" value={product.id} />
                  <input
                    type="text"
                    name="productName"
                    defaultValue={product.name}
                    className="border rounded px-2 py-1 w-full"
                  />
                  <textarea
                    name="description"
                    defaultValue={product.description || ''}
                    className="border rounded px-2 py-1 w-full h-20"
                  ></textarea>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-slate-200 text-black hover:bg-slate-800 hover:text-white"
                  >
                    Zapisz zmiany
                  </button>
                </Form>
                <div className="items-center">
                  <div className="mx-3 pt-3 pb-2">
                    <img
                      src={product.image}
                      alt="Opis zdjęcia"
                      className="w-32 h-32 object-cover rounded-lg ring-1 ring-black"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                {product.sizes.map((size: any) => (
                  <div key={size.id} className="flex flex-col gap-2 py-2">
                    <Form method="post" className="flex items-center gap-2">
                      <input type="hidden" name="sizeId" value={size.id} />
                      <input
                        type="text"
                        name="sizeName"
                        defaultValue={size.name}
                        className="border rounded px-2 py-1 w-20"
                      />
                      <input
                        type="number"
                        name="stock"
                        min="0"
                        defaultValue={size.stock}
                        className="border rounded px-2 py-1 w-12"
                      />
                      <input
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        defaultValue={size.price}
                        className="border rounded px-2 py-1 w-16"
                      />
                      <button
                        type="submit"
                        className="px-4 py-1 bg-slate-200 text-black hover:bg-slate-800 hover:text-white"
                      >
                        Zapisz
                      </button>
                    </Form>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

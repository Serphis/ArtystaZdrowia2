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
  const newStock = parseInt(formData.get('stock') as string, 10);

  if (!sizeId || isNaN(newStock)) {
    return json({ error: 'Nieprawidłowe dane wejściowe' }, { status: 400 });
  }

  await db.size.update({
    where: { id: sizeId as string },
    data: { stock: newStock },
  });

  return redirect('/adminPanel');
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
                    <h2 className="text-xl font-medium">{product.name}</h2>
                    <div className="items-center">
                        <div className="mx-3 pt-3 pb-2">
                            <img src={product.image} alt="Opis zdjęcia" className='w-32 h-32 object-cover rounded-lg ring-1 ring-black' />
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                  {product.sizes.map((size: any) => (
                    <div key={size.id} className="flex items-center gap-4 py-2">
                      <span className="w-20">{size.name}</span>
                      <span
                        className={`w-20 ${size.stock === 0 || size.stock === undefined ? 'text-red-500 font-bold' : 'text-gray-600'}`}
                        >
                        {size.stock === 0 || size.stock === undefined ? '0' : `Obecny stan: ${size.stock}`}
                      </span>
                      <Form method="post" className="flex items-center gap-2">
                        <input type="hidden" name="sizeId" value={size.id} />
                        <input
                          type="number"
                          name="stock"
                          min="0"
                          defaultValue={size.stock}
                          className="border rounded px-2 py-1 w-12"
                        />
                        <button
                          type="submit"
                          className="px-4 py-1 bg-slate-500 text-white hover:bg-slate-600"
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
  
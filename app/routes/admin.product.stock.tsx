import { Form, useLoaderData } from "@remix-run/react";
import { LoaderFunction, ActionFunction, json, redirect } from '@remix-run/node';
import { db } from '../services/index';
import { requireAdmin } from '../utils/auth.server'; 
import { useEffect, useState } from "react";
import { v2 as cloudinary } from 'cloudinary';

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
  const deleteImage = formData.get("deleteImage");

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
  
  if (productId && deleteImage) {
    await db.product.update({
      where: { id: productId as string },
      data: { image: null },
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLinks, setImageLinks] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // cloudinary.config({
  //   cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  //   api_key: `${process.env.CLOUDINARY_API_KEY}`,
  //   api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
  //   secure: true
  // });
  
  // cloudinary.search
  //   .expression('folder:public/swiecesojowe/*')
  //   .sort_by('public_id', 'desc')
  //   .max_results(20)
  //   .execute()
  //   .then(result => {
  //       const imageLinks = result.resources.map(resource => resource.secure_url);
  //       // console.log(imageLinks);
  //     })
  //   .catch( error => {
  //     console.error('Błąd podczas pobierania obrazów:', error)
  //   });

  // useEffect(() => {
  //   cloudinary.config({
  //     cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  //     api_key: `${process.env.CLOUDINARY_API_KEY}`,
  //     api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
  //     secure: true,
  //   });
  // }, []);
  
  // const fetchCloudinaryImages = async () => {
  //   try {
  //     const result = await cloudinary.search
  //       .expression("folder:public/swiecesojowe/*")
  //       .sort_by("public_id", "desc")
  //       .max_results(20)
  //       .execute();

  //     const links = result.resources.map((resource: any) => resource.secure_url);
  //     setImageLinks(links);
  //   } catch (error) {
  //     console.error("Błąd podczas pobierania obrazów:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (isModalOpen) {
  //     fetchCloudinaryImages();
  //   }
  // }, [isModalOpen]);

  const openModal = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  // const handleImageSelect = async (imageUrl: string) => {
  //   if (selectedProductId) {
  //     await fetch("/admin/product/stock", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         productId: selectedProductId,
  //         imageUrl,
  //       }),
  //       headers: { "Content-Type": "application/json" },
  //     });
  //   }
  //   closeModal();
  // };

  return (
    <main className="py-8 font-serif">
      <h1 className="text-3xl font-light tracking-widest text-center">
        Panel Administratora - Produkty
      </h1>
      <div className="py-8">
        <div className="flex flex-row justify-center items-center w-fit flex-wrap gap-8 rounded-md bg-gray-50">
          {products.map((product: any) => (
            <div key={product.id} className="flex flex-col border">
              <Form method="post" className="flex flex-col px-3 items-center justify-center bg-slate-100 p-3 border-b-2">
                <div className="mx-3 pb-2 flex flex-row space-x-4 items-center">
                  {product.image ? (
                  <img
                    src={product.image}
                    alt="Zdjęcie produktu"
                    className="w-32 h-32 object-cover rounded-lg ring-1 ring-black"
                  />
                  ) : (
                    <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                      Brak zdjęcia
                    </div>
                  )}
                  <div className="flex flex-col space-y-4">
                    <button 
                      type="button"
                      className="mt-3 px-2 py-2 bg-slate-200 text-black hover:bg-slate-800 hover:text-white"
                      onClick={() => openModal(product.id)}
                    >
                      Nowe zdjęcie
                    </button>
                    {isModalOpen && (
                      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-3/4">
                          <div className="flex justify-between mb-4">
                            <h2 className="text-lg font-semibold">Wybierz nowe zdjęcie</h2>
                            <button
                              onClick={closeModal}
                              className="px-4 py-2 text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none"
                            >
                              Zamknij
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            {imageLinks.map((link, index) => (
                              <button
                                key={index}
                                onClick={() => handleImageSelect(link)}
                                className="cursor-pointer rounded-md shadow p-0 border-none focus:outline-none"                              
                              >
                                <img 
                                  src={link}
                                  alt={`${index + 1}`}
                                  className="rounded-md shadow"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <label className="inline-flex items-center">
                      <input type="checkbox" name="deleteImage" className="" />
                      Usuń obecne zdjęcie
                    </label>
                  </div>
                </div>

                <div className="flex flex-col text-center">
                  <input type="hidden" name="productId" value={product.id} />
                  <div className="px-1 py-2">Nazwa produktu</div>
                  <input
                    type="text"
                    name="productName"
                    defaultValue={product.name}
                    className="border rounded px-2 py-2 w-80"
                  />
                  <div className="px-1 py-2">Opis</div>
                  <textarea
                    name="description"
                    defaultValue={product.description || ''}
                    className="border rounded px-2 py-2 w-80 h-36"
                  ></textarea>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="mt-3 px-5 py-2 text-lg font-bold bg-slate-200 text-black hover:bg-slate-800 hover:text-white"
                    >
                      Zapisz
                    </button>
                  </div>
                </div>
              </Form>

              <div className="mt-4">
                  {product.sizes.map((size: any) => (
                    <div key={size.id}>
                      <Form method="post" className="flex flex-row justify-center items-center gap-2 py-2">
                        <input type="hidden" name="sizeId" value={size.id} />
                        <div>
                          <div className="text-sm">Rodzaje/rozmiary</div>
                          <input
                            type="text"
                            name="sizeName"
                            defaultValue={size.name}
                            className="border rounded px-2 py-1 w-20"
                          />
                        </div>

                        <div>
                          <div className="text-sm">Ilość</div>
                            <input
                              type="number"
                              name="stock"
                              min="0"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                              defaultValue={size.stock}
                              className="border rounded px-2 py-1 w-12"
                            />
                        </div>
                        
                        <div>
                          <div className="text-sm">Cena</div>
                          <input
                            type="number"
                            name="price"
                            min="0"
                            step="1"
                            defaultValue={size.price}
                            className="border rounded px-2 py-1 w-16"
                          />
                        </div>
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

import { Form, useLoaderData } from "@remix-run/react";
import { LoaderFunction, ActionFunction, json, redirect } from '@remix-run/node';
import { db } from '../services/index';
import { requireAdmin } from '../utils/auth.server'; 
import { useEffect, useState } from "react";

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
  const uploadedImage = formData.get("uploadedImage");


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

  if (productId && uploadedImage) {
    const imageBuffer = uploadedImage as File;
    const formData = new FormData();
    formData.append("file", imageBuffer);
    formData.append("upload_preset", "default_preset");
  
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/djio9fbja/image/upload`, {
      method: "POST",
      body: formData,
    });
  
    if (uploadResponse.ok) {
      const uploadResult = await uploadResponse.json();
      
      const compressedUrl = `${uploadResult.secure_url}?q_auto:good,f_auto`;
  
      await db.product.update({
        where: { id: productId as string },
        data: { image: compressedUrl },
      });
    }
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
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchCloudinaryImages = async () => {
    const response = await fetch('https://api.cloudinary.com/v1_1/djio9fbja/resources/image?prefix=swiecesojowe/&max_results=30');
    const data = await response.json();
    setImages(data.resources);
  };
  
  useEffect(() => {
    fetchCloudinaryImages();
  }, []);
  

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "default_preset");

    const response = await fetch(`https://api.cloudinary.com/v1_1/djio9fbja/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setLoading(false);
    return data.secure_url;
  };


  return (
    <main className="py-8 font-serif">
      <h1 className="text-3xl font-light tracking-widest text-center">
        Panel Administratora - Produkty
      </h1>
      <div className="py-8">
        <div className="flex flex-row justify-center items-center w-fit flex-wrap gap-8 rounded-md bg-gray-50">
          {products.map((product: any) => (
            <div key={product.id} className="flex flex-col border p-4">
              <div className="flex flex-row">
                <div className="items-center">
                  <div className="mx-3 pt-3 pb-2">
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
                  </div>
                </div>
                <Form method="post" className="flex flex-row gap-2">
                  <div className="flex flex-col justify-end w-56">
                    <input type="hidden" name="productId" value={product.id} />
                    <div>Nazwa produktu</div>
                    <input
                      type="text"
                      name="productName"
                      defaultValue={product.name}
                      className="border rounded px-2 py-2 w-full"
                    />
                    <div>Opis</div>
                    <textarea
                      name="description"
                      defaultValue={product.description || ''}
                      className="border rounded px-2 py-2 w-full h-20"
                    ></textarea>
                    <div className="mt-4">
                      <div>Wybierz zdjęcie z galerii:</div>
                      <div className="flex flex-wrap gap-4">
                        {images.map((image: any) => (
                          <div
                            key={image.public_id}
                            className="w-20 h-20"
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedImage(image.secure_url)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                setSelectedImage(image.secure_url);
                              }
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            <img
                              src={image.secure_url}
                              alt={`Miniaturka ${image.public_id}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>Dodaj nowe zdjęcie</div>
                    <input type="file" name="uploadedImage" className="border rounded px-2 py-2 w-full" />
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input type="checkbox" name="deleteImage" className="mr-2" />
                        Usuń obecne zdjęcie
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 mt-2 bg-slate-200 text-black hover:bg-slate-800 hover:text-white"
                      disabled={loading}
                    >
                      {loading ? "Przetwarzanie..." : "Zapisz zmiany"}
                    </button>
                  </div>
                </Form>
              </div>
              <div className="mt-4">
                {product.sizes.map((size: any) => (
                  <div key={size.id} className="flex flex-col items-center gap-2 py-2">
                    <Form method="post" className="flex items-center gap-2 px-2">
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

import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "../services/index";
import { getUserSession } from "../utils/auth.server";
import { ActionFunction, redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import { addToCart, commitSession, getSession } from "../utils/session.server";

export const loader: LoaderFunction = async ({ params }) => {
    const { productId } = params;  // Odczytujemy dynamiczny parametr z URL
    const Product = await db.product.findUnique({
      where: { id: productId },
      include: { sizes: true },  // Pobieramy dane o produkcie oraz dostępne rozmiary
    });
    const sizes = await db.size.findMany({
        where: { productId : productId },
    })

  
    if (!Product) {
      throw new Error('Produkt nie znaleziony');
    }
  
    return { Product, sizes };
  };
  
export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const productId = formData.get("productId")?.toString();
    const sizeId = formData.get("sizeId")?.toString();
    const stock = formData.get("stock")?.toString();
    const price = formData.get("price")?.toString();


    const session = await getSession(request);
    await addToCart(session, productId, stock, sizeId, price);
    const commit = await commitSession(session);

    return redirect("/cart");
};

export default function ProductInfo() {
    const { Product, sizes, productId } = useLoaderData();

    // const Product = products.find((p) => p.id === productId);
    const AvailableSizes = sizes.filter((s) => s.stock > 0);

    const [selectedSize, setSelectedSize] = useState(AvailableSizes[0]?.id || null);
    const [stock, setStock] = useState(AvailableSizes[0]?.stock || 0);

    const selectedSizeData = sizes.find(size => size.id === selectedSize);

    useEffect(() => {
        if (selectedSizeData) {
            setStock(selectedSizeData.stock);
        }
    }, [selectedSizeData]);

    const handleSizeChange = (event) => {
        setSelectedSize(event.target.value);
    };

    return (
        <main className="bg-white p-4 h-full font-light">
            <div key={Product.id} className="w-full rounded-md">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-widest text-center p-2 pt-6">
                    {Product.name}
                </h1>
                <div className="flex flex-col sm:flex-row my-6 space-x-4 sm:space-x-6 md:space-x-12 lg:space-x-16 mx-4 sm:mx-14 md:mx-16 lg:mx-30 xl:mx-40 justify-center mb-4">
                    <div className="flex justify-center">
                      <img src={Product.image} alt={Product.name} className="my-2 object-cover sm:object-cover sm:h-full sm:w-64 md:w-80 rounded-2xl ring-1 ring-black shadow-lg" />
                    </div>
                    <div className="flex flex-col py-8 px-4 rounded-2xl ring-1 ring-black shadow-lg">
                        <div className="py-4">
                            <p className="px-2 lg:px-4 text-justify tracking-widest max-w-96 text-md md:text-lg md:text-2xl">
                                {Product.description}
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <form
                                method="post"
                                action={`/cart`} >
                                <input type="hidden" name="productId" value={Product.id} />
                                
                                {AvailableSizes.length > 0 ? (
                                <div className="">
                                    <div className="flex justify-center md:pt-10">
                                        <select
                                            id="size"
                                            name="size"
                                            onChange={handleSizeChange}
                                            className="ring-1 ring-black bg-white shadow-md rounded p-2 w-40"
                                        >
                                            {AvailableSizes.map((size) => (
                                            <option key={size.id} value={size.id}>
                                                {size.name}: {size.price} zł
                                            </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-center">
                                        <label htmlFor="stock" className="block text-sm font-light bg-white tracking-widest mt-4 mb-1">
                                            Ilość
                                        </label>
                                    </div>
                                    <div className="flex justify-center">
                                        <input
                                            type="number"
                                            id="stock"
                                            name="stock"
                                            value={stock}
                                            min="1"
                                            max={selectedSizeData?.stock || 0}
                                            onChange={(e) => {
                                                const value = Math.min(Number(e.target.value), selectedSizeData?.stock || 0); // Zapobiega przekroczeniu maksymalnego stocku
                                                setStock(value);
                                            }}                                    
                                            className="rounded p-1 w-12 text-center ring-1 bg-white ring-black shadow-md"
                                        />
                                    </div>
                                    <div className="flex justify-center pt-4 md:pt-6">
                                        <button type="submit" className="ring-1 ring-black shadow-md transition duration-500 ease-in-out hover:bg-slate-100 hover:text-slate-800 rounded p-2 w-36">Dodaj do koszyka</button>
                                    </div>
                                </div>
                                ) : (
                                    <div className="text-red-500 text-center pt-4">Brak na stanie</div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>   
            </div>
        </main>
    );
}

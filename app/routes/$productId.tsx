import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "../services/index";
import { getUserSession } from "../utils/auth.server";
import { ActionFunction, redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import { addToCart, commitSession, getSession } from "../utils/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
    const session = await getSession(request);
    const products = await db.product.findMany({})
    const { productId } = params;
    const sizes = await db.size.findMany({
    where: { productId: productId }
    });

    return { session, products, sizes, productId };
};


export const action: ActionFunction = async ({ request, params }) => {
    const formData = await request.formData();

    const productId = params.productId.toString();  // Zmieniamy na odpowiednią nazwę parametru, np. "productId"
    const sizeId = formData.get("sizeId")?.toString();  // Pobieramy sizeId z formularza
    const stock = parseInt(formData.get("stock")?.toString() || "1");  // Ilość produktów (domyślnie 1)
    const price = parseFloat(formData.get("price")?.toString() || "0");  // Cena rozmiaru (domyślnie 0)


    const session = await getSession(request);
    await addToCart(session, productId, stock, sizeId, price);
    const commit = await commitSession(session);

    return redirect("/cart", {
        headers: {
            "Set-Cookie": commit,
        },
    });
};

export default function ProductInfo() {
    const { products, sizes, productId } = useLoaderData();

    const Product = products.find((p) => p.id === productId);
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
        <main className="h-screen font-light">
            <div key={Product.id} className="w-full rounded-md">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-widest text-center p-2 pt-6">
                    {Product.name}
                </h1>
                <div className="flex flex-row my-6 space-x-4 sm:space-x-6 md:space-x-12 lg:space-x-16 mx-4 sm:mx-14 md:mx-16 lg:mx-30 xl:mx-40 justify-center mb-4">
                    <img src={Product.image} alt={Product.name} className="object-cover w-52 sm:w-64 md:w-80 rounded-2xl ring-1 ring-black" />
                    <div className="flex flex-col py-8 rounded-2xl ring-1 ring-black">
                        <div className="py-4">
                            <p className="px-8 text-justify tracking-widest max-w-96 text-xs md:text-sm md:text-lg">
                                {Product.description}
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <form
                                method="post"
                                action={`/cart`} >
                                <input type="hidden" name="productId" value={Product.id} />
                                
                                {AvailableSizes.length > 0 ? (
                                <div>
                                    <div className="flex justify-center pt-8 md:pt-14">
                                        <label htmlFor="stock" className="block text-sm font-light tracking-widest pb-1">
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
                                            className="rounded p-1 w-12 text-center ring-1 ring-black shadow-lg"
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        <label htmlFor="size" className="font-light tracking-widest pt-2 pb-1">
                                            Wybierz rozmiar
                                        </label>
                                    </div>
                                    <div className="flex justify-center">
                                        <select
                                            id="size"
                                            name="size"
                                            onChange={handleSizeChange}
                                            className="ring-1 ring-black shadow-lg rounded p-2 w-40"
                                        >
                                            {AvailableSizes.map((size) => (
                                            <option key={size.id} value={size.id}>
                                                {size.name}: {size.price} zł
                                            </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-center pt-4 md:pt-6">
                                        <button type="submit" className="ring-1 ring-black shadow-lg transition duration-500 ease-in-out hover:bg-slate-100 hover:text-slate-800 rounded p-2 w-36">Dodaj do koszyka</button>
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

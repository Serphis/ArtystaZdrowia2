import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "../services/index";
import { getUserSession } from "../utils/auth.server";
import { ActionFunction, redirect } from "react-router-dom";
import { useState } from "react";
import { addToCart, commitSession, getSession } from "../utils/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const sessionData = await getUserSession(request);
  const session = await getSession(request);
  const products = await db.product.findMany();
  const { productId } = params;
  const sizes = await db.size.findMany({
    where: { productId: productId }
  });

  return { products, sizes, session, productId };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const productId = params.toString();
  const sizeId = formData.get("sizeId")?.toString();
  const quantity = parseInt(formData.get("quantity")?.toString() || "1");
  const price = parseFloat(formData.get("price")?.toString() || "0");

  const session = await getSession(request);
  await addToCart(session, productId, quantity, sizeId, price);
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

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  return (
    <main className="h-screen font-light bg-[#f2e4ca]">
        <div key={Product.id} className="w-full rounded-md">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-widest text-center p-2 pt-4">
                {Product.name}
            </h1>
            <div className="flex flex-row my-6 space-x-4 sm:space-x-6 md:space-x-6 sm:mx-14 md:mx-16 lg:mx-30 xl:mx-40 justify-center mb-4">
                <img src={Product.image} alt={Product.name} className="object-cover w-52 sm:w-64 md:w-80 lg:w-96 rounded-2xl ring-1 ring-[#b5a589]" />
                <div className="flex flex-col py-8 rounded-2xl ring-1 ring-[#b5a589]">
                    <div className="py-4">
                        <p className="px-8 text-justify tracking-widest max-w-96 text-xs md:text-sm md:text-lg">
                            {Product.description}
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <form
                            method="post"
                            action={`/cart`} >
                            <input type="hidden" name="productId" value={productId} />
                            <div className="flex justify-center pt-8 md:pt-14">
                                <label htmlFor="quantity" className="block text-sm font-light tracking-widest pb-1">
                                    Ilość
                                </label>
                            </div>
                            <div className="flex justify-center">
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={quantity}
                                    min="1"
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="rounded p-1 w-12 text-center ring-1 ring-[#b5a589] shadow-lg bg-[#fbf7ed]"
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
                                    className="ring-1 ring-[#b5a589] shadow-lg rounded p-2 w-40 bg-[#fbf7ed]"
                                >
                                    {sizes.map((size) => (
                                    <option key={size.id} value={size.id}>
                                        {size.name}: {size.price} zł
                                    </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex justify-center pt-4 md:pt-6">
                                <button type="submit" className="ring-1 ring-[#b5a589] shadow-lg transition duration-500 ease-in-out bg-[#7b6b63] hover:bg-[#fbf7ed] text-[#fbf7ed] hover:text-[#7b6b63] rounded p-2 w-36">Dodaj do koszyka</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>   
        </div>
    </main>
  );
}

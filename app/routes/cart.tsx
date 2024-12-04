import { useLoaderData } from "@remix-run/react";
import { db } from "../services/index";
import { ActionFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import { getSession, commitSession, addToCart } from "../utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const cart = session.get("cart") || [];
  const products = await db.product.findMany();
  const sizes = await db.size.findMany();

  if (cart.length === 0) {
    return json({ cart: [], message: "Koszyk jest pusty." });
  }

  const enhancedCart = await Promise.all(
    cart.map(async (item) => {
      const product = await db.product.findUnique({
        where: { id: item.productId },
        select: { name: true, image: true },
      });

      return {
        ...item,
        name: product?.name || "Nieznany produkt",
        image: product?.image || "/placeholder.jpg",
      };
    })
  );

  return { cart: enhancedCart, products, sizes };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const productId = formData.get("productId")?.toString();
  const sizeId = formData.get("size")?.toString();
  const quantity = parseInt(formData.get("quantity")?.toString() || "1", 10);
  const price = parseFloat(formData.get("price")?.toString() || "0");

  if (!productId || !sizeId || isNaN(quantity) || isNaN(price)) {
    console.warn("Brakuje danych w formularzu lub dane są nieprawidłowe.");
  }

  const session = await getSession(request);

  await addToCart(session, productId, quantity, sizeId, price);

  const commit = await commitSession(session);

  return redirect("/cart", {
    headers: {
      "Set-Cookie": commit,
    },
  });
};

export default function Cart() {
  const { cart, message, products, sizes } = useLoaderData();

  const cartItems = Array.isArray(cart) ? cart : [];

  const updatedCart = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const size = sizes.find((s) => s.id === item.sizeId);

    return {
      ...item,
      productName: product ? product.name : "Nieznany produkt",
      productImage: product ? product.image : "/placeholder.jpg",
      sizeName: size ? size.name : "Nieznany rozmiar",
      sizePrice: size ? size.price : 0,
    };
  });

  const handleUpdateQuantity = async (productId, sizeId, action) => {
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("sizeId", sizeId);
    formData.append("actionType", action);

    await fetch("/cart", {
      method: "POST",
      body: formData,
    });
    
    window.location.reload();
  };

  return (
    <main className="min-h-screen p-4 bg-[#f2e4ca] font-light">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-widest text-center px-2 pt-4 pb-8">
        Koszyk
      </h1>
      {updatedCart.length > 0 ? (
        <div className="space-y-4 sm:mx-10 md:mx-16 lg:mx-52 xl:mx-72">
          {updatedCart.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[#fbf7ed] shadow-lg ring-1 ring-[#b5a589] p-4 rounded-2xl"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl ring-1 ring-[#b5a589]"
                />
                <span className="text-lg md:text-xl font-medium tracking-widest">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <p className="text-lg md:text-xl font-bold">{item.sizePrice} zł</p>
                <p className="text-sm md:text-base text-[#7b6b63]">
                  Ilość: {item.quantity}
                </p>
                <p className="text-sm md:text-base text-[#7b6b63]">
                  Rozmiar: {item.sizeName}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#7b6b63] text-center tracking-widest mt-6">
          {message || "Twój koszyk jest pusty."}
        </p>
      )}
    </main>
  );
}
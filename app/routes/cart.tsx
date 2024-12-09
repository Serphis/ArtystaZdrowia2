import { useLoaderData } from "@remix-run/react";
import { db } from "../services/index";
import { ActionFunction, LoaderFunction, MaxPartSizeExceededError, json, redirect } from "@remix-run/node";
import { getSession, commitSession, addToCart } from "../utils/session.server";

export async function getCartData(session) {
  const cart = session.get("cart") || {};
  const products = await db.product.findMany();
  const sizes = await db.size.findMany();

  const matchedItems = {};
  let totalPrice = 0;

  for (const key in cart) {
    for (const productKey in products) {
      const uniqueKey = `${products[productKey].id}-${cart[key].sizeId}`;
      if (key === uniqueKey) {
        const productId = products[productKey].id;

        if (!matchedItems[uniqueKey]) {
          matchedItems[uniqueKey] = {
            productId: productId,
            name: products[productKey].name,
            image: products[productKey].image,
            sizeId: null,
            sizeName: null,
            sizePrice: null,
            stock: cart[key].stock || 1,
          };
        }

        const matchedSize = sizes.find(size => size.id === cart[key].sizeId);

        if (matchedSize) {
          matchedItems[uniqueKey].sizeId = matchedSize.id;
          matchedItems[uniqueKey].sizeName = matchedSize.name;
          matchedItems[uniqueKey].sizePrice = matchedSize.price;
          totalPrice += matchedSize.price * (cart[key].stock || 1);
        }
      }
    }
  }

  return { matchedItems, totalPrice };
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const { matchedItems, totalPrice } = await getCartData(session);

  if (Object.keys(matchedItems).length === 0) {
    return json({ cart: {}, message: "Koszyk jest pusty." });
  }

  return json({ matchedItems, totalPrice });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("action")?.toString();
  const session = await getSession(request);

  if (actionType === "clear") {
    session.set("cart", {});
    const commit = await commitSession(session);

    return redirect("/cart", {
      headers: {
        "Set-Cookie": commit,
      },
    });
  }

  if (actionType === "createOrder") {
    const { matchedItems, totalPrice } = await getCartData(session);

    if (!matchedItems || Object.keys(matchedItems).length === 0) {
      return json({ error: "Koszyk jest pusty." }, { status: 400 });
    }

    const deliveryCost = 12.99;
    const totalWithDelivery = totalPrice + deliveryCost;  

    session.set("order", {
      products: Object.values(matchedItems),
      totalPrice,
      deliveryCost,
      totalWithDelivery,
    });
  
    const commit = await commitSession(session);

    return redirect("/checkout", {
      headers: {
        "Set-Cookie": commit,
      },
    });
  }

  const productId = formData.get("productId")?.toString();
  const sizeId = formData.get("size")?.toString();
  const stock = formData.get("stock")?.toString();
  const price = formData.get("price")?.toString();

  await addToCart(session, productId, stock, sizeId, price);
  const commit = await commitSession(session);

  return redirect("/cart", {
    headers: {
      "Set-Cookie": commit,
    },
  });
};

export default function Cart() {
  const { matchedItems = {}, message, totalPrice } = useLoaderData();

  const deliveryCost = 12.99; 
  const totalWithDelivery = totalPrice + deliveryCost;

  const isCartEmpty = !matchedItems || Object.keys(matchedItems).length === 0;

  return (
    <form method="post">
      <main className="min-h-screen p-4 font-light">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-widest text-center px-2 pt-4 pb-4">
          Koszyk
        </h1>
        {!isCartEmpty ? (
            <div className="space-y-4 sm:mx-10 md:mx-16 lg:mx-52 xl:mx-72">
              <div className="flex justify-center">
                <button
                  type="submit"
                  name="action"
                  value="clear"
                  className="group transition duration-300 ease-in-out px-2 py-2 mb-2 text-l ring-1 ring-black hover:bg-black hover:text-white text-black bg-white rounded-sm shadow-lg"
                >
                  Wyczyść koszyk
                </button>
              </div>
            {Object.values(matchedItems).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between shadow-lg ring-1 ring-black p-4 rounded-2xl"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl ring-1 ring-black"
                  />
                  <span className="text-lg md:text-xl font-medium tracking-widest">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg md:text-xl font-bold">{item.sizePrice} zł</p>
                  <p className="text-sm md:text-base">
                    Ilość: {item.stock}
                  </p>
                  <p className="text-sm md:text-base">
                    Rozmiar: {item.sizeName}
                  </p>
                </div>
              </div>
            ))}
            {/* Sekcja dostawy */}
            <div className="pt-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl tracking-wider font-medium">
                Opcje dostawy
              </h2>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="radio"
                  id="inpost-paczkomat"
                  name="delivery"
                  value="inpost-paczkomat"
                  defaultChecked
                  className="h-4 w-4"
                />
                <label htmlFor="inpost-paczkomat" className="text-base sm:text-lg">
                  InPost Paczkomat - {deliveryCost.toFixed(2)} zł
                </label>
              </div>
            </div>

            {/* Podsumowanie cen */}
            <div className="text-center pt-6">
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold">
                Cena produktów: {totalPrice.toFixed(2)} zł
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold">
                Koszt dostawy: {deliveryCost.toFixed(2)} zł
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-2">
                Suma: {totalWithDelivery.toFixed(2)} zł
              </p>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                name="action"
                value="createOrder"
                className="group transition duration-300 ease-in-out px-2 py-2 text-xl ring-1 ring-black hover:bg-black hover:text-white text-black bg-white rounded-sm shadow-lg"
              >
                Złóż zamówienie
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center tracking-widest mt-6">
            {message || "Twój koszyk jest pusty."}
          </p>
        )}
        
      </main>
    </form>
  );
}
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

    session.set("order", {
      products: Object.values(matchedItems),
      totalPrice,
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

  const isCartEmpty = !matchedItems || Object.keys(matchedItems).length === 0;

  return (
    <form method="post">
      <main className="py-4 font-light flex flex-row space-x-4 sm:space-x-12 md:space-x-20 lg:space-x-32 justify-center">
        <div className="rounded-md p-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl tracking-widest text-center px-2 pt-4 pb-4">
            Koszyk
          </h1>
          <div className="flex justify-center">
            <button
              type="submit"
              name="action"
              value="clear"
              className="group transition duration-300 ease-in-out px-2 py-2 mb-2 text-l ring-1 ring-black hover:bg-black hover:text-white text-black bg-white rounded-sm shadow-md"
            >
              Wyczyść koszyk
            </button>
          </div>
          {!isCartEmpty ? (
              <div className="space-y-3 my-4">
              {Object.values(matchedItems).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between shadow-md rounded-lg ring-1 ring-black"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover shadow-md rounded-l-lg"
                    />
                  </div>
                  <span className="text-sm md:text-base w-28 sm:w-40 md:w-60 lg:w-80 lg:text-lg p-2 md:px-4 font-normal tracking-widest">
                    {item.name}
                  </span>
                  <div className="text-right mx-2">
                    <p className="text-lg lg:text-xl font-semibold">
                      {item.sizePrice} zł
                    </p>
                    <p className="text-sm lg:text-md">
                      Ilość: {item.stock}
                    </p>
                    <p className="text-sm lg:text-md">
                      {item.sizeName}
                    </p>
                  </div>
                </div>
              ))}              
            </div>
          ) : (
            <p className="text-center tracking-widest mt-6">
              {message || "Twój koszyk jest pusty."}
            </p>
          )}
        </div>

        <div className="flex flex-col justify-end p-2 rounded-lg items-center">
          <div className="text-center pt-6">
            <p className="text-xl md:text-2xl lg:text-3xl m-2 md:my-4">
              Suma: {totalPrice.toFixed(2)} zł
            </p>
          </div>
            
          <div>
            <button
              type="submit"
              name="action"
              value="createOrder"
              className="group transition duration-300 ease-in-out mx-2 px-1 lg:px-2 py-1 lg:py-2 text-base sm:text-lg lg:text-xl ring-1 ring-black hover:bg-black hover:text-white text-black bg-white rounded-sm shadow-md"
            >
              Złóż zamówienie
            </button>
          </div>
        </div>
      </main>
    </form>
  );
}
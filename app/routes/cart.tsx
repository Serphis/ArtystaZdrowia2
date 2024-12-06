import { useLoaderData } from "@remix-run/react";
import { db } from "../services/index";
import { ActionFunction, LoaderFunction, MaxPartSizeExceededError, json, redirect } from "@remix-run/node";
import { getSession, commitSession, addToCart } from "../utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const cart = session.get("cart") || {};
  const products = await db.product.findMany();
  const sizes = await db.size.findMany();
  
  const matchedItems = {};  // Obiekt, który przechowa dopasowane produkty z rozmiarami i cenami

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
            quantity: cart[key].quantity || 1
          };
        }

        const matchedSize = sizes.find(size => size.id === cart[key].sizeId);

        if (matchedSize) {
          matchedItems[uniqueKey].sizeId = matchedSize.id;
          matchedItems[uniqueKey].sizeName = matchedSize.name;
          matchedItems[uniqueKey].sizePrice = matchedSize.price;
        }
      }
    }
  }


  if (Object.keys(cart).length === 0) {
    return json({ cart: {}, message: "Koszyk jest pusty." });
  }

  return json({ matchedItems, session, products, sizes });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("action")?.toString(); // Typ akcji: "clear" lub inny
  const session = await getSession(request);

  if (actionType === "clear") {
    session.set("cart", {}); // Usuwamy wszystkie dane z koszyka
    const commit = await commitSession(session);

    return redirect("/cart", {
      headers: {
        "Set-Cookie": commit,
      },
    });
  }

  // Obsługa usuwania pojedynczego produktu - Zostawiona jako komentarz
  /*
  const productId = formData.get("productId")?.toString();
  if (actionType === "delete" && productId) {
    const cart = session.get("cart") || {};
    delete cart[productId];
    session.set("cart", cart);
    const commit = await commitSession(session);

    return redirect("/cart", {
      headers: {
        "Set-Cookie": commit,
      },
    });
  }
  */

  // Obsługa dodawania
  const productId = formData.get("productId")?.toString();
  const sizeId = formData.get("size")?.toString();
  const quantity = parseInt(formData.get("quantity")?.toString() || "1", 10);
  const price = parseFloat(formData.get("price")?.toString() || "0");

  if (!productId || !sizeId || isNaN(quantity) || isNaN(price)) {
    console.warn("Brakuje danych w formularzu lub dane są nieprawidłowe.");
  }

  await addToCart(session, productId, quantity, sizeId, price);
  const commit = await commitSession(session);

  return redirect("/cart", {
    headers: {
      "Set-Cookie": commit,
    },
  });
};

export default function Cart() {
  const { matchedItems = {}, message } = useLoaderData();  // Odbieramy matchedItems z loadera

  const isCartEmpty = !matchedItems || Object.keys(matchedItems).length === 0;

  return (
    <form method="post">
      <main className="min-h-screen p-4 font-light">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-widest text-center px-2 pt-4 pb-8">
          Koszyk
        </h1>
        {!isCartEmpty ? ( // Jeśli koszyk nie jest pusty
            <div className="space-y-4 sm:mx-10 md:mx-16 lg:mx-52 xl:mx-72">
              <div className="flex justify-center">
                <input type="hidden" name="action" value="clear" />
                <button
                  type="submit"
                  className="group transition duration-300 ease-in-out hover:text-slate-600 px-2 py-2"
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
                    Ilość: {item.quantity}
                  </p>
                  <p className="text-sm md:text-base">
                    Rozmiar: {item.sizeName}
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
      </main>
    </form>
  );
}
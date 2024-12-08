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
            stock: cart[key].stock || 1
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


  if (Object.keys(cart).length === 0) {
    return json({ cart: {}, message: "Koszyk jest pusty." });
  }

  return json({ matchedItems, session, products, sizes, totalPrice });
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
    const cart = session.get("cart") || {};
    await db.order.create({
      data: {
        items: Object.values(cart).map(item => ({
          productId: item.productId,
          stock: item.stock,
          sizeId: item.sizeId,
          price: item.price,
        })),
      },
    });
  
    session.set("cart", {});
    const commit = await commitSession(session);
  
    return redirect("/order-success", {
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

  const productId = formData.get("productId")?.toString();
  const sizeId = formData.get("size")?.toString();
  const stock = formData.get("stock")?.toString();
  const price = formData.get("price")?.toString();

  if (!productId || !sizeId || isNaN(stock) || isNaN(price)) {
    console.warn("Brakuje danych w formularzu lub dane są nieprawidłowe.");
  }

  if (actionType !== "clear" && actionType !== "createOrder") {
    const size = await db.size.findUnique({ where: { id: sizeId } });
  
    if (!size || stock > size.stock) {
      return json(
        { error: "Nie można dodać więcej produktów niż jest dostępnych na stanie." },
        { status: 400 }
      );
    }
  
    await addToCart(session, productId, stock, sizeId, price);
    const commit = await commitSession(session);

    return redirect("/cart", {
      headers: {
        "Set-Cookie": commit,
      },
    });
  }
};

export default function Cart() {
  const { matchedItems = {}, message, totalPrice } = useLoaderData();

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
                <input type="hidden" name="action" value="clear" />
                <button
                  type="submit"
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
            <div className="text-center pt-2">
              <p className="text-xl font-semibold">Całkowita cena: {totalPrice.toFixed(2)} zł</p>
            </div>
            <div className="flex justify-center">
              <input type="hidden" name="action" value="createOrder" />
              <button
                type="submit"
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
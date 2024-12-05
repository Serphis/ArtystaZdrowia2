import { useLoaderData } from "@remix-run/react";
import { db } from "../services/index";
import { ActionFunction, LoaderFunction, MaxPartSizeExceededError, json, redirect } from "@remix-run/node";
import { getSession, commitSession, addToCart } from "../utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const cart = session.get("cart") || {};
  const products = await db.product.findMany();
  const sizes = await db.size.findMany();
  const keys = Object.keys(cart)
  
  const matchedItems = {};  // Obiekt, który przechowa dopasowane produkty z rozmiarami i cenami

  for (const key in cart) {
    for (const productKey in products) {
      // Dopasowanie produktów
      if (key === products[productKey].id) {
        const productId = products[productKey].id;
        
        // Inicjalizujemy obiekt, jeśli jeszcze nie istnieje
        if (!matchedItems[productId]) {
          matchedItems[productId] = {
            productId: productId,
            name: products[productKey].name,
            image: products[productKey].image,
            sizeName: null,
            sizePrice: null,
            quantity: cart[key].quantity || 1  // Ilość z koszyka
          };
        }
        
        // Dopasowanie rozmiaru i ceny
        const matchedSize = sizes.find(size => size.id === cart[key].sizeId);
        // console.log("BBBBBBBBBBBBBBB", matchedSize)
        if (matchedSize) {
          matchedItems[productId].sizeName = matchedSize.name;
          matchedItems[productId].sizePrice = matchedSize.price;  // Cena rozmiaru
        }
      }
    }
  }

  if (Object.keys(cart).length === 0) {
    return json({ cart: {}, message: "Koszyk jest pusty." });
  }

  return json({ matchedItems, session, products, sizes });

  // const enhancedCart = await Promise.all(
  //   Object.keys(cart).map(async (key) => {
  //     const item = cart[key];
  //     const product = await db.product.findUnique({
  //       where: id = item.productId,
  //       select: { name: true, image: true },
  //     });

  //     return {
  //       ...item,
  //       name: product?.name || "Nieznany produkt",
  //       image: product?.image || "/placeholder.jpg",
  //     };
  //   })
  // );

  // const enhancedCartDict = enhancedCart.reduce((acc, item) => {
  //   acc[`${item.productId}-${item.sizeId}`] = item;
  //   return acc;
  // }, {} as Record<string, any>);

  // return { cart: enhancedCartDict, products, sizes };
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
  const { matchedItems, message } = useLoaderData();  // Odbieramy matchedItems z loadera

  console.log("AAAAAAAAAAAAAa", matchedItems)

  return (
    <main className="min-h-screen p-4 bg-[#f2e4ca] font-light">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-widest text-center px-2 pt-4 pb-8">
        Koszyk
      </h1>
      {Object.keys(matchedItems).length > 0 ? (  // Sprawdzamy, czy są dopasowane produkty
        <div className="space-y-4 sm:mx-10 md:mx-16 lg:mx-52 xl:mx-72">
          {Object.values(matchedItems).map((item, index) => (
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

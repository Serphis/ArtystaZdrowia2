import { useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction, json, redirect } from "@remix-run/node";
import { db } from "../services/index";
import { getSession, commitSession } from "../utils/session.server";

// Loader: Pobiera dane zamówienia z sesji i czyści sesję po przetworzeniu
export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const orderData = session.get("orderData") || null;
  const cart = session.get("cart")

  if (!orderData || Object.keys(orderData.products).length === 0) {
    return json({ message: "Brak danych zamówienia.", error: true });
  }

  try {
    const cartItems = orderData.products;

    for (const item of cartItems) {
      await db.size.update({
        where: { id: item.sizeId },
        data: {
          stock: {
            decrement: parseInt(item.stock, 10), // quantity musi być liczbą całkowitą
          },
        },
      });
    }

    // Wyczyść dane zamówienia z sesji
    if (cart && Object.keys(cart).length > 0) {

      session.set("cart", {});
      session.set("orderData", {});

      return redirect("/success", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
    return null;
  } catch (error) {
    console.error("Błąd przy aktualizacji produktów:", error);
    return json({ message: "Wystąpił problem z realizacją zamówienia.", error: true });
  }
};

// Komponent SuccessPage
const SuccessPage = () => {

  return (
    <div className="py-16 text-center flex flex-col items-center">
      <h1 className="text-2xl py-10">Twoja płatność została zrealizowana pomyślnie!</h1>
      <p>Dziękujemy za zakupy! :)</p>
      <img
        src="https://res.cloudinary.com/djio9fbja/image/upload/f_auto,q_auto/v1/public/zsa7ti63lpljo6spth7p"
        alt="Opis zdjęcia"
        className="py-4 md:py-2 w-96 object-cover"
      />
    </div>
  );
};

export default SuccessPage;

import { useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction, json, redirect } from "@remix-run/node";
import { db } from "../services/index";
import { getSession, commitSession } from "../utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const orderData = session.get("order");

  if (!orderData || Object.keys(orderData.products).length === 0) {
    return json({ message: "Brak danych zamówienia.", error: true });
  }

    const cartItems = orderData.products;

    for (const item of cartItems) {
      await db.size.update({
        where: { id: item.sizeId },
        data: {
          stock: {
            decrement: parseInt(item.stock, 10), // ilość musi być liczbą całkowitą
          },
        },
      });
    }

    session.set("cart", {});

    const commit = await commitSession(session);

    return json(
      { success: true },
      {
        headers: {
          "Set-Cookie": commit,
        },
      }
    );
  };

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

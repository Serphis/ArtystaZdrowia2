import { useLoaderData, useFetcher } from "@remix-run/react";
import { useState } from "react";
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { getSession, commitSession } from "../utils/session.server"; // Funkcja do pobierania sesji (zależnie od implementacji)
import { getCartData } from "./cart"; // Import getCartData z routes/cart

import fetch from "node-fetch";

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request);

    const { matchedItems, totalPrice } = await getCartData(session);
  
    return json({ cart: matchedItems, totalPrice });
  };

export let action: ActionFunction = async ({ request }) => {
    const formData = new URLSearchParams(await request.text());
    const session = await getSession(request);

    const cart = session.get("cart") || {};
    const totalPrice = Object.values(cart).reduce(
        (sum, item) => sum + item.sizePrice * item.stock,
        0
    );

    const order = {
        items: cart,
        totalPrice,
        customer: {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
        },
        shippingMethod: formData.get("shippingMethod"),
    };

    const clientId = "YOUR_CLIENT_ID";
    const clientSecret = "YOUR_CLIENT_SECRET";
    const sandboxUrl = "https://secure.snd.payu.com/";

    const authResponse = await fetch(`${sandboxUrl}pl/standard/user/oauth/authorize`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret,
        }),
    });

    const { access_token } = await authResponse.json();

    if (!access_token) {
        throw new Error("Failed to obtain PayU access token");
    }

    const payuOrder = {
        notifyUrl: "https://your-public-url/notify",
        continueUrl: "https://your-public-url/return",
        customerIp: "127.0.0.1",
        merchantPosId: clientId,
        description: "Zamówienie w sklepie",
        currencyCode: "PLN",
        totalAmount: Math.round(totalPrice * 100), // PayU wymaga groszy
        buyer: {
            email: order.customer.email,
            phone: order.customer.phone,
            firstName: order.customer.firstName,
            lastName: order.customer.lastName,
            language: "pl",
        },
        products: Object.values(cart).map((item) => ({
            name: item.name,
            unitPrice: Math.round(item.sizePrice * 100),
            quantity: item.stock,
        })),
    };

    const payuResponse = await fetch(`${sandboxUrl}api/v2_1/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(payuOrder),
    });

    const payuData = await payuResponse.json();

    if (payuData.status.statusCode !== "SUCCESS") {
        throw new Error("Failed to create PayU order");
    }

    return json({ redirectUrl: payuData.redirectUri });

};

export default function CheckoutPage() {
  const { cart, totalPrice } = useLoaderData();
  const fetcher = useFetcher();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "Polska",
    streetAddress1: "",
    streetAddress2: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
    shippingMethod: "Paczkomat - 12.99 zł",
    termsAccepted: false,
  });

  const shippingCost = 12.99;
  const grandTotal = totalPrice + shippingCost;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    fetcher.submit(new FormData(form), { method: "post" });
  };

  if (fetcher.data?.redirectUrl) {
    window.location.href = fetcher.data.redirectUrl;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Podsumowanie zamówienia</h1>

      <form method="post" className="w-full max-w-xl space-y-4">
        <fieldset className="space-y-2">
          <legend className="text-lg font-medium">Dane kontaktowe</legend>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Imię*"
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Nazwisko*"
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Adres e-mail*"
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Numer telefonu*"
            required
            className="w-full p-2 border rounded"
          />
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-lg font-medium">Adres dostawy</legend>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Polska">Polska</option>
          </select>
          <input
            type="text"
            name="streetAddress1"
            value={formData.streetAddress1}
            onChange={handleChange}
            placeholder="Ulica i numer budynku/lokalu*"
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="streetAddress2"
            value={formData.streetAddress2}
            onChange={handleChange}
            placeholder="Ciąg dalszy adresu (opcjonalnie)"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Kod pocztowy*"
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Miasto*"
            required
            className="w-full p-2 border rounded"
          />
        </fieldset>

        <section className="space-y-2">
          <h2 className="text-lg font-medium">Twoje zamówienie</h2>
          {Object.values(cart).map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.name} {item.sizeName}</span>
              <span>{(item.stock)} x {(item.sizePrice)} zł</span>
            </div>
          ))}
          <div className="flex justify-between">
            <span>Przesyłka</span>
            <span>{shippingCost.toFixed(2)} zł</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Suma</span>
            <span>{grandTotal.toFixed(2)} zł</span>
          </div>
        </section>

        <fieldset className="space-y-2">
          <legend className="text-lg font-medium">Wybór przesyłki</legend>
          <label>
            <input
              type="radio"
              name="shippingMethod"
              value="Paczkomat - 12.99 zł"
              checked={formData.shippingMethod === "Paczkomat - 12.99 zł"}
              onChange={handleChange}
              className="mr-2"
            />
            Paczkomat - 12.99 zł
          </label>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-lg font-medium">Regulamin</legend>
          <p className="text-sm">
            Twoje dane osobowe będą użyte do przetworzenia twojego zamówienia,
            obsługi twojej wizyty na naszej stronie oraz dla innych celów, o
            których mówi nasza polityka prywatności.
          </p>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              required
              className="mr-2"
            />
            Przeczytałem/am i akceptuję regulamin*
          </label>
        </fieldset>

        <button
          type="submit"
          className="w-full p-2 text-lg font-medium text-white bg-black rounded"
          disabled={!formData.termsAccepted}
        >
          Kupuję i płacę
        </button>
      </form>
    </main>
  );
}

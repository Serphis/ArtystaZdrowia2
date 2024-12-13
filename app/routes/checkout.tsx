import { json, LoaderFunction } from "@remix-run/node";
import { getSession } from "~/utils/session.server";
import { getCartData } from "./cart";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PayU from "payu-websdk"; // Importujemy PayU WebSDK

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const { matchedItems, totalPrice } = await getCartData(session);
  const uniqueOrderId = uuidv4();

  // Możesz teraz przekazać dane w loaderze, jeśli to konieczne
  return json({ cart: matchedItems, totalPrice, uniqueOrderId });
};

export default function Checkout() {
  const { cart, totalPrice, uniqueOrderId } = useLoaderData();

  const [formData, setFormData] = useState({
    orderId: uniqueOrderId,
    totalAmount: totalPrice,
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
  const grandTotal = (totalPrice + shippingCost).toFixed(2);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Przekazywanie danych do PayU WebSDK
    const payu = new PayU({
      client_id: process.env.PAYU_CLIENT_ID!,
      client_secret: process.env.PAYU_CLIENT_SECRET!,
      order_id: formData.orderId,
      total_amount: (totalPrice + shippingCost) * 100, // Kwota musi być w groszach
      currency_code: "PLN",
      country: "PL",
      customer_ip: "127.0.0.1", // Możesz tu użyć rzeczywistego IP użytkownika, jeśli to możliwe
      product_name: "Your Product Name", // Nazwa produktu
      total_tax: 0, // Podatek jeśli jest
      shipping_cost: shippingCost * 100, // Koszt wysyłki w groszach
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.streetAddress1,
      postal_code: formData.postalCode,
      city: formData.city,
      terms_accepted: formData.termsAccepted,
    });

    // Wywołanie metody SDK, aby utworzyć transakcję
    payu.createOrder().then((response) => {
      if (response.status === "success") {
        // Jeśli transakcja jest pomyślna, przekieruj do PayU
        window.location.href = response.redirect_url;
      } else {
        console.error("Błąd podczas tworzenia zamówienia", response);
      }
    }).catch((error) => {
      console.error("Błąd w komunikacji z PayU", error);
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Podsumowanie zamówienia</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
        {/* Dane kontaktowe */}
        <fieldset className="space-y-2">
          <legend className="text-lg font-medium">Dane kontaktowe</legend>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Imię*" required className="w-full p-2 border rounded" />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Nazwisko*" required className="w-full p-2 border rounded" />
          <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Adres e-mail*" required className="w-full p-2 border rounded" />
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Numer telefonu*" required className="w-full p-2 border rounded" />
        </fieldset>

        {/* Adres dostawy */}
        <fieldset className="space-y-2">
          <legend className="text-lg font-medium">Adres dostawy</legend>
          <select name="country" value={formData.country} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="Polska">Polska</option>
          </select>
          <input type="text" name="streetAddress1" value={formData.streetAddress1} onChange={handleChange} placeholder="Ulica i numer budynku/lokalu*" required className="w-full p-2 border rounded" />
          <input type="text" name="streetAddress2" value={formData.streetAddress2} onChange={handleChange} placeholder="Ciąg dalszy adresu (opcjonalnie)" className="w-full p-2 border rounded" />
          <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Kod pocztowy*" required className="w-full p-2 border rounded" />
          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Miasto*" required className="w-full p-2 border rounded" />
        </fieldset>

        {/* Twoje zamówienie */}
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
            <span>{grandTotal} zł</span>
          </div>
        </section>

        {/* Regulamin */}
        <fieldset className="space-y-2">
          <legend className="text-lg font-medium">Regulamin</legend>
          <p className="text-sm">
            Twoje dane osobowe będą użyte do przetworzenia twojego zamówienia,
            obsługi twojej wizyty na naszej stronie oraz dla innych celów, o
            których mówi nasza polityka prywatności.
          </p>
          <label className="flex items-center">
            <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} required className="mr-2" />
            Przeczytałem/am i akceptuję regulamin*
          </label>
        </fieldset>

        <button type="submit" className="w-full p-2 text-lg font-medium text-white bg-black rounded" disabled={!formData.termsAccepted}>
          Kupuję i płacę
        </button>
      </form>
    </main>
  );
}

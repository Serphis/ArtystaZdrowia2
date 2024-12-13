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
    try {
      const response = await axios.post('/api/create-order', {
        totalAmount: (totalPrice + shippingCost) * 100, // Kwota w groszach
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        streetAddress1: formData.streetAddress1,
        postalCode: formData.postalCode,
        city: formData.city,
        phone: formData.phone,
      });

      if (response.data.redirect_url) {
        window.location.href = response.data.redirect_url; // Przekierowanie na stronę PayU
      } else {
        alert('Błąd podczas tworzenia zamówienia');
      }
    } catch (error) {
      console.error('Błąd w komunikacji z backendem', error);
      alert('Wystąpił błąd podczas składania zamówienia');
    }
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

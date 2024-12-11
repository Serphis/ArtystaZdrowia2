import { json, LoaderFunction, redirect } from "@remix-run/node";
import { getSession } from "~/utils/session.server";
import { getCartData } from "./cart";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const { matchedItems, totalPrice } = await getCartData(session);
  const uniqueOrderId = uuidv4();

  const client_id = process.env.PAYU_CLIENT_ID;
  const client_secret = process.env.PAYU_CLIENT_SECRET;

  const url = 'https://secure.snd.payu.com/pl/standard/user/oauth/authorize';
  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');
  data.append('client_id', client_id);
  data.append('client_secret', client_secret);

  const response = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const accessToken = response.data.access_token;

  const paymentMethodsUrl = 'https://secure.snd.payu.com/api/v2_1/paymethods';
  const paymentMethodsResponse = await axios.get(paymentMethodsUrl, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const paymentMethods = paymentMethodsResponse.data;

  return json({ cart: matchedItems, totalPrice, paymentMethods, uniqueOrderId, accessToken });
};

export default function Checkout() {
  const { cart, totalPrice, paymentMethods, uniqueOrderId, accessToken } = useLoaderData();

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
  const grandTotal = (totalPrice + shippingCost).toFixed(2);
  const totalAmount = String(Math.round((totalPrice + shippingCost) * 100));

    const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const filteredMethods = paymentMethods.payByLinks.filter((method: { name: string }) =>
    method.name.includes('Płatność online kartą płatniczą') || method.name === 'BLIK'
  );

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const handlePaymentMethodChange = (methodValue: string) => {
    setSelectedPaymentMethod(methodValue);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const ipResponse = await axios.get("https://api.ipify.org");
    const customerIp = ipResponse.data;

    const orderData = {
      notifyUrl: 'https://artystazdrowia.com/notify', // Adres do odbierania powiadomień o płatności
      redirectUri: "https://artystazdrowia.com/return",
      customerIp: customerIp,
      merchantPosId: process.env.PAYU_POS_ID, // Identyfikator punktu sprzedaży
      description: 'Zamówienie z Artysta Zdrowia', // Opis zamówienia
      currencyCode: 'PLN', // Waluta zgodna z ISO 4217
      totalAmount: totalAmount,
      extOrderId: uniqueOrderId, // Unikalny identyfikator zamówienia (np. generowany na backendzie)
      buyer: {
        email: formData.email, // Adres email klienta
        phone: formData.phone, // Numer telefonu klienta
        firstName: formData.firstName, // Imię klienta
        lastName: formData.lastName, // Nazwisko klienta
        language: 'pl', // Język
      },
      products: Object.keys(cart).map((key) => ({
        name: cart[key].name, // Nazwa produktu
        unitPrice: String(cart[key].sizePrice * 100), // Cena jednostkowa w groszach
        quantity: cart[key].quantity // Ilość produktów
      }))
    };

    try {
      const response = await axios.post("https://secure.snd.payu.com/api/v2_1/orders", orderData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });
        
      if (response.status === 200 && response.data.status.statusCode === 'SUCCESS') {
        // Jeśli odpowiedź jest poprawna, wykonaj przekierowanie
        const redirectUri = response.data.redirectUri;
        window.location.href = redirectUri; // Przekierowanie do strony płatności
      } else {
        // Obsługa błędów
        console.error("Błąd podczas składania zamówienia:", response.data);
        alert("Wystąpił problem z przetworzeniem zamówienia. Spróbuj ponownie.");
      }
    } catch (error) {
      console.error("Błąd podczas komunikacji z PayU:", error);
      alert("Błąd podczas wysyłania zapytania do PayU. Zobacz konsolę.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Podsumowanie zamówienia</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
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
            <span>{grandTotal} zł</span>
          </div>
        </section>

            <div>
              <h2 className="text-xl font-semibold">Wybierz metodę płatności</h2>
              <div className="justify-between gap-6 mt-4">
                {filteredMethods.map((method: { name: string, brandImageUrl: string, value: string }, index: number) => (
                  <div key={index} className="p-1 rounded-lg flex flex-row text-center">
                    <input
                      type="radio"
                      id={method.value}
                      name="paymentMethod"
                      value={method.value}
                      checked={selectedPaymentMethod === method.value}
                      onChange={() => handlePaymentMethodChange(method.value)}
                      className="hidden"
                    />
                    <label
                      htmlFor={method.value}
                      className={`cursor-pointer flex items-center justify-center p-2 rounded-lg border-2 ${
                        selectedPaymentMethod === method.value ? 'border-blue-500' : 'border-gray-300'
                      }`}
                    >
                      <img src={method.brandImageUrl} alt={method.name} width={50} className="mr-2" />
                      <span className="font-semibold">{method.name}</span>
                      <input
                        type="radio"
                        id={method.value}
                        name="paymentMethod"
                        value={method.value}
                        checked={selectedPaymentMethod === method.value}
                        onChange={() => handlePaymentMethodChange(method.value)}
                        className="ml-2"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
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

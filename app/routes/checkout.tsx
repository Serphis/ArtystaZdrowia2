import { json, LoaderFunction } from "@remix-run/node";
import { getSession } from "~/utils/session.server";
import { getCartData } from "./cart";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import axios from 'axios';


export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const { matchedItems, totalPrice } = await getCartData(session);

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

  return json({ cart: matchedItems, totalPrice, paymentMethods });
};

export default function Checkout() {
  const { cart, totalPrice, paymentMethods } = useLoaderData();

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

    console.log("Dane formularza:", formData);

    console.log("Rozpoczęto funkcję handleSubmit"); // Log na samym początku

    console.log("Rozpoczęcie składania zamówienia");

    // Pobranie IP użytkownika za pomocą API ipify
    console.log("Pobieranie IP użytkownika...");

    const ipResponse = await axios.get("https://api.ipify.org?format=json");
    const customerIp = ipResponse.data.ip;
    console.log("IP użytkownika:", customerIp);

    console.log("Całkowita kwota (zł):", grandTotal);

    console.log("Tworzenie obiektu orderData...");

    const orderData = {
      continueUrl: 'https://artystazdrowia.com/return', // Adres, na który użytkownik zostanie przekierowany po zakończeniu płatności
      notifyUrl: 'https://artystazdrowia.com/notify', // Adres do odbierania powiadomień o płatności
      customerIp: customerIp, // Przykładowy IP klienta, należy dostarczyć poprawne
      merchantPosId: process.env.PAYU_POS_ID, // Identyfikator punktu sprzedaży
      description: 'Zamówienie z Artysta Zdrowia', // Opis zamówienia
      visibleDescription: 'Produkty z Artysta Zdrowia', // Opis widoczny dla kupującego na stronie płatności
      currencyCode: 'PLN', // Waluta zgodna z ISO 4217
      totalAmount: String(grandTotal * 100),
      validityTime: '86400', // Czas ważności zamówienia w sekundach (domyślnie 24h)
      buyer: {
        extCustomerId: formData.customerId || 'unknown', // ID klienta w systemie
        email: formData.email, // Adres email klienta
        phone: formData.phone, // Numer telefonu klienta
        firstName: formData.firstName, // Imię klienta
        lastName: formData.lastName, // Nazwisko klienta
        language: 'pl', // Język
      },
      products: Object.keys(cart).map((key) => ({
        name: cart[key].name,
        unitPrice: String(cart[key].sizePrice * 100), // Cena jednostkowa w groszach
        quantity: String(cart[key].stock), // Ilość produktu
        productId: cart[key].productId, // Id produktu
        sizeId: cart[key].sizeId, // Id rozmiaru
        sizeName: cart[key].sizeName, // Nazwa rozmiaru
      })),
      payMethods: {
        type: 'PBL', // Typ płatności (np. PBL dla przelewu online)
        value: selectedPaymentMethod, // Wybrana metoda płatności (np. karta kredytowa, BLIK)
      },
      shippingMethods: [{
        name: formData.shippingMethod, // Metoda dostawy
      }],
    };
    console.log("Utworzony obiekt orderData:", orderData);

    console.log("Wysyłanie danych zamówienia do API PayU...");

    const response = await axios.post("https://secure.snd.payu.com/api/v2_1/orders", orderData);

    console.log("Otrzymano odpowiedź od API PayU:", response);

    if (response.status >= 200 && response.status < 300) {
      console.log("Zamówienie zostało pomyślnie złożone!");

      alert("Zamówienie zostało pomyślnie złożone!");
    } else {
      console.warn("Nieoczekiwany status odpowiedzi:", response.status);

      alert(`Wystąpił problem: ${response.status}`);
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
            <span>{grandTotal.toFixed(2)} zł</span>
          </div>
        </section>

        <fieldset className="space-y-2">
            <legend className="text-lg font-medium">Wybór przesyłki</legend>
            <label className="block">
                <input
                type="radio"
                name="shippingMethod"
                value="Paczkomat"
                checked={formData.shippingMethod === "Paczkomat"}
                onChange={handleChange}
                className="mr-2"
                />
                Paczkomat
            </label>
            <label className="block">
                <input
                type="radio"
                name="shippingMethod"
                value="Kurier"
                checked={formData.shippingMethod === "Kurier"}
                onChange={handleChange}
                className="mr-2"
                />
                Kurier
            </label>

            {formData.shippingMethod === "Paczkomat" && (
              <div id="inpost-widget" className="mt-4">
                <button
                  type="button"
                  className="w-full p-2 bg-blue-500 text-white rounded"
                  onClick={() => {
                    if (window.easyPack) {
                      console.log("Uruchomiono widget InPost");
                      window.easyPack.open({
                        mapType: "osm",
                        onclose: () => console.log("Widget zamknięty"),
                        onpoint: (point) => {
                          console.log("Wybrany paczkomat:", point.name);
                          handleChange({
                            target: {
                              name: "selectedParcelLocker",
                              value: point.name,
                            },
                          });
                        },
                      });
                    } else {
                      console.error("InPost SDK nie jest dostępny.");
                    }
                  }}
                >
                  Wybierz paczkomat
                </button>
                {formData.selectedParcelLocker && (
                  <p className="mt-2">
                    Wybrany paczkomat: {formData.selectedParcelLocker}
                  </p>
                )}
              </div>
            )}
            </fieldset>

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

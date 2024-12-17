import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { getCartData } from "./cart";
import { getSession, commitSession } from "../utils/session.server";
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { InpostGeowidgetReact } from 'inpost-geowidget-react'


export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);

  const { matchedItems, totalPrice } = await getCartData(session);

  return json({ cart: matchedItems, totalPrice });
};


// Załaduj publiczny klucz Stripe (zamień na swój klucz testowy/produkcyjny)
const stripePromise = loadStripe('pk_test_51QWDzLC66ozEbyTE3bWJdZCIgsFId1VpLZ35NaR67Xbn16UbxLJ9iEvYTinebp7KmbYncMmdlWRtchkGBjzuVH4o00NbPwKvop');

export default function Checkout() {

  let { cart } = useLoaderData();
  const [parcelLocker, setParcelLocker] = useState<string | null>(null); // Paczkomat
  const [customerData, setCustomerData] = useState({ email: '', phone: '' });

  const handlePointSelected = (point) => {
    console.log("Wybrany paczkomat:", point);
    setParcelLocker(point.name);
  };

  const token = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwNDk3OTczNjcsImlhdCI6MTczNDQzNzM2NywianRpIjoiZGUzMzZmYWUtZGE2OS00OGI0LWE0ZGYtZDc0ZGYwNzc2MWE0IiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTpjQ2xYcXA2c0J1Snl4MmVUUHlGMWlpeGVOSmRPRmFTRmhkSUM5ZG8zTHBJIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiZGE5Y2NlMDQtMjNkZi00Mjc1LTg0MzgtNjAwZTAzODU2YzkyIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyIsInNpZCI6ImRhOWNjZTA0LTIzZGYtNDI3NS04NDM4LTYwMGUwMzg1NmM5MiIsImFsbG93ZWRfcmVmZXJyZXJzIjoid3d3LmFydHlzdGF6ZHJvd2lhLmNvbSIsInV1aWQiOiJiYmE0MmU0MC05YzRlLTRiOGQtYTMzYS1hNzEwZTdkZTllZWEifQ.gOiFNNqvOsQ8zros4NcAP3PTfiYvpTuHzfc6aiF2cSW-mEhMf5zfXgFQSUBsSqDcenSQR_FTQ700MOQmjxQFH3rRVYT_TWDNARpfp4-p-jwIFPzH_D1VT-2j0aJw7Sm7QE93GtXMnqdptjaYQrzQfPpZzekr6lVUO1vSux6moDavIfvzbLRXBp4kdL8PPD1fHh9u5sLUiKEnK-Mtj7iTStZceZ_YhnxM2_nS53tfwHNA2gmWQ87F169GUgSXlSMpvSczd_DPb5txlPl-F34KyjXbttkF7wvnKva5LGmH5KRKTNPWJQ2imOtg3ZK-gdyLstWJlSzf0CGiaS-rbyb0zw`;     // Generate YOUR_TOKEN on https://manager.paczkomaty.pl (for production environment) or https://sandbox-manager.paczkomaty.pl (for sandbox environment).
  const identifier = 'Geo1';      // Html element identifier, default: 'Geo1'
  const language = 'pl';          // Language, default: 'pl'
  const config = 'parcelcollect'; // Config, default: 'parcelcollect'
  const sandbox = true;          // Run as sandbox environment, default: false

  const apiReady = (api: any) => {
    // You can also use API Methods, as example
    // api.changePosition({ longitude: 20.318968, latitude: 49.731131 }, 16);
    console.log(api);
  }

  const pointSelect = (point: any) => {
    console.log('Object of selected point: ', point);
  }

  const handleCheckout = async () => {
    try {
      const items = Object.values(cart).map(item => ({
        id: `${item.name} - ${item.sizeName}`, // Możesz użyć kombinacji nazwy i rozmiaru jako unikalnego id
        quantity: parseInt(item.stock, 10), // Liczba sztuk na podstawie pola `stock`
        price: parseInt(item.sizePrice)*100,
      }));
  
      const response = await fetch('https://www.artystazdrowia.com/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, parcelLocker, customerData }),
      });

      // Sprawdzenie odpowiedzi HTTP
      if (!response.ok) {
        console.error('Błąd HTTP:', response.status, response.statusText);
        const responseClone = response.clone();
        const errorText = await responseClone.text();
        console.error('Treść odpowiedzi (HTML):', errorText);
        alert('Błąd podczas tworzenia sesji płatności. Skontaktuj się z obsługą.');
        return;
      }

      let session;

      try {
        // Próba parsowania odpowiedzi jako JSON
        session = await response.json();
      } catch (jsonError) {
        const responseClone = response.clone();
        const errorText = await responseClone.text();
        console.error('Błąd parsowania JSON:', jsonError);
        console.error('Treść odpowiedzi (HTML):', errorText);
        alert('Błąd podczas przetwarzania danych płatności. Skontaktuj się z obsługą.');
        return;
      }

      // Sprawdzenie, czy sesja zawiera błąd
      if (session.error) {
        console.error(session.error);
        alert('Błąd podczas tworzenia sesji płatności: ' + session.error.message);
        return;
      }

      // Pobranie Stripe i przekierowanie do płatności
      const stripe = await stripePromise;
      if (!stripe) {
        alert('Stripe nie został poprawnie załadowany.');
        return;
      }
      const { error } = await stripe!.redirectToCheckout({ sessionId: session.id });

      if (error) {
        console.error(error.message);
        alert('Wystąpił błąd podczas przekierowania do płatności.');
      }
    } catch (error) {
      console.error('Błąd podczas obsługi płatności:', error);
      alert('Wystąpił błąd podczas obsługi płatności. Spróbuj ponownie później.');
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="py-4 font-light flex flex-row space-x-4 sm:space-x-12 md:space-x-20 lg:space-x-32 justify-center">
        <div className="rounded-md p-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl tracking-widest text-center px-2 pt-4 pb-4">
            Podsumowanie zamówienia
          </h1>
          <div className="space-y-3 my-4">
            {Object.values(cart).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between shadow-md rounded-lg ring-1 ring-black"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-sm md:text-base w-28 sm:w-40 md:w-60 lg:w-80 lg:text-lg p-2 md:px-4 font-normal tracking-widest">
                    {item.name} ({item.sizeName})
                  </span>
                </div>
                <div className="text-right mx-2">
                  <p className="text-lg lg:text-xl font-semibold">
                    {item.sizePrice} zł
                  </p>
                  <p className="text-sm lg:text-md">Ilość: {item.stock}</p>
                  <p className="text-sm lg:text-md">Rozmiar: {item.sizeName}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center">
            <div className="w-full max-w-3xl mb-4">
              <h2 className="text-xl font-semibold mb-2">Dane klienta</h2>
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded p-2 mb-2"
                value={customerData.email}
                onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Telefon"
                className="w-full border rounded p-2"
                value={customerData.phone}
                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
              />
              <div className='flex justify-center text-center p-2'>
                <h1>Wybierz paczkomat</h1>
                <div style={{ height: '500px', width: '500px' }}>
                  <InpostGeowidgetReact token={ token } identifier={ identifier } apiReady={ apiReady } pointSelect={ pointSelect } />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="group transition duration-300 ease-in-out px-2 py-2 mb-2 text-l ring-1 ring-black hover:bg-black hover:text-white text-black bg-white rounded-sm shadow-md"
                onClick={handleCheckout}
              >
                Zapłać
              </button>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
}
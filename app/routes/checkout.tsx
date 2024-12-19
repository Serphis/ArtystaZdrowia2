import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe } from '@stripe/react-stripe-js';
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

const stripePromise = loadStripe('pk_live_51QWDzLC66ozEbyTE0hqtga4swplVB3iFeY7ju038ocGXyZ90LgN845yUsc0Hlyts30TwZCj6rIqXZflfA2cEC1qb00l8ppblSH');

export default function Checkout() {

  let { cart, totalPrice } = useLoaderData();

  const [deliveryMethod, setDeliveryMethod] = useState('Kurier InPost - 18 zł');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [parcelLocker, setParcelLocker] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState({ name: '', email: '', phone: '' });
  const [address, setAddress] = useState({ street: '', city: '', zip: '' });
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  const token = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwNDk3OTczNjcsImlhdCI6MTczNDQzNzM2NywianRpIjoiZGUzMzZmYWUtZGE2OS00OGI0LWE0ZGYtZDc0ZGYwNzc2MWE0IiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTVlZjUzNTpjQ2xYcXA2c0J1Snl4MmVUUHlGMWlpeGVOSmRPRmFTRmhkSUM5ZG8zTHBJIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiZGE5Y2NlMDQtMjNkZi00Mjc1LTg0MzgtNjAwZTAzODU2YzkyIiwic2NvcGUiOiJvcGVuaWQgYXBpOmFwaXBvaW50cyIsInNpZCI6ImRhOWNjZTA0LTIzZGYtNDI3NS04NDM4LTYwMGUwMzg1NmM5MiIsImFsbG93ZWRfcmVmZXJyZXJzIjoid3d3LmFydHlzdGF6ZHJvd2lhLmNvbSIsInV1aWQiOiJiYmE0MmU0MC05YzRlLTRiOGQtYTMzYS1hNzEwZTdkZTllZWEifQ.gOiFNNqvOsQ8zros4NcAP3PTfiYvpTuHzfc6aiF2cSW-mEhMf5zfXgFQSUBsSqDcenSQR_FTQ700MOQmjxQFH3rRVYT_TWDNARpfp4-p-jwIFPzH_D1VT-2j0aJw7Sm7QE93GtXMnqdptjaYQrzQfPpZzekr6lVUO1vSux6moDavIfvzbLRXBp4kdL8PPD1fHh9u5sLUiKEnK-Mtj7iTStZceZ_YhnxM2_nS53tfwHNA2gmWQ87F169GUgSXlSMpvSczd_DPb5txlPl-F34KyjXbttkF7wvnKva5LGmH5KRKTNPWJQ2imOtg3ZK-gdyLstWJlSzf0CGiaS-rbyb0zw`;     // Generate YOUR_TOKEN on https://manager.paczkomaty.pl (for production environment) or https://sandbox-manager.paczkomaty.pl (for sandbox environment).
  const identifier = 'Geo1';      // Html element identifier, default: 'Geo1'
  const language = 'pl';          // Language, default: 'pl'
  const config = 'parcelcollect'; // Config, default: 'parcelcollect'
  const sandbox = true;          // Run as sandbox environment, default: false
  
  const handlePointSelected = (point) => {
    console.log("Wybrany paczkomat:", point);
    setParcelLocker(point.name);
  };

  const apiReady = (api: any) => {
    // You can also use API Methods, as example
    // api.changePosition({ longitude: 20.318968, latitude: 49.731131 }, 16);
    console.log(api);
  }

  const pointSelect = (point: any) => {
    console.log('Object of selected point: ', point);
    setSelectedPoint(point);
  };

  totalPrice *= 100;

  const handleCheckout = async () => {

    const orderData = {
      cart,
      totalPrice,
      deliveryMethod,
      paymentMethod,
      address,
      customerData,
      parcelLocker,
      selectedPoint,
    };

    localStorage.setItem('orderData', JSON.stringify(orderData));

    try {
      const response = await fetch('https://www.artystazdrowia.com/databaseHandler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
  
        const result = await response.json();
        if (result.status === 'success') {
          console.log('Zamówienie zostało złożone:', result.orderId);
        } else {
          console.error('Błąd składania zamówienia:', result.message);
        }
    } catch (error) {
      console.error('Błąd połączenia:', error);
    }

    try {
      const items = Object.values(cart).map(item => ({
        id: `${item.name}-${item.sizeName}`,
        quantity: parseInt(item.stock, 10),
        price: parseInt(item.sizePrice)*100,
      }));
  
      const response = await fetch('https://www.artystazdrowia.com/stripeHandler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
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
        session = await response.json();
      } catch (jsonError) {
        const responseClone = response.clone();
        const errorText = await responseClone.text();
        console.error('Błąd parsowania JSON:', jsonError);
        console.error('Treść odpowiedzi (HTML):', errorText);
        alert('Błąd podczas przetwarzania danych płatności. Skontaktuj się z obsługą.');
        return;
      }

      if (session.error) {
        console.error(session.error);
        alert('Błąd podczas tworzenia sesji płatności: ' + session.error.message);
        return;
      }

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
    

    // const handleCheckout = async () => {
    //     const items = Object.values(cart).map(item => ({
    //       id: `${item.name}-${item.sizeName}`, // Możesz użyć kombinacji nazwy i rozmiaru jako unikalnego id
    //       quantity: parseInt(item.stock, 10), // Liczba sztuk na podstawie pola `stock`
    //       price: parseInt(item.sizePrice)*100,
    //     }));

    //     const lineItems = items.map((item: { id: string; quantity: number; price: number }) => ({
    //       price_data: {
    //         currency: 'pln',
    //         product_data: {
    //           name: item.id
    //         },
    //         unit_amount: item.price,
    //       },
    //       quantity: item.quantity,
    //     }));
    
    //     const response = await fetch('https://www.artystazdrowia.com/stripeHandler', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         line_items: lineItems,  // Nasze przedmioty płatności
    //         mode: 'payment',        // Tryb płatności
    //         success_url: 'https://www.artystazdrowia.com/success',  // Adres po udanej płatności
    //         return_url: 'https://www.artystazdrowia.com/return',    // Adres po anulowanej płatności
    //       }),
    //     });
  
    //     if (!response.ok) {
    //       const errorData = await response.text();
    //       console.error('Błąd podczas tworzenia sesji:', errorData);
    //       alert('Wystąpił błąd podczas tworzenia sesji płatności. Spróbuj ponownie później.');
    //       return;
    //     }
        
    //     const { id }  = await response.json();  // Zakładając, że serwer zwróci sesję JSON
        
    //     // Przekierowanie do Stripe Checkout
    //     const stripe = await stripePromise;
    //     if (!stripe) {
    //       alert('Stripe nie został poprawnie załadowany.');
    //       return;
    //     }
        
    //     const { error } = await stripe.redirectToCheckout({ sessionId: id });
        
    //     if (error) {
    //       console.error('Błąd przekierowania do Stripe Checkout:', error.message);
    //       alert('Wystąpił błąd podczas przekierowania do płatności.');
    //     }
    //   }

  return (
    <Elements stripe={stripePromise}>
      <h1 className="h-screen text-2xl md:text-3xl lg:text-4xl font-light tracking-widest text-center px-2 pt-8 pb-4">
          Podsumowanie zamówienia
      </h1>
      <div className="py-4 font-light tracking-widest flex flex-row justify-center">
        <div className="flex flex-row space-x-4 sm:space-x-6 md:space-x-12 lg:space-x-16">
          <div className='mx-1'>
            <h1 className="text-2xl md:text-3xl tracking-widest text-center px-2 pt-4 pb-4">
              Twój koszyk
            </h1>
            <div className="space-y-3 my-4 p-2">
              {Object.values(cart).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between shadow-md rounded-2xl px-2 py-1 md:py-2"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-sm md:text-base w-28 md:w-60 lg:w-80 lg:text-lg font-normal tracking-widest">
                      {item.name} ({item.sizeName})
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg lg:text-xl font-semibold">
                      {item.sizePrice} zł
                    </p>
                    <p className="text-sm lg:text-md">Ilość: {item.stock}</p>
                    <p className="text-sm lg:text-md">Rozmiar: {item.sizeName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center mx-1">
            <div className="w-full mb-4">
              <div className='flex flex-col text-xl'>
                <h1 className="text-2xl md:text-3xl tracking-widest text-center px-2 pt-4 pb-4">
                  Metoda wysyłki
                </h1>
                {/* <label>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="Paczkomat"
                    checked={deliveryMethod === 'Paczkomat'}
                    onChange={() => setDeliveryMethod('Paczkomat')}
                  />
                  Paczkomat
                </label> */}
                <label>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="Kurier DPD - 18 zł"
                    checked={deliveryMethod === 'Kurier DPD - 18 zł'}
                    onChange={() => setDeliveryMethod('Kurier DPD - 18 zł')}
                  />
                  Kurier DPD - 18 zł
                </label>
                <label>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="Kurier InPost - 18 zł"
                    checked={deliveryMethod === 'Kurier InPost - 18 zł'}
                    onChange={() => setDeliveryMethod('Kurier InPost - 18 zł')}
                  />
                  Kurier InPost - 18 zł
                </label>
                {deliveryMethod === 'Paczkomat' && (
                  <div style={{ height: '500px' }} className='py-2'>
                      <InpostGeowidgetReact
                        token = { token }
                        identifier= { identifier }
                        apiReady={ apiReady } 
                        pointSelect={ pointSelect }
                      />
                  </div>
                )}
                {/* Możliwość wyboru innych metod */}

                {['Kurier DPD - 18 zł', 'Kurier InPost - 18 zł'].includes(deliveryMethod) && (
                  <div className='flex flex-col space-y-3'>
                    <h1 className="text-2xl md:text-3xl tracking-widest text-center pt-5">
                      Adres dostawy
                    </h1>
                    <input
                      type="text"
                      placeholder="Ulica"
                      value={address.street}
                      className='ring-1 ring-slate-200 p-2 rounded-lg shadow-md'
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Miasto"
                      value={address.city}
                      className='ring-1 ring-slate-200 p-2 rounded-lg shadow-md'
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Kod pocztowy"
                      value={address.zip}
                      className='ring-1 ring-slate-200 p-2 rounded-lg shadow-md'
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    />
                  </div>
                )}
              </div>
              <div className='flex flex-col text-xl space-y-3'>
                <h1 className="text-2xl md:text-3xl tracking-widest text-center pt-5">
                  Metoda płatności
                </h1>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                  />
                  Płatność online
                </label>
                {/* <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  Płatność za pobraniem
                </label> */}
              </div>
              <div className='flex flex-col text-xl py-2 space-y-2'>
                <h1 className="text-2xl md:text-3xl tracking-widest text-center px-2 pt-4 pb-4">
                  Dane kontaktowe
                </h1>
                <input
                  type="name"
                  placeholder="Imię i nazwisko"
                  value={customerData.name}
                  className='ring-1 ring-slate-200 p-2 rounded-lg shadow-md'
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={customerData.email}
                  className='ring-1 ring-slate-200 p-2 rounded-lg shadow-md'
                  onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="Telefon"
                  value={customerData.phone}
                  className='ring-1 ring-slate-200 p-2 rounded-lg shadow-md'
                  onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                />
              </div>
              {selectedPoint && (
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold text-xl">{selectedPoint.name}</h3>
                  <p>{selectedPoint.address.line1}, {selectedPoint.address.line2}</p>
                  <p>Godziny otwarcia: {selectedPoint.opening_hours}</p>
                  <p>Rodzaj płatności: {selectedPoint.payment_type[2]}</p>
                  <p>Funkcje: {selectedPoint.functions.join(', ')}</p>
                  <img src={selectedPoint.image_url} alt="Paczkomat" className="w-24 h-auto rounded-lg" />
                </div>
              )}
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
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { getSession } from "~/utils/session.server";
import { getCartData } from "./cart";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const { matchedItems, totalPrice } = await getCartData(session);
  const uniqueOrderId = uuidv4();

  const url = 'https://secure.snd.payu.com/pl/standard/user/oauth/authorize';
  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');
  data.append('client_id', process.env.PAYU_CLIENT_ID!);
  data.append('client_secret', process.env.PAYU_CLIENT_SECRET!);

  const response = await axios.post(url, data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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

  return json({ cart: matchedItems, totalPrice, paymentMethods, uniqueOrderId });
};

export default function Checkout() {
  const { cart, totalPrice, paymentMethods, uniqueOrderId } = useLoaderData();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const handlePaymentMethodChange = (methodValue: string) => {
    setSelectedPaymentMethod(methodValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ipResponse = await axios.get("https://api.ipify.org");
    const customerIp = ipResponse.data;

    try {
      const response = await axios.post('/utils/payu', {
        orderId: uniqueOrderId,
        customerIp,
        totalAmount: String(Math.round((totalPrice + 12.99) * 100)),
        paymentMethod: selectedPaymentMethod,
      });

      window.location.href = response.data.redirectUrl;
    } catch (error) {
      console.error('Błąd:', error);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Podsumowanie zamówienia</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
        {Object.values(cart).map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{item.name} {item.sizeName}</span>
            <span>{(item.stock)} x {(item.sizePrice)} zł</span>
          </div>
        ))}
        <div className="flex justify-between">
          <span>Przesyłka</span>
          <span>12.99 zł</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Suma</span>
          <span>{(totalPrice + 12.99).toFixed(2)} zł</span>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Wybierz metodę płatności</h2>
          <div className="justify-between gap-6 mt-4">
            {paymentMethods.payByLinks.map((method: { name: string, brandImageUrl: string, value: string }, index: number) => (
              <div key={index} className="p-1 rounded-lg flex flex-row text-center">
                <label htmlFor={method.value} className={`cursor-pointer flex items-center justify-center p-2 rounded-lg border-2 ${selectedPaymentMethod === method.value ? 'border-blue-500' : 'border-gray-300'}`}>
                  <img src={method.brandImageUrl} alt={method.name} width={50} className="mr-2" />
                  <span className="font-semibold">{method.name}</span>
                  <input type="radio" id={method.value} name="paymentMethod" value={method.value} checked={selectedPaymentMethod === method.value} onChange={() => handlePaymentMethodChange(method.value)} className="ml-2" />
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full p-2 text-lg font-medium text-white bg-black rounded" disabled={!selectedPaymentMethod}>
          Kupuję i płacę
        </button>
      </form>
    </main>
  );
}

import { LoaderFunction } from '@remix-run/node';
import fetch from 'node-fetch';

async function getCustomerIp(request: Request) {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Błąd przy pobieraniu IP:', error);
    return ''; // W razie błędu zwróci pusty ciąg
  }
}

export let action: LoaderFunction = async ({ request }) => {
  try {
    const customerIp = await getCustomerIp(request);
    const formData = new URLSearchParams(await request.text());
    const email = formData.get('email');
    const totalAmount = parseFloat(formData.get('totalAmount') || '0');

    // Walidacja danych
    if (!email || !totalAmount) {
      return new Response('Invalid data', { status: 400 });
    }

    // Pobranie tokena PayU
    const tokenResponse = await fetch(
      'https://secure.snd.payu.com/pl/standard/user/oauth/authorize',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.PAYU_CLIENT_ID as string,
          client_secret: process.env.PAYU_CLIENT_SECRET as string,
        }),
      }
    );

    const { access_token } = await tokenResponse.json();

    // Utworzenie zamówienia
    const orderResponse = await fetch(
      'https://secure.snd.payu.com/api/v2_1/orders',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifyUrl: 'https://artystazdrowia.com/notify',
          customerIp: customerIp, // IP klienta
          merchantPosId: process.env.PAYU_CLIENT_ID as string,
          description: 'Zakup w Twoim sklepie',
          currencyCode: 'PLN',
          totalAmount: totalAmount.toString(),
          buyer: {
            email,
          },
          products: [
            {
              name: 'Zakup',
              unitPrice: totalAmount.toString(),
              quantity: 1,
            },
          ],
        }),
      }
    );

    const result = await orderResponse.json();

    // Zwrócenie wyniku w formie odpowiedzi
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Błąd przy tworzeniu zamówienia', { status: 500 });
  }
};

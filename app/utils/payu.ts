import axios from 'axios';

const PAYU_API_URL = 'https://secure.snd.payu.com/api/v2_1';
const PAYU_CLIENT_ID = process.env.PAYU_CLIENT_ID!;
const PAYU_CLIENT_SECRET = process.env.PAYU_CLIENT_SECRET!;

// Funkcja do uzyskania tokenu dostępu
export async function getPayUAccessToken() {
  const url = `${PAYU_API_URL}/oauth/authorize`;
  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');
  data.append('client_id', PAYU_CLIENT_ID);
  data.append('client_secret', PAYU_CLIENT_SECRET);

  const response = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data.access_token;
}

// Funkcja do utworzenia zamówienia w PayU
export async function createPayUOrder(orderDetails: any) {
  const accessToken = await getPayUAccessToken();

  const url = `${PAYU_API_URL}/orders`;

  const orderData = {
    notifyUrl: 'https://artystazdrowia.com/notify',  // URL do powiadomienia po zakończeniu płatności
    continueUrl: 'https://artystazdrowia.com/return',  // URL do kontynuowania po płatności
    customerIp: orderDetails.customerIp,
    merchantPosId: PAYU_CLIENT_ID,  // ID sklepu
    description: `Zamówienie nr ${orderDetails.orderId}`,  // Opis zamówienia
    currencyCode: 'PLN',
    totalAmount: orderDetails.totalAmount,  // Kwota całkowita w groszach
    extOrderId: orderDetails.orderId,  // Unikalny ID zamówienia
    buyer: {
      email: orderDetails.buyerEmail,
      phone: orderDetails.buyerPhone,
      firstName: orderDetails.buyerFirstName,
      lastName: orderDetails.buyerLastName,
      language: 'pl',
    },
    products: orderDetails.products.map((product: any) => ({
      name: product.name,
      unitPrice: product.unitPrice,  // Cena jednostkowa w groszach
      quantity: product.quantity,  // Ilość
    })),
  };

  const response = await axios.post(url, orderData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  return response.data;
}

// Funkcja do potwierdzenia płatności
export async function confirmPayment(paymentId: string) {
  const accessToken = await getPayUAccessToken();

  const url = `${PAYU_API_URL}/payments/${paymentId}/status`;

  const response = await axios.get(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  return response.data;
}

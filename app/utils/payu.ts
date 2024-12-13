import axios from 'axios';

const PAYU_API_URL = 'https://secure.snd.payu.com/api/v2_1';
const PAYU_CLIENT_ID = process.env.PAYU_CLIENT_ID!;
const PAYU_CLIENT_SECRET = process.env.PAYU_CLIENT_SECRET!;

async function getPayUAccessToken() {
  const response = await axios.post(`${PAYU_API_URL}/oauth/authorize`, new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: PAYU_CLIENT_ID,
    client_secret: PAYU_CLIENT_SECRET
  }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

  return response.data.access_token;
}

async function createPayUOrder(orderDetails: any) {
  const accessToken = await getPayUAccessToken();
  
  const response = await axios.post(`${PAYU_API_URL}/orders`, {
    notifyUrl: 'https://artystazdrowia.com/notify',
    continueUrl: 'https://artystazdrowia.com/return',
    customerIp: orderDetails.customerIp,
    merchantPosId: PAYU_CLIENT_ID,
    description: `Zamówienie nr ${orderDetails.orderId}`,
    currencyCode: 'PLN',
    totalAmount: orderDetails.totalAmount,
    extOrderId: orderDetails.orderId,
    buyer: orderDetails.buyer,
    products: orderDetails.products
  }, { headers: { 'Authorization': `Bearer ${accessToken}` } });

  return response.data;
}

async function confirmPayment(paymentId: string) {
  const accessToken = await getPayUAccessToken();

  const response = await axios.get(`${PAYU_API_URL}/payments/${paymentId}/status`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  return response.data;
}

export { createPayUOrder, confirmPayment };

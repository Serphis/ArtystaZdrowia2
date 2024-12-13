import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import PayU from 'payu-websdk';

// Funkcja pomocnicza do obsługi błędów
export const errorUtils = {
  getError: (error: any) => {
    let e = error;
    if (error.response) {
      e = error.response.data;
      if (error.response.data && error.response.data.error) {
        e = error.response.data.error;
      }
    } else if (error.message) {
      e = error.message;
    } else {
      e = 'Nieznany błąd';
    }
    return e;
  },
};

// Funkcja do uzyskania tokenu dostępu OAuth
export const getAccessToken = async () => {
  const url = 'https://secure.snd.payu.com/pl/standard/user/oauth/authorize';
  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');
  data.append('client_id', process.env.PAYU_CLIENT_ID!);
  data.append('client_secret', process.env.PAYU_CLIENT_SECRET!);

  try {
    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data.access_token;
  } catch (error: any) {
    throw new Error(errorUtils.getError(error));
  }
};

// Funkcja do tworzenia zamówienia
export const createOrder = async (
  formData: any,
  cart: any,
  totalAmount: number,
  customerIp: string
) => {
  const accessToken = await getAccessToken();
  
  const orderData = {
    notifyUrl: 'https://artystazdrowia.com/notify',
    redirectUri: 'https://artystazdrowia.com/return',
    customerIp: customerIp,
    merchantPosId: process.env.PAYU_POS_ID!,
    description: 'Zamówienie z Artysta Zdrowia',
    currencyCode: 'PLN',
    totalAmount: totalAmount,
    extOrderId: uuidv4(),
    buyer: {
      email: formData.email,
      phone: formData.phone,
      firstName: formData.firstName,
      lastName: formData.lastName,
      language: 'pl',
    },
    products: Object.keys(cart).map((key: string) => ({
      name: cart[key].name,
      unitPrice: String(cart[key].sizePrice * 100),
      quantity: cart[key].quantity,
    })),
  };

  try {
    const response = await axios.post(
      'https://secure.snd.payu.com/api/v2_1/orders',
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(errorUtils.getError(error));
  }
};

// Funkcja do sprawdzania statusu zamówienia
export const checkOrderStatus = async (orderId: string) => {
  const accessToken = await getAccessToken();
  
  try {
    const response = await axios.get(
      `https://secure.snd.payu.com/api/v2_1/orders/${orderId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(errorUtils.getError(error));
  }
};

// Funkcja do anulowania zamówienia
export const cancelOrder = async (orderId: string) => {
  const accessToken = await getAccessToken();
  
  try {
    const response = await axios.delete(
      `https://secure.snd.payu.com/api/v2_1/orders/${orderId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(errorUtils.getError(error));
  }
};

// Funkcja obsługująca powiadomienia (notifyUrl)
export const handleNotification = (req: any, res: any) => {
  const notificationData = req.body;
  const orderId = notificationData.orderId;
  
  // Zapisz status zamówienia lub wykonaj inne operacje
  checkOrderStatus(orderId)
    .then(orderStatus => {
      // Przetwarzanie statusu zamówienia
      console.log('Status zamówienia:', orderStatus);
      res.status(200).send('OK');
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

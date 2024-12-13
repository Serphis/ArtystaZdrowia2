import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest, NextApiResponse } from 'next';
import PayU from 'payu-websdk';

export const errorUtils = {
  getError: (error) => {
    let e = error;
    if (error.response) {
      e = error.response.data;
      if (error.response.data && error.response.data.error) {
        e = error.response.data.error;
      }
    } else if (error.message) {
      e = error.message;
    } else {
      e = "Unknown error occured";
    }
    return e;
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { formData, cart, totalAmount, customerIp } = req.body;

      const payuClient = new PayU({
        key: process.env.PAYU_POS_ID,
        salt: process.env.PAYU_SECOND_KEY,
      }, "TEST");

      const url = 'https://secure.snd.payu.com/pl/standard/user/oauth/authorize';
      const data = new URLSearchParams();
      data.append('grant_type', 'client_credentials');
      data.append('client_id', process.env.PAYU_CLIENT_ID!);
      data.append('client_secret', process.env.PAYU_CLIENT_SECRET!);

      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const accessToken = response.data.access_token;

      const orderData = {
        notifyUrl: 'https://artystazdrowia.com/notify',
        redirectUri: "https://artystazdrowia.com/return",
        customerIp: customerIp,
        merchantPosId: process.env.PAYU_POS_ID,
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
        products: Object.keys(cart).map((key) => ({
          name: cart[key].name,
          unitPrice: String(cart[key].sizePrice * 100),
          quantity: cart[key].quantity,
        })),
      };

      const paymentResponse = await axios.post(
        'https://secure.snd.payu.com/api/v2_1/orders',
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      res.status(200).json(paymentResponse.data);
    } catch (error: any) {
      const errorMessage = errorUtils.getError(error);
      const errorMessage2 = error.response ? error.response.data.error : error.message;
      alert(`Wystąpił błąd: ${errorMessage2}`);
      console.error(errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
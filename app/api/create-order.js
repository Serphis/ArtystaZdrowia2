const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { email, totalAmount } = req.body;

    try {
      // 1. Uzyskanie tokena autoryzacyjnego PayU
      const tokenResponse = await axios.post(
        'https://secure.snd.payu.com/pl/standard/user/oauth/authorize',
        {
          grant_type: 'client_credentials',
          client_id: process.env.PAYU_CLIENT_ID,
          client_secret: process.env.PAYU_CLIENT_SECRET,
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // 2. Utworzenie zamówienia w PayU
      const orderResponse = await axios.post(
        'https://secure.snd.payu.com/api/v2_1/orders',
        {
          notifyUrl: 'https://artystazdrowia.com/api/notify',
          customerIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          merchantPosId: process.env.PAYU_CLIENT_ID,
          description: 'Zamówienie z Artysta Zdrowia',
          currencyCode: 'PLN',
          totalAmount: totalAmount.toString(), // np. 10000 groszy
          buyer: { email },
          products: [
            {
              name: 'Usługa medyczna',
              unitPrice: totalAmount.toString(),
              quantity: 1,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // 3. Przekazanie redirectUri do frontendu
      res.status(200).json({ redirectUri: orderResponse.data.redirectUri });
    } catch (err) {
      console.error("Błąd w create-order.js:", err);
      res.status(500).json({ error: 'Coś poszło nie tak.' });
    }
  } else {
    res.status(405).json({ error: 'Metoda niedozwolona.' });
  }
};
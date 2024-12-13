const fetch = require('node-fetch');

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { email, totalAmount } = req.body;

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
            client_id: process.env.PAYU_CLIENT_ID,
            client_secret: process.env.PAYU_CLIENT_SECRET,
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
            customerIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            merchantPosId: process.env.PAYU_CLIENT_ID,
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

      if (result.redirectUri) {
        res.status(200).json({ redirectUri: result.redirectUri });
      } else {
        res.status(500).json({ error: 'Nie udało się utworzyć zamówienia' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Błąd serwera' });
    }
  } else {
    res.status(405).json({ error: 'Metoda niedozwolona' });
  }
};

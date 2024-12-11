import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { orderData } = req.body;

      const response = await axios.post('https://secure.snd.payu.com/api/v2_1/orders', orderData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.PAYU_ACCESS_TOKEN}`, // Wstaw swój token dostępu
        },
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error('Błąd podczas komunikacji z PayU:', error);
      res.status(500).json({ error: 'Błąd podczas przetwarzania zamówienia' });
    }
  } else {
    res.status(405).json({ error: 'Metoda nieobsługiwana' });
  }
}

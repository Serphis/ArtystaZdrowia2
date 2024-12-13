import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Endpoint do utworzenia zamówienia w PayU
app.post('/api/create-order', async (req, res) => {
  const { totalAmount, firstName, lastName, email, streetAddress1, postalCode, city, phone } = req.body;

  try {
    const response = await axios.post('https://secure.payu.com/api/v2_1/orders', {
      order: {
        notify_url: process.env.PAYU_NOTIFY_URL,
        customer_ip: req.ip,
        merchant_pos_id: process.env.PAYU_POS_ID,
        ext_order_id: `order-${Date.now()}`,
        total_amount: totalAmount,
        currency_code: 'PLN',
        products: [
          {
            name: 'Produkt',
            unit_price: totalAmount,
            quantity: 1
          }
        ],
        buyer: {
          email: email,
          phone: phone,
          first_name: firstName,
          last_name: lastName,
          delivery_address: {
            street: streetAddress1,
            city: city,
            postal_code: postalCode
          }
        }
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYU_CLIENT_SECRET}`
      }
    });

    // Odpowiedź z PayU
    if (response.data.status.status_code === 'SUCCESS') {
      res.json({ redirect_url: response.data.redirect_uri });
    } else {
      res.status(500).json({ error: 'Błąd podczas tworzenia zamówienia' });
    }
  } catch (error) {
    console.error('Błąd komunikacji z PayU', error);
    res.status(500).json({ error: 'Błąd podczas komunikacji z PayU' });
  }
});

// Nasłuchiwanie na porcie
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});

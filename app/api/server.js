import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config(); // Załadowanie zmiennych środowiskowych z pliku .env

const app = express();
app.use(bodyParser.json()); // Middleware do parsowania JSON

const PORT = import.meta.env.PORT || 5000;

// Endpoint do tworzenia zamówienia w PayU
app.post('/api/create-order', (req, res) => {
  const { orderData } = req.body;

  // Pobranie zmiennych środowiskowych z pliku .env
  const payuClientId = import.meta.env.PAYU_CLIENT_ID;
  const payuClientSecret = import.meta.env.PAYU_CLIENT_SECRET;
  const payuApiUrl = import.meta.env.PAYU_API_URL;

  // Logika komunikacji z PayU - tutaj możesz dodać kod do połączenia z API PayU

  // Przykład danych, które wysyłasz do PayU
  const payuRequestData = {
    client_id: payuClientId,
    client_secret: payuClientSecret,
    order_id: orderData.orderId,
    total_amount: orderData.totalAmount,
    currency_code: 'PLN',
    country: 'PL',
    customer_ip: '127.0.0.1',
    product_name: 'swieczka',
    total_tax: 0,
    shipping_cost: orderData.shippingCost,
    first_name: orderData.firstName,
    last_name: orderData.lastName,
    email: orderData.email,
    phone: orderData.phone,
    address: orderData.streetAddress1,
    postal_code: orderData.postalCode,
    city: orderData.city,
    terms_accepted: orderData.termsAccepted,
  };

  // Symulacja żądania do PayU
  function createPayuOrder(requestData) {
    // Tutaj musisz wysłać zapytanie do PayU (np. za pomocą Axios, Fetch)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          redirect_url: 'https://payu.pl/redirect-url', // Przykładowy URL
        });
      }, 1000);
    });
  }

  createPayuOrder(payuRequestData)
    .then((response) => {
      // Zwrócenie URL do przekierowania na frontend
      res.json({ redirect_url: response.redirect_url });
    })
    .catch((error) => {
      console.error('Błąd podczas komunikacji z PayU', error);
      res.status(500).json({ error: 'Błąd płatności' });
    });
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
});

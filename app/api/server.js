const express = require('express');
const app = express();
const createOrder = require('./api/create-order');

app.use(express.json());

// Routing do create-order
app.post('/api/create-order', createOrder);

// Start serwera
app.listen(3000, () => {
  console.log('Serwer działa na porcie 3000');
});
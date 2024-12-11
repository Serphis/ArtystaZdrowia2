import axios from 'axios';

async function handlePaymentRequest(paymentData) {
    try {
      const response = await axios.post('https://api.paymentgateway.com/pay', paymentData, {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Payment request failed', error);
      throw new Error('Payment failed');
    }
}


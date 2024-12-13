import React, { useState } from 'react';

export default function Checkout() {
  const [formData, setFormData] = useState({
    email: '',
    totalAmount: 10000, // 100 PLN w groszach
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('totalAmount', formData.totalAmount.toString());

      const response = await fetch('create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSend.toString(),
      });

      const { redirectUri } = await response.json();

      if (redirectUri) {
        window.location.href = redirectUri; // Przekierowanie do PayU
      } else {
        console.error('Brak odpowiedzi z backendu.');
      }
    } catch (err) {
      console.error('Błąd podczas tworzenia zamówienia:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Przejdź do PayU</button>
    </form>
  );
}

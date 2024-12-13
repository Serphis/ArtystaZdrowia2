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
      const response = await fetch('create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: formData.email,
          totalAmount: formData.totalAmount.toString(),
        }).toString(),
      });
  
      const data = await response.json(); // Sprawdzamy odpowiedź w formacie JSON
      alert(JSON.stringify(data)); // Wyświetlamy całą odpowiedź z serwera w alert
    } catch (err) {
      console.error('Błąd podczas wysyłania zapytania do create-order:', err);
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

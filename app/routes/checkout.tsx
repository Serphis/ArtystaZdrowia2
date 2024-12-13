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
    
    alert('Funkcja handleSubmit została wywołana!');
    
    try {
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('email', 'test@example.com');
      formDataToSend.append('totalAmount', '100');
      
      const response = await fetch('create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSend.toString(),
      });
  
      const text = await response.text();
      alert('Odpowiedź z serwera: ' + text);
    } catch (err) {
      alert('Błąd w handleSubmit: ' + err.message);
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

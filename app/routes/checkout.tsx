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
  
    // Sprawdzenie, czy funkcja jest wywoływana
    alert('Funkcja handleSubmit została wywołana!');  // To sprawi, że pojawi się okno alertu
  
    try {
      // To tylko przykładowa operacja, która na pewno coś zrobi
      const formDataToSend = new URLSearchParams();
      formDataToSend.append('email', 'test@example.com');  // Przykładowe dane
      formDataToSend.append('totalAmount', '100');  // Przykładowa kwota
  
      // Fake request do serwera
      const response = await fetch('create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataToSend.toString(),
      });
  
      // Sprawdzenie odpowiedzi
      const data = await response.json();
      alert('Odpowiedź z serwera: ' + JSON.stringify(data));
  
    } catch (err) {
      // Jeżeli coś pójdzie nie tak, pokażemy alert z błędem
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

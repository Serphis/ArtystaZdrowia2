import { json } from '@remix-run/node';

// Konfiguracja do API InPost
const INPOST_API_URL = 'https://api-shipx-pl.easypack24.net/v1';
const INPOST_API_KEY = process.env.INPOST_API_KEY;

// Endpoint do obsługi InPost
export const action = async ({ request }: { request: Request }) => {
  if (request.method === 'POST') {
    try {
      const { parcelLocker, customerData } = await request.json(); // Dane z frontendu
      if (!parcelLocker || !customerData) {
        return json({ error: 'Brak wymaganych danych' }, { status: 400 });
      }

      // Przykład tworzenia przesyłki
      const response = await fetch(`${INPOST_API_URL}/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${INPOST_API_KEY}`,
        },
        body: JSON.stringify({
          receiver: {
            email: customerData.email,
            phone: customerData.phone,
          },
          parcelLocker,
          parcels: [
            {
              dimensions: {
                length: 30, // Wymiary paczki w cm
                width: 30,
                height: 30,
              },
            },
          ],
          service: 'inpost_locker_standard',
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        return json({ error: result.error || 'Błąd InPost API' }, { status: 500 });
      }

      return json({ shipmentId: result.id });
    } catch (error) {
      console.error('Błąd podczas komunikacji z InPost API:', error);
      return json({ error: 'Błąd podczas tworzenia przesyłki' }, { status: 500 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
};

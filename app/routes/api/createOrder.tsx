export const action = async ({ request }: { request: Request }) => {
  if (request.method === "POST") {
    const { orderData } = await request.json();
    try {
      const response = await axios.post('https://secure.snd.payu.com/api/v2_1/orders', orderData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.PAYU_ACCESS_TOKEN}`,
        },
      });
      return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
      console.error("Błąd komunikacji z PayU:", error);
      return new Response("Błąd podczas przetwarzania zamówienia", { status: 500 });
    }
  }
  return new Response("Metoda nieobsługiwana", { status: 405 });
};
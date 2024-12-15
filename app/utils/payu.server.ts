// import { json } from '@remix-run/node';
// import { createPayUOrder } from '~/utils/payu';

// export const action = async ({ request }) => {
//     const data = await request.json();
  
//     const orderDetails = {
//         orderId: data.orderId,  // Unikalny ID zamówienia
//         customerIp: data.customerIp,  // IP klienta
//         totalAmount: data.totalAmount,  // Kwota całkowita (w groszach)
//         buyerEmail: data.buyerEmail,
//         buyerPhone: data.buyerPhone,
//         buyerFirstName: data.buyerFirstName,
//         buyerLastName: data.buyerLastName,
//         products: data.products,  // Lista produktów w zamówieniu
//     };

//     try {
//         const orderResponse = await createPayUOrder(orderDetails);

//         // Zwróć URL do przekierowania na stronę PayU
//         return json({ redirectUrl: orderResponse.redirectUri });
//         } catch (error) {
//         return json({ error: 'Błąd podczas tworzenia zamówienia' }, { status: 500 });
//         }
// };

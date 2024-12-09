import { json, ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
    const notification = await request.json();
  
    console.log("Powiadomienie od PayU:", notification);
  
    if (notification.order.status === "COMPLETED") {
      // Zaktualizuj status zamówienia w bazie danych
    }
  
    return json({ received: true });
  };

export default function Notify() {
    return null;
}

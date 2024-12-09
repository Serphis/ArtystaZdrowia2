export const action: ActionFunction = async ({ request }) => {
    const notification = await request.json();
    console.log("Powiadomienie o płatności:", notification);

    // Zaktualizuj status zamówienia w bazie danych

    return json({ received: true });
};

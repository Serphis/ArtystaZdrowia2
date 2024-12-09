import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const orderId = url.searchParams.get("orderId");
    const status = url.searchParams.get("status");
      return json({ orderId, status });
};

export default function ReturnPage() {
    const { orderId, status } = useLoaderData();

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">Status płatności</h1>
            {status === "SUCCESS" && (
                <p className="text-green-600">Płatność została pomyślnie zrealizowana.</p>
            )}
            {status === "CANCELED" && (
                <p className="text-red-600">Płatność została anulowana.</p>
            )}
            {status === "PENDING" && (
                <p className="text-yellow-600">Płatność jest w toku. Poczekaj chwilę.</p>
            )}
            {!status && (
                <p className="text-gray-600">Nie udało się uzyskać statusu płatności.</p>
            )}
        </main>
    );
}

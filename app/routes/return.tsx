import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const orderId = url.searchParams.get("orderId");
    const status = url.searchParams.get("status");
      return json({ orderId, status });
};

export default function SuccessPage() {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">Dziękujemy za zakupy!</h1>
        </main>
    );
}
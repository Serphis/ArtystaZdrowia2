import { Link } from "@remix-run/react";
import { requireAdmin } from '../utils/auth.server'; 
import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
    await requireAdmin(request);
    return null;
}  

export default function AdminPanel() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center font-serif">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-light tracking-widest text-center mb-6">
          Panel Administratora
        </h1>
        <div className="space-y-4">
          <Link
            to="/admin/order/list"
            className="block text-center bg-slate-200 text-black px-6 py-3 rounded-md font-medium hover:text-white hover:bg-slate-800 transition"
          >
            Przejdź do listy zamówień
          </Link>
          <Link
            to="/admin/product/stock"
            className="block text-center bg-slate-200 text-black px-6 py-3 rounded-md font-medium hover:text-white hover:bg-slate-800 transition"
          >
            Przejdź do stanów magazynowych
          </Link>
        </div>
      </div>
    </main>
  );
}

import { LoaderFunction, json, ActionFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '../services/index';
import { Link } from 'react-router-dom';
import { getUserSession } from "../utils/auth.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "ArtystaZdrowia" },
    { name: "description", content: "Candle store" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionData = await getUserSession(request);

  if (!sessionData || !sessionData.userId) {
    return { userId: null, isAdmin: false, products: [] };
  }

  const user = await db.user.findUnique({
    where: { id: sessionData.userId },
  });

  if (!user) {
    return { userId: null, isAdmin: false, products: [] };
  }

  const products = await db.product.findMany();

  return { userId: sessionData.userId, isAdmin: user.isAdmin, products };
};

// export const loader: LoaderFunction = async () => {
//   const products = await db.product.findMany();

//   return json({ products });
// };

export default function ProductList(){
    let products = [];
    let userId = null;
    let isAdmin = false;
  
    const data = { userId, isAdmin, products } = useLoaderData() || { userId: null, isAdmin: false, products: [] };
  
    return (
      <main className="font-serif">
        <form method="post">
          <div className="p-8 w-full rounded-md bg-[#f2e4ca]">
            <h1 className="text-3xl flex justify-center font-light tracking-widest text-[#584d48]">
              Nasze produkty
            </h1>
            <div className="py-8">
              {products ? (
                <div className="flex flex-row flex-wrap justify-center gap-5">
                  {products.map((Product: Product) => {
                    return (
                      <div key={Product.id}>
                        <div className="flex flex-col w-60 md:w-80">
                            <Link
                                to={`/${Product.id}`}
                                className="hover:bg-[#d2c6af] text-[#f2e4ca] text-sm font-medium p-1 rounded-2xl"
                                >
                                <div className="flex flex-col items-center">
                                    <div className="mx-3 pt-3 pb-2">
                                    <img src={Product.image} alt="Opis zdjęcia" className='w-80 h-80 object-cover rounded-lg ring-1 ring-[#584d48]' />
                                    </div>
                                </div>
                                <div className="text-center text-sm text-[#7b6b63] pt-2 px-2">
                                {Product.name}
                                </div>
                            </Link>
                        </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div>Brak produktów</div>
              )}
            </div>
          </div>
        </form>
      </main>
    );
  }

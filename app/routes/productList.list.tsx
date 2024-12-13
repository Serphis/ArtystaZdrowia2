import { LoaderFunction, json, ActionFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '../services/index';
import { Link } from 'react-router-dom';


export const loader: LoaderFunction = async ({ request }) => {
  
  const products = await db.product.findMany({
    include: { sizes: true },
  });

  return json({ products });
};

export default function ProductList(){
    const { products = [] } = useLoaderData();
  
    const validProducts = products.filter(
      (Product) => Product.name && Product.image && Product
    );

    return (
      <main className="font-serif">
        <form method="post">
          <div className="p-8 w-full rounded-md bg-white">
            <h1 className="text-3xl flex justify-center font-light tracking-widest">
              Nasze produkty
            </h1>
            <div className="py-8">
              {validProducts.length > 0  ? (
                <div className="flex flex-row flex-wrap justify-center gap-5">
                  {validProducts.map((Product) => {
                    return (
                      <div key={Product.id}>
                        <div className="flex flex-col w-60 md:w-80 ">
                          <Link to={`/productList/${Product.id}`}
                                className="transition duration-500 ease-in-out hover:bg-slate-100 hover:text-slate-800 font-medium p-1 pb-2 rounded-2xl"
                                >
                                <div className="flex flex-col items-center">
                                    <div className="mx-3 pt-3 pb-2">
                                    <img src={Product.image} alt="Opis zdjęcia" className='w-80 h-80 object-cover rounded-lg ring-1 ring-black' />
                                    </div>
                                </div>
                                <div className="text-center text-md py-2 px-2">
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

import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Artysta Zdrowia" },
    { name: "description", content: "Ręcznie robione świece" },
  ];
};

const HorizontalLine: React.FC<{ width: string }> = ({ width }) => {
  return (
    <svg width={width} height="1" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="1" />
    </svg>
  );
};

export default function Index() {
  
  return (
    <div className="bg-white font-light tracking-widest">
      <section className="text-center pt-12 flex flex-row justify-center">
        <div className="p-2 sm:py-8 flex flex-col sm:mr-12 lg:mr-28 xl:mr-40">
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-center lg:tracking-wide p-2 sm:p-4 mb-2 sm:mb-10 lg:mb-32">RĘCZNIE ROBIONE</h2>
          <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl text-center lg:tracking-wide p-2 sm:p-4 mb-2 sm:mb-10 lg:mb-24">W DOMOWYM ZACISZU</h2>
          <h2 className="text-base sm:text-l md:text-2xl lg:text-3xl text-center lg:tracking-wide p-2 sm:p-4">IDEALNY POMYSŁ NA PREZENT</h2>
        </div>
        <div className="w-36 sm:w-60 md:w-72 lg:w-96">
          <img src="https://res.cloudinary.com/djio9fbja/image/upload/v1733048713/public/lzaavy3qk8ihcxtrucib.jpg" alt="Opis zdjęcia" className='object-cover ring-1 ring-black rounded-2xl mr-4 shadow-md' />
        </div>
      </section>

      <div className="flex justify-center pt-20 py-20">
        <HorizontalLine width="90%" />
      </div>

      <section className="text-center px-4 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-light tracking-widest p-6">Jesteśmy dumni z naszego zobowiązania do ochrony naszej planety</h2>
        <h2 className="text-2xl font-light tracking-widest p-2 sm:p-6 sm:w-4/5 lg:w-3/5">Każdy krok w procesie produkcji jest starannie przemyślany. Nasze materiały pochodzą z ekologicznych źródeł, a nasza produkcja jest zoptymalizowana pod kątem redukcji odpadów i zużycia wody.</h2>
        <h2 className="text-4xl font-light tracking-widest p-6 flex flex-row">
          Eco-Friendly Materiały
          <img src="https://res.cloudinary.com/djio9fbja/image/upload/v1733249828/public/ecoleaf.png" alt="Opis zdjęcia" className='h-10 pl-4 object-cover opacity-70' />
        </h2>
        <h2 className="text-4xl font-light tracking-widest p-6 flex flex-row-reverse">
          Długotrwała Jakość
          <img src="https://res.cloudinary.com/djio9fbja/image/upload/v1733249829/public/quality.png" alt="Opis zdjęcia" className='h-10 pr-4 object-cover opacity-50' />
        </h2>
      </section>

      <div className="flex justify-center py-16">
        <HorizontalLine width="90%" />
      </div>

      <section className="text-center px-4 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-light tracking-widest p-6 pt-10">KUPUJĄC NASZE PRODUKTY WSPIERASZ </h2>
        <h2 className="text-3xl font-light tracking-widest p-6">ZATRUDNIENIE OSÓB WYKLUCZONYCH SPOŁECZNIE</h2>
        <h2 className="text-4xl font-light tracking-widest p-6">DZIĘKUJEMY, ŻE JESTEŚCIE Z NAMI</h2>

        <div className="flex justify-center pt-6 pb-10">
          <img src="https://res.cloudinary.com/djio9fbja/image/upload/v1733246569/public/heart.png" alt="Opis zdjęcia" className='h-20 object-cover' />
        </div>
      </section>
    </div>
  );
}

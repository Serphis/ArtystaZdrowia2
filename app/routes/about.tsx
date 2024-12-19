import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <section className="bg-white w-full font-light tracking-wide mx-4 sm:mx-14 md:mx-36 lg:mx-56 xl:mx-80">
        <div className="text-center flex flex-col">
            <h2 className="text-5xl text-center my-10 mb-12">O firmie</h2>
            <div>
                <h3 className="text-3xl mb-6 text-center">Artysta Zdrowia Sp. z o.o.</h3>
                <p className="text-xl">
                    Jesteśmy jedynym przedsiębiorstwem społecznym na terenie powiatu Sochaczewskiego. Inspiracją do założenia firmy była Fundacja Pomocy Osobom z Chorobą Alzheimera. "Artysta Zdrowia" opiera swoją działalność na trzech filarach:
                </p>
                <ul className="text-xl px-8 pt-4 pb-6 text-center">
                    <li className="py-1">- Zabiegi rehabilitacyjne i branża beauty</li>
                    <li className="py-1">- Dogoterapia i felinoterapia</li>
                    <li className="py-1">- Produkcja ręcznie robionych świec</li>
                </ul>
            </div>

            <div className="text-3xl px-4 py-3 mb-6 text-center">
                <h3 className="text-3xl pb-3 text-center">Nasze świece</h3>
                <p className="text-lg">
                    Wykonane w 100% z wosku sojowego i naturalnych olejków zapachowych. Nie zawierają składników pochodzenia zwierzęcego i są zgodne z normami alergologicznymi.
                </p>
            </div>
            <div className="text-3xl px-4 py-3 mb-6 text-center">
                <h3 className="text-3xl pb-3 text-center">Nasza misja</h3>
                <p className="text-lg">
                    Dochód przeznaczamy na zatrudnienie osób wykluczonych społecznie oraz realizację celów statutowych. Kupując nasze produkty, wspierasz tę misję.
                </p>
            </div>
        </div>
    </section>
  );
}

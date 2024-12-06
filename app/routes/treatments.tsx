import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <section className="bg-white font-light tracking-wide p-6 mx-4 sm:mx-14 md:mx-24 lg:mx-40 xl:mx-60">
        <div className="text-center flex flex-col">
            <div>
                <h3 className="text-4xl md:text-5xl my-6 mb-8">Zabiegi fizjoterapeutyczne</h3>
                <p className="text-xl font-light">
                    Prądy małej i dużej częstotliwości, laser, pole magnetyczne, solux,
                    krioterapia, ultradźwięki. Zabiegi wykonywane na nowych sprzętach nowej
                    technologii firmy Astar. Indywidualny dobór ćwiczeń w zależności od
                    schorzenia i jednostek chorobowych.
                </p>
            </div>

            <div>
                <h3 className="text-3xl md:text-4xl mt-8 mb-3">Masaż</h3>
                <ul className="text-xl space-y-2 text-center">
                    <li>- Relaksacyjny</li>
                    <li>- Kobido</li>
                </ul>
            </div>

            <div>
                <h3 className="text-3xl md:text-4xl mt-6 mb-3">Endermologia</h3>
                <p className="text-xl font-light">
                    Nowoczesne urządzenie BSS do modelowania sylwetki i redukcji tkanki
                    tłuszczowej wyposażone w 4 głowice zabiegowe. Zabiegi skutecznie
                    wspomagają walkę z cellulitem, wiotką skórą i nadmiarem tkanki
                    tłuszczowej.
                </p>
                <ul className="list-inside space-y-2 py-4 text-xl">
                    <li>- Ujędrnianie skóry na twarzy i ciele</li>
                    <li>- Redukcja cellulitu</li>
                    <li>- Modelowanie sylwetki</li>
                </ul>
            </div>

            <div>
                <h3 className="text-3xl md:text-4xl mt-6 mb-3">Fala uderzeniowa</h3>
                <p className="text-xl font-light text-justify">
                    Terapia falą uderzeniową to skuteczna metoda walki z cellulitem i
                    wiotkością skóry. Zwiększa ukrwienie tkanek, wspomaga metabolizm i
                    redukcję depozytów tłuszczowych.
                </p>
                <ul className="space-y-2 py-4 text-xl text-center">
                    <li>- Cellulit II, III i IV stopnia</li>
                    <li>- Miejscowe depozyty tkanki tłuszczowej</li>
                    <li>- Nierówna struktura skóry</li>
                </ul>
                <p className="text-xl font-light">Zaleca się serię <strong>5–10</strong> zabiegów w odstępach <strong>5–7 dni</strong>.</p>
            </div>
        </div>
    </section>
  );
}

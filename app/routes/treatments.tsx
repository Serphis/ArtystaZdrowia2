import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <section className="bg-white font-light tracking-wide p-6 mx-4 sm:mx-14 md:mx-24 lg:mx-40 xl:mx-60">
        <div className="text-center flex flex-col">
            <div>
                <h3 className="text-4xl md:text-5xl my-6 mb-6">Zabiegi fizjoterapeutyczne</h3>
                <p className="text-xl text-justify">
                    Prądy mała i duża częstotliwość, laser, pole magnetyczne, solux,
                    krioterapia, ultradźwięki. Zabiegi wykonywane na nowych sprzętach nowej
                    technologii firmy Astar. Indywidualny dobór ćwiczeń w zależności od
                    schorzenia i jednostek chorobowych. 
                </p>
                <p className="text-xl font-normal text-center pt-2">
                    Od 17 zł - ustalane indywidualnie
                </p>
            </div>

            <div>
                <h3 className="text-4xl md:text-5xl mt-8 mb-6">Masaż</h3>
                <ul className="text-xl space-y-1 text-center">
                    <li className="font-semibold">Relaksacyjny</li>
                    <li>30 minut<p className="font-normal">90 zł</p></li>
                    <li>60 minut<p className="font-normal">180 zł</p></li>
                    <li className="font-semibold pt-2">Kobido</li>
                    <li>Czas 60/70 minut<p className="font-normal">200 zł</p></li>
                    <li className="pt-2">Suche igłowanie<p className="font-normal">wycena indywidualna</p></li>
                </ul>
            </div>

            <div>
                <h3 className="text-4xl md:text-5xl md:text-5xl mt-8 mb-6">Fala uderzeniowa</h3>
                <p className="text-xl font-light text-justify">
                    Terapia falą uderzeniową to skuteczna metoda walki z cellulitem i
                    wiotkością skóry. Zwiększa ukrwienie tkanek, wspomaga metabolizm i
                    redukcję depozytów tłuszczowych.
                </p>
                <ul className="space-y-2 py-4 text-xl text-justify">
                    <li className="font-normal">- Cellulit II, III i IV stopnia</li>
                    <li className="font-normal">- Miejscowe depozyty tkanki tłuszczowej</li>
                    <li className="font-normal">- Nierówna struktura skóry</li>
                </ul>
                <p className="text-xl font-light text-center">Zaleca się serię <strong className="font-semibold">5–10</strong> zabiegów w odstępach <strong className="font-semibold">5–7 dni</strong></p>
                <ul className="space-y-2 py-4 text-xl text-center">
                    <li>Boki <p className="font-normal">200 zł</p></li>
                    <li>Uda przód, tył i wewnętrzna strona <p className="font-normal">500 zł</p></li>
                    <li>Pośladki <p className="font-normal">300 zł</p></li>
                    <li>Ramiona <p className="font-normal">200 zł</p></li>
                    <li>Brzuch <p className="font-normal">200 zł</p></li>
                    <li>Przedramiona <p className="font-normal">200 zł</p></li>
                    <li>Pakiet 2 obszary 9 zabiegów + 1 gratis <p className="font-normal">3000 zł</p></li>
                    <li>
                    Fala uderzeniowa medyczna przy różnych schorzeniach <p className="font-normal">ustalana
                    indywidualnie</p>
                    </li>
                </ul>
            </div>

            <div>
                <h3 className="text-4xl md:text-5xl md:text-4xl mt-8 mb-6">Endermologia</h3>
                <p className="text-xl font-light text-justify">
                    Nowoczesne urządzenie BSS do modelowania sylwetki i redukcji tkanki
                    tłuszczowej wyposażone w 4 głowice zabiegowe. Zabiegi skutecznie
                    wspomagają walkę z cellulitem, wiotką skórą i nadmiarem tkanki
                    tłuszczowej.
                </p>
                <ul className="list-inside space-y-2 py-4 text-xl text-justify font-normal">
                    <li>- Ujędrnianie skóry na twarzy i ciele</li>
                    <li>- Redukcja cellulitu</li>
                    <li>- Modelowanie sylwetki</li>
                </ul>
                <ul className="text-xl">
                    <li>Pierwszy zabieg + konsultacja <p className="font-normal">200 zł</p></li>
                    <li>Ciało pakiet 10 zabiegów <p className="font-normal">1600 zł</p></li>
                    <li>Pojedynczy zabieg <p className="font-normal">160 zł</p></li>
                    <li>Pakiet 15 zabiegów <p className="font-normal">2400 zł</p></li>
                    <li>Pakiet 20 zabiegów <p className="font-normal">2500 zł</p></li>
                    <li>Twarz zabieg <p className="font-normal">100 zł</p></li>
                    <li className="pt-2">
                    Endermologia całe ciało gratis przy wykupionych pakietach
                    </li>
                    <li>
                    Przy większej ilości pakietów ceny ustalamy indywidualnie
                    </li>
                </ul>
            </div>
        </div>
    </section>
  );
}

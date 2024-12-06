import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="bg-white font-light tracking-wide mx-4 sm:mx-14 md:mx-24 lg:mx-40 xl:mx-60">
        <div className="text-center flex flex-col">
            <h2 className="text-4xl md:text-5xl text-center my-10 mb-12">Felinoterapia</h2>

            <div className="text-justify">
                <h3 className="text-xl px-4 py-1">- Spotkania z psem indywidualne <strong>150 zł</strong></h3>
                <h3 className="text-xl px-4 py-1">- Spotkania z psem grupowe <strong>ustalane indywidualnie</strong></h3>
                <h3 className="text-xl px-4 py-1">- Spotkania z kotem indywidualne <strong>150 zł</strong></h3>
                <h3 className="text-xl px-4 py-1">- Spotkania z kotem grupowe <strong>ustalane indywidualnie</strong></h3>
                <h3 className="text-xl px-4 py-1">- Spotkania wspólne (pies i kot) indywidualne <strong>250 zł</strong></h3>
                <h3 className="text-xl px-4 py-1">- Spotkania grupowe wspólne (pies i kot) <strong>ustalane indywidualnie</strong></h3>

                <h3 className="text-xl pt-8 text-justify">
                    <strong>Felinoterapia</strong> to terapia, w której towarzyszy pacjentowi kot. Koty to zwierzęta
                    bardzo tajemnicze, które jednak szybko potrafią zbudować specyficzną więź z człowiekiem. Zwierzę
                    „zmusza” osobę do uspokojenia się, opanowania gwałtownych ruchów tylko po to, aby dać się pogłaskać.
                    Towarzystwo kota poprawia humor, odciąga myśli od bólu czy osamotnienia. Zabawy z kotem często wywołują
                    uśmiech na twarzy, angażują pacjenta do wspólnej aktywności. Według badań przebywanie w obecności kota,
                    głaskanie i wspólna zabawa wzmagają wydzielanie endorfin, czyli tzw. hormonu szczęścia.
                </h3>

                <h3 className="text-xl pt-8 text-justify">
                    <strong>Felinoterapia</strong> jest polecana przede wszystkim osobom starszym, które zmagają się z chorobą
                    Alzheimera, Parkinsona, stwardnieniem rozsianym czy depresją. W tym przypadku felinoterapia polega na
                    opiece nad kotem, jego czesaniu, głaskaniu, karmieniu i wspólnej zabawie. Dzięki temu pacjent jest
                    zaangażowany do większej aktywności fizycznej. Starsza osoba ćwiczy swoje zdolności manualne, głównie
                    w obrębie dłoni i nadgarstków.
                </h3>

                <h3 className="text-xl pt-8 pb-8 text-justify">
                    Terapia z towarzystwem kota znajduje zastosowanie także u dzieci z autyzmem, zespołem Aspergera, ADHD,
                    czy dziecięcym porażeniem mózgowym. Podczas kontaktu z kotem dzieci uspokajają się, odprężają, stają
                    się bardziej otwarte na środowisko zewnętrzne.
                </h3>
            </div>
        </div>
    </div>
  );
}

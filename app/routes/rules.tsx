import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Regulamin - Artysta Zdrowia" },
    { name: "description", content: "Regulamin sklepu Artysta Zdrowia" },
  ];
};

const HorizontalLine: React.FC<{ width: string }> = ({ width }) => {
  return (
    <svg width={width} height="1" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="1" />
    </svg>
  );
};

export default function Rules() {
  return (
    <div className="bg-white font-light tracking-widest">
      <section className="text-center pt-12 px-4 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-light tracking-widest p-6">Regulamin</h1>

        <div className="flex justify-center pt-6 pb-10">
          <HorizontalLine width="90%" />
        </div>

        <div className="text-left w-full max-w-4xl px-6">
          <p className="text-xl font-light tracking-wider leading-relaxed test-justify mb-6">
            <p>REGULAMIN SKLEPU INTERNETOWEGO</p> 
            <p className="py-4">Artysta Zdrowia Z 2023-03-15</p>
            <p className="font-bold py-4">§1 Definicje</p>
            Użyte w Regulaminie pojęcia oznaczają:
            1. Klient – osoba fizyczna, osoba prawna, osoba fizyczna prowadząca działalność gospodarczą lub jednostka organizacyjna niebędąca osobą prawną, której przepisy szczególne przyznają zdolność prawną, która dokonuje Zamówienia w ramach Sklepu;
            2. Konsument – zgodnie z art. 22[1] Kodeksu Cywilnego oznacza osobę fizyczną dokonującą z przedsiębiorcą czynności prawnej niezwiązanej bezpośrednio z jej działalnością gospodarczą lub zawodową.
            3. Przedsiębiorca o prawach konsumenta- osoba fizyczna prowadząca działalność gospodarczą, która posiada część praw konsumenta zgodnie z art. 3855 Kodeksu Cywilnego.
            4. Kodeks Cywilny – ustawa z dnia 23 kwietnia 1964 r. (Dz.U. Nr 16, poz. 93 ze zm.);
            5. Regulamin – niniejszy Regulamin świadczenia usług drogą elektroniczną w ramach sklepu internetowego Artysta Zdrowia;
            6. Sklep internetowy (Sklep) – serwis internetowy dostępny pod www.artystazdrowia.com, za pośrednictwem którego Klient może w szczególności składać Zamówienia;
            7. Towar – produkty prezentowane w Sklepie Internetowym;
            8. Umowa sprzedaży – umowa sprzedaży Towarów w rozumieniu Kodeksu Cywilnego, zawarta pomiędzy  Artysta Zdrowia Sp z o.o. z siedzibą w Sochaczewie Kuznocin 67 96-500 Sochaczew wpisana do rejestru przedsiębiorców Krajowego Rejestru Sądowego prowadzonego przez Sąd Rejonowy dla Łodzi Śródmieścia w Łodzi   XX Wydział Gospodarczy pod numerem KRS 0001126884, NIP: 8371881619 , Regon: 529638894  a Klientem, zawierana z wykorzystaniem serwisu internetowego Sklepu;
            9. Ustawa o prawach konsumenta – ustawa z dnia 30 maja 2014 r. o prawach konsumenta (Dz.U. z 2014 r. poz. 827);
            10. Ustawa o świadczeniu usług drogą elektroniczną – ustawa z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną (Dz. U. Nr 144, poz. 1204 ze zm.);
            11. Zamówienie – oświadczenie woli Klienta, zmierzające bezpośrednio do zawarcia Umowy sprzedaży, określające w szczególności rodzaj i liczbę Towaru.
            12. Sprzedawca- Artysta Zdrowia Sp z o.o  w Sochaczewie Kuznocin 67 96-500 Sochaczew wpisana do rejestru przedsiębiorców Krajowego Rejestru Sądowego prowadzonego przez Sąd Rejonowy dla Łodzi Śródmieścia w Łodzi   XX Wydział Gospodarczy pod numerem KRS 0001126884, NIP: 8371881619 , Regon: 529638894  a Klientem, zawierana z wykorzystaniem serwisu internetowego Sklepu;
            <p className="font-bold py-4">§2 Postanowienia ogólne</p>
            2.1. Niniejszy Regulamin określa zasady korzystania ze sklepu internetowego dostępnego pod adresem: www.artystazdrowia.com.
            2.2. Niniejszy Regulamin jest regulaminem, o którym mowa w art. 8 Ustawy o świadczeniu usług drogą elektroniczną.
            2.3. Sklep internetowy, działający pod adresem: www.artystazdrowia.com ,prowadzony jest przez Artysta Zdrowia  Sp z o.o. w Sochaczewie Kuznocin 67 96-500 Sochaczew wpisana do rejestru przedsiębiorców Krajowego Rejestru Sądowego prowadzonego przez Sąd Rejonowy dla Łodzi Śródmieścia w Łodzi   XX Wydział Gospodarczy pod numerem KRS 0001126884, NIP: 8371881619 , Regon: 529638894  
            2.4. Niniejszy Regulamin określa w szczególności:
            a) zasady dokonywania rejestracji i korzystania z konta w ramach sklepu internetowego;
            b) warunki i zasady dokonywania elektronicznej rezerwacji produktów dostępnych w ramach sklepu internetowego;
            c) warunki i zasady składania drogą elektroniczną Zamówień w ramach sklepu internetowego;
            d) zasady zawierania Umów sprzedaży z wykorzystaniem usług świadczonych w ramach sklepu Internetowego.
            2.5. Korzystanie ze sklepu internetowego jest możliwe pod warunkiem spełnienia przez system teleinformatyczny, z którego korzysta Klient następujących minimalnych wymagań technicznych:
            a) Internet Explorer w wersji 10 lub nowszej z włączoną obsługą JavaScript, lub
            b) Chrome w wersji 49 lub nowszej z włączoną obsługą JavaScript, lub
            c) Firefox w wersji 43 lub nowszej z włączoną obsługą JavaScript, lub
            d) Microsoft Edge w wersji 13 lub nowszej z włączoną obsługą JavaScript, lub
            e) Opera w wersji 36 lub nowszej z włączoną obsługą JavaScript, lub
            f) Safari w wersji 4 lub nowszej z włączoną obsługą JavaScript.
            2.6. W celu korzystania ze sklepu internetowego Klient powinien we własnym zakresie uzyskać dostęp do stanowiska komputerowego lub urządzenia końcowego z dostępem do Internetu.
            2.7. Zgodnie z obowiązującymi przepisami prawa Artysta Zdrowia Sp z o.o. zastrzega sobie możliwość ograniczenia świadczenia usług za pośrednictwem Sklepu internetowego do osób, które ukończyły wiek 18 lat. W takim przypadku potencjalni Klienci zostaną o powyższym powiadomieni.
            2.8. Klienci mogą uzyskać dostęp do niniejszego Regulaminu w każdym czasie za pośrednictwem odsyłacza zamieszczonego na stronie głównej serwisu www.artystazdrowia.com oraz pobrać go i sporządzić jego wydruk.
            <p className="font-bold py-4">§3 Zasady korzystania ze Sklepu Internetowego</p>
            3.1. Warunkiem rozpoczęcia korzystania ze Sklepu internetowego jest rejestracja w jego ramach.
            3.2. Rejestracja następuje poprzez wypełnienie i zaakceptowanie formularza rejestracyjnego, udostępnianego na jednej ze stron Sklepu.
            3.3. Warunkiem rejestracji jest wyrażenie zgody na treść Regulaminu oraz podanie danych osobowych oznaczonych jako obowiązkowe.
            3.4. Artysta Zdrowia  Sp z o.o. może pozbawić Klienta prawa do korzystania ze Sklepu Internetowego, jak również może ograniczyć jego dostęp do części lub całości zasobów Sklepu Internetowego, ze skutkiem natychmiastowym, w przypadku naruszenia przez Klienta Regulaminu, a w szczególności, gdy Klient:
            a) podał w trakcie rejestracji w Sklepie internetowym dane niezgodne z prawdą, niedokładne lub nieaktualne, wprowadzające w błąd lub naruszające prawa osób trzecich,
            b) dopuścił się za pośrednictwem Sklepu internetowego naruszenia dóbr osobistych osób trzecich, w szczególności dóbr osobistych innych klientów Sklepu internetowego,
            c) dopuści się innych zachowań, które zostaną uznane przez Artysta Zdrowia  Sp z o.o. za zachowania niezgodne z obowiązującymi przepisami prawa lub ogólnymi zasadami korzystania z sieci Internet lub godzące w dobre imię Artysta Zdrowia Sp z o.o..
            3.5. Osoba, która została pozbawiona prawa do korzystania ze Sklepu internetowego, nie może dokonać powtórnej rejestracji bez uprzedniej zgody Artysta Zdrowia Sp z o.o..
            3.6. W celu zapewnienia bezpieczeństwa przekazu komunikatów i danych w związku ze świadczonymi w ramach Witryny usługami, Sklep internetowy podejmuje środki techniczne i organizacyjne odpowiednie do stopnia zagrożenia bezpieczeństwa świadczonych usług, w szczególności środki służące zapobieganiu pozyskiwania i modyfikacji przez osoby nieuprawnione danych osobowych przesyłanych w Internecie.
            3.7. Klient zobowiązany jest w szczególności do:
            a) niedostarczania i nieprzekazywania treści zabronionych przez przepisy prawa, np. treści propagujących przemoc, zniesławiających lub naruszających dobra osobiste i inne prawa osób trzecich,
            b) korzystania ze Sklepu internetowego w sposób nie zakłócający jego funkcjonowania, w szczególności poprzez użycie określonego oprogramowania lub urządzeń,
            c) niepodejmowania działań takich jak: rozsyłanie lub umieszczanie w ramach Sklepu internetowego niezamówionej informacji handlowej (spam),
            d) korzystania ze Sklepu internetowego w sposób nieuciążliwy dla innych klientów oraz dla Artysta Zdrowia Sp z o.o.,
            e) korzystania z wszelkich treści zamieszczonych w ramach Sklepu internetowego jedynie w zakresie własnego użytku osobistego,
            f) korzystania ze Sklepu internetowego w sposób zgodny z przepisami obowiązującego na terytorium Rzeczypospolitej Polskiej prawa, postanowieniami Regulaminu, a także z ogólnymi zasadami korzystania z sieci Internet.
            <p className="font-bold py-4">§4 Procedura zawarcia Umowy sprzedaży</p>
            4.1. Informacje o Towarach podane na stronach internetowych Sklepu, w szczególności ich opisy, parametry techniczne i użytkowe oraz ceny, stanowią zaproszenie do zawarcia umowy, w rozumieniu art. 71 Kodeksu Cywilnego.
            4.2. W celu zawarcia Umowy sprzedaży za pośrednictwem Sklepu internetowego należy wejść na stronę internetową www.artystazdrowia.com, dokonać wyboru towarów, podejmując kolejne czynności techniczne w oparciu o wyświetlane Klientowi komunikaty oraz informacje dostępne na stronie.
            4.3. Wybór zamawianych przez Klienta Towarów dokonywany jest poprzez ich dodanie do koszyka.
            4.4. W trakcie składania Zamówienia – do momentu naciśnięcia przycisku „Zamawiam z obowiązkiem zapłaty" lub innego równoznacznie informującego o obowiązku zapłaty – Klient ma możliwość modyfikacji wprowadzonych danych oraz wybranego Towaru. W tym celu należy kierować się wyświetlanymi Klientowi komunikatami oraz informacjami dostępnymi na stronie.
            4.5. Po podaniu przez Klienta korzystającego ze Sklepu internetowego wszystkich niezbędnych danych, wyświetlone zostanie podsumowanie złożonego Zamówienia. Podsumowanie złożonego Zamówienia będzie zawierać informacje dotyczące:
            a) przedmiotu zamówienia,
            b) jednostkowej oraz łącznej ceny zamawianych produktów lub usług, w tym kosztów dostawy oraz dodatkowych kosztów (jeśli występują),
            c) wybranej metody płatności,
            d) wybranego sposobu dostawy,
            e) czasu dostawy.
            4.6. W celu wysłania Zamówienia konieczne jest dokonanie akceptacji treści Regulaminu, podanie danych osobowych oznaczonych jako obowiązkowe oraz naciśnięcie przycisku „Zamawiam z obowiązkiem zapłaty”.
            4.7. Wysłanie przez Klienta Zamówienia stanowi oświadczenie woli zawarcia z Artysta Zdrowia  Sp z o.o. Umowy sprzedaży, zgodnie z treścią Regulaminu.
            4.8. Po złożeniu Zamówienia, Klient otrzymuje wiadomość e-mail zatytułowaną "Potwierdzenie wpłynięcia zamówienia", zawierającą ostateczne potwierdzenie wszystkich istotnych elementów Zamówienia.
            4.9. Umowę traktuje się za zawartą z momentem otrzymania przez Klienta wiadomości e-mail, o której mowa powyżej.
            4.10. Umowa sprzedaży zawierana jest w języku polskim, o treści zgodnej z Regulaminem.
            4.11. Klienci mogą uzyskać dostęp do niniejszego Regulaminu w każdym czasie za pośrednictwem odsyłacza zamieszczonego na stronie głównej serwisu www.artystazdrowia.com oraz pobrać go i sporządzić jego wydruk.
            4.12. Utrwalenie, zabezpieczenie i udostępnienie danych Zamówienia oraz Ogólnych Warunków (regulamin sklepu internetowego) następuje za pośrednictwem poczty elektronicznej.
            4.13. W przypadku promocji prowadzonych z zewnętrznymi partnerami mogą obowiązywać osobne regulaminy dostępne w ramach stron promocji.
            <p className="font-bold py-4">§5 Dostawa</p>
            5.1. Dostawa Towarów nie jest ograniczona do obszaru Rzeczpospolitej Polskiej i odbywa się na adres wskazany przez Klienta w trakcie składania Zamówienia.
            5.2 Dostawa zamówionych Towarów na terytorium Polski odbywa się w wybrany przez Klienta sposób wysyłki: przesyłką kurierską Inpost lub usługą Inpost Paczkomaty.
            5.2.1. Koszty dostawy na terenie Polski, wskazywane w momencie składania Zamówienia, wynoszą odpowiednio:
            DPD - 18 zł przy zamówieniu z przedpłatą
            Inpost Paczkomaty - 13 zł przy zamówieniu z przedpłatą.
            5.2.2. Dostawa zamówionych Towarów poza terenem Polski odbywa się przesyłką kurierską DPD.
            5.2.3. Koszty wysyłki w przypadku dostawy poza terenem Polski wskazane zostały w odnośniku na stronie https://levanndsbyann.com/pol-delivery.html
            5.2.4. W indywidualnych przypadkach koszt dostawy może odbiegać od szacunkowego kosztu dostawy wskazywanego podczas procesu Zamówienia, o czym klient powinien zostać poinformowany mailowo lub telefonicznie przed rozpoczęciem realizacji Zamówienia.
            5.3. Zamówienia realizowane są w ciągu 3 dni roboczych.
            5.3.1. Czas realizacji zamówienia jest to czas od zaksięgowania wpłaty do momentu wydania paczki kurierowi.
            5.3.2. Czas dostawy zamówienia jest to czas od wydania paczki kurierowi do pierwszej próby doręczenia paczki na wskazany przez klienta adres lub do wybranego przez klienta paczkomatu.
            5.3.3. W przypadku, gdy realizacja zamówienia nie jest możliwa w czasie wskazanym w punkcie 5.3, klient zostanie o tym fakcie poinformowany.
            5.4. Klient, w przypadku zamówień przedpłaconych, zostaje zwolniony z opłat, o których mowa w punkcie 5.2, jeśli wartość jego zamówienia nieuwzględniająca kosztów wysyłki przekroczy lub będzie równa kwocie 160 zł.
            5.5. Nie ma możliwości wstrzymywania realizacji zamówienia lub wysyłania przedmiotu zamówienia w innym terminie niż wskazany w niniejszym regulaminie.
            5.6. W przypadku gdy nie uda się zrealizować dostawy przez wybrany przez Klienta sposób dostawy, zostanie on o tym poinformowany telefonicznie lub mailowo.
            <p className="font-bold py-4">§6 Ceny i metody płatności</p>
            6.1. Ceny Towarów podawane są w złotych polskich i zawierają wszystkie składniki, w tym podatek VAT (z wyróżnieniem wysokości stawki), cła oraz wszelkie inne składniki.
            6.2. Klient ma możliwość uiszczenia ceny:
            a) płatnością w systemie bankowości elektronicznej na stronie sklepu www.artystazdrowia.com,
            <p className="font-bold py-4">§7 Prawo do odstąpienia od umowy</p>
            Wyłącznie Klientowi będącemu jednocześnie Konsumentem lub Przedsiębiorcą o prawach Konsumenta przysługuje 14 dniowy termin do odstąpienia od umowy. Konsument lub Przedsiębiorcą o prawach Konsumenta ma prawo odstąpić od niniejszej umowy w terminie 14 dni bez podania jakiejkolwiek przyczyny. Termin do odstąpienia od umowy wygasa po upływie 14 dni od dnia, w którym weszli Państwo w posiadanie rzeczy lub w którym osoba trzecia, inna niż przewoźnik i wskazana przez Państwa weszła w posiadanie rzeczy. Aby skorzystać z prawa odstąpienia od umowy, muszą Państwo poinformować nas Artysta Zdrowia Sp z o.o. , artystazdrowia@gmail.com o swojej decyzji o odstąpieniu od niniejszej umowy w drodze jednoznacznego oświadczenia (na przykład pismo wysłane pocztą, faksem lub pocztą elektroniczną). Mogą Państwo również wypełnić i przesłać formularz odstąpienia od umowy lub jakiekolwiek inne jednoznaczne oświadczenie drogą elektroniczną na naszej stronie internetowej www.artystazdrowia.com . Jeżeli skorzystają Państwo z tej możliwości, prześlemy Państwu niezwłocznie potwierdzenie otrzymania informacji o odstąpieniu od umowy na trwałym nośniku (na przykład pocztą elektroniczną). Aby zachować termin do odstąpienia od umowy, wystarczy, aby wysłali Państwo informację dotyczącą wykonania przysługującego Państwu prawa odstąpienia od umowy przed upływem terminu do odstąpienia od umowy. Zwracane rzeczy prosimy odsyłać na adres siedziby : Artysta Zdrowia Sp z o.o, Kuznocin 67, 96-500 Sochaczew. Zwroty przesyłane pod inny adres nie będą rozpatrywane.
            Skutki odstąpienia od umowy
            W przypadku odstąpienia od niniejszej umowy zwracamy Państwu wszystkie otrzymane od Państwa płatności, niezwłocznie, a w każdym przypadku nie później niż 14 dni od dnia, w którym zostaliśmy poinformowani o Państwa decyzji o wykonaniu prawa odstąpienia od niniejszej umowy. Zwrotu płatności dokonamy przy użyciu takich samych sposobów płatności, jakie zostały przez Państwa użyte w pierwotnej transakcji, chyba że wyraźnie zgodziliście się Państwo na inne rozwiązanie; w każdym przypadku nie poniosą Państwo żadnych opłat w związku ze zwrotem płatności. Możemy wstrzymać się ze zwrotem płatności do czasu otrzymania rzeczy lub do czasu dostarczenia nam dowodu jej/ich odesłania, w zależności od tego, które zdarzenie nastąpi wcześniej. Proszę odesłać lub przekazać nam rzecz lub rzeczy niezwłocznie, a w każdym razie nie później niż 14 dni od dnia, w którym poinformowali nas Państwo o odstąpieniu od niniejszej umowy. Termin jest zachowany, jeżeli odeślą Państwo paczkę przed upływem terminu 14 dni. Będą Państwo musieli ponieść bezpośrednie koszty zwrotu rzeczy. Odpowiadają Państwo tylko za zmniejszenie wartości rzeczy wynikające z korzystania z niej w sposób inny niż było to konieczne do stwierdzenia charakteru, cech i funkcjonowania rzeczy.
            <p className="font-bold py-4">§8 Reklamacje dotyczące Towarów</p>
            8.1. Artysta Zdrowia Sp z o.o. jako sprzedawca odpowiada wobec Klienta będącego Konsumentem w rozumieniu art. 22[1] Kodeksu Cywilnego, lub Przedsiębiorcą o prawach Konsumenta z tytułu rękojmi za wady w zakresie określonym w Kodeksie Cywilnym, w szczególności w art. 556 oraz art. 556[1] - 556[3] i kolejnych Kodeksu Cywilnego.
            8.2. Reklamacje, wynikające z naruszenia praw gwarantowanych ustawowo, lub na podstawie niniejszego Regulaminu, należy kierować na adres artystazdrowia@gmail.com , Artysta Zdrowia Sp z o.o. zobowiązuje się do rozpatrzenia każdej reklamacji w terminie do 14 dni. Artysta Zdrowia
            8.3. Sp z o.o. nie jest producentem wszystkich towarów. Producent ponosi odpowiedzialność z tytułu gwarancji sprzedanego Towaru na warunkach oraz przez okres wskazany w karcie gwarancyjnej. Jeśli dokument gwarancyjny przewiduje taką możliwość, Klient może zgłaszać swoje roszczenia w ramach gwarancji bezpośrednio w autoryzowanym serwisie, którego adres znajduje się w karcie gwarancyjnej.
            <p className="font-bold py-4">§9 Reklamacje w zakresie świadczenia usług drogą elektroniczną</p>
            9.1. Artysta Zdrowia Sp z o.o. podejmuje działania w celu zapewnienia w pełni poprawnego działania Sklepu, w takim zakresie, jaki wynika z aktualnej wiedzy technicznej i zobowiązuje się usunąć w rozsądnym terminie wszelkie nieprawidłowości zgłoszone przez Klientów.
            9.2. Klient zobowiązany jest niezwłocznie powiadomić  Sp z o.o. Artysta Zdrowia 9.3. Nieprawidłowości związane z funkcjonowaniem Sklepu Klient może zgłaszać pisemnie na adres: Artysta Zdrowia Sp z o.o., Kuznocin nr 4, 96-500 Sochaczew, mailowo pod adres artystazdrowia@gmail.com  lub przy użyciu formularza kontaktowego.
            9.4. W reklamacji Klient powinien podać swoje imię i nazwisko, adres do korespondencji, rodzaj i datę wystąpienia nieprawidłowości związanej z funkcjonowaniem Sklepu.
            9.5. Artysta Zdrowia Sp z o.o. zobowiązuje się do rozpatrzenia każdej reklamacji w terminie do 14 dni. Nierozpatrzenie reklamacji w powyższym terminie oznacza uznanie jej za uzasadnioną.
            <p className="font-bold py-4">§10 Rozstrzyganie sporów i postanowienia końcowe</p>
            10.1. Klient, który jest Konsumentem, może w razie zainteresowania skorzystać z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń. Spory dotyczące zakupów internetowych można rozwiązać w drodze postępowania mediacyjnego przed Wojewódzkimi Inspektoratami Inspekcji Handlowej lub procesu przed sądem polubownym przy Wojewódzkim Inspektoracie Inspekcji Handlowej. Konsument może również skorzystać z innych metod pozasądowego rozwiązywania sporów i np. złożyć swoją skargę za pośrednictwem unijnej platformy internetowej ODR, dostępnej pod adresem: http://ec.europa.eu/consumers/odr/
            10.2. W przypadku braku zainteresowania ze strony Konsumenta możliwością skorzystania z pozasądowych sposobów rozpatrywania sporów, rozstrzyganie ewentualnych sporów powstałych pomiędzy Artysta Zdrowia Sp z o.o. a Konsumentem, zostanie poddane sądom właściwym zgodnie z postanowieniami właściwych przepisów Kodeksu postępowania cywilnego.
            10.3. Rozstrzyganie ewentualnych sporów powstałych pomiędzy Artysta Zdrowia Sp z o.o. a Klientem, który nie jest jednocześnie Konsumentem, zostanie poddane sądowi właściwemu ze względu na siedzibę Artysta Zdrowia Sp z o.o..
            10.4. W sprawach nieuregulowanych w niniejszym Regulaminie mają zastosowanie przepisy Kodeksu cywilnego, przepisy Ustawy o świadczeniu usług drogą elektroniczną oraz inne właściwe przepisy prawa polskiego.
            Polityka prywatności dostępna jest pod adresem: https://foodsbyann.com/Polityka-Prywatnosci-cterms-pol-20.html


          </p>
        </div>
      </section>
    </div>
  );
}

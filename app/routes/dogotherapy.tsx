import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="bg-white w-full font-light tracking-wide mx-4 sm:mx-14 md:mx-24 lg:mx-40 xl:mx-60">
        <div className="text-center flex flex-col">
            <h2 className="text-4xl md:text-5xl text-center my-10 mb-12">Dogoterapia</h2>

            <div className="sm:px-8 text-justify">
                <h3 className="text-sm md:text-lg lg:text-2xl md:px-4 flex justify-between">
                    <div className="flex flex-row">
                        <img src="https://res.cloudinary.com/djio9fbja/image/upload/f_auto,q_auto/v1/public/n8lhwvd8sl8ddfikw1pk" alt="Opis zdjęcia" className='h-6 lg:h-8 mr-2 object-cover' />
                        Spotkania z psem 
                    </div>
                    <div className="ml-2 font-normal">150 zł</div>
                </h3>
                <h3 className="text-sm md:text-lg lg:text-2xl md:px-4 flex justify-between">
                    <div className="flex flex-row">
                        <img src="https://res.cloudinary.com/djio9fbja/image/upload/f_auto,q_auto/v1/public/n8lhwvd8sl8ddfikw1pk" alt="Opis zdjęcia" className='h-6 lg:h-8 mr-2 object-cover' />
                        Spotkania z psem grupowe
                    </div>
                    <div className="ml-2 font-normal">ustalane indywidualnie</div>
                </h3>
                <h3 className="text-sm md:text-lg lg:text-2xl md:px-4 flex justify-between">
                    <div className="flex flex-row">
                        <img src="https://res.cloudinary.com/djio9fbja/image/upload/f_auto,q_auto/v1/public/n8lhwvd8sl8ddfikw1pk" alt="Opis zdjęcia" className='h-6 lg:h-8 mr-2 object-cover' />
                        Spotkania wspólne (pies i kot) indywidualne
                    </div>
                    <div className="ml-2 font-normal">250 zł</div>
                </h3>
                <h3 className="text-sm md:text-lg lg:text-2xl md:px-4 flex justify-between">
                    <div className="flex flex-row">
                        <img src="https://res.cloudinary.com/djio9fbja/image/upload/f_auto,q_auto/v1/public/n8lhwvd8sl8ddfikw1pk" alt="Opis zdjęcia" className='h-6 lg:h-8 mr-2 object-cover' />
                        Spotkania grupowe wspólne (pies i kot)
                    </div>
                    <div className="ml-2 font-normal text-right">ustalane indywidualnie</div>
                </h3>
                <h3 className="text-xl px-4 py-3 mt-6 text-justify">
                    <strong>Dogoterapia</strong> jest rodzajem terapii, którą wykorzystuje się do osiągnięcia
                    konkretnych celów terapeutycznych. Nawiązywanie relacji z psem ma na celu
                    uwalnianie pozytywnych uczuć, inspirowanie do działania oraz wspieranie
                    budowania zaufania między pacjentem a terapeutą. Zakres dogoterapii dostosowany
                    jest do indywidualnych wymagań pacjenta, gdzie pies może pełnić rolę bodźca do
                    aktywności fizycznej i umysłowej. Może to obejmować różne formy, takie jak
                    wspólna zabawa, spacery, szkolenie czy opieka nad zwierzęciem.
                </h3>

                <h3 className="text-xl px-4 mt-10 text-center">
                    <strong>Dogoterapia</strong> przynosi liczne korzyści osobom z różnych grup wiekowych,
                    wzmacniając efektywność zastosowanego leczenia i rehabilitacji u pacjentów
                    dotkniętych różnymi schorzeniami, takimi jak:
                </h3>
                <ul className="text-xl px-8 py-2 pt-4 text-center font-normal">
                    <li className="py-1">- zespół Aspergera,</li>
                    <li className="py-1">- zespół Downa,</li>
                    <li className="py-1">- porażenie mózgowe,</li>
                    <li className="py-1">- autyzm,</li>
                    <li className="py-1">- nadpobudliwość psychoruchowa</li>
                </ul>

                <h3 className="text-3xl px-4 py-3 mt-10 text-center">
                    Do głównych celów dogoterapii zalicza się:
                </h3>
                <ul className="text-xl px-8 pt-4 pb-6 text-center font-normal">
                    <li className="py-1">- usprawnianie ruchowe i psychoruchowe motoryki dużej i małej,</li>
                    <li className="py-1">- poprawa koordynacji wzrokowo-ruchowej,</li>
                    <li className="py-1">- usprawnianie percepcji wzrokowej,</li>
                    <li className="py-1">- usprawnianie percepcji słuchowej,</li>
                    <li className="py-1">- poprawa koncentracji,</li>
                    <li className="py-1">- rozwój mowy</li>
                </ul>
            </div>
        </div>
    </div>
  );
}

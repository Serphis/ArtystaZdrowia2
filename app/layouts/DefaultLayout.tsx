import { Link } from "@remix-run/react";

function Login(props) {
  return <Link to="/login" className="text-xs sm:text-sm lg:text-base font-light">ZALOGUJ SIĘ</Link>;
}

function Logout(props) {
  return <form method="post" action="/logout">
    <button type="submit" className="text-xs sm:text-sm lg:text-base font-light">WYLOGUJ SIĘ</button>
    </form>;
}

export function HandleLogin(props){
  const userId = props.userId;
  if (userId) {
    return <Logout />;
  }
  return <Login />;
}

const DefaultLayout: React.FC<{ children: React.ReactNode, userId: string | null, isAdmin?: boolean | null }> = ({ children, userId, isAdmin }) => {

  return (
    <div className="min-h-screen flex flex-col font-tenor">
      {/* HEADER */}
      <header className="z-30 shadow-sm">
        <div className="bg-[#7b6b63] sticky flex justify-center items-center p-2 px-8 space-x-10 text-[#f2e4ca] font-light tracking-widest sticky top-0">
          <Link to="/cart" className="group text-[#f2e4ca] transition duration-300 sm:text-sm lg:text-base">
            KOSZYK
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#f2e4ca] rounded-lg"></span>
          </Link>
          <Link to="/" className="text-xl font-bold p-1 px-2 rounded-lg border-[#f2e4ca]">
            <img src="https://res.cloudinary.com/djio9fbja/image/upload/v1733048713/public/rafg9eeobv8ulx50czcz.jpg" alt="Opis zdjęcia" className='h-12 object-cover' />
          </Link>
          <div className="group text-[#f2e4ca] transition duration-300">
            <HandleLogin userId={userId} />
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-[#f2e4ca]"></span>
          </div>
        </div>

        {/* Dolny pasek nawigacyjny */}
        <nav className="flex justify-center space-x-4 md:space-x-6 bg-[#f2e4ca] text-[#987867] p-2 text-xs sm:text-sm lg:text-base lg:text-normal font-light tracking-widest">
          <Link to="/" className="group text-[#987867] transition duration-300">
            Strona główna
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-[#987867]"></span>
          </Link>
          <Link to="/about" className="group text-[#987867] transition duration-300">
            O firmie
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-[#987867]"></span>
          </Link>
          <Link to="/productList" className="group text-[#987867] transition duration-300">
            Produkty
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-[#987867]"></span>
          </Link>
          <Link to="/treatments" className="group text-[#987867] transition duration-300">
            Zabiegi
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-[#987867]"></span>
          </Link>
          <Link to="/dogotherapy" className="group text-[#987867] transition duration-300">
            Dogoterapia
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-[#987867]"></span>
          </Link>
          <Link to="/felinotherapy" className="group text-[#987867] transition duration-300">
            Felinoterapia
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-[#987867]"></span>
          </Link>
          <Link to="/contact" className="group text-[#987867] transition duration-300">
            Kontakt
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-[#987867]"></span>
          </Link>
        </nav>
        
      </header>

      {/* MAIN */}
      <main className="flex-grow">{children}</main>

      {/* FOOTER */}
      <footer
        id="contact"
        className="flex justify-between items-center p-4 bg-[#7b6b63] text-[#f2e4ca] text-xs font-light"
      >
        <p>O nas</p>
        <p>Pomoc</p>
      </footer>
    </div>
  );
};



export default DefaultLayout;
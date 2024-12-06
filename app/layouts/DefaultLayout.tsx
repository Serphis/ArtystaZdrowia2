import { Link } from "@remix-run/react";

function Login(props) {
  return <Link to="/login" className="text-sm sm:text-base font-light">ZALOGUJ SIĘ</Link>;
}

function Logout(props) {
  return <form method="post" action="/logout">
    <button type="submit" className="text-sm sm:text-base font-light">WYLOGUJ SIĘ</button>
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
      <header className="z-30 shadow-sm sticky top-0">
        <div className="bg-[#7b6b63] flex justify-center items-center p-2 px-8 space-x-10 text-[#f2e4ca] font-light tracking-widest">
          <Link to="/cart" className="group text-[#f2e4ca] transition duration-300 text-sm sm:text-base lg:text-base">
            KOSZYK
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#f2e4ca] rounded-lg"></span>
          </Link>
          <Link to="/" className="text-xl font-bold p-1 px-2 rounded-lg border-[#f2e4ca]">
            <img src="https://res.cloudinary.com/djio9fbja/image/upload/v1733048713/public/rafg9eeobv8ulx50czcz.jpg" alt="Opis zdjęcia" className='h-16 object-cover' />
          </Link>
          <div className="group text-[#f2e4ca] transition duration-300">
            <HandleLogin userId={userId} />
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-[#f2e4ca]"></span>
          </div>
        </div>

        <nav className="bg-white flex justify-center space-x-4 md:space-x-6 p-2 text-sm sm:text-base font-light tracking-widest">
          <Link to="/" className="group transition duration-300">
            Strona główna
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-black"></span>
          </Link>
          {/* <Link to="/about" className="group transition duration-300">
            O firmie
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-black"></span>
          </Link> */}
          <Link to="/productList" className="group transition duration-300">
            Produkty
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-black"></span>
          </Link>
          <Link to="/treatments" className="group transition duration-300">
            Zabiegi
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-black"></span>
          </Link>
          <Link to="/dogotherapy" className="group transition duration-300">
            Dogoterapia
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-black"></span>
          </Link>
          <Link to="/felinotherapy" className="group transition duration-300">
            Felinoterapia
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-black"></span>
          </Link>
          <Link to="/contact" className="group transition duration-300">
            Kontakt
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 rounded-lg bg-black"></span>
          </Link>
        </nav>
        
      </header>

      <main className="flex-grow text-black">{children}</main>

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
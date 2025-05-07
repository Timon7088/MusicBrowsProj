import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      {/* Header sticky */}
      <header className="sticky top-0 z-50 bg-gray-900 text-white px-4 py-6 shadow-md min-h-[140px]">
        {/* לוגו */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <img
            src="/images/Music-Brows-Logo.png"
            alt="Music-Brows Logo"
            className="h-16 sm:h-20 w-auto rounded-md"
          />
        </div>

        {/* ניווט עליון - כפתורים למובייל בלבד */}
        <div className="absolute top-12 right-4 flex items-center space-x-4 md:static md:hidden z-30">
          {/* חיפוש מובייל */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="text-white text-3xl"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>

          {/* כפתור המבורגר */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-3xl"
          >
            ☰
          </button>
        </div>

        {/* תפריט רגיל בדסקטופ */}
        <nav className="hidden md:flex absolute top-4 right-4 space-x-4 space-x-reverse sm:text-sm z-30" dir="rtl">
          <Link to="/" className="hover:text-green-300" viewTransition>ראשי</Link>
          <Link to="/About" className="hover:text-green-300" viewTransition>אודות</Link>
          <Link to="/contact" className="hover:text-green-300" viewTransition>צור קשר</Link>
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="hover:text-green-300" viewTransition>התחברות</Link>
              <Link to="/register" className="hover:text-green-300" viewTransition>הרשמה</Link>
            </>
          ) : (
            <button onClick={() => setIsLoggedIn(false)} className="hover:text-red-400">
              התנתקות
            </button>
          )}
        </nav>
      </header>

      {/* חיפוש במובייל - מוצג מתחת להדר */}
      {mobileSearchOpen && (
        <div className="sticky top-[140px] z-40 bg-gray-800 w-full px-4 py-3 flex justify-center" dir="rtl">
          <div className="relative w-full max-w-[300px]">
            <input
              type="text"
              placeholder="חפשו שירים..."
              className="w-full p-2 pl-10 rounded-md text-black focus:outline-none"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
            />
          </div>
        </div>
      )}

      {/* תפריט סרגל ראשי במובייל */}
      {menuOpen && (
        <div
          className="sticky top-[140px] z-50 bg-black text-white shadow-lg rounded-md p-4 w-48 mx-4 mt-2 ml-auto"
          dir="rtl"
        >
          <ul className="flex flex-col space-y-2">
            <li><Link to="/" onClick={() => setMenuOpen(false)}>ראשי</Link></li>
            <li><Link to="/About" onClick={() => setMenuOpen(false)}>אודות</Link></li>
            <li><Link to="/contact" onClick={() => setMenuOpen(false)}>צור קשר</Link></li>
            {!isLoggedIn ? (
              <>
                <li><Link to="/login" onClick={() => setMenuOpen(false)}>התחברות</Link></li>
                <li><Link to="/register" onClick={() => setMenuOpen(false)}>הרשמה</Link></li>
              </>
            ) : (
              <li>
                <button onClick={() => { setIsLoggedIn(false); setMenuOpen(false); }}>
                  התנתקות
                </button>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* חיפוש בדסקטופ */}
      <div className="hidden md:block absolute right-4 top-[150px] w-full max-w-[300px] z-20" dir="rtl">
        <div className="relative">
          <input
            type="text"
            placeholder="חפשו שירים..."
            className="w-[170px] sm:w-[200px] md:w-[300px] p-2 pl-10 rounded-md text-black focus:outline-none"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
          />
        </div>
      </div>
    </>
  );
}

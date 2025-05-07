import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative bg-gray-900 text-white px-4 py-6 shadow-md min-h-[140px]">
      {/* לוגו בצד שמאל - באמצע אנכית, רספונסיבי */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        <img
          src="/images/Music-Brows-Logo.png"
          alt="Music-Brows Logo"
          className="h-16 sm:h-20 w-auto rounded-md"
        />
      </div>

      {/* סרגל ניווט - ימין למעלה */}
      <nav className="absolute top-4 right-4 z-30">
        {/* כפתור המבורגר למובייל */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl"
          >
            ☰
          </button>
        </div>

        {/* תפריט נפתח במובייל */}
        {menuOpen && (
          <div className="absolute top-10 right-0 w-48 bg-black text-white shadow-lg rounded-md p-4 z-50" dir="rtl">
            <ul className="flex flex-col space-y-2">
              <li>
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  ראשי
                </Link>
              </li>
              <li>
                <Link to="/About" onClick={() => setMenuOpen(false)}>
                  אודות
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => setMenuOpen(false)}>
                  צור קשר
                </Link>
              </li>
              {!isLoggedIn ? (
                <>
                  <li>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                      התחברות
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" onClick={() => setMenuOpen(false)}>
                      הרשמה
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setMenuOpen(false);
                    }}
                  >
                    התנתקות
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* תפריט רגיל בדסקטופ */}
        <div className="hidden md:flex space-x-4 space-x-reverse sm:text-sm" dir="rtl">
          <Link to="/" className="hover:text-green-300" viewTransition>
            ראשי
          </Link>
          <Link to="/About" className="hover:text-green-300" viewTransition>
            אודות
          </Link>
          <Link to="/contact" className="hover:text-green-300" viewTransition>
            צור קשר
          </Link>
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="hover:text-green-300" viewTransition>
                התחברות
              </Link>
              <Link to="/register" className="hover:text-green-300" viewTransition>
                הרשמה
              </Link>
            </>
          ) : (
            <button
              onClick={() => setIsLoggedIn(false)}
              className="hover:text-red-400"
            >
              התנתקות
            </button>
          )}
        </div>
      </nav>

      {/* שורת חיפוש - בצד ימין למטה, מותאמת למסכים קטנים */}
      <div className="absolute right-4 top-16 w-full max-w-[300px] sm:max-w-[400px] z-20" dir="rtl">
        <input
          type="text"
          placeholder="חפש שיר, אמן או ז'אנר..."
          className="w-[150px] sm:w-[200px] md:w-[300px] p-2 rounded-md text-black focus:outline-none"
        />
      </div>
    </header>
  );
}

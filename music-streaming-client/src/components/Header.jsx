import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../clients/auth-client";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // בדיקת התחברות
  const { data } = authClient.useSession();
  const user = data?.user;

  // התנתקות
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      navigate("/login");
    } catch (err) {
      console.error("שגיאה בהתנתקות:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-800 text-white px-4 py-4 shadow-md min-h-[80px] flex items-center justify-between relative">
      {/* לוגו */}
      <div className="ml-4">
        <img
          src="/images/Music-Brows-Logo.png"
          alt="Music-Brows Logo"
          className="h-16 w-auto rounded-md"
        />
      </div>

      {/* תפריט ניווט בדסקטופ */}
      <nav
        className="hidden md:flex items-center space-x-4 space-x-reverse sm:text-sm mr-4"
        dir="rtl"
      >
        <Link to="/" className="hover:text-green-300" viewTransition>
          ראשי
        </Link>
        <Link to="/About" className="hover:text-green-300" viewTransition>
          אודות
        </Link>
        <Link to="/contact" className="hover:text-green-300" viewTransition>
          צור קשר
        </Link>

        {user && (
          <>
            <Link
              to="/userProfile"
              className="hover:text-green-300"
              viewTransition
            >
              האזור האישי
            </Link>
            <button onClick={handleLogout} className="hover:text-green-400">
              התנתקות
            </button>
          </>
        )}

        {!user && (
          <>
            <Link to="/login" className="hover:text-green-300" viewTransition>
              התחברות
            </Link>
            <Link
              to="/register"
              className="hover:text-green-300"
              viewTransition
            >
              הרשמה
            </Link>
          </>
        )}
      </nav>

      {/* כפתור המבורגר למובייל */}
      <div className="md:hidden mr-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-3xl"
        >
          ☰
        </button>
      </div>

      {/* תפריט ניווט במובייל */}
      {menuOpen && (
        <div
          className="absolute top-full right-4 z-40 bg-black text-white shadow-lg rounded-md p-4 w-48 mt-2"
          dir="rtl"
        >
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

            {user && (
              <>
                <li>
                  <Link to="/userProfile" onClick={() => setMenuOpen(false)}>
                    האזור האישי
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-green-400"
                  >
                    התנתקות
                  </button>
                </li>
              </>
            )}

            {!user && (
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
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

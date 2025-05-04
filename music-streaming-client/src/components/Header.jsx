import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/*צריך להוסיף לוגו בהמשך*/}
        <div className="text-4xl font-bold text-green-400">MusicBrows 🎧</div>

        {/* טאבים עדיין צריכים להיכנס לדפים פנימיים וחיבור לצד שרת בשביל ההתחברות */}
        <div className="flex justify-end items-center space-x-4 sm:text-base">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="  hover:text-green-300"
                viewTransition
              >
                התחברות
              </Link>
              <Link
                to="/register"
                className="  hover:text-green-300"
                viewTransition
              >
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

          <Link to="/contact" className="  hover:text-green-300" viewTransition>
            צור קשר
          </Link>
          <Link to="/About" className="  hover:text-green-300" viewTransition>
            אודות
          </Link>
          <Link to="/" className="  hover:text-green-300" viewTransition>
            ראשי
          </Link>
        </div>
      </div>
    </header>
  );
}

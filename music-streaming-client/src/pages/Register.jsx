import { useState } from "react";
import { authClient } from "../clients/auth-client";
import { useNavigate } from "react-router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await authClient.signUp.email({
        email,
        password,
        name,
      });

      console.log("תוצאת ההרשמה:", res);
      if (res?.error) throw res.error;

      if (res?.data?.user) {
        navigate("/");
      } else {
        setErrorMessage("ההרשמה נכשלה-נסה שוב.");
      }
    } catch (err) {
      // const msgLower = serverMsg.toLowerCase();

      if (err?.status === 422) {
        setErrorMessage("האימייל הזה כבר קיים במערכת, נסה מייל אחר.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-4xl font-bold text-green-400 mb-4">הרשמה</h1>
      <p className="max-w-xl text-center text-gray-300 mb-4">
        מלא את פרטיך כדי להירשם לאתר ולהתחיל להאזין למוזיקה
      </p>

      {errorMessage && (
        <div className="w-full max-w-md bg-red-600 text-white px-4 py-3 rounded mb-6 text-center font-medium shadow-md">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            אימייל
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            שם משתמש
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            סיסמה
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-400 text-black font-bold rounded hover:bg-green-500 transition"
        >
          הירשם
        </button>
      </form>
    </div>
  );
}

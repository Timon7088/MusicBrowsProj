export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-green-400 mb-6 text-center" dir="rtl">אודות Music-Brows</h1>

      <div className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-xl w-full max-w-3xl text-right text-gray-300 leading-relaxed" dir="rtl">
        <p className="mb-4 text-sm sm:text-base md:text-lg">
          שמי רן מגידש, וזהו פרויקט הגמר שלי - אפליקציית הזרמת מוזיקה אינטרנטית, בהשראת Spotify.
        </p>

        <p className="mb-4 text-sm sm:text-base md:text-lg">
          האפליקציה מאפשרת למשתמשים להאזין למוזיקה ישירות מהדפדפן, לבחור שירים לפי טעמם, ולהתחבר כדי ליצור ולנהל פלייליסטים אישיים.
        </p>

        <p className="mb-4 text-sm sm:text-base md:text-lg">
          הפרויקט נועד לספק פתרון חינמי ונוח להאזנה למוזיקה, ללא צורך בהתקנות או תשלום, בממשק נגיש וקל לשימוש.
        </p>

        <p className="mb-4 text-sm sm:text-base md:text-lg">
          מטרתי הייתה לתרגל טכנולוגיות מודרניות ולבנות מערכת שעוזרת לי להתקדם לעבר שוק העבודה.
        </p>

        <p className="mb-2 font-semibold text-sm sm:text-base">טכנולוגיות בפרויקט:</p>
        <ul className="list-disc pr-0 pl-6 mb-4 text-sm sm:text-base md:text-lg text-right">
          <li>Frontend: React.js, Tailwind CSS, Redux</li>
          <li>Backend: Node.js, Express.js</li>
          <li>Database: MongoDB, Mongoose</li>
        </ul>

        <p className="text-sm sm:text-base md:text-lg">
          הדגש המרכזי בפרויקט הוא חווית משתמש – ממשק מודרני, מהיר ונוח לכל משתמש.
        </p>
      </div>
    </div>
  );
}

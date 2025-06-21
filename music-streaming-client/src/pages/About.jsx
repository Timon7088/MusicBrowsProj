export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-green-400 mb-6 text-center" dir="rtl">
        אודות Music-Brows
      </h1>

      <div className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-xl w-full max-w-3xl text-right text-gray-300 leading-relaxed" dir="rtl">
        <p className="mb-4 text-sm sm:text-base md:text-lg">
          שמי רן מגידש, וזהו פרויקט הגמר שלי במסגרת לימודי הנדסאי תוכנה – אפליקציית הזרמת מוזיקה אינטרנטית, בהשראת Spotify.
        </p>

        <p className="mb-4 text-sm sm:text-base md:text-lg">
          האפליקציה מאפשרת למשתמשים להאזין לשירים ישירות מהדפדפן, לסמן שירים כאהובים, וליהנות מנגן מוזיקה איכותי ונוח לשימוש.
        </p>

        <p className="mb-4 text-sm sm:text-base md:text-lg">
          משתמשים מחוברים יכולים לגשת לאזור אישי בו מוצגים פרטי המשתמש ותצוגת שירים אהובים. המערכת שמה דגש על ממשק ידידותי, חוויית משתמש רספונסיבית ותפקוד מלא גם במובייל.
        </p>

        <p className="mb-4 text-sm sm:text-base md:text-lg">
          מטרת הפרויקט היא לא רק לספק פתרון אמיתי להאזנה למוזיקה, אלא גם להוות בסיס טכנולוגי איתן לפיתוח מערכות Full-Stack מתקדמות.
        </p>

        <p className="mt-6 mb-2 font-bold text-lg text-green-400">טכנולוגיות בפרויקט:</p>

        <p className="font-semibold text-sm sm:text-base mt-4">Frontend:</p>
        <ul className="list-disc pr-0 pl-6 text-sm sm:text-base md:text-lg text-right mb-4">
          <li>React.js – לבניית ממשק דינמי מבוסס קומפוננטות</li>
          <li>Tailwind CSS – לעיצוב מהיר, מודרני ורספונסיבי</li>
          <li>JavaScript – לניהול הלוגיקה בצד לקוח</li>
          <li>Axios – לתקשורת עם ה־API</li>
        </ul>

        <p className="font-semibold text-sm sm:text-base">State Management:</p>
        <ul className="list-disc pr-0 pl-6 text-sm sm:text-base md:text-lg text-right mb-4">
          <li>Context API + useReducer – לניהול גלובלי של נגן המוזיקה ומצב המשתמש</li>
        </ul>

        <p className="font-semibold text-sm sm:text-base">Backend:</p>
        <ul className="list-disc pr-0 pl-6 text-sm sm:text-base md:text-lg text-right mb-4">
          <li>Node.js – להרצת JavaScript בצד שרת</li>
          <li>Express.js – ליצירת REST API וניהול נתיבי השרת</li>
        </ul>

        <p className="font-semibold text-sm sm:text-base">Database:</p>
        <ul className="list-disc pr-0 pl-6 text-sm sm:text-base md:text-lg text-right mb-4">
          <li>MongoDB בענן – לאחסון משתמשים, שירים, והעדפות</li>
          <li>Mongoose – לעבודה נוחה עם סכמות במסד הנתונים</li>
        </ul>

        <p className="font-semibold text-sm sm:text-base">Authentication:</p>
        <ul className="list-disc pr-0 pl-6 text-sm sm:text-base md:text-lg text-right mb-4">
          <li>Better-Auth – לניהול הרשמה, התחברות והרשאות משתמשים</li>
          <li>JWT – לזיהוי משתמשים מאובטח</li>
        </ul>

        <p className="font-semibold text-sm sm:text-base">Music Player:</p>
        <ul className="list-disc pr-0 pl-6 text-sm sm:text-base md:text-lg text-right mb-4">
          <li>HTML5 Audio API – לניגון שירים</li>
          <li>שליטה מלאה – Play, Pause, Skip, ו־Volume</li>
          <li>תמיכה בזיהוי שיר נוכחי וניהול תור ניגון</li>
        </ul>

        <p className="font-semibold text-sm sm:text-base">Features עיקריים:</p>
        <ul className="list-disc pr-0 pl-6 text-sm sm:text-base md:text-lg text-right mb-4">
          <li>דף בית עם תצוגת שירים ואמנים</li>
          <li>עמוד פרופיל אישי עם תמונה ושירים אהובים</li>
          <li>הוספה והסרה של שירים אהובים לאזור אישי</li>
          <li>מערכת ניהול משתמשים למנהל מערכת (Admin)</li>
          <li>למנהל מערכת – דף עריכה לניהול שירים ואמנים (הוספה, עריכה, מחיקה)</li>
          <li>למנהל מערכת – אפשרות לשנות תפקידי משתמשים בין user ל־admin</li>
        </ul>

        <p className="text-sm sm:text-base md:text-lg">
          כל המערכת נכתבה בקוד נקי ומודולרי תוך שימוש בטכנולוגיות חינמיות בלבד – ומדמה תשתית של אפליקציית מוזיקה אמיתית, עם ממשק אינטואיטיבי ותמיכה מלאה בדפדפנים מודרניים.
        </p>
      </div>
    </div>
  );
}

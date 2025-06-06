import mongoose from "mongoose";
import Song from "./models/song.js";
import Artist from "./models/artist.js";

await mongoose.connect("mongodb://localhost:27017/musicbrows", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("Seeding in to the Data Base");

const artistData = [
  { name: "Kendrick Lamar", bio: "קנדריק לאמאר (Kendrick Lamar) הוא ראפר, פזמונאי ומפיק אמריקאי, יליד קליפורניה (1987), הנחשב לאחד האמנים המשפיעים והמהוללים ביותר בדורו. הוא פרץ לתודעה עם האלבום good kid, m.A.A.d city (2012), שזכה לשבחים בזכות סיפורו האישי והליריקה החדה. בהמשך הוציא את To Pimp a Butterfly ו־DAMN., האלבום שהביא לו פרס פוליצר – ציון דרך חסר תקדים בעולם ההיפ-הופ. סגנונו משלב היפ-הופ, ג'אז, פאנק ופוליטיקה חברתית. לאמאר ידוע במסרים החזקים ביצירותיו, בהתעמקות בזהות שחורה, צדק חברתי ומאבקים פנימיים.", image: "/images/Kendrick-Lamar.jpg" },
  { name: "Avenged Sevenfold", bio: "להקת Avenged Sevenfold (או בקיצור A7X) היא להקת הארד רוק ומטאל מלודיק אמריקאית שהוקמה בשנת 1999 מקליפורניה. הלהקה מזוהה בסגנון מטאלקור בתחילת דרכה, ובהמשך עברה לסגנון רוק כבד/הבי מטאל עם השפעות סימפוניות ופרוגרסיביות. חברי הלהקה כוללים את M. Shadows (שירה), Synyster Gates (גיטרה מובילה), Zacky Vengeance (גיטרה קצב), Johnny Christ (בס) והמתופף הנוכחי Brooks Wackerman. אלבומיהם המובילים כוללים את City of Evil, Avenged Sevenfold, ו־Nightmare, שזכה להצלחה מסחרית רבה. המוזיקה של הלהקה נודעת במלודיות מורכבות, קטעי סולו מרהיבים, וטקסטים נרטיביים עוצמתיים. A7X נחשבת לאחת הלהקות החשובות בגל המטאל האמריקאי של שנות ה־2000.", image: "/images/avenged-sevenfold1.webp" },
  { name: "Linkin Park", bio: "Linkin Park היא להקת נו־מטאל/רוק אלטרנטיבי אמריקאית שהוקמה בקליפורניה בשנת 1996. הלהקה פרצה לתודעה עם אלבום הבכורה האיקוני Hybrid Theory (2000), שכלל להיטים כמו “In the End” ו־“Crawling”. סגנונם הייחודי משלב ראפ, מטאל, אלקטרוניקה ומלודיות רוק. חברים מרכזיים בלהקה כוללים את צ'סטר בנינגטון (שירה ראשית, שנפטר ב־2017), מייק שינודה (ראפ/קלידים/גיטרה), ובראד דלסון (גיטרה). הלהקה נגעה בנושאים של כאב נפשי, זהות וקונפליקט פנימי, וזכתה לפופולריות עולמית עצומה. הם ממשיכים להשפיע על דורות של מוזיקאים ברחבי העולם.", image: "/images/linkin-park.jpeg" },
  { name: "Guns N' Roses", bio: "Guns N' Roses היא להקת רוק אמריקאית אגדית שהוקמה בלוס אנג'לס בשנת 1985. הלהקה זכתה לפרסום עולמי בזכות הסגנון החצוף והאנרגטי שלה, המשלב הארד רוק, בלוז ורוקנרול קלאסי. אלבום הבכורה Appetite for Destruction (1987) נחשב לאחד האלבומים הנמכרים ביותר בהיסטוריה, עם להיטים כמו “Sweet Child O’ Mine”, “Welcome to the Jungle” ו־“Paradise City”. סולן הלהקה אקסל רוז וגיטריסט העל סלאש הפכו לדמויות איקוניות ברוק העולמי. לאחר שנים של הפסקות ומתח בין חברים, הלהקה התאחדה והמשיכה להופיע ולרגש קהלים ברחבי העולם.", image: "/images/guns-and-roses.jpg" },
  { name: "Deep Purple", bio: "Deep Purple היא להקת רוק בריטית שהוקמה בשנת 1968 ונחשבת לאחת מאבני היסוד של ההארד רוק וההבי מטאל. סגנונה משלב רוק כבד עם השפעות קלאסיות ובלוז. חברי ההרכב הקלאסי כוללים את איאן גילן (שירה), ריצ'י בלאקמור (גיטרה), ג'ון לורד (קלידים), רוג'ר גלובר (בס) ואיאן פייס (תופים). בין להיטיה הבולטים: ''Smoke on the Water'', ''Highway Star'' ו־''Child in Time''. הלהקה ידועה בנגינה טכנית מרשימה ובהופעות חיות עוצמתיות, והמשיכה להשפיע על דורות של מוזיקאים גם בשנות ה־2000 והלאה.", image: "/images/Highway-Star.jpeg" },
  { name: "Kansas", bio: "Kansas היא להקת רוק פרוגרסיבי אמריקאית שהוקמה בתחילת שנות ה־70 במדינת קנזס. הלהקה שילבה בין רוק קלאסי, אלמנטים סימפוניים וטכניקה מוזיקלית גבוהה. היא נודעת בזכות להיטים על־זמניים כמו ''Carry On Wayward Son'' ו־''Dust in the Wind'', שהפכו לסמלים של הרוק האמריקאי. הסאונד של קנזס מאופיין בשילוב ייחודי של כינור, קלידים וגיטרות חשמליות, עם טקסטים פילוסופיים ורוחניים. הלהקה ממשיכה להופיע עד היום בהרכבים שונים, ומחזיקה מקום מיוחד בזיכרון הקולקטיבי של הרוק המתקדם האמריקאי.", image: "/images/Carry-on-my-wayward-son.jpeg" },
];

for (const artist of artistData) {
  await Artist.updateOne(
    { name: artist.name },
    { $set: artist },
    { upsert: true }
  );
}

const artistsFromDB = await Artist.find();
const getArtistId = (name) =>
  artistsFromDB.find((a) => a.name.toLowerCase() === name.toLowerCase())?._id;

const songData = [
  {
    title: "Kendrick Lamar DNA",
    artist: getArtistId("Kendrick Lamar"),
    cover: "/images/kendrick_dna.jpeg",
    url: "/songs/DNA-Kendrick-Lamar.mp3",
    duration: "3:06",
  },
  {
    title: "Avenged-Sevenfold Dear God",
    artist: getArtistId("Avenged Sevenfold"),
    cover: "/images/Avenged-Sevenfold-Dear-God.jpeg",
    url: "/songs/Avenged-Sevenfold-Dear-God.mp3",
    duration: "6:33",
  },
  {
    title: "Avenged-Sevenfold Bat Country",
    artist: getArtistId("Avenged Sevenfold"),
    cover: "/images/Avenged-Sevenfold-Bat-Country.jpeg",
    url: "/songs/Avenged-Sevenfold-Bat-Country.mp3",
    duration: "5:11",
  },
  {
    title: "Lost",
    artist: getArtistId("Linkin Park"),
    cover: "/images/Lost.jpeg",
    url: "/songs/Lost.mp3",
    duration: "3:19",
  },
  {
    title: "What I've Done",
    artist: getArtistId("Linkin Park"),
    cover: "/images/what-ive-done.jpeg",
    url: "/songs/what-ive-done.mp3",
    duration: "3:29",
  },
  {
    title: "Highway Star",
    artist: getArtistId("Deep Purple"),
    cover: "/images/Highway-Star.jpeg",
    url: "/songs/Highway-Star.mp3",
    duration: "6:07",
  },
  {
    title: "Smoke on the Water",
    artist: getArtistId("Deep Purple"),
    cover: "/images/Smoke-On-The-Water.jpg",
    url: "/songs/Smoke-On-The-Water.mp3",
    duration: "6:14",
  },
  {
    title: "Perfect Strangers",
    artist: getArtistId("Deep Purple"),
    cover: "/images/Perfect-Strangers.jpg",
    url: "/songs/Perfect-Strangers.mp3",
    duration: "5:45",
  },
  {
    title: "November Rain",
    artist: getArtistId("Guns N' Roses"),
    cover: "/images/November-Rain.jpg",
    url: "/songs/November-Rain.mp3",
    duration: "9:00",
  },
  {
    title: "Knocking On Heaven's Door",
    artist: getArtistId("Guns N' Roses"),
    cover: "/images/Guns-N-Roses-Knocking-On-Heaven's-Door.jpg",
    url: "/songs/Guns-N-Roses-Knocking-On-Heaven's-Door.mp3",
    duration: "5:36",
  },
  {
    title: "Sweet Child O' Mine",
    artist: getArtistId("Guns N' Roses"),
    cover: "/images/Guns-N-Roses-Sweet-Child-O'-Mine.jpg",
    url: "/songs/Guns-N-Roses-Sweet-Child-O'-Mine.mp3",
    duration: "5:54",
  },
  {
    title: "Paradise City",
    artist: getArtistId("Guns N' Roses"),
    cover: "/images/Guns-N-Roses-Paradise-City.jpg",
    url: "/songs/Guns-N-Roses-Paradise-City.mp3",
    duration: "6:47",
  },
  {
    title: "Carry On Wayward Son",
    artist: getArtistId("Kansas"),
    cover: "/images/Carry-on-my-wayward-son.jpeg",
    url: "/songs/Carry-On-Wayward-Son.mp3",
    duration: "5:23",
  },
  {
    title: "Save Me",
    artist: getArtistId("Avenged Sevenfold"),
    cover: "/images/Avenged-Sevenfold-Save-Me.jpg",
    url: "/songs/Avenged-Sevenfold-Save-Me.mp3",
    duration: "10:56",
  },
  {
    title: "Afterlife",
    artist: getArtistId("Avenged Sevenfold"),
    cover: "/images/Avenged-Sevenfold-Afterlife.jpg",
    url: "/songs/Avenged-Sevenfold-Afterlife.mp3",
    duration: "5:52",
  },
  {
    title: "Humble",
    artist: getArtistId("Kendrick Lamar"),
    cover: "/images/Kendrick-Lamar-Humble.webp",
    url: "/songs/Kendrick-Lamar-Humble.mp3",
    duration: "2:54",
  },
  {
    title: "M.A.A.D City",
    artist: getArtistId("Kendrick Lamar"),
    cover: "/images/Kendrick-Lamar-M.A.A.D-city.jpg",
    url: "/songs/Kendrick-Lamar-M.A.A.D-city.mp3",
    duration: "5:50",
  },
  {
    title: "King Kunta",
    artist: getArtistId("Kendrick Lamar"),
    cover: "/images/Kendrick-Lamar-King-Kunta.jpg",
    url: "/songs/Kendrick-Lamar-King-Kunta.mp3",
    duration: "3:55",
  },
  {
    title: "In The End",
    artist: getArtistId("Linkin Park"),
    cover: "/images/Linkin-Park-In-The-End.jpg",
    url: "/songs/Linkin-Park-In-The-End.mp3",
    duration: "3:37",
  },
  {
    title: "Numb",
    artist: getArtistId("Linkin Park"),
    cover: "/images/Linkin-Park-Numb.jpg",
    url: "/songs/Linkin-Park-Numb.mp3",
    duration: "3:07",
  },
  {
    title: "Dust in the wind",
    artist: getArtistId("Kansas"),
    cover: "/images/Kansas-Dust-in-the-Wind.jpeg",
    url: "/songs/Kansas-Dust-in-the-Wind.mp3",
    duration: "3:25",
  },
  {
    title: "The Wall",
    artist: getArtistId("Kansas"),
    cover: "/images/Carry-on-my-wayward-son.jpeg",
    url: "/songs/Kansas-The-Wall.mp3",
    duration: "4:47",
  },
];

for (const song of songData) {
  await Song.updateOne(
    { title: song.title },
    { $set: song },
    { upsert: true }
  );
}

console.log("Linking songs to artists...");

for (const artist of artistsFromDB) {
  const songsForArtist = await Song.find({ artist: artist._id });
  const songIds = songsForArtist.map((s) => s._id);

  await Artist.updateOne(
    { _id: artist._id },
    { $set: { songs: songIds, updatedAt: new Date() } }
  );
}

console.log("Data has successfully updated");
await mongoose.disconnect();

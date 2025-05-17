import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./Auth.js";

const app = express();
const port = 4000;

// הגדרות CORS
app.use(
  cors({
    origin: "http://localhost:5173", // כתובת ה-frontend שלך
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 👇 חובה לפני better-auth כדי לקרוא את ה-body


// 👇 רישום של better-auth (חייב להיות אחרי express.json)
app.all("/api/auth/*splat", toNodeHandler(auth));

// קבצים סטטיים
app.use("/songs", express.static("public/songs"));
app.use("/images", express.static("public/images"));

// מידע על שירים, אמנים ופלייליסטים
const songs = [
  {
    id: 1,
    title: "Song One",
    artist: "Kendrick lamar",
    cover: "/images/kendrick_dna.jpeg",
    url: "/songs/DNA-Kendrick-Lamar.mp3",
  },
  {
    id: 2,
    title: "Song Two",
    artist: "Artist B",
    cover: "/songs/song2.jpg",
    url: "/songs/song2.mp3",
  },
];

const playlists = [
  {
    id: 1,
    title: "הלהיטים של 2025",
    description: "השירים הכי חמים של השנה",
    imageUrl: "/images/2025-hiphop-hits.jpeg",
  },
  {
    id: 2,
    title: "מוזיקת צ'יל",
    description: "רוגע, קפה ושקיעה",
    imageUrl: "/images/chill-Music.jpeg",
  },
  {
    id: 3,
    title: "ראפ שכולם אוהבים",
    description: "שהשכונה קשה האיכות גבוהה",
    imageUrl: "/images/Rap-Music.jpg",
  },
  {
    id: 4,
    title: "להיטי רוק",
    description: "מיטב הלהיטים של רוק קלאסי ומודרני",
    imageUrl: "/images/classic-rock-hits.jpg",
  },
  {
    id: 5,
    title: "מוזיקה ישראלית",
    description: "המוזיקה הישראלית החמה של העונה",
    imageUrl: "/images/classic-israeli.jpeg",
  },
  {
    id: 6,
    title: "אוסף מטאל קלאסי",
    description: "המטאל הכבד והאהוב מכל הזמנים",
    imageUrl: "/images/heavy-metal-hits.webp",
  },
];

const artists = [
  {
    id: 1,
    name: "Kendrick Lamar",
    imageUrl: "/images/Kendrick-Lamar.jpg",
  },
  {
    id: 2,
    name: "Avenged Sevenfold",
    imageUrl: "/images/avenged-sevenfold1.webp",
  },
  {
    id: 3,
    name: "linkin-park",
    imageUrl: "/images/linkin-park.jpeg",
  },
  {
    id: 4,
    name: "Eden hason",
    imageUrl: "/images/eden-hason.jpg",
  },
  {
    id: 5,
    name: "Guns N' Roses",
    imageUrl: "/images/guns-and-roses.jpg",
  },
];

// ראוטים להחזרת מידע
app.get("/api/songs", (req, res) => {
  res.json(songs);
});

app.get("/api/artists", (req, res) => {
  res.json(artists);
});

app.get("/api/playlists", (req, res) => {
  res.json(playlists);
});


app.use(express.json());

// הרצת השרת
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

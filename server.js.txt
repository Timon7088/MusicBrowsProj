import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./Auth.js";

const app = express();
const port = 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/songs", express.static("public/songs"));
app.use("/images", express.static("public/images"));

const songs = [
  {
    id: 1,
    title: "Kendrick Lamar DNA",
    artist: "Kendrick lamar",
    cover: "/images/kendrick_dna.jpeg",
    url: "/songs/DNA-Kendrick-Lamar.mp3",
  },
  {
    id: 2,
    title: "Avenged-Sevenfold Dear God",
    artist: "Avenged Sevenfold",
    cover: "/images/Avenged-Sevenfold-Dear-God.jpeg",
    url: "/songs/Avenged-Sevenfold-Dear-God.mp3",
  },
  {
  id: 3,
  title: "Avenged-Sevenfold Bat Country",
  artist: "Avenged Sevenfold",
  cover: "/images/Avenged-Sevenfold-Bat-Country.jpeg",
  url: "/songs/Avenged-Sevefold-Bat-Country.mp3",
},
{
  id: 4,
  title: "Lost",
  artist: "Linkin Park",
  cover: "/images/Lost.jpeg",
  url: "/songs/Lost.mp3",
},
{
  id: 5,
  title: "what i've done",
  artist: "Linkin Park",
  cover: "/images/what-ive-done.jpeg",
  url: "/songs/what-ive-done.mp3",
},
{
id: 6,
title: "Highway Star",
artist: "Deep purple",
cover: "/images/Highway-Star.jpeg",
url: "/songs/Highway-Star.mp3",
},
{
  id: 7,
  title: "November Rain",
  artist: "Gun n' Roses",
  cover: "/images/November-Rain.jpg",
  url: "/songs/November-Rain.mp3",
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
    name: "Guns N' Roses",
    imageUrl: "/images/guns-and-roses.jpg",
  },
  {
    id: 5,
    name: "Deep Purple",
    imageUrl: "/images/Highway-Star.jpeg",
  },
];

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

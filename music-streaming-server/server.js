import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./Auth.js";

import songRoutes from "./routes/songRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";

const app = express();
const port = 4000;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

mongoose.connect("mongodb://localhost:27017/musicbrows", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ✅ ניתוב נכון לאימות משתמשים
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());


// קבצים סטטיים (שירים ותמונות)
app.use("/songs", express.static("public/songs"));
app.use("/images", express.static("public/images"));

// REST API: שירים ואומנים
app.use("/api/songs", songRoutes);
app.use("/api/artists", artistRoutes);

// פלייליסטים מדומים זמניים
// const playlists = [
//   {
//     id: 1,
//     title: "הלהיטים של 2025",
//     description: "השירים הכי חמים של השנה",
//     imageUrl: "/images/2025-hiphop-hits.jpeg"
//   },
//   {
//     id: 2,
//     title: "מוזיקת צ'יל",
//     description: "רוגע, קפה ושקיעה",
//     imageUrl: "/images/chill-Music.jpeg"
//   },
//   {
//     id: 3,
//     title: "ראפ שכולם אוהבים",
//     description: "שהשכונה קשה האיכות גבוהה",
//     imageUrl: "/images/Rap-Music.jpg"
//   },
//   {
//     id: 4,
//     title: "להיטי רוק",
//     description: "מיטב הלהיטים של רוק קלאסי ומודרני",
//     imageUrl: "/images/classic-rock-hits.jpg"
//   },
//   {
//     id: 5,
//     title: "להיטי רוק",
//     description: "מיטב הלהיטים של רוק קלאסי ומודרני",
//     imageUrl: "/images/classic-rock-hits.jpg"
//   }
// ];

app.get("/api/playlists", (req, res) => {
  res.json(playlists);
});

// הרצת השרת
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

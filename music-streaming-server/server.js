import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./Auth.js";
import songRoutes from "./routes/songRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// מכל הנסיונות הניתוב הכי נכון splat
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

// קבצים סטטיים (שירים ותמונות)
app.use('/songs', express.static(path.join(__dirname, 'public/songs')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// REST API: שירים ואומנים
app.use("/api/songs", songRoutes);
app.use("/api/artists", artistRoutes);

// הרצת השרת
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

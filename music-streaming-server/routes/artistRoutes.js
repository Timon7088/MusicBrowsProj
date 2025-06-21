import express from "express";
import { getAllArtists, getArtistById, createArtist, deleteArtist, updateArtist } from "../dao/artistDao.js";
import { updateSongsAfterArtistDeletion } from "../dao/songDao.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const artists = await getAllArtists();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בטעינת רשימת האמנים', error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const artist = await getArtistById(req.params.id);
    if(!artist) 
      return res.status(404).json({ message: 'אמן לא נמצא' });
    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בטעינת האמן', error: error.message });
  }
});

router.post("/", upload.single('image'), async (req, res) => {
  try{
    const imagesDir = path.join(__dirname, '../public/images');
    if(!fs.existsSync(imagesDir)) 
      fs.mkdirSync(imagesDir, { recursive: true });
    let imagePath = '';
    if(req.file){
      const imageFileName = `${req.file.originalname}`;
      const imageFilePath = path.join(imagesDir, imageFileName);
      if(fs.existsSync(imageFilePath))
        return res.status(400).json({ message: 'שם הקובץ כבר קיים' });

      fs.writeFileSync(imageFilePath, req.file.buffer);
      imagePath = `/images/${imageFileName}`;
    }
    const artistData ={
      ...req.body,
      image: imagePath
    };
    const artist = await createArtist(artistData);
    res.status(201).json(artist);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה ביצירת האמן', error: error.message });
  }
});

router.put("/:id",upload.single('image'), async (req, res) => {
  try{
    const artist = await getArtistById(req.params.id);
    if(!artist) 
      return res.status(404).json({ message: 'אמן לא נמצא' });
    const imagesDir = path.join(__dirname, '../public/images');
    let imagePath = artist.image;
    if(req.file){
      if(artist.image){
        const oldImagePath = path.join(__dirname, '../public', artist.image);
        if(fs.existsSync(oldImagePath))
          fs.unlinkSync(oldImagePath);
      }

      const imageFileName = `${req.file.originalname}`;
      const imageFilePath = path.join(imagesDir, imageFileName);
      fs.writeFileSync(imageFilePath, req.file.buffer);
      imagePath = `/images/${imageFileName}`;
    }
    const artistData ={
      ...req.body,
      image: imagePath
    };
    const updatedArtist = await updateArtist(req.params.id, artistData);
    res.json(updatedArtist);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בעדכון האמן', error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const artist = await getArtistById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: "האמן לא נמצא" });
    }

    // מחיקת תמונת האמן אם קיימת
    if (artist.image) {
      try {
        // נוודא שהנתיב המלא נכון
        const imagePath = path.join(__dirname, "..", "public", artist.image);
        console.log("מנסה למחוק תמונה בנתיב:", imagePath);
        
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("התמונה נמחקה בהצלחה");
        } else {
          console.log("התמונה לא נמצאה בנתיב:", imagePath);
        }
      } catch (imageError) {
        console.error("שגיאה במחיקת התמונה:", imageError);
        // נמשיך עם המחיקה גם אם יש בעיה עם התמונה
      }
    }

    // עדכון כל השירים המקושרים לאמן זה - הסרת הקישור לאמן
    await updateSongsAfterArtistDeletion(req.params.id);

    // מחיקת האמן
    await deleteArtist(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error("שגיאה במחיקת האמן:", error);
    res.status(500).json({
      message: "שגיאה במחיקת האמן",
      error: error.message,
    });
  }
});

export default router;

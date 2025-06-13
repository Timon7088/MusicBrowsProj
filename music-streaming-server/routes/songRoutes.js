import express from 'express';
import {
  getAllSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong
} from '../dao/songDao.js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { parseBuffer } from 'music-metadata';
import Artist from '../models/artist.js';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer();

// GET - כל השירים
router.get('/', async (req, res) => {
  try {
    const songs = await getAllSongs();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בטעינת השירים', error: error.message });
  }
});

// GET - שיר לפי מזהה
router.get('/:id', async (req, res) => {
  try {
    const song = await getSongById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'השיר לא נמצא' });
    }
    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בטעינת השיר', error: error.message });
  }
});

// POST - יצירת שיר חדש וקישור לאמן
router.post(
  '/',
  upload.fields([
    { name: 'url', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const songsDir = path.join(__dirname, '../public/songs');
      const imagesDir = path.join(__dirname, '../public/images');
      if (!fs.existsSync(songsDir)) fs.mkdirSync(songsDir, { recursive: true });
      if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

      const audioFile = req.files?.url?.[0];
      const coverFile = req.files?.cover?.[0];

      let audioPath = '';
      let coverPath = '';
      let duration = '0:00';

      if (audioFile) {
        const audioFileName = audioFile.originalname;
        const audioFilePath = path.join(songsDir, audioFileName);
        if (fs.existsSync(audioFilePath)) {
          return res.status(400).json({ message: 'קובץ אודיו בשם הזה כבר קיים' });
        }
        fs.writeFileSync(audioFilePath, audioFile.buffer);
        audioPath = `/songs/${audioFileName}`;
        try {
          const metadata = await parseBuffer(audioFile.buffer, audioFile.mimetype);
          const durationInSeconds = Math.round(metadata.format.duration || 0);
          const minutes = Math.floor(durationInSeconds / 60);
          const seconds = durationInSeconds % 60;
          duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } catch (error) {
          console.error('שגיאה בחישוב משך השיר:', error);
        }
      }

      if (coverFile) {
        const coverFileName = coverFile.originalname;
        const coverFilePath = path.join(imagesDir, coverFileName);
        if (fs.existsSync(coverFilePath)) {
          return res.status(400).json({ message: 'תמונת עטיפה בשם הזה כבר קיימת' });
        }
        fs.writeFileSync(coverFilePath, coverFile.buffer);
        coverPath = `/images/${coverFileName}`;
      }

      const artist = await Artist.findById(req.body.artist);
      if (!artist) {
        return res.status(400).json({ message: 'האמן לא נמצא במסד הנתונים' });
      }

      const song = {
        title: req.body.title,
        artist: req.body.artist,
        duration,
        url: audioPath,
        cover: coverPath
      };

      const newSong = await createSong(song);

      await Artist.findByIdAndUpdate(req.body.artist, {
        $push: { songs: newSong._id }
      });

      res.status(201).json(newSong);
    } catch (error) {
      console.error('שגיאה ביצירת שיר:', error);
      res.status(500).json({ message: 'שגיאה ביצירת שיר', error: error.message });
    }
  }
);

// PUT - עדכון שיר
router.put("/:id", upload.fields([
  { name: 'url', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    const song = await getSongById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: "השיר לא נמצא" });
    }

    // טיפול בקבצי אודיו
    let audioPath = song.url;
    if (req.files && req.files.url) {
      const oldAudioPath = path.join(__dirname, "../public", song.url);
      if (fs.existsSync(oldAudioPath)) fs.unlinkSync(oldAudioPath);

      const audioFileName = `${Date.now()}-${req.files.url[0].originalname}`;
      const audioFilePath = path.join(__dirname, "../public/songs", audioFileName);
      fs.writeFileSync(audioFilePath, req.files.url[0].buffer);
      audioPath = `/songs/${audioFileName}`;
    }

    // טיפול בתמונת עטיפה
    let coverPath = song.cover;
    if (req.files && req.files.cover) {
      const oldCoverPath = path.join(__dirname, "../public", song.cover);
      if (fs.existsSync(oldCoverPath)) fs.unlinkSync(oldCoverPath);

      const coverFileName = `${Date.now()}-${req.files.cover[0].originalname}`;
      const coverFilePath = path.join(__dirname, "../public/images", coverFileName);
      fs.writeFileSync(coverFilePath, req.files.cover[0].buffer);
      coverPath = `/images/${coverFileName}`;
    }

    // עדכון נתוני שיר
    const songData = {
      ...req.body,
      url: audioPath,
      cover: coverPath
    };

    // בדיקה אם צריך לעדכן את האמן
    if (songData.artist) {
      try {
        const newArtistId = new mongoose.Types.ObjectId(songData.artist);
        const oldArtistId = song.artist;

        if (oldArtistId && oldArtistId.toString() !== newArtistId.toString()) {
          await Artist.findByIdAndUpdate(oldArtistId, {
            $pull: { songs: song._id }
          });

          await Artist.findByIdAndUpdate(newArtistId, {
            $addToSet: { songs: song._id }
          });
        }
      } catch (error) {
        console.error("שגיאה בהמרת ID אמן:", error);
        return res.status(400).json({ message: "ID אמן לא תקין" });
      }
    }

    const updatedSong = await updateSong(req.params.id, songData);
    res.json(updatedSong);
  } catch (error) {
    console.error("שגיאה בעדכון השיר:", error);
    res.status(500).json({
      message: "שגיאה בעדכון השיר",
      error: error.message
    });
  }
});

// DELETE - כולל הסרה מהאמן וממשתמשים
router.delete('/:id', async (req, res) => {
  try {
    const song = await getSongById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'השיר לא נמצא' });
    }

    if (song.url) {
      const audioPath = path.join(__dirname, '../public', song.url);
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    }

    if (song.cover) {
      const coverPath = path.join(__dirname, '../public', song.cover);
      if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
    }

    await deleteSong(req.params.id);

    if (song.artist) {
      await Artist.findByIdAndUpdate(song.artist, {
        $pull: { songs: song._id }
      });
    }

    // מחיקת מזהה השיר מ־likedSongs של כל המשתמשים
    const client = new MongoClient('mongodb://localhost:27017/musicbrows');
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection('user');

    await usersCollection.updateMany(
      { likedSongs: song._id.toString() },
      { $pull: { likedSongs: song._id.toString() } }
    );

    await client.close();

    res.status(200).json({ message: 'השיר נמחק בהצלחה כולל הסרה מ-likedSongs' });
  } catch (error) {
    console.error('שגיאה במחיקת שיר:', error);
    res.status(500).json({ message: 'שגיאה במחיקת שיר', error: error.message });
  }
});

export default router;

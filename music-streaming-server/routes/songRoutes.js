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
import { auth } from '../Auth.js';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer();

// GET all songs
router.get('/', async (req, res) => {
  try {
    const songs = await getAllSongs();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching songs', error: error.message });
  }
});

// GET song by ID
router.get('/:id', async (req, res) => {
  try {
    const song = await getSongById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching song', error: error.message });
  }
});

// POST new song
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

      // Handle audio file
      if (audioFile) {
        const audioFileName = audioFile.originalname;
        const audioFilePath = path.join(songsDir, audioFileName);

        if (fs.existsSync(audioFilePath)) {
          return res.status(400).json({ message: 'A file with this name already exists' });
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
          console.error('Error reading audio duration:', error);
        }
      }

      // Handle cover image
      if (coverFile) {
        const coverFileName = coverFile.originalname;
        const coverFilePath = path.join(imagesDir, coverFileName);

        if (fs.existsSync(coverFilePath)) {
          return res.status(400).json({ message: 'A file with this name already exists' });
        }

        fs.writeFileSync(coverFilePath, coverFile.buffer);
        coverPath = `/images/${coverFileName}`;
      }

      const song = {
        title: req.body.title,
        artist: req.body.artist,
        duration: duration,
        url: audioPath,
        cover: coverPath
      };

      const newSong = await createSong(song);
      res.status(201).json(newSong);
    } catch (error) {
      console.error('Error creating song:', error);
      res.status(500).json({ message: 'Error creating song', error: error.message });
    }
  }
);

// PUT update song by ID
router.put(
  '/:id',
  upload.fields([
    { name: 'url', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const songsDir = path.join(__dirname, '../public/songs');
      const imagesDir = path.join(__dirname, '../public/images');
      const songId = req.params.id;

      // Get existing song
      const existingSong = await getSongById(songId);
      if (!existingSong) {
        return res.status(404).json({ message: 'Song not found' });
      }

      const audioFile = req.files?.url?.[0];
      const coverFile = req.files?.cover?.[0];

      let audioPath = existingSong.url;
      let coverPath = existingSong.cover;
      let duration = existingSong.duration;

      // Handle audio file update
      if (audioFile) {
        const audioFileName = audioFile.originalname;
        const audioFilePath = path.join(songsDir, audioFileName);

        // Delete old audio file if exists
        if (existingSong.url) {
          const oldAudioPath = path.join(__dirname, '..', existingSong.url);
          if (fs.existsSync(oldAudioPath)) {
            fs.unlinkSync(oldAudioPath);
          }
        }

        // Save new audio file
        fs.writeFileSync(audioFilePath, audioFile.buffer);
        audioPath = `/songs/${audioFileName}`;

        //update Duration
        try {
          const metadata = await parseBuffer(audioFile.buffer, audioFile.mimetype);
          const durationInSeconds = Math.round(metadata.format.duration || 0);
          const minutes = Math.floor(durationInSeconds / 60);
          const seconds = durationInSeconds % 60;
          duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } catch (error) {
          console.error('Error reading audio duration:', error);
        }
      }


      // Handle cover image update
      if (coverFile) {
        const coverFileName = coverFile.originalname;
        const coverFilePath = path.join(imagesDir, coverFileName);

        // Delete old cover file if exists
        if (existingSong.cover) {
          const oldCoverPath = path.join(__dirname, '..', existingSong.cover);
          if (fs.existsSync(oldCoverPath)) {
            fs.unlinkSync(oldCoverPath);
          }
        }

        // Save new cover file
        fs.writeFileSync(coverFilePath, coverFile.buffer);
        coverPath = `/images/${coverFileName}`;
      }

      // Prepare update data
      const updateData = {
        title: req.body.title || existingSong.title,
        artist: req.body.artist || existingSong.artist,
        duration: duration,
        url: audioPath,
        cover: coverPath
      };

      const updatedSong = await updateSong(songId, updateData);
      res.status(200).json(updatedSong);
    } catch (error) {
      console.error('Error updating song:', error);
      res.status(500).json({ message: 'Error updating song', error: error.message });
    }
  }
);

// DELETE song by ID
router.delete('/:id', async (req, res) => {
  try {
    // קודם מוצאים את השיר כדי לקבל את נתיבי הקבצים
    const song = await getSongById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'השיר לא נמצא' });
    }

    if (song.url) {
      const audioPath = path.join(__dirname, '../public', song.url);
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
    }

    if (song.cover) {
      const coverPath = path.join(__dirname, '../public', song.cover);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }

    // מחיקת השיר ממסד הנתונים
    const deletedSong = await deleteSong(req.params.id);
    if (!deletedSong) {
      return res.status(404).json({ message: 'השיר לא נמצא' });
    }
    
    // עדכון המשתמשים דרך MongoDB
    const client = new MongoClient("mongodb://localhost:27017/musicbrows");
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection("user");
    
    await usersCollection.updateMany(
      { likedSongs: req.params.id },
      { $pull: { likedSongs: req.params.id } }
    );
    
    await client.close();

    res.status(200).json({ message: 'השיר נמחק בהצלחה' });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ message: 'שגיאה במחיקת השיר', error: error.message });
  }
});

export default router;

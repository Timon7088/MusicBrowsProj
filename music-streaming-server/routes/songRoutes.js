import express from 'express';
import { getAllSongs, getSongById, createSong, updateSong, deleteSong } from '../dao/songDao.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const songs = await getAllSongs();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching songs', error: error.message });
  }
});

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

router.post('/', async (req, res) => {
  try {
    const newSong = await createSong(req.body);
    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ message: 'Error creating song', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedSong = await updateSong(req.params.id, req.body);
    if (!updatedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.status(200).json(updatedSong);
  } catch (error) {
    res.status(500).json({ message: 'Error updating song', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedSong = await deleteSong(req.params.id);
    if (!deletedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.status(200).json({ message: 'Song deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting song', error: error.message });
  }
});

export default router;

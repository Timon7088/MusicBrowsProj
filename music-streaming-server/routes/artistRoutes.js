import express from "express";
import { getAllArtists, getArtistById, createArtist, updateArtist, deleteArtist } from "../dao/artistDao.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const artists = await getAllArtists();
  res.json(artists);
});

router.get("/:id", async (req, res) => {
  const artist = await getArtistById(req.params.id);
  res.json(artist);
});

router.post("/", async (req, res) => {
  const artist = await createArtist(req.body);
  res.status(201).json(artist);
});

router.put("/:id", async (req, res) => {
  const artist = await updateArtist(req.params.id, req.body);
  res.json(artist);
});

router.delete("/:id", async (req, res) => {
  await deleteArtist(req.params.id);
  res.status(204).end();
});

export default router;

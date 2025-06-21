import Song from "../models/song.js";
import mongoose from "mongoose";

export const getAllSongs = async () => {
  return await Song.find().populate("artist");
};

export const getSongById = async (id) => {
  return await Song.findById(id).populate("artist");
};

export const createSong = async (songData) => {
  try {
    if (songData.artist) {
      songData.artist = new mongoose.Types.ObjectId(songData.artist);
    }
    
    return await Song.create(songData);
  } catch (error) {
    throw error;
  }
};

export const updateSong = async (id, songData) => {
  try {
    if (songData.artist) {
      songData.artist = new mongoose.Types.ObjectId(songData.artist);
    }
    
    return await Song.findByIdAndUpdate(
      id,
      { $set: songData },
      { new: true }
    ).populate("artist");
  } catch (error) {
    throw error;
  }
};

export const deleteSong = async (id) => {
  return await Song.findByIdAndDelete(id);
};

export const updateSongsAfterArtistDeletion = async (artistId) => {
  try {
    await Song.updateMany(
      { artist: artistId },
      { $set: { artist: null } }
    );
  } catch (error) {
    console.error("Error updating songs after artist deletion:", error);
    throw error;
  }
};

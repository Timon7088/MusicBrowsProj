import Artist from "../models/artist.js";
import mongoose from "mongoose";

export const getAllArtists = async () => {
  return await Artist.find().populate("songs");
};

export const getArtistById = async (id) => {
  return await Artist.findById(id).populate("songs");
};

export const createArtist = async (data) => {
  const artist = new Artist({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return await artist.save();
};

export const updateArtist = async (id, data) => {
  return await Artist.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true }
  );
};

export const deleteArtist = async (id) => {
  return await Artist.findByIdAndDelete(id);
};

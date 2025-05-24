import  Song  from "../models/song.js";

export const getAllSongs = async () => {
  return await Song.find().populate("artist");
};

export const getSongById = async (id) => {
  return await Song.findById(id).populate("artist");
};

export const createSong = async (data) => {
  const song = new Song({
    ...data,
    createdAt: new Date(),
    updateAt: new Date()
  });
  return await song.save();
};

export const updateSong = async (id, data) => {
  return await Song.findByIdAndUpdate(
    id,
    { ...data, updateAt: new Date() },
    { new: true }
  );
};

export const deleteSong = async (id) => {
  return await Song.findByIdAndDelete(id);
};

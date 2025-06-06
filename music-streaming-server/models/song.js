import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  artist: {type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
  duration: { type: String, required: true }, 
  url: { type: String, required: true, unique: true },
  cover: { type: String, required: true, default: "" },
  createdAt: { type: Date, default: Date.now},
  updateAt: { type: Date, default: Date.now }
});
export const Song = mongoose.model("song", songSchema);
export default Song;
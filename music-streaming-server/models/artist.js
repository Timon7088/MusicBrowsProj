import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "song" }],  // שים לב: songs ברבים
  bio: { type: String, default: "" },
  image: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Artist = mongoose.model("Artist", artistSchema);
export default Artist;

import mongoose from "mongoose";
import Song from "./models/song.js";
import Artist from "./models/artist.js";

await mongoose.connect("mongodb://localhost:27017/musicbrows", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("Seeding in to the Data Base");

const artistData = [
  { name: "Kendrick Lamar", image: "/images/Kendrick-Lamar.jpg" },
  { name: "Avenged Sevenfold", image: "/images/avenged-sevenfold1.webp" },
  { name: "Linkin Park", image: "/images/linkin-park.jpeg" },
  { name: "Guns N' Roses", image: "/images/guns-and-roses.jpg" },
  { name: "Deep Purple", image: "/images/Highway-Star.jpeg" },
  { name: "Kansas", image: "/images/Carry-on-my-wayward-son.jpeg" },
];

for (const artist of artistData) {
  await Artist.updateOne(
    { name: artist.name },
    { $set: artist },
    { upsert: true }
  );
}

const artistsFromDB = await Artist.find();
const getArtistId = (name) =>
  artistsFromDB.find((a) => a.name.toLowerCase() === name.toLowerCase())?._id;

const songData = [
  {
    title: "Kendrick Lamar DNA",
    artist: getArtistId("Kendrick Lamar"),
    cover: "/images/kendrick_dna.jpeg",
    url: "/songs/DNA-Kendrick-Lamar.mp3",
    duration: "3:06",
  },
  {
    title: "Avenged-Sevenfold Dear God",
    artist: getArtistId("Avenged Sevenfold"),
    cover: "/images/Avenged-Sevenfold-Dear-God.jpeg",
    url: "/songs/Avenged-Sevenfold-Dear-God.mp3",
    duration: "6:33",
  },
  {
    title: "Avenged-Sevenfold Bat Country",
    artist: getArtistId("Avenged Sevenfold"),
    cover: "/images/Avenged-Sevenfold-Bat-Country.jpeg",
    url: "/songs/Avenged-Sevenfold-Bat-Country.mp3",
    duration: "5:11",
  },
  {
    title: "Lost",
    artist: getArtistId("Linkin Park"),
    cover: "/images/Lost.jpeg",
    url: "/songs/Lost.mp3",
    duration: "3:19",
  },
  {
    title: "What I've Done",
    artist: getArtistId("Linkin Park"),
    cover: "/images/what-ive-done.jpeg",
    url: "/songs/what-ive-done.mp3",
    duration: "3:29",
  },
  {
    title: "Highway Star",
    artist: getArtistId("Deep Purple"),
    cover: "/images/Highway-Star.jpeg",
    url: "/songs/Highway-Star.mp3",
    duration: "6:14",
  },
  {
    title: "November Rain",
    artist: getArtistId("Guns N' Roses"),
    cover: "/images/November-Rain.jpg",
    url: "/songs/November-Rain.mp3",
    duration: "9:00",
  },
  {
    title: "Carry On Wayward Son",
    artist: getArtistId("Kansas"),
    cover: "/images/Carry-on-my-wayward-son.jpeg",
    url: "/songs/Carry-On-Wayward-Son.mp3",
    duration: "5:23",
  },
];

for (const song of songData) {
  await Song.updateOne(
    { title: song.title },
    { $set: song },
    { upsert: true }
  );
}

console.log("Data has successfully updated");
await mongoose.disconnect();

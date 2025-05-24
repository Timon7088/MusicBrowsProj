import mongoose from "mongoose";
import Song from "./models/song.js";
import Artist from "./models/artist.js";

await mongoose.connect("mongodb://localhost:27017/musicbrows", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

await Song.deleteMany({});
await Artist.deleteMany({});

// הכנסת אמנים
const artists = await Artist.insertMany([
  {
    name: "Kendrick Lamar",
    image: "/images/Kendrick-Lamar.jpg",
  },
  {
    name: "Avenged Sevenfold",
    image: "/images/avenged-sevenfold1.webp",
  },
  {
    name: "Linkin Park",
    image: "/images/linkin-park.jpeg",
  },
  {
    name: "Guns N' Roses",
    image: "/images/guns-and-roses.jpg",
  },
  {
    name: "Deep Purple",
    image: "/images/Highway-Star.jpeg",
  }
]);

const getArtistId = (name) =>
  artists.find((a) => a.name.toLowerCase() === name.toLowerCase())?._id;

await Song.insertMany([
  {
    title: "Kendrick Lamar DNA",
    artist: getArtistId("Kendrick Lamar"),
    cover: "/images/kendrick_dna.jpeg",
    url: "/songs/DNA-Kendrick-Lamar.mp3",
    duration: 215,
  },
  {
    title: "Avenged-Sevenfold Dear God",
    artist: getArtistId("Avenged Sevenfold"),
    cover: "/images/Avenged-Sevenfold-Dear-God.jpeg",
    url: "/songs/Avenged-Sevenfold-Dear-God.mp3",
    duration: 310,
  },
  {
    title: "Avenged-Sevenfold Bat Country",
    artist: getArtistId("Avenged Sevenfold"),
    cover: "/images/Avenged-Sevenfold-Bat-Country.jpeg",
    url: "/songs/Avenged-Sevenfold-Bat-Country.mp3",
    duration: 290,
  },
  {
    title: "Lost",
    artist: getArtistId("Linkin Park"),
    cover: "/images/Lost.jpeg",
    url: "/songs/Lost.mp3",
    duration: 225,
  },
  {
    title: "What I've Done",
    artist: getArtistId("Linkin Park"),
    cover: "/images/what-ive-done.jpeg",
    url: "/songs/what-ive-done.mp3",
    duration: 210,
  },
  {
    title: "Highway Star",
    artist: getArtistId("Deep Purple"),
    cover: "/images/Highway-Star.jpeg",
    url: "/songs/Highway-Star.mp3",
    duration: 330,
  },
  {
    title: "November Rain",
    artist: getArtistId("Guns N' Roses"),
    cover: "/images/November-Rain.jpg",
    url: "/songs/November-Rain.mp3",
    duration: 540,
  }
]);

console.log("Database seeded successfully!");
await mongoose.disconnect();

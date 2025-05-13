import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function SongCarousel() {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/songs")
      .then((res) => setSongs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">שירים מוצעים</h2>
      <Swiper spaceBetween={10} slidesPerView={3}>
        {songs.map((song) => (
          <SwiperSlide key={song.id}>
            <div className="rounded shadow-md p-2 bg-white">
              <img
                src={song.cover}
                alt={song.title}
                className="rounded w-full"
              />
              <h3 className="mt-2 text-center">{song.title}</h3>
              <p className="text-sm text-center text-gray-500">{song.artist}</p>
              <audio controls className="w-full mt-2">
                <source src={song.url} type="audio/mpeg" />
              </audio>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

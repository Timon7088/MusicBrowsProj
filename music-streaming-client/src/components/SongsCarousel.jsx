import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useMusicPlayerContext } from "../store/musicPlayerContext";
import { Play } from "lucide-react";

export default function SongCarousel() {
  const [songs, setSongs] = useState([]);
  const { dispatch, state } = useMusicPlayerContext();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/songs")
      .then((res) => {
        setSongs(res.data);

        if (state.queue.length === 0) {
          dispatch({ type: "SET_QUEUE", payload: res.data });
        }
      })
      .catch((err) => console.error("שגיאה בשליפת שירים:", err));
  }, [dispatch, state.queue.length]);

  const playSong = (song) => {
    const isCurrent = state.currentSong?.id === song.id;
    if (!isCurrent) {
      dispatch({ type: "SET_SONG", payload: song });
    } else {
      dispatch({ type: "PLAY" });
    }
  };

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        🎵 שירים מומלצים עבורך
      </h2>

      <Swiper
        modules={[Navigation]}
        navigation={true}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 10 },
          640: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 5, spaceBetween: 30 },
        }}
        className="group"
      >
        {songs.map((song) => (
          <SwiperSlide key={song.id}>
            <div className="h-[350px] bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col justify-between items-center transition hover:bg-gray-700 duration-300 cursor-pointer">
              <img
                src={song.cover}
                alt={song.title}
                className="w-full h-40 object-contain rounded-xl"
              />
              <div className="text-center w-full">
                <h3 className="text-lg font-bold text-green-300 mt-2 truncate">
                  {song.title}
                </h3>
                <p className="text-sm text-gray-300 truncate">{song.artist}</p>
              </div>
              <button
                className="mt-2 px-4 py-1 bg-green-600 rounded-full hover:bg-green-500 transition"
                onClick={() => playSong(song)}
              >
                <Play
                  size={20}
                  className="text-black fill-black"
                  fill="currentColor"
                />
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

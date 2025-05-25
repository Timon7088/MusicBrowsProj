import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useMusicPlayerContext } from "../store/musicPlayerContext";
import { Play, Heart } from "lucide-react";
import { authClient } from "../clients/auth-client";

export default function SongCarousel() {
  const [songs, setSongs] = useState([]);
  const { data } = authClient.useSession();
  const user = data?.user;
  const { dispatch, state } = useMusicPlayerContext();

  const isFavored = (songId) => {
    return user?.likedSongs?.includes(songId);
  };
  useEffect(() => {
    // שליפת שירים
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
    const isCurrent = state.currentSong?._id === song._id;
    if (isCurrent) {
      dispatch({ type: "PLAY" });
    } else {
      dispatch({ type: "SET_SONG", payload: song });
      dispatch({ type: "PLAY" });
    }
  };

  const addToFavorites = async (songId) => {
    if (!user) return alert("עליך להתחבר כדי להוסיף שיר לאהובים");
    try {
      const shouldRemove = isFavored(songId);
      if (shouldRemove) {
        const updatedLikedSongs = user.likedSongs.filter((id) => id !== songId);
        await authClient.updateUser({ likedSongs: updatedLikedSongs });
        alert("השיר הוסר מרשימת האהובים שלך!");
      } else {
        const data = await authClient.updateUser({
          likedSongs: [...(user.likedSongs || []), songId],
        });
        alert("השיר נוסף לרשימת האהובים שלך!");
      }
    } catch (err) {
      console.error("שגיאה בהוספת שיר לאהובים:", err);
      alert("שגיאה בהוספת השיר לרשימת האהובים");
    }
  };

  return (
    <div className="mr-auto ml-auto p-4 max-w-7xl relative">
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
          <SwiperSlide key={song._id}>
            <div className="relative h-[350px] bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col justify-between items-center transition hover:bg-gray-700 duration-300 cursor-pointer">
              {/* כפתור לב בפינה העליונה */}
              {user && (
                <button
                  onClick={() => addToFavorites(song._id)}
                  className="absolute top-2 right-2 text-green-500 hover:bg-green-600 z-10"
                  title="הוסף לרשימת אהובים"
                >
                  <Heart
                    size={20}
                    fill={isFavored(song._id) ? "currentColor" : "transparent"}
                  />
                </button>
              )}

              <img
                src={song.cover}
                alt={song.title}
                className="w-full h-40 object-contain rounded-xl"
              />
              <div className="text-center w-full">
                <h3 className="text-lg font-bold text-green-300 mt-2 truncate">
                  {song.title}
                </h3>
                <p className="text-sm text-gray-300 truncate">
                  {song.artist?.name || "אמן לא ידוע"}
                </p>
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

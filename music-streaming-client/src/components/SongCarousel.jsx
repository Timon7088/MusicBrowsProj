import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useMusicPlayerContext } from "../store/musicPlayerContext";
import { Play, Pause, Heart } from "lucide-react";
import { authClient } from "../clients/auth-client";
import toast from "react-hot-toast";

export default function SongCarousel() {
  const [songs, setSongs] = useState([]);
  const { data } = authClient.useSession();
  const user = data?.user;
  const { dispatch, state } = useMusicPlayerContext();

  const isFavored = (songId) => {
    return user?.likedSongs?.includes(songId);
  };

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

  const togglePlay = (song) => {
    const isCurrent = state.currentSong?._id === song._id;
    if (isCurrent) {
      if (state.isPlaying) {
        dispatch({ type: "PAUSE" });
      } else {
        dispatch({ type: "PLAY" });
      }
    } else {
      dispatch({ type: "SET_QUEUE", payload: songs });
      dispatch({ type: "SET_SONG", payload: song });
      dispatch({ type: "PLAY" });
    }
  };

  const addToFavorites = async (songId) => {
    if (!user) return toast.error("עליך להתחבר כדי להוסיף שיר לאהובים");
    try {
      const shouldRemove = isFavored(songId);
      if (shouldRemove) {
        const updatedLikedSongs = user.likedSongs.filter((id) => id !== songId);
        await authClient.updateUser({ likedSongs: updatedLikedSongs });
        toast.error("השיר הוסר מרשימת האהובים שלך!");
      } else {
        const data = await authClient.updateUser({
          likedSongs: [...(user.likedSongs || []), songId],
        });
        toast.success("השיר נוסף לרשימת האהובים שלך!");
      }
    } catch (err) {
      toast.error("שגיאה בהוספת השיר לרשימת האהובים");
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
            <div
              className={`relative h-[350px] rounded-2xl shadow-lg p-4 flex flex-col justify-between items-center transition duration-300 cursor-pointer ${
                state.currentSong?._id === song._id && state.isPlaying
                  ? "bg-gray-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {user && (
                <button
                  onClick={() => addToFavorites(song._id)}
                  className="absolute top-2 right-2 text-green-500 hover:text-green-300 z-10"
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
                onClick={() => togglePlay(song)}
                className="bg-green-500 text-white rounded-full p-2 hover:bg-green-300 transition"
                title={
                  state.currentSong?._id === song._id && state.isPlaying
                    ? "השהה שיר"
                    : "נגן שיר"
                }
              >
                {state.currentSong?._id === song._id && state.isPlaying ? (
                  <Pause size={18} className="text-gray-900 fill-gray-900" />
                ) : (
                  <Play size={18} className="text-gray-900 fill-gray-900" />
                )}
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

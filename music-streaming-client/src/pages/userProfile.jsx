import { useEffect, useState } from "react";
import axios from "axios";
import { Play, Trash, Pause } from "lucide-react";
import { useMusicPlayerContext } from "../store/musicPlayerContext";
import { authClient } from "../clients/auth-client";
import toast from "react-hot-toast";

export default function UserProfile() {
  const SERVER_URL = "http://localhost:4000";
  const { data } = authClient.useSession();
  const user = data.user;
  const [likedSongs, setLikedSongs] = useState([]);
  const { state, dispatch } = useMusicPlayerContext();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/songs")
      .then((res) => {
        const userLikedSongs = user.likedSongs
          .map((likedSong) => {
            const findLikedSongs = res.data.find(
              (song) => likedSong === song._id
            );
            return findLikedSongs
              ? {
                  ...findLikedSongs,
                  addedAt: likedSong.addedAt || new Date().toISOString(),
                }
              : null;
          })
          .filter((song) => song !== null);
        setLikedSongs(userLikedSongs);
      })
      .catch((err) => console.error("שגיאה בשליפת שירים:", err));
  }, [user.likedSongs]);

  const togglePlay = (song) => {
    const isCurrent = state.currentSong?._id === song._id;
    if (isCurrent) {
      if (state.isPlaying) {
        dispatch({ type: "PAUSE" });
      } else {
        dispatch({ type: "PLAY" });
      }
    } else {
      dispatch({ type: "SET_QUEUE", payload: likedSongs });
      dispatch({ type: "SET_SONG", payload: song });
      dispatch({ type: "PLAY" });
    }
  };

  const clearSong = async (songId) => {
    try {
      const updatedLikedSongs = user.likedSongs.filter((id) => id !== songId);
      await authClient.updateUser({ likedSongs: updatedLikedSongs });
      setLikedSongs((prev) => prev.filter((song) => song._id !== songId));
      toast.success("השיר הוסר מרשימת האהובים שלך!");
    } catch (err) {
      toast.error("אירעה שגיאה בעת הסרת השיר.");
    }
  };

  const clearFavorites = async () => {
    try {
      await authClient.updateUser({ likedSongs: [] });
      setLikedSongs([]);
      toast.success("רשימת האהובים שלך פונתה בהצלחה!");
    } catch (err) {
      toast.error("שגיאה בפינוי רשימת האהובים");
    }
  };

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString("he-IL");
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-4 py-10"
      dir="rtl"
    >
      <h1 className="text-4xl font-bold text-green-400 mb-6">
        שלום {user?.name}
      </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">השירים האהובים עליך</h2>

        {likedSongs.length === 0 ? (
          <p className="text-gray-400">אין לך שירים אהובים עדיין.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead className="border-b border-gray-700 text-gray-400 text-sm">
                <tr>
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">שיר</th>
                  <th className="py-2 px-2 hidden sm:table-cell">אמן</th>
                  <th className="py-2 px-2 hidden md:table-cell">
                    נוסף בתאריך
                  </th>
                  <th className="py-2 px-2 hidden lg:table-cell">זמן</th>
                  <th className="py-2 px-2">נגן</th>
                  <th className="py-2 px-2">מחיקה</th>
                </tr>
              </thead>
              <tbody>
                {likedSongs.map((song, index) => (
                  <tr
                    key={song._id}
                    className={`transition duration-300 ${
                      state.currentSong?._id === song._id && state.isPlaying
                        ? "bg-gray-600"
                        : "hover:bg-gray-800"
                    }`}
                  >
                    <td className="py-3 px-2 text-gray-400 text-sm">
                      {index + 1}
                    </td>
                    <td className="py-3 px-2 flex items-center gap-4">
                      <img
                        src={`${SERVER_URL}${song.cover}`}
                        alt={song.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="text-sm font-medium text-white">
                        {song.title}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-300 hidden sm:table-cell">
                      {song.artist?.name || "אמן לא ידוע"}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-400 hidden md:table-cell">
                      {formatDate(song.addedAt)}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-400 hidden lg:table-cell">
                      {song.duration || "3:00"}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => togglePlay(song)}
                        className="bg-green-500 text-white rounded-full p-2 hover:bg-green-400 transition"
                        title={
                          state.currentSong?._id === song._id && state.isPlaying
                            ? "השהה שיר"
                            : "נגן שיר"
                        }
                      >
                        {state.currentSong?._id === song._id &&
                        state.isPlaying ? (
                          <Pause
                            size={18}
                            className="text-gray-900 fill-gray-900"
                          />
                        ) : (
                          <Play
                            size={18}
                            className="text-gray-900 fill-gray-900"
                          />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => clearSong(song._id)}
                        className="hover:text-red-600 text-white p-2"
                        title="מחק שיר"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-center">
        {likedSongs.length > 0 && (
          <button
            onClick={clearFavorites}
            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-500 transition"
          >
            ניקוי כל השירים
          </button>
        )}
      </div>
    </div>
  );
}

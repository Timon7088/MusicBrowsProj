import { useEffect, useState } from "react";
import axios from "axios";
import { Play, Trash, Pause } from "lucide-react";
import { useMusicPlayerContext } from "../store/musicPlayerContext";
import { authClient } from "../clients/auth-client";

export default function UserProfile() {
  const { data } = authClient.useSession();
  const user = data.user;
  const [likedSongs, setLikedSongs] = useState([]);
  const { state, dispatch } = useMusicPlayerContext();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/songs")
      .then((res) => {
        const userLikedSongs = user.likedSongs.map((likedSong) => {
          const findLikedSongs = res.data.find(
            (song) => likedSong === song._id
          );
          return {
            ...findLikedSongs,
            addedAt: likedSong.addedAt || new Date().toISOString(),
          };
        });
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
    // מחיקת שיר בודדת על ידי אייקון פח
    try {
      const updatedLikedSongs = user.likedSongs.filter((id) => id !== songId);
      await authClient.updateUser({ likedSongs: updatedLikedSongs });
      setLikedSongs((prev) => prev.filter((song) => song._id !== songId));
    } catch (err) {
      console.error("שגיאה במחיקת שיר מהאהובים:", err);
      alert("אירעה שגיאה בעת הסרת השיר.");
    }
  };

  const clearFavorites = async () => {
    // כפתור מחיקה של כל השירים מאיזור הלקוח
    try {
      await authClient.updateUser({ likedSongs: [] });
      setLikedSongs([]);
      alert("רשימת האהובים שלך פונתה בהצלחה!");
    } catch (err) {
      console.error("שגיאה בפינוי רשימת האהובים:", err);
      alert("שגיאה בפינוי רשימת האהובים");
    }
  };

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString("he-IL");
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-6 py-10"
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
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">שיר</th>
                  <th className="py-2 px-4">אמן</th>
                  <th className="py-2 px-4">נוסף בתאריך</th>
                  <th className="py-2 px-4">זמן</th>
                  <th className="py-2 px-4">נגן</th>
                  <th className="py-2 px-4">מחיקה</th>
                </tr>
              </thead>
              <tbody>
                {likedSongs.map((song, index) => (
                  <tr key={song._id} className="hover:bg-gray-800 transition">
                    <td className="py-3 px-4 text-gray-400">{index + 1}</td>
                    <td className="py-3 px-4 flex items-center gap-4">
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="text-right">
                        <p className="text-white font-semibold">{song.title}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {song.artist?.name || "אמן לא ידוע"}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {formatDate(song.addedAt)}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {song.duration || "3:00"}
                    </td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4">
                      <button
                        onClick={() => clearSong(song._id)}
                        className=" hover:bg-red-600 text-white rounded-full p-2"
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
      <div className=" text-center">
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

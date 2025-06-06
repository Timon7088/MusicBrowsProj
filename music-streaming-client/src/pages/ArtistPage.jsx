import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Play, Pause, Heart } from "lucide-react";
import { useMusicPlayerContext } from "../store/musicPlayerContext";
import { authClient } from "../clients/auth-client";
import toast from "react-hot-toast";

export default function ArtistPage() {
  const { id } = useParams();
  const [songs, setSongs] = useState([]);
  const [artist, setArtist] = useState(null);
  const { data } = authClient.useSession();
  const user = data?.user;
  const { state, dispatch } = useMusicPlayerContext();

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/artists/${id}`)
      .then((res) => {
        setArtist(res.data);
        setSongs(res.data.songs || []);
      })
      .catch((err) => console.error("שגיאה בטעינת אמן:", err));
  }, [id]);

  const togglePlay = (song) => {
    const isCurrent = state.currentSong?._id === song._id;
    if (isCurrent) {
      dispatch({ type: state.isPlaying ? "PAUSE" : "PLAY" });
    } else {
      dispatch({ type: "SET_QUEUE", payload: songs });
      dispatch({ type: "SET_SONG", payload: song });
      dispatch({ type: "PLAY" });
    }
  };

  const isFavored = (songId) => user?.likedSongs?.includes(songId);

  const addToFavorites = async (songId) => {
    if (!user) return toast.error("עליך להתחבר כדי להוסיף שיר לאהובים");
    try {
      const shouldRemove = isFavored(songId);
      if (shouldRemove) {
        const updatedLikedSongs = user.likedSongs.filter((id) => id !== songId);
        await authClient.updateUser({ likedSongs: updatedLikedSongs });
        toast.error("השיר הוסר מרשימת האהובים שלך!");
        setUser({ ...user, likedSongs: updatedLikedSongs });
      } else {
        const updatedLikedSongs = [...(user.likedSongs || []), songId];
        await authClient.updateUser({ likedSongs: updatedLikedSongs });
        toast.success("השיר נוסף לרשימת האהובים שלך!");
        setUser({ ...user, likedSongs: updatedLikedSongs });
      }
    } catch (err) {
      toast.error("שגיאה בהוספת השיר לרשימת האהובים");
    }
  };

  if (!artist) {
    return <div className="text-white p-4">טוען את פרטי האמן...</div>;
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-4 py-10"
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
        {artist.image && (
          <img
            src={artist.image}
            alt={artist.name}
            className="w-40 h-40 rounded-lg object-cover shadow-md"
          />
        )}
        <div>
          <h1 className="text-4xl font-bold text-green-400 mb-2">
            {artist.name}
          </h1>
          <p className="text-gray-300">
            {artist.bio || "אין מידע זמין על האמן."}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">רשימת שירים</h2>

      {songs.length === 0 ? (
        <p className="text-gray-400">אין שירים להצגה כרגע.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="border-b border-gray-700 text-gray-400 text-sm">
              <tr>
                <th className="py-2 px-2">#</th>
                <th className="py-2 px-2">שיר</th>
                <th className="py-2 px-2 hidden sm:table-cell">אמן</th>
                <th className="py-2 px-2 hidden md:table-cell">משך</th>
                <th className="py-2 px-2">נגן</th>
                <th className="py-2 px-2">אהבתי</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => {
                const isCurrent = state.currentSong?._id === song._id;
                const playing = isCurrent && state.isPlaying;
                return (
                  <tr
                    key={song._id}
                    className={`transition duration-300 ${
                      playing ? "bg-gray-600" : "hover:bg-gray-800"
                    }`}
                  >
                    <td className="py-3 px-2 text-gray-400 text-sm">
                      {index + 1}
                    </td>
                    <td className="py-3 px-2 flex items-center gap-4">
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="text-sm font-medium text-white">
                        {song.title}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-300 hidden sm:table-cell">
                      {song.artist?.name || artist.name}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-400 hidden md:table-cell">
                      {song.duration || "3:00"}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => togglePlay(song)}
                        className="bg-green-500 text-white rounded-full p-2 hover:bg-green-400 transition"
                        title={playing ? "השהה שיר" : "נגן שיר"}
                      >
                        {playing ? (
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
                    <td className="py-3 px-2 text-green-500 hover:text-green-300 transition">
                      <button
                        onClick={() => addToFavorites(song._id)}
                        title="הוספה לרשימת אהובים"
                        className={`transition ${
                          !user ? "opacity-40" : "hover:scale-110"
                        }`}
                      >
                        <Heart
                          size={20}
                          fill={
                            isFavored(song._id) ? "currentColor" : "transparent"
                          }
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

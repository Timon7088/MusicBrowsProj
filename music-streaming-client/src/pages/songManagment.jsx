import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { authClient } from "../clients/auth-client";

export default function SongManagment() {
  const { data } = authClient.useSession();
  const user = data?.user;
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/artists");
        setArtists(response.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };
    fetchArtists();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/songs");
        setSongs(response.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSongs([]);
      return;
    }

    const filtered = songs.filter((song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSongs(filtered);
  }, [searchTerm, songs]);

  const handleSongSelect = (songTitle) => {
    setSearchTerm(songTitle);
    setShowSuggestions(false);
  };

  const OnSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await axios.post(
      "http://localhost:4000/api/songs",
      formData
    );
    console.log(response);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4"
      dir="rtl"
    >
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-400 mb-2">
            ניהול שירים
          </h1>
          <p className="text-gray-400">הוסף שיר חדש למערכת</p>
        </div>

        <form onSubmit={OnSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300"
              >
                שם השיר
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="הכנס את שם השיר"
              />
              {showSuggestions && filteredSongs.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredSongs.map((song) => (
                    <div
                      key={song._id}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                      onClick={() => handleSongSelect(song.title)}
                    >
                      {song.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="artist"
                className="block text-sm font-medium text-gray-300"
              >
                שם האמן
              </label>
              <select
                name="artist"
                id="artist"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">בחר אמן</option>
                {artists.map((artist) => (
                  <option key={artist._id} value={artist._id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-300"
              >
                קובץ השיר
              </label>
              <input
                type="file"
                name="url"
                id="url"
                required
                accept="audio/*"
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
                dir="ltr"
              />
            </div>

            <div>
              <label
                htmlFor="cover"
                className="block text-sm font-medium text-gray-300"
              >
                תמונת כיסוי
              </label>
              <input
                type="file"
                name="cover"
                id="cover"
                required
                accept="image/*"
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            הוסף שיר
          </button>
        </form>
      </div>
    </div>
  );
}

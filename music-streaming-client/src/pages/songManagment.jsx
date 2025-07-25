import { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router";
import axios from "axios";
import { authClient } from "../clients/auth-client";
import toast from "react-hot-toast";

export default function SongManagment() {
  const SERVER_URL = "http://localhost:4000";
  const { data, isLoading } = authClient.useSession();
  const user = data?.user;
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState("add");
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    if (!isLoading && user?.role !== "admin") {
      navigate("/");
    }
  }, [user, isLoading]);

  // GET Requests
  const fetchArtists = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/artists");
      setArtists(response.data);
    } catch (error) {
      console.error("Error fetching artists:", error);
      toast.error("שגיאה בטעינת רשימת האמנים");
    }
  };

  const fetchSongs = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/songs");
      setSongs(response.data);
    } catch (error) {
      console.error("Error fetching songs:", error);
      toast.error("שגיאה בטעינת רשימת השירים");
    }
  };

  // POST Request
  const handleAddSong = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      if (
        !formData.get("title") ||
        !formData.get("artist") ||
        !formData.get("url")
      ) {
        toast.error("חובה למלא את כל השדות הנדרשים");
        return;
      }

      const response = await axios.post(
        "http://localhost:4000/api/songs",
        formData
      );
      toast.success("השיר נוסף בהצלחה!");
      setSongs([...songs, response.data]);
      e.target.reset();
    } catch (error) {
      console.error("Error adding song:", error);
      toast.error(error.response?.data?.message || "שגיאה בהוספת השיר");
    }
  };

  // PUT Request
  const handleEditSong = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const newSong = await axios.put(
        `http://localhost:4000/api/songs/${selectedSong._id}`,
        formData
      );
      toast.success("השיר עודכן בהצלחה!");
      setSongs(
        songs.map((song) =>
          song._id === newSong.data._id ? newSong.data : song
        )
      ); // Refresh songs list
      setSelectedSong(null); // Reset selected song
    } catch (error) {
      console.error("Error updating song:", error);
      toast.error("שגיאה בעדכון השיר");
    }
  };

  // DELETE Request
  const handleDeleteSong = async (songId) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק שיר זה?")) {
      try {
        await axios.delete(`http://localhost:4000/api/songs/${songId}`);
        toast.success("השיר נמחק בהצלחה!");
        fetchSongs(); // Refresh songs list
      } catch (error) {
        console.error("Error deleting song:", error);
        toast.error("שגיאה במחיקת השיר");
      }
    }
  };

  const handleSongSelect = (songTitle) => {
    setSearchTerm(songTitle);
    setShowSuggestions(false);
  };

  useEffect(() => {
    fetchArtists();
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

  const renderAddSongForm = () => (
    <form onSubmit={handleAddSong} className="mt-8 space-y-6">
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
          <Select
            className="w-full"
            classNamePrefix="select"
            options={artists.map((artist) => ({
              value: artist._id,
              label: artist.name,
            }))}
            onChange={(selectedOption) => {
              const form = document.querySelector("form");
              const artistInput = document.createElement("input");
              artistInput.type = "hidden";
              artistInput.name = "artist";
              artistInput.value = selectedOption.value;

              const existingInput = form.querySelector('input[name="artist"]');
              if (existingInput) {
                existingInput.remove();
              }

              form.appendChild(artistInput);
            }}
            placeholder="בחר אמן"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                "&:hover": {
                  borderColor: "#374151",
                },
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#1f2937",
                maxHeight: "150px",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#374151" : "#1f2937",
                color: "white",
                "&:hover": {
                  backgroundColor: "#374151",
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: "white",
              }),
              input: (base) => ({
                ...base,
                color: "white",
              }),
            }}
          />
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
  );

  const renderEditSongForm = () => (
    <div className="mt-8 space-y-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          בחר שיר לעריכה
        </label>
        <Select
          className="w-full"
          classNamePrefix="select"
          options={songs.map((song) => ({
            value: song._id,
            label: song.title,
          }))}
          onChange={(selectedOption) => {
            const song = songs.find((s) => s._id === selectedOption.value);
            setSelectedSong(song);
          }}
          placeholder="בחר שיר"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#1f2937", // bg-gray-800
              borderColor: "#374151", // border-gray-700
              "&:hover": {
                borderColor: "#374151",
              },
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#1f2937",
              maxHeight: "150px",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? "#374151" : "#1f2937",
              color: "white",
              "&:hover": {
                backgroundColor: "#374151",
              },
            }),
            singleValue: (base) => ({
              ...base,
              color: "white",
            }),
            input: (base) => ({
              ...base,
              color: "white",
            }),
          }}
        />
      </div>

      {selectedSong && (
        <form onSubmit={handleEditSong} className="space-y-6">
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
                value={selectedSong.title}
                onChange={(e) => {
                  setSelectedSong({ ...selectedSong, title: e.target.value });
                }}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="הכנס את שם השיר"
              />
            </div>

            <div>
              <label
                htmlFor="artist"
                className="block text-sm font-medium text-gray-300"
              >
                שם האמן
              </label>
              <Select
                className="w-full"
                classNamePrefix="select"
                options={artists.map((artist) => ({
                  value: artist._id,
                  label: artist.name,
                }))}
                onChange={(selectedOption) => {
                  const form = document.querySelector("form");
                  const artistInput = document.createElement("input");
                  artistInput.type = "hidden";
                  artistInput.name = "artist";
                  artistInput.value = selectedOption.value;

                  const existingInput = form.querySelector(
                    'input[name="artist"]'
                  );
                  if (existingInput) {
                    existingInput.remove();
                  }

                  form.appendChild(artistInput);
                }}
                placeholder="בחר אמן"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                    "&:hover": {
                      borderColor: "#374151",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "#1f2937",
                    maxHeight: "150px",
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? "#374151" : "#1f2937",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#374151",
                    },
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "white",
                  }),
                  input: (base) => ({
                    ...base,
                    color: "white",
                  }),
                }}
              />
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
                required={false}
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
                required={false}
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
            עדכן שיר
          </button>
        </form>
      )}
    </div>
  );

  const renderDeleteSongsList = () => (
    <div className="mt-8">
      <div className="space-y-4">
        {songs.map((song) => (
          <div
            key={song._id}
            className="flex items-center justify-between p-2 bg-gray-800 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              {song.cover && (
                <img
                  src={`${SERVER_URL}${song.cover}`}
                  alt={song.title}
                  className="w-16 h-16 rounded-lg object-cover p-2 ml-2"
                />
              )}
              <div>
                <h3 className="text-lg font-medium text-white">{song.title}</h3>
                <p className="text-gray-400">
                  {artists.find((a) => a._id === song.artist)?.name}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDeleteSong(song._id)}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              מחק
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">
            ניהול שירים
          </h1>
        </div>

        {/* Tabs Navigation */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            className={`px-6 py-3 rounded-lg transition-all ml-4 ${
              activeTab === "add" ? "bg-green-500 text-black" : "bg-gray-800"
            }`}
            onClick={() => setActiveTab("add")}
          >
            הוספת שיר
          </button>
          <button
            className={`px-6 py-3 rounded-lg transition-all ${
              activeTab === "edit" ? "bg-green-500 text-black" : "bg-gray-800"
            }`}
            onClick={() => setActiveTab("edit")}
          >
            עריכת שיר
          </button>
          <button
            className={`px-6 py-3 rounded-lg transition-all ${
              activeTab === "delete" ? "bg-green-500 text-black" : "bg-gray-800"
            }`}
            onClick={() => setActiveTab("delete")}
          >
            מחיקת שיר
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-gray-900 rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
          {activeTab === "add" && renderAddSongForm()}
          {activeTab === "edit" && renderEditSongForm()}
          {activeTab === "delete" && renderDeleteSongsList()}
        </div>
      </div>
    </div>
  );
}

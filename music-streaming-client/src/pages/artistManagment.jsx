import { useEffect, useState } from "react";
import axios from "axios";
import { authClient } from "../clients/auth-client";
import toast from "react-hot-toast";
import Select from "react-select";

export default function ArtistManagment() {
  const SERVER_URL = "http://localhost:4000";
  const { data } = authClient.useSession();
  const user = data?.user;
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState("add");
  const [selectedArtist, setSelectedArtist] = useState(null);

  // GET Request
  const fetchArtists = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/artists");
      setArtists(response.data);
    } catch (error) {
      console.error("Error fetching artists:", error);
      toast.error("שגיאה בטעינת רשימת האמנים");
    }
  };

  // POST Request
  const handleAddArtist = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const response = await axios.post(
        "http://localhost:4000/api/artists",
        formData
      );
      toast.success("האמן נוסף בהצלחה!");
      setArtists([...artists, response.data]);
      e.target.reset(); // Reset form
    } catch (error) {
      console.error("Error adding artist:", error);
      toast.error("שגיאה בהוספת האמן");
    }
  };

  // PUT Request
  const handleEditArtist = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const newArtist = await axios.put(
        `http://localhost:4000/api/artists/${selectedArtist._id}`,
        formData
      );
      toast.success("האמן עודכן בהצלחה!");
      setArtists(
        artists.map((artist) =>
          artist._id === newArtist.data._id ? newArtist.data : artist
        )
      );
      setSelectedArtist(null);
    } catch (error) {
      console.error("Error updating artist:", error);
      toast.error("שגיאה בעדכון האמן");
    }
  };

  // DELETE Request
  const handleDeleteArtist = async (artistId) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק אמן זה?")) {
      try {
        await axios.delete(`http://localhost:4000/api/artists/${artistId}`);
        toast.success("האמן נמחק בהצלחה!");
        fetchArtists();
      } catch (error) {
        console.error("Error deleting artist:", error);
        toast.error("שגיאה במחיקת האמן");
      }
    }
  };

  const handleArtistSelect = (artistName) => {
    setSearchTerm(artistName);
    setShowSuggestions(false);
  };

  // Effects
  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredArtists([]);
      return;
    }

    const filtered = artists.filter((artist) =>
      artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArtists(filtered);
  }, [searchTerm, artists]);

  // Render Methods
  const renderAddArtistForm = () => (
    <form onSubmit={handleAddArtist} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            שם האמן
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="הכנס את שם האמן"
          />
          {showSuggestions && filteredArtists.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredArtists.map((artist) => (
                <div
                  key={artist._id}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                  onClick={() => handleArtistSelect(artist.name)}
                >
                  {artist.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-300"
          >
            תמונת האמן
          </label>
          <input
            type="file"
            name="image"
            id="image"
            required={false}
            accept="image/*"
            className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
            dir="ltr"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            תיאור האמן
          </label>
          <textarea
            name="bio"
            id="bio"
            required={false}
            className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="הכנס תיאור לאמן"
            rows="4"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
      >
        הוסף אמן
      </button>
    </form>
  );

  const renderEditArtistForm = () => (
    <div className="mt-8 space-y-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          בחר אמן לעריכה
        </label>
        <Select
          className="w-full"
          classNamePrefix="select"
          options={artists.map((artist) => ({
            value: artist._id,
            label: artist.name,
          }))}
          onChange={(selectedOption) => {
            const artist = artists.find((a) => a._id === selectedOption.value);
            setSelectedArtist(artist);
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

      {selectedArtist && (
        <form onSubmit={handleEditArtist} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                שם האמן
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={selectedArtist.name}
                onChange={(e) => {
                  setSelectedArtist({
                    ...selectedArtist,
                    name: e.target.value,
                  });
                }}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="הכנס את שם האמן"
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-300"
              >
                תמונת האמן
              </label>
              <input
                type="file"
                name="image"
                id="image"
                required={false}
                accept="image/*"
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
                dir="ltr"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300"
              >
                תיאור האמן
              </label>
              <textarea
                name="bio"
                id="bio"
                required={false}
                value={selectedArtist.description}
                onChange={(e) => {
                  setSelectedArtist({
                    ...selectedArtist,
                    description: e.target.value,
                  });
                }}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="הכנס תיאור לאמן"
                rows="4"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            עדכן אמן
          </button>
        </form>
      )}
    </div>
  );

  const renderDeleteArtistsList = () => (
    <div className="mt-8">
      <div className="space-y-4">
        {artists.map((artist) => (
          <div
            key={artist._id}
            className="flex items-center justify-between p-2 bg-gray-800 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              {artist.image && (
                <img
                  src={`${SERVER_URL}${artist.image}`}
                  alt={artist.name}
                  className="w-16 h-16 rounded-lg object-cover p-2 ml-2"
                />
              )}
              <div>
                <h3 className="text-lg font-medium text-white">
                  {artist.name}
                </h3>
                <p className="text-gray-400">{artist.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleDeleteArtist(artist._id)}
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
            ניהול אמנים
          </h1>
        </div>

        {/* Tabs Navigation */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            className={`px-6 py-3 rounded-lg transition-all ml-4 ${
              activeTab === "add" ? "bg-green-500" : "bg-gray-800"
            }`}
            onClick={() => setActiveTab("add")}
          >
            הוספת אמן
          </button>
          <button
            className={`px-6 py-3 rounded-lg transition-all ${
              activeTab === "edit" ? "bg-green-500" : "bg-gray-800"
            }`}
            onClick={() => setActiveTab("edit")}
          >
            עריכת אמן
          </button>
          <button
            className={`px-6 py-3 rounded-lg transition-all ${
              activeTab === "delete" ? "bg-green-500" : "bg-gray-800"
            }`}
            onClick={() => setActiveTab("delete")}
          >
            מחיקת אמן
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-gray-900 rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
          {activeTab === "add" && renderAddArtistForm()}
          {activeTab === "edit" && renderEditArtistForm()}
          {activeTab === "delete" && renderDeleteArtistsList()}
        </div>
      </div>
    </div>
  );
}

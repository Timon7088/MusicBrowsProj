import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Home from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserProfile from "./pages/userProfile";
import ArtistPage from "./pages/ArtistPage";
import { MusicPlayerProvider } from "./store/musicPlayerContext";
import MusicPlayer from "./components/music-player";
import SongManagment from "./pages/songManagment";
import ArtistManagment from "./pages/artistManagment";
import UserManagment from "./pages/userManagment";

export default function App() {
  return (
    <MusicPlayerProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-black text-white">
          <Toaster position="top-center" />
          <Header />

          <main className="flex-grow p-4 mb-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/About" element={<About />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/userProfile" element={<UserProfile />} />
              <Route path="/artist/:id" element={<ArtistPage />} />
              <Route
                path="/admin/songs-management"
                element={<SongManagment />}
              />
              <Route
                path="/admin/artists-management"
                element={<ArtistManagment />}
              />
                            <Route
                path="auth/admin/users"
                element={<UserManagment />}
              />
            </Routes>
          </main>

          {/* נגן קבוע בתחתית העמוד */}
          <MusicPlayer />
        </div>
      </Router>
    </MusicPlayerProvider>
  );
}

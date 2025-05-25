import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserProfile from "./pages/userProfile";
import { MusicPlayerProvider } from "./store/musicPlayerContext";
import MusicPlayer from "./components/music-player";

export default function App() {
  return (
    <MusicPlayerProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-black text-white">
          <Header />

          <main className="flex-grow p-4 mb-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/About" element={<About />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/userProfile" element={<UserProfile />} />
            </Routes>
          </main>

          {/* נגן קבוע בתחתית העמוד */}
          <MusicPlayer />
        </div>
      </Router>
    </MusicPlayerProvider>
  );
}

import { useRef, useEffect, useState } from "react";
import { useMusicPlayerContext } from "../store/musicPlayerContext";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const { state, dispatch } = useMusicPlayerContext();
  const currentSong = state.currentSong;

  const [volume, setVolume] = useState(0.2); // ווליום התחלתי
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // עדכון זמן תוך כדי ניגון
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.volume = volume;
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
    };
  }, [volume, currentSong]);

  // טוען שיר חדש
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    audio.load();
  }, [currentSong]);

  // הפעלה אוטומטית לפי state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      if (state.isPlaying) {
        audio.play().catch(() => dispatch({ type: "PAUSE" }));
      }
    };

    if (state.isPlaying) {
      audio.addEventListener("canplaythrough", handleCanPlay);
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
    };
  }, [state.isPlaying, currentSong]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (state.isPlaying) {
        audio.pause();
        dispatch({ type: "PAUSE" });
      } else {
        if (audio.readyState < 3) {
          audio.load();
          setTimeout(() => {
            audio
              .play()
              .then(() => dispatch({ type: "PLAY" }))
              .catch(() => dispatch({ type: "PAUSE" }));
          }, 50);
          return;
        }

        await audio.play();
        dispatch({ type: "PLAY" });
      }
    } catch (err) {
      console.error("שגיאה בפעולת ניגון:", err);
      dispatch({ type: "PAUSE" });
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (sec) => {
    if (isNaN(sec)) return "00:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-black text-white px-4 py-3 flex items-center justify-center z-50 shadow-md border-t border-green-500 text-sm text-gray-400">
        בחר שיר כדי להתחיל לנגן
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white px-4 py-2 flex flex-col gap-2 z-50 shadow-md border-t border-green-500">
      <audio ref={audioRef} preload="auto">
        <source src={currentSong.url} type="audio/mpeg" />
      </audio>

      {/* שורת שליטה עליונה - 3 עמודות */}
      <div className="grid grid-cols-3 items-center gap-3 sm:gap-6 w-full max-w-6xl mx-auto">
        {/* פרטי שיר - שמאל */}
        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
          <img
            src={currentSong.cover}
            alt="cover"
            className="w-10 h-10 rounded object-cover"
          />
          <div className="truncate">
            <p className="text-sm font-semibold text-green-400 truncate">
              {currentSong.title}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {currentSong.artist?.name}
            </p>
          </div>
        </div>

        {/* כפתורי ניגון - מרכז */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => dispatch({ type: "PREVIOUS_SONG" })}>
            <SkipBack
              size={20}
              className="text-green-500 hover:text-green-400 transition"
            />
          </button>
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-green-500 text-black flex items-center justify-center hover:bg-green-400 transition"
          >
            {state.isPlaying ? (
              <Pause size={18} className="text-gray-900 fill-gray-900" />
            ) : (
              <Play size={18} className="text-gray-900 fill-gray-900" />
            )}
          </button>
          <button onClick={() => dispatch({ type: "NEXT_SONG" })}>
            <SkipForward
              size={20}
              className="text-green-500 hover:text-green-400 transition"
            />
          </button>
        </div>

        {/* ווליום - ימין */}
        <div className="flex gap-2 items-center justify-end w-full sm:w-40">
          <Volume2 size={18} className="text-gray-300" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-green-500"
          />
        </div>
      </div>

      {/* פס זמן */}
      <div className="flex items-center gap-3 w-full max-w-6xl mx-auto px-1">
        <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration}
          step={0.01}
          value={currentTime}
          onChange={handleSeek}
          className="flex-grow accent-green-500"
        />
        <span className="text-xs text-gray-400">{formatTime(duration)}</span>
      </div>
    </div>
  );
}

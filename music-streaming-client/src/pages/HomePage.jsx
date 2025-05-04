import React from "react";
import PlayListCube from "../components/PlayListCube";
import Artist from "../components/Artist";

export default function Home() {
  const playlists = [
    {
      id: 1,
      title: "הלהיטים של 2025",
      description: "השירים הכי חמים של השנה",
      imageUrl: "/images/2025-hiphop-hits.jpeg",
    },
    {
      id: 2,
      title: "מוזיקת צ'יל",
      description: "רוגע, קפה ושקיעה",
      imageUrl: "/images/chill-Music.jpeg",
    },
    {
      id: 3,
      title: "ראפ שכולם אוהבים",
      description: "שהשכונה קשה האיכות גבוהה",
      imageUrl: "/images/Rap-Music.jpg",
    },
    {
      id: 4,
      title: "להיטי רוק",
      description: "מיטב הלהיטים של רוק קלאסי ומודרני",
      imageUrl: "/images/classic-rock-hits.jpg",
    },
    {
      id: 5,
      title: "מוזיקה ישראלית",
      description: "המוזיקה הישראלית החמה של העונה",
      imageUrl: "/images/classic-israeli.jpeg",
    },
    {
      id: 6,
      title: "אוסף מטאל קלאסי",
      description: "המטאל הכבד והאהוב מכל הזמנים",
      imageUrl: "/images/heavy-metal-hits.webp",
    },
  ];

  const artists = [
    {
      id: 1,
      name: "Kendrick Lamar",
      imageUrl: "/images/Kendrick-Lamar.jpg",
    },
    {
      id: 2,
      name: "Avenged Sevenfold",
      imageUrl: "/images/avenged-sevenfold1.webp",
    },
    {
      id: 3,
      name: "linkin-park",
      imageUrl: "/images/linkin-park.jpeg",
    },
    {
      id: 4,
      name: "Eden hason",
      imageUrl: "/images/eden-hason.jpg",
    },
    {
      id: 5,
      name: "Guns N' Roses",
      imageUrl: "/images/guns-and-roses.jpg",
    },
  ];
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-6 text-green-400 text-center">
        ברוך הבא אורח
      </h1>

      {/* כותרת פלייליסטים */}
      <h2 className="mt-5 text-3xl font-bold mb-4 text-white text-center">
        🎶 פלייליסטים מוכנים
      </h2>

      {/* קרוסלת פלייליסטים */}

      <PlayListCube playlists={playlists} />

      {/* כותרת אמנים */}
      <h2 className="mt-5 text-3xl font-bold mb-4 text-white text-center">
        🎤 אמנים מובילים
      </h2>

      {/* קרוסלת אמנים */}

      <Artist artists={artists} />
    </div>
  );
}

import React from "react";
import Artist from "../components/Artist";
import SongCarousel from "../components/SongCarousel";
import { authClient } from "../clients/auth-client";

export default function Home() {
  const { data } = authClient.useSession();
  const user = data?.user;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-6 text-green-400 text-center">
        !{user?.name} ברוך הבא
      </h1>

      {/* כותרת לקרוסלת שירים*/}
      <h2 className="mt-5 text-3xl font-bold mb-4 text-white text-center">
        השירים שלנו
      </h2>
      <SongCarousel />

      {/* כותרת אמנים */}
      <h2 className="mt-5 text-3xl font-bold mb-4 text-white text-center">
        אמנים מובילים
      </h2>
      <Artist />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";

export default function PlayListCube() {
  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/playlists")
      .then((res) => setPlaylists(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mr-auto ml-auto max-w-7xl h-80 my-12">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        // autoplay={{ delay: 0, disableOnInteraction: false }}
        loop:false
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 10 },
          640: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 5, spaceBetween: 30 },
        }}
        className="mb-12"
      >
        {playlists.map((playlist) => (
          <SwiperSlide key={playlist.id}>
            <div className=" h-[350px] bg-gray-800 rounded-xl overflow-hidden shadow hover:bg-gray-700 transition cursor-pointer">
              <img
                src={playlist.imageUrl}
                alt={playlist.title}
                className="w-full h-56 object-contain"
              />
              <div className="p-4 h-28">
                <h2 className="text-xl text-center font-semibold text-green-300 mb-1">
                  {playlist.title}
                </h2>
                <p className="text-gray-300 text-base text-center">
                  {playlist.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

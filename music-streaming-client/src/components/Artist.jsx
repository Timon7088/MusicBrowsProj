import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";
import { Link } from "react-router-dom"; // הוספת Link

export default function Artist() {
  const SERVER_URL = "http://localhost:4000";
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/artists")
      .then((res) => setArtists(res.data))
      .catch((err) => console.error("שגיאה בטעינת אמנים:", err));
  }, []);

  return (
    <div className="m-auto max-w-7xl my-12">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        loop={false}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 10 },
          640: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 30 },
        }}
      >
        {artists.map((artist) => (
          <SwiperSlide key={artist._id}>
            <Link to={`/artist/${artist._id}`}>
              <div className="overflow-hidden transition cursor-pointer m-auto flex flex-col items-center w-44 h-56">
                <img
                  src={`${SERVER_URL}${artist.image}`}
                  alt={artist.name}
                  className="w-40 h-40 rounded-full object-cover mb-2"
                />
                <h2 className="text-xl text-white text-center">
                  {artist.name}
                </h2>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Artist({ artists }) {
  //   if (!Array.isArray(artists)) {
  //     return null;
  //   }

  return (
    <div className=" m-auto max-w-7xl my-12">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
       // autoplay={{ delay: 0, disableOnInteraction: false }}
        loop : false
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 10 },
          640: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 30 },
        }}
      >
        {artists.map((artist) => (
          <SwiperSlide key={artist.id}>
            <div className="overflow-hidden transition cursor-pointer m-auto flex flex-col items-center w-44 h-56">
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="w-40 h-40 rounded-full object-cover mb-2"
              />
              <h2 className="text-xl text-white text-center">{artist.name}</h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

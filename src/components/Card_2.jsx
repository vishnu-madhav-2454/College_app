import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const Card_2 = ({
  images = [],
  title = 'Campus Name',
  description = 'A beautiful campus with excellent infrastructure and academic environment.',
  mapsLink = 'https://maps.google.com',
  bgColor = "#9b0c0c" 
}) => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 7000);

    return () => clearInterval(timeoutRef.current);
  }, [images.length]);

  const resetInterval = () => {
    clearInterval(timeoutRef.current);
    timeoutRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetInterval();
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
    resetInterval();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full z-10">
      <div
        className="w-full max-w-[1200px] rounded-xl overflow-hidden shadow-2xl transition-all duration-300"
        style={{ backgroundColor: bgColor }}
      >
        {/* Image Slider */}
        <div className="relative w-full h-[40vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Slide ${index}`}
                className="w-full h-[40vh] sm:h-[60vh] lg:h-[70vh] object-contain flex-shrink-0"
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 px-3 py-1 text-2xl sm:text-3xl font-bold bg-white/80 text-black rounded-full hover:bg-black hover:text-white transition"
          >
            {'<'}
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 px-3 py-1 text-2xl sm:text-3xl font-bold bg-white/80 text-black rounded-full hover:bg-black hover:text-white transition"
          >
            {'>'}
          </button>
        </div>

        {/* Text Content */}
        <div className="w-full p-6 text-center" style={{ backgroundColor: bgColor }}>
          <h2 className="font-extrabold text-[22px] sm:text-[26px] lg:text-[30px] text-white mb-2">
            {title}
          </h2>
          <p className="text-white text-sm sm:text-base mb-4">
            {description}
          </p>
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white font-semibold rounded-full hover:scale-105 transition hover:bg-black hover:text-white"
          >
            <FaMapMarkerAlt size={18} />
            View on Map
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card_2;


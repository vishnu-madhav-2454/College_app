import React, { useState, useEffect, useRef } from 'react';

const ImageSlider = ({ 
  images = [], 
  autoSlideInterval = 7000,
  className = "",
  showNavigation = true 
}) => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (images.length <= 1) return;

    timeoutRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, autoSlideInterval);

    return () => clearInterval(timeoutRef.current);
  }, [images.length, autoSlideInterval]);

  const resetInterval = () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, autoSlideInterval);
    }
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetInterval();
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
    resetInterval();
  };

  if (images.length === 0) {
    return <div className={`bg-gray-200 ${className}`}>No images available</div>;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-contain flex-shrink-0"
          />
        ))}
      </div>

      {showNavigation && images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 px-3 py-1 text-2xl sm:text-3xl font-bold bg-white/80 text-black rounded-full hover:bg-black hover:text-white transition-colors duration-200"
            aria-label="Previous image"
          >
            {'<'}
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 px-3 py-1 text-2xl sm:text-3xl font-bold bg-white/80 text-black rounded-full hover:bg-black hover:text-white transition-colors duration-200"
            aria-label="Next image"
          >
            {'>'}
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
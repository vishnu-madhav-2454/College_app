import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import PageLayout from '../layout/PageLayout';
import ImageSlider from '../ui/ImageSlider';
import { campusData, campusImages } from '../../data/campusData';

const CampusCard = ({ title, description, mapsLink, bgColor }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full z-10">
      <div
        className="w-full max-w-[1200px] rounded-xl overflow-hidden shadow-2xl transition-all duration-300"
        style={{ backgroundColor: bgColor }}
      >
        {/* Image Slider */}
        <ImageSlider 
          images={campusImages}
          className="w-full h-[40vh] sm:h-[60vh] lg:h-[70vh]"
        />

        {/* Text Content */}
        <div className="w-full p-6 text-center" style={{ backgroundColor: bgColor }}>
          <h2 className="font-extrabold text-[22px] sm:text-[26px] lg:text-[30px] text-white mb-2">
            {title}
          </h2>
          <p className="text-white text-sm sm:text-base mb-4 leading-relaxed">
            {description}
          </p>
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white font-semibold rounded-full hover:scale-105 transition-transform duration-200 hover:bg-black hover:text-white"
          >
            <FaMapMarkerAlt size={18} />
            View on Map
          </a>
        </div>
      </div>
    </div>
  );
};

const Campuses = () => {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center space-y-10 py-10 px-4">
        {campusData.map((campus, idx) => (
          <CampusCard
            key={campus.title}
            title={campus.title}
            description={campus.description}
            mapsLink={campus.mapsLink}
            bgColor={campus.bgColor}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default Campuses;
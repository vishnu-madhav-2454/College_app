import React from 'react';
import PageLayout from '../layout/PageLayout';
import { homeContent } from '../../data/homeData';

const HomeCard = ({ content, img, name, role, number }) => {
  return (
    <div className="w-full max-w-[1400px] mx-auto rounded-xl shadow-lg bg-white p-4 m-6 transition-all duration-700 hover:shadow-2xl hover:-translate-y-1 fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] bg-[#55a760] rounded-xl p-6 gap-1">
        
        {/* Left: Text Section */}
        <div className="flex items-center justify-center text-center text-white text-[16px] md:text-[18px] font-semibold leading-relaxed">
          {content}
        </div>

        {/* Right: Image + Name/Info */}
        <div className="flex flex-col justify-center items-center space-y-6">
          <img
            src={img}
            alt={`${name} profile`}
            className="w-[90%] max-w-[360px] object-cover rounded-lg shadow-md scale-in"
          />

          <div className="w-[90%] max-w-[360px] bg-white rounded-lg shadow flex flex-col sm:flex-row justify-between items-center px-4 py-3 gap-2 text-center sm:text-left card-hover">
            <div className="text-[#1a1a1a]">
              <h1
                className="font-extrabold text-[24px] sm:text-[28px] text-[#1a1a1a]"
                style={{ WebkitTextStroke: '0.5px black' }}
              >
                {name}
              </h1>
              <p className="text-sm font-medium">{role}</p>
              {number && <p className="text-sm font-medium">Cell: {number}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <PageLayout>
      <div className="flex justify-center items-center flex-col py-6">
        {homeContent.map((item, index) => (
          <HomeCard
            key={index}
            content={item.content}
            img={item.img}
            name={item.name}
            role={item.role}
            number={item.number}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default Home;
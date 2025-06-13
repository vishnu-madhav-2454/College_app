import React from 'react';
import ScoreCard from './Card_5_1';
import { NavLink } from 'react-router-dom'; 

const Card_5 = ({
  name = "Top Scorers",
  titleColor = "#9b0c0c",
  barColor = "#9b0c0c",
  bgColor = "#f94c10",
  viewMoreLink = "/results",
  students = [], 
}) => {
  return (
    <div className="m-4 sm:m-6 p-4 sm:p-6 rounded-lg shadow-lg bg-white w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 sm:mb-4">
        <div
          className="font-semibold text-[24px] sm:text-[32px] md:text-[36px] lg:text-[40px] leading-tight"
          style={{ color: titleColor }}
        >
          {name}
        </div>
        <NavLink to={`/achievements/${name}`} className="w-fit">
          <button className="text-xs sm:text-sm md:text-base font-medium text-white bg-[#333] px-3 py-1.5 rounded hover:bg-black transition">
            View More
          </button>
        </NavLink>
      </div>

      {/* Divider Bar */}
      <div
        className="h-[4px] sm:h-[6px] w-full rounded-lg mb-4"
        style={{ backgroundColor: barColor }}
      ></div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {students.map((student, idx) => (
          <ScoreCard
            key={idx}
            image={student.image}
            score={student.score}
            total={student.total}
            name={student.name}
            hallTicket={student.hallTicket}
            bgColor={bgColor}
          />
        ))}
      </div>
    </div>
  );
};

export default Card_5;


import React from 'react';

const ScoreCard = ({
  image,
  score,
  total,
  name,
  hallTicket,
  bgColor = "#f94c10",
}) => {
  return (
    <div
      className="w-[160px] h-[240px] rounded-xl text-white overflow-hidden shadow-md flex flex-col items-center transition-all duration-700 hover:scale-110"
      style={{ backgroundColor: bgColor }}
    >
      <img
        src={image}
        alt="student"
        className="w-full h-[140px] object-cover border-b-2 border-white"
      />
      <div className="text-center p-2 flex flex-col justify-center h-[100px]">
        <div className="text-[28px] font-bold leading-none">{score}</div>
        <div className="text-[14px] font-semibold mb-1">/ {total}</div>
        <div className="text-[11px] font-bold">{name}</div>
        <div className="text-[10px] font-semibold">HT.No. {hallTicket}</div>
      </div>
    </div>
  );
};

export default ScoreCard;

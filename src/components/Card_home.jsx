import React from 'react';

const Card_home = (props) => {
  return (
    <div className="w-full max-w-[1400px] mx-auto rounded-xl shadow-lg bg-white p-4 m-6 transition-all duration-700 hover:scale-110">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] bg-[#55a760] rounded-xl p-6 gap-1">

        {/* Left: Text Section */}
        <div className="flex items-center justify-center text-center text-white text-[16px] md:text-[18px] font-semibold leading-relaxed ">
          {props.content}
        </div>

        {/* Right: Image + Name/Info (side by side in column) */}
        <div className="flex flex-col justify-center items-center space-y-6">
          {/* Image Section */}
          <img
            src={props.img}
            alt="Card Visual"
            className="w-[90%] max-w-[360px] object-cover rounded-lg shadow-md"
          />

          {/* Name & Info - wider and horizontal on larger screens */}
          <div className="w-[90%] max-w-[360px] bg-white rounded-lg shadow flex flex-col sm:flex-row justify-between items-center px-4 py-3 gap-2 text-center sm:text-left">
            <div className="text-[#1a1a1a]">
              <h1
                className="font-extrabold text-[24px] sm:text-[28px] text-[#1a1a1a]"
                style={{ WebkitTextStroke: '0.5px black' }}
              >
                {props.name}
              </h1>
              <p className="text-sm font-medium">{props.role}</p>
              <p className="text-sm font-medium">Cell: {props.number}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card_home;


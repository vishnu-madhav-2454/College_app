import React from 'react';

const CourseCard = ({
  title = "Integrated MPC + IIT-JEE",
  description = "This course is designed for students aiming to pursue engineering.",
  features = [],
  bgColor = "#07557c" // default color
}) => {
  return (
    <div
      className={`max-w-[700px] shadow-xl rounded-xl p-6 relative z-10 transition-all duration-600 hover:scale-110`}
      style={{ backgroundColor: bgColor }}
    >
      <h2 className="text-2xl font-[1000] text-white mb-2">{title}</h2>
      <p className="text-white mb-4">{description}</p>
      <ul className="list-disc list-inside text-white space-y-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-white font-bold">{index + 1}.</span>
            <span className="ml-2">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseCard;


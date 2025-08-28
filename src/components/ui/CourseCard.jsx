import React from 'react';

const CourseCard = ({
  title = "Course Title",
  description = "Course description",
  features = [],
  bgColor = "#07557c"
}) => {
  return (
    <div
      className="max-w-[700px] shadow-xl rounded-xl p-6 relative z-10 transition-all duration-600 hover:scale-110"
      style={{ backgroundColor: bgColor }}
    >
      <h2 className="text-2xl font-extrabold text-white mb-2">{title}</h2>
      <p className="text-white mb-4 leading-relaxed">{description}</p>
      
      {features.length > 0 && (
        <ul className="list-none text-white space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-white font-bold mr-2 flex-shrink-0">
                {index + 1}.
              </span>
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseCard;
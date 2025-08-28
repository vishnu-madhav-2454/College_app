import React from 'react';

const CourseCard = ({
  title = "Course Title",
  description = "Course description",
  features = [],
  bgColor = "#07557c",
  image,
  duration,
  level,
  tags = []
}) => {
  return (
    <div
      className="max-w-[700px] shadow-xl rounded-xl relative transition-transform duration-500 overflow-hidden fade-in-up transform-gpu will-change-transform hover:-translate-y-1 hover:shadow-2xl"
      style={{ backgroundColor: bgColor }}
    >
      {image && (
        <img src={image} alt={title} className="w-full h-40 object-cover opacity-90" />
      )}
      <div className="p-6">
        <h2 className="text-2xl font-extrabold text-white mb-1">{title}</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {duration && (
            <span className="text-xs font-semibold text-black/90 bg-white/90 px-2 py-0.5 rounded-full">
              {duration}
            </span>
          )}
          {level && (
            <span className="text-xs font-semibold text-black/90 bg-white/90 px-2 py-0.5 rounded-full">
              {level}
            </span>
          )}
          {tags.slice(0, 4).map((t, i) => (
            <span key={i} className="text-xs font-medium text-white/90 border border-white/40 px-2 py-0.5 rounded-full">
              {t}
            </span>
          ))}
        </div>
        <p className="text-white mb-4 leading-relaxed">{description}</p>
      
        {features.length > 0 && (
          <ul className="list-none text-white space-y-2 stagger">
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
    </div>
  );
};

export default CourseCard;
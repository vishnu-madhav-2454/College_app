import React from 'react';

const FacultyCard = ({ 
  name, 
  designation, 
  experience, 
  description, 
  img, 
  color = '#1480c0' 
}) => {
  if (!name || !img) {
    return null;
  }

  return (
    <div
      className="w-[230px] h-auto rounded-xl shadow-md p-4 flex flex-col items-center text-center transition-all duration-700 transform hover:scale-110 group"
      style={{ backgroundColor: color }}
    >
      <img 
        src={img} 
        alt={`${name} profile`} 
        className="w-[180px] h-[180px] mb-2 object-cover rounded-full border-4 border-white/20" 
      />
      <h2 className="text-[23px] font-extrabold text-white group-hover:text-inherit transition-colors">
        {name}
      </h2>
      {designation && (
        <p className="text-[18px] text-white group-hover:text-inherit transition-colors">
          {designation}
        </p>
      )}
      {experience && (
        <p className="text-[15px] text-white group-hover:text-inherit transition-colors">
          Experience - {experience}
        </p>
      )}
      {description && (
        <p className="text-[11px] text-white mt-2 group-hover:text-inherit transition-colors leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default FacultyCard;
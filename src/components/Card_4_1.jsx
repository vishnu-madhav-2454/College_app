import React from 'react'

const Card_4_1 = ({ name, designation, experience, description, img, color = '#1480c0' }) => {
  return (
    <div
      className="w-[230px] h-auto rounded-xl shadow-md p-4 flex flex-col items-center text-center transition-all duration-700 transform hover:scale-110 group"
      style={{ backgroundColor: color }}
    >
      <img src={img} alt={name} className="w-[180px] h-[180px] mb-2 object-cover rounded-full" />
      <h2 className="text-[23px] font-extrabold text-white group-hover:text-[inherit]">{name}</h2>
      <p className="text-[18px] text-white group-hover:text-[inherit]">{designation}</p>
      <p className="text-[15px] text-white group-hover:text-[inherit]">Experience - {experience}</p>
      <p className="text-[11px] text-white mt-2 group-hover:text-[inherit]">{description}</p>
    </div>
  )
}

export default Card_4_1


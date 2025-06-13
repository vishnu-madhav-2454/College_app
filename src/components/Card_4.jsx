import React from 'react'
import Card_4_1 from './Card_4_1.jsx'

const Card_4 = ({ title, members = [], color = '#1480c0' }) => {
  return (
    <div className="my-10 px-4 w-full flex flex-col items-center">
      {/* Title section */}
      <div className="w-full max-w-8xl p-4 rounded-lg shadow-lg mb-6" style={{ backgroundColor: color }}>
        <h1 className="text-3xl font-bold text-center mb-2 text-white">
          {title} Faculty
        </h1>
      </div>

      {/* Card container */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-7xl">
        {members.map((member, index) => (
          <Card_4_1
            key={index}
            name={member.name}
            designation={member.designation}
            experience={member.experience}
            description={member.description}
            img={member.img}
            color={color} // pass color to card
          />
        ))}
      </div>
    </div>
  )
}

export default Card_4



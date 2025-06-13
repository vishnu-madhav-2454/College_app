import React from 'react'
import logo2 from '../assets/logo2.png'
import Card_4 from './Card_4.jsx'
import face from '../assets/face.jpeg'


const mathsFaculty = [
  {
    name: 'Dr. S. Kumar',
    designation: 'Professor',
    experience: '12 years',
    description: 'Expert in calculus and mathematical analysis.',
    img: face,
  },
  {
    name: 'Ms. R. Devi',
    designation: 'Assistant Professor',
    experience: '6 years',
    description: 'Specializes in algebra and number theory.',
    img: face,
  },
]

const physicsFaculty = [
  {
    name: 'Dr. P. Reddy',
    designation: 'Professor',
    experience: '10 years',
    description: 'Focused on quantum mechanics and thermodynamics.',
    img: face,
  },
  {
    name: 'Mr. A. Khan',
    designation: 'Lecturer',
    experience: '4 years',
    description: 'Passionate about teaching classical mechanics.',
    img: face,
  },
]

const chemistryFaculty = [
  {
    name: 'Dr. N. Sharma',
    designation: 'Professor',
    experience: '15 years',
    description: 'Leads research in organic chemistry.',
    img: face,
  },
  {
    name: 'Ms. T. Rao',
    designation: 'Assistant Professor',
    experience: '5 years',
    description: 'Expert in physical and inorganic chemistry.',
    img: face,
  },
]

const Faculty = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <img
          src={logo2}
          alt="Background"
          className="w-[70vw] opacity-20"
        />
      </div>
      <div className="relative z-10 space-y-10 max-w-7xl mx-auto">
        <Card_4 title="Maths" members={mathsFaculty} color="#1e40af" />
        <Card_4 title="Physics" members={physicsFaculty} color="#065f46" />
        <Card_4 title="Chemistry" members={chemistryFaculty} color="#9a3412" />
        <Card_4
          title="Biology"
          members={[
            {
              name: 'Dr. L. Gupta',
              designation: 'Professor',
              experience: '8 years',
              description: 'Specializes in genetics and microbiology.',
              img: face,
            },
            {
              name: 'Ms. S. Verma',
              designation: 'Assistant Professor',
              experience: '3 years',
              description: 'Focuses on botany and ecology.',
              img: face,
            },
          ]}
          color="#4a5568"/>
      </div>
    </div>
  )
}

export default Faculty

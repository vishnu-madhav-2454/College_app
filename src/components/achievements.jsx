import React from 'react';
import logo2 from '../assets/logo2.png';
import Card_5 from './Card_5';
import studentImage from '../assets/student.png'; // Replace with actual path

const studentsSample = [
  {
    image: studentImage,
    score: 498,
    total: 500,
    name: "SPANDANA A M",
    hallTicket: "18116023",
  },
  {
    image: studentImage,
    score: 496,
    total: 500,
    name: "RAHUL V",
    hallTicket: "18116024",
  },
  {
    image: studentImage,
    score: 495,
    total: 500,
    name: "KAVYA R",
    hallTicket: "18116025",
  },
  {
    image: studentImage,
    score: 493,
    total: 500,
    name: "TARUN S",
    hallTicket: "18116026",
  },
  {
    image: studentImage,
    score: 490,
    total: 500,
    name: "SNEHA B",
    hallTicket: "18116027",
  },
];

const sections = [
  {
    name: "JEE MAINS",
    titleColor: "#004aad",
    barColor: "#004aad",
    bgColor: "#0074e4",
    viewMoreLink: "/jee-mains",
    students: studentsSample,
  },
  {
    name: "JEE ADVANCED",
    titleColor: "#0a6847",
    barColor: "#0a6847",
    bgColor: "#128c7e",
    viewMoreLink: "/jee-advanced",
    students: studentsSample,
  },
  {
    name: "AP EAMCET",
    titleColor: "#8e44ad",
    barColor: "#8e44ad",
    bgColor: "#9b59b6",
    viewMoreLink: "/eamcet",
    students: studentsSample,
  },
];

const Achievements = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden px-4 py-6">
      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <img
          src={logo2}
          alt="Background"
          className="w-[70vw] max-w-[400px] opacity-10"
        />
      </div>

      {/* Section Content */}
      <div className="relative z-10 space-y-12 max-w-[1400px] mx-auto">
        {sections.map((section, index) => (
          <Card_5
            key={index}
            name={section.name}
            titleColor={section.titleColor}
            barColor={section.barColor}
            bgColor={section.bgColor}
            viewMoreLink={section.viewMoreLink}
            students={section.students}
          />
        ))}
      </div>
    </div>
  );
};

export default Achievements;

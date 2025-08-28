import React from 'react';
import PageLayout from '../layout/PageLayout';
import FacultyCard from '../ui/FacultyCard';
import logo2 from '../../assets/logo2.png';
import { facultyData } from '../../data/facultyData';
import { COLORS } from '../../constants/colors';

const FacultySection = ({ title, members = [], color }) => {
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
          <FacultyCard
            key={`${title}-${index}`}
            name={member.name}
            designation={member.designation}
            experience={member.experience}
            description={member.description}
            img={member.img}
            color={color}
          />
        ))}
      </div>
    </div>
  );
};

const Faculty = () => {
  const facultySections = [
    { title: 'Maths', members: facultyData.maths, color: COLORS.subjects.maths },
    { title: 'Physics', members: facultyData.physics, color: COLORS.subjects.physics },
    { title: 'Chemistry', members: facultyData.chemistry, color: COLORS.subjects.chemistry },
    { title: 'Biology', members: facultyData.biology, color: COLORS.subjects.biology },
  ];

  return (
    <PageLayout showBackground backgroundImage={logo2}>
      <div className="space-y-10 max-w-7xl mx-auto">
        {facultySections.map((section) => (
          <FacultySection
            key={section.title}
            title={section.title}
            members={section.members}
            color={section.color}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default Faculty;
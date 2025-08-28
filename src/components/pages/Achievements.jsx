import React from 'react';
import { NavLink } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import ScoreCard from '../ui/ScoreCard';
import logo2 from '../../assets/logo2.png';
import { achievementSections } from '../../data/achievementsData';

const AchievementSection = ({
  name,
  titleColor,
  barColor,
  bgColor,
  students = [],
}) => {
  return (
    <div className="m-4 sm:m-6 p-4 sm:p-6 rounded-lg shadow-lg bg-white w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 sm:mb-4">
        <div
          className="font-semibold text-[24px] sm:text-[32px] md:text-[36px] lg:text-[40px] leading-tight"
          style={{ color: titleColor }}
        >
          {name}
        </div>
        <NavLink to={`/achievements/${name}`} className="w-fit">
          <button className="text-xs sm:text-sm md:text-base font-medium text-white bg-[#333] px-3 py-1.5 rounded hover:bg-black transition-colors duration-200">
            View More
          </button>
        </NavLink>
      </div>

      {/* Divider Bar */}
      <div
        className="h-[4px] sm:h-[6px] w-full rounded-lg mb-4"
        style={{ backgroundColor: barColor }}
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {students.map((student, idx) => (
          <ScoreCard
            key={`${name}-${idx}`}
            image={student.image}
            score={student.score}
            total={student.total}
            name={student.name}
            hallTicket={student.hallTicket}
            bgColor={bgColor}
          />
        ))}
      </div>
    </div>
  );
};

const Achievements = () => {
  return (
    <PageLayout showBackground backgroundImage={logo2}>
      <div className="space-y-12 max-w-[1400px] mx-auto px-4 py-6">
        {achievementSections.map((section, index) => (
          <AchievementSection
            key={section.name}
            name={section.name}
            titleColor={section.titleColor}
            barColor={section.barColor}
            bgColor={section.bgColor}
            students={section.students}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default Achievements;
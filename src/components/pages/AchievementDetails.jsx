import React from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import ScoreCard from '../ui/ScoreCard';
import { studentExamples } from '../../data/detailedAchievements';
import { cleanExamName } from '../../utils/helpers';

const AchievementDetails = () => {
  const { id } = useParams();
  const cleanedId = cleanExamName(id);
  const data = studentExamples[cleanedId];

  if (!data) {
    return (
      <PageLayout>
        <div className="min-h-screen p-10 text-center">
          <h1 className="text-4xl font-bold text-gray-700 mb-4 capitalize">
            {id} Achievements
          </h1>
          <p className="text-black text-lg">
            No achievements found for "{id}".
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen px-6 py-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 capitalize text-center">
          {id} Achievements
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {data.students.map((student, index) => (
            <ScoreCard
              key={`${cleanedId}-${index}`}
              image={student.image}
              name={student.name}
              hallTicket={student.hallticket}
              score={student.rank || student.marks}
              total={data.total}
              bgColor={data.bgColor}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default AchievementDetails;
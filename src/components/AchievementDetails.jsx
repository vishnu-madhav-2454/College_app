import React from 'react';
import { useParams } from 'react-router-dom';
import Card_5_1 from './Card_5_1';
import student from '../assets/student.png'; // Main student image used

const studentExamples = {
  jeemains: {
    bgColor: '#9b0c0c',
    total: '300',
    students: [
      { name: 'Rahul Sharma', hallticket: 'JEE123456', rank: '256', image: student },
      { name: 'Sneha Reddy', hallticket: 'JEE654321', rank: '432', image: student },
      { name: 'Aarav Mehta', hallticket: 'JEE112233', rank: '158', image: student },
      { name: 'Ishita Verma', hallticket: 'JEE998877', rank: '310', image: student },
      { name: 'Rohan Das', hallticket: 'JEE334455', rank: '199', image: student },
      { name: 'Divya Patel', hallticket: 'JEE667788', rank: '365', image: student },
    ],
  },
  apeamcet: {
    bgColor: '#0c5b9b',
    total: '160',
    students: [
      { name: 'Vikram Rao', hallticket: 'AP123987', marks: '125', image: student },
      { name: 'Keerthi Das', hallticket: 'AP456789', marks: '132', image: student },
      { name: 'Sanjay Naik', hallticket: 'AP998877', marks: '118', image: student },
      { name: 'Meghana Rao', hallticket: 'AP112244', marks: '139', image: student },
      { name: 'Ajay Krishna', hallticket: 'AP332211', marks: '121', image: student },
      { name: 'Tanya Shah', hallticket: 'AP556677', marks: '130', image: student },
    ],
  },
  neet: {
    bgColor: '#087a53',
    total: '720000',
    students: [
      { name: 'Anjali Singh', hallticket: 'NEET123456', rank: '5432', image: student },
      { name: 'Harsha Babu', hallticket: 'NEET789123', rank: '4890', image: student },
      { name: 'Pooja Rani', hallticket: 'NEET112233', rank: '6200', image: student },
      { name: 'Mohit Jain', hallticket: 'NEET445566', rank: '5100', image: student },
      { name: 'Lakshmi N', hallticket: 'NEET998877', rank: '4750', image: student },
      { name: 'Devendra P', hallticket: 'NEET221133', rank: '4956', image: student },
    ],
  },
};

const AchievementDetails = () => {
  const { id } = useParams();
  const cleanedId = id?.toLowerCase().replace(/\s+/g, '');
  const data = studentExamples[cleanedId];

  if (!data) {
    return (
      <div className="min-h-screen p-10 text-center">
        <h1 className="text-4xl font-bold text-gray-700 mb-4 capitalize">{id} Achievements</h1>
        <p className="text-black text-lg">No achievements found for "{id}".</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 capitalize">{id} Achievements</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {data.students.map((student, index) => (
          <Card_5_1
            key={index}
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
  );
};

export default AchievementDetails;

import React from 'react';
import logo2 from '../assets/logo2.png';
import logo from '../assets/logo.png';
import Card_2 from './Card_2';

const Campuses = () => {
  const images = [logo, logo2];

  const campuses = [
    {
      title: 'Pellore',
      description:
        'Sri Saraswathi College, Pelluru Campus near Ongole, is a premier institution known for its integrated intermediate and degree programs. It offers a strong academic foundation with focused coaching for competitive exams like JEE, NEET, and EAMCET. The campus is well-equipped and fosters a disciplined, student-friendly learning environment.',
      mapsLink:
        'https://www.google.com/maps/place/Sri+Saraswathi+Junior+College-pelluru/@15.4822575,80.0184558,14z/data=!4m10!1m2!2m1!1ssri+sarswathi+college+pellore+ongole!...',
      bgColor: '#9b0c0c',
    },
    {
      title: 'Ongole City Campus',
      description:
        'Located in the heart of Ongole, the city campus provides a vibrant atmosphere for learning with experienced faculty, tech-enabled classrooms, and a results-driven academic system. Ideal for students who prefer a city-based learning environment.',
      mapsLink:
        'https://www.google.com/maps?q=sri+saraswathi+college+ongole&...',
      bgColor: '#1e3a8a',
    },
    {
      title: 'Markapur Campus',
      description:
        'This campus caters to students from rural backgrounds with high-quality infrastructure, free transport, and hostel facilities. It promotes both academic and character development.',
      mapsLink:
        'https://www.google.com/maps?q=sri+saraswathi+college+markapur&...',
      bgColor: '#065f46',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-10 px-4">
      {campuses.map((campus, idx) => (
        <Card_2
          key={idx}
          images={images}
          title={campus.title}
          description={campus.description}
          mapsLink={campus.mapsLink}
          bgColor={campus.bgColor}
        />
      ))}
    </div>
  );
};

export default Campuses;

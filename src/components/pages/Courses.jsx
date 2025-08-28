import React from 'react';
import PageLayout from '../layout/PageLayout';
import CourseCard from '../ui/CourseCard';
import logo2 from '../../assets/logo2.png';
import { courseData } from '../../data/courseData';

const Courses = () => {
  return (
    <PageLayout showBackground backgroundImage={logo2}>
      <div className="min-h-screen py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {courseData.map((course, index) => (
            <CourseCard
              key={index}
              title={course.title}
              description={course.description}
              bgColor={course.bgColor}
              features={course.features}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Courses;
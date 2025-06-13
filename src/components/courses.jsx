import React from 'react'
import logo2 from '../assets/logo2.png';
import CourseCard from './Card_3'; // Assuming your CourseCard is saved as Card_3

const Courses = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <img
          src={logo2}
          alt="Background"
          className="w-[70vw] opacity-20"
        />
      </div>

      {/* Foreground Grid with Cards */}
      <div className="relative z-10 min-h-screen py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CourseCard
            title="Integrated MPC + IIT-JEE"
            description="This course is designed for students aiming to pursue engineering."
            bgColor="#07557c"
            features={[
              "Detailed coverage of MPC syllabus",
              "Expert faculty for JEE preparation",
              "Regular mock tests and doubt sessions",
              "Well-structured time-table and study materials",
              "Access to digital learning resources",
              "Guidance for top engineering colleges"
            ]}
          />

          <CourseCard
            title="BiPC + NEET Coaching"
            description="Tailored for medical aspirants with comprehensive NEET preparation."
            bgColor="#4a148c"
            features={[
              "Complete coverage of Botany, Zoology, Physics, and Chemistry",
              "Experienced faculty for NEET guidance",
              "Extensive practice tests and performance analysis",
              "Mentoring for stress and exam anxiety",
              "Daily study planner with smart goals",
              "Preparation for AIIMS & other competitive exams"
            ]}
          />

        </div>
      </div>
    </div>
  )
}

export default Courses;

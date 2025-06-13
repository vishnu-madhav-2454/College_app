import React from 'react';
import logo2 from '../assets/logo2.png';
import logo from '../assets/logo.png';
import Card_home from './Card_home';

const Home = () => {
  const content_1 = `With 34 years of academic excellence, our institution has been a pioneer in providing quality education to rural students.
We are proud to offer free IIT, NEET, and EAPCET coaching along with intermediate education, helping students from underprivileged backgrounds achieve top ranks. 
Our dedicated faculty and strong academic environment ensure students reach their full potential. Many of our students have secured admissions in premier institutes like IITs, NITs, and medical colleges. Our focus on both education and overall development has made us a trusted name among parents and students. We are committed to continuing this legacy of success and service.
`;
const content_2 = `At our institution, we don’t just teach – we transform. For over three decades, we’ve stood as a beacon of opportunity for rural students, unlocking their true potential through disciplined education, free competitive coaching, and a nurturing environment. Our mission is to break barriers and build futures. Join us, and take the first step toward a life of achievement, excellence, and purpose.`;
const content_3 = `Our institution is a testament to the power of education in transforming lives. With a legacy of 34 years, we have consistently provided quality education and free coaching for competitive exams like IIT, NEET, and EAPCET. Our commitment to excellence has helped countless students from rural backgrounds secure admissions in prestigious institutes. We believe in nurturing not just academic skills but also character and leadership qualities, preparing our students for a successful future.`;
const content_4 = `Join us in our mission to empower the next generation of leaders and innovators. Our institution is more than just a place of learning; it’s a community where dreams are nurtured, talents are honed, and futures are built. With a focus on holistic development, we prepare our students to excel not only academically but also in life. Together, let’s create a brighter future for our students and our society.`;

  return (
    <div className='flex justify-center items-center flex-col'>
        <Card_home content={content_1} img={logo} name="A.V RAMANA REDDY" role='Founder & Chairman Sri Saraswathi Groups' number='98488 79655'/>
        <Card_home content={content_2} img={logo2} name='A.PADMAVATHI' role='Head Of Welfare and Parent Relations Sri Saraswathi Institutions' number=''/>
        <Card_home content={content_3} img={logo2} name='A.Ganesh Reddy' role='Director of Sri Saraswathi Institutions' number='91761 62696' />
        <Card_home content={content_4} img={logo2} name='A.G. Sankar Reddy' role='Director of Sri Saraswathi Institutions' number='81436 68888'/>
    </div>
  );
};

export default Home;




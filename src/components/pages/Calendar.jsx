import React, { useState } from 'react';
import PageLayout from '../layout/PageLayout';
import { COLORS } from '../../constants/colors.js';

// Stream-specific roadmaps
const roadmaps = {
  MPC: [
    { date: 'Jun 10', title: 'Admissions Open', type: 'admissions' },
    { date: 'Jun 24', title: 'Bridge Course (Maths Basics)', type: 'academic' },
    { date: 'Aug 05', title: 'Unit Test 1 (M+P+C)', type: 'exam' },
    { date: 'Sep 12', title: 'PTM & Roadmap Review (JEE)', type: 'event' },
    { date: 'Oct 21', title: 'Half-Yearly Exams', type: 'exam' },
    { date: 'Dec 10', title: 'JEE Mock Series Begins', type: 'academic' },
    { date: 'Jan 06', title: 'Pre-Finals', type: 'exam' },
    { date: 'Mar 01', title: 'Board Exam Window', type: 'exam' },
  ],
  BiPC: [
    { date: 'Jun 10', title: 'Admissions Open', type: 'admissions' },
    { date: 'Jun 24', title: 'Bridge Course (Bio/Phy Basics)', type: 'academic' },
    { date: 'Aug 05', title: 'Unit Test 1 (Bio+Phy+Chem)', type: 'exam' },
    { date: 'Sep 12', title: 'PTM & NEET Orientation', type: 'event' },
    { date: 'Oct 21', title: 'Half-Yearly Exams', type: 'exam' },
    { date: 'Dec 10', title: 'NEET Mock Series Begins', type: 'academic' },
    { date: 'Jan 06', title: 'Pre-Finals', type: 'exam' },
    { date: 'Mar 01', title: 'Board Exam Window', type: 'exam' },
  ],
  MEC: [
    { date: 'Jun 10', title: 'Admissions Open', type: 'admissions' },
    { date: 'Jun 24', title: 'Bridge Course (Accounts Basics)', type: 'academic' },
    { date: 'Aug 05', title: 'Unit Test 1 (Maths+Eco+Comm)', type: 'exam' },
    { date: 'Sep 12', title: 'PTM & CA Foundation Talk', type: 'event' },
    { date: 'Oct 21', title: 'Half-Yearly Exams', type: 'exam' },
    { date: 'Dec 10', title: 'CA Foundation Prep Start', type: 'academic' },
    { date: 'Jan 06', title: 'Pre-Finals', type: 'exam' },
    { date: 'Mar 01', title: 'Board Exam Window', type: 'exam' },
  ],
  CEC: [
    { date: 'Jun 10', title: 'Admissions Open', type: 'admissions' },
    { date: 'Jun 24', title: 'Bridge Course (Polity/History Basics)', type: 'academic' },
    { date: 'Aug 05', title: 'Unit Test 1 (Civ+Eco+Comm)', type: 'exam' },
    { date: 'Sep 12', title: 'PTM & UPSC Orientation', type: 'event' },
    { date: 'Oct 21', title: 'Half-Yearly Exams', type: 'exam' },
    { date: 'Dec 10', title: 'Current Affairs Workshops', type: 'academic' },
    { date: 'Jan 06', title: 'Pre-Finals', type: 'exam' },
    { date: 'Mar 01', title: 'Board Exam Window', type: 'exam' },
  ],
};

const Calendar = () => {
  const primary = COLORS.primary.red;
  const secondary = COLORS.primary.yellow;

  const [stream, setStream] = useState('MPC');

  return (
    <PageLayout>
      <section className="section py-12">
        <div className="container-page text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-extrabold"
            style={{ color: primary }}
          >
            Academic Calendar
          </h1>
          <p className="mt-2 text-gray-700 text-lg md:text-xl">
            Key dates for Class 11–12: admissions, tests, events, and exams.
          </p>
        </div>

        {/* Stream selector */}
        <div className="container-page mb-6 flex items-center justify-center gap-2">
          {['MPC', 'BiPC', 'MEC', 'CEC'].map((s, idx) => (
            <button
              key={s}
              onClick={() => setStream(s)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow ${
                stream === s ? 'text-white' : 'text-black'
              } fade-in-up`}
              style={{ backgroundColor: stream === s ? primary : '#e5e7eb', animationDelay: `${idx * 60}ms` }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="container-page overflow-x-auto">
          <div className="relative flex items-center h-40">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2"></div>

            {/* Checkpoints */}
            {roadmaps[stream].map((item, idx) => {
              // Normal solid colors: red, blue, green
              const palette = {
                admissions: '#22c55e', // green-500
                academic: '#3b82f6',   // blue-500
                exam: '#ef4444',       // red-500
                event: '#22c55e',      // green-500
              };
              const color = palette[item.type] || '#3b82f6';
              return (
                <div key={idx} className="relative group flex flex-col items-center min-w-[200px] px-4 fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
                  {/* Dot */}
                  <div
                    className="w-6 h-6 rounded-full transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: color }}
                  ></div>

                  {/* Tooltip / Card */}
                  <div className="mt-2 text-center transition-transform duration-300 group-hover:-translate-y-0.5">
                    <div
                      className="px-2 py-1 rounded-md font-bold text-white text-sm mb-1 shadow"
                      style={{ backgroundColor: color }}
                    >
                      {item.date}
                    </div>
                    <div className="font-semibold text-gray-800 text-sm">{item.title}</div>
                    <div className="text-xs uppercase text-gray-500">{item.type}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Calendar;

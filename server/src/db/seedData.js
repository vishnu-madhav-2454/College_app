import { pool, hashPassword } from './connection.js';

export const seedInitialData = async () => {

  const programs = [
    ['JEE', 'JEE (Main + Advanced)', 'Engineering Pinnacle', 'JEE preparation with focused Physics, Chemistry, and Mathematics coaching.', ['Physics', 'Chemistry', 'Mathematics'], ['JEE Advanced', 'JEE Main'], '2 Years / 1 Year Repeater', 160000],
    ['NEET', 'NEET (UG) Medical', 'Medical Excellence', 'NEET preparation with focused Physics, Chemistry, and Biology coaching.', ['Physics', 'Chemistry', 'Biology'], ['NEET UG'], '2 Years / 1 Year Long Term', 150000],
    ['EAMCET_MPC', 'EAMCET (MPC Stream)', 'State Engineering Leader', 'MPC coaching for TS and AP engineering entrance examinations.', ['Mathematics', 'Physics', 'Chemistry'], ['TS EAMCET', 'AP EAPCET'], '2 Years / Crash Course', 95000],
    ['EAMCET_BIPC', 'EAMCET (BiPC Stream)', 'Agri, Pharma and Veterinary Sciences', 'BiPC coaching for TS and AP agriculture, pharmacy, and veterinary seats.', ['Biology', 'Physics', 'Chemistry'], ['TS EAMCET BiPC', 'AP EAPCET BiPC'], '2 Years / Crash Course', 90000]
  ];
  for (const program of programs) {
    await pool.query(
      `INSERT INTO program_catalog (id, name, badge, description, subjects, target_exams, duration, annual_fee)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      [program[0], program[1], program[2], program[3], JSON.stringify(program[4]), JSON.stringify(program[5]), program[6], program[7]]
    );
  }

  // 2. Check if already seeded
  const userCheck = await pool.query('SELECT COUNT(*) FROM users');
  if (parseInt(userCheck.rows[0].count, 10) > 0) {
    console.log('📦 PostgreSQL already contains data. Ready.');
    return;
  }

  console.log('🌱 Seeding fresh data into PostgreSQL...');

  const defaultPasswordHash = await hashPassword('password123');

  // Insert Branches
  const branches = [
    {
      id: 'branch-1',
      name: 'Madhapur Tech Campus (Main Branch)',
      code: 'HYD-MDH',
      city: 'Hyderabad',
      address: 'Plot 42, Silicon Valley Rd, Near Cyber Towers, Madhapur, Hyderabad, TS - 500081',
      phone: '+91 98765 43210',
      email: 'madhapur@apexacademy.edu',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
      total_students: 1450,
      rating: 4.9,
      facilities: JSON.stringify(['CBT Digital Testing Center (300 Nodes)', 'Air Conditioned Amphitheatre Classrooms', 'Doubt Clearing Cell 8AM-9PM', 'IIT/AIIMS Standard Library & Reading Room', 'Hostel with Cafeteria'])
    },
    {
      id: 'branch-2',
      name: 'Kukatpally Science & Medical Hub',
      code: 'HYD-KPHB',
      city: 'Hyderabad',
      address: 'Road No. 1, KPHB Colony, Near Forum Mall, Kukatpally, Hyderabad, TS - 500072',
      phone: '+91 98765 43211',
      email: 'kukatpally@apexacademy.edu',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
      total_students: 1200,
      rating: 4.8,
      facilities: JSON.stringify(['Advanced Botany & Zoology Specimen Labs', 'High-Speed Wi-Fi Test Lab', 'Parent Interaction Lounge', 'Biometric Turnstiles'])
    },
    {
      id: 'branch-3',
      name: 'Vijayawada Benz Circle Campus',
      code: 'BZA-BNZ',
      city: 'Vijayawada',
      address: 'MG Road, Opposite Gateway Hotel, Benz Circle, Vijayawada, AP - 520010',
      phone: '+91 98765 43212',
      email: 'vijayawada@apexacademy.edu',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      total_students: 980,
      rating: 4.9,
      facilities: JSON.stringify(['Special EAMCET & JEE Super 60 Batch Rooms', '24/7 Digital Library', 'Subject Expert Guidance Desks'])
    },
    {
      id: 'branch-4',
      name: 'Visakhapatnam Dwaraka Nagar Campus',
      code: 'VSKP-DWK',
      city: 'Visakhapatnam',
      address: '2nd Lane, Dwaraka Nagar, Beside Diamond Park, Visakhapatnam, AP - 530016',
      phone: '+91 98765 43213',
      email: 'vizag@apexacademy.edu',
      image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80',
      total_students: 850,
      rating: 4.8,
      facilities: JSON.stringify(['Smart Interactive Classrooms', 'Mock Assessment Computer Labs', 'Physiology & Chemistry Demo Racks'])
    }
  ];

  for (const b of branches) {
    await pool.query(
      `INSERT INTO branches (id, name, code, city, address, phone, email, image, total_students, rating, facilities)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [b.id, b.name, b.code, b.city, b.address, b.phone, b.email, b.image, b.total_students, b.rating, b.facilities]
    );
  }

  // Insert Faculty
  const facultyList = [
    {
      id: 'fac-1',
      name: 'Dr. K. S. Radhakrishnan',
      designation: 'Senior Physics Professor & Academic Dean',
      department: 'Physics',
      qualification: 'Ph.D. IIT Madras, B.Tech IIT Kharagpur',
      experience: 22,
      subjects: JSON.stringify(['Physics (JEE Advanced / NEET)', 'Electrodynamics & Quantum Physics']),
      rating: 4.98,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
      bio: 'Mentored over 140+ students into top 100 All India Ranks in JEE Advanced and NEET. Renowned for conceptual physics visualizations.',
      achievements: 'Author of "Advanced Mechanics for JEE", Recipient of National Physics Educator Award.'
    },
    {
      id: 'fac-2',
      name: 'Prof. Ananya Varma',
      designation: 'Head of Organic Chemistry',
      department: 'Chemistry',
      qualification: 'M.Sc., CSIR-NET (AIR 4), Ex-IITian Faculty',
      experience: 16,
      subjects: JSON.stringify(['Organic Chemistry', 'Reaction Mechanisms & Spectroscopy']),
      rating: 4.95,
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
      bio: 'Expert in transforming complex reaction pathways into easy visual models for JEE Main & NEET aspirants.',
      achievements: 'Over 25,000 students guided with 99.4% average chemistry score improvement.'
    },
    {
      id: 'fac-3',
      name: 'Prof. M. Venkat Reddy',
      designation: 'Senior Faculty & HOD Mathematics',
      department: 'Mathematics',
      qualification: 'M.Sc. Mathematics (Gold Medalist), B.Ed',
      experience: 19,
      subjects: JSON.stringify(['Calculus', 'Coordinate Geometry', 'Algebra (JEE & EAMCET)']),
      rating: 4.92,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
      bio: 'Legendary shortcut and analytical problem-solving expert for EAMCET and JEE Mathematics.',
      achievements: 'Mastered 30-second solving techniques for competitive exams.'
    },
    {
      id: 'fac-4',
      name: 'Dr. Priya S. Nambiar',
      designation: 'HOD Biology & Medical Wing Lead',
      department: 'Biology',
      qualification: 'M.B.B.S., M.D., AIIMS New Delhi Alumna',
      experience: 14,
      subjects: JSON.stringify(['Human Physiology', 'Genetics', 'Botany & Zoology (NEET / EAMCET BiPC)']),
      rating: 4.97,
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80',
      bio: 'Practicing doctor and passionate biology mentor who has produced 4 AIIMS Delhi top 50 rankers.',
      achievements: '360/360 Biology scorecard mentoring record.'
    }
  ];

  for (const f of facultyList) {
    await pool.query(
      `INSERT INTO faculty (id, name, designation, department, qualification, experience, subjects, rating, photo, bio, achievements)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [f.id, f.name, f.designation, f.department, f.qualification, f.experience, f.subjects, f.rating, f.photo, f.bio, f.achievements]
    );
  }

  // Insert Achievements
  const achievements = [
    {
      id: 'ach-1',
      student_name: 'Chaitanya Sai Vardhan',
      exam: 'JEE Advanced',
      rank: 'AIR 14',
      score: '328/360',
      year: '2025',
      program: 'JEE',
      college_allotted: 'IIT Bombay - Computer Science & Engineering',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      quote: 'Apex Academy’s daily test series and Dr. Radhakrishnan sir’s guidance made Physics my strongest asset!'
    },
    {
      id: 'ach-2',
      student_name: 'Sravya Lakshmi',
      exam: 'NEET (UG)',
      rank: 'AIR 28 (State Rank 1)',
      score: '715/720',
      year: '2025',
      program: 'NEET',
      college_allotted: 'AIIMS New Delhi - MBBS',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      quote: 'NCERT line-by-line tests and doubt clearing labs at Kukatpally campus gave me the perfect 360 in Biology.'
    },
    {
      id: 'ach-3',
      student_name: 'K. Rithvik Reddy',
      exam: 'TS EAMCET (MPC)',
      rank: 'State Rank 3',
      score: '154/160',
      year: '2025',
      program: 'EAMCET_MPC',
      college_allotted: 'JNTU Hyderabad - CSE (AI & ML)',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      quote: 'The speed mock tests and mathematics shortcuts by Venkat Reddy sir were game changers for EAMCET speed.'
    },
    {
      id: 'ach-4',
      student_name: 'Divya Teja',
      exam: 'AP EAMCET (BiPC)',
      rank: 'State Rank 7',
      score: '149/160',
      year: '2025',
      program: 'EAMCET_BIPC',
      college_allotted: 'SVIMS Sri Venkateswara Institute of Medical Sciences',
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
      quote: 'The regular mock assessments and faculty attention at Vijayawada branch helped me secure my dream rank.'
    }
  ];

  for (const a of achievements) {
    await pool.query(
      `INSERT INTO achievements (id, student_name, exam, rank, score, year, program, college_allotted, photo, quote)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [a.id, a.student_name, a.exam, a.rank, a.score, a.year, a.program, a.college_allotted, a.photo, a.quote]
    );
  }

  // Insert Users
  const users = [
    { id: 'usr-student-1', name: 'Rohan Sharma', email: 'rohan.jee@apex.edu', password: defaultPasswordHash, role: 'student', phone: '+91 98480 12345', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
    { id: 'usr-student-2', name: 'Ananya Rao', email: 'ananya.neet@apex.edu', password: defaultPasswordHash, role: 'student', phone: '+91 98480 23456', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
    { id: 'usr-student-3', name: 'Karthik Varma', email: 'karthik.eamcetmpc@apex.edu', password: defaultPasswordHash, role: 'student', phone: '+91 98480 34567', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
    { id: 'usr-student-4', name: 'Sneha Patel', email: 'sneha.eamcetbipc@apex.edu', password: defaultPasswordHash, role: 'student', phone: '+91 98480 45678', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80' },
    { id: 'usr-teacher-1', name: 'Dr. K. S. Radhakrishnan', email: 'teacher.radhakrishnan@apex.edu', password: defaultPasswordHash, role: 'teacher', phone: '+91 94400 11223', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', subject: 'Physics', department: 'Physics Dept' },
    { id: 'usr-teacher-2', name: 'Prof. Ananya Varma', email: 'teacher.varma@apex.edu', password: defaultPasswordHash, role: 'teacher', phone: '+91 94400 22334', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', subject: 'Chemistry', department: 'Chemistry Dept' },
    { id: 'usr-jl-1', name: 'Suresh Babu (JL - Physics & Tech)', email: 'jl.suresh@apex.edu', password: defaultPasswordHash, role: 'junior_lecturer', phone: '+91 91234 56789', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', department: 'MPC Wing' },
    { id: 'usr-jl-2', name: 'Harika Devi (JL - Bio & Chemistry)', email: 'jl.harika@apex.edu', password: defaultPasswordHash, role: 'junior_lecturer', phone: '+91 91234 56790', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', department: 'BiPC Wing' }
  ];

  for (const u of users) {
    await pool.query(
      `INSERT INTO users (id, name, email, password, role, phone, avatar, subject, department)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [u.id, u.name, u.email, u.password, u.role, u.phone, u.avatar, u.subject || null, u.department || null]
    );
  }

  // Insert Students
  const students = [
    {
      id: 'stu-1',
      user_id: 'usr-student-1',
      name: 'Rohan Sharma',
      enrollment_no: 'APEX-JEE-2025-0101',
      program: 'JEE',
      program_name: 'JEE (Main + Advanced) 2-Year Intensive Super 30',
      section: 'Section-A (Super 30)',
      branch_id: 'branch-1',
      branch_name: 'Madhapur Tech Campus (Main Branch)',
      admission_date: '2025-05-15',
      total_fee: 160000,
      paid_fee: 110000,
      parent_name: 'Mr. Ramesh Sharma',
      parent_phone: '+91 98480 99881',
      tenth_score: '98.2%',
      address: 'Madhapur, Hyderabad',
      subjects: JSON.stringify(['Physics', 'Chemistry', 'Mathematics'])
    },
    {
      id: 'stu-2',
      user_id: 'usr-student-2',
      name: 'Ananya Rao',
      enrollment_no: 'APEX-NEET-2025-0202',
      program: 'NEET',
      program_name: 'NEET (UG) AIIMS & Medical Pinnacle Batch',
      section: 'Section-M1 (Medical)',
      branch_id: 'branch-2',
      branch_name: 'Kukatpally Science & Medical Hub',
      admission_date: '2025-05-20',
      total_fee: 150000,
      paid_fee: 150000,
      parent_name: 'Dr. G. V. Rao',
      parent_phone: '+91 98480 99882',
      tenth_score: '99.0%',
      address: 'KPHB, Hyderabad',
      subjects: JSON.stringify(['Physics', 'Chemistry', 'Biology'])
    },
    {
      id: 'stu-3',
      user_id: 'usr-student-3',
      name: 'Karthik Varma',
      enrollment_no: 'APEX-EAM-MPC-2025-0303',
      program: 'EAMCET_MPC',
      program_name: 'TS & AP EAMCET (MPC) Engineering Rank Accelerator',
      section: 'Section-E1 (MPC)',
      branch_id: 'branch-3',
      branch_name: 'Vijayawada Benz Circle Campus',
      admission_date: '2025-06-01',
      total_fee: 95000,
      paid_fee: 65000,
      parent_name: 'Mr. Satyanarayana Varma',
      parent_phone: '+91 98480 99883',
      tenth_score: '96.5%',
      address: 'Benz Circle, Vijayawada',
      subjects: JSON.stringify(['Mathematics', 'Physics', 'Chemistry'])
    },
    {
      id: 'stu-4',
      user_id: 'usr-student-4',
      name: 'Sneha Patel',
      enrollment_no: 'APEX-EAM-BIPC-2025-0404',
      program: 'EAMCET_BIPC',
      program_name: 'TS & AP EAMCET (BiPC) Agri & Pharmacy Elite',
      section: 'Section-B1 (BiPC)',
      branch_id: 'branch-1',
      branch_name: 'Madhapur Tech Campus (Main Branch)',
      admission_date: '2025-06-10',
      total_fee: 90000,
      paid_fee: 50000,
      parent_name: 'Mr. Hasmukh Patel',
      parent_phone: '+91 98480 99884',
      tenth_score: '95.8%',
      address: 'Kondapur, Hyderabad',
      subjects: JSON.stringify(['Biology', 'Physics', 'Chemistry'])
    }
  ];

  for (const s of students) {
    await pool.query(
      `INSERT INTO students (id, user_id, enrollment_no, program, program_name, section, branch_id, branch_name, admission_date, total_fee, paid_fee, parent_name, parent_phone, tenth_score, address, subjects)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [s.id, s.user_id, s.enrollment_no, s.program, s.program_name, s.section, s.branch_id, s.branch_name, s.admission_date, s.total_fee, s.paid_fee, s.parent_name, s.parent_phone, s.tenth_score, s.address, s.subjects]
    );
  }

  // Insert Fee Payments
  const feePayments = [
    { id: 'pay-101', student_id: 'stu-1', receipt_no: 'REC-2025-88901', installment_name: '1st Installment (Admission & Material Kit)', amount: 60000, payment_date: '2025-05-15', payment_method: 'UPI / Razorpay Gateway', transaction_ref: 'TXN_APX_99281741', status: 'Paid', notes: 'Initial admission fee & complete module package.' },
    { id: 'pay-102', student_id: 'stu-1', receipt_no: 'REC-2025-88944', installment_name: '2nd Installment (Term 1 Tuition & Test Series)', amount: 50000, payment_date: '2025-09-10', payment_method: 'Net Banking (HDFC)', transaction_ref: 'TXN_APX_99482110', status: 'Paid', notes: 'Term 1 tuition and all-India online CBT test series fees.' },
    { id: 'pay-201', student_id: 'stu-2', receipt_no: 'REC-2025-77102', installment_name: 'Full One-Time Payment (10% Scholarship Discount)', amount: 150000, payment_date: '2025-05-20', payment_method: 'Credit Card (ICICI)', transaction_ref: 'TXN_APX_77182900', status: 'Paid', notes: 'Full payment cleared with AIIMS special batch kit.' },
    { id: 'pay-301', student_id: 'stu-3', receipt_no: 'REC-2025-66019', installment_name: '1st Installment (Admission Fee)', amount: 40000, payment_date: '2025-06-01', payment_method: 'UPI (Google Pay)', transaction_ref: 'TXN_APX_66019182', status: 'Paid', notes: 'EAMCET MPC Admission kit & Classroom coaching.' },
    { id: 'pay-302', student_id: 'stu-3', receipt_no: 'REC-2025-66088', installment_name: '2nd Installment (Mid-term fee)', amount: 25000, payment_date: '2025-10-05', payment_method: 'UPI (PhonePe)', transaction_ref: 'TXN_APX_66088111', status: 'Paid', notes: 'Mid-term evaluation and classroom materials.' },
    { id: 'pay-401', student_id: 'stu-4', receipt_no: 'REC-2025-55120', installment_name: '1st Installment (Admission Fee)', amount: 50000, payment_date: '2025-06-10', payment_method: 'Debit Card', transaction_ref: 'TXN_APX_55120482', status: 'Paid', notes: 'EAMCET BiPC Program registration.' }
  ];

  for (const p of feePayments) {
    await pool.query(
      `INSERT INTO fee_payments (id, student_id, receipt_no, installment_name, amount, payment_date, payment_method, transaction_ref, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [p.id, p.student_id, p.receipt_no, p.installment_name, p.amount, p.payment_date, p.payment_method, p.transaction_ref, p.status, p.notes]
    );
  }

  const scheduleTemplates = [
    { teacher_id: 'usr-teacher-1', teacher_name: 'Dr. K. S. Radhakrishnan', subject: 'Physics', program: 'JEE', section: 'Section-A (Super 30)', room_no: 'Room 301 (Smart Hall)', start_time: '08:30 AM', end_time: '10:00 AM', topic: 'Rotational Dynamics - Moment of Inertia & Rolling Motion' },
    { teacher_id: 'usr-teacher-1', teacher_name: 'Dr. K. S. Radhakrishnan', subject: 'Physics', program: 'NEET', section: 'Section-M1 (Medical)', room_no: 'Room 204 (Bio-Physics Block)', start_time: '10:30 AM', end_time: '12:00 PM', topic: 'Thermodynamics & Heat Transfer Numerical Problems' },
    { teacher_id: 'usr-teacher-1', teacher_name: 'Dr. K. S. Radhakrishnan', subject: 'Physics', program: 'EAMCET_MPC', section: 'Section-E1 (MPC)', room_no: 'Room 105 (Amphitheatre A)', start_time: '02:00 PM', end_time: '03:30 PM', topic: 'Ray Optics & Optical Instruments Shortcut Techniques' },
    { teacher_id: 'usr-teacher-1', teacher_name: 'Dr. K. S. Radhakrishnan', subject: 'Physics (Doubt Session)', program: 'JEE', section: 'Section-A (Super 30)', room_no: 'Doubt Room 3', start_time: '04:00 PM', end_time: '05:30 PM', topic: '1-on-1 High Priority Numerical Clearing' },
    { teacher_id: 'usr-teacher-2', teacher_name: 'Prof. Ananya Varma', subject: 'Chemistry', program: 'JEE', section: 'Section-A (Super 30)', room_no: 'Room 302', start_time: '10:00 AM', end_time: '11:30 AM', topic: 'Aldehydes, Ketones & Carboxylic Acids Condensation Reactions' },
    { teacher_id: 'usr-teacher-2', teacher_name: 'Prof. Ananya Varma', subject: 'Chemistry', program: 'NEET', section: 'Section-M1 (Medical)', room_no: 'Room 204', start_time: '01:30 PM', end_time: '03:00 PM', topic: 'Coordination Chemistry & Crystal Field Splitting' }
  ];
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let scheduleIndex = 1;
  for (const dayOfWeek of weekdays) {
    for (const s of scheduleTemplates) {
      await pool.query(
        `INSERT INTO classes_schedule (id, teacher_id, teacher_name, subject, program, section, room_no, start_time, end_time, day_of_week, topic)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [`sch-${scheduleIndex++}`, s.teacher_id, s.teacher_name, s.subject, s.program, s.section, s.room_no, s.start_time, s.end_time, dayOfWeek, s.topic]
      );
    }
  }

  // Insert Tests strictly scoped with target_sections
  const tests = [
    {
      id: 'test-1',
      name: 'All India Grand Mock Test - 01',
      program: 'JEE',
      target_sections: JSON.stringify(['Section-A (Super 30)']),
      test_type: 'Grand Test (CBT)',
      test_date: '2026-02-15',
      total_marks: 300,
      subjects: JSON.stringify(['Physics (100)', 'Chemistry (100)', 'Mathematics (100)'])
    },
    {
      id: 'test-2',
      name: 'JEE Advanced Weekly Part Test - 05',
      program: 'JEE',
      target_sections: JSON.stringify(['Section-A (Super 30)']),
      test_type: 'Weekly Test',
      test_date: '2026-02-01',
      total_marks: 180,
      subjects: JSON.stringify(['Physics (60)', 'Chemistry (60)', 'Mathematics (60)'])
    },
    {
      id: 'test-3',
      name: 'JEE Mains Monthly Review Test',
      program: 'JEE',
      target_sections: JSON.stringify(['Section-A (Super 30)']),
      test_type: 'Monthly Test',
      test_date: '2026-01-20',
      total_marks: 300,
      subjects: JSON.stringify(['Physics (100)', 'Chemistry (100)', 'Mathematics (100)'])
    },
    {
      id: 'test-4',
      name: 'NEET All India Pinnacle Mock - 02',
      program: 'NEET',
      target_sections: JSON.stringify(['Section-M1 (Medical)']),
      test_type: 'Grand Test',
      test_date: '2026-02-18',
      total_marks: 720,
      subjects: JSON.stringify(['Physics (180)', 'Chemistry (180)', 'Biology (360)'])
    },
    {
      id: 'test-5',
      name: 'TS & AP EAMCET Grand Test - 01',
      program: 'EAMCET_MPC',
      target_sections: JSON.stringify(['Section-E1 (MPC)']),
      test_type: 'Grand Test',
      test_date: '2026-02-12',
      total_marks: 160,
      subjects: JSON.stringify(['Mathematics (80)', 'Physics (40)', 'Chemistry (40)'])
    },
    {
      id: 'test-6',
      name: 'EAMCET BiPC State Level Mock - 01',
      program: 'EAMCET_BIPC',
      target_sections: JSON.stringify(['Section-B1 (BiPC)']),
      test_type: 'Grand Test',
      test_date: '2026-02-10',
      total_marks: 160,
      subjects: JSON.stringify(['Biology (80)', 'Physics (40)', 'Chemistry (40)'])
    }
  ];

  for (const t of tests) {
    await pool.query(
      `INSERT INTO tests (id, name, program, target_sections, test_type, test_date, total_marks, subjects)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [t.id, t.name, t.program, t.target_sections, t.test_type, t.test_date, t.total_marks, t.subjects]
    );
  }

  // Insert Test Scores (Only for matched program and section)
  const testScores = [
    {
      id: 'score-1',
      test_id: 'test-1',
      student_id: 'stu-1',
      test_name: 'All India Grand Mock Test - 01',
      program: 'JEE',
      test_date: '2026-02-15',
      breakdown: JSON.stringify({ physics: 92, chemistry: 88, mathematics: 95 }),
      total_max: 300,
      total_obtained: 275,
      percentage: 91.67,
      rank_in_batch: 2,
      percentile: 99.4,
      remarks: 'Outstanding performance in Mathematics. Maintain this accuracy.'
    },
    {
      id: 'score-2',
      test_id: 'test-2',
      student_id: 'stu-1',
      test_name: 'JEE Advanced Weekly Part Test - 05',
      program: 'JEE',
      test_date: '2026-02-01',
      breakdown: JSON.stringify({ physics: 54, chemistry: 49, mathematics: 58 }),
      total_max: 180,
      total_obtained: 161,
      percentage: 89.44,
      rank_in_batch: 3,
      percentile: 98.7,
      remarks: 'Strong conceptual clarity in Multivariable Calculus.'
    },
    {
      id: 'score-3',
      test_id: 'test-3',
      student_id: 'stu-1',
      test_name: 'JEE Mains Monthly Review Test',
      program: 'JEE',
      test_date: '2026-01-20',
      breakdown: JSON.stringify({ physics: 86, chemistry: 84, mathematics: 90 }),
      total_max: 300,
      total_obtained: 260,
      percentage: 86.67,
      rank_in_batch: 4,
      percentile: 97.9,
      remarks: 'Minor calculation slips in Physical Chemistry.'
    },
    {
      id: 'score-4',
      test_id: 'test-4',
      student_id: 'stu-2',
      test_name: 'NEET All India Pinnacle Mock - 02',
      program: 'NEET',
      test_date: '2026-02-18',
      breakdown: JSON.stringify({ physics: 168, chemistry: 172, biology: 355 }),
      total_max: 720,
      total_obtained: 695,
      percentage: 96.53,
      rank_in_batch: 1,
      percentile: 99.9,
      remarks: 'Top in state! Exceptional 355/360 in Biology.'
    },
    {
      id: 'score-5',
      test_id: 'test-5',
      student_id: 'stu-3',
      test_name: 'TS & AP EAMCET Grand Test - 01',
      program: 'EAMCET_MPC',
      test_date: '2026-02-12',
      breakdown: JSON.stringify({ mathematics: 74, physics: 36, chemistry: 38 }),
      total_max: 160,
      total_obtained: 148,
      percentage: 92.50,
      rank_in_batch: 1,
      percentile: 99.2,
      remarks: 'Speed in Math is excellent. Keep reviewing inorganic trends.'
    },
    {
      id: 'score-6',
      test_id: 'test-6',
      student_id: 'stu-4',
      test_name: 'EAMCET BiPC State Level Mock - 01',
      program: 'EAMCET_BIPC',
      test_date: '2026-02-10',
      breakdown: JSON.stringify({ biology: 75, physics: 34, chemistry: 36 }),
      total_max: 160,
      total_obtained: 145,
      percentage: 90.62,
      rank_in_batch: 2,
      percentile: 98.5,
      remarks: 'Great Botany score. Focus on optics formulas.'
    }
  ];

  for (const sc of testScores) {
    await pool.query(
      `INSERT INTO test_scores (id, test_id, student_id, test_name, program, test_date, breakdown, total_max, total_obtained, percentage, rank_in_batch, percentile, remarks)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [sc.id, sc.test_id, sc.student_id, sc.test_name, sc.program, sc.test_date, sc.breakdown, sc.total_max, sc.total_obtained, sc.percentage, sc.rank_in_batch, sc.percentile, sc.remarks]
    );
  }

  // Insert Attendance for each student
  const subjectsByProgram = {
    JEE: ['Physics', 'Chemistry', 'Mathematics'],
    NEET: ['Physics', 'Chemistry', 'Biology'],
    EAMCET_MPC: ['Mathematics', 'Physics', 'Chemistry'],
    EAMCET_BIPC: ['Biology', 'Physics', 'Chemistry']
  };

  const daysInMonth = Math.max(0, new Date().getDate() - 1);
  for (const student of students) {
    const studentSubs = subjectsByProgram[student.program];
    for (let day = 1; day <= daysInMonth; day++) {
      if (day % 7 === 0) continue; // Sunday
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const date = `2026-08-${dayStr}`;

      for (let sIdx = 0; sIdx < studentSubs.length; sIdx++) {
        const sub = studentSubs[sIdx];
        const isAbsent = (day === 4 && sIdx === 1) || (day === 14 && sIdx === 2) || (day === 19 && sIdx === 0 && student.id === 'stu-1');
        const status = isAbsent ? 'absent' : 'present';
        const id = `att-${student.id}-${date}-${sub}`;

        await pool.query(
          `INSERT INTO attendance (id, student_id, student_name, program, section, date, day, subject, status, marked_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [id, student.id, student.name, student.program, student.section, date, day, sub, status, 'usr-jl-1']
        );
      }
    }
  }

  console.log('🎉 PostgreSQL Database successfully seeded with all JEE/NEET/EAMCET records!');
};

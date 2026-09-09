import { pool } from '../db/connection.js';

export const getHomeData = async (req, res) => {
  try {
    const [branchesRes, facultyRes, achievementsRes, programsRes] = await Promise.all([
      pool.query(`SELECT * FROM branches ORDER BY name ASC`),
      pool.query(`SELECT * FROM faculty ORDER BY experience DESC`),
      pool.query(`SELECT * FROM achievements ORDER BY year DESC`),
      pool.query(`SELECT * FROM program_catalog WHERE active = TRUE ORDER BY id`)
    ]);

    const branches = branchesRes.rows.map((b) => ({
      id: b.id,
      name: b.name,
      code: b.code,
      city: b.city,
      address: b.address,
      phone: b.phone,
      email: b.email,
      image: b.image,
      totalStudents: b.total_students,
      rating: parseFloat(b.rating),
      facilities: typeof b.facilities === 'string' ? JSON.parse(b.facilities) : b.facilities
    }));

    const faculty = facultyRes.rows.map((f) => ({
      id: f.id,
      name: f.name,
      designation: f.designation,
      department: f.department,
      qualification: f.qualification,
      experience: f.experience,
      subjects: typeof f.subjects === 'string' ? JSON.parse(f.subjects) : f.subjects,
      rating: parseFloat(f.rating),
      photo: f.photo,
      bio: f.bio,
      achievements: f.achievements
    }));

    const achievements = achievementsRes.rows.map((a) => ({
      id: a.id,
      studentName: a.student_name,
      exam: a.exam,
      rank: a.rank,
      score: a.score,
      year: a.year,
      program: a.program,
      collegeAllotted: a.college_allotted,
      photo: a.photo,
      quote: a.quote
    }));

    const averageExperience = faculty.length > 0
      ? Math.round(faculty.reduce((total, member) => total + member.experience, 0) / faculty.length)
      : 0;
    const stats = {
      totalSelections: achievements.length,
      top100AIRs: achievements.filter((achievement) => /AIR\s*\d+/i.test(achievement.rank)).length,
      neetScore700Plus: achievements.filter((achievement) => achievement.program === 'NEET' && Number.parseInt(achievement.score, 10) >= 700).length,
      eamcetTop10Ranks: achievements.filter((achievement) => achievement.program.startsWith('EAMCET') && /rank\s*[1-9]\b/i.test(achievement.rank)).length,
      facultyAverageExperience: averageExperience,
      facultyCount: faculty.length,
      activeCampuses: branches.length
    };

    const programs = programsRes.rows.map((program) => ({
      id: program.id,
      name: program.name,
      title: program.name,
      subtitle: program.duration,
      badge: program.badge,
      description: program.description,
      subjects: typeof program.subjects === 'string' ? JSON.parse(program.subjects) : program.subjects,
      targetExams: typeof program.target_exams === 'string' ? JSON.parse(program.target_exams) : program.target_exams,
      duration: program.duration,
      annualFee: Number(program.annual_fee),
      fee: `₹${Number(program.annual_fee).toLocaleString('en-IN')} / year`
    }));

    /*
      {
        id: 'JEE',
        name: 'JEE (Main + Advanced)',
        badge: 'Engineering Pinnacle',
        description: 'Rigorous 2-year and 1-year master programs crafted for IIT-JEE top ranks with daily CBT tests, advanced physics problem-solving, and personalized mentorship.',
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        targetExams: ['JEE Advanced', 'JEE Main', 'BITSAT'],
        duration: '2 Years / 1 Year Repeater',
        color: 'from-blue-600 to-indigo-700',
        textColor: 'text-blue-600',
        bgLight: 'bg-blue-50'
      },
      {
        id: 'NEET',
        name: 'NEET (UG) Medical',
        badge: 'Medical Excellence',
        description: 'Comprehensive NCERT line-by-line mastery, high-yield biological diagrams, 360-mark biology drills, and AIIMS standard physics/chemistry problem solving.',
        subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
        targetExams: ['NEET UG', 'AIIMS', 'JIPMER'],
        duration: '2 Years / 1 Year Long Term',
        color: 'from-emerald-600 to-teal-700',
        textColor: 'text-emerald-600',
        bgLight: 'bg-emerald-50'
      },
      {
        id: 'EAMCET_MPC',
        name: 'EAMCET (MPC Stream)',
        badge: 'State Engineering Leader',
        description: 'Targeted speed and accuracy mastery for TS & AP EAMCET engineering entrance. Shortcut techniques in calculus and algebra with state-level grand tests.',
        subjects: ['Mathematics (80M)', 'Physics (40M)', 'Chemistry (40M)'],
        targetExams: ['TS EAMCET', 'AP EAPCET'],
        duration: '2 Years / Crash Course',
        color: 'from-amber-600 to-orange-700',
        textColor: 'text-amber-600',
        bgLight: 'bg-amber-50'
      },
      {
        id: 'EAMCET_BIPC',
        name: 'EAMCET (BiPC Stream)',
        badge: 'Agri, Pharma & Vet Care',
        description: 'Specialized coaching for Pharmacy, Agriculture, Veterinary and Horticulture seats in Telangana & Andhra Pradesh with rigorous botanical & zoological test series.',
        subjects: ['Biology (80M)', 'Physics (40M)', 'Chemistry (40M)'],
        targetExams: ['TS EAMCET BiPC', 'AP EAPCET BiPC'],
        duration: '2 Years / Crash Course',
        color: 'from-rose-600 to-pink-700',
        textColor: 'text-rose-600',
        bgLight: 'bg-rose-50'
      }
    ]; */

    return res.json({
      instituteName: 'Apex Academy of Science & Technology',
      tagline: 'Empowering Future IITians, Doctors & State Rankers',
      stats,
      programs,
      achievements,
      faculty,
      branches
    });
  } catch (error) {
    console.error('getHomeData error:', error);
    return res.status(500).json({ error: 'Failed to fetch home page data from PostgreSQL' });
  }
};

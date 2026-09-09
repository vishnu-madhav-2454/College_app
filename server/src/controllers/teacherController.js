import { pool } from '../db/connection.js';

export const getTeacherAssignedClassesToday = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const today = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      timeZone: 'Asia/Kolkata'
    }).format(new Date());

    const schedRes = await pool.query(
      `SELECT * FROM classes_schedule WHERE teacher_id = $1 AND day_of_week = $2 ORDER BY start_time ASC`,
      [teacherId, today]
    );

    const userRes = await pool.query(`SELECT * FROM users WHERE id = $1`, [teacherId]);
    const userObj = userRes.rows[0];
    if (!userObj) return res.status(404).json({ error: 'Teacher account not found in PostgreSQL' });
    const teacherSubject = userObj.subject || schedRes.rows[0]?.subject || null;

    const classes = schedRes.rows.map((r) => ({
      id: r.id,
      teacherId: r.teacher_id,
      teacherName: r.teacher_name,
      subject: r.subject,
      program: r.program,
      section: r.section,
      roomNo: r.room_no,
      startTime: r.start_time,
      endTime: r.end_time,
      dayOfWeek: r.day_of_week,
      topic: r.topic
    }));

    return res.json({
      teacherName: req.user.name,
      teacherSubject,
      today,
      date: new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'Asia/Kolkata'
      }).format(new Date()),
      totalClasses: classes.length,
      classes
    });
  } catch (error) {
    console.error('getTeacherAssignedClassesToday error:', error);
    return res.status(500).json({ error: 'Failed to retrieve today classes from PostgreSQL' });
  }
};

export const getTeacherStudentMarks = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { section, testId } = req.query;

    const userRes = await pool.query(`SELECT * FROM users WHERE id = $1`, [teacherId]);
    const userObj = userRes.rows[0];
    if (!userObj) return res.status(404).json({ error: 'Teacher account not found in PostgreSQL' });

    // Find all classes assigned to this teacher
    const schedRes = await pool.query(`SELECT * FROM classes_schedule WHERE teacher_id = $1`, [teacherId]);
    const teacherClasses = schedRes.rows;

    const teacherSubject = userObj.subject || teacherClasses[0]?.subject || null;

    // Distinct taught sections
    const taughtSections = Array.from(
      new Set(teacherClasses.map((c) => c.section).filter(Boolean))
    );
    const availableSections = taughtSections;

    // Retrieve all tests from PostgreSQL
    const allTestsRes = await pool.query(`SELECT * FROM tests ORDER BY test_date DESC`);
    const allTests = allTestsRes.rows.map((t) => ({
      id: t.id,
      name: t.name,
      program: t.program,
      targetSections: typeof t.target_sections === 'string' ? JSON.parse(t.target_sections) : t.target_sections,
      testType: t.test_type,
      testDate: t.test_date.toISOString().split('T')[0],
      totalMarks: t.total_marks
    })).filter((test) => teacherClasses.some((teacherClass) =>
      teacherClass.program === test.program &&
      test.targetSections?.some((targetSection) => targetSection === teacherClass.section)
    ));

    let selectedTest = null;
    if (testId) {
      selectedTest = allTests.find((t) => t.id === testId);
    }
    if (!selectedTest && allTests.length > 0) {
      selectedTest = allTests[0];
    }
    const testSections = selectedTest?.targetSections?.length
      ? availableSections.filter((availableSection) => selectedTest.targetSections.includes(availableSection))
      : availableSections;
    const selectedSection = section && testSections.includes(section) ? section : null;

    // Filter students STRICTLY to sections taught by this teacher (JOIN with users for name)
    let studentsQuery;
    let queryParams;

    if (selectedSection) {
      studentsQuery = `
        SELECT s.*, u.name, u.avatar, u.email, u.phone
        FROM students s
        JOIN users u ON u.id = s.user_id
        WHERE s.section = $1
        ORDER BY u.name ASC
      `;
      queryParams = [selectedSection];
    } else if (testSections.length > 0) {
      const placeholders = testSections.map((_, i) => `$${i + 1}`).join(', ');
      studentsQuery = `
        SELECT s.*, u.name, u.avatar, u.email, u.phone
        FROM students s
        JOIN users u ON u.id = s.user_id
        WHERE s.section IN (${placeholders})
        ORDER BY u.name ASC
      `;
      queryParams = testSections;
    } else {
      studentsQuery = `
        SELECT s.*, u.name, u.avatar, u.email, u.phone
        FROM students s
        JOIN users u ON u.id = s.user_id
        WHERE 1 = 0
      `;
      queryParams = [];
    }

    const studentsRes = await pool.query(studentsQuery, queryParams);
    const filteredStudents = studentsRes.rows.filter((student) => !selectedTest || student.program === selectedTest.program);

    const subKey = teacherSubject.toLowerCase().includes('physic')
      ? 'physics'
      : teacherSubject.toLowerCase().includes('chem')
      ? 'chemistry'
      : teacherSubject.toLowerCase().includes('math')
      ? 'mathematics'
      : 'biology';

    // Retrieve test scores for selected test
    const scoresRes = selectedTest ? await pool.query(
      `SELECT * FROM test_scores WHERE test_id = $1`,
      [selectedTest.id]
    ) : { rows: [] };

    const studentMarksList = filteredStudents.map((student) => {
      const existingScore = scoresRes.rows.find((sc) => sc.student_id === student.id);
      const breakdown = existingScore?.breakdown
        ? (typeof existingScore.breakdown === 'string' ? JSON.parse(existingScore.breakdown) : existingScore.breakdown)
        : {};

      const subjectMarkObtained = breakdown[subKey] !== undefined ? Number(breakdown[subKey]) : null;

      const subjectMaxMarks = selectedTest?.program === 'NEET' && subKey === 'biology'
        ? 360
        : selectedTest?.program === 'NEET'
        ? 180
        : selectedTest?.program === 'EAMCET_MPC' && subKey === 'mathematics'
        ? 80
        : selectedTest?.program === 'EAMCET_BIPC' && subKey === 'biology'
        ? 80
        : (selectedTest?.program === 'EAMCET_MPC' || selectedTest?.program === 'EAMCET_BIPC')
        ? 40
        : 100;

      const subjectPercentage = subjectMarkObtained === null
        ? null
        : Math.round((subjectMarkObtained / subjectMaxMarks) * 100);

      return {
        studentId: student.id,
        studentName: student.name,
        enrollmentNo: student.enrollment_no,
        program: student.program,
        programName: student.program_name,
        section: student.section,
        branch: student.branch_name,
        teacherSubject,
        subjectMarkObtained,
        subjectMaxMarks,
        subjectPercentage,
        remarks: existingScore?.remarks || ''
      };
    });

    studentMarksList.sort((a, b) => (b.subjectMarkObtained ?? -1) - (a.subjectMarkObtained ?? -1));

    const totalCount = studentMarksList.length;
    const scoredStudents = studentMarksList.filter((student) => student.subjectMarkObtained !== null);
    const avgScore = scoredStudents.length > 0
      ? Math.round(scoredStudents.reduce((acc, curr) => acc + curr.subjectMarkObtained, 0) / scoredStudents.length)
      : 0;

    return res.json({
      teacherSubject,
      taughtSections: testSections,
      selectedTest,
      filters: {
        sections: testSections,
        tests: allTests
      },
      stats: {
        totalStudents: totalCount,
        averageSubjectScore: avgScore,
        highestSubjectScore: Math.max(...studentMarksList.map((s) => s.subjectMarkObtained), 0)
      },
      students: studentMarksList
    });
  } catch (error) {
    console.error('getTeacherStudentMarks error:', error);
    return res.status(500).json({ error: 'Failed to retrieve student marks from PostgreSQL' });
  }
};

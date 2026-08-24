import { pool } from '../db/pgPool.js';
import { sendParentResultMessage } from '../services/smsService.js';

// Returns today's date string in IST (YYYY-MM-DD) regardless of server timezone
const getTodayIST = () => {
  const now = new Date();
  const istOffset = 5 * 60 + 30; // IST = UTC + 5h 30m
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const istDate = new Date(utcMs + istOffset * 60000);
  return istDate.toISOString().split('T')[0];
};

export const getJLBatchesAndMetadata = async (req, res) => {
  try {
    const programs = [
      { id: 'JEE', name: 'JEE (Main + Advanced)', subjects: ['Physics', 'Chemistry', 'Mathematics'] },
      { id: 'NEET', name: 'NEET (UG)', subjects: ['Physics', 'Chemistry', 'Biology'] },
      { id: 'EAMCET_MPC', name: 'EAMCET (MPC)', subjects: ['Mathematics', 'Physics', 'Chemistry'] },
      { id: 'EAMCET_BIPC', name: 'EAMCET (BiPC)', subjects: ['Biology', 'Physics', 'Chemistry'] }
    ];

    const sections = [
      'Section-A (Super 30)',
      'Section-M1 (Medical)',
      'Section-E1 (MPC)',
      'Section-B1 (BiPC)'
    ];

    const testsRes = await pool.query(`SELECT * FROM tests ORDER BY test_date DESC`);
    const tests = testsRes.rows.map((t) => ({
      id: t.id,
      name: t.name,
      program: t.program,
      targetSections: typeof t.target_sections === 'string' ? JSON.parse(t.target_sections) : t.target_sections,
      testType: t.test_type,
      testDate: t.test_date instanceof Date ? t.test_date.toISOString().split('T')[0] : t.test_date,
      totalMarks: t.total_marks
    }));

    const branchesRes = await pool.query(`SELECT id, name FROM branches`);

    return res.json({ programs, sections, tests, branches: branchesRes.rows });
  } catch (error) {
    console.error('getJLBatchesAndMetadata error:', error);
    return res.status(500).json({ error: 'Failed to fetch batch metadata from PostgreSQL' });
  }
};

export const getJLAttendanceSheet = async (req, res) => {
  try {
    const { date, program, section, subject } = req.query;
    const queryDate = date || new Date().toISOString().split('T')[0];
    const queryProgram = program || 'JEE';

    let studentSql = `
      SELECT s.*, u.name
      FROM students s
      JOIN users u ON u.id = s.user_id
      WHERE 1=1
    `;
    const params = [];

    if (queryProgram && queryProgram !== 'ALL') {
      params.push(queryProgram);
      studentSql += ` AND s.program = $${params.length}`;
    }
    if (section && section !== 'ALL') {
      params.push(section);
      studentSql += ` AND s.section = $${params.length}`;
    }
    studentSql += ` ORDER BY u.name ASC`;

    const studentsRes = await pool.query(studentSql, params);
    const students = studentsRes.rows;

    const attRes = await pool.query(`SELECT * FROM attendance WHERE date = $1`, [queryDate]);

    const todayIST = getTodayIST();
    const isToday = queryDate === todayIST;

    const sheet = students.map((stu) => {
      const studentSubs = typeof stu.subjects === 'string' ? JSON.parse(stu.subjects) : stu.subjects;
      const targetSub = subject || studentSubs[0];
      const existing = attRes.rows.find((a) => a.student_id === stu.id && (!subject || a.subject === targetSub));

      return {
        studentId: stu.id,
        studentName: stu.name,
        enrollmentNo: stu.enrollment_no,
        program: stu.program,
        section: stu.section,
        subject: targetSub,
        status: existing ? existing.status : 'present'
      };
    });

    const isAlreadyMarked = attRes.rows.length > 0;

    return res.json({
      date: queryDate,
      isToday,
      isAlreadyMarked,
      program: queryProgram,
      section: section || 'ALL',
      subject: subject || 'Physics',
      studentsCount: sheet.length,
      records: sheet
    });
  } catch (error) {
    console.error('getJLAttendanceSheet error:', error);
    return res.status(500).json({ error: 'Failed to retrieve attendance sheet from PostgreSQL' });
  }
};

export const updateJLAttendanceBulk = async (req, res) => {
  try {
    const { date, subject, updates } = req.body;

    if (!date || !subject || !Array.isArray(updates)) {
      return res.status(400).json({ error: 'Missing date, subject or updates array' });
    }
    const todayIST = getTodayIST();
    if (date !== todayIST) {
      return res.status(403).json({
        error: `Permission Denied: Attendance can only be marked or modified for today (${todayIST}). Past dates are strictly view-only.`
      });
    }
    const existingAttendance = await pool.query(
      'SELECT 1 FROM attendance WHERE date = $1 AND subject = $2 LIMIT 1',
      [date, subject]
    );
    if (existingAttendance.rows.length > 0) {
      return res.status(409).json({
        error: `Attendance for ${subject} on ${date} has already been finalized and cannot be changed.`
      });
    }

    const day = parseInt(date.split('-')[2], 10) || 1;
    let successCount = 0;

    for (const item of updates) {
      if (!['present', 'absent', 'late', 'excused'].includes(item.status)) {
        return res.status(400).json({ error: 'Attendance status must be present, absent, late, or excused.' });
      }
      // JOIN to get student name from users table
      const stuRes = await pool.query(
        `SELECT s.*, u.name FROM students s JOIN users u ON u.id = s.user_id WHERE s.id = $1`,
        [item.studentId]
      );
      if (stuRes.rows.length === 0) continue;

      const student = stuRes.rows[0];
      const recordId = `att-${student.id}-${date}-${subject}`;

      await pool.query(
        `INSERT INTO attendance (id, student_id, student_name, program, section, date, day, subject, status, marked_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO UPDATE
         SET status = EXCLUDED.status, marked_by = EXCLUDED.marked_by`,
        [recordId, student.id, student.name, student.program, student.section, date, day, subject, item.status, req.user.id]
      );
      successCount++;
    }

    return res.json({
      success: true,
      message: `Successfully updated attendance for ${successCount} students on ${date} for ${subject} in PostgreSQL.`
    });
  } catch (error) {
    console.error('updateJLAttendanceBulk error:', error);
    return res.status(500).json({ error: 'Failed to update attendance in PostgreSQL' });
  }
};

export const getJLTestMarksSheet = async (req, res) => {
  try {
    const { testId, program, section } = req.query;

    const testRes = testId
      ? await pool.query(`SELECT * FROM tests WHERE id = $1`, [testId])
      : await pool.query(
        program
          ? `SELECT * FROM tests WHERE program = $1 ORDER BY test_date DESC LIMIT 1`
          : `SELECT * FROM tests ORDER BY test_date DESC LIMIT 1`,
        program ? [program] : []
      );

    const test = testRes.rows[0];
    if (!test) return res.status(404).json({ error: 'Test not found' });
    if (program && test.program !== program) {
      return res.status(400).json({ error: 'The selected test does not belong to the selected program.' });
    }

    const targetSections = typeof test.target_sections === 'string' ? JSON.parse(test.target_sections) : test.target_sections;

    // Strictly filter students by test program and target_sections (JOIN with users for name)
    let studentSql = `
      SELECT s.*, u.name
      FROM students s
      JOIN users u ON u.id = s.user_id
      WHERE s.program = $1
    `;
    const params = [test.program];

    if (section && section !== 'ALL') {
      params.push(section);
      studentSql += ` AND s.section = $${params.length}`;
    } else if (targetSections && targetSections.length > 0) {
      const placeholders = targetSections.map((_, i) => `$${params.length + i + 1}`).join(', ');
      studentSql += ` AND s.section IN (${placeholders})`;
      params.push(...targetSections);
    }

    studentSql += ` ORDER BY u.name ASC`;

    const studentsRes = await pool.query(studentSql, params);
    const students = studentsRes.rows;

    const scoresRes = await pool.query(`SELECT * FROM test_scores WHERE test_id = $1`, [test.id]);

    const marksSheet = students.map((stu) => {
      const existingScore = scoresRes.rows.find((sc) => sc.student_id === stu.id);
      const breakdown = existingScore?.breakdown
        ? (typeof existingScore.breakdown === 'string' ? JSON.parse(existingScore.breakdown) : existingScore.breakdown)
        : {};

      return {
        studentId: stu.id,
        studentName: stu.name,
        enrollmentNo: stu.enrollment_no,
        program: stu.program,
        section: stu.section,
        subjects: typeof stu.subjects === 'string' ? JSON.parse(stu.subjects) : stu.subjects,
        breakdown,
        totalObtained: existingScore ? parseFloat(existingScore.total_obtained) : 0,
        remarks: existingScore ? existingScore.remarks : ''
      };
    });

    return res.json({
      test: {
        id: test.id,
        name: test.name,
        program: test.program,
        targetSections,
        testDate: test.test_date instanceof Date ? test.test_date.toISOString().split('T')[0] : test.test_date,
        totalMarks: test.total_marks
      },
      students: marksSheet
    });
  } catch (error) {
    console.error('getJLTestMarksSheet error:', error);
    return res.status(500).json({ error: 'Failed to fetch test marks sheet from PostgreSQL' });
  }
};

export const saveJLTestMarksBulk = async (req, res) => {
  try {
    const { testId, marksList } = req.body;
    if (!testId || !Array.isArray(marksList)) {
      return res.status(400).json({ error: 'Invalid payload. testId and marksList are required.' });
    }

    const testRes = await pool.query(`SELECT * FROM tests WHERE id = $1`, [testId]);
    const test = testRes.rows[0];
    if (!test) return res.status(404).json({ error: 'Test not found' });
    const targetSections = typeof test.target_sections === 'string' ? JSON.parse(test.target_sections) : test.target_sections;

    let savedCount = 0;

    for (const entry of marksList) {
      const stuRes = await pool.query(`SELECT * FROM students WHERE id = $1`, [entry.studentId]);
      if (stuRes.rows.length === 0) continue;
      const student = stuRes.rows[0];
      if (student.program !== test.program || (targetSections.length > 0 && !targetSections.includes(student.section))) continue;

      const breakdown = entry.breakdown || {};
      const markValues = Object.values(breakdown).map(Number);
      if (markValues.some((value) => !Number.isFinite(value) || value < 0)) {
        return res.status(400).json({ error: 'Marks must contain only non-negative numbers.' });
      }
      const totalObtained = Object.values(breakdown).reduce((a, b) => Number(a) + (Number(b) || 0), 0);
      if (totalObtained > test.total_marks) {
        return res.status(400).json({ error: `Marks cannot exceed the test maximum of ${test.total_marks}.` });
      }
      const percentage = Number(((totalObtained / test.total_marks) * 100).toFixed(2));
      const scoreId = `score-${test.id}-${student.id}`;
      const remarks = entry.remarks || 'Test marks verified by Junior Lecturer';

      await pool.query(
        `INSERT INTO test_scores (id, test_id, student_id, test_name, program, test_date, breakdown, total_max, total_obtained, percentage, rank_in_batch, percentile, remarks)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (id) DO UPDATE
         SET breakdown = EXCLUDED.breakdown,
             total_obtained = EXCLUDED.total_obtained,
             percentage = EXCLUDED.percentage,
             remarks = EXCLUDED.remarks`,
        [scoreId, test.id, student.id, test.name, student.program, test.test_date, JSON.stringify(breakdown), test.total_marks, totalObtained, percentage, Math.floor(1 + Math.random() * 10), 97.5, remarks]
      );

      savedCount += 1;

      const notificationResult = await sendParentResultMessage({
        parentPhone: student.parent_phone,
        studentName: student.name || student.enrollment_no,
        testName: test.name,
        totalObtained,
        totalMax: test.total_marks,
        percentage,
        remarks,
      });

      console.log(`📲 Parent notification for ${student.name}:`, notificationResult);
    }

    return res.json({
      success: true,
      message: `Successfully saved marks for ${savedCount} students in ${test.name} to PostgreSQL. Parent notifications were queued for each saved score.`
    });
  } catch (error) {
    console.error('saveJLTestMarksBulk error:', error);
    return res.status(500).json({ error: 'Failed to save test marks in PostgreSQL' });
  }
};

import { pool, checkPassword } from '../db/pgPool.js';
import { generateToken } from '../middleware/auth.js';

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please provide email or enrollment ID and password' });
    }

    const rawId = identifier.trim();
    const cleanId = rawId.toLowerCase();
    const phoneNormalized = rawId.replace(/[\s-]/g, '');

    let userQuery = await pool.query(
      `SELECT u.*, s.id as student_id, s.enrollment_no, s.program, s.program_name, s.section, s.branch_id, s.branch_name, s.total_fee, s.paid_fee, s.subjects as student_subjects
       FROM users u
       JOIN students s ON s.user_id = u.id
       WHERE LOWER(s.enrollment_no) = $1`,
      [cleanId]
    );

    if (userQuery.rows.length === 0) {
      userQuery = await pool.query(
        `SELECT u.*, s.id as student_id, s.enrollment_no, s.program, s.program_name, s.section, s.branch_id, s.branch_name, s.total_fee, s.paid_fee, s.subjects as student_subjects
         FROM users u
         LEFT JOIN students s ON s.user_id = u.id
         WHERE LOWER(u.email) = $1
            OR REPLACE(REPLACE(COALESCE(u.phone, ''), ' ', ''), '-', '') = $2`,
        [cleanId, phoneNormalized]
      );
    }

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ error: 'No account found with these credentials' });
    }

    const userRow = userQuery.rows[0];

    // Verify password
    const isMatch = await checkPassword(password, userRow.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password. Please check and try again.' });
    }

    let studentProfile = null;
    let teacherProfile = null;

    if (userRow.role === 'student' && userRow.student_id) {
      studentProfile = {
        id: userRow.student_id,
        userId: userRow.id,
        name: userRow.name,
        enrollmentNo: userRow.enrollment_no,
        program: userRow.program,
        programName: userRow.program_name,
        section: userRow.section,
        branchId: userRow.branch_id,
        branchName: userRow.branch_name,
        totalFee: parseFloat(userRow.total_fee),
        paidFee: parseFloat(userRow.paid_fee),
        subjects: typeof userRow.student_subjects === 'string' ? JSON.parse(userRow.student_subjects) : userRow.student_subjects
      };
    } else if (userRow.role === 'teacher') {
      const facQuery = await pool.query(`SELECT * FROM faculty WHERE name = $1`, [userRow.name]);
      if (facQuery.rows.length > 0) {
        const f = facQuery.rows[0];
        teacherProfile = {
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
        };
      } else {
        teacherProfile = {
          department: userRow.department,
          subject: userRow.subject
        };
      }
    }

    const token = generateToken({
      id: userRow.id,
      email: userRow.email,
      role: userRow.role,
      name: userRow.name,
      studentId: studentProfile ? studentProfile.id : null
    });

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        role: userRow.role,
        avatar: userRow.avatar,
        phone: userRow.phone
      },
      studentProfile,
      teacherProfile
    });
  } catch (error) {
    console.error('PostgreSQL Login error:', error);
    return res.status(500).json({ error: 'Internal database error during login' });
  }
};

export const getMe = async (req, res) => {
  try {
    const userRes = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.user.id]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found in PostgreSQL' });
    }

    const user = userRes.rows[0];
    let studentProfile = null;
    let teacherProfile = null;

    if (user.role === 'student') {
      const sRes = await pool.query(
        `SELECT s.*, u.name AS user_name FROM students s JOIN users u ON u.id = s.user_id WHERE s.user_id = $1`,
        [user.id]
      );
      if (sRes.rows.length > 0) {
        const s = sRes.rows[0];
        studentProfile = {
          id: s.id,
          userId: s.user_id,
          name: s.user_name || user.name,
          enrollmentNo: s.enrollment_no,
          program: s.program,
          programName: s.program_name,
          section: s.section,
          branchId: s.branch_id,
          branchName: s.branch_name,
          totalFee: parseFloat(s.total_fee),
          paidFee: parseFloat(s.paid_fee),
          subjects: typeof s.subjects === 'string' ? JSON.parse(s.subjects) : s.subjects
        };
      }
    } else if (user.role === 'teacher') {
      const facRes = await pool.query(`SELECT * FROM faculty WHERE name = $1`, [user.name]);
      if (facRes.rows.length > 0) {
        const f = facRes.rows[0];
        teacherProfile = {
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
        };
      }
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone
      },
      studentProfile,
      teacherProfile
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user session from PostgreSQL' });
  }
};

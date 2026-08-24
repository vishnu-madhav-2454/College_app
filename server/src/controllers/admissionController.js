import { pool, hashPassword } from '../db/pgPool.js';

export const applyAdmission = async (req, res) => {
  try {
    const {
      studentName,
      email,
      phone,
      parentName,
      parentPhone,
      program, // 'JEE', 'NEET', 'EAMCET_MPC', 'EAMCET_BIPC'
      branchId,
      tenthScore,
      address,
      paymentAmount,
      paymentMethod
    } = req.body;

    if (!studentName || !email || !phone || !program || !branchId) {
      return res.status(400).json({ error: 'Missing required admission fields' });
    }

    // Check if user already exists
    const checkEmail = await pool.query(`SELECT id FROM users WHERE LOWER(email) = LOWER($1)`, [email]);
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ error: 'An applicant with this email is already registered in our records.' });
    }

    const branchRes = await pool.query(`SELECT * FROM branches WHERE id = $1`, [branchId]);
    if (branchRes.rows.length === 0) {
      return res.status(400).json({ error: 'Selected campus was not found. Please choose a valid branch.' });
    }
    const branch = branchRes.rows[0];

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const enrollmentNo = `APEX-${program}-${new Date().getFullYear()}-${randomCode}`;
    const generatedPassword = `Apex@${randomCode}`;
    const hashedPassword = await hashPassword(generatedPassword);

    const userId = `usr-student-${Date.now()}`;
    const studentId = `stu-${Date.now()}`;

    const feeStructure = {
      JEE: 160000,
      NEET: 150000,
      EAMCET_MPC: 95000,
      EAMCET_BIPC: 90000
    };

    const programNames = {
      JEE: 'JEE (Main + Advanced) 2-Year Intensive Super 30',
      NEET: 'NEET (UG) AIIMS & Medical Pinnacle Batch',
      EAMCET_MPC: 'TS & AP EAMCET (MPC) Engineering Rank Accelerator',
      EAMCET_BIPC: 'TS & AP EAMCET (BiPC) Agri & Pharmacy Elite'
    };

    const sectionMapping = {
      JEE: 'Section-A (Super 30)',
      NEET: 'Section-M1 (Medical)',
      EAMCET_MPC: 'Section-E1 (MPC)',
      EAMCET_BIPC: 'Section-B1 (BiPC)'
    };

    const programSubjects = {
      JEE: ['Physics', 'Chemistry', 'Mathematics'],
      NEET: ['Physics', 'Chemistry', 'Biology'],
      EAMCET_MPC: ['Mathematics', 'Physics', 'Chemistry'],
      EAMCET_BIPC: ['Biology', 'Physics', 'Chemistry']
    };

    if (!feeStructure[program]) {
      return res.status(400).json({ error: 'Please select a valid program (JEE, NEET, EAMCET_MPC, or EAMCET_BIPC).' });
    }

    const totalCourseFee = feeStructure[program];
    const initialPaid = Math.min(totalCourseFee, Math.max(0, Number(paymentAmount) || 0));
    if (initialPaid <= 0) {
      return res.status(400).json({ error: 'Admission confirmation requires a valid payment amount.' });
    }
    const assignedSection = sectionMapping[program];

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

    // Insert User into Postgres
    await client.query(
      `INSERT INTO users (id, name, email, password, role, phone, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, studentName, email.toLowerCase(), hashedPassword, 'student', phone, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80']
    );

    await client.query(
      `INSERT INTO students (id, user_id, enrollment_no, program, program_name, section, branch_id, branch_name, admission_date, total_fee, paid_fee, parent_name, parent_phone, tenth_score, address, subjects)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        studentId,
        userId,
        enrollmentNo,
        program,
        programNames[program] || program,
        assignedSection,
        branch.id,
        branch.name,
        new Date().toISOString().split('T')[0],
        totalCourseFee,
        initialPaid,
        parentName || 'Guardian',
        parentPhone || phone,
        tenthScore || '95%',
        address || 'Hyderabad',
        JSON.stringify(programSubjects[program] || ['Physics', 'Chemistry', 'Mathematics'])
      ]
    );

    // Insert Fee Payment Receipt into Postgres
    const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const transactionRef = `TXN_APX_${Date.now().toString().slice(-8)}`;
    const paymentDate = new Date().toISOString().split('T')[0];

    await client.query(
      `INSERT INTO fee_payments (id, student_id, receipt_no, installment_name, amount, payment_date, payment_method, transaction_ref, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        `pay-${Date.now()}`,
        studentId,
        receiptNo,
        'Admission Seat Confirmation Fee',
        initialPaid,
        paymentDate,
        paymentMethod || 'Online Payment Gateway',
        transactionRef,
        'Paid',
        'Initial admission seat confirmation and study modules.'
      ]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Admission registered successfully in database!',
      credentials: {
        enrollmentNo,
        email: email.toLowerCase(),
        temporaryPassword: generatedPassword,
        studentName,
        program: programNames[program],
        branchName: branch.name
      },
      payment: {
        receiptNo,
        amount: initialPaid,
        transactionRef,
        date: paymentDate,
        status: 'Successful'
      }
    });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('PostgreSQL Admission error:', error);
    return res.status(500).json({ error: 'Failed to process admission in PostgreSQL database' });
  }
};

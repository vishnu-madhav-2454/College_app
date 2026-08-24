import { pool } from '../db/pgPool.js';
import { createFeePaymentSession } from '../services/paymentService.js';

// Helper: get student with user join
const getStudentByUserId = async (userId) => {
  const res = await pool.query(
    `SELECT s.*, u.name, u.avatar, u.email, u.phone
     FROM students s
     JOIN users u ON u.id = s.user_id
     WHERE s.user_id = $1`,
    [userId]
  );
  return res.rows[0] || null;
};

export const getStudentDashboard = async (req, res) => {
  try {
    const student = await getStudentByUserId(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student profile not found in PostgreSQL' });

    const branchRes = await pool.query(`SELECT * FROM branches WHERE id = $1`, [student.branch_id]);
    const branch = branchRes.rows[0] || null;

    const attRes = await pool.query(`SELECT status FROM attendance WHERE student_id = $1`, [student.id]);
    const totalPeriods = attRes.rows.length;
    const attendedPeriods = attRes.rows.filter((r) => r.status === 'present').length;
    const overallAttendance = totalPeriods > 0 ? Math.round((attendedPeriods / totalPeriods) * 100) : 100;

    const scoreRes = await pool.query(
      `SELECT * FROM test_scores WHERE student_id = $1 ORDER BY test_date DESC LIMIT 1`,
      [student.id]
    );
    const latestScore = scoreRes.rows[0] || null;

    const totalFee = parseFloat(student.total_fee);
    const paidFee = parseFloat(student.paid_fee);

    return res.json({
      student: {
        id: student.id,
        userId: student.user_id,
        name: student.name,
        enrollmentNo: student.enrollment_no,
        program: student.program,
        programName: student.program_name,
        section: student.section,
        branchId: student.branch_id,
        branchName: student.branch_name,
        admissionDate: student.admission_date,
        totalFee,
        paidFee,
        subjects: typeof student.subjects === 'string' ? JSON.parse(student.subjects) : student.subjects,
        branchDetails: branch
      },
      stats: {
        overallAttendance,
        totalPeriods,
        attendedPeriods,
        feePaid: paidFee,
        feeTotal: totalFee,
        feePending: totalFee - paidFee,
        feePercent: Math.round((paidFee / totalFee) * 100),
        testsAttempted: scoreRes.rows.length,
        latestScore
      }
    });
  } catch (error) {
    console.error('getStudentDashboard error:', error);
    return res.status(500).json({ error: 'Failed to load student dashboard from PostgreSQL' });
  }
};

export const getStudentFees = async (req, res) => {
  try {
    const student = await getStudentByUserId(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student not found in PostgreSQL' });

    const receiptsRes = await pool.query(
      `SELECT * FROM fee_payments WHERE student_id = $1 ORDER BY payment_date DESC`,
      [student.id]
    );

    const totalFee = parseFloat(student.total_fee);
    const paidFee = parseFloat(student.paid_fee);
    const pendingFee = Math.max(0, totalFee - paidFee);

    const receipts = receiptsRes.rows.map((r) => ({
      id: r.id,
      studentId: r.student_id,
      receiptNo: r.receipt_no,
      installmentName: r.installment_name,
      amount: parseFloat(r.amount),
      paymentDate: r.payment_date instanceof Date ? r.payment_date.toISOString().split('T')[0] : r.payment_date,
      paymentMethod: r.payment_method,
      transactionRef: r.transaction_ref,
      status: r.status,
      notes: r.notes
    }));

    return res.json({
      totalFee,
      paidFee,
      pendingFee,
      isCleared: pendingFee === 0,
      paidPercent: Math.round((paidFee / totalFee) * 100),
      student: {
        id: student.id,
        name: student.name,
        enrollmentNo: student.enrollment_no,
        program: student.program_name,
        branch: student.branch_name
      },
      receipts
    });
  } catch (error) {
    console.error('getStudentFees error:', error);
    return res.status(500).json({ error: 'Failed to load fees from PostgreSQL' });
  }
};

export const payStudentFee = async (req, res) => {
  try {
    const { amount, paymentMethod, installmentName, provider = 'demo' } = req.body;
    const student = await getStudentByUserId(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student not found in PostgreSQL' });

    const payAmount = parseFloat(amount);
    const totalFee = parseFloat(student.total_fee);
    const currentPaid = parseFloat(student.paid_fee);
    const pendingFee = Math.max(0, totalFee - currentPaid);
    if (!Number.isFinite(payAmount) || payAmount <= 0) {
      return res.status(400).json({ error: 'Please enter a valid payment amount' });
    }
    if (payAmount > pendingFee) {
      return res.status(400).json({ error: `Payment cannot exceed the pending fee of ${pendingFee}.` });
    }

    const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const paymentId = `pay-${Date.now()}`;
    const transactionRef = `TXN_APX_${Date.now().toString().slice(-8)}`;
    const paymentDate = new Date().toISOString().split('T')[0];

    const providerCheckout = await createFeePaymentSession({
      amount: payAmount,
      provider,
      studentName: student.name,
      email: student.email,
      receiptNo,
      metadata: {
        studentId: student.id,
        userId: student.user_id,
        installmentName: installmentName || 'Online Installment Payment',
      },
    });

    const newPaid = Math.min(totalFee, currentPaid + payAmount);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO fee_payments (id, student_id, receipt_no, installment_name, amount, payment_date, payment_method, transaction_ref, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [paymentId, student.id, receiptNo, installmentName || 'Online Installment Payment', payAmount, paymentDate, paymentMethod || providerCheckout.provider || 'UPI / NetBanking', transactionRef, 'Pending', `Payment initiated via ${providerCheckout.provider || 'demo'} provider. ${providerCheckout.message || 'Awaiting external confirmation.'}`]
      );
      await client.query(`UPDATE students SET paid_fee = $1 WHERE id = $2`, [newPaid, student.id]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    return res.json({
      success: true,
      message: `Payment session created successfully via ${providerCheckout.provider}.`,
      provider: providerCheckout.provider,
      payment: {
        id: paymentId,
        studentId: student.id,
        receiptNo,
        installmentName: installmentName || 'Online Installment Payment',
        amount: payAmount,
        paymentDate,
        paymentMethod: paymentMethod || providerCheckout.provider || 'UPI / NetBanking',
        transactionRef,
        status: 'Pending',
      },
      checkout: providerCheckout,
      totalFee,
      paidFee: newPaid,
      pendingFee: totalFee - newPaid
    });
  } catch (error) {
    console.error('payStudentFee error:', error);
    return res.status(500).json({ error: 'Failed to process fee payment in PostgreSQL' });
  }
};

export const getStudentTests = async (req, res) => {
  try {
    const student = await getStudentByUserId(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student not found in PostgreSQL' });

    // Strictly scope: only tests whose target_sections includes this student's section
    const testsRes = await pool.query(
      `SELECT t.*, sc.id as score_id, sc.breakdown, sc.total_max, sc.total_obtained, sc.percentage, sc.rank_in_batch, sc.percentile, sc.remarks
       FROM tests t
       LEFT JOIN test_scores sc ON sc.test_id = t.id AND sc.student_id = $1
       WHERE t.program = $2 AND t.target_sections @> $3::jsonb
       ORDER BY t.test_date DESC`,
      [student.id, student.program, JSON.stringify([student.section])]
    );

    const scores = testsRes.rows.map((row) => {
      const breakdown = row.breakdown
        ? (typeof row.breakdown === 'string' ? JSON.parse(row.breakdown) : row.breakdown)
        : {};
      const totalMax = row.total_max || row.total_marks;
      const totalObtained = row.total_obtained ? parseFloat(row.total_obtained) : 0;
      const percentage = row.percentage ? parseFloat(row.percentage) : (totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0);

      return {
        id: row.score_id || `notscore-${row.id}`,
        testId: row.id,
        studentId: student.id,
        testName: row.name,
        program: row.program,
        testDate: row.test_date instanceof Date ? row.test_date.toISOString().split('T')[0] : row.test_date,
        breakdown,
        totalMax,
        totalObtained,
        percentage,
        rankInBatch: row.rank_in_batch || '-',
        percentile: row.percentile ? parseFloat(row.percentile) : null,
        remarks: row.remarks || 'Test verified by Section Coordinator'
      };
    });

    return res.json({
      studentId: student.id,
      studentName: student.name,
      program: student.program,
      section: student.section,
      scores,
      trendData: [...scores].reverse().map((s) => ({
        testName: s.testName,
        date: s.testDate,
        totalObtained: s.totalObtained,
        totalMax: s.totalMax,
        percentage: s.percentage,
        percentile: s.percentile,
        rank: s.rankInBatch,
        breakdown: s.breakdown
      }))
    });
  } catch (error) {
    console.error('getStudentTests error:', error);
    return res.status(500).json({ error: 'Failed to fetch test scores from PostgreSQL' });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const student = await getStudentByUserId(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student not found in PostgreSQL' });

    const studentSubjects = typeof student.subjects === 'string' ? JSON.parse(student.subjects) : student.subjects;

    const attRes = await pool.query(
      `SELECT * FROM attendance WHERE student_id = $1 ORDER BY date ASC, subject ASC`,
      [student.id]
    );

    const records = attRes.rows.map((r) => ({
      id: r.id,
      studentId: r.student_id,
      studentName: r.student_name,
      program: r.program,
      section: r.section,
      date: r.date instanceof Date ? r.date.toISOString().split('T')[0] : r.date,
      day: r.day,
      subject: r.subject,
      status: r.status
    }));

    // Group by Date for calendar grid
    const calendarDays = {};
    records.forEach((rec) => {
      if (!calendarDays[rec.date]) {
        calendarDays[rec.date] = { date: rec.date, day: rec.day, subjects: [] };
      }
      calendarDays[rec.date].subjects.push({ subject: rec.subject, status: rec.status });
    });

    // Subject-wise percentages
    const subjectStats = {};
    studentSubjects.forEach((sub) => {
      subjectStats[sub] = { subject: sub, total: 0, attended: 0, absent: 0, percentage: 0 };
    });

    records.forEach((rec) => {
      if (!subjectStats[rec.subject]) {
        subjectStats[rec.subject] = { subject: rec.subject, total: 0, attended: 0, absent: 0, percentage: 0 };
      }
      subjectStats[rec.subject].total += 1;
      if (rec.status === 'present') {
        subjectStats[rec.subject].attended += 1;
      } else {
        subjectStats[rec.subject].absent += 1;
      }
    });

    Object.keys(subjectStats).forEach((sub) => {
      const st = subjectStats[sub];
      st.percentage = st.total > 0 ? Math.round((st.attended / st.total) * 100) : 100;
    });

    const totalLectures = records.length;
    const attendedLectures = records.filter((r) => r.status === 'present').length;
    const totalPercentage = totalLectures > 0 ? Math.round((attendedLectures / totalLectures) * 100) : 100;

    return res.json({
      studentName: student.name,
      program: student.program,
      section: student.section,
      totalLectures,
      attendedLectures,
      absentLectures: totalLectures - attendedLectures,
      totalPercentage,
      subjectStats: Object.values(subjectStats),
      calendarGrid: Object.values(calendarDays).sort((a, b) => new Date(a.date) - new Date(b.date))
    });
  } catch (error) {
    console.error('getStudentAttendance error:', error);
    return res.status(500).json({ error: 'Failed to fetch student attendance from PostgreSQL' });
  }
};

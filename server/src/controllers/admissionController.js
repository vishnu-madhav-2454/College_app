import { pool, hashPassword } from '../db/connection.js';
import { admissionPrograms } from '../config/admissionPrograms.js';
import { createFeePaymentSession, getRazorpayOrderStatus, verifyRazorpayPayment } from '../services/paymentService.js';

const DEFAULT_STUDENT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

const createAdmissionIdentifiers = (program) => {
  const code = Math.floor(1000 + Math.random() * 9000);
  const timestamp = Date.now();

  return {
    enrollmentNo: `APEX-${program}-${new Date().getFullYear()}-${code}`,
    generatedPassword: `Apex@${code}`,
    userId: `usr-student-${timestamp}`,
    studentId: `stu-${timestamp}`,
    paymentId: `pay-${timestamp}`,
    receiptNo: `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    paymentDate: new Date().toISOString().split('T')[0]
  };
};

const insertAdmissionRecords = async ({
  client,
  admission,
  payment,
  branch,
  selectedProgram
}) => {
  await client.query(
    `INSERT INTO users (id, name, email, password, role, phone, avatar)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [admission.userId, admission.studentName, admission.email, admission.password, 'student', admission.phone, DEFAULT_STUDENT_AVATAR]
  );

  await client.query(
    `INSERT INTO students (id, user_id, enrollment_no, program, program_name, section, branch_id, branch_name, admission_date, total_fee, paid_fee, parent_name, parent_phone, tenth_score, address, subjects)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
    [
      admission.studentId,
      admission.userId,
      admission.enrollmentNo,
      admission.program,
      selectedProgram.name,
      selectedProgram.section,
      branch.id,
      branch.name,
      admission.paymentDate,
      selectedProgram.fee,
      payment.paidFee,
      admission.parentName || 'Guardian',
      admission.parentPhone || admission.phone,
      admission.tenthScore || '95%',
      admission.address || 'Hyderabad',
      JSON.stringify(selectedProgram.subjects)
    ]
  );

  await client.query(
    `INSERT INTO fee_payments (id, student_id, receipt_no, installment_name, amount, payment_date, payment_method, transaction_ref, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      admission.paymentId,
      admission.studentId,
      admission.receiptNo,
      'Admission Seat Confirmation Fee',
      payment.amount,
      admission.paymentDate,
      admission.paymentMethod || 'Online Payment Gateway',
      payment.transactionRef,
      payment.status,
      `Admission payment initiated via ${payment.provider}. ${payment.message}`
    ]
  );
};

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

    const checkEmail = await pool.query(`SELECT id FROM users WHERE LOWER(email) = LOWER($1)`, [email]);
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ error: 'An applicant with this email is already registered in our records.' });
    }

    const branchRes = await pool.query(`SELECT * FROM branches WHERE id = $1`, [branchId]);
    if (branchRes.rows.length === 0) {
      return res.status(400).json({ error: 'Selected campus was not found. Please choose a valid branch.' });
    }
    const branch = branchRes.rows[0];

    const selectedProgram = admissionPrograms[program];
    if (!selectedProgram) {
      return res.status(400).json({ error: 'Please select a valid program (JEE, NEET, EAMCET_MPC, or EAMCET_BIPC).' });
    }

    const totalCourseFee = selectedProgram.fee;
    const initialPaid = Math.min(totalCourseFee, Math.max(0, Number(paymentAmount) || 0));
    if (initialPaid <= 0) {
      return res.status(400).json({ error: 'Admission confirmation requires a valid payment amount.' });
    }
    const identifiers = createAdmissionIdentifiers(program);
    const generatedPasswordHash = await hashPassword(identifiers.generatedPassword);
    const providerCheckout = await createFeePaymentSession({
      amount: initialPaid,
      provider: 'razorpay',
      studentName,
      email: email.toLowerCase(),
      receiptNo: identifiers.receiptNo,
      metadata: { studentId: identifiers.studentId, userId: identifiers.userId, installmentName: 'Admission Seat Confirmation Fee' }
    });
    const payment = {
      amount: initialPaid,
      status: providerCheckout.status || 'Pending',
      provider: providerCheckout.provider,
      message: providerCheckout.message || 'Awaiting Razorpay confirmation.',
      transactionRef: providerCheckout.orderId || `TXN_APX_${Date.now().toString().slice(-8)}`,
      paidFee: providerCheckout.status === 'Paid' ? initialPaid : 0
    };
    const admission = {
      ...identifiers,
      studentName,
      email: email.toLowerCase(),
      password: generatedPasswordHash,
      phone,
      parentName,
      parentPhone,
      program,
      tenthScore,
      address,
      paymentMethod
    };

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

    await insertAdmissionRecords({ client, admission, payment, branch, selectedProgram });

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Admission registered successfully in database!',
      credentials: {
        enrollmentNo: admission.enrollmentNo,
        email: admission.email,
        temporaryPassword: identifiers.generatedPassword,
        studentName,
        program: selectedProgram.name,
        branchName: branch.name
      },
      checkout: providerCheckout,
      paymentId: admission.paymentId,
      payment: {
        receiptNo: admission.receiptNo,
        amount: payment.amount,
        transactionRef: payment.transactionRef,
        date: admission.paymentDate,
        status: payment.status
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

export const verifyAdmissionPayment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { paymentId, orderId, razorpayPaymentId, signature } = req.body;
    if (!paymentId || !orderId || !razorpayPaymentId || !signature) {
      return res.status(400).json({ error: 'Missing Razorpay admission verification details.' });
    }
    if (!verifyRazorpayPayment({ orderId, paymentId: razorpayPaymentId, signature })) {
      return res.status(400).json({ error: 'Razorpay admission payment signature could not be verified.' });
    }

    await client.query('BEGIN');
    const receiptResult = await client.query(
      `SELECT fp.*, s.id AS student_id, s.total_fee, s.paid_fee
       FROM fee_payments fp
       JOIN students s ON s.id = fp.student_id
       WHERE fp.id = $1 AND fp.transaction_ref = $2
       FOR UPDATE`,
      [paymentId, orderId]
    );
    if (receiptResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Admission payment receipt not found.' });
    }

    const receipt = receiptResult.rows[0];
    if (receipt.status !== 'Paid') {
      const paidFee = Math.min(Number(receipt.total_fee), Number(receipt.paid_fee) + Number(receipt.amount));
      await client.query(
        `UPDATE fee_payments SET status = 'Paid', transaction_ref = $1, notes = $2 WHERE id = $3`,
        [razorpayPaymentId, `Razorpay admission payment verified for order ${orderId}.`, paymentId]
      );
      await client.query(`UPDATE students SET paid_fee = $1 WHERE id = $2`, [paidFee, receipt.student_id]);
    }
    await client.query('COMMIT');
    return res.json({ success: true, status: 'Paid', transactionRef: razorpayPaymentId, receiptNo: receipt.receipt_no });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('verifyAdmissionPayment error:', error);
    return res.status(500).json({ error: 'Failed to verify Razorpay admission payment.' });
  } finally {
    client.release();
  }
};

export const cancelAdmissionPayment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { paymentId, orderId } = req.body;
    if (!paymentId || !orderId) {
      return res.status(400).json({ error: 'Missing admission payment details.' });
    }

    const orderStatus = await getRazorpayOrderStatus(orderId);
    if (orderStatus === 'paid') {
      return res.status(409).json({ error: 'This payment was completed and cannot be cancelled.' });
    }

    await client.query('BEGIN');
    const pendingPayment = await client.query(
      `SELECT fp.student_id, s.user_id
       FROM fee_payments fp
       JOIN students s ON s.id = fp.student_id
       WHERE fp.id = $1 AND fp.transaction_ref = $2 AND fp.status = 'Pending'
       FOR UPDATE`,
      [paymentId, orderId]
    );

    if (pendingPayment.rows.length > 0) {
      const { student_id: studentId, user_id: userId } = pendingPayment.rows[0];
      await client.query('DELETE FROM fee_payments WHERE id = $1', [paymentId]);
      await client.query('DELETE FROM students WHERE id = $1', [studentId]);
      await client.query('DELETE FROM users WHERE id = $1', [userId]);
    }

    await client.query('COMMIT');
    return res.json({ success: true, message: 'Cancelled admission application can be submitted again.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('cancelAdmissionPayment error:', error);
    return res.status(500).json({ error: 'Could not cancel the pending admission payment.' });
  } finally {
    client.release();
  }
};

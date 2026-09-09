import express from 'express';
import {
  getStudentDashboard,
  getStudentFees,
  payStudentFee,
  verifyStudentFeePayment,
  getStudentTests,
  getStudentAttendance
} from '../controllers/studentController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All student routes require auth and 'student' role
router.use(authMiddleware);
router.use(requireRole('student'));

router.get('/dashboard', getStudentDashboard);
router.get('/fees', getStudentFees);
router.post('/fees/pay', payStudentFee);
router.post('/fees/pay/verify', verifyStudentFeePayment);
router.get('/tests', getStudentTests);
router.get('/attendance', getStudentAttendance);

export default router;

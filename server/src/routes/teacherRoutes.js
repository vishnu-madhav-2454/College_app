import express from 'express';
import {
  getTeacherAssignedClassesToday,
  getTeacherStudentMarks
} from '../controllers/teacherController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Teacher routes require auth and 'teacher' role (or admin)
router.use(authMiddleware);
router.use(requireRole(['teacher', 'admin']));

router.get('/classes-today', getTeacherAssignedClassesToday);
router.get('/student-marks', getTeacherStudentMarks);

export default router;

import express from 'express';
import {
  getJLBatchesAndMetadata,
  getJLAttendanceSheet,
  updateJLAttendanceBulk,
  getJLTestMarksSheet,
  saveJLTestMarksBulk
} from '../controllers/juniorLecturerController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Junior Lecturer routes require auth and 'junior_lecturer' or 'admin' role
router.use(authMiddleware);
router.use(requireRole(['junior_lecturer', 'admin']));

router.get('/metadata', getJLBatchesAndMetadata);
router.get('/attendance', getJLAttendanceSheet);
router.post('/attendance/update', updateJLAttendanceBulk);
router.get('/marks', getJLTestMarksSheet);
router.post('/marks/save', saveJLTestMarksBulk);

export default router;

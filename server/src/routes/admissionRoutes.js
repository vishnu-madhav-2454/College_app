import express from 'express';
import { applyAdmission, verifyAdmissionPayment, cancelAdmissionPayment } from '../controllers/admissionController.js';

const router = express.Router();

router.post('/apply', applyAdmission);
router.post('/payment/verify', verifyAdmissionPayment);
router.post('/payment/cancel', cancelAdmissionPayment);

export default router;

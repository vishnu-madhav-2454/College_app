import express from 'express';
import { applyAdmission } from '../controllers/admissionController.js';

const router = express.Router();

router.post('/apply', applyAdmission);

export default router;

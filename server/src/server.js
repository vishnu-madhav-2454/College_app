import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initPostgresDB, pool } from './db/pgPool.js';

import authRoutes from './routes/authRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import juniorLecturerRoutes from './routes/juniorLecturerRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admission', admissionRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/jl', juniorLecturerRoutes);
app.use('/api/public', publicRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT version(), current_database() AS database, NOW() AS server_time');
    res.json({
      status: 'online',
      database: result.rows[0].database,
      postgresVersion: result.rows[0].version,
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT || 5432),
      timestamp: new Date().toISOString(),
      postgresTime: result.rows[0].server_time,
      service: 'Apex Academy JEE/NEET/EAMCET Management API'
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      database: 'unavailable',
      error: 'PostgreSQL connection failed'
    });
  }
});

// Initialize PostgreSQL database and start listening
initPostgresDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Apex Academy Backend Server running on http://localhost:${PORT}`);
    console.log(`🐘 Connected to live PostgreSQL Database`);
    console.log(`📋 API Health Check at http://localhost:${PORT}/api/health`);
  });
}).catch((err) => {
  console.error('Failed to initialize PostgreSQL database:', err);
});

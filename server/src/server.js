import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initPostgresDB } from './db/databaseInitializer.js';

import authRoutes from './routes/authRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import juniorLecturerRoutes from './routes/juniorLecturerRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDistPath, 'index.html')));
}


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

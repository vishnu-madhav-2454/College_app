import express from 'express';
import { getHomeData } from '../controllers/publicController.js';
import { pool } from '../db/connection.js';

const router = express.Router();

router.get('/home-data', getHomeData);

router.get('/branches', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM branches ORDER BY name ASC');
    const branches = result.rows.map((b) => ({
      id: b.id,
      name: b.name,
      code: b.code,
      city: b.city,
      address: b.address,
      phone: b.phone,
      email: b.email,
      image: b.image,
      totalStudents: b.total_students,
      rating: parseFloat(b.rating),
      facilities: typeof b.facilities === 'string' ? JSON.parse(b.facilities) : b.facilities
    }));
    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch branches from PostgreSQL' });
  }
});

router.get('/faculty', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faculty ORDER BY experience DESC');
    const faculty = result.rows.map((f) => ({
      id: f.id,
      name: f.name,
      designation: f.designation,
      department: f.department,
      qualification: f.qualification,
      experience: f.experience,
      subjects: typeof f.subjects === 'string' ? JSON.parse(f.subjects) : f.subjects,
      rating: parseFloat(f.rating),
      photo: f.photo,
      bio: f.bio,
      achievements: f.achievements
    }));
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch faculty from PostgreSQL' });
  }
});

router.get('/achievements', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM achievements ORDER BY year DESC');
    const achievements = result.rows.map((a) => ({
      id: a.id,
      studentName: a.student_name,
      exam: a.exam,
      rank: a.rank,
      score: a.score,
      year: a.year,
      program: a.program,
      collegeAllotted: a.college_allotted,
      photo: a.photo,
      quote: a.quote
    }));
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements from PostgreSQL' });
  }
});

export default router;

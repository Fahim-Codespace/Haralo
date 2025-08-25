import express from 'express';
import { getStudent, createStudent } from '../controllers/studentController.js';

const router = express.Router();

// GET all students
router.get('/', getStudent);

// POST /api/student/signup
router.post('/signup', createStudent);

export default router;

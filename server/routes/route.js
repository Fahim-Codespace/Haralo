import express from 'express';
import { getStudent, createStudent, loginStudent } from '../controllers/studentController.js';
import { createLostItem, getLostItems } from '../controllers/lostItemController.js';

const router = express.Router();

// GET all students
router.get('/', getStudent);

// POST /api/student/signup
router.post('/signup', createStudent);
router.post('/login', loginStudent);

// Lost item routes
router.post('/report-lost', createLostItem);
router.get('/lost-items', getLostItems);

export default router;

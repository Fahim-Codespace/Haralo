import express from 'express';
import { getStudent, createStudent, loginStudent, getStudentByEmail } from '../controllers/studentController.js';
import { createLostItem, getLostItems } from '../controllers/lostItemController.js';
import requireAuth from '../Middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getStudent);
router.get('/profile', getStudentByEmail); // Add this line
router.post('/signup', createStudent);
router.post('/login', loginStudent);

// Protected routes - require authentication
router.post('/report-lost', requireAuth, createLostItem);
router.get('/lost-items', requireAuth, getLostItems);

export default router;
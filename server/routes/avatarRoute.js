import express from 'express';
import requireAuth from '../Middleware/auth.js';
import { uploadAvatar, setAvatarGridFS } from '../controllers/avatarController.js';

const router = express.Router();

// POST /avatar - upload profile avatar, store in GridFS and set Student.avatar to a retrievable URL
router.post('/avatar', requireAuth, uploadAvatar, setAvatarGridFS);

export default router;

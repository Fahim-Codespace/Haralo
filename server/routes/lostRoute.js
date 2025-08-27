import express from 'express';
import multer from 'multer';
import LostItem from '../models/lostItem.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('photo'), async (req, res) => {
  try {
    console.log('LostItem POST req.body:', req.body);
    console.log('LostItem POST req.file:', req.file);
    const { name, item, location, date, description } = req.body;
    const photo = req.file ? req.file.filename : null;
    const lostItem = new LostItem({ name, item, location, date, description, photo });
    await lostItem.save();
    res.status(201).json({ message: 'Lost item reported successfully!' });
  } catch (error) {
    console.error('LostItem POST error:', error);
    res.status(500).json({ error: 'Failed to report lost item.' });
  }
});

export default router;

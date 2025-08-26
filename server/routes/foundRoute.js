import express from 'express';
import multer from 'multer';
import FoundItem from '../models/FoundItem.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Store files in 'uploads' folder

router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, item, location, date, description } = req.body;
    const photo = req.file ? req.file.filename : null;

    const foundItem = new FoundItem({
      name,
      item,
      location,
      date,
      description,
      photo,
    });

    await foundItem.save();
    res.status(201).json({ message: 'Found item reported successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to report found item.' });
  }
});

export default router;
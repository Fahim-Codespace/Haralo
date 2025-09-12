import express from 'express';
import multer from 'multer';
import FoundItem from '../models/FoundItem.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Store files in 'uploads' folder

router.post('/', upload.single('photo'), async (req, res) => {
  try {
    console.log('FoundItem POST req.body:', req.body);
    console.log('FoundItem POST req.file:', req.file);
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
    console.error('FoundItem POST error:', error);
    res.status(500).json({ error: 'Failed to report found item.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await FoundItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch found items.' });
  }
});

export default router;
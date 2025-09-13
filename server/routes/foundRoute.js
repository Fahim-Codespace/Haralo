import express from 'express';
import multer from 'multer';
import FoundItem from '../models/FoundItem.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Store files in 'uploads' folder

router.post('/', upload.single('photo'), async (req, res) => {
  try {
    console.log('FoundItem POST req.body:', req.body);
    console.log('FoundItem POST req.file:', req.file ? { filename: req.file.filename, originalname: req.file.originalname } : null);
    // Debug: print schema paths for FoundItem
    try {
      console.log('FoundItem schema paths:', Object.keys(FoundItem.schema.paths));
    } catch (schemaErr) {
      console.error('Could not read FoundItem.schema.paths:', schemaErr);
    }

    const { name, item, location, date, description, contact } = req.body;
    const photo = req.file ? req.file.filename : null;
    const parsedDate = date ? new Date(date) : null;

    const foundItem = new FoundItem({
      name,
      item,
      location,
      date: parsedDate,
      description,
      photo,
    });

    // Inspect and assign contact explicitly if schema/path exists
    try {
      const contactPath = FoundItem.schema && FoundItem.schema.path('contact');
      console.log('FoundItem.schema.path("contact") exists:', !!contactPath, contactPath ? contactPath.instance : null);
    } catch (schemaErr) {
      console.error('Failed to inspect FoundItem schema path for contact:', schemaErr);
    }

    if (typeof foundItem.contact === 'undefined') {
      foundItem.contact = contact;
      console.log('Manually assigned foundItem.contact ->', foundItem.contact);
    }

    console.log('After assignment, foundItem.get("contact") =', foundItem.get('contact'));

    const saved = await foundItem.save();
    console.log('Saved FoundItem:', JSON.stringify(saved, null, 2));
    return res.status(201).json({ message: 'Found item reported successfully!', foundItem: saved });
  } catch (error) {
    console.error('FoundItem POST error:', error);
    res.status(500).json({ error: 'Failed to report found item.' });
  }
});

router.get('/', async (req, res) => {
  try {
  const items = await FoundItem.find();
  console.log('GET FoundItems returning:', items.slice(-5));
  res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch found items.' });
  }
});

export default router;
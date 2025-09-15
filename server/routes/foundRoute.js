import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
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

  const { name, item, location, date, description, contact, photo: photoFromBody } = req.body;
  // photo may arrive either as uploaded file (req.file.filename) or as a URL returned by GridFS (photoFromBody)
  const photo = photoFromBody || (req.file ? req.file.filename : null);
    const parsedDate = date ? new Date(date) : null;

    // Try to extract posterId from Authorization header if a token is present
    let posterId = undefined;
    try {
      const auth = req.headers.authorization;
      if (auth && auth.startsWith('Bearer ')) {
        const token = auth.split(' ')[1];
        const payload = jwt.verify(token, process.env.SECRET);
        if (payload && payload._id) posterId = payload._id;
      }
    } catch (e) {
      // ignore if token invalid; posterId will be undefined
      console.warn('Failed to decode token in found POST:', e.message);
    }

    const foundItem = new FoundItem({
      name,
      item,
      location,
      date: parsedDate,
      description,
      photo,
      posterId,
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

// PATCH /:id/status - update status (only poster can change)
router.patch('/:id/status', async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ error: 'Authorization token required' });
    const token = authorization.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, process.env.SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const itemId = req.params.id;
    const { status } = req.body;
    if (!['available', 'returned'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const item = await FoundItem.findById(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (!item.posterId) return res.status(403).json({ error: 'Poster not recorded for this item' });
    if (String(item.posterId) !== String(payload._id)) {
      return res.status(403).json({ error: 'Only the poster can change status' });
    }

    item.status = status;
    await item.save();
    res.json({ message: 'Status updated', item });
  } catch (error) {
    console.error('Error updating found status:', error);
    res.status(500).json({ error: 'Failed to update status' });
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
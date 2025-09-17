import express from 'express';
import multer from 'multer';
import requireAuth from '../Middleware/auth.js';
import FoundItem from '../models/FoundItem.js';
import Student from '../models/students.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Store files in 'uploads' folder

router.post('/', requireAuth, upload.single('photo'), async (req, res) => {
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

    // poster must be authenticated (requireAuth). Use req.user._id as posterId and fetch their name + avatar
    const posterId = req.user && req.user._id;
    let postName = name;
    let posterAvatar = null;
    if (posterId) {
      try {
        const student = await Student.findById(posterId).select('name avatar');
        if (student && student.name) postName = student.name;
        if (student && student.avatar) posterAvatar = student.avatar;
      } catch (e) {
        console.warn('Failed to lookup student name/avatar for posterId:', e.message);
      }
    }

    const foundItem = new FoundItem({
      name: postName,
      item,
      location,
      date: parsedDate,
      description,
      photo,
      posterId,
      posterAvatar,
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
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const posterId = req.user && req.user._id;
    const itemId = req.params.id;
    const { status } = req.body;
    if (!['available', 'returned'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const item = await FoundItem.findById(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (!item.posterId) return res.status(403).json({ error: 'Poster not recorded for this item' });
    if (String(item.posterId) !== String(posterId)) {
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
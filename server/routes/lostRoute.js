import express from 'express';
import multer from 'multer';
import LostItem from '../models/lostItem.js';
import Student from '../models/students.js';
import requireAuth from '../Middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    console.log('LostItem POST req.body:', req.body);
    console.log('LostItem POST req.file:', req.file ? { filename: req.file.filename, originalname: req.file.originalname } : null);
    // Debug: print schema paths for LostItem
    try {
      console.log('LostItem schema paths:', Object.keys(LostItem.schema.paths));
    } catch (schemaErr) {
      console.error('Could not read LostItem.schema.paths:', schemaErr);
    }

  // Normalize and pick fields explicitly
  const { name, item, location, date, description, contact, photo: photoFromBody } = req.body;
  // photo may be a GridFS fileUrl returned by the upload endpoint (e.g. '/api/uploads/gridfs/..')
  const photo = photoFromBody || (req.file ? req.file.filename : null);

    // Coerce date to a Date object if provided as string
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

    const lostItem = new LostItem({
      name: postName,
      item,
      location,
      date: parsedDate,
      description,
      contact,
      photo,
      posterId,
      posterAvatar,
    });

    // Debug: inspect the constructed Mongoose document before saving
    try {
      console.log('lostItem.contact (variable):', contact, 'type:', typeof contact);
      console.log('lostItem instance keys:', Object.keys(lostItem.toObject()));
      console.log('lostItem.toObject():', JSON.stringify(lostItem.toObject(), null, 2));
    } catch (dbgErr) {
      console.error('Debug inspect lostItem failed:', dbgErr);
    }

    // Check schema path for contact
    try {
      const contactPath = LostItem.schema && LostItem.schema.path('contact');
      console.log('LostItem.schema.path("contact") exists:', !!contactPath, contactPath ? contactPath.instance : null);
    } catch (schemaErr) {
      console.error('Failed to inspect LostItem schema path for contact:', schemaErr);
    }

    // If contact somehow didn't get set on the instance, set it explicitly
    if (typeof lostItem.contact === 'undefined') {
      lostItem.contact = contact;
      console.log('Manually assigned lostItem.contact ->', lostItem.contact);
    }

    console.log('After assignment, lostItem.get("contact") =', lostItem.get('contact'));

    const saved = await lostItem.save();
    // Log the saved document as JSON for clarity
    console.log('Saved LostItem:', JSON.stringify(saved, null, 2));
    return res.status(201).json({ message: 'Lost item reported successfully!', lostItem: saved });
  } catch (error) {
    console.error('LostItem POST error:', error);
    res.status(500).json({ error: 'Failed to report lost item.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await LostItem.find();
    console.log('GET LostItems returning:', items.slice(-5));
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lost items.' });
  }
});

// PATCH /:id/status - update status (only poster can change)
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const posterId = req.user && req.user._id;
    const itemId = req.params.id;
    const { status } = req.body;
    if (!['lost', 'got returned'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const item = await LostItem.findById(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (!item.posterId) return res.status(403).json({ error: 'Poster not recorded for this item' });
    if (String(item.posterId) !== String(posterId)) {
      return res.status(403).json({ error: 'Only the poster can change status' });
    }

    item.status = status;
    await item.save();
    res.json({ message: 'Status updated', item });
  } catch (error) {
    console.error('Error updating lost status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;

import dbConnect from './_db.js';
import requireAuth from './_requireAuth.js';
import LostItem from '../server/models/lostItem.js';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'POST') {
    // Auth required
    const user = await requireAuth(req, res);
    if (!user) return;
    try {
      const { name, item, location, date, description, photo, contact } = req.body;
      if (!name || !item || !location || !date) {
        return res.status(400).json({ message: 'All required fields must be filled' });
      }
      const lostItem = new LostItem({ name, item, location, date, description, photo, contact, posterId: user._id });
      await lostItem.save();
      res.status(201).json({ message: 'Lost item reported successfully', lostItem });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'GET') {
    // Auth required
    const user = await requireAuth(req, res);
    if (!user) return;
    try {
      const items = await LostItem.find();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

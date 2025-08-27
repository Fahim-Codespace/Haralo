import LostItem from '../models/lostItem.js';

export const createLostItem = async (req, res) => {
  try {
    const { name, item, location, date, description, photo } = req.body;
    if (!name || !item || !location || !date) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }
    const lostItem = new LostItem({ name, item, location, date, description, photo });
    await lostItem.save();
    res.status(201).json({ message: "Lost item reported successfully", lostItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLostItems = async (req, res) => {
  try {
    const items = await LostItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

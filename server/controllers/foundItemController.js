import FoundItem from '../models/FoundItem.js';

export const createFoundItem = async (req, res) => {
  try {
    const { name, item, location, date, description, photo, contact } = req.body;
    if (!name || !item || !location || !date) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }
    const foundItem = new FoundItem({ name, item, location, date, description, photo, contact });
    await foundItem.save();
    res.status(201).json({ message: "Found item reported successfully", foundItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFoundItems = async (req, res) => {
  try {
    const items = await FoundItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

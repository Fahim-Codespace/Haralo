import Student from '../models/students.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});

export const uploadAvatar = multer({ storage }).single('avatar');

export const setAvatar = async (req, res) => {
  try {
    const { email } = req.body;
    if (!req.file || !email) {
      return res.status(400).json({ message: 'Avatar file and email required.' });
    }
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'User not found.' });
    }
    student.avatar = req.file.filename;
    await student.save();
    res.json({ avatar: student.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

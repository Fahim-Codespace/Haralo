import Student from '../models/students.js';
import multer from 'multer';
import mongoose from 'mongoose';

// Use memory storage so we can stream directly into GridFS
export const uploadAvatar = multer({ storage: multer.memoryStorage() }).single('avatar');

const getBucket = () => {
  if (!mongoose.connection || !mongoose.connection.db) {
    throw new Error('MongoDB not connected');
  }
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
};

// Handler: store the uploaded avatar into GridFS and save a retrievable URL into Student.avatar
export const setAvatarGridFS = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No avatar file provided.' });

    const studentId = req.user && req.user._id;
    if (!studentId) return res.status(401).json({ message: 'Authentication required.' });

    const bucket = getBucket();

    // Sanitize filename similar to gridfs route
    const rawFilename = `${Date.now()}-${req.file.originalname}`;
    const filename = rawFilename.replace(/[^a-zA-Z0-9.\-_%]/g, '_');

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: { originalname: req.file.originalname, contentType: req.file.mimetype, uploader: studentId }
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', async () => {
      try {
        const fileUrl = `/api/uploads/gridfs/${encodeURIComponent(filename)}`;
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'User not found.' });
        student.avatar = fileUrl;
        await student.save();
        res.json({ avatar: student.avatar });
      } catch (err) {
        console.error('Error saving student avatar after GridFS upload:', err);
        res.status(500).json({ message: 'Failed to associate avatar with user.' });
      }
    });

    uploadStream.on('error', (err) => {
      console.error('GridFS avatar upload error:', err);
      res.status(500).json({ error: 'Avatar upload failed' });
    });
  } catch (err) {
    console.error('setAvatarGridFS error:', err);
    res.status(500).json({ message: err.message });
  }
};

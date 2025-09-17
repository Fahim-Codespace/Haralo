import dbConnect from '../server/db/connect.js';
import Student from '../server/models/students.js';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    // /api/student?email=... for profile, or no query for all
    if (req.query && req.query.email) {
      // getStudentByEmail
      try {
        const { email } = req.query;
        const student = await Student.findOne({ email }).select('-password');
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } else {
      // getStudent
      try {
        const students = await Student.find();
        res.json(students);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  } else if (req.method === 'POST') {
    if (req.url.endsWith('/signup')) {
      // createStudent
      try {
        const { name, institution, email, password } = req.body;
        if (!name || !email || !password) {
          return res.status(400).json({ message: 'All required fields must be filled' });
        }
        if (!validator.isEmail(email)) {
          return res.status(400).json({ message: 'Email is not valid' });
        }
        if (!validator.isStrongPassword(password)) {
          return res.status(400).json({ message: 'Password not strong enough' });
        }
        const existing = await Student.findOne({ email });
        if (existing) {
          return res.status(400).json({ message: 'Email already registered' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const student = new Student({ name, institution, email, password: hashedPassword });
        await student.save();
        const token = createToken(student._id);
        res.status(201).json({ email, token });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } else if (req.url.endsWith('/login')) {
      // loginStudent
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ message: 'All fields are required' });
        }
        const student = await Student.findOne({ email });
        if (!student) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = createToken(student._id);
        res.status(200).json({ email, token });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

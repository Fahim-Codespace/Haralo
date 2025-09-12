import Student from '../models/students.js';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

export const getStudent = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, institution, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }
    
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }
    
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Password not strong enough" });
    }

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = new Student({ name, institution, email, password: hashedPassword });
    await student.save();

    // Create a token
    const token = createToken(student._id);

    res.status(201).json({ email, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login authentication
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    // Create a token
    const token = createToken(student._id);
    
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
};
export const getStudentByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
    }
    
    const student = await Student.findOne({ email }).select('-password'); // Exclude password
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import Student from '../models/students.js';
import bcrypt from 'bcryptjs';

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

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
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

    res.status(201).json({ message: "Signup successful", student });
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
    res.status(200).json({ message: "Login successful", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

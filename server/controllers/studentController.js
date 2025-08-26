import Student from '../models/students.js';

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

    const student = new Student({ name, institution, email, password });
    await student.save();

    res.status(201).json({ message: "Signup successful", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

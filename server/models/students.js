import mongoose from "mongoose";

const studentschema = new mongoose.Schema({
    name: { type: String, required: true },
    institution: { type: String },
    avatar: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const Student = mongoose.model('Student', studentschema);

export default Student;

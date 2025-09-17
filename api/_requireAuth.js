import jwt from 'jsonwebtoken';
import Student from '../server/models/students.js';

export default async function requireAuth(req, res) {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ error: 'Authorization token required' });
    return null;
  }
  const token = authorization.split(' ')[1];
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    const user = await Student.findOne({ _id }).select('_id');
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    res.status(401).json({ error: 'Request is not authorized' });
    return null;
  }
}

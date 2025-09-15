#!/usr/bin/env node
import dotenv from 'dotenv';
import connectDb from '../db/connect.js';
import LostItem from '../models/lostItem.js';
import Student from '../models/students.js';

dotenv.config();

const run = async () => {
  try {
    await connectDb();
    console.log('Connected to DB. Debugging lost items...');

    const docs = await LostItem.find({ posterId: { $exists: true, $ne: null } }).limit(50);
    console.log(`Found ${docs.length} lost items with posterId (showing up to 50):`);
    for (const d of docs) {
      const student = await Student.findById(d.posterId).select('name avatar email');
      console.log('LostItem', d._id.toString(), 'post.name="' + (d.name||'') + '"', 'posterId=', d.posterId ? d.posterId.toString() : null);
      if (student) {
        console.log('  => Student found:', student._id.toString(), 'name="' + (student.name||'') + '"', 'email=', student.email, 'avatar=', student.avatar);
      } else {
        console.log('  => Student NOT found for posterId');
      }
    }
    process.exit(0);
  } catch (err) {
    console.error('Debug script error', err);
    process.exit(1);
  }
};

run();

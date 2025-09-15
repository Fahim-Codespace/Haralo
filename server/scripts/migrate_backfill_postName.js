#!/usr/bin/env node
import dotenv from 'dotenv';
import connectDb from '../db/connect.js';
import FoundItem from '../models/FoundItem.js';
import LostItem from '../models/lostItem.js';
import Student from '../models/students.js';

dotenv.config();

const run = async () => {
  try {
    await connectDb();
    console.log('Connected to DB. Starting name backfill migration...');

    const updateCollection = async (Model, name) => {
      // Find posts where posterId exists
      const cursor = Model.find({ posterId: { $exists: true, $ne: null } }).cursor();
      let count = 0;
      for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        try {
          const student = await Student.findById(doc.posterId).select('name');
          if (student && student.name) {
            // Only update if missing or different
            if (!doc.name || String(doc.name).trim() !== String(student.name).trim()) {
              doc.name = student.name;
              await doc.save();
              count++;
              console.log(`${name} ${doc._id} name updated to '${student.name}'`);
            } else {
              // name already matches
            }
          } else {
            console.log(`${name} ${doc._id} has no student or student name, skipping`);
          }
        } catch (err) {
          console.error(`Failed to update ${name} ${doc._id}:`, err.message);
        }
      }
      return count;
    };

    const foundUpdated = await updateCollection(FoundItem, 'FoundItem');
    const lostUpdated = await updateCollection(LostItem, 'LostItem');

    console.log(`Migration finished. Found name-updated: ${foundUpdated}, Lost name-updated: ${lostUpdated}`);
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
};

run();

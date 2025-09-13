import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LostItem from '../models/lostItem.js';
import FoundItem from '../models/FoundItem.js';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const run = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to DB for migration');

    // Update lost items missing contact
    const lostResult = await LostItem.updateMany(
      { $or: [ { contact: { $exists: false } }, { contact: null }, { contact: '' } ] },
      { $set: { contact: 'not-provided' } }
    );
    console.log('Lost items updated:', lostResult.modifiedCount);

    // Update found items missing contact
    const foundResult = await FoundItem.updateMany(
      { $or: [ { contact: { $exists: false } }, { contact: null }, { contact: '' } ] },
      { $set: { contact: 'not-provided' } }
    );
    console.log('Found items updated:', foundResult.modifiedCount);

    await mongoose.disconnect();
    console.log('Migration complete');
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  }
};

run();

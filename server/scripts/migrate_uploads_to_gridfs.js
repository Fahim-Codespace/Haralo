import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LostItem from '../models/lostItem.js';
import FoundItem from '../models/FoundItem.js';

dotenv.config();

const uploadsDir = path.join(process.cwd(), 'server', 'uploads');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('DB connected');

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

    const files = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
    console.log('Found', files.length, 'files in uploads');

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const readStream = fs.createReadStream(filePath);
      const filename = `${Date.now()}-${file}`;

      const uploadStream = bucket.openUploadStream(filename, { metadata: { originalname: file } });
      readStream.pipe(uploadStream);

      await new Promise((resolve, reject) => {
        uploadStream.on('finish', async () => {
          const publicUrl = `/api/uploads/gridfs/${encodeURIComponent(filename)}`;
          console.log('Uploaded', file, '->', publicUrl);

          await LostItem.updateMany({ photo: file }, { $set: { photo: publicUrl } });
          await FoundItem.updateMany({ photo: file }, { $set: { photo: publicUrl } });

          // fs.unlinkSync(filePath); // optional: remove local file
          resolve();
        });
        uploadStream.on('error', reject);
      });
    }

    await mongoose.disconnect();
    console.log('Migration complete');
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  }
};

run();

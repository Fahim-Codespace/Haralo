import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const getBucket = () => {
  if (!mongoose.connection || !mongoose.connection.db) {
    throw new Error('MongoDB not connected');
  }
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
};

// Upload to GridFS
router.post('/gridfs/upload', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

  const bucket = getBucket();
  // Create a sanitized filename to avoid spaces and problematic characters in URLs
  const rawFilename = `${Date.now()}-${req.file.originalname}`;
  const filename = rawFilename.replace(/[^a-zA-Z0-9.\-_%]/g, '_');

    const uploadStream = bucket.openUploadStream(filename, {
      // store the mimetype both as a top-level contentType (driver may place it differently)
      // and inside metadata so retrieval can rely on one of these fields.
      contentType: req.file.mimetype,
      metadata: { originalname: req.file.originalname, contentType: req.file.mimetype },
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', () => {
      const fileUrl = `/api/uploads/gridfs/${encodeURIComponent(filename)}`;
      res.json({ filename, fileUrl });
    });

    uploadStream.on('error', (err) => {
      console.error('GridFS upload error:', err);
      res.status(500).json({ error: 'Upload failed' });
    });
  } catch (err) {
    console.error('GridFS handler error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Stream file from GridFS
router.get('/gridfs/:filename', async (req, res) => {
  try {
    const rawFilename = req.params.filename;
    const bucket = getBucket();

    console.log('GridFS download request for filename param:', rawFilename);

    // Try several filename variants: as received, decoded, and with spaces
    const tried = [];
    const variants = [rawFilename];
    try {
      const decoded = decodeURIComponent(rawFilename);
      if (decoded !== rawFilename) variants.push(decoded);
    } catch (e) {
      // ignore decode errors
    }
    // Replace %20 with space as an extra fallback
    variants.push(rawFilename.replace(/%20/g, ' '));

    let files = [];
    let foundVariant = null;
    for (const v of variants) {
      if (!v) continue;
      tried.push(v);
      const cursor = bucket.find({ filename: v });
      // eslint-disable-next-line no-await-in-loop
      const arr = await cursor.toArray();
      if (arr && arr.length > 0) {
        files = arr;
        foundVariant = v;
        break;
      }
    }

    if (!files || files.length === 0) {
        console.warn('GridFS not found by filename variants, attempting fallback lookups. Tried:', tried);

        // Fallback: try to extract originalname (strip leading timestamp up to first dash)
        let orig = rawFilename;
        try {
          orig = rawFilename.replace(/^\d+-/, '');
          orig = decodeURIComponent(orig);
        } catch (e) {
          // ignore
        }

        // Search by metadata.originalname exact match
        const metaCursor = bucket.find({ 'metadata.originalname': orig });
        const metaFiles = await metaCursor.toArray();
        if (metaFiles && metaFiles.length > 0) {
          files = metaFiles;
          console.log('GridFS found by metadata.originalname:', orig);
        } else {
          // As a last resort, search for files whose filename contains the original name (case-insensitive)
          const regex = new RegExp(orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
          const containCursor = bucket.find({ filename: { $regex: regex } });
          const containFiles = await containCursor.toArray();
          if (containFiles && containFiles.length > 0) {
            files = containFiles;
            console.log('GridFS found by filename contains original name:', orig);
          }
        }

        if (!files || files.length === 0) {
          console.error('GridFS download error: file not found after fallbacks. Tried:', tried, 'orig:', orig);
          return res.status(404).end();
        }
    }

    const fileDoc = files[0];
    console.log('GridFS serving file:', fileDoc.filename, 'size:', fileDoc.length, 'id:', fileDoc._id);
  // Prefer any explicit contentType stored by the driver, then metadata.contentType, otherwise default
  const contentType = fileDoc.contentType || (fileDoc.metadata && fileDoc.metadata.contentType) || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');

  // Use the filename actually found in the DB when opening the download stream
  const downloadStream = bucket.openDownloadStreamByName(fileDoc.filename);
    downloadStream.on('error', (err) => {
      console.error('GridFS download error:', err);
      res.status(404).end();
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error('GridFS download handler error:', err);
    res.status(500).end();
  }
});

export default router;

// Temporary: debug route to list recent GridFS files (remove in production)
router.get('/gridfs-list', async (req, res) => {
  try {
    const bucket = getBucket();
    const cursor = bucket.find().sort({ uploadDate: -1 }).limit(50);
  const files = await cursor.toArray();
  res.json(files.map(f => ({ filename: f.filename, contentType: f.contentType, metadata: f.metadata, id: f._id })));
  } catch (err) {
    console.error('GridFS list error', err);
    res.status(500).json({ error: 'Failed to list gridfs files' });
  }
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './db/connect.js';
import studentRoutes from './routes/route.js';
import foundRoutes from './routes/foundRoute.js';
import lostRoutes from './routes/lostRoute.js';
import gridfsRoutes from './routes/gridfs.js';

dotenv.config();
connectDb();

const app = express();
app.use(cors());
app.use(express.json()); 

app.use('/api/student', studentRoutes);
app.use('/api/report-found', foundRoutes);
app.use('/api/report-lost', lostRoutes);
app.use('/api/uploads', gridfsRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

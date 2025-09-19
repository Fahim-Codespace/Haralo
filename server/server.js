import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './db/connect.js';
import mongoose from 'mongoose';
import studentRoutes from './routes/route.js';
import foundRoutes from './routes/foundRoute.js';
import lostRoutes from './routes/lostRoute.js';
import gridfsRoutes from './routes/gridfs.js';
import avatarRoutes from './routes/avatarRoute.js';

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
app.use('/api/avatar', avatarRoutes);

// ...existing code...
app.get('/', (req, res) => {
  const state = mongoose.connection.readyState;
  const mongoStatus = state === 1 ? '✅ Connected' : state === 2 ? '🔄 Connecting' : '❌ Disconnected';
  const port = process.env.PORT || 5000;
  const env = process.env.NODE_ENV || 'development';

  res.send(`
    <html>
      <head>
        <title>Student Portal API</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>
          body { margin:0; font-family: Inter, Arial, sans-serif; background: linear-gradient(135deg,#7f7fd5 0%,#86a8e7 50%,#91eae4 100%); color:#fff; }
          .wrap { max-width:980px; margin:40px auto; padding:34px; background: rgba(255,255,255,0.06); border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.25); }
          h1 { margin:0 0 8px; font-size:34px; text-align:center; }
          .sub { text-align:center; opacity:0.95; margin-bottom:18px; }
          .card { background: rgba(0,0,0,0.06); padding:18px; border-radius:8px; margin:12px 0; }
          .ok { color:#7efc9b; font-weight:700; }
          .bad { color:#ff8b8b; font-weight:700; }
          .list { margin-top:12px; }
          .item { background: rgba(255,255,255,0.04); padding:12px; border-radius:6px; margin:8px 0; }
          code { background: rgba(0,0,0,0.12); padding:3px 6px; border-radius:4px; color:#fff; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>🎓 Student Portal API</h1>
          <div class="sub">Server is running successfully! 🚀</div>

          <div class="card">
            <div><strong>MongoDB Status:</strong> <span class="${state===1?'ok':'bad'}">${mongoStatus}</span></div>
            <div><strong>Port:</strong> <code>${port}</code></div>
            <div><strong>Environment:</strong> <code>${env}</code></div>
          </div>

          <div class="card">
            <strong>Available Endpoints:</strong>
            <div class="list">
              <div class="item"><code>POST /api/student/register</code> - Register</div>
              <div class="item"><code>POST /api/student/login</code> - Login</div>
              <div class="item"><code>GET /api/student/profile</code> - Profile</div>
              <div class="item"><code>POST /api/report-found</code> - Report found item</div>
              <div class="item"><code>POST /api/report-lost</code> - Report lost item</div>
              <div class="item"><code>GET /api/uploads/...</code> - File endpoints</div>
            </div>
          </div>

          <div style="text-align:center; margin-top:12px; opacity:0.9;">Visit the endpoints above to verify API behavior.</div>
        </div>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
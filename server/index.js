import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stats', statsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  import('mongoose').then(({ default: mongoose }) => {
    res.json({
      status: 'online',
      platform: 'CareCircle API',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected (Check IP Whitelist in MongoDB Atlas)',
      timestamp: new Date().toISOString(),
    });
  });
});

// Serve frontend in production
const clientDistPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>CareCircle API Server</title></head>
          <body style="font-family:sans-serif; text-align:center; padding: 40px; background:#f8fafc;">
            <h1 style="color:#0ea5e9;">CareCircle API is Running</h1>
            <p style="color:#64748b;">Frontend build not yet generated or running in API-only mode.</p>
            <p>API endpoints are accessible at <code>/api/...</code></p>
          </body>
        </html>
      `);
    }
  });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CareCircle Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const programRoutes = require('./routes/programRoutes');
const projectRoutes = require('./routes/projectRoutes');
const newsRoutes = require('./routes/newsRoutes');
const storyRoutes = require('./routes/storyRoutes');
const donationRoutes = require('./routes/donationRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const messageRoutes = require('./routes/messageRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const documentRoutes = require('./routes/documentRoutes');
const userRoutes = require('./routes/userRoutes');
const settingRoutes = require('./routes/settingRoutes');
const auditRoutes = require('./routes/auditRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Security & Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  process.env.CLIENT_URL,
  process.env.URL,
  process.env.DEPLOY_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:') || origin.endsWith('.netlify.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev/serverless to avoid CORS blocking
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded static files safely
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.set('trust proxy', true);

// Rate Limiter (lenient for serverless environments)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many requests, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
});

app.use('/api', apiLimiter);

// Health Check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'UP',
    system: 'Hope Somalia Foundation API',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
  });
});

// API Routes - Mounted under /api, root aliases, and .netlify/functions paths
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/.netlify/functions/api/auth', authRoutes);

app.use('/api/programs', programRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/stats', statsRoutes);

// Catch-all 404 JSON Handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.method} ${req.originalUrl} not found.`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;

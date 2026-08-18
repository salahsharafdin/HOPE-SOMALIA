const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { port } = require('./config');
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
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev to avoid CORS blocking
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Serve uploaded static files safely
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' },
});

app.use('/api', apiLimiter);

// Health Check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'UP',
    system: 'Hope Somalia Foundation API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes - Mounted under /api and root aliases where needed
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes); // Route alias for direct calls
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

app.listen(port, () => {
  console.log(`🚀 Hope Somalia Foundation API Server running on http://localhost:${port}`);
});

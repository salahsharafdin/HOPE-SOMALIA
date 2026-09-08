const { PrismaClient } = require('@prisma/client');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables across server/.env, root .env, or current directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ WARNING: DATABASE_URL environment variable is not defined!');
}

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn('⚠️ SECURITY WARNING: JWT_SECRET is not set in production! Please configure JWT_SECRET on your hosting platform.');
}

const prisma = new PrismaClient();

module.exports = {
  prisma,
  port: parseInt(process.env.PORT, 10) || 5000,
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_hope_somalia_2026',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

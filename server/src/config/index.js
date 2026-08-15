const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

module.exports = {
  prisma,
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_hope_somalia_2026',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

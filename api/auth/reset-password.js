const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

let jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_hope_somalia_2026';
try {
  const config = require('../../server/src/config');
  if (config && config.jwtSecret) {
    jwtSecret = config.jwtSecret;
  }
} catch (_) {}

const REGISTERED_ADMINS = [
  { id: 'admin-salah-1', email: 'salahsharafdin@gmail.com', fullName: 'Salah Sharafdin', role: 'SUPER_ADMIN', status: 'ACTIVE' },
  { id: 'admin-salah-2', email: 'salasharafdin@gmail.com', fullName: 'Salah Sharafdin', role: 'SUPER_ADMIN', status: 'ACTIVE' },
  { id: 'admin-1', email: 'admin@hopesomalia.org', fullName: 'Dr. Abdirahman Hassan', role: 'SUPER_ADMIN', status: 'ACTIVE' },
  { id: 'admin-2', email: 'editor@hopesomalia.org', fullName: 'Fatima Omar', role: 'CONTENT_MANAGER', status: 'ACTIVE' },
  { id: 'admin-3', email: 'finance@hopesomalia.org', fullName: 'Mohamed Jama', role: 'FINANCE_MANAGER', status: 'ACTIVE' },
];

global._serverlessChallenges = global._serverlessChallenges || new Map();

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (_) {}
    }
    const { email, token, newPassword } = body || {};

    if (!email || !token || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = null;
    try {
      const { prisma } = require('../../server/src/config');
      if (prisma && prisma.user && process.env.DATABASE_URL) {
        user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      }
    } catch (_) {}

    if (!user) {
      user = REGISTERED_ADMINS.find((u) => u.email === normalizedEmail);
    }

    if (!user || user.status !== 'ACTIVE') {
      return res.status(404).json({ success: false, message: 'Account not found or disabled.' });
    }

    // Verify token
    let isValidToken = false;

    // A. Check self-verifying HMAC token format (survives any serverless restart)
    if (token && token.includes('.')) {
      const parts = token.split('.');
      if (parts.length === 3) {
        const [randomPart, expiresAtMs, sig] = parts;
        if (Number(expiresAtMs) > Date.now()) {
          const expectedSig = crypto
            .createHmac('sha256', jwtSecret)
            .update(`${normalizedEmail}:${expiresAtMs}:${randomPart}`)
            .digest('hex');
          if (sig === expectedSig) {
            isValidToken = true;
          }
        }
      }
    }

    // B. Check in-memory or database challenge
    let challenge = global._serverlessChallenges.get(normalizedEmail) || (user.id ? global._serverlessChallenges.get(user.id) : null);
    if (!challenge && user.id) {
      try {
        const { prisma } = require('../../server/src/config');
        if (prisma && prisma.otpChallenge) {
          challenge = await prisma.otpChallenge.findUnique({ where: { userId: user.id } });
        }
      } catch (_) {}
    }

    if (!isValidToken && challenge) {
      if (new Date() <= new Date(challenge.expiresAt)) {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        if (challenge.tokenHash === tokenHash || challenge.otpHash === tokenHash) {
          isValidToken = true;
        }
      }
    }

    if (!isValidToken) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset link.' });
    }

    // Invalidate challenge
    global._serverlessChallenges.delete(normalizedEmail);
    if (user.id) {
      global._serverlessChallenges.delete(user.id);
    }

    try {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.passwordHash = passwordHash;
      const { prisma } = require('../../server/src/config');
      if (prisma && prisma.user && user.id && process.env.DATABASE_URL) {
        await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
        await prisma.otpChallenge.deleteMany({ where: { userId: user.id } });
      }
    } catch (err) {
      console.warn('Password persistence warning:', err.message);
    }

    const authToken = jwt.sign(
      { userId: user.id || 'admin-user', email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully! You are now logged in.',
      token: authToken,
      user: {
        id: user.id || 'admin-user',
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Password reset handler error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'An error occurred while updating your password.',
    });
  }
};

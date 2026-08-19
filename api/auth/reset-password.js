const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { jwtSecret } = require('../../server/src/config');

const REGISTERED_ADMINS = [
  { email: 'salahsharafdin@gmail.com', fullName: 'Salah Sharafdin', role: 'SUPER_ADMIN', status: 'ACTIVE' },
  { email: 'salasharafdin@gmail.com', fullName: 'Salah Sharafdin', role: 'SUPER_ADMIN', status: 'ACTIVE' },
  { email: 'admin@hopesomalia.org', fullName: 'Dr. Abdirahman Hassan', role: 'SUPER_ADMIN', status: 'ACTIVE' },
  { email: 'editor@hopesomalia.org', fullName: 'Fatima Omar', role: 'CONTENT_MANAGER', status: 'ACTIVE' },
  { email: 'finance@hopesomalia.org', fullName: 'Mohamed Jama', role: 'FINANCE_MANAGER', status: 'ACTIVE' },
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
      if (process.env.DATABASE_URL) {
        user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      }
    } catch (_) {}

    if (!user) {
      user = REGISTERED_ADMINS.find((u) => u.email === normalizedEmail);
    }

    if (!user || user.status !== 'ACTIVE') {
      return res.status(404).json({ success: false, message: 'Account not found or disabled.' });
    }

    // Check challenge
    let challenge = global._serverlessChallenges.get(normalizedEmail);
    if (!challenge && user.id) {
      try {
        const { prisma } = require('../../server/src/config');
        challenge = await prisma.otpChallenge.findUnique({ where: { userId: user.id } });
      } catch (_) {}
    }

    if (!challenge) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset link.' });
    }

    if (new Date() > new Date(challenge.expiresAt)) {
      return res.status(400).json({ success: false, message: 'Reset link has expired. Please request a new one.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    if (challenge.tokenHash !== tokenHash && challenge.otpHash !== tokenHash) {
      return res.status(400).json({ success: false, message: 'Invalid reset token.' });
    }

    // Invalidate challenge
    global._serverlessChallenges.delete(normalizedEmail);
    try {
      const { prisma } = require('../../server/src/config');
      if (process.env.DATABASE_URL && user.id) {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
        await prisma.otpChallenge.delete({ where: { userId: user.id } });
      }
    } catch (_) {}

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
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while updating your password.',
    });
  }
};

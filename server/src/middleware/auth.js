const jwt = require('jsonwebtoken');
const { jwtSecret, prisma } = require('../config');

const REGISTERED_ADMINS = [
  { id: 'admin-salah-1', email: 'salahsharafdin@gmail.com', fullName: 'Salah Sharafdin', role: 'SUPER_ADMIN', status: 'ACTIVE' },
  { id: 'admin-salah-2', email: 'salasharafdin@gmail.com', fullName: 'Salah Sharafdin (Alias)', role: 'SUPER_ADMIN', status: 'ACTIVE' },
  { id: 'admin-main-3', email: 'admin@hopesomalia.org', fullName: 'Dr. Abdirahman Hassan', role: 'SUPER_ADMIN', status: 'ACTIVE' },
  { id: 'admin-editor-4', email: 'editor@hopesomalia.org', fullName: 'Fatima Omar', role: 'CONTENT_MANAGER', status: 'ACTIVE' },
  { id: 'admin-finance-5', email: 'finance@hopesomalia.org', fullName: 'Mohamed Jama', role: 'FINANCE_MANAGER', status: 'ACTIVE' },
];

// Verify Bearer token or cookie
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    let user = null;

    try {
      if (prisma && prisma.user) {
        user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, email: true, fullName: true, role: true, status: true, avatar: true },
        });
      }
    } catch (_) {}

    if (!user && decoded.email) {
      user = REGISTERED_ADMINS.find((u) => u.email === decoded.email.toLowerCase().trim() || u.id === decoded.userId);
    }

    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ success: false, message: 'Invalid token or user account deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

// Check allowed roles
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    }

    // SUPER_ADMIN has full permissions across all routes
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Your role (${req.user.role}) does not have permission to access this resource.`,
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };

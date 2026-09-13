const { prisma } = require('../config');

async function createAuditLog({ user, action, resource, resourceId, details, ipAddress }) {
  try {
    if (prisma && prisma.auditLog) {
      await prisma.auditLog.create({
        data: {
          userId: user?.id || null,
          userName: user?.fullName || 'System',
          userRole: user?.role || 'SYSTEM',
          action,
          resource,
          resourceId: resourceId ? String(resourceId) : null,
          details: details ? (typeof details === 'object' ? JSON.stringify(details) : String(details)) : null,
          ipAddress: ipAddress || null,
        },
      });
    }
  } catch (error) {
    // Silently ignore if database is unavailable in serverless environment
  }
}

module.exports = { createAuditLog };

const { prisma } = require('../config');

exports.getAuditLogs = async (req, res, next) => {
  try {
    const { resource, action, search } = req.query;
    const where = {};
    if (resource) where.resource = resource;
    if (action) where.action = action;
    if (search) {
      where.OR = [
        { userName: { contains: search } },
        { action: { contains: search } },
        { details: { contains: search } },
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

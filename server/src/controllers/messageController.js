const { prisma } = require('../config');
const { messageSchema } = require('../validators');
const { createAuditLog } = require('../utils/auditLogger');

exports.sendMessage = async (req, res, next) => {
  try {
    const data = messageSchema.parse(req.body);
    const message = await prisma.contactMessage.create({ data });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to Hope Somalia Foundation. Your message has been sent.',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllMessages = async (req, res, next) => {
  try {
    const { isRead, search } = req.query;
    const where = {};
    if (isRead !== undefined) where.isRead = isRead === 'true';
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { subject: { contains: search } },
        { message: { contains: search } },
      ];
    }

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

exports.markMessageRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: isRead !== undefined ? isRead : true },
    });

    res.json({ success: true, message: 'Message updated', data: message });
  } catch (error) {
    next(error);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await prisma.contactMessage.delete({ where: { id } });

    await createAuditLog({
      user: req.user,
      action: 'DELETE_MESSAGE',
      resource: 'ContactMessage',
      resourceId: id,
      details: `Deleted contact message from ${message.email}`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};

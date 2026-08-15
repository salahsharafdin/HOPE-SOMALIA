const { prisma } = require('../config');
const { createAuditLog } = require('../utils/auditLogger');

exports.getAllDocuments = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};
    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
};

exports.createDocument = async (req, res, next) => {
  try {
    const { title, category, fileUrl, fileSize, year, description } = req.body;
    const document = await prisma.document.create({
      data: { title, category, fileUrl, fileSize, year, description },
    });

    await createAuditLog({
      user: req.user,
      action: 'CREATE_DOCUMENT',
      resource: 'Document',
      resourceId: document.id,
      details: `Added document '${document.title}' (${document.category})`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, message: 'Document added', data: document });
  } catch (error) {
    next(error);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const document = await prisma.document.delete({ where: { id } });

    await createAuditLog({
      user: req.user,
      action: 'DELETE_DOCUMENT',
      resource: 'Document',
      resourceId: id,
      details: `Deleted document '${document.title}'`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};

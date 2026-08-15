const { prisma } = require('../config');
const storageService = require('../utils/storage');
const { createAuditLog } = require('../utils/auditLogger');

exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const folder = req.body.folder || 'General';
    const savedFileInfo = await storageService.saveFile(req.file, folder);

    const media = await prisma.media.create({
      data: {
        filename: savedFileInfo.filename,
        originalName: savedFileInfo.originalName,
        mimeType: savedFileInfo.mimeType,
        size: savedFileInfo.size,
        url: savedFileInfo.url,
        folder: savedFileInfo.folder,
      },
    });

    await createAuditLog({
      user: req.user,
      action: 'UPLOAD_MEDIA',
      resource: 'Media',
      resourceId: media.id,
      details: `Uploaded media file '${media.originalName}' into folder '${media.folder}'`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, message: 'File uploaded successfully', data: media });
  } catch (error) {
    next(error);
  }
};

exports.getAllMedia = async (req, res, next) => {
  try {
    const { folder, search } = req.query;
    const where = {};
    if (folder && folder !== 'All') where.folder = folder;
    if (search) {
      where.OR = [
        { originalName: { contains: search } },
        { filename: { contains: search } },
      ];
    }

    const mediaList = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: mediaList.length, data: mediaList });
  } catch (error) {
    next(error);
  }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const media = await prisma.media.findUnique({ where: { id } });

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media file not found.' });
    }

    await storageService.deleteFile(media.url);
    await prisma.media.delete({ where: { id } });

    await createAuditLog({
      user: req.user,
      action: 'DELETE_MEDIA',
      resource: 'Media',
      resourceId: id,
      details: `Deleted media file '${media.originalName}'`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Media file deleted successfully' });
  } catch (error) {
    next(error);
  }
};

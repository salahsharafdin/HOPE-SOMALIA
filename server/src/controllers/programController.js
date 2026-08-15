const { prisma } = require('../config');
const { programSchema } = require('../validators');
const { createAuditLog } = require('../utils/auditLogger');

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

exports.getAllPrograms = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const programs = await prisma.program.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        projects: {
          select: { id: true, title: true, slug: true, status: true, featuredImage: true, progress: true },
        },
      },
    });

    res.json({ success: true, count: programs.length, data: programs });
  } catch (error) {
    next(error);
  }
};

exports.getProgramBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const program = await prisma.program.findUnique({
      where: { slug },
      include: {
        projects: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }

    res.json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
};

exports.createProgram = async (req, res, next) => {
  try {
    const data = programSchema.parse(req.body);
    const slug = generateSlug(data.title);

    const newProgram = await prisma.program.create({
      data: {
        ...data,
        slug,
      },
    });

    await createAuditLog({
      user: req.user,
      action: 'CREATE_PROGRAM',
      resource: 'Program',
      resourceId: newProgram.id,
      details: `Created program '${newProgram.title}'`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, message: 'Program created successfully', data: newProgram });
  } catch (error) {
    next(error);
  }
};

exports.updateProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = programSchema.partial().parse(req.body);

    if (data.title) {
      data.slug = generateSlug(data.title);
    }

    const updatedProgram = await prisma.program.update({
      where: { id },
      data,
    });

    await createAuditLog({
      user: req.user,
      action: 'UPDATE_PROGRAM',
      resource: 'Program',
      resourceId: updatedProgram.id,
      details: `Updated program '${updatedProgram.title}'`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Program updated successfully', data: updatedProgram });
  } catch (error) {
    next(error);
  }
};

exports.deleteProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    const program = await prisma.program.delete({ where: { id } });

    await createAuditLog({
      user: req.user,
      action: 'DELETE_PROGRAM',
      resource: 'Program',
      resourceId: id,
      details: `Deleted program '${program.title}'`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const { prisma } = require('../config');
const { projectSchema } = require('../validators');
const { createAuditLog } = require('../utils/auditLogger');

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

exports.getAllProjects = async (req, res, next) => {
  try {
    const { status, programId, isFeatured, search } = req.query;

    const where = {};
    if (status) where.status = status;
    if (programId) where.programId = programId;
    if (isFeatured === 'true') where.isFeatured = true;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { location: { contains: search } },
        { region: { contains: search } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        program: { select: { id: true, title: true, slug: true } },
        images: true,
      },
    });

    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

exports.getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        program: true,
        images: true,
      },
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const data = projectSchema.parse(req.body);
    const slug = generateSlug(data.title);

    const newProject = await prisma.project.create({
      data: {
        ...data,
        slug,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
      include: { program: true },
    });

    await createAuditLog({
      user: req.user,
      action: 'CREATE_PROJECT',
      resource: 'Project',
      resourceId: newProject.id,
      details: `Created project '${newProject.title}'`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, message: 'Project created successfully', data: newProject });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = projectSchema.partial().parse(req.body);

    if (data.title) {
      data.slug = generateSlug(data.title);
    }
    if (data.startDate !== undefined) {
      data.startDate = data.startDate ? new Date(data.startDate) : null;
    }
    if (data.endDate !== undefined) {
      data.endDate = data.endDate ? new Date(data.endDate) : null;
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data,
      include: { program: true, images: true },
    });

    await createAuditLog({
      user: req.user,
      action: 'UPDATE_PROJECT',
      resource: 'Project',
      resourceId: updatedProject.id,
      details: `Updated project '${updatedProject.title}'`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Project updated successfully', data: updatedProject });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.delete({ where: { id } });

    await createAuditLog({
      user: req.user,
      action: 'DELETE_PROJECT',
      resource: 'Project',
      resourceId: id,
      details: `Deleted project '${project.title}'`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const { prisma } = require('../config');
const { volunteerSchema } = require('../validators');
const { createAuditLog } = require('../utils/auditLogger');

exports.submitApplication = async (req, res, next) => {
  try {
    const data = volunteerSchema.parse(req.body);
    const volunteer = await prisma.volunteer.create({
      data: {
        ...data,
        status: 'Pending',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Volunteer application submitted successfully! Our team will contact you soon.',
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllVolunteers = async (req, res, next) => {
  try {
    const { status, search, availability } = req.query;
    const where = {};
    if (status) where.status = status;
    if (availability) where.availability = availability;
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { skills: { contains: search } },
        { country: { contains: search } },
      ];
    }

    const volunteers = await prisma.volunteer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: volunteers.length, data: volunteers });
  } catch (error) {
    next(error);
  }
};

exports.updateVolunteerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const volunteer = await prisma.volunteer.update({
      where: { id },
      data: { status },
    });

    await createAuditLog({
      user: req.user,
      action: 'UPDATE_VOLUNTEER_STATUS',
      resource: 'Volunteer',
      resourceId: volunteer.id,
      details: `Updated volunteer status for ${volunteer.fullName} to ${status}`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: `Volunteer status set to ${status}`, data: volunteer });
  } catch (error) {
    next(error);
  }
};

exports.deleteVolunteer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const volunteer = await prisma.volunteer.delete({ where: { id } });

    await createAuditLog({
      user: req.user,
      action: 'DELETE_VOLUNTEER',
      resource: 'Volunteer',
      resourceId: id,
      details: `Deleted volunteer application for ${volunteer.fullName}`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Volunteer application deleted' });
  } catch (error) {
    next(error);
  }
};

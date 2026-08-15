const { prisma } = require('../config');
const { storySchema } = require('../validators');
const { createAuditLog } = require('../utils/auditLogger');

exports.getAllStories = async (req, res, next) => {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { date: 'desc' },
    });
    res.json({ success: true, count: stories.length, data: stories });
  } catch (error) {
    next(error);
  }
};

exports.getStoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const story = await prisma.story.findUnique({ where: { id } });
    if (!story) return res.status(404).json({ success: false, message: 'Story not found.' });
    res.json({ success: true, data: story });
  } catch (error) {
    next(error);
  }
};

exports.createStory = async (req, res, next) => {
  try {
    const data = storySchema.parse(req.body);
    const story = await prisma.story.create({ data });

    await createAuditLog({
      user: req.user,
      action: 'CREATE_STORY',
      resource: 'Story',
      resourceId: story.id,
      details: `Created impact story for '${story.name}'`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, message: 'Story created successfully', data: story });
  } catch (error) {
    next(error);
  }
};

exports.updateStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = storySchema.partial().parse(req.body);
    const story = await prisma.story.update({ where: { id }, data });

    await createAuditLog({
      user: req.user,
      action: 'UPDATE_STORY',
      resource: 'Story',
      resourceId: story.id,
      details: `Updated impact story for '${story.name}'`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Story updated successfully', data: story });
  } catch (error) {
    next(error);
  }
};

exports.deleteStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const story = await prisma.story.delete({ where: { id } });

    await createAuditLog({
      user: req.user,
      action: 'DELETE_STORY',
      resource: 'Story',
      resourceId: id,
      details: `Deleted impact story for '${story.name}'`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    next(error);
  }
};

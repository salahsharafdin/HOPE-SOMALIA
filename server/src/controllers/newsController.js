const { prisma } = require('../config');
const { newsSchema } = require('../validators');
const { createAuditLog } = require('../utils/auditLogger');

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

exports.getAllNews = async (req, res, next) => {
  try {
    const { status, categoryId, search, tag } = req.query;

    const where = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (tag) where.tags = { contains: tag };
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const news = await prisma.news.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      include: {
        category: true,
        author: { select: { id: true, fullName: true, avatar: true } },
      },
    });

    res.json({ success: true, count: news.length, data: news });
  } catch (error) {
    next(error);
  }
};

exports.getNewsBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const article = await prisma.news.findUnique({
      where: { slug },
      include: {
        category: true,
        author: { select: { id: true, fullName: true, avatar: true } },
      },
    });

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    res.json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

exports.createNews = async (req, res, next) => {
  try {
    const data = newsSchema.parse(req.body);
    const slug = generateSlug(data.title);

    const article = await prisma.news.create({
      data: {
        ...data,
        slug,
        authorId: req.user.id,
        publishedAt: data.status === 'Published' ? new Date() : null,
      },
      include: { category: true, author: true },
    });

    await createAuditLog({
      user: req.user,
      action: 'CREATE_NEWS',
      resource: 'News',
      resourceId: article.id,
      details: `Created news article '${article.title}' (${article.status})`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, message: 'Article created successfully', data: article });
  } catch (error) {
    next(error);
  }
};

exports.updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = newsSchema.partial().parse(req.body);

    if (data.title) {
      data.slug = generateSlug(data.title);
    }
    if (data.status === 'Published') {
      data.publishedAt = new Date();
    }

    const article = await prisma.news.update({
      where: { id },
      data,
      include: { category: true, author: true },
    });

    await createAuditLog({
      user: req.user,
      action: 'UPDATE_NEWS',
      resource: 'News',
      resourceId: article.id,
      details: `Updated news article '${article.title}' (${article.status})`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Article updated successfully', data: article });
  } catch (error) {
    next(error);
  }
};

exports.deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await prisma.news.delete({ where: { id } });

    await createAuditLog({
      user: req.user,
      action: 'DELETE_NEWS',
      resource: 'News',
      resourceId: id,
      details: `Deleted news article '${article.title}'`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { articles: true } } },
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

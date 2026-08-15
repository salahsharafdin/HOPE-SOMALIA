const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', newsController.getAllNews);
router.get('/categories', newsController.getCategories);
router.get('/:slug', newsController.getNewsBySlug);

// Protected Admin Routes
router.post('/', authenticate, authorize(['SUPER_ADMIN', 'CONTENT_MANAGER', 'COMMUNICATIONS_MANAGER']), newsController.createNews);
router.put('/:id', authenticate, authorize(['SUPER_ADMIN', 'CONTENT_MANAGER', 'COMMUNICATIONS_MANAGER']), newsController.updateNews);
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN', 'CONTENT_MANAGER']), newsController.deleteNews);

module.exports = router;

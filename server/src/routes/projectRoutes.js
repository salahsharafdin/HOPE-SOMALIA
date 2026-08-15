const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', projectController.getAllProjects);
router.get('/:slug', projectController.getProjectBySlug);

// Protected Admin Routes
router.post('/', authenticate, authorize(['SUPER_ADMIN', 'PROJECT_MANAGER', 'CONTENT_MANAGER']), projectController.createProject);
router.put('/:id', authenticate, authorize(['SUPER_ADMIN', 'PROJECT_MANAGER', 'CONTENT_MANAGER']), projectController.updateProject);
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN', 'PROJECT_MANAGER']), projectController.deleteProject);

module.exports = router;

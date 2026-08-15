const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', programController.getAllPrograms);
router.get('/:slug', programController.getProgramBySlug);

// Protected Admin Routes
router.post('/', authenticate, authorize(['SUPER_ADMIN', 'CONTENT_MANAGER', 'PROJECT_MANAGER']), programController.createProgram);
router.put('/:id', authenticate, authorize(['SUPER_ADMIN', 'CONTENT_MANAGER', 'PROJECT_MANAGER']), programController.updateProgram);
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN', 'CONTENT_MANAGER']), programController.deleteProgram);

module.exports = router;

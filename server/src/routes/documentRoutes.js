const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', documentController.getAllDocuments);

// Protected Admin Routes
router.post('/', authenticate, authorize(['SUPER_ADMIN', 'FINANCE_MANAGER', 'CONTENT_MANAGER']), documentController.createDocument);
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN', 'FINANCE_MANAGER']), documentController.deleteDocument);

module.exports = router;

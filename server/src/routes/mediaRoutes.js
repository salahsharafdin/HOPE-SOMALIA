const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', authenticate, mediaController.getAllMedia);
router.post('/upload', authenticate, upload.single('file'), mediaController.uploadFile);
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN', 'CONTENT_MANAGER']), mediaController.deleteMedia);

module.exports = router;

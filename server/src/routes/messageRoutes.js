const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', messageController.sendMessage);

// Protected Admin Routes
router.get('/', authenticate, authorize(['SUPER_ADMIN', 'MODERATOR', 'COMMUNICATIONS_MANAGER']), messageController.getAllMessages);
router.patch('/:id/read', authenticate, authorize(['SUPER_ADMIN', 'MODERATOR', 'COMMUNICATIONS_MANAGER']), messageController.markMessageRead);
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN', 'MODERATOR']), messageController.deleteMessage);

module.exports = router;

const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', storyController.getAllStories);
router.get('/:id', storyController.getStoryById);

// Protected Admin Routes
router.post('/', authenticate, authorize(['SUPER_ADMIN', 'CONTENT_MANAGER', 'COMMUNICATIONS_MANAGER']), storyController.createStory);
router.put('/:id', authenticate, authorize(['SUPER_ADMIN', 'CONTENT_MANAGER', 'COMMUNICATIONS_MANAGER']), storyController.updateStory);
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN', 'CONTENT_MANAGER']), storyController.deleteStory);

module.exports = router;

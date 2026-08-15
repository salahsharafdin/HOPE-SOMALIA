const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', volunteerController.submitApplication);

// Protected Admin Routes
router.get('/', authenticate, authorize(['SUPER_ADMIN', 'MODERATOR', 'PROJECT_MANAGER']), volunteerController.getAllVolunteers);
router.patch('/:id/status', authenticate, authorize(['SUPER_ADMIN', 'MODERATOR']), volunteerController.updateVolunteerStatus);
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN', 'MODERATOR']), volunteerController.deleteVolunteer);

module.exports = router;

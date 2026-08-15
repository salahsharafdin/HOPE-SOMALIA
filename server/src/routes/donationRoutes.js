const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', donationController.createDonation);

// Protected Admin Routes
router.get('/', authenticate, authorize(['SUPER_ADMIN', 'FINANCE_MANAGER']), donationController.getAllDonations);
router.patch('/:id/status', authenticate, authorize(['SUPER_ADMIN', 'FINANCE_MANAGER']), donationController.updateDonationStatus);

module.exports = router;

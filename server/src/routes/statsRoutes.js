const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticate } = require('../middleware/auth');

router.get('/public', statsController.getPublicStats);
router.get('/admin', authenticate, statsController.getAdminDashboardStats);

module.exports = router;

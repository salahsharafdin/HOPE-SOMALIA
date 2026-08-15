const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', settingController.getSettings);
router.put('/', authenticate, authorize(['SUPER_ADMIN', 'CONTENT_MANAGER']), settingController.updateSettings);

module.exports = router;

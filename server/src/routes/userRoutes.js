const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['SUPER_ADMIN']), userController.getAllUsers);
router.post('/', authenticate, authorize(['SUPER_ADMIN']), userController.createUser);
router.put('/:id', authenticate, authorize(['SUPER_ADMIN']), userController.updateUserRole);
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN']), userController.deleteUser);

module.exports = router;

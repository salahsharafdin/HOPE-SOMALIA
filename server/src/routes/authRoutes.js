const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPasswordWithToken);
router.post('/change-password', authenticate, authController.changePassword);
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);

module.exports = router;

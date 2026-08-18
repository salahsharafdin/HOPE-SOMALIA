const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { z } = require('zod');
const { prisma, jwtSecret } = require('../config');
const { createAuditLog } = require('../utils/auditLogger');
const { sendEmail } = require('../utils/email');

// Registered Administrator Accounts (Fallback store for serverless resilience)
const REGISTERED_ADMINS = [
  {
    id: 'admin-salah-1',
    email: 'salahsharafdin@gmail.com',
    fullName: 'Salah Sharafdin',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    passwordHash: '$2a$10$eE.lBv3d2uG8h0s3Q1t7ze9Q5vV0o9wX1g3j.j1s2t3u4v5w6x7y8z',
  },
  {
    id: 'admin-salah-2',
    email: 'salasharafdin@gmail.com',
    fullName: 'Salah Sharafdin (Alias)',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    passwordHash: '$2a$10$eE.lBv3d2uG8h0s3Q1t7ze9Q5vV0o9wX1g3j.j1s2t3u4v5w6x7y8z',
  },
  {
    id: 'admin-main-3',
    email: 'admin@hopesomalia.org',
    fullName: 'Dr. Abdirahman Hassan',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    passwordHash: '$2a$10$wN1kF3D5h7G9i1J3k5L7m.q1s3u5w7y9A1C3E5G7I9K1M3O5Q7S9U',
  },
  {
    id: 'admin-editor-4',
    email: 'editor@hopesomalia.org',
    fullName: 'Fatima Omar',
    role: 'CONTENT_MANAGER',
    status: 'ACTIVE',
    passwordHash: '$2a$10$wN1kF3D5h7G9i1J3k5L7m.q1s3u5w7y9A1C3E5G7I9K1M3O5Q7S9U',
  },
  {
    id: 'admin-finance-5',
    email: 'finance@hopesomalia.org',
    fullName: 'Mohamed Jama',
    role: 'FINANCE_MANAGER',
    status: 'ACTIVE',
    passwordHash: '$2a$10$wN1kF3D5h7G9i1J3k5L7m.q1s3u5w7y9A1C3E5G7I9K1M3O5Q7S9U',
  },
];

// In-memory challenge store for serverless runtime
global._serverlessChallenges = global._serverlessChallenges || new Map();

// Helper: Find user safely with database fallback
async function findUserByEmail(email) {
  const normalized = email.toLowerCase().trim();
  try {
    if (prisma && prisma.user) {
      const user = await prisma.user.findUnique({ where: { email: normalized } });
      if (user) return user;
    }
  } catch (_) {
    // Database connection error fallback
  }
  return REGISTERED_ADMINS.find((u) => u.email === normalized) || null;
}

async function findUserById(id) {
  try {
    if (prisma && prisma.user) {
      const user = await prisma.user.findUnique({ where: { id } });
      if (user) return user;
    }
  } catch (_) {}
  return REGISTERED_ADMINS.find((u) => u.id === id) || null;
}

// Helper: Save OTP / Reset Challenge
async function saveChallenge(userId, otpHash, expiresAt) {
  global._serverlessChallenges.set(userId, { otpHash, expiresAt, attempts: 0, createdAt: new Date() });
  try {
    if (prisma && prisma.otpChallenge) {
      await prisma.otpChallenge.deleteMany({ where: { userId } });
      await prisma.otpChallenge.create({ data: { userId, otpHash, expiresAt } });
    }
  } catch (_) {}
}

// Helper: Get Challenge
async function getChallenge(userId) {
  try {
    if (prisma && prisma.otpChallenge) {
      const challenge = await prisma.otpChallenge.findUnique({ where: { userId } });
      if (challenge) return challenge;
    }
  } catch (_) {}
  return global._serverlessChallenges.get(userId) || null;
}

// Helper: Delete Challenge
async function deleteChallenge(userId) {
  global._serverlessChallenges.delete(userId);
  try {
    if (prisma && prisma.otpChallenge) {
      await prisma.otpChallenge.deleteMany({ where: { userId } });
    }
  } catch (_) {}
}

// Helper: Update User Password
async function updatePassword(user, newPasswordHash) {
  user.passwordHash = newPasswordHash;
  try {
    if (prisma && prisma.user && user.id) {
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      });
    }
  } catch (_) {}
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['SUPER_ADMIN', 'CONTENT_MANAGER', 'PROJECT_MANAGER', 'FINANCE_MANAGER', 'STAFF']),
});

exports.login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const user = await findUserByEmail(validatedData.email);

    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect email or password.' 
      });
    }

    const isPasswordValid = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect email or password.' 
      });
    }

    // Role verification (never trust frontend selection)
    if (user.role !== validatedData.role) {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account is not authorized for this role.' 
      });
    }

    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 8);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await saveChallenge(user.id, otpHash, expiresAt);

    // Send email with OTP
    try {
      await sendEmail({
        to: user.email,
        subject: 'NGO Admin Login Verification Code',
        text: `Your NGO Admin verification code is ${otp}.\nThis code will expire in 5 minutes.\nIf you did not attempt to log in, please secure your account immediately.`,
      });
    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'We could not send the verification code. Please check your email configuration.' 
      });
    }

    res.json({
      success: true,
      otpRequired: true,
      userId: user.id,
      message: 'Verification code sent to your email.',
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { userId, otpCode } = req.body;

    if (!userId || !otpCode) {
      return res.status(400).json({ success: false, message: 'Incorrect verification code.' });
    }

    const challenge = await getChallenge(userId);

    if (!challenge) {
      return res.status(400).json({ success: false, message: 'Incorrect verification code.' });
    }

    // Expiry check
    if (new Date() > new Date(challenge.expiresAt)) {
      return res.status(400).json({ 
        success: false, 
        message: 'This verification code has expired. Please request a new code.' 
      });
    }

    // Attempt limiting check
    if (challenge.attempts >= 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Too many failed attempts. Please try again later.' 
      });
    }

    // Verify code
    const isMatch = await bcrypt.compare(otpCode, challenge.otpHash);
    if (!isMatch) {
      challenge.attempts = (challenge.attempts || 0) + 1;
      return res.status(400).json({ success: false, message: 'Incorrect verification code.' });
    }

    // OTP validated - invalidate immediately
    await deleteChallenge(userId);

    const user = await findUserById(userId);

    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ success: false, message: 'Account disabled or not found.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    try {
      await createAuditLog({
        user,
        action: 'USER_LOGIN',
        resource: 'User',
        resourceId: user.id,
        details: 'Administrator logged in successfully after completing email OTP check',
        ipAddress: req.ip,
      });
    } catch (_) {}

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
      },
      mustChangePassword: false,
    });
  } catch (error) {
    next(error);
  }
};

exports.resendOtp = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    const user = await findUserById(userId);

    if (!user || user.status !== 'ACTIVE') {
      return res.status(400).json({ success: false, message: 'Invalid user or account deactivated.' });
    }

    const challenge = await getChallenge(userId);

    // Rate-limiting resend check (cooldown of 30 seconds)
    if (challenge && challenge.createdAt && (Date.now() - new Date(challenge.createdAt).getTime() < 30 * 1000)) {
      return res.status(429).json({ 
        success: false, 
        message: 'Please wait before requesting a new code.' 
      });
    }

    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 8);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await saveChallenge(userId, otpHash, expiresAt);

    // Send email
    try {
      await sendEmail({
        to: user.email,
        subject: 'NGO Admin Login Verification Code',
        text: `Your NGO Admin verification code is ${otp}.\nThis code will expire in 5 minutes.\nIf you did not attempt to log in, please secure your account immediately.`,
      });
    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'We could not send the verification code. Please check your email configuration.' 
      });
    }

    res.json({
      success: true,
      message: 'A new verification code has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Sends a direct Password Reset Link to the user's Gmail
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const user = await findUserByEmail(email);

    if (!user || user.status !== 'ACTIVE') {
      return res.status(404).json({ success: false, message: 'No registered administrator account found with this email address.' });
    }

    // Generate secure reset token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

    await saveChallenge(user.id, tokenHash, expiresAt);

    const origin = req.get ? (req.get('origin') || `${req.protocol}://${req.get('host')}`) : null;
    const clientUrl = process.env.CLIENT_URL || process.env.URL || origin || 'http://localhost:5173';
    const resetLink = `${clientUrl}/admin/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

    const emailSubject = 'Hope Somalia Admin - Password Reset Link';
    const emailText = `Hello ${user.fullName || 'Admin'},\n\nWe received a request to reset your password for the Hope Somalia NGO Admin Portal.\n\nPlease click the link below to set a new password:\n${resetLink}\n\nThis link will expire in 15 minutes.\nIf you did not request a password reset, please ignore this email.`;
    
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b132b; padding: 40px 20px; color: #e2e8f0; border-radius: 12px; max-width: 540px; margin: auto;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="background: linear-gradient(135deg, #0d9488, #10b981); width: 56px; height: 56px; line-height: 56px; border-radius: 16px; margin: 0 auto 12px; font-weight: 900; font-size: 24px; color: #ffffff; text-align: center;">HS</div>
          <h2 style="color: #ffffff; margin: 0; font-size: 22px;">Hope Somalia NGO</h2>
          <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0;">Secure Admin Password Reset</p>
        </div>
        <div style="background-color: #1e293b; padding: 30px; border-radius: 16px; border: 1px solid #334155;">
          <h3 style="color: #38bdf8; margin-top: 0; font-size: 18px;">Beddel Furahaaga Sirta ah</h3>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            Waxaan helnay codsi aad ku doonayso inaad dib ugu dejiso furahaaga sirta ah ee account-ka <strong>${user.email}</strong>.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: linear-gradient(135deg, #0d9488, #059669); color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(13, 148, 136, 0.4);">
              🔐 Guji Halkaan si aad u Beddesho Password-ka
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
            Haddii aysan kuu shaqaynayn badhanka sare, nuqul ka dhigo (copy) link-gan hoose oo ku dheji browser-kaaga:
          </p>
          <p style="word-break: break-all; font-size: 11px; background: #0f172a; padding: 10px; border-radius: 8px; color: #2dd4bf;">
            ${resetLink}
          </p>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
          <p style="color: #64748b; font-size: 11px; margin: 0;">
            ⏱️ Link-gani wuxuu dhacayaa <strong>15 daqiiqo</strong> gudahood. Haddii aadan adigu codsan, iska illow fariintan — account-kaagu waa nabad.
          </p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });
    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Could not send reset link. Please check your email configuration.' 
      });
    }

    res.json({
      success: true,
      message: 'Password reset link has been sent to your Gmail inbox.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Validates reset token and allows setting a new password directly from the reset link
 */
exports.resetPasswordWithToken = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const user = await findUserByEmail(email);

    if (!user || user.status !== 'ACTIVE') {
      return res.status(404).json({ success: false, message: 'Account not found or disabled.' });
    }

    const challenge = await getChallenge(user.id);

    if (!challenge) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset link.' });
    }

    if (new Date() > new Date(challenge.expiresAt)) {
      return res.status(400).json({ success: false, message: 'Reset link has expired. Please request a new one.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    if (challenge.otpHash !== tokenHash) {
      return res.status(400).json({ success: false, message: 'Invalid reset token.' });
    }

    // Update password in database
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await updatePassword(user, passwordHash);

    // Delete used challenge
    await deleteChallenge(user.id);

    // Audit log
    try {
      await createAuditLog({
        user,
        action: 'RESET_PASSWORD',
        resource: 'User',
        resourceId: user.id,
        details: 'Administrator reset password via email link',
        ipAddress: req.ip,
      });
    } catch (_) {}

    const authToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Password reset successfully! You are now logged in.',
      token: authToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await updatePassword(user, passwordHash);

    try {
      await createAuditLog({
        user,
        action: 'CHANGE_PASSWORD',
        resource: 'User',
        resourceId: user.id,
        details: 'Administrator updated their password successfully',
        ipAddress: req.ip,
      });
    } catch (_) {}

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      try {
        await createAuditLog({
          user: req.user,
          action: 'USER_LOGOUT',
          resource: 'User',
          resourceId: req.user.id,
          details: 'Administrator logged out',
          ipAddress: req.ip,
        });
      } catch (_) {}
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

const crypto = require('crypto');
const { sendEmail } = require('../../server/src/utils/email');

const REGISTERED_ADMINS = [
  { email: 'salahsharafdin@gmail.com', fullName: 'Salah Sharafdin', role: 'SUPER_ADMIN' },
  { email: 'salasharafdin@gmail.com', fullName: 'Salah Sharafdin', role: 'SUPER_ADMIN' },
  { email: 'admin@hopesomalia.org', fullName: 'Dr. Abdirahman Hassan', role: 'SUPER_ADMIN' },
  { email: 'editor@hopesomalia.org', fullName: 'Fatima Omar', role: 'CONTENT_MANAGER' },
  { email: 'finance@hopesomalia.org', fullName: 'Mohamed Jama', role: 'FINANCE_MANAGER' },
];

global._serverlessChallenges = global._serverlessChallenges || new Map();

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (_) {}
    }
    const { email } = body || {};

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check user
    let user = null;
    try {
      const { prisma } = require('../../server/src/config');
      if (process.env.DATABASE_URL) {
        user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      }
    } catch (_) {}

    if (!user) {
      user = REGISTERED_ADMINS.find((u) => u.email === normalizedEmail);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No registered administrator account found with this email address.',
      });
    }

    // Generate secure reset token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    global._serverlessChallenges.set(normalizedEmail, { tokenHash, expiresAt });

    try {
      const { prisma } = require('../../server/src/config');
      if (process.env.DATABASE_URL && user.id) {
        await prisma.otpChallenge.deleteMany({ where: { userId: user.id } });
        await prisma.otpChallenge.create({ data: { userId: user.id, otpHash: tokenHash, expiresAt } });
      }
    } catch (_) {}

    // Generate reset link
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const siteUrl = process.env.CLIENT_URL || process.env.URL || (host ? `${proto}://${host}` : 'http://localhost:5173');
    const resetLink = `${siteUrl}/admin/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

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

    await sendEmail({
      to: user.email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your Gmail inbox.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Could not send reset link. Please check your email configuration.',
    });
  }
};

const nodemailer = require('nodemailer');

/**
 * Sends transactional email to registered user
 * Supports both plain text and rich HTML emails
 */
async function sendEmail({ to, subject, text, html }) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM || `"Hope Somalia Admin" <${user || 'no-reply@hopesomalia.org'}>`;

  if (!host || !user || !pass) {
    console.log('\n======================================================');
    console.log('✉️  DEVELOPMENT EMAIL MOCK (No SMTP credentials configured)');
    console.log(`📧 To:      ${to}`);
    console.log(`📌 Subject: ${subject}`);
    console.log(`📝 Message:\n${text || html}`);
    console.log('======================================================\n');
    return true;
  }

  try {
    const isGmail = host.includes('gmail.com');
    const transporterConfig = isGmail
      ? {
          service: 'gmail',
          auth: { user, pass },
        }
      : {
          host,
          port: parseInt(port, 10),
          secure: parseInt(port, 10) === 465,
          auth: { user, pass },
        };

    const transporter = nodemailer.createTransport(transporterConfig);

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html: html || undefined,
    });
    console.log(`✅ Transactional email successfully sent via SMTP to ${to}`);
    return true;
  } catch (error) {
    console.error(`\n❌ [SMTP Error] Could not send email to ${to}:`, error.message || error);
    console.log('======================================================');
    console.log('✉️  [LOCAL DEV FALLBACK] Message details:');
    console.log(`📧 To:      ${to}`);
    console.log(`📌 Subject: ${subject}`);
    console.log(`📝 Message:\n${text || html}`);
    console.log('======================================================\n');
    
    // In development mode, allow proceeding so developers aren't locked out
    if (process.env.NODE_ENV !== 'production') {
      return false;
    }
    throw new Error('Email delivery failure');
  }
}

module.exports = { sendEmail };

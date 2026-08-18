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
    console.log('\n--- ✉️ DEVELOPMENT EMAIL MOCK ---');
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${text || html}`);
    console.log('--------------------------------\n');
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
    console.log(`✅ Transactional email successfully sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send email via SMTP:', error);
    throw new Error('Email delivery failure');
  }
}

module.exports = { sendEmail };

const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');

// Ensure environment variables are loaded regardless of current working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

/**
 * Creates and verifies nodemailer transport with intelligent fallbacks
 */
function createTransporters() {
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = (process.env.SMTP_USER || '').trim();
  const rawPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '';
  const pass = rawPass.replace(/\s+/g, '');
  const from = process.env.SMTP_FROM || `"Hope Somalia Admin" <${user || 'no-reply@hopesomalia.org'}>`;

  const isGmail = host.includes('gmail.com');

  const configs = [];

  if (isGmail) {
    // 1. Primary: Port 465 SSL Direct (fast timeout for serverless)
    configs.push({
      name: 'Gmail (Port 465 SSL)',
      transporter: nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 3000,
        greetingTimeout: 3000,
        socketTimeout: 4000,
      }),
    });

    // 2. Fallback: Port 587 STARTTLS
    configs.push({
      name: 'Gmail (Port 587 STARTTLS)',
      transporter: nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 3000,
        greetingTimeout: 3000,
        socketTimeout: 4000,
      }),
    });

    // 3. Fallback: Service preset
    configs.push({
      name: 'Gmail (Service Preset)',
      transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
        connectionTimeout: 3000,
        greetingTimeout: 3000,
        socketTimeout: 4000,
      }),
    });
  } else {
    // Custom SMTP
    configs.push({
      name: `Custom SMTP (${host}:${port})`,
      transporter: nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
      }),
    });
  }

  return { configs, user, pass, from, host, port };
}

/**
 * Sends transactional email to registered user
 * Supports both plain text and rich HTML emails
 */
async function sendEmail({ to, subject, text, html }) {
  const { configs, user, pass, from } = createTransporters();

  if (!user || !pass) {
    console.warn('\n⚠️ [SMTP WARNING] SMTP_USER or SMTP_PASS is missing in environment variables.');
    console.log('======================================================');
    console.log('✉️  DEVELOPMENT EMAIL MOCK');
    console.log(`📧 To:      ${to}`);
    console.log(`📌 Subject: ${subject}`);
    console.log(`📝 Message:\n${text || html}`);
    console.log('======================================================\n');
    return { success: false, simulated: true, message: 'SMTP credentials missing' };
  }

  let lastError = null;

  for (const { name, transporter } of configs) {
    try {
      console.log(`[SMTP] Attempting delivery to ${to} via ${name}...`);
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html: html || undefined,
      });

      console.log(`✅ [SMTP SUCCESS] Email delivered to ${to} via ${name} (Message ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId, method: name };
    } catch (error) {
      lastError = error;
      console.error(`❌ [SMTP Attempt Failed - ${name}]: ${error.code || ''} - ${error.message}`);
      
      // If authentication explicitly failed (invalid credentials), trying other ports will yield same result
      if (error.code === 'EAUTH' || (error.response && error.response.includes('535'))) {
        console.error(`\n🚨 [GMAIL AUTHENTICATION REJECTED]`);
        console.error(`Google rejected the credentials for account: "${user}".`);
        console.error(`Common reasons:`);
        console.error(` 1. The 16-character App Password was generated for a different Google account.`);
        console.error(` 2. 2-Step Verification is turned off on "${user}".`);
        console.error(` 3. The App Password was revoked or typed incorrectly.\n`);
        break;
      }
    }
  }

  console.log('======================================================');
  console.log('✉️  [LOCAL DEV OTP FALLBACK] Full message content:');
  console.log(`📧 To:      ${to}`);
  console.log(`📌 Subject: ${subject}`);
  console.log(`📝 Message:\n${text || html}`);
  console.log('======================================================\n');

  return { 
    success: false, 
    error: lastError ? lastError.message : 'Email delivery failed across all SMTP methods',
    code: lastError ? lastError.code : 'UNKNOWN'
  };
}

/**
 * Diagnostic helper to test SMTP connection directly
 */
async function testSmtpConnection() {
  const { configs, user, pass, host, port } = createTransporters();

  if (!user || !pass) {
    return {
      success: false,
      configured: false,
      error: 'SMTP_USER or SMTP_PASS is missing in environment variables.',
      details: { host, port, user: user || '(not set)' },
    };
  }

  const results = [];
  for (const { name, transporter } of configs) {
    try {
      await transporter.verify();
      return {
        success: true,
        configured: true,
        workingMethod: name,
        user,
        host,
      };
    } catch (err) {
      results.push({
        method: name,
        error: err.message,
        code: err.code || err.responseCode,
      });
    }
  }

  return {
    success: false,
    configured: true,
    user,
    host,
    error: results[0]?.error || 'Authentication failed',
    attempts: results,
  };
}

module.exports = { sendEmail, testSmtpConnection };

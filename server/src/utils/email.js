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
    // 1. Primary: Gmail Service preset (fastest and most reliable)
    configs.push({
      name: 'Gmail Service',
      transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
        connectionTimeout: 4000,
        greetingTimeout: 4000,
        socketTimeout: 4500,
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
        connectionTimeout: 3500,
        greetingTimeout: 3500,
        socketTimeout: 4000,
      }),
    });

    // 3. Fallback: Port 465 SSL Direct
    configs.push({
      name: 'Gmail (Port 465 SSL)',
      transporter: nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 3500,
        greetingTimeout: 3500,
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
        connectionTimeout: 2000,
        greetingTimeout: 2000,
        socketTimeout: 2500,
      }),
    });
  }

  return { configs, user, pass, from, host, port };
}

/**
 * Internal delivery attempt across configured transports
 */
async function sendEmailInternal({ to, subject, text, html }) {
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
      
      // If authentication explicitly failed or network connection timed out, stop retrying immediately
      if (
        error.code === 'EAUTH' || 
        (error.response && error.response.includes('535')) ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ENOTFOUND'
      ) {
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
 * Sends transactional email with a guaranteed 2500ms timeout
 * Prevents Vercel serverless function from ever reaching the 10-second limit
 */
async function sendEmail(options) {
  let timer = null;
  const timeoutPromise = new Promise((resolve) => {
    timer = setTimeout(() => {
      console.warn('⚠️ [SMTP TIMEOUT] Email delivery took > 5.5s. Aborting early to avoid serverless timeout.');
      resolve({ success: false, simulated: true, message: 'SMTP operation timed out' });
    }, 5500);
  });

  try {
    const result = await Promise.race([sendEmailInternal(options), timeoutPromise]);
    return result;
  } finally {
    if (timer) clearTimeout(timer);
  }
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

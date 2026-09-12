const authController = require('../../server/src/controllers/authController');

module.exports = async (req, res) => {
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
    req.body = body;

    return new Promise((resolve) => {
      authController.login(req, res, (err) => {
        if (err && !res.headersSent) {
          console.error('Login error in serverless function:', err);
          const statusCode = err.statusCode || (err.name === 'ZodError' ? 400 : 400);
          const message = err.name === 'ZodError'
            ? 'Please provide a valid email and password'
            : (typeof err === 'string' ? err : (err.message || 'Incorrect email or password.'));
          res.status(statusCode).json({
            success: false,
            message,
          });
        }
        resolve();
      });
    });
  } catch (error) {
    console.error('Login handler catch:', error);
    if (!res.headersSent) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Incorrect email or password.',
      });
    }
  }
};

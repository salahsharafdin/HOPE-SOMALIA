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

    await authController.login(req, res, (err) => {
      if (err) {
        console.error('Login error in serverless function:', err);
        return res.status(err.statusCode || 400).json({
          success: false,
          message: err.message || 'Incorrect email or password.',
        });
      }
    });
  } catch (error) {
    console.error('Login handler catch:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Incorrect email or password.',
    });
  }
};

const authController = require('../../server/src/controllers/authController');
const { authenticate } = require('../../server/src/middleware/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  authenticate(req, res, () => {
    authController.getMe(req, res, (err) => {
      if (err) {
        return res.status(err.statusCode || 401).json({ success: false, message: err.message });
      }
    });
  });
};

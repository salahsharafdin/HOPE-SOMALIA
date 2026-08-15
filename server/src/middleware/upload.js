const multer = require('multer');

// Configure memory storage for disk or cloud adapter processing
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow safe image, document, and PDF formats
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Security Error: Invalid file type. Only JPEG, PNG, WEBP, GIF, and PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum file size limit
  },
  fileFilter,
});

module.exports = upload;

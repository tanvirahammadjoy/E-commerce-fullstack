const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, '..', '..', 'public/temp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Function to sanitize the original file name
const sanitizeFileName = (filename) => {
  return filename.replace(/[^a-zA-Z0-9]/g, '_');
};

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const originalName = path.basename(file.originalname, fileExtension);
    const sanitizedOriginalName = sanitizeFileName(originalName);
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const uniqueIdentifier = crypto.randomBytes(4).toString('hex');
    const newFilename = `${sanitizedOriginalName}-${timestamp}-${uniqueIdentifier}${fileExtension}`;
    cb(null, newFilename);
  },
});

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
};

// Initialize multer with the storage and file filter configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // Example: limit file size to 20MB
});

module.exports = upload;

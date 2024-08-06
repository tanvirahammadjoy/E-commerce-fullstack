const express = require('express');
const {
  register,
  login,
  logout,
  refreshToken,
  uploadAvatar,
  deleteAvatar,
  updateCoverImage,
  changePassword,
  updateAccountDetails,
  getUserProfile,
} = require('../controllers/users.controller');
const {
  userValidationRules,
  passwordChangeValidationRules,
  validate,
  userUpdateValidationRules,
} = require('../utils/validationUtil');
const asyncHandler = require('../utils/asyncHandler');
const { authenticateToken } = require('../utils/tokenUtil');
const upload = require('../middlewares/multer.middlware');

const router = express.Router();

// User registration route
router.post(
  '/register',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  userValidationRules(),
  validate,
  asyncHandler(register)
);

// User login route
router.post('/login', asyncHandler(login));

// User logout route
router.post('/logout', asyncHandler(logout));

// Refresh token route
router.post('/refresh-token', asyncHandler(refreshToken));

// Upload avatar route
router.post(
  '/upload-avatar',
  authenticateToken,
  upload.single('avatar'),
  asyncHandler(uploadAvatar)
);

// Delete avatar route
router.delete('/delete-avatar', authenticateToken, asyncHandler(deleteAvatar));

// Update cover image route
router.post(
  '/update-cover-image',
  authenticateToken,
  upload.single('coverImage'),
  asyncHandler(updateCoverImage)
);

// Change password route
router.post(
  '/change-password',
  authenticateToken,
  passwordChangeValidationRules(),
  validate,
  asyncHandler(changePassword)
);

// Update user account details route
router.put(
  '/update-account',
  authenticateToken,
  userUpdateValidationRules(),
  validate,
  asyncHandler(updateAccountDetails)
);

// Get user profile route
router.get('/profile', authenticateToken, asyncHandler(getUserProfile));

module.exports = router;

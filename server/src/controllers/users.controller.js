const fs = require('fs');
const User = require('../models/users.models');
const cloudinary = require('../utils/cloudinary');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  invalidateToken,
} = require('../utils/tokenUtil');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const option = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

exports.register = asyncHandler(async (req, res, next) => {
  const { fullName, username, email, password } = req.body;
  const avatarFile = req.files?.avatar ? req.files.avatar[0] : null;
  const coverImageFile = req.files?.coverImage ? req.files.coverImage[0] : null;

  console.log('req.body:', req.body);
  console.log('avatarFile:', avatarFile);
  console.log('coverImageFile:', coverImageFile);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(ApiError.badRequest('Email already in use'));
    }

    let avatarUrl = '';
    let coverImageUrl = '';

    try {
      if (avatarFile) {
        const avatarUploadResult = await cloudinary.uploader.upload(
          avatarFile.path,
          { folder: 'avatars' }
        );
        avatarUrl = avatarUploadResult.secure_url;
        fs.unlinkSync(avatarFile.path);
      }

      if (coverImageFile) {
        const coverImageUploadResult = await cloudinary.uploader.upload(
          coverImageFile.path,
          { folder: 'coverImages' }
        );
        coverImageUrl = coverImageUploadResult.secure_url;
        fs.unlinkSync(coverImageFile.path);
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return next(
        ApiError.internalServerError('Failed to upload images to Cloudinary')
      );
    }

    const newUser = new User({
      fullName,
      username,
      email,
      password,
      avatar: avatarUrl,
      coverImage: coverImageUrl,
    });

    await newUser.save();
    console.log('User saved successfully:', newUser);

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    console.log('Response sent:', {
      message: 'User registered successfully',
      user: newUser,
      accessToken,
      refreshToken,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Error saving user:', error);
    return next(ApiError.internalServerError('Failed to register user'));
  }
});

// Login controller
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return next(ApiError.unauthorized('Invalid email or password'));
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  console.log('Generated Access Token:', accessToken);
  console.log('Generated Refresh Token:', refreshToken);

  res.cookie('accessToken', accessToken, option);
  res.cookie('refreshToken', refreshToken, option);

  new ApiResponse(
    200,
    { user, accessToken, refreshToken },
    'Login successful'
  ).send(res);
});

// Logout controller
exports.logout = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(ApiError.badRequest('Refresh token is required'));
  }

  const user = await User.findByRefreshToken(refreshToken);
  if (!user) {
    return next(ApiError.unauthorized('Invalid refresh token'));
  }

  user.refreshToken = null;
  await user.save();

  invalidateToken(refreshToken);

  res.clearCookie('accessToken', option);
  res.clearCookie('refreshToken', option);

  new ApiResponse(200, null, 'Logged out successfully').send(res);
});

// Refresh token controller
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    return next(ApiError.unauthorized('Invalid refresh token'));
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie('accessToken', newAccessToken, option);
  res.cookie('refreshToken', newRefreshToken, option);

  new ApiResponse(
    200,
    { accessToken: newAccessToken, refreshToken: newRefreshToken },
    'Token refreshed successfully'
  ).send(res);
});

// Upload avatar controller
exports.uploadAvatar = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const file = req.file;

  if (!file) {
    return next(ApiError.badRequest('No file uploaded'));
  }

  const user = await User.findById(userId);

  if (user.avatar) {
    const publicId = user.avatar.split('/').slice(-2).join('/').split('.')[0];
    console.log(`Deleting old avatar with public ID: ${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Deletion result:', result);
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'avatars',
    });
    user.avatar = uploadResult.secure_url;
    await user.save();

    fs.unlinkSync(file.path); // Remove the file from local storage

    new ApiResponse(200, { user }, 'Avatar uploaded successfully').send(res);
  } catch (error) {
    return next(ApiError.internal('Failed to upload avatar to Cloudinary'));
  }
});

// Delete avatar controller
exports.deleteAvatar = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user.avatar) {
    return next(ApiError.badRequest('No avatar to delete'));
  }

  try {
    const publicId = user.avatar.split('/').slice(-2).join('/').split('.')[0];
    console.log(`Deleting avatar with public ID: ${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Deletion result:', result);

    user.avatar = '';
    await user.save();

    new ApiResponse(200, { user }, 'Avatar deleted successfully').send(res);
  } catch (error) {
    return next(ApiError.internal('Failed to delete avatar from Cloudinary'));
  }
});

// Update cover image controller
exports.updateCoverImage = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const file = req.file;

  if (!file) {
    return next(ApiError.badRequest('No file uploaded'));
  }

  const user = await User.findById(userId);

  if (user.coverImage) {
    const publicId = user.coverImage
      .split('/')
      .slice(-2)
      .join('/')
      .split('.')[0];
    console.log(`Deleting old cover image with public ID: ${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Deletion result:', result);
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'coverImages',
    });
    user.coverImage = uploadResult.secure_url;
    await user.save();

    fs.unlinkSync(file.path); // Remove the file from local storage

    new ApiResponse(200, { user }, 'Cover image updated successfully').send(
      res
    );
  } catch (error) {
    return next(
      ApiError.internal('Failed to upload cover image to Cloudinary')
    );
  }
});

// Change password controller
exports.changePassword = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(userId);
  if (!user || !(await user.comparePassword(currentPassword))) {
    return next(ApiError.unauthorized('Current password is incorrect'));
  }

  if (newPassword !== confirmPassword) {
    return next(
      ApiError.badRequest('Password confirmation does not match new password')
    );
  }

  user.password = newPassword;
  await user.save();

  new ApiResponse(200, null, 'Password changed successfully').send(res);
});

exports.updateAccountDetails = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { fullName, username, email } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(ApiError.notFound('User not found'));
    }

    const errors = [];

    // Check if the new email or username is already in use by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        errors.push({ param: 'email', msg: 'Email is already in use' });
      } else {
        user.email = email;
      }
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        errors.push({ param: 'username', msg: 'Username is already in use' });
      } else {
        user.username = username;
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Failed to update account details',
        errors: errors,
      });
    }

    if (fullName) user.fullName = fullName;

    await user.save();

    new ApiResponse(200, { user }, 'Account details updated successfully').send(
      res
    );
  } catch (error) {
    console.error('Failed to update account details:', error); // Log the error for debugging
    next(ApiError.internalServerError('Failed to update account details'));
  }
});

// Get user profile controller
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) {
    return next(ApiError.notFound('User not found'));
  }

  new ApiResponse(200, { user }, 'User profile fetched successfully').send(res);
});

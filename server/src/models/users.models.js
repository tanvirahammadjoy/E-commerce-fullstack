//users.models.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/tokenUtil');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true, // Add index for uniqueness
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true, // Add index for uniqueness
    },
    avatar: {
      type: String, // get the text url from cloudinary
    },
    coverImage: {
      type: String, // get the text url from cloudinary
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving the user model
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare the provided password with the hashed password in the database
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate access and refresh tokens for the user and save the refresh token
userSchema.methods.generateAuthTokens = async function () {
  const accessToken = generateAccessToken(this);
  const refreshToken = generateRefreshToken(this);
  this.refreshToken = refreshToken;
  await this.save();
  return { accessToken, refreshToken };
};

userSchema.statics.findByRefreshToken = async function (refreshToken) {
  return this.findOne({ refreshToken });
};

const User = mongoose.model('User', userSchema);

module.exports = User;

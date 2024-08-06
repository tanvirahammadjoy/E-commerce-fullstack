const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
require('dotenv').config();

const tokenCache = new NodeCache({ stdTTL: 0 }); // Token cache without expiration by default

/**
 * Generates an access token.
 * @param {Object} user - User information to encode in the JWT.
 * @param {string} [expiresIn='1d'] - Token expiration time (default is 1 day).
 * @returns {string} The generated access token.
 */
const generateAccessToken = (user, expiresIn = '1d') => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error(
      'JWT_ACCESS_SECRET is not defined in environment variables'
    );
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn }
  );
};

/**
 * Generates a refresh token.
 * @param {Object} user - User information to encode in the JWT.
 * @param {string} [expiresIn='7d'] - Token expiration time (default is 7 days).
 * @returns {string} The generated refresh token.
 */
const generateRefreshToken = (user, expiresIn = '7d') => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error(
      'JWT_REFRESH_SECRET is not defined in environment variables'
    );
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn }
  );
};

/**
 * Verifies an access token.
 * @param {string} token - The JWT token to verify.
 * @returns {Object} The decoded payload if the token is valid.
 * @throws {Error} If the token is invalid or verification fails.
 */
const verifyAccessToken = (token) => {
  if (tokenCache.has(token)) {
    throw new Error('Token has been invalidated');
  }
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

/**
 * Verifies a refresh token.
 * @param {string} token - The JWT token to verify.
 * @returns {Object} The decoded payload if the token is valid.
 * @throws {Error} If the token is invalid or verification fails.
 */
const verifyRefreshToken = (token) => {
  if (tokenCache.has(token)) {
    throw new Error('Token has been invalidated');
  }
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

/**
 * Middleware to authenticate an access token in the request headers.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: 'fail', message: 'Access denied. No token provided.' });
  }
  try {
    req.user = verifyAccessToken(token);
    console.log('Authenticated user:', req.user); // Log user info
    next();
  } catch (error) {
    res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }
};

/**
 * Invalidates a token by adding it to the cache.
 * @param {string} token - The JWT token to invalidate.
 */
const invalidateToken = (token) => {
  if (!token) {
    throw new Error('Invalid token: Token is undefined');
  }
  tokenCache.set(token, true);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  authenticateToken,
  invalidateToken,
};

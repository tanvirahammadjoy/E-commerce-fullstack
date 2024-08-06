const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
require('dotenv').config();

const tokenCache = new NodeCache({ stdTTL: 0 }); // Token cache without expiration by default

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

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: 'fail', message: 'Access denied. No token provided.' });
  }
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }
};

module.exports = {
  authenticateToken,
  verifyAccessToken,
};

// server/src/db/connection.js
const mongoose = require('mongoose');
const dbConfig = require('../configs/db.config');

const connectDB = async () => {
  try {
    await mongoose.connect(dbConfig.uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

// server/src/configs/db.config.js
require('dotenv').config();

const dbConfig = {
  uri: process.env.MONGO_URI,
};

module.exports = dbConfig;


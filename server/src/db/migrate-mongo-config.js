// server/src/db/migrate-mongo-config.js
require('dotenv').config();

module.exports = {
  mongodb: {
    url: process.env.MONGO_URI,
    databaseName: 'yourdbname',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'server/src/db/migrations',
  changelogCollectionName: 'changelog',
};

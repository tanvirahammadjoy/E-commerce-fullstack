// server/src/db/seed.js
const mongoose = require('mongoose');
const dbConfig = require('../configs/db.config');
const userSeeder = require('./seeders/user.seeder');
// Add more seeders as needed

const connectDB = async () => {
  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    console.log('MongoDB connected successfully for seeding');

    await userSeeder(); // Run the user seeder
    // Add more seeder functions as needed

    console.log('Database seeding completed');
    mongoose.connection.close();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

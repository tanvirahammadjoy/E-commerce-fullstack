// server/src/db/seeders/user.seeder.js
const User = require('../../models/user.model');

const userSeeder = async () => {
  const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
    // Add more users as needed
  ];

  for (let userData of users) {
    const user = new User(userData);
    await user.save();
  }
  console.log('Users seeding completed');
};

module.exports = userSeeder;

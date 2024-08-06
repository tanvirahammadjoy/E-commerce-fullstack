// server/src/db/migrations/20210728123456-add-example-field.js
module.exports = {
  async up(db, client) {
    // Add a new field 'exampleField' to the 'users' collection
    await db
      .collection('users')
      .updateMany({}, { $set: { exampleField: 'defaultValue' } });
  },

  async down(db, client) {
    // Remove the 'exampleField' from the 'users' collection
    await db
      .collection('users')
      .updateMany({}, { $unset: { exampleField: '' } });
  },
};

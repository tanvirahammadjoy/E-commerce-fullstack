const app = require('./app');
const connectDB = require('./db/connection');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1); // Exit process with failure
  }
};

startServer();

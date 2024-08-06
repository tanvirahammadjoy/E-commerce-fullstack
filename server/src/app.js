const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/users.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const errorHandler = require('./middlewares/errorHandler');
const commentRoutes = require('./routes/comment.routes');
const likeRoutes = require('./routes/like.routes');
const rateRoutes = require('./routes/rate.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const orderRoutes = require('./routes/order.routes');
const cors = require('cors');
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Middleware to parse JSON bodies with increased limit
app.use(express.json({ limit: '20mb' }));
// Middleware to parse URL-encoded bodies (form-data) with increased limit
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/ratings', rateRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;

// src/routes/cart.routes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticateToken } = require('../middlewares/authenticateToken');

router.post('/add', authenticateToken, cartController.addToCart);
router.get('/', authenticateToken, cartController.getCart);
router.delete('/remove/:productId', authenticateToken, cartController.removeFromCart); // Changed to DELETE and added productId as a param
router.put('/update/:productId', authenticateToken, cartController.updateCart); // Changed to PUT and added productId as a param


module.exports = router;

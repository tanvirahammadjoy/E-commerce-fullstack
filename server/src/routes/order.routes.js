const express = require('express');
const {
  createOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrdersByUser,
} = require('../controllers/order.controller');
const { authenticateToken } = require('../middlewares/authenticateToken');
const router = express.Router();

router.post('/', authenticateToken, createOrder);
router.get('/:id', authenticateToken, getOrderById);
router.put('/:id', authenticateToken, updateOrderStatus);
router.delete('/:id', authenticateToken, deleteOrder);
router.get('/user/:userId', authenticateToken, getOrdersByUser);

module.exports = router;

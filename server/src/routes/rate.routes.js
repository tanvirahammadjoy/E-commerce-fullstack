const express = require('express');
const {
  addRating,
  getRatingsByProduct,
} = require('../controllers/rate.controllers');
const { authenticateToken } = require('../middlewares/authenticateToken');

const router = express.Router();

router.post('/', authenticateToken, addRating);
router.get('/:productId', getRatingsByProduct);

module.exports = router;

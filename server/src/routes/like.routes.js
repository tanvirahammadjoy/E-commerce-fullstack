const express = require('express');
const {
  likeProduct,
  unlikeProduct,
  getLikesByProduct,
} = require('../controllers/like.controller');
const { authenticateToken } = require('../middlewares/authenticateToken');

const router = express.Router();

router.post('/:productId', authenticateToken, likeProduct);
router.delete('/:productId', authenticateToken, unlikeProduct);
router.get('/:productId', getLikesByProduct);

module.exports = router;

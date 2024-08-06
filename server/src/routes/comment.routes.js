const express = require('express');
const {
  createComment,
  getCommentsByProduct,
  deleteComment,
} = require('../controllers/comment.controller');
const { authenticateToken } = require('../middlewares/authenticateToken');

const router = express.Router();

router.post('/', authenticateToken, createComment);
router.get('/:productId', getCommentsByProduct);
router.delete('/:commentId', authenticateToken, deleteComment);

module.exports = router;

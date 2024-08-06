const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const asyncHandler = require('../utils/asyncHandler');
const { authenticateToken } = require('../middlewares/authenticateToken');
const upload = require('../middlewares/multer.middlware');

const router = express.Router();

// Create a new product
router.post(
  '/',
  authenticateToken,
  upload.single('image'),
  asyncHandler(createProduct)
);

// Get all products
router.get('/', asyncHandler(getProducts));

// Get a product by ID
router.get('/:id', asyncHandler(getProductById));

// Update a product
router.put(
  '/:id',
  authenticateToken,
  upload.single('image'),
  asyncHandler(updateProduct)
);

// Delete a product
router.delete('/:id', authenticateToken, asyncHandler(deleteProduct));

module.exports = router;

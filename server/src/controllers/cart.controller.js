const Cart = require('../models/cart.models');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

// Add product to cart
exports.addToCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  // Validate productId and quantity
  if (!productId || !quantity) {
    return next(ApiError.badRequest('Product ID and quantity are required'));
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, products: [] });
  }

  const productIndex = cart.products.findIndex(
    (p) => p.product.toString() === productId
  );

  if (productIndex !== -1) {
    cart.products[productIndex].quantity += quantity;
  } else {
    cart.products.push({ product: productId, quantity });
  }

  await cart.save();
  new ApiResponse(200, cart, 'Product added to cart successfully').send(res);
});

// Get user's cart
exports.getCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId }).populate(
    'products.product'
  );

  if (!cart) {
    return next(ApiError.notFound('Cart not found'));
  }

  new ApiResponse(200, cart, 'Cart retrieved successfully').send(res);
});

// Update product quantity in cart
exports.updateCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { productId } = req.params; // Use req.params
  const { action } = req.body; // Assuming you send 'increase' or 'decrease'

  console.log(
    `UpdateCart - userId: ${userId}, productId: ${productId}, action: ${action}`
  );

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    console.log('Cart not found');
    return next(ApiError.notFound('Cart not found'));
  }

  console.log(
    'Cart products:',
    cart.products.map((p) => p.product.toString())
  );

  const productIndex = cart.products.findIndex(
    (p) => p.product.toString() === productId
  );

  if (productIndex === -1) {
    console.log(`Product with id ${productId} not found in cart`);
    return next(ApiError.notFound('Product not found in cart'));
  }

  if (action === 'increase') {
    cart.products[productIndex].quantity += 1;
  } else if (
    action === 'decrease' &&
    cart.products[productIndex].quantity > 1
  ) {
    cart.products[productIndex].quantity -= 1;
  }

  await cart.save();
  new ApiResponse(200, cart, 'Cart updated successfully').send(res);
});

// Remove product from cart
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { productId } = req.params;

  console.log(`RemoveFromCart - userId: ${userId}, productId: ${productId}`);

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    console.log('Cart not found');
    return next(ApiError.notFound('Cart not found'));
  }

  console.log(
    'Cart products:',
    cart.products.map((p) => p.product.toString())
  );

  const initialProductCount = cart.products.length;
  cart.products = cart.products.filter(
    (p) => p.product.toString() !== productId
  );

  if (cart.products.length === initialProductCount) {
    console.log(`Product with id ${productId} not found in cart`);
    return next(ApiError.notFound('Product not found in cart'));
  }

  await cart.save();
  new ApiResponse(200, cart, 'Product removed from cart successfully').send(res);
});

// Update product quantity in cart
exports.updateCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { productId } = req.params; // Use req.params
  const { action } = req.body; // Assuming you send 'increase' or 'decrease'

  const cart = await Cart.findOne({ user: userId });
  const productIndex = cart.products.findIndex(
    (p) => p.product.toString() === productId
  );

  if (productIndex === -1) {
    return next(ApiError.notFound('Product not found in cart'));
  }

  if (action === 'increase') {
    cart.products[productIndex].quantity += 1;
  } else if (
    action === 'decrease' &&
    cart.products[productIndex].quantity > 1
  ) {
    cart.products[productIndex].quantity -= 1;
  }

  await cart.save();
  new ApiResponse(200, cart, 'Cart updated successfully').send(res);
});

const Order = require('../models/order.models');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Create a new order
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { products, totalAmount, address, paymentMethod } = req.body;
  const userId = req.user.id;

  const newOrder = new Order({
    user: userId,
    products,
    totalAmount,
    address,
    paymentMethod,
  });

  await newOrder.save();

  new ApiResponse(201, { order: newOrder }, 'Order created successfully').send(
    res
  );
});

// Get an order by ID
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate('user')
    .populate('products.product');

  if (!order) {
    return next(ApiError.notFound('Order not found'));
  }

  new ApiResponse(200, { order }, 'Order retrieved successfully').send(res);
});

// Update an order status
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updatedOrder) {
    return next(ApiError.notFound('Order not found'));
  }

  new ApiResponse(
    200,
    { order: updatedOrder },
    'Order status updated successfully'
  ).send(res);
});

// Delete an order
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(ApiError.notFound('Order not found'));
  }

  await Order.findByIdAndDelete(id);

  new ApiResponse(200, null, 'Order deleted successfully').send(res);
});

// Get all orders for a user
exports.getOrdersByUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const orders = await Order.find({ user: userId }).populate(
    'products.product'
  );

  new ApiResponse(200, { orders }, 'Orders retrieved successfully').send(res);
});

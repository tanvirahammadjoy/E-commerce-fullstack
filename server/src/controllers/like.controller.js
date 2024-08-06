const Like = require('../models/like.models');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Like a product
exports.likeProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user.id;

  const existingLike = await Like.findOne({ user: userId, product: productId });

  if (existingLike) {
    return next(ApiError.badRequest('You already liked this product'));
  }

  const like = new Like({
    user: userId,
    product: productId,
  });

  await like.save();

  new ApiResponse(201, { like }, 'Product liked successfully').send(res);
});

// Unlike a product
exports.unlikeProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user.id;

  const like = await Like.findOne({ user: userId, product: productId });

  if (!like) {
    return next(ApiError.notFound('Like not found'));
  }

  await like.deleteOne();

  new ApiResponse(200, null, 'Product unliked successfully').send(res);
});

// Get all likes for a product
exports.getLikesByProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const likes = await Like.find({ product: productId }).populate(
    'user',
    'username'
  );

  new ApiResponse(200, { likes }, 'Likes fetched successfully').send(res);
});

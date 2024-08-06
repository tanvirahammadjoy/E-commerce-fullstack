const Rate = require('../models/rate.models');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Add a rating to a product
exports.addRating = asyncHandler(async (req, res, next) => {
  const { productId, rating } = req.body;
  const userId = req.user.id;

  const existingRate = await Rate.findOne({ user: userId, product: productId });

  if (existingRate) {
    existingRate.rating = rating;
    await existingRate.save();
  } else {
    const rate = new Rate({
      user: userId,
      product: productId,
      rating,
    });

    await rate.save();
  }

  new ApiResponse(201, { rating }, 'Rating added/updated successfully').send(
    res
  );
});

// Get ratings for a product
exports.getRatingsByProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const ratings = await Rate.find({ product: productId }).populate(
    'user',
    'username'
  );

  new ApiResponse(200, { ratings }, 'Ratings fetched successfully').send(res);
});

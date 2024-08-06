const Product = require('../models/product.models');
const Comment = require('../models/comment.models');
const Rate = require('../models/rate.models');
const Like = require('../models/like.models');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const productCount = await Product.countDocuments();
  const commentCount = await Comment.countDocuments();
  const rateCount = await Rate.countDocuments();
  const likeCount = await Like.countDocuments();

  const stats = {
    productCount,
    commentCount,
    rateCount,
    likeCount,
  };

  new ApiResponse(200, stats, 'Dashboard stats fetched successfully').send(res);
});

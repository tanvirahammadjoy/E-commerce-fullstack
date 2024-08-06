const Comment = require('../models/comment.models');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Create a new comment
exports.createComment = asyncHandler(async (req, res, next) => {
  const { product, content, rating } = req.body;
  const userId = req.user.id;

  const comment = new Comment({
    user: userId,
    product,
    content,
    rating,
  });

  await comment.save();

  new ApiResponse(201, { comment }, 'Comment created successfully').send(res);
});

// Get all comments for a product
exports.getCommentsByProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const comments = await Comment.find({ product: productId }).populate(
    'user',
    'username'
  );

  new ApiResponse(200, { comments }, 'Comments fetched successfully').send(res);
});

// Delete a comment
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(ApiError.notFound('Comment not found'));
  }

  if (comment.user.toString() !== userId) {
    return next(
      ApiError.unauthorized('You are not authorized to delete this comment')
    );
  }

  await Comment.findByIdAndDelete(commentId);

  new ApiResponse(200, null, 'Comment deleted successfully').send(res);
});

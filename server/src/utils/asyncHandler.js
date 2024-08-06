const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      console.error('Async Error:', err); // Optional: Log the error
      next(err);
    });
  };
};

module.exports = asyncHandler;

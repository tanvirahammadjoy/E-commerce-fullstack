const ApiError = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }

  console.error('Unexpected Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};

module.exports = errorHandler;

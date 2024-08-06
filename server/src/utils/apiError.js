class ApiError extends Error {
  constructor({
    statusCode,
    message = 'Something went wrong',
    stack = '',
    errors = [],
    isOperational = true,
    data = null,
  }) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.isOperational = isOperational;
    this.data = data;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError({ statusCode: 400, message, errors });
  }

  static unauthorized(message = 'Unauthorized', errors = []) {
    return new ApiError({ statusCode: 401, message, errors });
  }

  static forbidden(message = 'Forbidden', errors = []) {
    return new ApiError({ statusCode: 403, message, errors });
  }

  static notFound(message = 'Not Found', errors = []) {
    return new ApiError({ statusCode: 404, message, errors });
  }

  static internalServerError(message = 'Internal Server Error', errors = []) {
    return new ApiError({ statusCode: 500, message, errors });
  }
}

module.exports = ApiError;

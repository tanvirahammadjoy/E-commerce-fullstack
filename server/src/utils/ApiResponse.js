class ApiResponse {
  constructor(statusCode, data = {}, message = 'Success', meta = {}) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.meta = meta;
  }

  send(res) {
    return res.status(this.statusCode).json({
      status: this.success ? 'success' : 'error',
      message: this.message,
      data: this.data,
      meta: this.meta,
    });
  }
}
module.exports = ApiResponse;

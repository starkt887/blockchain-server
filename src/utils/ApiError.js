class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong!!",
    data,
    errors = [],
    stack = ""
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError
class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong!!", data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

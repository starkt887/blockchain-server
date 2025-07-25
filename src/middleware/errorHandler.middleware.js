export const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  const statusCode =
    err.statusCode && err.statusCode !== 200 ? err.statusCode : 500;
  //   console.log(res);
  res.status(statusCode).json({
    statusCode: statusCode,
    message:
      err.message && err.message.length < 100
        ? err.message
        : "Something went wrong!",
    errors: err.errors,
    success: err.success,
  });
  next();
};

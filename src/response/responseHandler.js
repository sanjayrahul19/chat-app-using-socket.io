export const responseHandler = (res, statusCode, message, status, data) => {
  res.status(statusCode).json({
    message: message,
    status:status,
    data: data,
  });
};

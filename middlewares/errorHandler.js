class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const logger = require("../logger/winston");

const handleError = (err, req, res, next) => {
  const { statusCode, message, errorCode } = err;
  logger.error(err);

  res.status(statusCode || 500).send({
    exitcode: 1,
    message: statusCode || errorCode ? message : "An error occurred",
    errorCode: true,
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};

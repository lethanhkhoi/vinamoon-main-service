class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const logger = require("../logger/winston");

const handleError = (err, req, res, next) => {
  const { statusCode, message } = err;
  console.log("error");
  logger.error(err);

  res.status(statusCode || 500).send({
    exitcode: 1,
    errorCode: true,
    message: statusCode ? message : "An error occurred",
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};

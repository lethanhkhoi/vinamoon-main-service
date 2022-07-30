const winston = require("winston");
const { combine, timestamp, json, errors, colorize } = winston.format;
const { loggerConstant } = require("../config/constant");

const errorFilter = winston.format((info, opts) => {
  return info.level === "error" ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === "info" ? info : false;
});

const httpFilter = winston.format((info, opts) => {
  return info.level === "http" ? info : false;
});

const logger = winston.createLogger({
  level: "http",
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [
    new winston.transports.File({
      dirname: loggerConstant.LOG_DIR,
      filename: loggerConstant.COMBINED_LOG_FILE,
    }),
    new winston.transports.File({
      dirname: loggerConstant.LOG_DIR,
      filename: loggerConstant.HTTP_LOG_FILE,
      level: "http",
      format: combine(httpFilter(), timestamp(), json()),
    }),
    new winston.transports.File({
      dirname: loggerConstant.LOG_DIR,
      filename: loggerConstant.ERROR_LOG_FILE,
      level: "error",
      format: combine(
        errorFilter(),
        errors({ stack: true }),
        timestamp(),
        json()
      ),
    }),
    new winston.transports.File({
      dirname: loggerConstant.LOG_DIR,
      filename: loggerConstant.INFO_LOG_FILE,
      level: "info",
      format: combine(infoFilter(), timestamp(), json()),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      dirname: loggerConstant.LOG_DIR,
      filename: loggerConstant.EXCEPTION_LOG_FILE,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      dirname: loggerConstant.LOG_DIR,
      filename: loggerConstant.REJECTION_LOG_FILE,
    }),
  ],
});

logger.exitOnError = false;

module.exports = logger;

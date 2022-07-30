require("winston-daily-rotate-file");
const winston = require("winston");
const { combine, timestamp, json, errors, prettyPrint } = winston.format;
const { loggerConstant, config } = require("../config/constant");

const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");

const logtail = new Logtail(config.LOG_TOKEN);

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
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    prettyPrint(),
    json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      dirname: loggerConstant.LOG_DIR,
      filename: "combined-%DATE%.log",
      datePattern: loggerConstant.DATE_PATTERN,
      maxFile: loggerConstant.MAX_FILES,
    }),
    new winston.transports.DailyRotateFile({
      dirname: loggerConstant.LOG_DIR,
      filename: "app-http-%DATE%.log",
      level: "http",
      format: combine(httpFilter(), timestamp(), json()),
    }),
    new winston.transports.DailyRotateFile({
      dirname: loggerConstant.LOG_DIR,
      filename: "app-error-%DATE%.log",
      datePattern: loggerConstant.DATE_PATTERN,
      maxFiles: loggerConstant.MAX_FILES,
      level: "error",
      format: combine(
        errorFilter(),
        errors({ stack: true }),
        timestamp(),
        json()
      ),
    }),
    new winston.transports.DailyRotateFile({
      dirname: loggerConstant.LOG_DIR,
      filename: "app-info-%DATE%.log",
      datePattern: loggerConstant.DATE_PATTERN,
      maxFiles: loggerConstant.MAX_FILES,
      level: "info",
      format: combine(infoFilter(), timestamp(), json()),
    }),
    new LogtailTransport(logtail),
  ],
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({
      dirname: loggerConstant.LOG_DIR,
      datePattern: loggerConstant.DATE_PATTERN,
      maxFiles: loggerConstant.MAX_FILES,
      filename: "exceptions-%DATE%.log",
    }),
  ],
  rejectionHandlers: [
    new winston.transports.DailyRotateFile({
      dirname: loggerConstant.LOG_DIR,
      datePattern: loggerConstant.DATE_PATTERN,
      maxFiles: loggerConstant.MAX_FILES,
      filename: "rejections-%DATE%.log",
    }),
  ],
});

logger.exitOnError = false;

module.exports = logger;

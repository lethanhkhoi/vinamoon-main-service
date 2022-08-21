require("winston-daily-rotate-file");
require("winston-mongodb");
const winston = require("winston");
const { combine, timestamp, json, errors, prettyPrint, metadata } =
  winston.format;
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");
const { loggerConstant, config, database } = require("../config/constant");
const logtail = new Logtail(config.LOG_TOKEN);

const DB_LOG = database.LOG;

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
    new winston.transports.Console(),
    new winston.transports.MongoDB({
      level: "http",
      db: DB_LOG,
      options: {
        useUnifiedTopology: true,
      },
      collection: "main_service_log",
      format: combine(httpFilter(), timestamp(), json(), metadata()),
    }),
    new winston.transports.MongoDB({
      level: "error",
      db: DB_LOG,
      options: {
        useUnifiedTopology: true,
      },
      collection: "error_log",
      format: combine(errorFilter(), timestamp(), json(), metadata()),
    }),
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

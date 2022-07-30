const winston = require("winston");
const { combine, timestamp, json, errors } = winston.format;

// const logger = winston.createLogger({
//   level: "http",
//   format: combine(
//     colorize({ all: true }),
//     timestamp({
//       format: "MMM-DD-YYYY hh:mm:ss",
//     }),
//     printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
//   ),
//   transports: [new winston.transports.Console()],
// });

const errorFilter = winston.format((info, opts) => {
  return info.level === "error" ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === "info" ? info : false;
});

const logger = winston.createLogger({
  level: "http",
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [
    new winston.transports.File({
      dirname: "logs",
      filename: "combined.log",
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "app-error.log",
      level: "error",
      format: combine(errorFilter(), timestamp(), json()),
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "app-info.log",
      level: "info",
      format: combine(infoFilter(), timestamp(), json()),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      dirname: "logs",
      filename: "exception.log",
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      dirname: "logs",
      filename: "rejections.log",
    }),
  ],
});

logger.exitOnError = false;

module.exports = logger;

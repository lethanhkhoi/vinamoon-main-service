require("dotenv").config();

const loggerConstant = {
  LOG_DIR: "logs",
  COMBINED_LOG_FILE: "combined.log",
  HTTP_LOG_FILE: "app-http.log",
  ERROR_LOG_FILE: "app-error.log",
  INFO_LOG_FILE: "app-info.log",
  EXCEPTION_LOG_FILE: "exception.log",
  REJECTION_LOG_FILE: "rejections.log",
};

const config = {
  PORT: process.env.PORT || 3001,
  LOG_TOKEN: process.env.LOG_TOKEN,
};

module.exports = {
  loggerConstant,
  config,
};

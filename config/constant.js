require("dotenv").config();

const loggerConstant = {
  LOG_DIR: "logs",
  DATE_PATTERN: "YYYY-MM-DD",
  MAX_FILES: "14d",
};

const config = {
  PORT: process.env.PORT || 3001,
  LOG_TOKEN: process.env.LOG_TOKEN,
};

module.exports = {
  loggerConstant,
  config,
};

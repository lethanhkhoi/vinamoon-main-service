require("dotenv").config();

const loggerConstant = {
  LOG_DIR: "logs",
  DATE_PATTERN: "YYYY-MM-DD",
  MAX_FILES: "14d",
};

const config = {
  PORT: process.env.PORT || 3001,
  LOG_TOKEN: process.env.LOG_TOKEN,
  DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,

  COULDINARY_CONFIG: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  CLOUDINARY_AVATAR_PATH: "vinamoon/avatar",
};

const requestStatus = {
  NEW: "New",
  PENDING: "Pending",
  ASSIGNED: "Assigned",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
};

const device = {
  MOBILE: "mobile",
  WEB: "web",
};

const role = {
  ADMIN: "admin",
  USER: "user",
  DRIVER: "driver",
  OPERATOR: "operator",
};

module.exports = {
  loggerConstant,
  config,
  requestStatus,
  device,
  role,
};

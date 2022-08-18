const morgan = require("morgan");
const logger = require("../logger/winston");

const morganMiddleware = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      content_length: tokens.res(req, res, "content-length"),
      response_time: Number.parseFloat(tokens["response-time"](req, res)),
    });
  },
  {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        const { method, url, status } = data;
        const logString = `${method} ${url} - Status: ${status}`;
        logger.http(logString, data);
      },
    },
  }
);

module.exports = morganMiddleware;

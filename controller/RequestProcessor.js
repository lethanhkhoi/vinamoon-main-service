class RequestProcessor {
  constructor() {
    this.request = "";
  }
  setStrategy(request) {
    this.request = request;
  }
  create(request) {
    return this.request.create(data);
  }
}

class MobileRequest {
  constructor() {
    this.create = function (data) {
      // calculations...
      return "$45.95";
    };
  }
}

class WebRequest {
  constructor() {
    this.create = function (data) {
      // calculations...
      return "$39.40";
    };
  }
}

module.exports = {
  RequestProcessor,
};

const requestBusCommand = require("./requestBus.js");
const pickingAddressCommand = require("./pickingAddress.js");
const vehicleCommand = require("./vehicle.js");
const smsCommand = require("./sms.js");

const event = [
  requestBusCommand,
  pickingAddressCommand,
  vehicleCommand,
  smsCommand,
];
const controllers = {
  auth: require("../controller/auth.js"),
  requestBus: require("../controller/requestBus.js"),
  pickingAddress: require("../controller/pickingAddress.js"),
  sms: require("../controller/sms.js"),
  vehicle: require("../controller/vehicle"),
};

const middlewares = {
  authentication: controllers.auth.userAuthentication,
};
const bindRouter = (app) => {
  for (let i = 0; i < event.length; i++) {
    for (let j = 0; j < event[i].length; j++) {
      let { name, controller, method, api, middleware } = event[i][j];
      if (!name) {
        throw new NotImplementedException();
      }
      let _middlewares = [];
      middleware.map((e) => {
        _middlewares.push(middlewares[e]);
      });
      if (typeof (controllers[controller] == "function")) {
        app[method](api, ..._middlewares, controllers[controller][name]);
      }
    }
  }
};

module.exports = {
  bindRouter,
};

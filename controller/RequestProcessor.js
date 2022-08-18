const { ErrorHandler } = require("../middlewares/errorHandler");
const pickingAddressCol = require("../dataModel/pickingAddressCol.js");
const requestBusCol = require("../dataModel/requestBusCol.js");
const { requestStatus } = require("../config/constant");

class RequestProcessor {
  constructor() {
    this.request = "";
  }
  setStrategy(request) {
    this.request = request;
  }
  create(data) {
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
    this.create = async function (data) {
      const requestId = data.requestBusId;
      const addressId = data.pickingAddressId;

      let pickingAddress = await pickingAddressCol.getOneByCode(addressId);

      pickingAddress.location = {
        long: data.origin.long,
        lat: data.origin.lat,
      };

      const resultUpdateAddress = await pickingAddressCol.update(
        addressId,
        pickingAddress
      );

      if (!resultUpdateAddress) {
        new ErrorHandler(200, "Cannot update picking address");
      }

      const newStatus = requestStatus.PENDING;

      const resultUpdateRequest = await requestBusCol.findOneAndUpdateStatus(
        requestId,
        newStatus
      );

      if (!resultUpdateRequest) {
        new ErrorHandler(200, "Cannot update request");
      }

      return res.json({ errorCode: null, data: resultUpdateRequest });
    };
  }
}

// function prepareCreateAddress(data) {
//   // const data = req.body;
//   // const address = constructAddressFromWeb(data);
//   // const user = req.user.phone;
//   // return pickingAddress.create(address, user);
// }

// function prepareIncreaseFrequency(data) {
//   // return pickingAddressCol.increaseFrequency(phone);
// }

module.exports = {
  RequestProcessor,
  MobileRequest,
  WebRequest,
};

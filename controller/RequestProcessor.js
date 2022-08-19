const { ErrorHandler } = require("../middlewares/errorHandler");
const pickingAddressCol = require("../dataModel/pickingAddressCol.js");
const requestBusCol = require("../dataModel/requestBusCol.js");
const { requestStatus } = require("../config/constant");
const { getAddress } = require("../utils/googleAPI");
const { dataPagination } = require("../helperFunction/helper");

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
  getPhone(data) {
    return this.request.getPhone(data);
  }
}

class MobileRequest {
  constructor() {
    this.getPhone = function (req) {
      return req.user.phone;
    };

    this.create = async function (data) {
      const address = await getAddress(data.origin.lat, data.origin.long);

      let pickingLocation = {
        id: new ObjectID().toString(),
        homeNo: address[0].long_name,
        street: address[1].long_name,
        district: address[2].long_name,
        ward: "",
        city: address[3].long_name,
        location: data.origin,
        requests: [
          {
            phone: data.user?.phone,
            count: 1,
          },
        ],
      };

      const createAddressResult = await pickingAddressCol.create(
        pickingLocation
      );
      if (!createAddressResult) {
        throw new ErrorHandler(204, "Cannot create picking address");
      }

      const newRequest = {
        id: new ObjectID().toString(),
        phone: data.user?.phone,
        name: data.user?.name,
        vehicleId: data.vehicleId,
        pickingAddress: pickingLocation.id,
        status: requestStatus.PENDING,
        destination: {
          lat: data.destination.lat,
          long: data.destination.long,
        },
      };

      const createRequestResult = await requestBusCol.create(newRequest);
      if (!createRequestResult) {
        throw new ErrorHandler(204, "Cannot create booking request");
      }

      return createRequestResult;
    };
  }
}

class MobileRequestNearest {
  constructor() {
    this.getPhone = function (req) {
      return req.user.phone;
    };

    this.create = async function (data) {
      const newRequest = {
        id: new ObjectID().toString(),
        phone: data.user?.phone,
        name: data.user?.name,
        vehicleId: data.vehicleId,
        pickingAddress: data.pickingAddressId,
        status: requestStatus.PENDING,
        destination: {
          lat: data.destination.lat,
          long: data.destination.long,
        },
      };

      const createRequestResult = await requestBusCol.create(newRequest);
      if (!createRequestResult) {
        throw new ErrorHandler(204, "Cannot create booking request");
      }
      return createRequestResult;
    };
  }
}

class WebRequest {
  constructor() {
    this.getPhone = function (req) {
      return req.body.phone;
    };

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
        throw new ErrorHandler(204, "Cannot update picking address");
      }

      const newStatus = requestStatus.PENDING;

      const resultUpdateRequest = await requestBusCol.findOneAndUpdate(
        requestId,
        { status: newStatus }
      );
      if (!resultUpdateRequest) {
        throw new ErrorHandler(204, "Cannot update request");
      }

      return resultUpdateRequest;
    };
  }
}

module.exports = {
  RequestProcessor,
  MobileRequest,
  MobileRequestNearest,
  WebRequest,
};

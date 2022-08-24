const { ErrorHandler } = require("../middlewares/errorHandler");
const pickingAddressCol = require("../dataModel/pickingAddressCol.js");
const requestBusCol = require("../dataModel/requestBusCol.js");
const { requestStatus, device } = require("../config/constant");
const { getAddress } = require("../utils/googleAPI");
const ObjectID = require("mongodb").ObjectId;
class RequestProcessorStrategy {
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
    this.create = async function (data) {
      const pickingString = await getAddress(data.origin.lat, data.origin.long);
      const desString = await getAddress(
        data.destination.lat,
        data.destination.long
      );

      const price = await requestBusCol.getPrice(
        data.vehicleId,
        data.origin,
        data.destination
      );

      let pickingLocation = {
        id: new ObjectID().toString(),
        address: pickingString,
        location: data.origin,
        requests: [
          {
            phone: data.phone,
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
        phone: data.phone,
        name: data.name,
        vehicleId: data.vehicleId,
        pickingAddress: pickingLocation.id,
        pickingString: pickingString,
        destinationString: desString,
        price: data.price || price,
        device: "mobile",
        status: requestStatus.PENDING,
        destination: {
          lat: data.destination.lat,
          long: data.destination.long,
          address: desString,
        },
      };

      console.log("id", newRequest.id);
      const createRequestResult = await requestBusCol.create(newRequest);

      if (!createRequestResult) {
        throw new ErrorHandler(204, "Cannot create booking request");
      }
      const thisRequest = await requestBusCol.getOne(newRequest.id);

      console.log("this", thisRequest);
      return thisRequest;
    };
  }
}

class MobileRequestNearest {
  constructor() {
    this.create = async function (data) {
      const desString = await getAddress(
        data.destination.lat,
        data.destination.long
      );

      const price = await requestBusCol.getPrice(
        data.vehicleId,
        data.origin,
        data.destination
      );

      const pickingAddressObj = await pickingAddressCol.getOneByCode(
        data.pickingAddressId
      );

      const newRequest = {
        id: new ObjectID().toString(),
        phone: data.phone,
        name: data.name,
        vehicleId: data.vehicleId,
        pickingAddress: data.pickingAddressId,
        status: requestStatus.PENDING,
        price: data.price || price || 0,
        device: "mobile",
        destinationString: desString,
        pickingString: pickingAddressObj.address,
        destination: {
          lat: data.destination.lat,
          long: data.destination.long,
          address: desString,
        },
      };

      const createRequestResult = await requestBusCol.create(newRequest);
      if (!createRequestResult) {
        throw new ErrorHandler(204, "Cannot create booking request");
      }

      const thisRequest = await requestBusCol.getOne(newRequest.id);
      return thisRequest;
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
        throw new ErrorHandler(204, "Cannot update picking address");
      }

      const newStatus = requestStatus.PENDING;

      const resultUpdateRequest = await requestBusCol.findOneAndUpdate(
        requestId,
        {
          status: newStatus,
        }
      );

      if (!resultUpdateRequest) {
        throw new ErrorHandler(204, "Cannot update request");
      }

      const thisRequest = await requestBusCol.getOne(requestId);
      return thisRequest;
    };
  }
}

module.exports = {
  RequestProcessorStrategy,
  MobileRequest,
  MobileRequestNearest,
  WebRequest,
};

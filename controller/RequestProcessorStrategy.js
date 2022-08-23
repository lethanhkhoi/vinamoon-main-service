const { ErrorHandler } = require("../middlewares/errorHandler");
const pickingAddressCol = require("../dataModel/pickingAddressCol.js");
const requestBusCol = require("../dataModel/requestBusCol.js");
const { requestStatus } = require("../config/constant");
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
      // const pickingString = await getAddress(data.origin.lat, data.origin.long);
      // const desString = await getAddress(
      //   data.destination.lat,
      //   data.destination.long
      // );
      // const nicePickingString = `${pickingString[0].long_name} ${pickingString[1].long_name}, ${pickingString[2].long_name}, Hồ Chí Minh`;
      // const niceDesString = `${desString[0].long_name} ${desString[1].long_name}, ${desString[2].long_name}, Hồ Chí Minh`;

      const price = await requestBusCol.getAddressPrice(
        data.vehicleId,
        data.origin,
        data.destination
      );

      let pickingLocation = {
        id: new ObjectID().toString(),
        homeNo: pickingString[0].long_name,
        street: pickingString[1].long_name,
        district: pickingString[2].long_name,
        ward: "",
        city: pickingString[3].long_name,
        location: data.origin,
        price: price || 0,
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
        // pickingString: nicePickingString,
        // destinationString: niceDesString,
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
      const thisRequest = await requestBusCol.getOne(newRequest.id);
      return thisRequest;
    };
  }
}

class MobileRequestNearest {
  constructor() {
    this.create = async function (data) {
      // const desString = await getAddress(
      //   data.destination.lat,
      //   data.destination.long
      // );
      // const niceDesString = `${desString[0].long_name} ${desString[1].long_name}, ${desString[2].long_name}, Hồ Chí Minh`;

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
        price: price || 0,
        // destinationString: niceDesString,
        pickingString: pickingAddressObj.address,
        destination: {
          lat: data.destination.lat,
          long: data.destination.long,
          // address: niceDesString,
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
        { status: newStatus }
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

const cron = require("node-cron");
const { requestStatus } = require("../config/constant");
const requestBusCol = require("../dataModel/requestBusCol");
const requestLogCol = require("../dataModel/requestLogCol");
const { ErrorHandler } = require("../middlewares/errorHandler");

const busLogDataTransfer = cron.schedule("* * * *", async () => {
  //every 1h
  try {
    const doneRequests = await requestBusCol.getAllDone();
    if (!doneRequests) {
      throw new ErrorHandler(204, "Cannot get all done requests");
    }

    if (doneRequests.length > 0) {
      await requestLogCol.insertMany(doneRequests);
      await requestBusCol.deleteMany({ status: requestStatus.DONE });
    }
  } catch (error) {
    console.log(error);
    throw new ErrorHandler(500, error.message);
  }
  // console.log("cron job is running");
});

module.exports = busLogDataTransfer;

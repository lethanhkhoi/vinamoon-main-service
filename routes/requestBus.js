commands = [
  {
    name: "getAll",
    controller: "requestBus",
    method: "get",
    api: "/requestBus",
    middleware: ["authentication"],
  },
  {
    name: "getOneByUser",
    controller: "requestBus",
    method: "get",
    api: "/requestBus/user/:code",
    middleware: [],
  },
  {
    name: "getOne",
    controller: "requestBus",
    method: "get",
    api: "/requestBus/:code",
    middleware: ["authentication"],
  },
  {
    name: "createFromWeb",
    controller: "requestBus",
    method: "post",
    api: "/requestBus",
    middleware: ["authentication"],
  },
  {
    name: "create",
    controller: "requestBus",
    method: "post",
    api: "/createRequest",
    middleware: ["authentication"],
  },
];
module.exports = commands;

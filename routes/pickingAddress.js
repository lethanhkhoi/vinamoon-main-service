commands = [
  {
    name: "getOne",
    controller: "pickingAddress",
    method: "get",
    api: "/address/:code",
    middleware: [],
  },
  {
    name: "getAll",
    controller: "pickingAddress",
    method: "get",
    api: "/address",
    middleware: [],
  },
  {
    name: "getFrequency",
    controller: "pickingAddress",
    method: "post",
    api: "/frequency",
    middleware: [],
  },
];
module.exports = commands;

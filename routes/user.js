commands = [
  {
    name: "getAll",
    controller: "user",
    method: "get",
    api: "/users",
    middleware: ["authentication"],
  },
  {
    name: "update",
    controller: "user",
    method: "patch",
    api: "/user",
    middleware: ["authentication"],
  },
  {
    name: "create",
    controller: "user",
    method: "post",
    api: "/user",
    middleware: ["authentication"],
  },
];
module.exports = commands;

commands = [
  // {
  //   name: "getOne",
  //   controller: "pickingAddress",
  //   method: "get",
  //   api: "/address/:code",
  //   middleware: [],
  // },
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
];
module.exports = commands;

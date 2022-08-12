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
    middleware: [],
  },
];
module.exports = commands;

"use strict";

var _app = require("./infrastructure/config/app");
var _db = require("./infrastructure/config/db");
var _http = _interopRequireDefault(require("http"));
var _socketIO = require("./infrastructure/config/socketIO");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var PORT = process.env.PORT || 3000;
var app = (0, _app.createServer)();
(0, _db.mongoConnect)().then(function () {
  if (app) {
    var server = _http["default"].createServer(app);
    (0, _socketIO.setupSocketIO)(server);
    server.listen(PORT, function () {
      return console.log("Listening to PORT ".concat(PORT));
    });
    server.on("error", function (error) {
      if (error.code === "EADDRINUSE") {
        console.error("Port ".concat(PORT, " is already in use. Please choose a different port."));
      } else {
        console.error("Error starting server:", error);
      }
    });
  } else {
    throw Error("App is undefined");
  }
})["catch"](function (err) {
  return console.error("Error while connecting to database:", err);
});
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createServer = void 0;
var _express = _interopRequireDefault(require("express"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _cors = _interopRequireDefault(require("cors"));
var _path = _interopRequireDefault(require("path"));
var _adminRouter = _interopRequireDefault(require("../router/adminRouter"));
var _userRouter = _interopRequireDefault(require("../router/userRouter"));
var _tokenRouter = _interopRequireDefault(require("../router/tokenRouter"));
var _controllers = require("../../providers/controllers");
var _nodeCron = _interopRequireDefault(require("node-cron"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_dotenv["default"].config();
var createServer = exports.createServer = function createServer() {
  try {
    var app = (0, _express["default"])();
    app.use(_express["default"].json());
    app.use(_express["default"].urlencoded({
      extended: true
    }));
    app.use("/images", _express["default"]["static"](_path["default"].join(__dirname, "../../../images")));
    app.use((0, _cors["default"])({
      credentials: true,
      origin: process.env.CORS_URI
    }));
    _nodeCron["default"].schedule("* * * * *", function () {
      _controllers.postUseCase.PostRemovalJob().then(function (result) {
        console.log(result);
      })["catch"](function (error) {
        console.error(error);
      });
    });
    app.use("/api/admin", _adminRouter["default"]);
    app.use("/api/user", _userRouter["default"]);
    app.use("/api/token", _tokenRouter["default"]);
    return app;
  } catch (error) {
    var err = error;
    console.log(err.message);
  }
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _controllers = require("../../providers/controllers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var adminRouter = _express["default"].Router();
adminRouter.post("/login", function (req, res) {
  return _controllers.aController.adminLogin(req, res);
});
adminRouter.get("/users", function (req, res) {
  return _controllers.aController.getAllUsers(req, res);
});
adminRouter.get("/reports", function (req, res) {
  return _controllers.aController.getAllPostReports(req, res);
});
adminRouter.patch("/reports/resolve/:reportId", function (req, res) {
  return _controllers.aController.resolveReport(req, res);
});
adminRouter.patch("/users/block/:userId", function (req, res) {
  return _controllers.aController.blockUser(req, res);
});
adminRouter.get("/newUserPerMonth", function (req, res) {
  return _controllers.aController.newUserPerMonth(req, res);
});
adminRouter.get("/newuserperyear", function (req, res) {
  return _controllers.aController.newUserperYear(req, res);
});
adminRouter.get("/postpermonth", function (req, res) {
  return _controllers.aController.postMatrixMonth(req, res);
});
adminRouter.get("/admincards", function (req, res) {
  return _controllers.aController.adminCards(req, res);
});
var _default = exports["default"] = adminRouter;
const app = require("express").Router();
const isAuth = require("../config/isAuth");
const requestsControllers = require("../controllers/leavingRequests.controllers");

app.post(
  "/applyLeaveRequest",
  isAuth(),
  requestsControllers.applyLeaveRequest
);
app.get("/getLeaveRequest", isAuth(), requestsControllers.getLeaveRequest);

module.exports = app;

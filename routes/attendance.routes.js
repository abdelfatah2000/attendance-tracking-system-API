const app = require("express").Router();
const isAuth = require("../config/isAuth");
const attendanceControllers = require("../controllers/attendance.controllers");

app.post("/clockIn", isAuth(), attendanceControllers.clockIn);
app.post("/clockOut", isAuth(), attendanceControllers.clockOut);
app.get("/getAttendance", isAuth(), attendanceControllers.getUserAttendance);

module.exports = app;
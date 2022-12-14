const express = require("express");
const app = express();
const connection = require("./config/db");
const Attendance = require("./models/attendance.model");
const User = require("./models/user.model");
const cron = require("node-cron");
const logger = require('morgan')
require("dotenv").config();

connection();

app.use(logger('dev'));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const route = require("./routes/user.routes");
const attendanceRoute = require("./routes/attendance.routes");
const requestRoute = require("./routes/leavingRequests.routes");
const departmentRoute = require("./routes/department.routes");

app.use(departmentRoute);
app.use(route);
app.use(attendanceRoute);
app.use(requestRoute);

cron.schedule("59 23 * * *", async () => {
  const user = await User.find({ role: "Employee" }).select("_id department");
  const today = new Date().toISOString().split("T")[0];
  for (let id of user) {
    const attendance = await Attendance.find({
      user: id._id,
      check_in: { $gte: today },
      check_out: { $lte: new Date(today + "T23:00:00.000Z") },
    });
    console.log(attendance);
    if (attendance.length < 1) {
      const newAttendance = new Attendance({
        user: id._id,
        department: id.department,
        present: false,
      });
      await newAttendance.save();
    }
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});

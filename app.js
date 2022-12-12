const express = require("express");
const app = express();
const connection = require("./config/db");
const Attendance = require("./models/attendance.model");
const cron = require("node-cron");
require("dotenv").config();

connection();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const route = require("./routes/user.routes");
app.use(route);

cron.schedule("0 23 * * *", async () => {
  const today = new Date().toISOString().split("T")[0];
  const attendance = await Attendance.find({
    user: req.user.id,
    department: req.user.department,
    check_in: { $gte: today },
    check_out: { $lte: new Date(today + "T23:00:00.000Z") },
  });
  if (!attendance) {
    const newAttendance = new Attendance({
      user: req.user.id,
      department: req.user.department,
      present: false,
    });
    await newAttendance.save();
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});

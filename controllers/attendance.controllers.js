const Attendance = require("../models/attendance.model");
const { StatusCodes } = require("http-status-codes");

const clockIn = async (req, res, next) => {
  try {
    const attendance = new Attendance({
      user: req.user.id,
      department: req.user.department,
      check_in: new Date(),
      present: true,
    });
    await attendance.save();
    res.status(StatusCodes.CREATED).json({ message: "Clocked In" });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please try again", error });
  }
};

const clockOut = async (req, res, next) => {
  try {
    const now = new Date();
    const today = new Date(now.toISOString().split("T")[0]);
    const attendance = await Attendance.findOne({
      user: req.user.id,
      check_in: { $gte: today },
    });
    attendance.check_out = now;
    attendance.working_hour = Math.floor(
      (attendance.check_in - now) / (1000 * 60 * 60)
    );
    await attendance.save();
    res.status(StatusCodes.CREATED).json({ message: "Clocked Out" });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please try again", error });
  }
};

const getUserAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find({ user: req.user.id });
    res.status(StatusCodes.OK).json({ attendance });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please try again", error });
  }
};

module.exports = {
  clockIn,
  clockOut,
  getUserAttendance,
};

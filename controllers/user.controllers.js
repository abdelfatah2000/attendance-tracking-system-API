const User = require("../models/user.model");
const Attendance = require("../models/attendance.model");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

//registeraion
const register = async (req, res) => {
  try {
    const { username, email, phone, password, department } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "This Email is already used" });
    } else {
      const userData = new User({
        username: username,
        email,
        password,
        phone,
        role: "Employee",
        department: department,
      });
      await userData.save();
      res.status(StatusCodes.CREATED).json({ message: "Done" });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Your request could not be processed. Please try again.",
      error,
    });
  }
};
//update user data
const updateUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(
    { _id: id },
    {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    }
  );
  res.send("updated!!");
};
//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          email: user.email,
          department: user.department,
        },
        process.env.JWT_SCERETKEY
      );
      res.status(StatusCodes.OK).json({ message: "Login Successfully", token });
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid email or password" });
    }
  } else {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid email or password" });
  }
};
//checkin

const getUser = async (req, res, next) => {
  try {
    const userData = await User.findOne({ _id: req.user._id }).select(
      "username email phone"
    );
    res.status(StatusCodes.OK).json({ userData });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please try again", error });
  }
};

module.exports = { register, updateUser, loginUser, getUser };

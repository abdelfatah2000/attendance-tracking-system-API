const User = require("../models/user.model");
const Attendance = require("../models/attendance.model");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

//registeraion
const register = async (req, res) => {
  const { username, email, phone, password } = req.body;
  bcrypt.hash(password, Number(process.env.SALTROUNDS), async (err, hash) => {
    await User.insertMany({
      username: `${username}`,
      email: `${email}`,
      phone: `${phone}`,
      password: `${hash}`,
    })
      .then((da) => res.status(StatusCodes.CREATED).send("done!!"))
      .catch((err) => res.status(StatusCodes.BAD_REQUEST).send(err));
  });
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
    const userData = await User.findOne({ _id: req.user._id }).select("username email phone");
    res.status(StatusCodes.OK).json({ userData });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please try again", error });
  }
};


module.exports = { register, updateUser, loginUser,  getUser };

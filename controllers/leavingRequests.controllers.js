const LeavingRequest = require("../models/leavingRequests.model");
const { StatusCodes } = require("http-status-codes");

const applyLeaveRequest = async (req, res) => {
  try {
    const leavingRequest = new LeavingRequest({
      user: req.user.id,
      department: req.user.department,
      reason: req.body.reason,
    });
    await leavingRequest.save();
    res.status(StatusCodes.ACCEPTED).json({ message: "Request is sent" });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please try again", error });
  }
};
const getLeaveRequest = async (req, res) => {
  try {
    const data = await LeavingRequest.find({
      user: req.user.id,
      department: req.user.department,
    });
    res.status(StatusCodes.ACCEPTED).json({ data });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please try again", error });
  }
};

module.exports = {
  getLeaveRequest,
  applyLeaveRequest,
};

const Department = require("../models/department.model");
const { StatusCodes } = require("http-status-codes");
const getDepartment = async (req, res) => {
  try {
    const department = await Department.find({}).select("_id title");
    res.status(StatusCodes.OK).json({ department });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Your request could not be processed. Please try again.",
      error,
    });
  }
};

module.exports = {
  getDepartment,
};

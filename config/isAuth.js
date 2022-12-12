const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

module.exports = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SCERETKEY);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
    }
  };
};
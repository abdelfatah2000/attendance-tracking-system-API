const app = require("express").Router();
const isAuth = require("../config/isAuth");
const userController = require("../controllers/user.controllers");
const { check, body } = require("express-validator");

//registeration
app.post(
  "/register",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  userController.register
);
//update user data
app.put("/updateUser/:id", isAuth(), userController.updateUser);
//login
app.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password", "Password has to be valid.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  userController.loginUser
);
//checkin
app.get("/userData", isAuth(), userController.getUser);
module.exports = app;

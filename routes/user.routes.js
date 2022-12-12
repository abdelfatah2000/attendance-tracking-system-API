const app = require("express").Router();
const isAuth = require("../config/isAuth");
const userController = require("../controllers/user.controllers");

//registeration
app.post("/register", userController.register);
//update user data
app.put("/updateUser/:id", isAuth(), userController.updateUser);
//login
app.post("/login", userController.loginUser);
//checkin
app.post("/userData", isAuth(), userController.getUser);
module.exports = app;

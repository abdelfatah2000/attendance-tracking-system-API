const app = require("express").Router();
const isAuth = require("../config/isAuth");
const departmentControllers = require("../controllers/department.controllers");

app.get("/getDepartment", isAuth(), departmentControllers.getDepartment);

module.exports = app;

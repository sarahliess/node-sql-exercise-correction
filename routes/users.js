const express = require("express");
const user = express.Router();
//import controllers
const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  getUserOrders,
  handleActivity,
} = require("../controllers/users");

user.route("/").get(getAllUsers).post(createUser);

user.route("/:id").get(getSingleUser).put(updateUser).delete(deleteUser);

user.get("/:id/orders", getUserOrders);

user.get("/:id/check-inactive", handleActivity);

module.exports = user;

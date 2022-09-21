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
//import middleware
const { checkUserAuth } = require("../middlewares/auth");

//MIDDLEWARE that checks user permissions
// user.use((req, res, next) => {
//   console.log(req.query.auth);
//   if (req.query.auth === "youshallpass") {
//     //next: request will go into controllers
//     next();
//   } else {
//     //401 unauthorized (wir kennen den User gar nicht)
//     //403 forbidden (Identität ist bekannt aber kein Zugriffsrecht)
//     res.status(401).send("You shall not pass!");
//   }
// });

//REUSABLE MIDDLEWARE
// user.use(checkUserAuth);

user.route("/").get(checkUserAuth, getAllUsers).post(createUser);

user.route("/:id").get(getSingleUser).put(updateUser).delete(deleteUser);

user.get("/:id/orders", getUserOrders);

user.get("/:id/check-inactive", handleActivity);

module.exports = user;

const express = require("express");
const orders = express.Router();
const pool = require("../db");
//import controllers
const {
  getAllOrders,
  createOrder,
  getSingleOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orders");

orders.route("/").get(getAllOrders).post(createOrder);

orders.route("/:id").get(getSingleOrder).put(updateOrder).delete(deleteOrder);

module.exports = orders;

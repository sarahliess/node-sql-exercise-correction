const pool = require("../db");
const { body, validationResult } = require("express-validator");

////GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const { rows: allOrders, rowCount } = await pool.query(
      "SELECT * FROM orders;"
    );
    console.log("all orders", allOrders);
    if (!rowCount) return res.status(404).send("No orders found");
    return res.status(200).json(allOrders);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

////CREATE ONE ORDER
const createOrder = async (req, res) => {
  const { price, date, user_id } = req.body;
  try {
    const {
      rows: [newOrder],
    } = await pool.query(
      "INSERT INTO orders (price, date, user_id) VALUES ($1, $2, $3) RETURNING *;",
      [price, date, user_id]
    );
    console.log("new order", newOrder);
    return res.status(200).json(newOrder);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

////GET SINGLE ORDER
const getSingleOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      rows: [order],
    } = await pool.query("SELECT * FROM orders WHERE id=$1", [id]);
    return res.status(200).json(order);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

////UPDATE ORDER
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { price, date, user_id } = req.body;
  try {
    const {
      rows: [updatedOrder],
      rowCount,
    } = await pool.query(
      "UPDATE orders SET price = $1, date = $2, user_id = $3 WHERE id = $4 RETURNING *;",
      [price, date, user_id, id]
    );
    if (!rowCount)
      return res
        .status(400)
        .send(
          `The order with the id ${id} does not exist and cannot be edited.`
        );
    return res.status(201).json(updatedOrder);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

////DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rows: [deletedOrder],
      rowCount,
    } = await pool.query("DELETE FROM orders WHERE id = $1 RETURNING *;", [id]);
    console.log("deleted", deletedOrder);
    if (!rowCount)
      return res
        .status(400)
        .send(
          `The order with the id ${id} does not exist and cannot be deleted.`
        );
    return res
      .status(200)
      .send(`The order with the id ${id} has been deleted.`);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};

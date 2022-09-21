const pool = require("../db");

////GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const { rowCount, rows: allUsers } = await pool.query(
      "SELECT * FROM users;"
    );
    console.log("all users", allUsers);
    if (!rowCount) return res.status(404).send("No users found");
    res.status(200).json(allUsers);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

////CREATE ONE USER
const createUser = async (req, res) => {
  const { first_name, last_name, age, active } = req.body;
  try {
    const {
      rows: [newUser],
    } = await pool.query(
      "INSERT INTO users (first_name, last_name, age, active ) VALUES ($1, $2, $3, $4) RETURNING *;",
      [first_name, last_name, age, active]
    );
    console.log("new user", newUser);
    if (!first_name || !last_name || !age || !active) {
      return res.status(400).send("Please fill in all the data needed");
    }
    return res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

////GET SINGLE USER
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      rows: [user],
      rowCount,
    } = await pool.query("SELECT * FROM users WHERE id = $1;", [id]);
    //   console.log("user", user);
    if (!rowCount) {
      return res.status(400).send(`Could not find any user with the id ${id}.`);
    }
    console.log("rowCount", rowCount);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

////UPDATE USER
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, active } = req.body;
  try {
    //rowCount returns one if you have a match (because of RETURNING *)
    const {
      rows: [updatedUser],
      rowCount,
    } = await pool.query(
      "UPDATE users SET first_name = $1, last_name = $2, age = $3, active = $4 WHERE id = $5 RETURNING *;",
      [first_name, last_name, age, active, id]
    );
    console.log("updated user", updatedUser);
    if (!rowCount)
      return res.status(400).send(`No user with the id ${id} found`);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

////DELETE USER
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      rows: [deletedUser],
      rowCount,
    } = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *;", [id]);
    console.log("deleted user", deletedUser);
    if (!rowCount)
      return res.status(400).send(`No user with the id ${id} found`);
    res.status(200).send(`The user ${deletedUser.first_name} has been deleted`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

////GET ONE USER + THEIR ORDERS
const getUserOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: userOrders, rowCount } = await pool.query(
      "SELECT users.id AS userid, first_name, last_name, age, active, orders.id AS orderid, price FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE users.id=$1;",
      [id]
    );
    if (!rowCount)
      return res.status(400).send(`No user with the id ${id} found`);
    return res.status(200).json(userOrders);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

////CHECK IF USER HAS ORDERS
const handleActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: userOrders, rowCount } = await pool.query(
      "SELECT users.id AS userid, first_name, last_name, age, active, orders.id AS orderid, price FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE users.id=$1;",
      [id]
    );
    if (!rowCount)
      return res.status(400).send(`No user with the id ${id} found.`);

    //if user did not order yet, send PUT request to DB and change active status to false
    if (!userOrders[0].orderid) {
      console.log("here", userOrders);
      const {
        rows: [changedStatus],
      } = await pool.query(
        "UPDATE users SET active = $1 WHERE id = $2 RETURNING *;",
        [false, id]
      );
      console.log(changedStatus);
      return res.send(
        "The user has not ordered before and will now have the status inactive"
      );
    }
    console.log(userOrders);
    return res
      .status(200)
      .send(
        `The user ${userOrders[0].first_name} has ordered before. In total ${userOrders.length} times. Their status is active.`
      );
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  getUserOrders,
  handleActivity,
};

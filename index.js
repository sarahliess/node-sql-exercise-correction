//top level
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const pool = require("./db");
const cors = require("cors");
//routes import
const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");

//parse the body of any request coming from html forms
app.use(express.urlencoded({ extended: true }));

//parse the body of any request not coming through an html form
app.use(express.json());

//allow CORS from any origin
app.use(cors());

//INITIAL ROUTE
app.get("/", (req, res) => {
  res.send("Connect your NodeJS application with SQL");
});

//ROUTES
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

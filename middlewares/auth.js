const checkUserAuth = (req, res, next) => {
  console.log(req.query.auth);
  if (req.query.auth === "youshallpass") {
    //next: request will go into controllers
    console.log("next", next);
    next();
  } else {
    //401 unauthorized (wir kennen den User gar nicht)
    //403 forbidden (Identität ist bekannt aber kein Zugriffsrecht)
    res.status(401).send("You shall not pass!");
  }
};

module.exports = {
  checkUserAuth,
};

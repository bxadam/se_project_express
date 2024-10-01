const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { "postman-token": authorization } = req.headers;
  console.log(authorization);

  // if (!authorization || !authorization.startsWith("Bearer ")) {
  //   return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  // }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log(payload);
  } catch (err) {
    return res.status(401).send({ message: "Authorization Required" });
  }
  req.user = payload;
  next();
};

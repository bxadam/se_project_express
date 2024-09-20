const User = require("../models/user");
const { NOT_FOUND, DEFAULT, BAD_REQUEST } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find()
    .then((data) => res.send({ data }))
    .catch((e) => {
      console.log(e.name);
      return res
        .status(DEFAULT)
        .send({ message: "Server Error from getUsers" });
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((data) => {
      if (data === null) {
        return res
          .status(NOT_FOUND)
          .send({ message: "NOT_FOUND no data found" });
      }
      return res.send({ data });
    })
    .catch((e) => {
      console.log(e.name);
      if (e.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "BAD_REQUEST Error from getUserById" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "500 Error from getUserById" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      console.log(e);
      if (e.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Validation Error from createUser" });
      }
      return res.status(BAD_REQUEST).send({ message: "Error from createUser" });
    });
};

module.exports = { getUsers, getUserById, createUser };

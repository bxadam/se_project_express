const User = require("../models/user");
const { findError } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find()
    .orFail()
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      console.log(e.name);
      console.error(e);
      res.status(500).send({ message: "Error from getUser" });
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((data) => {
      if (!data) {
        res.send({ message: "no data found" });
      }
      res.send({ data });
    })
    .catch((e) => {
      console.error(e);
      res.status(404).send({ message: "Error from getUserById" });
      res.status(400).send({ message: "Error from getUserById" });
    });
};

const createUser = (req, res) => {
  const userInfo = req.body;
  User.create(userInfo)
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      console.error(e);
      res.status(400).send({ message: "Error from createUser" });
    });
};

module.exports = { getUsers, getUserById, createUser };
